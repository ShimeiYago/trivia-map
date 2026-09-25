# Current deployment inventory

Read-only AWS CLI inventory captured 2026-09-25. Values that could be secrets are not reproduced here.

## Existing pipelines

Both pipelines are CodePipeline V1 in `ap-northeast-1`, use a CodeStar Connection to `ShimeiYago/trivia-map`, and use the same CodeBuild project.

| Pipeline | Source branch | Destination | Refresh |
| --- | --- | --- | --- |
| `trivia-map-prod` | `master` | `trivia-map-prod` | CloudFront `E2A2LWGAGQTC24` via `trivia-map-refresh` Lambda |
| `trivia-map-stg` | `develop` | `trivia-map-stg` | CloudFront `E1QL46XGZTOMER` via `trivia-map-refresh` Lambda |

Each has these actions:

| Stage | Action | Provider | Inputs | Outputs |
| --- | --- | --- | --- | --- |
| Source | Source | CodeStarSourceConnection | — | `SourceArtifact` |
| Build | Build | CodeBuild project `trivia-map` | `SourceArtifact` | `BuildArtifact` |
| Deploy | Deploy | S3 (extract archive) | `BuildArtifact` | — |
| Refresh | `trivia-map-refresh` | Lambda | — | — |

The CodeBuild project uses `aws/codebuild/standard:6.0`, small Linux compute, a 15-minute timeout, no cache, CodePipeline source/artifacts, a service role, and CloudWatch Logs. Its buildspec is [`buildspec.yml`](../buildspec.yml): install dependencies, run the React production build, and package `build/`.

Frontend values are currently supplied as CodePipeline plaintext environment variables. The observed classes are API base URL, site URL, analytics ID and production ad identifiers. The replacement must use GitHub Actions encrypted variables/secrets and must not commit their values.

## Replacement mapping

| Current responsibility | Current implementation | New implementation | Verified |
| --- | --- | --- | --- |
| Trigger on source revision | CodeStar connection / CodePipeline | GitHub Actions workflow on `develop` (staging) and `master` (production) | No — to implement |
| Dependency install | CodeBuild | `npm ci` in GitHub Actions | No — to implement |
| Test and build | CodeBuild buildspec | workspace lint, typecheck, test, and front build | No — to implement |
| Upload static frontend | CodePipeline S3 deploy | AWS CLI `s3 sync` using GitHub OIDC role | No — to implement |
| Cache refresh | `trivia-map-refresh` Lambda | CloudFront `create-invalidation --paths '/*'` | No — to implement |
| API deployment | Legacy EC2/Docker process outside this pipeline | CDK deploy Lambda/API Gateway/DynamoDB | No — to implement |

CodePipeline and CodeBuild remain intact. They must be deleted only after a successful production deployment by the replacement workflow and explicit legacy-cleanup approval.
