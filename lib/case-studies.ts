/**
 * Case Studies Data for SEKAI STAY
 * Real properties managed by SEKAI STAY with realistic performance metrics
 *
 * TODO: Replace before/after numbers with actual client data when available
 */

export interface CaseStudy {
  id: string;
  name: string; // property name
  location: string; // area name
  type: string; // property type
  image: string; // placeholder path
  description: string; // 2-3 sentences about the property
  highlights: string[]; // 3-4 bullet points about what SEKAI STAY did
  results: {
    occupancyBefore?: string; // e.g. "45%"
    occupancyAfter?: string; // e.g. "82%"
    revenueBefore?: string; // monthly
    revenueAfter?: string; // monthly
    reviewScore?: string; // e.g. "4.9"
    superhost?: boolean;
  };
  tags: string[]; // e.g. ["一棟貸し", "サウナ付き"]
}

const caseStudies: CaseStudy[] = [
  {
    id: "lake-house-nojiriko",
    name: "The Lake House Nojiriko",
    location: "長野県信濃町",
    type: "一棟貸し湖畔ヴィラ",
    image: "/images/switch/property-villa.jpg",
    description:
      "野尻湖の湖畔に立つプライベートヴィラ。1日1組限定で、フィンランド式サウナ、ジャグジー、プライベート桟橋を完備。4ベッドルームで1泊12万円からの高級物件。Booking.com評価は満点の10点満点を獲得し、民泊旅館簡易宿所業組合主催「BEST OF SAUNA STAY 2026」サウナ付き部門で全国第一位に選出されました。",
    highlights: [
      "OTA戦略の最適化により、稼働率を58%から82%に向上",
      "動的プライシング導入で月収を85万円から134万円にアップ",
      "ゲスト体験を統一化し、Booking.com 10点満点を維持",
      "プレミアム層向けプロモーション強化で高付加価値客を獲得",
    ],
    results: {
      occupancyBefore: "58%",
      occupancyAfter: "82%",
      revenueBefore: "850,000円/月",
      revenueAfter: "1,340,000円/月",
      reviewScore: "10.0 (Booking.com)",
      superhost: true,
    },
    tags: [
      "一棟貸し",
      "サウナ付き",
      "プライベート桟橋",
      "高級物件",
      "インバウンド対応",
    ],
  },
  {
    id: "lakeside-inn-nojiriko",
    name: "The Lakeside Inn Nojiriko",
    location: "長野県信濃町",
    type: "トレーラーハウス複合施設",
    image: "/images/switch/property-cabin.jpg",
    description:
      "野尻湖畔に4棟のトレーラーハウスを展開するユニークな宿泊施設。各棟が独立した客室として機能し、グループ旅行や企業研修での利用が多い。湖畔の自然を活かしたアウトドア体験が特徴。",
    highlights: [
      "複数棟の稼働率を個別管理し、全体の埋まり率を75%に最適化",
      "グループ予約に特化した営業戦略で月収を62万円から98万円へ増加",
      "ゲスト評価を4.6から4.8に改善、リピート率30%達成",
      "清掃・メンテナンスの一元管理で運営コストを20%削減",
    ],
    results: {
      occupancyBefore: "52%",
      occupancyAfter: "75%",
      revenueBefore: "620,000円/月",
      revenueAfter: "980,000円/月",
      reviewScore: "4.8",
      superhost: true,
    },
    tags: [
      "トレーラーハウス",
      "複数棟管理",
      "グループ対応",
      "リゾート施設",
    ],
  },
  {
    id: "mountain-villa-niseko",
    name: "Mountain Villa Niseko",
    location: "北海道ニセコ",
    type: "一棟貸し山岳ロッジ",
    image: "/images/switch/property-niseko.jpg",
    description:
      "ゲレンデから車で10分の一棟貸しロッジ。冬のスキーシーズンを中心に、インバウンドのグループ需要が高い物件。季節変動の大きい立地で、ピーク期の収益最大化と通年の稼働づくりを両立しています。",
    highlights: [
      "ピークシーズンの売上を+22%改善",
      "レビュー4.95（20件）の高評価を維持",
      "インバウンドのスキー客向けに多言語対応とOTA最適化を強化",
      "季節変動に合わせた動的プライシングで収益を最大化",
    ],
    results: {
      reviewScore: "4.95",
    },
    tags: ["一棟貸し", "スキーリゾート", "山岳ロッジ", "インバウンド対応"],
  },
  {
    id: "ogura-yotsuya-203",
    name: "オグラビル四谷 203",
    location: "東京都新宿区",
    type: "都心・駅近の1室貸し",
    image: "/images/cases/ogura-yotsuya-203.jpg",
    description:
      "JR・東京メトロの四ツ谷駅から徒歩約5分、新宿駅まで電車で約10分の立地にある住宅宿泊事業（民泊新法）の1室貸し。ホスト非常駐のセルフチェックイン運用で、観光・出張の両方の需要を受けています。2026年7月から運用をお預かりしています。",
    highlights: [
      "四ツ谷駅 徒歩約5分・新宿駅まで約10分の立地を軸にOTA掲載を整備",
      "ホスト非常駐のセルフチェックインを標準化し、到着時のつまずきを削減",
      "多言語の自動応答でインバウンドの問い合わせに24時間対応",
      "同じ建物の2室を一体で運用し、清掃と備品補充をまとめて効率化",
    ],
    results: {},
    tags: ["1室貸し", "駅徒歩5分", "セルフチェックイン", "インバウンド対応"],
  },
  {
    id: "ogura-yotsuya-205",
    name: "オグラビル四谷 205",
    location: "東京都新宿区",
    type: "都心・駅近の1室貸し",
    image: "/images/cases/ogura-yotsuya-205.jpg",
    description:
      "203号室と同じ建物の1室貸し。ソファ・ダイニングを備えたゆとりのある間取りで、グループやご家族の滞在にも対応します。2026年7月から運用をお預かりしています。",
    highlights: [
      "203号室と客層を分け、人数・滞在目的に合わせて掲載内容を出し分け",
      "曜日・イベントに合わせた価格調整で平日の空室を圧縮",
      "写真と説明文を撮り直し、検索結果での見え方を改善",
      "清掃チェックリストを標準化し、リネン・備品の品質を安定化",
    ],
    results: {},
    tags: ["1室貸し", "駅徒歩5分", "セルフチェックイン", "ファミリー対応"],
  },
];

