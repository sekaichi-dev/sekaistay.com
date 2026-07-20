'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { resolveLpVariant } from '@/lib/lp-variant'
import { captureAttribution } from '@/lib/attribution'

// Next.js の App Router はクライアント遷移で layout が再マウントされないため、
// Meta Pixel と GA4 の PageView は明示的に再発火する必要がある。
//
// 初回ロード: layout.tsx のインラインスクリプトが lp_variant 付きで GA4 page_view を発火済み
//   (config で send_page_view を有効のまま lp_variant を付与)。Meta/X も初回発火済み。
// 当コンポーネントは「pathname が変わったとき」だけ追加発火する。SPA 遷移の GA4 page_view には
//   lp_variant(path から解決)を付与する — これがないと variant 別計測が (not set) になる。
//
// 依存配列に searchParams を含めない理由:
//   useSearchParams() はハイドレーションで値が遅延してくるため、UTM 付きランディング URL では
//   useEffect が 2 回走り (空 → utm 付き)、後者で fullPath が変化したと誤判定して二重発火する。
//   pathname 変化のみで発火する設計に揃え、現在の URL の searchParams は発火時に snapshot 化する。
// 副作用: 同一 path 内での searchParams のみの変更 (例: /switch → /switch?utm=x) は track しない。
//   実用上ほぼ発生しないので許容。
export default function AnalyticsRouteTracker() {
  const pathname = usePathname()
  // searchParams は読み出すだけで依存にしない (ESLint 警告は意図的に無視)
  const searchParams = useSearchParams()
  const lastTrackedPath = useRef<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const w = window as unknown as {
      fbq?: (...a: unknown[]) => void
      gtag?: (...a: unknown[]) => void
      twq?: (...a: unknown[]) => void
      dataLayer?: unknown[]
    }

    if (lastTrackedPath.current === pathname) return
    const isInitial = lastTrackedPath.current === null
    lastTrackedPath.current = pathname

    // 属性の 90 日ファーストパーティ保存 (初回着地含む毎遷移)。
    // utm/gclid/fbclid が URL から消えた後のフォーム送信でも参照元を復元できるようにする。
    captureAttribution()

    if (isInitial) return // 初回は layout.tsx が lp_variant 込みで既に発火済み

    const query = searchParams?.toString()
    const fullPath = query ? `${pathname}?${query}` : pathname
    const lpVariant = resolveLpVariant(pathname)

    if (!w.dataLayer) w.dataLayer = []
    if (typeof w.gtag === 'function') {
      w.gtag('event', 'page_view', { page_path: fullPath, lp_variant: lpVariant })
    } else {
      w.dataLayer.push(['event', 'page_view', { page_path: fullPath, lp_variant: lpVariant }])
    }

    if (typeof w.fbq === 'function') {
      w.fbq('track', 'PageView')
    }

    // X Pixel SPA tracking: twq('config', PIXEL_ID) は idempotent で再呼び出しで PageView を発火する。
    // X_PIXEL_ID env が未設定なら layout.tsx で twq 自体が初期化されないため、ここの呼び出しは no-op。
    const xPixelId = process.env.NEXT_PUBLIC_X_PIXEL_ID
    if (xPixelId && typeof w.twq === 'function') {
      w.twq('config', xPixelId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return null
}
