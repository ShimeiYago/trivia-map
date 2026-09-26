# Production リリース受入れテストガイド

対象: `https://triviamap.jp`

このガイドは、新しい serverless production をリリースする際の確認手順です。staging の全回帰テストを繰り返すものではなく、production 固有の設定、実メール、移行データ、外部連携、切替、監視、rollback 判定に絞ります。

進捗は [prod-release-test-tracker.xlsx](prod-release-test-tracker.xlsx) で管理します。`進捗トラッカー` シートの `状態` をクリックし、`未着手`、`実施中`、`PASS`、`FAIL`、`BLOCKED`、`SKIPPED` から選択してください。各行の `詳細を開く` から手順を確認できます。

## 実施上の原則

- production の変更とcutoverは、staging manual acceptance完了後、かつリリース責任者の明示承認後だけ実施する。
- production test用アカウント、記事、Special Mapには `[PROD TEST YYYYMMDD]` を付け、既存移行データを編集・削除しない。
- メールは担当者が管理する実在アドレスだけへ送信する。第三者のアドレスを試験に使わない。
- Cookie、Authorization header、password、verification/reset token、OAuth query、SMTP情報を記録しない。
- P0がFAILした場合は後続の書込み操作を停止し、release ownerが継続またはrollbackを判断する。
- cleanupは確認に必要な証跡を取得した後に行い、cleanup結果も記録する。
- rollback実行自体は、このガイドを根拠に自動実行しない。release ownerの明示承認を必要とする。

## 開始前に記録する情報

| 項目 | 記録内容 |
| --- | --- |
| release revision | commit SHA、tag、workflow run |
| 実施日時・担当者 | JST、release owner、tester |
| 対象AWS | account ID、region、stack名、CloudFront distribution ID |
| migration | validation report、実行時刻、source snapshot識別子 |
| rollback先 | 旧distribution/API、直前revision、切戻し手順へのリンク |
| test identity | 表示名のみ。メールアドレスとcredentialは記録しない |
| 証跡 | HAR、スクリーンショット、CloudWatch queryの保存先 |

## 判定基準

- `P0`: release継続条件。FAILなら停止し、影響範囲を確認してrollback判断へ進む。
- `P1`: release当日に確認する主要機能。既知問題として許容する場合は責任者・期限・回避策を記録する。
- `P2`: 監視期間内に確認可能。SKIPPEDには理由と実施予定を必ず記録する。
- 最終GO条件は、全P0がPASS、P1のFAILが承認済み、cleanup完了、監視に重大errorがないこと。

## ケース一覧

| Test ID | 重要度 | フェーズ | テスト名 |
| --- | --- | --- | --- |
| PROD-PRE-001 | P0 | リリース前 | 承認・revision固定 |
| PROD-PRE-002 | P0 | リリース前 | backup・rollback準備 |
| PROD-PRE-003 | P0 | リリース前 | production設定・secret境界 |
| PROD-PRE-004 | P0 | リリース前 | migration validation |
| PROD-CUTOVER-001 | P0 | 切替直後 | DNS・TLS・Basic認証撤去 |
| PROD-CUTOVER-002 | P0 | 切替直後 | frontend・API・image同一origin |
| PROD-CUTOVER-003 | P1 | 切替直後 | SPA・cache・invalidation |
| PROD-CUTOVER-004 | P0 | 切替直後 | API Gateway直接アクセス拒否 |
| PROD-DATA-001 | P0 | データ | 件数・legacy ID・relation |
| PROD-DATA-002 | P0 | データ | 画像・地図tile |
| PROD-AUTH-001 | P0 | 認証・メール | allowlistなしsignup・verification |
| PROD-AUTH-002 | P0 | 認証・メール | resend・password reset |
| PROD-AUTH-003 | P0 | 認証 | 既存／新規login・session・logout |
| PROD-AUTH-004 | P1 | 認証 | X OAuth production callback |
| PROD-MAIL-001 | P1 | メール | inquiry配送先 |
| PROD-SEC-001 | P0 | セキュリティ | Cookie・CSRF・Origin |
| PROD-SEC-002 | P0 | セキュリティ | draft記事の非公開性 |
| PROD-SEC-003 | P0 | セキュリティ | 非公開Special Mapの非公開性 |
| PROD-WRITE-001 | P1 | 書込み | 記事lifecycle・cleanup |
| PROD-WRITE-002 | P1 | 書込み | Special Map lifecycle・cleanup |
| PROD-WRITE-003 | P1 | 書込み | Good・Like一意性 |
| PROD-SEO-001 | P1 | 公開設定 | robots・sitemap・canonical・AdSense |
| PROD-OBS-001 | P0 | 監視 | CloudWatch・配送・5xx確認 |
| PROD-OBS-002 | P0 | 監視 | 安定監視・最終GO判定 |
| PROD-ROLLBACK-001 | P0 | rollback | 切戻し可能性・判断記録 |

