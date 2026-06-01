# リード獲得パイプライン 引き継ぎ — 本間ヨシト様

> **作成日**: 2026-05-31 / **作成者**: テンイチ
> **対象**: フォーム送信 → 6系統転送 → TimeRex照合 → Discord/Slack通知 → CRM
> **戻る**: [HANDOVER_YOSHITO.md](../HANDOVER_YOSHITO.md)

---

## ⚡ サマリー

### パイプライン全体像

```
LP/HP フォーム
  ↓
POST /api/report-requests/submit
  ↓ 6系統並列転送（fire-and-forget）
  ├─ Supabase lead_submissions（raw 一次保管）
  ├─ 吉蔵 CRM（forwardLead・テスト振分けスキップ）
  ├─ sekaistay-sales-portal webhook
  ├─ Discord #sekai-stay（即時通知）
  ├─ Slack lead webhook（即時送信）
  └─ Meta CAPI（hashed PII で Lead event 送信）
  ↓ さらに Google Sheets backup（同期スクリプト）

[並行] Slack #402-sekaistay面談申込
  ├─ TimeRex ネイティブアプリ: 予約完了をメイン投稿
  └─ Jennie (cron `/api/lead-slack-delayed` 毎分): 該当フォーム内容をスレッドに補完
```

### 即知っておいてほしい3点

1. 🔴 **6系統並列転送** — 1つ落ちても他は転送される（fire-and-forget 設計）
2. 🟡 **吉蔵 CRM がメイン**・HubSpot 移行検討中
3. 🟡 **Slack `#402` 通知の主役は TimeRex のネイティブアプリ**、Jennie がフォーム内容をスレッドで補完する役割

---

## 1. フォーム送信エントリ

### 1-1. エンドポイント

**`POST /api/report-requests/submit`**

ファイル: `app/api/report-requests/submit/route.ts`

### 1-2. リクエストペイロード

```json
{
  "name": "...",
  "email": "...",
  "phone": "...",
  "lp_variant": "switch | switch-founder | switch-portal",
  "form_variant": "...",
  "kind": "report | contact | ...",
  "...": "..."
}
```

`lp_variant` は LP A/B テストの全レイヤー伝播のキー（ad_test_approach 設計）。

### 1-3. フォームコンポーネント

| ファイル | 用途 |
|---|---|
| `components/report-request/ReportRequestForm.tsx` | フォーム本体（全フォームの最下層） |
| `components/switch/LpVariantForm.tsx` | LP variant ラッパー（lp_variant 埋め込み） |
| `components/audit/AuditReportRequestForm.tsx` | /audit 専用フォーム |
| `components/switch/SimpleContactForm.tsx` | シンプル問い合わせフォーム |

---

## 2. 6系統転送詳細

### 2-1. Supabase（一次保管）

| 項目 | 値 |
|---|---|
| ファイル | `lib/lead-submissions.ts` |
| テーブル | `lead_submissions` |
| 役割 | raw 一次保管・lp_variant カラム保存・障害時のリプレイ起点 |
| 環境変数 | `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` |

> data_persistence_strategy: Supabase = raw 一次保管 / HubSpot = 同期先（CRMマスター）

### 2-2. 吉蔵 CRM（kss-cloud.com）

| 項目 | 値 |
|---|---|
| ファイル | `lib/lead-forward.ts` の `forwardLead()` |
| 役割 | メイン CRM への転送 |
| テスト振分け | テストリードは skip（lib/test-classifier.ts） |
| HubSpot 移行 | 検討中（crm_preference: HubSpot 一次保管推奨） |

### 2-3. sekaistay-sales-portal webhook

| 項目 | 値 |
|---|---|
| ファイル | `lib/lead-forward.ts` の `forwardLeadToSalesPortal()` |
| 役割 | 自社営業ポータルへの通知 |

### 2-4. Discord 通知（#sekai-stay）

| 項目 | 値 |
|---|---|
| ファイル | `lib/lead-forward.ts` の `forwardLeadToDiscord()` |
| 役割 | 営業チームへの即時通知 |
| テスト振分け | テストリードは skip |
| 環境変数 | `DISCORD_LEAD_WEBHOOK_URL` / `DISCORD_LEAD_MENTIONS` |
| 通知文 | 「新規リード: 名前 — sekaistay.com フォームから受信しました。担当営業はダッシュボードからアサインしてください」 |

