'use client'

import { useState, FormEvent } from 'react'
import { RECRUIT_POSITIONS, RECRUIT_OTHER_POSITION_ID } from '@/data/recruit'

const inputCls =
  'w-full bg-mist border border-rule px-5 py-4 text-[15px] font-sans text-ink placeholder:text-mid-gray/70 outline-none transition focus:border-sekai-teal focus:bg-paper'

export default function RecruitForm({ defaultPosition }: { defaultPosition?: string }) {
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const data = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/recruit/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(data.get('name') || ''),
          email: String(data.get('email') || ''),
          phone: String(data.get('phone') || ''),
          position: String(data.get('position') || ''),
          message: String(data.get('message') || ''),
          portfolioUrl: String(data.get('portfolioUrl') || ''),
          company: String(data.get('company') || ''), // honeypot
          landingUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      })
      if (res.ok) {
        setDone(true)
        return
      }
      const body = await res.json().catch(() => ({}))
      setError(body?.error || '送信に失敗しました。時間をおいて再度お試しください。')
    } catch {
      setError('通信エラーが発生しました。時間をおいて再度お試しください。')
    }
    setSubmitting(false)
  }

  if (done) {
    return (
      <div className="border border-rule bg-paper p-8 text-center sm:p-12">
        <p className="eyebrow text-sekai-teal">Thank you</p>
        <h3 className="heading-sub text-ink mt-3">ご応募ありがとうございます</h3>
        <p className="font-sans text-body-sm text-dark-gray mt-5 leading-[1.95]">
          内容を確認のうえ、採用担当より3営業日以内にご連絡いたします。
          <br />
          しばらくお待ちください。
        </p>
      </div>
    )
  }

  return (
    <>
      {error && (
        <div className="mb-6 border border-rule bg-paper px-4 py-3 font-sans text-[14px] text-ink">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 border border-rule bg-paper p-6 sm:p-10">
        <Field label="お名前" required htmlFor="recruit-name">
          <input id="recruit-name" type="text" name="name" required maxLength={100} className={inputCls} placeholder="山田 太郎" />
        </Field>
        <Field label="メールアドレス" required htmlFor="recruit-email">
          <input id="recruit-email" type="email" name="email" required maxLength={254} className={inputCls} placeholder="example@email.com" />
        </Field>
        <Field label="電話番号（任意）" htmlFor="recruit-phone">
          <input id="recruit-phone" type="tel" name="phone" maxLength={40} className={inputCls} placeholder="090-1234-5678" />
        </Field>
        <Field label="ご希望の職種" required htmlFor="recruit-position">
          <select id="recruit-position" name="position" required defaultValue={defaultPosition || ''} className={inputCls}>
            <option value="" disabled>
              選択してください
            </option>
            {RECRUIT_POSITIONS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
            <option value={RECRUIT_OTHER_POSITION_ID}>その他 / まずは話を聞きたい</option>
          </select>
        </Field>
        <Field label="職務経歴・志望動機" required htmlFor="recruit-message">
          <textarea
            id="recruit-message"
            name="message"
            required
            rows={8}
            minLength={10}
            maxLength={5000}
            className={inputCls + ' resize-none'}
            placeholder="これまでのご経験と、SEKAI STAY で取り組みたいことをご記入ください。履歴書のご用意は不要です。"
          />
        </Field>
        <Field label="ポートフォリオ・SNS・職務経歴書の URL（任意）" htmlFor="recruit-url">
          <input id="recruit-url" type="url" name="portfolioUrl" maxLength={500} className={inputCls} placeholder="https://" />
        </Field>

        {/* honeypot: bot 対策。人間には見えない。 */}
        <div className="hidden" aria-hidden>
          <label>
            会社名
            <input type="text" name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="space-y-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="group inline-flex min-h-[54px] w-full items-center justify-center gap-2 bg-navy px-8 text-[15px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-navy-hover disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {submitting ? '送信中...' : '応募する'}
          </button>
          <p className="text-center font-sans text-[12px] text-ink/50">
            送信により
            <a href="/privacy" className="font-bold text-sekai-teal hover:underline">
              プライバシーポリシー
            </a>
            に同意したものとみなします
          </p>
        </div>
      </form>
    </>
  )
}

function Field({
  label,
  required,
  htmlFor,
  children,
}: {
  label: string
  required?: boolean
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block font-sans text-[14px] font-bold text-ink">
        {label}
        {required && <span className="ml-1 text-sekai-teal">*</span>}
      </label>
      {children}
    </div>
  )
}
