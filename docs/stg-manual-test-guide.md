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

## 開始前の記録シート

テスト開始時に、以下をこのファイルとは別の作業メモに記入する。認証情報、Cookie の値、メール本文の token は記録しない。

| 項目 | 記録する値 |
| --- | --- |
| 実施日時・実施者 | 例: YYYY-MM-DD JST / 氏名 |
| browser / OS / viewport | browser version、desktop または mobile viewport |
| テストユーザー | 表示名だけ。メールアドレス・password は書かない |
| 既存閲覧用記事・map | 変更しない legacy ID または URL |
| 作成/削除用テスト記事・map | この受入れ用に作成した ID または URL |
| Console / Network 保存先 | HAR、スクリーンショット、Console export の保存先 |

## 共通の判定・証跡ルール

以下は全 `STG-*` に共通して適用する。後続の各ケース本文の「目的」「操作」「期待結果」に加え、下の判定表の「個別事前条件」「PASS条件」を満たしたときだけ PASS とする。

- **Console**: テスト操作前に Console を clear し、再現する error/warning は message、stack、時刻を記録する。既知の browser extension error は extension 名も記録する。
- **Network**: API 系の FAIL は request URL、method、status、response body（秘密情報を除く）、request ID があればその ID を記録する。Cookie/Authorization header、reset/verification token、Basic credential は絶対に貼らない。
- **認可**: 「別所有者で拒否」は、既存移行データを変更せず、テスト用リソースを別テストユーザーで操作して確認する。
- **メール**: allowlist 外の実在アドレスは使用しない。配送を確認するのは allowlist 内の検証用アドレスだけとする。
- **データ cleanup**: Create/Edit/Delete 系の PASS 後、公開したテスト記事・Special Map・marker を削除する。削除自体をテストするケースでは、その URL/ID と cleanup 結果を記録する。
- **停止基準**: データ破損、意図しないメール配送、認可漏れ、Basic 認証の回避、機密情報露出を見つけたら、そのケース以降の破壊的操作を止めて直ちに FAIL として報告する。

## 個別判定表

