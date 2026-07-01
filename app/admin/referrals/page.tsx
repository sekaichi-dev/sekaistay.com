'use client'

import { useState } from 'react'

type Referrer = {
  id: string; code: string; name: string; email: string; phone: string;
  isOwner: boolean; bankName: string; branchName: string; accountType: string;
  accountMasked: string; createdAt: string; status: string; kind: string
}
type Lead = {
  id: string; created_at: string; name: string; email: string;
  referrer_code: string | null; referrer_name: string | null;
  referrer_id: string | null; referrer_match: string | null
}

export default function ReferralsAdminPage() {
  const [key, setKey] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [referrers, setReferrers] = useState<Referrer[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [error, setError] = useState('')
  const [reveal, setReveal] = useState<Record<string, string>>({})

  const load = async () => {
    setError('')
    const res = await fetch(`/api/admin/referrers?key=${encodeURIComponent(key)}`)
    if (!res.ok) { setError('認証に失敗しました'); return }
    const data = await res.json()
    setReferrers(data.referrers); setLeads(data.leads); setLoaded(true)
  }

  const doReveal = async (id: string) => {
    const res = await fetch('/api/admin/referrers/reveal', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, referrerId: id }),
    })
    if (!res.ok) return
    const b = await res.json()
    setReveal((m) => ({ ...m, [id]: `${b.accountNumber} / ${b.accountHolder}（${b.accountHolderKana}）` }))
  }

  const resolve = async (leadId: string, referrerId: string) => {
    if (!referrerId) return
    const res = await fetch('/api/admin/referrers/resolve', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, leadId, referrerId }),
    })
    if (res.ok) load()
  }

  if (!loaded) {
    return (
      <div className="max-w-md mx-auto p-8 mt-20">
        <h1 className="text-xl font-medium mb-4">紹介者台帳（管理）</h1>
        <input type="password" value={key} onChange={(e) => setKey(e.target.value)}
          placeholder="管理キー" className="w-full border px-4 py-3 mb-3" />
        <button onClick={load} className="btn btn-primary w-full justify-center">読み込む</button>
        {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <section>
        <h2 className="text-lg font-medium mb-3">紹介者一覧（{referrers.length}）</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="border-b text-left">
              <th className="p-2">コード</th><th className="p-2">氏名</th><th className="p-2">連絡先</th>
              <th className="p-2">区分</th><th className="p-2">口座</th><th className="p-2">登録日</th>
            </tr></thead>
            <tbody>
              {referrers.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="p-2 font-mono">{r.code}</td>
                  <td className="p-2">{r.name}</td>
                  <td className="p-2">{r.email}<br />{r.phone}</td>
                  <td className="p-2">{r.isOwner ? 'オーナー' : '外部'}{r.kind === 'test' ? '(test)' : ''}</td>
                  <td className="p-2">
                    {r.bankName} {r.branchName} {r.accountType}<br />
                    {reveal[r.id] || r.accountMasked}
                    {!reveal[r.id] && <button onClick={() => doReveal(r.id)} className="ml-2 text-sekai-teal underline">reveal</button>}
                  </td>
                  <td className="p-2">{new Date(r.createdAt).toLocaleDateString('ja-JP')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-3">紹介付きリード（{leads.length}）</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="border-b text-left">
              <th className="p-2">日時</th><th className="p-2">見込み客</th><th className="p-2">紹介コード</th>
              <th className="p-2">紹介者名</th><th className="p-2">突合</th><th className="p-2">確定</th>
            </tr></thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b">
                  <td className="p-2">{new Date(l.created_at).toLocaleDateString('ja-JP')}</td>
                  <td className="p-2">{l.name}<br />{l.email}</td>
                  <td className="p-2 font-mono">{l.referrer_code || '-'}</td>
                  <td className="p-2">{l.referrer_name || '-'}</td>
                  <td className="p-2">{badge(l.referrer_match)}</td>
                  <td className="p-2">
                    {l.referrer_match !== 'code' && (
                      <select defaultValue="" onChange={(e) => resolve(l.id, e.target.value)} className="border px-1 py-1">
                        <option value="" disabled>紹介者を選択</option>
                        {referrers.map((r) => <option key={r.id} value={r.id}>{r.code} {r.name}</option>)}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function badge(match: string | null): string {
  if (match === 'code') return '✅ コード一致'
  if (match === 'name_candidate') return '🔎 名前のみ'
  if (match === 'unmatched') return '⚠️ 不一致'
  return '-'
}
