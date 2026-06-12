import Link from 'next/link'
import { PERSONA_PATHS } from '@/content/home/copy-v3'
import { IconArrowRight } from '@/components/Icons'
import { JP } from '@/components/JP'

export default function PersonaPaths() {
  return (
    <section className="bg-ivory">
      <div className="container-edit section-xl">
        <div className="heading-mb">
          <div className="chapter-marker">
            <span className="rule-teal-sm" />
            <span className="eyebrow">{PERSONA_PATHS.eyebrow}</span>
          </div>
          <h2 className="heading-hero text-ink jp-keep">
            <JP>{PERSONA_PATHS.headline}</JP>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {PERSONA_PATHS.paths.map((p) => {
            const isPrimary = !!p.primary
            return (
              <Link
                key={p.label}
                href={p.cta.href}
                className={`group flex flex-col p-8 md:p-10 transition ${
                  isPrimary
                    ? 'bg-ink text-ivory border border-ink hover:bg-teal-ink'
                    : 'bg-paper border border-rule hover:border-ink'
                }`}
              >
                <h3 className={`font-sans font-medium text-[20px] md:text-[22px] leading-snug mb-3 jp-keep ${isPrimary ? 'text-ivory' : 'text-ink'}`}>
                  <JP>{p.label}</JP>
                </h3>
                <p className={`text-body-sm jp-break mb-6 ${isPrimary ? 'text-ivory/70' : 'text-dark-gray'}`}>
                  {p.desc}
                </p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-2.5 min-w-0">
                      <span aria-hidden className={`text-[12px] leading-[1.8] shrink-0 ${isPrimary ? 'text-bright-teal' : 'text-sekai-teal'}`}>✓</span>
                      <span className={`text-[13px] leading-relaxed jp-break ${isPrimary ? 'text-ivory/75' : 'text-dark-gray'}`}>{pt}</span>
                    </li>
                  ))}
                </ul>
                <span className={`inline-flex items-center gap-2 text-[13.5px] transition ${isPrimary ? 'text-bright-teal group-hover:text-ivory' : 'text-ink group-hover:text-sekai-teal'}`}>
                  {p.cta.label}
                  <IconArrowRight size={12} className="group-hover:translate-x-1 transition" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
