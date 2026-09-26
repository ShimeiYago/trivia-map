import { z } from "zod";

export const parkSchema = z.enum(["L", "S"]);
export const mapParkSchema = z.enum(["L", "S", "both"]);
export const imageKeySchema = z.string().min(1).nullable();
export const pageSchema = z.coerce.number().int().positive().default(1);
export const articlePreviewOrderSchema = z.enum([
  "latest",
  "oldest",
  "popular",
]);
export const articlePreviewQuerySchema = z.object({
  page: pageSchema.optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  marker: z.coerce.number().int().positive().optional(),
  user: z.coerce.number().int().positive().optional(),
  category: z.coerce.number().int().min(0).max(6).optional(),
  park: parkSchema.optional(),
  keywords: z.string().optional(),
  order: articlePreviewOrderSchema.optional(),
});
export const paginationSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    nextUrl: z.string().nullable(),
    previousUrl: z.string().nullable(),
    totalRecords: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
    currentPage: z.number().int().positive(),
    startIndex: z.number().int().nonnegative(),
    endIndex: z.number().int().nonnegative(),
    results: z.array(item),
  });
export const errorSchema = z
  .object({
    detail: z.string().optional(),
    non_field_errors: z.array(z.string()).optional(),
  })
  .passthrough();
export const userSchema = z.object({
  userId: z.number().int().positive(),
  email: z.string().email().optional(),
  nickname: z.string().min(1).max(20),
  icon: z.string().nullable(),
  isSocialAccount: z.boolean().optional(),
  url: z.string().nullable(),
});
export const publicUserSchema = userSchema.pick({
  userId: true,
  nickname: true,
  icon: true,
  url: true,
});
export const markerSchema = z.object({
  markerId: z.number().int().positive(),
  lat: z.number(),
  lng: z.number(),
  park: parkSchema,
  numberOfPublicArticles: z.object({
    total: z.number().int().nonnegative(),
    eachCategory: z.array(z.number().int().nonnegative()).length(7),
  }),
  areaNames: z.array(z.string()).optional(),
});
export const articlePreviewSchema = z.object({
  postId: z.number().int().positive(),
  title: z.string(),
  image: z.string().nullable(),
  category: z.number().int().min(0).max(6),
  createdAt: z.string(),
  numberOfGoods: z.number().int().nonnegative(),
});
export const articleSchema = z.object({
  postId: z.number().int().positive(),
  title: z.string().min(1).max(100),
  description: z.string(),
  marker: z.union([z.number().int().positive(), markerSchema]),
  category: z.number().int().min(0).max(6),
  image: z.string().nullable(),
  isDraft: z.boolean(),
  author: z.union([z.number().int().positive(), publicUserSchema]),
  createdAt: z.string(),
  updatedAt: z.string(),
  numberOfGoods: z.number().int().nonnegative().optional(),
  haveAddedGood: z.boolean().optional(),
});
export const articleWriteSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  marker: z.number().int().positive(),
  category: z.coerce.number().int().min(0).max(6),
  isDraft: z.coerce.boolean(),
  image: imageKeySchema.optional(),
});
export const specialMapSchema = z.object({
  specialMapId: z.number().int().positive(),
  author: z.union([z.number().int().positive(), publicUserSchema]),
  title: z.string().min(1).max(100),
  thumbnail: z.string().nullable(),
  isPublic: z.boolean(),
  description: z.string(),
  selectablePark: mapParkSchema,
  minLatitude: z.number(),
  maxLatitude: z.number(),
  minLongitude: z.number(),
  maxLongitude: z.number(),
  createdAt: z.string().optional(),
});
export const specialMapWriteSchema = specialMapSchema
  .omit({ specialMapId: true, author: true, createdAt: true })
  .partial({
    thumbnail: true,
    minLatitude: true,
    maxLatitude: true,
    minLongitude: true,
    maxLongitude: true,
  });
