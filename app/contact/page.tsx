'use client'

import { useState, FormEvent } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import AuditLink from '@/components/audit/AuditLink'
import { resolveAttribution } from '@/lib/attribution'
import { isValidReferralCodeFormat, normalizeReferralCode } from '@/lib/referral-code'
import { fireYahooConversion } from '@/lib/yahoo-ads'
import { RevenueRangeSlider } from '@/components/RevenueRangeSlider'

const inputCls =
  'w-full rounded-md border border-rule bg-paper px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-ink/40 focus:border-sekai-teal'

/* 物件の状況（営業の対応分岐: 購入前=メール / 購入済・運用前=メール / 運用中=面談。2026-10-22 小川・テンイチ合意） */
type PropertyStatus = 'none' | 'purchased' | 'operating'
const PROPERTY_STATUS: { value: PropertyStatus; label: string; note: string }[] = [
  { value: 'none', label: 'まだ購入していない', note: 'これから物件を探す・購入を検討中' },
  { value: 'purchased', label: '購入済み・運用はこれから', note: '物件はあるが民泊はまだ始めていない' },
  { value: 'operating', label: 'すでに運用中', note: '自己運用または他社に委託して稼働中' },
]
const PURCHASE_TIMING = ['3ヶ月以内', '半年以内', '1年以内', '未定']
/* 運用中の月の売上（オフピーク〜ピーク）— LP のフォームと同じ刻み */
const REVENUE_MIN_MAN = 10
const REVENUE_MAX_MAN = 300
const formatMan = (man: number) => (man >= REVENUE_MAX_MAN ? `${REVENUE_MAX_MAN}万円以上` : `約${man}万円`)
const OPERATING_YEARS = ['1年未満', '1〜2年', '3〜5年', '5年以上']
const PLANNED_YEARS = ['1〜2年', '3〜5年', '5〜10年', '10年以上']
const TEXT_MAX = 600

/* 相談で話せること */
const TALK_POINTS = [
  { no: '01', title: '乗り換えの段取り', body: '今の会社との契約が残っていても大丈夫です。引き継ぎの進め方や、予約を止めずに移行する手順をご案内します。' },
  { no: '02', title: '物件の向き不向き', body: '立地・間取り・周辺需要から、民泊として伸びる物件かどうか。率直な見立てをお伝えします。' },
  { no: '03', title: '費用と収益の目安', body: '手数料8%＋月¥10,000を前提に、想定される売上と手取りのイメージを一緒に整理します。' },
]

