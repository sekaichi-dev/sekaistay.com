// Gmail API での社内通知メール送信。
//
// 認証は本番 Vercel に既に入っている sekaichi アカウント
// (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN_SEKAICHI) を再利用する。
// このトークンの scope は gmail.modify（= messages.send / drafts.create を含む）。
// 新しいシークレットを増やさないための選択で、送信元は tenichi@sekaichi.org になる。

const TIMEOUT_MS = 8000

let tokenCache: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt - 60_000) return tokenCache.token
  const clientId = (process.env.GOOGLE_CLIENT_ID || '').trim()
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || '').trim()
  const refreshToken = (process.env.GOOGLE_REFRESH_TOKEN_SEKAICHI || '').trim()
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN_SEKAICHI not configured')
  }
  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!resp.ok) {
    const text = await resp.text().catch(() => '')
    throw new Error(`token refresh ${resp.status}: ${text.slice(0, 200)}`)
  }
  const data = (await resp.json()) as { access_token: string; expires_in: number }
  tokenCache = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 }
  return data.access_token
}

/** 日本語を含むヘッダは RFC2047 の B エンコードにする。 */
export function encodeHeader(value: string): string {
  // eslint-disable-next-line no-control-regex
  if (/^[\x00-\x7F]*$/.test(value)) return value
  return `=?UTF-8?B?${Buffer.from(value, 'utf8').toString('base64')}?=`
}

/** ヘッダインジェクション防止: 改行を落とす。 */
function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim()
}

/**
 * From / Reply-To の表示名を安全な形にする。
 * ASCII の表示名を素のまま入れると `山田, foo@example.com` のようなカンマが
 * アドレスの区切りとして解釈され、意図しない宛先が増える（返信の誤送信）。
 * ASCII は quoted-string、非 ASCII は RFC2047 の encoded-word にして封じる。
 */
export function formatDisplayName(name: string): string {
  const clean = sanitizeHeaderValue(name)
  // eslint-disable-next-line no-control-regex
  if (!/^[\x00-\x7F]*$/.test(clean)) return encodeHeader(clean)
  return `"${clean.replace(/[\\"]/g, (c) => `\\${c}`)}"`
}

export type MailMessage = {
  to: string
  from: string
  fromName?: string
  replyTo?: string
  replyToName?: string
  subject: string
  text: string
}

/** RFC822 メッセージを組み立てて base64url にする（Gmail API の raw 形式）。 */
export function buildRawMessage(msg: MailMessage): string {
  const from = msg.fromName
    ? `${formatDisplayName(msg.fromName)} <${sanitizeHeaderValue(msg.from)}>`
    : sanitizeHeaderValue(msg.from)
  const headers = [
    `From: ${from}`,
    `To: ${sanitizeHeaderValue(msg.to)}`,
    `Subject: ${encodeHeader(sanitizeHeaderValue(msg.subject))}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
  ]
  if (msg.replyTo) {
    const replyTo = msg.replyToName
      ? `${formatDisplayName(msg.replyToName)} <${sanitizeHeaderValue(msg.replyTo)}>`
      : sanitizeHeaderValue(msg.replyTo)
    headers.splice(3, 0, `Reply-To: ${replyTo}`)
  }
  const body = Buffer.from(msg.text, 'utf8').toString('base64').replace(/(.{76})/g, '$1\r\n')
  const raw = `${headers.join('\r\n')}\r\n\r\n${body}`
  return Buffer.from(raw, 'utf8').toString('base64url')
}

/** Gmail API で送信。成功時は messageId を返す。 */
export async function sendGmail(msg: MailMessage): Promise<{ id: string }> {
  const token = await getAccessToken()
  const resp = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw: buildRawMessage(msg) }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!resp.ok) {
    const text = await resp.text().catch(() => '')
    throw new Error(`gmail send ${resp.status}: ${text.slice(0, 300)}`)
  }
  const data = (await resp.json()) as { id: string }
  return { id: data.id }
}
