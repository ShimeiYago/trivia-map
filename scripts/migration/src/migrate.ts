import { createHash } from 'node:crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { CopyObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import mysql, { RowDataPacket } from 'mysql2/promise';

type Entity = 'Users' | 'Markers' | 'Articles' | 'Likes' | 'Goods' | 'SpecialMaps' | 'SpecialMapMarkers';
type RecordItem = Record<string, unknown> & { id: string };
const sources: Array<[Entity, string, string]> = [['Users', 'users_customuser', 'id'], ['Markers', 'articles_markermodel', 'markerId'], ['Articles', 'articles_articlemodel', 'postId'], ['Likes', 'articles_likemodel', 'likeId'], ['Goods', 'articles_goodmodel', 'goodId'], ['SpecialMaps', 'special_map_specialmapmodel', 'specialMapId'], ['SpecialMapMarkers', 'special_map_specialmapmarkermodel', 'specialMapMarkerId']];
const arg = (name: string) => process.argv.includes(name);
const str = (value: unknown) => String(value ?? '');
const number = (value: unknown) => Number(value);
const iso = (value: unknown) => value instanceof Date ? value.toISOString() : value ? new Date(String(value)).toISOString() : null;
const stable = (value: object) => JSON.stringify(value, Object.keys(value).sort());
const ipHash = (ip: unknown) => createHash('sha256').update(str(ip)).digest('hex');

export const transform = (entity: Entity, row: Record<string, unknown>): RecordItem => {
  const at = new Date().toISOString();
  switch (entity) {
    case 'Users': { const email = str(row.email).toLowerCase(); return { id: str(row.id), entity: 'User', userId: str(row.id), ...(email ? { email } : {}), username: str(row.username), nickname: str(row.nickname), password: str(row.password), isActive: Boolean(row.is_active), isStaff: Boolean(row.is_staff), isSuperuser: Boolean(row.is_superuser), icon: row.icon || null, socialIcon: row.socialIcon || null, url: row.url || null, dateJoined: iso(row.date_joined), lastLogin: iso(row.last_login), migratedAt: at }; }
    case 'Markers': return { id: str(row.markerId), entity: 'Marker', markerId: str(row.markerId), lat: number(row.latitude), lng: number(row.longitude), park: str(row.park), migratedAt: at };
    case 'Articles': return { id: str(row.postId), entity: 'Article', postId: str(row.postId), authorId: str(row.author_id), markerId: str(row.marker_id), title: str(row.title), description: str(row.description), category: number(row.category), image: row.image || null, isDraft: Boolean(row.isDraft), publicKey: row.isDraft ? 'draft' : 'public', createdAt: iso(row.createdAt), updatedAt: iso(row.updatedAt), migratedAt: at };
    case 'Likes': return { id: `${str(row.user_id)}#${str(row.article_id)}`, entity: 'Like', likeId: str(row.likeId), userId: str(row.user_id), postId: str(row.article_id), migratedAt: at };
    case 'Goods': return { id: `${ipHash(row.ipAddress)}#${str(row.article_id)}`, entity: 'Good', goodId: str(row.goodId), ipHash: ipHash(row.ipAddress), postId: str(row.article_id), migratedAt: at };
    case 'SpecialMaps': return { id: str(row.specialMapId), entity: 'SpecialMap', specialMapId: str(row.specialMapId), authorId: str(row.author_id), title: str(row.title), thumbnail: row.thumbnail || null, isPublic: Boolean(row.isPublic), publicKey: row.isPublic ? 'public' : 'private', description: str(row.description), selectablePark: str(row.selectablePark), minLatitude: number(row.minLatitude), maxLatitude: number(row.maxLatitude), minLongitude: number(row.minLongitude), maxLongitude: number(row.maxLongitude), createdAt: iso(row.createdAt), migratedAt: at };
    case 'SpecialMapMarkers': return { id: str(row.specialMapMarkerId), entity: 'SpecialMapMarker', specialMapMarkerId: str(row.specialMapMarkerId), specialMapId: str(row.specialMap_id), lat: number(row.latitude), lng: number(row.longitude), park: str(row.park), image: row.image || null, description: str(row.description), variant: str(row.variant), migratedAt: at };
  }
};