export const specialMapMarkerSchema = z.object({
  specialMapMarkerId: z.number().int().positive(),
  specialMap: z.number().int().positive(),
  lat: z.number(),
  lng: z.number(),
  park: parkSchema,
  image: z.string().nullable(),
  description: z.string(),
  variant: z.string().min(1).max(15),
});
export const specialMapMarkerWriteSchema = specialMapMarkerSchema.omit({
  specialMapMarkerId: true,
  specialMap: true,
});
export const registrationSchema = z
  .object({
    email: z.string().email(),
    nickname: z.string().min(1).max(20),
    password1: z.string().min(8),
    password2: z.string().min(8),
  })
  .refine((value) => value.password1 === value.password2, {
    path: ["password2"],
    message: "パスワードが一致しません。",
  });
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export const inquirySchema = z.object({
  email: z.string().email(),
  tag: z.string().max(100),
  name: z.string().min(1).max(20),
  message: z.string().min(1).max(5000),
});
// Compatibility inventory shared by API contract tests and deployment checks.
// Paths intentionally preserve the legacy trailing-slash boundary.
export const apiInventory = [
  ["GET", "/articles/detail/:postId"],
  ["GET", "/articles/public/previews"],
  ["GET", "/markers/:park"],
  ["GET", "/articles/categories"],
  ["POST", "/guess-area"],
  ["GET", "/articles/sitemap"],
  ["GET", "/users/:userId"],
  ["GET", "/special-map/maps/public-previews"],
  ["GET", "/special-map/maps/:mapId/detail"],
  ["GET", "/special-map/maps/:mapId/markers"],
  ["GET", "/special-map/maps/sitemap"],
  ["POST", "/goods/toggle/:postId"],
  ["GET", "/goods/check/:postId"],
  ["POST", "/inquiry/"],
  ["GET", "/articles/mine"],
  ["POST", "/articles"],
  ["PUT", "/articles/:postId"],
  ["PATCH", "/articles/:postId"],
  ["DELETE", "/articles/:postId"],
  ["GET", "/likes/mine"],
  ["POST", "/likes/toggle/:postId"],
  ["GET", "/likes/check/:postId"],
  ["GET", "/special-map/maps/my-previews"],
  ["POST", "/special-map/maps"],
  ["PUT", "/special-map/maps/:mapId"],
  ["PATCH", "/special-map/maps/:mapId"],
  ["DELETE", "/special-map/maps/:mapId"],
  ["POST", "/special-map/maps/:mapId/post-marker"],
  ["GET", "/special-map/markers/:markerId"],
  ["PUT", "/special-map/markers/:markerId"],
  ["PATCH", "/special-map/markers/:markerId"],
  ["DELETE", "/special-map/markers/:markerId"],
  ["GET", "/auths/csrf/"],
  ["POST", "/auths/registration/"],
  ["POST", "/auths/registration/verify-email/"],
  ["POST", "/auths/registration/resend-email/"],
  ["POST", "/auths/login/"],
  ["POST", "/auths/logout/"],
  ["GET", "/auths/user/"],
  ["PUT", "/auths/user/update/"],
  ["PATCH", "/auths/user/update/"],
  ["POST", "/auths/password/change/"],
  ["POST", "/auths/password/reset/"],
  ["POST", "/auths/password/reset/confirm/"],
  ["POST", "/auths/token/refresh/"],
  ["POST", "/auths/token/verify/"],
  ["PUT", "/auths/deactivate/"],
  ["POST", "/auths/twitter/request-token"],
  ["POST", "/auths/twitter/access-token"],
  ["POST", "/auths/twitter/login"],
] as const;
export type ApiContract = {
  method: typeof apiInventory[number][0];
  path: typeof apiInventory[number][1];
  request: z.ZodTypeAny;
  responses: Readonly<Record<number, z.ZodTypeAny>>;
  pagination: boolean;
};
const emptyResponseSchema = z.object({}).passthrough();
const paginatedPaths = new Set([
  "/articles/public/previews",
  "/markers/:park",
  "/likes/mine",
  "/articles/mine",
  "/special-map/maps/public-previews",
  "/special-map/maps/:mapId/markers",
  "/special-map/maps/my-previews",
]);
const noParams = z.object({}).strict();
const noQuery = z.object({}).strict();
const idParams = (name: string) =>
  z.object({ [name]: z.string().regex(/^\d+$/) });
const pageQuery = z.object({
  page: pageSchema.optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});
