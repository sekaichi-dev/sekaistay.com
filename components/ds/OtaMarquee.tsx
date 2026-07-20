import { OtaChips } from '@/components/home/SenseSections'

/**
 * [DESIGN_PARTS] OtaMarquee — 対応OTAロゴの無限マーキー帯（信頼要素）。枠線なし・フルブリード。
 * 既定は navy 帯。bg を変えたい場合は className で上書き。
 */
export default function OtaMarquee({ className = 'bg-navy' }: { className?: string }) {
  return (
    <section className={`w-full overflow-hidden py-6 sm:py-8 ${className}`}>
      <div className="marquee w-max items-center">
        <OtaChips />
      </div>
    </section>
  )
}
