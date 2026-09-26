import { pbkdf2Sync } from 'node:crypto';
import { DeleteCommand, GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { describe, expect, it } from 'vitest';
import { createApp } from './app.js';
import { apiContracts, apiInventory } from '@triviamap/contracts';

describe('API health endpoint', () => {
  it('returns service status', async () => {
    const response = await createApp().request('/health');
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, service: 'triviamap-api' });
  });
});

describe('guess area compatibility', () => {
  it('preserves the legacy park root and validates the request body', async () => {
    const app = createApp();
    const response = await app.request('/guess-area', { method: 'POST', body: JSON.stringify({ lat: 0, lng: 0, park: 'L' }), headers: { 'content-type': 'application/json' } });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ areaNames: ['ランド'] });
    expect((await app.request('/guess-area', { method: 'POST', body: '{}', headers: { 'content-type': 'application/json' } })).status).toBe(400);
  });
});

describe('legacy API inventory', () => {
  it('registers every frontend contract route and method', () => {
    const normalize = (path: string) => path.replace(/:[^/]+/g, ':param').replace(/\/$/, '');
    const routes = createApp().routes.map((route) => `${route.method.toUpperCase()} ${normalize(route.path)}`);
    for (const [method, path] of apiInventory) {
      expect(routes).toContain(`${method} ${normalize(path)}`);
    }
  });

  it('has a Zod request and status-response contract for every inventory route', () => {
    expect(apiContracts).toHaveLength(apiInventory.length);
    for (const contract of apiContracts) {
      expect(contract.request).toHaveProperty('safeParse');
      expect(contract.responses[200]).toHaveProperty('safeParse');
      expect(contract.responses[400]).toHaveProperty('safeParse');
      expect(contract.responses[404]).toHaveProperty('safeParse');
    }
  });
});

class MemoryDynamo {
  readonly tables = new Map<string, Map<string, Record<string, unknown>>>();
  private table(name: string) { if (!this.tables.has(name)) this.tables.set(name, new Map()); return this.tables.get(name)!; }
  async send(command: GetCommand | PutCommand | DeleteCommand | ScanCommand) {
    const input = command.input as { TableName: string; Key?: { id: string }; Item?: Record<string, unknown>; ConditionExpression?: string };
    const table = this.table(input.TableName);
    if (command instanceof ScanCommand) return { Items: [...table.values()] };
    if (command instanceof GetCommand) return { Item: table.get(input.Key!.id) };
    if (command instanceof DeleteCommand) { table.delete(input.Key!.id); return {}; }
    const id = String(input.Item!.id);
    if (input.ConditionExpression && table.has(id)) { const error = new Error('duplicate'); error.name = 'ConditionalCheckFailedException'; throw error; }
    table.set(id, input.Item!); return {};
  }
}

