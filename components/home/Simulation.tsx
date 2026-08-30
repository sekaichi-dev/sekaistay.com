'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { SIMULATION } from '@/content/home/copy'
import { IconArrowRight, IconCheck } from '@/components/Icons'
import { JP } from '@/components/JP'

/* ─── Calculation constants ───────────────────────────────── */

type Area = 'tokyo' | 'kyoto' | 'osaka' | 'okinawa' | 'fukuoka' | 'other'
type PropertyType = 'house' | 'apartment' | 'villa'
type Status = 'running' | 'new'

const AREAS: { value: Area; label: string; mult: number }[] = [
  { value: 'tokyo',   label: '東京',       mult: 1.0  },
  { value: 'kyoto',   label: '京都',       mult: 1.1  },
  { value: 'osaka',   label: '大阪',       mult: 0.9  },
  { value: 'okinawa', label: '沖縄',       mult: 1.2  },
  { value: 'fukuoka', label: '福岡',       mult: 0.85 },
  { value: 'other',   label: 'その他',     mult: 0.75 },
]

const TYPES: { value: PropertyType; label: string; mult: number }[] = [
  { value: 'house',     label: '一戸建て', mult: 1.15 },
  { value: 'apartment', label: 'マンション', mult: 1.0  },
  { value: 'villa',     label: '貸別荘',   mult: 1.4  },
]

const BASE_PER_ROOM = 180_000

const ROOM_MULTS: Record<number, number> = {
  1: 1.0, 2: 1.8, 3: 2.5, 4: 3.1, 5: 3.6,
}

const STATUS_MULT: Record<Status, number> = { running: 1.0, new: 0.95 }

const LOW_SPREAD = 0.78
const HIGH_SPREAD = 1.22

const yen = (n: number) => '¥' + Math.round(n).toLocaleString('ja-JP')
const manYen = (n: number) => {
  const man = Math.round(n / 10_000)
  return `${man.toLocaleString('ja-JP')}`
}
const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())

