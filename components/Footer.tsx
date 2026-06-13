import Link from 'next/link'

const SERVICE_LINKS = [
  { href: '/services', label: '民泊運営代行' },
  { href: '/services#phase-1', label: '集客・予約管理' },
  { href: '/services#phase-2', label: '清掃・メンテナンス' },
  { href: '/services#phase-0', label: '開業準備サポート' },
  { href: '/services#pricing', label: '無料シミュレーション' },
  { href: '/audit', label: '無料物件診断' },
]

const COMPANY_LINKS = [
  { href: '/about', label: '私たちについて' },
  { href: '/company', label: '会社概要' },
  { href: '/case-studies', label: '実績・対応エリア' },
  { href: '/blog', label: 'コラム' },
  { href: '/pricing', label: '料金' },
  { href: '/faq', label: 'よくある質問' },
  { href: '/contact', label: 'お問い合わせ' },
  { href: '/privacy', label: 'プライバシーポリシー' },
]

const AREA_LINKS = [
  { href: '/area/tokyo', label: '東京' },
  { href: '/area/osaka', label: '大阪' },
  { href: '/area/kyoto', label: '京都' },
  { href: '/area/fukuoka', label: '福岡' },
  { href: '/area/okinawa', label: '沖縄' },
  { href: '/area/hokkaido', label: '北海道' },
  { href: '/area/hakone', label: '箱根' },
  { href: '/area/karuizawa', label: '軽井沢' },
  { href: '/case-studies#area', label: 'すべてのエリア →' },
]

export default function Footer() {
  return (
    <footer className="relative bg-ink text-ivory overflow-hidden">
      {/* Brand credo band */}
      <div className="relative border-b border-ivory/10">
        <div className="container-edit section-lg text-center">
          <p className="eyebrow text-bright-teal mb-6">A Letter from SEKAI STAY</p>
          <p className="heading-display text-ivory !font-sans max-w-[22ch] mx-auto leading-[1.2]">
            運用は、<span className="text-bright-teal">丸投げでいい。</span>
            <br className="hidden md:inline" />
            成果は、オーナーに届くように。
          </p>
          <div className="rule-teal mx-auto mt-10" />
        </div>
      </div>

      <div className="container-edit section-lg">
        <div className="grid md:grid-cols-12 gap-12 mb-16">
          {/* Brand column */}
          <div className="md:col-span-5">
            <img
              src="/sekai_stay_03_03.png"
              alt="SEKAI STAY"
              className="h-9 w-auto mb-6"
              width={96}
              height={36}
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <p className="text-body-sm text-ivory/70 leading-[2] mb-6 max-w-sm">
              SEKAI STAYは、手数料8%で民泊運営をワンストップで代行するサービスです。
              稼働率とレビュー品質を上げ、収益を最大化します。
            </p>
            <div className="space-y-2 text-caption text-ivory/55 font-mono tracking-[0.14em] uppercase">
              <p>住宅宿泊管理業 ／ 国土交通大臣 (01) 第F05780号</p>
              <p>
                運営 ／{' '}
                <a
                  href="https://sekaichi.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-grow text-ivory/80 hover:text-bright-teal"
                >
                  株式会社セカイチ (SEKAICHI Inc.)
                </a>
              </p>
            </div>
          </div>

          {/* Service */}
          <div className="md:col-span-2">
            <p className="chapter text-bright-teal mb-5">Ⅰ. Service</p>
            <nav className="flex flex-col gap-3">
              {SERVICE_LINKS.map(l => (
                <Link key={l.href} href={l.href} className="text-[13px] text-ivory/70 hover:text-bright-teal transition">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <p className="chapter text-bright-teal mb-5">Ⅱ. Company</p>
            <nav className="flex flex-col gap-3">
              {COMPANY_LINKS.map(l => (
                <Link key={l.href} href={l.href} className="text-[13px] text-ivory/70 hover:text-bright-teal transition">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Area */}
          <div className="md:col-span-3">
            <p className="chapter text-bright-teal mb-5">Ⅲ. Area</p>
            <nav className="grid grid-cols-2 gap-x-4 gap-y-3">
              {AREA_LINKS.map(l => (
                <Link key={l.href} href={l.href} className="text-[13px] text-ivory/70 hover:text-bright-teal transition">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-ivory/10 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-[10.5px] text-ivory/50 font-mono tracking-[0.22em] uppercase">
            &copy; 2026 SEKAI STAY / SEKAICHI Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-[10.5px] text-ivory/50 hover:text-bright-teal transition font-mono tracking-[0.22em] uppercase">
              Privacy
            </Link>
            <span className="wordmark text-[10.5px] text-ivory/50">
              Tokyo · Osaka · Kyoto
            </span>
          </div>
        </div>
      </div>

      {/* Giant ghost wordmark */}
      <div
        aria-hidden
        className="absolute -bottom-6 md:-bottom-12 left-0 right-0 text-center pointer-events-none select-none"
      >
        <p
          className="font-sans text-ivory/5 leading-none"
          style={{ fontSize: 'clamp(5rem, 18vw, 16rem)', letterSpacing: '0.08em', fontWeight: 300 }}
        >
          SEKAI STAY
        </p>
      </div>
    </footer>
  )
}
