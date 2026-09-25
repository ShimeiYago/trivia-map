# Staging 手動受入れテストガイド

対象: `https://stg.triviamap.jp`

このガイドは staging リリース後に人手で行う受入れテストです。production を操作しないでください。Basic 認証情報は安全な共有経路で取得し、記録・スクリーンショットへ含めないでください。

## 実施方法

- 原則として上から順に実施する。
- 作成・更新・削除操作は staging のテスト用データだけで行う。
- FAIL 時は Test ID、URL、操作、期待結果、実際の結果、Console/Network のエラー、スクリーンショットを記録する。
- PASS は `STG-XXX: PASS` の短い記録でよい。

## 共通の事前条件

- Basic 認証を通過し、staging を開けること。
- 通常ユーザーと、記事・Special Map の作成に使う staging テストユーザーを用意すること。
- メール系テストは staging mail allowlist の検証用アドレスだけを使うこと。
- 既存移行データを閲覧するケースでは、編集・削除しないこと。

## Public

### STG-PUBLIC-001 — トップページ

目的: 公開トップと地図が正常に表示されること。

操作: staging URL を開く。

期待結果: React app、地図、marker、frontend asset が表示され、HTTP エラーと致命的な Console error がない。

### STG-PUBLIC-002 — SPA direct access

目的: CloudFront の SPA fallback を確認する。

操作: `/articles/<既存ID>` をアドレスバーから直接開く。記事以外の代表 route も同様に開く。

期待結果: 404/403 にならず React Router が表示され、対象データを取得できる。

### STG-PUBLIC-003 — 記事一覧

目的: 記事一覧 API と UI の整合性を確認する。

操作: 一覧で pagination、next/previous、sort を操作する。

期待結果: 件数、thumbnail、title、category が正しく、ページ遷移で重複・欠落がない。

### STG-PUBLIC-004 — 記事詳細

目的: 移行済み記事の表示を確認する。

操作: 既存記事を複数開く。

期待結果: URL、ID、title、description、image、author、marker、category、Good 数が migration 前の内容と一致する。

### STG-PUBLIC-005 — Category

目的: category 絞り込みを確認する。

操作: 各 category ページと 0 件の category を開き、pagination を操作する。

期待結果: 対象 category の記事だけが表示され、URL とページングが正しい。

### STG-PUBLIC-006 — Keyword Search

目的: 検索互換性を確認する。

操作: title、description、日本語、部分一致、0 件の keyword で検索する。

期待結果: 結果と pagination が正しく、既存 production と意図しない差異がない。

### STG-PUBLIC-007 — Marker

目的: Land/Sea marker の地図連携を確認する。

操作: Land と Sea の marker を選択して記事へ遷移する。

期待結果: position、記事数、category 数、click 後の navigation が正しい。

### STG-PUBLIC-008 — Special Maps

目的: Special Map 公開表示を確認する。

操作: list と detail を開き、marker を選択する。

期待結果: 地図、marker、marker image、description、selectable park が正しく表示される。

### STG-PUBLIC-009 — User page

目的: 移行済み公開 profile を確認する。

操作: 既存 user の公開ページを開く。

期待結果: nickname、icon、social icon、URL、記事など公開情報が正しい。

## Authentication

### STG-AUTH-001 — Signup

目的: allowlist 内の検証用アドレスだけで登録できること。

操作: 検証用アドレスで signup し、入力不正も確認する。

期待結果: validation と成功後画面が正しい。allowlist 外はユーザーを作成せず配送しない。

### STG-AUTH-002 — Email Verification

目的: 検証メールの導線を確認する。

操作: allowlist 内の新規ユーザーで verification link を開き、可能なら期限切れ link も試す。

期待結果: verified 状態へ遷移し、期限切れは安全に失敗する。

### STG-AUTH-003 — Login

目的: login とエラー応答を確認する。

操作: 正常 password、誤 password、存在しない user で login する。

期待結果: 正常時は redirect と login 後 UI が正しく、失敗時はアカウント情報を漏らさない。Cookie が Secure/HttpOnly で設定される。

### STG-AUTH-004 — Auto Login

目的: session 維持を確認する。

操作: login 後に reload する。

期待結果: login state と user 情報が復元され、不要なエラーがない。

### STG-AUTH-005 — Logout

目的: logout の失効を確認する。

操作: logout 後に protected UI/URL を開く。

期待結果: Cookie が無効化され、protected 操作はできない。

### STG-AUTH-006 — Token Refresh

目的: access token 更新を確認する。

操作: expiry 相当の状態で操作を継続する（可能な範囲で）。

期待結果: refresh 成功時は session を維持し、失敗時は安全にログアウト相当となる。

### STG-AUTH-007 — Password Reset

目的: reset 配送と password 更新を確認する。

操作: allowlist 内アドレスで reset request、link、new password login を試す。

期待結果: 新 password だけで login できる。allowlist 外・存在しない account は同じ汎用成功応答で配送されない。

### STG-AUTH-008 — Social Login

目的: X/Twitter login を確認する。

操作: provider redirect、callback、既存 identity、logout/relogin を確認する。

