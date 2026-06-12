# sekaistay-com ROADMAP — 広告運用

> **🧊 2026-06-12 AI 自動タスク凍結（テンイチ指示）**
> マーケ運用はヨシトに移管済み（`sekaistay-marketing` 参照）。本 ROADMAP の未完了タスクは全て `(人間)` 付与済みで、AI picker の自動実行対象外（ヨシト/テンイチが手動で進める）。
> PR TIMES 反響分析等の定期観測も自動実行しない。例外: Google Ads は配信中のため、観測スクリプト（`scripts/daily-performance-report.mjs` / `scripts/anomaly-check.mjs`）の実行・修正はテンイチの明示指示があった時のみ対応。

> SEKAI STAY の Google / Meta / X 広告運用ロードマップ。
>
> **目的**: 月 50 万円予算で 75 リード（Google 35 / Meta 25 / X 15）を獲得し、再現可能な広告運用ノウハウを会社資産にする。
>
> **役割分担**: AI（てんちむ）が観測・コード実装・計測整備、テンイチが配信オン/オフ・予算・課金・採用判断。
> 詳細は `ad-ops/README.md` の役割分担表 + `feedback_yoshizo_absolute_rules.md`。
>
> 設計原則: **観測 → Inbox 提案 → 人間判断 → 適用**。AI は広告管理画面を自動操作しない。
>
> AI に拾わせない人間タスクは冒頭に `(人間)` を付ける（picker が自然にスキップする）。

---

## Phase 0: 基盤構築 ✅

- [x] GA4 (`G-B7M920RCGR`) layout.tsx 実装済み
- [x] Meta Pixel (`989839370242915`) layout.tsx 実装済み（2026-05-10 切替）
- [x] Meta CAPI アクセストークン → Vercel env 登録済み (2026-05-09)
- [x] X Ads アカウント @tenichiliu 開通済み・Campaign 画面到達確認 (2026-05-09)
- [x] LP variants 3 種（switch / switch/portal / switch/founder）実装済み
- [x] フォーム送信 API（/api/report-requests/submit → Supabase + CRM 転送）実装済み
- [x] 訴求パターン × LP マッピング確定（価格主導 / ポータル主導 / 信頼主導）(2026-05-09)
- [x] Privacy Policy に Meta CAPI 言及済み
- [x] Google Ads コピー下書き作成済み（google-ads/copy-drafts.md）
- [x] Google Ads キーワードリスト作成済み（google-ads/keyword-list.md）
- [x] Meta Ads コピー下書き作成済み（meta-ads/copy-drafts.md）
- [x] Meta Ads オーディエンス設計済み（meta-ads/audience-targeting.md）
- [x] X Ads コピー下書き作成済み（x-ads/copy-drafts.md）

---

## Phase 1: Google Ads 計測セットアップ [P1]

- [x] (人間) Google Ads アカウント開設・課金方法紐付け（2026-05-12 稼働開始確認）
- [x] (人間) GA4 ↔ Google Ads アカウント連携（generate_lead CV インポート稼働確認）
- [x] (人間) フォーム送信 CV インポート設定（GA4 `generate_lead` → Google Ads・ENABLED 確認）
- [x] タグ ID・コンバージョン ラベルを API 取得 → NEXT_PUBLIC_GOOGLE_ADS_ID=AW-18060993274 Vercel env 登録済み（2026-06-11）
- [ ] (人間) Google Ads CV 動作確認（GA4 リアルタイム + Ads ステータス確認） @impact:7 @urgency:7 @effort:1

---

## Phase 2: Meta CAPI 実装 [P1]

- [x] PR4: lib/meta-capi.ts 作成（SHA-256 ハッシュ + Meta Graph API 呼び出し helper） @impact:9 @urgency:8 @effort:3
- [x] PR4: /api/report-requests/submit に CAPI 統合実装（event_id 生成・fire-and-forget） @impact:9 @urgency:8 @effort:2
- [x] PR4: ReportRequestForm.tsx の fbq 呼び出しに eventID を渡す（重複除去のキー） @impact:8 @urgency:8 @effort:1
- [ ] 🚨 (人間) **META_CAPI_TOKEN 再発行**（現在 400 エラー中・2026-06-11 確認）@impact:9 @urgency:9 @effort:1
  - エラー: `GraphMethodException code:100/33 - Object '1658477098524563' missing permissions`
  - 原因推定: トークンが旧 Pixel `989839370242915` 用に発行されたまま Pixel を切り替えた
  - 修正: Events Manager → Pixel `1658477098524563` → 設定 → CAPI → トークン再生成 → Discord DM で共有 → AI が `vercel env add META_CAPI_TOKEN production` で更新
