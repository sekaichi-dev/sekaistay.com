import ScrambleText from '@/components/motion/ScrambleText'

/**
 * [DESIGN_PARTS] GhostWordmark — セクション背面の巨大ゴースト英字（スクランブル収束・装飾）。
 * 親に relative＋overflow-hidden が必要。aria-hidden は ScrambleText 側で付与。
 */
export default function GhostWordmark({
  text = 'SEKAI STAY',
  className = '',
}: {
  text?: string
  className?: string
}) {
  return (
    <ScrambleText
      text={text}
      className={`pointer-events-none absolute -bottom-3 right-3 select-none whitespace-nowrap font-sans text-[19vw] font-bold leading-none tracking-tight text-ink/[0.04] sm:right-8 ${className}`}
    />
  )
}
