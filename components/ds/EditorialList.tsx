import Reveal from '@/components/motion/Reveal'

export type EditorialItem = {
  no?: string
  title: string
  body?: string
  meta?: string
}

/**
 * [DESIGN_PARTS] EditorialList — 番号＋ヘアライン罫線のエディトリアル・リスト（sense-trust ORIGINAL SYSTEM型）。
 * ピクトグラムは使わず、番号(01..)＋見出し＋本文＋右端メタ(効果値等)で構成。
 * columns=2 で sm 以上 2カラム。light=true で濃色背景上の白文字。
 */
export default function EditorialList({
  items,
  light = false,
  columns = 2,
  numClass = 'text-[clamp(1.5rem,2.4vw,2.125rem)]',
}: {
  items: EditorialItem[]
  light?: boolean
  columns?: 1 | 2
  numClass?: string
}) {
  const inkColor = light ? 'text-white' : 'text-ink'
  const bodyColor = light ? 'text-white/70' : 'text-ink/70'
  const ruleColor = light ? 'border-white/15' : 'border-rule'
  const accent = light ? 'text-bright-teal' : 'text-sekai-teal'
  const grid = columns === 2 ? 'sm:grid-cols-2 sm:gap-x-14' : ''
  return (
    <Reveal as="div" stagger className={`grid ${grid}`}>
      {items.map((it, i) => (
        <div key={i} className={`flex gap-5 border-t ${ruleColor} py-7 sm:gap-6 sm:py-8`}>
          <span className={`shrink-0 font-grotesk ${numClass} font-bold leading-none tabular-nums ${accent}`}>
            {it.no ?? String(i + 1).padStart(2, '0')}
          </span>
          <div className="flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className={`text-[clamp(1.0625rem,1.5vw,1.25rem)] font-bold leading-snug ${inkColor}`}>{it.title}</h3>
              {it.meta && <span className={`font-grotesk text-[13px] font-bold tracking-[0.02em] ${accent}`}>{it.meta}</span>}
            </div>
            {it.body && <p className={`mt-3 text-[13.5px] leading-[1.85] ${bodyColor}`}>{it.body}</p>}
          </div>
        </div>
      ))}
    </Reveal>
  )
}
