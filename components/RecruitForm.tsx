'use client'

import { useState, FormEvent } from 'react'
import { RECRUIT_POSITIONS, RECRUIT_OTHER_POSITION_ID, RECRUIT_STEPS } from '@/data/recruit'

const inputCls =
  'w-full bg-mist border border-rule px-5 py-4 text-[15px] font-sans text-ink placeholder:text-mid-gray/70 outline-none transition focus:border-sekai-teal focus:bg-paper'

const RESUME_ACCEPT = '.pdf,.png,.jpg,.jpeg,.webp,.heic,.txt,.doc,.docx'
const RESUME_MAX_BYTES = 3 * 1024 * 1024

/** File → { filename, contentType, base64 }。data URL のヘッダ部は落とす。 */
function readFileAsBase64(file: File): Promise<{ filename: string; contentType: string; base64: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('read failed'))
    reader.onload = () => {
      const result = String(reader.result || '')
      const base64 = result.slice(result.indexOf(',') + 1)
      resolve({
        filename: file.name,
        contentType: file.type || guessType(file.name),
        base64,
      })
    }
    reader.readAsDataURL(file)
  })
}

/** 一部の端末は file.type が空になるので拡張子から補う。 */
function guessType(name: string): string {
  const ext = name.toLowerCase().split('.').pop() || ''
  if (ext === 'pdf') return 'application/pdf'
  if (ext === 'png') return 'image/png'
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg'
  if (ext === 'webp') return 'image/webp'
  if (ext === 'heic' || ext === 'heif') return 'image/heic'
  if (ext === 'txt') return 'text/plain'
  if (ext === 'doc') return 'application/msword'
  if (ext === 'docx') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  return ''
}

export default function RecruitForm({ defaultPosition }: { defaultPosition?: string }) {
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const data = new FormData(e.currentTarget)
    const file = data.get('resume')
    let resume: { filename: string; contentType: string; base64: string } | null = null
    if (file instanceof File && file.size > 0) {
      if (file.size > RESUME_MAX_BYTES) {
        setError('職務経歴書のファイルサイズは3MBまでです。圧縮するか、テキストで本文にご記入ください。')
        setSubmitting(false)
        return
      }
      try {
        resume = await readFileAsBase64(file)
      } catch {
        setError('職務経歴書を読み取れませんでした。別の形式でお試しください。')
        setSubmitting(false)
        return
      }
    }
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
          resume,
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
      <div className="rounded-lg border border-rule bg-paper p-7 sm:p-10">
        <div className="text-center">
          <p className="eyebrow text-sekai-teal">Thank you</p>
          <h3 className="heading-sub text-ink mt-3">ご応募を受け付けました</h3>
          <p className="font-sans text-body-sm text-dark-gray mt-5 leading-[1.95]">
            このあとの流れは次のとおりです。まずは書類審査のうえ、ご面談をお願いする方にのみご連絡いたします。
          </p>
        </div>

        <ol className="mt-9 space-y-5">
          {RECRUIT_STEPS.map((s, i) => (
            <li key={s.no} className="flex gap-4 border-t border-rule pt-5">
              <span
                className={`shrink-0 font-grotesk text-[1.25rem] font-bold leading-none ${i === 0 ? 'text-ink/30' : 'text-sekai-teal'}`}
              >
                {s.no}
              </span>
              <div className="flex-1">
                <p className="font-sans text-[15px] font-bold text-ink">
                  {s.title}
                  {i === 0 && <span className="ml-2 font-sans text-[12px] font-bold text-ink/40">受付済み</span>}
                  {i === 1 && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-teal-tint px-2.5 py-0.5 font-sans text-[11px] font-bold text-sekai-teal">
                      いまここ
                    </span>
                  )}
                </p>
                <p className="mt-2 font-sans text-[13px] leading-[1.9] text-ink/70">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-8 border-t border-rule pt-6 text-center font-sans text-[12.5px] leading-[1.9] text-ink/55">
          ご応募多数の場合、選考の結果についてご連絡できないことがあります。あらかじめご了承ください。
        </p>
      </div>
    )
  }

  return (
    <>
      {error && (
        <div className="mb-6 rounded-md border border-rule bg-paper px-4 py-3 font-sans text-[14px] text-ink">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-rule bg-paper p-6 sm:p-10">
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
            placeholder="これまでのご経験と、SEKAI STAY で取り組みたいことをご記入ください。職務経歴書のファイルが無い場合は、経歴をこちらにご記入いただいても構いません。"
          />
        </Field>
        <Field label="職務経歴書" htmlFor="recruit-resume">
          <input
            id="recruit-resume"
            type="file"
            name="resume"
            accept={RESUME_ACCEPT}
            className="w-full cursor-pointer border border-rule bg-mist px-5 py-4 font-sans text-[14px] text-ink file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-navy file:px-4 file:py-2 file:font-sans file:text-[13px] file:font-bold file:text-white"
          />
          <p className="mt-2 font-sans text-[12.5px] leading-[1.8] text-ink/55">
            PDF・画像・テキスト・Word のいずれでも構いません（3MBまで）。
            フォーマットは問いません。ファイルが無い場合は、上の欄に経歴をご記入いただくか、下の URL 欄をご利用ください。
          </p>
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
            className="group inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-md bg-navy px-8 text-[15px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-navy-hover disabled:opacity-50 disabled:hover:translate-y-0"
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
