'use client'

import { useState, FormEvent } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { IconCheck, IconArrowRight } from '@/components/Icons'

const inputCls =
  'w-full bg-mist border border-rule px-5 py-4 text-[15px] font-sans text-ink placeholder:text-mid-gray/70 outline-none transition focus:border-sekai-teal focus:bg-paper'

export default function ReferralPage() {
  const [submitting, setSubmitting] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const data = new FormData(e.currentTarget)
    const payload = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      isOwner: data.get('isOwner') === 'on',
      bankName: String(data.get('bankName') || '').trim(),
      bankCode: String(data.get('bankCode') || '').trim(),
      branchName: String(data.get('branchName') || '').trim(),
      branchCode: String(data.get('branchCode') || '').trim(),
      accountType: String(data.get('accountType') || '').trim(),
      accountNumber: String(data.get('accountNumber') || '').trim(),
      accountHolder: String(data.get('accountHolder') || '').trim(),
      accountHolderKana: String(data.get('accountHolderKana') || '').trim(),
      termsAgreed: data.get('termsAgreed') === 'on',
      website: String(data.get('website') || ''), // honeypot
    }
    try {
      const res = await fetch('/api/referral/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const body = await res.json().catch(() => ({}))
      if (res.ok && body.code) {
        setCode(body.code)
      } else {
        setError(body?.error || '登録に失敗しました。時間をおいて再度お試しください。')
      }
    } catch {
      setError('通信エラーが発生しました。時間をおいて再度お試しください。')
    }
    setSubmitting(false)
  }

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
  }

  return (
    <>
      <Header />
      <main className="bg-ivory">
        <section className="bg-paper border-b border-rule">
          <div className="container-edit section-hero">
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <p className="eyebrow text-sekai-teal">Referral</p>
            </div>
            <h1 className="heading-display text-ink mb-5">
              紹介者登録
              <span className="block font-sans font-light text-mid-gray text-[0.6em] mt-3">Introducer Registration</span>
            </h1>
            <p className="lead text-dark-gray max-w-2xl">
              SEKAI STAY に物件オーナーをご紹介いただける方の登録フォームです。ご登録で紹介コードを発行します。
              成約時には所定の紹介謝礼をお振込みします（詳細は規約をご確認ください）。
            </p>
          </div>
        </section>

        <section className="section-xl">
          <div className="container-narrow px-5 md:px-8 max-w-2xl">
            {code ? (
              <div className="bg-paper border border-rule">
                <div className="bg-ink text-ivory px-8 py-10 text-center">
                  <div className="w-14 h-14 border-[3px] border-bright-teal flex items-center justify-center mx-auto mb-5">
                    <IconCheck size={22} className="text-bright-teal" />
                  </div>
                  <p className="eyebrow-mono text-bright-teal mb-3">Registered</p>
                  <h2 className="font-sans text-[22px] md:text-[26px] mb-4">登録が完了しました</h2>
                  <p className="font-sans text-body-sm text-ivory/80 mb-5">あなたの紹介コード</p>
                  <div className="text-[32px] md:text-[40px] font-mono tracking-widest text-bright-teal mb-5">{code}</div>
                  <button onClick={copyCode} className="btn btn-primary text-[14px]">
                    {copied ? 'コピーしました' : 'コードをコピー'}
                  </button>
                  <p className="font-sans text-caption text-ivory/70 mt-6 leading-[1.9]">
                    このコードを紹介先の方にお伝えください。<br />
                    お問い合わせフォームの「紹介者コード」欄にご記入いただくと紹介が記録されます。<br />
                    <strong className="text-ivory">この画面のコードは必ず保存してください。</strong>
                  </p>
                </div>
              </div>
            ) : (
              <div>
                {error && (
                  <div className="mb-6 bg-paper border border-red-300 text-red-700 px-4 py-3 text-[14px] font-sans">{error}</div>
                )}
                <form onSubmit={handleSubmit} className="bg-paper border border-rule p-6 md:p-10 space-y-7">
                  <Field number="01" label="お名前" required>
                    <input type="text" name="name" required className={inputCls} placeholder="山田 太郎" />
                  </Field>
                  <Field number="02" label="メールアドレス" required>
                    <input type="email" name="email" required className={inputCls} placeholder="example@email.com" />
                  </Field>
                  <Field number="03" label="電話番号" required>
                    <input type="tel" name="phone" required className={inputCls} placeholder="090-1234-5678" />
                  </Field>

                  <label className="flex items-center gap-3 font-sans text-[14px] text-ink">
                    <input type="checkbox" name="isOwner" className="w-4 h-4 accent-sekai-teal" />
                    私は SEKAI STAY の物件オーナーです
                  </label>

                  <div className="pt-2 border-t border-rule">
                    <p className="eyebrow-mono text-mid-gray mt-6 mb-4">振込先情報（紹介謝礼のお支払いに使用）</p>
                    <div className="grid grid-cols-2 gap-4">
                      <Field number="04" label="銀行名" required>
                        <input type="text" name="bankName" required className={inputCls} placeholder="〇〇銀行" />
                      </Field>
                      <Field number="05" label="銀行コード">
                        <input type="text" name="bankCode" className={inputCls} placeholder="0001" inputMode="numeric" />
                      </Field>
                      <Field number="06" label="支店名" required>
                        <input type="text" name="branchName" required className={inputCls} placeholder="〇〇支店" />
                      </Field>
                      <Field number="07" label="支店コード">
                        <input type="text" name="branchCode" className={inputCls} placeholder="001" inputMode="numeric" />
                      </Field>
                    </div>
                    <div className="mt-4">
                      <Field number="08" label="口座種別" required>
                        <select name="accountType" required className={inputCls} defaultValue="">
                          <option value="" disabled>選択してください</option>
                          <option value="普通">普通</option>
                          <option value="当座">当座</option>
                        </select>
                      </Field>
                    </div>
                    <div className="mt-4">
                      <Field number="09" label="口座番号" required>
                        <input type="text" name="accountNumber" required className={inputCls} placeholder="1234567" inputMode="numeric" />
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <Field number="10" label="口座名義" required>
                        <input type="text" name="accountHolder" required className={inputCls} placeholder="山田 太郎" />
                      </Field>
                      <Field number="11" label="口座名義（カナ）" required>
                        <input type="text" name="accountHolderKana" required className={inputCls} placeholder="ヤマダ タロウ" />
                      </Field>
                    </div>
                  </div>

                  {/* honeypot（bot 対策・視覚的に隠す） */}
                  <input type="text" name="website" tabIndex={-1} autoComplete="off"
                    className="hidden" aria-hidden="true" />

                  <div className="pt-4 border-t border-rule">
                    <TermsBox />
                    <label className="flex items-start gap-3 font-sans text-[14px] text-ink mt-4">
                      <input type="checkbox" name="termsAgreed" required className="w-4 h-4 mt-1 accent-sekai-teal" />
                      <span>上記の紹介プログラム規約に同意します（必須）</span>
                    </label>
                  </div>

                  <div className="pt-2">
                    <button type="submit" disabled={submitting}
                      className="btn btn-primary w-full justify-center text-[15px] py-4 disabled:opacity-50">
                      {submitting ? '登録中...' : (<>紹介者として登録する<IconArrowRight size={14} /></>)}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function TermsBox() {
  return (
    <div className="bg-bone border border-rule p-5 text-[13px] font-sans text-dark-gray leading-[1.9] max-h-56 overflow-y-auto">
      <p className="font-medium text-ink mb-2">紹介プログラム規約（2026-07-01 v2版）</p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>本規約は、紹介者が SEKAI STAY に物件オーナー候補（以下「紹介先」）を紹介し、成約に至った場合に、SEKAI STAY が紹介役務の対価として紹介報酬を支払う条件を定めます。</li>
        <li>紹介報酬は、①紹介者の紹介による紹介先が、②SEKAI STAY と運用委託契約を締結（成約）し、かつ③当該契約に基づく初回売上の入金が確認された場合に発生します。上記に至らない場合（契約不成立、または入金確認前の解約・キャンセル等）は報酬は発生しません。</li>
        <li>報酬額は1成約あたり金30,000円（税込）とします。支払いは、前号の入金確認月の翌月末に、ご登録の振込先口座へ行います。振込手数料は SEKAI STAY が負担します。</li>
        <li>次の紹介は対象外です：(a) 紹介者自身・同一世帯・関係会社の紹介、(b) 紹介時点で SEKAI STAY が既に商談中・接触済みの紹介先、(c) 虚偽・不正・重複の紹介。</li>
        <li>同一の紹介先に複数の紹介があった場合、SEKAI STAY が最初に有効な紹介コードを受領した紹介者を優先します。</li>
        <li>紹介者は、紹介先本人の同意を得たうえでその連絡先等を SEKAI STAY に提供することを表明・保証します。ご登録の個人情報および振込先情報は、SEKAI STAY のプライバシーポリシーに従って取り扱います。</li>
        <li>紹介報酬は紹介者において課税対象となる場合があり、申告等は紹介者の責任で行うものとします。SEKAI STAY は必要に応じ支払調書を交付します。</li>
        <li>紹介者は反社会的勢力でないことを表明・確約します。違反・不正が判明した場合、報酬は対象外または返還の対象とします。</li>
        <li>SEKAI STAY は、不正・長期の不使用・本規約違反等がある場合、事前の通知のうえ紹介コードを無効化できます。</li>
        <li>SEKAI STAY は本規約・報酬額を変更できます。変更は将来の紹介にのみ適用し、既に有効に成立した紹介の条件は変更しません。変更は本ページ掲示により効力を生じます。</li>
        <li>本規約は日本法に準拠し、本規約に関する紛争は東京地方裁判所を第一審の専属的合意管轄とします。本規約の一部が無効でも、他の条項の効力は妨げられません。</li>
      </ol>
    </div>
  )
}

function Field({ number, label, required, children }: {
  number: string; label: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline gap-3 mb-3">
        <span className="font-sans font-light text-[22px] text-sekai-teal leading-none tabular-nums">{number}</span>
        <label className="font-sans font-medium text-[14px] md:text-[15px] text-ink">
          {label}{required && <span className="text-sekai-teal ml-1 font-sans">*</span>}
        </label>
      </div>
      {children}
    </div>
  )
}
