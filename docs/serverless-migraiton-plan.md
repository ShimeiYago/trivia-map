# TriviaMap サーバーレス全面移行 実装指示書

## 目的

TriviaMap の既存バックエンドとデプロイ基盤を全面的に刷新する。

現在の構成は概ね以下。

- Frontend: React / TypeScript
- Backend: Django / Django REST Framework / Python
- DB: MySQL
- APIサーバー: EC2 `t4g.micro`
- 画像: S3
- Frontend配信: S3 + CloudFront
- Frontend build/deploy: AWS CodePipeline / CodeBuild 系
- Backend repo: `/Users/shimei/trivia-map-project/trivia-map-api`
- Frontend repo: `/Users/shimei/trivia-map-project/trivia-map`

これを以下の方針に移行する。

- `trivia-map-api` は廃止する
- `trivia-map` を npm workspaces ベースの monorepo にする
- Frontend / API / shared contracts / CDK / migration scripts を同一repoで管理する
- Node.js は LTS `24.21.0` に統一する
- Backend は TypeScript + Hono
- API Gateway HTTP API + AWS Lambda
- Lambda runtime は `nodejs24.x`
- DB は DynamoDB
- Infrastructure as Code は AWS CDK / TypeScript
- 既存CodePipeline / CodeBuildによるproduction frontend deployは廃止する
- ただし、CodePipeline / CodeBuildで現在行われている処理はAWS CLIで実査し、必要な挙動を漏れなく新しいCDK/CI方式へ移植する
- production frontendの既存S3 / CloudFront / domain等は原則維持する
- local / staging で十分な検証を行った後、production は一括切替する
- エンドポイント単位の段階移行は行わない
- 旧 EC2 / MySQL / Django API は新productionの安定確認後に停止・廃止する

AWS料金削減だけでなく、

- EC2
- OS
- Docker
- nginx
- MySQL
- Django
- CodePipeline
- CodeBuildの暗黙設定

などの継続運用や、AWS Console上にしか存在しない設定を減らし、長期的な運用負荷を下げることを主目的とする。

---

# 非常に重要な作業停止ポイント

Codexは以下の順序で作業する。

```text
調査
↓
設計
↓
monorepo化
↓
API / DynamoDB / Auth / CDK実装
↓
local test
↓
migration test
↓
CDK synth等の静的検証
↓
staging infrastructure deploy
↓
staging frontend / API deploy
↓
STOP
```

**stagingへのリリースが完了した時点で、必ず作業を停止すること。**

その後、勝手に以下へ進んではならない。

- production deploy
- production database migration
- production CloudFront変更
- production frontend deploy
- production API切替
- EC2停止
- CodePipeline削除
- CodeBuild削除
- production resource削除
- stagingブラウザテストを「完了済み」と扱うこと

stagingリリース後は、まず人間へ報告し、ブラウザを使ったstaging受け入れテストを人間に実施してもらう。

---

# Codexと人間の責務分担

## Codexが担当すること

Codexはstagingリリースまで、可能な範囲を自律的に完了させる。

含むもの:

- GitHub調査
- AWS CLIによる現行production調査
- architecture設計
- DynamoDB設計
- auth設計
- monorepo化
- Hono API実装
- frontend変更
- CDK実装
- migration script
- deploy script
- CI/CD設定
- unit test
- integration test
- contract test
- typecheck
- lint
- build
- CDK synth
- localで実行可能なAPIテスト
- DynamoDB Local等を使ったテスト
- staging infrastructure作成
- stagingへのapplication deploy

---

## 人間が担当すること

以下はユーザーがブラウザ等を使って確認する。

- stagingサイトの実ブラウザ表示
- map操作
- marker操作
- signup
- login/logout
- social login
- password reset
- article投稿
- article編集
- image upload
- Like
- Good
- Special Map操作
- SPA navigation
- direct URL access
- browser Cookie
- redirect
- responsive表示
- SEO系表示確認
- その他UI/UX

Codexはこれらについて、実際にブラウザで確認したかのような報告をしてはならない。

---

# stagingリリース後の必須報告

stagingリリースが完了したらCodexは作業を停止し、ユーザーへ以下を報告すること。

## 1. Staging deploy result

最低限:

