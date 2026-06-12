import Link from 'next/link'
import { SERVICE_BUCKETS } from '@/content/home/copy-v3'
import { IconArrowRight } from '@/components/Icons'
import { JP } from '@/components/JP'

export default function ServiceBuckets() {
  return (
    <section className="bg-mist">
      <div className="container-edit section-xl">
        <div className="heading-mb">
          <div className="chapter-marker">
            <span className="rule-teal-sm" />
            <span className="eyebrow">{SERVICE_BUCKETS.eyebrow}</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-end">
            <h2 className="heading-hero text-ink jp-keep">
              <JP>{SERVICE_BUCKETS.headline.line1}</JP>
            </h2>
            <p className="lead text-dark-gray jp-break">{SERVICE_BUCKETS.body}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-10">
          {SERVICE_BUCKETS.buckets.map((b) => (
            <div key={b.label} className="bg-paper border border-rule p-8 md:p-10 min-w-0 flex flex-col">
              <p className="eyebrow-mono text-sekai-teal mb-5">{b.label}</p>
              <h3 className="font-sans font-medium text-[19px] md:text-[21px] text-ink leading-snug mb-6 jp-keep">
                <JP>{b.title}</JP>
              </h3>
              <ul className="space-y-3.5 mt-auto">
                {b.items.map((item) => (
                  <li key={item} className="flex gap-3 min-w-0">
                    <span aria-hidden className="text-sekai-teal text-[13px] leading-[1.8] shrink-0">✓</span>
                    <span className="text-body-sm text-dark-gray jp-break">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Link href={SERVICE_BUCKETS.cta.href} className="btn-link group">
          {SERVICE_BUCKETS.cta.label}
          <IconArrowRight size={12} className="group-hover:translate-x-1 transition" />
        </Link>
      </div>
    </section>
  )
}
