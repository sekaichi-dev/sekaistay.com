# Phase B-1: Guesty 着想 HP 改善（P1 三項目） Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Guesty 分析仮説のうち P1 三項目（3.2 Hero 数字統合 / 3.4 効果ファースト見出し / 3.5 CTA 3段ファンネル化）を実装し、HP の訴求と意思決定設計を引き上げる。

**Architecture:** Phase A の 9セクション構成を維持したまま、Hero / Results / NavCards / FinalCTA の **コピー・レイアウト** を改修。AuthorityBar は数字が Hero に移行することで一時的に冗長化するため `app/page.tsx` から import を外す（ファイルは残置）。新規コンポーネント無し。

**Tech Stack:** Next.js 14 (App Router) / TypeScript / Tailwind CSS / Vercel

**Spec:** [docs/superpowers/specs/2026-05-15-guesty-inspired-hp-redesign-design.md](../specs/2026-05-15-guesty-inspired-hp-redesign-design.md)

**前提**: Phase A (`feat/homepage-restructure` ブランチ) が本実装の前提となる。同一ブランチ上で続けて実装するか、Phase A を main にマージしてから新ブランチ `feat/phase-b1-guesty-inspired` を切るかは実装時のユーザー判断。

**Note**: プロジェクトにテストフレームワークは未導入。各タスクの検証は `npm run build` 通過 + `npm run dev` で視覚確認とする。テスト導入はスコープ外（YAGNI）。

---

## File Structure

### 改修
- `content/home/copy.ts` — `HERO`（eyebrow + numbers 追加）/ `RESULTS.cases[]`（effectHeadline 追加）/ `NAV_CARDS`（3段ファンネル化）/ `CTA_LABELS`（軽CTA追加）
- `components/home/Hero.tsx` — eyebrow（カテゴリリーダー宣言）+ 数字3つ行 + 軽CTA テキストリンク 追加
- `components/home/Results.tsx` — 事例カードのヘッドラインを effectHeadline ベースに
- `components/home/NavCards.tsx` — 3段ファンネル（軽/中/重）カードに置換
- `components/home/FinalCTA.tsx` — primary（重）+ secondary（中）+ text link（軽）の3段
- `app/page.tsx` — `AuthorityBar` の import 削除（数字は Hero に統合）

### 残置（import 除去のみ・ファイル削除しない）
- `components/home/AuthorityBar.tsx` — Phase A 同様、ロールバック容易性のため残す

---

## 設計決定（Phase B-1 で確定する仮値）

スペックのオープン課題に対する Phase B-1 採用案:

| 項目 | 採用値 | 備考 |
|---|---|---|
| 3.2 Hero eyebrow（カテゴリリーダー宣言）| `THE LEADING VACATION RENTAL MANAGEMENT IN JAPAN` | 英語 eyebrow で editorial 感保持 |
| 3.2 Hero 数字3つ | `★4.8` / `+30%` / `国土交通大臣` | Phase A の AUTHORITY 3項目を流用 |
| 3.5 軽CTA 文言 | `30秒で年間損失額を試算` → `/services#pricing` | スペック記載のまま |
| 3.5 中CTA 文言 | `無料で物件診断を受ける` → `/audit` | 現行維持 |
| 3.5 重CTA 文言 | `個別相談を予約する` → `/contact` | /contact は timerex redirect 済（Phase A 修正）|
| 3.4 効果ファースト見出し例 | 「月商 +57% / 稼働率 1.4倍」（野尻湖）等 | 各 case の metrics から自動生成可能だが可読性のため手書き |

実装時にこれら以外の値を採用する場合は、コミット前にユーザー確認すること。

---

## Task 1: コンテンツ追加（CTA_LABELS / HERO eyebrow + numbers / RESULTS effectHeadline / NAV_CARDS 3段化）

**Files:**
- Modify: `content/home/copy.ts`

- [ ] **Step 1: `CTA_LABELS` に軽CTA を追加**

`content/home/copy.ts` の `CTA_LABELS` を以下に置換:

```typescript
// ═══ CTA ラベル統一（全ページで同じ言葉を使う） ═══
export const CTA_LABELS = {
  simulate: '収益シミュレーション',
  simulateAction: '収益をシミュレーションする',
  simulateLight: '30秒で年間損失額を試算',
  audit: '無料物件診断',
  auditAction: '無料で物件診断を受ける',
  contact: '無料相談',
  contactAction: '個別相談を予約する',
} as const
```

