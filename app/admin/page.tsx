'use client'

import { useEffect, useState } from 'react'
import { getAllSubmissions, type Submission } from '@/lib/storage'
import { calculateScore } from '@/lib/scoring'
import { CATEGORY_LABELS } from '@/data/questions'
import { IconMail, IconPhone, IconCalendar } from '@/components/Icons'

type SortKey = 'submittedAt' | 'totalScore'
type FilterMode = 'all' | 'consultation' | 'lowScore'

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [sortKey, setSortKey] = useState<SortKey>('submittedAt')
  const [sortAsc, setSortAsc] = useState(false)
  const [filter, setFilter] = useState<FilterMode>('all')
  const [selected, setSelected] = useState<Submission | null>(null)

  useEffect(() => {
    setSubmissions(getAllSubmissions())
  }, [])

  // フィルタリング
  const filtered = submissions.filter(s => {
    if (filter === 'consultation') return s.wantsConsultation === 'はい、希望します'
    if (filter === 'lowScore') return s.totalScore < 50
    return true
  })

  // ソート
  const sorted = [...filtered].sort((a, b) => {
    let diff = 0
    if (sortKey === 'totalScore') diff = a.totalScore - b.totalScore
    else diff = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
    return sortAsc ? diff : -diff
  })

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(a => !a)
    else { setSortKey(key); setSortAsc(false) }
  }

  // CSV出力
  function downloadCSV() {
    const headers = [
      '回答日時', '氏名', '施設名', 'メール', '電話番号',
      '運用形態', '総合スコア', '相談希望', '課題タグ',
      ...Object.values(CATEGORY_LABELS)
    ]
    const rows = sorted.map(s => {
      const catScores = calculateScore(s.answers).categories
      const catMap = Object.fromEntries(catScores.map(c => [c.label, c.score]))
      return [
        new Date(s.submittedAt).toLocaleString('ja-JP'),
        s.name, s.propertyName, s.email, s.tel,
        s.managementStyle, s.totalScore, s.wantsConsultation,
        s.issueTags.join(' / '),
        ...Object.values(CATEGORY_LABELS).map(l => catMap[l] ?? '')
      ]
    })
    const csv = [headers, ...rows]
      .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `minpaku-audit-${new Date().toISOString().slice(0, 10)}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  // Counts
  const consultationCount = submissions.filter(s => s.wantsConsultation === 'はい、希望します').length
  const lowScoreCount = submissions.filter(s => s.totalScore < 50).length

  return (
    <main className="min-h-screen bg-ivory">
      {/* Masthead */}
      <header className="bg-paper border-b border-rule sticky top-0 z-40">
        <div className="container-edit px-5 md:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="eyebrow-mono text-sekai-teal">Admin · Dashboard</p>
            <span className="h-4 w-px bg-rule" />
            <p className="font-sans text-caption text-mid-gray">
              — Submissions Ledger · {String(sorted.length).padStart(3, '0')} shown
            </p>
          </div>
          <button
            onClick={downloadCSV}
            className="group inline-flex items-center gap-2 bg-ink text-ivory px-4 py-2.5 font-sans text-[12px] hover:bg-sekai-teal transition"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export CSV
          </button>
        </div>
      </header>

      <div className="container-edit px-5 md:px-8 py-10 max-w-7xl mx-auto">
        {/* Headline ledger */}
        <div className="bg-rule grid grid-cols-1 md:grid-cols-3 gap-px border border-rule mb-10">
          <div className="bg-paper p-6">
            <p className="eyebrow-mono text-mid-gray mb-3">Total Submissions</p>
            <p className="font-sans font-light text-[48px] md:text-[56px] leading-none text-ink tabular-nums">
              {String(submissions.length).padStart(3, '0')}
            </p>
          </div>
          <div className="bg-paper p-6">
            <p className="eyebrow-mono text-sekai-teal mb-3">Consultation Requested</p>
            <p className="font-sans font-light text-[48px] md:text-[56px] leading-none text-sekai-teal tabular-nums">
              {String(consultationCount).padStart(3, '0')}
            </p>
          </div>
          <div className="bg-paper p-6">
            <p className="eyebrow-mono text-mid-gray mb-3">Score &lt; 50</p>
            <p className="font-sans font-light text-[48px] md:text-[56px] leading-none text-ink tabular-nums">
              {String(lowScoreCount).padStart(3, '0')}
            </p>
          </div>
        </div>

        {/* Filter rail */}
        <div className="flex items-center gap-6 mb-8 pb-4 border-b border-rule overflow-x-auto">
          <p className="eyebrow-mono text-mid-gray whitespace-nowrap">Filter</p>
          {(
            [
              { key: 'all', label: 'すべて' },
              { key: 'consultation', label: '相談希望' },
              { key: 'lowScore', label: 'スコア 50 未満' },
            ] as { key: FilterMode; label: string }[]
          ).map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`relative font-sans text-[13px] py-2 whitespace-nowrap transition ${
                filter === f.key
                  ? 'text-sekai-teal font-medium'
                  : 'text-mid-gray hover:text-ink'
              }`}
            >
              {f.label}
              {filter === f.key && (
                <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-sekai-teal" />
              )}
            </button>
          ))}
        </div>

        {/* Table / empty */}
        {sorted.length === 0 ? (
          <div className="bg-paper border border-rule p-16 text-center">
            <p className="eyebrow-mono text-mid-gray mb-3">Empty · No Records</p>
            <h2 className="font-sans font-medium text-[22px] md:text-[26px] text-ink mb-3">
              回答データが<span className="font-sans text-sekai-teal">ありません。</span>
            </h2>
            <p className="font-sans text-caption text-mid-gray">
              — 診断フォームからデータを送信すると、ここに表示されます。
            </p>
          </div>
        ) : (
          <div className="bg-paper border border-rule overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-rule">
                  <Th onClick={() => toggleSort('submittedAt')} active={sortKey === 'submittedAt'} asc={sortAsc}>
                    Submitted
                  </Th>
                  <Th>Applicant</Th>
                  <Th>Contact</Th>
                  <Th>Operation</Th>
                  <Th onClick={() => toggleSort('totalScore')} active={sortKey === 'totalScore'} asc={sortAsc}>
                    Score
                  </Th>
                  <Th>Consult.</Th>
                  <Th>Issues</Th>
                  <Th>Detail</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {sorted.map((s, i) => (
                  <tr key={s.id} className="hover:bg-mist transition">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="eyebrow-mono text-mid-gray mb-1">№ {String(i + 1).padStart(3, '0')}</p>
                      <p className="font-sans text-[12px] text-dark-gray">
                        {new Date(s.submittedAt).toLocaleString('ja-JP', {
                          month: 'numeric', day: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="font-sans font-medium text-[14px] text-ink">{s.name}</p>
                      <p className="font-sans text-caption text-mid-gray">— {s.propertyName}</p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="font-sans text-[12px] text-dark-gray">{s.email}</p>
                      {s.tel && <p className="eyebrow-mono text-mid-gray mt-0.5">{s.tel}</p>}
                    </td>
                    <td className="px-5 py-4 font-sans text-[13px] text-dark-gray whitespace-nowrap">
                      {s.managementStyle || '—'}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <ScoreBadge score={s.totalScore} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <ConsultationBadge value={s.wantsConsultation} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {s.issueTags.map(tag => (
                          <span
                            key={tag}
                            className="inline-block bg-mist border border-rule font-sans text-[11px] text-dark-gray px-2 py-0.5 whitespace-nowrap"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelected(s)}
                        className="group inline-flex items-center gap-2 font-sans text-[12px] text-sekai-teal whitespace-nowrap"
                      >
                        View
                        <span className="block w-5 h-px bg-sekai-teal group-hover:w-8 transition-[width]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <DetailModal submission={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  )
}

// ── サブコンポーネント ───────────────────────────────────

function Th({
  children,
  onClick,
  active,
  asc,
}: {
  children: React.ReactNode
  onClick?: () => void
  active?: boolean
  asc?: boolean
}) {
  return (
    <th
      onClick={onClick}
      className={`px-5 py-4 text-left eyebrow-mono text-mid-gray whitespace-nowrap
        ${onClick ? 'cursor-pointer select-none hover:text-sekai-teal' : ''}`}
    >
      {children}
      {active && <span className="ml-1 text-sekai-teal">{asc ? '↑' : '↓'}</span>}
    </th>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const tone =
    score >= 80 ? 'text-sekai-teal border-sekai-teal' :
    score >= 60 ? 'text-ink border-dark-gray' :
    score >= 40 ? 'text-dark-gray border-mid-gray' :
    'text-mid-gray border-rule'
  return (
    <div className="inline-flex items-baseline gap-1">
      <span className={`font-sans font-light text-[22px] leading-none tabular-nums ${tone.split(' ')[0]}`}>
        {score}
      </span>
      <span className="eyebrow-mono text-mid-gray">/ 100</span>
    </div>
  )
}

function ConsultationBadge({ value }: { value: string }) {
  if (value === 'はい、希望します') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-ink text-ivory font-sans text-[11px] px-2.5 py-1">
        <span className="w-1 h-1 rounded-full bg-bright-teal" />
        希望あり
      </span>
    )
  }
  return <span className="font-sans text-caption text-mid-gray">{value || '—'}</span>
}

function DetailModal({
  submission,
  onClose,
}: {
  submission: Submission
  onClose: () => void
}) {
  const score = calculateScore(submission.answers)

  return (
    <div
      className="fixed inset-0 bg-ink/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-paper border border-rule w-full max-w-xl max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="sticky top-0 bg-paper border-b border-rule px-6 py-5 flex justify-between items-start gap-4">
          <div>
            <p className="eyebrow-mono text-mid-gray mb-1">Applicant · Detail</p>
            <p className="font-sans font-medium text-[18px] md:text-[20px] text-ink">{submission.name}</p>
            <p className="font-sans text-caption text-mid-gray">— {submission.propertyName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 border border-rule hover:bg-mist flex items-center justify-center text-ink transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="px-6 py-8 space-y-8">
          {/* Total score */}
          <div className="flex items-start gap-8 pb-6 border-b border-rule">
            <div>
              <p className="eyebrow-mono text-mid-gray mb-2">Total</p>
              <p className="font-sans font-light text-[72px] md:text-[88px] leading-none text-sekai-teal tabular-nums">
                {score.total}
              </p>
              <p className="eyebrow-mono text-mid-gray mt-1">/ 100</p>
            </div>
            <div className="flex-1 space-y-4 pt-2">
              {score.categories.map(cat => (
                <div key={cat.category}>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-sans text-[12px] text-dark-gray">{cat.label}</span>
                    <span className="font-sans text-[15px] text-ink tabular-nums">{cat.score}</span>
                  </div>
                  <div className="h-[2px] bg-rule overflow-hidden">
                    <div
                      className={`h-full ${getBarColor(cat.score)}`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Answers */}
          <div>
            <p className="eyebrow-mono text-mid-gray mb-4">§ Answers</p>
            <div className="border-t border-rule divide-y divide-rule">
              {Object.entries(submission.answers).map(([id, val]) => {
                if (id.startsWith('contact_')) return null
                return (
                  <div key={id} className="grid grid-cols-[auto_1fr] gap-4 py-3">
                    <span className="eyebrow-mono text-mid-gray w-24 flex-shrink-0">{id}</span>
                    <span className="font-sans text-[13px] text-dark-gray leading-[1.8]">{String(val)}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Contact */}
          <div className="pt-2">
            <p className="eyebrow-mono text-mid-gray mb-4">§ Contact</p>
            <div className="border-t border-rule pt-4 space-y-3">
              <p className="flex items-center gap-3 font-sans text-[13px] text-dark-gray">
                <IconMail size={13} className="text-mid-gray" />
                <span>{submission.email}</span>
              </p>
              {submission.tel && (
                <p className="flex items-center gap-3 font-sans text-[13px] text-dark-gray">
                  <IconPhone size={13} className="text-mid-gray" />
                  <span>{submission.tel}</span>
                </p>
              )}
              <p className="flex items-center gap-3 font-sans text-[13px] text-dark-gray">
                <IconCalendar size={13} className="text-mid-gray" />
                <span>{new Date(submission.submittedAt).toLocaleString('ja-JP')}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getBarColor(score: number): string {
  if (score >= 70) return 'bg-sekai-teal'
  if (score >= 50) return 'bg-dark-gray'
  return 'bg-mid-gray'
}