- staging URL
- API URL
- deployしたcommit SHA
- deploy日時
- CloudFront Distribution
- frontend S3
- API Gateway
- Lambda
- DynamoDB
- staging image bucket
- 使用したAWS region

Secretは表示しない。

---

## 2. Automated test result

以下について、

```text
PASS
FAIL
SKIPPED
```

を明示する。

最低限:

- npm install
- lint
- typecheck
- frontend unit tests
- API unit tests
- integration tests
- contract tests
- migration tests
- build
- CDK synth
- staging deploy

失敗やskipがある場合は理由を書く。

---

## 3. Known issues

stagingで確認前に分かっている問題があれば列挙する。

問題がなければ、

```text
Known issues: none
```

と明示する。

---

## 4. Manual staging test guide

ユーザーがそのまま上から順番に実行できる、詳細なstagingテスト手順を提示する。

各ケースについて必ず、

```text
Test ID
目的
事前条件
操作手順
期待結果
確認ポイント
PASS条件
FAIL時に記録してほしい情報
```

を記載する。

ユーザーがエンジニアとして迷わず検証できる粒度にする。

---

# Manual Staging Test Cases

Codexはstaging deploy後、最低限以下の全ケースを案内する。

実際の既存仕様を調査後、必要なケースを追加すること。

---

## STG-PUBLIC-001 トップページ

確認:

- staging URLへアクセスできる
- HTTPエラーが出ない
- React appが表示される
- コンソールに致命的エラーがない
- mapが表示される
- markerが表示される
- frontend assetが正常にロードされる

---

## STG-PUBLIC-002 SPA direct access

トップから遷移せず、

```text
/articles/<existing-id>
```

をブラウザアドレスバーから直接開く。

確認:

- CloudFrontで404/403にならない
- React Routerが正常に動作
- 対象記事が表示される

複数routeで確認する。

---

## STG-PUBLIC-003 記事一覧

確認:

- 記事一覧表示
- pagination
- next / previous
- sort
- 件数
- thumbnail
- title
- category等

---

## STG-PUBLIC-004 記事詳細

既存データの記事を開く。

確認:

- URL
- ID
- title
- description
- image
- author
- marker
- category
- Good数
- その他既存表示

migration前データとの一致も確認する。

---

## STG-PUBLIC-005 Category

各categoryページを確認する。

- 正しい記事のみ出る
- pagination
- 0件の場合
- URL

---

## STG-PUBLIC-006 Keyword Search

複数keywordで確認する。

- title match
- description match
- 0件
- 日本語
- 部分一致
- pagination

既存productionとの差異がないか確認する。

---

## STG-PUBLIC-007 Marker

Land / Sea双方で確認する。

- marker表示
- position
- marker click
- article count
- category count
- articleへのnavigation

---

## STG-PUBLIC-008 Special Maps

確認:

- list
- detail
- map表示
- marker
- marker image
- description
- selectable park

---

## STG-PUBLIC-009 User page

既存user profileを表示。

確認:

- nickname
- icon
- social icon
- URL
- articles
- その他公開情報

---

# Authentication

## STG-AUTH-001 Signup

新しいstaging test userでsignup。

確認:

- validation
- registration
- email関連挙動
- 成功後の画面

---

## STG-AUTH-002 Email Verification

該当機能が現行productionで使用されている場合。

- verification mail
- link
- expiration
- verified状態

---

## STG-AUTH-003 Login

確認:

- 正常login
- 間違ったpassword
- 存在しないuser
- Cookie
- redirect
- login後UI

---

## STG-AUTH-004 Auto Login

login後にブラウザをreloadする。

確認:

- login state維持
- user情報復元
- 不要なエラーなし

---

## STG-AUTH-005 Logout

確認:

- logout
- Cookie削除/無効化
- protected UIへアクセスできない

---

## STG-AUTH-006 Token Refresh

可能ならaccess token expiry相当のケースを確認する。

- refresh成功
- session維持
- failure時の挙動

---

## STG-AUTH-007 Password Reset

確認:

- reset request
- email
- reset URL
- new password
- old password不可
- new password login

---

## STG-AUTH-008 Social Login

productionで現在サポートされているproviderごとに確認する。

例:

- X/Twitter
- Google

確認:

