'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { BlogPostSummary } from '@/lib/blog'
import { IMG } from '@/lib/images'

interface Props {
  posts: BlogPostSummary[]
  categories: string[]
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
      {/* Editorial tag rail */}
      {categories.length > 0 && (
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="eyebrow-mono text-mid-gray">§ Categories</span>
            <span className="h-px bg-rule flex-1" />
          </div>
          <div className="flex gap-0 overflow-x-auto border-b border-rule">
            <button
              onClick={() => setActive('all')}
              className={`relative inline-flex items-baseline gap-2 text-[13px] md:text-[14px] px-4 md:px-5 py-3 md:py-4 whitespace-nowrap flex-shrink-0 transition font-sans ${
                active === 'all' ? 'text-ink' : 'text-mid-gray hover:text-ink'
              }`}
            >
              <span>すべて</span>
              <span className="eyebrow-mono text-mid-gray/80">{String(posts.length).padStart(2, '0')}</span>
              {active === 'all' && (
                <span className="absolute left-4 right-4 bottom-0 h-[2px] bg-sekai-teal" />
              )}
            </button>
            {categories.map(cat => {
              const isActive = active === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`relative inline-flex items-baseline gap-2 text-[13px] md:text-[14px] px-4 md:px-5 py-3 md:py-4 whitespace-nowrap flex-shrink-0 transition font-sans ${
                    isActive ? 'text-ink' : 'text-mid-gray hover:text-ink'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="eyebrow-mono text-mid-gray/80">{String(counts[cat] || 0).padStart(2, '0')}</span>
                  {isActive && (
                    <span className="absolute left-4 right-4 bottom-0 h-[2px] bg-sekai-teal" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Posts grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-sans text-body text-mid-gray">該当する記事がありません。</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule rounded-switch-lg overflow-hidden">
          {filtered.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-paper group transition hover:bg-mist"
            >
              <div className="aspect-[16/10] overflow-hidden bg-mist relative">
                <img
                  src={post.image || IMG.blogPlaceholder}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-ivory/95 backdrop-blur-sm px-3 py-1 border border-rule">
                  <p className="eyebrow-mono text-ink">№ {String(i + 1).padStart(3, '0')}</p>
                </div>
              </div>
              <div className="p-6 md:p-7">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-rule">
                  <p className="eyebrow text-sekai-teal">{post.category}</p>
                  <p className="eyebrow-mono text-mid-gray">{post.date}</p>
                </div>
                <h2 className="font-sans font-medium text-[16px] md:text-[17px] text-ink leading-snug mb-3 line-clamp-3 group-hover:text-sekai-teal transition">
                  {post.title}
                </h2>
                <p className="font-sans text-caption text-dark-gray line-clamp-2 leading-[1.85]">
                  {post.description}
                </p>
                <div className="mt-5 flex items-center gap-2 text-sekai-teal">
                  <span className="eyebrow-mono">Read</span>
                  <span className="block w-6 h-px bg-sekai-teal group-hover:w-10 transition-[width]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Result count */}
      <p className="mt-8 font-sans text-caption text-mid-gray text-center">
        {filtered.length}件の記事を表示中
        {active !== 'all' && (
          <button
            onClick={() => setActive('all')}
            className="ml-3 text-sekai-teal hover:text-ink transition font-normal border-b border-sekai-teal pb-0.5"
          >
            すべて表示
          </button>
        )}
      </p>
    </>
  )
}
