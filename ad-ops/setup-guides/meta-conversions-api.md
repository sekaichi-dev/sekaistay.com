# Meta Conversions API（CAPI）セットアップ手順

> **目的**: iOS 14+ の追跡制限・広告ブロッカー・Cookie 制限による CV ロスト（30-40%）をサーバーサイド計測で補う。
>
> **方式**: クライアント（Pixel）+ サーバー（CAPI）の二重送信（Meta 推奨）。重複は Meta が `event_id` で自動除去。
>
> **所要時間**: 25-35分（テンイチが Meta Business Manager で実行）

---

## 全体像

```
Step 1: Meta Business Manager の Conversions API トークン取得
Step 2: コンバージョン イベントの定義（Lead = フォーム送信）
Step 3: テストイベント設定（実装前検証用コード取得）
Step 4: Vercel 環境変数の設定
Step 5: Vercel Function 実装（AI が PR4 で実装）
Step 6: Test Events で動作確認
Step 7: 本番 Live・Event Match Quality 確認
```

---

## 前提条件

- [ ] Meta Business Manager アカウント開設済み・課金方法紐付け済み（テンイチ確認済み）
- [ ] Meta Pixel が sekaistay.com に実装済み（既に layout.tsx に実装: `1658477098524563`）
- [ ] Pixel ID にアクセス権限のある管理者権限保持（テンイチ）
- [ ] Privacy Policy に CAPI 言及済み（既に `app/privacy/page.tsx` に記載済み確認）

---

## Step 1: Conversions API トークン取得 ✅ 完了 (2026-05-09)

> このトークンが**最重要・厳秘扱い**。GitHub 公開コミットには絶対入れない。Vercel 環境変数で管理。
>
> **2026-05-09 確認**: テンイチが Meta Events Manager で取得 → 私に共有 → 私が `vercel env add META_CAPI_ACCESS_TOKEN production` で Vercel 本番環境変数に登録済み（Encrypted）。Pixel ID（`META_PIXEL_ID = 1658477098524563`）も同時に env 登録済み。以下の手順は将来的にトークンを再発行する場合の参照用。

### 操作手順

1. **Meta Events Manager** にログイン: https://business.facebook.com/events_manager
2. 左サイドバーから **対象の Pixel**（Pixel ID: `1658477098524563`）を選択
3. 上部タブ **「設定」** をクリック
4. **「コンバージョン API」** セクションまでスクロール
5. **「手動でアクセストークンを生成」** をクリック
6. 「アクセストークンを生成」 → ポップアップで長い文字列が表示される
7. **「コピー」** → 安全な場所に一時保存（次の Step で Vercel に登録）

### 重要な注意

- このトークンは Pixel と紐づいた認証情報。漏えいすると他人が偽の CV データを送信できる
- **GitHub にコミットしない**。**Discord 公開チャンネルに貼らない**。**Slack でも DM で送る**
- テンイチから私への共有は Discord DM 推奨。私は受け取って Vercel 環境変数として登録 → 即破棄

---

## Step 2: コンバージョン イベントの定義

> 「Lead = フォーム送信」を Meta 側でも明示的に定義。Meta Pixel と CAPI で同じイベント名を使うことで重複除去が効く。

### 操作手順

1. **Events Manager → 対象 Pixel → 「概要」タブ**
2. **「カスタム コンバージョン」** または **「標準イベント」** を確認
3. 既に **`Lead`** 標準イベントが受信されている場合: 何もしない（layout.tsx の `generate_lead` が Pixel 経由で `Lead` イベントとして送信されている可能性）
4. 受信されていない場合: **新規作成不要**（Pixel コードを後ほど私が確認・修正します）

> **初心者ポイント**: Meta Pixel の標準イベント `Lead` は予約語。これを使えば Meta 広告のキャンペーン目的「Lead」と自動連携する。カスタムイベント名（`generate_lead`）だと毎回手動マッピングが必要。

---

## Step 3: テストイベント コード取得

### 操作手順

1. **Events Manager → 「テストイベント」タブ**
2. 上部の **「Test Browser Events」** セクション
3. **「URL でテスト」** に `https://sekaistay.com/switch` を入力
4. **「ウェブサイトを開く」** で別タブが開く（テストモード）
5. 上部に **「テストイベント コード（例: `TEST12345`）」** が表示されるのでコピー
6. このコードを Discord で私に共有 → Vercel 環境変数（`META_CAPI_TEST_EVENT_CODE`）に登録

> **初心者ポイント**: テストコードを使って送信すると本番ピクセルデータには混ざらず、テストイベント画面でリアルタイム確認できる。本番 Live 時はこのコードを外す（=空にする）。

---

## Step 4: Vercel 環境変数の設定

### 必要な環境変数

| 変数名 | 値 | 用途 |
|---|---|---|
| `META_PIXEL_ID` | `1658477098524563` | Pixel 識別子（layout.tsx でも参照） |
| `META_CAPI_ACCESS_TOKEN` | Step 1 で取得したトークン | サーバーから Meta API 呼び出し |
| `META_CAPI_TEST_EVENT_CODE` | Step 3 で取得したコード（テスト中のみ） | 本番 Live 時は空 |

### 操作手順

> Vercel Dashboard でテンイチが直接設定する選択肢と、私が CLI で登録する選択肢の2つ。どちらかを選んでください。

#### 方式 A: Vercel Dashboard（テンイチが画面操作）

1. https://vercel.com/sekaichi → `sekaistay-com` プロジェクト
2. **Settings → Environment Variables**
3. 各変数を追加:
   - Name: `META_CAPI_ACCESS_TOKEN`
   - Value: トークン文字列
   - Environment: **Production / Preview / Development** すべてチェック
   - Save
