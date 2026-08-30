import Link from 'next/link'
import Image from 'next/image'
import { IconArrowRight } from '@/components/Icons'
import { JP } from '@/components/JP'

/**
 * FoundersBand — /switch/founder のアセット・紹介文を流用した創業者セクション
 * 役割: 人間味・親近感（信頼訴求は実績+第三者証明が主軸、ここは「顔が見える」の補完）
 */
const FOUNDERS = [
  {
    img: '/images/switch/founder-tenichi.png?v=2',
    name: '劉 添毅',
    role: '代表取締役 CEO',
    bio: '日米で民泊物件をオーナーとして運営し、業界の不透明な手数料構造と「見えない運用」に当事者として直面。Amazon 米国本社で培ったオペレーション設計の経験をもとに、「自分が任せたかった代行を、自分でつくる」と決意して創業。',
    width: 1024,
    height: 660,
  },
  {
    img: '/images/switch/founder-koji.png',
    name: '明神 洸次郎',
    role: '共同代表 Co-CEO',
    bio: '登録者125万人超のYouTubeグループ「カリスマブラザーズ」のクリエイター「ジロー」として、人の感情を10年以上動かしてきた。その感性をそのままプロダクトに注ぎ、オーナーポータルと運用フローを一から設計。',
    width: 840,
    height: 610,
  },
] as const

export default function FoundersBand() {
  return (
    <section className="relative bg-[#161616] overflow-hidden">
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #167B81 0%, transparent 65%)' }}
      />
      <div className="container-edit relative section-xl">
        <div className="text-center mb-12 md:mb-16">
          <p className="eyebrow-mono text-bright-teal mb-5">From the Founders</p>
          <h2 className="heading-hero text-white jp-keep">
            <JP>民泊代行業界を、</JP>
            <span className="text-bright-teal"><JP>変えに来ました。</JP></span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {FOUNDERS.map((f) => (
            <div key={f.name} className="bg-white/[0.04] border border-white/10 rounded-switch-lg overflow-hidden flex flex-col">
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src={f.img}
                  alt={`${f.name} — ${f.role}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  quality={85}
                  className="object-cover object-top"
                />
              </div>
              <div className="p-7 md:p-8 flex-1">
                <div className="flex items-baseline gap-3 mb-4">
                  <h3 className="font-sans font-bold text-[20px] text-white leading-none">{f.name}</h3>
                  <span className="eyebrow-mono text-bright-teal">{f.role}</span>
                </div>
                <p className="text-[13.5px] leading-[1.95] text-white/65 jp-break">{f.bio}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/about" className="inline-flex items-center gap-2 text-[13.5px] text-bright-teal hover:text-white transition group">
            私たちについて、もっと見る
            <IconArrowRight size={12} className="group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </div>
    </section>
  )
}
