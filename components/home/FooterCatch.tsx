import { FOOTER_CATCH } from '@/content/home/copy'
import { JP } from '@/components/JP'

export default function FooterCatch() {
  return (
    <section className="bg-paper border-t border-rule">
      <div className="container-narrow section-lg text-center">
        <div className="flex items-center justify-center gap-4 mb-10">
          <span className="w-10 h-px bg-sekai-teal" />
          <span className="eyebrow-mono text-sekai-teal">Epilogue</span>
          <span className="w-10 h-px bg-sekai-teal" />
        </div>

        <p className="font-sans text-[17px] md:text-[21px] text-ink leading-[2] tracking-[0.02em] jp-keep max-w-2xl mx-auto">
          <JP>{FOOTER_CATCH.body}</JP>
        </p>

        <div className="mt-12 flex items-center justify-center gap-4">
          <span className="w-6 h-px bg-rule" />
          <span className="font-sans text-[14px] text-mid-gray">
            SEKAI STAY
          </span>
          <span className="w-6 h-px bg-rule" />
        </div>
      </div>
    </section>
  )
}
