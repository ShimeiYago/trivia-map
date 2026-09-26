import { createHash } from "node:crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  CopyObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import mysql, { RowDataPacket } from "mysql2/promise";

type Entity =
  | "Users"
  | "Markers"
  | "Articles"
  | "Likes"
  | "Goods"
  | "SpecialMaps"
  | "SpecialMapMarkers";
type RecordItem = Record<string, unknown> & { id: string };
const sources: Array<[Entity, string, string]> = [
  ["Users", "users_customuser", "id"],
  ["Markers", "articles_markermodel", "markerId"],
  ["Articles", "articles_articlemodel", "postId"],
  ["Likes", "articles_likemodel", "likeId"],
  ["Goods", "articles_goodmodel", "goodId"],
  ["SpecialMaps", "special_map_specialmapmodel", "specialMapId"],
  [
    "SpecialMapMarkers",
    "special_map_specialmapmarkermodel",
    "specialMapMarkerId",
  ],
];
const arg = (name: string) => process.argv.includes(name);
const str = (value: unknown) => String(value ?? "");
const number = (value: unknown) => Number(value);
const iso = (value: unknown) =>
  value instanceof Date
    ? value.toISOString()
    : value
    ? new Date(String(value)).toISOString()
    : null;
const stable = (value: object) =>
  JSON.stringify(value, Object.keys(value).sort());
const ipHash = (ip: unknown) =>
  createHash("sha256").update(str(ip)).digest("hex");

export const transform = (
  entity: Entity,
  row: Record<string, unknown>
): RecordItem => {
  const at = new Date().toISOString();
  switch (entity) {
    case "Users": {
      const email = str(row.email).toLowerCase();
      return {
        id: str(row.id),
        entity: "User",
        userId: str(row.id),
        ...(email ? { email } : {}),
        username: str(row.username),
        nickname: str(row.nickname),
        password: str(row.password),
        isActive: Boolean(row.is_active),
        isStaff: Boolean(row.is_staff),
        isSuperuser: Boolean(row.is_superuser),
        icon: row.icon || null,
        socialIcon: row.socialIcon || null,
        url: row.url || null,
        dateJoined: iso(row.date_joined),
        lastLogin: iso(row.last_login),
        migratedAt: at,
      };
    }
    case "Markers":
      return {
        id: str(row.markerId),
        entity: "Marker",
        markerId: str(row.markerId),
        lat: number(row.latitude),
        lng: number(row.longitude),
        park: str(row.park),
        migratedAt: at,
      };
    case "Articles":
      return {
        id: str(row.postId),
        entity: "Article",
        postId: str(row.postId),
        authorId: str(row.author_id),
        markerId: str(row.marker_id),
        title: str(row.title),
        description: str(row.description),
        category: number(row.category),
        image: row.image || null,
        isDraft: Boolean(row.isDraft),
        publicKey: row.isDraft ? "draft" : "public",
        createdAt: iso(row.createdAt),
        updatedAt: iso(row.updatedAt),
        migratedAt: at,
      };
    case "Likes":
      return {
        id: `${str(row.user_id)}#${str(row.article_id)}`,
        entity: "Like",
        likeId: str(row.likeId),
        userId: str(row.user_id),
        postId: str(row.article_id),
        migratedAt: at,
      };
    case "Goods":
      return {
        id: `${ipHash(row.ipAddress)}#${str(row.article_id)}`,
        entity: "Good",
        goodId: str(row.goodId),
        ipHash: ipHash(row.ipAddress),
        postId: str(row.article_id),
        migratedAt: at,
      };
    case "SpecialMaps":
      return {
        id: str(row.specialMapId),
        entity: "SpecialMap",
        specialMapId: str(row.specialMapId),
        authorId: str(row.author_id),
        title: str(row.title),
        thumbnail: row.thumbnail || null,
        isPublic: Boolean(row.isPublic),
        publicKey: row.isPublic ? "public" : "private",
        description: str(row.description),
        selectablePark: str(row.selectablePark),
        minLatitude: number(row.minLatitude),
        maxLatitude: number(row.maxLatitude),
        minLongitude: number(row.minLongitude),
        maxLongitude: number(row.maxLongitude),
        createdAt: iso(row.createdAt),
        migratedAt: at,
      };
    case "SpecialMapMarkers":
      return {
        id: str(row.specialMapMarkerId),
        entity: "SpecialMapMarker",
        specialMapMarkerId: str(row.specialMapMarkerId),
        specialMapId: str(row.specialMap_id),
        lat: number(row.latitude),
        lng: number(row.longitude),
        park: str(row.park),
        image: row.image || null,
        description: str(row.description),
        variant: str(row.variant),
        migratedAt: at,
      };
  }
};

