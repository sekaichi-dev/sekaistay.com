'use client'

import { useState, FormEvent } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import AuditLink from '@/components/audit/AuditLink'
import { resolveAttribution } from '@/lib/attribution'
import { isValidReferralCodeFormat, normalizeReferralCode } from '@/lib/referral-code'
import { fireYahooConversion } from '@/lib/yahoo-ads'

const inputCls =
  'w-full rounded-md border border-rule bg-paper px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-ink/40 focus:border-sekai-teal'

const MEETING_URL = 'https://timerex.net/s/sekai-stay/d61b424d'

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const phone = String(data.get('phone') || '').trim()
    const message = String(data.get('message') || '').trim()
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
        await new Promise((r) => setTimeout(r, 150))
        try {
          window.location.href = MEETING_URL
        } catch {
          window.location.href = MEETING_URL
        }
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
          <div className="mx-auto max-w-2xl px-6 sm:px-8">
            {done ? (
              <div className="rounded-lg border border-rule bg-paper p-8 text-center sm:p-12">
                <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-ink">送信が完了しました</h2>
                <p className="mt-5 text-[14px] leading-[1.95] text-ink/70">
                  お問い合わせいただきありがとうございます。<br />
                  2営業日以内に担当よりご返信いたします。
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
                  <Field label="お問い合わせ内容" required>
                    <textarea name="message" required rows={6} className={inputCls + ' resize-none'} placeholder="お気軽にご記入ください" />
                  </Field>
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
