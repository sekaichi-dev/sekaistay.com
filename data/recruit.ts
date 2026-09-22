// 採用ページ（/recruit）の掲載内容。
// 募集職種を増やす/やめるときはこの配列を編集する（ページ・フォームの選択肢が連動）。
// 応募は app/api/recruit/apply 経由でメール通知される（保存先DBは持たない）。

export type RecruitPosition = {
  id: string
  title: string
  en: string
  employment: string
  location: string
  summary: string
  duties: string[]
  wanted: string[]
}

export const RECRUIT_POSITIONS: RecruitPosition[] = [
  {
    id: 'operations',
    title: '運営オペレーション',
    en: 'Guest Operations',
    employment: '正社員 / 業務委託（応相談）',
    location: '東京（中目黒）・リモート可',
    summary:
      '予約管理からゲスト対応まで、宿の「稼働している状態」を支える中核ポジション。定型業務は社内ツールで自動化済みで、判断が必要な場面に集中できます。',
    duties: [
      '予約サイト（Airbnb / Booking.com 他）の予約・在庫管理',
      'ゲストからの問い合わせ対応（日本語・英語）と滞在中のトラブル一次対応',
      '清掃パートナー・現地スタッフとの連携、当日運営の調整',
      '運用で見つけた問題を仕組み・マニュアルに落とし込む改善提案',
    ],
    wanted: [
      '宿泊・旅行・接客・カスタマーサポートいずれかの実務経験',
      '手順が決まっていない状況でも、自分で優先順位を決めて動ける方',
      '英語でのテキストコミュニケーションに抵抗がない方（歓迎）',
    ],
  },
  {
    id: 'cleaning',
    title: '清掃ディレクター / 清掃パートナー',
    en: 'Housekeeping',
    employment: '業務委託 / パート・アルバイト（応相談）',
    location: '東京・大阪・京都・福岡・沖縄・北海道・長野',
    summary:
      '宿泊体験の評価を最も大きく左右するのが清掃品質です。担当エリアの清掃品質基準づくりと、現場チームの立ち上げ・運営をお任せします。',
    duties: [
      '担当物件の清掃・リネン交換・備品補充とその品質チェック',
      '清掃パートナーの採用・研修・スケジュール調整（ディレクター）',
      '設備不良・残置物などの現場報告と、運営チームへのエスカレーション',
    ],
    wanted: [
      'ホテル・旅館・民泊などでの清掃実務またはマネジメント経験',
      '決められた基準を守りつつ、現場の改善点を言語化できる方',
      '普通自動車免許（エリアにより歓迎）',
    ],
  },
  {
    id: 'engineer',
    title: 'ソフトウェアエンジニア',
    en: 'Software Engineer',
    employment: '正社員 / 業務委託（応相談）',
    location: 'フルリモート可',
    summary:
      '運用代行の業務そのものをプロダクトにしていくポジション。オーナーポータル、運営ダッシュボード、AIによる問い合わせ対応など、社内プロダクトの設計・開発を担います。',
    duties: [
      'オーナーポータル・社内運営ツールの開発（TypeScript / Next.js / Supabase）',
      '予約サイトや決済との連携、日次バッチ・自動化基盤の実装',
      'AI を使った問い合わせ自動対応・レポート生成の改善',
    ],
    wanted: [
      'Web アプリケーション開発の実務経験（フロント / バックエンド問わず）',
      '業務フローを理解したうえで、作るものを自分で決めていきたい方',
      'スタートアップ規模の環境で、設計から運用まで通して見られる方',
    ],
  },
  {
    id: 'business',
    title: '事業開発 / オーナーサクセス',
    en: 'Business Development',
    employment: '正社員 / 業務委託（応相談）',
    location: '東京（中目黒）・リモート可',
    summary:
      '物件オーナーとの最初の接点から、運用開始後の収益改善提案までを担当します。押し売りではなく、数字で納得いただく提案スタイルです。',
    duties: [
      '物件オーナーからのご相談対応、収益シミュレーションの作成と提案',
      '不動産会社・管理会社とのパートナーシップ開拓',
      '運用開始後の収益レビューと改善提案（オーナーサクセス）',
    ],
    wanted: [
      '法人・個人への提案営業またはカスタマーサクセスの経験',
      '数字（稼働率・単価・収支）をもとに会話できる方',
      '不動産・宿泊業界の知見（歓迎）',
    ],
  },
]

export const RECRUIT_OTHER_POSITION_ID = 'other'

export const RECRUIT_POSITION_IDS: string[] = [
  ...RECRUIT_POSITIONS.map((p) => p.id),
  RECRUIT_OTHER_POSITION_ID,
]

export function recruitPositionLabel(id: string): string {
  if (id === RECRUIT_OTHER_POSITION_ID) return 'その他 / まずは話を聞きたい'
  return RECRUIT_POSITIONS.find((p) => p.id === id)?.title ?? id
}

export const RECRUIT_STEPS = [
  { no: '01', title: '応募', body: 'このページのフォームからご応募ください。履歴書・職務経歴書のご用意は不要です。' },
  { no: '02', title: 'カジュアル面談', body: '担当者とオンラインで30〜45分。事業の現状と、任せたい役割を率直にお伝えします。' },
  { no: '03', title: '面接（1〜2回）', body: '実務の進め方をすり合わせます。職種によっては簡単な課題をお願いする場合があります。' },
  { no: '04', title: '条件提示・入社', body: '業務範囲と条件をご提示します。開始時期はご相談のうえ決定します。' },
]
