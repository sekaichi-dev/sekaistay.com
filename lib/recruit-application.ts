// /recruit の応募フォームの検証とメール本文組み立て。
// 送信そのものは lib/gmail-send.ts、HTTP 受け口は app/api/recruit/apply/route.ts。
// 応募内容は DB に保存せず、採用担当へのメール通知のみで完結させる
// （営業リードの lead_submissions / 吉蔵CRM へは一切流さない）。

import { RECRUIT_POSITION_IDS, recruitPositionLabel } from '../data/recruit.ts'

export type RecruitApplicationInput = {
  name?: unknown
  email?: unknown
  phone?: unknown
  position?: unknown
  message?: unknown
  portfolioUrl?: unknown
}

export type RecruitApplication = {
  name: string
  email: string
  phone: string
  position: string
  message: string
  portfolioUrl: string
}

export const RECRUIT_LIMITS = {
  name: 100,
  email: 254,
  phone: 40,
  message: 5000,
  portfolioUrl: 500,
} as const

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : ''
}

export function validateRecruitApplication(
  input: RecruitApplicationInput
): { ok: true; value: RecruitApplication } | { ok: false; error: string } {
  const name = str(input.name)
  const email = str(input.email)
  const phone = str(input.phone)
  const position = str(input.position)
  const message = str(input.message)
  const portfolioUrl = str(input.portfolioUrl)

  if (!name) return { ok: false, error: 'お名前を入力してください。' }
  if (name.length > RECRUIT_LIMITS.name) return { ok: false, error: 'お名前が長すぎます。' }
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'メールアドレスの形式が正しくありません。' }
  if (email.length > RECRUIT_LIMITS.email) return { ok: false, error: 'メールアドレスが長すぎます。' }
  if (phone.length > RECRUIT_LIMITS.phone) return { ok: false, error: '電話番号が長すぎます。' }
  if (!RECRUIT_POSITION_IDS.includes(position)) return { ok: false, error: 'ご希望の職種を選択してください。' }
  if (message.length < 10) return { ok: false, error: '志望動機・経歴を10文字以上でご記入ください。' }
  if (message.length > RECRUIT_LIMITS.message) return { ok: false, error: '入力内容が長すぎます。' }
  if (portfolioUrl.length > RECRUIT_LIMITS.portfolioUrl) return { ok: false, error: 'URL が長すぎます。' }
  if (portfolioUrl && !/^https?:\/\//i.test(portfolioUrl)) {
    return { ok: false, error: 'URL は http:// または https:// で始めてください。' }
  }

  return { ok: true, value: { name, email, phone, position, message, portfolioUrl } }
}

export function buildRecruitSubject(app: RecruitApplication): string {
  return `【採用応募】${recruitPositionLabel(app.position)} / ${app.name} 様`
}

export function buildRecruitBody(
  app: RecruitApplication,
  meta: { submittedAt: string; landingUrl?: string; userAgent?: string } 
): string {
  const lines = [
    'sekaistay.com の採用ページから応募がありました。',
    'このメールにそのまま返信すると応募者本人に届きます。',
    '',
    '────────────────────',
    `お名前　　　: ${app.name}`,
    `メール　　　: ${app.email}`,
    `電話番号　　: ${app.phone || '（未入力）'}`,
    `希望職種　　: ${recruitPositionLabel(app.position)}`,
    `URL　　　　 : ${app.portfolioUrl || '（未入力）'}`,
    `応募日時　　: ${meta.submittedAt}`,
    '────────────────────',
    '',
    '【志望動機・経歴】',
    app.message,
    '',
    '────────────────────',
    `応募元ページ: ${meta.landingUrl || 'https://sekaistay.com/recruit'}`,
    `UA　　　　　: ${meta.userAgent || '(不明)'}`,
  ]
  return lines.join('\n')
}

/** JST の "YYYY-MM-DD HH:mm" 表記（採用担当が読む用）。 */
export function formatJst(date: Date): string {
  const p = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(date)
  const get = (t: string) => p.find((x) => x.type === t)?.value ?? ''
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')} JST`
}
