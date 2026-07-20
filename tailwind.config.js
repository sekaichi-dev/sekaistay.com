/** @type {import('tailwindcss').Config} */
// SEKAI STAY — Editorial Luxury Design System (v4)
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './content/**/*.{mdx,md}',
    './data/**/*.{js,ts}',
    './lib/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary
        'sekai-black':  '#0B0B0B',
        'deep-teal':    '#0F5F65',
        'sekai-teal':   '#167B81',
        'bright-teal':  '#54BEC3',
        'teal-tint':    '#E8F2F3',
        'teal-ink':     '#073A3E',
        // Warm editorial neutrals — 旧ブランドの純白・純黒から脱し、上質な紙風ベージュを基調に
        'ivory':        '#FBF9F4',
        'bone':         '#F4EEE4',
        'paper':        '#FFFDF9',
        'mist':         '#F7F5F0',
        'rule':         '#E6E1D6',
        'ink':          '#1A1A1A',
        // Brass — DESIGN.md の“格”の差し色（要所のみ <5%）
        'brass':        '#C9A86A',
        'brass-bright': '#F0D8A4',
        // Navy — sense-trust 準拠（#003C87）。ティールは差し色に。
        'navy':         '#167B81',
        'navy-deep':    '#0E565A',
        'navy-hover':   '#13696D',
        // Legacy / semantic
        'danger':        '#B91C1C',
        'danger-bg':     '#FEF2F2',
        'danger-border': '#FECACA',
        'warning':       '#F59E0B',
        'success':       '#167B81',
        'success-bg':    '#E8F2F3',
        'success-border':'#C5E8E9',
        // Neutrals (preserved for back-compat)
        'charcoal':     '#1A1A1A',
        'dark-gray':    '#4F4F4F',
        'mid-gray':     '#8B8B8B',
        'light-gray':   '#E6E1D6',
        'pale-gray':    '#F4EEE4',
        'cloud-white':  '#FBF9F4',
        // ── /switch LP ポート用カラー（ブランド別プレフィックス）──
        'switch-teal':          '#259da3',
        'switch-teal-deep':     '#167b81',
        'switch-teal-bright':   '#54bec3',
        'switch-teal-tint':     '#e5f4f5',
        'switch-accent':        '#e8653a',
        'switch-accent-hover':  '#d4552d',
        'switch-charcoal':      '#2d2d2d',
        'switch-stone-text':           '#23221e',
        'switch-stone-text-grey':      '#706d65',
        'switch-stone-text-disabled':  '#c1bdb7',
        'switch-stone-01':      '#f8f7f6',
        'switch-stone-02':      '#edebe8',
        'switch-stone-03':      '#aaa69f',
        'switch-stone-04':      '#4e4c49',
        'switch-stone-border':  '#d6d3d0',
        'switch-stone-over':    '#f2f1f0',
        'switch-cloud':         '#f8f7f6',
        'switch-gray-dark':     '#4e4c49',
        'switch-gray-mid':      '#706d65',
        'switch-gray-light':    '#d6d3d0',
        'switch-gray-pale':     '#edebe8',
        'switch-gradient-hero-a': '#54bec3',
        'switch-gradient-hero-b': '#167b81',
      },
      fontFamily: {
        // ブランドガイド準拠: Noto Sans JP (JP) / Helvetica Neue (EN)
        sans: ['var(--font-noto-sans-jp)', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        // 後方互換のため serif/display/mincho も sans に統合
        serif: ['var(--font-noto-sans-jp)', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Helvetica Neue', 'var(--font-noto-sans-jp)', 'Arial', 'sans-serif'],
        mincho: ['var(--font-noto-sans-jp)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['SFMono-Regular', 'Consolas', 'Menlo', 'monospace'],
        // DESIGN.md: 英見出し・数字 / 英ラベル・番号
        grotesk: ['var(--font-grotesk)', 'var(--font-noto-sans-jp)', 'Helvetica Neue', 'sans-serif'],
        'mono-editorial': ['var(--font-space-mono)', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        // 大胆タイポ主導スケール（DESIGN.md §3.3）
        'display-hero': ['clamp(2.75rem, 7.6vw, 5.5rem)', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        'display-xl': ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'display-lg': ['clamp(2.25rem, 5.5vw, 4.25rem)', { lineHeight: '1.08', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(1.75rem, 3.6vw, 2.75rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['clamp(1.375rem, 2.4vw, 1.75rem)', { lineHeight: '1.3', letterSpacing: '0' }],
      },
      borderRadius: {
        'card': '2px',
        'btn':  '0px',
        'pill': '999px',
        'soft': '6px',
        'switch-sm': '4px',
        'switch-md': '6px',
        'switch-lg': '8px',
      },
      letterSpacing: {
        'editorial': '0.14em',
        'ticker': '0.22em',
      },
      maxWidth: {
        'container': '1180px',
        'prose-jp': '62ch',
      },
      boxShadow: {
        'lift-sm': '0 1px 2px rgba(26,26,26,0.04), 0 8px 24px rgba(26,26,26,0.04)',
        'lift':    '0 4px 16px rgba(26,26,26,0.06), 0 20px 40px rgba(26,26,26,0.05)',
        'lift-lg': '0 12px 32px rgba(26,26,26,0.08), 0 40px 80px rgba(26,26,26,0.06)',
        'switch-card':  '0 2px 4px rgba(0, 0, 0, 0.1)',
        'switch-modal': '0 4px 8px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}
