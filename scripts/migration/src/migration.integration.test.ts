import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { CopyObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { CreateTableCommand, DynamoDBClient, ResourceInUseException } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import mysql from 'mysql2/promise';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { runMigration, validateExistingMigration } from './migrate.js';

const endpoint = process.env.DYNAMODB_LOCAL_ENDPOINT;
const mysqlUrl = process.env.MYSQL_URL;
const prefix = `TriviaMapMigrationFixture-${Date.now()}-`;
const entities = ['Users', 'Markers', 'Articles', 'Likes', 'Goods', 'SpecialMaps', 'SpecialMapMarkers'];
const client = new DynamoDBClient({ region: 'ap-northeast-1', endpoint, credentials: { accessKeyId: 'local', secretAccessKey: 'local' } });
const ddb = DynamoDBDocumentClient.from(client);

class ImageStore {
  private readonly objects = new Map<string, Uint8Array>([
    ['source/uploads/fixture/article.jpg', new TextEncoder().encode('article')], ['source/uploads/fixture/map.jpg', new TextEncoder().encode('map')], ['source/uploads/fixture/marker.jpg', new TextEncoder().encode('marker')], ['source/uploads/fixture/icon.jpg', new TextEncoder().encode('icon')],
  ]);
  async send(command: CopyObjectCommand | GetObjectCommand) {
    if (command instanceof CopyObjectCommand) { const input = command.input; const source = decodeURIComponent(input.CopySource!); this.objects.set(`${input.Bucket}/${input.Key}`, this.objects.get(source)!); return {}; }
    const input = command.input; const bytes = this.objects.get(`${input.Bucket}/${input.Key}`); if (!bytes) throw new Error('missing image'); return { Body: { transformToByteArray: async () => bytes } };
  }
}

describe.skipIf(!endpoint || !mysqlUrl)('fixture MySQL to DynamoDB Local migration', () => {
  const images = new ImageStore();
  beforeAll(async () => {
    for (const entity of entities) {
      try { await client.send(new CreateTableCommand({ TableName: `${prefix}${entity}`, BillingMode: 'PAY_PER_REQUEST', AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }], KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }] })); }
      catch (error) { if (!(error instanceof ResourceInUseException)) throw error; }
    }
    const connection = await mysql.createConnection({ uri: mysqlUrl, multipleStatements: true });
    await connection.query('DROP TABLE IF EXISTS socialaccount_socialaccount, special_map_specialmapmarkermodel, special_map_specialmapmodel, articles_goodmodel, articles_likemodel, articles_articlemodel, articles_markermodel, users_customuser');
    await connection.query(await readFile(fileURLToPath(new URL('../fixtures/legacy-fixture.sql', import.meta.url)), 'utf8'));
    await connection.end();
  });
  afterAll(async () => { await client.destroy(); });

  it('preserves counts, IDs, relations, Twitter identity, image checksums, dry-run and resume behavior', async () => {
    const options = { mysqlUrl: mysqlUrl!, prefix, sourceBucket: 'source', destinationBucket: 'destination', ddb, s3: images as unknown as S3Client };
    const dryRun = await runMigration({ ...options, dryRun: true });
    expect(dryRun.Users).toMatchObject({ source: 1, written: 0 });
    const first = await runMigration({ ...options, copyImages: true, validate: true });
    expect(first).toMatchObject({ Users: { source: 1, written: 1, images: 1, validated: 1 }, Articles: { source: 1, images: 1, validated: 1 }, SpecialMaps: { source: 1, images: 1, validated: 1 }, SpecialMapMarkers: { source: 1, images: 1, validated: 1 } });
    const users = await ddb.send(new ScanCommand({ TableName: `${prefix}Users` }));
    const articles = await ddb.send(new ScanCommand({ TableName: `${prefix}Articles` }));
    const likes = await ddb.send(new ScanCommand({ TableName: `${prefix}Likes` }));
    expect(users.Items).toEqual([expect.objectContaining({ id: '1', userId: '1', socialProvider: 'twitter', socialId: 'twitter-fixture-id' })]);
    expect(articles.Items).toEqual([expect.objectContaining({ id: '1', authorId: '1', markerId: '1', image: 'uploads/fixture/article.jpg' })]);
    expect(likes.Items).toEqual([expect.objectContaining({ id: '1#1', userId: '1', postId: '1' })]);
    const resumed = await runMigration({ ...options, copyImages: true, validate: true });
    expect(Object.values(resumed).filter((entry) => 'skipped' in entry).some((entry) => entry.skipped > 0)).toBe(true);
    await expect(validateExistingMigration(options)).resolves.toMatchObject({
      entities: { Users: { source: 1, destination: 1, missingIds: 0, mismatched: 0 }, Articles: { source: 1, destination: 1, missingIds: 0, mismatched: 0 } },
      relations: { articleAuthor: 0, articleMarker: 0, likeUserOrArticle: 0, goodArticle: 0, mapAuthor: 0, mapMarkerMap: 0 },
      twitterIdentities: { source: 1, missing: 0, mismatched: 0 }, images: { referenced: 4, missing: 0, checksumMismatched: 0 },
    });
  });
});
