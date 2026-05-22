import Link from 'next/link'
import Image from 'next/image'
import { FINAL_CTA } from '@/content/home/copy'
import { IMG } from '@/content/home/images'
import { IconArrowRight } from '@/components/Icons'
import { JP } from '@/components/JP'

export default function FinalCTA() {
  return (
    <section className="relative text-ivory overflow-hidden bg-ink">
      {/* Background image */}
      <div aria-hidden className="absolute inset-0 opacity-40">
        <Image
          src={IMG.finalCta.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Editorial gradient scrim */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(7,58,62,0.92) 0%, rgba(22,123,129,0.65) 45%, rgba(7,58,62,0.95) 100%)',
        }}
      />

      {/* Teal atmospheric glow */}
      <div
        aria-hidden
        className="absolute -top-64 -left-64 w-[720px] h-[720px] rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(84,190,195,0.5) 0%, transparent 70%)' }}
      />

      <div className="relative container-edit section-xl">
        {/* Chapter header */}
        <div className="flex items-center gap-4 mb-10 md:mb-12">
          <span className="w-6 h-px bg-bright-teal" />
          <span className="eyebrow !text-bright-teal">Start Here</span>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-20 items-center">
          {/* Left — Statement */}
          <div className="min-w-0">
            <h2 className="heading-masthead text-ivory jp-break mb-8">
              <JP>{FINAL_CTA.headline}</JP>
            </h2>
            <p className="text-body-lg text-ivory/80 jp-break max-w-[540px] mb-10">
              {FINAL_CTA.body}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <Link
                href={FINAL_CTA.primaryCta.href}
                className="btn bg-ivory text-teal-ink hover:bg-bright-teal hover:text-ivory border-ivory w-full sm:w-auto"
              >
                {FINAL_CTA.primaryCta.label}
                <IconArrowRight size={14} />
              </Link>
              <Link
                href={FINAL_CTA.secondaryCta.href}
                className="btn border-ivory/40 text-ivory hover:bg-ivory/10 hover:border-ivory w-full sm:w-auto"
              >
                {FINAL_CTA.secondaryCta.label}
              </Link>
            </div>

            <Link
              href="/services#pricing"
              className="inline-flex items-center gap-2 mt-8 font-sans text-[15px] text-ivory/80 hover:text-ivory border-b border-ivory/30 hover:border-ivory pb-1 transition"
            >
              30秒で年間損失額を試算する
              <IconArrowRight size={12} />
            </Link>
          </div>

          {/* Right — Editorial note card */}
          <div className="relative lg:pl-10 min-w-0">
            <div className="border-l border-bright-teal/40 pl-8 md:pl-10">
              <p className="eyebrow-mono text-bright-teal mb-5">
                A Note for the Owner
              </p>
              <p className="font-sans font-light text-[26px] md:text-[30px] lg:text-[34px] leading-[1.3] text-ivory mb-8">
                宿は、&nbsp;
                <br className="hidden md:block" />
                <span className="font-sans">
                  所有するだけの資産から、
                </span>
                <br />
                <span className="text-bright-teal">
                  届けられる体験へ。
                </span>
              </p>
              <div className="flex items-center gap-4">
                <span className="w-8 h-px bg-ivory/30" />
                <span className="eyebrow-mono text-ivory/50">
                  SEKAI STAY
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom ghost wordmark */}
        <div className="mt-16 md:mt-24 pt-10 border-t border-ivory/10">
          <div className="flex flex-col md:flex-row items-baseline justify-between gap-4">
            <p className="eyebrow-mono text-ivory/40">
              住宅宿泊管理業 — 国土交通大臣(01) 第F05780号 / Tokyo · Osaka · Kyoto
            </p>
            <p className="font-sans font-light text-[20px] md:text-[22px] text-ivory/30 tracking-[0.08em]">
              SEKAI · STAY · VACATION · RENTAL
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
