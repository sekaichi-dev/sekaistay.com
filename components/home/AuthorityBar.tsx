import { AUTHORITY } from '@/content/home/copy'
import { JP } from '@/components/JP'

export default function AuthorityBar() {
  return (
    <section aria-label="信頼できる運営体制" className="bg-paper border-y border-rule">
      <div className="container-edit py-10 md:py-12">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
          {/* Label */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <span className="rule-teal-sm" />
            <span className="eyebrow">{AUTHORITY.label}</span>
          </div>

          {/* 3 Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-6 flex-1">
            {AUTHORITY.items.map((item) => (
              <div key={item.metric} className="flex flex-col min-w-0 relative pl-4 lg:pl-5">
                <span className="absolute left-0 top-1 bottom-1 w-px bg-rule" aria-hidden />
                <span className="font-sans text-[22px] md:text-[24px] font-light text-ink leading-none mb-2 jp-keep">
                  <JP>{item.metric}</JP>
                </span>
                <span className="text-[11.5px] text-dark-gray leading-snug jp-keep">
                  <JP>{item.label}</JP>
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 pt-6 border-t border-rule text-caption text-mid-gray leading-relaxed jp-break max-w-4xl">
          {AUTHORITY.note}
        </p>
      </div>
    </section>
  )
}
