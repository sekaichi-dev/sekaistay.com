'use client'

import { useState } from 'react'
import { QUESTION_BLOCKS } from '@/content/home/copy-questions'
import { TEN_QUESTIONS_COMPACT } from '@/content/home/copy-v3'
import { JP } from '@/components/JP'

const ALL_QUESTIONS = QUESTION_BLOCKS.flatMap((block) => block.items)

export default function TenQuestionsCompact() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="bg-bone">
      <div className="container-narrow section-xl">
        <div className="heading-mb">
          <div className="chapter-marker">
            <span className="rule-teal-sm" />
            <span className="eyebrow">{TEN_QUESTIONS_COMPACT.eyebrow}</span>
          </div>
          <h2 className="heading-hero text-ink mb-5 jp-keep">
            <JP>{TEN_QUESTIONS_COMPACT.headline.line1}</JP>
            <br />
            <span className="font-sans font-light text-sekai-teal">
              <JP>{TEN_QUESTIONS_COMPACT.headline.line2}</JP>
            </span>
          </h2>
          <p className="text-body-sm text-dark-gray jp-break max-w-prose-jp">
            {TEN_QUESTIONS_COMPACT.body}
          </p>
        </div>

        <div className="border-t border-rule">
          {ALL_QUESTIONS.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.num} className="border-b border-rule">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-baseline gap-5 py-5 md:py-6 text-left group"
                >
                  <span className="eyebrow-mono text-sekai-teal shrink-0 w-[52px]">{item.num}</span>
                  <span className="flex-1 font-sans font-medium text-[15.5px] md:text-[17px] text-ink leading-snug jp-keep group-hover:text-sekai-teal transition">
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
                  <div className="pb-7 pl-[72px] pr-8">
                    <p className="font-sans font-medium text-[15px] text-sekai-teal leading-snug mb-2 jp-keep">
                      <JP>{item.aLead}</JP>
                    </p>
                    <p className="text-body-sm text-dark-gray jp-break">{item.aBody}</p>
                    {item.notes?.map((note) => (
                      <p key={note} className="mt-3 text-caption text-mid-gray leading-relaxed jp-break">
                        {note}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
