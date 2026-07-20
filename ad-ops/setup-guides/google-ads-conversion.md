# Google Ads コンバージョン計測セットアップ手順

> **目的**: Google Ads 配信開始前に「コンバージョン（CV）」を正しく定義・計測できる状態にする。
>
> **CV 定義**: 問い合わせフォーム送信のみ（電話発信 CV は不採用・2026-05-09 確定）
>
> **所要時間**: 15〜25分（テンイチが Google Ads 管理画面で実行）

---

## 全体像

```
Step 1: GA4 ↔ Google Ads アカウント連携
Step 2: フォーム送信 CV（GA4 イベント → Google Ads へインポート）
Step 3: コンバージョンタグの本番反映（AI が env 登録、テンイチは Tag ID をコピペで共有）
Step 4: 動作確認
```

---

## 前提条件

- [ ] Google Ads アカウント開設済み・課金方法紐付け済み（テンイチ確認済み）
- [ ] GA4 プロパティが sekaistay.com で稼働中（既に layout.tsx に実装済み: `G-B7M920RCGR`）
- [ ] テンイチが両方の Google アカウントに管理者権限を持っている

---

## Step 1: GA4 ↔ Google Ads アカウント連携

### 操作手順

1. **Google Ads 管理画面**にログイン
2. 左サイドバー → **「ツールと設定」**（🔧 アイコン）
3. **「設定」セクション → 「リンクされたアカウント」**
4. **「Google Analytics（GA4）」** のカードをクリック
5. 「**詳細とリンクを表示**」
6. sekaistay.com の GA4 プロパティ（プロパティID: `G-B7M920RCGR`）を選択
7. **「リンク」**ボタン
8. オプション: 「**自動タグ設定を有効にする**」を ON（gclid を URL に自動付与してくれる）

### なぜ必要か

GA4 に **`generate_lead`** イベント（GA4 公式の標準推奨イベント名）が実装されている（`ReportRequestForm` のフォーム送信成功時に `gtag('event', 'generate_lead', { lp_variant, ... })` で送信）。これを Google Ads 側から「コンバージョン」として参照するためにアカウント連携が前提。

> **初心者ポイント**: 連携せずに Google Ads 側で別途 CV タグを実装する方法もあるが、GA4 と Google Ads の数字がズレる原因になりやすい。連携が王道。

---

## Step 2: フォーム送信 CV（GA4 → Google Ads インポート）

### 操作手順

1. Google Ads 管理画面 → **「ツールと設定」 → 「測定」セクション → 「コンバージョン」**
2. **「+ 新しいコンバージョン アクション」**
3. アクションタイプ: **「インポート」**
4. ソース: **「Google アナリティクス 4 プロパティ」 → 「ウェブ」**
5. **「続行」**
6. 一覧から **`generate_lead`** イベントにチェック（GA4 は `ReportRequestForm` から `gtag('event', 'generate_lead', {...})` で送信。GA4 公式の標準推奨イベント名）
7. **「インポートして続行」**
8. インポート後、`generate_lead` をクリックして詳細設定:
   - **コンバージョン名**: `Lead Form Submission`（わかりやすい名前に変更・既に「SEKAI STAY (web) generate_lead」が存在する場合はそれを流用）
   - **目標とアクションの最適化**: **「お問い合わせ」** を選択
   - **値**: 「すべてのコンバージョンに同じ値を使用」 → `5000`（リード1件あたりの推定価値・あとで実態に合わせて調整）
   - **カウント**: **「1 回」**（同じユーザーが何度送信しても1日1CV扱い・推奨）
   - **クリック スルー コンバージョン計測期間**: 30日
   - **エンゲージメントビュー コンバージョン計測期間**: 1日
   - **アトリビューション モデル**: **「データドリブン」**（推奨・Google AI が貢献度を計算）
9. **「保存」**

### なぜ「値 = ¥5,000」？

リード1件 × 商談化率 × 受注率 × 平均粗利 を逆算した推定値。最初は仮置き、後で実態に合わせる。

> **初心者ポイント**: 値を `0` にすると Google AI が「コンバージョンの最大化」しか目指せなくなり、「価値の最大化」入札戦略が使えなくなる。**必ず仮でも値を入れる**。

---

## Step 3: コンバージョンタグの本番反映

**実装は完了済み** — `app/layout.tsx` に env-driven Google Ads タグが組み込まれており、`NEXT_PUBLIC_GOOGLE_ADS_ID` の Vercel env が設定されると自動的にスクリプトが emit される。

### テンイチの作業

1. Google Ads コンバージョン作成後の画面で表示される **「タグ ID」** と **「コンバージョン ラベル」** をメモ
   - 例: タグ ID = `AW-1234567890`、ラベル = `abcDEF123_ghi`
2. これを Discord で私に共有 → 私が `vercel env add NEXT_PUBLIC_GOOGLE_ADS_ID production` で登録
3. Vercel が自動 redeploy → 本番反映

> **セキュリティメモ**: タグ ID とラベルは公開情報（最終的にブラウザのソースコードに出る）。Discord で共有して問題なし。

---

## Step 4: 動作確認

### 4-A: GA4 リアルタイム

1. ブラウザで sekaistay.com を開く
2. GA4 → **「レポート」 → 「リアルタイム」**
3. 自分のセッションが表示されることを確認
4. `/switch` のフォームをテスト送信（実フォーム送信は自社CRM に届くので、テスト用と書いて送信）
5. 「リアルタイム」で `lead` イベントが発火することを確認

### 4-B: Google Ads コンバージョン確認

1. **「コンバージョン」**画面 → 各 CV の **「ステータス」**列をチェック
2. インポート直後は **「未確認」** → 24-48h で **「最近のコンバージョンなし」** または **「記録中」** に変わる
3. テスト送信から24時間以内に「**最近のコンバージョン**」に1件以上カウントされれば成功

> **初心者ポイント**: ステータスが何日経っても「未確認」のままなら GA4 連携 or タグ実装が失敗している。私に Discord で `#sekai-stay` に「Google Ads CV ステータス未確認」と投げてくれれば調査します。

---

## トラブルシュート

| 症状 | 原因候補 | 対処 |
|---|---|---|
| GA4 イベントが発火しない | フォーム送信時の JS エラー | ブラウザの DevTools → Console でエラー確認 |
| Google Ads にイベントがインポートできない | GA4-Google Ads 連携が未完了 | Step 1 を再実行 |
| ステータスが「未確認」のまま | `NEXT_PUBLIC_GOOGLE_ADS_ID` env 未設定 or タグが redeploy されていない | env 登録 + Vercel redeploy で再確認 |

---

## 完了後にすること

- [ ] 設定完了を Discord `#sekai-stay` に投稿（私がそれを学習ログに記録）
- [ ] タグ ID とコンバージョン ラベルを Discord で共有 → 私が Vercel env 登録

---

## 関連

- 上位 LP の計測実装: `app/layout.tsx` （GA4 + Meta Pixel + Google Ads タグ env-driven）
- フォーム送信処理: `app/api/report-requests/submit/route.ts` → Supabase `lead_submissions` 直挿入 + `forwardLead` で 吉蔵（自社CRM）に転送
- LP 改善トラッキング: `components/EngagementTracker.tsx`（scroll_depth / section_view / cta_click）+ Microsoft Clarity（env: `NEXT_PUBLIC_CLARITY_PROJECT_ID`）
