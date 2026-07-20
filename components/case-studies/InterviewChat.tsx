'use client'

import { useState } from 'react'

export interface ChatTurn {
  who: 'owner' | 'host'
  text: string
}

/* オーナー × 代表のチャット形式インタビュー。途中まで表示し、クリックで全文表示。 */
export default function InterviewChat({
  turns,
  hostName,
  hostImg,
  ownerName,
  initial = 3,
}: {
  turns: ChatTurn[]
  hostName: string
  hostImg: string
  ownerName: string
  initial?: number
}) {
  const [open, setOpen] = useState(false)
  const visible = open ? turns : turns.slice(0, initial)
  const hidden = turns.length - initial

  return (
    <div>
      <div className="relative">
        <div className="space-y-5">
          {visible.map((t, i) => {
            const isHost = t.who === 'host'
            return (
              <div key={i} className={`flex items-start gap-3 ${isHost ? 'flex-row-reverse' : ''}`}>
                {/* アバター */}
                {isHost ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={hostImg} alt={hostName} loading="lazy" className="h-10 w-10 shrink-0 rounded-full object-cover object-top ring-1 ring-rule" />
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rule text-ink/45" aria-hidden>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 20a8 8 0 0116 0" />
                    </svg>
                  </span>
                )}
                {/* 吹き出し */}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isHost ? 'rounded-tr-sm bg-sekai-teal text-white' : 'rounded-tl-sm bg-mist text-ink'}`}>
                  <p className={`mb-1 text-[11px] font-bold tracking-wide ${isHost ? 'text-white/75' : 'text-ink/45'}`}>
                    {isHost ? hostName : ownerName}
                  </p>
                  <p className="text-[14px] leading-[1.85]">{t.text}</p>
                </div>
              </div>
            )
          })}
        </div>
        {!open && hidden > 0 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent" />
        )}
      </div>

      {!open && hidden > 0 && (
        <button
          onClick={() => setOpen(true)}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-rule px-6 py-3 text-[13px] font-bold text-ink transition hover:bg-mist"
        >
          やり取りの続きを読む（残り{hidden}件）
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  )
}
