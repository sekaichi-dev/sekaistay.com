import Link from 'next/link'
import { CREDENTIALS } from '@/content/home/copy'
import { JP } from '@/components/JP'
import { IconArrowRight } from '@/components/Icons'

type CredBlock = {
  label: string
  primary: string
  secondary: string
  href?: string
  external?: boolean
}

// 公式カラー準拠の OTA ワードマーク
const OTA_PARTNERS: { name: string; color: string; sub?: string }[] = [
  { name: 'airbnb',        color: '#FF5A5F', sub: 'Superhost 多数' },
  { name: 'Booking.com',   color: '#003580', sub: 'Preferred Partner' },
  { name: 'Vrbo',          color: '#245ABC' },
  { name: 'Expedia',       color: '#FDB813' },
  { name: '楽天トラベル',   color: '#BF0000' },
  { name: 'agoda',         color: '#5B2D90' },
]

export default function Credentials() {
  const blocks = CREDENTIALS.blocks as readonly CredBlock[]
  return (
    <section
      aria-label="運営体制と法令・資格の裏付け"
      className="bg-paper border-y border-rule"
    >
      <div className="container-edit section-xl">
        {/* Header */}
        <div className="heading-mb-lg">
          <div className="chapter-marker">
            <span className="rule-teal-sm" />
            <span className="eyebrow">{CREDENTIALS.eyebrow}</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-end">
            <h2 className="heading-hero text-ink jp-keep">
              <JP>{CREDENTIALS.headline.line1}</JP>
              <br />
              <span className="font-sans font-light text-sekai-teal">
                <JP>{CREDENTIALS.headline.line2}</JP>
              </span>
            </h2>
            <p className="lead text-dark-gray jp-break">
              {CREDENTIALS.body}
            </p>
          </div>
        </div>

        {/* Credential Grid — editorial ledger cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 bg-rule gap-px border border-rule heading-mb-lg">
          {blocks.map((b, i) => {
            const inner = (
              <>
                <div className="flex items-start justify-between mb-5">
                  <p className="eyebrow text-sekai-teal">{b.label}</p>
                  <span className="font-sans text-[14px] text-mid-gray">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="font-sans font-medium text-[16px] md:text-[17px] text-ink leading-snug mb-3 jp-keep">
                  <JP>{b.primary}</JP>
                </h3>
                <p className="text-caption text-dark-gray leading-relaxed jp-break">
                  {b.secondary}
                </p>
              </>
            )
            const baseClass =
              'bg-paper p-5 md:p-6 lg:p-7 h-full transition flex flex-col'
            if (b.href) {
              return (
                <a
                  key={b.label}
                  href={b.href}
                  target={b.external ? '_blank' : undefined}
                  rel={b.external ? 'noopener noreferrer' : undefined}
                  className={`${baseClass} group hover:bg-mist`}
                >
                  {inner}
                  <span className="mt-auto pt-4 inline-flex items-center gap-1.5 eyebrow-mono text-sekai-teal opacity-0 group-hover:opacity-100 transition">
                    公式サイト <IconArrowRight size={10} />
                  </span>
                </a>
              )
            }
            return (
              <div key={b.label} className={baseClass}>
                {inner}
              </div>
            )
          })}
        </div>

        {/* OTA Partners Strip */}
        <div className="heading-mb-lg">
          <div className="chapter-marker">
            <span className="rule-teal-sm" />
            <span className="eyebrow text-sekai-teal">Channel Partners</span>
            <span className="text-caption text-mid-gray hidden sm:inline">
              公式API・パートナープログラム経由で運用
            </span>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 bg-rule gap-px border border-rule">
            {OTA_PARTNERS.map((p) => (
              <div
                key={p.name}
                className="bg-paper px-3 py-5 md:py-6 flex flex-col items-center justify-center min-h-[90px] text-center"
              >
                <span
                  className="text-[12px] sm:text-[14px] md:text-[15px] font-bold tracking-tight leading-none"
                  style={{ color: p.color }}
                >
                  {p.name}
                </span>
                {p.sub && (
                  <span className="mt-2 text-[10px] text-mid-gray font-sans">
                    {p.sub}
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className="mt-4 text-caption text-mid-gray leading-relaxed jp-break">
            ※ 各社のロゴ・ブランドは各社に帰属します。掲載状況・Superhost認定・Preferred Partnerステータスは物件ごとに異なります。
          </p>
        </div>

        {/* Comparison block — editorial panel */}
        <div className="relative bg-mist border border-rule overflow-hidden">
          <div className="p-8 md:p-10 lg:p-12 grid lg:grid-cols-[auto_1fr_auto] gap-6 lg:gap-10 items-start">
            <div>
              <p className="eyebrow-mono text-mid-gray mb-2">Comparison</p>
              <span className="font-sans font-light text-[56px] md:text-[72px] text-sekai-teal leading-none tabular-nums">
                8%
              </span>
              <p className="font-sans text-[13px] text-mid-gray mt-2">vs 15〜20%</p>
            </div>
            <div className="min-w-0">
              <h3 className="font-sans font-medium text-[20px] md:text-[22px] text-ink mb-4 leading-snug jp-keep">
                <JP>{CREDENTIALS.compareHeadline}</JP>
              </h3>
              <p className="text-body text-dark-gray leading-relaxed jp-break">
                {CREDENTIALS.compareOneLiner}
              </p>
            </div>
            <Link href="/pricing" className="btn-link flex-shrink-0">
              料金と他社比較の詳細
              <IconArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Compliance note */}
        <p className="mt-8 text-caption text-mid-gray leading-relaxed jp-break max-w-3xl">
          {CREDENTIALS.note}
        </p>
      </div>
    </section>
  )
}