期待結果: `stg.triviamap.jp` の固定 callback を経由し、既存 account に紐づく。失敗時に機密情報が表示されない。

## Article and reactions

### STG-ARTICLE-001 — Create Draft

操作: テストユーザーで title、description、category、marker を指定して draft を作成する。

期待結果: validation が正しく、draft は公開一覧に出ない。

### STG-ARTICLE-002 — Publish

操作: 作成した draft を publish する。

期待結果: public list、marker、category、user page に反映される。

### STG-ARTICLE-003 — Image Upload

操作: 有効画像、サイズ超過、非対応 file を upload する。

期待結果: 有効画像は表示・編集後も維持され、無効 input は拒否される。Network tab に不要なエラーがない。

### STG-ARTICLE-004 — Edit

操作: テスト記事の title、description、category、marker、image を変更する。

期待結果: 更新内容と timestamp が正しく、別ユーザーは更新できない。

### STG-ARTICLE-005 — Delete

操作: テスト記事を削除する。

期待結果: detail、list、marker counter、category、user page から消える。

### STG-GOOD-001 — Good

操作: 匿名状態で add、再操作、remove/toggle を試す。

期待結果: count と duplicate prevention が現行仕様どおりである。

### STG-LIKE-001 — Like

操作: login 状態で add、状態表示、remove を試す。

期待結果: user の Like 状態と表示が一致し、重複しない。

## Special Map

### STG-MAP-001 — Create

操作: テスト用 map を title、description、thumbnail、public/private、selectable park で作成する。

期待結果: 入力値と公開状態が正しい。

### STG-MAP-002 — Marker Create

操作: lat/lng、variant、image、description、park を持つ marker を作成する。

期待結果: map 上の表示と属性が正しい。

### STG-MAP-003 — Marker Edit

操作: 作成した marker の各 field を変更する。

期待結果: 変更内容が保存・表示される。

### STG-MAP-004 — Marker Delete

操作: テスト marker を削除する。

期待結果: map 表示から消え、他 marker は影響を受けない。

### STG-MAP-005 — Map Edit

操作: テスト map の情報を更新する。

期待結果: 更新内容が保存され、所有者以外は更新できない。

### STG-MAP-006 — Map Delete

操作: テスト map を削除する。

期待結果: map が表示されなくなり、関連 marker の扱いが仕様どおりである。

## Migration and infrastructure

### STG-MIGRATION-001 — Record Counts

操作: [migration-validation.md](migration-validation.md) と staging 表示/API を照合する。

期待結果: User 143、Article 294、Marker 230、Like 54、Good 200、SpecialMap 33、SpecialMapMarker 700 と整合する。

### STG-MIGRATION-002 — Existing IDs

操作: 複数データの postId、markerId、userId、specialMapId、specialMapMarkerId を確認する。

期待結果: legacy ID が維持される。

### STG-MIGRATION-003 — Existing Images

操作: 既存記事、user icon、Special Map の画像を複数開く。

期待結果: URL と画像内容が壊れていない。

### STG-MIGRATION-004 — Existing Relations

操作: Article→Author/Marker、User→Articles、Like/Good→Article、SpecialMap→Markers を複数確認する。

期待結果: relation が正しい。

### STG-INFRA-001 — `/api/*`

操作: Browser Network tab で公開・認証済み API を確認する。

期待結果: `https://stg.triviamap.jp/api/...` の same-origin 通信で、CORS error や誤 cache がない。

### STG-INFRA-002 — Cache

操作: hard reload を含めて frontend asset を確認する。

期待結果: 新しい HTML と hashed asset が取得され、古い index.html が残らない。

### STG-INFRA-003 — CloudFront invalidation

操作: 今回の revision で browser cache を外して表示確認する。

期待結果: 現行 frontend revision が表示される。

## Browser and SEO

### STG-UI-001 — Desktop

操作: 普段使う desktop browser で主要フローを確認する。

期待結果: layout と操作が正常である。

### STG-UI-002 — Mobile

操作: mobile viewport または実機で主要画面を確認する。

期待結果: responsive layout と操作が正常である。

### STG-UI-003 — Console Errors

操作: 主要フロー中の Console を確認する。

期待結果: 新規の致命的 error がない。

### STG-SEO-001 — Metadata

操作: 記事詳細の title、description、canonical、OGP を確認する。

期待結果: metadata が正しく、必要なら staging が noindex である。

### STG-SEO-002 — Sitemap

操作: staging で利用可能な sitemap を開く。

期待結果: XML validity と URL structure が正しく、production SEO に影響しない。

## 報告テンプレート

```text
STG-PUBLIC-001: PASS

STG-PUBLIC-002: FAIL
URL: https://...
操作: アドレスバーから直接開く
Expected: 対象記事が表示される
Actual: CloudFront 404
Console: ...
Network: ...
Screenshot: 添付（必要な場合）
```

FAIL が出た場合は修正、local test、staging 再 deploy の後、影響範囲のケースを再実施します。すべての必須ケースが PASS し、ユーザーが明示承認するまでは production 作業へ進みません。
