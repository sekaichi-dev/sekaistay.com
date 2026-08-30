import Reveal from '@/components/motion/Reveal'
import AuditLink from '@/components/audit/AuditLink'

/**
 * [DESIGN_PARTS] CtaBand — 濃色(teal-deep)の行動喚起帯。主CTA＋任意の副リンク＋注記。
 */
export default function CtaBand({
  heading,
  lead,
  primaryHref = '/audit',
  primaryLabel = '無料収益診断を受ける',
  secondaryHref,
  secondaryLabel,
  note,
}: {
  heading: string
  lead?: string
  primaryHref?: string
  primaryLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
  note?: string
}) {
  return (
    <section className="w-full bg-navy-deep section-xl text-white">
      <Reveal as="div" className="container-edit text-center">
        <p className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-snug">{heading}</p>
        {lead && <p className="mx-auto mt-6 max-w-xl text-[15px] leading-[1.95] text-white/80">{lead}</p>}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {primaryHref === '/audit' ? (
            <AuditLink className="btn-cta group inline-flex min-h-[54px] items-center gap-2 rounded-md px-8 text-[15px] font-bold transition">
              {primaryLabel}
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </AuditLink>
          ) : (
            <a
              href={primaryHref}
              className="group inline-flex min-h-[54px] items-center gap-2 rounded-md bg-white px-8 text-[15px] font-bold text-navy transition hover:-translate-y-0.5"
            >
              {primaryLabel}
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          )}
          {secondaryHref && secondaryLabel && (
            <a href={secondaryHref} className="inline-flex items-center gap-2 text-[15px] font-bold text-white transition-opacity hover:opacity-70">
              {secondaryLabel}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          )}
        </div>
        {note && <p className="mt-12 text-[11px] tracking-[0.1em] text-white/40">{note}</p>}
      </Reveal>
    </section>
  )
}
