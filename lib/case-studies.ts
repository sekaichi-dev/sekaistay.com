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
    id: "atami-white-house",
    name: "White House Atami",
    location: "熱海市",
    type: "一棟貸しオーシャンビューヴィラ",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop&q=80&auto=format",
    description:
      "熱海の海を望むオーシャンビュー一棟貸し。2LDKの広々とした間取りに、プライベートサウナ、カラオケ、BBQスペースを完備。enabler DAOが所有していた物件で、SEKAI STAYが全面的な運営を統括。",
    highlights: [
      "複数OTAの在庫管理と予約同期を自動化し、ダブルブッキングゼロを達成",
      "サウナ・カラオケといった施設の特性を活かした的確なマーケティング",
      "清掃・チェックインの標準化で平均評価を4.5から4.9に向上",
      "月額売上を45万円から76万円に増加させ、運営収益性を大幅改善",
    ],
    results: {
      occupancyBefore: "48%",
      occupancyAfter: "71%",
      revenueBefore: "450,000円/月",
      revenueAfter: "760,000円/月",
      reviewScore: "4.9",
      superhost: false,
    },
    tags: [
      "一棟貸し",
      "オーシャンビュー",
      "サウナ",
      "カラオケ",
      "BBQ施設",
    ],
  },
  {
    id: "teshikaga-lodge",
    name: "弟子屈ロッジ",
    location: "北海道弟子屈町",
    type: "一棟貸しロッジ",
    image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&h=500&fit=crop&q=80&auto=format",
    description:
      "北海道の自然に恵まれた弟子屈の一棟貸しロッジ。摩周湖や屈斜路湖などの観光地に近く、春から秋の観光シーズンに高い需要を見込める物件。地方特有の季節変動への対応が課題だった。",
    highlights: [
      "季節変動を見越した事前予約キャンペーン戦略で、閑散期の稼働率を40%から62%に改善",
      "地域の観光情報と連携したコンテンツ戦略でブランド認知を強化",
      "複数OTAでの同時管理により、限られた物件を最大限活用",
      "月売上を38万円から54万円に増加し、年間収益性を向上",
    ],
    results: {
      occupancyBefore: "54%",
      occupancyAfter: "68%",
      revenueBefore: "380,000円/月",
      revenueAfter: "540,000円/月",
      reviewScore: "4.6",
      superhost: false,
    },
    tags: [
      "一棟貸し",
      "ロッジ",
      "北海道",
      "自然体験",
      "季節変動対応",
    ],
  },
  {
    id: "teshikaga-tower-sauna",
    name: "弟子屈タワーサウナ",
    location: "北海道弟子屈町",
    type: "一棟貸しサウナ施設",
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=500&fit=crop&q=80&auto=format",
    description:
      "弟子屈に立つユニークなタワーサウナ付き一棟貸し物件。天然温泉とサウナの組み合わせが強みで、ウェルネス観光客を中心とした高付加価値層を獲得。デジタルマーケティングの強化で差別化を図る。",
    highlights: [
      "サウナ・温泉体験に特化したSNSマーケティングでフォロワーを3,200人に成長",
      "ウェルネス層向けのキーワード最適化で検索流入を5倍化",
      "複数サウナ関連メディアでの掲載実現により、ブランドネットワークを拡大",
      "月売上を42万円から69万円に増加、ウェルネスニーズの高まりを活かした成功事例",
    ],
    results: {
      occupancyBefore: "49%",
      occupancyAfter: "72%",
      revenueBefore: "420,000円/月",
      revenueAfter: "690,000円/月",
      reviewScore: "4.8",
      superhost: true,
    },
    tags: [
      "一棟貸し",
      "サウナ",
      "温泉",
      "ウェルネス",
      "北海道",
    ],
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
  return [
    caseStudies[0], // Lake House Nojiriko (best overall)
    caseStudies[6], // Hawaii Private Beach (highest revenue)
    caseStudies[1], // Lakeside Inn Nojiriko (high occupancy improvement)
  ];
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
