/**
 * SEKAI STAY — SVG Icon Library
 * 絵文字を使わず、ブランドカラー準拠のSVGアイコンで統一。
 * DESIGN.md: SEKAI Teal #259DA3 / Deep Teal #167B81 / Charcoal #2D2D2D
 */

type IconProps = {
  size?: number
  color?: string
  className?: string
}

const defaults = { size: 24, color: 'currentColor' }

/* ── Media & Authority ── */

export function IconTV({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="5" width="20" height="13" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M8 21h8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 18v3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function IconYouTube({ size = 24, className }: IconProps) {
  // Authentic YouTube brand mark — red rounded rectangle + white play triangle
  return (
    <svg
      width={size}
      height={size * (18 / 24)}
      viewBox="0 0 24 18"
      fill="none"
      className={className}
      aria-label="YouTube"
    >
      <path
        d="M23.498 2.81a3.008 3.008 0 00-2.12-2.13C19.505.2 12 .2 12 .2s-7.505 0-9.378.48A3.008 3.008 0 00.502 2.81C.02 4.687 0 8.5 0 8.5s.02 3.813.502 5.69a3.008 3.008 0 002.12 2.13C4.495 16.8 12 16.8 12 16.8s7.505 0 9.378-.48a3.008 3.008 0 002.12-2.13C23.98 12.313 24 8.5 24 8.5s-.02-3.813-.502-5.69z"
        fill="#FF0000"
      />
      <path d="M9.6 12.2V4.8L15.8 8.5l-6.2 3.7z" fill="#FFFFFF" />
    </svg>
  )
}

export function IconTrophy({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 7H4a1 1 0 00-1 1v1a4 4 0 004 4M17 7h3a1 1 0 011 1v1a4 4 0 01-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconPlane({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M22 2L11 13M22 2l-7 20-3-9-9-3 19-6z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconBuilding({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 21h18M5 21V7l7-4 7 4v14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 9h2v2H9zM13 9h2v2h-2zM9 13h2v2H9zM13 13h2v2h-2zM10 21v-4h4v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconStar({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

/* ── Assurance ── */

export function IconCoinZero({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
      <path d="M9 12a3 3 0 106 0 3 3 0 00-6 0z" stroke={color} strokeWidth="1.5" />
      <path d="M12 7v1M12 16v1" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function IconShield({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3l7 3v5c0 4.5-3 8.25-7 9.5-4-.75-7-5-7-9.5V6l7-3z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconRefresh({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M1 4v6h6M23 20v-6h-6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconHeadset({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 18v-6a9 9 0 0118 0v6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 18a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5zM3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Features / Services ── */

export function IconChart({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M18 20V10M12 20V4M6 20v-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconCheckCircle({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
      <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconDashboard({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5" />
      <rect x="14" y="3" width="7" height="4" rx="1.5" stroke={color} strokeWidth="1.5" />
      <rect x="3" y="14" width="7" height="4" rx="1.5" stroke={color} strokeWidth="1.5" />
      <rect x="14" y="11" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5" />
    </svg>
  )
}

export function IconGlobe({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke={color} strokeWidth="1.5" />
    </svg>
  )
}

export function IconSparkle({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

export function IconMail({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M22 6l-10 7L2 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconBarChart({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="12" width="4" height="8" rx="1" stroke={color} strokeWidth="1.5" />
      <rect x="10" y="6" width="4" height="14" rx="1" stroke={color} strokeWidth="1.5" />
      <rect x="17" y="2" width="4" height="18" rx="1" stroke={color} strokeWidth="1.5" />
    </svg>
  )
}

/* ── Flow ── */

export function IconArrowRight({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 12h14M12 5l7 7-7 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconCheck({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 12l5 5L20 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconArrowLeft({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Property Types ── */

export function IconApartment({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="4" y="3" width="16" height="18" rx="1" stroke={color} strokeWidth="1.5" />
      <path d="M4 3v18M20 3v18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <rect x="7.5" y="6.5" width="2.5" height="2.5" stroke={color} strokeWidth="1.2" />
      <rect x="14" y="6.5" width="2.5" height="2.5" stroke={color} strokeWidth="1.2" />
      <rect x="7.5" y="11" width="2.5" height="2.5" stroke={color} strokeWidth="1.2" />
      <rect x="14" y="11" width="2.5" height="2.5" stroke={color} strokeWidth="1.2" />
      <path d="M10.5 21v-4h3v4" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function IconHouse({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 11.5L12 3l9 8.5V21H3v-9.5z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 21v-6h4v6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 13.5h2M15 13.5h2" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function IconVilla({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M2 21h20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 12l9-6 9 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 12v9M19 12v9M9 21v-4h6v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="14" r="1.5" stroke={color} strokeWidth="1.2" />
    </svg>
  )
}

export function IconTent({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3L3 20h18L12 3z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 3v17M9 20l3-6 3 6" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconBlueprint({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="4" width="18" height="16" rx="1.5" stroke={color} strokeWidth="1.5" />
      <path d="M3 9h18M8 4v16M14 9v11" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M17 13h2M17 16h2" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

/* ── Contact / Communication ── */

export function IconPhone({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconCalendar({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M3 10h18M8 2v4M16 2v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/* ── Results / Status ── */

export function IconTrendingUp({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M23 6l-9.5 9.5-5-5L1 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 6h6v6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconAlert({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 9v4M12 17h.01" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconTarget({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2" fill={color} />
    </svg>
  )
}

export function IconLock({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="11" width="18" height="11" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M7 11V7a5 5 0 0110 0v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconSparkles({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2l1.6 5L19 8.5 13.6 10 12 15l-1.6-5L5 8.5 10.4 7 12 2z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M19 15l.8 2.5L22 18l-2.2.5L19 21l-.8-2.5L16 18l2.2-.5L19 15z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M5 15l.6 1.8L7 17.3l-1.4.5L5 19.5l-.6-1.7L3 17.3l1.4-.5L5 15z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Brand-mark icons — designed to match visual weight of real brand
   logos (e.g. YouTube). Used in Ecosystem section pillars.
   Each is a self-contained 36×36 mark with its own color signature.
   ───────────────────────────────────────────────────────────────── */

// 広告事業部 — Performance media operations
// Deep navy gradient + ascending bars + accent dot (premium analytics feel)
export function IconAdBrand({ size = 36, className }: IconProps) {
  const id = 'ad-grad'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      className={className}
      aria-label="広告事業部"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1E3A8A" />
          <stop offset="1" stopColor="#0B1635" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="8" fill={`url(#${id})`} />
      {/* Ascending bars */}
      <rect x="9"  y="20" width="3" height="7"  rx="1" fill="#FFFFFF" opacity="0.55" />
      <rect x="14" y="16" width="3" height="11" rx="1" fill="#FFFFFF" opacity="0.75" />
      <rect x="19" y="12" width="3" height="15" rx="1" fill="#FFFFFF" opacity="0.92" />
      <rect x="24" y="8"  width="3" height="19" rx="1" fill="#FFFFFF" />
      {/* Accent dot */}
      <circle cx="25.5" cy="9" r="2.5" fill="#FB923C" />
      <circle cx="25.5" cy="9" r="2.5" stroke="#1E3A8A" strokeWidth="1" />
    </svg>
  )
}

// インフルエンサー事業部 — Creator network / social marketing
// Instagram-inspired warm gradient + sparkle/star composition
export function IconInfluencerBrand({ size = 36, className }: IconProps) {
  const id = 'inf-grad'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      className={className}
      aria-label="インフルエンサー事業部"
    >
      <defs>
        <linearGradient id={id} x1="4" y1="32" x2="32" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0"    stopColor="#FEDA77" />
          <stop offset="0.35" stopColor="#F58529" />
          <stop offset="0.7"  stopColor="#DD2A7B" />
          <stop offset="1"    stopColor="#8134AF" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="8" fill={`url(#${id})`} />
      {/* Camera body */}
      <rect x="9" y="11.5" width="18" height="14" rx="3.5" stroke="#FFFFFF" strokeWidth="1.6" />
      {/* Lens */}
      <circle cx="18" cy="18.5" r="3.6" stroke="#FFFFFF" strokeWidth="1.6" />
      {/* Top accent dot */}
      <circle cx="23" cy="14.5" r="0.9" fill="#FFFFFF" />
      {/* Sparkle (top-right corner) */}
      <path
        d="M28.5 7.5l.65 1.65L30.8 9.8l-1.65.65L28.5 12l-.65-1.55L26.2 9.8l1.65-.65L28.5 7.5z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

// ASHIMOTO制作 — Production house / creative partner
// Charcoal background + bold "A" monogram + production accent line
export function IconAshimotoBrand({ size = 36, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      className={className}
      aria-label="ASHIMOTO制作"
    >
      <rect width="36" height="36" rx="8" fill="#0F1115" />
      {/* Subtle inner gradient for depth */}
      <defs>
        <linearGradient id="ash-shine" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.06" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="8" fill="url(#ash-shine)" />
      {/* Bold geometric "A" monogram */}
      <path
        d="M11 26 L18 9 L25 26"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      <path
        d="M14 21 L22 21"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="square"
      />
      {/* Production accent — small bright corner mark */}
      <rect x="27" y="6" width="3" height="3" rx="0.5" fill="#54BEC3" />
    </svg>
  )
}