- [ ] **Step 2: `HERO` に eyebrow + numbers + lightCta を追加**

`content/home/copy.ts` の `HERO` を以下に置換:

```typescript
// ═══ 1. Hero ═══
export const HERO = {
  eyebrow: 'THE LEADING VACATION RENTAL MANAGEMENT IN JAPAN',
  headline: {
    line1: '民泊運営は、もう丸投げでいい。',
    line2: 'オーナーは、成果だけ見ればいい。',
  },
  body: '運用中の物件の改善から、これから始める民泊の立ち上げまで。SEKAI STAYは、価格設計・OTA最適化・多言語対応・清掃・ゲスト対応まで一気通貫で支援します。まずは無料で、あなたの物件の伸びしろを確認してください。',
  numbers: [
    { metric: '★4.8', label: 'レビュー平均（管理物件）' },
    { metric: '+30%', label: '平均稼働率の改善幅' },
    { metric: '国土交通大臣', label: '住宅宿泊管理業 (01)第F05780号' },
  ],
  primaryCta: { label: '無料で物件診断を受ける', href: '/audit' },
  lightCta: { label: '30秒で年間損失額を試算', href: '/services#pricing' },
  secondaryCta: { label: '無料相談を予約する', href: '/contact' },
  textLink: { label: 'まずは収益シミュレーションから', href: '/services#pricing' },
  sideCard: {
    title: 'まずは3分で、物件の伸びしろを確認',
    body: '現在のリスティング・売上・手数料をもとに、稼働率と収益の改善余地を算出。担当アナリストが個別レポートでお届けします。',
    cta: { label: '物件診断を始める', href: '/audit' },
  },
} as const
```

**変更点**: `eyebrow` 新規追加 / `numbers[]` 新規追加 / `lightCta` 新規追加 / `stats[]` は保持（後方互換）

- [ ] **Step 3: `RESULTS.cases[]` の各 case に `effectHeadline` を追加**

`content/home/copy.ts` の `RESULTS.cases` を以下に置換:

```typescript
  cases: [
    {
      effectHeadline: '月商 +57% / 稼働率 1.4倍',
      title: '野尻湖エリアの貸別荘',
      tag: 'リゾート物件',
      metrics: [
        { label: '稼働率', from: '58%', to: '82%', delta: '約1.4倍', percent: 82 },
        { label: '月間売上', from: '85万円', to: '134万円', delta: '+57%', percent: 89 },
      ],
      body: '写真と訴求、価格設計、見せ方を再設計し、稼働率と売上の両方を改善しました。',
    },
    {
      effectHeadline: '平均単価 +30% / レビュー +0.5',
      title: '京都エリアの宿泊物件',
      tag: '都市型・インバウンド',
      metrics: [
        { label: 'レビュー平均', from: '4.3', to: '4.8', delta: '+0.5', percent: 96 },
        { label: '平均単価', from: '¥18,500', to: '¥24,200', delta: '+30%', percent: 75 },
      ],
      body: '多言語対応やゲスト導線、体験価値の伝え方を調整し、予約率と満足度の改善につなげました。',
    },
    {
      effectHeadline: '初月稼働 68% / 一気通貫設計',
      title: '立ち上げ初期の新規物件',
      tag: '新規オープン支援',
      metrics: [
        { label: '開業〜初月稼働', from: '', to: '68%', delta: '初月から好調', percent: 68 },
        { label: '初期設計', from: '', to: '一気通貫', delta: 'OTA〜運用まで', percent: 100 },
      ],
      body: '物件の見せ方、OTA初期設計、運用導線の整備まで。スタート時点から取りこぼしの少ない体制を整えます。',
    },
  ],
```

**変更点**: 各 case に `effectHeadline` 追加（既存フィールドは変更なし）

- [ ] **Step 4: `NAV_CARDS` を 3段ファンネルカードに置換**

`content/home/copy.ts` の `NAV_CARDS` を以下に置換:

