'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { JP } from '@/components/JP'
import {
  IconArrowRight,
  IconStar,
  IconCheckCircle,
  IconAlert,
} from '@/components/Icons'

/* ─── Sample property data ──────────────────────────────────── */

type Property = {
  id: string
  name: string
  area: string
  type: string
  monthlyRevenue: number
  occupancy: number
  occupancyDelta: number
  reviewAvg: number
  reviewCount: number
  upcomingBookings: number
  series: { m: string; rev: number; occ: number; rating: number }[]
}

const PROPERTIES: Property[] = [
  {
    id: 'nojiri',
    name: '野尻湖ビュー貸別荘',
    area: '長野・野尻湖',
    type: '貸別荘 · 1棟貸し',
    monthlyRevenue: 1_340_000,
    occupancy: 82,
    occupancyDelta: 24,
    reviewAvg: 4.8,
    reviewCount: 184,
    upcomingBookings: 19,
    series: [
      { m: '11月', rev:  68, occ: 58, rating: 4.3 },
      { m: '12月', rev:  82, occ: 64, rating: 4.4 },
      { m: '1月',  rev:  91, occ: 70, rating: 4.5 },
      { m: '2月',  rev: 105, occ: 74, rating: 4.6 },
      { m: '3月',  rev: 118, occ: 79, rating: 4.7 },
      { m: '4月',  rev: 134, occ: 82, rating: 4.8 },
    ],
  },
  {
    id: 'kyoto',
    name: '京都・町家ステイ',
    area: '京都市東山区',
    type: '町家 · インバウンド',
    monthlyRevenue: 980_000,
    occupancy: 88,
    occupancyDelta: 12,
    reviewAvg: 4.9,
    reviewCount: 312,
    upcomingBookings: 27,
    series: [
      { m: '11月', rev:  62, occ: 76, rating: 4.6 },
      { m: '12月', rev:  68, occ: 80, rating: 4.7 },
      { m: '1月',  rev:  74, occ: 82, rating: 4.7 },
      { m: '2月',  rev:  81, occ: 84, rating: 4.8 },
      { m: '3月',  rev:  90, occ: 86, rating: 4.8 },
      { m: '4月',  rev:  98, occ: 88, rating: 4.9 },
    ],
  },
  {
    id: 'okinawa',
    name: '恩納村オーシャンヴィラ',
    area: '沖縄・恩納村',
    type: 'ヴィラ · リゾート',
    monthlyRevenue: 1_780_000,
    occupancy: 76,
    occupancyDelta: 18,
    reviewAvg: 4.7,
    reviewCount: 96,
    upcomingBookings: 14,
    series: [
      { m: '11月', rev:  92, occ: 58, rating: 4.4 },
      { m: '12月', rev: 108, occ: 62, rating: 4.5 },
      { m: '1月',  rev: 124, occ: 66, rating: 4.5 },
      { m: '2月',  rev: 142, occ: 70, rating: 4.6 },
      { m: '3月',  rev: 160, occ: 73, rating: 4.6 },
      { m: '4月',  rev: 178, occ: 76, rating: 4.7 },
    ],
  },
]

type Metric = 'rev' | 'occ' | 'rating'

const METRIC_META: Record<Metric, { label: string; unit: string }> = {
  rev:    { label: '売上', unit: '万円' },
  occ:    { label: '稼働率', unit: '%' },
  rating: { label: 'レビュー', unit: '/ 5' },
}

const ACTIONS = [
  { txt: '週末価格の見直し（+8%想定）',          tag: 'Priority', pri: 1 },
  { txt: 'ギャラリー写真2枚の差し替え',          tag: 'Medium',   pri: 2 },
  { txt: '多言語リスティング調整（英・繁・韓）', tag: 'Medium',   pri: 2 },
  { txt: 'チェックイン動線の動画化',             tag: 'Low',      pri: 3 },
]

const BOOKINGS = [
  { date: '4/18 (土)', guest: 'L. Anderson',  nights: 3, total: 84_000,  src: 'Airbnb',      country: 'US' },
  { date: '4/22 (水)', guest: 'Tan Wei Ling', nights: 2, total: 56_000,  src: 'Booking.com', country: 'SG' },
  { date: '4/25 (土)', guest: '山田 健太',    nights: 1, total: 28_000,  src: 'VRBO',        country: 'JP' },
  { date: '5/02 (土)', guest: 'Park Min-jun', nights: 4, total: 112_000, src: 'Airbnb',      country: 'KR' },
]

/* ─── Helpers ──────────────────────────────────────────────── */

