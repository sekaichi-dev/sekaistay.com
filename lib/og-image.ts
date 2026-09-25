/**
 * OGP（SNS でURLを貼ったときのプレビュー）画像の正本。
 *
 * Next.js の metadata は openGraph オブジェクトごと上書きされるため、
 * ページ側で openGraph を定義すると親の images を引き継がない。
 * 画像を差し替えるときはこのファイルだけを直し、各ページはここを参照する。
 */
export const OG_IMAGE_URL = 'https://sekaistay.com/og-sekaistay.jpg'

export const OG_IMAGE = {
  url: OG_IMAGE_URL,
  width: 1200,
  height: 630,
  alt: 'SEKAI STAY — 民泊運用のすべてを8%で',
} as const
