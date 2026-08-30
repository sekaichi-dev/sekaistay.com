'use client'

import { useState, useMemo } from 'react'
import { FAQ as FAQ_DATA } from '@/content/home/copy'
import { JP } from '@/components/JP'

export default function FAQ() {
  const [activeCat, setActiveCat] = useState<string>('all')
  const [open, setOpen] = useState<number | null>(0)

  const visibleItems = useMemo(() => {
    return FAQ_DATA.items
      .map((item, originalIndex) => ({ ...item, originalIndex }))
      .filter((item) => activeCat === 'all' || item.category === activeCat)
  }, [activeCat])

  const handleCategoryChange = (cat: string) => {
    setActiveCat(cat)
    setOpen(null)
  }

  return (
    <section className="bg-bone">
      <div className="container-narrow section-xl">
        {/* Header */}
        <div className="heading-mb-lg">
          <div className="chapter-marker">
            <span className="rule-teal-sm" />
            <span className="eyebrow">Frequently Asked Questions</span>
          </div>
          <div className="grid lg:grid-cols-[0.6fr_0.4fr] gap-10 lg:gap-16 items-end">
            <h2 className="heading-hero text-ink jp-keep">
              <JP>{FAQ_DATA.headline}</JP>
            </h2>
            <p className="lead text-dark-gray jp-break">
              {FAQ_DATA.body}
            </p>
          </div>
        </div>

        {/* Category filter — editorial tag rail */}
        <div className="border-y border-rule py-4 mb-10 md:mb-12">
          <div className="flex flex-wrap gap-x-6 gap-y-2 items-center">
            <span className="eyebrow-mono text-mid-gray !text-[9px]">Filter —</span>
            {FAQ_DATA.categories.map((cat) => {
              const count =
                cat.id === 'all'
                  ? FAQ_DATA.items.length
                  : FAQ_DATA.items.filter((i) => i.category === cat.id).length
              const active = activeCat === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`group inline-flex items-baseline gap-2 transition ${
                    active ? 'text-ink' : 'text-mid-gray hover:text-ink'
                  }`}
                >
                  <span
                    className={`font-sans text-[14px] md:text-[15px] ${
                      active ? 'border-b-2 border-sekai-teal pb-1' : ''
                    }`}
                  >
                    {cat.label}
                  </span>
                  <span className="font-sans text-[12px] text-mid-gray tabular-nums">
                    {String(count).padStart(2, '0')}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Questions — ledger */}
        <div>
          {visibleItems.map((item, i, arr) => {
            const isOpen = open === i
            const isLast = i === arr.length - 1
            return (
              <div
                key={item.originalIndex}
                className={`${!isLast ? 'border-b border-rule' : ''} transition`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-6 py-6 md:py-7 text-left group"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-5 md:gap-7 flex-1 min-w-0">
                    <span className="font-sans font-light text-[24px] md:text-[28px] text-sekai-teal leading-none flex-shrink-0 tabular-nums pt-1">
                      {String(item.originalIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="font-sans font-medium text-[16px] md:text-[18px] text-ink leading-snug jp-keep pt-1">
                      <JP>{item.q}</JP>
                    </span>
                  </div>
                  <span
                    aria-hidden
                    className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition mt-1 ${
                      isOpen
                        ? 'border-sekai-teal bg-sekai-teal text-ivory'
                        : 'border-rule text-mid-gray group-hover:border-ink group-hover:text-ink'
                    }`}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    >
                      <path
                        d="M1 3l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pl-[44px] md:pl-[76px] pb-8 pr-14">
                      <div className="border-l-2 border-sekai-teal pl-5 py-1">
                        <p className="text-body text-dark-gray jp-break leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {visibleItems.length === 0 && (
          <div className="text-center text-body-sm text-mid-gray py-14 font-sans">
            該当する項目がありません。
          </div>
        )}
      </div>
    </section>
  )
}