const envelope = (
  params: z.ZodTypeAny = noParams,
  query: z.ZodTypeAny = noQuery,
  body: z.ZodTypeAny = z.undefined()
) => z.object({ params, query, body });
const articleWireWrite = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  marker: z.union([z.string().min(1), z.number().int().positive()]),
  category: z.coerce.number().int().min(0).max(6),
  isDraft: z.union([z.boolean(), z.enum(["true", "false"])]),
  image: z.unknown().optional(),
});
const mapWireWrite = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  selectablePark: mapParkSchema,
  isPublic: z.union([z.boolean(), z.enum(["true", "false"])]),
  minLatitude: z.coerce.number(),
  maxLatitude: z.coerce.number(),
  minLongitude: z.coerce.number(),
  maxLongitude: z.coerce.number(),
  thumbnail: z.unknown().optional(),
});
const mapMarkerWireWrite = z.object({
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  park: parkSchema,
  image: z.unknown().optional(),
  description: z.string(),
  variant: z.string().min(1).max(15),
});
const requestFor = (method: string, path: string): z.ZodTypeAny => {
  if (path === "/articles/public/previews")
    return envelope(noParams, articlePreviewQuerySchema);
  if (path === "/markers/:park")
    return envelope(
      z.object({ park: parkSchema }),
      pageQuery.extend({
        category: z.coerce.number().int().min(0).max(6).optional(),
        user: z.coerce.number().int().positive().optional(),
      })
    );
  if (path === "/articles/mine")
    return envelope(
      noParams,
      pageQuery.extend({
        category: z.coerce.number().int().min(0).max(6).optional(),
        park: parkSchema.optional(),
        isDraft: z.enum(["true", "false"]).optional(),
      })
    );
  if (paginatedPaths.has(path))
    return envelope(
      path.includes(":mapId") ? idParams("mapId") : noParams,
      pageQuery
    );
  if (path === "/guess-area")
    return envelope(
      noParams,
      noQuery,
      z.object({
        lat: z.number().finite(),
        lng: z.number().finite(),
        park: parkSchema,
      })
    );
  if (path === "/articles" && method === "POST")
    return envelope(noParams, noQuery, articleWireWrite);
  if (path === "/articles/:postId")
    return envelope(
      idParams("postId"),
      noQuery,
      method === "DELETE"
        ? z.undefined()
        : method === "PATCH"
        ? articleWireWrite.partial()
        : articleWireWrite
    );
  if (path === "/special-map/maps" && method === "POST")
    return envelope(noParams, noQuery, mapWireWrite);
  if (path === "/special-map/maps/:mapId")
    return envelope(
      idParams("mapId"),
      noQuery,
      method === "DELETE"
        ? z.undefined()
        : method === "PATCH"
        ? mapWireWrite.partial()
        : mapWireWrite
    );
  if (path === "/special-map/maps/:mapId/post-marker")
    return envelope(idParams("mapId"), noQuery, mapMarkerWireWrite);
  if (path === "/special-map/markers/:markerId")
    return envelope(
      idParams("markerId"),
      noQuery,
      method === "DELETE" || method === "GET"
        ? z.undefined()
        : method === "PATCH"
        ? mapMarkerWireWrite.partial()
        : mapMarkerWireWrite
    );
  if (path === "/auths/registration/")
    return envelope(noParams, noQuery, registrationSchema);
  if (path === "/auths/login/") return envelope(noParams, noQuery, loginSchema);
  if (path === "/inquiry/") return envelope(noParams, noQuery, inquirySchema);
  const parameter = path.match(/:(\w+)/)?.[1];
  return envelope(
    parameter ? idParams(parameter) : noParams,
    noQuery,
    method === "GET" || method === "DELETE"
      ? z.undefined()
      : z.object({}).passthrough()
  );
};
const mapPreviewSchema = specialMapSchema.pick({
  specialMapId: true,
  title: true,
  thumbnail: true,
  description: true,
  isPublic: true,
});
const myArticleSchema = articlePreviewSchema
  .omit({ createdAt: true })
  .extend({ isDraft: z.boolean() });
const schemaForPath = (path: string) => {
  if (path === "/articles/detail/:postId") return articleSchema;
  if (path === "/articles/public/previews")
    return paginationSchema(articlePreviewSchema);
  if (path === "/markers/:park") return paginationSchema(markerSchema);
  if (path === "/articles/mine") return paginationSchema(myArticleSchema);
  if (path === "/likes/mine")
    return paginationSchema(z.object({ article: articlePreviewSchema }));
  if (path === "/users/:userId") return publicUserSchema;
  if (path === "/guess-area")
    return z.object({ areaNames: z.array(z.string()) });
  if (path === "/auths/user/") return userSchema;
  if (path === "/auths/csrf/") return z.object({ csrfToken: z.string() });
  if (
    path === "/special-map/maps/public-previews" ||
    path === "/special-map/maps/my-previews"
  )
    return paginationSchema(mapPreviewSchema);
  if (path === "/special-map/maps/:mapId/markers")
    return paginationSchema(specialMapMarkerSchema);
  if (path === "/special-map/maps/:mapId/detail") return specialMapSchema;
  if (path === "/special-map/markers/:markerId") return specialMapMarkerSchema;
  if (path === "/goods/check/:postId" || path === "/goods/toggle/:postId")
    return z.object({ haveAddedGood: z.boolean() });
  if (path === "/likes/check/:postId" || path === "/likes/toggle/:postId")
    return z.object({ haveLiked: z.boolean() });
  if (path === "/auths/login/" || path === "/auths/twitter/login")
    return z.object({
      user: userSchema,
      access_token_expiration: z.string().datetime(),
      refresh_token_expiration: z.string().datetime(),
    });
  if (path === "/auths/token/refresh/")
    return z.object({
      access_token_expiration: z.string().datetime(),
      refresh_token_expiration: z.string().datetime(),
    });
  return emptyResponseSchema;
};
// Every legacy frontend call has a machine-readable method/path/request/response contract.
// Route-specific handlers narrow these shared shapes further before persisting data.
export const apiContracts: readonly ApiContract[] = apiInventory.map(
  ([method, path]) => ({
    method,
    path,
    request: requestFor(method, path),
    responses: {
      200: schemaForPath(path),
      201: schemaForPath(path),
      204: z.undefined(),
      400: errorSchema,
      401: errorSchema,
      403: errorSchema,
      404: errorSchema,
      413: errorSchema,
      429: errorSchema,
      502: errorSchema,
    },
    pagination: paginatedPaths.has(path),
  })
);
export type User = z.infer<typeof userSchema>;
export type Article = z.infer<typeof articleSchema>;
export type Marker = z.infer<typeof markerSchema>;
export type SpecialMap = z.infer<typeof specialMapSchema>;
export type SpecialMapMarker = z.infer<typeof specialMapMarkerSchema>;
