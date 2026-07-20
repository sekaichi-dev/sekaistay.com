# Homepage Restructure (Phase A) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** sekaistay.com トップページを9セクション + Sticky CTA に再構成し、ペルソナ明示・密度低減・MidCTA挿入を実現する。

**Architecture:** 既存14セクションのうち6セクションを `app/page.tsx` から除去（ファイルは残置）。新規3コンポーネント（PainPoints / MidCTA / NavCards）を追加。Hero / AuthorityBar / FloatingCTA を改修。コンテンツは `content/home/copy.ts` に追加・改修。

**Tech Stack:** Next.js 14 (App Router) / TypeScript / Tailwind CSS / Vercel

**Spec:** [docs/superpowers/specs/2026-05-14-homepage-restructure-design.md](../specs/2026-05-14-homepage-restructure-design.md)

**Note:** プロジェクトにテストフレームワークは未導入。各タスクの検証は `npm run build` 通過 + `npm run dev` で視覚確認とする。テスト導入はスコープ外（YAGNI）。

---

## File Structure

### 新規作成
- `components/home/PainPoints.tsx` — 2ペルソナ並列セクション
- `components/home/MidCTA.tsx` — セクション間のCTAバンド
- `components/home/NavCards.tsx` — Dashboard/Pricing/FAQ への誘導カード行

### 改修
- `content/home/copy.ts` — `PAIN_POINTS` / `MID_CTA` / `NAV_CARDS` 追加、`AUTHORITY` を3項目に圧縮
- `components/home/Hero.tsx` — stats / サイドカード / セカンダリCTA / テキストリンク / ゴーストワードマーク削除
- `components/home/AuthorityBar.tsx` — 5項目→3項目、Credentials情報を末尾に統合
- `components/FloatingCTA.tsx` — 2CTA→1CTA（auditのみ）に簡略化
- `app/page.tsx` — セクション並び替え + 削除セクションの import 除去

### 残置（import除去のみ・ファイル削除しない）
- `components/home/EntryPoints.tsx`
- `components/home/ValueProp.tsx`
- `components/home/Dashboard.tsx`
- `components/home/Ecosystem.tsx`
- `components/home/Pricing.tsx`
- `components/home/Credentials.tsx`
- `components/home/FAQ.tsx`
- `components/home/FooterCatch.tsx`

---

## Task 1: コンテンツ追加（PAIN_POINTS / MID_CTA / NAV_CARDS / AUTHORITY圧縮）

**Files:**
- Modify: `content/home/copy.ts`

- [ ] **Step 1: `AUTHORITY` を3項目に圧縮**

`content/home/copy.ts` の `AUTHORITY` を以下に置換:

```typescript
// ═══ 1.5 Authority Bar — ヒーロー直下の信頼バッジ ═══
export const AUTHORITY = {
  label: 'Trusted Operation',
  items: [
    { metric: '5年+', label: '運用支援の実績' },
    { metric: '4.8', label: 'レビュー平均（管理物件）' },
    { metric: '国土交通大臣', label: '住宅宿泊管理業 (01)第F05780号' },
  ],
  note: '※ 数値は当社管理物件（Airbnb / Booking.com ほか主要OTA掲載）に基づく集計値／2024-2025。住宅宿泊事業法（民泊新法）・旅館業法いずれにも対応し、契約時に適用法令・許認可をご案内します。',
} as const
```

- [ ] **Step 2: `PAIN_POINTS` を追加**

`AUTHORITY` の下に以下を追加:

