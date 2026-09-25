import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Hono } from 'hono';

export type Health = { ok: true; service: 'triviamap-api' };
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const table = (name: string) => process.env[`TABLE_${name}`] ?? `TriviaMap-stg-${name[0]}${name.slice(1).toLowerCase()}`;
const scan = async (name: string) => (await ddb.send(new ScanCommand({ TableName: table(name) }))).Items ?? [];
const get = async (name: string, id: string) => (await ddb.send(new GetCommand({ TableName: table(name), Key: { id } }))).Item;
const date = (value: unknown) => value ? new Date(String(value)).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replaceAll('-', '/').replace(',', '') : null;

export const createApp = () => {
  const app = new Hono();
  app.get('/health', (c) => c.json<Health>({ ok: true, service: 'triviamap-api' }));
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
  app.notFound((c) => c.json({ detail: 'Not found' }, 404));
  return app;
};