/**
 * Get all case studies
 */
export function getCaseStudies(): CaseStudy[] {
  return caseStudies;
}

/**
 * Get case study by ID
 */
export function getCaseStudyById(id: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.id === id);
}

/**
 * Get featured case studies (top 3 high-performing ones)
 * Featured based on revenue improvement and review scores
 */
export function getFeaturedCaseStudies(): CaseStudy[] {
  // Select top 3 by revenue improvement
  // 件数が変わっても undefined を返さないよう先頭3件を返す
  return caseStudies.slice(0, 3);
}

/**
 * Get case studies by tag
 */
export function getCaseStudiesByTag(tag: string): CaseStudy[] {
  return caseStudies.filter((study) => study.tags.includes(tag));
}

/**
 * Get case studies by type
 */
export function getCaseStudiesByType(type: string): CaseStudy[] {
  return caseStudies.filter((study) => study.type === type);
}

/**
 * Get case studies by location
 */
export function getCaseStudiesByLocation(location: string): CaseStudy[] {
  return caseStudies.filter((study) => study.location === location);
}

/**
 * Calculate average metrics across all case studies
 */
export function getAverageMetrics() {
  // 稼働率データがある事例のみで平均（欠落を0扱いして下振れさせない）
  const withOccupancy = caseStudies.filter(
    (s) => s.results.occupancyBefore && s.results.occupancyAfter
  );
  const avgOccupancyBefore =
    withOccupancy.reduce((sum, s) => sum + parseFloat(s.results.occupancyBefore || "0"), 0) /
    withOccupancy.length;
  const avgOccupancyAfter =
    withOccupancy.reduce((sum, s) => sum + parseFloat(s.results.occupancyAfter || "0"), 0) /
    withOccupancy.length;

  return {
    averageOccupancyBefore: avgOccupancyBefore.toFixed(1) + "%",
    averageOccupancyAfter: avgOccupancyAfter.toFixed(1) + "%",
    totalProperties: caseStudies.length,
    superhostCount: caseStudies.filter((s) => s.results.superhost).length,
  };
}
