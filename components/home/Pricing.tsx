import Link from 'next/link'
import { PRICING } from '@/content/home/copy'
import { IconArrowRight } from '@/components/Icons'
import { JP } from '@/components/JP'

export default function Pricing() {
  return (
    <section className="bg-mist">
      <div className="container-edit section-xl">
        {/* Header */}
        <div className="heading-mb-lg">
          <div className="chapter-marker">
            <span className="rule-teal-sm" />
            <span className="eyebrow">Pricing · Transparent by Design</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-end">
            <h2 className="heading-hero text-ink jp-keep">
              <JP>{PRICING.headline}</JP>
            </h2>
            <p className="lead text-dark-gray jp-break">
              {PRICING.body}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-4">
          {/* Left: Hero price — editorial ink panel */}
          <div className="relative bg-ink text-ivory overflow-hidden flex flex-col">
            {/* Atmospheric teal glow */}
            <div
              aria-hidden
              className="absolute -top-40 -right-40 w-[480px] h-[480px] rounded-full opacity-40 blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(22,123,129,0.45) 0%, transparent 70%)' }}
            />

            <div className="relative p-8 md:p-10 lg:p-12 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-10">
                <span className="eyebrow !text-bright-teal">{PRICING.plan.badge}</span>
                <span className="font-sans text-[14px] text-ivory/50">№ 01</span>
              </div>

              <p className="eyebrow-mono text-ivory/50 mb-3">Plan</p>
              <h3 className="font-sans font-medium text-[22px] md:text-[26px] text-ivory mb-10 leading-snug jp-keep">
                <JP>{PRICING.plan.title}</JP>
              </h3>

              {/* Hero fee */}
              <div className="border-t border-ivory/15 pt-8 mb-10">
                <p className="eyebrow-mono text-ivory/50 mb-5">
                  {PRICING.plan.feeLabel}
                </p>
                <div className="flex items-baseline gap-1 flex-wrap mb-3">
                  <span className="font-sans font-light text-[88px] md:text-[112px] leading-[0.9] text-ivory">
                    {PRICING.plan.feeValue}
                  </span>
                  <span className="font-sans font-light text-[44px] md:text-[56px] text-bright-teal leading-[0.9]">
                    {PRICING.plan.feeUnit}
                  </span>
                </div>
                <p className="font-sans text-[14px] text-ivory/70 mb-2">
                  {PRICING.plan.feeSub}
                </p>
                <p className="text-caption text-ivory/50">
                  {PRICING.plan.compare}
                </p>
              </div>

              {/* Comparison ledger */}
              <div className="mt-auto">
                <p className="eyebrow-mono text-ivory/50 mb-4">
                  {PRICING.comparison.label}
                </p>
                <div className="space-y-5">
                  <div>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="font-sans text-[13px] text-ivory">
                        {PRICING.comparison.sekai.label}
                      </span>
                      <span className="font-sans text-[20px] text-bright-teal tabular-nums">
                        {PRICING.comparison.sekai.value}
                      </span>
                    </div>
                    <div className="h-px bg-ivory/15 overflow-hidden">
                      <div className="h-[2px] bg-bright-teal" style={{ width: '35%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="font-sans text-[13px] text-ivory/60">
                        {PRICING.comparison.industry.label}
                      </span>
                      <span className="font-sans text-[18px] text-ivory/60 tabular-nums">
                        {PRICING.comparison.industry.value}
                      </span>
                    </div>
                    <div className="h-px bg-ivory/15 overflow-hidden">
                      <div className="h-[2px] bg-ivory/40" style={{ width: '85%' }} />
                    </div>
                  </div>
                </div>
                <p className="text-caption text-ivory/40 mt-5 leading-relaxed">
                  {PRICING.comparison.note}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Details — paper ledger */}
          <div className="bg-paper border border-rule flex flex-col">
            <div className="p-8 md:p-10 lg:p-12 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-10 pb-5 border-b border-rule">
                <div>
                  <p className="eyebrow-mono text-mid-gray mb-2">Plan Details</p>
                  <h3 className="font-sans font-medium text-[20px] text-ink jp-keep">
                    <JP>料金の内訳と、含まれているもの</JP>
                  </h3>
                </div>
                <span className="font-sans text-[16px] text-mid-gray">№ 02</span>
              </div>

              {/* Line items — ledger table */}
              <div className="mb-10">
                {PRICING.lines.map((line, i, arr) => (
                  <div
                    key={line.label}
                    className={`py-4 grid grid-cols-[1fr_auto] gap-6 items-baseline ${
                      i !== arr.length - 1 ? 'border-b border-rule' : ''
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="font-sans text-[14px] md:text-[15px] text-ink mb-1 jp-keep">
                        <JP>{line.label}</JP>
                      </p>
                      <p className="text-caption text-mid-gray jp-break">
                        {line.note}
                      </p>
                    </div>
                    <div className="font-sans font-light text-[18px] md:text-[20px] text-ink whitespace-nowrap tabular-nums">
                      {line.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Included services */}
              <div className="bg-mist p-6 md:p-7 mb-8">
                <div className="flex items-center gap-3 mb-5">
                  <span className="rule-teal-sm" />
                  <p className="eyebrow text-sekai-teal">
                    {PRICING.included.title}
                  </p>
                </div>
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                  {PRICING.included.items.map((item, i) => (
                    <li key={item} className="flex items-baseline gap-3 text-body-sm text-ink jp-break">
                      <span className="font-sans text-[12px] text-sekai-teal tabular-nums flex-shrink-0 mt-0.5">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-caption text-dark-gray mb-8 leading-relaxed jp-break">
                {PRICING.note}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <Link href={PRICING.cta.href} className="btn btn-primary flex-1 justify-center">
                  {PRICING.cta.label}
                  <IconArrowRight size={14} />
                </Link>
                <Link href={PRICING.ctaSecondary.href} className="btn btn-ghost flex-1 justify-center">
                  {PRICING.ctaSecondary.label}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
