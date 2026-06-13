import type { Metadata } from 'next'
import Header from '@/components/Header'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import { getAllOffices } from '@/lib/offices'

export const metadata: Metadata = {
  title: '会社概要',
  description: 'SEKAI STAYを運営する株式会社セカイチの会社概要。住宅宿泊管理業 国土交通大臣(01)第F05780号。東京・沖縄・京都・北海道・長野に拠点。',
  openGraph: {
    title: '会社概要 | SEKAI STAY',
    description: '株式会社セカイチの会社概要。住宅宿泊管理業 国土交通大臣(01)第F05780号。全国7拠点。',
    type: 'website',
    locale: 'ja_JP',
    url: 'https://sekaistay.com/company',
    siteName: 'SEKAI STAY',
  },
  twitter: {
    card: 'summary_large_image',
    title: '会社概要 | SEKAI STAY',
    description: '株式会社セカイチの会社概要。住宅宿泊管理業 国土交通大臣(01)第F05780号。',
  },
  alternates: { canonical: 'https://sekaistay.com/company' },
}

const INFO = [
  { label: '会社名', value: '株式会社セカイチ（SEKAICHI Inc.）' },
  { label: 'サービス名', value: 'SEKAI STAY' },
  { label: '代表者', value: '劉 添毅（リュウ テンイチ）\n明神 洸次郎（ミョウジン コウジロウ）' },
  { label: '所在地', value: '〒153-0042\n東京都目黒区青葉台2-20-7 KM中目黒ビル1F' },
  { label: '資本金(資本準備金含む)', value: '1,650万円' },
  { label: '法人番号', value: '4011001162956' },
  { label: '住宅宿泊管理業', value: '国土交通大臣(01)第F05780号' },
  { label: '事業内容', value: '民泊運用代行事業\n宿泊施設コンサルティング事業\n不動産関連事業' },
]

export default function CompanyPage() {
  const offices = getAllOffices()

  return (
    <>
      <Header />
      <Breadcrumb items={[{ label: '会社概要' }]} />
      <FloatingCTA />
      <main className="bg-ivory">
        {/* Chapter Ⅰ — editorial masthead */}
        <section className="relative bg-switch-charcoal text-white overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-32 -right-24 w-[640px] h-[640px] rounded-full opacity-25 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, #167B81 0%, transparent 65%)' }}
          />
          <div className="container-edit section-hero relative">
            <div className="chapter-marker">
              <span className="h-px w-6 bg-bright-teal" />
              <p className="eyebrow !text-bright-teal">Company</p>
            </div>
            <h1 className="heading-display text-white mb-5">
              会社概要
              <span className="block font-sans font-light text-white/60 text-[0.7em] mt-3">SEKAICHI Inc.</span>
            </h1>
            <p className="lead !text-white/75 max-w-2xl">
              SEKAI STAY は、株式会社セカイチ（SEKAICHI Inc.）が運営する民泊運用代行サービスです。
              住宅宿泊管理業 国土交通大臣(01)第F05780号として、全国7拠点のネットワークでオーナー様の資産価値向上を支援しています。
            </p>
          </div>
        </section>

        {/* Chapter Ⅱ — corporate ledger */}
        <section className="section-xl">
          <div className="container-narrow px-5 md:px-8">
            <div className="chapter-marker">
              <span className="eyebrow-mono text-mid-gray">§ 02</span>
              <span className="h-px bg-rule flex-1" />
              <p className="eyebrow text-sekai-teal">Corporate Ledger</p>
            </div>

            <div className="bg-white border border-switch-stone-border rounded-switch-lg shadow-switch-card overflow-hidden">
              {/* Header band */}
              <div className="bg-switch-teal-deep text-white px-8 py-6 flex items-baseline justify-between">
                <div>
                  <p className="eyebrow-mono text-bright-teal mb-1">SEKAI STAY</p>
                  <p className="font-sans text-[17px] md:text-[19px]">株式会社セカイチ（SEKAICHI Inc.）</p>
                </div>
                <p className="eyebrow-mono text-mid-gray hidden md:block">Company Record</p>
              </div>

              {/* Info rows */}
              <div>
                {INFO.map((row, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[120px_1fr] md:grid-cols-[220px_1fr] border-t border-rule"
                  >
                    <div className="px-5 md:px-8 py-5 md:py-6 bg-switch-cloud border-r border-rule">
                      <p className="eyebrow-mono text-mid-gray mb-1">№ {String(i + 1).padStart(2, '0')}</p>
                      <p className="font-sans text-[13px] md:text-[14px] text-ink font-medium">{row.label}</p>
                    </div>
                    <div className="px-5 md:px-8 py-5 md:py-6">
                      <p className="font-sans text-body-sm text-ink whitespace-pre-line leading-[1.8]">
                        {row.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Chapter Ⅲ — offices */}
        <section className="section-xl bg-switch-cloud border-y border-rule">
          <div className="container-edit px-5 md:px-8">
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <p className="eyebrow text-sekai-teal">National Network</p>
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <h2 className="heading-section text-ink max-w-2xl">
                全国<span className="font-sans text-sekai-teal">7拠点</span>のネットワーク
              </h2>
              <p className="font-sans text-body-sm text-dark-gray max-w-md leading-[1.9]">
                各地域のスタッフが物件の特性を熟知した運営をお届けします。清掃・ゲスト対応・緊急対応まで、ローカル体制で一貫してカバー。
              </p>
            </div>

            <div className="bg-rule grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px">
              {offices.map((office, idx) => (
                <div
                  key={office.id}
                  className={`p-8 ${office.isHQ ? 'bg-switch-teal-deep text-white rounded-switch-lg' : 'bg-white text-ink'}`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <p className={`eyebrow-mono ${office.isHQ ? 'text-bright-teal' : 'text-mid-gray'}`}>
                      Office № {String(idx + 1).padStart(2, '0')}
                    </p>
                    {office.isHQ && (
                      <span className="px-2 py-0.5 text-[10px] tracking-[0.15em] font-mono uppercase bg-bright-teal text-ink">
                        HQ
                      </span>
                    )}
                  </div>
                  <h3 className={`font-sans font-medium text-[19px] md:text-[21px] mb-2 ${office.isHQ ? 'text-ivory' : 'text-ink'}`}>
                    {office.name}
                  </h3>
                  <span className={`block w-8 h-px mb-5 ${office.isHQ ? 'bg-bright-teal' : 'bg-sekai-teal'}`} />
                  <p className={`font-sans text-caption leading-[1.85] ${office.isHQ ? 'text-ivory/80' : 'text-dark-gray'}`}>
                    {office.displayAddress}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Chapter Ⅳ — epilogue */}
        <section className="section-xl">
          <div className="container-narrow px-5 md:px-8 text-center">
            <p className="eyebrow-mono text-mid-gray mb-4">Colophon</p>
            <p className="font-sans font-light text-[24px] md:text-[32px] text-ink leading-[1.4] max-w-3xl mx-auto">
              「旅の記憶になる宿を、すべての地域に。」
            </p>
            <div className="flex items-center justify-center gap-4 mt-10">
              <span className="h-px w-16 bg-rule" />
              <p className="eyebrow text-sekai-teal">SEKAI · STAY</p>
              <span className="h-px w-16 bg-rule" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
