import Link from 'next/link'
import Image from 'next/image'
import { RESULTS } from '@/content/home/copy'
import { IMG } from '@/content/home/images'
import { IconArrowRight } from '@/components/Icons'
import { JP } from '@/components/JP'

const CASE_IMGS = [IMG.caseNojiri, IMG.caseKyoto, IMG.caseNew]

export default function Results() {
  return (
    <section className="bg-mist">
      <div className="container-edit section-xl">
        {/* Header */}
        <div className="heading-mb grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <span className="eyebrow">Case Studies · Numbers</span>
            </div>
            <h2 className="heading-hero text-ink mb-5 jp-keep">
              <JP>{RESULTS.headline}</JP>
            </h2>
            <p className="text-body-sm text-dark-gray jp-break max-w-prose-jp">
              {RESULTS.body}
            </p>
          </div>
          <Link href={RESULTS.cta.href} className="md:col-span-4 md:justify-self-end btn-link">
            {RESULTS.cta.label}
            <IconArrowRight size={12} />
          </Link>
        </div>

        {/* Summary strip — ledger */}
        <div className="bg-paper border border-rule mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {RESULTS.summary.map((s, i) => (
              <div
                key={s.label}
                className={`px-6 py-8 md:py-10 flex flex-col min-w-0 ${
                  i > 0 ? 'md:border-l border-t md:border-t-0 border-rule' : ''
                } ${i >= 2 ? 'border-t md:border-t-0' : ''}`}
              >
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="font-sans font-light text-[clamp(2.5rem,5vw,3.75rem)] text-ink leading-none tracking-tight tabular-nums">
                    {s.value}
                  </span>
                  {s.unit && (
                    <span className="font-sans text-[18px] text-sekai-teal">
                      {s.unit}
                    </span>
                  )}
                </div>
                <span className="eyebrow-mono text-mid-gray jp-keep !normal-case !tracking-[0.14em]">
                  <JP>{s.label}</JP>
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-caption text-mid-gray mb-12 md:mb-16 leading-relaxed jp-break">
          {RESULTS.summarySource}
        </p>

        {/* Cases */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {RESULTS.cases.map((c, idx) => {
            const img = CASE_IMGS[idx]
            return (
              <article key={idx} className="group flex flex-col bg-paper border border-rule hover:border-ink transition">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-[800ms]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(180deg, rgba(26,26,26,0) 35%, rgba(26,26,26,0.7) 100%)' }}
                  />
                  <div className="absolute top-5 left-5 right-5 flex items-center justify-between text-ivory">
                    <span className="font-sans text-[15px]">Case № {String(idx + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 text-ivory">
                    <p className="font-sans font-medium text-[20px] md:text-[24px] leading-tight mb-2 tabular-nums">
                      {c.effectHeadline}
                    </p>
                    <h3 className="eyebrow-mono text-ivory/80 jp-keep leading-snug !text-[10.5px]">
                      <JP>{c.title}</JP> · {c.tag}
                    </h3>
                  </div>
                </div>

                <div className="p-7 md:p-8 flex flex-col flex-1">
                  <div className="space-y-5 mb-6 pb-6 border-b border-rule">
                    {c.metrics.map((m, i) => (
                      <div key={i} className="min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="eyebrow-mono text-mid-gray">{m.label}</span>
                          <span className="font-sans text-[13px] text-sekai-teal">
                            {m.delta}
                          </span>
                        </div>
                        {m.from ? (
                          <div className="flex items-baseline gap-3 mb-3 flex-wrap">
                            <span className="font-sans text-[13px] text-mid-gray line-through">{m.from}</span>
                            <span className="text-ink/30">→</span>
                            <span className="font-sans font-light text-[24px] text-ink leading-none tabular-nums">{m.to}</span>
                          </div>
                        ) : (
                          <div className="font-sans font-light text-[24px] text-ink mb-3 jp-keep">
                            {m.to}
                          </div>
                        )}
                        <div className="h-px bg-rule overflow-hidden">
                          <div className="h-[2px] bg-sekai-teal transition-all" style={{ width: `${m.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-body-sm text-dark-gray jp-break">{c.body}</p>
                </div>
              </article>
            )
          })}
        </div>

        <p className="mt-8 text-caption text-mid-gray leading-relaxed jp-break max-w-3xl">
          {RESULTS.ctaNote}
        </p>
      </div>
    </section>
  )
}
