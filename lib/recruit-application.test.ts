import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  validateRecruitApplication,
  validateResume,
  RECRUIT_LIMITS,
  buildRecruitSubject,
  buildRecruitBody,
  formatJst,
} from './recruit-application.ts'
import { buildRawMessage, encodeHeader, formatDisplayName, sanitizeFilename } from './gmail-send.ts'

const valid = {
  name: '山田 太郎',
  email: 'taro@example.com',
  phone: '090-1234-5678',
  position: 'operations',
  message: '民泊の運営経験が3年あります。よろしくお願いします。',
  portfolioUrl: 'https://example.com/portfolio',
}

test('valid input passes and is trimmed', () => {
  const r = validateRecruitApplication({ ...valid, name: '  山田 太郎  ' })
  assert.equal(r.ok, true)
  if (r.ok) assert.equal(r.value.name, '山田 太郎')
})

test('missing name is rejected', () => {
  const r = validateRecruitApplication({ ...valid, name: '   ' })
  assert.equal(r.ok, false)
})

test('malformed email is rejected', () => {
  const r = validateRecruitApplication({ ...valid, email: 'taro(at)example.com' })
  assert.equal(r.ok, false)
})

test('unknown position id is rejected', () => {
  const r = validateRecruitApplication({ ...valid, position: 'ceo' })
  assert.equal(r.ok, false)
})

test('"other" position is accepted', () => {
  const r = validateRecruitApplication({ ...valid, position: 'other' })
  assert.equal(r.ok, true)
})

test('too short message is rejected', () => {
  const r = validateRecruitApplication({ ...valid, message: '応募します' })
  assert.equal(r.ok, false)
})

test('non-http portfolio url is rejected', () => {
  const r = validateRecruitApplication({ ...valid, portfolioUrl: 'javascript:alert(1)' })
  assert.equal(r.ok, false)
})

test('optional fields may be omitted', () => {
  const r = validateRecruitApplication({
    name: '花子', email: 'h@example.com', position: 'business',
    message: 'フロントエンドを5年やっています。',
  })
  assert.equal(r.ok, true)
  if (r.ok) {
    assert.equal(r.value.phone, '')
    assert.equal(r.value.portfolioUrl, '')
  }
})

test('subject carries position label and name', () => {
  const r = validateRecruitApplication(valid)
  assert.equal(r.ok, true)
  if (!r.ok) return
  assert.equal(buildRecruitSubject(r.value), '【採用応募】運営オペレーション / 山田 太郎 様')
})

test('body contains every submitted field', () => {
  const r = validateRecruitApplication(valid)
  assert.equal(r.ok, true)
  if (!r.ok) return
  const body = buildRecruitBody(r.value, { submittedAt: '2026-09-22 10:00 JST' })
  for (const needle of [valid.email, valid.phone, valid.message, valid.portfolioUrl, '運営オペレーション']) {
    assert.ok(body.includes(needle), `missing: ${needle}`)
  }
})

test('empty optional fields render as 未入力', () => {
  const r = validateRecruitApplication({ ...valid, phone: '', portfolioUrl: '' })
  assert.equal(r.ok, true)
  if (!r.ok) return
  const body = buildRecruitBody(r.value, { submittedAt: 'x' })
  assert.ok(body.includes('電話番号　　: （未入力）'))
})

test('formatJst renders Tokyo time', () => {
  // 2026-09-22T01:00:00Z = JST 10:00
  assert.equal(formatJst(new Date('2026-09-22T01:00:00Z')), '2026-09-22 10:00 JST')
})

test('encodeHeader leaves ascii alone and B-encodes japanese', () => {
  assert.equal(encodeHeader('Recruit'), 'Recruit')
  assert.ok(encodeHeader('採用応募').startsWith('=?UTF-8?B?'))
})

test('raw message has headers, reply-to and base64 body', () => {
  const raw = buildRawMessage({
    to: 'hikaru@sekaichi.org',
    from: 'tenichi@sekaichi.org',
    fromName: 'SEKAI STAY 採用フォーム',
    replyTo: 'taro@example.com',
    replyToName: '山田 太郎',
    subject: '【採用応募】運営オペレーション / 山田 太郎 様',
    text: '本文テスト',
  })
  const decoded = Buffer.from(raw, 'base64url').toString('utf8')
  assert.ok(decoded.includes('To: hikaru@sekaichi.org'))
  assert.ok(decoded.includes('Reply-To: '))
  assert.ok(decoded.includes('taro@example.com'))
  assert.ok(decoded.includes('Content-Type: text/plain; charset="UTF-8"'))
  const body = decoded.split('\r\n\r\n')[1]
  assert.equal(Buffer.from(body.replace(/\r\n/g, ''), 'base64').toString('utf8'), '本文テスト')
})

