import Reveal from '@/components/motion/Reveal'

export type Card = {
  image: string
  alt: string
  title: string
  lead?: string
  desc?: string
  badge?: string
  status?: string
  href?: string
}

/**
 * [DESIGN_PARTS] CardGrid — sense-trust「BUSINESS OVERVIEW」3カラム画像カードの忠実再現（色味ティール）。
 * 画像(上・4:3・hover scale-110)＋任意バッジ＋タイトル＋任意リード/説明/ステータス。Reveal stagger 出現。
 * カードは常に明色(paper)。濃色セクション上でも映える。
 */
export default function CardGrid({ items, columns = 3 }: { items: Card[]; columns?: 2 | 3 }) {
  const cols = columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
  return (
    <Reveal as="div" stagger className={`grid gap-6 ${cols}`}>
      {items.map((it, i) => {
        const Wrapper: any = it.href ? 'a' : 'div'
        return (
          <Wrapper
            key={i}
            {...(it.href ? { href: it.href } : {})}
            className="group flex flex-col overflow-hidden rounded-[10px] bg-paper ring-1 ring-rule transition-shadow hover:shadow-xl hover:shadow-ink/10"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={it.image}
                alt={it.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {it.badge && (
                <>
                  <span className="absolute inset-0 bg-gradient-to-t from-sekai-teal/30 via-transparent to-transparent" aria-hidden />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-bright-teal to-sekai-teal px-3 py-1.5 text-[11px] font-bold tracking-[0.12em] text-white shadow-lg shadow-sekai-teal/30">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                    {it.badge}
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-1 flex-col p-7">
              <h3 className="text-[clamp(1.125rem,1.6vw,1.25rem)] font-bold leading-snug text-ink">{it.title}</h3>
              {it.lead && <p className="mt-3 text-[14px] font-bold leading-snug text-sekai-teal">{it.lead}</p>}
              {it.desc && <p className="mt-3 flex-1 text-[13.5px] leading-[1.9] text-ink/75">{it.desc}</p>}
              {it.status && <p className="mt-6 text-[12px] font-bold tracking-[0.06em] text-ink/50">{it.status}</p>}
            </div>
          </Wrapper>
        )
      })}
    </Reveal>
  )
}