export default function Simulation() {
  const [area, setArea] = useState<Area>('tokyo')
  const [propertyType, setPropertyType] = useState<PropertyType>('house')
  const [rooms, setRooms] = useState<number>(2)
  const [status, setStatus] = useState<Status>('running')
  const [revenueInput, setRevenueInput] = useState<string>('')
  const [email, setEmail] = useState<string>('')

  const result = useMemo(() => {
    const areaMult = AREAS.find(a => a.value === area)?.mult ?? 1
    const typeMult = TYPES.find(t => t.value === propertyType)?.mult ?? 1
    const roomMult = ROOM_MULTS[rooms] ?? 1
    const statusMult = STATUS_MULT[status]

    const base = BASE_PER_ROOM * roomMult * areaMult * typeMult * statusMult

    let low = base * LOW_SPREAD
    let high = base * HIGH_SPREAD

    const currentRev = revenueInput ? parseInt(revenueInput.replace(/[^\d]/g, ''), 10) || 0 : 0

    if (currentRev > 0) {
      low = Math.max(low, currentRev * 0.95)
      if (currentRev > high * 0.9) high = Math.max(high, currentRev * 1.25)
    }

    let improvement: number
    if (currentRev > 0) {
      improvement = Math.min(100, Math.max(0, Math.round(((high - currentRev) / currentRev) * 100)))
    } else {
      improvement = area === 'tokyo' || area === 'kyoto' || area === 'okinawa' ? 78 : 62
    }

    const scoreLabel = improvement >= 60 ? 'HIGH' : improvement >= 30 ? 'MEDIUM' : 'STABLE'

    const actions: { n: string; t: string }[] = []
    if (status === 'new') {
      actions.push({ n: 'Ⅰ', t: '物件ポジショニングの設計' })
      actions.push({ n: 'Ⅱ', t: '初期ギャラリー撮影と見せ方' })
      actions.push({ n: 'Ⅲ', t: 'OTA掲載＋初月プロモ設計' })
    } else {
      actions.push({ n: 'Ⅰ', t: '週末・連休の価格設計' })
      if (propertyType === 'villa') {
        actions.push({ n: 'Ⅱ', t: 'ファミリー／団体向け訴求強化' })
      } else {
        actions.push({ n: 'Ⅱ', t: 'ギャラリー写真の差し替え' })
      }
      if (area === 'tokyo' || area === 'kyoto' || area === 'osaka') {
        actions.push({ n: 'Ⅲ', t: '多言語リスティング強化' })
      } else {
        actions.push({ n: 'Ⅲ', t: 'レビュー獲得導線の最適化' })
      }
    }

    const CEILING = 2_000_000
    const lowPct = Math.min(95, Math.max(2, (low / CEILING) * 100))
    const highPct = Math.min(98, Math.max(lowPct + 4, (high / CEILING) * 100))

    return { low, high, lowPct, highPct, improvement, scoreLabel, actions, currentRev }
  }, [area, propertyType, rooms, status, revenueInput])

  const revenueDigits = revenueInput.replace(/[^\d]/g, '')
  const revenueDisplay = revenueDigits
    ? parseInt(revenueDigits, 10).toLocaleString('ja-JP')
    : ''

  const emailValid = email === '' || isValidEmail(email)

  const ctaHref = `${SIMULATION.cta.href}?area=${area}&type=${propertyType}&rooms=${rooms}&status=${status}${
    revenueDigits ? `&rev=${revenueDigits}` : ''
  }${email && emailValid ? `&email=${encodeURIComponent(email)}` : ''}`

  const inputBase =
    'appearance-none w-full bg-ivory border border-rule px-4 py-3.5 text-[13px] text-ink font-medium cursor-pointer hover:border-ink focus:border-sekai-teal focus:outline-none transition'

  return (
    <section className="relative bg-mist">
      <div className="container-edit section-xl">
        {/* Header */}
        <div className="heading-mb grid md:grid-cols-12 gap-8">
          <div className="md:col-span-7">
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <span className="eyebrow">Income Simulation</span>
            </div>
            <h2 className="heading-hero text-ink jp-keep">
              <JP>{SIMULATION.headline.line1}</JP>
              <br />
              <span className="font-sans font-light text-sekai-teal">
                <JP>{SIMULATION.headline.line2}</JP>
              </span>
            </h2>
          </div>
          <p className="md:col-span-5 text-body-sm text-dark-gray jp-break md:pb-2 md:pt-4">
            {SIMULATION.body}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-0 border border-rule bg-paper">
          {/* ── Form ── */}
          <div className="p-8 md:p-10 lg:border-r border-rule min-w-0">
            <div className="flex items-center justify-between mb-8 pb-5 border-b border-rule">
              <div>
                <p className="eyebrow-mono text-mid-gray mb-1">01 · Input</p>
                <p className="font-sans text-[17px] text-ink">{SIMULATION.formTitle}</p>
              </div>
              <span className="eyebrow-mono text-sekai-teal">Live</span>
            </div>

            <div className="space-y-6">
              {/* Area */}
              <label className="block">
                <span className="eyebrow-mono text-mid-gray mb-2 block">エリア</span>
                <div className="relative">
                  <select
                    value={area}
                    onChange={e => setArea(e.target.value as Area)}
                    className={`${inputBase} pr-9`}
                  >
                    {AREAS.map(a => (<option key={a.value} value={a.value}>{a.label}</option>))}
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="#4F4F4F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </label>

              {/* Type */}
              <div>
                <span className="eyebrow-mono text-mid-gray mb-2 block">物件タイプ</span>
                <div className="grid grid-cols-3 gap-0 border border-rule">
                  {TYPES.map(t => {
                    const selected = propertyType === t.value
                    return (
                      <button
                        type="button"
                        key={t.value}
                        onClick={() => setPropertyType(t.value)}
                        className={`text-center text-[12px] py-3 transition font-medium tracking-wider uppercase border-r border-rule last:border-r-0 ${
                          selected ? 'bg-ink text-ivory' : 'bg-ivory text-dark-gray hover:bg-bone'
                        }`}
                      >
                        {t.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label>
                  <span className="eyebrow-mono text-mid-gray mb-2 block">部屋数</span>
                  <div className="relative">
                    <select value={rooms} onChange={e => setRooms(parseInt(e.target.value, 10))} className={`${inputBase} pr-9`}>
                      {[1, 2, 3, 4, 5].map(n => (<option key={n} value={n}>{n === 5 ? '5+' : n}</option>))}
                    </select>
                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="#4F4F4F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </label>
                <label>
                  <span className="eyebrow-mono text-mid-gray mb-2 block">運営状況</span>
                  <div className="relative">
                    <select value={status} onChange={e => setStatus(e.target.value as Status)} className={`${inputBase} pr-9`}>
                      <option value="running">運用中</option>
                      <option value="new">立ち上げ前</option>
                    </select>
                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="#4F4F4F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </label>
              </div>

              <label className="block">
                <span className="eyebrow-mono text-mid-gray mb-2 block">
                  現在の月商 <span className="text-mid-gray/70 normal-case tracking-normal">（任意）</span>
                </span>
                <div className="flex items-center bg-ivory border border-rule px-4 py-3.5 text-[13px] focus-within:border-sekai-teal transition">
                  <span className="text-mid-gray mr-2 font-sans">¥</span>
                  <input type="text" inputMode="numeric" value={revenueDisplay} onChange={e => setRevenueInput(e.target.value)} placeholder="600,000" className="flex-1 bg-transparent outline-none text-ink font-medium" aria-label="現在の月商" />
                </div>
              </label>

              <label className="block">
                <span className="eyebrow-mono text-mid-gray mb-2 block">
                  メール <span className="text-mid-gray/70 normal-case tracking-normal">（結果送付用・任意）</span>
                </span>
                <div className={`flex items-center bg-ivory border px-4 py-3.5 text-[13px] transition ${emailValid ? 'border-rule focus-within:border-sekai-teal' : 'border-danger'}`}>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="flex-1 bg-transparent outline-none text-ink font-medium" aria-label="メール" />
                </div>
                {!emailValid && (<span className="block text-[11px] text-danger mt-1">メールアドレスの形式をご確認ください</span>)}
              </label>
            </div>

            <Link href={ctaHref} className="group mt-8 w-full btn btn-primary">
              詳しく試算する
              <IconArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </Link>
            <p className="text-caption text-mid-gray mt-3 text-center">
              上記の入力内容で詳細シミュレーションへ進みます
            </p>
          </div>

          {/* ── Live result — editorial invoice panel ── */}
          <div className="bg-teal-ink-edit text-ivory p-8 md:p-10 flex flex-col min-w-0 relative overflow-hidden">
            {/* Ghost wordmark */}
            <p
              aria-hidden
              className="absolute -bottom-6 -right-6 font-sans text-ivory/5 leading-none select-none pointer-events-none"
              style={{ fontSize: '10rem', fontWeight: 300 }}
            >
              ¥
            </p>

            <div className="relative flex items-center justify-between mb-8 pb-5 border-b border-ivory/15">
              <div>
                <p className="eyebrow-mono text-bright-teal mb-1">02 · Estimate</p>
                <p className="font-sans text-[17px] text-ivory">Live Revenue Projection</p>
              </div>
              <span className="text-[10px] font-mono text-ivory/70 border border-ivory/25 px-2.5 py-1 uppercase tracking-wider">
                {result.currentRev > 0 ? 'w/ baseline' : 'quick estimate'}
              </span>
            </div>

            {/* Range */}
            <div className="relative mb-8">
              <div className="eyebrow-mono text-ivory/60 mb-3">想定月商レンジ</div>
              <div className="flex items-baseline gap-3 mb-4 flex-wrap">
                <span className="font-sans font-light text-[clamp(2.5rem,6vw,3.75rem)] leading-none tabular-nums">
                  ¥{manYen(result.low)}
                </span>
                <span className="font-sans font-light text-[clamp(1.75rem,4vw,2.5rem)] text-ivory/70 leading-none">—</span>
                <span className="font-sans font-light text-[clamp(2.5rem,6vw,3.75rem)] leading-none tabular-nums">
                  ¥{manYen(result.high)}
                </span>
                <span className="eyebrow text-bright-teal ml-1">万円／月</span>
              </div>
              <div className="relative h-px bg-ivory/20 mt-6">
                <div className="absolute top-0 h-full bg-bright-teal transition-all duration-500" style={{ left: `${result.lowPct}%`, right: `${100 - result.highPct}%` }} />
                <div className="absolute -top-1 w-2 h-2 rotate-45 bg-bright-teal transition-all duration-500" style={{ left: `${result.lowPct}%`, transform: 'translateX(-50%) rotate(45deg)' }} />
                <div className="absolute -top-1 w-2 h-2 rotate-45 bg-bright-teal transition-all duration-500" style={{ left: `${result.highPct}%`, transform: 'translateX(-50%) rotate(45deg)' }} />
              </div>
              <div className="flex justify-between text-[10px] text-ivory/50 mt-2 font-mono tracking-[0.2em] uppercase">
                <span>¥0</span>
                <span>¥200万+</span>
              </div>
            </div>

            {result.currentRev > 0 && (
              <div className="relative grid grid-cols-2 gap-0 mb-6 border-t border-b border-ivory/15 py-4">
                <div className="pr-4 border-r border-ivory/15">
                  <div className="eyebrow-mono text-ivory/50 mb-1">現状月商</div>
                  <div className="font-sans text-[22px] font-light tabular-nums">{yen(result.currentRev)}</div>
                </div>
                <div className="pl-4">
                  <div className="eyebrow-mono text-bright-teal mb-1">上振れ余地</div>
                  <div className="font-sans text-[22px] font-light text-bright-teal tabular-nums">
                    +{yen(Math.max(0, result.high - result.currentRev))}
                  </div>
                </div>
              </div>
            )}

            <div className="relative mb-6 pb-6 border-b border-ivory/15">
              <div className="flex items-center justify-between mb-3">
                <span className="eyebrow-mono text-ivory/60">改善余地スコア</span>
                <span className="font-sans text-[14px] text-bright-teal">
                  {result.scoreLabel} · {result.improvement}%
                </span>
              </div>
              <div className="h-px bg-ivory/15 overflow-hidden">
                <div className="h-full bg-bright-teal transition-all duration-500" style={{ width: `${Math.max(8, result.improvement)}%` }} />
              </div>
            </div>

            <div className="relative mb-8">
              <div className="eyebrow-mono text-ivory/60 mb-4">優先して見直すべきポイント</div>
              <ul className="space-y-3">
                {result.actions.map(a => (
                  <li key={a.n} className="flex items-start gap-4 text-[13.5px]">
                    <span className="font-sans text-[15px] text-bright-teal mt-0 flex-shrink-0 w-4 tabular-nums">
                      {a.n}
                    </span>
                    <span className="flex-1 text-ivory/90 leading-relaxed">{a.t}</span>
                    <IconCheck size={12} color="#54BEC3" />
                  </li>
                ))}
              </ul>
            </div>

            <Link href={ctaHref} className="group relative mt-auto btn bg-ivory text-ink hover:bg-bright-teal hover:text-ivory border-ivory">
              {SIMULATION.cta.label}
              <IconArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
