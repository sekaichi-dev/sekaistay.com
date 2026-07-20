import Reveal from '@/components/motion/Reveal'

/**
 * [DESIGN_PARTS] NumberCards — 巨大番号のカードグリッド（番号主体・ピクトグラム不使用）。
 * 背面の巨大ゴースト番号 + 前面の可視番号 → タイトル → 本文 → 下罫線＋効果値タグ。
 * hover で浮上＋上辺アクセント線が伸びる。濃色背景（navy）上で使う前提。
 */
export default function NumberCards({
  items,
  columns = 4,
  mono = false,
}: {
  items: { no: string; title: string; body: string; effect?: string }[]
  columns?: 2 | 3 | 4
  /** mono=true で番号・本文・効果値もすべて純白に（アクセントのティールを使わない） */
  mono?: boolean
}) {
  const colClass =
    columns === 2 ? 'sm:grid-cols-2' : columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'
  const accent = mono ? 'text-white' : 'text-bright-teal'
  const bodyColor = mono ? 'text-white' : 'text-white/70'
  return (
    <div className={`grid gap-5 sm:gap-6 ${colClass}`}>
      {items.map((it, i) => (
        <Reveal key={it.no} as="div" delay={i * 0.06}>
          <div className="group relative h-full overflow-hidden rounded-[12px] bg-navy-deep p-7 transition-transform duration-300 hover:-translate-y-1 sm:p-8">
            {/* 上辺アクセント線（hoverで伸びる） */}
            <span className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-bright-teal transition-transform duration-500 group-hover:scale-x-100" />
            {/* 背面ゴースト番号 */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-2 -top-5 select-none font-grotesk text-[6.5rem] font-bold leading-none tracking-[-0.04em] text-white/[0.06]"
            >
              {it.no}
            </span>
            {/* 可視番号 */}
            <span className={`relative font-grotesk text-[1.5rem] font-bold leading-none ${accent}`}>{it.no}</span>
            <h3 className="relative mt-5 text-[1.0625rem] font-bold leading-[1.45] text-white sm:text-[1.125rem]">{it.title}</h3>
            <p className={`relative mt-3 text-[14px] leading-[1.9] ${bodyColor}`}>{it.body}</p>
            {it.effect && (
              <div className="relative mt-6 border-t border-white/12 pt-4">
                <span className={`text-[13px] font-bold tracking-wide ${accent}`}>{it.effect}</span>
              </div>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  )
}
