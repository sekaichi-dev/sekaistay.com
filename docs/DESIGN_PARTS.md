# DESIGN_PARTS.md — sekaistay.com デザインパーツ目録（実装の単一起点）

> **このサイトを改修している間のルール**
> 1. デザイン改修・新規実装は、**必ず本ドキュメントのパーツから組む**（`components/ds/` のコンポーネント、または既存共有部品）。
> 2. 該当パーツが無い構成は、**最も近いベースパーツを1つ選び**、その派生ルールを本ドキュメントに追記してから実装する（勝手に新流儀を増やさない）。
> 3. 基準ページは **`/services`（app/services/page.tsx）**。各パーツの“正しい使い方”はここを参照。
> 4. 原則（世界観・トークン定義）は `docs/DESIGN.md` / `docs/CREATIVE_GUIDE.md` を上位参照。本書は「具体パーツの目録＋使い方」に徹する。

参考デザイン: **https://sense-trust.co.jp/**（top/business/company）を踏襲。色味のみ SEKAI STAY 独自（ティール/アイボリー）。

---

## 0. グローバル原則（厳守）

- **タイポ**: 和文＝Noto Sans JP（ゴシック・セリフは入れない＝確定）。英ラベル/数字＝`font-grotesk`（Space Grotesk）。巨大ENラベルは `.label-giant` ＋ `tracking-[-0.03em] leading-[0.85]`。
- **余白**: セクション縦は `.section-2xl`（PC≈152px）を基本、Heroは `.section-hero`。コンテナは `.container-edit`（max1180・流動パディング）。
- **配色（背景ゾーン・確定）**: 各セクション背景は次のいずれか。濃淡を交互に。
  - `bg-ivory`(#FBF9F4) / `bg-paper`(#FFFDF9＝白っぽい) / `bg-navy`(#167B81) / `bg-[#1F9CA2]`(明るいブルー) / `bg-navy-deep`(CTA帯)。
  - /services 確定並び: ivory → (OTA/SERVICES)navy → DASHBOARD #1F9CA2 → FLOW paper → PRICE ivory → SAVINGS paper → COMPARISON ivory → MORE navy → FAQ paper → CONTACT navy。
- **ガードレール**: 赤・オレンジ不使用／「AI」語をユーザー向けに使わない（「データに基づく」等）／最上級・断言NG（景表法）／極細枠線(border-white/15等)をタイル乱用しない／**ピクトグラムを多用しない（番号＋罫線＋タイポ主体）**。装飾だけの英字ラベル禁止。
- **モーション**（`prefers-reduced-motion` で無効化・各部品が対応済）:
  | 名称 | 部品 | 値 |
  |---|---|---|
  | スクロールせり上がり | `Reveal`(GSAP ScrollTrigger) | fade+y32 / stagger0.1 / dur0.65 / power2.out / start "top 85%" |
  | 行スライドアップ | `TextSlideUp` | 行マスク translateY 110%→0 / 0.75s / 見出し用 |
  | 巨大文字スクランブル | `ScrambleText`/`GhostWordmark` | 視界進入で1回・装飾(aria-hidden) |
  | 横マーキー無限 | `.marquee`(CSS) | 22s linear / -33.333% / 3周複製 |

---

## 1. components/ds/（実コンポーネント・これを import して組む）

### SectionHead — セクション見出し
巨大ENラベル → ヘアライン罫線 → 和文サブ →（任意）リード。`light` で濃色背景上の白文字。
```tsx
import SectionHead from '@/components/ds/SectionHead'
<SectionHead en="DASHBOARD" sub="運用のすべてが、見える" lead="…任意…" light />
// 和文巨大見出しにしたい時は enClass で縮小: enClass="text-[clamp(2rem,5vw,3.25rem)]"
```
Do: 全セクションの開幕に必ず使う。Don't: h2 を直書きしない。

### EditorialList — 番号＋罫線リスト（ORIGINAL SYSTEM型）
ピクトグラム無し。番号(01..)＋見出し＋本文＋右端メタ。`columns`(1|2)、`light`、`numClass`。
```tsx
import EditorialList from '@/components/ds/EditorialList'
<EditorialList light columns={2}
  items={FEATURES.map(f => ({ no: f.no, title: f.title, body: f.body, meta: f.effect }))} />
```
派生ルール: **明るいブルー(#1F9CA2)背景で番号を白にしたい場合**は、コントラストの都合で EditorialList を使わず同型の白番号インライン実装可（例: /services DASHBOARD の指標リスト）。

### CardGrid — 3連（/2連）画像カード（sense-trust BUSINESS OVERVIEW型）
画像(上・4:3・hover scale-110)＋任意バッジ(COMING SOON)＋タイトル＋任意リード/説明/ステータス。`columns`(2|3)。`Reveal stagger` 出現。**前面に画像を入れて緩急を出す主役パーツ**（事業カード/事例カード/記事カード等はこれで作る）。
```tsx
import CardGrid from '@/components/ds/CardGrid'
<CardGrid items={[
  { image:'/images/switch/property-cabin.jpg', alt:'開業支援', title:'民泊の開業支援', lead:'…', desc:'…', status:'提供中' },
  { image:'…', alt:'…', title:'…', lead:'…', desc:'…', badge:'COMING SOON', status:'2026年内 公開予定 — 乞うご期待' },
]} />
```
画像は**同一カットの使い回しを避ける**（実写 property-*.jpg ＋ 既知の有効 Unsplash を散らす）。

### OverviewCards — sense-trust「BUSINESS OVERVIEW」型 事業カード
番号＋タイトル（上）→ 画像4:3（中）→ リード/説明/ステータス（下）の塗りカード3カラム。濃色背景上で使う（カードは `bg-white/[0.04] ring-white/10`）。`soon` のカードは画像上に **COMING SOON 斜めマーキー帯**（`.marquee` 連続スクロール・bright-teal）を重ねて表示。`Reveal stagger` 出現。
```tsx
import OverviewCards from '@/components/ds/OverviewCards'
<OverviewCards items={[
  { no:'01', title:'…', lead:'…', desc:'…', image:'…', alt:'…', status:'提供中' },
  { no:'02', title:'…', lead:'…', desc:'…', image:'…', alt:'…', status:'2026年内 公開予定 — …', soon:true },
]} />
```
使用例: /services MORE（navy・補足3事業）。CardGrid（明色カード）と使い分け：濃色背景で番号付き事業一覧＝OverviewCards、明色背景の事例/記事カード＝CardGrid。

### SlideCarousel — 横スライドカルーセル（sense-trust ACHIEVEMENT型）
Splide（`@splidejs/react-splide`）の `type:'loop'`・固定幅カード（fixedWidth 300px／sm 230px）・gap・ドラッグ可・**矢印スライドボタン**（ティール丸・`.st-slide-carousel .splide__arrow` で装飾）・ページネーション無し。カード＝画像4:3 → 任意タグ（✓） → タイトル。**多数の要素を「横に流して見せる」**用途。
```tsx
import SlideCarousel from '@/components/ds/SlideCarousel'
<SlideCarousel ariaLabel="…" items={[{ image:'…', alt:'…', title:'…', tag:'標準で含まれる' }]} />
```
使用例: /pricing INCLUDED（基本料金に含まれる運用業務10件を横スライド）。

### NumberCards — 巨大番号のカードグリッド（番号主体・ピクトグラム不使用）
濃色背景（navy）上で使う。背面の巨大ゴースト番号＋前面の可視番号 → タイトル → 本文 → 下罫線＋効果値タグ。hover で浮上＋上辺アクセント線が伸びる。`columns`(3|4)。`Reveal stagger` 出現。**機能/サービスを一覧で“魅せる”ときの主役パーツ**（番号付き項目を画像なしで密度高く並べる用途。EditorialList の単調さを割る選択肢）。
```tsx
import NumberCards from '@/components/ds/NumberCards'
<NumberCards columns={4} items={[
  { no:'01', title:'…', body:'…', effect:'状況がひと目で' },
]} />
```
使用例: /services「8つのサービス」（navy・4列×2行）。

### EditorialRow — 全幅「画像＋テキスト」行（Info Card型）
常に明色カード（paper＋rule）。`reverse` で画像右。濃色セクション上で映える。
```tsx
import EditorialRow from '@/components/ds/EditorialRow'
<EditorialRow image="/images/switch/property-cabin.jpg" alt="開業支援" no="01"
  title="民泊の開業支援" lead="…" body="…" status="提供中" />
```

### CtaBand — 濃色CTA帯
```tsx
import CtaBand from '@/components/ds/CtaBand'
<CtaBand heading="まずは無料収益診断から" lead="…" primaryHref="/audit" primaryLabel="無料収益診断を受ける"
  secondaryHref="/contact" secondaryLabel="無料相談はこちら" note="住宅宿泊管理業 国土交通大臣 (01) 第F05780号" />
```

### GhostWordmark — 背面の巨大ゴースト英字（装飾）
親に `relative overflow-hidden` 必須。
```tsx
import GhostWordmark from '@/components/ds/GhostWordmark'
<GhostWordmark />            // 既定 "SEKAI STAY"
```

### OtaMarquee — 対応OTAロゴのマーキー帯（信頼要素）
```tsx
import OtaMarquee from '@/components/ds/OtaMarquee'
<OtaMarquee className="bg-navy" />
```

---

## 2. 既存の共有部品（ds 同様に再利用してよい）

- `@/components/home/SenseSections` → **ContactSense**（無料診断/相談の2分割・ページ末CTAの標準）, **OtaChips**（マーキー中身）。
- `@/components/motion/{Reveal,TextSlideUp,ScrambleText}` → モーション基盤。
- `@/components/{Header,Footer,FloatingCTA,Breadcrumb}` → グローバル。
- globals.css ボタン: `.btn .btn-primary / .btn-teal / .btn-ghost / .btn-link`。罫線: `.rule-thin/.rule-ink/.rule-teal`。

---

## 3. ページ固有の合成パーツ（現状の所在・将来 ds 化候補）

これらは「ベースパーツの合成」。流用時は所在を参照し、必要なら ds へ昇格してから使う。
- **Stepper（番号ノード＋接続線の横フロー）**: 現状 `/services` FLOW にインライン。→ 流用時 `components/ds/Stepper.tsx` に昇格。
- **StatGrid（実績数字 4枚）**: `components/home/SenseSections2` の `ResultsSense`。
- **Accordion（FAQ）**: `components/services/ServicesFaq.tsx`（paper/light版）。`components/pricing/PricingFaq.tsx`（deep版）。→ 共通化候補。
- **ComparisonTable（PC左右分割＋モバイルカード積み上げ）**: `/services` COMPARISON にインライン。
- **SavingsSimulator（節約額試算）**: `components/services/SavingsSimulator.tsx`。
- **DashboardDemo（実機UI）**: `components/switch/DashboardDemo.tsx`（製品UI・配色はそのまま）。

---

## 4. パーツの最小構成テンプレ（標準ページ）

```
<Header /> <FloatingCTA />
<section className="… bg-ivory section-hero relative overflow-hidden">  // Hero
  <GhostWordmark />
  <div className="container-edit"> <TextSlideUp as="h2" className="label-giant …">EN</TextSlideUp> …リード… </div>
</section>
<OtaMarquee className="bg-navy" />                       // 任意：信頼帯
<section className="bg-paper section-2xl"><div className="container-edit">
  <SectionHead en="…" sub="…" lead="…" />
  <EditorialList … /> or <EditorialRow … /> or 図表
</div></section>
… 濃淡交互で各セクション …
<ServicesFaq items={…} />                                 // FAQ（paper）
<ContactSense />                                          // 末尾CTA（navy・2分割）
<Footer />
```

---

## 5. 検証チェックリスト（各ページ実装後）
- :3004 を PC(1280/1440) と モバイル(375) で確認：横スクロール無し・重なり無し・見切れ無し。
- 円ピクトグラム不使用／赤・オレンジ無し／極細枠線の乱用無し。
- 見出しは SectionHead、列リストは EditorialList、画像行は EditorialRow、末尾は ContactSense／CtaBand で構成されているか。
- `preview_console_logs` エラー無し。`npx tsc --noEmit`（既存 @splidejs 警告以外なし）。
