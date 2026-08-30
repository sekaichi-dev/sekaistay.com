'use client'

import { useEffect, useRef } from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'

export type SlideItem = {
  image: string
  alt?: string
  title: string
  /** タイトル上のチェック付きタグ（例: 標準で含まれる） */
  tag?: string
  /** タイトル下の詳細説明 */
  body?: string
  /** カード下部の成果タグ（例: 稼働率 +11%） */
  result?: string
  /** 指定するとカード全体がこのURLへのリンクになる */
  href?: string
}

/**
 * [DESIGN_PARTS] SlideCarousel — sense-trust「ACHIEVEMENT」型の横スライドカルーセル（忠実再現）。
 * Splide: type loop / 固定幅カード / gap / ドラッグ可 / ページネーション無し。
 * - 矢印は右上に2つ並べる（参考サイト同様）。
 * - カード左上に「i/total」の大きな番号バッジ（デザインアイコン）。
 * - カルーセル上ホバーで 100px の半透明ドラッグカーソル（DRAG）がマウス追従。
 */
export default function SlideCarousel({
  items,
  ariaLabel = 'カルーセル',
  onDark = false,
  fullBleed = false,
  showBadge = true,
}: {
  items: SlideItem[]
  ariaLabel?: string
  /** 濃色背景に置くとき true（矢印ボタンを明色にして視認性を確保） */
  onDark?: boolean
  /** トラックを画面端まで広げる（参考サイト同様のフルブリード）。左端はコンテナに揃え、右は画面端まで */
  fullBleed?: boolean
  /** カード左上の「i/total」番号バッジを表示するか（デフォルト true） */
  showBadge?: boolean
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const splideRef = useRef<any>(null)
  const areaRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const total = items.length

  useEffect(() => {
    const area = areaRef.current
    const cursor = cursorRef.current
    if (!area || !cursor) return
    // タッチ端末ではドラッグカーソルを出さない
    if (window.matchMedia('(hover: none)').matches) return

    const move = (e: PointerEvent) => {
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`
    }
    const enter = () => cursor.classList.add('is-active')
    const leave = () => cursor.classList.remove('is-active')
    area.addEventListener('pointermove', move)
    area.addEventListener('pointerenter', enter)
    area.addEventListener('pointerleave', leave)
    return () => {
      area.removeEventListener('pointermove', move)
      area.removeEventListener('pointerenter', enter)
      area.removeEventListener('pointerleave', leave)
    }
  }, [])

  const Arrow = ({ dir }: { dir: '<' | '>' }) => (
    <button
      type="button"
      aria-label={dir === '<' ? '前のスライド' : '次のスライド'}
      onClick={() => splideRef.current?.splide?.go(dir)}
      className={`st-car-btn${onDark ? ' st-car-btn--light' : ''}`}
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={dir === '<' ? 'M19 12H5M11 6l-6 6 6 6' : 'M5 12h14M13 6l6 6-6 6'} />
      </svg>
    </button>
  )

  return (
    <div className="relative">
      {/* 矢印スライドボタン（右上） */}
      <div className="mb-6 flex justify-end gap-3">
        <Arrow dir="<" />
        <Arrow dir=">" />
      </div>

      <div ref={areaRef} className={`st-drag-area${fullBleed ? ' st-fullbleed-track' : ''}`}>
        <Splide
          ref={splideRef}
          options={{
            type: 'loop',
            gap: '1.5rem',
            fixedWidth: '300px',
            arrows: false,
            pagination: false,
            drag: true,
            focus: 0,
            speed: 600,
            breakpoints: { 640: { fixedWidth: '230px', gap: '1rem' } },
          }}
          aria-label={ariaLabel}
          className="st-slide-carousel"
        >
          {items.map((it, i) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const Tag: any = it.href ? 'a' : 'div'
            return (
            <SplideSlide key={i}>
              <Tag href={it.href} className="group relative flex h-full flex-col overflow-hidden rounded-[12px] border border-rule bg-paper transition hover:-translate-y-0.5">
                {/* 番号バッジ（i/total） */}
                {showBadge && (
                  <span className="pointer-events-none absolute left-3 top-2 z-10 font-grotesk font-bold leading-none text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.45)]">
                    <span className="text-[2.5rem] tracking-tight">{i + 1}</span>
                    <span className="text-[1.125rem] text-white/75">/{total}</span>
                  </span>
                )}
                <div className="aspect-[1.618/1] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.image}
                    alt={it.alt ?? it.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 pb-6">
                  {it.tag && (
                    <span className="mb-2 inline-flex w-fit items-center gap-1 text-[11px] font-bold tracking-wide text-sekai-teal">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      {it.tag}
                    </span>
                  )}
                  <p className="text-[15px] font-bold leading-[1.5] text-ink">{it.title}</p>
                  {it.body && <p className="mt-3 mb-6 text-[13px] leading-[1.95] text-ink/70">{it.body}</p>}
                  {it.result && (
                    <div className="mt-auto border-t border-rule pt-4">
                      <span className="inline-flex w-fit items-center gap-1.5 text-[13px] font-bold tracking-wide text-sekai-teal">
                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                        </svg>
                        {it.result}
                      </span>
                    </div>
                  )}
                </div>
              </Tag>
            </SplideSlide>
            )
          })}
        </Splide>
      </div>

      {/* ドラッグカーソル（マウス追従・参考サイト同様） */}
      <div ref={cursorRef} className="st-drag-cursor" aria-hidden>
        <span className="font-grotesk text-[11px] font-bold tracking-[0.18em] text-white">DRAG</span>
        <span className="mt-1 flex items-center gap-1 text-white">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 6l-6 6 6 6" /></svg>
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 6l6 6-6 6" /></svg>
        </span>
      </div>
    </div>
  )
}
