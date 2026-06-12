import Link from 'next/link'
import Image from 'next/image'
import { HERO_Q } from '@/content/home/copy-questions'
import { IMG } from '@/content/home/images'
import { IconArrowRight } from '@/components/Icons'
import { JP } from '@/components/JP'

export default function HeroQuestions() {
  return (
    <section className="relative bg-ivory overflow-hidden">
      {/* Soft editorial wash */}
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-[640px] h-[640px] rounded-full opacity-60 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #E8F2F3 0%, transparent 70%)' }}
      />

      <div className="container-edit relative section-hero">
        <p className="eyebrow-mono text-sekai-teal mb-5">{HERO_Q.eyebrow}</p>

        <div className="hero-grid">
          {/* ── Left : headline + answer + CTAs ── */}
          <div className="min-w-0 relative z-10 anim-fade-up">
            <h1 className="heading-display text-ink mb-8 jp-keep">
              <JP>{HERO_Q.headline.line1}</JP>
              <br />
              <span className="font-sans font-light text-sekai-teal">
                <JP>{HERO_Q.headline.line2}</JP>
              </span>
            </h1>

            <div className="rule-thin mb-8 max-w-[520px]" />

            <p className="lead mb-8 jp-break">{HERO_Q.body}</p>

            {/* Numbers strip — metric + meaning line */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10 border-y border-rule py-6">
              {HERO_Q.numbers.map((n) => (
                <div key={n.metric} className="flex flex-col min-w-0">
                  <span className="font-sans text-[18px] md:text-[22px] font-light text-ink leading-none mb-2 jp-keep">
                    <JP>{n.metric}</JP>
                  </span>
                  <span className="text-[10.5px] md:text-[11.5px] text-mid-gray leading-snug jp-keep">
                    <JP>{n.label}</JP>
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-4">
              <Link href={HERO_Q.primaryCta.href} className="btn btn-primary group">
                {HERO_Q.primaryCta.label}
                <IconArrowRight size={14} className="group-hover:translate-x-1 transition" />
              </Link>
              <Link href={HERO_Q.lightCta.href} className="btn-link group">
                {HERO_Q.lightCta.label}
                <IconArrowRight size={12} className="group-hover:translate-x-1 transition" />
              </Link>
            </div>

            <p className="text-caption text-mid-gray">{HERO_Q.microcopy}</p>
          </div>

          {/* ── Right : editorial figure ── */}
          <div className="relative min-w-0 anim-fade-up" style={{ animationDelay: '0.15s' }}>
            <p className="eyebrow-mono text-mid-gray mb-4">
              Plate No.01 — Managed Property, Kyoto
            </p>

            <div className="figure-frame relative aspect-[4/5] w-full">
              <Image
                src={IMG.heroMain.src}
                alt={IMG.heroMain.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 530px"
                quality={80}
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(7,58,62,0) 45%, rgba(7,58,62,0.28) 100%)',
                }}
              />
              <div className="absolute top-5 left-5 right-5 flex justify-between items-start text-ivory">
                <p className="eyebrow-mono !text-[10px] tracking-[0.24em]">SEKAI STAY</p>
              </div>
              <div className="absolute bottom-6 left-6 right-6 text-ivory">
                <p className="font-sans text-[42px] leading-none font-light">★ 4.8</p>
                <p className="text-caption text-ivory/80 mt-2 tracking-wider uppercase">
                  Guest review · Airbnb / Booking.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
