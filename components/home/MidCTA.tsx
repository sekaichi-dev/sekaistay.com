import Link from 'next/link'
import { MID_CTA } from '@/content/home/copy'
import { JP } from '@/components/JP'
import { IconArrowRight } from '@/components/Icons'

export default function MidCTA() {
  return (
    <section className="relative text-ivory overflow-hidden bg-teal-ink">
      {/* Atmospheric glow */}
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(84,190,195,0.5) 0%, transparent 70%)' }}
      />

      <div className="relative container-edit py-16 md:py-20">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-center">
          <div>
            <h2 className="font-sans font-light text-[28px] md:text-[36px] lg:text-[40px] leading-[1.3] text-ivory mb-5 jp-keep">
              <JP>{MID_CTA.headline}</JP>
            </h2>
            <p className="text-body-lg text-ivory/80 jp-break max-w-[540px]">
              {MID_CTA.body}
            </p>
          </div>

          <div className="lg:justify-self-end flex flex-col items-start lg:items-end gap-3">
            <Link
              href={MID_CTA.cta.href}
              className="btn bg-ivory text-teal-ink hover:bg-bright-teal hover:text-ivory border-ivory inline-flex"
            >
              {MID_CTA.cta.label}
              <IconArrowRight size={14} />
            </Link>
            <p className="text-caption text-ivory/60">
              {MID_CTA.microcopy}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
