# Target architecture

The repository becomes an npm-workspaces monorepo with a React frontend,
TypeScript/Hono API, shared Zod contracts, CDK infrastructure and migration
tools. Node.js is pinned to `24.21.0`; Lambda uses `nodejs24.x` on `arm64`.

```text
Browser -> staging CloudFront -> staging frontend S3
                         `-> /api/* -> HTTP API -> Hono Lambda -> DynamoDB
                                                               `-> image S3
```

One Hono Lambda is a serverless monolith. Routes are thin adapters over
services and repositories. A CDK stack provisions all new staging resources.
Production resources are only referenced in future production deployment code;
this phase does not alter them.

The staging frontend uses same-origin `/api` so cookies and browser requests
do not need cross-origin CORS. CloudFront forwards the methods, authorization
and cookies required by `/api/*`, disables API caching, and preserves the SPA
fallback solely for frontend routes.

