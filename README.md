# sekaistay.com

SEKAI STAY — 民泊運用代行のマーケティングサイト + 無料診断 LP。

- **本番**: https://sekaistay.com
- **運営**: 株式会社セカイチ（sekaichi HD）
- **リポジトリ**: https://github.com/sekaichi-dev/sekaistay.com

---

## 概要

Next.js 14（App Router）で構築された、民泊オーナー向けマーケティング + リード獲得プラットフォーム。

主な役割:
1. **集客**: SEO対応のマーケティングサイト（ホーム・サービス・事例・ブログ・エリア紹介）
2. **リード獲得**: `/switch` LP で管理会社乗り換え需要を HubSpot に送信
3. **自己診断**: `/audit` でオーナー自身が現状を 7ステップでセルフ診断 → スコア表示
4. **レポート申請**: `/switch` 内のフォームで japanvillas 側の公式レポート申請フォーム（iframe）を表示 → コンタクト / ディール / チケットを HubSpot に自動起票

---

## 技術スタック

| 層 | 採用技術 |
|----|---------|
| Framework | Next.js 14.2.0（App Router） |
| UI | React 18 / TypeScript 5 |
| Styling | Tailwind CSS 3.3 + カスタムデザイントークン |
| Fonts | Noto Sans JP（Google Fonts） |
| Analytics | GA4（`G-B7M920RCGR`）+ scroll_depth / time_on_page 計測 |
| Deploy | Vercel（sekaichi org） |
| Node | 18+ |

**外部連携**:
- `japanvillas.kss-cloud.com` — HubSpot リード登録 API（Contact / Deal / Ticket 起票）
- `images.unsplash.com` — 画像 CDN

---

## ページ一覧

| URL | 種別 | 用途 |
|-----|------|------|
| `/` | 静的 | ホームページ（Hero / 実績 / 料金 / CTA） |
| `/audit` | インタラクティブ | 7ステップ自己診断（18問スコアリング） |
| `/switch` | LP | 管理会社乗り換え LP（シミュレーター + レポート申請フォーム） |
| `/switch/thanks` | 静的 | フォーム送信後のサンクスページ |
| `/services` | 静的 | サービス詳細 |
| `/pricing` | 静的 | 料金表 |
| `/portfolio` | 静的 | 物件ポートフォリオ |
| `/case-studies` | 一覧 + 詳細 | 導入事例（7件） |
| `/area` / `/area/[slug]` | 動的 | サービスエリア紹介（20地域） |
| `/blog` / `/blog/[slug]` | 動的 | ブログ（59記事・JSONから生成） |
| `/about` / `/company` | 静的 | 会社概要 |
| `/faq` | 静的 | FAQ |
| `/contact` | 静的 | お問い合わせ |
| `/simulate` | 静的 | ROI シミュレーター |
| `/dashboard-demo` | 静的 | ダッシュボードプレビュー |
| `/privacy` | 静的 | プライバシーポリシー |
| `/admin` | クライアント | 自己診断回答の一覧表示（localStorage ベース） |
| `/diagnostic`, `/result` | リダイレクト | → `/audit`（301 permanent） |

---

## ディレクトリ構成

