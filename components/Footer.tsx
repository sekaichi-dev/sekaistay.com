import Link from 'next/link'
import AuditLink from '@/components/audit/AuditLink'

/* サイトナビ（Header の NAV と同じ href/ラベル） */
const FOOTER_NAV = [
  { href: '/services', label: '事業内容' },
  { href: '/pricing', label: '料金' },
  { href: '/case-studies', label: '実績・オーナーの声' },
  { href: '/blog', label: '民泊マガジン' },
  { href: '/faq', label: 'FAQ' },
  { href: '/about', label: '会社情報' },
  { href: '/audit', label: '無料収益診断' },
  { href: '/contact', label: 'お問い合わせ' },
]

export default function Footer() {
  return (
    <footer className="bg-navy-deep text-ivory">
      <div className="container-edit pt-16 pb-28 sm:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          {/* ブランド */}
          <div>
            <img
              src="/sekai_stay_03_03.png"
              alt="SEKAI STAY"
              className="h-8 w-auto"
              width={96}
              height={36}
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <p className="mt-6 max-w-sm text-[13px] leading-[1.95] text-ivory/55">
              手数料8%で民泊運営をワンストップで代行。稼働率とレビュー品質を高め、収益を最大化します。
            </p>
          </div>

          {/* 事業者情報 */}
          <dl className="flex flex-col gap-5 md:text-right">
            <div>
              <dt className="text-[11px] font-bold tracking-[0.12em] text-ivory/40">登録番号</dt>
              <dd className="mt-1.5 text-[13px] leading-[1.7] text-ivory/80">
                住宅宿泊管理業 国土交通大臣 (01) 第F05780号
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold tracking-[0.12em] text-ivory/40">運営会社</dt>
              <dd className="mt-1.5 text-[13px] leading-[1.7]">
                <a
                  href="https://sekaichi.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ivory/80 underline-offset-4 transition hover:text-ivory hover:underline"
                >
                  株式会社セカイチ（SEKAICHI Inc.）
                </a>
              </dd>
            </div>
          </dl>
        </div>

        {/* サイトナビ */}
        <nav className="mt-12 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-ivory/10 pt-8 sm:flex sm:flex-wrap sm:gap-x-8">
          {FOOTER_NAV.map((n) =>
            n.href === '/audit' ? (
              <AuditLink
                key={n.href}
                className="text-[13px] font-bold text-ivory/70 transition hover:text-ivory"
              >
                {n.label}
              </AuditLink>
            ) : (
              <Link
                key={n.href}
                href={n.href}
                className="text-[13px] font-bold text-ivory/70 transition hover:text-ivory"
              >
                {n.label}
              </Link>
            )
          )}
        </nav>

        {/* 下段 */}
        <div className="mt-10 flex flex-col gap-3 border-t border-ivory/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-grotesk text-[11px] tracking-[0.18em] text-ivory/40">
            © 2026 SEKAI STAY / SEKAICHI Inc.
          </p>
          <Link href="/privacy" className="text-[12px] text-ivory/55 transition hover:text-ivory">
            プライバシーポリシー
          </Link>
        </div>
      </div>
    </footer>
  )
}
