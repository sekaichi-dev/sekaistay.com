import { HOW_IT_WORKS } from '@/content/home/copy-v3'
import { JP } from '@/components/JP'

export default function HowItWorks() {
  return (
    <section className="bg-white">
      <div className="container-edit section-xl">
        <div className="heading-mb">
          <div className="chapter-marker">
            <span className="rule-teal-sm" />
            <span className="eyebrow">{HOW_IT_WORKS.eyebrow}</span>
          </div>
          <h2 className="heading-hero text-ink jp-keep">
            <JP>{HOW_IT_WORKS.headline}</JP>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {HOW_IT_WORKS.steps.map((s) => (
            <div key={s.num} className="bg-white border border-switch-stone-border rounded-switch-lg shadow-switch-card p-8 md:p-10 min-w-0">
              <div className="flex items-baseline justify-between gap-3 mb-6">
                <span className="font-sans font-light text-[30px] text-sekai-teal leading-none tabular-nums">{s.num}</span>
                <span className="eyebrow-mono text-mid-gray jp-keep">{s.duration}</span>
              </div>
              <h3 className="font-sans font-medium text-[20px] md:text-[22px] text-ink leading-snug mb-3 jp-keep">
                <JP>{s.title}</JP>
              </h3>
              <p className="text-body-sm text-dark-gray jp-break">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
