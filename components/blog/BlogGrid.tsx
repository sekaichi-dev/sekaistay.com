'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { BlogPostSummary } from '@/lib/blog'

interface Props {
  posts: BlogPostSummary[]
  categories: string[]
}

/* サムネイル — 画像が無い／読み込み失敗した記事はグレー地＋SEKAI STAYロゴのプレースホルダ */
function CardThumb({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="aspect-[1.618/1] overflow-hidden">
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-rule">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/switch/logo-lockup.png" alt="SEKAI STAY" className="h-auto w-[46%] max-w-[200px] opacity-40" loading="lazy" />
        </div>
      )}
    </div>
  )
}

export default function BlogGrid({ posts, categories }: Props) {
  const [active, setActive] = useState<string>('all')

  const filtered = useMemo(() => {
    if (active === 'all') return posts
    return posts.filter(p => p.category === active)
  }, [active, posts])

  // Count per category
  const counts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const p of posts) {
      map[p.category] = (map[p.category] || 0) + 1
    }
    return map
  }, [posts])

  return (
    <>
      {/* カテゴリフィルター（pill 形式） */}
      {categories.length > 0 && (
        <div className="mb-12 flex flex-wrap gap-2.5 md:mb-16">
          <button
            onClick={() => setActive('all')}
            className={`inline-flex items-baseline gap-2 rounded-full px-5 py-2.5 text-[14px] font-bold transition ${
              active === 'all'
                ? 'bg-navy text-white'
                : 'border border-rule bg-paper text-ink/70 hover:border-sekai-teal hover:text-sekai-teal'
            }`}
          >
            <span>すべて</span>
            <span className="font-grotesk text-[12px] opacity-70">{String(posts.length).padStart(2, '0')}</span>
          </button>
          {categories.map(cat => {
            const isActive = active === cat
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`inline-flex items-baseline gap-2 rounded-full px-5 py-2.5 text-[14px] font-bold transition ${
                  isActive
                    ? 'bg-navy text-white'
                    : 'border border-rule bg-paper text-ink/70 hover:border-sekai-teal hover:text-sekai-teal'
                }`}
              >
                <span>{cat}</span>
                <span className="font-grotesk text-[12px] opacity-70">{String(counts[cat] || 0).padStart(2, '0')}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* 記事一覧 */}
      {filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-[15px] text-ink/60">該当する記事がありません。</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block overflow-hidden rounded-lg border border-rule bg-paper transition hover:-translate-y-0.5"
            >
              <CardThumb src={post.image} alt={post.title} />
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-bold tracking-[0.12em] text-sekai-teal">{post.category}</p>
                  <p className="font-grotesk text-[13px] text-ink/50">{post.date}</p>
                </div>
                <h2 className="mt-3 text-[1.125rem] font-bold leading-snug text-ink line-clamp-3 transition group-hover:opacity-70">
                  {post.title}
                </h2>
                <p className="mt-3 text-[13px] leading-[1.85] text-ink/65 line-clamp-2">
                  {post.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 件数表示 */}
      <p className="mt-10 text-center text-[13px] text-ink/55">
        {filtered.length}件の記事を表示中
        {active !== 'all' && (
          <button
            onClick={() => setActive('all')}
            className="ml-3 font-bold text-sekai-teal transition hover:opacity-70"
          >
            すべて表示
          </button>
        )}
      </p>
    </>
  )
}