export const imageKeys = (item: RecordItem) =>
  [item.image, item.thumbnail, item.icon, item.socialIcon].filter(
    (key): key is string =>
      typeof key === "string" && key.startsWith("uploads/")
  );
const checksum = async (s3: S3Client, bucket: string, key: string) =>
  createHash("sha256")
    .update(
      await (
        await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
      ).Body!.transformToByteArray()
    )
    .digest("hex");

export type MigrationOptions = {
  mysqlUrl: string;
  dryRun?: boolean;
  copyImages?: boolean;
  validate?: boolean;
  prefix?: string;
  sourceBucket?: string;
  destinationBucket?: string;
  ddb?: DynamoDBDocumentClient;
  s3?: S3Client;
};
export type MigrationReport = Record<
  string,
  {
    source: number;
    written: number;
    skipped: number;
    images: number;
    validated: number;
  }
>;
export type ValidationReport = {
  entities: Record<
    string,
    {
      source: number;
      destination: number;
      missingIds: number;
      mismatched: number;
    }
  >;
  relations: Record<string, number>;
  twitterIdentities: { source: number; missing: number; mismatched: number };
  images: { referenced: number; missing: number; checksumMismatched: number };
};

/** Copies only source-referenced media and never writes a database record. */
export async function syncReferencedImages(
  options: Pick<
    MigrationOptions,
    "mysqlUrl" | "sourceBucket" | "destinationBucket" | "s3"
  >
) {
  const sourceBucket =
    options.sourceBucket ??
    process.env.SOURCE_IMAGE_BUCKET ??
    "trivia-map-prod";
  const destinationBucket =
    options.destinationBucket ?? process.env.STAGING_IMAGE_BUCKET;
  if (!destinationBucket) throw new Error("STAGING_IMAGE_BUCKET is required");
  const connection = await mysql.createConnection(options.mysqlUrl);
  const s3 = options.s3 ?? new S3Client({});
  const keys = new Set<string>();
  try {
    for (const [entity, sourceTable, primaryKey] of sources) {
      const [rows] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM \`${sourceTable}\` ORDER BY \`${primaryKey}\``
      );
      for (const row of rows)
        for (const key of imageKeys(
          transform(entity, row as Record<string, unknown>)
        ))
          keys.add(key);
    }
    let copied = 0;
    let skipped = 0;
    for (const key of keys) {
      const sourceChecksum = await checksum(s3, sourceBucket, key);
      let destinationChecksum: string | undefined;
      try {
        destinationChecksum = await checksum(s3, destinationBucket, key);
      } catch {
        // Missing destination objects are copied below.
      }
      if (destinationChecksum === sourceChecksum) {
        skipped += 1;
        continue;
      }
      await s3.send(
        new CopyObjectCommand({
          Bucket: destinationBucket,
          Key: key,
          CopySource: `${sourceBucket}/${encodeURIComponent(key).replaceAll("%2F", "/")}`,
        })
      );
      if ((await checksum(s3, destinationBucket, key)) !== sourceChecksum)
        throw new Error(`image checksum mismatch: ${key}`);
      copied += 1;
    }
    return {
      referenced: keys.size,
      copied,
      skipped,
      checksumMismatched: 0,
    };
  } finally {
    await connection.end();
  }
}

