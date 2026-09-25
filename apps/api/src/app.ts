import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from 'node:crypto';
import { Hono } from 'hono';

export type Health = { ok: true; service: 'triviamap-api' };
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const secrets = new SecretsManagerClient({});
const table = (name: string) => process.env[`TABLE_${name}`] ?? `TriviaMap-stg-${name[0]}${name.slice(1).toLowerCase()}`;
const scan = async (name: string) => (await ddb.send(new ScanCommand({ TableName: table(name) }))).Items ?? [];
const get = async (name: string, id: string) => (await ddb.send(new GetCommand({ TableName: table(name), Key: { id } }))).Item;
const date = (value: unknown) => value ? new Date(String(value)).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replaceAll('-', '/').replace(',', '') : null;
const visitor = (header: string | undefined) => header?.split(',')[0]?.trim() || 'anonymous';
let signingSecret: Promise<string> | undefined;
const jwtSecret = () => signingSecret ??= secrets.send(new GetSecretValueCommand({ SecretId: process.env.BACKEND_SECRET_ARN })).then((value) => JSON.parse(value.SecretString ?? '{}').jwtSecret as string);
const token = async (userId: string, seconds: number) => { const payload = Buffer.from(JSON.stringify({ userId, exp: Math.floor(Date.now() / 1000) + seconds })).toString('base64url'); return `${payload}.${createHmac('sha256', await jwtSecret()).update(payload).digest('base64url')}`; };
const readToken = async (raw?: string) => { if (!raw) return undefined; const [payload, signature] = raw.split('.'); const expected = createHmac('sha256', await jwtSecret()).update(payload).digest('base64url'); if (!signature || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return undefined; const parsed = JSON.parse(Buffer.from(payload, 'base64').toString()) as { userId: string; exp: number }; return parsed.exp > Date.now() / 1000 ? parsed : undefined; };
const cookie = (header: string | undefined, name: string) => header?.split(';').map((part) => part.trim().split('=')).find(([key]) => key === name)?.[1];
const verifyDjangoPassword = (password: string, stored: unknown) => { const [algorithm, iterations, salt, encoded] = String(stored).split('$'); if (algorithm !== 'pbkdf2_sha256' || !iterations || !salt || !encoded) return false; const derived = pbkdf2Sync(password, salt, Number(iterations), 32, 'sha256').toString('base64'); return timingSafeEqual(Buffer.from(derived), Buffer.from(encoded)); };
const hashDjangoPassword = (password: string) => { const salt = randomBytes(18).toString('base64url'); return `pbkdf2_sha256$260000$${salt}$${pbkdf2Sync(password, salt, 260000, 32, 'sha256').toString('base64')}`; };

export const createApp = () => {
  const app = new Hono();
  app.get('/health', (c) => c.json<Health>({ ok: true, service: 'triviamap-api' }));
  app.post('/auths/login/', async (c) => {
    const body = await c.req.json<{ email?: string; password?: string }>(); const users = await scan('USERS'); const user = users.find((item) => item.email === body.email);
    if (!user || !body.password || !verifyDjangoPassword(body.password, user.password)) return c.json({ non_field_errors: ['メールアドレスまたはパスワードが正しくありません。'] }, 400);
    const access = await token(String(user.id), 900); const refresh = await token(String(user.id), 60 * 60 * 24 * 14); const expires = new Date(Date.now() + 900000).toISOString(); const refreshExpires = new Date(Date.now() + 1209600000).toISOString();
    c.header('Set-Cookie', `trivia-map-auth=${access}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=900`); c.header('Set-Cookie', `trivia-map-refresh-auth=${refresh}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=1209600`, { append: true });
    return c.json({ access_token: access, refresh_token: refresh, user: { userId: user.id, email: user.email, nickname: user.nickname, icon: user.socialIcon ?? user.icon ?? null, isSocialAccount: !user.email, url: user.url ?? null }, access_token_expiration: expires, refresh_token_expiration: refreshExpires });
  });
  app.post('/auths/registration/', async (c) => {
    const body = await c.req.json<{ email?: string; nickname?: string; password1?: string; password2?: string }>(); const errors: Record<string, string[]> = {};
    if (!body.email || !/^\S+@\S+\.\S+$/.test(body.email)) errors.email = ['有効なメールアドレスを入力してください。']; if (!body.nickname || body.nickname.length > 20) errors.nickname = ['ニックネームは1〜20文字で入力してください。']; if (!body.password1 || body.password1.length < 8) errors.password1 = ['パスワードは8文字以上で入力してください。']; if (body.password1 !== body.password2) errors.password2 = ['パスワードが一致しません。'];
    const users = await scan('USERS'); if (body.email && users.some((user) => user.email === body.email)) errors.email = ['このメールアドレスは既に登録されています。']; if (Object.keys(errors).length) return c.json(errors, 400);
    const id = Math.max(0, ...users.map((user) => Number(user.id))) + 1; const now = new Date().toISOString(); await ddb.send(new PutCommand({ TableName: table('USERS'), Item: { id: String(id), entity: 'User', username: body.email, email: body.email, nickname: body.nickname, password: hashDjangoPassword(body.password1!), is_active: false, date_joined: now, last_login: null } }));
    return c.json({}, 201);
  });
  app.get('/auths/user/', async (c) => { const session = await readToken(cookie(c.req.header('cookie'), 'trivia-map-auth')); const user = session && await get('USERS', session.userId); return user ? c.json({ userId: user.id, email: user.email, nickname: user.nickname, icon: user.socialIcon ?? user.icon ?? null, isSocialAccount: !user.email, url: user.url ?? null }) : c.json({ detail: 'Authentication credentials were not provided.' }, 401); });
  app.post('/auths/token/refresh/', async (c) => { const session = await readToken(cookie(c.req.header('cookie'), 'trivia-map-refresh-auth')); if (!session) return c.json({ detail: 'Invalid refresh token' }, 401); const access = await token(session.userId, 900); c.header('Set-Cookie', `trivia-map-auth=${access}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=900`); return c.json({ access, access_token_expiration: new Date(Date.now() + 900000).toISOString() }); });
  app.post('/auths/logout/', (c) => { c.header('Set-Cookie', 'trivia-map-auth=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0'); c.header('Set-Cookie', 'trivia-map-refresh-auth=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0'); return c.json({}); });
  app.get('/articles/public/previews', async (c) => {
    const page = Math.max(1, Number(c.req.query('page') ?? 1)); const limit = Math.min(100, Number(c.req.query('limit') ?? 10));
    const category = c.req.query('category'); const marker = c.req.query('marker'); const user = c.req.query('user');
    const articles = (await scan('ARTICLES')).filter((a) => !a.isDraft && (!category || String(a.category) === category) && (!marker || String(a.marker_id) === marker) && (!user || String(a.author_id) === user)).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    const goods = await scan('GOODS'); const total = articles.length; const results = articles.slice((page - 1) * limit, page * limit).map((a) => ({ postId: a.postId, title: a.title, image: a.image ?? null, category: a.category, createdAt: date(a.createdAt), numberOfGoods: goods.filter((g) => String(g.article_id) === String(a.postId)).length }));
    return c.json({ nextUrl: page * limit < total ? `?page=${page + 1}` : null, previousUrl: page > 1 ? `?page=${page - 1}` : null, totalRecords: total, totalPages: Math.ceil(total / limit), currentPage: page, startIndex: total ? (page - 1) * limit + 1 : 0, endIndex: Math.min(page * limit, total), results });
  });
  app.get('/articles/detail/:id', async (c) => {
    const article = await get('ARTICLES', c.req.param('id')); if (!article || article.isDraft) return c.json({ detail: 'Not found' }, 404);
    const [author, marker, goods] = await Promise.all([get('USERS', String(article.author_id)), get('MARKERS', String(article.marker_id)), scan('GOODS')]);
    return c.json({ ...article, marker: marker && { markerId: marker.markerId, lat: marker.latitude, lng: marker.longitude, park: marker.park }, author: author && { userId: author.id, nickname: author.nickname, icon: author.socialIcon ?? author.icon ?? null, url: author.url ?? null }, createdAt: date(article.createdAt), updatedAt: date(article.updatedAt), numberOfGoods: goods.filter((g) => String(g.article_id) === String(article.postId)).length });
  });
  app.get('/markers/:park', async (c) => {
    const park = c.req.param('park'); const [markers, articles] = await Promise.all([scan('MARKERS'), scan('ARTICLES')]);
    return c.json(markers.filter((marker) => marker.park === park).map((marker) => {
      const related = articles.filter((article) => !article.isDraft && String(article.marker_id) === String(marker.markerId));
      return { markerId: marker.markerId, lat: marker.latitude, lng: marker.longitude, park: marker.park, numberOfPublicArticles: { total: related.length, eachCategory: Array.from({ length: 7 }, (_, category) => related.filter((article) => article.category === category).length) } };
    }));
  });
  app.get('/articles/categories', (c) => c.json([{ categoryId: 0, categoryName: 'その他' }, { categoryId: 1, categoryName: '隠れミッキー' }, { categoryId: 2, categoryName: 'バックグラウンドストーリー' }, { categoryId: 3, categoryName: 'おすすめ写真スポット' }, { categoryId: 4, categoryName: 'ショーパレ' }, { categoryId: 5, categoryName: 'キャラグリ' }, { categoryId: 6, categoryName: 'パーク攻略法' }]));
  app.get('/users/:id', async (c) => {
    const user = await get('USERS', c.req.param('id')); if (!user) return c.json({ detail: 'Not found' }, 404);
    return c.json({ userId: user.id, nickname: user.nickname, icon: user.socialIcon ?? user.icon ?? null, url: user.url ?? null });
  });
  app.get('/special-map/maps/public-previews', async (c) => {
    const maps = (await scan('SPECIALMAPS')).filter((map) => map.isPublic);
    return c.json({ nextUrl: null, previousUrl: null, totalRecords: maps.length, totalPages: 1, currentPage: 1, startIndex: maps.length ? 1 : 0, endIndex: maps.length, results: maps.map((map) => ({ specialMapId: map.specialMapId, title: map.title, thumbnail: map.thumbnail ?? null, description: map.description, isPublic: map.isPublic })) });
  });
  app.get('/special-map/maps/:id/detail', async (c) => {
    const map = await get('SPECIALMAPS', c.req.param('id')); if (!map || !map.isPublic) return c.json({ detail: 'Not found' }, 404);
    const author = await get('USERS', String(map.author_id));
    return c.json({ ...map, author: author && { userId: author.id, nickname: author.nickname, icon: author.socialIcon ?? author.icon ?? null, url: author.url ?? null }, createdAt: date(map.createdAt) });
  });
  app.get('/special-map/maps/:id/markers', async (c) => {
    const id = c.req.param('id'); const markers = (await scan('SPECIALMAPMARKERS')).filter((marker) => String(marker.specialMap_id) === id);
    return c.json({ nextUrl: null, previousUrl: null, totalRecords: markers.length, totalPages: 1, currentPage: 1, startIndex: markers.length ? 1 : 0, endIndex: markers.length, results: markers.map((marker) => ({ ...marker, specialMap: marker.specialMap_id, lat: marker.latitude, lng: marker.longitude })) });
  });
  app.get('/goods/check/:id', async (c) => {
    const ipAddress = visitor(c.req.header('x-forwarded-for')); const articleId = c.req.param('id');
    return c.json({ haveAddedGood: (await scan('GOODS')).some((good) => String(good.ipAddress) === ipAddress && String(good.article_id) === articleId) });
  });
  app.post('/goods/toggle/:id', async (c) => {
    const articleId = c.req.param('id'); const ipAddress = visitor(c.req.header('x-forwarded-for')); const id = `${ipAddress}:${articleId}`;
    const existing = (await scan('GOODS')).find((good) => String(good.ipAddress) === ipAddress && String(good.article_id) === articleId);
    if (existing) { await ddb.send(new DeleteCommand({ TableName: table('GOODS'), Key: { id: existing.id } })); return c.json({ haveAddedGood: false }); }
    await ddb.send(new PutCommand({ TableName: table('GOODS'), Item: { id, entity: 'Good', goodId: id, ipAddress, article_id: Number(articleId) }, ConditionExpression: 'attribute_not_exists(id)' }));
    return c.json({ haveAddedGood: true });
  });
  app.notFound((c) => c.json({ detail: 'Not found' }, 404));
  return app;
};
