/**
 * SEKAI STAY — Homepage Copy
 * 全セクションの文言を一元管理。CTAリンク先はこのファイルで差し替え。
 */

// ═══ CTA リンク一元管理 ═══
// 3動線の整理:
//   audit     = 「うちの物件、ちゃんと稼げてる？」（無料物件診断レポート：現状採点＋収益試算を一通で届ける）
//   simulate  = 「ざっくり差額だけ知りたい」（収益シミュレーター：軽量な先行体感ツール）
//   contact   = 「人と話したい・任せたい」（無料相談）
// メイン導線は audit に集約。simulate は副次的な入口として留める。
export const CTA_LINKS = {
  contact: '/contact',
  audit: '/audit',
  simulate: '/services#pricing',
  caseStudies: '/case-studies',
  services: '/services',
  pricing: '/pricing',
  faq: '/faq',
} as const

// ═══ CTA ラベル統一（全ページで同じ言葉を使う） ═══
export const CTA_LABELS = {
  simulate: '収益シミュレーション',
  simulateAction: '収益をシミュレーションする',
  simulateLight: '30秒で年間損失額を試算',
  audit: '無料物件診断',
  auditAction: '無料で物件診断を受ける',
  contact: '無料相談',
  contactAction: '個別相談を予約する',
} as const

// ═══ 1. Hero ═══
export const HERO = {
  eyebrow: 'THE LEADING VACATION RENTAL MANAGEMENT IN JAPAN',
  headline: {
    line1: '民泊運営は、もう丸投げでいい。',
    line2: 'オーナーは、成果だけ見ればいい。',
  },
  body: '運用中の物件の改善から、これから始める民泊の立ち上げまで。SEKAI STAYは、価格設計・OTA最適化・多言語対応・清掃・ゲスト対応まで一気通貫で支援します。まずは無料で、あなたの物件の伸びしろを確認してください。',
  numbers: [
    { metric: '★4.8', label: 'レビュー平均（管理物件）' },
    { metric: '+30%', label: '平均稼働率の改善幅' },
    { metric: '国土交通大臣', label: '住宅宿泊管理業 (01)第F05780号' },
  ],
  stats: [
    { value: '4.8', label: 'レビュー平均' },
    { value: '全国', label: '対応エリア' },
    { value: '5年+', label: '運用知見' },
    { value: '8%', label: '業界平均の半分以下' },
  ],
  primaryCta: { label: '無料で物件診断を受ける', href: '/audit' },
  lightCta: { label: '30秒で年間損失額を試算', href: '/services#pricing' },
  secondaryCta: { label: '無料相談を予約する', href: '/contact' },
  textLink: { label: 'まずは収益シミュレーションから', href: '/services#pricing' },
  sideCard: {
    title: 'まずは3分で、物件の伸びしろを確認',
    body: '現在のリスティング・売上・手数料をもとに、稼働率と収益の改善余地を算出。担当アナリストが個別レポートでお届けします。',
    cta: { label: '物件診断を始める', href: '/audit' },
  },
} as const

// ═══ 1.5 Authority Bar — ヒーロー直下の信頼バッジ ═══
export const AUTHORITY = {
  label: 'Trusted Operation',
  items: [
    { metric: '5年+', label: '運用支援の実績' },
    { metric: '4.8', label: 'レビュー平均（管理物件）' },
    { metric: '国土交通大臣', label: '住宅宿泊管理業 (01)第F05780号' },
  ],
  note: '※ 数値は当社管理物件（Airbnb / Booking.com ほか主要OTA掲載）に基づく集計値／2024-2025。住宅宿泊事業法（民泊新法）・旅館業法いずれにも対応し、契約時に適用法令・許認可をご案内します。',
} as const

