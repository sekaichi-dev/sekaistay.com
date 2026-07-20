'use client'

import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { useAuditModal } from './AuditModalProvider'

/* /audit へのリンク（ヘッダー以外）。href は /audit のまま（JS無効時のフォールバック）、
 * クリックで遷移せずお問い合わせモーダルを開く。 */
export default function AuditLink({
  children,
  className,
  ...rest
}: { children: ReactNode; className?: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { open } = useAuditModal()
  // data-cta-label を流入元 (cta_source) としてモーダルへ渡す。リード送信時に記録される。
  const ctaSource = (rest as Record<string, unknown>)['data-cta-label']
  return (
    <a
      href="/audit"
      onClick={(e) => {
        e.preventDefault()
        open(typeof ctaSource === 'string' ? ctaSource : undefined)
      }}
      className={className}
      {...rest}
    >
      {children}
    </a>
  )
}
