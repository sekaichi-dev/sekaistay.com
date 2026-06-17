/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000,
  },
  compress: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
    optimizeCss: false,
  },
  reactStrictMode: true,
  compiler: {
    // 本番では console.log は削除（ノイズ削減）するが、サーバ側の障害調査に必要な
    // warn/error は残す。これがないと lib/meta-capi.ts 等の警告ログが
    // Vercel logs に届かず、CAPI 失敗時の切り分けが不可能になる。
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  async headers() {
    // dev では即時 immutable キャッシュを付けない。
    // dev のチャンクは content-hash されないため、immutable を付けると
    // ビルド変更後もブラウザが旧チャンクを参照し options.factory クラッシュを起こす。
    // 本番（content-hash 付き）でのみ長期 immutable を付与する。
    if (process.env.NODE_ENV !== 'production') {
      return []
    }
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*(js|css)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  // 動線整理: /diagnostic と /result は /audit に統合済み
  async redirects() {
    return [
      { source: '/diagnostic',         destination: '/audit', permanent: true },
      { source: '/diagnostic/:path*',  destination: '/audit', permanent: true },
      { source: '/result',             destination: '/audit', permanent: true },
      { source: '/result/:path*',      destination: '/audit', permanent: true },
      // 対応エリア一覧は /services の AREA セクションへ移設。個別エリア /area/:slug は温存。
      { source: '/area',               destination: '/services#area', permanent: true },
      // 会社概要は /about に統合済み。
      { source: '/company',            destination: '/about', permanent: true },
    ]
  },
}

module.exports = nextConfig
