# Current AWS inventory

Read-only AWS CLI inventory captured 2026-09-25. Account IDs, ARNs and secret values are intentionally omitted where they are not needed for the migration implementation.

## Production

| Component | Current state |
| --- | --- |
| Region | `ap-northeast-1` (CloudFront certificate is in `us-east-1`) |
| Frontend bucket | `trivia-map-prod`; SSE-S3 encryption; public access block enabled; no S3 website or CORS configuration |
| CloudFront | `E2A2LWGAGQTC24`, alias `triviamap.jp`, S3 origin `trivia-map-prod` through OAC `E3J1A1N3HQ2J5P` |
| SPA routing | 403 is mapped to `/` with HTTP 200 (10 second error TTL) |
| Cache | Managed cache policy `658327ea-f89d-4fab-a63d-7e88639e58f6`; `/sitemap.xml` has a separate no-TTL behavior |
| Edge logic | viewer-request Lambda@Edge `trivia-map-prod-cloudfront-modify-response-header` |
| API | `api.triviamap.jp` is currently served by the legacy Django API on EC2 `i-0e68f10aaeb4e4e69` (`t4g.micro`, running) |
| Legacy data | MySQL is not an RDS instance in this account; it must be reached through the legacy API/EC2 deployment configuration for migration |
| Images / backup | Existing bucket `trivia-map-api-server-backup` (versioning enabled) |
| DNS | Public Route 53 hosted zone `triviamap.jp` |
| Certificate | Existing issued ACM certificate for `triviamap.jp` and `*.triviamap.jp` in `us-east-1` |

The production distribution currently has no API origin or `/api/*` cache behavior. It must not be changed until staging acceptance and explicit production approval.

## Existing staging

| Component | Current state |
| --- | --- |
| Frontend bucket | `trivia-map-stg`; SSE-S3 encryption; public access block enabled; no S3 website or CORS configuration |
| CloudFront | `E1QL46XGZTOMER`, alias `stg.triviamap.jp`, same OAC, 403-to-root SPA fallback |
| API | `api-stg.triviamap.jp` currently points to the legacy staging API; its EC2 `i-071876c240dff5f04` (`t4g.micro`) is stopped |

No TriviaMap API Gateway or DynamoDB table exists yet. The new staging stack will use independently named CDK resources, avoiding modification of the legacy staging frontend and API before the new deployment is ready.

## Legacy resources retained until cutover is accepted

- EC2 Django API instances and their MySQL host.
- `trivia-map-prod` / `trivia-map-stg` frontend buckets and their CloudFront distributions.
- Route 53 records and the existing ACM certificate.
- CodePipeline, CodeBuild, the refresh Lambda, and sitemap Lambda.