const fmtMan = (rev: number) => '¥' + (rev / 10_000).toFixed(0)
const fmtFull = (n: number) => '¥' + n.toLocaleString('ja-JP')

/* ─── Page ─────────────────────────────────────────────────── */

export default function DashboardDemoPage() {
  const [selectedId, setSelectedId] = useState<string>(PROPERTIES[0].id)
  const [metric, setMetric] = useState<Metric>('rev')

  const property = useMemo(
    () => PROPERTIES.find(p => p.id === selectedId) ?? PROPERTIES[0],
    [selectedId],
  )

  const series = property.series
  const values = series.map(s => s[metric])
  const seriesMax = Math.max(...values)

  const heatmap = useMemo(() => {
    const base = property.occupancy / 100
    const cells: number[] = []
    for (let i = 0; i < 28; i++) {
      const isWeekend = i % 7 === 5 || i % 7 === 6
      const noise = ((i * 9301 + 49297) % 233280) / 233280
      let v = base * (isWeekend ? 1.15 : 0.85) + (noise - 0.5) * 0.25
      v = Math.max(0, Math.min(1, v))
      cells.push(v)
    }
    return cells
  }, [property])

  return (
    <>
      <Header />

      <main className="bg-ivory pb-20">
        {/* ─────────── Hero ─────────── */}
        <section className="bg-ink text-ivory relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-bright-teal/8 blur-3xl pointer-events-none"
          />
          <div
            aria-hidden
            className="absolute -bottom-40 -left-40 w-[420px] h-[420px] rounded-full bg-sekai-teal/8 blur-3xl pointer-events-none"
          />

          <div className="relative container-edit section-hero max-w-6xl mx-auto">
            <div className="chapter-marker">
              <span className="h-px w-10 bg-bright-teal" />
              <p className="eyebrow text-bright-teal">Owner Dashboard Demo</p>
            </div>
            <div className="hero-grid">
              <h1 className="heading-display jp-keep">
                <JP>物件の状態が、</JP>
                <span className="block text-bright-teal"><JP>一画面でわかる。</JP></span>
              </h1>
              <div className="md:text-right">
                <p className="eyebrow-mono text-ivory/60 mb-2">Demo · 2026 Spring</p>
                <p className="font-sans font-light text-[64px] md:text-[96px] text-bright-teal leading-none tabular-nums">
                  {String(PROPERTIES.length).padStart(2, '0')}
                </p>
                <p className="eyebrow-mono text-ivory/60 mt-1">Sample Properties</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-14 pt-10 border-t border-ivory/15">
              <p className="text-body text-ivory/85 leading-[2] jp-break">
                SEKAI STAYのオーナーダッシュボードは、売上・稼働率・予約・レビュー・改善アクションまで、物件の動きを一望できる設計。
              </p>
              <p className="text-body text-ivory/85 leading-[2] jp-break">
                下のサンプルは実データを匿名化したもの。物件を切り替えて、実際の使い心地を体験してください。
              </p>
            </div>
          </div>
        </section>

        {/* ─────────── Demo Surface ─────────── */}
        <section className="section-xl bg-paper border-b border-rule">
          <div className="container-edit px-5 md:px-8 max-w-6xl mx-auto">
            <div className="chapter-marker">
              <span className="eyebrow-mono text-mid-gray">§ 02</span>
              <span className="h-px bg-rule flex-1" />
              <p className="eyebrow text-sekai-teal">Live Preview</p>
            </div>

            {/* Property selector — editorial tag rail */}
            <div className="flex items-center gap-6 pb-4 border-b border-rule mb-8 overflow-x-auto">
              <p className="eyebrow-mono text-mid-gray whitespace-nowrap">Select Property</p>
              {PROPERTIES.map((p, i) => {
                const active = p.id === selectedId
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`relative group flex items-center gap-3 py-2 whitespace-nowrap transition ${
                      active ? 'text-sekai-teal' : 'text-mid-gray hover:text-ink'
                    }`}
                  >
                    <span className="eyebrow-mono">№ 0{i + 1}</span>
                    <span className="font-sans text-[13px]">{p.name}</span>
                    {active && (
                      <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-sekai-teal" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Dashboard frame */}
            <div className="bg-ivory border border-rule">
              {/* Window chrome */}
              <div className="flex items-center justify-between px-5 py-3 bg-paper border-b border-rule">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rule" />
                  <span className="w-2 h-2 rounded-full bg-rule" />
                  <span className="w-2 h-2 rounded-full bg-rule" />
                  <span className="ml-3 font-sans text-caption text-mid-gray truncate">
                    — owner.sekaistay.com / {property.area}
                  </span>
                </div>
                <span className="eyebrow-mono text-mid-gray hidden sm:inline flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sekai-teal animate-pulse" />
                  Live Preview
                </span>
              </div>

              <div className="p-6 md:p-10">
                {/* Property header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 pb-8 border-b border-rule">
                  <div>
                    <p className="eyebrow-mono text-mid-gray mb-2">{property.type}</p>
                    <h2 className="font-sans font-bold text-[28px] md:text-[36px] text-ink leading-[1.3] mb-2">
                      {property.name}
                    </h2>
                    <p className="font-sans text-caption text-mid-gray">— {property.area}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-2 bg-ink text-ivory font-sans text-[12px] px-3 py-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-bright-teal animate-pulse" />
                      運用中
                    </span>
                    <span className="eyebrow-mono text-mid-gray">Updated · 04/16 09:12</span>
                  </div>
                </div>

                {/* KPI Ledger */}
                <div className="bg-rule grid grid-cols-2 lg:grid-cols-4 gap-px border border-rule rounded-switch-lg overflow-hidden mb-10">
                  <KpiCell
                    label="Monthly Revenue"
                    valueDisplay={fmtMan(property.monthlyRevenue)}
                    valueSuffix="万"
                    delta="+18% MoM"
                    accent
                  />
                  <KpiCell
                    label="Occupancy"
                    valueDisplay={`${property.occupancy}`}
                    valueSuffix="%"
                    delta={`+${property.occupancyDelta}pt`}
                  />
                  <KpiCell
                    label="Review"
                    valueDisplay={`${property.reviewAvg}`}
                    valueSuffix=""
                    delta={`${property.reviewCount}件`}
                  />
                  <KpiCell
                    label="Next 30 Days"
                    valueDisplay={`${property.upcomingBookings}`}
                    valueSuffix="件"
                    delta="ペース順調"
                  />
                </div>

                {/* Chart + Heatmap */}
                <div className="grid lg:grid-cols-[1.4fr_1fr] gap-px bg-rule border border-rule rounded-switch-lg overflow-hidden mb-10">
                  {/* Chart panel */}
                  <div className="bg-paper p-6 md:p-7">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 pb-4 border-b border-rule">
                      <div>
                        <p className="eyebrow-mono text-mid-gray mb-1">Trend · 6 months</p>
                        <h3 className="font-sans font-medium text-[16px] text-ink">
                          {METRIC_META[metric].label}推移
                        </h3>
                      </div>
                      <div className="flex items-center gap-5">
                        {(Object.keys(METRIC_META) as Metric[]).map(m => {
                          const active = m === metric
                          return (
                            <button
                              key={m}
                              onClick={() => setMetric(m)}
                              className={`relative font-sans text-[12px] py-1 transition ${
                                active ? 'text-sekai-teal font-medium' : 'text-mid-gray hover:text-ink'
                              }`}
                            >
                              {METRIC_META[m].label}
                              {active && (
                                <span className="absolute -bottom-[5px] left-0 right-0 h-[2px] bg-sekai-teal" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Bar chart */}
                    <div className="flex items-end justify-between gap-2 h-36 mb-3">
                      {series.map((s, i) => {
                        const pct = (s[metric] / seriesMax) * 100
                        const isLast = i === series.length - 1
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full">
                            <div className="flex-1 w-full flex items-end relative group">
                              <div
                                className={`w-full transition-all duration-500 ease-out ${
                                  isLast ? 'bg-ink' : 'bg-sekai-teal'
                                }`}
                                style={{
                                  height: `${pct}%`,
                                  opacity: isLast ? 1 : 0.35 + i * 0.1,
                                }}
                              />
                              <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition pointer-events-none">
                                <span className="eyebrow-mono bg-ink text-ivory px-2 py-0.5 whitespace-nowrap">
                                  {s[metric].toFixed(metric === 'rating' ? 1 : 0)}{METRIC_META[metric].unit}
                                </span>
                              </div>
                            </div>
                            <span className="eyebrow-mono text-mid-gray leading-none">{s.m}</span>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex items-center justify-between eyebrow-mono text-mid-gray pt-3 border-t border-rule">
                      <span>Min {Math.min(...values).toFixed(metric === 'rating' ? 1 : 0)}{METRIC_META[metric].unit}</span>
                      <span>Max {seriesMax.toFixed(metric === 'rating' ? 1 : 0)}{METRIC_META[metric].unit}</span>
                    </div>
                  </div>

                  {/* Heatmap panel */}
                  <div className="bg-paper p-6 md:p-7">
                    <div className="pb-4 border-b border-rule mb-6">
                      <p className="eyebrow-mono text-mid-gray mb-1">Calendar · Next 4 weeks</p>
                      <h3 className="font-sans font-medium text-[16px] text-ink">予約の埋まり具合</h3>
                    </div>
                    <div className="grid grid-cols-7 gap-1.5 mb-3">
                      {['月', '火', '水', '木', '金', '土', '日'].map(d => (
                        <div key={d} className="eyebrow-mono text-center text-mid-gray">
                          {d}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1.5">
                      {heatmap.map((v, i) => (
                        <div
                          key={i}
                          className="aspect-square transition"
                          style={{
                            backgroundColor: `rgba(22, 123, 129, ${0.08 + v * 0.85})`,
                          }}
                          title={`${Math.round(v * 100)}%`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-5 eyebrow-mono text-mid-gray">
                      <span>Low</span>
                      <div className="flex gap-1 flex-1">
                        {[0.1, 0.3, 0.5, 0.7, 0.9].map(v => (
                          <div
                            key={v}
                            className="flex-1 h-[2px]"
                            style={{ backgroundColor: `rgba(22, 123, 129, ${0.08 + v * 0.85})` }}
                          />
                        ))}
                      </div>
                      <span>High</span>
                    </div>
                  </div>
                </div>

                {/* Bookings + Actions */}
                <div className="grid lg:grid-cols-2 gap-px bg-rule border border-rule rounded-switch-lg overflow-hidden">
                  {/* Upcoming bookings */}
                  <div className="bg-paper p-6 md:p-7">
                    <div className="flex items-center justify-between pb-4 border-b border-rule mb-5">
                      <div>
                        <p className="eyebrow-mono text-mid-gray mb-1">Upcoming</p>
                        <h3 className="font-sans font-medium text-[16px] text-ink">直近の予約</h3>
                      </div>
                    </div>
                    <div className="border-t border-rule divide-y divide-rule">
                      {BOOKINGS.map((b, i) => (
                        <div key={i} className="grid grid-cols-[auto_1fr_auto] gap-4 py-3 items-center">
                          <p className="eyebrow-mono text-mid-gray w-8">№ 0{i + 1}</p>
                          <div className="min-w-0">
                            <p className="font-sans font-medium text-[13px] text-ink truncate">
                              {b.guest}
                              <span className="ml-2 eyebrow-mono text-mid-gray">{b.country}</span>
                            </p>
                            <p className="eyebrow-mono text-mid-gray mt-0.5">
                              {b.date} · {b.nights}泊 · {b.src}
                            </p>
                          </div>
                          <span className="font-sans text-[18px] text-sekai-teal tabular-nums">
                            {fmtFull(b.total)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Improvement actions */}
                  <div className="bg-paper p-6 md:p-7">
                    <div className="flex items-center justify-between pb-4 border-b border-rule mb-5">
                      <div>
                        <p className="eyebrow-mono text-mid-gray mb-1">Recommended</p>
                        <h3 className="font-sans font-medium text-[16px] text-ink">改善アクション</h3>
                      </div>
                    </div>
                    <div className="border-t border-rule divide-y divide-rule">
                      {ACTIONS.map((a, i) => (
                        <div key={i} className="grid grid-cols-[auto_1fr_auto] gap-4 py-3 items-center">
                          <span className="w-6 flex items-center justify-center">
                            {a.pri === 1 ? (
                              <IconAlert size={14} className="text-sekai-teal" />
                            ) : (
                              <IconCheckCircle size={14} className="text-mid-gray" />
                            )}
                          </span>
                          <span className="font-sans text-[13px] text-dark-gray leading-snug">
                            {a.txt}
                          </span>
                          <span className={`eyebrow-mono ${
                            a.tag === 'Priority' ? 'text-sekai-teal' : 'text-mid-gray'
                          }`}>
                            — {a.tag}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="font-sans text-caption text-mid-gray text-center mt-6">
              — 上記は実運用画面を匿名化・簡略化したサンプルです。実際のダッシュボードはより詳細なデータを表示します。
            </p>
          </div>
        </section>

        {/* ─────────── Feature Strip ─────────── */}
        <section className="section-xl">
          <div className="container-edit px-5 md:px-8 max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <span className="rule-teal-sm" />
              <p className="eyebrow text-sekai-teal">Features</p>
            </div>
            <h2 className="heading-section text-ink mb-3">
              毎日見たくなる、<span className="font-sans text-sekai-teal">6つの機能。</span>
            </h2>
            <p className="font-sans text-body-sm md:text-[15px] text-dark-gray leading-[2] mb-14 max-w-xl">
              運用の裏側をガラス張りにする、オーナーダッシュボードの機能群。
            </p>

            <div className="bg-rule grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px border border-rule rounded-switch-lg overflow-hidden">
              {[
                { t: 'リアルタイム売上', d: '今月の売上・前月比・年間累計を、PC/スマホでいつでも確認。' },
                { t: '稼働率トラッキング', d: '日別・週別・月別の稼働状況を可視化。空室期間も一目で把握。' },
                { t: '予約カレンダー', d: '全OTAの予約を統合表示。ゲスト国籍・滞在日数まで把握できます。' },
                { t: 'レビュー集約', d: 'Airbnb / Booking / VRBO のレビューを横断的に確認。' },
                { t: '改善アクション', d: '運用チームが提案する改善施策を、優先度付きで提示。' },
                { t: 'エクスポート', d: 'リアルタイムの売上・予約データを、いつでも出力・ダウンロード可能。' },
              ].map((f, i) => (
                <div key={i} className="bg-paper p-7 md:p-8">
                  <p className="eyebrow-mono text-mid-gray mb-4">Feature № {String(i + 1).padStart(2, '0')}</p>
                  <h3 className="font-sans font-medium text-[18px] md:text-[20px] text-ink leading-snug mb-3">
                    {f.t}
                  </h3>
                  <p className="font-sans text-body-sm text-dark-gray leading-[1.95]">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────── CTA ─────────── */}
        <section className="section-xl">
          <div className="container-narrow px-5 md:px-8 max-w-4xl mx-auto">
            <div className="bg-ink text-ivory p-10 md:p-16 relative overflow-hidden">
              <div
                aria-hidden
                className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full bg-bright-teal/10 blur-3xl pointer-events-none"
              />
              <div className="relative">
                <div className="chapter-marker">
                  <span className="h-px w-10 bg-bright-teal" />
                  <p className="eyebrow text-bright-teal">Next Step</p>
                </div>
                <h2 className="font-sans font-bold text-[28px] md:text-[40px] leading-[1.3] mb-6">
                  あなたの物件も、
                  <span className="block font-sans text-bright-teal mt-1">この画面で見えるようになります。</span>
                </h2>
                <p className="font-sans text-body-sm md:text-[15px] text-ivory/80 leading-[2] mb-10 max-w-lg">
                  運用代行のお申し込みと同時に、オーナーダッシュボードのアカウントを発行します。まずはお気軽にご相談ください。
                </p>

                <div className="grid sm:grid-cols-2 gap-3 max-w-xl">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center justify-between gap-3 bg-ivory text-ink px-6 py-4 hover:bg-bright-teal transition"
                  >
                    <div>
                      <p className="eyebrow-mono text-mid-gray mb-0.5">Path A</p>
                      <p className="font-sans font-medium text-[14px]">無料で相談する</p>
                    </div>
                    <IconArrowRight size={14} className="group-hover:translate-x-1 transition" />
                  </Link>
                  <Link
                    href="/services#pricing"
                    className="group inline-flex items-center justify-between gap-3 border border-ivory/30 px-6 py-4 hover:bg-ivory/5 transition"
                  >
                    <div>
                      <p className="eyebrow-mono text-ivory/60 mb-0.5">Path B</p>
                      <p className="font-sans font-medium text-[14px] text-ivory">収益シミュレーション</p>
                    </div>
                    <IconArrowRight size={14} className="text-ivory group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

/* ─── KPI Cell ────────────────────────────────────────────── */
function KpiCell({
  label,
  valueDisplay,
  valueSuffix,
  delta,
  accent,
}: {
  label: string
  valueDisplay: string
  valueSuffix?: string
  delta?: string
  accent?: boolean
}) {
  return (
    <div className={`p-6 ${accent ? 'bg-ink text-ivory' : 'bg-paper'}`}>
      <p className={`eyebrow-mono mb-3 ${accent ? 'text-bright-teal' : 'text-mid-gray'}`}>
        {label}
      </p>
      <div className="flex items-baseline gap-1 mb-3">
        <span className={`font-sans font-light text-[32px] md:text-[40px] leading-none tabular-nums ${
          accent ? 'text-ivory' : 'text-ink'
        }`}>
          {valueDisplay}
        </span>
        {valueSuffix && (
          <span className={`font-sans text-[16px] ${accent ? 'text-ivory/70' : 'text-mid-gray'}`}>
            {valueSuffix}
          </span>
        )}
      </div>
      {delta && (
        <p className={`font-sans text-caption ${accent ? 'text-bright-teal' : 'text-sekai-teal'}`}>
          — {delta}
        </p>
      )}
    </div>
  )
}