// ═══ Pain Points — 2ペルソナ並列 ═══
export const PAIN_POINTS = {
  eyebrow: 'Owner Concerns',
  headline: {
    line1: '今の悩み、整理してみませんか。',
    line2: 'どちらの状況でも、同じところから始められます。',
  },
  body: '運用中の方も、これから始める方も。多くのオーナー様が、最初は同じところで止まります。',
  personas: [
    {
      id: 'existing',
      label: 'FOR EXISTING OWNERS',
      title: 'すでに運用中で、伸び悩みを感じている方',
      points: [
        '手数料が高い（業界平均15〜25%）',
        '稼働率が思うように伸びない',
        'OTA設定・価格調整が複雑で手が回らない',
        '今の運営会社の動きが見えない',
      ],
    },
    {
      id: 'starting',
      label: 'FOR NEW OWNERS',
      title: 'これから民泊を始めたい方',
      points: [
        '運営会社の選び方が分からない',
        '初期費用・許認可・備品で何が必要か読めない',
        '本業と両立できるか不安',
        '物件選定の判断軸が分からない',
      ],
    },
  ],
  bridge: 'どちらにも、同じ答え。まず物件診断から。',
} as const

// ═══ Mid CTA — セクション間のCTAバンド ═══
export const MID_CTA = {
  headline: 'どちらの悩みも、まず物件診断から。',
  body: '現状採点と収益試算を、無料レポートでお返しします。営業連絡はありません。',
  cta: { label: '無料で物件診断を受ける', href: '/audit' },
  microcopy: '入力3分 · 無料 · 営業連絡なし',
} as const

// ═══ Nav Cards — 3段ファンネル誘導（軽/中/重） ═══
export const NAV_CARDS = {
  eyebrow: 'Choose Your Path',
  headline: '入口は、あなたのペースで。',
  body: '物件診断や個別相談まで、コミット度に合わせて段階的にご利用いただけます。',
  cards: [
    {
      step: '01',
      weight: '軽い入口',
      title: '30秒で年間損失額を試算',
      body: '現在の手数料・売上から、SEKAI STAY に切り替えると年間どれだけ手元に残るかを即時表示。営業連絡なし。',
      cta: { label: '計算機を使う', href: '/services#pricing' },
    },
    {
      step: '02',
      weight: '無料レポート',
      title: '無料で物件診断を受ける',
      body: '物件URL・運用状況をもとに、改善余地と収益シミュレーションを担当アナリストが個別レポートでお届け。',
      cta: { label: '診断を始める', href: '/audit' },
    },
    {
      step: '03',
      weight: '直接相談',
      title: '個別相談を予約する',
      body: '複数物件・新規開業・乗り換え検討中の方。担当者とオンラインで直接相談（30分）。',
      cta: { label: '相談枠を見る', href: '/contact' },
    },
  ],
} as const

// ═══ 2. Entry Points — 3つの入口導線 ═══
export const ENTRY = {
  headline: 'あなたに合った入口から、すぐに始められます。',
  body: '今の運用を見直したい方も、これから始めたい方も。SEKAI STAYは、状況に合わせて最適な形でご相談いただけます。',
  cards: [
    {
      id: 'existing',
      label: 'FOR EXISTING OWNERS',
      title: 'すでに民泊を運用している方へ',
      body: 'レビュー評価・差別化度・価格最適化・収益効率の4軸で、物件の現状をレポートで採点します。',
      cta: { label: '無料で物件診断を受ける', href: '/audit' },
    },
    {
      id: 'starting',
      label: 'FOR NEW OWNERS',
      title: 'これから民泊を始めたい方へ',
      body: '物件選定、許認可、立ち上げ準備、初回予約獲得まで。始め方から一緒に整理します。',
      cta: { label: '立ち上げ相談をする', href: '/contact' },
    },
    {
      id: 'exploring',
      label: 'FOR EXPLORERS',
      title: 'まずは収益感を知りたい方へ',
      body: 'エリア・物件タイプ・部屋数から、想定売上レンジと改善余地をその場で試算します。',
      cta: { label: '無料でシミュレーションする', href: '/services#pricing' },
    },
  ],
} as const