export async function runMigration(
  options: MigrationOptions
): Promise<MigrationReport> {
  const { mysqlUrl } = options;
  const dryRun = options.dryRun ?? false;
  const copyImages = options.copyImages ?? false;
  const validate = options.validate ?? false;
  const prefix =
    options.prefix ?? process.env.DYNAMODB_TABLE_PREFIX ?? "TriviaMap-stg-v2-";
  const sourceBucket =
    options.sourceBucket ??
    process.env.SOURCE_IMAGE_BUCKET ??
    "trivia-map-prod";
  const destinationBucket =
    options.destinationBucket ?? process.env.STAGING_IMAGE_BUCKET;
  if (copyImages && !destinationBucket)
    throw new Error("STAGING_IMAGE_BUCKET is required with --copy-images");
  const connection = await mysql.createConnection(mysqlUrl);
  const ddb =
    options.ddb ??
    DynamoDBDocumentClient.from(
      new DynamoDBClient({
        region: process.env.AWS_REGION ?? "ap-northeast-1",
        ...(process.env.DYNAMODB_LOCAL_ENDPOINT
          ? {
              endpoint: process.env.DYNAMODB_LOCAL_ENDPOINT,
              credentials: { accessKeyId: "local", secretAccessKey: "local" },
            }
          : {}),
      })
    );
  const s3 = options.s3 ?? new S3Client({});
  const report: MigrationReport = {};
  try {
    for (const [entity, sourceTable, primaryKey] of sources) {
      const [rows] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM \`${sourceTable}\` ORDER BY \`${primaryKey}\``
      );
      let written = 0;
      let skipped = 0;
      let images = 0;
      let validated = 0;
      for (const row of rows) {
        const item = transform(entity, row as Record<string, unknown>);
        if (!dryRun) {
          const existing = await ddb.send(
            new GetCommand({
              TableName: `${prefix}${entity}`,
              Key: { id: item.id },
            })
          );
          if (existing.Item) {
            const prior = { ...existing.Item };
            delete prior.migratedAt;
            if (entity === "Users") {
              delete prior.socialProvider;
              delete prior.socialId;
            }
            if (entity === "Articles") delete prior.popularityRank;
            const expected = { ...item };
            delete expected.migratedAt;
            if (stable(prior) !== stable(expected))
              throw new Error(`conflicting existing ${entity}:${item.id}`);
            skipped += 1;
          } else {
            await ddb.send(
              new PutCommand({
                TableName: `${prefix}${entity}`,
                Item: item,
                ConditionExpression: "attribute_not_exists(id)",
              })
            );
            written += 1;
          }
          if (copyImages)
            for (const key of imageKeys(item)) {
              await s3.send(
                new CopyObjectCommand({
                  Bucket: destinationBucket,
                  Key: key,
                  CopySource: `${sourceBucket}/${encodeURIComponent(
                    key
                  ).replaceAll("%2F", "/")}`,
                })
              );
              images += 1;
              if (validate) {
                if (
                  (await checksum(s3, sourceBucket, key)) !==
                  (await checksum(s3, destinationBucket!, key))
                )
                  throw new Error(`image checksum mismatch: ${key}`);
                validated += 1;
              }
            }
        }
      }
      report[entity] = {
        source: rows.length,
        written,
        skipped,
        images,
        validated,
      };
    }
    // allauth keeps the Twitter identity separately from the Django user row.
    // Preserve it on the same v2 user item so social login continues to select
    // the legacy account instead of creating a second account.
    const [socialRows] = await connection.query<RowDataPacket[]>(
      "SELECT user_id, uid FROM `socialaccount_socialaccount` WHERE provider = 'twitter'"
    );
    let linked = 0;
    for (const social of socialRows) {
      if (dryRun) continue;
      const user = await ddb.send(
        new GetCommand({
          TableName: `${prefix}Users`,
          Key: { id: str(social.user_id) },
        })
      );
      if (!user.Item)
        throw new Error(`missing social user:${str(social.user_id)}`);
      if (
        str(user.Item.socialProvider) === "twitter" &&
        str(user.Item.socialId) === str(social.uid)
      ) {
        linked += 1;
        continue;
      }
      if (user.Item.socialProvider || user.Item.socialId)
        throw new Error(`conflicting social identity:${str(social.user_id)}`);
      await ddb.send(
        new PutCommand({
          TableName: `${prefix}Users`,
          Item: {
            ...user.Item,
            socialProvider: "twitter",
            socialId: str(social.uid),
          },
        })
      );
      linked += 1;
    }
    report.SocialAccounts = {
      source: socialRows.length,
      written: linked,
      skipped: 0,
      images: 0,
      validated: 0,
    };
  } finally {
    await connection.end();
  }
  return report;
}
const scanAll = async (ddb: DynamoDBDocumentClient, tableName: string) => {
  const items: RecordItem[] = [];
  let key: Record<string, unknown> | undefined;
  do {
    const page = await ddb.send(
      new ScanCommand({ TableName: tableName, ExclusiveStartKey: key })
    );
    items.push(...((page.Items as RecordItem[]) ?? []));
    key = page.LastEvaluatedKey;
  } while (key);
  return items;
};
const comparable = (entity: Entity, item: RecordItem) => {
  const output = { ...item };
  delete output.migratedAt;
  if (entity === "Users") {
    delete output.socialProvider;
    delete output.socialId;
  }
  if (entity === "Articles") delete output.popularityRank;
  return output;
};