- provider redirect
- callback
- existing account
- new account
- account linkage
- logout / relogin

---

# Article

## STG-ARTICLE-001 Create Draft

確認:

- title
- description
- category
- marker
- draft
- validation

---

## STG-ARTICLE-002 Publish

draftからpublish。

確認:

- public list
- marker
- category
- user page

へ反映される。

---

## STG-ARTICLE-003 Image Upload

確認:

- valid image
- size limit
- unsupported file
- S3 URL
- browser表示
- edit後も維持

可能ならNetwork tabも確認する。

presigned upload採用時は、

```text
Browser → S3
```

になっていることも確認する。

---

## STG-ARTICLE-004 Edit

既存記事を変更。

確認:

- title
- description
- category
- marker
- image
- timestamp

---

## STG-ARTICLE-005 Delete

テスト用記事を削除。

確認:

- detail URL
- list
- marker counters
- category
- user page

から正しく消える。

---

# Reactions

## STG-GOOD-001 Good

匿名状態で確認。

- add
- count
- duplicate prevention
- remove/toggle

現行仕様に合わせる。

---

## STG-LIKE-001 Like

login状態で、

- add
- status
- user likes
- remove

を確認する。

---

# Special Map

## STG-MAP-001 Create

確認:

- title
- description
- thumbnail
- public/private
- selectable park

---

## STG-MAP-002 Marker Create

確認:

- lat/lng
- variant
- image
- description
- park

---

## STG-MAP-003 Marker Edit

各fieldを変更して確認。

---

## STG-MAP-004 Marker Delete

delete後のmap表示を確認。

---

## STG-MAP-005 Map Edit

map情報更新。

---

## STG-MAP-006 Map Delete

テスト用mapを削除。

関連markerの扱いも確認。

---

# Migration Validation

## STG-MIGRATION-001 Record Counts

migration scriptが出力した件数を確認。

最低限:

- User
- Article
- Marker
- Like
- Good
- SpecialMap
- SpecialMapMarker

---

## STG-MIGRATION-002 Existing IDs

複数のproductionデータについて、

```text
postId
markerId
userId
specialMapId
specialMapMarkerId
```

が保持されていることを確認。

---

## STG-MIGRATION-003 Existing Images

既存記事画像・user icon・special map画像を確認する。

画像URLが壊れていないこと。

---

## STG-MIGRATION-004 Existing Relations

サンプルを複数選び、

- Article → Author
- Article → Marker
- User → Articles
- Like → Article
- Good → Article
- SpecialMap → Markers

が正しいことを確認する。

---

# CloudFront / Deployment

## STG-INFRA-001 `/api/*`

ブラウザNetwork tabでAPI通信を確認。

理想:

```text
https://<stg-domain>/api/...
```

確認:

- same origin
- 不要なCORS errorなし
- API Gateway response正常
- API responseの誤cacheなし

---

## STG-INFRA-002 Cache

frontend deploy後、

- HTMLが更新される
- hashed assetsが取得される
- 古いHTMLが残らない

ことを確認。

---

## STG-INFRA-003 CloudFront invalidation

新しいfrontend revisionをdeployした際、

ユーザーが古いindex.htmlを長時間掴まないことを確認する。

---

# Responsive / Browser

## STG-UI-001 Desktop

普段利用するdesktop browserで主要画面確認。

---

## STG-UI-002 Mobile

mobile viewportまたは実機で主要画面確認。

---

## STG-UI-003 Console Errors

主要フロー中、

browser consoleに新規の致命的errorが出ないことを確認。

---

# SEO

## STG-SEO-001 Metadata

記事詳細等で、

- title
- description
- canonical
- OGP

を確認する。

stagingでは`noindex`が必要なら、それも確認する。

---

## STG-SEO-002 Sitemap

stagingで確認可能な場合、

- generation
- XML validity
- URL structure

を確認する。

production URLのSEOを破壊しないこと。

---

# Manual Test Report Format

Codexはユーザーに、以下の形式で結果を返してもらうよう案内する。

```text
STG-PUBLIC-001: PASS

STG-PUBLIC-002: FAIL
Expected:
記事詳細が表示される

Actual:
CloudFront 404

URL:
https://...

Console:
...

Network:
...

Screenshot:
必要なら添付
```

