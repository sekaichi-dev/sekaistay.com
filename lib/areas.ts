export interface Area {
  slug: string
  name: string       // e.g. "京都"
  prefecture: string // e.g. "京都府"
  description: string // 100-150 chars about minpaku in this area
  highlights: string[] // 3-4 area-specific selling points
  avgRevenue: number  // monthly average in yen
}

export const AREAS: Area[] = [
  // Major tourism destinations (highest priority)
  {
    slug: 'kyoto',
    name: '京都',
    prefecture: '京都府',
    description:
      '京都は年間5,000万人以上の観光客が訪れる日本有数の観光地。町家リノベーションや一棟貸しの民泊が人気で、インバウンド需要も非常に高いエリアです。',
    highlights: [
      '町家リノベーション物件に強い',
      'インバウンド観光客の高い宿泊需要',
      '祇園・東山エリアの高単価運営実績',
      '文化体験型民泊のプロデュース',
    ],
    avgRevenue: 450000,
  },
  {
    slug: 'osaka',
    name: '大阪',
    prefecture: '大阪府',
    description:
      '大阪はインバウンド旅行者に圧倒的な人気を誇るエリア。難波・心斎橋・新世界エリアでの民泊需要が高く、年間を通じて安定した稼働が見込めます。',
    highlights: [
      '難波・心斎橋の高稼働エリア',
      'インバウンド比率70%超の実績',
      '関西空港からのアクセス良好',
      'グループ旅行向け大型物件に対応',
    ],
    avgRevenue: 380000,
  },
  {
    slug: 'tokyo',
    name: '東京',
    prefecture: '東京都',
    description:
      '東京は日本最大の宿泊需要を持つマーケット。新宿・渋谷・浅草など観光エリアに加え、ビジネス需要も取り込める多様な運営戦略が可能です。',
    highlights: [
      '新宿・渋谷・浅草の高需要エリア',
      'ビジネス＋観光のダブル需要',
      '多言語対応で海外ゲスト獲得',
      'マンション一室から一棟まで対応',
    ],
    avgRevenue: 420000,
  },
  {
    slug: 'fukuoka',
    name: '福岡',
    prefecture: '福岡県',
    description:
      '福岡はアジアからの玄関口として民泊需要が急成長中。博多・天神エリアを中心に、韓国・台湾・中国からの旅行者に人気のエリアです。',
    highlights: [
      'アジア圏からのインバウンドに強い',
      '博多・天神エリアの高稼働実績',
      '福岡空港から市内15分のアクセス',
      'コンパクト物件の効率的運営',
    ],
    avgRevenue: 320000,
  },
  {
    slug: 'okinawa',
    name: '沖縄',
    prefecture: '沖縄県',
    description:
      'リゾート型民泊の需要が非常に高いエリア。ヴィラやコンドミニアムタイプの物件で高単価運営が可能です。',
    highlights: [
      'リゾートヴィラの高単価運営',
      '長期滞在ゲストの獲得に強い',
      '繁忙期の価格最適化で収益最大化',
      'ペット可・プール付き物件にも対応',
    ],
    avgRevenue: 500000,
  },
  {
    slug: 'hokkaido',
    name: '北海道',
    prefecture: '北海道',
    description:
      'ニセコ・富良野を中心にスキーリゾート需要が高く、冬季の高単価運営が特徴。夏季の自然体験需要も年々増加しています。',
    highlights: [
      'ニセコ・富良野のスキーリゾート需要',
      '冬季ハイシーズンの価格最適化',
      'オーストラリア・欧米ゲストに人気',
      '通年稼働の戦略的運営プラン',
    ],
    avgRevenue: 480000,
  },
  {
    slug: 'hakone',
    name: '箱根',
    prefecture: '神奈川県',
    description:
      '箱根は東京から90分の人気温泉リゾート。温泉付き物件や富士山ビューの一棟貸しで、高単価・高稼働の民泊運営が可能です。',
    highlights: [
      '温泉付き物件の運営実績多数',
      '富士山ビューで海外ゲストに人気',
      '東京から90分のアクセス良好',
      '週末＋平日の稼働率最適化',
    ],
    avgRevenue: 400000,
  },
  {
    slug: 'karuizawa',
    name: '軽井沢',
    prefecture: '長野県',
    description:
      '軽井沢は首都圏からのアクセスが良い高級リゾートエリア。別荘タイプの一棟貸しやペット可物件で高収益運営が実現できます。',
    highlights: [
      '高級別荘の民泊転用に実績',
      'ペット可物件の差別化運営',
      '夏季避暑＋冬季スキーの通年需要',
      'ファミリー・カップル層の獲得',
    ],
    avgRevenue: 430000,
  },
  {
    slug: 'kawaguchiko',
    name: '河口湖',
    prefecture: '山梨県',
    description:
      '河口湖エリアは富士山ビューの民泊が急成長中。インバウンド観光客に圧倒的な人気で、一棟貸しヴィラの高単価運営が可能です。',
    highlights: [
      '富士山ビュー物件の高単価運営',
      'インバウンド観光客の予約率90%超',
      '一棟貸しヴィラの運営に特化',
      'OTA多言語リスティング最適化',
    ],
    avgRevenue: 470000,
  },
  {
    slug: 'nara',
    name: '奈良',
    prefecture: '奈良県',
    description:
      '奈良は京都と合わせて訪れる観光客が多く、町家や古民家を活用した民泊が人気。京都より競合が少なく、参入しやすいエリアです。',
    highlights: [
      '古民家リノベーション物件に対応',
      '京都観光とのセット需要',
      '競合が少なく参入しやすいエリア',
      '文化財エリアの特別な宿泊体験',
    ],
    avgRevenue: 300000,
  },
  {
    slug: 'hiroshima',
    name: '広島',
    prefecture: '広島県',
    description:
      '広島は平和記念公園と宮島の2大観光地を持ち、インバウンド需要が非常に高いエリア。欧米からの旅行者が特に多いのが特徴です。',
    highlights: [
      '平和記念公園・宮島の観光需要',
      '欧米旅行者の長期滞在に強い',
      '広島駅周辺のアクセス良好エリア',
      '地方都市ならではの高利回り',
    ],
    avgRevenue: 280000,
  },
  {
    slug: 'nagoya',
    name: '名古屋',
    prefecture: '愛知県',
    description:
      'ビジネス需要と観光需要の両方を持つ中部エリアの拠点。名古屋城・熱田神宮周辺の民泊需要が安定しています。',
    highlights: [
      'ビジネス＋観光のダブル需要',
      '中部国際空港からのアクセス良好',
      '名古屋駅周辺の高稼働エリア',
      'コンパクト物件の効率運営',
    ],
    avgRevenue: 300000,
  },
  {
    slug: 'kobe',
    name: '神戸',
    prefecture: '兵庫県',
    description:
      '神戸は港町の異国情緒と有馬温泉を持つ魅力的なエリア。大阪・京都と合わせた関西周遊の拠点として民泊需要が増加中です。',
    highlights: [
      '有馬温泉エリアの高単価運営',
      '関西周遊の宿泊拠点として人気',
      '三宮・元町エリアのアクセス良好',
      'おしゃれな物件デザインで差別化',
    ],
    avgRevenue: 310000,
  },
  {
    slug: 'kanazawa',
    name: '金沢',
    prefecture: '石川県',
    description:
      '金沢は北陸新幹線開通以降、観光需要が急増。兼六園や東茶屋街周辺で町家民泊の需要が高く、上質な宿泊体験が求められるエリアです。',
    highlights: [
      '兼六園・東茶屋街エリアの高需要',
      '北陸新幹線で東京から2.5時間',
      '町家民泊の上質な宿泊体験',
      '冬季カニシーズンの高単価運営',
    ],
    avgRevenue: 340000,
  },
  {
    slug: 'sendai',
    name: '仙台',
    prefecture: '宮城県',
    description:
      '仙台は東北最大の都市で、ビジネス需要と松島・蔵王などの観光需要を併せ持つエリア。東北の民泊拠点として成長中です。',
    highlights: [
      '東北最大のビジネス・観光都市',
      '松島・蔵王への観光拠点',
      '仙台駅周辺の安定した稼働率',
      '杜の都ならではの宿泊体験',
    ],
    avgRevenue: 260000,
  },
  {
    slug: 'niseko',
    name: 'ニセコ',
    prefecture: '北海道',
    description:
      'ニセコは世界的に有名なスキーリゾートで、冬季は海外富裕層の宿泊需要が非常に高い。夏季のアウトドア需要も増加中です。',
    highlights: [
      '世界トップクラスのスキーリゾート',
      '海外富裕層の高単価宿泊需要',
      '冬季1泊10万円超の実績あり',
      'コンドミニアム運営に特化',
    ],
    avgRevenue: 600000,
  },
  {
    slug: 'atami',
    name: '熱海',
    prefecture: '静岡県',
    description:
      '熱海は東京から新幹線45分の温泉リゾート。リノベーション物件やオーシャンビュー物件で、週末中心の高稼働運営が可能です。',
    highlights: [
      '東京から新幹線45分のアクセス',
      '温泉＋オーシャンビューの高単価',
      'リノベーション物件の運営実績',
      '週末＋ワーケーション需要の獲得',
    ],
    avgRevenue: 350000,
  },
  {
    slug: 'yokohama',
    name: '横浜',
    prefecture: '神奈川県',
    description:
      'みなとみらい・中華街エリアの観光需要に加え、東京へのアクセスも良好。ビジネスと観光の両方のゲストを取り込めます。',
    highlights: [
      'みなとみらい・中華街の観光需要',
      '東京へのアクセス良好',
      'ビジネス＋観光のハイブリッド',
      'おしゃれな港町の宿泊体験',
    ],
    avgRevenue: 320000,
  },
  {
    slug: 'nagasaki',
    name: '長崎',
    prefecture: '長崎県',
    description:
      '長崎は異国情緒あふれる港町で、クルーズ船の寄港地としても注目。ハウステンボス周辺と市内中心部で民泊需要が高まっています。',
    highlights: [
      'クルーズ船寄港による宿泊需要',
      'ハウステンボス周辺エリア',
      '異国情緒ある物件デザイン',
      '九州周遊の宿泊拠点',
    ],
    avgRevenue: 250000,
  },
  {
    slug: 'kagoshima',
    name: '鹿児島',
    prefecture: '鹿児島県',
    description:
      '鹿児島は桜島や指宿温泉など自然資源が豊富。屋久島へのアクセス拠点としての需要もあり、南九州の民泊市場が拡大中です。',
    highlights: [
      '桜島ビューの特別な宿泊体験',
      '指宿温泉エリアの高単価運営',
      '屋久島観光の拠点需要',
      '南九州の成長マーケット',
    ],
    avgRevenue: 270000,
  },
]

export function getAreaBySlug(slug: string): Area | undefined {
  return AREAS.find(area => area.slug === slug)
}

export function getAllAreas(): Area[] {
  return AREAS
}
