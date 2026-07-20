import Image from 'next/image'
import { VALUE } from '@/content/home/copy'
import { IMG } from '@/content/home/images'
import { JP } from '@/components/JP'

export default function ValueProp() {
  return (
    <section className="bg-ivory">
      <div className="container-edit section-xl">
        {/* Header */}
        <div className="heading-mb-lg">
          <div className="chapter-marker">
            <span className="rule-teal-sm" />
            <span className="eyebrow">The Difference</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-end">
            <h2 className="heading-hero text-ink jp-keep">
              <JP>{VALUE.headline.line1}</JP>
              <span className="block"><JP>{VALUE.headline.line2}</JP></span>
            </h2>
            <p className="lead text-dark-gray jp-break">
              {VALUE.body}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[0.42fr_0.58fr] gap-10 md:gap-16">
          {/* Figure */}
          <div className="relative lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow-mono text-mid-gray mb-4">Plate No.04 — Kyoto</p>
            <div className="figure-frame relative aspect-[4/5]">
              <Image
                src={IMG.valueAccent.src}
                alt={IMG.valueAccent.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-40"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(7,58,62,0) 0%, rgba(7,58,62,0.85) 100%)',
                }}
              />
              <div className="absolute bottom-7 left-7 right-7 text-ivory">
                <p className="eyebrow !text-bright-teal mb-3">Not Just Management</p>
                <p className="font-sans font-light text-[26px] leading-tight">
                  宿は、<span className="font-sans text-ivory">設計で伸びる。</span>
                </p>
              </div>
            </div>
          </div>

          {/* Items as editorial list */}
          <ol className="space-y-0">
            {VALUE.items.map((item, i) => (
              <li
                key={item.number}
                className={`py-10 md:py-12 grid grid-cols-[auto_1fr] gap-6 md:gap-10 ${
                  i !== 0 ? 'border-t border-rule' : ''
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-sans font-light text-[56px] text-sekai-teal leading-none">
                    {item.number}
                  </span>
                </div>
                <div className="pt-3">
                  <h3 className="font-sans text-[22px] md:text-[26px] font-medium text-ink mb-4 leading-snug jp-keep">
                    <JP>{item.title}</JP>
                  </h3>
                  <p className="text-body text-dark-gray jp-break">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