// ═══ 3. Simulation ═══
export const SIMULATION = {
  headline: {
    line1: 'あなたの物件、どれくらい伸びるか。',
    line2: '3分で試算できます。',
  },
  body: 'エリア・物件タイプ・運用状況などの情報をもとに、想定売上レンジと改善余地の目安を無料でご案内します。今の運用で十分か、もっと伸ばせるかを、まずは数字で確認してください。',
  formTitle: '入力はかんたんです',
  formFields: [
    'エリア',
    '物件タイプ',
    '部屋数',
    '現在運用中 / これから立ち上げ',
    '現在の月商（任意）',
    'メールアドレス',
  ],
  resultTitle: '診断後にわかること',
  resultItems: [
    '想定月商レンジ',
    '改善余地の大きさ',
    '優先して見直すべきポイント',
    '次に打つべき施策の方向性',
  ],
  cta: { label: '無料で試算結果を受け取る', href: '/services#pricing' },
} as const

// ═══ 4. Value Proposition ═══
export const VALUE = {
  headline: {
    line1: 'ただの運用代行で、',
    line2: '終わらない理由。',
  },
  body: '民泊は、ただ管理するだけでは伸びません。地域ごとの需要を読み、物件の魅力を正しく伝え、予約につながる形に整えることで成果が変わります。SEKAI STAYは、運営だけでなく“伸ばすための設計”まで支援します。',
  items: [
    {
      number: '01',
      title: '地域ごとの勝ち方を知っている',
      body: '過去5年間の運用知見をもとに、季節性、観光資源、ゲスト傾向、競合状況まで踏まえて運用設計します。',
    },
    {
      number: '02',
      title: '宿を“見つかる状態”まで作る',
      body: 'タイトル、写真、見せ方、価格調整、レビュー導線まで最適化し、上位表示と予約率改善を狙います。',
    },
    {
      number: '03',
      title: 'インバウンドに強い事業基盤がある',
      body: '海外向け事業、飲食事業、広告・SNS運用、クリエイティブ体制。単なる代行ではなく、海外需要を取りにいく視点で物件を伸ばします。',
    },
  ],
} as const

// ═══ 4.5 Ecosystem — 飲食事業 × メディア基盤 ═══
export const ECOSYSTEM = {
  eyebrow: 'Business Assets',
  headline: {
    line1: '運営知見の裏にある、',
    line2: '自社の事業基盤。',
  },
  body: '旅行者の動き、見せ方、予約につながる伝え方。SEKAI STAYはこれらを机上ではなく、自社の事業と現場で積み重ねてきました。',

  // ── Block 1: 飲食事業 ──
  hospitality: {
    label: 'Hospitality × Inbound',
    title: '旅行者の消費と反応を、現場で理解している。',
    body: '東京・中目黒、京都などで飲食事業を自社運営。インバウンド旅行者の動き、好み、価格感覚、滞在体験への反応を、日々の現場でつかんでいます。',
    supporting: '宿の運用設計を“机上の分析”ではなく、“現場の実感”に基づいて行える。それが、SEKAI STAYの運営の地力を支えています。',
    spots: [
      { name: 'The World Cafe', area: '東京・中目黒' },
      { name: 'Kyoto F&B', area: '京都' },
      { name: 'その他の拠点', area: '全国' },
    ],
  },

  // ── Block 2: メディア・クリエイティブ基盤 ──
  media: {
    label: 'Media & Creative',
    title: '宿は“管理業”ではなく、“集客業”でもある。',
    body: '見つけられ、選ばれ、来てもらう。SEKAI STAYは宿の運営だけでなく、宿が“行きたい理由のある場所”になるまでを設計できる体制を持っています。',
    pillars: [
      {
        title: '広告事業部',
        body: 'OTA内SEO、タイトル・写真・見せ方・価格・SNS二次活用までを、運用設計に直接つなぎます。宿が“見つけられる状態”まで作り込むのが役割です。',
      },
      {
        title: 'インフルエンサー事業部',
        body: '宿単体ではなく、地域全体で話題を作る発想。オープン時の認知形成、特定物件の世界観設計、タイアップ・撮影利用まで、企画からの仕掛けが可能です。',
      },
      {
        title: '自社YouTubeメディア',
        body: '旅行・ライフスタイル領域の自社発信基盤を運営（登録者20万人超）。宿泊・体験の魅力をどう伝えると人が動くかを、日々メディア運営で実践しています。',
      },
      {
        title: 'ASHIMOTO制作との連動',
        body: '企業YouTube運用、住宅・家具・不動産領域の大型メディア制作経験を持つクリエイティブ体制。映像・写真・世界観づくりの実装力で、宿の見せ方を支えます。',
      },
    ],
  },
} as const