```
sekaistay.com/
├── app/                             # Next.js App Router
│   ├── layout.tsx                   # 全ページ共通 metadata / GA4 / 構造化データ
│   ├── page.tsx                     # ホーム（dynamic import でコード分割）
│   ├── globals.css                  # グローバルスタイル
│   ├── opengraph-image.tsx          # OG 画像生成
│   ├── sitemap.ts                   # 動的 sitemap（静的 + blog + area）
│   ├── api/
│   │   └── switch-form/route.ts     # japanvillas API への server-side proxy（CORS 回避）
│   ├── audit/                       # 7ステップ自己診断
│   ├── switch/                      # 管理会社乗り換え LP
│   ├── blog/                        # ブログ
│   ├── area/                        # エリア紹介
│   ├── case-studies/                # 事例
│   └── ...（各種静的ページ）
├── components/
│   ├── Header.tsx, Footer.tsx       # グローバル UI
│   ├── FloatingCTA.tsx              # 追従 CTA
│   ├── home/                        # ホーム用セクション（dynamic import 対象）
│   ├── switch/                      # /switch LP 専用コンポーネント群
│   │   ├── SwitchHero.tsx
│   │   ├── SwitchSimulator.tsx
│   │   ├── SwitchReportFormEmbed.tsx    # ★ japanvillas レポート申請 iframe 埋め込み
│   │   ├── SwitchContactForm.tsx        # （旧）独自フォーム — 現在は未使用
│   │   └── ...
│   ├── blog/, faq/                  # 各セクション専用
│   └── ...
├── lib/
│   ├── scoring.ts                   # /audit のスコアリング
│   ├── storage.ts                   # /audit の localStorage 管理
│   ├── blog.ts                      # ブログ記事ローダー
│   ├── areas.ts                     # エリアデータ（20件）
│   ├── case-studies.ts              # 事例データ（7件）
│   └── ...
├── data/
│   ├── questions.ts                 # /audit の設問定義（7ステップ / 18問）
│   └── resultCopy.ts                # スコア帯別の結果文言
├── content/
│   ├── blog/*.json                  # ブログ記事（59本）
│   └── home/{copy,images}.ts
├── hooks/useScrollFade.ts           # Intersection Observer によるフェードイン
├── public/                          # 画像・favicon・sitemap 等
├── SEKAI_STAY_Creative_Guide.md     # ブランドガイドライン
├── IMAGES_MANIFEST.md               # 画像アセット目録
├── SEO_AUDIT_REPORT.md              # SEO 監査レポート
└── ...
```

---

## セットアップ

```bash
git clone https://github.com/sekaichi-dev/sekaistay.com.git
cd sekaistay.com
npm install
npm run dev        # http://localhost:3000
```

### ビルド & 本番起動

```bash
npm run build
npm start
```

### デプロイ（Vercel）

```bash
vercel --prod
```

main への push で自動デプロイが走る。

---

## 環境変数

`.env.local` に配置。

| 変数 | 必須 | 用途 |
|------|------|------|
| `NEXT_PUBLIC_GSC_VERIFICATION` | 任意 | Google Search Console 所有権確認 |

**DB / 認証トークンは不要**。リード送信は server-side proxy 経由で japanvillas API に渡している。

---

## /switch の HubSpot 連携

`/switch` ページの「無料パーソナライズ診断」セクションは、japanvillas 側が提供する**公式レポート申請フォームを iframe 埋め込み**している。

### 仕組み

```
ユーザー
  ↓ フォーム入力（iframe 内）
https://japanvillas.kss-cloud.com/report-request?embed=1
  ↓ 送信
japanvillas server
  ↓
HubSpot（Contact / Deal / Ticket を自動起票）
```

- 実装: `components/switch/SwitchReportFormEmbed.tsx`
- 高さ追従: postMessage (`japan-villas-height`) を親ウィンドウでリッスンし、iframe を自動リサイズ
- オリジン検証: `https://japanvillas.kss-cloud.com` からのメッセージのみ受け付ける

### 旧実装（現在未使用）

`components/switch/SwitchContactForm.tsx` は独自フォームで `app/api/switch-form/route.ts` （server-side proxy）経由で japanvillas `POST /api/lp/owner-lead` に送信していた。iframe 移行により現在は未使用。将来 iframe をやめる場合に復元可能。

仕様書: https://japanvillas.kss-cloud.com/shared/lp-integration-guide.html

---

## /audit（自己診断システム）

**7ステップ / 18問 / 6カテゴリ** の民泊運営チェック。

- `data/questions.ts` で設問を管理
- `lib/scoring.ts` で 0–100 点のスコアと A/B/C/D ランクを算出
- 結果は localStorage（`minpaku_submissions`）に保存
- `/admin` で全回答を表示 / CSV エクスポート可能