PASSだけの場合は、

```text
STG-PUBLIC-001: PASS
```

のような短い報告でよい。

FAILの場合のみ詳細を求める。

---

# staging testing中のCodexの動作

ユーザーからテスト結果が届いたら、Codexはその結果に基づいて修正する。

修正が必要なら、

```text
修正
↓
local test
↓
staging再deploy
↓
影響範囲のmanual regression testをユーザーへ案内
```

とする。

FAILを無視してproductionへ進んではならない。

---

# Staging Acceptance Gate

production作業へ進む条件は以下。

- automated tests PASS
- migration validation PASS
- staging deploy PASS
- 必須manual testが全てPASS
- blocker / critical issueが0
- migration手順が確定
- rollback手順が確定
- ユーザーがproduction進行を明示的に承認

Codexが自分で、

```text
staging acceptance complete
```

と判断してproductionへ進んではならない。

**ユーザーによる明示承認を必須とする。**

---

# 既存production調査

実装を始める前に必ず以下を調査する。

## GitHub

- `ShimeiYago/trivia-map`
- `ShimeiYago/trivia-map-api`

## AWS

AWS CLIで現在のTriviaMap production resourceとdeploy pipelineを調査する。

GitHub repoだけからproduction構成を推測しない。

---

# AWS CLIによる現行インフラ調査

まずread-only調査を行う。

調査中はproduction resourceを変更・削除しない。

---

# CodePipeline

TriviaMap frontendをdeployしているCodePipelineを特定する。

確認対象:

- pipeline name
- type/version
- Source
- Build
- Deploy
- branch
- GitHub/CodeStar connection
- artifacts
- artifact bucket
- IAM role
- stage/action構成
- deploy destination

各actionについて、

```text
stage
action name
provider
owner
category
version
configuration
inputArtifacts
outputArtifacts
roleArn
runOrder
region
```

を記録する。

---

# CodeBuild

CodeBuild projectについてAWS CLIで設定取得する。

確認対象:

- runtime
- image
- compute type
- buildspec
- environment variables
- Parameter Store
- Secrets Manager
- cache
- artifacts
- source
- service role
- timeout
- VPC
- logs
- report groups

repoの`buildspec.yml`だけを正としない。

---

# Frontend production environment variables

少なくとも既存コード上で以下がある。

```text
REACT_APP_API_BASE_URL
REACT_APP_SITE_URL
REACT_APP_ANALYTICS_ID
REACT_APP_NO_INDEX
REACT_APP_AD_CLIENT
REACT_APP_AD_SLOT_IN_ARTICLE
REACT_APP_AD_SLOT_IN_LIST
REACT_APP_AD_SLOT_UNDER_ARTICLE
```

実際の値の取得元を特定する。

secret valueはdocumentへ平文で記録しない。

---

# Production Frontend S3

確認:

- bucket
- region
- versioning
- encryption
- public access
- bucket policy
- CORS
- lifecycle
- tags
- website configuration
- ownership controls

既存production bucketを原則維持する。

---

# CloudFront

確認:

- Distribution ID
- aliases
- certificate
- origins
- OAI/OAC
- default behavior
- ordered behaviors
- cache policies
- origin request policies
- response headers policies
- custom errors
- root object
- logging
- WAF
- CloudFront Functions
- Lambda@Edge
- tags

特にSPA routingを確認する。

---

# CloudFront invalidation

deploy後のinvalidation方法を特定する。

- CodePipeline
- CodeBuild
- Lambda
- EventBridge
- shell
- CloudTrail
- manual procedure

現在必要な挙動は新deploy方式でも維持する。

---

# Route53 / ACM

確認:

- hosted zone
- A/AAAA Alias
- target
- certificate
- SAN
- certificate region
- validation

production domainを不要に変更しない。

---

# IAM

現在deploymentに必要なpermissionを特定する。

新方式ではleast privilegeへ整理する。

---

# CodePipeline廃止条件

CodePipelineの責務を完全に棚卸しする。

成果物:

```text
docs/current-deployment-inventory.md
```

対応表を作る。

| Current responsibility | Current implementation | New implementation | Verified |
|---|---|---|---|

CodePipeline / CodeBuildは、production新deploy方式が正常に動いたことを確認するまで削除しない。