test('header injection via newline is neutralised', () => {
  const raw = buildRawMessage({
    to: 'hikaru@sekaichi.org',
    from: 'tenichi@sekaichi.org',
    replyTo: 'evil@example.com\r\nBcc: victim@example.com',
    subject: 'x\r\nBcc: victim2@example.com',
    text: 'body',
  })
  const decoded = Buffer.from(raw, 'base64url').toString('utf8')
  const headerLines = decoded.split('\r\n\r\n')[0].split('\r\n')
  // 改行は空白に潰されるので、Bcc: で始まるヘッダ行は生まれない
  assert.ok(!headerLines.some((l) => /^Bcc:/i.test(l)))
  assert.equal(headerLines.filter((l) => /^Reply-To:/i.test(l)).length, 1)
})

test('display name with comma cannot add a second recipient', () => {
  const raw = buildRawMessage({
    to: 'hikaru@sekaichi.org',
    from: 'tenichi@sekaichi.org',
    replyTo: 'applicant@example.com',
    replyToName: 'other@example.net, Applicant',
    subject: 'Test',
    text: 'body',
  })
  const decoded = Buffer.from(raw, 'base64url').toString('utf8')
  const line = decoded.split('\r\n').find((l) => l.startsWith('Reply-To:')) || ''
  assert.equal(line, 'Reply-To: "other@example.net, Applicant" <applicant@example.com>')
})

test('display name quotes are escaped', () => {
  assert.equal(formatDisplayName('He said "hi"'), '"He said \\"hi\\""')
  assert.ok(formatDisplayName('山田 太郎').startsWith('=?UTF-8?B?'))
})


const pdf = { filename: '職務経歴書.pdf', contentType: 'application/pdf', base64: Buffer.from('%PDF-1.4 dummy').toString('base64') }

test('resume: 添付なしは許容される', () => {
  const r = validateResume(null)
  assert.equal(r.ok, true)
  if (r.ok) assert.equal(r.value, null)
})

test('resume: PDF は受け付けてサイズを算出する', () => {
  const r = validateResume(pdf)
  assert.equal(r.ok, true)
  if (r.ok && r.value) {
    assert.equal(r.value.filename, '職務経歴書.pdf')
    assert.equal(r.value.size, 14)
  }
})

test('resume: 画像・テキスト・Word も受け付ける', () => {
  for (const t of ['image/jpeg', 'image/png', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']) {
    assert.equal(validateResume({ ...pdf, contentType: t }).ok, true, t)
  }
})

test('resume: 実行ファイルなど想定外の形式は弾く', () => {
  const r = validateResume({ ...pdf, contentType: 'application/x-msdownload' })
  assert.equal(r.ok, false)
})

test('resume: 3MB を超える添付は弾く', () => {
  const big = 'A'.repeat(Math.ceil((RECRUIT_LIMITS.resumeBytes + 1024) / 3) * 4)
  const r = validateResume({ ...pdf, base64: big })
  assert.equal(r.ok, false)
})

test('resume: base64 でない中身は弾く', () => {
  const r = validateResume({ ...pdf, base64: '<<not base64>>' })
  assert.equal(r.ok, false)
})

test('応募本文に添付ファイル名が残る', () => {
  const r = validateRecruitApplication({ ...valid, resume: pdf })
  assert.equal(r.ok, true)
  if (!r.ok) return
  const body = buildRecruitBody(r.value, { submittedAt: 'x' })
  assert.ok(body.includes('職務経歴書.pdf'))
})

test('添付なしの応募は「添付なし」と本文に出る', () => {
  const r = validateRecruitApplication(valid)
  assert.equal(r.ok, true)
  if (!r.ok) return
  assert.ok(buildRecruitBody(r.value, { submittedAt: 'x' }).includes('添付なし'))
})

test('添付つきメールは multipart になり本文と添付が両方入る', () => {
  const raw = buildRawMessage({
    to: 'hikaru@sekaichi.org',
    from: 'tenichi@sekaichi.org',
    subject: '添付テスト',
    text: '本文',
    attachments: [{ filename: '職務経歴書.pdf', contentType: 'application/pdf', base64: pdf.base64 }],
  })
  const decoded = Buffer.from(raw, 'base64url').toString('utf8')
  assert.ok(/Content-Type: multipart\/mixed; boundary="/.test(decoded))
  assert.ok(decoded.includes('Content-Type: application/pdf; name="職務経歴書.pdf"'))
  assert.ok(decoded.includes('Content-Disposition: attachment; filename="=?UTF-8?B?'))
  assert.ok(decoded.includes(pdf.base64))
})

test('添付ファイル名のパス・改行は落とす', () => {
  assert.equal(sanitizeFilename('../../etc/passwd'), 'passwd')
  assert.equal(sanitizeFilename('resume\r\nBcc: x@example.com.pdf'), 'resume Bcc: x@example.com.pdf')
})

test('未知の content-type は octet-stream に倒す', () => {
  const raw = buildRawMessage({
    to: 'a@example.com', from: 'b@example.com', subject: 's', text: 't',
    attachments: [{ filename: 'f.bin', contentType: 'not a mime type', base64: 'QUJD' }],
  })
  const decoded = Buffer.from(raw, 'base64url').toString('utf8')
  assert.ok(decoded.includes('Content-Type: application/octet-stream; name="f.bin"'))
})
