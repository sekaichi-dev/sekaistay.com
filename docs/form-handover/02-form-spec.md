# 02. 現フォーム完全仕様

> 出典: `src/app/report-request/page.tsx`（同梱の `form-page.tsx` 参照）
> URL: https://japanvillas.kss-cloud.com/report-request

## 全体構成

**4ステップ・モバイルファースト** のマルチステップフォーム。各ステップで「次へ」ボタン押下時にバリデーション通過したら次へ進む。最終ステップで「無料レポートを申し込む」送信。

進捗バー: `物件情報 → 売上 → 手数料 → ご連絡先`

## URL パラメータ（iframe 埋め込み用）

| パラメータ | 値 | 効果 |
|---|---|---|
| `embed` | `1` | iframe 埋め込みモード（背景透過・ロゴ非表示・コンテナshadow省略） |
| `theme` | `light` (default) / `dark` | 色テーマ |
| `utm_source` 等 | 任意 | 広告経路の自動回収（後述） |

iframe 埋め込み時は親へ高さ通知（`postMessage` で `{ type: "japan-villas-height", height }`）と送信完了通知（`{ type: "japan-villas-form-submitted" }`）を送る。

## Step 1: 物件情報

### 入力項目
1. **物件名で検索**（任意）
   - 2文字以上で `/api/report-requests/property-search?q=...` をデバウンス400ms付きで叩く
   - 結果は `{ source: "airbnb"|"other", url, title?, thumbnail? }[]`
   - 初期表示6件 + 「もっと見る」で全件展開
   - クリックで選択、再クリックで解除

2. **物件のURLを貼り付け**（任意）
   - Airbnb URL 形式（後述バリデーション）
   - placeholder: `https://www.airbnb.jp/rooms/...`

3. **全ての管理物件数**（必須）
   - スライダー 1〜30（30 = 「30棟以上」表示）
   - デフォルト: 1

### バリデーション
- 「物件選択」または「URL入力」のいずれか必須

## Step 2: 売上

### 入力項目
1. **ピーク月の売上**（必須）
   - スライダー 0〜300万円（10万円刻み、300万 = 「300万円以上」）
   - デフォルト: 80万円
2. **オフピーク月の売上**（必須）
   - 同上、デフォルト: 20万円

### 表示
- スライダー上に大きく `約80万円` 表示
- 内部的には Range 文字列に変換（`0-10` / `10-20` / `20-30` / `30-50` / `50-80` / `80-120` / `120-200` / `200-300` / `300+`）

## Step 3: 手数料・運用年数

### 入力項目
1. **現在の運営代行手数料**（必須・2列ボタン）
   - `15%` / `20%` / `25%` / `わからない`
2. **運用年数**（必須・2列ボタン）
   - `1年未満` / `1〜2年` / `3〜5年` / `5年以上`

## Step 4: ご連絡先

### 入力項目
1. **お名前**（必須・テキスト）
2. **メールアドレス**（必須・email形式）
3. **電話番号**（必須・tel）
4. **現代行や運営面でのご不満・ご要望**（任意・textarea 4行・最大2000文字）

### バリデーション
- 名前・メール・電話の3つが空白でない時のみ送信ボタン有効化

## 送信時の挙動

### POST `/api/report-requests/submit`
詳細は `submit-route.ts` 参照。要点:
- Origin/Referer チェック（CSRF保護）
- IPベースレート制限（10件/時）
- メールフォーマット検証
- Airbnb URL ホスト検証（airbnb.com / .jp / .co.jp / abnb.me 等）
- 内部テスト用メールアドレス・名前パターンを自動的に `kind: "test"` 分類

### 送信成功後の画面
- 完了画面に切替
- 「24時間後に診断レポートを送ります」メッセージ
- カウントダウン表示（残り時間 HH:MM:SS）
- 「あなたが今、失っている可能性のあるコスト」= 年間損失見込み額（手数料差額 × 年商）を金額で表示
- 「ミーティング予約」ボタン（Timerex リンク: `https://timerex.net/s/sekai-stay/d61b424d`）

## 広告経路トラッキング

URL クエリから自動回収して payload に含める:
- `utm_source` / `utm_medium` / `utm_campaign` / `utm_content` / `utm_term`
- `gclid`（Google Ads）
- `fbclid`（Meta）
- `landing_url`（最初に着地したURL）
- `referrer`（document.referrer）

## デザイン要件

- **モバイルファースト**（max-w-xl 中央寄せ）
- フォント: Noto Sans JP / Inter
- アクセントカラー: CSS変数 `--jv-accent-strong`（緑系）
- カードUI: 白背景・1px境界線・微シャドウ
- ボタン: 12pxパディング・15px太字・active:scale-[0.98]
- ダークモード対応（`?theme=dark`）
- タッチターゲット 44px 以上（Apple HIG準拠）

