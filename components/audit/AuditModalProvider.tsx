'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { AuditReportRequestForm } from './AuditReportRequestForm'

const AuditModalContext = createContext<{ open: (source?: string) => void }>({ open: () => {} })

export function useAuditModal() {
  return useContext(AuditModalContext)
}

export default function AuditModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  // どの CTA からモーダルを開いたか（流入元計測用）。リード送信時に cta_source として記録する。
  const [ctaSource, setCtaSource] = useState<string | undefined>(undefined)
  const cardRef = useRef<HTMLDivElement>(null)

  // モーダル表示中は背面スクロールを固定＋フォーカストラップ
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const getFocusable = () =>
      Array.from(
        cardRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => el.offsetParent !== null)

    // 開いた瞬間に先頭要素へフォーカス
    const focusTimer = window.setTimeout(() => getFocusable()[0]?.focus(), 0)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        return
      }
      if (e.key !== 'Tab') return
      const items = getFocusable()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement as HTMLElement | null
      // モーダル外にフォーカスがある場合も内側へ引き戻す
      if (!cardRef.current?.contains(active)) {
        e.preventDefault()
        first.focus()
        return
      }
      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen])

  return (
    <AuditModalContext.Provider value={{ open: (source?: string) => { setCtaSource(source); setIsOpen(true) } }}>
      {children}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="audit-modal-title"
        >
          <div
            ref={cardRef}
            className="relative my-6 w-full max-w-2xl rounded-2xl bg-paper p-6 shadow-2xl sm:my-10 sm:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="閉じる"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink/5 text-ink/50 transition hover:bg-ink/10 hover:text-ink"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M18 6L6 18" /></svg>
            </button>

            <p className="font-grotesk text-[12px] font-bold tracking-[0.18em] text-sekai-teal">REPORT</p>
            <h2 id="audit-modal-title" className="mt-2 text-[clamp(1.375rem,3vw,1.875rem)] font-bold leading-snug text-ink">
              無料で診断レポートをもらう
            </h2>
            <p className="mt-3 text-[14px] leading-[1.9] text-ink/70">
              入力は約3分・費用は一切かかりません。最短1営業日以内に、物件の改善余地と収益プランを個別レポートでお届けします。
            </p>

            <div className="mt-7">
              <AuditReportRequestForm ctaSource={ctaSource ?? 'modal'} />
            </div>
          </div>
        </div>
      )}
    </AuditModalContext.Provider>
  )
}
