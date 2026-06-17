import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import { IconArrowRight, IconCalendar } from '@/components/Icons'
import AuditLink from '@/components/audit/AuditLink'

const SITE_URL = 'https://sekaistay.com'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}
  const url = `${SITE_URL}/blog/${post.slug}`
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      url,
      siteName: 'SEKAI STAY',
      locale: 'ja_JP',
      images: [{ url: post.image || `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
      },
    },
  }
}

// ── Structured Data (BlogPosting + BreadcrumbList) ────────────────
function BlogPostJsonLd({ post }: { post: { slug: string; title: string; description: string; date: string; category: string; tags: string[]; body: string; image?: string } }) {
  const url = `${SITE_URL}/blog/${post.slug}`
  const wordCount = post.body.replace(/[#*|\-\[\]()]/g, '').length

  const blogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: {
      '@type': 'Person',
      name: '松本凌輔',
      jobTitle: 'コラム編集長',
      worksFor: {
        '@type': 'Organization',
        name: 'SEKAI STAY',
        url: SITE_URL,
      },
      description: 'agoda Customer Service部門を経て、民泊業界でCS・運営支援に5年間従事。住宅宿泊管理業の修了証を取得。',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SEKAI STAY',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/sekai_stay_03_03.png` },
    },
    image: post.image || `${SITE_URL}/og-image.jpg`,
    wordCount,
    keywords: post.tags.join(', '),
    articleSection: post.category,
    inLanguage: 'ja',
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'コラム', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPosting) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  )
}

// ── Markdown Renderer (editorial style) ────────────────────────────
function renderMarkdown(md: string) {
  if (!md) return '<p class="font-sans text-body text-dark-gray">記事の本文を準備中です。</p>'
  const lines = md.split('\n')
  const html: string[] = []
  let inTable = false
  let inList = false
  let inUl = false

  for (const line of lines) {
    // table
    if (line.startsWith('|')) {
      if (line.includes('---')) continue
      const cells = line.split('|').filter(Boolean).map(c => c.trim())
      if (!inTable) {
        html.push('<table class="w-full text-[14px] border-collapse my-8 border border-rule"><tbody>')
        html.push(`<tr class="bg-ink text-ivory">${cells.map(c => `<th class="text-left px-4 py-3 font-sans font-medium border-r border-ivory/10 last:border-r-0">${c}</th>`).join('')}</tr>`)
        inTable = true
        continue
      }
      html.push(`<tr class="border-t border-rule odd:bg-mist">${cells.map(c => `<td class="px-4 py-3 font-sans text-dark-gray border-r border-rule last:border-r-0">${formatInline(c)}</td>`).join('')}</tr>`)
      continue
    }
    if (inTable) { html.push('</tbody></table>'); inTable = false }

    // unordered list
    if (/^[-*]\s/.test(line)) {
      if (!inUl) { html.push('<ul class="my-5 space-y-2 font-sans text-[15px] md:text-[16px] text-dark-gray leading-[1.95]">'); inUl = true }
      html.push(`<li class="relative pl-6 before:content-[\'\'] before:absolute before:left-0 before:top-[0.7em] before:w-3 before:h-px before:bg-sekai-teal">${formatInline(line.replace(/^[-*]\s/, ''))}</li>`)
      continue
    }
    if (inUl && !/^[-*\s]/.test(line)) { html.push('</ul>'); inUl = false }

    // ordered list
    if (/^\d+\.\s/.test(line)) {
      if (!inList) { html.push('<ol class="my-5 space-y-2 font-sans text-[15px] md:text-[16px] text-dark-gray leading-[1.95] list-decimal pl-6 marker:text-sekai-teal marker:font-sans marker:">'); inList = true }
      html.push(`<li class="pl-2">${formatInline(line.replace(/^\d+\.\s/, ''))}</li>`)
      continue
    }
    if (inList && !/^\d+\./.test(line) && !line.startsWith(' ')) { html.push('</ol>'); inList = false }

    // headings
    if (line.startsWith('### ')) {
      html.push(`<h3 class="font-sans font-medium text-[17px] md:text-[19px] text-ink mt-10 mb-4 leading-snug">${formatInline(line.slice(4))}</h3>`)
    } else if (line.startsWith('## ')) {
      html.push(`<h2 class="font-sans font-medium text-[21px] md:text-[26px] text-ink mt-14 mb-5 pb-4 border-b border-rule leading-snug">${formatInline(line.slice(3))}</h2>`)
    } else if (line.startsWith('---')) {
      html.push('<hr class="my-10 border-rule" />')
    } else if (line.trim() === '') {
      // skip empty
    } else {
      html.push(`<p class="font-sans text-[15px] md:text-[17px] text-dark-gray leading-[2] mb-5">${formatInline(line)}</p>`)
    }
  }
  if (inTable) html.push('</tbody></table>')
  if (inList) html.push('</ol>')
  if (inUl) html.push('</ul>')

  return html.join('\n')
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-medium text-ink">$1</strong>')
    .replace(/\[(.+?)\]\((.+?)\)/g, (_, label, href) => {
      const isExternal = href.startsWith('http') && !href.includes('sekaistay.com')
      const rel = isExternal ? ' rel="noopener noreferrer" target="_blank"' : ''
      return `<a href="${href}" class="text-sekai-teal border-b border-sekai-teal/40 hover:border-sekai-teal transition"${rel}>${label}</a>`
    })
}