```typescript
// ═══ Nav Cards — 3段ファンネル誘導（軽/中/重） ═══
export const NAV_CARDS = {
  eyebrow: 'Choose Your Path',
  headline: '入口は、あなたのペースで。',
  body: '物件診断や個別相談まで、コミット度に合わせて段階的にご利用いただけます。',
  cards: [
    {
      step: '01',
      weight: '軽い入口',
      title: '30秒で年間損失額を試算',
      body: '現在の手数料・売上から、SEKAI STAY に切り替えると年間どれだけ手元に残るかを即時表示。営業連絡なし。',
      cta: { label: '計算機を使う', href: '/services#pricing' },
    },
    {
      step: '02',
      weight: '無料レポート',
      title: '無料で物件診断を受ける',
      body: '物件URL・運用状況をもとに、改善余地と収益シミュレーションを担当アナリストが個別レポートでお届け。',
      cta: { label: '診断を始める', href: '/audit' },
    },
    {
      step: '03',
      weight: '直接相談',
      title: '個別相談を予約する',
      body: '複数物件・新規開業・乗り換え検討中の方。担当者とオンラインで直接相談（30分）。',
      cta: { label: '相談枠を見る', href: '/contact' },
    },
  ],
} as const
```

**変更点**: 旧 Dashboard / Pricing / FAQ カードから、3段ファンネル（軽/中/重）カードに完全置換

- [ ] **Step 5: ビルド検証**

```bash
cd /Users/sekaichi/Desktop/claude-code/projects/sekaistay-com
npm run build
```

Expected: `✓ Compiled successfully`（コンポーネント側はまだ旧フィールド参照なので型エラーが出る可能性あり。型エラーが出たら次のタスクで解消する）

NOTE: 型エラーが出る場合、いったんスキップして Task 2-5 のコンポーネント側を実装後に再度 build する。

- [ ] **Step 6: コミット**

```bash
git add content/home/copy.ts
git commit -m "$(cat <<'EOF'
feat(home): Phase B-1 用コンテンツ追加 (Hero eyebrow/numbers, RESULTS effectHeadline, NAV_CARDS 3段化, CTA_LABELS 軽CTA)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Hero に eyebrow + 数字3つ + 軽CTA を統合

**Files:**
- Modify: `components/home/Hero.tsx`

- [ ] **Step 1: Hero.tsx 全体を以下に置換**

```tsx
import Link from 'next/link'
import Image from 'next/image'
import { HERO } from '@/content/home/copy'
import { IMG } from '@/content/home/images'
import { IconArrowRight } from '@/components/Icons'
import { JP } from '@/components/JP'

