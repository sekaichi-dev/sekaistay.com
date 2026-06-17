import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'
import { AREAS } from '@/lib/areas'

/**
 * Dynamic sitemap for sekaistay.com.
 *
 * NOTE: Only sekaistay.com URLs are included here.
 * The note.com articles sitemap (sitemap_note_articles.xml) has been REMOVED
 * from this site because Google ignores sitemaps that reference URLs on
 * a different domain. Note.com articles should be submitted via
 * Search Console for note.com, not sekaistay.com.
 *
 * lastModified uses actual content dates where available,
 * NOT the build date (to avoid false freshness signals to Google).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sekaistay.com'

  // Static pages with realistic last-modified dates
  // Update these when you actually change the page content
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,                   lastModified: new Date('2026-04-12'), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${baseUrl}/services`,     lastModified: new Date('2026-03-20'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/pricing`,      lastModified: new Date('2026-03-20'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/case-studies`,  lastModified: new Date('2026-04-01'), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/blog`,         lastModified: new Date('2026-04-12'), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/faq`,          lastModified: new Date('2026-03-15'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/audit`,        lastModified: new Date('2026-04-18'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/portfolio`,    lastModified: new Date('2026-03-25'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/dashboard-demo`, lastModified: new Date('2026-04-16'), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/about`,        lastModified: new Date('2026-04-15'), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/contact`,      lastModified: new Date('2026-02-01'), changeFrequency: 'yearly',  priority: 0.7 },
    { url: `${baseUrl}/switch`,       lastModified: new Date('2026-04-20'), changeFrequency: 'weekly',  priority: 0.9 },
    // NOTE: /lp は広告の着地ページ専用。メインサイトのサイトマップには含めない（noindex）。
    { url: `${baseUrl}/privacy`,      lastModified: new Date('2026-01-01'), changeFrequency: 'yearly',  priority: 0.3 },
  ]

  // Blog posts — use actual publish date
  const posts = getAllPosts()
  const blogPages: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Area pages — use a fixed date (updated when area content changes)
  const areaPages: MetadataRoute.Sitemap = AREAS.map(area => ({
    url: `${baseUrl}/area/${area.slug}`,
    lastModified: new Date('2026-03-25'),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [
    ...staticPages,
    ...blogPages,
    ...areaPages,
  ]
}
