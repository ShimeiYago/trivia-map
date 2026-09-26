import { pbkdf2Sync } from 'node:crypto';
import { CreateTableCommand, DynamoDBClient, ResourceInUseException } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from './app.js';

const endpoint = process.env.DYNAMODB_LOCAL_ENDPOINT;
const suffix = `${Date.now()}`;
const tables = Object.fromEntries(['USERS', 'ARTICLES', 'MARKERS', 'LIKES', 'GOODS', 'SPECIALMAPS', 'SPECIALMAPMARKERS', 'SESSIONS', 'AUTHTOKENS', 'SEQUENCES', 'RATELIMITS'].map((key) => [key, `TriviaMapApiIntegration-${suffix}-${key}`]));
const client = new DynamoDBClient({ region: 'ap-northeast-1', endpoint, credentials: { accessKeyId: 'local', secretAccessKey: 'local' } });
const ddb = DynamoDBDocumentClient.from(client);
const djangoPassword = `pbkdf2_sha256$1000$salt$${pbkdf2Sync('password', 'salt', 1000, 32, 'sha256').toString('base64')}`;

describe.skipIf(!endpoint)('DynamoDB Local API integration', () => {
  beforeAll(async () => {
    Object.entries(tables).forEach(([key, value]) => { process.env[`TABLE_${key}`] = value; });
    Object.assign(process.env, { JWT_SECRET: 'integration-signing-key', GOOD_SALT: 'integration-good-salt', FRONTEND_ORIGIN: 'https://stg.triviamap.jp', MAIL_SECRET_ARN: 'mail' });
    const indexes: Record<string, Array<[string, string, string?]>> = {
      USERS: [['email-index', 'email', 'id']], ARTICLES: [['author-index', 'authorId', 'postId'], ['marker-index', 'markerId', 'postId'], ['public-index', 'publicKey', 'createdAt']], MARKERS: [['park-index', 'park', 'markerId']], LIKES: [['user-index', 'userId', 'postId'], ['article-index', 'postId', 'id']], GOODS: [['article-index', 'postId', 'id']], SPECIALMAPS: [['author-index', 'authorId', 'specialMapId'], ['public-index', 'publicKey', 'specialMapId']], SPECIALMAPMARKERS: [['map-index', 'specialMapId', 'specialMapMarkerId']], SESSIONS: [['user-index', 'userId', 'expiresAt']], AUTHTOKENS: [['user-index', 'userId', 'expiresAt']],
    };
    for (const [key, tableName] of Object.entries(tables)) { const tableIndexes = indexes[key] ?? []; const attributes = new Set(['id', ...tableIndexes.flatMap(([, partition, sort]) => [partition, ...(sort ? [sort] : [])])]); try { await client.send(new CreateTableCommand({ TableName: tableName, BillingMode: 'PAY_PER_REQUEST', AttributeDefinitions: [...attributes].map((AttributeName) => ({ AttributeName, AttributeType: 'S' as const })), KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }], ...(tableIndexes.length ? { GlobalSecondaryIndexes: tableIndexes.map(([IndexName, partition, sort]) => ({ IndexName, KeySchema: [{ AttributeName: partition, KeyType: 'HASH' as const }, ...(sort ? [{ AttributeName: sort, KeyType: 'RANGE' as const }] : [])], Projection: { ProjectionType: 'ALL' as const } })) } : {}) })); } catch (error) { if (!(error instanceof ResourceInUseException)) throw error; } }
    const put = (tableName: string, Item: Record<string, unknown>) => ddb.send(new PutCommand({ TableName: tableName, Item }));
    await put(tables.USERS, { id: '1', entity: 'User', userId: '1', email: 'allowed@example.test', nickname: 'owner', password: djangoPassword, isActive: true, dateJoined: '2025-01-01T00:00:00Z' });
    await put(tables.USERS, { id: '2', entity: 'User', userId: '2', email: 'inactive@example.test', nickname: 'inactive', password: djangoPassword, isActive: false, dateJoined: '2025-01-01T00:00:00Z' });
    await put(tables.MARKERS, { id: '1', entity: 'Marker', markerId: '1', lat: 0, lng: 0, park: 'L' });
    await put(tables.ARTICLES, { id: '1', entity: 'Article', postId: '1', authorId: '1', markerId: '1', title: 'article', description: 'body', category: 1, image: null, isDraft: false, publicKey: 'public', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' });
    await put(tables.ARTICLES, { id: '2', entity: 'Article', postId: '2', authorId: '2', markerId: '1', title: 'inactive article', description: 'body', category: 1, image: null, isDraft: false, publicKey: 'public', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' });
    await put(tables.SPECIALMAPS, { id: '1', entity: 'SpecialMap', specialMapId: '1', authorId: '1', title: 'map', description: 'body', thumbnail: null, isPublic: true, publicKey: 'public', selectablePark: 'L', minLatitude: 0, maxLatitude: 1, minLongitude: 0, maxLongitude: 1, createdAt: '2025-01-01T00:00:00Z' });
    await put(tables.SPECIALMAPMARKERS, { id: '1', entity: 'SpecialMapMarker', specialMapMarkerId: '1', specialMapId: '1', lat: 0, lng: 0, park: 'L', image: null, description: 'marker', variant: 'blue' });
    await put(tables.SPECIALMAPS, { id: '2', entity: 'SpecialMap', specialMapId: '2', authorId: '1', title: 'private map', description: 'body', thumbnail: null, isPublic: false, publicKey: 'private', selectablePark: 'L', minLatitude: 0, maxLatitude: 1, minLongitude: 0, maxLongitude: 1, createdAt: '2025-01-01T00:00:00Z' });
    await put(tables.SPECIALMAPMARKERS, { id: '2', entity: 'SpecialMapMarker', specialMapMarkerId: '2', specialMapId: '2', lat: 0, lng: 0, park: 'L', image: null, description: 'private marker', variant: 'blue' });
  });
  afterAll(async () => { await client.destroy(); });
  const app = () => createApp({ ddb, secrets: { send: async (command: GetSecretValueCommand) => ({ SecretString: JSON.stringify(command.input.SecretId === 'mail' ? { allowedRecipients: 'allowed@example.test', inquiryRecipient: 'allowed@example.test' } : {}) }) } as unknown as SecretsManagerClient, sendMail: async () => undefined, twitterRequest: async () => { throw new Error('adapter failure'); } });
  const json = (body: object) => ({ headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  it('serves public inventory routes and returns 404 for an absent resource', async () => {
    const server = app(); const paths = ['/articles/detail/1', '/articles/public/previews', '/markers/L', '/articles/categories', '/articles/sitemap', '/users/1', '/special-map/maps/public-previews', '/special-map/maps/1/detail', '/special-map/maps/1/markers', '/special-map/maps/sitemap', '/goods/check/1'];
    for (const path of paths) expect((await server.request(path)).status).toBe(200);
    expect((await server.request('/guess-area', { method: 'POST', ...json({ lat: 0, lng: 0, park: 'L' }) })).status).toBe(200);
    expect((await server.request('/articles/detail/404')).status).toBe(404);
    expect((await server.request('/articles/detail/2')).status).toBe(404);
    expect((await server.request('/special-map/maps/2/markers')).status).toBe(404);
    expect((await server.request('/special-map/markers/2')).status).toBe(404);
    expect((await server.request('/users/2')).status).toBe(404);
  });
  it('enforces CSRF and rotates a DynamoDB-backed refresh session', async () => {
    const server = app(); const csrfResponse = await server.request('/auths/csrf/'); const csrfToken = (await csrfResponse.json() as { csrfToken: string }).csrfToken;
    const login = await server.request('/auths/login/', { method: 'POST', ...json({ email: 'allowed@example.test', password: 'password' }) });
    const setCookies = (login.headers as Headers & { getSetCookie(): string[] }).getSetCookie();
    const authCookies = setCookies.map((value) => value.split(';')[0]).join('; ');
    expect(await login.json()).not.toHaveProperty('access_token');
    const cookie = `${authCookies}; trivia-map-csrf=${csrfToken}`; const headers = { cookie, origin: 'https://stg.triviamap.jp', 'x-csrf-token': csrfToken };
    expect((await server.request('/auths/user/', { headers: { cookie } })).status).toBe(200);
    expect((await server.request('/special-map/maps/2/markers', { headers: { cookie } })).status).toBe(200);
    expect((await server.request('/likes/toggle/1', { method: 'POST', headers })).status).toBe(200);
    expect((await server.request('/likes/toggle/1', { method: 'POST', headers: { ...headers, origin: 'https://attacker.invalid' } })).status).toBe(401);
    expect((await server.request('/auths/token/refresh/', { method: 'POST', headers })).status).toBe(200);
    expect((await server.request('/auths/token/refresh/', { method: 'POST', headers })).status).toBe(401);
  });

  it('enforces the fixed-window login limit without disclosing account state', async () => {
    const server = app(); const statuses: number[] = [];
    for (let attempt = 0; attempt < 11; attempt += 1) statuses.push((await server.request('/auths/login/', { method: 'POST', headers: { 'content-type': 'application/json', 'x-triviamap-viewer-ip': '198.51.100.7' }, body: JSON.stringify({ email: 'missing@example.test', password: 'wrong' }) })).status);
    expect(statuses.slice(0, 10)).toEqual(Array(10).fill(400));
    expect(statuses[10]).toBe(429);
  });
});