- [ ] (人間) テストイベント コード取得（Events Manager → テストイベント タブ）→ Discord 共有 → META_CAPI_TEST_EVENT_CODE Vercel env 登録 @impact:8 @urgency:8 @effort:1
- [ ] (人間) Test Events 動作確認（Pixel + CAPI 2 件確認・Meta が両方受信表示）— 上 2 件の人間タスク完了後に `node --env-file=.env.local scripts/test-meta-capi.mjs` で先行確認可 @impact:7 @urgency:7 @effort:1
  - **⛔ BLOCKED（2026-06-11 確認）**: 上 2 件の人間タスク未完了。`META_CAPI_TEST_EVENT_CODE` Vercel env 未登録。`META_CAPI_TOKEN` は 400 エラー継続中（旧 Pixel 用）。人間タスク完了→Discord DM 共有→AI が env 登録→`node --env-file=.env.local scripts/test-meta-capi.mjs` の順序で実施
- [ ] (人間) EMQ スコア 8 点以上確認 @impact:7 @urgency:6 @effort:1
- [ ] (人間) 本番 Live（META_CAPI_TEST_EVENT_CODE を空に → Redeploy） @impact:8 @urgency:7 @effort:1

---

## Phase 3: X Ads 計測セットアップ [P2]

- [x] (人間) X Pixel ID 取得（Ads Manager → ツール → コンバージョン トラッキング → UWT 作成） @impact:7 @urgency:6 @effort:1
- [x] X Pixel ID・タグコードを Discord 共有 → app/layout.tsx 実装（PR5） @impact:7 @urgency:6 @effort:2
- [ ] (人間) X Ads コンバージョン イベント定義（URL ベース or イベントベース・方式選択要） @impact:7 @urgency:6 @effort:1
- [ ] (人間) X Ads 課金方法設定（法人クレジットカード・Ads Manager → アカウント設定 → 課金） @impact:7 @urgency:6 @effort:1
- [x] x-ads/audience-targeting.md 作成（2026-06-12 確認済み・既存ファイル完成状態）@impact:6 @urgency:5 @effort:2

---

## Phase 4: 初回キャンペーン Live [P1]

- [ ] (人間) PR5: サンクスページ作成（/contact/thanks・X CV URL ベース方式用） @impact:6 @urgency:5 @effort:2
- [ ] (人間) Google Ads 初回キャンペーン設定（キーワード選定・CPA 目標入札・日予算 ¥17k） @impact:9 @urgency:7 @effort:3
- [ ] (人間) Meta Ads 初回キャンペーン設定（3 パターン × 3 LP AB テスト・日予算 ¥13k） @impact:9 @urgency:7 @effort:3
- [ ] (人間) X Ads 初回キャンペーン設定（/switch + /switch/portal・日予算 ¥5k → 慣らし ¥3k） @impact:7 @urgency:6 @effort:2
- [ ] (人間) 本人画像・クリエイティブ素材準備（IMAGES_MANIFEST.md から選定 + 追加撮影判断） @impact:7 @urgency:6 @effort:2

---

## Phase 5: 観測・自動化 [P2]

- [x] 日次パフォーマンス観測スクリプト（GA4 / Google Ads / Meta / X 指標収集 → Discord #sekai-stay サマリ投稿） @impact:8 @urgency:5 @effort:5
  - `scripts/daily-performance-report.mjs` 実装完了（2026-06-12）
  - 動作確認済み: Supabase leads/PV ✅ Google Ads ✅ GA4 ✅ X utm追跡 ✅
  - Meta: `API access blocked (code 200)` — META_ACCESS_TOKEN が System User Token でない可能性。ads_read スコープ付き System User Token に更新が必要
  - 実行: `npm run report:daily` または `node --env-file=.env.local scripts/daily-performance-report.mjs`
  - GA4_PROPERTY_ID=531120752 を .env.local に追加済み
  - crontab でのスケジューリング例: `0 8 * * * cd /path/to/sekaistay-com && node --env-file=.env.local scripts/daily-performance-report.mjs`
