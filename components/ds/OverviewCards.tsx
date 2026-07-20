import Reveal from '@/components/motion/Reveal'

export type OverviewItem = {
  no: string
  title: string
  lead?: string
  desc?: string
  image: string
  alt: string
  status?: string
  soon?: boolean
  /** dark=true でカード背景をセクションと同じ濃色(navy-deep)に */
  dark?: boolean
}

/**
 * [DESIGN_PARTS] OverviewCards — sense-trust「BUSINESS OVERVIEW」型の事業カード（忠実再現）。
 * 二段カラー: 濃色セクション(navy-deep)上に塗りカードを隙間なし3カラム・角丸なしで並べる（フルブリード）。
 * カード内: タイトル（上）→ 画像4:3 → リード/説明/ステータス（下）。細い枠線(ring-white/15)。
 * soon=true は画像の上に COMING SOON 斜めマーキー帯（白背景・連続スクロール）を重ねる。
 */
export default function OverviewCards({ items }: { items: OverviewItem[] }) {
  return (
    <Reveal as="div" className="grid gap-px bg-navy-deep md:grid-cols-3">
      {items.map((it) => (
        <div
          key={it.no}
          className={`group flex h-full flex-col p-8 ring-1 ring-white/15 sm:p-10 lg:p-12 ${it.dark ? 'bg-navy-deep' : 'bg-navy'}`}
        >
          {/* タイトル（上） */}
          <h3 className="text-[clamp(1.25rem,1.7vw,1.5rem)] font-bold leading-snug text-white">{it.title}</h3>

          {/* 画像（中）＋ COMING SOON 重ね */}
          <div className="relative mt-8 aspect-[4/3] overflow-hidden sm:mt-10">
            <img
              src={it.image}
              alt={it.alt}
              loading="lazy"
              decoding="async"
              className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${it.soon ? 'scale-105' : ''}`}
            />
            {it.soon && (
              <div className="absolute inset-0">
                <span className="absolute inset-0 bg-navy/55" aria-hidden />
                <div className="absolute left-1/2 top-1/2 w-[180%] -translate-x-1/2 -translate-y-1/2 -rotate-[7deg] overflow-hidden bg-white py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                  <div className="marquee marquee-fast w-max">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <span key={i} className="inline-flex shrink-0 items-center">
                        {Array.from({ length: 4 }).map((__, j) => (
                          <span key={`${i}-${j}`} className="flex items-center text-[13px] font-bold tracking-[0.2em] text-navy-deep">
                            COMING&nbsp;SOON
                            <span className="mx-4 text-[10px]">●</span>
                          </span>
                        ))}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* リード／説明／ステータス（下・白文字） */}
          {it.lead && <p className="mt-7 text-[14px] font-bold leading-snug text-white">{it.lead}</p>}
          {it.desc && <p className="mt-3 flex-1 text-[13px] leading-[1.9] text-white/80">{it.desc}</p>}
          {it.status && <p className="mt-6 text-[12px] font-bold tracking-[0.08em] text-white/60">{it.status}</p>}
        </div>
      ))}
    </Reveal>
  )
}
