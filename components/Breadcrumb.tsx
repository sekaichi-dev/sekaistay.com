import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface Props {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: Props) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://sekaistay.com' },
      ...items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: item.label,
        ...(item.href ? { item: `https://sekaistay.com${item.href}` } : {}),
      })),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="パンくずリスト" className="container-edit pt-6 pb-2">
        <ol className="flex flex-wrap items-center gap-2 text-[10.5px] font-mono tracking-[0.22em] uppercase text-ink/55">
          <li>
            <Link href="/" className="hover:text-sekai-teal transition">Home</Link>
          </li>
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="text-ink/25">—</span>
              {item.href && i < items.length - 1 ? (
                <Link href={item.href} className="hover:text-sekai-teal transition">{item.label}</Link>
              ) : (
                <span className="text-ink">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