/* 安心要素（売り込みなし） */
const ASSURANCES = [
  { title: '無理な勧誘はしません', body: 'こちらから営業のお電話をかけることはありません。検討の材料だけお渡しします。' },
  { title: '相談だけでも歓迎です', body: '契約を前提としたご相談である必要はありません。情報整理の壁打ちとしてお使いください。' },
  { title: '2営業日以内に返信', body: 'いただいた内容は担当が確認し、2営業日以内に個別でご返信します。' },
]

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState<PropertyStatus | ''>('')
  const [tenure, setTenure] = useState<'owned' | 'rented' | ''>('')
  const [revenue, setRevenue] = useState<{ low: number; high: number }>({ low: 30, high: 80 })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const phone = String(data.get('phone') || '').trim()
    const v = (k: string) => String(data.get(k) || '').trim()
    // 分岐ごとの回答は「課題・要望」欄 1 本にまとめて送る（Supabase / Slack / Discord / Sheets の経路を変えないため）
    const statusLabel = PROPERTY_STATUS.find((o) => o.value === status)?.label || ''
    const lines = [`【物件の状況】${statusLabel}`]
    if (status === 'none') {
      lines.push(`【購入予定時期】${v('purchaseTiming')}`, `【予算】${v('budget')}`, `【これからの計画】${v('plan')}`)
    } else {
      lines.push(
        `【住所】${v('address')}`,
        `【間取り】${v('layout')}`,
        `【広さ】${v('area')}㎡`,
        `【想定宿泊人数】${v('capacity')}名`,
        `【特殊な設備】${v('facilities')}`,
        `【賃貸/持ち家】${tenure === 'rented' ? `賃貸（家賃 ${v('rent')}）` : '持ち家'}`,
      )
      if (status === 'operating') lines.push(`【月の売上】オフピーク ${formatMan(revenue.low)} 〜 ピーク ${formatMan(revenue.high)}`)
      if (v('operatingYears')) lines.push(`【これまでの運用期間】${v('operatingYears')}`)
      if (v('plannedYears')) lines.push(`【運用予定年数】${v('plannedYears')}`)
      if (v('note')) lines.push(`【備考】${v('note')}`)
    }
    const message = lines.join('\n')
    // 紹介者コードとお名前は1項目に統合。コード形式(SS-XXXXXX)なら code、
    // それ以外はお名前として送信し、バックエンドの突合ロジックをそのまま維持する。
    const referrerInfo = String(data.get('referrerInfo') || '').trim()
    const normalizedCode = normalizeReferralCode(referrerInfo)
    const isReferrerCode = isValidReferralCodeFormat(normalizedCode)
    const referrerCode = isReferrerCode ? normalizedCode : ''
    const referrerName = isReferrerCode ? '' : referrerInfo

    try {
      // /api/report-requests/submit に統一 (2026-05-14)
      // 5系統 forward: Supabase / 吉蔵 / sales-portal / Meta CAPI / Sheets / Discord #sekai-stay
      const res = await fetch('/api/report-requests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          complaints: message,
          lpVariant: 'contact',
          formVariant: 'default',
          // 現 URL 優先 → 90 日クッキー (ss_attr) から復元 (旧 sessionStorage 方式はタブを閉じると消えるため置換 2026-07-08)
          ...resolveAttribution(),
          referrerCode: referrerCode || undefined,
          referrerName: referrerName || undefined,
        }),
      })
      if (res.ok) {
        setDone(true)
        if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', 'generate_lead', { event_category: 'contact', event_label: 'website_form', lp_variant: 'contact' })
        }
        if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
          const body = await res.json().catch(() => ({}))
          ;(window as any).fbq('track', 'Lead', { content_name: 'contact_form', lp_variant: 'contact' }, { eventID: body?.eventId })
        }
        // Yahoo!広告 コンバージョン（送信完了時点＝完了ページ相当）
        fireYahooConversion()
        document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      } else {
        const body = await res.json().catch(() => ({}))
        setError(body?.error || '送信に失敗しました。時間をおいて再度お試しください。')
      }
    } catch {
      setError('通信エラーが発生しました。時間をおいて再度お試しください。')
    }
    setSubmitting(false)
  }

  return (
    <>
      <Header />
      <FloatingCTA />
      <main className="bg-ivory">
        {/* CONTACT — お問い合わせ・ご相談 */}
        <section className="w-full bg-ivory pb-24 pt-28 sm:pb-32 sm:pt-36">
          <div className="mx-auto max-w-6xl px-6 sm:px-8">
            <h2 className="label-giant text-[clamp(2.5rem,6vw,4.375rem)] text-ink">CONTACT</h2>
            <p className="mt-2 text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold text-ink">お問い合わせ・ご相談</p>
            <p className="mt-10 max-w-2xl text-[15px] leading-[1.95] text-ink/75">
              売り込みや無理な営業は一切いたしません。「まだ検討中」「他社と比較したい」「自分の物件が向いているか知りたい」——そんな段階のご相談だけでも大歓迎です。どんな状態からでも、担当が一緒に状況を整理します。しつこい電話もありませんので、どうぞ安心してお問い合わせください。
            </p>
            <div className="mt-14 grid gap-10 sm:mt-16 md:grid-cols-3">
              {TALK_POINTS.map((p) => (
                <div key={p.no} className="border-t-2 border-sekai-teal pt-5">
                  <span className="font-grotesk block text-[2rem] font-bold leading-none text-sekai-teal">{p.no}</span>
                  <h3 className="mt-5 text-[1.25rem] font-bold leading-snug text-ink">{p.title}</h3>
                  <p className="mt-3 text-[14px] leading-[1.9] text-ink/70">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* フォーム */}
        <section id="contact-form" className="w-full bg-mist py-24 sm:py-32">
          <div className="mx-auto max-w-3xl px-6 sm:px-8">
            {done ? (
              <div className="rounded-lg border border-rule bg-paper p-8 text-center sm:p-12">
                <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-ink">送信が完了しました</h2>
                <p className="mt-5 text-[14px] leading-[1.95] text-ink/70">
                  お問い合わせいただきありがとうございます。<br />
                  {status === 'operating'
                    ? '担当よりご連絡のうえ、面談の日時をご相談します。'
                    : '2営業日以内に担当よりメールでご返信いたします。'}
                </p>
                <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                  <AuditLink
                    className="btn-cta group inline-flex min-h-[54px] items-center justify-center gap-2 rounded-md px-8 text-[15px] font-bold transition-all"
                  >
                    無料収益診断へ
                    <svg className="h-5 w-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </AuditLink>
                  <a
                    href="/services#pricing"
                    className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-md border border-rule px-8 text-[15px] font-bold text-sekai-teal transition-opacity hover:opacity-70"
                  >
                    料金を見る
                  </a>
                </div>
              </div>
            ) : (
              <>
                <h2 className="label-giant text-[clamp(2.5rem,6vw,4.375rem)] text-ink">FORM</h2>
                <p className="mt-2 text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold text-ink">お問い合わせフォーム</p>

                {error && (
                  <div className="mt-8 rounded-md border border-rule bg-paper px-4 py-3 text-[14px] text-ink">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-10 space-y-6 rounded-lg border border-rule bg-paper p-6 sm:p-10">
                  <Field label="お名前" required>
                    <input type="text" name="name" required className={inputCls} placeholder="山田 太郎" />
                  </Field>
                  <Field label="メールアドレス" required>
                    <input type="email" name="email" required className={inputCls} placeholder="example@email.com" />
                  </Field>
                  <Field label="電話番号">
                    <input type="tel" name="phone" className={inputCls} placeholder="090-1234-5678" />
                  </Field>

                  <Field label="すでに購入済み・運用中の物件はありますか？" required>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {PROPERTY_STATUS.map((o) => (
                        <label
                          key={o.value}
                          className={`cursor-pointer rounded-md border px-3 py-3 transition ${status === o.value ? 'border-sekai-teal bg-teal-tint' : 'border-rule bg-paper hover:border-ink/40'}`}
                        >
                          <input
                            type="radio"
                            name="propertyStatus"
                            value={o.value}
                            required
                            checked={status === o.value}
                            onChange={() => setStatus(o.value)}
                            className="sr-only"
                          />
                          <span className="block whitespace-nowrap text-[14px] font-bold text-ink">{o.label}</span>
                          <span className="mt-1 block text-[12px] leading-[1.6] text-ink/60">{o.note}</span>
                        </label>
                      ))}
                    </div>
                  </Field>

                  {status === 'none' && (
                    <>
                      <Field label="購入予定時期" required>
                        <select name="purchaseTiming" required defaultValue="" className={inputCls}>
                          <option value="" disabled>選択してください</option>
                          {PURCHASE_TIMING.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </Field>
                      <Field label="予算" required>
                        <input type="text" name="budget" required maxLength={60} className={inputCls} placeholder="例: 3,000万円" />
                      </Field>
                      <Field label="これからの計画" required>
                        <textarea name="plan" required rows={5} maxLength={TEXT_MAX} className={inputCls + ' resize-none'} placeholder="検討中のエリア・物件の種類・始めたい時期など" />
                      </Field>
                    </>
                  )}

                  {(status === 'purchased' || status === 'operating') && (
                    <>
                      <Field label="物件の住所" required>
                        <input type="text" name="address" required maxLength={200} className={inputCls} placeholder="例: 北海道虻田郡倶知安町〇〇" />
                      </Field>
                      <div className="grid gap-6 sm:grid-cols-3">
                        <Field label="間取り" required>
                          <input type="text" name="layout" required maxLength={60} className={inputCls} placeholder="例: 2LDK" />
                        </Field>
                        <Field label="広さ（㎡）" required>
                          <input type="number" name="area" required min={1} step="any" inputMode="decimal" className={inputCls} placeholder="例: 80" />
                        </Field>
                        <Field label="想定宿泊人数" required>
                          <input type="number" name="capacity" required min={1} inputMode="numeric" className={inputCls} placeholder="例: 6" />
                        </Field>
                      </div>
                      <Field label="特殊な設備" required>
                        <input type="text" name="facilities" required maxLength={120} className={inputCls} placeholder="例: サウナあり／なし" />
                      </Field>
                      <Field label="賃貸か持ち家か" required>
                        <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                          {([['owned', '持ち家'], ['rented', '賃貸']] as const).map(([val, label]) => (
                            <label key={val} className="flex cursor-pointer items-center gap-2 text-[15px] text-ink">
                              <input type="radio" name="tenure" value={val} required checked={tenure === val} onChange={() => setTenure(val)} className="h-4 w-4 accent-sekai-teal" />
                              {label}
                            </label>
                          ))}
                        </div>
                      </Field>
                      {tenure === 'rented' && (
                        <Field label="家賃（月額）" required>
                          <input type="text" name="rent" required maxLength={60} className={inputCls} placeholder="例: 15万円" />
                        </Field>
                      )}
                      {status === 'operating' && (
                        <Field label="月の売上の幅（オフピーク〜ピーク）" required>
                          <RevenueRangeSlider
                            min={REVENUE_MIN_MAN}
                            max={REVENUE_MAX_MAN}
                            step={10}
                            low={revenue.low}
                            high={revenue.high}
                            onChange={(low, high) => setRevenue({ low, high })}
                            format={formatMan}
                          />
                        </Field>
                      )}
                      <div className="grid gap-6 sm:grid-cols-2">
                        {status === 'operating' && (
                          <Field label="これまでの運用期間（任意）">
                            <select name="operatingYears" defaultValue="" className={inputCls}>
                              <option value="">選択してください</option>
                              {OPERATING_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                            </select>
                          </Field>
                        )}
                        <Field label="運用予定年数（任意）">
                          <select name="plannedYears" defaultValue="" className={inputCls}>
                            <option value="">選択してください</option>
                            {PLANNED_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                          </select>
                        </Field>
                      </div>
                      <Field label="備考（任意）">
                        <textarea name="note" rows={4} maxLength={TEXT_MAX} className={inputCls + ' resize-none'} placeholder="ご相談したいこと・現在の運用で困っていることなど" />
                      </Field>
                    </>
                  )}
                  <p className="font-sans text-caption text-mid-gray -mb-2">
                    SEKAI STAY の紹介者から紹介された方は、以下にご記入ください。
                  </p>
                  <Field label="紹介者コード または お名前（任意）">
                    <input type="text" name="referrerInfo" className={inputCls}
                      placeholder="紹介コード（SS-XXXXXX）または紹介者のお名前" />
                  </Field>

                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="group inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-md bg-navy px-8 text-[15px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-navy-hover disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {submitting ? '送信中...' : (
                        <>
                          送信する
                          <svg className="h-5 w-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </>
                      )}
                    </button>
                    <p className="text-center text-[12px] text-ink/50">
                      送信により<a href="/privacy" className="font-bold text-sekai-teal hover:underline">プライバシーポリシー</a>に同意したものとみなします
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </section>

        {/* 安心要素（売り込みなし） */}
        {!done && (
          <section className="w-full bg-navy py-24 text-white sm:py-32">
            <div className="mx-auto max-w-6xl px-6 sm:px-8">
              <h2 className="label-giant text-[clamp(2.5rem,6vw,4.375rem)] text-white">NO PUSH</h2>
              <p className="mt-2 text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold text-white">相談しても、売り込みはありません</p>
              <div className="mt-14 grid gap-x-8 gap-y-12 sm:mt-16 md:grid-cols-3">
                {ASSURANCES.map((a) => (
                  <div key={a.title} className="border-t border-white/20 pt-5">
                    <h3 className="text-[1.125rem] font-bold text-white">{a.title}</h3>
                    <p className="mt-3 text-[14px] leading-[1.9] text-white/75">{a.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-2 block text-[14px] font-bold text-ink">
        {label}
        {required && <span className="ml-1 text-sekai-teal">*</span>}
      </label>
      {children}
    </div>
  )
}
