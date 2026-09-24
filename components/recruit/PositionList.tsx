import Reveal from '@/components/motion/Reveal'
import type { RecruitPosition } from '@/data/recruit'

/**
 * [DESIGN_PARTS 派生] EditorialList（番号＋ヘアライン罫線）の派生。
 * 募集要項は「仕事内容」「求める人物像」の2ブロックを抱えるため、
 * EditorialList の body 1本では収まらない。番号・罫線・タイポ主体という原則は
 * そのままに、本文部だけ2カラムへ展開した合成パーツ（ピクトグラム不使用）。
 */
export default function PositionList({ positions }: { positions: RecruitPosition[] }) {
  return (
    <Reveal as="div" stagger className="grid">
      {positions.map((p, i) => (
        <article key={p.id} id={p.id} className="scroll-mt-28 border-t border-rule py-9 sm:py-11">
          <div className="flex gap-5 sm:gap-6">
            <span className="shrink-0 font-grotesk text-[clamp(1.5rem,2.4vw,2.125rem)] font-bold leading-none tabular-nums text-sekai-teal">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-[clamp(1.125rem,1.7vw,1.375rem)] font-bold leading-snug text-ink">{p.title}</h3>
                <span className="font-grotesk text-[13px] font-bold tracking-[0.02em] text-sekai-teal">{p.en}</span>
              </div>
              <p className="mt-2 text-[13px] leading-[1.9] text-ink/55">
                {p.employment} ／ {p.location}
              </p>
              <p className="mt-4 text-[13.5px] leading-[1.9] text-ink/70">{p.summary}</p>

              <div className="mt-7 grid gap-x-12 gap-y-7 sm:grid-cols-2">
                <div>
                  <p className="font-grotesk text-[12px] font-bold uppercase tracking-[0.14em] text-ink/45">Job description</p>
                  <ul className="mt-4 space-y-3">
                    {p.duties.map((d) => (
                      <li key={d} className="flex gap-3 text-[13.5px] leading-[1.85] text-ink/75">
                        <span aria-hidden className="mt-[0.75em] h-px w-3 shrink-0 bg-sekai-teal" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-grotesk text-[12px] font-bold uppercase tracking-[0.14em] text-ink/45">Requirements</p>
                  <ul className="mt-4 space-y-3">
                    {p.wanted.map((w) => (
                      <li key={w} className="flex gap-3 text-[13.5px] leading-[1.85] text-ink/75">
                        <span aria-hidden className="mt-[0.75em] h-px w-3 shrink-0 bg-sekai-teal" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <a href="#recruit-form" className="btn btn-link mt-7">
                この職種に応募する
              </a>
            </div>
          </div>
        </article>
      ))}
    </Reveal>
  )
}
