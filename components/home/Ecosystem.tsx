import Image from 'next/image'
import { ECOSYSTEM } from '@/content/home/copy'
import { IMG } from '@/content/home/images'
import {
  IconYouTube,
  IconAdBrand,
  IconInfluencerBrand,
  IconAshimotoBrand,
} from '@/components/Icons'
import { JP } from '@/components/JP'

const PILLAR_BRAND_MARKS: { render: () => JSX.Element; tag?: string }[] = [
  { render: () => <IconAdBrand size={36} />,         tag: 'Performance' },
  { render: () => <IconInfluencerBrand size={36} />, tag: 'Creator Network' },
  { render: () => <IconYouTube size={36} />,         tag: '20万+' },
  { render: () => <IconAshimotoBrand size={36} />,   tag: 'Production Partner' },
]

export default function Ecosystem() {
  return (
    <section className="bg-bone">
      <div className="container-edit section-xl">
        {/* Header */}
        <div className="heading-mb-lg">
          <div className="chapter-marker">
            <span className="rule-teal-sm" />
            <span className="eyebrow">{ECOSYSTEM.eyebrow}</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-end">
            <h2 className="heading-hero text-ink jp-keep">
              <JP>{ECOSYSTEM.headline.line1}</JP>
              <br />
              <span className="font-sans font-light text-sekai-teal">
                <JP>{ECOSYSTEM.headline.line2}</JP>
              </span>
            </h2>
            <p className="lead text-dark-gray jp-break">{ECOSYSTEM.body}</p>
          </div>
        </div>

        {/* Block 1 — Hospitality */}
        <article className="mb-12 md:mb-16 bg-paper border border-rule overflow-hidden">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-0">
            <div className="p-10 md:p-12 lg:p-16 order-2 lg:order-1">
              <p className="eyebrow mb-5">{ECOSYSTEM.hospitality.label}</p>

              <h3 className="font-sans font-medium text-[24px] md:text-[28px] text-ink mb-5 leading-snug jp-keep">
                <JP>{ECOSYSTEM.hospitality.title}</JP>
              </h3>

              <p className="text-body text-dark-gray mb-6 jp-break">
                {ECOSYSTEM.hospitality.body}
              </p>

              <div className="border-l-2 border-sekai-teal pl-5 py-2">
                <p className="text-body-sm text-ink font-sans jp-break">
                  「{ECOSYSTEM.hospitality.supporting}」
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative bg-ink min-h-[280px] lg:min-h-[520px]">
              <div className="grid grid-cols-2 grid-rows-2 h-full gap-0">
                <div className="relative row-span-2 overflow-hidden">
                  <Image src={IMG.fbNojiri.src} alt={IMG.fbNojiri.alt} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
                  <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(7,58,62,0.05) 0%, rgba(7,58,62,0.7) 100%)' }} />
                  <div className="absolute bottom-5 left-5 right-5 text-ivory">
                    <p className="eyebrow-mono text-ivory/70 mb-2">Spot 01</p>
                    <p className="font-sans text-[17px] font-medium">The World Cafe</p>
                    <p className="text-[11.5px] text-ivory/80 font-sans mt-1">東京・中目黒</p>
                  </div>
                </div>
                <div className="relative overflow-hidden">
                  <Image src={IMG.fbKyoto.src} alt={IMG.fbKyoto.alt} fill sizes="(max-width: 1024px) 25vw, 15vw" className="object-cover" />
                  <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(7,58,62,0.05) 0%, rgba(7,58,62,0.7) 100%)' }} />
                  <div className="absolute bottom-4 left-4 right-4 text-ivory">
                    <p className="eyebrow-mono text-ivory/70 mb-1 !text-[9px]">Spot 02</p>
                    <p className="font-sans text-[13px] font-medium">Kyoto F&amp;B</p>
                  </div>
                </div>
                <div className="relative overflow-hidden bg-teal-ink flex flex-col justify-between p-5">
                  <p className="eyebrow-mono text-bright-teal">Spot 03+</p>
                  <div className="text-ivory">
                    <p className="font-sans text-[14px] font-medium">Other Spots</p>
                    <p className="text-[11px] text-ivory/70 font-sans mt-1">全国に展開</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Block 2 — Media */}
        <article className="border border-rule overflow-hidden">
          <div className="relative bg-ink text-ivory overflow-hidden">
            <div aria-hidden className="absolute inset-0 opacity-20">
              <Image src={IMG.mediaStudio.src} alt="" fill sizes="100vw" className="object-cover" />
            </div>
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, rgba(7,58,62,0.95) 0%, rgba(22,123,129,0.7) 100%)' }}
            />
            <div className="relative p-10 md:p-14">
              <p className="eyebrow !text-bright-teal mb-5">{ECOSYSTEM.media.label}</p>
              <h3 className="font-sans font-medium text-[24px] md:text-[30px] text-ivory mb-5 max-w-[620px] leading-snug jp-keep">
                <JP>{ECOSYSTEM.media.title}</JP>
              </h3>
              <p className="text-body text-ivory/80 max-w-[720px] jp-break">
                {ECOSYSTEM.media.body}
              </p>
            </div>
          </div>

          {/* Pillars */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 bg-rule gap-px">
            {ECOSYSTEM.media.pillars.map((p, i) => {
              const mark = PILLAR_BRAND_MARKS[i]
              return (
                <div key={p.title} className="bg-paper p-7 md:p-8 flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {mark.render()}
                      {mark.tag && (
                        <span className="eyebrow-mono text-mid-gray !text-[9px]">
                          {mark.tag}
                        </span>
                      )}
                    </div>
                    <span className="font-sans text-[16px] text-mid-gray">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h4 className="font-sans font-medium text-[17px] md:text-[18px] text-ink mb-3 leading-snug jp-keep">
                    <JP>{p.title}</JP>
                  </h4>

                  <p className="text-body-sm text-dark-gray jp-break">{p.body}</p>
                </div>
              )
            })}
          </div>
        </article>
      </div>
    </section>
  )
}
