'use client'

import { useState } from 'react'

export interface FaqItem {
  q: string
  a: string
}

export interface FaqCategory {
  en: string
  ja: string
  items: FaqItem[]
}

export default function FaqAccordion({ categories }: { categories: FaqCategory[] }) {
  // Open the very first question by default; keys are "catIdx-itemIdx".
  const [open, setOpen] = useState<string | null>('0-0')

  return (
    <div className="flex flex-col gap-12 sm:gap-14">
      {categories.map((cat, ci) => (
        <div key={cat.en}>
          {/* カテゴリ見出し */}
          <div className="flex items-baseline gap-4 border-b border-white/15 pb-5 sm:gap-5">
            <span className="font-grotesk text-[clamp(2rem,5vw,3rem)] font-bold uppercase leading-none tracking-[-0.02em] text-bright-teal">{cat.en}</span>
            <span className="text-[clamp(1.125rem,2vw,1.5rem)] font-bold text-white">{cat.ja}</span>
          </div>

          <ul>
            {cat.items.map((f, ii) => {
              const key = `${ci}-${ii}`
              const isOpen = open === key
              return (
                <li key={key} className="border-b border-white/15">
                  <button
                    onClick={() => setOpen(isOpen ? null : key)}
                    className="group flex w-full items-center justify-between gap-4 py-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-baseline gap-4 sm:gap-5">
                      <span
                        className={`font-grotesk text-[clamp(1.125rem,2vw,1.5rem)] font-bold leading-none tabular-nums tracking-tight transition-all duration-300 ease-out ${
                          isOpen ? 'scale-110 text-bright-teal' : 'text-white/30 group-hover:text-white/60'
                        }`}
                      >
                        {String(ii + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[15px] font-bold text-white sm:text-[16px]">{f.q}</span>
                    </span>
                    <span className={`shrink-0 text-bright-teal transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </span>
                  </button>
                  <div className={`grid overflow-hidden transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] pb-6' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <p className="pl-10 text-[14px] leading-[1.95] text-white sm:pl-[3.25rem]">{f.a}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
