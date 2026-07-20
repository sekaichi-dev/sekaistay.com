# 05. 移行プラン・Webhook仕様

## 移行ステップ

### Phase 0: パッケージ受領（このドキュメント）
- テンイチ側で内容確認
- 不明点・追加要件があれば吉田へ連絡

### Phase 1: テンイチ側でフォーム新設
- sekaistay.com 上でフォーム実装（このパッケージの仕様を参考に）
- デザインは sekaistay.com の世界観に合わせて自由に作り直しOK
- 必要項目（`03-data-schema.md` の必須フィールド）を満たすこと
- バリデーション・CSRF・レート制限はテンイチ側で実装

### Phase 2: 顧客データ保管場所の決定（テンイチ側）
**選択肢**:
- **HubSpot**: 既に sekai stay で導入済み・CRM一元化に良い
- **Notion DB**: 編集楽・チーム共有楽
- **Google Spreadsheet**: 一番シンプル・誰でも触れる
- **Supabase / Firebase**: 本格的なDB管理

吉蔵的な推奨: **HubSpot** を一次保管にし、吉蔵側にはWebhookで転送。HubSpot ↔ 吉蔵側ポータル の連携は既に実装済みなので接続が早い。

### Phase 3: Webhook 接続（テンイチ → 吉蔵）
詳細は下記「Webhook 仕様」参照。

### Phase 4: 既存フォームの停止・移行
- sekaistay.com 側のLP iframe を新フォームに差し替え
- 旧フォーム (`japanvillas.kss-cloud.com/report-request`) はテンイチ承認後に停止
- 移行期間中は両方稼働 OK

### Phase 5: 運用安定化
- 1ヶ月程度の並行運用で動作確認
- 問題なければ旧フォーム完全停止

---

## Webhook 仕様（テンイチ → 吉蔵）

### エンドポイント（吉蔵側で用意・準備済み次第共有）
```
POST https://japanvillas.kss-cloud.com/api/lead-intake
Headers:
  Content-Type: application/json
  X-Webhook-Secret: {共有シークレット・別途共有}
```

### Payload 形式
`03-data-schema.md` の `SubmitPayload` に準拠。最低限以下のフィールドを送ること:

```json
{
  "name": "string (必須)",
  "email": "string (必須)",
  "phone": "string (必須)",
  "airbnbUrl": "string (任意)",
  "peakRevenue": "string (任意・Range形式)",
  "offpeakRevenue": "string (任意・Range形式)",
  "commissionRate": "string (任意・15/20/25/unknown)",
  "operatingYears": "string (任意・0/1/3/5)",
  "totalProperties": "number (任意・1〜30)",
  "complaints": "string (任意・最大2000文字)",
  "companyName": "string (任意)",
  "utmSource": "string (任意)",
  "utmMedium": "string (任意)",
  "utmCampaign": "string (任意)",
  "utmContent": "string (任意)",
  "utmTerm": "string (任意)",
  "gclid": "string (任意)",
  "fbclid": "string (任意)",
  "landingUrl": "string (任意)",
  "referrer": "string (任意)",
  "submittedAt": "ISO8601 (必須・テンイチ側でフォーム送信した時刻)",
  "tenichiLeadId": "string (任意・テンイチ側のID・トレース用)"
}
```

### レスポンス
```json
// 成功時 (200)
{ "id": "req_xxxxxxxxxxxx", "status": "received" }

// バリデーションエラー (400)
{ "error": "メールアドレスの形式が正しくありません" }

// レート制限超過 (429)
{ "error": "申請の上限に達しました" }
```

### エラーハンドリング
- テンイチ側で 5xx エラー受信時は **指数バックオフでリトライ**（推奨: 1分→5分→30分→2時間）
- 最終的に失敗した場合はテンイチ側 DB に「未送信」フラグを残す
- 吉蔵側で受信できたかは ID で照合可能

### セキュリティ
- `X-Webhook-Secret` は Bearer Token 形式で吉蔵側で検証
- HTTPS 必須
- IPホワイトリスト化も可能（テンイチ側のサーバーIPが固定なら）

---

## 確認したいこと（テンイチ側に聞きたいこと）

1. **顧客データの保管場所** をどこにするか（HubSpot / Notion / Sheets / 自前DB / 等）
2. **HubSpot連携・Sheets連携** をテンイチ側でやるか、吉蔵側に任せるか
3. **Webhook シークレット** の発行・共有方法（1Password 共有 / Discord DM / 等）
4. **移行スケジュール** の希望（いつまでに切替えたいか）
5. **既存の HubSpot Pipeline / Stage 構成** に変更必要か

---

## 質問・連絡

- 吉田 ヒカル: hikaru@sekaichi.org
- Discord: #japan-villas