## 詳細手順

### PROD-PRE-001 — 承認・revision固定

目的: stagingで合格したものと同一revisionだけをproductionへ出す。

事前条件: staging manual acceptance結果、CI結果、release候補commitが揃っている。

操作: 全STGケースの結果と既知問題を確認し、release commit/tagとproduction workflow runを記録する。release ownerからproduction実行の明示承認を得る。

PASS条件: 未承認変更がなく、対象revisionと承認者が一意に記録されている。

FAIL時: 差分、未完了STGケース、承認不足を記録し、production変更を開始しない。

### PROD-PRE-002 — backup・rollback準備

目的: cutover後に重大障害が起きてもデータと経路を戻せる状態にする。

操作: migration source snapshot、DynamoDB PITR/backup、S3 versioningまたはコピー、旧frontend/API/DNS情報、rollback手順、担当者を確認する。実際の切戻しは行わない。

PASS条件: 復旧元、切戻し対象、権限、所要時間、実行責任者が確認できる。

FAIL時: 欠けているbackupまたは権限を記録し、cutoverを停止する。

### PROD-PRE-003 — production設定・secret境界

目的: staging設定やcredentialがproductionへ混入していないことを確認する。

操作: site/API origin、mail secret、X callback、JWT/signing key、S3 bucket、table、noindex、Basic認証、AdSense設定を秘密値を表示せず照合する。

PASS条件: production専用resourceを参照し、staging URL、staging allowlist、Basic認証、noindexがproduction build/runtimeに存在しない。

FAIL時: resource名と設定キーだけを記録し、secret値は記録しない。

### PROD-PRE-004 — migration validation

目的: cutover対象データがsource snapshotと一致することを確認する。

操作: count、legacy ID、relation、Twitter identity、画像key/checksum、resume/idempotencyのvalidation reportを確認する。

PASS条件: 許容差0の項目が一致し、例外がある場合はrelease ownerの承認と影響範囲が記録されている。

FAIL時: entity、期待件数、実件数、sample IDを記録してcutoverを停止する。

### PROD-CUTOVER-001 — DNS・TLS・Basic認証撤去

目的: production domainが新distributionを公開状態で安全に提供することを確認する。

操作: `https://triviamap.jp` と代表的なhostを通常browser/curlで開き、DNS、certificate、HTTP→HTTPS、Basic認証promptの有無を確認する。

PASS条件: 正しいcertificateで200相当になり、Basic認証やstaging hostへのredirectがない。

FAIL時: resolved target、certificate subject/expiry、status、redirect chainを記録する。

### PROD-CUTOVER-002 — frontend・API・image同一origin

目的: productionの主要origin routingが正しいことを確認する。

操作: homepage、`/api/health`、公開記事API、実在する`/images/*`を開き、Networkのhost、status、content-typeを確認する。

PASS条件: production同一originでfrontend/API/imageが成功し、localhost・staging・旧APIへのrequestがない。

FAIL時: request URL、status、content-type、CloudFront headerを記録する。

### PROD-CUTOVER-003 — SPA・cache・invalidation

目的: 新revisionが直接URLとreloadで一貫して配信されることを確認する。

操作: 記事、Special Map、loginなどの直接URLを開き、hard reloadと通常reloadを行う。HTMLとhashed assetのcache header、revisionを確認する。

PASS条件: SPA routeが表示され、旧index/assetとの混在やAPI/imageのindex.html化がない。

FAIL時: URL、cache header、asset hash、response body種別を記録する。

### PROD-CUTOVER-004 — API Gateway直接アクセス拒否

目的: CloudFrontを経由しないAPI利用を拒否する。

操作: production API Gateway URLのhealthと代表routeへ、CloudFront専用headerなしでアクセスする。