```typescript
// ═══ Pain Points — 2ペルソナ並列 ═══
export const PAIN_POINTS = {
  eyebrow: 'Owner Concerns',
  headline: {
    line1: '今の悩み、整理してみませんか。',
    line2: 'どちらの状況でも、同じところから始められます。',
  },
  body: '運用中の方も、これから始める方も。多くのオーナー様が、最初は同じところで止まります。',
  personas: [
    {
      id: 'existing',
      label: 'FOR EXISTING OWNERS',
      title: 'すでに運用中で、伸び悩みを感じている方',
      points: [
        '手数料が高い（業界平均15〜25%）',
        '稼働率が思うように伸びない',
        'OTA設定・価格調整が複雑で手が回らない',
        '今の運営会社の動きが見えない',
      ],
    },
    {
      id: 'starting',
      label: 'FOR NEW OWNERS',
      title: 'これから民泊を始めたい方',
      points: [
        '運営会社の選び方が分からない',
        '初期費用・許認可・備品で何が必要か読めない',
        '本業と両立できるか不安',
        '物件選定の判断軸が分からない',
      ],
    },
  ],
  bridge: 'どちらにも、同じ答え。まず物件診断から。',
} as const
```

- [ ] **Step 3: `MID_CTA` を追加**

続けて以下を追加:

```typescript
// ═══ Mid CTA — セクション間のCTAバンド ═══
export const MID_CTA = {
  headline: 'どちらの悩みも、まず物件診断から。',
  body: '現状採点と収益試算を、無料レポートでお返しします。営業連絡はありません。',
  cta: { label: '無料で物件診断を受ける', href: '/audit' },
  microcopy: '入力3分 · 無料 · 営業連絡なし',
} as const
```

- [ ] **Step 4: `NAV_CARDS` を追加**

続けて以下を追加:

```typescript
// ═══ Nav Cards — 詳細ページへの誘導カード行 ═══
export const NAV_CARDS = {
  eyebrow: 'Learn More',
  headline: '詳しく知りたい方へ。',
  body: '料金、ダッシュボード、よくあるご質問。気になる部分から確認できます。',
  cards: [
    {
      eyebrow: 'Dashboard',
      title: 'オーナーダッシュボード',
      body: '売上・稼働率・予約状況・改善ポイントを一画面で確認。',
      cta: { label: 'デモを見る', href: '/dashboard-demo' },
    },
    {
      eyebrow: 'Pricing',
      title: '料金体系',
      body: '8%手数料・固定費¥10,000/月・初期費用¥0・解約金¥0。',
      cta: { label: '料金を確認する', href: '/pricing' },
    },
    {
      eyebrow: 'FAQ',
      title: 'よくあるご質問',
      body: 'サービス内容・乗り換え・新規開業・料金についての疑問にお答えします。',
      cta: { label: '質問を確認する', href: '/faq' },
    },
  ],
} as const
```

- [ ] **Step 5: ビルド検証**

```bash
cd /Users/sekaichi/Desktop/claude-code/projects/sekaistay-com
npm run build
```

Expected: `✓ Compiled successfully` （型エラーなし）

- [ ] **Step 6: コミット**

```bash
git add content/home/copy.ts
git commit -m "feat(home): add PAIN_POINTS / MID_CTA / NAV_CARDS, compress AUTHORITY to 3 items

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: PainPoints コンポーネント作成

**Files:**
- Create: `components/home/PainPoints.tsx`

- [ ] **Step 1: コンポーネントを作成**

```tsx
import Link from 'next/link'
import { PAIN_POINTS, CTA_LINKS } from '@/content/home/copy'
import { JP } from '@/components/JP'
import { IconArrowRight } from '@/components/Icons'

