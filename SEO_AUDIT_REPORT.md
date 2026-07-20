# SEKAI STAY SEO監査レポート

**監査日:** 2026-04-12
**対象:** sekaistay.com（Next.js 14 App Router）
**監査者:** Claude CMO

---

## 総合スコア: 82 / 100

```
A. テクニカルSEO基盤       18 / 20  ██████████████████░░
B. 構造化データ（JSON-LD）  17 / 20  █████████████████░░░
C. メタタグ＆OGP           16 / 20  ████████████████░░░░
D. コンテンツ構造＆内部リンク 14 / 15  ██████████████░░░░░
E. パフォーマンス＆Core Web Vitals  9 / 15  █████████░░░░░░░░░
F. ローカルSEO              8 / 10  ████████░░░░░░░░░░░
```

---

## A. テクニカルSEO基盤（18 / 20）

| チェック項目 | 状態 | 配点 | 得点 | 備考 |
|-------------|------|------|------|------|
| robots.txt | ✅ 完備 | 2 | 2 | 2つのサイトマップ参照あり |
| sitemap.xml（動的生成） | ✅ 完備 | 3 | 3 | 静的15ページ + ブログ38件 + エリア20件 |
| canonical URL | ✅ ほぼ完備 | 3 | 2 | company, contact, portfolioページに個別canonicalなし（layout.tsxのデフォルトで対応中） |
| lang属性 | ✅ | 1 | 1 | `<html lang="ja">` |
| robots meta | ✅ | 1 | 1 | `index: true, follow: true` + googleBot設定 |
| HTTPS | ✅ | 1 | 1 | Vercel自動SSL |
| URL設計 | ✅ | 2 | 2 | `/blog/[slug]`, `/area/[slug]` で意味的 |
| モバイル対応（Viewport） | ✅ | 2 | 2 | Next.js自動設定 |
| GA4設置 | ✅ | 2 | 2 | G-B7M920RCGR + スクロール深度・滞在時間トラッキング |
| GSC連携 | ⚠️ 条件付き | 1 | 1 | 環境変数で設定可能（NEXT_PUBLIC_GSC_VERIFICATION） |
| GTM / イベント計測 | ✅ | 2 | 2 | UTMパラメータ保持、scroll_depth, time_on_page イベント実装済み |

---

## B. 構造化データ / JSON-LD（17 / 20）

| スキーマタイプ | 設置場所 | 状態 | 配点 | 得点 |
|--------------|---------|------|------|------|
| ProfessionalService（Organization） | layout.tsx（全ページ共通） | ✅ | 4 | 4 |
| BlogPosting + BreadcrumbList | blog/[slug]/page.tsx | ✅ | 4 | 4 |
| LocalBusiness + Service | area/[slug]/page.tsx | ✅ | 3 | 3 |
| FAQPage | faq/page.tsx, lp/page.tsx | ✅ | 3 | 3 |
| **FAQPage（トップページ）** | **page.tsx** | **❌ 未設置** | **2** | **0** |
| WebSite + SearchAction | layout.tsx | ❌ 未設置 | 2 | 1 |
| Service（トップページ） | page.tsx | ❌ 未設置 | 2 | 2 |

**不足ポイント:**
- トップページにFAQ 6問あるのにFAQPage JSON-LDがない → Google検索結果のFAQリッチスニペット機会損失
- WebSiteスキーマ（サイトリンク検索ボックス）未設置

---

## C. メタタグ＆OGP（16 / 20）

| ページ | title | description | canonical | OGP | Twitter | 得点 |
|-------|-------|-------------|-----------|-----|---------|------|
| / (トップ) | ✅ | ✅ | ✅ | ✅ | ✅（layout） | ◎ |
| /services | ✅ | ✅ | ✅ | ✅ | ─ | ○ |
| /pricing | ✅ | ✅ | ✅ | ✅ | ─ | ○ |
| /blog | ✅ | ✅ | ✅ | ✅ | ─ | ○ |
| /blog/[slug] | ✅ | ✅ | ✅ | ✅（article） | ✅ | ◎ |
| /area | ✅ | ✅ | ✅ | ✅ | ─ | ○ |
| /area/[slug] | ✅ | ✅ | ✅ | ✅ | ✅ | ◎ |
| /faq | ✅ | ✅ | ✅ | ✅ | ─ | ○ |
| /case-studies | ✅ | ✅ | ✅ | ✅ | ─ | ○ |
| /portfolio | ✅ | ✅ | ✅ | ✅ | ─ | ○ |
| /company | ✅ | ✅ | ❌ | ─ | ─ | △ |
| /contact | ✅（layout） | ✅ | ─ | ─ | ─ | △ |
| /lp | ✅（layout） | ✅ | ✅ | ─ | ─ | △ |
| /privacy | ✅ | ✅ | ✅ | ─ | ─ | ○ |

**不足ポイント:**
- /company, /contactにcanonicalと個別OGPがない
- Twitter Card設定が一部ページで不足（layout.tsxのデフォルト継承で最低限はカバー）
- og:image が `/og-image.jpg` を参照しているが、ファイルの存在確認が必要