// ═══ 5. Results ═══
export const RESULTS = {
  headline: '数字で見る、改善実績。',
  body: '全国でさまざまな物件の運用改善を支援してきました。高級物件から地域特化型の物件まで、それぞれの魅力を活かした改善を行っています。',

  // Aggregate summary — 支援実績のハイライト
  summary: [
    { value: '1.4', unit: '倍', label: '稼働率の改善倍率（平均）' },
    { value: '+57', unit: '%', label: '月間売上の改善幅（平均）' },
    { value: '4.8', unit: '/5', label: '管理物件のレビュー平均' },
    { value: '5年+', unit: '', label: '運用支援の継続期間' },
  ],

  cases: [
    {
      effectHeadline: '月商 +57% / 稼働率 1.4倍',
      title: '野尻湖エリアの貸別荘',
      tag: 'リゾート物件',
      metrics: [
        { label: '稼働率', from: '58%', to: '82%', delta: '約1.4倍', percent: 82 },
        { label: '月間売上', from: '85万円', to: '134万円', delta: '+57%', percent: 89 },
      ],
      body: '写真と訴求、価格設計、見せ方を再設計し、稼働率と売上の両方を改善しました。',
    },
    {
      effectHeadline: '平均単価 +30% / レビュー +0.5',
      title: '京都エリアの宿泊物件',
      tag: '都市型・インバウンド',
      metrics: [
        { label: 'レビュー平均', from: '4.3', to: '4.8', delta: '+0.5', percent: 96 },
        { label: '平均単価', from: '¥18,500', to: '¥24,200', delta: '+30%', percent: 75 },
      ],
      body: '多言語対応やゲスト導線、体験価値の伝え方を調整し、予約率と満足度の改善につなげました。',
    },
    {
      effectHeadline: '初月稼働 68% / 一気通貫設計',
      title: '立ち上げ初期の新規物件',
      tag: '新規オープン支援',
      metrics: [
        { label: '開業〜初月稼働', from: '', to: '68%', delta: '初月から好調', percent: 68 },
        { label: '初期設計', from: '', to: '一気通貫', delta: 'OTA〜運用まで', percent: 100 },
      ],
      body: '物件の見せ方、OTA初期設計、運用導線の整備まで。スタート時点から取りこぼしの少ない体制を整えます。',
    },
  ],
  cta: { label: '実績をもっと見る', href: '/case-studies' },
  summarySource:
    '出典: SEKAI STAY 管理物件実績／Airbnb・Booking.com 掲載データより集計／対象期間 2024-2025',
  ctaNote:
    '※ 上記サマリーは SEKAI STAY が運用改善を行った管理物件を対象に、改善前後を比較した平均値です（n=当社管理物件）。個別の事例は面談時に詳細データをご案内します。エリア・物件条件によって結果は異なります。',
} as const

// ═══ 6. Dashboard ═══
export const DASHBOARD = {
  headline: {
    line1: '任せるだけで終わらない。',
    line2: 'オーナーが毎日見たくなるダッシュボード。',
  },
  body: '売上、稼働率、予約状況、レビュー、改善ポイントまで。物件の状態を一画面でわかりやすく確認できます。ただの報告画面ではなく、物件が育っていく実感を持てる設計です。',
  items: [
    '今月の売上',
    '稼働率',
    '予約ペース',
    '前月比',
    'レビュー推移',
    '今後の改善アクション',
  ],
  cta: { label: 'ダッシュボードのデモを見る', href: '/dashboard-demo' },
} as const

