# Serverless staging completion plan

`docs/serverless-migraiton-plan.md` の Step 1–15 を、production を変更せず
staging release まで完了するための実行計画。Step 16 の deploy 後は必ず停止する。

## Current state (2026-09-25)

- Legacy staging (`TriviaMapStaging`) は partial 実装のまま保持する。
- New `TriviaMapStagingV2` infrastructure is `CREATE_COMPLETE` in `ap-northeast-1`.
- v2 has isolated DynamoDB tables, image/frontend buckets, Lambda, HTTP API and a
  generated CloudFront distribution. It is not yet the `stg.triviamap.jp` origin.
- SMTP allowlist secret is `triviamap/stg/mail`; only the user-supplied test
  address may receive staging email. Basic-auth credentials are in
  `triviamap/stg/access`; neither secret is committed or reported.

## Remaining work before staging application deployment

1. Complete API compatibility against `docs/current-api-inventory.md`.
   - Add/verify all public, article, Like, Good, Special Map, inquiry, auth and
     X OAuth routes, including request/response wire shapes, ownership checks,
     validation, pagination, CSRF and cookie behaviour.
   - Replace any temporary scan-only or placeholder response with v2 repository
     access and contract validation.
2. Complete frontend compatibility.
   - Build against same-origin `/api`; initialise CSRF before mutating calls.
   - Verify image URLs use `/images/uploads/...`, pagination URLs remain usable,
     and X/email callback paths match the staging origin.
3. Complete automated verification.
   - API unit/contract tests for every route and failure path.
   - DynamoDB Local integration tests for migration, authorization, uniqueness,
     session/token TTL, email suppression and images.
   - Keep workspace lint, typecheck, frontend tests, build and CDK synth green.
4. Migrate production source data into v2 staging.
   - Use the production MySQL dump through the repeatable migration tool.
   - Copy referenced `trivia-map-prod/uploads/` objects to the v2 image bucket,
     checksum them, and validate counts, IDs and relations.
5. Deploy application to generated v2 CloudFront URL and smoke-test Basic auth,
   `/api/*`, `/images/*`, API direct-access denial and SPA direct URLs.
6. Only after generated-URL validation, move the **staging-only** CloudFront
   alias and Route 53 `stg.triviamap.jp` record to v2. Do not alter production.
7. Invalidate CloudFront and stop. Report URLs, SHA, resources, all test
   outcomes, known issues, and the complete manual `STG-*` test guide.

## Commit checkpoints

1. API compatibility and contract tests.
2. Auth/X/email guard and integration tests.
3. Frontend same-origin compatibility.
4. Migration validation tooling.
5. CI verification changes.
6. Staging domain/deploy scripts.

## Hard boundaries

- Never deploy or migrate production, change its CloudFront/DNS/S3/API, or
  delete legacy resources.
- Do not send email outside the staging allowlist.
- Do not claim browser acceptance as performed; it remains a human step after
  staging deployment.
