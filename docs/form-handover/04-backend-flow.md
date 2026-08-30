# 04. フォーム送信後の処理フロー

> 出典: `src/app/api/report-requests/submit/route.ts`, `src/lib/report-generator.ts`, `scripts/report/scheduled-sender.ts`

## 全体フロー

```
[フォーム送信]
   ↓
POST /api/report-requests/submit
   ↓
バリデーション（CSRF / Rate Limit / Email形式 / Airbnb URL形式）
   ↓
data/report-requests.json に永続化（ID = req_xxx）
   ↓
fire-and-forget で並列実行:
  ├─ HubSpot Contact + Deal + Note 作成
  ├─ Google Sheets (leads-sheet) に1行追記
  └─ レポート生成バックグラウンド開始（Airbnb URL がある場合のみ）
   ↓
クライアントに { id, status: "received" } 即返却（HubSpot等の失敗で全体止めない）
```

## 1. 受信API（submit/route.ts）

### バリデーション
- **CSRF保護**: `Origin` または `Referer` ヘッダで `localhost:3200` / `japanvillas.kss-cloud.com` 以外を拒否
- **レート制限**: IPベース 10件/時（429 を返す）
- **必須チェック**: name / email / phone / airbnbUrl（default form）
- **メール形式**: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`、`<`/`>` 含む場合拒否
- **Airbnb URL ホスト**: `airbnb.com` / `.jp` / `.co.jp` / `m.airbnb.*` / `abnb.me` のいずれか

### 入力サニタイズ
全文字列フィールドは `trim() + slice(maxLength)` で長さ制限。

## 2. HubSpot 同期（非同期・失敗許容）

```
upsertContactByEmail(email, { firstname, phone, lifecyclestage:"lead", hs_lead_status:"NEW", ... })
  ↓
createDeal({ dealname:"[診断レポート] {name}", pipeline:"default", dealstage:"3511869161"(=01入力済み), description:formSummary })
  ↓
associateContactToDeal(contactId, dealId)
  ↓
createNote(htmlBody) → associate to Contact + Deal
  ↓
report-request レコードに hubspotContactId / hubspotDealId / hubspotNoteId を書き戻し
```

レポート送信完了時に Deal Stage を `02 レポート送信済み` (HUBSPOT_STAGE_SENT) へ移動する処理が `scheduled-sender.ts` 側にある。

## 3. Google Sheets 連携（非同期・失敗許容）

`appendLead(created)` で `lib/leads-sheet.ts` 経由でチームメイトの管理スプレッドシートへ1行追記。フィールドは ReportRequest の主要項目をフラットに展開。

## 4. レポート自動生成（バックグラウンド）

`generateReportInBackground(id)` で以下が走る:

1. Airbnb URL から物件データをスクレイピング（Playwright）
   - 写真ギャラリー
   - 物件名・説明
   - レビュー数・評価点
   - ホスト情報
   - 価格情報
2. AI による分析・コピー生成（Claude）
   - 強み2点・改善ロードマップ・収益シミュレーション
   - LLM-as-judge でコピー品質チェック
3. レポート HTML を生成（写真は base64 埋込）
4. 公開URL (`/r/{slug}`) でアクセス可能に
5. `requiresApproval = true` で人間レビュー待ち（INC-027 対応）

## 5. 人間レビュー → 承認

吉蔵が `/mgmt/reports` でレポート内容を目視確認し、`POST /api/report-requests/[id]/approve` で承認:
- 即送信 or +24h 後送信 を選択可能
- 承認時に `scheduledSendAt` がセットされる

## 6. メール送信（cron）

`scripts/report/scheduled-sender.ts` が **5分ごとに** `scheduledSendAt < now` のレコードを拾って送信:
- Gmail API 経由
- 件名: `【sekai stay】{物件名} の物件診断レポート`
- 本文 HTML テンプレート（コピールール準拠 = `data/copy-rules.md`）
- 送信完了後 `status: "sent"` + HubSpot Deal Stage を「送信済み」へ移動

## 移管後の責任分担

| 処理 | 担当 |
|---|---|
| フォーム表示 | テンイチ |
| バリデーション | テンイチ（重複OK：吉蔵側でも再チェック） |
| 顧客データ保管（生データ） | テンイチ |
| Webhook で吉蔵へ転送 | テンイチ |
| HubSpot 連携 | **要相談**（テンイチ側 or 吉蔵側どちらでも可） |
| Google Sheets 連携 | **要相談**（同上） |
| レポート生成 | 吉蔵（当面継続） |
| 人間レビュー・承認 | 吉蔵（当面継続） |
| メール送信 | 吉蔵（当面継続） |

→ **HubSpot / Sheets 連携をテンイチ側でやるか吉蔵側でやるか** は次回打ち合わせで決定。

