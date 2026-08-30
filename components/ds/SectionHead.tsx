import Reveal from '@/components/motion/Reveal'
import TextSlideUp from '@/components/motion/TextSlideUp'

/**
 * [DESIGN_PARTS] SectionHead — 全セクション共通の見出し（sense-trust 踏襲）。
 * 巨大ENラベル（行スライドアップ）→ ヘアライン罫線 → 和文サブ → リード（フェード）。
 * light=true で濃色背景（navy / #1F9CA2 / paper以外のダーク）上の白文字に。
 */
export default function SectionHead({
  en,
  sub,
  lead,
  light = false,
  leadSolid = false,
  enClass,
  enColorClass,
  as = 'h2',
  hero = false,
}: {
  en: string
  sub?: string
  lead?: string
  light?: boolean
  /** leadSolid=true でリードを薄めずに純白（light時）に */
  leadSolid?: boolean
  enClass?: string
  /** ENラベルの色を上書き（例: text-sekai-teal でフックとして目立たせる） */
  enColorClass?: string
  as?: 'h1' | 'h2'
  /** hero=true で /services ヒーローと同じ大型寸法（EN・サブ・リード）に */
  hero?: boolean
}) {
  const inkColor = light ? 'text-white' : 'text-ink'
  const enColor = enColorClass ?? inkColor
  const leadColor = light ? (leadSolid ? 'text-white' : 'text-white/80') : 'text-ink/75'
  const resolvedEnClass = enClass ?? (hero ? 'text-[clamp(2.75rem,9vw,7rem)]' : 'text-[clamp(2.5rem,6vw,4.375rem)]')
  const subClass = hero
    ? 'mt-5 text-[clamp(1.375rem,3vw,2.25rem)] leading-[1.45]'
    : 'mt-2 text-[clamp(1.125rem,1.8vw,1.375rem)]'
  const leadClass = hero
    ? 'mt-8 max-w-2xl text-[15px] leading-[1.95] sm:text-[16px]'
    : 'mt-8 max-w-xl text-[15px] leading-[1.9] sm:text-[16px]'
  return (
    <div>
      <TextSlideUp as={as} className={`label-giant ${resolvedEnClass} tracking-[-0.03em] leading-[0.85] ${enColor}`}>{en}</TextSlideUp>
      {(sub || lead) && (
        <Reveal as="div" delay={0.08}>
          {sub && (
            <p className={`${subClass} font-bold ${inkColor}`}>
              {sub}
            </p>
          )}
          {lead && <p className={`${leadClass} ${leadColor}`}>{lead}</p>}
        </Reveal>
      )}
    </div>
  )
}
