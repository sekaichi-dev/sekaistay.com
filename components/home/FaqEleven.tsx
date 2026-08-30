'use client'

import { useState } from 'react'
import { FAQ_ELEVEN } from '@/content/home/copy-questions'
import { JP } from '@/components/JP'

export default function FaqEleven() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="bg-switch-cloud">
      <div className="container-narrow section-xl">
        <div className="heading-mb">
          <div className="chapter-marker">
            <span className="rule-teal-sm" />
            <span className="eyebrow">{FAQ_ELEVEN.eyebrow}</span>
          </div>
          <h2 className="heading-hero text-ink jp-keep">
            <JP>{FAQ_ELEVEN.headline}</JP>
          </h2>
        </div>

        <div className="border-t border-rule">
          {FAQ_ELEVEN.items.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q} className="border-b border-rule">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-baseline gap-5 py-6 md:py-7 text-left group"
                >
                  <span className="font-sans text-[13px] text-mid-gray tabular-nums shrink-0">
                    {String(i + 11).padStart(2, '0')}
                  </span>
                  <span className="flex-1 font-sans font-medium text-[16px] md:text-[18px] text-ink leading-snug jp-keep group-hover:text-sekai-teal transition">
                    <JP>{item.q}</JP>
                  </span>
                  <span
                    aria-hidden
                    className={`font-sans text-[18px] text-mid-gray shrink-0 transition-transform ${isOpen ? 'rotate-45' : ''}`}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <p className="pb-7 pl-[42px] md:pl-[46px] pr-8 text-body-sm text-dark-gray jp-break">
                    {item.a}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
