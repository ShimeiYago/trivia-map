import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import mysql, { RowDataPacket } from 'mysql2/promise';

const entities = [
  ['Users', 'users_customuser', 'id'], ['Markers', 'articles_markermodel', 'markerId'], ['Articles', 'articles_articlemodel', 'postId'],
  ['Likes', 'articles_likemodel', 'likeId'], ['Goods', 'articles_goodmodel', 'goodId'], ['SpecialMaps', 'special_map_specialmapmodel', 'specialMapId'], ['SpecialMapMarkers', 'special_map_specialmapmarkermodel', 'specialMapMarkerId'],
] as const;

const arg = (name: string) => process.argv.includes(name);
const normalise = (value: unknown): unknown => value instanceof Date ? value.toISOString() : Array.isArray(value) ? value.map(normalise) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([key, child]) => [key, normalise(child)])) : value;

async function main() {
  const mysqlUrl = process.env.MYSQL_URL;
  if (!mysqlUrl) throw new Error('MYSQL_URL is required');
  const dryRun = arg('--dry-run');
  const prefix = process.env.DYNAMODB_TABLE_PREFIX ?? 'TriviaMap-stg-';
  const connection = await mysql.createConnection(mysqlUrl);
  const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  const report: Record<string, { source: number; written: number; skipped: number }> = {};
  try {
    for (const [entity, sourceTable, primaryKey] of entities) {
      const [rows] = await connection.query<RowDataPacket[]>(`SELECT * FROM \`${sourceTable}\` ORDER BY \`${primaryKey}\``);
      let written = 0; let skipped = 0;
      for (const row of rows) {
        const item = { ...(normalise(row) as Record<string, unknown>), entity, id: String(row[primaryKey]) };
        if (!dryRun) {
          const tableName = `${prefix}${entity}`;
          const existing = await ddb.send(new GetCommand({ TableName: tableName, Key: { id: item.id } }));
          if (existing.Item) {
            if (JSON.stringify(existing.Item) !== JSON.stringify(item)) throw new Error(`conflicting existing ${entity}:${item.id}`);
            skipped += 1;
          } else {
            await ddb.send(new PutCommand({ TableName: tableName, Item: item, ConditionExpression: 'attribute_not_exists(id)' }));
            written += 1;
          }
        }
      }
      report[entity] = { source: rows.length, written, skipped };
    }
  } finally { await connection.end(); }
  console.log(JSON.stringify({ dryRun, report }, null, 2));
}
main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
