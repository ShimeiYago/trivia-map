import { pbkdf2Sync } from "node:crypto";
import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";
import { apiContracts, apiInventory } from "@triviamap/contracts";

describe("API health endpoint", () => {
  it("returns service status", async () => {
    const response = await createApp().request("/health");
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      service: "triviamap-api",
    });
  });
});

describe("guess area compatibility", () => {
  it("preserves the legacy park root and validates the request body", async () => {
    const app = createApp();
    const response = await app.request("/guess-area", {
      method: "POST",
      body: JSON.stringify({ lat: 0, lng: 0, park: "L" }),
      headers: { "content-type": "application/json" },
    });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ areaNames: ["ランド"] });
    expect(
      (
        await app.request("/guess-area", {
          method: "POST",
          body: "{}",
          headers: { "content-type": "application/json" },
        })
      ).status
    ).toBe(400);
  });
});

describe("legacy API inventory", () => {
  it("registers every frontend contract route and method", () => {
    const normalize = (path: string) =>
      path.replace(/:[^/]+/g, ":param").replace(/\/$/, "");
    const routes = createApp().routes.map(
      (route) => `${route.method.toUpperCase()} ${normalize(route.path)}`
    );
    for (const [method, path] of apiInventory) {
      expect(routes).toContain(`${method} ${normalize(path)}`);
    }
  });

  it("has a Zod request and status-response contract for every inventory route", () => {
    expect(apiContracts).toHaveLength(apiInventory.length);
    for (const contract of apiContracts) {
      expect(contract.request).toHaveProperty("safeParse");
      expect(contract.responses[200]).toHaveProperty("safeParse");
      expect(contract.responses[400]).toHaveProperty("safeParse");
      expect(contract.responses[404]).toHaveProperty("safeParse");
    }
  });
});

class MemoryDynamo {
  readonly tables = new Map<string, Map<string, Record<string, unknown>>>();
  private table(name: string) {
    if (!this.tables.has(name)) this.tables.set(name, new Map());
    return this.tables.get(name)!;
  }
  async send(
    command:
      | GetCommand
      | PutCommand
      | QueryCommand
      | DeleteCommand
      | ScanCommand
      | UpdateCommand
  ) {
    const input = command.input as {
      TableName: string;
      Key?: { id: string };
      Item?: Record<string, unknown>;
      ConditionExpression?: string;
      ExpressionAttributeValues?: Record<string, unknown>;
    };
    const table = this.table(input.TableName);
    if (command instanceof ScanCommand) return { Items: [...table.values()] };
    if (command instanceof QueryCommand) {
      const names = command.input.ExpressionAttributeNames ?? {};
      const values = command.input.ExpressionAttributeValues ?? {};
      const partition = names["#partition"]!;
      return {
        Items: [...table.values()].filter((item) => {
          const actual =
            item[partition] ??
            (partition === "publicKey" && item.isDraft === false
              ? "public"
              : undefined);
          return actual === values[":value"];
        }),
      };
    }
    if (command instanceof GetCommand)
      return { Item: table.get(input.Key!.id) };
    if (command instanceof DeleteCommand) {
      table.delete(input.Key!.id);
      return {};
    }
    if (command instanceof UpdateCommand) {
      const id = input.Key!.id;
      const current = table.get(id) ?? { id };
      const values = (input.ExpressionAttributeValues ?? {}) as Record<
        string,
        number
      >;
      if (command.input.UpdateExpression?.includes("#count")) {
        const count = Number(current.count ?? 0);
        if (count >= Number(values[":limit"])) {
          const error = new Error("limited");
          error.name = "ConditionalCheckFailedException";
          throw error;
        }
        table.set(id, { ...current, count: count + 1, ttl: values[":ttl"] });
        return {};
      }
      const value =
        Number(current.value ?? values[":floor"] ?? 0) +
        Number(values[":one"] ?? 0);
      table.set(id, { ...current, value });
      return { Attributes: { value } };
    }
    const id = String(input.Item!.id);
    if (input.ConditionExpression && table.has(id)) {
      const error = new Error("duplicate");
      error.name = "ConditionalCheckFailedException";
      throw error;
    }
    table.set(id, input.Item!);
    return {};
  }
}