// ═══ 7. Flow ═══
export const FLOW = {
  headline: 'ご相談から運用開始まで、スムーズに。',
  body: '運用中の物件の乗り換えも、これから始める立ち上げも。状況を整理しながら、最適な形でご提案します。',
  steps: [
    { num: '01', title: '無料相談・無料物件診断', body: 'まずは現状やご希望をお聞きします。' },
    { num: '02', title: '現状確認・物件ヒアリング', body: '現在の運用状況、または立ち上げ予定物件の条件を確認します。' },
    { num: '03', title: '収益シミュレーション・ご提案', body: '想定売上や改善余地、運用方針をご提案します。' },
    { num: '04', title: '契約・準備開始', body: '必要な設定や準備を進めます。' },
    { num: '05', title: '運用スタート', body: '掲載、運営、清掃、ゲスト対応まで一貫して支援します。' },
  ],
  cta: { label: '無料相談を予約する', href: '/contact' },
} as const

// ═══ 8. Pricing ═══
export const PRICING = {
  headline: 'わかりやすく、始めやすい料金設計。',
  body: '「どれくらいかかるのか分からない」で止まらないように、料金の考え方をはっきり出しています。詳細は物件とエリアによって調整しますが、基本の水準はこちらです。',

  // ── 中央のメインプラン ──
  plan: {
    badge: 'Standard Plan',
    title: '運営委託プラン',
    feeLabel: '運営委託費',
    feeValue: '8',
    feeUnit: '%',
    feeSub: '売上に対して',
    compare: '※ 業界平均は15〜20%前後',
    highlight: '成果が出たぶんだけ、のわかりやすい設計。',
  },

  // ── 主要項目の内訳 ──
  lines: [
    { label: '運営委託費', value: '売上の 8%', note: '成果連動' },
    { label: '固定管理費', value: '¥10,000 / 物件・月', note: '掲載・運営基盤の維持費' },
    { label: '初期費用（他社からの乗り換え）', value: '¥100,000 / 物件', note: '移行作業・AI画像加工・リスティング最適化込み' },
    { label: '初期費用（新規立ち上げ）', value: '¥200,000〜', note: '立ち上げ作業一式を含む' },
    { label: '解約金', value: '7ヶ月目以降 ¥0', note: '6ヶ月未満の途中解約は¥200,000・解約は3ヶ月前までにお申し出' },
    { label: '新規開業時の実費', value: '別途', note: '行政書士費用・許認可申請費用・備品・写真撮影等は実費' },
  ],

  // ── 含まれるサービス ──
  included: {
    title: '料金に含まれる主なサポート',
    items: [
      'OTA掲載・一元管理（Airbnb / Booking.com 等）',
      '需要連動の価格調整・レベニューマネジメント',
      '多言語ゲスト対応（チェックイン〜問い合わせ）',
      '清掃・リネン・消耗品の手配',
      'リアルタイムダッシュボード・3ヶ月毎のオンライン定例ミーティング',
      'オーナーダッシュボードの利用',
      '写真・掲載文・タイトル設計の最適化',
    ],
  },

  // ── 比較（SEKAI STAY vs 業界平均） ──
  comparison: {
    label: '手数料水準の目安',
    sekai: { label: 'SEKAI STAY', value: '8%' },
    industry: { label: '業界平均', value: '15〜20%' },
    note: '※ 各社公表情報・募集資料をもとにした一般的な水準。契約形態により異なります。',
  },

  note: 'エリア・物件タイプ・運用状況によって最適なプランは変わります。なお、新規開業（0→1）の場合は、行政書士費用・許認可申請費用・備品調達・初期撮影などの実費が別途発生します。運用中の物件の運用代行契約・他社からの乗り換えは、これらの実費は基本発生しません。',
  cta: { label: '料金について相談する', href: '/contact' },
  ctaSecondary: { label: 'まず収益シミュレーションを見る', href: '/services#pricing' },
} as const

