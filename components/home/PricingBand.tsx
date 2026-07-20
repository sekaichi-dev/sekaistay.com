import Link from 'next/link'
import { PRICING_BAND } from '@/content/home/copy-v3'
import { IconArrowRight } from '@/components/Icons'
import { JP } from '@/components/JP'

export default function PricingBand() {
  return (
    <section className="bg-gradient-to-br from-switch-teal-deep to-switch-teal text-white">
      <div className="container-edit section-xl">
        <div className="heading-mb">
          <div className="chapter-marker">
            <span className="rule-teal-sm" />
            <span className="eyebrow !text-bright-teal">{PRICING_BAND.eyebrow}</span>
          </div>
          <h2 className="heading-hero text-white jp-keep">
            <JP>{PRICING_BAND.headline.line1}</JP>
            <br />
            <span className="font-sans font-light text-bright-teal">
              <JP>{PRICING_BAND.headline.line2}</JP>
            </span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Formula */}
          <div className="lg:col-span-7 min-w-0">
            <p className="eyebrow-mono !text-white/50 mb-4">{PRICING_BAND.formula.example}</p>
            <p className="font-sans font-light text-[24px] md:text-[32px] leading-snug mb-2 tabular-nums jp-keep">
              <JP>{PRICING_BAND.formula.ours}</JP>
            </p>
            <p className="font-sans text-[15px] text-white/60 mb-3 tabular-nums">
              {PRICING_BAND.formula.theirs} → <span className="text-yellow-300">{PRICING_BAND.formula.delta}</span>
            </p>

            <div className="border-t border-white/20 mt-8">
              {PRICING_BAND.rows.map((r) => (
                <div key={r.revenue} className="flex items-baseline justify-between gap-4 py-4 border-b border-white/20">
                  <span className="font-sans text-[14px] text-white/70 tabular-nums">{r.revenue}</span>
                  <span className="font-sans font-light text-[20px] md:text-[24px] text-white tabular-nums">{r.delta3y}</span>
                </div>
              ))}
            </div>
            <p className="text-caption text-white/45 mt-3 jp-break">{PRICING_BAND.rowsNote}</p>
          </div>

          {/* Disclosure + CTAs */}
          <div className="lg:col-span-5 min-w-0 lg:pl-6">
            <p className="text-body-sm text-white/75 jp-break mb-8 leading-relaxed">
              {PRICING_BAND.disclosure}
            </p>
            <Link
              href={PRICING_BAND.primaryCta.href}
              className="group inline-flex items-center justify-center gap-2.5 bg-switch-accent hover:bg-switch-accent-hover text-white font-bold text-[15px] px-8 py-4 rounded-switch-md transition shadow-switch-card"
            >
              {PRICING_BAND.primaryCta.label}
              <IconArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </Link>
            <p className="text-caption text-white/45 mt-3 mb-7">{PRICING_BAND.primaryMicrocopy}</p>
            <Link href={PRICING_BAND.secondaryCta.href} className="inline-flex items-center gap-2 text-[13.5px] text-white/90 hover:text-white underline underline-offset-4 transition group">
              {PRICING_BAND.secondaryCta.label}
              <IconArrowRight size={12} className="group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
