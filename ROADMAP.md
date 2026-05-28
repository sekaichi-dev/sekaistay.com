# sekaistay-com ROADMAP — 広告運用

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

- [ ] (人間) Google Ads アカウント開設・課金方法紐付け @impact:9 @urgency:9 @effort:2
- [ ] (人間) GA4 ↔ Google Ads アカウント連携（管理画面でリンク設定） @impact:9 @urgency:9 @effort:1
- [ ] (人間) フォーム送信 CV インポート設定（GA4 `lead` イベント → Google Ads・値 ¥5,000・カウント 1 回） @impact:9 @urgency:8 @effort:1
- [ ] タグ ID・コンバージョン ラベルを Discord 共有 → NEXT_PUBLIC_GOOGLE_ADS_ID Vercel env 登録 @impact:8 @urgency:8 @effort:1
- [ ] (人間) Google Ads CV 動作確認（GA4 リアルタイム + Ads ステータス確認） @impact:7 @urgency:7 @effort:1

---

## Phase 2: Meta CAPI 実装 [P1]

- [ ] (人間) テストイベント コード取得（Events Manager → テストイベント タブ）→ Discord 共有 → META_CAPI_TEST_EVENT_CODE Vercel env 登録 @impact:8 @urgency:8 @effort:1
- [x] PR4: lib/meta-capi.ts 作成（SHA-256 ハッシュ + Meta Graph API 呼び出し helper） @impact:9 @urgency:8 @effort:3
- [x] PR4: /api/report-requests/submit に CAPI 統合実装（event_id 生成・fire-and-forget） @impact:9 @urgency:8 @effort:2
- [x] PR4: ReportRequestForm.tsx の fbq 呼び出しに eventID を渡す（重複除去のキー） @impact:8 @urgency:8 @effort:1
- [ ] Test Events 動作確認（Pixel + CAPI 2 件確認・Meta が両方受信表示） @impact:7 @urgency:7 @effort:1
- [ ] EMQ スコア 8 点以上確認 @impact:7 @urgency:6 @effort:1
- [ ] (人間) 本番 Live（META_CAPI_TEST_EVENT_CODE を空に → Redeploy） @impact:8 @urgency:7 @effort:1

---

## Phase 3: X Ads 計測セットアップ [P2]

- [x] (人間) X Pixel ID 取得（Ads Manager → ツール → コンバージョン トラッキング → UWT 作成） @impact:7 @urgency:6 @effort:1
- [x] X Pixel ID・タグコードを Discord 共有 → app/layout.tsx 実装（PR5） @impact:7 @urgency:6 @effort:2
- [ ] (人間) X Ads コンバージョン イベント定義（URL ベース or イベントベース・方式選択要） @impact:7 @urgency:6 @effort:1
- [ ] (人間) X Ads 課金方法設定（法人クレジットカード・Ads Manager → アカウント設定 → 課金） @impact:7 @urgency:6 @effort:1
- [ ] x-ads/audience-targeting.md 作成 @impact:6 @urgency:5 @effort:2

---

## Phase 4: 初回キャンペーン Live [P1]

- [ ] PR5: サンクスページ作成（/contact/thanks・X CV URL ベース方式用） @impact:6 @urgency:5 @effort:2
- [ ] (人間) Google Ads 初回キャンペーン設定（キーワード選定・CPA 目標入札・日予算 ¥17k） @impact:9 @urgency:7 @effort:3
- [ ] (人間) Meta Ads 初回キャンペーン設定（3 パターン × 3 LP AB テスト・日予算 ¥13k） @impact:9 @urgency:7 @effort:3
- [ ] (人間) X Ads 初回キャンペーン設定（/switch + /switch/portal・日予算 ¥5k → 慣らし ¥3k） @impact:7 @urgency:6 @effort:2
- [ ] (人間) 本人画像・クリエイティブ素材準備（IMAGES_MANIFEST.md から選定 + 追加撮影判断） @impact:7 @urgency:6 @effort:2

---

## Phase 5: 観測・自動化 [P2]

- [ ] 日次パフォーマンス観測スクリプト（GA4 / Google Ads / Meta / X 指標収集 → Discord #sekai-stay サマリ投稿） @impact:8 @urgency:5 @effort:5
- [ ] 異常検知実装（日予算超過 ¥30k / CPA 中央値 2 倍 / CV ゼロ 24h → Inbox `danger` + Slack） @impact:8 @urgency:5 @effort:4
- [ ] 週次レビュー下書き自動生成（月曜朝・Inbox `general` → テンイチが気づき追記） @impact:7 @urgency:4 @effort:4
- [ ] reports/ 日次レポート自動生成（媒体別・LP variant 別・reports/YYYY-MM-DD.md） @impact:6 @urgency:4 @effort:3
- [ ] 月次 KGI 達成度レビュー自動集計（リード数 / CPA / 媒体別）→ learnings.md 自動下書き @impact:6 @urgency:3 @effort:4

