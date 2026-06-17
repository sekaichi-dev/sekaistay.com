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
  return (
    <a
      href="/audit"
      onClick={(e) => {
        e.preventDefault()
        open()
      }}
      className={className}
      {...rest}
    >
      {children}
    </a>
  )
}
