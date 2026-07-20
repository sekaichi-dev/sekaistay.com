# 吉田ヒカル宛 返信ドラフト

**宛先**: hikaru@sekaichi.org
**件名**: Re: sekai stay LP フォーム引き継ぎパッケージ — 受領確認と回答

---

ヒカルさん

引き継ぎパッケージ受領しました。9ファイル全て確認済みです。
5問への回答と、こちら側で確認したい10項目を下記にまとめます。

## 5問への回答

### 1. 顧客データの保管場所
**Supabase 一次保管** で進めます。理由:
- テンイチ側で完結する単一データソース（CRMロックインなし）
- 吉蔵側にはRead-onlyアクセス（DB user / 専用ビュー or 参照API）を共有 — 共有方式は別途相談
- HubSpot / Sheets / Notion との二重連携はしない（整合性管理コスト回避）

### 2. HubSpot連携・Sheets連携の担当
**どちらも連携しません**。
- データは Supabase のみに保管。必要時は吉蔵側からRead-onlyで参照
- HubSpot Contact/Deal/Note 作成は今回新フォームでは行わない（既存運用と分離）
- Sheets 集計が必要になったら、Supabase → Sheets を別途吉蔵側で構築可能

### 3. Webhook 転送のスペック
共有いただいた実装スペックそのまま採用します:
- POST `https://japanvillas.kss-cloud.com/api/lead-intake`
- ヘッダー: `Content-Type: application/json` + `X-Webhook-Secret: <SEKAI_LEAD_INTAKE_SECRET>`
- ペイロード: `03-data-schema.md` 準拠 + `tenichiLeadId`, `submittedAt` 追加
- タイムアウト 10秒、最大4回リトライ（1分 → 5分 → 30分 → 2時間の指数バックオフ）
- 4回失敗で `markForwardFailed(id, "max retries exceeded")` → Supabase に失敗ログ残す

### 4. 移行スケジュール
- **5/8〜5/14**: 新フォーム実装 + 6分岐 A/B テスト LP に組込み（広告配信スケジュールに合わせる）
- **5/14**: 新フォーム稼働開始・Webhook 接続テスト
- **5/14〜6/14**: 新旧並行運用 1ヶ月（旧フォームも維持）
- **6/14**: 旧フォーム停止判断

### 5. HubSpot Pipeline / Stage の変更
今回テンイチ側で HubSpot を触らないため、**吉蔵側の既存 Pipeline / Stage 運用に影響なし**。
- 吉蔵側でこれまで通り `dealstage: 3511869161` (01 入力済み) → `HUBSPOT_STAGE_SENT` の遷移を継続
- テンイチ → 吉蔵の Webhook 受信時に既存ロジックで HubSpot 起票してもらう形を想定

---

## こちら側で実装する範囲

1. sekaistay.com に4ステップフォーム新設（`/lp/[variant]` 配下にも組込み）
2. POST `/api/report-requests/submit` 相当の受信API（CSRF + Rate Limit + テスト判定）
3. Supabase に submission レコード保存（吉蔵側にRead-onlyアクセス共有）
4. Webhook で `https://japanvillas.kss-cloud.com/api/lead-intake` へ転送（指数バックオフ 1分→5分→30分→2時間、最大4回）
5. テスト判定ロジック（INTERNAL_TEST_EMAILS / TEST_NAME_PATTERNS）も同じセットを使用

---

## こちらから確認したいこと

### 接続関連
1. `/api/lead-intake` エンドポイントの**稼働開始予定日** + **staging 環境の有無**（接続テスト時に本番に打つ運用でよいか）
2. **`SEKAI_LEAD_INTAKE_SECRET` の実値**（Discord DM 希望）
3. **CSRF / Origin チェック**: 吉蔵側 `/api/lead-intake` は Origin/Referer チェックしてるか（Webhook なので不要の想定、念のため確認）

### データフロー方針
4. **テスト判定 (`kind: "test"`) レコードの Webhook 送信ポリシー** — テンイチ側でスキップ / 送って吉蔵側で弾く、どちらが正
5. **並行運用中（5/14〜6/14）の重複防止キー** — 同一ユーザーが新旧両方から送信した場合、メアド一致でマージするか別レコードにするか
6. **Webhook 4回リトライ失敗時のアラート要否** — テンイチ側だけで気づけばOKか、吉蔵側にも通知すべきか
7. **レポート生成・送信の責任分界点** — Webhook 受信後、レポート生成 → メール送信 → `HUBSPOT_STAGE_SENT` 遷移は引き続き全て吉蔵側で実施、で合っているか

### 移行運用
8. **旧フォーム iframe 設置 LP URL 一覧** — `/lp/[variant]` の6分岐どこに `?embed=1` で貼ってあるか（差し替え漏れ防止）
9. **5/14 切替の希望** — 一斉 / 段階的どちらの方針か（広告配信中の影響回避）

### こちらから提案
10. **Supabase Read-only アクセスの希望形式** — (a) DB credentials 直接 / (b) 専用ビュー + RLS user / (c) 参照API のどれが望ましいか

---

質問・実装相談は Discord #japan-villas で続けさせてください。

劉