---

# 新Frontend deployment

CodePipeline / CodeBuildは最終的に完全廃止する。

原則:

```text
GitHub
↓
CI
↓
npm ci
↓
lint / typecheck / test
↓
frontend build
↓
existing S3
↓
CloudFront invalidation
```

GitHub Actionsを第一候補とする。

AWS認証は長期Access KeyよりOIDC + IAM Roleを優先する。

---

# Production frontend resource policy

原則維持:

- existing S3 bucket
- existing CloudFront Distribution
- triviamap.jp
- Route53
- ACM

必要に応じて変更:

- `/api/*` behavior
- API origin
- cache policies
- IAM
- tags
- deploy procedure

resourceを不要に作り直さない。

---

# Target Architecture

```text
Browser
   │
   ▼
Existing Production CloudFront
   │
   ├── /*
   │     ↓
   │   Existing Frontend S3
   │
   └── /api/*
          ↓
    API Gateway HTTP API
          ↓
       Lambda
 Node.js 24.x / arm64
          ↓
        Hono
          │
      ┌───┴────┐
      ▼        ▼
 DynamoDB      S3
 application   images
 data
```

APIは原則1つのLambda上のHono applicationとする。

---

# Monorepo

```text
trivia-map/
├── apps/
│   ├── front/
│   └── api/
├── packages/
│   └── contracts/
├── infra/
├── scripts/
│   ├── deploy/
│   └── migration/
├── docs/
├── package.json
├── package-lock.json
├── tsconfig.base.json
├── .nvmrc
└── .node-version
```

npm workspacesを使用する。

---

# Node.js

repo全体:

```text
24.21.0
```

Lambda:

```text
nodejs24.x
```

対象:

- frontend
- API
- tests
- migration
- deploy
- CDK
- CI

---

# Shared Contracts

`packages/contracts`で、

- Article
- Marker
- User
- Like
- Good
- SpecialMap
- SpecialMapMarker
- pagination
- errors
- requests
- responses

を共有する。

Zod等を優先する。

---

# API compatibility

原則として現在frontendが使用するcontractを維持する。

- URL
- method
- request
- response
- pagination
- validation
- status
- auth behavior

contract変更時はfront/APIを同時変更する。

---

# Hono

構造:

```text
route
↓
service / use case
↓
repository
↓
DynamoDB
```

Serverless Monolithとする。

---

# DynamoDB

優先順位:

- simplicity
- maintainability
- predictable access pattern
- consistency
- migration safety

過剰なsingle-table designは避ける。

主entity:

```text
User
Article
Marker
Like
Good
SpecialMap
SpecialMapMarker
```

---

# Search

OpenSearchは導入しない。

小規模のため、

- Query
- limited Scan
- Lambda filtering

等を使う。

---

# Auth

既存authを完全調査する。

- signup
- verification
- login/logout
- JWT
- refresh
- Cookie
- password reset
- X/Twitter
- Google等
- auto login
- CSRF
- account linkage

優先順位:

1. security
2. user migration
3. avoiding custom auth
4. operational simplicity
5. cost

既存password hash migrationも検証する。

---

# Images

S3継続利用。

可能なら、

```text
Browser
↓
Presigned URL
↓
S3
```

とする。

既存画像URLを壊さない。

---

# CDK

最低限管理:

- API Gateway
- Lambda
- DynamoDB
- S3
- CloudFront changes
- IAM
- CloudWatch
- Route53 where appropriate
- ACM references
- Secrets / Parameters

既存production resourceは必要に応じてreference/importする。

---

# AWS Tags

最低限:

```text
Project=TriviaMap
Environment=stg|production
ManagedBy=CDK
```

必要に応じてComponent tagも付ける。

---

# Migration Script

MySQL → DynamoDB migrationをTypeScriptで実装。

条件:

- repeatable
- idempotent
- dry-run
- validation
- resumable
- local/stg/prod共通
- secretsを含めない

既存IDは原則維持する。

---

# Automated Tests

Codex自身でstaging deploy前までに完了するもの:

- lint
- typecheck
- frontend unit test
- API unit test
- repository test
- DynamoDB integration test
- auth unit/integration test
- contract test
- migration test
- build
- CDK synth