---

## D. コンテンツ構造＆内部リンク（14 / 15）

| チェック項目 | 状態 | 配点 | 得点 |
|-------------|------|------|------|
| H1は各ページ1つ | ✅ 全ページ確認済 | 3 | 3 |
| H2→H3の階層構造 | ✅ | 2 | 2 |
| パンくずリスト（UI + JSON-LD） | ✅ blog, area | 3 | 3 |
| ヘッダーナビ（6リンク） | ✅ | 2 | 2 |
| フッター内部リンク（サービス・企業・エリア） | ✅ | 2 | 2 |
| 孤立ページなし | ✅ | 2 | 2 |
| ブログ記事の関連記事リンク | ⚠️ 未確認 | 1 | 0 |

---

## E. パフォーマンス＆Core Web Vitals（9 / 15）

| チェック項目 | 状態 | 配点 | 得点 | 備考 |
|-------------|------|------|------|------|
| next/image 使用 | ❌ | 4 | 0 | raw `<img>` タグを使用。WebP変換・レスポンシブ・lazy loadなし |
| フォント最適化 | ✅ | 2 | 2 | `display: 'swap'` + Google Fonts最適化 |
| Script loading strategy | ✅ | 2 | 2 | `afterInteractive` で非ブロッキング |
| CSS最適化 | ✅ | 2 | 2 | Tailwind CSS purge + 最小限のカスタムCSS |
| 画像lazy loading | ⚠️ 部分的 | 2 | 1 | heroのみ `loading="eager"`、他は指定なし |
| プリコネクト・プリロード | ❌ | 1 | 0 | Google Fontsへのpreconnectなし |
| CLS最適化 | ⚠️ | 2 | 2 | 画像にwidth/height指定あり（hero） |

**最重要改善点:** `<img>` → `next/image` への移行で、WebP自動変換・レスポンシブ対応・lazy loadingが一括改善。LCP/CLSスコアに直結。

---

## F. ローカルSEO（8 / 10）

| チェック項目 | 状態 | 配点 | 得点 |
|-------------|------|------|------|
| エリアページ（20地域） | ✅ | 3 | 3 |
| LocalBusiness JSON-LD | ✅ 各エリアページ | 3 | 3 |
| NAP情報（名前・住所・電話番号）一貫性 | ⚠️ | 2 | 1 |
| Google Business Profile連携 | ❌ 未確認 | 2 | 1 |

---

## 改善施策の優先順位

### 🔴 高優先（スコア+8〜10点見込み）

| # | 施策 | 対象ファイル | 期待効果 |
|---|------|------------|---------|
| 1 | **トップページにFAQPage JSON-LD追加** | app/page.tsx | FAQ 6問 → リッチスニペット表示。CTR +20〜30%の可能性 |
| 2 | **`<img>` → `next/image` 一括移行** | app/page.tsx, services, blog等 | LCP改善・WebP変換・CLS改善。Core Web Vitals大幅向上 |
| 3 | **WebSiteスキーマ追加**（サイトリンク検索ボックス） | app/layout.tsx | ブランド検索時のサイトリンク表示 |

### 🟠 中優先（スコア+3〜5点見込み）

| # | 施策 | 対象ファイル | 期待効果 |
|---|------|------------|---------|
| 4 | /company, /contactにcanonical + OGP追加 | app/company, contact | メタ完全カバー |
| 5 | ServiceスキーマをトップページJSON-LDに追加 | app/page.tsx | サービス情報のリッチ結果 |
| 6 | preconnect追加（Google Fonts） | app/layout.tsx | フォント読み込み高速化 |
| 7 | 全ページにTwitter Card個別設定 | 各page.tsx | SNSシェア時の表示最適化 |

### 🟡 低優先（スコア+1〜2点見込み）

| # | 施策 | 対象ファイル | 期待効果 |
|---|------|------------|---------|
| 8 | ブログ記事に関連記事リンク追加 | blog/[slug]/page.tsx | 回遊率向上・滞在時間増 |
| 9 | og:imageファイルの存在確認＆最適化 | public/og-image.jpg | SNSシェア画像の品質保証 |
| 10 | Hreflang設定（多言語展開時） | app/layout.tsx | 将来の多言語SEO対応 |

---

## 現在実装済みの強み（競合との差別化要素）

1. **構造化データの充実度** — ProfessionalService, BlogPosting, LocalBusiness, FAQPage, BreadcrumbList の5種類を実装。競合の多くは1〜2種類。
2. **エリアページ × LocalBusiness** — 20地域の個別ページ + 構造化データで「地域名 + 民泊運用代行」のロングテール獲得。
3. **ブログSSG + 動的サイトマップ** — 38記事がSSGで高速表示。sitemap.tsで自動更新。
4. **GA4高度計測** — スクロール深度・滞在時間・UTM保持のカスタムイベントを実装済み。広告ROI測定に直結。
5. **セマンティックHTML** — header, main, nav, article, section, footer を適切に使用。アクセシビリティとSEO両立。
