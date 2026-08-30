/**
 * [DESIGN_PARTS] ImageMarquee — 画像を左へ連続スクロールさせる帯（OTAロゴ帯 .marquee と同じ挙動）。
 * 上のロゴ帯と同じ「左進行・等速」。durationSec で速度（px/秒がロゴ帯と揃うよう調整）。
 */
export default function ImageMarquee({
  images,
  durationSec = 40,
  className = '',
}: {
  images: { src: string }[]
  durationSec?: number
  className?: string
}) {
  return (
    <section className={`w-full overflow-hidden bg-navy ${className}`}>
      <div className="marquee w-max" style={{ animationDuration: `${durationSec}s` }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className="inline-flex shrink-0">
            {images.map((im, j) => (
              <span
                key={`${i}-${j}`}
                className="block h-[340px] w-[500px] overflow-hidden sm:h-[520px] sm:w-[780px]"
              >
                <img src={im.src} alt="" aria-hidden loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </span>
            ))}
          </span>
        ))}
      </div>
    </section>
  )
}
