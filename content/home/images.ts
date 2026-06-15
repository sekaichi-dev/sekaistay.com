/**
 * SEKAI STAY — Homepage image assets
 * Unsplash 許諾範囲の写真を一元管理。差し替え時はここだけ更新。
 * Creative Guide 準拠：自然光・明るい・クリーン・ストックフォト感の薄いもの
 */

const UNSPLASH = (id: string, w = 1200, h?: number) =>
  `https://images.unsplash.com/photo-${id}?w=${w}${
    h ? `&h=${h}` : ''
  }&fit=crop&q=70&auto=format`

export const IMG = {
  // ─── Hero ─────────────────────────────────
  heroMain: {
    src: UNSPLASH('1522708323590-d24dbb6b0267', 900, 1100),
    alt: 'SEKAI STAYが管理する、自然光の入る清潔な客室',
  },

  // ─── Entry Points ─────────────────────────
  entryExisting: {
    src: UNSPLASH('1560448204-e02f11c3d0e2', 800, 500),
    alt: '運用中の民泊物件のリビング',
  },
  entryStarting: {
    src: UNSPLASH('1600585154340-be6161a56a0c', 800, 500),
    alt: 'これから運営を始める物件の外観',
  },
  entryExploring: {
    src: UNSPLASH('1554118811-1e0d58224f24', 800, 500),
    alt: '収益を試算するイメージ',
  },

  // ─── Value Prop visual ────────────────────
  valueAccent: {
    src: UNSPLASH('1540541338287-41700207dee6', 800, 900),
    alt: '京都の町家風物件と地域性',
  },

  // ─── Ecosystem: F&B spots ─────────────────
  fbNojiri: {
    // 都市型カフェの自然光の入る店内（中目黒の雰囲気）
    src: UNSPLASH('1525610553991-2bede1a236e2', 900, 700),
    alt: 'The World Cafe（東京・中目黒）の店内',
  },
  fbKyoto: {
    // 和食・食のクローズアップ
    src: UNSPLASH('1580959375944-abd7e991f971', 900, 700),
    alt: '京都の飲食事業のフードイメージ',
  },
  fbAmbient: {
    src: UNSPLASH('1554118811-1e0d58224f24', 1200, 600),
    alt: '自社飲食事業の店内',
  },

  // ─── Ecosystem: Media & Creative ──────────
  mediaStudio: {
    src: UNSPLASH('1533094602577-198d3beab8ea', 1200, 600),
    alt: 'クリエイティブ制作の現場',
  },

  // ─── Results cases（自社管理物件の実写真。/case-studies 先頭3件と一致） ──
  caseNojiri: {
    src: '/images/switch/property-villa.jpg',
    alt: 'Lake House Nojiriko（野尻湖の貸別荘）',
  },
  caseKyoto: {
    src: '/images/switch/property-cabin.jpg',
    alt: 'The Lakeside Inn Nojiriko（トレーラーハウス複合施設）',
  },
  caseNew: {
    src: '/images/switch/property-niseko.jpg',
    alt: 'Mountain Villa Niseko（一棟貸し山岳ロッジ）',
  },

  // ─── Final CTA ────────────────────────────
  finalCta: {
    src: UNSPLASH('1566073771259-6a8506099945', 1600, 900),
    alt: '次のゲストを迎える準備の整った客室',
  },
} as const