PASS条件: 404相当で拒否され、CloudFront経由の同じAPIは成功する。

FAIL時: direct URLのhost、method、statusのみを記録する。専用header値は記録しない。

### PROD-DATA-001 — 件数・legacy ID・relation

目的: migration後の主要データをproduction UI/APIで抜き取り確認する。

操作: Users、Articles、Markers、Likes、Goods、Special Mapsをvalidation reportと比較し、変更しないlegacy IDを複数開く。

PASS条件: 件数とIDが一致し、author、marker、category、Like/Good、map-marker relationが正しい。

FAIL時: entity、ID、期待値、実値を記録し、既存データは変更しない。

### PROD-DATA-002 — 画像・地図tile

目的: 移行画像とmap tileが画像として配信されることを確認する。

操作: user icon、article image、Special Map thumbnail/marker imageを複数表示し、Land/Seaを全zoomで移動する。

PASS条件: 実在画像/tileが`200 image/*`で、欠落・HTML代替・大量の403/404がない。

FAIL時: 固定resource URL、status、content-type、画面位置を記録する。

### PROD-AUTH-001 — allowlistなしsignup・verification

目的: productionでstaging allowlistが適用されず、担当者管理下の新規アドレスへ認証メールが届くことを確認する。

事前条件: staging allowlistに含まれない、未登録の実在テストアドレスを最低1件用意する。可能なら異なるmail providerを2件使う。

操作: signupし、受信時刻、送信元、件名、production linkを確認してverificationを完了する。

PASS条件: allowlist由来の拒否がなくaccountが作成され、メールが適切な時間内に届き、linkがproduction originを指して認証できる。

FAIL時: provider、request/受信時刻、status、画面を記録する。アドレス全文とtokenは記録しない。

### PROD-AUTH-002 — resend・password reset

目的: productionの認証メール再送とpassword resetを確認する。

操作: 管理下アドレスでresendとresetを実行し、新passwordでloginする。未登録アドレスへの応答がaccount有無を漏らさないことも確認する。

PASS条件: production linkが届き、tokenが一度だけ有効で、汎用応答によりaccount enumerationができない。

FAIL時: 操作時刻、provider、status、汎用応答との差異を記録する。

### PROD-AUTH-003 — 既存／新規login・session・logout

目的: migration済みaccountと新規accountの双方で認証sessionを確認する。

操作: 既存accountとPROD-AUTH-001のaccountでlogin、reload、protected操作、logout、logout後の再操作を行う。

PASS条件: 正常login、session維持、refresh、logout後拒否が成立し、CookieにSecure/HttpOnly/SameSiteが付く。

FAIL時: account種別、時刻、status、Cookie属性名のみを記録する。

### PROD-AUTH-004 — X OAuth production callback

目的: X OAuthがproduction callbackと既存identityを使用することを確認する。

操作: productionからX loginし、provider redirect、callback origin、既存account linkage、logout/reloginを確認する。

PASS条件: callbackがproduction固定で、既存identityが重複accountを作らず、失敗時にcredentialを表示しない。

FAIL時: provider error code、callback origin、画面を記録し、query/tokenは伏せる。

### PROD-MAIL-001 — inquiry配送先

目的: inquiryがproduction管理者宛だけに届くことを確認する。

操作: `[PROD TEST]` と明記した問い合わせを1件送信し、事前調整したproduction受信担当者が受信を確認する。

PASS条件: production recipientへ1通だけ届き、staging recipientや入力者以外へ誤配送されない。

FAIL時: request/受信時刻、重複数、配送statusを記録する。recipient全文は記録しない。

### PROD-SEC-001 — Cookie・CSRF・Origin

目的: productionのcookie認証mutationをcross-origin操作から保護する。

操作: 正常originの更新が成功することを確認し、CSRF headerなし、不一致token、不正Originの代表mutationが拒否されることを確認する。

PASS条件: 正常操作だけが成功し、不正操作は401/403相当でデータを変更しない。

FAIL時: method、path、Origin、statusを記録し、Cookie/token値は記録しない。

### PROD-SEC-002 — draft記事の非公開性

目的: draft記事がURLやAPIを知る非所有者へ漏れないことを確認する。

操作: production test accountでdraftを作り、未ログイン・別test userから詳細URL/APIへアクセスする。公開一覧、marker、category、user page、sitemapも確認する。

