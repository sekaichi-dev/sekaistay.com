// 採用ページ（/recruit）の掲載内容。
// 募集職種を増やす/やめるときはこの配列を編集する（ページ・フォームの選択肢が連動）。
// 応募は app/api/recruit/apply 経由でメール通知される（保存先DBは持たない）。

export type RecruitPosition = {
  id: string
  title: string
  en: string
  image: string
  alt: string
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
    image: '/images/included/INCLUDED3.png',
    alt: 'ヘッドセットでゲストからの問い合わせに対応するスタッフ',
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
    id: 'business',
    title: '事業開発 / オーナーサクセス',
    en: 'Business Development',
    image: '/images/included/INCLUDED9.png',
    alt: 'オンラインでオーナーと打ち合わせをするスタッフ',
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
  { no: '01', title: '応募', body: 'このページのフォームからご応募ください。職務経歴書（PDF・画像・テキストのいずれか）を添付していただきます。' },
  { no: '02', title: '書類審査', body: 'いただいた内容を採用担当が確認します。ご面談をお願いする方にのみ、3営業日以内にご連絡いたします。' },
  { no: '03', title: '面談（1〜2回）', body: 'オンラインで30〜45分。事業の現状と任せたい役割をお伝えし、実務の進め方をすり合わせます。' },
  { no: '04', title: '条件提示・入社', body: '業務範囲と条件をご提示します。開始時期はご相談のうえ決定します。' },
]