| Test ID | 個別事前条件 | PASS条件 | FAIL時に追加で記録する情報 |
| --- | --- | --- | --- |
| STG-PUBLIC-001 | Basic 認証済み、通常 browser | 地図・marker・asset を含むトップが表示され、致命的 error がない | 失敗 asset URL、Console、画面全体 |
| STG-PUBLIC-002 | 既存公開 article ID を控える | 直接 URL が 200 相当で対象記事を表示する | 開いた URL、response status、CloudFront error page |
| STG-PUBLIC-003 | 公開記事が2ページ以上ある場合は両ページ | sort/pagination の件数と表示順が安定する | query、前後ページの ID 一覧 |
| STG-PUBLIC-004 | 変更しない既存記事を3件選ぶ | 各 article の主要属性と画像が source 相当である | article ID、差異 field、画像 URL |
| STG-PUBLIC-005 | 各 category と0件条件を選ぶ | 絞り込み・0件・pagination が正しい | category URL、表示 article ID |
| STG-PUBLIC-006 | 日本語を含む検索語を3種以上選ぶ | title/description/部分一致/0件が仕様どおり | keyword、検索 URL、期待・実際の ID |
| STG-PUBLIC-007 | Land と Sea の既存 marker を選ぶ | position、count、遷移先が正しい | marker ID、座標、遷移 URL |
| STG-PUBLIC-008 | 既存公開 Special Map を選ぶ | map、marker、画像、park が表示される | map/marker ID、壊れた画像 URL |
| STG-PUBLIC-009 | 既存公開 user を選ぶ | 公開 profile と記事一覧が正しい | user ID、差異 field |
| STG-AUTH-001 | allowlist 内の未登録検証用アドレス | 正常登録し、allowlist 外では account/配送を作らない | 入力項目、汎用応答、Network status |
| STG-AUTH-002 | STG-AUTH-001 の未検証 user | link で verified となり、期限切れは安全に失敗する | link を除く時刻・画面・status |
| STG-AUTH-003 | テスト user と誤 password | 正常 login、失敗時の汎用エラー、Cookie 属性が正しい | response status、Set-Cookie の属性名のみ |
| STG-AUTH-004 | STG-AUTH-003 の login 状態 | reload 後も session と表示が維持される | reload URL、失敗 request |
| STG-AUTH-005 | login 状態 | logout 後に protected 操作が拒否される | logout 後 request status、画面 |
| STG-AUTH-006 | login 状態、可能なら expiry 再現手段 | refresh 後も安全に継続し、失敗時は保護される | 時刻、refresh request の status（token除外） |
| STG-AUTH-007 | allowlist 内のテスト user | new password のみで login でき、allowlist 外へ配送しない | request 時刻、画面、status。メール token は除外 |
| STG-AUTH-008 | X 側の staging callback 設定と既存 identity | 固定 staging callback で既存 account に戻る | provider error code、callback origin（query は伏せる） |
| STG-ARTICLE-001 | 記事作成可能なテスト user、cleanup 用 marker | draft が保存され公開一覧に出ない | 作成 article ID、validation message |
| STG-ARTICLE-002 | STG-ARTICLE-001 の draft | publish 後、全公開表示へ一貫して反映される | article ID、反映しない画面 |
| STG-ARTICLE-003 | サイズ内画像とサイズ超過/非対応 file | 有効画像だけが表示・保持され、無効 file は拒否される | file の種別/サイズ、upload status、画像 URL |
| STG-ARTICLE-004 | 自分のテスト記事と別 user | owner の更新だけ反映され、別 user は拒否される | before/after、403/404 response |
| STG-ARTICLE-005 | 削除してよいテスト記事 | 削除後に全関連表示から消える | article ID、削除後の各 URL |
| STG-GOOD-001 | 匿名 browser profile | add/remove が一貫し重複 count がない | 操作順、count の推移 |
| STG-LIKE-001 | login user と対象記事 | add/remove が user 状態・count と一致する | 操作順、count、request status |
| STG-MAP-001 | map 作成可能なテスト user | 各入力と public/private が保存される | map ID、before/after |
| STG-MAP-002 | STG-MAP-001 のテスト map | marker の座標・属性・画像が正しい | marker ID、座標、画像 URL |
| STG-MAP-003 | 自分のテスト marker と別 user | owner 更新のみが表示に反映される | before/after、拒否 response |
| STG-MAP-004 | 削除してよいテスト marker | 削除 marker のみ地図から消える | marker ID、削除後画面 |
| STG-MAP-005 | 自分のテスト map と別 user | owner 更新だけ保存される | before/after、拒否 response |
| STG-MAP-006 | 削除してよいテスト map | map と関連 marker の扱いが仕様どおり | map ID、関連 marker ID、削除後画面 |
| STG-MIGRATION-001 | validation report を参照可能 | 表示/API と report の件数が矛盾しない | entity、期待/実際 count |
| STG-MIGRATION-002 | 変更しない legacy ID を複数選ぶ | URL/API が legacy ID を維持する | ID、期待/実際 |
| STG-MIGRATION-003 | 既存画像の URL を複数選ぶ | 全画像が表示され壊れていない | resource URL、status |
| STG-MIGRATION-004 | relation ごとに複数 sample | 表示される relation が source と一致する | source/target ID、差異 |
| STG-INFRA-001 | DevTools Network を開く | `/api/*` が same-origin、CORS error/誤 cache なし | request URL/method/status/cache header |
| STG-INFRA-002 | hard reload 可能な browser | HTML と hashed asset が現 revision になる | asset URL、cache header、画面 |
| STG-INFRA-003 | STG-INFRA-002 を実施 | old `index.html` を取得しない | response header、表示 revision |
| STG-UI-001 | desktop browser | 主要画面が崩れず操作できる | browser/version、viewport、画面 |
| STG-UI-002 | mobile viewport または実機 | responsive layout と主要操作が正常 | device/viewport、画面 |
| STG-UI-003 | 各主要フローの前に Console clear | 新規の致命的 error がない | message、stack、再現手順 |
| STG-SEO-001 | 記事詳細 URL | title/description/canonical/OGP と noindex 方針が正しい | page source または DevTools Elements |
| STG-SEO-002 | sitemap URL が公開されている場合 | XML と URL structure が正しく production を参照しない | sitemap URL、validation error |

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
