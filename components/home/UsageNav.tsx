import { USAGE_NAV } from '@/content/home/copy-questions'
import { JP } from '@/components/JP'

export default function UsageNav() {
  return (
    <section className="bg-paper">
      <div className="container-edit section-xl">
        <div className="heading-mb">
          <div className="chapter-marker">
            <span className="rule-teal-sm" />
            <span className="eyebrow">{USAGE_NAV.eyebrow}</span>
          </div>
          <h2 className="heading-hero text-ink jp-keep">
            <JP>{USAGE_NAV.headline.line1}</JP>
            <br />
            <span className="font-sans font-light text-sekai-teal">
              <JP>{USAGE_NAV.headline.line2}</JP>
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {USAGE_NAV.lanes.map((lane) => (
            <div key={lane.id} className="bg-ivory border border-rule p-8 md:p-10 flex flex-col">
              <p className="eyebrow-mono text-sekai-teal mb-6">{lane.label}</p>
              <div className="space-y-4 mb-7 pb-7 border-b border-rule">
                {lane.quotes.map((quote) => (
                  <p key={quote} className="font-sans text-[15px] md:text-[16px] text-ink leading-relaxed jp-break">
                    {quote}
                  </p>
                ))}
              </div>
              <p className="text-body-sm text-dark-gray jp-break">{lane.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-caption text-mid-gray jp-break">{USAGE_NAV.footnote}</p>
      </div>
    </section>
  )
}
