import { readFile } from "node:fs/promises";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

type RankingFile = { articleIdList?: unknown };

export const parseRanking = (input: RankingFile): number[] => {
  if (!Array.isArray(input.articleIdList))
    throw new Error("articleIdList must be an array");
  const ids = input.articleIdList.map(Number);
  if (ids.some((id) => !Number.isSafeInteger(id) || id <= 0))
    throw new Error("articleIdList must contain positive integer IDs");
  if (new Set(ids).size !== ids.length)
    throw new Error("articleIdList must not contain duplicate IDs");
  return ids;
};

export async function syncRanking(
  ddb: DynamoDBDocumentClient,
  tableName: string,
  articleIds: number[],
  dryRun = false
) {
  const existingIds = new Set<string>();
  const previouslyRanked = new Set<string>();
  let exclusiveStartKey: Record<string, unknown> | undefined;
  do {
    const page = await ddb.send(
      new ScanCommand({
        TableName: tableName,
        ProjectionExpression: "id, popularityRank",
        ExclusiveStartKey: exclusiveStartKey,
      })
    );
    for (const item of page.Items ?? []) {
      existingIds.add(String(item.id));
      if (item.popularityRank !== undefined)
        previouslyRanked.add(String(item.id));
    }
    exclusiveStartKey = page.LastEvaluatedKey;
  } while (exclusiveStartKey);

  const ranked = articleIds.filter((id) => existingIds.has(String(id)));
  const rankedSet = new Set(ranked.map(String));
  const stale = [...previouslyRanked].filter((id) => !rankedSet.has(id));
  if (!dryRun) {
    await Promise.all([
      ...ranked.map((id, index) =>
        ddb.send(
          new UpdateCommand({
            TableName: tableName,
            Key: { id: String(id) },
            UpdateExpression: "SET popularityRank = :rank",
            ExpressionAttributeValues: { ":rank": index + 1 },
            ConditionExpression: "attribute_exists(id)",
          })
        )
      ),
      ...stale.map((id) =>
        ddb.send(
          new UpdateCommand({
            TableName: tableName,
            Key: { id },
            UpdateExpression: "REMOVE popularityRank",
            ConditionExpression: "attribute_exists(id)",
          })
        )
      ),
    ]);
  }
  return {
    supplied: articleIds.length,
    matched: ranked.length,
    missing: articleIds.length - ranked.length,
    updated: dryRun ? 0 : ranked.length,
    cleared: dryRun ? 0 : stale.length,
  };
}

async function main() {
  const fileIndex = process.argv.indexOf("--ranking-file");
  const rankingFile = fileIndex >= 0 ? process.argv[fileIndex + 1] : undefined;
  if (!rankingFile) throw new Error("--ranking-file is required");
  const tableName =
    process.env.ARTICLES_TABLE ??
    `${process.env.DYNAMODB_TABLE_PREFIX ?? "TriviaMap-stg-v2-"}Articles`;
  const input = JSON.parse(await readFile(rankingFile, "utf8")) as RankingFile;
  const ddb = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: process.env.AWS_REGION ?? "ap-northeast-1" })
  );
  console.log(
    JSON.stringify(
      await syncRanking(
        ddb,
        tableName,
        parseRanking(input),
        process.argv.includes("--dry-run")
      )
    )
  );
}

if (process.argv[1]?.endsWith("sync-ranking.ts"))
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