PASS条件: 非所有者は404相当で内容を取得できず、ownerだけが管理できる。

FAIL時: test article ID、ユーザー状態、URL、status、漏洩fieldを記録する。

### PROD-SEC-003 — 非公開Special Mapの非公開性

目的: 非公開mapと配下marker・画像情報が非所有者へ漏れないことを確認する。

操作: marker/画像付き非公開test mapを作り、未ログイン・別test userから詳細、marker API、編集URL、公開一覧、sitemapを確認する。

PASS条件: 非所有者は404相当でmap/marker内容を取得できず、ownerだけが管理できる。

FAIL時: test map/marker ID、ユーザー状態、URL、status、漏洩fieldを記録する。

### PROD-WRITE-001 — 記事lifecycle・cleanup

目的: productionの代表的な記事write pathを最小回数で確認する。

操作: test記事をdraft作成、画像追加、編集、publishし、一覧・marker・categoryへ反映後に削除する。

PASS条件: lifecycleが一貫し、削除後に関連表示とtest画像が仕様どおりcleanupされる。

FAIL時: test ID、各操作status、残存箇所を記録する。

### PROD-WRITE-002 — Special Map lifecycle・cleanup

目的: productionのSpecial Mapとmarkerのwrite pathを確認する。

操作: 非公開test mapを作成し、marker/画像追加、編集、公開、非公開、marker削除、map削除を行う。

PASS条件: owner操作と公開状態が一貫し、最後にtest mapと関連markerが残らない。

FAIL時: test map/marker ID、操作status、残存resourceを記録する。

### PROD-WRITE-003 — Good・Like一意性

目的: productionでreactionの追加・解除と重複防止を確認する。

操作: test記事に匿名Goodとlogin Likeを追加・再操作・解除し、countと状態を確認する。

PASS条件: 重複record/countが作られず、最終状態が操作と一致する。

FAIL時: test article ID、操作順、count推移、statusを記録する。

### PROD-SEO-001 — robots・sitemap・canonical・AdSense

目的: stagingでは確認できないproduction公開設定を確認する。

操作: robots、sitemap、記事metadata、canonical、OGP、noindexの不在、AdSense script/client設定を確認する。

PASS条件: production URLだけを参照し、index可能な方針と正しいAdSense設定になっている。Consoleに広告設定由来の致命的errorがない。

FAIL時: URL、meta名、期待値、実値、Console messageを記録する。広告credentialは記録しない。

### PROD-OBS-001 — CloudWatch・配送・5xx確認

目的: smoke test中のserver-side障害と意図しないメール配送を検出する。

操作: deploy時刻以降のLambda/API/CloudFront 4xx・5xx、throttle、duration、mail failure/suppression、認証失敗metricとlogを確認する。

PASS条件: 説明できない5xx、急増した4xx、throttle、機密情報log、誤配送がない。

FAIL時: 時刻範囲、metric、request ID、匿名化したlog抜粋を記録する。

### PROD-OBS-002 — 安定監視・最終GO判定

目的: cutover直後だけでなく、定めた監視期間で安定していることを確認する。

操作: release ownerが定めた監視期間後にerror rate、latency、主要画面、メール、未cleanup test data、P0/P1結果を再確認する。

PASS条件: 全P0がPASS、未承認P1 FAILがなく、重大alertとtest data残存がない状態でGOが記録される。

FAIL時: 未解決ケース、metric、影響、owner判断、次回判定時刻を記録する。

### PROD-ROLLBACK-001 — 切戻し可能性・判断記録

目的: rollbackが必要になった場合に、production dataを壊さず実行できることを確認する。

操作: rollback trigger、DNS/CloudFront/API/frontendの切戻し順、migration後writeの扱い、担当者、確認コマンドを読み合わせる。rollbackが不要なら実行しない。

PASS条件: 手順と権限が揃い、rollbackを実行した／しない理由と判断者が記録される。

FAIL時: 不足手順、権限、復旧不能なwrite、判断保留理由を記録し、legacy cleanupを開始しない。

## 最終レポート

production確認完了時は、次をまとめます。

- release revision、workflow run、cutover時刻
- 全ケースのPASS/FAIL/BLOCKED/SKIPPED
- P0/P1の未解決事項と承認者
- migration validation結果
- test dataとメールのcleanup結果
- 監視期間と主要metric
- rollback判断とlegacy cleanup可否