### 2-5. Slack lead webhook

| 項目 | 値 |
|---|---|
| 環境変数 | `SLACK_LEAD_WEBHOOK` |
| チャネル | `#402-sekaistay面談申込` 関連 |
| 役割 | フォーム送信即時転送（Jennie が後段で TimeRex 予約スレッドに補完投稿） |

### 2-6. Meta CAPI

| 項目 | 値 |
|---|---|
| ファイル | `lib/meta-capi.ts` |
| 役割 | サーバーサイド Lead event 送信（hashed PII で EMQ 8+） |
| 環境変数 | `META_CAPI_TOKEN` / `META_CAPI_TEST_EVENT_CODE` / `META_PIXEL_ID` |
| dedup キー | eventID（client `fbq('Lead', {eventID})` と統一） |

### 2-7. Google Sheets backup

| 項目 | 値 |
|---|---|
| ファイル | `scripts/sync-leads-to-sheet.mjs`（5分毎 cron 推奨） |
| シート | 「SEKAI STAY Lead Submissions Log」 |
| 環境変数 | `LEAD_BACKUP_SHEET_ID` |
| ヘッダー | `lead_id / created_at / kind / name / email` + 他24列 |
| 視聴権 | `hikaru@sekaichi.org` |

---

## 3. Slack `#402-sekaistay面談申込` — TimeRex + Jennie 補完

### 3-1. 通知の主役: TimeRex ネイティブアプリ

`#402-sekaistay面談申込` には **TimeRex のネイティブアプリが予約完了を直接投稿** する。これが営業が見るメイン通知。

### 3-2. 補完: Jennie がフォーム内容をスレッドに付ける

`/api/lead-slack-delayed`（cron 毎分・`app/api/lead-slack-delayed/route.ts`） が TimeRex 投稿と対応する Supabase リードを照合し、**TimeRex 投稿のスレッドにフォーム内容を補完投稿** する。

cron 設定（`vercel.json`）:
```json
{ "crons": [{ "path": "/api/lead-slack-delayed", "schedule": "* * * * *" }] }
```

### 3-3. マッチング設計

TimeRex の予約氏名と Supabase フォーム送信氏名を照合:
- 漢字↔かなフォールバック
- 姓2文字フォールバック（2026-05-27 実装）
- 時間窓フォールバック

---

## 4. リードログ・分析

### 4-1. Google Sheets 「SEKAI STAY Lead Submissions Log」

- 最終更新: 2026-05-31
- 視聴権: `hikaru@sekaichi.org`
- 用途: 全リードの履歴管理・営業フィードバックの起点

### 4-2. Supabase ダッシュボード

- `lead_submissions` テーブル
- `lp_variant` 別の CVR 集計 → LP A/B テスト勝者判定に使用
- 媒体別 (utm_source) の流入分析

---

## 5. CRM（吉蔵 vs HubSpot）

### 5-1. 現状

- **吉蔵 CRM**（kss-cloud.com）がメイン
- **HubSpot 移行検討中**（crm_preference: sekai stay 既導入・CRM一元化）

### 5-2. リード品質フィードバック

- 担当: 小川（営業・`contact@sekaichi.org`）
- フロー: リード成約率・商談化率を Supabase / Sheets で追跡 → 月次振り返り

### 5-3. テスト振分け

| ファイル | 役割 |
|---|---|
| `lib/test-classifier.ts` | テスト/本番リード判別 |

→ テストリードは吉蔵 CRM・Discord 通知を skip（ノイズ軽減）・sales-portal / Meta CAPI は送信（検証用）

---

## 6. Outbound DM・アフィリエイト

### 6-1. Outbound DM

- 戦略: Fellow 2026-05-10 議事録「block_marketing」で言及
- 実装状況: 🟡 未確定 — 要本人確認

### 6-2. アフィリエイト

- 開始時期: **6月から**
- 設計: 🟡 未確定 — パートナー候補・条件・トラッキング未策定
- 詳細は [PR_MEDIA §5](PR_MEDIA_2026-05-31.md) 参照

