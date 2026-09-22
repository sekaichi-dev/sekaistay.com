// 採用応募フォーム（/recruit）の受け口。
// 応募内容は DB に保存せず、採用担当あてのメール通知だけで完結する。
// 営業リードのパイプライン（lead_submissions / 吉蔵CRM / sales-portal / Discord #sekai-stay）
// には意図的に一切流していない（応募者が営業リードとして扱われるのを防ぐため）。

import { NextResponse } from 'next/server'
import {
  validateRecruitApplication,
  buildRecruitSubject,
  buildRecruitBody,
  formatJst,
} from '@/lib/recruit-application'
import { sendGmail } from '@/lib/gmail-send'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DEFAULT_TO = 'hikaru@sekaichi.org'
const FROM = 'tenichi@sekaichi.org'

// 同一 IP からの連投抑止（インスタンス内のみ・best effort）
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 }
const recent = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const hits = (recent.get(ip) || []).filter((t) => now - t < RATE_LIMIT.windowMs)
  hits.push(now)
  recent.set(ip, hits)
  if (recent.size > 500) recent.clear()
  return hits.length > RATE_LIMIT.max
}

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    const parsedBody: unknown = await req.json()
    // JSON の null / 配列 / スカラーは req.json() が成功してしまうので実体を確かめる
    if (!parsedBody || typeof parsedBody !== 'object' || Array.isArray(parsedBody)) {
      return NextResponse.json({ error: '送信内容を読み取れませんでした。' }, { status: 400 })
    }
    body = parsedBody as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: '送信内容を読み取れませんでした。' }, { status: 400 })
  }

  // honeypot: bot が埋めるダミー項目。人間には見えないので、入っていたら静かに捨てる。
  if (typeof body.company === 'string' && body.company.trim()) {
    return NextResponse.json({ ok: true })
  }

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: '送信が続いています。しばらく時間をおいてからお試しください。' },
      { status: 429 }
    )
  }

  const parsed = validateRecruitApplication(body)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }
  const app = parsed.value

  const to = (process.env.RECRUIT_NOTIFY_EMAIL || DEFAULT_TO).trim()
  try {
    await sendGmail({
      to,
      from: FROM,
      fromName: 'SEKAI STAY 採用フォーム',
      replyTo: app.email,
      replyToName: app.name,
      subject: buildRecruitSubject(app),
      text: buildRecruitBody(app, {
        submittedAt: formatJst(new Date()),
        landingUrl: typeof body.landingUrl === 'string' ? body.landingUrl : undefined,
        userAgent: req.headers.get('user-agent') || undefined,
      }),
    })
  } catch (err: any) {
    // 応募を取りこぼさないよう、最低限の識別情報をログに残す（本文はログに出さない）
    console.error('[recruit] mail send failed', {
      to,
      name: app.name,
      email: app.email,
      position: app.position,
      error: err?.message || String(err),
    })
    return NextResponse.json(
      { error: '送信に失敗しました。時間をおいて再度お試しください。' },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}