// ═══ 9. FAQ ═══
export const FAQ = {
  headline: 'よくあるご質問。',
  body: '導入検討時にいただくご質問をカテゴリー別にまとめています。該当する項目がない場合は、無料相談で直接お聞きください。',
  categories: [
    { id: 'all', label: 'すべて' },
    { id: 'service', label: 'サービス内容' },
    { id: 'switch', label: '他社からの乗り換え' },
    { id: 'new', label: '立ち上げ・新規開業' },
    { id: 'fee', label: '料金・契約' },
    { id: 'consult', label: 'ご相談・診断' },
  ],
  items: [
    {
      category: 'service',
      q: '本当に丸投げできますか？',
      a: 'はい。掲載管理、価格調整、ゲスト対応、清掃連携など、運営に必要な業務を一貫して対応します。オーナー様は、必要な確認と意思決定に集中していただけます。',
    },
    {
      category: 'service',
      q: '多言語でのゲスト対応は可能ですか？',
      a: '可能です。英語・中国語・韓国語を中心に、インバウンドゲストとのチェックイン案内、問い合わせ対応、レビュー対応までサポートします。',
    },
    {
      category: 'service',
      q: '清掃やリネンの手配もお願いできますか？',
      a: 'はい。エリアごとの清掃パートナーと連携し、チェックアウト後の清掃・リネン交換・消耗品補充まで一貫して手配します。',
    },
    {
      category: 'switch',
      q: '今ほかの代行会社を使っていますが、相談できますか？',
      a: 'もちろん可能です。現在の運用状況を確認したうえで、改善余地や乗り換えメリットがあるかをご案内します。',
    },
    {
      category: 'switch',
      q: '他社からの乗り換え作業は誰がやりますか？',
      a: 'OTA上の管理権限移行、価格・写真の引き継ぎ、清掃体制の切り替えまで当社で対応します。オーナー様の作業は最小限に抑えます。',
    },
    {
      category: 'switch',
      q: '乗り換えに費用はかかりますか？',
      a: '初期費用として¥100,000/物件をいただいています（移行作業・AI画像加工・リスティング最適化込み）。OTA管理権限の移行、掲載情報・価格設計の引き継ぎ、清掃体制の切り替えまで当社で対応し、移行中に運営の空白期間が出ないよう調整します。',
    },
    {
      category: 'new',
      q: 'これから民泊を始める段階でも相談できますか？',
      a: 'はい。物件選定、許認可、立ち上げ準備、掲載設計まで、0→1の段階からご相談いただけます。',
    },
    {
      category: 'new',
      q: '許認可や届出の手続きも対応してくれますか？',
      a: '住宅宿泊事業法（民泊新法）・旅館業法いずれの手続きも、書類作成・申請手順・必要設備の整備までご案内します。実際の申請手続きは提携する行政書士が対応し、行政書士費用は実費としてご負担いただきます。',
    },
    {
      category: 'new',
      q: '立ち上げ（0→1）時の初期費用はどれくらいかかりますか？',
      a: '新規立ち上げの初期費用は¥200,000〜です（他社からの乗り換えは¥100,000/物件）。このほか新規開業時は別途、行政書士費用（許認可申請）、備品調達、初期清掃、写真撮影などの実費が発生します。物件条件・エリアに応じて事前に概算をお見積もりします。',
    },
    {
      category: 'new',
      q: '物件選びから相談できますか？',
      a: 'はい。エリア特性、想定収益、運用のしやすさの観点で物件選定をお手伝いします。既に候補がある場合は現地確認・収益試算からでも結構です。',
    },
    {
      category: 'fee',
      q: '料金体系を教えてください。',
      a: '基本料金は運営委託費が売上の8%、固定管理費が¥10,000/物件・月です。初期費用は他社からの乗り換えで¥100,000/物件、新規立ち上げで¥200,000〜。解約金は7ヶ月目以降¥0（6ヶ月未満の途中解約は¥200,000・解約は3ヶ月前までにお申し出）です。これ以外の費用は事前にお見積もりします。なお、新規開業（0→1）の場合は、許認可申請の行政書士費用や備品調達などの実費が別途発生します。',
    },
    {
      category: 'fee',
      q: '解約金はかかりますか？',
      a: '契約から7ヶ月目以降の解約金は¥0です。6ヶ月未満の途中解約は¥200,000をいただきます。解約は3ヶ月前までにお申し出ください。',
    },
    {
      category: 'fee',
      q: '対応エリアはどこですか？',
      a: '清掃パートナー確保済みエリアで全国対応しています（国内民泊の約85%をカバー）。エリア特性に応じて、対応可否も含めて個別にご案内します。',
    },
    {
      category: 'consult',
      q: '相談だけでも大丈夫ですか？',
      a: 'はい、大丈夫です。まずは現状確認や方向性整理のためのご相談としてご利用いただけます。',
    },
    {
      category: 'consult',
      q: '収益シミュレーションは無料ですか？',
      a: 'はい。簡易シミュレーションや初回相談は無料でご案内しています。',
    },
    {
      category: 'consult',
      q: '無料診断は何を見てくれるのですか？',
      a: '現在の掲載内容、価格設計、写真・タイトル、レビュー傾向、改善余地の大きさまでをまとめてお返しします。所要時間は3〜5分の入力のみです。',
    },
  ],
} as const

