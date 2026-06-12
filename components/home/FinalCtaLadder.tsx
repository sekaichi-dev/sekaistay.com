import Link from 'next/link'
import { FINAL_CTA_LADDER } from '@/content/home/copy-questions'
import { IconArrowRight } from '@/components/Icons'
import { JP } from '@/components/JP'

export default function FinalCtaLadder() {
  return (
    <section className="bg-ivory">
      <div className="container-edit section-xl">
        {/* Header */}
        <div className="heading-mb">
          <div className="chapter-marker">
            <span className="rule-teal-sm" />
            <span className="eyebrow">{FINAL_CTA_LADDER.eyebrow}</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-end">
            <h2 className="heading-hero text-ink jp-keep">
              <JP>{FINAL_CTA_LADDER.headline.line1}</JP>
              <br />
              <span className="font-sans font-light text-sekai-teal">
                <JP>{FINAL_CTA_LADDER.headline.line2}</JP>
              </span>
            </h2>
            <p className="lead text-dark-gray jp-break">{FINAL_CTA_LADDER.body}</p>
          </div>
        </div>

        {/* 3-tier time ladder */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {FINAL_CTA_LADDER.tiers.map((tier, idx) => {
            const isPrimary = idx === 1
            return (
              <Link
                key={tier.time}
                href={tier.href}
                className={`group flex flex-col p-8 md:p-10 transition ${
                  isPrimary
                    ? 'bg-ink text-ivory border border-ink hover:bg-teal-ink'
                    : 'bg-paper border border-rule hover:border-ink'
                }`}
              >
                <div className="flex items-baseline gap-3 mb-5">
                  <span className={`font-sans font-light text-[28px] tabular-nums leading-none ${isPrimary ? 'text-bright-teal' : 'text-sekai-teal'}`}>
                    {tier.time}
                  </span>
                  <span className={`eyebrow-mono ${isPrimary ? 'text-bright-teal' : 'text-sekai-teal'}`}>
                    {tier.weight}
                  </span>
                </div>
                <h3 className={`font-sans font-medium text-[20px] md:text-[22px] mb-4 jp-keep leading-snug ${isPrimary ? 'text-ivory' : 'text-ink'}`}>
                  <JP>{tier.title}</JP>
                </h3>
                <p className={`text-body-sm jp-break mb-8 flex-1 ${isPrimary ? 'text-ivory/70' : 'text-dark-gray'}`}>
                  {tier.microcopy}
                </p>
                <span className={`inline-flex items-center gap-2 text-[13px] transition ${isPrimary ? 'text-bright-teal group-hover:text-ivory' : 'text-ink group-hover:text-sekai-teal'}`}>
                  {tier.title}
                  <IconArrowRight size={12} className="group-hover:translate-x-1 transition" />
                </span>
              </Link>
            )
          })}
        </div>

        <p className="mt-12 text-caption text-mid-gray text-center jp-keep">
          <JP>{FINAL_CTA_LADDER.footerLine}</JP>
        </p>
      </div>
    </section>
  )
}
