import Reveal from '@/components/motion/Reveal'
import type { RecruitPosition } from '@/data/recruit'

/**
 * [DESIGN_PARTS 派生] CardGrid（画像カード）の募集要項版。
 * 画像(上・16:10・hover scale-110)＋番号バッジ＋職種名＋条件帯＋
 * 「仕事内容 / 求める人物像」＋末尾の応募リンク。1件で読み切れる要項カードとして使う。
 */
export default function PositionList({ positions }: { positions: RecruitPosition[] }) {
  return (
    <Reveal as="div" stagger className="grid gap-6 md:grid-cols-2">
      {positions.map((p, i) => (
        <article
          key={p.id}
          id={p.id}
          className="group flex scroll-mt-28 flex-col overflow-hidden rounded-[10px] bg-paper shadow-sm ring-1 ring-rule transition-shadow duration-300 hover:shadow-xl hover:shadow-ink/10"
        >
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={p.image}
              alt={p.alt}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-ink/35" />
            <span className="absolute left-5 top-4 font-grotesk text-[2.25rem] font-bold leading-none text-white/90 drop-shadow">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="absolute inset-x-5 bottom-4">
              <p className="font-grotesk text-[11px] font-bold tracking-[0.14em] text-white/80">{p.en}</p>
              <h3 className="mt-1 text-[1.25rem] font-bold leading-[1.4] text-white sm:text-[1.375rem]">{p.title}</h3>
            </div>
          </div>

          <div className="flex flex-1 flex-col p-7 sm:p-8">
            <dl className="flex flex-wrap gap-x-6 gap-y-1 text-[12.5px] leading-[1.8] text-ink/60">
              <div className="flex gap-2">
                <dt className="font-bold text-ink/45">雇用形態</dt>
                <dd>{p.employment}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-bold text-ink/45">勤務地</dt>
                <dd>{p.location}</dd>
              </div>
            </dl>

            <p className="mt-5 text-[13.5px] leading-[1.9] text-ink/75">{p.summary}</p>

            <div className="mt-7 space-y-7">
              <Block title="仕事内容" items={p.duties} />
              <Block title="求める人物像" items={p.wanted} />
            </div>

            <div className="mt-auto border-t border-rule pt-6">
              <a
                href="#recruit-form"
                className="inline-flex items-center gap-2 text-[14px] font-bold text-sekai-teal transition hover:gap-3"
              >
                <span aria-hidden>→</span>
                この職種に応募する
              </a>
            </div>
          </div>
        </article>
      ))}
    </Reveal>
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
