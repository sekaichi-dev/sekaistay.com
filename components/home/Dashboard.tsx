import Link from 'next/link'
import { DASHBOARD } from '@/content/home/copy'
import { IconArrowRight } from '@/components/Icons'
import { JP } from '@/components/JP'

export default function Dashboard() {
  return (
    <section className="bg-ink text-ivory relative overflow-hidden">
      {/* Teal atmospheric glow */}
      <div
        aria-hidden
        className="absolute -top-48 -right-48 w-[620px] h-[620px] rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(22,123,129,0.4) 0%, transparent 70%)' }}
      />

      <div className="relative container-edit section-xl">
        {/* Header */}
        <div className="heading-mb">
          <div className="chapter-marker">
            <span className="w-6 h-px bg-bright-teal" />
            <span className="eyebrow !text-bright-teal">Owner Dashboard</span>
          </div>
          <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-end">
            <h2 className="heading-hero !font-sans text-ivory jp-keep">
              <JP>{DASHBOARD.headline.line1}</JP>
              <br />
              <span className="font-sans font-light text-bright-teal">
                <JP>{DASHBOARD.headline.line2}</JP>
              </span>
            </h2>
            <p className="text-body text-ivory/70 jp-break">
              {DASHBOARD.body}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-center">
          <div className="lg:pr-8">
            <p className="eyebrow-mono text-ivory/50 mb-6">Plate — live preview</p>
            <div className="space-y-5 mb-10">
              {DASHBOARD.items.map((item, i) => (
                <div key={item} className="flex items-baseline gap-5 pb-5 border-b border-ivory/10">
                  <span className="font-sans text-[18px] text-bright-teal tabular-nums w-8">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-body-sm text-ivory">{item}</span>
                </div>
              ))}
            </div>

            <Link href={DASHBOARD.cta.href} className="btn bg-ivory text-ink hover:bg-bright-teal hover:text-ivory border-ivory">
              {DASHBOARD.cta.label}
              <IconArrowRight size={14} />
            </Link>
          </div>

          {/* Mockup */}
          <div className="bg-paper p-5 md:p-7 shadow-lift-lg">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-rule">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-light-gray" />
                <span className="w-2 h-2 rounded-full bg-light-gray" />
                <span className="w-2 h-2 rounded-full bg-light-gray" />
              </div>
              <span className="eyebrow-mono text-mid-gray !text-[10px]">owner.sekaistay.com</span>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-teal-tint p-4 min-w-0">
                <div className="eyebrow-mono text-sekai-teal mb-2 !text-[9px]">今月売上</div>
                <div className="font-sans font-light text-[22px] text-ink leading-none truncate">¥1.34M</div>
                <div className="text-[10px] text-sekai-teal mt-1 font-sans">+18% MoM</div>
              </div>
              <div className="bg-mist p-4 min-w-0">
                <div className="eyebrow-mono text-mid-gray mb-2 !text-[9px]">稼働率</div>
                <div className="font-sans font-light text-[22px] text-ink leading-none">82%</div>
                <div className="text-[10px] text-sekai-teal mt-1 font-sans">約1.4倍</div>
              </div>
              <div className="bg-mist p-4 min-w-0">
                <div className="eyebrow-mono text-mid-gray mb-2 !text-[9px]">予約ペース</div>
                <div className="font-sans font-light text-[22px] text-ink leading-none">順調</div>
                <div className="text-[10px] text-mid-gray mt-1 font-sans">vs 先月</div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-mist p-5 mb-5">
              <div className="flex items-center justify-between mb-4">
                <div className="eyebrow-mono text-ink !text-[10px]">Review Trend</div>
                <div className="flex items-baseline gap-1">
                  <span className="font-sans text-[16px] text-sekai-teal">4.8</span>
                  <span className="text-[10px] text-mid-gray">／5.0</span>
                </div>
              </div>
              <div className="flex items-end justify-between gap-2 h-24">
                {[
                  { h: 35, m: '11' }, { h: 48, m: '12' }, { h: 55, m: '1' },
                  { h: 62, m: '2' }, { h: 78, m: '3' }, { h: 92, m: '4' },
                ].map((b, i, arr) => {
                  const isLast = i === arr.length - 1
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full">
                      <div className="flex-1 w-full flex items-end">
                        <div
                          className={`w-full transition-all ${isLast ? 'bg-sekai-teal' : 'bg-ink'}`}
                          style={{ height: `${b.h}%`, opacity: isLast ? 1 : 0.15 + i * 0.12 }}
                        />
                      </div>
                      <span className="font-mono text-[9px] text-mid-gray leading-none">{b.m}月</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <div className="eyebrow-mono text-mid-gray mb-3">改善アクション</div>
              {[
                { txt: '週末価格の見直し（+8%想定）', tag: '優先' },
                { txt: 'ギャラリー写真2枚の差し替え', tag: '中' },
                { txt: '多言語リスティング調整', tag: '低' },
              ].map((a, i) => (
                <div key={i} className="flex items-center justify-between gap-3 bg-ivory border border-rule px-4 py-3 min-w-0">
                  <span className="text-[12.5px] text-ink truncate">{a.txt}</span>
                  <span className={`eyebrow-mono !text-[9px] px-2 py-1 flex-shrink-0 ${
                    a.tag === '優先' ? 'bg-sekai-teal text-ivory' : 'bg-rule text-dark-gray'
                  }`}>
                    {a.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
