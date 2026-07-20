/**
 * Media Appearances and Trust Signals for SEKAI STAY
 * Includes media mentions, awards, authority badges, and team information
 */

export interface MediaAppearance {
  id: string;
  name: string; // media name
  type: "tv" | "award" | "platform" | "press";
  description: string; // short description
  logo?: string; // placeholder path for logo
  year?: string;
}

export interface TrustBadge {
  id: string;
  label: string;
  value: string;
  icon: string; // emoji or svg path
}

export interface TeamMember {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  bio: string;
  image: string; // placeholder path - TODO: replace with real photo
}

/**
 * Media appearances and press features
 */
const mediaAppearances: MediaAppearance[] = [
  {
    id: "fuji-tv-golf-meshi",
    name: "フジテレビ「ゴルフ飯チャンネル」",
    type: "tv",
    description:
      "人気テレビ番組でSEKAI STAYが運営するリゾート物件が紹介されました。ゴルフ体験と民泊の融合をテーマに放映。",
    logo: "/media-logos/fuji-tv.svg",
    year: "2025",
  },
  {
    id: "best-of-sauna-stay-1st",
    name: "Best of Sauna Stay 第一位",
    type: "award",
    description:
      "The Lake House Nojirokoが、サウナ施設の品質とおもてなしで第一位に選ばれました。サウナ愛好家から最高評価を獲得。",
    logo: "/media-logos/sauna-award.svg",
    year: "2025",
  },
  {
    id: "jal-tabi",
    name: "JAL旅",
    type: "platform",
    description:
      "JALが提供する旅行総合サイト『JAL旅』に、SEKAI STAYの運営物件が厳選物件として掲載されています。",
    logo: "/media-logos/jal-tabi.svg",
    year: "2025",
  },
  {
    id: "ikyu-com",
    name: "一休.com",
    type: "platform",
    description:
      "高級宿泊施設専門の予約サイト『一休.com』に複数物件を掲載。上質な旅行を求める利用者に認知されています。",
    logo: "/media-logos/ikyu.svg",
    year: "2024",
  },
  {
    id: "booking-10-star",
    name: "Booking.com 評価10点満点",
    type: "platform",
    description:
      "The Lake House Nojirokoはアジアの高級施設の中でも最高評価となる10点満点を達成。世界中のゲストから信頼を集めています。",
    logo: "/media-logos/booking.svg",
    year: "2025",
  },
];

/**
 * Trust badges / authority signals
 */
const trustBadges: TrustBadge[] = [
  {
    id: "avg-review-score",
    label: "管理物件レビュー平均",
    value: "4.8 / 5.0",
    icon: "⭐",
  },
  {
    id: "airbnb-superhost",
    label: "Airbnb スーパーホスト認定",
    value: "複数物件保有",
    icon: "✓",
  },
  {
    id: "national-locations",
    label: "全国管理拠点",
    value: "7拠点",
    icon: "📍",
  },
  {
    id: "ministry-registration",
    label: "国交大臣登録",
    value: "第F05780号",
    icon: "🏛️",
  },
];

/**
 * Team members
 */
const teamMembers: TeamMember[] = [
  {
    id: "ceo-liu-tian-yi",
    name: "劉 添毅",
    nameEn: "Liu Tian Yi",
    role: "代表取締役",
    bio: "株式会社セカイチの共同創業者。SEKAI STAYを立ち上げ、民泊運用代行サービスを革新。AI・自動化技術を駆使した運営システムの開発を主導。グローバルな不動産運営経験を持ち、日本国内外の物件運営に精通。",
    image: "/team/ceo.jpg",
  },
  {
    id: "coo-myojin-kojiro",
    name: "明神 洸次郎",
    nameEn: "Myojin Kojiro",
    role: "COO / 最高執行責任者",
    bio: "株式会社セカイチの共同創業者。SEKAI STAYの日本国内営業・運営を統括。LinkedInで確認済みの不動産・テクノロジー業界でのキャリアを持ち、オーナー様向けのサービス設計と営業体験の最適化を推進。",
    image: "/team/coo.jpg",
  },
];

/**
 * Get all media appearances
 */
export function getMediaAppearances(): MediaAppearance[] {
  return mediaAppearances;
}

/**
 * Get media appearances by type
 */
export function getMediaAppearancesByType(
  type: "tv" | "award" | "platform" | "press"
): MediaAppearance[] {
  return mediaAppearances.filter((appearance) => appearance.type === type);
}

/**
 * Get all trust badges
 */
export function getTrustBadges(): TrustBadge[] {
  return trustBadges;
}

/**
 * Get trust badge by ID
 */
export function getTrustBadgeById(id: string): TrustBadge | undefined {
  return trustBadges.find((badge) => badge.id === id);
}

/**
 * Get all team members
 */
export function getTeamMembers(): TeamMember[] {
  return teamMembers;
}

/**
 * Get team member by ID
 */
export function getTeamMemberById(id: string): TeamMember | undefined {
  return teamMembers.find((member) => member.id === id);
}

/**
 * Get team member by role
 */
export function getTeamMemberByRole(role: string): TeamMember | undefined {
  return teamMembers.find((member) => member.role === role);
}

/**
 * Get founder / leadership team
 */
export function getLeadershipTeam(): TeamMember[] {
  return teamMembers.filter((member) =>
    member.role.toLowerCase().includes("代表") ||
    member.role.toLowerCase().includes("coo")
  );
}
