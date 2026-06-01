# SEKAI STAY LP/HP 引き継ぎ資料 — 本間ヨシト様

> **作成日**: 2026-05-31 / **作成者**: テンイチ
> **引き継ぎ先**: 本間ヨシト（リード獲得・マーケ責任者 / `design.7247@gmail.com`）
> **対象**: sekaistay.com（HP + LP 3 variants）の設計・改善・運用
> **戻る**: [HANDOVER_YOSHITO.md](HANDOVER_YOSHITO.md)
> **姉妹資料**: [`ad-ops/HANDOVER_YOSHITO_2026-05-31.md`](ad-ops/HANDOVER_YOSHITO_2026-05-31.md)（広告運用引き継ぎ）

---

## 🔗 外部リンク（よく使うもの・トップ固定）

| 種別 | URL / 場所 |
|---|---|
| 🌐 **本番 HP** | https://sekaistay.com |
| 🅰️ **LP A — Control（価格主導）** | https://sekaistay.com/switch |
| 🅱️ **LP B — Founder（信頼主導）** | https://sekaistay.com/switch/founder |
| 🅲 **LP C — Portal（24h可視化）** | https://sekaistay.com/switch/portal |
| 🔗 **短縮URL（GA計測付き）** | https://sekaistay.com/go/pr （PR用） |
| 🛠️ **Vercel プロジェクト** | https://vercel.com/sekaichi/sekaistay-com （`prj_qfaTcxdt6mQ18ARDg046q5febS0d`） |
| 📦 **GitHub リポ** | https://github.com/sekaichi-dev/sekaistay.com |
| 📈 **LP A/Bテスト分析** | https://sekaichi-dashboard.vercel.app/lp-analytics （CVR・Δ・Z-score） |
| 📊 **広告統合ダッシュボード** | https://sekaichi-dashboard.vercel.app/marketing |
| 📥 **SEKAI STAY Lead Submissions Log** | [Google Sheet](https://docs.google.com/spreadsheets/d/1CWTHJyHrjpfg6voaiAZabMkKv21or1BbrGF9e6aBKh4/edit) |
| 🎨 **Brand / Creative Guide** | `SEKAI_STAY_Creative_Guide.md`（リポ直下） / `IMAGES_MANIFEST.md` |
| 🔎 **SEO 監査レポート** | `SEO_AUDIT_REPORT.md`（リポ直下） |
| 🗄️ **Supabase（lead_submissions）** | https://supabase.com/dashboard/project/_ （プロジェクト名は env を参照） |

---

## ⚡ サマリー（3分で読める現状）

### サイト構成

| 種別 | URL | 役割 | 実装場所 |
|---|---|---|---|
| **HP** | https://sekaistay.com | 会社全体のマーケサイト・20+ ページ | `app/page.tsx` 他 |
| **LP A**（Control） | /switch | 価格主導・業界半額・手数料8% | `app/switch/page.tsx` |
| **LP B** | /switch/founder | 信頼主導・創業者前面 | `app/switch/founder/page.tsx` |
| **LP C** | /switch/portal | ポータル主導・24h可視化 | `app/switch/portal/page.tsx` |

### 直近1.5ヶ月の改善ハイライト

```
5/15 🎨 Phase B-1 Guesty着想HP改善（Hero/NavCards/事例カード/サービス3バケット）
5/15 🧮 /simulate 削除 → /services と /audit Step02 に計算機を統合
5/17 🎯 /services 低コントラスト一括強化 + Header 不透明化
5/19 ✏️ 「その他の費用は一切なし」誤解表現削除
5/20 🔗 自社ドメイン短縮URL /go/<slug> 実装
5/22 🖼️ OG画像を「SEKAI STAY 8% hero banner」に差替（CDN cache bust v2）
5/22 📝 switch FAQ に解約金記載追加 / 「業界もっともシンプル」→「シンプル」
5/22 📣 Slack通知パイプライン: 10分遅延 + TimeRex予約済み抑制
5/23 🔀 TimeRex予約あり→スレッド返信・なし→既存通知
5/27 🔠 漢字↔かなで名前マッチ失敗 → 時間窓フォールバック追加
```

### 即知っておいてほしい3点

1. 🟢 **Vercel プロジェクトは `sekaistay-com` に統合済み**（2026-06-01・旧 `minpaku-audit` をリネーム）
2. 🟡 **LP コンテンツ軸は freeze 中**（コピー・訴求内容は変えず、デザインのみ変更する方針）
3. 🟡 **デザインガイドのブランドトークン厳守**（赤系不使用・独自カラー追加禁止）

> 媒体別の運用・LP別広告との対応は姉妹資料 [`ad-ops/HANDOVER_YOSHITO_2026-05-31.md`](ad-ops/HANDOVER_YOSHITO_2026-05-31.md) §6 参照。

---

## 1. 役割分担と権限（吉蔵基準 / Human-in-the-Loop）

### ヨシトが単独で判断・実行してよい

| 領域 | 例 |
|---|---|
| LP / HP のコピー差し替え | テキスト修正・FAQ追加・実績数値更新 |
| 画像・OG画像の差し替え | 既存ガイドラインに沿う範囲 |
| 既存セクションの装飾調整 | ボーダー・余白・行間・shadow |
| LP A/Bテストの variant 切替 | 既存3variants内での配信切替 |
| 既存ページの追加・並び替え | NavCards・FAQ・事例の組み替え |

### テンイチに確認すべき（プロダクト連動）

| 領域 | 例 |
|---|---|
| LP の構造変更 | セクション追加削除・フォーム項目変更 |
| 計測タグ実装変更 | 新規 CV 定義・Pixel 追加削除 |
| 新規ドメイン・サブドメイン | カスタムドメイン追加 |
| 新規 LP variant 追加 | A/Bテスト分岐の追加（既存3超え） |
| データソース連動の変更 | Supabase / HubSpot スキーマ変更 |
| 機能追加 | 計算機・診断ツール等の新規実装 |

### 義人（事業責任者）に確認すべき

| 領域 | 例 |
|---|---|
| ブランドメッセージの方向転換 | 「業界半額・手数料8%」軸を変える |
| 価格・契約条件の表示変更 | 「先着10名初期費用0円」等の条件 |
| 新規ページ群の追加 | 投資家向けページ等の新セクション |

### 法務系（Toyo 確認）

- 比較広告での競合社名使用
- 「No.1」「業界初」等の最上級表現
- 受賞表記の使用

---

## 2. デプロイ・環境 ★最重要

### 2-1. Vercel プロジェクト

| 項目 | 値 |
|---|---|
| **本番プロジェクト名** | **`sekaistay-com`** |
| プロジェクト ID | `prj_qfaTcxdt6mQ18ARDg046q5febS0d` |
| 本番ドメイン | https://sekaistay.com / https://www.sekaistay.com |
| Vercel 自動ドメイン | https://sekaistay-com.vercel.app（本番）/ https://minpaku-audit.vercel.app（互換のため残存） |
| デプロイトリガー | main push で本番自動デプロイ・PR ごとにプレビュー |
| Organization | sekaichi |

> **統合履歴（2026-06-01）**: 旧「民泊診断」(`minpaku-audit`) をリブランドして `sekaistay-com` にリネーム・1 本に統合（プロジェクト ID 維持・env/cron/履歴/GitHub連携/ドメインすべて引き継ぎ）。`minpaku-audit.vercel.app` は過去 deployment URL 参照の互換用に残置。

### 2-2. ドメイン構成

| ドメイン | 用途 |
|---|---|
| sekaistay.com | 本番マーケサイト |
| sekaistay.com/go/<slug> | 自社ドメイン短縮URL（2026-05-20実装） |
| ops.sekaistay.com | 運営ポータル（sekai-stay-ops プロジェクト・別管理） |

### 2-3. リダイレクト・cron（`vercel.json`）

```json
{
  "redirects": [
    { "source": "/lp", "destination": "/switch", "permanent": true }
  ],
  "crons": [
    { "path": "/api/lead-slack-delayed", "schedule": "* * * * *" }
  ]
}
```

→ `/lp` → `/switch` 恒久リダイレクト  
→ `/api/lead-slack-delayed` を毎分実行（10分遅延 Slack 通知用）

### 2-4. 主要な環境変数（Vercel）

| 変数 | 用途 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 接続 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 公開キー |
| `SUPABASE_SERVICE_ROLE_KEY` | サーバーサイド書き込み |
| `META_PIXEL_ID` | `1658477098524563` |
| `META_CAPI_TOKEN` | Meta CAPI |
| `META_CAPI_TEST_EVENT_CODE` | Meta CAPI テストコード |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | Google Ads conversion ID |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | フォーム送信フォールバック |
| `SLACK_LEAD_WEBHOOK` | Slack リード通知 |
| `DISCORD_LEAD_WEBHOOK` | Discord リード通知 |

### 2-5. 技術スタック

- Next.js 14.2.0（App Router）
- React 18 / TypeScript 5 / Tailwind CSS 3.4
- Supabase SDK v2
- Vercel Edge Functions（API routes）
- Node v22+

---

## 3. ★ サイト全体のソースマップ

### 3-1. ディレクトリ構成（プロジェクトルート）

```
projects/sekaistay-com/
├── app/                  # Next.js App Router（ページ + APIルート）
├── components/           # React コンポーネント
├── lib/                  # ロジック・データ取得・外部連携
├── data/                 # 設問・コピー定数
├── content/              # ブログ・HP記事の JSON
├── public/               # 静的ファイル（画像・robots.txt・OG画像）
├── ad-ops/               # 広告運用ドキュメント・コピードラフト
├── ROADMAP.md            # 広告運用ロードマップ
├── README.md             # 技術スタック・セットアップ
├── CLAUDE.md             # AI エージェント向け作業ガイド
├── SEKAI_STAY_Creative_Guide.md  # ブランドガイドライン
├── IMAGES_MANIFEST.md    # 画像アセット目録
├── SEO_AUDIT_REPORT.md   # SEO 監査結果
├── tailwind.config.js    # ブランドトークン
├── next.config.js        # リダイレクト・画像最適化
├── vercel.json           # Vercel 設定（redirect・cron）
└── package.json
```

### 3-2. `app/` ディレクトリ（全42ファイル）

#### HP / 主要ページ

| ファイル | URL | 役割 |
|---|---|---|
| `app/page.tsx` | `/` | **HPトップ** — Hero + 軽量 dynamic import 群 |
| `app/layout.tsx` | — | グローバル layout（GA4 / Meta Pixel / Font） |
| `app/globals.css` | — | グローバル CSS |
| `app/opengraph-image.tsx` | — | OG画像生成 |
| `app/sitemap.ts` | `/sitemap.xml` | 動的 sitemap |
| `app/about/page.tsx` | `/about` | 会社案内 |
| `app/company/page.tsx` | `/company` | 会社概要 |
| `app/services/page.tsx` | `/services` | サービス詳細（3バケット・SwitchSimulator統合） |
| `app/pricing/page.tsx` | `/pricing` | 料金プラン |
| `app/portfolio/page.tsx` | `/portfolio` | 運営物件ポートフォリオ |
| `app/case-studies/page.tsx` | `/case-studies` | 導入事例（7件） |
| `app/area/page.tsx` | `/area` | エリア一覧 |
| `app/area/[slug]/page.tsx` | `/area/<slug>` | エリア詳細（20地域・動的） |
| `app/audit/layout.tsx` | — | /audit 専用 layout |
| `app/audit/page.tsx` | `/audit` | 自己診断（7ステップ・18問・SwitchSimulator内蔵） |
| `app/blog/page.tsx` | `/blog` | ブログ一覧 |
| `app/blog/[slug]/page.tsx` | `/blog/<slug>` | ブログ記事（59本・動的） |
| `app/faq/page.tsx` | `/faq` | よくある質問 |
| `app/contact/layout.tsx` | — | /contact layout |
| `app/contact/page.tsx` | `/contact` | お問い合わせ |
| `app/privacy/page.tsx` | `/privacy` | プライバシーポリシー（Meta CAPI 言及済み） |
| `app/dashboard-demo/page.tsx` | `/dashboard-demo` | オーナーポータル デモ |
| `app/diagnostic/layout.tsx` | — | レガシー diagnostic layout |
| `app/diagnostic/page.tsx` | `/diagnostic` | 旧・診断（/audit に統合済み・レガシー残置） |
| `app/result/layout.tsx` | — | /result layout |
| `app/result/page.tsx` | `/result` | 診断結果表示 |
| `app/report-request/page.tsx` | `/report-request` | レポート申込ページ |
| `app/admin/page.tsx` | `/admin` | 管理画面 |

#### LP（switch ファミリー）

| ファイル | URL | variant | 役割 |
|---|---|---|---|
| `app/switch/layout.tsx` | — | 共通 | LP 共通 layout（metadata 共通） |
| `app/switch/page.tsx` | `/switch` | switch | **LP A（Control・価格主導）** |
| `app/switch/founder/page.tsx` | `/switch/founder` | switch-founder | **LP B（信頼主導・創業者前面）** |
| `app/switch/portal/page.tsx` | `/switch/portal` | switch-portal | **LP C（ポータル主導・24h可視化）** |
| `app/switch/results/page.tsx` | `/switch/results` | — | LP内・実績ページ |
| `app/switch/thanks/page.tsx` | `/switch/thanks` | — | フォーム送信後 thanks ページ |
| `app/switch/_archive/kotekote/page.tsx` | — | （アーカイブ） | コテコテ variant |
| `app/switch/_archive/simple/page.tsx` | — | （アーカイブ） | シンプル variant |

#### API ルート

| ファイル | エンドポイント | 役割 |
|---|---|---|
| `app/api/report-requests/submit/route.ts` | POST `/api/report-requests/submit` | フォーム送信本体（→ Supabase + 吉蔵CRM + Meta CAPI + Slack + Discord） |
| `app/api/lead-slack-delayed/route.ts` | GET `/api/lead-slack-delayed` | 10分遅延 Slack 通知（cron 毎分・TimeRex照合） |
| `app/api/lead-forward-retry/route.ts` | POST `/api/lead-forward-retry` | 吉蔵CRM転送失敗時のリトライ |
| `app/api/contact/route.ts` | POST `/api/contact` | お問い合わせフォーム送信 |
| `app/api/property-search/route.ts` | GET `/api/property-search` | 物件検索（Brave Search 連携） |
| `app/api/track/page-view/route.ts` | POST `/api/track/page-view` | ページビュー計測 |
| `app/go/[slug]/route.ts` | GET `/go/<slug>` | 自社ドメイン短縮URLリダイレクト（2026-05-20実装） |

### 3-3. `components/` ディレクトリ（全55ファイル）

#### 共通コンポーネント（ルート直下）

| ファイル | 用途 |
|---|---|
| `Header.tsx` | グローバルヘッダー |
| `Footer.tsx` | グローバルフッター |
| `Breadcrumb.tsx` | パンくず |
| `JP.tsx` | 日本語タイポ用ラッパー |
| `Icons.tsx` | SVG アイコンセット |
| `ScrollFade.tsx` | スクロール時 fade-in |
| `FloatingCTA.tsx` | 追従CTA（HPで使用・dynamic） |
| `EditorialSimulator.tsx` | 計算機（編集系） |
| `EngagementTracker.tsx` | スクロール深度・滞在時間計測 |
| `AnalyticsRouteTracker.tsx` | ルート変更追跡（GA4 pageview） |

#### `components/home/` — HP セクション

| ファイル | 役割 |
|---|---|
| `Hero.tsx` | HP Hero（category eyebrow + 数字3つ + 軽CTA） |
| `AuthorityBar.tsx` | 数字パッド（現状 page.tsx から外され Hero に統合済） |
| `Credentials.tsx` | 受賞・認定 |
| `Dashboard.tsx` | ダッシュボード紹介 |
| `Ecosystem.tsx` | エコシステム図 |
| `EntryPoints.tsx` | 入口セクション |
| `FAQ.tsx` | HP FAQ |
| `FinalCTA.tsx` | 最終CTA |
| `Flow.tsx` | 利用フロー |
| `FooterCatch.tsx` | フッター上キャッチコピー |
| `MidCTA.tsx` | 中間CTA |
| `NavCards.tsx` | 3段ファンネル NavCards（軽/中/重） |
| `PainPoints.tsx` | 悩み訴求 |
| `Pricing.tsx` | 料金表示 |
| `Results.tsx` | 事例カード（効果ファースト見出し） |
| `Simulation.tsx` | 試算 |
| `ValueProp.tsx` | 価値提案 |

#### `components/switch/` — LP セクション

| ファイル | 用途 | LP variant |
|---|---|---|
| `SwitchHeader.tsx` | LP共通ヘッダー | 全 |
| `SwitchHero.tsx` | Control LP Hero | switch |
| `SwitchHeroFounder.tsx` | 創業者前面 Hero | founder |
| `SwitchHeroPortal.tsx` | ポータル前面 Hero | portal |
| `SwitchHeroKotekote.tsx` | コテコテ Hero | （archive） |
| `SwitchHeroSimple.tsx` | シンプル Hero | （archive） |
| `SwitchSimulator.tsx` | 料金計算機（コア機能） | 全 + /audit + /services |
| `SwitchPainPoints.tsx` | 悩み訴求 | switch |
| `SwitchServices.tsx` | サービス紹介 | 全 |
| `SwitchComparison.tsx` | 競合比較 | 全 |
| `SwitchResults.tsx` | 実績数値 | 全 |
| `SwitchTestimonials.tsx` | お客様の声 | switch, founder |
| `PortalTestimonials.tsx` | ポータル特化 testimonials | portal |
| `SwitchPricing.tsx` | 料金表 | 全 |
| `SwitchFlow.tsx` | 流れ | 全 |
| `SwitchFAQ.tsx` | LP FAQ | 全 |
| `SwitchFounderStory.tsx` | 創業者ストーリー | founder |
| `SwitchPrimaryCTA.tsx` | プライマリCTA | switch, portal |
| `SwitchStickyCTA.tsx` | 追従CTA | 全 |
| `SwitchMidCTA.tsx` | 中間CTA | switch（archive 含む） |
| `SwitchBeforeAfter.tsx` | ビフォーアフター比較 | （未使用？） |
| `SwitchFailurePatterns.tsx` | 失敗パターン | （未使用？） |
| `SwitchSolution.tsx` | 解決策訴求 | （未使用？） |
| `SwitchTrustBar.tsx` | 信頼バー | （未使用？） |
| `LpVariantForm.tsx` | LPフォームラッパー（lp_variant を ReportRequestForm に渡す） | 全 |
| `SimpleContactForm.tsx` | シンプル問い合わせフォーム | — |
| `DashboardDemo.tsx` | ダッシュボードデモ表示 | portal等 |
| `PageViewTracker.tsx` | LP pageview 計測（lp_variant 付き） | 全 |

#### `components/switch/_shared/` — LP 共通要素

| ファイル | 用途 |
|---|---|
| `LpFooter.tsx` | LP 専用フッター（HP の Footer とは別） |
| `LpCompanyInfo.tsx` | LP 用会社情報 |
| `LegalModal.tsx` | 利用規約モーダル |

#### `components/switch/deco/` — LP デコレーション

| ファイル | 用途 |
|---|---|
| `WaveDivider.tsx` | 波線区切り |
| `SectionHead.tsx` | セクション見出し装飾 |
| `BounceArrow.tsx` | バウンス矢印 |
| `BeforeAfterBar.tsx` | ビフォーアフターバー |
| `CountUp.tsx` | カウントアップアニメ |
| `CountdownTimer.tsx` | カウントダウンタイマー |
| `DotPattern.tsx` | ドットパターン背景 |
| `HighlightMarker.tsx` | ハイライト蛍光ペン |
| `deadline.ts` | 締切日定数 |

#### `components/audit/` — 診断ページ

| ファイル | 用途 |
|---|---|
| `AuditReportRequestForm.tsx` | 診断結果から派生するレポート申込フォーム |

#### `components/blog/`, `components/faq/`, `components/services/`, `components/report-request/`

| ファイル | 用途 |
|---|---|
| `blog/BlogGrid.tsx` | ブログ一覧グリッド |
| `faq/FAQClient.tsx` | FAQ クライアントコンポーネント |
| `services/ServiceBucketsInteractive.tsx` | サービス3バケット（クリックでモーダル展開） |
| `report-request/ReportRequestForm.tsx` | **フォーム本体**（全フォームの最下層） |

#### `components/switch/_tanaka.ts`

田中氏（架空ペルソナ？）関連の定数。詳細要確認。

### 3-4. `lib/` ディレクトリ（全14ファイル）

| ファイル | 役割 |
|---|---|
| `lib/supabase.ts` | Supabase クライアント初期化 |
| `lib/lead-submissions.ts` | Supabase `lead_submissions` テーブル書き込み |
| `lib/lead-forward.ts` | 吉蔵 CRM 転送（forwardLead） |
| `lib/meta-capi.ts` | Meta Conversions API 送信（hashed PII） |
| `lib/sheets-backup.ts` | Google Sheets バックアップ書き込み |
| `lib/blog.ts` | `content/blog/*.json` 起動時読込 |
| `lib/areas.ts` | 20地域データ |
| `lib/case-studies.ts` | 7導入事例データ |
| `lib/offices.ts` | オフィス情報 |
| `lib/scoring.ts` | 診断スコアリングロジック |
| `lib/test-classifier.ts` | テスト/本番リード判別 |
| `lib/engagement-tracking.ts` | スクロール深度・滞在時間ロジック |
| `lib/images.ts` | 画像パス定数 |
| `lib/media.ts` | メディア（プレス）データ |
| `lib/storage.ts` | localStorage ラッパー |

### 3-5. `data/` ディレクトリ

| ファイル | 役割 |
|---|---|
| `data/questions.ts` | 診断設問（7ステップ・18問・カテゴリ別） |
| `data/resultCopy.ts` | 診断結果コピー |

### 3-6. `content/` ディレクトリ

| ディレクトリ | 内容 |
|---|---|
| `content/blog/` | ブログ記事（59本の JSON ファイル） |
| `content/home/` | HP 用コンテンツ JSON |

### 3-7. `public/` ディレクトリ

| ファイル/ディレクトリ | 用途 |
|---|---|
| `public/favicon.ico` / `apple-icon.png` / `icon-192.png` / `icon-512.png` | ファビコン群 |
| `public/og-image-v2.png` | 「SEKAI STAY 8%」OG画像（2026-05-22 差替） |
| `public/manifest.json` | PWA manifest |
| `public/robots.txt` | robots |
| `public/sitemap_note_articles.xml` | note記事用 sitemap |
| `public/images/` | サイト全体の画像 |
| `public/illust-inbound.svg` / `illust-quality.svg` / `illust-support.svg` | イラスト |
| `public/sekai_stay_01_03.png` ~ `03_03.png` | LP用画像 |
| `public/SEKAISTAY営業資料完成版.pptx` | 営業資料 |

---

## 4. ★ ページ別の構成詳細

### 4-1. HP トップ（`app/page.tsx`）

**構成**:
```typescript
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/home/Hero'

// 以下は dynamic import（初期ロード軽量化）
const FloatingCTA = dynamic(() => import('@/components/FloatingCTA'), { ssr: false })
const Simulation = dynamic(() => import('@/components/home/Simulation'))
const PainPoints = dynamic(() => import('@/components/home/PainPoints'))
const MidCTA = dynamic(() => import('@/components/home/MidCTA'))
const Flow = dynamic(() => import('@/components/home/Flow'))
const Results = dynamic(() => import('@/components/home/Results'))
const NavCards = dynamic(() => import('@/components/home/NavCards'))
const FinalCTA = dynamic(() => import('@/components/home/FinalCTA'))
```

→ **Header → Hero → Simulation → PainPoints → MidCTA → Flow → Results → NavCards → FinalCTA → Footer + FloatingCTA**

### 4-2. LP A: `/switch`（`app/switch/page.tsx`）

**Import 一覧（22 components）**:
```
LpFooter, LpCompanyInfo, SwitchHeader, SwitchHero, SwitchSimulator,
SwitchPainPoints, SwitchServices, SwitchComparison, SwitchResults,
SwitchTestimonials, SwitchPricing, SwitchFlow, SwitchFAQ,
LpVariantForm, SwitchPrimaryCTA, SwitchStickyCTA,
WaveDivider, PageViewTracker, EngagementTracker
```

**構成順**: SwitchHeader → SwitchHero → SwitchSimulator → SwitchPainPoints → SwitchServices → SwitchComparison → SwitchResults → SwitchTestimonials → SwitchPricing → SwitchFlow → SwitchFAQ → SwitchPrimaryCTA → LpVariantForm → LpFooter + LpCompanyInfo + SwitchStickyCTA

### 4-3. LP B: `/switch/founder`（`app/switch/founder/page.tsx`）

**Import 一覧**:
```
LpFooter, LpCompanyInfo, SwitchHeader, SwitchHeroFounder, SwitchFounderStory,
SwitchServices, SwitchResults, SwitchTestimonials, SwitchComparison,
SwitchSimulator, SwitchPricing, SwitchFlow, SwitchFAQ,
LpVariantForm, PageViewTracker, EngagementTracker, SwitchStickyCTA
```

**Control との差分**:
- ❌ SwitchHero → ✅ **SwitchHeroFounder**
- ❌ SwitchPainPoints
- ✅ **SwitchFounderStory** 追加（創業者ストーリー）
- セクション順序が「信頼訴求 → 比較」に並べ替え

### 4-4. LP C: `/switch/portal`（`app/switch/portal/page.tsx`）

**Import 一覧**:
```
LpFooter, LpCompanyInfo, SwitchHeader, SwitchHeroPortal,
SwitchServices, SwitchComparison, SwitchResults,
SwitchPricing, SwitchFlow, SwitchFAQ,
SwitchPrimaryCTA, SwitchStickyCTA, LpVariantForm,
PortalTestimonials, PageViewTracker, EngagementTracker, WaveDivider
```

**Control との差分**:
- ❌ SwitchHero → ✅ **SwitchHeroPortal**
- ❌ SwitchTestimonials → ✅ **PortalTestimonials**（ポータル特化）
- ❌ SwitchPainPoints
- ❌ SwitchSimulator

### 4-5. アーカイブ LP（`app/switch/_archive/`）

**`kotekote/`** — Control 構成に SwitchHeroKotekote を載せる
**`simple/`** — Control 構成に SwitchHeroSimple を載せる

> 再開時は `_archive/<variant>/page.tsx` を `app/switch/<variant>/page.tsx` に移動するだけ。

### 4-6. `/services`（サービス詳細）

- 9サービスを **3バケット**（集客 / 運営 / 開業成長）に整理（2026-05-15）
- 縦割りカラム + クリックでモーダル表示
- Chapter Ⅴ Clear Pricing に SwitchSimulator 統合（旧 /simulate は削除）

### 4-7. `/audit`（自己診断）

- 7ステップ・18問（`data/questions.ts`）
- Step 02 に SwitchSimulator 統合
- スコアリングは `lib/scoring.ts`
- 結果は `/result` に表示

### 4-8. `/blog`, `/area`, `/case-studies`

| ページ | データソース | 件数 |
|---|---|---|
| `/blog` | `content/blog/*.json`（lib/blog.ts で読込） | 59記事 |
| `/area/[slug]` | `lib/areas.ts` | 20地域 |
| `/case-studies` | `lib/case-studies.ts` | 7件 |

---

## 5. デザインシステム ★厳守

### 5-1. Tailwind ブランドトークン（`tailwind.config.js`）

**プライマリ**
- Sekai Black: `#0B0B0B`
- Sekai Charcoal: `#2D2D2D`
- Deep Teal: `#0F5F65`
- **Sekai Teal**: `#167B81`（メインブランド）
- Bright Teal: `#54BEC3`

**エディトリアル ニュートラル**
- Ivory: `#FBF9F4`
- Bone: `#F4EEE4`
- Paper / Mist / Rule / Ink（階調）

**Switch LP 専用**
- `switch-teal` / `switch-charcoal` / `switch-accent`: `#E8653A`（オレンジ）
- yellow-400（アクセント）

### 5-2. 配色ポリシー（lp_color_policy）

| ルール | 詳細 |
|---|---|
| ✅ 使う | sekai-charcoal / sekai-teal-bright / yellow-400 / switch-accent |
| ❌ 不使用 | **赤系（赤・濃赤・スカーレット等）** |
| ❌ 不使用 | 独自カラー（ゴールド・黒・派手な原色を勝手に追加） |

### 5-3. フォント

| 用途 | フォント | weight |
|---|---|---|
| 本文（和文） | Noto Sans JP | 300 / 400 / 500 / 600 / 700 |
| 本文フォールバック（欧文） | Helvetica Neue | — |
| 見出し（明朝） | Shippori Mincho | 400/500/600/700 |
| 数字・特殊 | Fraunces | variable |

→ `font-feature-settings` で日本語詰め有効

### 5-4. レスポンシブ

- **流動スケール**: `clamp()` で fluid typography
- **画像**: Unsplash リモート画像対応（AVIF / WebP 配信）
- **モバイル等価性** (mobile_ui_parity): デスクトップの装飾（点線等）はモバイルでも表示

### 5-5. シンプル variant 思想（simple_variant_philosophy）

「シンプル」を選んだら全セクション一貫してミニマル。以下は **シンプル思想に反するので削除**:
- 追従CTA / 波線アニメ / 中間CTA挿入 / dark-gradient block

### 5-6. AI メッセージング（lp_design_ai_mention）

LP / マーケコピーで「AI」という言葉を **押し出さない**。
- ❌ AI化 → ✅ 仕組み化
- ❌ AI自動 → ✅ 日次自動

---

## 6. フォーム送信パイプライン

### 6-1. フロー全体

```
ReportRequestForm（client component）
  ↓ ユーザー送信
POST /api/report-requests/submit （app/api/report-requests/submit/route.ts）
  ↓ fire-and-forget 並列転送
  ├─ Supabase lead_submissions（raw 一次保管・lp_variant カラム保存）
  ├─ 吉蔵 CRM forwardLead（lib/lead-forward.ts）
  ├─ sekaistay-sales-portal webhook
  ├─ Discord lead webhook
  ├─ Slack lead webhook（即時送信）
  ├─ Meta CAPI sendMetaCapiLead（lib/meta-capi.ts・hashed PII）
  └─ Google Sheets backup（lib/sheets-backup.ts）
  ↓
client → fbq('Lead', {eventID}) + gtag('generate_lead')
  ↓
10分後（cron 毎分）/api/lead-slack-delayed
  → TimeRex予約済みかチェック
  → 予約あり: スレッド返信
  → 予約なし: 既存通知に「⚠️ TimeRex予約なし」マーカー追加
```

### 6-2. 主要ファイル

| ファイル | 役割 |
|---|---|
| `components/report-request/ReportRequestForm.tsx` | フォーム本体（全フォームの最下層） |
| `components/switch/LpVariantForm.tsx` | LP variant ラッパー（lp_variant を埋め込み） |
| `components/audit/AuditReportRequestForm.tsx` | /audit 専用フォーム |
| `components/switch/SimpleContactForm.tsx` | シンプル問い合わせフォーム |
| `app/api/report-requests/submit/route.ts` | サブミット受信エンドポイント |
| `app/api/lead-slack-delayed/route.ts` | 10分遅延 Slack 通知 |
| `app/api/lead-forward-retry/route.ts` | 吉蔵CRM転送失敗時のリトライ |
| `app/api/contact/route.ts` | /contact 問い合わせ送信 |
| `lib/lead-submissions.ts` | Supabase 書き込み |
| `lib/lead-forward.ts` | 吉蔵 CRM 転送 |
| `lib/meta-capi.ts` | Meta CAPI 送信 |
| `lib/sheets-backup.ts` | Google Sheets バックアップ |
| `lib/test-classifier.ts` | テスト/本番リード判別 |

### 6-3. フォーム文言の最新状態

LP の form 文言（`lp_form_copy`）:
- 「24時間以内に担当者からご連絡」 → **「物件診断レポート無料作成」**
- 「3項目で、1営業日以内にメールで専用レポート」訴求
- 「まだAirBnBに掲載していない・アクティブなリスティングが無い」（form_copy_update）

CTA ボタン文言（`lp_button_language` / `lp_button_text_style`）:
- 「無料で面談を予約する」「専門家に無料相談する」
- 「運用に関するご相談はこちら」（`sekaistay_lp_cta_language`）

---

## 7. 計測タグ・SEO

### 7-1. 計測ID 一覧

| 項目 | 値 | 場所 |
|---|---|---|
| GA4 | `G-B7M920RCGR` | `app/layout.tsx` ハードコード |
| Google Tag | `GT-WVRTJXNR` | layout.tsx |
| Meta Pixel（メイン） | `1658477098524563` | layout.tsx |
| Meta Pixel（追加） | `989839370242915` | layout.tsx（統合検討中） |
| Meta CAPI | env: `META_CAPI_TOKEN` | サーバー側 |
| Microsoft Clarity | （ヒートマップ） | env で有効化 |
| X Ads UWT | （X Pixel） | env で有効化（未設定） |
| Google Ads Conversion | `NEXT_PUBLIC_GOOGLE_ADS_ID` | env |

### 7-2. 計測コンポーネント

| ファイル | 役割 |
|---|---|
| `components/AnalyticsRouteTracker.tsx` | ルート変更時の GA4 pageview |
| `components/EngagementTracker.tsx` | スクロール深度・滞在時間 |
| `components/switch/PageViewTracker.tsx` | LP pageview（lp_variant 付き） |
| `app/api/track/page-view/route.ts` | サーバーサイド pageview 計測 |
| `lib/engagement-tracking.ts` | engagement イベント定義 |

### 7-3. SEO 設定

| 項目 | 設定 |
|---|---|
| sitemap | `app/sitemap.ts`（動的生成・blog + area + static） |
| robots.txt | `public/robots.txt` |
| OGP / Twitter Card | `app/opengraph-image.tsx` + `public/og-image-v2.png`（2026-05-22 「SEKAI STAY 8% hero banner」に差替） |
| 構造化データ | JSON-LD (ProfessionalService) |
| Canonical | 自動付与 |
| note sitemap | `public/sitemap_note_articles.xml` |

### 7-4. SEO 監査

- `SEO_AUDIT_REPORT.md` に監査結果保存

---

## 8. コンテンツ管理

### 8-1. ブログ（59記事）

| 項目 | 設定 |
|---|---|
| 形式 | JSON（1ファイル 1 記事） |
| 配置 | `content/blog/*.json` |
| 読込 | `lib/blog.ts`（起動時） |
| ルーティング | `app/blog/[slug]/page.tsx` 動的 |
| 一覧コンポーネント | `components/blog/BlogGrid.tsx` |
| 戦略 | PR配信前に自社HP記事10本を5月中に蓄積（hp_article_strategy） |

### 8-2. エリア（20地域）

| 項目 | 設定 |
|---|---|
| データ | `lib/areas.ts` |
| 表示 | `app/area/[slug]/page.tsx` 動的 |
| 一覧 | `app/area/page.tsx` |

### 8-3. 導入事例（7件）

| 項目 | 設定 |
|---|---|
| データ | `lib/case-studies.ts` |
| 表示 | `app/case-studies/page.tsx` |

### 8-4. 診断・スコアリング

| 項目 | 場所 |
|---|---|
| 設問 | `data/questions.ts`（7ステップ・18問） |
| 結果コピー | `data/resultCopy.ts` |
| スコアリング | `lib/scoring.ts` |
| 表示 | `app/audit/page.tsx` → `app/result/page.tsx` |
| カスタムフォーム | `components/audit/AuditReportRequestForm.tsx` |

### 8-5. 物件検索

| 項目 | 場所 |
|---|---|
| API | `app/api/property-search/route.ts`（Brave Search連携） |
| 注意 | サジェスト経由のAirbnb URLは404になる可能性（airbnb_url_validation） |

---

## 9. 改善経緯（直近1.5ヶ月）

```
2026-05-14 ── サーチバーに「AirBnB」を明示
2026-05-15 ── 🎨 Phase B-1 Guesty着想 HP 改善
              → Hero に category eyebrow + 数字3つ + 軽CTA を統合
              → AuthorityBar を page.tsx から外す（数字は Hero に統合）
              → 事例カードを効果ファースト見出しに転換
              → NavCards を 3段ファンネル（軽/中/重）に置換
              → FinalCTA の text link を軽CTA「30秒試算」に統一
              → /services の9サービスを3バケット（集客/運営/開業成長）に整理
              → /services 縦割りカラム + クリックでモーダル表示
              → /services の Results case 写真・数字大きさ・縦揃え調整
              → /simulate を削除 → /services Chapter Ⅴ Clear Pricing に統合
              → /audit Step 02 を LP SwitchSimulator 同等の計算機に置換
              → Noto Sans JP の weight 300/600 を追加読み込み
              → Chapter◯ 表記を全面削除（refactor）

2026-05-17 ── /services 低コントラスト一括強化
              → Case№ をピル状バッジに変更
              → Airbnb/Booking ホスト評価を Portfolio 同様の dark band に
              → Case№ バッジと物件 spec を白系に
              → Airbnb/Booking 数字を 32px に拡大・水平ラベル+数字に
              → Header の半透明背景を不透明化、Clear Pricing 説明文を強化

2026-05-19 ── ✏️ 「その他の費用は一切なし」系の誤解を招く表現を削除（fix）

2026-05-20 ── 🔗 自社ドメイン短縮URL /go/<slug> 実装 + 全投稿URLを置換

2026-05-21 ── 🖼️ LP OG画像を新ブランディングサムネに差替

2026-05-22 ── 🖼️ OG画像を「SEKAI STAY 8% hero banner」に正式差替（v2でCDN cache bust）
              → switch FAQ: 6ヶ月以内解約に手数料発生する旨を明記
              → switch FAQ: 解約金後に「(最低契約期間 6ヶ月)」配置・末尾の※注釈削除
              → switch LP: 「業界でもっともシンプルな料金体系」→「シンプルな料金体系」
              → /home/FinalCTA: モバイルで見出し・CTAが横にはみ出る問題を修正
              → Leads: Slack 通知を 6 系統目の forward 経路として追加
              → Slack: フォーム送信通知を 10分遅延 + TimeRex予約済み抑制
              → Slack: TimeRex予約なしリードに離脱マーカー追加

2026-05-23 ── Slack: TimeRex投稿の判定を blocks/bot_profile まで拡張
              → Slack: TimeRex予約あり→スレッド返信、なし→既存通知

2026-05-27 ── lead-slack-delayed: 漢字↔かなで名前マッチ失敗するケースに時間窓フォールバック

2026-05-29 ── ROADMAP: Phase 2 (Meta CAPI) + Phase 3 (X Pixel) 実装済み項目を [x] 化
```

---

## 10. 既知の課題・未解決事項

| # | 課題 | 緊急度 | 詳細 |
|---|---|---|---|
| 1 | Meta Pixel 2つ並存 | 🟡 中 | `1658477098524563` と `989839370242915` のどちらに寄せるか統合判断要 |
| 2 | X Pixel 未取得 | 🟡 中 | `NEXT_PUBLIC_X_PIXEL_ID` env 未登録・X Ads CV最適化が機能しない |
| 3 | LP A/Bテストの勝者未確定 | 🟡 中 | 3 variants の CVR Z-score ≥ 1.96 達成判定要 |
| 4 | `/diagnostic` レガシー残置 | 🟢 低 | `/audit` に統合済みだがレガシー URL が残ってる |
| 5 | ブログ59記事の運用ペース | 🟡 中 | PR配信前に10本蓄積戦略あり・継続運用方針要確認 |
| 6 | 未使用 Switch components | 🟢 低 | SwitchBeforeAfter / SwitchFailurePatterns / SwitchSolution / SwitchTrustBar が現役 LP で未使用 |

---

## 11. すぐにやってほしいこと

### 🔴 Day 1（引き継ぎ当日）

- [ ] **Vercel アクセス権付与**（テンイチが org admin から ヨシトを sekaichi org に招待）
- [ ] **GitHub リポジトリアクセス権付与**（sekaichi-dev/sekaistay.com）
- [ ] **このドキュメント通読**
- [ ] **README.md / CLAUDE.md 通読**（`projects/sekaistay-com/`）
- [ ] **デザインガイド通読**（`SEKAI_STAY_Creative_Guide.md`）
- [ ] テンイチと 30分の引き継ぎMTG

### 🟡 Week 1（6/1〜6/7）

- [ ] **ローカル環境セットアップ**（`npm install && npm run dev`）
- [ ] **Vercel CLI で env 取得**（`vercel env pull .env.local`）
- [ ] **LP 3 variants の Hero を実機で確認**（PC + モバイル）
- [ ] **直近1.5ヶ月の改善経緯（§9）を理解**
- [ ] **第1回 週次振り返り**（金曜・LP CVR / 計測タグ動作確認 / 改善仮説）

### 🟢 Week 2-4（6/8〜6/30）

- [ ] **LP A/Bテスト勝者判定**（Z≥1.96 達成 variant の確定・敗者 archive 検討）
- [ ] **Meta Pixel 統合判断**
- [ ] **X Pixel 取得 + env 登録**
- [ ] **SEO 監査結果（`SEO_AUDIT_REPORT.md`）の対応**
- [ ] **6月実績で 7月の改善方針策定**

---

## 12. 主要コンタクト

| 名前 | 役割 | 連絡先 | いつ連絡するか |
|---|---|---|---|
| **吉田（事業責任者）** | SEKAI STAY 全体統括 | `hikaru@sekaichi.org` | 価格・契約条件の表示変更・ブランド方針 |
| **テンイチ（代表）** | プロダクト統括・LP実装・計測タグ | `tenichi@sekaichi.org` | LP構造変更・計測タグ追加・新規ドメイン |
| **Toyo（法務）** | 契約・法務 | — | 比較広告・最上級表現・受賞表記の審査 |
| **小川（営業）** | クロージング・CRM | `contact@sekaichi.org` | リード品質フィードバック |

組織図全体: `projects/sekai-stay-ops/data/info/org-chart.json`

---

## 13. 主要ドキュメント

| ファイル | 内容 |
|---|---|
| `README.md` | 技術スタック・ページ一覧・セットアップ・デザインシステム・SEO |
| `CLAUDE.md` | AI エージェント向け作業ガイド |
| `ROADMAP.md` | 広告運用ロードマップ |
| `SEKAI_STAY_Creative_Guide.md` | ブランドガイドライン |
| `IMAGES_MANIFEST.md` | 画像アセット目録 |
| `SEO_AUDIT_REPORT.md` | SEO 監査結果 |
| `ad-ops/HANDOVER_YOSHITO_2026-05-31.md` | 広告運用引き継ぎ（姉妹資料） |
| `tailwind.config.js` | ブランドトークン |
| `next.config.js` | リダイレクト・画像最適化 |
| `vercel.json` | Vercel 設定（redirect・cron） |

---

## 14. 引き継ぎ完了の判定基準

以下が全て揃ったら引き継ぎ完了とする:

- [ ] ヨシトが Vercel + GitHub にアクセスできる
- [ ] ヨシトがローカルで `npm run dev` を起動できる
- [ ] ヨシトがこのドキュメント + README + CLAUDE.md + Creative Guide を通読済み
- [ ] テンイチとの引き継ぎMTGを実施
- [ ] 引き継ぎ後 2週間以内に、ヨシトが独立して 1つ以上の LP/HP 改善（コピー修正・装飾調整など）をデプロイ
- [ ] LP A/Bテスト勝者判定の運用フローを理解

完了後、ヨシトは LP/HP の日常運用を担当、構造変更時はテンイチに相談、価格・契約条件は吉田と合意、という運用に移行する。

---

*このドキュメントは 2026-05-31 時点のスナップショット。引き継ぎ完了後はヨシトが必要に応じて更新する。*
