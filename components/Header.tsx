'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/services', label: 'BUSINESS', ja: '事業内容' },
  { href: '/pricing', label: 'PRICING', ja: '料金' },
  { href: '/case-studies', label: 'WORKS', ja: '実績・オーナーの声' },
  { href: '/blog', label: 'MAGAZINE', ja: '民泊マガジン' },
  { href: '/faq', label: 'FAQ', ja: 'FAQ' },
  { href: '/about', label: 'ABOUT', ja: '会社情報' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  // ホーム（暗いヒーロー）だけ最上部で透明＋白。下層ページは明るいヒーローなので最初からアイボリー地＋濃色で可視化。
  const isHome = pathname === '/'
  const solid = scrolled || open || !isHome

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Main header — ヒーロー上は透明＋白、スクロールで白地＋濃色（sense-trust トンマナ） */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          solid ? 'bg-ivory border-b border-rule shadow-sm' : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container-edit h-[76px] flex items-center justify-between gap-6">
          {/* Wordmark */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <img
              src="/images/switch/logo-lockup.png"
              alt="SEKAI STAY"
              className={`h-7 w-auto transition-[filter] duration-300 ${solid ? '' : 'brightness-0 invert'}`}
              width={278}
              height={42}
            />
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-8">
            {NAV.map(n => (
              <Link
                key={n.href}
                href={n.href}
                className="group flex items-center leading-none"
              >
                <span className={`text-[13px] font-medium tracking-[0.08em] transition ${solid ? 'text-ink' : 'text-white'} group-hover:opacity-70`}>
                  {n.ja}
                </span>
              </Link>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <Link
              href="/audit"
              className="btn-cta inline-flex items-center rounded-md px-5 py-2.5 text-[12px] font-bold"
            >
              無料収益診断
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-md bg-navy px-5 py-2.5 text-[12px] font-bold text-white transition hover:bg-navy-hover"
            >
              お問い合わせ
            </Link>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-11 h-11 flex flex-col items-center justify-center gap-1.5 -mr-2"
            aria-label="メニュー"
          >
            <span className={`block w-6 h-px transition-all duration-300 ${solid ? 'bg-ink' : 'bg-white'} ${open ? 'rotate-45 translate-y-[3px]' : ''}`} />
            <span className={`block w-6 h-px transition-all duration-300 ${solid ? 'bg-ink' : 'bg-white'} ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px transition-all duration-300 ${solid ? 'bg-ink' : 'bg-white'} ${open ? '-rotate-45 -translate-y-[3px]' : ''}`} />
          </button>
        </div>

        {/* Mobile panel */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ${
            open ? 'max-h-[620px] border-t border-rule' : 'max-h-0'
          }`}
        >
          <nav className="container-edit py-8 flex flex-col gap-0 bg-ivory">
            {NAV.map((n, i) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="group flex items-baseline justify-between py-4 border-b border-rule"
              >
                <span className="font-sans text-[14px] text-ink/40 group-hover:opacity-70 transition">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[15px] font-medium text-ink group-hover:opacity-70 transition tracking-wide">
                  {n.ja}
                </span>
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-8">
              <Link
                href="/audit"
                onClick={() => setOpen(false)}
                className="btn btn-cta w-full"
              >
                無料収益診断
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="btn btn-primary w-full"
              >
                お問い合わせ
              </Link>
            </div>
            <p className="eyebrow-mono text-mid-gray mt-6 text-center">
              国土交通大臣 (01) 第F05780号
            </p>
          </nav>
        </div>
      </header>
    </>
  )
}