// ═══ 9.5 Credentials — E-E-A-T 証明ブロック ═══
export const CREDENTIALS = {
  eyebrow: 'Operational Trust',
  headline: {
    line1: '任せる前に、確認してほしい。',
    line2: '運営体制と、法令・資格の裏付け。',
  },
  body: '民泊運営は、お金と法令が同時に動く事業です。SEKAI STAYは、住宅宿泊管理業の登録を取得した正規の運営会社として、適用法令の確認から、OTA運用、多言語ゲスト対応、清掃・メンテナンスまで一気通貫で運営しています。契約前に運営体制・実績・対応範囲をすべてご確認いただけます。',
  blocks: [
    {
      label: '運営会社',
      primary: '株式会社セカイチ',
      secondary: 'SEKAICHI Inc.',
      href: 'https://sekaichi.org',
      external: true,
    },
    {
      label: '登録免許',
      primary: '住宅宿泊管理業',
      secondary: '国土交通大臣(01)第F05780号',
    },
    {
      label: '対応法令',
      primary: '住宅宿泊事業法',
      secondary: '旅館業法・特区民泊にも対応',
    },
    {
      label: '対応OTA',
      primary: '主要5サイト+',
      secondary: 'Airbnb / Booking.com / Vrbo / Expedia / 楽天トラベル',
    },
    {
      label: '対応言語',
      primary: '4言語・24時間',
      secondary: '日本語 / 英語 / 中国語 / 韓国語',
    },
    {
      label: '対応エリア',
      primary: '20エリア以上',
      secondary: '清掃パートナー確保済みエリアで全国対応',
    },
    {
      label: '運用知見',
      primary: '5年以上',
      secondary: '都市・リゾート・地方の全タイプで実績',
    },
    {
      label: '自社運営',
      primary: '飲食・宿泊',
      secondary: '現場運営の知見をオーナー物件に還元',
    },
  ],
  compareHeadline: '一般的な運用代行と何が違うのか。',
  compareOneLiner:
    '一般的な運用代行の手数料15〜25%に対して、SEKAI STAYは 8%＋月10,000円/物件。初期費用は乗り換え¥100,000/物件、解約金は7ヶ月目以降 ¥0（6ヶ月未満の途中解約は¥200,000）。',
  note: '※ 各契約は物件の適用法令（住宅宿泊事業法・旅館業法・特区民泊）を確認のうえ締結します。登録・許認可の取得状況は契約書面にてご案内します。',
} as const

// ═══ 10. Final CTA ═══
export const FINAL_CTA = {
  headline: 'まずは、あなたの物件の伸びしろを見てみませんか？',
  body: '今の運用を見直したい方も、これから民泊を始めたい方も。SEKAI STAYが、現状整理から収益化の方向性まで一緒に考えます。',
  primaryCta: { label: '無料で物件診断を受ける', href: '/audit' },
  secondaryCta: { label: '無料相談を予約する', href: '/contact' },
  textLink: { label: 'まずは収益シミュレーションから', href: '/services#pricing' },
} as const

// ═══ 11. Footer Catch ═══
export const FOOTER_CATCH = {
  body: '運用は、丸投げでいい。でも、物件が伸びていく実感は、オーナーにも届くように。SEKAI STAYは、管理だけで終わらない民泊運営を目指しています。',
} as const
