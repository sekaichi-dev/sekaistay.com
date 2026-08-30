import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'SEKAI STAY — 手数料8%の民泊運用代行サービス'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          background: 'linear-gradient(135deg, #0e5a5f 0%, #167B81 50%, #1a8a91 100%)',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '24px' }}>
          <span style={{ fontSize: '120px', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>8</span>
          <span style={{ fontSize: '80px', fontWeight: 900, color: '#54BEC3', lineHeight: 1 }}>%</span>
        </div>
        <div style={{ fontSize: '48px', fontWeight: 800, color: '#ffffff', lineHeight: 1.3, marginBottom: '16px' }}>
          民泊運用代行
        </div>
        <div style={{ fontSize: '48px', fontWeight: 800, color: '#ffffff', lineHeight: 1.3, marginBottom: '32px' }}>
          手数料、払いすぎていませんか。
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px' }}>
          <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ✓ 移行作業は当社対応
          </span>
          <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ✓ 7ヶ月目以降 解約金¥0
          </span>
          <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ✓ 最短2週間
          </span>
        </div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: '#54BEC3', letterSpacing: '0.1em' }}>
          SEKAI STAY
        </div>
        <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>
          sekaistay.com
        </div>
      </div>
    ),
    { ...size }
  )
}
