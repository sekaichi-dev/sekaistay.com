import Link from 'next/link'

/* [DESIGN_PARTS] RelatedLinks — ページ末尾の関連ページ導線（矢印付きインラインリンク行）。 */
export default function RelatedLinks({
  items,
  light = false,
}: {
  items: { href: string; label: string }[]
  /** light=true で濃色背景上の白文字に */
  light?: boolean
}) {
  const labelColor = light ? 'text-white/80' : 'text-ink/45'
  const linkColor = light ? 'text-white hover:opacity-70' : 'text-sekai-teal hover:opacity-70'
  return (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
      <span className={`text-[12px] font-bold tracking-[0.12em] ${labelColor}`}>関連ページ</span>
      {items.map((it) => (
        <Link key={it.href} href={it.href} className={`group inline-flex items-center gap-2 text-[14px] font-bold transition ${linkColor}`}>
          {it.label}
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      ))}
    </div>
  )
}