const imageKeys = (item: RecordItem) => [item.image, item.thumbnail].filter((key): key is string => typeof key === 'string' && key.startsWith('uploads/'));
const checksum = async (s3: S3Client, bucket: string, key: string) => createHash('sha256').update(await (await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }))).Body!.transformToByteArray()).digest('hex');

async function main() {
  const mysqlUrl = process.env.MYSQL_URL; if (!mysqlUrl) throw new Error('MYSQL_URL is required');
  const dryRun = arg('--dry-run'); const copyImages = arg('--copy-images'); const validate = arg('--validate');
  const prefix = process.env.DYNAMODB_TABLE_PREFIX ?? 'TriviaMap-stg-v2-'; const sourceBucket = process.env.SOURCE_IMAGE_BUCKET ?? 'trivia-map-prod'; const destinationBucket = process.env.STAGING_IMAGE_BUCKET;
  if (copyImages && !destinationBucket) throw new Error('STAGING_IMAGE_BUCKET is required with --copy-images');
  const connection = await mysql.createConnection(mysqlUrl); const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({})); const s3 = new S3Client({});
  const report: Record<string, { source: number; written: number; skipped: number; images: number; validated: number }> = {};
  try {
    for (const [entity, sourceTable, primaryKey] of sources) {
      const [rows] = await connection.query<RowDataPacket[]>(`SELECT * FROM \`${sourceTable}\` ORDER BY \`${primaryKey}\``); let written = 0; let skipped = 0; let images = 0; let validated = 0;
      for (const row of rows) {
        const item = transform(entity, row as Record<string, unknown>);
        if (!dryRun) {
          const existing = await ddb.send(new GetCommand({ TableName: `${prefix}${entity}`, Key: { id: item.id } }));
          if (existing.Item) { const prior = { ...existing.Item }; delete prior.migratedAt; const expected = { ...item }; delete expected.migratedAt; if (stable(prior) !== stable(expected)) throw new Error(`conflicting existing ${entity}:${item.id}`); skipped += 1; } else { await ddb.send(new PutCommand({ TableName: `${prefix}${entity}`, Item: item, ConditionExpression: 'attribute_not_exists(id)' })); written += 1; }
          if (copyImages) for (const key of imageKeys(item)) { await s3.send(new CopyObjectCommand({ Bucket: destinationBucket, Key: key, CopySource: `${sourceBucket}/${encodeURIComponent(key).replaceAll('%2F', '/')}` })); images += 1; if (validate) { if ((await checksum(s3, sourceBucket, key)) !== (await checksum(s3, destinationBucket!, key))) throw new Error(`image checksum mismatch: ${key}`); validated += 1; } }
        }
      }
      report[entity] = { source: rows.length, written, skipped, images, validated };
    }
    // allauth keeps the Twitter identity separately from the Django user row.
    // Preserve it on the same v2 user item so social login continues to select
    // the legacy account instead of creating a second account.
    const [socialRows] = await connection.query<RowDataPacket[]>('SELECT user_id, uid FROM `socialaccount_socialaccount` WHERE provider = \'twitter\'');
    let linked = 0;
    for (const social of socialRows) {
      if (dryRun) continue;
      const user = await ddb.send(new GetCommand({ TableName: `${prefix}Users`, Key: { id: str(social.user_id) } }));
      if (!user.Item) throw new Error(`missing social user:${str(social.user_id)}`);
      if (str(user.Item.socialProvider) === 'twitter' && str(user.Item.socialId) === str(social.uid)) { linked += 1; continue; }
      if (user.Item.socialProvider || user.Item.socialId) throw new Error(`conflicting social identity:${str(social.user_id)}`);
      await ddb.send(new PutCommand({ TableName: `${prefix}Users`, Item: { ...user.Item, socialProvider: 'twitter', socialId: str(social.uid) } }));
      linked += 1;
    }
    report.SocialAccounts = { source: socialRows.length, written: linked, skipped: 0, images: 0, validated: 0 };
  } finally { await connection.end(); }
  console.log(JSON.stringify({ dryRun, copyImages, validate, report }, null, 2));
}
if (process.argv[1]?.endsWith('migrate.ts')) main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