- [x] 異常検知実装（日予算超過 ¥30k / CPA 中央値 2 倍 / CV ゼロ 24h → Inbox `danger` + Slack） @impact:8 @urgency:5 @effort:4
  - `scripts/anomaly-check.mjs` 実装完了（2026-06-12）
  - 3チェック: 日予算超過(¥30k) → danger, CPA 2x中央値 → danger, CV ゼロ → general
  - CPA ベースライン: yesterday 除く直前7日・最低2日データ必要
  - dedup: agent_inbox の `source_ref->>dedup_key` で同日重複投稿防止
  - Slack: #001-ai-agent-hq に送信（SLACK_BOT_TOKEN from discord-claude/.env）
  - 実行: `npm run report:anomaly`
  - crontab 例: `5 8 * * * cd /path/to/sekaistay-com && node --env-file=.env.local scripts/anomaly-check.mjs`
- [ ] (人間) 週次レビュー下書き自動生成（月曜朝・Inbox `general` → テンイチが気づき追記） @impact:7 @urgency:4 @effort:4
- [ ] (人間) reports/ 日次レポート自動生成（媒体別・LP variant 別・reports/YYYY-MM-DD.md） @impact:6 @urgency:4 @effort:3
- [ ] (人間) 月次 KGI 達成度レビュー自動集計（リード数 / CPA / 媒体別）→ learnings.md 自動下書き @impact:6 @urgency:3 @effort:4

---

## Phase 6: スケール（6 月以降）[P2]

- [ ] (人間) 6 月: アフィリエイト開始（5 月は広告検証・PR 配信に集中）
- [ ] (人間) 勝ちパターンへの予算集中判断（CPA 優位の媒体に再配分）
- [ ] (人間) 新規訴求パターン追加 → A/B テスト設計（Inbox 提案） @impact:6 @urgency:5 @effort:3
- [ ] (人間) PR タイムズ配信（6/1）と広告の連動効果計測 @impact:6 @urgency:5 @effort:2

---

## Phase 7: X 長文投稿 × Boost the Winners [P1]

> 戦略詳細: [`ad-ops/STRATEGY_REPORT_X_2026-05-17.md`](ad-ops/STRATEGY_REPORT_X_2026-05-17.md)
> 初週ドラフト: [`ad-ops/x-ads/long-form-content-bank.md`](ad-ops/x-ads/long-form-content-bank.md)
>
> **タイムライン変更（2026-05-17）**: 5/22 プロダクトローンチ + PR TIMES 配信確定により全体を 1.5 週間前倒し。投稿開始は 5/18 (明日)、ローンチ同時砲火は 5/22、Boost the Winners 開始は 5/25。

### 🔴 Pre-W1: 今日（2026-05-17）— 即実行

- [ ] (人間) @tenichiliu プロフィール統一（bio + ヘッダー + 固定ツイート） @impact:8 @urgency:10 @effort:1
- [ ] (人間) ジローと X 運用方針確認・週次工数合意（Unplugged との両立判断） @impact:9 @urgency:10 @effort:1
- [ ] (人間) @jirosan アカウント開設 + プロフィール設定（ジロー合意取得後） @impact:9 @urgency:10 @effort:1
- [ ] (人間) @ss_unei_chan 架空社員アカウント開設 + bio で「SEKAI STAY 運営チームメンバー」明記 @impact:8 @urgency:10 @effort:1
- [ ] (人間) 3 アカウントの X Premium+ 課金（長文 4000 字解禁・明日からの投稿に必須） @impact:9 @urgency:10 @effort:1
- [x] X Pixel ID 取得 → `NEXT_PUBLIC_X_PIXEL_ID` Vercel env 登録 → layout.tsx 実装（確認: env 27日前登録済み・layout.tsx 実装済み 2026-06-11）@impact:8 @urgency:9 @effort:2

