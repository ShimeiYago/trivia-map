import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import {
  createHash,
  createHmac,
  pbkdf2Sync,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import { Hono } from "hono";
import type { Context } from "hono";
import { cors } from "hono/cors";
import nodemailer from "nodemailer";
import OAuth from "oauth-1.0a";
import { apiContracts } from "@triviamap/contracts";
import { guessAreaNames } from "./areas.js";

type Item = Record<string, unknown> & { id: string };
export type Health = { ok: true; service: "triviamap-api" };
type TwitterRequest = (
  url: string,
  method: string,
  data?: Record<string, string>,
  token?: { key: string; secret: string }
) => Promise<string>;
export type ApiDependencies = {
  ddb: DynamoDBDocumentClient;
  secrets: SecretsManagerClient;
  s3: S3Client;
  twitterRequest?: TwitterRequest;
  sendMail?: (
    message: { from: string; to: string; subject: string; text: string },
    config: Record<string, string>
  ) => Promise<void>;
};
const defaultDependencies: ApiDependencies = {
  ddb: DynamoDBDocumentClient.from(new DynamoDBClient({})),
  secrets: new SecretsManagerClient({}),
  s3: new S3Client({}),
};
const dependencyContext = new AsyncLocalStorage<ApiDependencies>();
const dependencies = () => dependencyContext.getStore() ?? defaultDependencies;
const tableNames = {
  USERS: "TABLE_USERS",
  ARTICLES: "TABLE_ARTICLES",
  MARKERS: "TABLE_MARKERS",
  LIKES: "TABLE_LIKES",
  GOODS: "TABLE_GOODS",
  SPECIALMAPS: "TABLE_SPECIALMAPS",
  SPECIALMAPMARKERS: "TABLE_SPECIALMAPMARKERS",
  SESSIONS: "TABLE_SESSIONS",
  AUTHTOKENS: "TABLE_AUTHTOKENS",
  SEQUENCES: "TABLE_SEQUENCES",
  RATELIMITS: "TABLE_RATELIMITS",
} as const;
const table = (name: keyof typeof tableNames) =>
  process.env[tableNames[name]] ??
  `TriviaMap-stg-v2-${
    name === "SPECIALMAPS"
      ? "SpecialMaps"
      : name === "SPECIALMAPMARKERS"
      ? "SpecialMapMarkers"
      : name[0]
  }${name.slice(1).toLowerCase()}`;
const all = async (name: keyof typeof tableNames) => {
  const output: Item[] = [];
  let key: Record<string, unknown> | undefined;
  do {
    const page = await dependencies().ddb.send(
      new ScanCommand({ TableName: table(name), ExclusiveStartKey: key })
    );
    output.push(...((page.Items as Item[]) ?? []));
    key = page.LastEvaluatedKey;
  } while (key);
  return output;
};
const get = async (name: keyof typeof tableNames, id: string) =>
  (
    await dependencies().ddb.send(
      new GetCommand({ TableName: table(name), Key: { id } })
    )
  ).Item as Item | undefined;
const put = async (
  name: keyof typeof tableNames,
  item: Item,
  conditionExpression?: string
) => {
  const normalized =
    (name === "SESSIONS" || name === "AUTHTOKENS") &&
    typeof item.expiresAt === "number"
      ? { ...item, ttl: item.expiresAt, expiresAt: String(item.expiresAt) }
      : item;
  return dependencies().ddb.send(
    new PutCommand({
      TableName: table(name),
      Item: normalized,
      ConditionExpression: conditionExpression,
    })
  );
};
const putIfMissing = async (name: keyof typeof tableNames, item: Item) => {
  try {
    await put(name, item, "attribute_not_exists(id)");
    return true;
  } catch (error: unknown) {
    if ((error as { name?: string }).name === "ConditionalCheckFailedException")
      return false;
    throw error;
  }
};
const remove = async (name: keyof typeof tableNames, id: string) =>
  dependencies().ddb.send(
    new DeleteCommand({ TableName: table(name), Key: { id } })
  );
const text = (value: unknown) => String(value ?? "");
const num = (value: unknown) => Number(value);
const bool = (value: unknown) =>
  value === true || value === 1 || value === "1" || value === "true";
const date = (value: unknown) =>
  value
    ? new Date(text(value))
        .toLocaleString("ja-JP", {
          timeZone: "Asia/Tokyo",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        .replaceAll("-", "/")
        .replace(",", "")
    : null;
const media = (value: unknown) => {
  const key = text(value);
  return key ? (key.startsWith("uploads/") ? `/images/${key}` : key) : null;
};
const pagination = <T>(
  list: T[],
  page: number,
  limit: number,
  requestUrl: string
) => {
  const pageUrl = (targetPage: number) => {
    const url = new URL(requestUrl);
    url.searchParams.set("page", String(targetPage));
    const path = url.pathname.startsWith("/api/")
      ? url.pathname
      : `/api${url.pathname}`;
    return `${path}${url.search}`;
  };
  return {
    nextUrl: page * limit < list.length ? pageUrl(page + 1) : null,
    previousUrl: page > 1 ? pageUrl(page - 1) : null,
    totalRecords: list.length,
    totalPages: Math.ceil(list.length / limit),
    currentPage: page,
    startIndex: list.length ? (page - 1) * limit + 1 : 0,
    endIndex: Math.min(page * limit, list.length),
    results: list.slice((page - 1) * limit, page * limit),
  };
};
const pageOf = (value: string | undefined) => Math.max(1, Number(value ?? 1));
const limitOf = (value: string | undefined) =>
  Math.min(100, Math.max(1, Number(value ?? 10)));
const cookie = (header: string | undefined, name: string) =>
  header
    ?.split(";")
    .map((part) => part.trim().split("="))
    .find(([key]) => key === name)?.[1];
const signingKey = () => {
  const key = process.env.JWT_SECRET;
  if (!key) throw new Error("JWT_SECRET is required");
  return key;
};
const refreshHash = (value: string) =>
  createHash("sha256").update(value).digest("hex");
const tokenId = (kind: string, value: string) =>
  `${kind}#${createHash("sha256").update(value).digest("hex")}`;
const sign = (payload: object) => {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${createHmac("sha256", signingKey())
    .update(body)
    .digest("base64url")}`;
};
const session = (raw: string | undefined) => {
  try {
    if (!raw) return undefined;
    const [body, signature, extra] = raw.split(".");
    if (!body || !signature || extra) return undefined;
    const expected = createHmac("sha256", signingKey())
      .update(body)
      .digest("base64url");
    const actual = Buffer.from(signature);
    const wanted = Buffer.from(expected);
    if (actual.length !== wanted.length || !timingSafeEqual(actual, wanted))
      return undefined;
    const result = JSON.parse(Buffer.from(body, "base64url").toString()) as {
      userId?: unknown;
      exp?: unknown;
    };
    return typeof result.userId === "string" &&
      typeof result.exp === "number" &&
      result.exp > Date.now() / 1000
      ? { userId: result.userId, exp: result.exp }
      : undefined;
  } catch {
    return undefined;
  }
};
const secretJson = async (arn: string | undefined) =>
  arn
    ? (JSON.parse(
        (
          await dependencies().secrets.send(
            new GetSecretValueCommand({ SecretId: arn })
          )
        ).SecretString ?? "{}"
      ) as Record<string, string>)
    : {};
const twitterClient = async () => {
  const config = await secretJson(process.env.BACKEND_SECRET_ARN);
  if (!config.twitterApiKey || !config.twitterApiKeySecret)
    throw new Error("Twitter credentials are required");
  return new OAuth({
    consumer: { key: config.twitterApiKey, secret: config.twitterApiKeySecret },
    signature_method: "HMAC-SHA1",
    hash_function: (base, key) =>
      createHmac("sha1", key).update(base).digest("base64"),
  });
};
const defaultTwitterRequest: TwitterRequest = async (
  url,
  method,
  data = {},
  token
) => {
  const oauth = await twitterClient();
  const authorization = oauth.toHeader(
    oauth.authorize({ url, method, data }, token)
  );
  const response = await fetch(url, {
    method,
    headers: {
      ...authorization,
      ...(method === "POST"
        ? { "content-type": "application/x-www-form-urlencoded" }
        : {}),
    },
    ...(method === "POST" ? { body: new URLSearchParams(data) } : {}),
  });
  if (!response.ok)
    throw new Error(`Twitter request failed: ${response.status}`);
  return response.text();
};
const twitterRequest: TwitterRequest = (url, method, data = {}, token) =>
  (dependencies().twitterRequest ?? defaultTwitterRequest)(
    url,
    method,
    data,
    token
  );
const allowed = async (email: string) =>
  text((await secretJson(process.env.MAIL_SECRET_ARN)).allowedRecipients)
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase());
const siteName = () =>
  process.env.STAGE?.startsWith("stg") ? "TriviaMap（staging）" : "TriviaMap";
const verificationEmail = (url: string) => ({
  subject: `【${siteName()}】メールアドレスの確認`,
  content: `※このメールはシステムから自動送信されています。

${siteName()}へのユーザー登録をお申し込みいただき、ありがとうございます。

ご本人様確認のため、以下のURLを開いてアカウント登録を完了してください。
このURLの有効期限は24時間です。

${url}

このメールは送信専用です。返信いただいても回答できません。
お申し込みに心当たりがない場合は、このメールを破棄してください。`,
});
const passwordResetEmail = (url: string) => ({
  subject: `【${siteName()}】パスワード再設定`,
  content: `※このメールはシステムから自動送信されています。

${siteName()}のパスワード再設定依頼を受け付けました。

以下のURLを開いて、新しいパスワードを設定してください。
このURLの有効期限は1時間です。

${url}

このメールは送信専用です。返信いただいても回答できません。
再設定を依頼していない場合は、このメールを破棄してください。`,
});
const passwordHash = (password: string) => {
  const salt = randomBytes(18).toString("base64url");
  return `scrypt$${salt}$${scryptSync(password, salt, 32).toString("base64")}`;
};
const passwordMatches = (password: string, stored: unknown) => {
  const [kind, a, b, c] = text(stored).split("$");
  if (kind === "pbkdf2_sha256" && a && b && c)
    return timingSafeEqual(
      Buffer.from(
        pbkdf2Sync(password, b, Number(a), 32, "sha256").toString("base64")
      ),
      Buffer.from(c)
    );
  if (kind === "scrypt" && a && b)
    return timingSafeEqual(
      Buffer.from(scryptSync(password, a, 32).toString("base64")),
      Buffer.from(b)
    );
  return false;
};
const mail = async (recipient: string, subject: string, content: string) => {
  if (!(await allowed(recipient))) return false;
  const config = await secretJson(process.env.MAIL_SECRET_ARN);
  const message = {
    from: config.from ?? config.smtpUser,
    to: recipient,
    subject,
    text: content,
  };
  const sender = dependencies().sendMail;
  if (sender) await sender(message, config);
  else {
    const transport = nodemailer.createTransport({
      host: config.smtpHost,
      port: Number(config.smtpPort ?? 587),
      secure: false,
      auth: { user: config.smtpUser, pass: config.smtpPassword },
    });
    await transport.sendMail(message);
  }
  return true;
};
const upload = async (file: unknown, prefix: string) => {
  if (!(file instanceof File) || !process.env.IMAGE_BUCKET) return null;
  if (file.size > 1_500_000) throw new Error("image too large");
  if (
    !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)
  )
    throw new Error("unsupported image type");
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `uploads/${prefix}/${randomBytes(10).toString(
    "base64url"
  )}-${safe}`;
  await dependencies().s3.send(
    new PutObjectCommand({
      Bucket: process.env.IMAGE_BUCKET,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
    })
  );
  return key;
};
const csrf = (c: { req: { header: (name: string) => string | undefined } }) => {
  const value = cookie(c.req.header("cookie"), "trivia-map-csrf");
  const origin = c.req.header("origin");
  return (
    !!value &&
    value === c.req.header("x-csrf-token") &&
    origin === process.env.FRONTEND_ORIGIN
  );
};
const userView = (user: Item, includeEmail = false) => ({
  userId: num(user.userId),
  ...(includeEmail ? { email: text(user.email) } : {}),
  nickname: text(user.nickname),
  icon: media(user.socialIcon || user.icon),
  isSocialAccount: !text(user.email),
  url: user.url ? text(user.url) : null,
});
const publicMarker = (marker: Item, articles: Item[]) => {
  const related = articles.filter(
    (article) =>
      !bool(article.isDraft) && text(article.markerId) === text(marker.markerId)
  );
  const park = text(marker.park) as "L" | "S";
  return {
    markerId: num(marker.markerId),
    lat: num(marker.lat),
    lng: num(marker.lng),
    park,
    numberOfPublicArticles: {
      total: related.length,
      eachCategory: Array.from(
        { length: 7 },
        (_, category) =>
          related.filter((article) => num(article.category) === category).length
      ),
    },
    areaNames: guessAreaNames(num(marker.lat), num(marker.lng), park),
  };
};
const articleView = (
  article: Item,
  author?: Item,
  marker?: Item,
  goods: Item[] = []
) => ({
  postId: num(article.postId),
  title: text(article.title),
  description: text(article.description),
  marker: marker ? publicMarker(marker, []) : num(article.markerId),
  category: num(article.category),
  image: media(article.image),
  isDraft: bool(article.isDraft),
  author: author ? userView(author) : num(article.authorId),
  createdAt: date(article.createdAt),
  updatedAt: date(article.updatedAt),
  numberOfGoods: goods.filter(
    (good) => text(good.postId) === text(article.postId)
  ).length,
});
const nextId = async (entity: string, items: Item[], field: string) => {
  const floor = Math.max(0, ...items.map((item) => num(item[field])));
  const result = await dependencies().ddb.send(
    new UpdateCommand({
      TableName: table("SEQUENCES"),
      Key: { id: entity },
      UpdateExpression: "SET #value = if_not_exists(#value, :floor) + :one",
      ExpressionAttributeNames: { "#value": "value" },
      ExpressionAttributeValues: { ":floor": floor, ":one": 1 },
      ReturnValues: "UPDATED_NEW",
    })
  );
  return String(result.Attributes?.value);
};
const deleteImage = async (key: unknown) => {
  const value = text(key);
  if (value.startsWith("uploads/") && process.env.IMAGE_BUCKET)
    await dependencies().s3.send(
      new DeleteObjectCommand({ Bucket: process.env.IMAGE_BUCKET, Key: value })
    );
};
const revokeSessions = async (userId: string) => {
  const sessions = await all("SESSIONS");
  await Promise.all(
    sessions
      .filter((record) => text(record.userId) === userId)
      .map((record) => remove("SESSIONS", record.id))
  );
};
const rateLimit = async (
  action: string,
  ip: string,
  target: string,
  windowSeconds: number,
  limit: number
) => {
  const now = Math.floor(Date.now() / 1000);
  const bucket = Math.floor(now / windowSeconds);
  const identity = createHash("sha256")
    .update(`${ip}\0${target.toLowerCase()}`)
    .digest("hex");
  try {
    await dependencies().ddb.send(
      new UpdateCommand({
        TableName: table("RATELIMITS"),
        Key: { id: `${action}#${identity}#${bucket}` },
        UpdateExpression:
          "SET #ttl = if_not_exists(#ttl, :ttl) ADD #count :one",
        ConditionExpression: "attribute_not_exists(#count) OR #count < :limit",
        ExpressionAttributeNames: { "#ttl": "ttl", "#count": "count" },
        ExpressionAttributeValues: {
          ":ttl": (bucket + 1) * windowSeconds,
          ":one": 1,
          ":limit": limit,
        },
      })
    );
    return true;
  } catch (error) {
    if ((error as { name?: string }).name === "ConditionalCheckFailedException")
      return false;
    throw error;
  }
};
const compareArticlePreviews =
  (order: string | undefined) => (a: Item, b: Item) => {
    if (order === "oldest") {
      return (
        text(a.createdAt).localeCompare(text(b.createdAt)) ||
        num(a.postId) - num(b.postId)
      );
    }
    if (order === "popular") {
      const aRank = num(a.popularityRank) || Number.POSITIVE_INFINITY;
      const bRank = num(b.popularityRank) || Number.POSITIVE_INFINITY;
      return (
        aRank - bRank ||
        text(b.createdAt).localeCompare(text(a.createdAt)) ||
        num(b.postId) - num(a.postId)
      );
    }
    return (
      text(b.createdAt).localeCompare(text(a.createdAt)) ||
      num(b.postId) - num(a.postId)
    );
  };

