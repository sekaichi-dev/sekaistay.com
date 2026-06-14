'use client'

import { useEffect, useState } from 'react'

type Service = {
  title: string
  desc: string
  details: string[]
  image: string
}

type Bucket = {
  id: string
  label: string
  sublabel: string
  description: string
  services: Service[]
}

type Props = {
  buckets: Bucket[]
}

export default function ServiceBucketsInteractive({ buckets }: Props) {
  const [active, setActive] = useState<Service | null>(null)

  // ESC キーで閉じる
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [active])

  // モーダル open 時は背景スクロール抑止
  useEffect(() => {
    if (active) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [active])

  return (
    <>
      {/*
        3 column vertical layout with row alignment.
        Using `grid-flow-col` + `grid-rows-[repeat(5,auto)]` on md+ so each bucket
        occupies one column and the 5 row tiers (image / description / svc1-3) align
        horizontally across columns regardless of content length.
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[repeat(5,auto)] md:grid-flow-col gap-px bg-rule border border-rule rounded-switch-lg overflow-hidden">
        {buckets.map((bucket, bIdx) => (
          <div key={bucket.id} className="contents">
            {/* Row 1: image header */}
            <div className="relative aspect-[16/10] md:aspect-[5/4] overflow-hidden bg-ink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bucket.services[0]?.image}
                alt={bucket.label}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, rgba(26,26,26,0.15) 0%, rgba(26,26,26,0.85) 100%)' }}
              />
              <div className="absolute top-5 left-5 right-5">
                <p className="eyebrow-mono text-bright-teal !text-[10px]">
                  {String(bIdx + 1).padStart(2, '0')} — {bucket.sublabel}
                </p>
              </div>
              <div className="absolute bottom-5 left-5 right-5">
                <h3 className="font-sans font-medium text-[20px] md:text-[22px] text-ivory leading-tight jp-keep">
                  {bucket.label}
                </h3>
              </div>
            </div>

            {/* Row 2: description */}
            <div className="bg-paper p-7 md:p-8 border-b border-rule">
              <p className="text-body-sm text-dark-gray leading-relaxed jp-break">
                {bucket.description}
              </p>
            </div>

            {/* Rows 3-5: service rows */}
            {bucket.services.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(s)}
                className={`group bg-paper w-full text-left p-6 md:p-7 flex items-center justify-between gap-4 hover:bg-mist transition ${
                  i !== 0 ? 'border-t border-rule' : ''
                }`}
                aria-label={`${s.title} の詳細を見る`}
              >
                <div className="flex items-baseline gap-4 min-w-0">
                  <span className="font-sans font-light text-[18px] text-sekai-teal tabular-nums flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-sans font-medium text-[15px] md:text-[16px] text-ink jp-keep group-hover:text-sekai-teal transition">
                    {s.title}
                  </span>
                </div>
                <svg
                  className="w-4 h-4 text-mid-gray group-hover:text-sekai-teal group-hover:translate-x-1 transition flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        ))}
      </div>

      <p className="mt-5 text-center text-[11.5px] text-mid-gray font-sans">
        タップして各サービスの詳細をご覧いただけます。
      </p>

      {/* Modal overlay */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-modal-title"
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="閉じる"
            onClick={() => setActive(null)}
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm transition"
          />

          {/* Panel */}
          <div className="relative bg-ivory w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-rule shadow-2xl anim-fade-up">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-ivory/90 hover:bg-ink hover:text-ivory border border-rule transition"
              aria-label="閉じる"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image */}
            <div className="relative aspect-[16/9] md:aspect-[2/1] overflow-hidden bg-ink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={active.image} alt={active.title} className="w-full h-full object-cover" />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, rgba(26,26,26,0) 50%, rgba(26,26,26,0.6) 100%)' }}
              />
              <h2
                id="service-modal-title"
                className="absolute bottom-6 left-6 right-6 font-sans font-medium text-[24px] md:text-[28px] text-ivory leading-tight jp-keep"
              >
                {active.title}
              </h2>
            </div>

            {/* Body */}
            <div className="p-7 md:p-10">
              <p className="text-body text-dark-gray jp-break leading-relaxed mb-8">
                {active.desc}
              </p>
              <p className="eyebrow-mono text-sekai-teal mb-5">主な提供内容</p>
              <ul className="space-y-3">
                {active.details.map((d, j) => (
                  <li key={j} className="flex items-baseline gap-4 text-[14.5px] text-ink">
                    <span className="font-sans text-[13px] text-sekai-teal tabular-nums flex-shrink-0">
                      {String(j + 1).padStart(2, '0')}
                    </span>
                    <span className="jp-break leading-relaxed">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
