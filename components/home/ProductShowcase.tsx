import { PRODUCT_SHOWCASE } from '@/content/home/copy-v3'
import { JP } from '@/components/JP'
import DashboardDemo from '@/components/switch/DashboardDemo'

export default function ProductShowcase() {
  return (
    <section className="bg-white">
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

        {/* Live interactive demo（/switch/portal と同一の DashboardDemo） + bullets */}
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-14 items-start mb-16 md:mb-20">
          <div className="min-w-0 order-2 lg:order-1">
            <p className="eyebrow-mono text-sekai-teal mb-6">Owner App — Interactive Demo</p>
            <div className="space-y-7">
              {PRODUCT_SHOWCASE.bullets.map((b) => (
                <div key={b.title} className="border-l-2 border-sekai-teal pl-5 min-w-0">
                  <p className="font-sans font-medium text-[16.5px] md:text-[17.5px] text-ink leading-snug mb-1.5 jp-keep">
                    <JP>{b.title}</JP>
                  </p>
                  <p className="text-body-sm text-dark-gray jp-break">{b.body}</p>
                </div>
              ))}
            </div>
            <p className="text-caption text-mid-gray mt-8 jp-break">
              下のデモはタブを切り替えて操作できます。実データを匿名化したサンプルです。
            </p>
          </div>

          <div className="min-w-0 order-1 lg:order-2">
            <DashboardDemo />
          </div>
        </div>

        {/* Mini features — the engine behind the numbers */}
        <div className="grid md:grid-cols-3 border-t border-l border-switch-stone-border">
          {PRODUCT_SHOWCASE.miniFeatures.map((f) => (
            <div key={f.title} className="border-b border-r border-switch-stone-border p-7 md:p-9 min-w-0 bg-switch-cloud">
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
