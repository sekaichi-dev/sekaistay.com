import Link from 'next/link'
import Image from 'next/image'
import { ENTRY } from '@/content/home/copy'
import { IMG } from '@/content/home/images'
import { IconArrowRight } from '@/components/Icons'
import { JP } from '@/components/JP'

const IMAGES = {
  existing: IMG.entryExisting,
  starting: IMG.entryStarting,
  exploring: IMG.entryExploring,
} as const

export default function EntryPoints() {
  return (
    <section className="bg-ivory">
      <div className="container-edit section-lg">
        {/* Header */}
        <div className="heading-mb-lg grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-7">
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <span className="eyebrow">Three Entrances</span>
            </div>
            <h2 className="heading-hero text-ink jp-keep">
              <JP>{ENTRY.headline}</JP>
            </h2>
          </div>
          <p className="md:col-span-5 text-body-sm text-dark-gray jp-break md:pb-2">
            {ENTRY.body}
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {ENTRY.cards.map((c, i) => {
            const img = IMAGES[c.id as keyof typeof IMAGES]
            return (
              <Link
                key={c.id}
                href={c.cta.href}
                className="group relative flex flex-col bg-paper border border-rule overflow-hidden transition-all duration-500 hover:border-ink"
              >
                {/* Number */}
                <span className="absolute top-5 right-5 z-10 font-sans text-[40px] font-light text-ivory/80 mix-blend-difference leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 360px"
                    quality={75}
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-[800ms]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(26,26,26,0) 45%, rgba(26,26,26,0.45) 100%)',
                    }}
                  />
                  <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between text-ivory">
                    <p className="eyebrow !text-ivory tracking-[0.32em]">{c.label}</p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-7 md:p-8 flex flex-col flex-1">
                  <h3 className="font-sans text-[19px] md:text-[20px] font-medium text-ink mb-4 leading-snug jp-keep">
                    <JP>{c.title}</JP>
                  </h3>

                  <p className="text-body-sm text-dark-gray mb-7 flex-1 jp-break">
                    {c.body}
                  </p>

                  <span className="inline-flex items-center gap-3 text-[12.5px] font-medium uppercase tracking-[0.16em] text-ink group-hover:text-sekai-teal transition">
                    {c.cta.label}
                    <span className="block w-6 h-px bg-ink group-hover:bg-sekai-teal group-hover:w-10 transition-all" />
                    <IconArrowRight size={12} />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
