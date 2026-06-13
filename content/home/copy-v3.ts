/**
 * SEKAI STAY — Homepage Copy v3「プロダクトレッド」構成
 * 設計: Guesty分析 + docs/superpowers/specs/2026-05-15-guesty-inspired-hp-redesign-design.md
 * 「10の質問」コンテンツは copy-questions.ts を再利用（アコーディオンに降格）
 */

export const HERO_V3 = {
  eyebrow: '民泊運用代行 SEKAI STAY',
  headline: {
    line1: '任せても、ぜんぶ見える。',
    line2: '数字で伸ばす｜民泊運用代行。',
  },
  body: '売上・予約・清掃・ゲスト対応まで丸ごと任せて、物件の「今」はスマホでリアルタイム確認。基本料金は売上の8%＋月1万円/物件（業界平均15〜25%）。かかりうる費用は、すべて事前に開示します。',
  primaryCta: { label: '無料物件診断を受ける', href: '/audit' },
  secondaryCta: { label: 'ダッシュボードのデモを触る', href: '/dashboard-demo' },
  microcopy: '診断は入力3分 · 無料 · 営業連絡なし／デモは登録不要',
  numbers: [
    { metric: '★4.8', label: '管理物件レビュー平均' },
    { metric: '+57%', label: '月商改善（平均）' },
    { metric: '1.4倍', label: '稼働率改善（平均）' },
    { metric: '97%', label: 'オーナー継続率' },
  ],
  productImage: {
    src: '/images/product/dashboard-main.png',
    alt: 'SEKAI STAY オーナーダッシュボード — 月間売上・稼働率・レビュー・予約カレンダーをリアルタイム表示',
  },
  award: 'BEST OF SAUNA STAY 2026 — 管理物件が全国1位',
  license: '住宅宿泊管理業 国土交通大臣(01)第F05780号',
} as const

export const PRODUCT_SHOWCASE = {
  eyebrow: 'Owner Dashboard — Live Product',
  headline: {
    line1: '「月末のレポート待ち」は、もう過去。',
    line2: '物件の今が、一画面でわかる。',
  },
  body: 'オーナー専用のリアルタイムダッシュボード。下の画面はデモの実画面です——あなたの物件なら、ここにあなたの数字が並びます。',
  bullets: [
    { title: '今日の売上・稼働率・予約ペース', body: '月次の集計を待たず、いつでもスマホで。' },
    { title: 'ゲストとのチャットも経費も一画面', body: '「いま何が起きているか」を聞かなくても見える。' },
    { title: 'データはいつでも出力', body: '売上・予約データはオーナーのもの。囲い込みません。' },
  ],
  cta: { label: 'デモを操作してみる', href: '/dashboard-demo' },
  ctaMicrocopy: '登録不要 · 実データを匿名化したサンプル3物件',
  image: {
    src: '/images/product/dashboard-ops.png',
    alt: 'オーナーダッシュボードのデモ画面 — 直近の予約一覧（海外ゲスト含む）と運用チームからの改善アクション提案',
  },
  miniFeatures: [
    {
      title: '価格は、毎日見直す',
      body: '数万件の宿泊データで毎日自動調整。週末・連休・近隣イベントを置きっぱなしにしない。',
      stat: '毎日',
      statLabel: '自動価格調整',
    },
    {
      title: '掲載は、毎月磨く',
      body: 'タイトル・説明文・写真の並び・色味まで毎月見直し。業界では「初回のみ」が少なくありません。',
      stat: '毎月',
      statLabel: 'OTA掲載改善',
    },
    {
      title: 'ゲスト対応は、私たちが',
      body: '24時間・日英中韓の4言語。深夜の「鍵が開かない」であなたのスマホは鳴らせません。',
      stat: '24h·4言語',
      statLabel: 'ゲスト対応',
    },
  ],
} as const

export const HOW_IT_WORKS = {
  eyebrow: 'How It Works',
  headline: '始め方は、3ステップ。',
  steps: [
    {
      num: '01',
      title: '無料診断',
      duration: '入力3分',
      body: '物件URL・運用状況から、改善余地と収益シミュレーションを個別レポートで。1営業日以内にお届け、営業連絡なし。',
    },
    {
      num: '02',
      title: '移行・立ち上げ',
      duration: '概ね2週間',
      body: '乗り換えは移行作業を当社が対応し、予約は並走で引き継ぎ——営業が止まる日はゼロ。新規は物件選定・許認可から伴走します。',
    },
    {
      num: '03',
      title: '運用開始',
      duration: 'ずっと見える',
      body: '価格調整・掲載改善・清掃・ゲスト対応はお任せ。あなたはダッシュボードで数字を確認し、3ヶ月毎のオンラインMTGで次の一手を一緒に決めるだけ。',
    },
  ],
} as const