### 🟠 W1: 5/18-21 — 助走期間（ローンチ前 4 日間で長文 4 本投下）

- [ ] (人間) 5/18(月) 08:00: @tenichiliu 長文B #1（8% 構造解説）投稿 — Draft #1 はコンテンツバンク完成済み・手動投稿のみ @impact:9 @urgency:10 @effort:1
- [ ] (人間) 5/19(火) 12:00: @jirosan 長文B #3（DP 毎日触る話）投稿 @impact:9 @urgency:10 @effort:1
- [ ] (人間) 5/20(水) 19:00: @ss_unei_chan 長文B #5（家具失敗談）投稿 @impact:8 @urgency:9 @effort:1
- [ ] (人間) 5/21(木) 08:00: @tenichiliu 長文B #2（受賞振り返り）投稿 @impact:9 @urgency:9 @effort:1
- [ ] (人間) 5/21(木) 20:00: @tenichiliu / @jirosan からローンチ予告通常ツイート @impact:8 @urgency:9 @effort:1
- [x] 既存 X Ads 9 パターン投稿の棚卸し — 2026-06-12 実施。9 パターン全て評価完了。第1週配信推奨セット（P-X1/O-X1/T-X2）確定。ポリシーリスク高の P-X3 は要改修、"業界相場の半額" 表現は全体で緩める修正が必要。詳細: `ad-ops/x-ads/copy-drafts.md` 棚卸しレポートセクション。テンイチ確認事項 5 点あり。@impact:6 @urgency:7 @effort:2

### 🚀 5/22(金) — プロダクトローンチ + PR TIMES 配信日

- [x] (人間) PR TIMES 配信実行 @impact:10 @urgency:10 @effort:2
- [x] 5/22 ローンチ長文B 作成（@tenichiliu 経営者視点版・@jirosan 現場実証版）→ long-form-content-bank.md に追記 @impact:10 @urgency:10 @effort:3
- [x] 5/22 10:00: @tenichiliu + @jirosan で同時砲火（人間最終チェック後） @impact:10 @urgency:10 @effort:1
- [ ] (人間) 5/22 11:00: @ss_unei_chan 通常ツイート（中の人歓喜・短文） @impact:7 @urgency:10 @effort:1
- [ ] (人間) 全アカウントで PR TIMES 記事リンクの引用 RT + リプ強化 @impact:8 @urgency:10 @effort:1

### 🟡 W2: 5/23-24 — 余韻投下

- [ ] (人間) 5/23(土) 12:00: @jirosan 長文B #4（民泊新法 2026）投稿 @impact:8 @urgency:9 @effort:1
- [ ] (人間) 5/24(日) 19:00: @ss_unei_chan 長文B #6（オーナーダッシュボード）投稿 @impact:8 @urgency:9 @effort:1
- [x] PR TIMES 反響モニタリング（impressions / engagement 集計）→ Discord 報告 — 2026-06-11 実施。prtimes 経由リード 6件 (5/22-6/3)。impressions は PR TIMES 管理画面のみ確認可（自動取得不可）。`scripts/prtimes-monitor.mjs` に集計ロジック保存。@impact:7 @urgency:8 @effort:2
- [x] W3 分の長文B 6 本ドラフトを Claude 生成 → long-form-content-bank.md 追記 — 2026-06-12 生成完了。テンイチ×2・ジロー×2・架空社員×2。5本柱の未消化軸（業界トレンド/オーナー成功事例/Airbnb vs Booking/家具耐久性/法務申請/LINE体験談）で重複なし。投稿スケジュール付き。@impact:7 @urgency:7 @effort:3

### 🟢 W3: 5/25-31 — Boost the Winners 開始