describe('injected API dependencies', () => {
  const ddb = new MemoryDynamo();
  const sent: Array<{ to: string }> = [];
  const userPassword = `pbkdf2_sha256$1000$salt$${pbkdf2Sync('password', 'salt', 1000, 32, 'sha256').toString('base64')}`;
  const request = async (path: string, init: RequestInit = {}) => {
    process.env.JWT_SECRET = 'test-signing-key'; process.env.GOOD_SALT = 'test-good-salt'; process.env.FRONTEND_ORIGIN = 'https://stg.triviamap.jp'; process.env.MAIL_SECRET_ARN = 'mail';
    const app = createApp({
      ddb: ddb as unknown as import('@aws-sdk/lib-dynamodb').DynamoDBDocumentClient,
      secrets: { send: async (command: GetSecretValueCommand) => command.input.SecretId === 'mail' ? { SecretString: JSON.stringify({ allowedRecipients: 'allowed@example.test', smtpHost: 'example.test', smtpUser: 'mailer@example.test', smtpPassword: 'not-used', inquiryRecipient: 'allowed@example.test' }) } : { SecretString: '{}' } } as unknown as SecretsManagerClient,
      sendMail: async (message) => { sent.push({ to: message.to }); },
      twitterRequest: async () => { throw new Error('upstream detail must not escape'); },
    });
    return app.request(path, init);
  };

  it('suppresses non-allowlisted registration and password mail without revealing recipients', async () => {
    const users = ddb.tables.get('TriviaMap-stg-v2-Users') ?? new Map();
    users.set('9', { id: '9', entity: 'User', userId: '9', email: 'blocked@example.test', nickname: 'blocked', password: userPassword, isActive: true });
    ddb.tables.set('TriviaMap-stg-v2-Users', users);
    const registration = await request('/auths/registration/', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'blocked@example.test', nickname: 'new-user', password1: 'password123', password2: 'password123' }) });
    expect(registration.status).toBe(400);
    expect(sent).toEqual([]);
    const reset = await request('/auths/password/reset/', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'blocked@example.test' }) });
    expect(reset.status).toBe(200);
    expect(await reset.json()).toEqual({});
    expect(sent).toEqual([]);
  });

  it('rolls back a new account when verification mail delivery fails', async () => {
    process.env.JWT_SECRET = 'test-signing-key'; process.env.FRONTEND_ORIGIN = 'https://stg.triviamap.jp'; process.env.MAIL_SECRET_ARN = 'mail';
    const failureDdb = new MemoryDynamo();
    const app = createApp({
      ddb: failureDdb as unknown as import('@aws-sdk/lib-dynamodb').DynamoDBDocumentClient,
      secrets: { send: async () => ({ SecretString: JSON.stringify({ allowedRecipients: 'allowed@example.test', smtpHost: 'example.test', smtpUser: 'mailer@example.test', smtpPassword: 'not-used' }) }) } as unknown as SecretsManagerClient,
      sendMail: async () => { throw new Error('SMTP failure'); },
    });
    const response = await app.request('/auths/registration/', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'allowed@example.test', nickname: 'new-user', password1: 'password123', password2: 'password123' }) });
    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({ detail: 'Registration could not be completed.' });
    expect(failureDdb.tables.get('TriviaMap-stg-v2-Users')?.size ?? 0).toBe(0);
    expect(failureDdb.tables.get('TriviaMap-stg-v2-AuthTokens')?.size ?? 0).toBe(0);
  });

  it('rehashes a Django password after login and requires a matching CSRF origin for refresh', async () => {
    const login = await request('/auths/login/', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'blocked@example.test', password: 'password' }) });
    expect(login.status).toBe(200);
    expect(String(ddb.tables.get('TriviaMap-stg-v2-Users')!.get('9')!.password)).toMatch(/^scrypt\$/);
    const csrf = await request('/auths/csrf/');
    const csrfToken = (await csrf.json() as { csrfToken: string }).csrfToken;
    const bad = await request('/auths/token/refresh/', { method: 'POST', headers: { cookie: `trivia-map-csrf=${csrfToken}`, 'x-csrf-token': csrfToken, origin: 'https://attacker.invalid' } });
    expect(bad.status).toBe(403);
  });

  it('returns a generic upstream failure for X OAuth adapters', async () => {
    const response = await request('/auths/twitter/request-token', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({ detail: 'Twitter authorization could not be started.' });
  });

  it('returns same-origin API pagination URLs while preserving filters', async () => {
    const markers = ddb.tables.get('TriviaMap-stg-v2-Markers') ?? new Map();
    markers.set('pagination-1', { id: 'pagination-1', entity: 'Marker', markerId: 'pagination-1', park: 'S', lat: 35.6, lng: 139.8 });
    markers.set('pagination-2', { id: 'pagination-2', entity: 'Marker', markerId: 'pagination-2', park: 'S', lat: 35.7, lng: 139.9 });
    ddb.tables.set('TriviaMap-stg-v2-Markers', markers);
    const response = await request('/markers/S?limit=1');
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ nextUrl: '/api/markers/S?limit=1&page=2', previousUrl: null });
  });
});