describe("injected API dependencies", () => {
  const ddb = new MemoryDynamo();
  const sent: Array<{ to: string; subject: string; text: string }> = [];
  const userPassword = `pbkdf2_sha256$1000$salt$${pbkdf2Sync(
    "password",
    "salt",
    1000,
    32,
    "sha256"
  ).toString("base64")}`;
  const request = async (path: string, init: RequestInit = {}) => {
    process.env.JWT_SECRET = "test-signing-key";
    process.env.GOOD_SALT = "test-good-salt";
    process.env.FRONTEND_ORIGIN = "https://stg.triviamap.jp";
    process.env.MAIL_SECRET_ARN = "mail";
    process.env.STAGE = "stg-v2";
    const app = createApp({
      ddb: ddb as unknown as import("@aws-sdk/lib-dynamodb").DynamoDBDocumentClient,
      secrets: {
        send: async (command: GetSecretValueCommand) =>
          command.input.SecretId === "mail"
            ? {
                SecretString: JSON.stringify({
                  allowedRecipients: "allowed@example.test",
                  smtpHost: "example.test",
                  smtpUser: "mailer@example.test",
                  smtpPassword: "not-used",
                  inquiryRecipient: "allowed@example.test",
                }),
              }
            : { SecretString: "{}" },
      } as unknown as SecretsManagerClient,
      sendMail: async (message) => {
        sent.push({
          to: message.to,
          subject: message.subject,
          text: message.text,
        });
      },
      twitterRequest: async () => {
        throw new Error("upstream detail must not escape");
      },
    });
    return app.request(path, init);
  };

  it("suppresses non-allowlisted registration and password mail without revealing recipients", async () => {
    const users = ddb.tables.get("TriviaMap-stg-v2-Users") ?? new Map();
    users.set("9", {
      id: "9",
      entity: "User",
      userId: "9",
      email: "blocked@example.test",
      nickname: "blocked",
      password: userPassword,
      isActive: true,
    });
    ddb.tables.set("TriviaMap-stg-v2-Users", users);
    const registration = await request("/auths/registration/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: "blocked@example.test",
        nickname: "new-user",
        password1: "password123",
        password2: "password123",
      }),
    });
    expect(registration.status).toBe(400);
    expect(sent).toEqual([]);
    const reset = await request("/auths/password/reset/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "blocked@example.test" }),
    });
    expect(reset.status).toBe(200);
    expect(await reset.json()).toEqual({});
    expect(sent).toEqual([]);
  });

  it("rolls back a new account when verification mail delivery fails", async () => {
    process.env.JWT_SECRET = "test-signing-key";
    process.env.FRONTEND_ORIGIN = "https://stg.triviamap.jp";
    process.env.MAIL_SECRET_ARN = "mail";
    const failureDdb = new MemoryDynamo();
    const app = createApp({
      ddb: failureDdb as unknown as import("@aws-sdk/lib-dynamodb").DynamoDBDocumentClient,
      secrets: {
        send: async () => ({
          SecretString: JSON.stringify({
            allowedRecipients: "allowed@example.test",
            smtpHost: "example.test",
            smtpUser: "mailer@example.test",
            smtpPassword: "not-used",
          }),
        }),
      } as unknown as SecretsManagerClient,
      sendMail: async () => {
        throw new Error("SMTP failure");
      },
    });
    const response = await app.request("/auths/registration/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: "allowed@example.test",
        nickname: "new-user",
        password1: "password123",
        password2: "password123",
      }),
    });
    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      detail: "Registration could not be completed.",
    });
    expect(failureDdb.tables.get("TriviaMap-stg-v2-Users")?.size ?? 0).toBe(0);
    expect(
      failureDdb.tables.get("TriviaMap-stg-v2-AuthTokens")?.size ?? 0
    ).toBe(0);
  });

  it("sends informative verification, resend and password reset messages", async () => {
    const start = sent.length;
    const registration = await request("/auths/registration/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: "allowed@example.test",
        nickname: "mail-user",
        password1: "password123",
        password2: "password123",
      }),
    });
    expect(registration.status).toBe(201);
    const verification = sent[start];
    expect(verification.subject).toBe(
      "【TriviaMap（staging）】メールアドレスの確認"
    );
    expect(verification.text).toContain(
      "ユーザー登録をお申し込みいただき、ありがとうございます。"
    );
    expect(verification.text).toContain(
      "https://stg.triviamap.jp/verify-email/"
    );
    expect(verification.text).toContain("心当たりがない場合");

    expect(
      (
        await request("/auths/registration/resend-email/", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email: "allowed@example.test" }),
        })
      ).status
    ).toBe(200);
    expect(sent[start + 1].subject).toBe(verification.subject);
    expect(sent[start + 1].text).toContain("有効期限は24時間");

    expect(
      (
        await request("/auths/password/reset/", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email: "allowed@example.test" }),
        })
      ).status
    ).toBe(200);
    expect(sent[start + 2].subject).toBe(
      "【TriviaMap（staging）】パスワード再設定"
    );
    expect(sent[start + 2].text).toContain(
      "https://stg.triviamap.jp/reset-password/"
    );
    expect(sent[start + 2].text).toContain("再設定を依頼していない場合");
  });

  it("rehashes a Django password after login and requires a matching CSRF origin for refresh", async () => {
    const login = await request("/auths/login/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: "blocked@example.test",
        password: "password",
      }),
    });
    expect(login.status).toBe(200);
    expect(await login.clone().json()).not.toHaveProperty("access_token");
    expect(
      String(ddb.tables.get("TriviaMap-stg-v2-Users")!.get("9")!.password)
    ).toMatch(/^scrypt\$/);
    const csrf = await request("/auths/csrf/");
    const csrfToken = ((await csrf.json()) as { csrfToken: string }).csrfToken;
    const bad = await request("/auths/token/refresh/", {
      method: "POST",
      headers: {
        cookie: `trivia-map-csrf=${csrfToken}`,
        "x-csrf-token": csrfToken,
        origin: "https://attacker.invalid",
      },
    });
    expect(bad.status).toBe(403);
  });

  it("returns a generic upstream failure for X OAuth adapters", async () => {
    const response = await request("/auths/twitter/request-token", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    });
    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      detail: "Twitter authorization could not be started.",
    });
  });

  it("returns same-origin API pagination URLs while preserving filters", async () => {
    const markers = ddb.tables.get("TriviaMap-stg-v2-Markers") ?? new Map();
    markers.set("pagination-1", {
      id: "pagination-1",
      entity: "Marker",
      markerId: "pagination-1",
      park: "S",
      lat: 35.6,
      lng: 139.8,
    });
    markers.set("pagination-2", {
      id: "pagination-2",
      entity: "Marker",
      markerId: "pagination-2",
      park: "S",
      lat: 35.7,
      lng: 139.9,
    });
    ddb.tables.set("TriviaMap-stg-v2-Markers", markers);
    const users = ddb.tables.get("TriviaMap-stg-v2-Users") ?? new Map();
    users.set("pagination-user", {
      id: "pagination-user",
      userId: "pagination-user",
      isActive: true,
    });
    ddb.tables.set("TriviaMap-stg-v2-Users", users);
    const articles = ddb.tables.get("TriviaMap-stg-v2-Articles") ?? new Map();
    articles.set("pagination-1", {
      id: "pagination-1",
      postId: "pagination-1",
      authorId: "pagination-user",
      markerId: "pagination-1",
      isDraft: false,
    });
    articles.set("pagination-2", {
      id: "pagination-2",
      postId: "pagination-2",
      authorId: "pagination-user",
      markerId: "pagination-2",
      isDraft: false,
    });
    ddb.tables.set("TriviaMap-stg-v2-Articles", articles);
    const response = await request("/markers/S?limit=1");
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      nextUrl: "/api/markers/S?limit=1&page=2",
      previousUrl: null,
    });
  });

  it("sorts public article previews by newest, oldest, and legacy popularity rank", async () => {
    const sortingDdb = new MemoryDynamo();
    const articles =
      sortingDdb.tables.get("TriviaMap-stg-v2-Articles") ?? new Map();
    articles.set("101", {
      id: "101",
      entity: "Article",
      postId: "101",
      authorId: "1",
      title: "old popular",
      description: "",
      category: 1,
      isDraft: false,
      createdAt: "2024-01-01T00:00:00.000Z",
      popularityRank: 1,
    });
    articles.set("102", {
      id: "102",
      entity: "Article",
      postId: "102",
      authorId: "1",
      title: "new unranked",
      description: "",
      category: 1,
      isDraft: false,
      createdAt: "2026-01-01T00:00:00.000Z",
    });
    articles.set("103", {
      id: "103",
      entity: "Article",
      postId: "103",
      authorId: "1",
      title: "middle popular",
      description: "",
      category: 1,
      isDraft: false,
      createdAt: "2025-01-01T00:00:00.000Z",
      popularityRank: 2,
    });
    sortingDdb.tables.set("TriviaMap-stg-v2-Articles", articles);
    sortingDdb.tables.set(
      "TriviaMap-stg-v2-Users",
      new Map([
        ["1", { id: "1", userId: "1", nickname: "active", isActive: true }],
      ])
    );
    const app = createApp({
      ddb: sortingDdb as unknown as import("@aws-sdk/lib-dynamodb").DynamoDBDocumentClient,
    });
    const ids = async (order: string) => {
      const response = await app.request(
        `/articles/public/previews?order=${order}`
      );
      expect(response.status).toBe(200);
      return (
        (await response.json()) as { results: Array<{ postId: number }> }
      ).results.map((article) => article.postId);
    };
    await expect(ids("latest")).resolves.toEqual([102, 103, 101]);
    await expect(ids("oldest")).resolves.toEqual([101, 103, 102]);
    await expect(ids("popular")).resolves.toEqual([101, 103, 102]);
  });

  it("applies all public article filters and hides inactive authors", async () => {
    const filterDdb = new MemoryDynamo();
    filterDdb.tables.set(
      "TriviaMap-stg-v2-Users",
      new Map([
        ["1", { id: "1", userId: "1", isActive: true }],
        ["2", { id: "2", userId: "2", isActive: false }],
      ])
    );
    filterDdb.tables.set(
      "TriviaMap-stg-v2-Markers",
      new Map([
        ["10", { id: "10", markerId: "10", park: "L" }],
        ["20", { id: "20", markerId: "20", park: "S" }],
      ])
    );
    filterDdb.tables.set(
      "TriviaMap-stg-v2-Articles",
      new Map([
        [
          "1",
          {
            id: "1",
            postId: "1",
            authorId: "1",
            markerId: "10",
            title: "alpha beta",
            description: "body",
            category: 2,
            isDraft: false,
            createdAt: "2025-01-01",
          },
        ],
        [
          "2",
          {
            id: "2",
            postId: "2",
            authorId: "1",
            markerId: "20",
            title: "alpha",
            description: "body",
            category: 2,
            isDraft: false,
            createdAt: "2025-01-02",
          },
        ],
        [
          "3",
          {
            id: "3",
            postId: "3",
            authorId: "2",
            markerId: "10",
            title: "alpha beta",
            description: "body",
            category: 2,
            isDraft: false,
            createdAt: "2025-01-03",
          },
        ],
      ])
    );
    const app = createApp({
      ddb: filterDdb as unknown as import("@aws-sdk/lib-dynamodb").DynamoDBDocumentClient,
    });
    const response = await app.request(
      "/articles/public/previews?keywords=alpha,beta&park=L&user=1&category=2"
    );
    expect(response.status).toBe(200);
    expect(
      (
        (await response.json()) as { results: Array<{ postId: number }> }
      ).results.map((item) => item.postId)
    ).toEqual([1]);
  });

  it("does not reveal private map markers or inactive profiles", async () => {
    const privateDdb = new MemoryDynamo();
    privateDdb.tables.set(
      "TriviaMap-stg-v2-Users",
      new Map([["1", { id: "1", userId: "1", isActive: false }]])
    );
    privateDdb.tables.set(
      "TriviaMap-stg-v2-SpecialMaps",
      new Map([
        ["9", { id: "9", specialMapId: "9", authorId: "1", isPublic: false }],
      ])
    );
    privateDdb.tables.set(
      "TriviaMap-stg-v2-SpecialMapMarkers",
      new Map([["8", { id: "8", specialMapMarkerId: "8", specialMapId: "9" }]])
    );
    const app = createApp({
      ddb: privateDdb as unknown as import("@aws-sdk/lib-dynamodb").DynamoDBDocumentClient,
    });
    expect((await app.request("/special-map/maps/9/markers")).status).toBe(404);
    expect((await app.request("/special-map/markers/8")).status).toBe(404);
    expect((await app.request("/users/1")).status).toBe(404);
  });

  it("normalizes malformed JSON and invalid tokens without returning 500", async () => {
    expect(
      (
        await request("/auths/login/", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: "{",
        })
      ).status
    ).toBe(400);
    expect(
      (
        await request("/auths/token/verify/", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token: "malformed" }),
        })
      ).status
    ).toBe(401);
  });
});
