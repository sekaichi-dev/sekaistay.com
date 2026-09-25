import Reveal from '@/components/motion/Reveal'
import type { RecruitPosition } from '@/data/recruit'

/**
 * [DESIGN_PARTS 派生] NumberCards（巨大番号のカード）の明色背景版。
 * 募集要項は1件が「仕事内容」「求める人物像」の2ブロックを抱えるため、
 * 番号・罫線・タイポ主体という原則はそのままに、カード内で縦に積む。
 */
export default function PositionList({ positions }: { positions: RecruitPosition[] }) {
  return (
    <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
      {positions.map((p, i) => (
        <Reveal key={p.id} as="div" delay={i * 0.06}>
          <article
            id={p.id}
            className="group relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-[12px] border border-rule bg-paper p-7 transition-transform duration-300 hover:-translate-y-1 sm:p-9"
          >
            {/* 上辺アクセント線（hoverで伸びる） */}
            <span className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-sekai-teal transition-transform duration-500 group-hover:scale-x-100" />
            {/* 背面ゴースト番号 */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-2 -top-5 select-none font-grotesk text-[6.5rem] font-bold leading-none tracking-[-0.04em] text-ink/[0.04]"
            >
              {String(i + 1).padStart(2, '0')}
            </span>

            <span className="relative font-grotesk text-[1.5rem] font-bold leading-none text-sekai-teal">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="relative mt-5 text-[1.25rem] font-bold leading-[1.4] text-ink sm:text-[1.375rem]">{p.title}</h3>
            <p className="relative mt-1 font-grotesk text-[12px] font-bold tracking-[0.1em] text-sekai-teal">{p.en}</p>

            <dl className="relative mt-5 flex flex-wrap gap-x-6 gap-y-1 border-y border-rule py-4 text-[12.5px] leading-[1.8] text-ink/60">
              <div className="flex gap-2">
                <dt className="font-bold text-ink/45">雇用形態</dt>
                <dd>{p.employment}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-bold text-ink/45">勤務地</dt>
                <dd>{p.location}</dd>
              </div>
            </dl>

            <p className="relative mt-5 text-[13.5px] leading-[1.9] text-ink/70">{p.summary}</p>

            <div className="relative mt-7 space-y-7">
              <Block title="仕事内容" items={p.duties} />
              <Block title="求める人物像" items={p.wanted} />
            </div>

            <div className="relative mt-auto pt-8">
              <a href="#recruit-form" className="btn btn-primary w-full justify-center">
                この職種に応募する
              </a>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  )
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="font-grotesk text-[12px] font-bold uppercase tracking-[0.14em] text-ink/45">{title}</p>
      <ul className="mt-4 space-y-3">
        {items.map((it) => (
          <li key={it} className="flex gap-3 text-[13.5px] leading-[1.85] text-ink/75">
            <span aria-hidden className="mt-[0.75em] h-px w-3 shrink-0 bg-sekai-teal" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