// ── Page Component ────────────────────────────────────────────────
export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const allPosts = getAllPosts()
  const sameCategory = allPosts.filter(p => p.slug !== post.slug && p.category === post.category)
  const others = allPosts.filter(p => p.slug !== post.slug && p.category !== post.category)
  const related = [...sameCategory, ...others].slice(0, 3)

  const plainLength = post.body.replace(/[#*|\-\[\]()]/g, '').length
  const readingMinutes = Math.max(1, Math.round(plainLength / 500))

  return (
    <>
      <Header />
      <BlogPostJsonLd post={post} />
      <FloatingCTA />
      <main className="bg-ivory">
        {/* ── Hero ─────────────────────────────────────── */}
        <section className="w-full bg-paper">
          <div className="container-narrow pt-28 pb-10 sm:pt-32 sm:pb-12">
            <p className="text-[12px] font-bold tracking-[0.18em] text-sekai-teal">{post.category}</p>
            <h1 className="mt-5 text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.4] tracking-[-0.01em] text-ink">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-grotesk text-[13px] text-ink/50">
              <time className="inline-flex items-center gap-2" dateTime={post.date}>
                <IconCalendar size={12} />
                {post.date}
              </time>
              <span className="h-3 w-px bg-rule" />
              <span>約{readingMinutes}分で読めます</span>
            </div>
            <p className="mt-7 max-w-2xl text-[clamp(1rem,1.5vw,1.1875rem)] leading-[2] text-ink/70">
              {post.description}
            </p>
          </div>

          {/* Hero image — 黄金比・画像なしはグレー＋ロゴ */}
          <div className="container-narrow pb-14 sm:pb-20">
            <div className="relative aspect-[1.618/1] overflow-hidden rounded-[14px] border border-rule">
              {post.image ? (
                <Image src={post.image} alt={post.title} fill priority sizes="(max-width: 880px) 100vw, 820px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-rule">
                  <img src="/images/switch/logo-lockup.png" alt="SEKAI STAY" className="h-auto w-[26%] max-w-[260px] opacity-40" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Article body ─────────────────────────────── */}
        <article className="section-xl">
          <div className="container-narrow">
            {/* 編集者 byline */}
            <div className="mb-12 flex items-center gap-4 border-b border-rule pb-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-[18px] font-bold text-white">
                松
              </div>
              <div>
                <p className="text-[11px] font-bold tracking-[0.16em] text-sekai-teal">編集部</p>
                <p className="mt-1 text-[15px] font-bold leading-tight text-ink">松本凌輔</p>
                <p className="mt-1 text-[12px] leading-relaxed text-ink/55">
                  agoda CS部門出身 · 民泊業界5年 · 住宅宿泊管理業修了
                </p>
              </div>
            </div>

            {/* Body */}
            <div
              className="blog-body"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
            />

            {/* Tags */}
            <div className="mt-14 border-t border-rule pt-8">
              <p className="text-[11px] font-bold tracking-[0.16em] text-ink/45">TAGS</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="rounded-full border border-rule bg-paper px-3 py-1 text-[12px] text-ink/60">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA — navy */}
            <div className="relative mt-16 overflow-hidden rounded-[16px] bg-navy px-7 py-10 text-white sm:px-10 sm:py-14">
              <p className="text-[12px] font-bold tracking-[0.18em] text-bright-teal">SEKAI STAY 運用代行</p>
              <h2 className="mt-3 text-[clamp(1.375rem,2.4vw,1.875rem)] font-bold leading-[1.5]">
                民泊運営を、まるごと。
                <span className="block text-bright-teal">手数料8%で一括代行。</span>
              </h2>
              <p className="mt-4 max-w-lg text-[14px] leading-[1.95] text-white/75">
                OTA掲載・プライシング・ゲスト対応・清掃まで。基本料金は売上の8%＋月1万円/物件。かかりうる費用は事前にすべて提示します。
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <AuditLink className="btn btn-cta !rounded-full group px-7">
                  無料で収益診断
                  <IconArrowRight size={14} className="transition group-hover:translate-x-1" />
                </AuditLink>
                <Link
                  href="/pricing"
                  className="group inline-flex items-center justify-center gap-3 rounded-full border border-white/30 px-7 py-4 text-[14px] font-bold text-white transition hover:border-bright-teal hover:bg-white/5"
                >
                  料金を見る
                  <IconArrowRight size={14} className="transition group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Related — 一覧と同じ黄金比カード */}
            {related.length > 0 && (
              <div className="mt-20">
                <p className="text-[12px] font-bold tracking-[0.18em] text-sekai-teal">RELATED</p>
                <h2 className="mt-2 text-[clamp(1.5rem,3vw,2rem)] font-bold text-ink">関連記事</h2>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/blog/${r.slug}`}
                      className="group block overflow-hidden rounded-lg border border-rule bg-paper transition hover:-translate-y-0.5"
                    >
                      <div className="relative aspect-[1.618/1] overflow-hidden">
                        {r.image ? (
                          <Image src={r.image} alt={r.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-rule">
                            <img src="/images/switch/logo-lockup.png" alt="SEKAI STAY" className="h-auto w-[46%] max-w-[180px] opacity-40" loading="lazy" />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-center justify-between">
                          <p className="text-[12px] font-bold tracking-[0.12em] text-sekai-teal">{r.category}</p>
                          <p className="font-grotesk text-[12px] text-ink/50">{r.date}</p>
                        </div>
                        <p className="mt-2 text-[15px] font-bold leading-snug text-ink line-clamp-3 transition group-hover:opacity-70">
                          {r.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Back to index */}
            <div className="mt-16 border-t border-rule pt-10 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-[14px] font-bold text-sekai-teal transition hover:text-ink"
              >
                ← コラム一覧へ戻る
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
