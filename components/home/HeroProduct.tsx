import Link from 'next/link'
import Image from 'next/image'
import { HERO_V3 } from '@/content/home/copy-v3'
import { IconArrowRight } from '@/components/Icons'
import { JP } from '@/components/JP'

export default function HeroProduct() {
  return (
    <section className="relative bg-ivory overflow-hidden">
      {/* Soft editorial wash */}
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-[720px] h-[720px] rounded-full opacity-60 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #E8F2F3 0%, transparent 70%)' }}
      />

      <div className="container-edit relative section-hero !pb-0">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* ── Left : claim + CTAs ── */}
          <div className="lg:col-span-5 min-w-0 relative z-10 anim-fade-up">
            <p className="eyebrow-mono text-sekai-teal mb-5">{HERO_V3.eyebrow}</p>

            <h1 className="heading-display text-ink mb-7 jp-keep">
              <JP>{HERO_V3.headline.line1}</JP>
              <br />
              <span className="font-sans font-light text-sekai-teal">
                <JP>{HERO_V3.headline.line2}</JP>
              </span>
            </h1>

            <div className="rule-thin mb-7 max-w-[480px]" />

            <p className="lead mb-8 jp-break">{HERO_V3.body}</p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-4">
              <Link href={HERO_V3.primaryCta.href} className="btn btn-primary group">
                {HERO_V3.primaryCta.label}
                <IconArrowRight size={14} className="group-hover:translate-x-1 transition" />
              </Link>
              <Link href={HERO_V3.secondaryCta.href} className="btn-link group">
                {HERO_V3.secondaryCta.label}
                <IconArrowRight size={12} className="group-hover:translate-x-1 transition" />
              </Link>
            </div>

            <p className="text-caption text-mid-gray mb-8">{HERO_V3.microcopy}</p>

            <p className="eyebrow-mono !text-[10px] text-mid-gray">{HERO_V3.license}</p>
          </div>

          {/* ── Right : product plate ── */}
          <div className="lg:col-span-7 relative min-w-0 anim-fade-up" style={{ animationDelay: '0.15s' }}>
            <p className="eyebrow-mono text-mid-gray mb-4">
              Plate No.01 — Owner Dashboard, Live Demo
            </p>
            <div className="relative">
              <div className="figure-frame relative aspect-[2520/1960] w-full shadow-lift-lg">
                <Image
                  src={HERO_V3.productImage.src}
                  alt={HERO_V3.productImage.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 760px"
                  quality={85}
                  className="object-cover object-top"
                />
              </div>
              {/* Floating award chip */}
              <div className="absolute -bottom-5 left-5 md:left-8 bg-ink text-ivory px-5 py-3.5 shadow-lift flex items-baseline gap-3 max-w-[88%]">
                <span className="font-sans text-bright-teal text-[15px] leading-none shrink-0">No.1</span>
                <span className="font-sans text-[12px] md:text-[12.5px] leading-snug jp-keep">
                  <JP>{HERO_V3.award}</JP>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Numbers strip ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 border-y border-rule py-7 mt-14 md:mt-16">
          {HERO_V3.numbers.map((n) => (
            <div key={n.label} className="flex flex-col min-w-0">
              <span className="font-sans text-[24px] md:text-[30px] font-light text-ink leading-none mb-2 tabular-nums jp-keep">
                {n.metric}
              </span>
              <span className="text-[11px] md:text-[12px] text-mid-gray leading-snug jp-keep">
                <JP>{n.label}</JP>
              </span>
            </div>
          ))}
        </div>
        <p className="text-caption text-mid-gray pt-3 pb-10">
          出典: 当社管理物件（Airbnb / Booking.com ほか主要OTA掲載）2024-2025 集計
        </p>
      </div>
    </section>
  )
}
