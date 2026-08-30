// 設問データ — ここを編集することで設問の追加・変更が可能

export type Category = 'revenue' | 'marketing' | 'customer' | 'operations' | 'cost' | 'management'

export type Option = {
  label: string
  score: number // 0〜3
}

export type Question = {
  id: string
  step: number
  category: Category
  text: string
  subtext?: string
  type: 'single' | 'text' | 'email' | 'tel'
  options?: Option[]
  required?: boolean
  scored: boolean // false = 情報収集のみ、スコアに含めない
}

// カテゴリ日本語名
export const CATEGORY_LABELS: Record<Category, string> = {
  revenue: '売上',
  marketing: '集客・訴求力',
  customer: '顧客対応',
  operations: '運用効率',
  cost: 'コスト',
  management: '管理体制',
}

// ステップ情報
export const STEPS: { step: number; title: string }[] = [
  { step: 1, title: '基本情報' },
  { step: 2, title: '売上状況' },
  { step: 3, title: '集客・訴求' },
  { step: 4, title: 'ゲスト対応' },
  { step: 5, title: '運用負荷' },
  { step: 6, title: 'コスト・満足度' },
  { step: 7, title: 'ご連絡先' },
]

export const QUESTIONS: Question[] = [
  // ── STEP 1: 基本情報 ──────────────────────────────
  {
    id: 'management_style',
    step: 1,
    category: 'management',
    text: '現在の運用スタイルを教えてください',
    type: 'single',
    scored: false, // 情報収集のみ
    options: [
      { label: '自分でほぼすべて管理している', score: 0 },
      { label: '一部だけ代行に頼んでいる', score: 0 },
      { label: '代行会社にすべて任せている', score: 0 },
    ],
  },
  {
    id: 'satisfaction',
    step: 1,
    category: 'management',
    text: '今の運営に満足していますか？',
    type: 'single',
    scored: true,
    options: [
      { label: '満足している', score: 3 },
      { label: 'まあ満足している', score: 2 },
      { label: 'あまり満足していない', score: 1 },
      { label: '不満がある', score: 0 },
    ],
  },

  // ── STEP 2: 売上状況 ──────────────────────────────
  {
    id: 'occupancy',
    step: 2,
    category: 'revenue',
    text: '直近の稼働率はどのくらいですか？',
    subtext: '年間または直近3ヶ月の目安で構いません',
    type: 'single',
    scored: true,
    options: [
      { label: '80%以上', score: 3 },
      { label: '60〜80%', score: 2 },
      { label: '40〜60%', score: 1 },
      { label: '40%未満', score: 0 },
    ],
  },
  {
    id: 'adr',
    step: 2,
    category: 'revenue',
    text: '1泊あたりの平均単価はどのくらいですか？',
    type: 'single',
    scored: true,
    options: [
      { label: '2万円以上', score: 3 },
      { label: '1万〜2万円', score: 2 },
      { label: '5千〜1万円', score: 1 },
      { label: '5千円未満', score: 0 },
    ],
  },

  // ── STEP 3: 集客・訴求力 ──────────────────────────
  {
    id: 'ota_diversity',
    step: 3,
    category: 'marketing',
    text: '予約はどこから来ていますか？',
    subtext: 'メインの集客チャネルを選んでください',
    type: 'single',
    scored: true,
    options: [
      { label: 'Airbnbだけ', score: 0 },
      { label: '2〜3つのサイトを使っている', score: 1 },
      { label: '4つ以上のサイトを使っている', score: 2 },
      { label: '自社サイトや直接予約もある', score: 3 },
    ],
  },
  {
    id: 'listing_quality',
    step: 3,
    category: 'marketing',
    text: '物件ページの写真や説明文の作り込みは？',
    type: 'single',
    scored: true,
    options: [
      { label: 'プロの写真＋しっかり作り込んでいる', score: 3 },
      { label: 'ある程度整えている', score: 2 },
      { label: '少し手を入れている', score: 1 },
      { label: 'あまりできていない', score: 0 },
    ],
  },

  // ── STEP 4: ゲスト対応 ─────────────────────────────
  {
    id: 'review_rate',
    step: 4,
    category: 'marketing',
    text: 'ゲストからのレビューはどのくらいもらえていますか？',
    type: 'single',
    scored: true,
    options: [
      { label: 'ほぼ全員からもらえる', score: 3 },
      { label: '半分以上からもらえる', score: 2 },
      { label: 'たまにもらえる程度', score: 1 },
      { label: 'ほとんどもらえない', score: 0 },
    ],
  },
  {
    id: 'guest_communication',
    step: 4,
    category: 'customer',
    text: 'ゲスト対応（メッセージ・問い合わせ）の負担は？',
    type: 'single',
    scored: true,
    options: [
      { label: 'ほぼ自動化されており負担はない', score: 3 },
      { label: 'それほど負担ではない', score: 2 },
      { label: 'やや大変', score: 1 },
      { label: '毎日かなり大変', score: 0 },
    ],
  },

  // ── STEP 5: 運用負荷 ──────────────────────────────
  {
    id: 'cleaning_ops',
    step: 5,
    category: 'operations',
    text: '清掃や現地オペレーションの負担は？',
    type: 'single',
    scored: true,
    options: [
      { label: '仕組み化されており問題ない', score: 3 },
      { label: 'それなりに回っている', score: 2 },
      { label: 'やや大変', score: 1 },
      { label: '毎回かなり大変', score: 0 },
    ],
  },
  {
    id: 'pricing_optimization',
    step: 5,
    category: 'revenue',
    text: '宿泊料金の価格調整はどの程度していますか？',
    subtext: '季節・需要に応じた価格変更のことです',
    type: 'single',
    scored: true,
    options: [
      { label: 'ツールを使ってこまめに調整している', score: 3 },
      { label: '週に1回程度は調整している', score: 2 },
      { label: '月に1回程度調整している', score: 1 },
      { label: 'ほとんど調整していない', score: 0 },
    ],
  },

  // ── STEP 6: コスト・満足度 ────────────────────────
  {
    id: 'outsourcing_cost',
    step: 6,
    category: 'cost',
    text: '外注費・代行費の金額に納得感はありますか？',
    subtext: '自主管理の方は「自主管理のため該当なし」を選んでください',
    type: 'single',
    scored: true,
    options: [
      { label: '金額に見合っていると思う', score: 3 },
      { label: '概ね妥当だと思う', score: 2 },
      { label: 'やや割高かもしれない', score: 1 },
      { label: '高すぎると感じている', score: 0 },
      { label: '自主管理のため該当なし', score: 2 },
    ],
  },
  {
    id: 'owner_involvement',
    step: 6,
    category: 'management',
    text: 'オーナー自身の手間や時間の使い方に納得していますか？',
    type: 'single',
    scored: true,
    options: [
      { label: 'ほぼ手離れしており問題ない', score: 3 },
      { label: '概ね問題ない', score: 2 },
      { label: 'やや多いと感じる', score: 1 },
      { label: '手間がかかりすぎている', score: 0 },
    ],
  },

  // ── STEP 7: 連絡先 ───────────────────────────────
  {
    id: 'contact_name',
    step: 7,
    category: 'management',
    text: 'お名前',
    type: 'text',
    scored: false,
    required: true,
  },
  {
    id: 'contact_property',
    step: 7,
    category: 'management',
    text: '施設名・物件名',
    type: 'text',
    scored: false,
    required: true,
  },
  {
    id: 'contact_email',
    step: 7,
    category: 'management',
    text: 'メールアドレス',
    type: 'email',
    scored: false,
    required: true,
  },
  {
    id: 'contact_tel',
    step: 7,
    category: 'management',
    text: '電話番号（任意）',
    type: 'tel',
    scored: false,
    required: false,
  },
  {
    id: 'wants_consultation',
    step: 7,
    category: 'management',
    text: '無料相談を希望しますか？',
    subtext: '診断結果をもとに、改善策を一緒に考えます（完全無料）',
    type: 'single',
    scored: false,
    options: [
      { label: 'はい、希望します', score: 0 },
      { label: 'まだ決めていない', score: 0 },
      { label: '今は不要です', score: 0 },
    ],
  },
]
