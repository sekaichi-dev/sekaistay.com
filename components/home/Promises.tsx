import { PROMISES } from '@/content/home/copy-questions'
import { JP } from '@/components/JP'

export default function Promises() {
  return (
    <section className="bg-mist">
      <div className="container-edit section-xl">
        <div className="heading-mb">
          <div className="chapter-marker">
            <span className="rule-teal-sm" />
            <span className="eyebrow">{PROMISES.eyebrow}</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-end">
            <h2 className="heading-hero text-ink jp-keep">
              <JP>{PROMISES.headline}</JP>
            </h2>
            <p className="lead text-dark-gray jp-break">{PROMISES.lead}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* します */}
          <div className="bg-paper border border-rule p-8 md:p-10">
            <p className="eyebrow-mono text-sekai-teal mb-7">私たちは、します</p>
            <ul className="space-y-6">
              {PROMISES.dos.map((p) => (
                <li key={p.title} className="flex gap-4 min-w-0">
                  <span aria-hidden className="font-sans text-sekai-teal text-[15px] leading-[1.7] shrink-0">✓</span>
                  <div className="min-w-0">
                    <p className="font-sans font-medium text-[15.5px] md:text-[16.5px] text-ink leading-snug mb-1 jp-keep">
                      <JP>{p.title}</JP>
                    </p>
                    <p className="text-body-sm text-dark-gray jp-break">{p.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* しません */}
          <div className="bg-ink text-ivory border border-ink p-8 md:p-10">
            <p className="eyebrow-mono text-bright-teal mb-7">私たちは、しません</p>
            <ul className="space-y-6">
              {PROMISES.donts.map((p) => (
                <li key={p.title} className="flex gap-4 min-w-0">
                  <span aria-hidden className="font-sans text-bright-teal text-[15px] leading-[1.7] shrink-0">✗</span>
                  <div className="min-w-0">
                    <p className="font-sans font-medium text-[15.5px] md:text-[16.5px] text-ivory leading-snug mb-1 jp-keep">
                      <JP>{p.title}</JP>
                    </p>
                    <p className="text-body-sm text-ivory/70 jp-break">{p.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
