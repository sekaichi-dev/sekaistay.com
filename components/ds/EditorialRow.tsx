import Reveal from '@/components/motion/Reveal'

/**
 * [DESIGN_PARTS] EditorialRow — 全幅の「画像＋テキスト」行（sense-trust Info Card型）。
 * 常に明色カード（paper＋rule）。reverse で画像を右に。濃色セクション上に置くと映える。
 */
export default function EditorialRow({
  image,
  alt,
  no,
  title,
  lead,
  body,
  status,
  reverse = false,
}: {
  image: string
  alt: string
  no?: string
  title: string
  lead?: string
  body?: string
  status?: string
  reverse?: boolean
}) {
  return (
    <Reveal as="div" className="grid overflow-hidden rounded-[14px] bg-paper ring-1 ring-rule lg:grid-cols-2">
      <div className={`aspect-[16/10] overflow-hidden lg:aspect-auto ${reverse ? 'lg:order-2' : ''}`}>
        <img src={image} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
        <div className="flex items-baseline gap-3">
          {no && <span className="font-grotesk text-[15px] font-bold tracking-[0.12em] text-ink/40">{no}</span>}
          <h3 className="text-[clamp(1.25rem,1.9vw,1.5rem)] font-bold leading-snug text-ink">{title}</h3>
        </div>
        {lead && <p className="mt-4 text-[15px] font-bold leading-snug text-sekai-teal">{lead}</p>}
        {body && <p className="mt-4 text-[14px] leading-[1.9] text-ink/75">{body}</p>}
        {status && <p className="mt-6 text-[12px] font-bold tracking-[0.06em] text-ink/50">{status}</p>}
      </div>
    </Reveal>
  )
}