---

## 7. 環境変数（リード関連抜粋）

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# Slack / Discord 通知
SLACK_LEAD_WEBHOOK
DISCORD_LEAD_WEBHOOK_URL
DISCORD_LEAD_MENTIONS

# Meta CAPI
META_CAPI_TOKEN
META_CAPI_TEST_EVENT_CODE
META_PIXEL_ID

# Google Sheets backup
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN_SEKAICHI
LEAD_BACKUP_SHEET_ID
```

---

## 8. 役割分担

| 領域 | ヨシト | テンイチ | 小川 |
|---|---|---|---|
| フォーム送信フロー監視 | ✅ 日常 | — | — |
| Discord 通知の確認 | ✅ | — | ✅ 担当アサイン |
| TimeRex 連携の調整 | ✅ | コード変更 | — |
| 6系統転送の障害対応 | 初期切り分け | コード修正 | — |
| Supabase スキーマ変更 | — | ✅ | — |
| CRM 移行判断 | 提案 | 実装 | フィードバック |
| リード品質改善 | ✅ 提案・実行 | — | フィードバック |

---

## 9. 既知の課題

| # | 課題 | 緊急度 |
|---|---|---|
| 1 | 競合社名負KW（5/28削除・未復元）→ Google Ads で再構築要 | 🔴 高 |
| 2 | Meta Ads 停止中 → 再開判断要 | 🔴 高 |
| 3 | SS-Brand CV ゼロ問題（指名検索 27 click / 0 CV） | 🟠 中 |
| 4 | HubSpot 移行判断 | 🟡 中 |
| 5 | Outbound DM / アフィリエイト（6月開始予定）の実装未確定 | 🟡 中 |
| 6 | Slack 通知の TimeRex 名前マッチ失敗事例の継続観測 | 🟢 低 |

---

## 10. すぐにやってほしいこと

### 🔴 Day 1

- [ ] `lib/lead-submissions.ts` / `lib/lead-forward.ts` / `lib/meta-capi.ts` 通読
- [ ] `app/api/report-requests/submit/route.ts` 通読
- [ ] `app/api/lead-slack-delayed/route.ts` 通読
- [ ] Discord `#sekai-stay` チャネル参加・通知文確認
- [ ] Slack `#402-sekaistay面談申込` チャネル参加

### 🟡 Week 1

- [ ] テストリードを 1件流して 6系統転送が動作することを確認
- [ ] Google Sheets「SEKAI STAY Lead Submissions Log」を週次レビュー
- [ ] 小川との週次振り返り（リード品質）

### 🟢 Week 2-4

- [ ] HubSpot 移行検討の前提整理
- [ ] Outbound DM 戦略の設計
- [ ] アフィリエイト 6月開始の設計着手

---

## 11. 主要ファイル

| ファイル | 内容 |
|---|---|
| `app/api/report-requests/submit/route.ts` | フォーム送信本体 |
| `app/api/lead-slack-delayed/route.ts` | Jennie 補完投稿（TimeRex 予約スレッドにフォーム内容を付加・cron 毎分） |
| `app/api/lead-forward-retry/route.ts` | 吉蔵 CRM 転送失敗時のリトライ |
| `app/api/contact/route.ts` | /contact お問い合わせ送信 |
| `lib/lead-submissions.ts` | Supabase 書き込み |
| `lib/lead-forward.ts` | 吉蔵 CRM + sales-portal + Discord 転送 |
| `lib/meta-capi.ts` | Meta CAPI 送信 |
| `lib/sheets-backup.ts` | Google Sheets バックアップ |
| `lib/test-classifier.ts` | テスト/本番リード判別 |
| `scripts/sync-leads-to-sheet.mjs` | Google Sheets 同期 cron |

---

## 12. 関連ドキュメント

- [広告引き継ぎ §6 共通基盤](../ad-ops/HANDOVER_YOSHITO_2026-05-31.md) — 計測スタック・UTM規約
- [LP/HP 引き継ぎ §6 フォーム送信パイプライン](../HANDOVER_YOSHITO_LP_HP_2026-05-31.md) — フォームコンポーネント詳細

---

*このドキュメントは 2026-05-31 時点のスナップショット。*