4. 同様に `META_CAPI_TEST_EVENT_CODE` も追加（テスト中のみ）

#### 方式 B: CLI（私が実行・推奨）

1. テンイチが Discord DM でトークンとテストコードを共有
2. 私が CLI で登録:
   ```bash
   echo "$TOKEN" | vercel env add META_CAPI_ACCESS_TOKEN production
   echo "$TEST_CODE" | vercel env add META_CAPI_TEST_EVENT_CODE production
   ```
3. 私が登録結果を確認・トークンの記録は即破棄

### 反映には再デプロイが必要

環境変数追加後、**Vercel Dashboard → Deployments → 最新デプロイ → "Redeploy"** で反映。または PR4 マージ時に自動デプロイされる。

---

## Step 5: Vercel Function 実装（AI が PR4 で実装）

> **2026-05-09 更新**: `/switch` ファミリのフォームは **native（iframe ではない）** で `/api/report-requests/submit` 経由で送信されているため、CAPI を別ルートに分けず **既存 `/api/report-requests/submit` 内に統合実装する**。これにより:
> - 余分な HTTP ラウンドトリップなし
> - PII（name / email / phone）が同じスコープで使える → SHA-256 ハッシュ化が即できる
> - IP / UA / fbc / fbp / landingUrl は HTTP ヘッダー + cookie + 既存ペイロードから取得可
> - **EMQ 8+ 狙える**

### 実装方針（PR4 で実装）

```
ReportRequestForm (client)
  ↓ POST /api/report-requests/submit
[server-side, app/api/report-requests/submit/route.ts]:
  1. 既存処理: Supabase insert + forwardLead
  2. 追加: crypto.randomUUID() で event_id 生成
  3. 追加: lib/meta-capi.ts の sendMetaCapiLead({ eventId, hashedPII, ip, ua, fbp, fbc, eventSourceUrl, customData }) を fire-and-forget 呼び出し
  4. レスポンスに event_id を含める
  ↓ res.json({ id, status, eventId })
[client]:
  5. 既存 fbq('track', 'Lead', {...}) に { eventID: data.eventId } を追加 → 重複除去のキーになる
```

### 新規ファイル

- `lib/meta-capi.ts` — SHA-256 ハッシュ化 + Meta Graph API 呼び出し helper
- `app/api/report-requests/submit/route.ts` — **既存ファイルに追加実装**（新規ファイル不要）
- `components/report-request/ReportRequestForm.tsx` — `fbq` 呼び出しに `eventID` を渡す

### 重複除去の仕組み

- Pixel: `fbq('track', 'Lead', {...}, { eventID: 'abc-123' })`
- CAPI: `POST /events?event_id=abc-123, event_name=Lead`
- Meta が同じ `event_id` を見たら**ブラウザ + サーバー両方を受信**として扱う（理想形）

> **重複除去のために**、Pixel と CAPI で **同じ event_id** を送ることが必須。私が実装する `crypto.randomUUID()` ベースで生成。

---

## Step 6: Test Events で動作確認

### PR4 マージ後の確認

1. **Events Manager → テストイベント** を開いておく
2. ブラウザで `https://sekaistay.com/switch` に Step 3 と同じテストモードでアクセス（テストコードが URL に付いている状態）
3. フォームを送信
4. テストイベント画面に **2件の `Lead` イベント**が表示される（Pixel 1件 + CAPI 1件）
5. Meta が自動重複除去すると **「Browser」+「Server」両方を受信** と表示される（理想）

### Event Match Quality（EMQ）スコア

- Meta が **「Event Match Quality」** スコア（0-10点）を表示
- **8点以上** が目標（メール・電話・名前・IP・User Agent などの一致情報が多いほど高スコア）
- スコアが低い → 私が CAPI Function で追加情報を送る実装を強化

---

## Step 7: 本番 Live

### 切り替え手順

1. Test Events で2-3日間動作確認
2. Vercel 環境変数 `META_CAPI_TEST_EVENT_CODE` を **空文字または削除**
3. Redeploy
4. **Events Manager → 概要** で本番イベント受信を確認

---

## トラブルシュート

| 症状 | 原因候補 | 対処 |
|---|---|---|
| テストイベントに何も表示されない | テストコードが Function に渡っていない | Vercel 環境変数を再確認・Redeploy |
| 「Browser」のみ表示・「Server」が来ない | CAPI トークンが間違い or Function エラー | Vercel Function ログを確認 |
| 重複除去が効かず2倍カウントされる | event_id が Pixel と CAPI で違う | PR4 実装を確認・私に通知 |
| EMQ スコアが低い（5点未満）| Hash 化前の生 PII 不足 | フォーム送信時のメール/電話/姓名の取得漏れがないか確認 |
| 「無効なアクセストークン」エラー | トークンの有効期限切れ or 権限不足 | Step 1 から再取得 |

---

## セキュリティチェックリスト

- [ ] CAPI トークンは Vercel 環境変数のみに保存（コード・GitHub・Discord 公開チャネル禁止）
- [ ] Function 内でトークンを `console.log` しない
- [ ] Function のレスポンスに PII を含めない
- [ ] CORS 設定: `/api/meta-capi/*` は同一オリジンからのみ受け付け（PR4 実装時に設定）

---

## 完了後にすること

- [ ] Step 7 完了を Discord `#sekai-stay` に投稿
- [ ] EMQ スコアを Discord に共有（私が学習ログに記録）

---

## 関連

- Pixel 実装: `app/layout.tsx` 既設置
- Privacy Policy: `app/privacy/page.tsx` に CAPI 言及済み
- 後続 PR: PR4（CAPI Vercel Function 実装）