可能なものは全てlocal/CIで自動化する。

---

# Staging

stagingは新規resourceとしてCDK管理してよい。

```text
stg
├── CloudFront
├── Front S3
├── API Gateway
├── Lambda
├── DynamoDB
└── Image S3
```

production相当のroutingを再現する。

Codexはstagingへdeployするところまで実施する。

**staging deploy完了後は必ず停止する。**

---

# Production

stagingのmanual acceptance完了前は一切進めない。

production作業にはユーザーの明示的承認を必要とする。

---

# 作業順序

## Step 1

AWS CLIで現行production調査。

成果物:

```text
docs/current-aws-inventory.md
docs/current-deployment-inventory.md
```

---

## Step 2

既存application調査。

成果物:

```text
docs/current-api-inventory.md
docs/current-data-model.md
```

---

## Step 3

Target architecture。

成果物:

```text
docs/architecture.md
docs/dynamodb-design.md
docs/authentication.md
```

---

## Step 4

monorepo化。

---

## Step 5

contracts。

---

## Step 6

Hono API。

---

## Step 7

DynamoDB。

---

## Step 8

Auth。

---

## Step 9

Images。

---

## Step 10

CDK。

---

## Step 11

CodePipeline replacement。

---

## Step 12

Migration tooling。

---

## Step 13

Automated tests。

---

## Step 14

Staging infrastructure deploy。

---

## Step 15

Staging application deploy。

---

## Step 16 — Mandatory STOP

ここで必ず停止する。

以下をユーザーへ報告する。

- deploy result
- automated test result
- known issues
- staging URLs
- infrastructure summary
- manual staging test guide

productionへは進まない。

---

## Step 17 — Human Staging Acceptance

このStepはユーザーが実施する。

Codexはテストケースを1つずつガイドし、ユーザーのPASS/FAIL結果を受け取る。

FAILが出た場合は修正してstagingへ再deployする。

---

## Step 18 — Production Preparation

全manual acceptance PASS後、かつユーザーの明示承認後のみ開始する。

---

## Step 19 — Production Cutover

別途ユーザーの承認を得た上で実施する。

---

## Step 20 — Legacy Cleanup

production安定確認後のみ、

- CodePipeline
- CodeBuild
- EC2
- MySQL resources
- obsolete IAM
- obsolete artifacts

を整理する。

---

# 完了条件

staging phaseの完了条件:

- monorepo化
- Node.js `24.21.0`
- Hono API
- DynamoDB
- CDK
- migration tooling
- automated tests
- frontend build
- staging deploy
- staging URL発行
- manual test guide完成

**この時点ではプロジェクト全体を「完了」と扱わない。**

production移行完了条件は別途、

- human staging acceptance PASS
- user production approval
- production migration
- production cutover
- production smoke test
- rollback確認
- legacy cleanup判断

まで完了した場合とする。

---

# Codexへの最重要指示

このタスクでは設計案だけでなく、実際にrepoを変更する。

細かな確認待ちで不要に作業を止めず、staging deployまでは自律的に進める。

ただし、

**staging deploy完了だけは絶対的な停止ポイントとする。**

そこで必ず人間に制御を戻す。

ブラウザで確認していない項目について、

- verified
- tested
- passed
- working

と断定してはならない。

「コード上/自動テスト上は確認済み」と「人間がstaging browserで確認済み」を明確に区別する。

productionへの変更は、stagingのmanual acceptanceが完了し、ユーザーが明示的に承認するまで行わない。

---

# staging deploy後の最終メッセージ形式

Codexは概ね以下の順で報告する。

```text
Staging deployment completed.

1. Deployed revision
2. Staging URLs
3. AWS resources created/updated
4. Automated test results
5. Migration validation results
6. Known issues
7. Manual staging acceptance tests

Production has NOT been modified.
I have stopped here as instructed.
```

その後、ユーザーに最初のmanual test caseから案内を開始する。

一度に全ケースを投げるだけでなく、

```text
STG-PUBLIC-001
↓
ユーザー結果
↓
STG-PUBLIC-002
```

のように順番に進めてもよい。

ユーザーが一覧形式でまとめて実施したい場合は、全ケースをチェックリスト形式で提示する。

FAILがあれば、そのケースと影響範囲を優先して修正する。