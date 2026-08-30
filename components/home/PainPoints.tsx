import Link from 'next/link'
import { PAIN_POINTS, CTA_LINKS } from '@/content/home/copy'
import { JP } from '@/components/JP'
import { IconArrowRight } from '@/components/Icons'

export default function PainPoints() {
  return (
    <section className="bg-paper border-y border-rule">
      <div className="container-edit section-xl">
        {/* Header */}
        <div className="heading-mb">
          <div className="chapter-marker">
            <span className="rule-teal-sm" />
            <span className="eyebrow">{PAIN_POINTS.eyebrow}</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-end">
            <h2 className="heading-hero text-ink jp-keep">
              <JP>{PAIN_POINTS.headline.line1}</JP>
              <br />
              <span className="font-sans font-light text-sekai-teal">
                <JP>{PAIN_POINTS.headline.line2}</JP>
              </span>
            </h2>
            <p className="lead text-dark-gray jp-break">
              {PAIN_POINTS.body}
            </p>
          </div>
        </div>

        {/* 2-persona grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {PAIN_POINTS.personas.map((p) => (
            <article key={p.id} className="bg-ivory border border-rule p-8 md:p-10 flex flex-col">
              <p className="eyebrow-mono text-sekai-teal mb-5">{p.label}</p>
              <h3 className="font-sans font-medium text-[22px] md:text-[24px] text-ink mb-7 jp-keep leading-snug">
                <JP>{p.title}</JP>
              </h3>
              <ul className="space-y-4 flex-1">
                {p.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-3 text-body-sm text-dark-gray jp-break">
                    <span className="mt-2 w-1 h-1 rounded-full bg-sekai-teal flex-shrink-0" aria-hidden />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Bridge line */}
        <div className="text-center pt-8 border-t border-rule">
          <p className="font-sans font-light text-[22px] md:text-[26px] text-ink mb-6 jp-keep">
            <JP>{PAIN_POINTS.bridge}</JP>
          </p>
          <Link href={CTA_LINKS.audit} className="btn-link">
            無料で物件診断を受ける
            <IconArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  )
}
