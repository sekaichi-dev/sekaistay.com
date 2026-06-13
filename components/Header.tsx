'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const NAV = [
  { href: '/services', label: 'Services', ja: '運営代行' },
  { href: '/case-studies', label: 'Proof', ja: '実績・エリア' },
  { href: '/pricing', label: 'Pricing', ja: '料金' },
  { href: '/about', label: 'About', ja: '私たちについて' },
  { href: '/blog', label: 'Journal', ja: 'コラム' },
  { href: '/faq', label: 'FAQ', ja: 'よくある質問' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Meta bar — 法令表記 / 受付時間 */}
      <div className="hidden md:block bg-ink text-ivory/75 text-[10.5px] tracking-[0.14em]">
        <div className="container-edit flex items-center justify-between py-1.5 font-mono uppercase">
          <span>住宅宿泊管理業 ／ 国土交通大臣 (01) 第F05780号</span>
          <span>Reception — Mon–Fri 9:00 <span className="opacity-60">—</span> 18:00 JST</span>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 bg-ivory ${
          scrolled
            ? 'border-b border-rule shadow-sm'
            : 'border-b border-transparent'
        }`}
      >
        <div className="container-edit h-[76px] flex items-center justify-between gap-6">
          {/* Wordmark */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <img
              src="/sekai_stay_03_03.png"
              alt="SEKAI STAY"
              className="h-7 w-auto"
              width={74}
              height={28}
            />
          </Link>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV.map(n => (
              <Link
                key={n.href}
                href={n.href}
                className="group flex flex-col items-center text-center leading-none"
              >
                <span className="font-sans text-[13px] tracking-[0.04em] text-ink/50 group-hover:text-sekai-teal transition">
                  {n.label}
                </span>
                <span className="text-[11.5px] font-medium tracking-[0.08em] text-ink group-hover:text-sekai-teal transition mt-1">
                  {n.ja}
                </span>
              </Link>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <Link href="/audit" className="btn btn-ghost text-[11.5px] px-5 py-3">
              無料物件診断
            </Link>
            <Link href="/contact" className="btn btn-primary text-[11.5px] px-5 py-3">
              無料相談
            </Link>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden w-11 h-11 flex flex-col items-center justify-center gap-1.5 -mr-2"
            aria-label="メニュー"
          >
            <span className={`block w-6 h-px bg-ink transition-all duration-300 ${open ? 'rotate-45 translate-y-[3px]' : ''}`} />
            <span className={`block w-6 h-px bg-ink transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-ink transition-all duration-300 ${open ? '-rotate-45 -translate-y-[3px]' : ''}`} />
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
                <span className="font-sans text-[14px] text-ink/40 group-hover:text-sekai-teal transition">
                  {String(i + 1).padStart(2, '0')} · {n.label}
                </span>
                <span className="text-[15px] font-medium text-ink group-hover:text-sekai-teal transition tracking-wide">
                  {n.ja}
                </span>
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-8">
              <Link
                href="/audit"
                onClick={() => setOpen(false)}
                className="btn btn-ghost w-full"
              >
                無料物件診断
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="btn btn-primary w-full"
              >
                無料相談
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