- [ ] (人間) 5/25 から Boost the Winners 運用開始（W1-W2 オーガニック上位 20% を Promoted 化） @impact:9 @urgency:9 @effort:2
- [x] utm_content による Supabase 集計クエリ整備（オーガニック vs Promoted 内訳）— `/switch/x-content?admin=sekaichi2026` に集計ページ実装。Promoted 用 slug (t1p〜u6p) を go/ に追加。utm_medium=promoted で Boost the Winners データが自動集計される。@impact:7 @urgency:8 @effort:2
- [x] 日次 X 配信レポート Discord 投稿（Inbox `general`・3 アカウント別 impressions / engage / link click 集計） — 2026-06-12 実装完了。`scripts/x-daily-report.mjs` (npm run report:x)。@tenichiliu / @jiroisjiro / @ss_unei_chan を集計、impression_count は public_metrics で取得可。link_clicks は user auth 必須のため未集計（X Analytics で手動確認）。@ss_unei_chan 未開設は graceful skip。実行確認: Inbox general 投稿 id=458f397f-4693-46af-94e9-d9620aec3a42。ROADMAP の @jirosan は @jiroisjiro が正。crontab で 08:30 daily 登録推奨。@impact:7 @urgency:8 @effort:3

### 🟣 W4: 6/1-7 — 学習・最適化

- [x] Boost the Winners 1 週分データ分析 → 勝ちパターン特定（CPL ≤ ¥15K のクリエイティブを抽出） — 2026-06-11 実施。X Promoted ゼロ（未開始）・Google Ads: Creative 808617665996 が CPL ≈ ¥10K で 🏆 Winner、808511440458 は CVR 4.4% で Strong。詳細: `ad-ops/learnings.md` W4 週次ログ。@impact:8 @urgency:7 @effort:2
- [x] 長文 B コピー A/B 仮説抽出 → W5 以降のドラフト方針に反映 — 2026-06-12 実施。W1〜W3 18 本のフックパターンを 7 分類・7 仮説（H-LF1〜H-LF7）を抽出。設計ルール 6 点確立。W5 ドラフト 6 本生成（テンイチ×2・ジロー×2・架空社員×2）。詳細: `ad-ops/learnings.md` § 長文B コピー A/B 仮説 / `ad-ops/x-ads/long-form-content-bank.md` § W5 ドラフト。@impact:7 @urgency:6 @effort:2
- [ ] (人間) 義人さん週次レビュー受けて戦略修正 @impact:8 @urgency:7 @effort:1

### W5 以降（継続運用）

- [ ] (人間) 長文 B コンテンツバンクを M3 末で 50 本まで蓄積 @impact:7 @urgency:5 @effort:8
- [x] 月次 X チャネル KGI レビュー M1（2026-06-12 実施）— 実績 0 lead（目標 3-5）。X Promoted 未開始・長文B 投稿未実行がボトルネック。詳細: `ad-ops/learnings.md` M1 月次レビュー @impact:7 @urgency:5 @effort:1
- [ ] (人間) 月次 X チャネル KGI レビュー M2（目標: 8-12 lead・7月実施予定） @impact:7 @urgency:5 @effort:1
- [ ] (人間) 月次 X チャネル KGI レビュー M3（目標: 15-20 lead・8月実施予定） @impact:7 @urgency:5 @effort:1

---

## 設計原則（吉蔵基準）

1. AI は広告アカウントの管理画面を**自動操作しない**（広告アカウント設定・予算変更・配信 ON/OFF はテンイチ）
2. AI は計測コード・Vercel Function・CORS・LP コードを実装する（コードは AI 領域）
3. 異常は検知のみ（`danger` Inbox 通知）→ テンイチが管理画面で停止判断
4. CAPI トークン・Pixel ID は Vercel env のみに保存（コード・GitHub・Discord 公開チャネル禁止）
5. ガードレール（金銭操作の閾値）は `ad-ops/README.md` 参照
6. picker は `(人間)` プレフィックスを見て人間タスクをスキップする

---

## KGI（初月）

| 軸 | 目標 |
|---|---|
| Google Ads リード数 | 35 |
| Meta Ads リード数 | 25 |
| X Ads リード数 | 15 |
| **合計** | **75** |
| 月予算 | ¥500,000 |
| ブレンド CPA | ¥6,667 |

詳細は `ad-ops/README.md` の KGI セクション。

---

## 関連

- `ad-ops/README.md` — 役割分担・ガードレール・学習サイクル
- `ad-ops/learnings.md` — 学習ログ（日次 / 週次 / 確定ナレッジ / 失敗）
- `ad-ops/setup-guides/` — 各媒体のセットアップ手順
- `feedback_yoshizo_absolute_rules.md` — 吉蔵基準（絶対ルール・危険信号）
