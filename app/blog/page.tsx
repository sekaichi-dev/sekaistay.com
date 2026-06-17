import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import SectionHead from '@/components/ds/SectionHead'
import GhostWordmark from '@/components/ds/GhostWordmark'
import { ContactSense } from '@/components/home/SenseSections'
import BlogGrid from '@/components/blog/BlogGrid'
import { getAllPostSummaries, getCategories } from '@/lib/blog'

const SITE_URL = 'https://sekaistay.com'

export const metadata: Metadata = {
  title: 'コラム',
  description: '民泊運営に関するノウハウ、費用・手数料の解説、法令情報、成功事例などをお届けするSEKAI STAYのコラム。',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'コラム | SEKAI STAY',
    description: '民泊運営のノウハウ・費用・法令・運用事例まで、現場で使える情報をお届けする民泊マガジン。',
    type: 'website',
    locale: 'ja_JP',
    url: `${SITE_URL}/blog`,
    siteName: 'SEKAI STAY',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'コラム | SEKAI STAY',
    description: '民泊運営のノウハウ・費用・法令・運用事例まで、現場で使える情報をお届けする民泊マガジン。',
  },
}

export default function BlogPage() {
  const posts = getAllPostSummaries()
  const categories = getCategories()

  return (
    <>
      <Header />
      <FloatingCTA />
      <main>
        {/* ヘッダー — MAGAZINE / 民泊マガジン */}
        <section className="relative w-full overflow-hidden bg-ivory section-hero pt-28 sm:pt-32">
          <GhostWordmark />
          <div className="relative z-10 container-edit">
            <SectionHead
              as="h1"
              hero
              en="MAGAZINE"
              sub="民泊マガジン"
              lead="民泊運営のノウハウ、費用や法令の解説、業界動向、運用事例まで。現場で使える情報をお届けします。"
            />
          </div>
        </section>

        {/* カテゴリ＋記事一覧 */}
        <section className="w-full bg-ivory pb-[clamp(4rem,10vw,9.5rem)]">
          <div className="container-edit">
            <BlogGrid posts={posts} categories={categories} />
          </div>
        </section>

        {/* 末尾CTA — 共通 ContactSense（REPORT / CONTACT） */}
        <ContactSense />
      </main>
      <Footer />
    </>
  )
}