---

## Phase 6: スケール（6 月以降）[P2]

- [ ] (人間) 6 月: アフィリエイト開始（5 月は広告検証・PR 配信に集中）
- [ ] (人間) 勝ちパターンへの予算集中判断（CPA 優位の媒体に再配分）
- [ ] 新規訴求パターン追加 → A/B テスト設計（Inbox 提案） @impact:6 @urgency:5 @effort:3
- [ ] PR タイムズ配信（6/1）と広告の連動効果計測 @impact:6 @urgency:5 @effort:2

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
- [ ] X Pixel ID 取得 → `NEXT_PUBLIC_X_PIXEL_ID` Vercel env 登録 → layout.tsx 実装 @impact:8 @urgency:9 @effort:2

### 🟠 W1: 5/18-21 — 助走期間（ローンチ前 4 日間で長文 4 本投下）

- [ ] 5/18(月) 08:00: @tenichiliu 長文B #1（8% 構造解説）投稿 @impact:9 @urgency:10 @effort:1
- [ ] 5/19(火) 12:00: @jirosan 長文B #3（DP 毎日触る話）投稿 @impact:9 @urgency:10 @effort:1
- [ ] 5/20(水) 19:00: @ss_unei_chan 長文B #5（家具失敗談）投稿 @impact:8 @urgency:9 @effort:1
- [ ] 5/21(木) 08:00: @tenichiliu 長文B #2（受賞振り返り）投稿 @impact:9 @urgency:9 @effort:1
- [ ] 5/21(木) 20:00: @tenichiliu / @jirosan からローンチ予告通常ツイート @impact:8 @urgency:9 @effort:1
- [ ] 既存 X Ads 9 パターン投稿の棚卸し @impact:6 @urgency:7 @effort:2

### 🚀 5/22(金) — プロダクトローンチ + PR TIMES 配信日

- [ ] (人間) PR TIMES 配信実行 @impact:10 @urgency:10 @effort:2
- [ ] 5/22 ローンチ長文B 作成（@tenichiliu 経営者視点版・@jirosan 現場実証版）→ long-form-content-bank.md に追記 @impact:10 @urgency:10 @effort:3
- [ ] 5/22 10:00: @tenichiliu + @jirosan で同時砲火（人間最終チェック後） @impact:10 @urgency:10 @effort:1
- [ ] 5/22 11:00: @ss_unei_chan 通常ツイート（中の人歓喜・短文） @impact:7 @urgency:10 @effort:1
- [ ] 全アカウントで PR TIMES 記事リンクの引用 RT + リプ強化 @impact:8 @urgency:10 @effort:1

### 🟡 W2: 5/23-24 — 余韻投下

- [ ] 5/23(土) 12:00: @jirosan 長文B #4（民泊新法 2026）投稿 @impact:8 @urgency:9 @effort:1
- [ ] 5/24(日) 19:00: @ss_unei_chan 長文B #6（オーナーダッシュボード）投稿 @impact:8 @urgency:9 @effort:1
- [ ] PR TIMES 反響モニタリング（impressions / engagement 集計）→ Discord 報告 @impact:7 @urgency:8 @effort:2
- [ ] W3 分の長文B 6 本ドラフトを Claude 生成 → long-form-content-bank.md 追記 @impact:7 @urgency:7 @effort:3

### 🟢 W3: 5/25-31 — Boost the Winners 開始

- [ ] (人間) 5/25 から Boost the Winners 運用開始（W1-W2 オーガニック上位 20% を Promoted 化） @impact:9 @urgency:9 @effort:2
- [ ] utm_content による Supabase 集計クエリ整備（オーガニック vs Promoted 内訳） @impact:7 @urgency:8 @effort:2
- [ ] 日次 X 配信レポート Discord 投稿（Inbox `general`・3 アカウント別 impressions / engage / link click 集計） @impact:7 @urgency:8 @effort:3

### 🟣 W4: 6/1-7 — 学習・最適化

- [ ] Boost the Winners 1 週分データ分析 → 勝ちパターン特定（CPL ≤ ¥15K のクリエイティブを抽出） @impact:8 @urgency:7 @effort:2
- [ ] 長文 B コピー A/B 仮説抽出 → W5 以降のドラフト方針に反映 @impact:7 @urgency:6 @effort:2
- [ ] (人間) 義人さん週次レビュー受けて戦略修正 @impact:8 @urgency:7 @effort:1

### W5 以降（継続運用）

- [ ] 長文 B コンテンツバンクを M3 末で 50 本まで蓄積 @impact:7 @urgency:5 @effort:8
- [ ] 月次 X チャネル KGI レビュー（M1: 3-5 lead / M2: 8-12 lead / M3: 15-20 lead） @impact:7 @urgency:5 @effort:1

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
