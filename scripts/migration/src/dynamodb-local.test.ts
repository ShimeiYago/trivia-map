import { CreateTableCommand, DynamoDBClient, ResourceInUseException } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const endpoint = process.env.DYNAMODB_LOCAL_ENDPOINT;
const tableName = 'TriviaMapIntegrationLikes';
const client = new DynamoDBClient({ region: 'ap-northeast-1', endpoint, credentials: { accessKeyId: 'local', secretAccessKey: 'local' } });
const ddb = DynamoDBDocumentClient.from(client);

describe.skipIf(!endpoint)('DynamoDB Local integration', () => {
  beforeAll(async () => {
    try {
      await client.send(new CreateTableCommand({ TableName: tableName, BillingMode: 'PAY_PER_REQUEST', AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }, { AttributeName: 'userId', AttributeType: 'S' }, { AttributeName: 'postId', AttributeType: 'S' }], KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }], GlobalSecondaryIndexes: [{ IndexName: 'user-index', KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }, { AttributeName: 'postId', KeyType: 'RANGE' }], Projection: { ProjectionType: 'ALL' } }] }));
    } catch (error) { if (!(error instanceof ResourceInUseException)) throw error; }
  });

  afterAll(async () => { await client.destroy(); });

  it('enforces a unique Like and exposes it through the user GSI', async () => {
    const item = { id: '1#2', userId: '1', postId: '2', expiresAt: String(Math.floor(Date.now() / 1000) + 60), ttl: Math.floor(Date.now() / 1000) + 60 };
    await ddb.send(new PutCommand({ TableName: tableName, Item: item, ConditionExpression: 'attribute_not_exists(id)' }));
    await expect(ddb.send(new PutCommand({ TableName: tableName, Item: item, ConditionExpression: 'attribute_not_exists(id)' }))).rejects.toMatchObject({ name: 'ConditionalCheckFailedException' });
    const rows = await ddb.send(new QueryCommand({ TableName: tableName, IndexName: 'user-index', KeyConditionExpression: 'userId = :user', ExpressionAttributeValues: { ':user': '1' } }));
    expect(rows.Items).toEqual([item]);
    await expect(ddb.send(new GetCommand({ TableName: tableName, Key: { id: item.id } }))).resolves.toMatchObject({ Item: item });
  });
});