### 設問追加

```typescript
// data/questions.ts
{
  id: 'new_question',
  step: 3,                    // 1〜7
  category: 'revenue',        // revenue | marketing | customer | operations | cost | management
  text: '質問文',
  type: 'single',             // 'single' | 'text' | 'email' | 'tel'
  scored: true,
  options: [
    { label: '選択肢A', score: 3 },
    { label: '選択肢B', score: 1 },
  ],
}
```

### スコアランク

| スコア | ランク |
|-------|-------|
| 80〜100 | A: 優秀 |
| 60〜79 | B: 良好 |
| 40〜59 | C: 改善余地あり |
| 0〜39 | D: 要見直し |

**本番 DB 化する場合**: `lib/storage.ts` の `submitAnswers()` / `getAllSubmissions()` を API 呼び出しに差し替えるだけで移行可能。

---

## ブログ

- 記事は `content/blog/*.json` に 1 ファイル 1 記事で配置
- `lib/blog.ts` が起動時に全件読込 → 日付降順ソート
- ルーティング: `/blog`（一覧）/ `/blog/[slug]`（詳細）

---

## エリア・事例

| データ | 場所 | 件数 |
|-------|------|------|
| サービスエリア | `lib/areas.ts` | 20地域 |
| 導入事例 | `lib/case-studies.ts` | 7物件 |

それぞれ `/area/[slug]` / `/case-studies` で動的表示。

---

## デザインシステム

**カラーパレット**（`tailwind.config.js`）:

- Primary: Sekai Black `#0B0B0B` / Deep Teal `#0F5F65` / Sekai Teal `#167B81` / Bright Teal `#54BEC3`
- Editorial: Ivory `#FBF9F4` / Bone `#F4EEE4` / Paper `#FFFDF9` / Mist `#F7F5F0` / Rule `#E6E1D6` / Ink `#1A1A1A`
- Switch LP 専用: `switch-*` プレフィックス（色衝突回避）

**タイポグラフィ**:
- Font: `Noto Sans JP`（400 / 500 / 700）
- `font-feature-settings: "palt" 1` で日本語詰め
- Display サイズは clamp() で流動的にスケール

**アニメーション**:
- `useScrollFade` フックで Intersection Observer ベースのフェードイン
- Framer Motion は使用せず Tailwind transition で実装

詳細は `SEKAI_STAY_Creative_Guide.md` 参照。

---

## パフォーマンス最適化

- **Code splitting**: ホームページ以外は `dynamic()` で下部セクションを遅延ロード（初期 JS 約 69 KiB 削減）
- **Image optimization**: Next.js Image + Unsplash remote pattern / AVIF + WebP 両対応
- **Caching**: 静的アセット（画像 / フォント / JS / CSS）に `max-age=31536000, immutable`
- **Console**: 本番ビルド時に `compiler.removeConsole: true`

---

## SEO

- 動的 `sitemap.ts`（static + blog + area）
- `app/layout.tsx` で Schema.org `ProfessionalService` の JSON-LD を注入
- OG / Twitter Card メタ完備
- `robots.txt` / `manifest.json` / Apple / Android アイコン各種

監査レポート: `SEO_AUDIT_REPORT.md`

---

## デプロイ

- **ホスティング**: Vercel（sekaichi org）
- **ドメイン**: sekaistay.com
- **CI/CD**: main への push で自動デプロイ / PR ごとにプレビュー環境生成

---

## 関連リンク

- LP 統合ガイド（iframe / HubSpot 仕様）: https://japanvillas.kss-cloud.com/shared/lp-integration-guide.html
- ブランドガイド: `SEKAI_STAY_Creative_Guide.md`
- 画像アセット目録: `IMAGES_MANIFEST.md`
- SEO 監査: `SEO_AUDIT_REPORT.md`
- `/switch` 監査: `audit/switch-audit-2026-04-20.md`
