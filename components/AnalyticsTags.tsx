'use client'

// root layout の解析・広告タグ（Yahoo ytag・GA4/Google Ads・Clarity・Meta Pixel・X）。
// /lease 配下（契約同意フォーム・個人情報と身分証を扱う）では描画しない。他のページの中身・順序は layout.tsx にあった時のまま。
import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { isAnalyticsExcludedPath } from '@/lib/analytics-scope'

type Ids = {
  gaId: string
  googleAdsId: string
  clarityId: string
  metaPixelId: string
  xPixelId: string
  xSiteVisitEventId: string
}

export function AnalyticsHeadTags({ gaId, googleAdsId, clarityId, metaPixelId, xPixelId, xSiteVisitEventId }: Ids) {
  const pathname = usePathname()
  if (isAnalyticsExcludedPath(pathname)) return null
  return (
    <>
      {/* Yahoo!広告 サイトジェネラルタグ — 全ページ共通・<head> 最上部に配置（Yahoo指定） */}
      <script async src="https://s.yimg.jp/images/listing/tool/cv/ytag.js" />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.yjDataLayer = window.yjDataLayer || [];
function ytag() { yjDataLayer.push(arguments); }
ytag({"type":"ycl_cookie", "config":{"ycl_use_non_cookie_storage":true}});`,
        }}
      />
      {/* Google tag (gtag.js) — GA4 + Google Ads コンバージョン */}
      <Script id="ga4-loader" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
      {/* 初回 page_view は config 時に lp_variant を付与して自動発火させる(config 直後・gtag 定義済みで
          確実に発火する=レースなし)。sekaiLpVariant() の分岐は lib/lp-variant.ts と一致させること。
          SPA 遷移分は AnalyticsRouteTracker が lp_variant 付きで再発火する。 */}
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;function sekaiLpVariant(){var p=location.pathname;if(p.length>1&&p.charAt(p.length-1)==='/')p=p.slice(0,-1);if(p==='/switch/founder')return'switch-founder';if(p==='/switch/portal')return'switch-portal';if(p==='/switch')return'switch';if(p==='/audit')return'audit';if(p==='/contact')return'contact';return'direct';}gtag('js',new Date());gtag('config','${gaId}',{lp_variant:sekaiLpVariant()});${googleAdsId ? `gtag('config','${googleAdsId}');` : ''}`}
      </Script>
      {clarityId && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`}
        </Script>
      )}
      {/* Meta Pixel — Facebook/Instagram 広告コンバージョン */}
      <Script id="meta-pixel-init" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`}
      </Script>
      {/* X (Twitter) Universal Website Tag — X Ads コンバージョン。
          config 直後に SiteVisit イベントを発火（全ページの初回ロードで計測）。 */}
      {xPixelId && (
        <Script id="x-pixel-init" strategy="afterInteractive">
          {`!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');twq('config','${xPixelId}');twq('event','${xSiteVisitEventId}',{});`}
        </Script>
      )}
    </>
  )
}

export function MetaPixelNoscript({ metaPixelId }: { metaPixelId: string }) {
  const pathname = usePathname()
  if (isAnalyticsExcludedPath(pathname)) return null
  // <noscript> 内の <img> を JSX で書くと Next.js/React の自動 resource hints が
  // <link rel="preload" as="image"> を生成し、JS 有効ユーザーでも実際に preload で
  // HTTP リクエストが飛び、Meta 側で PageView が二重カウントされる。
  // dangerouslySetInnerHTML で raw HTML として渡すことで React の解析対象から外す。
  return (
    <noscript
      dangerouslySetInnerHTML={{
        __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1" alt="" />`,
      }}
    />
  )
}
