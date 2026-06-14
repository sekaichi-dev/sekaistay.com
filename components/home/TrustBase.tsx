import { TRUST_BASE } from '@/content/home/copy-questions'
import { JP } from '@/components/JP'

export default function TrustBase() {
  return (
    <section className="bg-white">
      <div className="container-edit section-xl">
        <div className="heading-mb">
          <div className="chapter-marker">
            <span className="rule-teal-sm" />
            <span className="eyebrow">{TRUST_BASE.eyebrow}</span>
          </div>
          <h2 className="heading-hero text-ink jp-keep">
            <JP>{TRUST_BASE.headline}</JP>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-rule rounded-switch-lg overflow-hidden">
          {TRUST_BASE.items.map((item) => (
            <div key={item.primary} className="border-b border-r border-rule p-7 md:p-8 min-w-0 hover:bg-switch-cloud transition">
              <p className="font-sans font-medium text-[17px] md:text-[18px] text-ink leading-snug mb-2 jp-keep">
                <JP>{item.primary}</JP>
              </p>
              <p className="text-body-sm text-dark-gray jp-break">{item.secondary}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