export const createApp = (overrides: Partial<ApiDependencies> = {}) => {
  const app = new Hono();
  const appDependencies = { ...defaultDependencies, ...overrides };
  app.use("*", async (_c, next) =>
    dependencyContext.run(appDependencies, next)
  );
  app.use(
    "*",
    cors({
      origin: process.env.FRONTEND_ORIGIN ?? "",
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
      credentials: true,
    })
  );
  app.use("*", async (c, next) => {
    if (
      process.env.ORIGIN_VERIFY_TOKEN &&
      c.req.header("x-triviamap-origin") !== process.env.ORIGIN_VERIFY_TOKEN
    )
      return c.json({ detail: "Not found" }, 404);
    await next();
  });
  app.use("*", async (c, next) => {
    const pathname = new URL(c.req.url).pathname.replace(/\/$/, "");
    const contract = apiContracts.find(
      ({ method, path }) =>
        method === c.req.method &&
        new RegExp(
          `^${path.replace(/:[^/]+/g, "([^/]+)").replace(/\/$/, "")}$`
        ).test(pathname)
    );
    if (contract) {
      const routePath = contract.path;
      const names = [...routePath.matchAll(/:([^/]+)/g)].map(
        (match) => match[1]
      );
      const values =
        pathname
          .match(
            new RegExp(
              `^${routePath.replace(/:[^/]+/g, "([^/]+)").replace(/\/$/, "")}$`
            )
          )
          ?.slice(1) ?? [];
      const shape = (
        contract.request as unknown as {
          shape?: Record<
            string,
            { safeParse: (value: unknown) => { success: boolean } }
          >;
        }
      ).shape;
      const params = Object.fromEntries(
        names.map((name, index) => [name, values[index]])
      );
      const query = Object.fromEntries(new URL(c.req.url).searchParams);
      if (
        (shape?.params && !shape.params.safeParse(params).success) ||
        (shape?.query && !shape.query.safeParse(query).success)
      )
        return c.json({ detail: "入力内容を確認してください。" }, 400);
    }
    await next();
  });
  const currentUser = async (c: {
    req: { header: (name: string) => string | undefined };
  }) => {
    const state = session(cookie(c.req.header("cookie"), "trivia-map-auth"));
    const user = state && (await get("USERS", state.userId));
    return user && bool(user.isActive) ? user : undefined;
  };
  const visibleArticle = async (article: Item | undefined, user?: Item) => {
    if (!article) return false;
    const author = await get("USERS", text(article.authorId));
    return (
      !!author &&
      bool(author.isActive) &&
      (!bool(article.isDraft) || text(article.authorId) === text(user?.id))
    );
  };
  const visibleMap = async (map: Item | undefined, user?: Item) => {
    if (!map) return false;
    const author = await get("USERS", text(map.authorId));
    return (
      !!author &&
      bool(author.isActive) &&
      (bool(map.isPublic) || text(map.authorId) === text(user?.id))
    );
  };
  const viewerIp = (c: Context) =>
    c.req.header("x-triviamap-viewer-ip") ?? "unknown";

  app.get("/health", (c) =>
    c.json<Health>({ ok: true, service: "triviamap-api" })
  );
  app.get("/auths/csrf/", (c) => {
    const token = randomBytes(24).toString("base64url");
    c.header(
      "Set-Cookie",
      `trivia-map-csrf=${token}; Secure; SameSite=Lax; Path=/; Max-Age=86400`
    );
    return c.json({ csrfToken: token });
  });
  app.post("/auths/login/", async (c) => {
    const body = await c.req.json<{ email?: string; password?: string }>();
    if (!(await rateLimit("login", viewerIp(c), text(body.email), 900, 10)))
      return c.json({ detail: "しばらく待ってから再度お試しください。" }, 429);
    const users = await all("USERS");
    const user = users.find(
      (item) =>
        text(item.email).toLowerCase() === text(body.email).toLowerCase() &&
        passwordMatches(text(body.password), item.password)
    );
    if (!user || !bool(user.isActive))
      return c.json(
        {
          non_field_errors: [
            "メールアドレスまたはパスワードが正しくありません。",
          ],
        },
        400
      );
    if (text(user.password).startsWith("pbkdf2_sha256$"))
      await put("USERS", {
        ...user,
        password: passwordHash(text(body.password)),
      });
    const access = sign({
      userId: text(user.id),
      exp: Math.floor(Date.now() / 1000) + 900,
    });
    const refresh = randomBytes(48).toString("base64url");
    const expiresAt = Math.floor(Date.now() / 1000) + 1209600;
    await put("SESSIONS", {
      id: refreshHash(refresh),
      entity: "Session",
      userId: text(user.id),
      expiresAt,
      expiryKey: String(expiresAt).padStart(10, "0"),
    });
    c.header(
      "Set-Cookie",
      `trivia-map-auth=${access}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=900`
    );
    c.header(
      "Set-Cookie",
      `trivia-map-refresh-auth=${refresh}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=1209600`,
      { append: true }
    );
    return c.json({
      user: userView(user, true),
      access_token_expiration: new Date(Date.now() + 900000).toISOString(),
      refresh_token_expiration: new Date(expiresAt * 1000).toISOString(),
    });
  });
  app.post("/auths/registration/", async (c) => {
    const body = await c.req.json<{
      email?: string;
      nickname?: string;
      password1?: string;
      password2?: string;
    }>();
    const email = text(body.email).toLowerCase();
    if (!(await rateLimit("signup", viewerIp(c), email, 3600, 5)))
      return c.json({ detail: "しばらく待ってから再度お試しください。" }, 429);
    const errors: Record<string, string[]> = {};
    if (!(await allowed(email)))
      errors.email = ["このメールアドレスはstaging環境では使用できません。"];
    if (!body.nickname || text(body.nickname).length > 20)
      errors.nickname = ["ニックネームは1〜20文字で入力してください。"];
    if (!body.password1 || text(body.password1).length < 8)
      errors.password1 = ["パスワードは8文字以上で入力してください。"];
    if (body.password1 !== body.password2)
      errors.password2 = ["パスワードが一致しません。"];
    const users = await all("USERS");
    if (users.some((user) => text(user.email).toLowerCase() === email))
      errors.email = ["このメールアドレスは既に登録されています。"];
    if (Object.keys(errors).length) return c.json(errors, 400);
    const id = await nextId("User", users, "userId");
    const key = randomBytes(32).toString("base64url");
    const expiresAt = Math.floor(Date.now() / 1000) + 86400;
    let userCreated = false;
    let tokenCreated = false;
    try {
      await put(
        "USERS",
        {
          id,
          entity: "User",
          userId: id,
          email,
          username: email,
          nickname: text(body.nickname),
          password: passwordHash(text(body.password1)),
          isActive: false,
          dateJoined: new Date().toISOString(),
        },
        "attribute_not_exists(id)"
      );
      userCreated = true;
      await put("AUTHTOKENS", {
        id: tokenId("verify", key),
        entity: "AuthToken",
        userId: id,
        kind: "verify",
        expiresAt,
        expiryKey: String(expiresAt).padStart(10, "0"),
      });
      tokenCreated = true;
      const message = verificationEmail(
        `${process.env.FRONTEND_ORIGIN}/verify-email/${key}`
      );
      await mail(email, message.subject, message.content);
      return c.json({}, 201);
    } catch {
      await Promise.allSettled([
        ...(tokenCreated ? [remove("AUTHTOKENS", tokenId("verify", key))] : []),
        ...(userCreated ? [remove("USERS", id)] : []),
      ]);
      return c.json({ detail: "Registration could not be completed." }, 502);
    }
  });
  app.post("/auths/registration/verify-email/", async (c) => {
    const body = await c.req.json<{ key?: string }>();
    const token =
      body.key && (await get("AUTHTOKENS", tokenId("verify", body.key)));
    if (
      !token ||
      text(token.kind) !== "verify" ||
      num(token.expiresAt) < Date.now() / 1000
    )
      return c.json({ key: ["無効な認証キーです。"] }, 400);
    const user = await get("USERS", text(token.userId));
    if (!user) return c.json({ key: ["無効な認証キーです。"] }, 400);
    await put("USERS", { ...user, isActive: true });
    await remove("AUTHTOKENS", text(token.id));
    return c.json({});
  });
  app.post("/auths/registration/resend-email/", async (c) => {
    const body = await c.req.json<{ email?: string }>();
    if (!(await rateLimit("resend", viewerIp(c), text(body.email), 3600, 5)))
      return c.json({});
    const users = await all("USERS");
    const user = users.find(
      (item) =>
        text(item.email).toLowerCase() === text(body.email).toLowerCase()
    );
    if (user && (await allowed(text(user.email)))) {
      const key = randomBytes(32).toString("base64url");
      const expiresAt = Math.floor(Date.now() / 1000) + 86400;
      await put("AUTHTOKENS", {
        id: tokenId("verify", key),
        entity: "AuthToken",
        userId: text(user.id),
        kind: "verify",
        expiresAt,
        expiryKey: String(expiresAt).padStart(10, "0"),
      });
      const message = verificationEmail(
        `${process.env.FRONTEND_ORIGIN}/verify-email/${key}`
      );
      await mail(text(user.email), message.subject, message.content);
    }
    return c.json({});
  });
  app.post("/auths/password/reset/", async (c) => {
    const body = await c.req.json<{ email?: string }>();
    if (!(await rateLimit("reset", viewerIp(c), text(body.email), 3600, 5)))
      return c.json({});
    const user = (await all("USERS")).find(
      (item) =>
        text(item.email).toLowerCase() === text(body.email).toLowerCase()
    );
    if (user && (await allowed(text(user.email)))) {
      const token = randomBytes(32).toString("base64url");
      const expiresAt = Math.floor(Date.now() / 1000) + 3600;
      await put("AUTHTOKENS", {
        id: tokenId("reset", token),
        entity: "AuthToken",
        userId: text(user.id),
        kind: "reset",
        expiresAt,
        expiryKey: String(expiresAt).padStart(10, "0"),
      });
      const message = passwordResetEmail(
        `${process.env.FRONTEND_ORIGIN}/reset-password/${user.id}/${token}`
      );
      await mail(text(user.email), message.subject, message.content);
    }
    return c.json({});
  });
  app.post("/auths/password/reset/confirm/", async (c) => {
    const body = await c.req.json<{
      uid?: string;
      token?: string;
      new_password1?: string;
      new_password2?: string;
    }>();
    const record =
      body.token && (await get("AUTHTOKENS", tokenId("reset", body.token)));
    if (
      !record ||
      text(record.kind) !== "reset" ||
      text(record.userId) !== text(body.uid) ||
      num(record.expiresAt) < Date.now() / 1000 ||
      !body.new_password1 ||
      body.new_password1 !== body.new_password2
    )
      return c.json({ token: ["無効なリセット情報です。"] }, 400);
    const user = await get("USERS", text(body.uid));
    if (!user) return c.json({ uid: ["無効なユーザーです。"] }, 400);
    await put("USERS", { ...user, password: passwordHash(body.new_password1) });
    await remove("AUTHTOKENS", text(record.id));
    await revokeSessions(text(user.id));
    return c.json({});
  });
  app.post("/auths/twitter/request-token", async (c) => {
    await c.req.json().catch(() => ({}));
    if (!(await rateLimit("twitter", viewerIp(c), "", 3600, 20)))
      return c.json({ detail: "しばらく待ってから再度お試しください。" }, 429);
    try {
      const body = await twitterRequest(
        "https://api.twitter.com/oauth/request_token",
        "POST",
        { oauth_callback: "https://stg.triviamap.jp/twitter-auth-callback" }
      );
      const values = new URLSearchParams(body);
      const oauthToken = values.get("oauth_token");
      const oauthTokenSecret = values.get("oauth_token_secret");
      if (!oauthToken || !oauthTokenSecret)
        return c.json(
          { detail: "Twitter authorization could not be started." },
          502
        );
      const expiresAt = Math.floor(Date.now() / 1000) + 600;
      await put("AUTHTOKENS", {
        id: tokenId("twitter", oauthToken),
        entity: "AuthToken",
        kind: "twitter-request",
        oauthToken,
        oauthTokenSecret,
        expiresAt,
        expiryKey: String(expiresAt).padStart(10, "0"),
      });
      return c.json({
        authenticateUrl: `https://api.twitter.com/oauth/authenticate?oauth_token=${encodeURIComponent(
          oauthToken
        )}`,
      });
    } catch {
      return c.json(
        { detail: "Twitter authorization could not be started." },
        502
      );
    }
  });
  app.post("/auths/twitter/access-token", async (c) => {
    const body = await c.req.json<{
      oauthToken?: string;
      oauthVerifier?: string;
    }>();
    const record =
      body.oauthToken &&
      (await get("AUTHTOKENS", tokenId("twitter", body.oauthToken)));
    if (
      !record ||
      text(record.kind) !== "twitter-request" ||
      num(record.expiresAt) <= Date.now() / 1000 ||
      !body.oauthVerifier
    )
      return c.json({ detail: "Invalid Twitter authorization." }, 400);
    try {
      const result = await twitterRequest(
        "https://api.twitter.com/oauth/access_token",
        "POST",
        { oauth_verifier: body.oauthVerifier },
        { key: text(record.oauthToken), secret: text(record.oauthTokenSecret) }
      );
      const values = new URLSearchParams(result);
      const accessToken = values.get("oauth_token");
      const accessTokenSecret = values.get("oauth_token_secret");
      await remove("AUTHTOKENS", text(record.id));
      if (!accessToken || !accessTokenSecret)
        return c.json(
          { detail: "Twitter authorization could not be completed." },
          502
        );
      return c.json({ accessToken, accessTokenSecret });
    } catch {
      return c.json(
        { detail: "Twitter authorization could not be completed." },
        502
      );
    }
  });
  app.post("/auths/twitter/login", async (c) => {
    const body = await c.req.json<{
      access_token?: string;
      token_secret?: string;
    }>();
    if (!body.access_token || !body.token_secret)
      return c.json(
        { non_field_errors: ["Twitter authorization is required."] },
        400
      );
    try {
      const raw = await twitterRequest(
        "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
        "GET",
        {},
        { key: body.access_token, secret: body.token_secret }
      );
      const profile = JSON.parse(raw) as {
        id_str?: string;
        name?: string;
        profile_image_url_https?: string;
      };
      if (!profile.id_str)
        return c.json({ detail: "Twitter profile could not be read." }, 502);
      const users = await all("USERS");
      let user = users.find(
        (item) =>
          text(item.socialProvider) === "twitter" &&
          text(item.socialId) === profile.id_str
      );
      if (!user) {
        const id = await nextId("User", users, "userId");
        user = {
          id,
          entity: "User",
          userId: id,
          username: `twitter-${profile.id_str}`,
          nickname: profile.name?.slice(0, 20) || "Twitter user",
          socialProvider: "twitter",
          socialId: profile.id_str,
          socialIcon: profile.profile_image_url_https ?? null,
          isActive: true,
          dateJoined: new Date().toISOString(),
        };
        await put("USERS", user, "attribute_not_exists(id)");
      }
      const access = sign({
        userId: text(user.id),
        exp: Math.floor(Date.now() / 1000) + 900,
      });
      const refresh = randomBytes(48).toString("base64url");
      const expiresAt = Math.floor(Date.now() / 1000) + 1209600;
      await put("SESSIONS", {
        id: refreshHash(refresh),
        entity: "Session",
        userId: text(user.id),
        expiresAt,
        expiryKey: String(expiresAt).padStart(10, "0"),
      });
      c.header(
        "Set-Cookie",
        `trivia-map-auth=${access}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=900`
      );
      c.header(
        "Set-Cookie",
        `trivia-map-refresh-auth=${refresh}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=1209600`,
        { append: true }
      );
      return c.json({
        user: userView(user, true),
        access_token_expiration: new Date(Date.now() + 900000).toISOString(),
        refresh_token_expiration: new Date(expiresAt * 1000).toISOString(),
      });
    } catch {
      return c.json({ detail: "Twitter profile could not be read." }, 502);
    }
  });
  app.get("/auths/user/", async (c) => {
    const user = await currentUser(c);
    return user
      ? c.json(userView(user, true))
      : c.json(
          { detail: "Authentication credentials were not provided." },
          401
        );
  });
  app.on(["PUT", "PATCH"], "/auths/user/update/", async (c) => {
    const user = await currentUser(c);
    if (!user || !csrf(c))
      return c.json(
        { detail: "Authentication credentials were not provided." },
        401
      );
    const body = await c.req.parseBody();
    const nickname = text(body.nickname);
    const url = text(body.url);
    if (!nickname || nickname.length > 20)
      return c.json(
        { nickname: ["ニックネームは1〜20文字で入力してください。"] },
        400
      );
    const icon =
      body.icon instanceof File
        ? await upload(body.icon, `users/${user.id}/icons`)
        : user.icon;
    await put("USERS", { ...user, nickname, url: url || null, icon });
    return c.json(userView({ ...user, nickname, url, icon }, true));
  });
  app.post("/auths/password/change/", async (c) => {
    const user = await currentUser(c);
    if (!user || !csrf(c))
      return c.json(
        { detail: "Authentication credentials were not provided." },
        401
      );
    const body = await c.req.json<{
      new_password1?: string;
      new_password2?: string;
    }>();
    if (
      !body.new_password1 ||
      body.new_password1.length < 8 ||
      body.new_password1 !== body.new_password2
    )
      return c.json({ new_password2: ["パスワードを確認してください。"] }, 400);
    await put("USERS", { ...user, password: passwordHash(body.new_password1) });
    await revokeSessions(text(user.id));
    return c.json({});
  });
  app.post("/auths/token/verify/", async (c) => {
    const body = await c.req.json<{ token?: string }>();
    return session(body.token)
      ? c.json({})
      : c.json({ detail: "Token is invalid or expired" }, 401);
  });
  app.put("/auths/deactivate/", async (c) => {
    const user = await currentUser(c);
    if (!user || !csrf(c))
      return c.json(
        { detail: "Authentication credentials were not provided." },
        401
      );
    await put("USERS", { ...user, isActive: false });
    await revokeSessions(text(user.id));
    return c.json({});
  });
  app.post("/auths/token/refresh/", async (c) => {
    if (!csrf(c)) return c.json({ detail: "CSRF verification failed." }, 403);
    const raw = cookie(c.req.header("cookie"), "trivia-map-refresh-auth");
    const record = raw && (await get("SESSIONS", refreshHash(raw)));
    if (!record || num(record.expiresAt) <= Date.now() / 1000)
      return c.json({ detail: "Invalid refresh token" }, 401);
    const refreshUser = await get("USERS", text(record.userId));
    if (!refreshUser || !bool(refreshUser.isActive)) {
      await remove("SESSIONS", text(record.id));
      return c.json({ detail: "Invalid refresh token" }, 401);
    }
    await remove("SESSIONS", text(record.id));
    const refresh = randomBytes(48).toString("base64url");
    const expiresAt = Math.floor(Date.now() / 1000) + 1209600;
    await put("SESSIONS", {
      id: refreshHash(refresh),
      entity: "Session",
      userId: text(record.userId),
      expiresAt,
      expiryKey: String(expiresAt).padStart(10, "0"),
    });
    const access = sign({
      userId: text(record.userId),
      exp: Math.floor(Date.now() / 1000) + 900,
    });
    c.header(
      "Set-Cookie",
      `trivia-map-auth=${access}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=900`
    );
    c.header(
      "Set-Cookie",
      `trivia-map-refresh-auth=${refresh}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=1209600`,
      { append: true }
    );
    return c.json({
      access_token_expiration: new Date(Date.now() + 900000).toISOString(),
      refresh_token_expiration: new Date(expiresAt * 1000).toISOString(),
    });
  });
  app.post("/auths/logout/", async (c) => {
    if (!csrf(c)) return c.json({ detail: "CSRF verification failed." }, 403);
    const raw = cookie(c.req.header("cookie"), "trivia-map-refresh-auth");
    if (raw) await remove("SESSIONS", refreshHash(raw));
    c.header(
      "Set-Cookie",
      "trivia-map-auth=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0"
    );
    c.header(
      "Set-Cookie",
      "trivia-map-refresh-auth=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0",
      { append: true }
    );
    return c.json({});
  });
  app.post("/inquiry/", async (c) => {
    const body = await c.req.json<{
      email?: string;
      name?: string;
      tag?: string;
      message?: string;
    }>();
    if (!(await rateLimit("inquiry", viewerIp(c), text(body.email), 3600, 5)))
      return c.json({ detail: "しばらく待ってから再度お試しください。" }, 429);
    if (!body.email || !body.name || !body.message)
      return c.json({ detail: "入力内容を確認してください。" }, 400);
    const config = await secretJson(process.env.MAIL_SECRET_ARN);
    await mail(
      text(config.inquiryRecipient),
      `【${siteName()}】お問い合わせ: ${text(body.tag)}`,
      `from: ${text(body.name)} <${text(body.email)}>\n\n${text(body.message)}`
    );
    return c.json(
      {
        email: body.email,
        name: body.name,
        tag: body.tag ?? "",
        message: body.message,
      },
      201
    );
  });

  app.get("/articles/public/previews", async (c) => {
    const [articles, goods, users, markers] = await Promise.all([
      all("ARTICLES"),
      all("GOODS"),
      all("USERS"),
      all("MARKERS"),
    ]);
    const activeUsers = new Set(
      users.filter((user) => bool(user.isActive)).map((user) => text(user.id))
    );
    const markerById = new Map(
      markers.map((marker) => [text(marker.id), marker])
    );
    const keywords = (c.req.query("keywords") ?? c.req.query("keyword") ?? "")
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);
    const filtered = articles
      .filter(
        (article) =>
          !bool(article.isDraft) &&
          activeUsers.has(text(article.authorId)) &&
          (!c.req.query("category") ||
            text(article.category) === c.req.query("category")) &&
          (!c.req.query("marker") ||
            text(article.markerId) === c.req.query("marker")) &&
          (!c.req.query("user") ||
            text(article.authorId) === c.req.query("user")) &&
          (!c.req.query("park") ||
            text(markerById.get(text(article.markerId))?.park) ===
              c.req.query("park")) &&
          keywords.every((keyword) =>
            `${text(article.title)} ${text(article.description)}`
              .toLowerCase()
              .includes(keyword)
          )
      )
      .sort(compareArticlePreviews(c.req.query("order")))
      .map((article) => ({
        postId: num(article.postId),
        title: text(article.title),
        image: media(article.image),
        category: num(article.category),
        createdAt: date(article.createdAt),
        numberOfGoods: goods.filter(
          (good) => text(good.postId) === text(article.postId)
        ).length,
      }));
    return c.json(
      pagination(
        filtered,
        pageOf(c.req.query("page")),
        limitOf(c.req.query("limit")),
        c.req.url
      )
    );
  });
  app.get("/articles/detail/:id", async (c) => {
    const [article, user] = await Promise.all([
      get("ARTICLES", c.req.param("id")),
      currentUser(c),
    ]);
    if (!(await visibleArticle(article, user)))
      return c.json({ detail: "Not found" }, 404);
    const [author, marker, goods] = await Promise.all([
      get("USERS", text(article!.authorId)),
      get("MARKERS", text(article!.markerId)),
      all("GOODS"),
    ]);
    return c.json(articleView(article!, author, marker, goods));
  });
  app.get("/articles/categories", (c) =>
    c.json([
      { categoryId: 0, categoryName: "その他" },
      { categoryId: 1, categoryName: "隠れミッキー" },
      { categoryId: 2, categoryName: "バックグラウンドストーリー" },
      { categoryId: 3, categoryName: "おすすめ写真スポット" },
      { categoryId: 4, categoryName: "ショーパレ" },
      { categoryId: 5, categoryName: "キャラグリ" },
      { categoryId: 6, categoryName: "パーク攻略法" },
    ])
  );
  app.get("/articles/sitemap", async (c) => {
    const [articles, users] = await Promise.all([
      all("ARTICLES"),
      all("USERS"),
    ]);
    const active = new Set(
      users.filter((user) => bool(user.isActive)).map((user) => text(user.id))
    );
    return c.json(
      articles
        .filter(
          (article) =>
            !bool(article.isDraft) && active.has(text(article.authorId))
        )
        .map((article) => ({
          postId: num(article.postId),
          updatedAt: text(article.updatedAt).slice(0, 10),
        }))
    );
  });
  app.get("/markers/:park", async (c) => {
    const [markers, articles, users] = await Promise.all([
      all("MARKERS"),
      all("ARTICLES"),
      all("USERS"),
    ]);
    const active = new Set(
      users.filter((user) => bool(user.isActive)).map((user) => text(user.id))
    );
    const publicArticles = articles.filter(
      (article) => !bool(article.isDraft) && active.has(text(article.authorId))
    );
    const output = markers
      .filter((marker) => text(marker.park) === c.req.param("park"))
      .filter((marker) => {
        const related = publicArticles.filter(
          (article) => text(article.markerId) === text(marker.markerId)
        );
        return (
          related.length > 0 &&
          (!c.req.query("category") ||
            related.some(
              (article) => text(article.category) === c.req.query("category")
            )) &&
          (!c.req.query("user") ||
            related.some(
              (article) => text(article.authorId) === c.req.query("user")
            ))
        );
      })
      .map((marker) => publicMarker(marker, publicArticles));
    return c.json(
      pagination(
        output,
        pageOf(c.req.query("page")),
        limitOf(c.req.query("limit")),
        c.req.url
      )
    );
  });
  const guessArea = async (c: {
    req: { json: <T>() => Promise<T> };
    json: (value: { areaNames: string[] }, status?: 200 | 400) => Response;
  }) => {
    const body = await c.req.json<{
      lat?: unknown;
      lng?: unknown;
      park?: unknown;
    }>();
    const lat = num(body.lat);
    const lng = num(body.lng);
    const park = text(body.park);
    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      (park !== "L" && park !== "S")
    )
      return c.json({ areaNames: [] }, 400);
    return c.json({ areaNames: guessAreaNames(lat, lng, park) });
  };
  app.post("/guess-area", guessArea);
  app.get("/users/:id", async (c) => {
    const user = await get("USERS", c.req.param("id"));
    return user && bool(user.isActive)
      ? c.json(userView(user))
      : c.json({ detail: "Not found" }, 404);
  });
  app.get("/goods/check/:id", async (c) => {
    const article = await get("ARTICLES", c.req.param("id"));
    if (!(await visibleArticle(article)))
      return c.json({ detail: "Not found" }, 404);
    const salt = process.env.GOOD_SALT;
    if (!salt) throw new Error("GOOD_SALT is required");
    const ip = createHmac("sha256", salt).update(viewerIp(c)).digest("hex");
    return c.json({
      haveAddedGood: !!(await get("GOODS", `${ip}#${c.req.param("id")}`)),
    });
  });
  app.post("/goods/toggle/:id", async (c) => {
    const article = await get("ARTICLES", c.req.param("id"));
    if (!(await visibleArticle(article)))
      return c.json({ detail: "Not found" }, 404);
    const salt = process.env.GOOD_SALT;
    if (!salt) throw new Error("GOOD_SALT is required");
    const ip = createHmac("sha256", salt).update(viewerIp(c)).digest("hex");
    const id = `${ip}#${c.req.param("id")}`;
    if (await get("GOODS", id)) {
      await remove("GOODS", id);
      return c.json({ haveAddedGood: false });
    }
    const created = await putIfMissing("GOODS", {
      id,
      entity: "Good",
      goodId: id,
      ipHash: ip,
      postId: c.req.param("id"),
    });
    return c.json({ haveAddedGood: created });
  });
  app.get("/likes/check/:id", async (c) => {
    const user = await currentUser(c);
    const article = await get("ARTICLES", c.req.param("id"));
    if (!(await visibleArticle(article)))
      return c.json({ detail: "Not found" }, 404);
    return user
      ? c.json({
          haveLiked: !!(await get("LIKES", `${user.id}#${c.req.param("id")}`)),
        })
      : c.json(
          { detail: "Authentication credentials were not provided." },
          401
        );
  });
  app.post("/likes/toggle/:id", async (c) => {
    const user = await currentUser(c);
    if (!user || !csrf(c))
      return c.json(
        { detail: "Authentication credentials were not provided." },
        401
      );
    const article = await get("ARTICLES", c.req.param("id"));
    if (!(await visibleArticle(article)))
      return c.json({ detail: "Not found" }, 404);
    const id = `${user.id}#${c.req.param("id")}`;
    if (await get("LIKES", id)) {
      await remove("LIKES", id);
      return c.json({ haveLiked: false });
    }
    const created = await putIfMissing("LIKES", {
      id,
      entity: "Like",
      likeId: id,
      userId: text(user.id),
      postId: c.req.param("id"),
    });
    return c.json({ haveLiked: created });
  });
  app.get("/likes/mine", async (c) => {
    const user = await currentUser(c);
    if (!user)
      return c.json(
        { detail: "Authentication credentials were not provided." },
        401
      );
    const [likes, articles, goods] = await Promise.all([
      all("LIKES"),
      all("ARTICLES"),
      all("GOODS"),
    ]);
    const result = likes
      .filter((like) => text(like.userId) === text(user.id))
      .flatMap((like) => {
        const article = articles.find(
          (item) => text(item.postId) === text(like.postId)
        );
        return article
          ? [
              {
                article: {
                  postId: num(article.postId),
                  title: text(article.title),
                  image: media(article.image),
                  category: num(article.category),
                  createdAt: date(article.createdAt),
                  numberOfGoods: goods.filter(
                    (good) => text(good.postId) === text(article.postId)
                  ).length,
                },
              },
            ]
          : [];
      });
    return c.json(
      pagination(
        result,
        pageOf(c.req.query("page")),
        limitOf(c.req.query("limit")),
        c.req.url
      )
    );
  });
  app.get("/articles/mine", async (c) => {
    const user = await currentUser(c);
    if (!user)
      return c.json(
        { detail: "Authentication credentials were not provided." },
        401
      );
    const [articles, goods, markers] = await Promise.all([
      all("ARTICLES"),
      all("GOODS"),
      all("MARKERS"),
    ]);
    const markerById = new Map(
      markers.map((marker) => [text(marker.id), marker])
    );
    const result = articles
      .filter(
        (article) =>
          text(article.authorId) === text(user.id) &&
          (!c.req.query("category") ||
            text(article.category) === c.req.query("category")) &&
          (!c.req.query("park") ||
            text(markerById.get(text(article.markerId))?.park) ===
              c.req.query("park")) &&
          (c.req.query("isDraft") === undefined ||
            bool(article.isDraft) === bool(c.req.query("isDraft")))
      )
      .map((article) => ({
        postId: num(article.postId),
        title: text(article.title),
        category: num(article.category),
        image: media(article.image),
        isDraft: bool(article.isDraft),
        numberOfGoods: goods.filter(
          (good) => text(good.postId) === text(article.postId)
        ).length,
      }));
    return c.json(
      pagination(
        result,
        pageOf(c.req.query("page")),
        limitOf(c.req.query("limit")),
        c.req.url
      )
    );
  });
  const resolveMarker = async (raw: unknown) => {
    const markers = await all("MARKERS");
    const value = text(raw);
    try {
      const point = JSON.parse(value) as {
        lat?: unknown;
        lng?: unknown;
        park?: unknown;
      };
      const lat = num(point.lat);
      const lng = num(point.lng);
      const park = text(point.park) === "S" ? "S" : "L";
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return undefined;
      const nearby = markers.find(
        (marker) =>
          text(marker.park) === park &&
          Math.abs(num(marker.lat) - lat) <= 1.5 &&
          Math.abs(num(marker.lng) - lng) <= 1.5
      );
      if (nearby) return text(nearby.id);
      const id = await nextId("Marker", markers, "markerId");
      await put(
        "MARKERS",
        { id, entity: "Marker", markerId: id, lat, lng, park },
        "attribute_not_exists(id)"
      );
      return id;
    } catch {
      return (await get("MARKERS", value)) ? value : undefined;
    }
  };
  const cleanupMarker = async (
    markerId: string,
    excludingArticleId?: string
  ) => {
    const used = (await all("ARTICLES")).some(
      (article) =>
        text(article.markerId) === markerId &&
        text(article.id) !== excludingArticleId
    );
    if (!used) await remove("MARKERS", markerId);
  };
  app.post("/articles", async (c) => {
    const user = await currentUser(c);
    if (!user || !csrf(c))
      return c.json(
        { detail: "Authentication credentials were not provided." },
        401
      );
    const body = await c.req.parseBody();
    const title = text(body.title);
    const description = text(body.description);
    const category = num(body.category);
    if (
      !title ||
      !description ||
      !Number.isInteger(category) ||
      category < 0 ||
      category > 6
    )
      return c.json({ errorTitle: "入力内容を確認してください。" }, 400);
    const markerId = await resolveMarker(body.marker);
    if (!markerId)
      return c.json({ marker: ["有効なマーカーを選択してください。"] }, 400);
    const articles = await all("ARTICLES");
    const id = await nextId("Article", articles, "postId");
    const at = new Date().toISOString();
    const image = await upload(body.image, `users/${user.id}`);
    const article: Item = {
      id,
      entity: "Article",
      postId: id,
      authorId: text(user.id),
      markerId,
      title,
      description,
      category,
      image,
      isDraft: bool(body.isDraft),
      publicKey: bool(body.isDraft) ? "draft" : "public",
      createdAt: at,
      updatedAt: at,
    };
    await put("ARTICLES", article, "attribute_not_exists(id)");
    return c.json(articleView(article), 201);
  });
  const updateArticle = async (c: Context, replace: boolean) => {
    const user = await currentUser(c);
    const article = await get("ARTICLES", text(c.req.param("id")));
    if (
      !user ||
      !article ||
      text(article.authorId) !== text(user.id) ||
      !csrf(c)
    )
      return c.json({ detail: "Not found" }, 404);
    const body = await c.req.parseBody();
    if (
      replace &&
      (!text(body.title) ||
        !text(body.description) ||
        body.category === undefined ||
        body.isDraft === undefined ||
        body.marker === undefined)
    )
      return c.json({ errorTitle: "入力内容を確認してください。" }, 400);
    const nextDraft =
      body.isDraft === undefined ? bool(article.isDraft) : bool(body.isDraft);
    if (!bool(article.isDraft) && nextDraft)
      return c.json(
        { isDraft: ["公開済みの記事を下書きに戻すことはできません。"] },
        400
      );
    const oldMarkerId = text(article.markerId);
    const markerId =
      body.marker === undefined
        ? oldMarkerId
        : await resolveMarker(body.marker);
    if (!markerId)
      return c.json({ marker: ["有効なマーカーを選択してください。"] }, 400);
    const image =
      body.image instanceof File
        ? await upload(body.image, `users/${user.id}`)
        : body.image === ""
        ? null
        : article.image;
    const now = new Date().toISOString();
    const changed: Item = {
      ...article,
      ...(body.title !== undefined ? { title: text(body.title) } : {}),
      ...(body.description !== undefined
        ? { description: text(body.description) }
        : {}),
      ...(body.category !== undefined ? { category: num(body.category) } : {}),
      markerId,
      isDraft: nextDraft,
      publicKey: nextDraft ? "draft" : "public",
      image,
      ...(bool(article.isDraft) && !nextDraft ? { createdAt: now } : {}),
      updatedAt: now,
    };
    await put("ARTICLES", changed);
    if (oldMarkerId !== markerId)
      await cleanupMarker(oldMarkerId, text(article.id));
    if (article.image !== image) await deleteImage(article.image);
    return c.json(articleView(changed));
  };
  app.put("/articles/:id", (c) => updateArticle(c, true));
  app.patch("/articles/:id", (c) => updateArticle(c, false));
  app.delete("/articles/:id", async (c) => {
    const user = await currentUser(c);
    const article = await get("ARTICLES", c.req.param("id"));
    if (
      !user ||
      !article ||
      text(article.authorId) !== text(user.id) ||
      !csrf(c)
    )
      return c.json({ detail: "Not found" }, 404);
    const [likes, goods] = await Promise.all([all("LIKES"), all("GOODS")]);
    await Promise.all([
      ...likes
        .filter((item) => text(item.postId) === text(article.id))
        .map((item) => remove("LIKES", item.id)),
      ...goods
        .filter((item) => text(item.postId) === text(article.id))
        .map((item) => remove("GOODS", item.id)),
    ]);
    await remove("ARTICLES", text(article.id));
    await cleanupMarker(text(article.markerId), text(article.id));
    await deleteImage(article.image);
    return c.body(null, 204);
  });

  app.get("/special-map/maps/public-previews", async (c) => {
    const [maps, users] = await Promise.all([all("SPECIALMAPS"), all("USERS")]);
    const active = new Set(
      users.filter((user) => bool(user.isActive)).map((user) => text(user.id))
    );
    const output = maps
      .filter((map) => bool(map.isPublic) && active.has(text(map.authorId)))
      .map((map) => ({
        specialMapId: num(map.specialMapId),
        title: text(map.title),
        thumbnail: media(map.thumbnail),
        description: text(map.description),
        isPublic: true,
      }));
    return c.json(
      pagination(
        output,
        pageOf(c.req.query("page")),
        limitOf(c.req.query("limit")),
        c.req.url
      )
    );
  });
  app.get("/special-map/maps/sitemap", async (c) => {
    const [maps, users] = await Promise.all([all("SPECIALMAPS"), all("USERS")]);
    const active = new Set(
      users.filter((user) => bool(user.isActive)).map((user) => text(user.id))
    );
    return c.json(
      maps
        .filter((map) => bool(map.isPublic) && active.has(text(map.authorId)))
        .map((map) => ({ specialMapId: num(map.specialMapId) }))
    );
  });
  app.get("/special-map/maps/:id/detail", async (c) => {
    const [map, user] = await Promise.all([
      get("SPECIALMAPS", c.req.param("id")),
      currentUser(c),
    ]);
    if (!(await visibleMap(map, user)))
      return c.json({ detail: "Not found" }, 404);
    const author = await get("USERS", text(map!.authorId));
    return c.json({
      specialMapId: num(map!.specialMapId),
      author: userView(author!),
      title: text(map!.title),
      thumbnail: media(map!.thumbnail),
      isPublic: bool(map!.isPublic),
      description: text(map!.description),
      selectablePark: text(map!.selectablePark),
      minLatitude: num(map!.minLatitude),
      maxLatitude: num(map!.maxLatitude),
      minLongitude: num(map!.minLongitude),
      maxLongitude: num(map!.maxLongitude),
      createdAt: date(map!.createdAt),
    });
  });
  app.get("/special-map/maps/:id/markers", async (c) => {
    const [map, user] = await Promise.all([
      get("SPECIALMAPS", c.req.param("id")),
      currentUser(c),
    ]);
    if (!(await visibleMap(map, user)))
      return c.json({ detail: "Not found" }, 404);
    const markers = (await all("SPECIALMAPMARKERS"))
      .filter((marker) => text(marker.specialMapId) === c.req.param("id"))
      .map((marker) => ({
        specialMapMarkerId: num(marker.specialMapMarkerId),
        specialMap: num(marker.specialMapId),
        lat: num(marker.lat),
        lng: num(marker.lng),
        park: text(marker.park),
        image: media(marker.image),
        description: text(marker.description),
        variant: text(marker.variant),
      }));
    return c.json(
      pagination(
        markers,
        pageOf(c.req.query("page")),
        limitOf(c.req.query("limit")),
        c.req.url
      )
    );
  });
  app.get("/special-map/maps/my-previews", async (c) => {
    const user = await currentUser(c);
    if (!user)
      return c.json(
        { detail: "Authentication credentials were not provided." },
        401
      );
    const maps = (await all("SPECIALMAPS"))
      .filter((map) => text(map.authorId) === text(user.id))
      .map((map) => ({
        specialMapId: num(map.specialMapId),
        title: text(map.title),
        thumbnail: media(map.thumbnail),
        description: text(map.description),
        isPublic: bool(map.isPublic),
      }));
    return c.json(
      pagination(
        maps,
        pageOf(c.req.query("page")),
        limitOf(c.req.query("limit")),
        c.req.url
      )
    );
  });
  app.post("/special-map/maps", async (c) => {
    const user = await currentUser(c);
    if (!user || !csrf(c))
      return c.json(
        { detail: "Authentication credentials were not provided." },
        401
      );
    const body = await c.req.parseBody();
    const title = text(body.title);
    const description = text(body.description);
    if (!title || !description)
      return c.json({ errorTitle: "入力内容を確認してください。" }, 400);
    const maps = await all("SPECIALMAPS");
    const id = await nextId("SpecialMap", maps, "specialMapId");
    const map: Item = {
      id,
      entity: "SpecialMap",
      specialMapId: id,
      authorId: text(user.id),
      title,
      description,
      isPublic: bool(body.isPublic),
      publicKey: bool(body.isPublic) ? "public" : "private",
      selectablePark: text(body.selectablePark) || "both",
      thumbnail: await upload(body.thumbnail, "special-map/thumbnails"),
      minLatitude: num(body.minLatitude ?? -255),
      maxLatitude: num(body.maxLatitude ?? 0),
      minLongitude: num(body.minLongitude ?? 0),
      maxLongitude: num(body.maxLongitude ?? 255),
      createdAt: new Date().toISOString(),
    };
    await put("SPECIALMAPS", map, "attribute_not_exists(id)");
    return c.json(
      {
        specialMapId: num(id),
        title,
        description,
        isPublic: bool(map.isPublic),
        selectablePark: map.selectablePark,
        thumbnail: media(map.thumbnail),
        minLatitude: map.minLatitude,
        maxLatitude: map.maxLatitude,
        minLongitude: map.minLongitude,
        maxLongitude: map.maxLongitude,
      },
      201
    );
  });
  app.on(["PUT", "PATCH"], "/special-map/maps/:id", async (c) => {
    const user = await currentUser(c);
    const map = await get("SPECIALMAPS", c.req.param("id"));
    if (!user || !map || text(map.authorId) !== text(user.id) || !csrf(c))
      return c.json({ detail: "Not found" }, 404);
    const body = await c.req.parseBody();
    const thumbnail =
      body.thumbnail instanceof File
        ? await upload(body.thumbnail, "special-map/thumbnails")
        : body.thumbnail === ""
        ? null
        : map.thumbnail;
    const changed: Item = {
      ...map,
      ...(body.title !== undefined ? { title: text(body.title) } : {}),
      ...(body.description !== undefined
        ? { description: text(body.description) }
        : {}),
      ...(body.isPublic !== undefined
        ? {
            isPublic: bool(body.isPublic),
            publicKey: bool(body.isPublic) ? "public" : "private",
          }
        : {}),
      ...(body.selectablePark !== undefined
        ? { selectablePark: text(body.selectablePark) }
        : {}),
      ...(body.minLatitude !== undefined
        ? { minLatitude: num(body.minLatitude) }
        : {}),
      ...(body.maxLatitude !== undefined
        ? { maxLatitude: num(body.maxLatitude) }
        : {}),
      ...(body.minLongitude !== undefined
        ? { minLongitude: num(body.minLongitude) }
        : {}),
      ...(body.maxLongitude !== undefined
        ? { maxLongitude: num(body.maxLongitude) }
        : {}),
      thumbnail,
    };
    await put("SPECIALMAPS", changed);
    if (map.thumbnail !== thumbnail) await deleteImage(map.thumbnail);
    return c.json(changed);
  });
  app.delete("/special-map/maps/:id", async (c) => {
    const user = await currentUser(c);
    const map = await get("SPECIALMAPS", c.req.param("id"));
    if (!user || !map || text(map.authorId) !== text(user.id) || !csrf(c))
      return c.json({ detail: "Not found" }, 404);
    for (const marker of (await all("SPECIALMAPMARKERS")).filter(
      (item) => text(item.specialMapId) === text(map.specialMapId)
    )) {
      await remove("SPECIALMAPMARKERS", marker.id);
      await deleteImage(marker.image);
    }
    await remove("SPECIALMAPS", map.id);
    await deleteImage(map.thumbnail);
    return c.body(null, 204);
  });
  app.post("/special-map/maps/:id/post-marker", async (c) => {
    const user = await currentUser(c);
    const map = await get("SPECIALMAPS", c.req.param("id"));
    if (!user || !map || text(map.authorId) !== text(user.id) || !csrf(c))
      return c.json({ detail: "Not found" }, 404);
    const body = await c.req.parseBody();
    const markers = await all("SPECIALMAPMARKERS");
    const id = await nextId("SpecialMapMarker", markers, "specialMapMarkerId");
    const marker: Item = {
      id,
      entity: "SpecialMapMarker",
      specialMapMarkerId: id,
      specialMapId: text(map.id),
      lat: num(body.lat),
      lng: num(body.lng),
      park: text(body.park),
      image: await upload(body.image, "special-map/markers"),
      description: text(body.description),
      variant: text(body.variant) || "blue",
    };
    await put("SPECIALMAPMARKERS", marker, "attribute_not_exists(id)");
    return c.json(
      {
        specialMapMarkerId: num(id),
        specialMap: num(map.id),
        lat: marker.lat,
        lng: marker.lng,
        park: marker.park,
        image: media(marker.image),
        description: marker.description,
        variant: marker.variant,
      },
      201
    );
  });
  app.get("/special-map/markers/:id", async (c) => {
    const marker = await get("SPECIALMAPMARKERS", c.req.param("id"));
    const [map, user] = await Promise.all([
      marker && get("SPECIALMAPS", text(marker.specialMapId)),
      currentUser(c),
    ]);
    return marker && (await visibleMap(map, user))
      ? c.json({
          specialMapMarkerId: num(marker.specialMapMarkerId),
          specialMap: num(marker.specialMapId),
          lat: num(marker.lat),
          lng: num(marker.lng),
          park: text(marker.park),
          image: media(marker.image),
          description: text(marker.description),
          variant: text(marker.variant),
        })
      : c.json({ detail: "Not found" }, 404);
  });
  app.on(["PUT", "PATCH"], "/special-map/markers/:id", async (c) => {
    const user = await currentUser(c);
    const marker = await get("SPECIALMAPMARKERS", c.req.param("id"));
    const map = marker && (await get("SPECIALMAPS", text(marker.specialMapId)));
    if (
      !user ||
      !marker ||
      !map ||
      text(map.authorId) !== text(user.id) ||
      !csrf(c)
    )
      return c.json({ detail: "Not found" }, 404);
    const body = await c.req.parseBody();
    const image =
      body.image instanceof File
        ? await upload(body.image, "special-map/markers")
        : body.image === ""
        ? null
        : marker.image;
    const changed: Item = {
      ...marker,
      ...(body.description !== undefined
        ? { description: text(body.description) }
        : {}),
      ...(body.variant !== undefined ? { variant: text(body.variant) } : {}),
      ...(body.lat !== undefined ? { lat: num(body.lat) } : {}),
      ...(body.lng !== undefined ? { lng: num(body.lng) } : {}),
      ...(body.park !== undefined ? { park: text(body.park) } : {}),
      image,
    };
    await put("SPECIALMAPMARKERS", changed);
    if (marker.image !== image) await deleteImage(marker.image);
    return c.json(changed);
  });
  app.delete("/special-map/markers/:id", async (c) => {
    const user = await currentUser(c);
    const marker = await get("SPECIALMAPMARKERS", c.req.param("id"));
    const map = marker && (await get("SPECIALMAPS", text(marker.specialMapId)));
    if (
      !user ||
      !marker ||
      !map ||
      text(map.authorId) !== text(user.id) ||
      !csrf(c)
    )
      return c.json({ detail: "Not found" }, 404);
    await remove("SPECIALMAPMARKERS", marker.id);
    await deleteImage(marker.image);
    return c.body(null, 204);
  });
  app.onError((error, c) => {
    if (error.message === "image too large")
      return c.json({ detail: "画像サイズが上限を超えています。" }, 413);
    if (
      error instanceof SyntaxError ||
      error.message === "unsupported image type" ||
      error.message.toLowerCase().includes("multipart")
    )
      return c.json({ detail: "入力内容を確認してください。" }, 400);
    console.error("Unhandled API error", { name: error.name });
    return c.json({ detail: "Internal server error" }, 500);
  });
  app.notFound((c) => c.json({ detail: "Not found" }, 404));
  return app;
};
