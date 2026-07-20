'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import AuditLink from '@/components/audit/AuditLink'

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // /audit は診断フォーム本体ページ。固定バーが送信ボタンに被るため非表示。
  if (pathname === '/audit') return null
  if (!visible || dismissed) return null

  // バナー全体に CTA と同じパルス（box-shadow リング）を付与
  const pulse = 'animate-[cta-pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] motion-reduce:animate-none'

  const Ping = () => (
    <span className="relative flex h-2 w-2 shrink-0">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75 motion-reduce:hidden" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
    </span>
  )

  return (
    <>
      {/* PC: 右下のキャンペーンカード（オレンジ・全体パルス） */}
      <div className="fixed bottom-6 right-6 z-40 hidden w-[330px] sm:block">
        <div className={`relative overflow-hidden rounded-2xl bg-[#F2691B] p-5 text-white shadow-[0_20px_50px_rgba(242,105,27,0.45)] ${pulse}`}>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="閉じる"
            className="absolute right-3 top-3 text-white/70 transition hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M18 6L6 18" /></svg>
          </button>

          <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.1em] text-white">
            <Ping />8月までのお問い合わせ限定
          </span>
          <p className="mt-3 text-[15px] font-bold leading-snug text-white">
            乗り換え初期費用
            <span className="ml-2 align-baseline text-[13px] text-white/60 line-through">¥100,000</span>
            <span className="ml-2 font-grotesk text-[1.875rem] leading-none text-white">¥0</span>
          </p>
          <p className="mt-1.5 text-[12px] leading-[1.7] text-white/80">
            今お問い合わせのオーナー様は、乗り換え初期費用が無料に。
          </p>

          <AuditLink
            
            data-cta="audit"
            data-cta-label="floating"
            className="group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[14px] font-bold text-[#F2691B] transition hover:bg-white/90"
          >
            無料で収益診断を受ける
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </AuditLink>
        </div>
      </div>

      {/* モバイル: 下部の帯バー（オレンジ・全体パルス） */}
      <div className={`fixed inset-x-0 bottom-0 z-40 bg-[#F2691B] px-4 pt-3 text-white pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:hidden ${pulse}`}>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-white">
              <Ping />8月まで限定
            </span>
            <p className="mt-0.5 truncate text-[13px] font-bold">
              乗り換え初期費用 <span className="font-grotesk">¥0</span>
            </p>
          </div>
          <AuditLink
            
            data-cta="audit"
            data-cta-label="floating-mobile"
            className="flex min-h-[44px] shrink-0 items-center rounded-full bg-white px-5 py-3 text-[13px] font-bold text-[#F2691B] transition hover:bg-white/90"
          >
            無料診断
          </AuditLink>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="閉じる"
            className="-mr-1 shrink-0 p-1 text-white/70 transition hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      </div>
    </>
  )
}