/** Reads legacy and staging data without mutating either side. */
export async function validateExistingMigration(
  options: Omit<MigrationOptions, "dryRun" | "copyImages" | "validate">
): Promise<ValidationReport> {
  const prefix =
    options.prefix ?? process.env.DYNAMODB_TABLE_PREFIX ?? "TriviaMap-stg-v2-";
  const sourceBucket =
    options.sourceBucket ??
    process.env.SOURCE_IMAGE_BUCKET ??
    "trivia-map-prod";
  const destinationBucket =
    options.destinationBucket ?? process.env.STAGING_IMAGE_BUCKET;
  if (!destinationBucket) throw new Error("STAGING_IMAGE_BUCKET is required");
  const connection = await mysql.createConnection(options.mysqlUrl);
  const ddb =
    options.ddb ??
    DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: process.env.AWS_REGION ?? "ap-northeast-1" })
    );
  const s3 = options.s3 ?? new S3Client({});
  const entities: ValidationReport["entities"] = {};
  const sourceItems = new Map<Entity, RecordItem[]>();
  const destinationItems = new Map<Entity, RecordItem[]>();
  try {
    for (const [entity, sourceTable, primaryKey] of sources) {
      const [rows] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM \`${sourceTable}\` ORDER BY \`${primaryKey}\``
      );
      const expected = rows.map((row) =>
        transform(entity, row as Record<string, unknown>)
      );
      const destination = await scanAll(ddb, `${prefix}${entity}`);
      const byId = new Map(destination.map((item) => [item.id, item]));
      let missingIds = 0;
      let mismatched = 0;
      for (const item of expected) {
        const existing = byId.get(item.id);
        if (!existing) missingIds += 1;
        else if (
          stable(comparable(entity, existing)) !==
          stable(comparable(entity, item))
        )
          mismatched += 1;
      }
      entities[entity] = {
        source: expected.length,
        destination: destination.length,
        missingIds,
        mismatched,
      };
      sourceItems.set(entity, expected);
      destinationItems.set(entity, destination);
    }
    const ids = (entity: Entity) =>
      new Set((destinationItems.get(entity) ?? []).map((item) => item.id));
    const relations = {
      articleAuthor: (sourceItems.get("Articles") ?? []).filter(
        (item) => !ids("Users").has(str(item.authorId))
      ).length,
      articleMarker: (sourceItems.get("Articles") ?? []).filter(
        (item) => !ids("Markers").has(str(item.markerId))
      ).length,
      likeUserOrArticle: (sourceItems.get("Likes") ?? []).filter(
        (item) =>
          !ids("Users").has(str(item.userId)) ||
          !ids("Articles").has(str(item.postId))
      ).length,
      goodArticle: (sourceItems.get("Goods") ?? []).filter(
        (item) => !ids("Articles").has(str(item.postId))
      ).length,
      mapAuthor: (sourceItems.get("SpecialMaps") ?? []).filter(
        (item) => !ids("Users").has(str(item.authorId))
      ).length,
      mapMarkerMap: (sourceItems.get("SpecialMapMarkers") ?? []).filter(
        (item) => !ids("SpecialMaps").has(str(item.specialMapId))
      ).length,
    };
    const [socialRows] = await connection.query<RowDataPacket[]>(
      "SELECT user_id, uid FROM `socialaccount_socialaccount` WHERE provider = 'twitter'"
    );
    const users = new Map(
      (destinationItems.get("Users") ?? []).map((item) => [item.id, item])
    );
    let twitterMissing = 0;
    let twitterMismatched = 0;
    for (const row of socialRows) {
      const user = users.get(str(row.user_id));
      if (!user) twitterMissing += 1;
      else if (
        str(user.socialProvider) !== "twitter" ||
        str(user.socialId) !== str(row.uid)
      )
        twitterMismatched += 1;
    }
    const keys = [...sourceItems.values()].flatMap((items) =>
      items.flatMap(imageKeys)
    );
    let imageMissing = 0;
    let checksumMismatched = 0;
    for (const key of keys) {
      try {
        if (
          (await checksum(s3, sourceBucket, key)) !==
          (await checksum(s3, destinationBucket, key))
        )
          checksumMismatched += 1;
      } catch {
        imageMissing += 1;
      }
    }
    return {
      entities,
      relations,
      twitterIdentities: {
        source: socialRows.length,
        missing: twitterMissing,
        mismatched: twitterMismatched,
      },
      images: {
        referenced: keys.length,
        missing: imageMissing,
        checksumMismatched,
      },
    };
  } finally {
    await connection.end();
  }
}
async function main() {
  const mysqlUrl = process.env.MYSQL_URL;
  if (!mysqlUrl) throw new Error("MYSQL_URL is required");
  if (arg("--sync-images-only")) {
    console.log(
      JSON.stringify(await syncReferencedImages({ mysqlUrl }), null, 2)
    );
    return;
  }
  if (arg("--validate-existing")) {
    console.log(
      JSON.stringify(await validateExistingMigration({ mysqlUrl }), null, 2)
    );
    return;
  }
  const report = await runMigration({
    mysqlUrl,
    dryRun: arg("--dry-run"),
    copyImages: arg("--copy-images"),
    validate: arg("--validate"),
  });
  console.log(
    JSON.stringify(
      {
        dryRun: arg("--dry-run"),
        copyImages: arg("--copy-images"),
        validate: arg("--validate"),
        report,
      },
      null,
      2
    )
  );
}
if (process.argv[1]?.endsWith("migrate.ts"))
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
