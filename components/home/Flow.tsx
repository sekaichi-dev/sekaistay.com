import Link from 'next/link'
import { FLOW } from '@/content/home/copy'
import { IconArrowRight } from '@/components/Icons'
import { JP } from '@/components/JP'

export default function Flow() {
  return (
    <section className="bg-ivory">
      <div className="container-edit section-xl">
        {/* Header */}
        <div className="heading-mb-lg">
          <div className="chapter-marker">
            <span className="rule-teal-sm" />
            <span className="eyebrow">Process · From Inquiry to Launch</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-end">
            <h2 className="heading-hero text-ink jp-keep">
              <JP>{FLOW.headline}</JP>
            </h2>
            <p className="lead text-dark-gray jp-break">
              {FLOW.body}
            </p>
          </div>
        </div>

        {/* Timeline — editorial ledger */}
        <ol className="relative">
          {/* Vertical rule (desktop only) */}
          <div
            aria-hidden
            className="hidden md:block absolute left-[92px] top-6 bottom-6 w-px bg-rule"
          />

          {FLOW.steps.map((s, i, arr) => {
            const isLast = i === arr.length - 1
            return (
              <li
                key={s.num}
                className={`relative grid md:grid-cols-[180px_1fr] gap-4 md:gap-12 items-start py-8 md:py-10 ${
                  !isLast ? 'border-b border-rule' : ''
                }`}
              >
                {/* Step marker */}
                <div className="flex items-center gap-5 md:block">
                  <span className="font-sans font-light text-[64px] md:text-[72px] text-sekai-teal leading-none tabular-nums">
                    {s.num}
                  </span>
                  <span className="md:hidden eyebrow-mono text-mid-gray">
                    Step {s.num}
                  </span>
                </div>

                {/* Content with dot on the rule (desktop) */}
                <div className="relative">
                  <span
                    aria-hidden
                    className="hidden md:block absolute -left-[88px] top-3 w-3 h-3 rounded-full bg-sekai-teal ring-4 ring-ivory"
                  />
                  <div className="flex items-baseline justify-between gap-6 mb-4 flex-wrap">
                    <h3 className="font-sans font-medium text-[22px] md:text-[26px] text-ink leading-snug jp-keep">
                      <JP>{s.title}</JP>
                    </h3>
                    <span className="hidden md:inline eyebrow-mono text-mid-gray !text-[10px]">
                      Step {String(i + 1).padStart(2, '0')} / {String(arr.length).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="text-body text-dark-gray jp-break max-w-prose-jp">
                    {s.body}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>

        {/* CTA row */}
        <div className="mt-14 md:mt-16 pt-10 border-t border-rule flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <p className="eyebrow-mono text-mid-gray mb-3">Next Step</p>
            <p className="font-sans text-[20px] md:text-[22px] text-ink">
              まずは、お話を聞かせてください。
            </p>
          </div>
          <Link href={FLOW.cta.href} className="btn btn-primary">
            {FLOW.cta.label}
            <IconArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
