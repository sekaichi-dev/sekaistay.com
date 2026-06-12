import Link from 'next/link'
import Image from 'next/image'
import { PRODUCT_SHOWCASE } from '@/content/home/copy-v3'
import { IconArrowRight } from '@/components/Icons'
import { JP } from '@/components/JP'

export default function ProductShowcase() {
  return (
    <section className="bg-paper">
      <div className="container-edit section-xl">
        {/* Header */}
        <div className="heading-mb">
          <div className="chapter-marker">
            <span className="rule-teal-sm" />
            <span className="eyebrow">{PRODUCT_SHOWCASE.eyebrow}</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-end">
            <h2 className="heading-hero text-ink jp-keep">
              <JP>{PRODUCT_SHOWCASE.headline.line1}</JP>
              <br />
              <span className="font-sans font-light text-sekai-teal">
                <JP>{PRODUCT_SHOWCASE.headline.line2}</JP>
              </span>
            </h2>
            <p className="lead text-dark-gray jp-break">{PRODUCT_SHOWCASE.body}</p>
          </div>
        </div>

        {/* Wide product plate — upcoming bookings & recommended actions */}
        <p className="eyebrow-mono text-mid-gray mb-4">
          Plate No.02 — Upcoming Bookings & Recommended Actions
        </p>
        <div className="figure-frame relative aspect-[2300/1000] w-full shadow-lift mb-12 md:mb-14">
          <Image
            src={PRODUCT_SHOWCASE.image.src}
            alt={PRODUCT_SHOWCASE.image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 1180px"
            quality={85}
            className="object-cover object-top"
          />
        </div>

        {/* Bullets + CTA */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-10 mb-7">
          {PRODUCT_SHOWCASE.bullets.map((b) => (
            <div key={b.title} className="border-l-2 border-sekai-teal pl-5 min-w-0">
              <p className="font-sans font-medium text-[16.5px] md:text-[17.5px] text-ink leading-snug mb-1.5 jp-keep">
                <JP>{b.title}</JP>
              </p>
              <p className="text-body-sm text-dark-gray jp-break">{b.body}</p>
            </div>
          ))}
        </div>
        <div className="mb-16 md:mb-20">
          <Link href={PRODUCT_SHOWCASE.cta.href} className="btn btn-primary group">
            {PRODUCT_SHOWCASE.cta.label}
            <IconArrowRight size={14} className="group-hover:translate-x-1 transition" />
          </Link>
          <p className="text-caption text-mid-gray mt-3">{PRODUCT_SHOWCASE.ctaMicrocopy}</p>
        </div>

        {/* Mini features — the engine behind the numbers */}
        <div className="grid md:grid-cols-3 border-t border-l border-rule">
          {PRODUCT_SHOWCASE.miniFeatures.map((f) => (
            <div key={f.title} className="border-b border-r border-rule p-7 md:p-9 min-w-0 bg-ivory">
              <div className="flex items-baseline gap-2 mb-5">
                <span className="font-sans font-light text-[26px] text-sekai-teal leading-none jp-keep">{f.stat}</span>
                <span className="eyebrow-mono text-mid-gray">{f.statLabel}</span>
              </div>
              <p className="font-sans font-medium text-[17px] text-ink leading-snug mb-2.5 jp-keep">
                <JP>{f.title}</JP>
              </p>
              <p className="text-body-sm text-dark-gray jp-break">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
