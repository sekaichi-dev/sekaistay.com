import fs from 'fs'
import path from 'path'

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  category: string
  tags: string[]
  body: string
  image?: string
}

/** Lightweight version for list pages (no body) */
export type BlogPostSummary = Omit<BlogPost, 'body'>

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

/** Normalize varying JSON shapes into a consistent BlogPost */
function normalizePost(data: Record<string, unknown>): BlogPost {
  // Some articles store body as "content" (string or {sections})
  let body = (data.body as string) || ''
  if (!body && data.content) {
    if (typeof data.content === 'string') {
      body = data.content
    } else if (typeof data.content === 'object' && data.content !== null) {
      const c = data.content as { lead?: string; sections?: { heading: string; content: string }[] }
      const parts: string[] = []
      if (c.lead) parts.push(c.lead)
      if (Array.isArray(c.sections)) {
        for (const s of c.sections) {
          parts.push(`## ${s.heading}\n\n${s.content}`)
        }
      }
      body = parts.join('\n\n')
    }
  }
  return {
    slug: data.slug as string,
    title: data.title as string,
    description: (data.description || data.metaDescription || '') as string,
    date: data.date as string,
    category: (data.category || '') as string,
    tags: (data.tags || []) as string[],
    body,
    image: data.image as string | undefined,
  }
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.json'))
  const posts = files.map(f => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, f), 'utf-8')
    return normalizePost(JSON.parse(raw))
  })
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/** Returns posts without body — for list pages to keep client payload small */
export function getAllPostSummaries(): BlogPostSummary[] {
  return getAllPosts().map(({ body, ...rest }) => rest)
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.json`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  return normalizePost(JSON.parse(raw))
}

export function getCategories(): string[] {
  const posts = getAllPosts()
  return Array.from(new Set(posts.map(p => p.category))).filter(Boolean)
}
