import { pbkdf2Sync } from 'node:crypto';
import { CreateTableCommand, DynamoDBClient, ResourceInUseException } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from './app.js';

const endpoint = process.env.DYNAMODB_LOCAL_ENDPOINT;
const suffix = `${Date.now()}`;
const tables = Object.fromEntries(['USERS', 'ARTICLES', 'MARKERS', 'LIKES', 'GOODS', 'SPECIALMAPS', 'SPECIALMAPMARKERS', 'SESSIONS', 'AUTHTOKENS'].map((key) => [key, `TriviaMapApiIntegration-${suffix}-${key}`]));
const client = new DynamoDBClient({ region: 'ap-northeast-1', endpoint, credentials: { accessKeyId: 'local', secretAccessKey: 'local' } });
const ddb = DynamoDBDocumentClient.from(client);
const djangoPassword = `pbkdf2_sha256$1000$salt$${pbkdf2Sync('password', 'salt', 1000, 32, 'sha256').toString('base64')}`;

describe.skipIf(!endpoint)('DynamoDB Local API integration', () => {
  beforeAll(async () => {
    Object.entries(tables).forEach(([key, value]) => { process.env[`TABLE_${key}`] = value; });
    Object.assign(process.env, { JWT_SECRET: 'integration-signing-key', GOOD_SALT: 'integration-good-salt', FRONTEND_ORIGIN: 'https://stg.triviamap.jp', MAIL_SECRET_ARN: 'mail' });
    for (const tableName of Object.values(tables)) { try { await client.send(new CreateTableCommand({ TableName: tableName, BillingMode: 'PAY_PER_REQUEST', AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }], KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }] })); } catch (error) { if (!(error instanceof ResourceInUseException)) throw error; } }
    const put = (tableName: string, Item: Record<string, unknown>) => ddb.send(new PutCommand({ TableName: tableName, Item }));
    await put(tables.USERS, { id: '1', entity: 'User', userId: '1', email: 'allowed@example.test', nickname: 'owner', password: djangoPassword, isActive: true, dateJoined: '2025-01-01T00:00:00Z' });
    await put(tables.MARKERS, { id: '1', entity: 'Marker', markerId: '1', lat: 0, lng: 0, park: 'L' });
    await put(tables.ARTICLES, { id: '1', entity: 'Article', postId: '1', authorId: '1', markerId: '1', title: 'article', description: 'body', category: 1, image: null, isDraft: false, publicKey: 'public', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' });
    await put(tables.SPECIALMAPS, { id: '1', entity: 'SpecialMap', specialMapId: '1', authorId: '1', title: 'map', description: 'body', thumbnail: null, isPublic: true, publicKey: 'public', selectablePark: 'L', minLatitude: 0, maxLatitude: 1, minLongitude: 0, maxLongitude: 1, createdAt: '2025-01-01T00:00:00Z' });
    await put(tables.SPECIALMAPMARKERS, { id: '1', entity: 'SpecialMapMarker', specialMapMarkerId: '1', specialMapId: '1', lat: 0, lng: 0, park: 'L', image: null, description: 'marker', variant: 'blue' });
  });
  afterAll(async () => { await client.destroy(); });
  const app = () => createApp({ ddb, secrets: { send: async (command: GetSecretValueCommand) => ({ SecretString: JSON.stringify(command.input.SecretId === 'mail' ? { allowedRecipients: 'allowed@example.test', inquiryRecipient: 'allowed@example.test' } : {}) }) } as unknown as SecretsManagerClient, sendMail: async () => undefined, twitterRequest: async () => { throw new Error('adapter failure'); } });
  const json = (body: object) => ({ headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  it('serves public inventory routes and returns 404 for an absent resource', async () => {
    const server = app(); const paths = ['/articles/detail/1', '/articles/public/previews', '/markers/L', '/articles/categories', '/articles/sitemap', '/users/1', '/special-map/maps/public-previews', '/special-map/maps/1/detail', '/special-map/maps/1/markers', '/special-map/maps/sitemap', '/goods/check/1'];
    for (const path of paths) expect((await server.request(path)).status).toBe(200);
    expect((await server.request('/guess-area', { method: 'POST', ...json({ lat: 0, lng: 0, park: 'L' }) })).status).toBe(200);
    expect((await server.request('/articles/detail/404')).status).toBe(404);
  });
  it('enforces CSRF and rotates a DynamoDB-backed refresh session', async () => {
    const server = app(); const csrfResponse = await server.request('/auths/csrf/'); const csrfToken = (await csrfResponse.json() as { csrfToken: string }).csrfToken;
    const login = await server.request('/auths/login/', { method: 'POST', ...json({ email: 'allowed@example.test', password: 'password' }) }); const session = await login.json() as { access_token: string; refresh_token: string };
    const cookie = `trivia-map-auth=${session.access_token}; trivia-map-refresh-auth=${session.refresh_token}; trivia-map-csrf=${csrfToken}`; const headers = { cookie, origin: 'https://stg.triviamap.jp', 'x-csrf-token': csrfToken };
    expect((await server.request('/auths/user/', { headers: { cookie } })).status).toBe(200);
    expect((await server.request('/likes/toggle/1', { method: 'POST', headers })).status).toBe(200);
    expect((await server.request('/likes/toggle/1', { method: 'POST', headers: { ...headers, origin: 'https://attacker.invalid' } })).status).toBe(401);
    expect((await server.request('/auths/token/refresh/', { method: 'POST', headers })).status).toBe(200);
    expect((await server.request('/auths/token/refresh/', { method: 'POST', headers })).status).toBe(401);
  });
});