export default function Hero() {
  return (
    <section className="relative bg-ivory overflow-hidden">
      {/* Soft editorial wash */}
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-[640px] h-[640px] rounded-full opacity-60 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #E8F2F3 0%, transparent 70%)' }}
      />

      <div className="container-edit relative section-hero">
        {/* Eyebrow — category leader declaration */}
        <p className="eyebrow-mono text-sekai-teal mb-5">
          {HERO.eyebrow}
        </p>

        {/* Chapter label */}
        <div className="chapter-marker">
          <span className="rule-teal-sm" />
          <span className="eyebrow">Chapter Ⅰ · Vacation Rental Management</span>
        </div>

        <div className="hero-grid">
          {/* ── Left : headline + numbers + CTAs ── */}
          <div className="min-w-0 relative z-10 anim-fade-up">
            <h1 className="heading-display text-ink mb-8 jp-keep">
              <JP>{HERO.headline.line1}</JP>
              <br />
              <span className="font-sans font-light text-sekai-teal">
                <JP>{HERO.headline.line2}</JP>
              </span>
            </h1>

            <div className="rule-thin mb-8 max-w-[520px]" />

            <p className="lead mb-8 jp-break">
              {HERO.body}
            </p>

            {/* Numbers strip — 3 metrics integrated into Hero */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 mb-10 border-y border-rule py-6">
              {HERO.numbers.map((n) => (
                <div key={n.metric} className="flex flex-col min-w-0">
                  <span className="font-sans text-[18px] md:text-[22px] font-light text-ink leading-none mb-2 jp-keep">
                    <JP>{n.metric}</JP>
                  </span>
                  <span className="text-[10.5px] md:text-[11.5px] text-mid-gray leading-snug jp-keep">
                    <JP>{n.label}</JP>
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs — heavy primary + light text link */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-4">
              <Link href={HERO.primaryCta.href} className="btn btn-primary group">
                {HERO.primaryCta.label}
                <IconArrowRight size={14} className="group-hover:translate-x-1 transition" />
              </Link>
              <Link href={HERO.lightCta.href} className="btn-link group">
                {HERO.lightCta.label}
                <IconArrowRight size={12} className="group-hover:translate-x-1 transition" />
              </Link>
            </div>

            <p className="text-caption text-mid-gray">
              入力3分 · 無料 · 営業連絡なし
            </p>
          </div>

          {/* ── Right : editorial figure ── */}
          <div className="relative min-w-0 anim-fade-up" style={{ animationDelay: '0.15s' }}>
            <p className="eyebrow-mono text-mid-gray mb-4">
              Plate No.01 — Managed Property, Kyoto
            </p>

            <div className="figure-frame relative aspect-[4/5] w-full">
              <Image
                src={IMG.heroMain.src}
                alt={IMG.heroMain.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 530px"
                quality={80}
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(7,58,62,0) 45%, rgba(7,58,62,0.28) 100%)',
                }}
              />
              <div className="absolute top-5 left-5 right-5 flex justify-between items-start text-ivory">
                <p className="eyebrow-mono !text-[10px] tracking-[0.24em]">SEKAI STAY</p>
              </div>
              <div className="absolute bottom-6 left-6 right-6 text-ivory">
                <p className="font-sans text-[42px] leading-none font-light">★ 4.8</p>
                <p className="text-caption text-ivory/80 mt-2 tracking-wider uppercase">
                  Guest review · Airbnb / Booking.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

**変更点**:
- Eyebrow（カテゴリリーダー宣言）を最上部に追加
- 数字3つを Body と CTA の間に水平 grid で表示（grid-cols-3 / border-y 区切り）
- CTA を primary（重）+ light（軽）の2つに

- [ ] **Step 2: ビルド検証**

```bash
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: ローカル視覚確認**

```bash
npm run dev
```

ブラウザで `localhost:3000` を開き:
- Hero 最上部に英字 eyebrow が出る
- 既存の見出し2行が残ってる
- 数字3つ（★4.8 / +30% / 国土交通大臣）が水平に並ぶ
- 主CTA「無料で物件診断を受ける」+ 軽CTA「30秒で年間損失額を試算」が並ぶ
- モバイル幅（375px）で数字3つが縦積みではなく **3-cols のまま小さく** 表示される

- [ ] **Step 4: コミット**

```bash
git add components/home/Hero.tsx
git commit -m "$(cat <<'EOF'
feat(home): Hero に category eyebrow + 数字3つ + 軽CTA を統合

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: AuthorityBar を page.tsx から外す（数字は Hero に統合済）

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: AuthorityBar の import と JSX を削除**

`app/page.tsx` の中で AuthorityBar 関連の 2 箇所を削除:

```typescript
// 削除前: import 行（static imports 内）
import AuthorityBar from '@/components/home/AuthorityBar'

// 削除後: 削除（行ごと）
```

```tsx
// 削除前: main JSX
<Hero />
<AuthorityBar />
<Simulation />

// 削除後:
<Hero />
<Simulation />
```

- [ ] **Step 2: ビルド検証**

```bash
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: ローカル視覚確認**

`localhost:3000` で:
- Hero 直下に AuthorityBar が出ない（Hero の数字3つに統合）
- Simulation が Hero の直下に来る
- 残りの順序: Hero → Simulation → PainPoints → MidCTA → Flow → Results → NavCards → FinalCTA（8セクション）

- [ ] **Step 4: コミット**

```bash
git add app/page.tsx
git commit -m "$(cat <<'EOF'
feat(home): AuthorityBar を page.tsx から外す (数字は Hero に統合済)

- ファイル本体 components/home/AuthorityBar.tsx は残置（ロールバック余地）
- セクション順: 9 → 8 (Hero → Simulation → PainPoints → MidCTA → Flow → Results → NavCards → FinalCTA)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Results 事例カードを効果ファースト見出しに

**Files:**
- Modify: `components/home/Results.tsx`

- [ ] **Step 1: 事例カードの image overlay 部分を effectHeadline ベースに改修**

`components/home/Results.tsx` の `RESULTS.cases.map` ブロック内（line 70-127 周辺）の image overlay 部分を以下に置換:

`<div className="absolute bottom-5 left-5 right-5 text-ivory">` の中身を:

```tsx
                  <div className="absolute bottom-5 left-5 right-5 text-ivory">
                    <p className="font-sans font-medium text-[20px] md:text-[24px] leading-tight mb-2 tabular-nums">
                      {c.effectHeadline}
                    </p>
                    <h3 className="eyebrow-mono text-ivory/80 jp-keep leading-snug !text-[10.5px]">
                      <JP>{c.title}</JP> · {c.tag}
                    </h3>
                  </div>
```

**変更点**:
- `<h3>` が物件名タイトル → `<p>` で **効果ヘッドライン**（例: 「月商 +57% / 稼働率 1.4倍」）が最前面
- 物件名 + tag は eyebrow-mono の小さい subline に降格

- [ ] **Step 2: card 上部の "Case № 01" バッジから tag を削除**

同じく `RESULTS.cases.map` ブロック内の `absolute top-5` の部分を以下に置換:

```tsx
                  <div className="absolute top-5 left-5 right-5 flex items-center justify-between text-ivory">
                    <span className="font-sans text-[15px]">Case № {String(idx + 1).padStart(2, '0')}</span>
                  </div>
```

**変更点**: `<span className="eyebrow-mono text-ivory/80 !text-[10px]">{c.tag}</span>` を削除（tag は overlay 下部の subline で表示するため重複回避）

- [ ] **Step 3: ビルド検証**

```bash
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 4: ローカル視覚確認**

`localhost:3000` で Results セクションを確認:
- 各事例カードの画像下部に「月商 +57% / 稼働率 1.4倍」のような効果ヘッドラインが大きく表示
- 物件名（「野尻湖エリアの貸別荘」）は subline で小さく
- カード上部の「Case № 01」だけ残り、tag バッジは消える

- [ ] **Step 5: コミット**

```bash
git add components/home/Results.tsx
git commit -m "$(cat <<'EOF'
feat(home): 事例カードを効果ファースト見出しに転換

Guesty Customers の "150% revenue growth" 型を踏襲。物件名から効果数字を主役に。

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: NavCards を 3段ファンネル（軽/中/重）に置換

**Files:**
- Modify: `components/home/NavCards.tsx`

- [ ] **Step 1: NavCards.tsx 全体を以下に置換**

```tsx
import Link from 'next/link'
import { NAV_CARDS } from '@/content/home/copy'
import { JP } from '@/components/JP'
import { IconArrowRight } from '@/components/Icons'

export default function NavCards() {
  return (
    <section className="bg-ivory">
      <div className="container-edit section-xl">
        {/* Header */}
        <div className="heading-mb">
          <div className="chapter-marker">
            <span className="rule-teal-sm" />
            <span className="eyebrow">{NAV_CARDS.eyebrow}</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-end">
            <h2 className="heading-hero text-ink jp-keep">
              <JP>{NAV_CARDS.headline}</JP>
            </h2>
            <p className="lead text-dark-gray jp-break">
              {NAV_CARDS.body}
            </p>
          </div>
        </div>

        {/* 3-tier funnel cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {NAV_CARDS.cards.map((c, idx) => {
            const isPrimary = idx === 1
            return (
              <Link
                key={idx}
                href={c.cta.href}
                className={`group flex flex-col p-8 md:p-10 transition ${
                  isPrimary
                    ? 'bg-ink text-ivory border border-ink hover:bg-teal-ink'
                    : 'bg-paper border border-rule hover:border-ink'
                }`}
              >
                <div className="flex items-baseline gap-3 mb-5">
                  <span className={`font-sans font-light text-[28px] tabular-nums leading-none ${isPrimary ? 'text-bright-teal' : 'text-sekai-teal'}`}>
                    {c.step}
                  </span>
                  <span className={`eyebrow-mono ${isPrimary ? 'text-bright-teal' : 'text-sekai-teal'}`}>
                    {c.weight}
                  </span>
                </div>
                <h3 className={`font-sans font-medium text-[20px] md:text-[22px] mb-4 jp-keep leading-snug ${isPrimary ? 'text-ivory' : 'text-ink'}`}>
                  <JP>{c.title}</JP>
                </h3>
                <p className={`text-body-sm jp-break mb-8 flex-1 ${isPrimary ? 'text-ivory/70' : 'text-dark-gray'}`}>
                  {c.body}
                </p>
                <span className={`inline-flex items-center gap-2 text-[13px] transition ${isPrimary ? 'text-bright-teal group-hover:text-ivory' : 'text-ink group-hover:text-sekai-teal'}`}>
                  {c.cta.label}
                  <IconArrowRight size={12} className="group-hover:translate-x-1 transition" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

**変更点**:
- 各カードに `step` (`01`, `02`, `03`) と `weight` ラベルを表示
- **中央の中CTAカード**（idx === 1）だけ dark theme (bg-ink + text-ivory) で強調
- 両脇の軽/重カードは現状の paper bg-paper のまま
- リンク先は copy.ts の `NAV_CARDS.cards[].cta.href` から取得（軽: /services#pricing / 中: /audit / 重: /contact）

- [ ] **Step 2: ビルド検証**

```bash
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: ローカル視覚確認**

`localhost:3000` で NavCards セクションを確認:
- 3カードが横並び（モバイルで縦積み）
- 左: 軽カード（白背景・「30秒で年間損失額を試算」）
- 中央: **重要強調**の dark カード（黒背景・「無料で物件診断を受ける」）
- 右: 重カード（白背景・「個別相談を予約する」）
- 各カードに `01` / `02` / `03` の番号 + ラベル（軽い入口/無料レポート/直接相談）

- [ ] **Step 4: コミット**

```bash
git add components/home/NavCards.tsx
git commit -m "$(cat <<'EOF'
feat(home): NavCards を 3段ファンネル (軽/中/重) に置換

Guesty の self-serve + sales-led ハイブリッド型を SEKAI STAY 文脈に翻訳。
中CTAカード (audit) を dark theme で視覚優先。軽 (シミュレーター) と
重 (相談予約) を両脇に配置。

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: FinalCTA に軽CTA テキストリンクを追加

**Files:**
- Modify: `components/home/FinalCTA.tsx`

- [ ] **Step 1: 既存ファイルを読み確認**

```bash
cat /Users/sekaichi/Desktop/claude-code/projects/sekaistay-com/components/home/FinalCTA.tsx
```

現状の `textLink` 部分（既存）を以下のように軽CTA リンクに差し替える前提でコード位置を確認。

- [ ] **Step 2: `<Link href={FINAL_CTA.textLink.href}>` ブロックを軽CTA リンクに置換**

`components/home/FinalCTA.tsx` の以下の箇所:

```tsx
            <Link
              href={FINAL_CTA.textLink.href}
              className="inline-flex items-center gap-2 mt-8 font-sans text-[15px] text-ivory/80 hover:text-ivory border-b border-ivory/30 hover:border-ivory pb-1 transition"
            >
              {FINAL_CTA.textLink.label}
              <IconArrowRight size={12} />
            </Link>
```

を以下に置換:

```tsx
            <Link
              href="/services#pricing"
              className="inline-flex items-center gap-2 mt-8 font-sans text-[15px] text-ivory/80 hover:text-ivory border-b border-ivory/30 hover:border-ivory pb-1 transition"
            >
              30秒で年間損失額を試算する
              <IconArrowRight size={12} />
            </Link>
```

**変更点**: textLink ラベルを軽CTA「30秒で年間損失額を試算する」に統一（リンク先は既に /services#pricing なので変更不要）

NOTE: `FINAL_CTA.textLink.label` は他で使われていないので hardcode 化で問題なし。気になる場合は `content/home/copy.ts` の `FINAL_CTA.textLink.label` も同時に「30秒で年間損失額を試算する」に更新する（任意）。

- [ ] **Step 3: ビルド検証**

```bash
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 4: ローカル視覚確認**

`localhost:3000` で FinalCTA セクションを確認:
- 既存の primary（重・無料診断）+ secondary（中・無料相談）ボタンが残る
- text link 部分が「30秒で年間損失額を試算する」に変わっている

- [ ] **Step 5: コミット**

```bash
git add components/home/FinalCTA.tsx
git commit -m "$(cat <<'EOF'
feat(home): FinalCTA の text link を軽CTA (30秒試算) に統一

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Vercel preview デプロイ + ユーザー実機確認

**Files:** なし（デプロイ操作）

- [ ] **Step 1: ブランチを push**

```bash
git push origin <現在のブランチ名>
```

Expected: Vercel が自動で preview デプロイをトリガー

- [ ] **Step 2: preview URL の取得**

```bash
vercel ls 2>&1 | grep Preview | head -3
```

または `https://minpaku-audit-git-<branch-name>-sekaichi.vercel.app` のブランチエイリアス URL を使用。

- [ ] **Step 3: preview URL を実機で確認（チェック項目）**

スマホ・PCで preview URL を開き、以下を確認:
- [ ] Hero 最上部に英字 eyebrow（THE LEADING VACATION RENTAL MANAGEMENT IN JAPAN）
- [ ] Hero 内に数字3つの行（★4.8 / +30% / 国土交通大臣）
- [ ] Hero CTA が 主CTA + 軽CTA テキストリンクの2つ
- [ ] AuthorityBar が表示されない（Hero に統合済）
- [ ] Results 事例カードの**画像下に効果ヘッドライン**（例: 月商 +57% / 稼働率 1.4倍）が大きく表示、物件名は subline
- [ ] NavCards が 3 カード並び（軽い入口 / 無料レポート / 直接相談）
- [ ] NavCards 中央カードが dark theme で強調
- [ ] FinalCTA の text link が「30秒で年間損失額を試算する」
- [ ] モバイル幅（375px）で全要素が崩れない

- [ ] **Step 4: ユーザーに preview URL を共有して承認待ち**

ユーザーへ「preview URL `<URL>` を確認してOKなら main マージします」と伝え、明示承認を待つ。

NOTE: ここでユーザーがコピー修正を要求した場合は、`content/home/copy.ts` を再修正してコミット → 再 push → 再確認のループを回す。

---

## Task 8: main マージ + 本番デプロイ

**Files:** なし（マージ操作）

**前提**: Task 7 でユーザー承認済み

- [ ] **Step 1: main をローカルに最新化**

```bash
git checkout main
git pull --rebase
```

- [ ] **Step 2: ブランチをマージ**

```bash
git merge --no-ff <ブランチ名> -m "Merge <ブランチ名>: Phase B-1 Guesty 着想 HP 改善"
```

- [ ] **Step 3: main を push（本番デプロイトリガー）**

```bash
git push origin main
```

Expected: Vercel が本番デプロイをトリガー

- [ ] **Step 4: 本番デプロイ完了確認**

```bash
vercel ls 2>&1 | grep Production | head -3
```

State が `Ready` になるまで確認。

- [ ] **Step 5: 本番URL を実機で確認**

`https://sekaistay.com` をスマホ・PCで開き、Task 7 の確認項目を本番URL で最終確認。

- [ ] **Step 6: ブランチ後始末**

```bash
git push origin --delete <ブランチ名>
git branch -d <ブランチ名>
```

---

## Self-Review

**1. Spec coverage:**
- ✅ 3.2 Hero 数字統合 → Task 1 (HERO 定数追加) + Task 2 (Hero.tsx 改修) + Task 3 (AuthorityBar 外し)
- ✅ 3.4 効果ファースト見出し → Task 1 (RESULTS.cases に effectHeadline 追加) + Task 4 (Results.tsx 改修)
- ✅ 3.5 CTA 3段ファンネル → Task 1 (CTA_LABELS / NAV_CARDS 更新) + Task 5 (NavCards.tsx 改修) + Task 6 (FinalCTA 軽CTA リンク)
- ✅ Task 7-8: preview + 本番デプロイ
- スコープ外（P2: 3.1 PainPoints 3層化 / 3.3 機能 3バケット化）は Phase B-2 で扱う旨明示

**2. Placeholder scan:** TBD/TODO/「実装後で」なし。完成。

**3. Type consistency:**
- `HERO.eyebrow` / `HERO.numbers[]` / `HERO.lightCta` が Task 1 で定義され、Task 2 で参照される（一致）
- `RESULTS.cases[].effectHeadline` が Task 1 で追加され、Task 4 で参照される（一致）
- `NAV_CARDS.cards[].step` / `weight` / `cta` が Task 1 で定義され、Task 5 で参照される（一致）
- `CTA_LABELS.simulateLight` が Task 1 で追加されるが、現状の Hero.tsx は `HERO.lightCta.label` を直接参照（CTA_LABELS は将来の他ページ参照用ストック・問題なし）

**4. リスク確認:**
- AuthorityBar を外しても他ページでの使用なし（grep 推奨だが import は app/page.tsx のみ前提）
- SEO: metadata は変更なし。構造化データへの影響なし。
- ロールバック: AuthorityBar / NavCards 旧版（Dashboard/Pricing/FAQ）は import 経由なので、page.tsx と copy.ts を Phase A 時点に戻せば即座に戻せる。