export const SERVICE_BUCKETS = {
  eyebrow: 'Full-Stack Operation',
  headline: {
    line1: '運用の全工程を、3つの持ち場で。',
    line2: '',
  },
  body: '集客から現場、数字の開示まで。基本料金（売上の8%＋月1万円/物件）に含まれる標準業務です。',
  buckets: [
    {
      label: '集客・予約',
      title: '予約が入る状態を、作り続ける',
      items: ['OTA掲載の最適化（毎月見直し）', '数万件データの自動価格調整（毎日）', '主要OTA一元管理（Airbnb / Booking.com / 楽天 他）'],
    },
    {
      label: '運営・現場',
      title: '現場の品質で、レビューを守る',
      items: ['独自100項目チェックリストの清掃・点検', 'リネン・消耗品の手配', '24時間・4言語のゲスト対応とトラブル一次対応'],
    },
    {
      label: '数字・透明性',
      title: '数字はぜんぶ、オーナーのもの',
      items: ['リアルタイムダッシュボード', '3ヶ月毎のオンライン定例ミーティング', 'かかりうる費用の事前全開示'],
    },
  ],
  cta: { label: 'サービス内容をくわしく見る', href: '/services' },
} as const

export const PRICING_BAND = {
  eyebrow: 'Transparent Pricing',
  headline: {
    line1: '料金も、見えるように。',
    line2: '基本料金は売上の8%＋月1万円/物件。',
  },
  formula: {
    example: '月商100万円なら',
    ours: '100万円 × 8% ＋ 1万円 = 9万円/月',
    theirs: '手数料20%なら 20万円/月',
    delta: '差額は月11万円・年132万円',
  },
  rows: [
    { revenue: '月商50万円', delta3y: '3年で180万円' },
    { revenue: '月商100万円', delta3y: '3年で396万円' },
    { revenue: '月商150万円', delta3y: '3年で612万円' },
  ],
  rowsNote: '手数料20%との差額。月額固定費¥10,000/物件込み・1物件で試算。業界相場は15〜25%です。',
  disclosure: '初期費用（乗り換え¥100,000・新規¥200,000〜）、消耗品などの実費、希望制の有料オプションまで、かかりうる費用の全層は料金ページで開示しています。',
  primaryCta: { label: '30秒で年間損失額を試算する', href: '/services#pricing' },
  primaryMicrocopy: '月商を入れるだけ · その場で表示 · 登録不要',
  secondaryCta: { label: '料金の全層を見る', href: '/pricing' },
} as const

export type PersonaPath = {
  label: string
  desc: string
  points: readonly string[]
  cta: { label: string; href: string }
  primary?: boolean
}

export const PERSONA_PATHS: {
  eyebrow: string
  headline: string
  paths: readonly PersonaPath[]
} = {
  eyebrow: 'Your Path',
  headline: 'あなたの状況に、近い入口から。',
  paths: [
    {
      label: '1物件のオーナー',
      desc: '副業・相続物件など。まずは自分の物件の数字から。',
      points: ['いまの手数料との差額を30秒で', '登録不要・その場で表示'],
      cta: { label: '年間損失額を試算する', href: '/services#pricing' },
    },
    {
      label: '複数物件のオーナー',
      desc: '3物件以上・他社委託中の見直し。まとめて診断できます。',
      points: ['物件ごとの改善余地を個別レポートで', '移行は予約並走・営業停止ゼロ'],
      cta: { label: '無料物件診断を受ける', href: '/audit' },
      primary: true,
    },
    {
      label: 'これから始める方',
      desc: '物件選定・許認可・立ち上げの0→1から。',
      points: ['向いていない物件なら率直にそう言います', '費用は事前に全額提示——後出しなし'],
      cta: { label: '無料相談を予約する（30分）', href: '/contact' },
    },
  ],
} as const

export const TEN_QUESTIONS_COMPACT = {
  eyebrow: 'The 10 Questions',
  headline: {
    line1: '契約前に、どの会社にも聞いてほしい10の質問。',
    line2: '——私たちの答えつきで。',
  },
  body: 'いまの委託先の点検にも、これからの会社選びにも。SEKAI STAYとの面談でも、遠慮なく全部聞いてください。',
} as const
