import Link from 'next/link'
import Image from 'next/image'
import { HERO_V3 } from '@/content/home/copy-v3'
import { IconArrowRight } from '@/components/Icons'
import { JP } from '@/components/JP'

/**
 * Hero v3.1 — /switch トーン（ダーク基調・金8%・オレンジCTA）
 * ビジュアルは /switch/portal と同じオーナーアプリのモックアップを使用
 */
export default function HeroProduct() {
  return (
    <section className="relative bg-[#161616] overflow-hidden">
      {/* Teal glow wash — /switch hero と同系の演出 */}
      <div
        aria-hidden
        className="absolute -top-40 -right-20 w-[760px] h-[760px] rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #167B81 0%, transparent 65%)' }}
      />

      <div className="container-edit relative pt-16 md:pt-24 pb-0">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* ── Left : claim + CTAs ── */}
          <div className="lg:col-span-6 min-w-0 relative z-10 anim-fade-up">
            <p className="eyebrow-mono text-bright-teal mb-6">{HERO_V3.eyebrow}</p>

            <h1 className="heading-display text-white mb-7 jp-keep">
              <JP>{HERO_V3.headline.line1}</JP>
              <br />
              <span className="text-bright-teal">
                <JP>{HERO_V3.headline.line2}</JP>
              </span>
            </h1>

            <p className="text-[15.5px] md:text-[16.5px] leading-[1.95] text-white/70 mb-4 jp-break max-w-[540px]">
              売上・予約・清掃・ゲスト対応まで丸ごと任せて、物件の「今」はスマホでリアルタイム確認。かかりうる費用は、すべて事前に開示します。
            </p>
            <p className="font-sans mb-9 jp-keep">
              <span className="text-white/70 text-[15.5px]">基本料金は売上の</span>
              <span className="font-bold text-[34px] md:text-[40px] leading-none bg-gradient-to-br from-yellow-300 to-yellow-500 bg-clip-text text-transparent mx-1.5 align-[-4px]">8%</span>
              <span className="text-white/70 text-[15.5px]">＋月1万円/物件</span>
              <span className="text-white/40 text-[13px] ml-2">（業界平均15〜25%）</span>
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-4">
              <Link
                href={HERO_V3.primaryCta.href}
                className="inline-flex items-center justify-center gap-2.5 bg-switch-accent hover:bg-switch-accent-hover text-white font-bold text-[15px] px-8 py-4 rounded-switch-md transition shadow-switch-card group"
              >
                {HERO_V3.primaryCta.label}
                <IconArrowRight size={14} className="group-hover:translate-x-1 transition" />
              </Link>
              <Link
                href={HERO_V3.secondaryCta.href}
                className="inline-flex items-center justify-center gap-2.5 border border-white/30 hover:border-bright-teal text-white font-medium text-[14px] px-7 py-4 rounded-switch-md transition group"
              >
                {HERO_V3.secondaryCta.label}
                <IconArrowRight size={13} className="group-hover:translate-x-1 transition" />
              </Link>
            </div>

            <p className="text-[12px] text-white/45 mb-8">{HERO_V3.microcopy}</p>
            <p className="eyebrow-mono !text-[10px] text-white/35">{HERO_V3.license}</p>
          </div>

          {/* ── Right : owner app mockup（/switch/portal と同一アセット） ── */}
          <div className="lg:col-span-6 relative min-w-0 anim-fade-up flex justify-center" style={{ animationDelay: '0.15s' }}>
            <div className="relative w-[88%] max-w-[520px]">
              <Image
                src="/images/switch/dashboard-mockup.png?v=v4"
                alt="SEKAI STAY オーナーアプリ — 売上・予約・稼働率をリアルタイム表示するダッシュボード"
                width={1362}
                height={1155}
                priority
                sizes="(max-width: 1024px) 88vw, 520px"
                quality={85}
                className="w-full h-auto"
              />
              {/* Floating stat chips — portal hero と同型 */}
              <div className="absolute top-[8%] -left-2 md:left-0 bg-white rounded-switch-lg shadow-switch-modal px-4 py-2.5">
                <p className="font-sans font-bold text-[18px] text-switch-charcoal leading-none tabular-nums">★4.8</p>
                <p className="text-[10px] text-switch-gray-mid mt-1">レビュー平均</p>
              </div>
              <div className="absolute top-[34%] -right-1 md:right-0 bg-white rounded-switch-lg shadow-switch-modal px-4 py-2.5">
                <p className="font-sans font-bold text-[18px] text-sekai-teal leading-none tabular-nums">+57%</p>
                <p className="text-[10px] text-switch-gray-mid mt-1">月商改善（平均）</p>
              </div>
              <div className="absolute bottom-[14%] -left-2 md:left-4 bg-white rounded-switch-lg shadow-switch-modal px-4 py-2.5">
                <p className="font-sans font-bold text-[18px] text-switch-charcoal leading-none tabular-nums">97%</p>
                <p className="text-[10px] text-switch-gray-mid mt-1">オーナー継続率</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Numbers strip（ダーク帯のまま） ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 border-t border-white/10 py-7 mt-12 md:mt-14">
          {HERO_V3.numbers.map((n) => (
            <div key={n.label} className="flex flex-col min-w-0">
              <span className="font-sans font-bold text-[22px] md:text-[28px] text-white leading-none mb-2 tabular-nums jp-keep">
                {n.metric}
              </span>
              <span className="text-[11px] md:text-[12px] text-white/50 leading-snug jp-keep">
                <JP>{n.label}</JP>
              </span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-white/35 pb-10">
          出典: 当社管理物件（Airbnb / Booking.com ほか主要OTA掲載）2024-2025 集計
        </p>
      </div>
    </section>
  )
}
