import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import { IconArrowRight, IconCalendar, IconCheck } from '@/components/Icons'

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
      <Breadcrumb items={[{ label: 'コラム', href: '/blog' }, { label: post.title }]} />
      <BlogPostJsonLd post={post} />
      <FloatingCTA />
      <main className="bg-ivory">
        {/* ── Hero ─────────────────────────────────────── */}
        <section className="bg-paper border-b border-rule">
          <div className="container-narrow px-5 md:px-8 pt-14 md:pt-20 pb-12 md:pb-16 max-w-3xl">
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <p className="eyebrow text-sekai-teal">{post.category}</p>
            </div>

            <h1 className="font-sans font-bold text-[22px] sm:text-[26px] md:text-[36px] text-ink leading-[1.4] mb-8">
              {post.title}
            </h1>

            {/* Meta band */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pb-8 border-b border-rule mb-8">
              <time className="inline-flex items-center gap-2 eyebrow-mono text-mid-gray" dateTime={post.date}>
                <IconCalendar size={11} />
                {post.date}
              </time>
              <span className="h-3 w-px bg-rule" />
              <p className="eyebrow-mono text-mid-gray">Read · 約{readingMinutes}分</p>
            </div>

            <p className="font-sans text-[15px] md:text-[17px] text-dark-gray leading-[2]">
              {post.description}
            </p>

            {/* Hero image */}
            {post.image && (
              <div className="aspect-[2/1] sm:aspect-[5/2] overflow-hidden mt-10 border border-rule">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </section>

        {/* ── Article body ─────────────────────────────── */}
        <article className="section-xl">
          <div className="container-narrow px-5 md:px-8 max-w-3xl">
            {/* Author card */}
            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-rule">
              <div className="w-12 h-12 bg-ink text-ivory flex items-center justify-center font-sans font-medium text-[18px] flex-shrink-0">
                松
              </div>
              <div>
                <p className="eyebrow-mono text-sekai-teal mb-1">Column Editor</p>
                <p className="font-sans font-medium text-[15px] text-ink leading-tight">
                  松本凌輔
                </p>
                <p className="font-sans text-caption text-mid-gray mt-1 leading-relaxed">
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
            <div className="flex flex-wrap gap-2 mt-14 pt-8 border-t border-rule">
              <p className="eyebrow-mono text-mid-gray w-full mb-3">§ Tags</p>
              {post.tags.map(tag => (
                <span key={tag} className="font-sans text-caption text-dark-gray border border-rule bg-mist px-3 py-1">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Premium CTA */}
            <div className="relative overflow-hidden bg-ink mt-16">
              <div
                className="absolute inset-0 opacity-50 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 20% 0%, rgba(84,190,195,0.4), transparent 50%), radial-gradient(circle at 80% 100%, rgba(22,123,129,0.35), transparent 55%)',
                }}
              />
              <div className="relative px-7 py-10 md:px-10 md:py-14">
                <div className="chapter-marker">
                  <span className="h-px w-10 bg-bright-teal" />
                  <p className="eyebrow text-bright-teal">SEKAI STAY Management</p>
                </div>
                <h2 className="font-sans font-medium text-[22px] md:text-[30px] leading-snug text-ivory mb-3">
                  民泊運営を、まるごと。
                  <span className="block font-sans text-bright-teal mt-1">手数料8%で一括代行。</span>
                </h2>
                <p className="font-sans text-body-sm text-ivory/80 leading-[1.95] mb-8 max-w-lg">
                  OTA掲載・プライシング・ゲスト対応・清掃まで。基本料金は売上の8%＋月1万円/物件。かかりうる費用は事前にすべて提示します。
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-3 bg-ivory text-ink px-7 py-4 transition hover:bg-bright-teal font-sans font-medium text-[14px]"
                  >
                    無料相談する
                    <IconArrowRight size={14} className="group-hover:translate-x-1 transition" />
                  </Link>
                  <Link
                    href="/services#pricing"
                    className="group inline-flex items-center gap-3 border border-ivory/30 text-ivory px-7 py-4 transition hover:bg-ivory/5 hover:border-bright-teal font-sans font-medium text-[14px]"
                  >
                    収支シミュレーション
                    <IconArrowRight size={14} className="group-hover:translate-x-1 transition" />
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-8 pt-6 border-t border-ivory/10 font-sans text-caption text-ivory/60">
                  <span className="inline-flex items-center gap-1.5"><IconCheck size={11} color="#54BEC3" /> 基本料金 8%＋月1万円</span>
                  <span className="inline-flex items-center gap-1.5"><IconCheck size={11} color="#54BEC3" /> 手数料8%</span>
                  <span className="inline-flex items-center gap-1.5"><IconCheck size={11} color="#54BEC3" /> 全国対応</span>
                </div>
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="mt-20">
                <div className="chapter-marker">
                  <span className="rule-teal-sm" />
                  <p className="eyebrow text-sekai-teal">Related Articles</p>
                </div>
                <h2 className="font-sans font-medium text-[22px] md:text-[28px] text-ink mb-8">関連記事</h2>
                <div className="grid md:grid-cols-3 gap-px bg-rule border border-rule">
                  {related.map((r, i) => (
                    <Link
                      key={r.slug}
                      href={`/blog/${r.slug}`}
                      className="group block bg-paper p-6 transition hover:bg-mist"
                    >
                      <p className="eyebrow-mono text-mid-gray mb-3">No. {String(i + 1).padStart(2, '0')}</p>
                      <p className="eyebrow text-sekai-teal mb-3">
                        {r.category}
                      </p>
                      <p className="font-sans font-medium text-[14px] md:text-[15px] text-ink group-hover:text-sekai-teal transition leading-snug mb-3 line-clamp-3">
                        {r.title}
                      </p>
                      <p className="font-sans text-caption text-mid-gray">{r.date}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Back to index */}
            <div className="mt-16 pt-10 border-t border-rule text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 font-sans text-body-sm text-sekai-teal hover:text-ink transition"
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