export default function PainPoints() {
  return (
    <section className="bg-paper border-y border-rule">
      <div className="container-edit section-xl">
        {/* Header */}
        <div className="heading-mb">
          <div className="chapter-marker">
            <span className="rule-teal-sm" />
            <span className="eyebrow">{PAIN_POINTS.eyebrow}</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-end">
            <h2 className="heading-hero text-ink jp-keep">
              <JP>{PAIN_POINTS.headline.line1}</JP>
              <br />
              <span className="font-sans font-light text-sekai-teal">
                <JP>{PAIN_POINTS.headline.line2}</JP>
              </span>
            </h2>
            <p className="lead text-dark-gray jp-break">
              {PAIN_POINTS.body}
            </p>
          </div>
        </div>

        {/* 2-persona grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {PAIN_POINTS.personas.map((p) => (
            <article key={p.id} className="bg-ivory border border-rule p-8 md:p-10 flex flex-col">
              <p className="eyebrow-mono text-sekai-teal mb-5">{p.label}</p>
              <h3 className="font-sans font-medium text-[22px] md:text-[24px] text-ink mb-7 jp-keep leading-snug">
                <JP>{p.title}</JP>
              </h3>
              <ul className="space-y-4 flex-1">
                {p.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-3 text-body-sm text-dark-gray jp-break">
                    <span className="mt-2 w-1 h-1 rounded-full bg-sekai-teal flex-shrink-0" aria-hidden />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Bridge line */}
        <div className="text-center pt-8 border-t border-rule">
          <p className="font-sans font-light text-[22px] md:text-[26px] text-ink mb-6 jp-keep">
            <JP>{PAIN_POINTS.bridge}</JP>
          </p>
          <Link href={CTA_LINKS.audit} className="btn-link">
            無料で物件診断を受ける
            <IconArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: ビルド検証**

```bash
npm run build
```

Expected: 成功（ただし `app/page.tsx` から呼ばないと使われないので import 警告は出ない）

- [ ] **Step 3: コミット**

```bash
git add components/home/PainPoints.tsx
git commit -m "feat(home): add PainPoints component (dual-persona section)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: MidCTA コンポーネント作成

**Files:**
- Create: `components/home/MidCTA.tsx`

- [ ] **Step 1: コンポーネントを作成**

```tsx
import Link from 'next/link'
import { MID_CTA } from '@/content/home/copy'
import { JP } from '@/components/JP'
import { IconArrowRight } from '@/components/Icons'

export default function MidCTA() {
  return (
    <section className="relative text-ivory overflow-hidden bg-teal-ink">
      {/* Atmospheric glow */}
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(84,190,195,0.5) 0%, transparent 70%)' }}
      />

      <div className="relative container-edit py-16 md:py-20">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-center">
          <div>
            <h2 className="font-sans font-light text-[28px] md:text-[36px] lg:text-[40px] leading-[1.3] text-ivory mb-5 jp-keep">
              <JP>{MID_CTA.headline}</JP>
            </h2>
            <p className="text-body-lg text-ivory/80 jp-break max-w-[540px]">
              {MID_CTA.body}
            </p>
          </div>

          <div className="lg:justify-self-end flex flex-col items-start lg:items-end gap-3">
            <Link
              href={MID_CTA.cta.href}
              className="btn bg-ivory text-teal-ink hover:bg-bright-teal hover:text-ivory border-ivory inline-flex"
            >
              {MID_CTA.cta.label}
              <IconArrowRight size={14} />
            </Link>
            <p className="text-caption text-ivory/60">
              {MID_CTA.microcopy}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: ビルド検証**

```bash
npm run build
```

Expected: 成功

- [ ] **Step 3: コミット**

```bash
git add components/home/MidCTA.tsx
git commit -m "feat(home): add MidCTA component (between-section CTA band)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: NavCards コンポーネント作成

**Files:**
- Create: `components/home/NavCards.tsx`

- [ ] **Step 1: コンポーネントを作成**

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

        {/* 3 cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {NAV_CARDS.cards.map((c, idx) => (
            <Link
              key={idx}
              href={c.cta.href}
              className="group bg-paper border border-rule hover:border-ink p-8 md:p-10 flex flex-col transition"
            >
              <p className="eyebrow-mono text-sekai-teal mb-5">{c.eyebrow}</p>
              <h3 className="font-sans font-medium text-[22px] md:text-[24px] text-ink mb-4 jp-keep leading-snug">
                <JP>{c.title}</JP>
              </h3>
              <p className="text-body-sm text-dark-gray jp-break mb-8 flex-1">
                {c.body}
              </p>
              <span className="inline-flex items-center gap-2 text-[13px] text-ink group-hover:text-sekai-teal transition">
                {c.cta.label}
                <IconArrowRight size={12} className="group-hover:translate-x-1 transition" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: ビルド検証**

```bash
npm run build
```

Expected: 成功

- [ ] **Step 3: コミット**

```bash
git add components/home/NavCards.tsx
git commit -m "feat(home): add NavCards component (detail page navigation row)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Hero コンポーネント改修（スリム化）

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
        {/* Chapter label */}
        <div className="chapter-marker">
          <span className="rule-teal-sm" />
          <span className="eyebrow">Chapter Ⅰ · Vacation Rental Management</span>
        </div>

        <div className="hero-grid">
          {/* ── Left : headline + single CTA ── */}
          <div className="min-w-0 relative z-10 anim-fade-up">
            <h1 className="heading-display text-ink mb-10 jp-keep">
              <JP>{HERO.headline.line1}</JP>
              <br />
              <span className="font-sans font-light text-sekai-teal">
                <JP>{HERO.headline.line2}</JP>
              </span>
            </h1>

            <div className="rule-thin mb-8 max-w-[520px]" />

            <p className="lead mb-10 jp-break">
              {HERO.body}
            </p>

            {/* Single CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-4">
              <Link href={HERO.primaryCta.href} className="btn btn-primary group">
                {HERO.primaryCta.label}
                <IconArrowRight size={14} className="group-hover:translate-x-1 transition" />
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

**削除箇所**: 4数字stats / 「8% vs 業界15-25%」比較ブロック / セカンダリCTA / テキストリンク / サイドカード / 末尾ゴーストワードマーク。

- [ ] **Step 2: ビルド検証**

```bash
npm run build
```

Expected: 成功

- [ ] **Step 3: ローカル視覚確認**

```bash
npm run dev
```

ブラウザで `localhost:3000` を開き、Heroが「見出し + ボディ + CTA1個 + 画像のみ」になっていることを確認。モバイルサイズ（375px）でも崩れないこと。

- [ ] **Step 4: コミット**

```bash
git add components/home/Hero.tsx
git commit -m "feat(home): slim Hero — remove stats / side card / secondary CTA / fee block

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: AuthorityBar コンポーネント改修（3項目 + Credentials統合）

**Files:**
- Modify: `components/home/AuthorityBar.tsx`

- [ ] **Step 1: AuthorityBar.tsx 全体を以下に置換**

```tsx
import { AUTHORITY } from '@/content/home/copy'
import { JP } from '@/components/JP'

export default function AuthorityBar() {
  return (
    <section aria-label="信頼できる運営体制" className="bg-paper border-y border-rule">
      <div className="container-edit py-10 md:py-12">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
          {/* Label */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <span className="rule-teal-sm" />
            <span className="eyebrow">{AUTHORITY.label}</span>
          </div>

          {/* 3 Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-6 flex-1">
            {AUTHORITY.items.map((item) => (
              <div key={item.metric} className="flex flex-col min-w-0 relative pl-4 lg:pl-5">
                <span className="absolute left-0 top-1 bottom-1 w-px bg-rule" aria-hidden />
                <span className="font-sans text-[22px] md:text-[24px] font-light text-ink leading-none mb-2 jp-keep">
                  <JP>{item.metric}</JP>
                </span>
                <span className="text-[11.5px] text-dark-gray leading-snug jp-keep">
                  <JP>{item.label}</JP>
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 pt-6 border-t border-rule text-caption text-mid-gray leading-relaxed jp-break max-w-4xl">
          {AUTHORITY.note}
        </p>
      </div>
    </section>
  )
}
```

**変更点**: grid-cols-5 → grid-cols-3、AUTHORITY.items が3件に減るのに合わせる。

- [ ] **Step 2: ビルド検証**

```bash
npm run build
```

Expected: 成功

- [ ] **Step 3: コミット**

```bash
git add components/home/AuthorityBar.tsx
git commit -m "feat(home): compress AuthorityBar to 3 metrics with Credentials info

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: FloatingCTA 簡略化（2CTA → 1CTA）

**Files:**
- Modify: `components/FloatingCTA.tsx`

- [ ] **Step 1: FloatingCTA.tsx を以下に置換**

```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-40">
      <Link
        href="/audit"
        className="group bg-ink hover:bg-sekai-teal text-ivory border border-ink hover:border-sekai-teal transition-all px-5 py-3 flex items-center gap-3 shadow-lift"
      >
        <span className="eyebrow-mono text-bright-teal">Audit</span>
        <span className="text-[12.5px] font-medium tracking-wide">無料で物件診断を受ける</span>
      </Link>
    </div>
  )
}
```

**変更点**: 2リンクのうち「無料相談」を削除し、診断1本に。

- [ ] **Step 2: ビルド検証**

```bash
npm run build
```

Expected: 成功

- [ ] **Step 3: コミット**

```bash
git add components/FloatingCTA.tsx
git commit -m "feat(home): simplify FloatingCTA to single audit CTA

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: app/page.tsx のセクション並び替え

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: app/page.tsx 全体を以下に置換**

```tsx
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

/* ── Above-fold: static imports (critical path) ── */
import Hero from '@/components/home/Hero'
import AuthorityBar from '@/components/home/AuthorityBar'

/* ── Below-fold: dynamic imports (reduce initial JS bundle) ── */
const FloatingCTA = dynamic(() => import('@/components/FloatingCTA'), { ssr: false })
const Simulation = dynamic(() => import('@/components/home/Simulation'))
const PainPoints = dynamic(() => import('@/components/home/PainPoints'))
const MidCTA = dynamic(() => import('@/components/home/MidCTA'))
const Flow = dynamic(() => import('@/components/home/Flow'))
const Results = dynamic(() => import('@/components/home/Results'))
const NavCards = dynamic(() => import('@/components/home/NavCards'))
const FinalCTA = dynamic(() => import('@/components/home/FinalCTA'))

/* ─── SEO Meta ────────────────────────────────── */

export const metadata: Metadata = {
  title: 'SEKAI STAY | 民泊運営は、もう丸投げでいい。',
  description:
    'SEKAI STAYは、価格設計・OTA最適化・多言語対応・清掃・ゲスト対応まで一気通貫で支援する民泊運用代行サービス。運用中の物件の改善も、これから始める民泊の立ち上げも、まずは無料で物件の伸びしろを確認できます。',
  openGraph: {
    title: 'SEKAI STAY | 民泊運営は、もう丸投げでいい。',
    description:
      '運用中の物件の改善から、これから始める民泊の立ち上げまで。一気通貫で支援する民泊運用代行。',
    type: 'website',
    locale: 'ja_JP',
    url: 'https://sekaistay.com',
    siteName: 'SEKAI STAY',
  },
  alternates: { canonical: 'https://sekaistay.com' },
}

/* ─── Page ────────────────────────────────────── */

export default function Home() {
  return (
    <>
      <Header />
      <FloatingCTA />
      <main>
        <Hero />
        <AuthorityBar />
        <Simulation />
        <PainPoints />
        <MidCTA />
        <Flow />
        <Results />
        <NavCards />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
```

**変更点**:
- 削除した import: `EntryPoints`, `ValueProp`, `Dashboard`, `Ecosystem`, `Pricing`, `Credentials`, `FAQ`, `FooterCatch`
- 追加した import: `PainPoints`, `MidCTA`, `NavCards`
- セクション順: Hero → AuthorityBar → Simulation → PainPoints → MidCTA → Flow → Results → NavCards → FinalCTA（9セクション）

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
- 9セクションが上記の順で表示されること
- 削除セクション（ValueProp / Ecosystem / Pricing / Credentials / FAQ / Dashboard / EntryPoints / FooterCatch）が表示されないこと
- FloatingCTAが600px以上スクロールで表示されること（Audit のみ）
- モバイル幅（375px）/ タブレット幅（768px）/ PC幅（1280px）で崩れないこと
- 全リンク（/audit, /dashboard-demo, /pricing, /faq, /case-studies）が遷移すること

- [ ] **Step 4: コミット**

```bash
git add app/page.tsx
git commit -m "feat(home): restructure homepage to 9 sections with new flow

- Add: PainPoints / MidCTA / NavCards
- Remove imports: EntryPoints / ValueProp / Dashboard / Ecosystem / Pricing / Credentials / FAQ / FooterCatch
- Section order: Hero → AuthorityBar → Simulation → PainPoints → MidCTA → Flow → Results → NavCards → FinalCTA
- Component files for removed sections are kept on disk for rollback

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Vercel preview デプロイ

**Files:** なし（デプロイ操作）

- [ ] **Step 1: ブランチを push**

```bash
git push -u origin feat/homepage-restructure
```

Expected: Vercel が自動で preview デプロイをトリガー

- [ ] **Step 2: preview URL の取得**

```bash
vercel ls --limit 3
```

または GitHub PR の Vercel ボット通知から取得。

- [ ] **Step 3: preview URL を実機で確認**

スマホ・PCで preview URL を開き、Task 8 Step 3 と同じ確認項目を実機で再検証。

- [ ] **Step 4: ユーザーに preview URL を共有して承認待ち**

ユーザーへ「preview URL `<URL>` を確認してOKなら main マージします」と伝え、明示承認を待つ。

---

## Task 10: main マージ + 本番デプロイ

**Files:** なし（マージ操作）

**前提**: Task 9 でユーザー承認済み

- [ ] **Step 1: main をローカルに最新化**

```bash
git checkout main
git pull --rebase
```

- [ ] **Step 2: feat/homepage-restructure をマージ**

```bash
git merge --no-ff feat/homepage-restructure -m "Merge feat/homepage-restructure: トップページ9セクション再構成"
```

- [ ] **Step 3: main を push（本番デプロイトリガー）**

```bash
git push origin main
```

Expected: Vercel が本番デプロイをトリガー

- [ ] **Step 4: 本番デプロイ完了確認**

```bash
vercel ls --prod --limit 3
```

State が `Ready` になるまで確認。

- [ ] **Step 5: 本番URL を実機で確認**

`https://sekaistay.com` をスマホ・PCで開き、9セクション構成になっていることを最終確認。

- [ ] **Step 6: ブランチ後始末（必要なら）**

```bash
git push origin --delete feat/homepage-restructure
git branch -d feat/homepage-restructure
```

---

## Self-Review

**1. Spec coverage:**
- ✅ Task 1: AUTHORITY 3項目化 + PAIN_POINTS / MID_CTA / NAV_CARDS 追加
- ✅ Task 2-4: PainPoints / MidCTA / NavCards コンポーネント
- ✅ Task 5: Hero スリム化
- ✅ Task 6: AuthorityBar 3項目化
- ✅ Task 7: FloatingCTA 1CTA化
- ✅ Task 8: page.tsx 並び替え + 削除セクション import 除去
- ✅ Task 9-10: preview + 本番デプロイ
- ⚠️ Spec オープン課題「FooterCatch の完全削除 or FinalCTA統合」→ Task 8 で import 除去のみで処理（FinalCTA 改修は本Phase外、必要なら追加タスクで）。

**2. Placeholder scan:** TBD/TODO/「実装後で」なし。完成。

**3. Type consistency:**
- `PAIN_POINTS.bridge` / `PAIN_POINTS.personas[].label` / `MID_CTA.microcopy` / `NAV_CARDS.cards[].cta.href` などが全タスクで一致。
- `AUTHORITY.items` 3項目化が Task 1 と Task 6 で整合（grid-cols-5 → 3）。

**4. リスク確認:**
- 削除セクションのファイル本体は残しているので、`app/page.tsx` を1コミットで戻せばロールバック可能。
- SEO: metadata は維持。構造化データは Hero / AuthorityBar / Results に依存していないため影響なし（要 Task 9 でPreviewで実機検証）。
