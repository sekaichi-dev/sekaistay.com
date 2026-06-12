import Link from 'next/link'
import { FINAL_CTA_LADDER } from '@/content/home/copy-questions'
import { IconArrowRight } from '@/components/Icons'
import { JP } from '@/components/JP'

export default function FinalCtaLadder() {
  return (
    <section className="bg-[#161616]">
      <div className="container-edit section-xl">
        {/* Header */}
        <div className="heading-mb">
          <div className="chapter-marker">
            <span className="rule-teal-sm" />
            <span className="eyebrow !text-bright-teal">{FINAL_CTA_LADDER.eyebrow}</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-end">
            <h2 className="heading-hero text-white jp-keep">
              <JP>{FINAL_CTA_LADDER.headline.line1}</JP>
              <br />
              <span className="font-sans font-light text-bright-teal">
                <JP>{FINAL_CTA_LADDER.headline.line2}</JP>
              </span>
            </h2>
            <p className="lead text-white/70 jp-break">{FINAL_CTA_LADDER.body}</p>
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
                className={`group flex flex-col p-8 md:p-10 rounded-switch-lg transition ${
                  isPrimary
                    ? 'bg-switch-accent text-white border border-switch-accent hover:bg-switch-accent-hover'
                    : 'bg-white/[0.05] border border-white/15 text-white hover:border-bright-teal'
                }`}
              >
                <div className="flex items-baseline gap-3 mb-5">
                  <span className={`font-sans font-light text-[28px] tabular-nums leading-none ${isPrimary ? 'text-white/90' : 'text-bright-teal'}`}>
                    {tier.time}
                  </span>
                  <span className={`eyebrow-mono ${isPrimary ? '!text-white/90' : '!text-bright-teal'}`}>
                    {tier.weight}
                  </span>
                </div>
                <h3 className="font-sans font-medium text-[20px] md:text-[22px] mb-4 jp-keep leading-snug text-white">
                  <JP>{tier.title}</JP>
                </h3>
                <p className={`text-body-sm jp-break mb-8 flex-1 ${isPrimary ? 'text-white/70' : 'text-white/60'}`}>
                  {tier.microcopy}
                </p>
                <span className={`inline-flex items-center gap-2 text-[13px] transition ${isPrimary ? 'text-white/90 group-hover:text-white' : 'text-white group-hover:text-bright-teal'}`}>
                  {tier.title}
                  <IconArrowRight size={12} className="group-hover:translate-x-1 transition" />
                </span>
              </Link>
            )
          })}
        </div>

        <p className="mt-12 text-caption text-white/40 text-center jp-keep">
          <JP>{FINAL_CTA_LADDER.footerLine}</JP>
        </p>
      </div>
    </section>
  )
}
