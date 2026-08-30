/**
 * 松本さん — LP全体で一貫させる事例定数
 *
 * PainPoints（悩み提起）→ FinalCTA（次はあなたの番）
 * の2箇所で同一人物として登場し、数字とプロフィールをブレさせない。
 *
 * 数字の整合：
 *   年間売上 720万円（月60万円）
 *   旧代行手数料 20% → 720万 × 20% = 144万円/年
 *   SEKAI STAY 8% → 720万 × 8% = 57.6万円/年
 *   節約 ≒ 86万円/年（表記統一）
 */
export const TANAKA = {
  // プロフィール
  name: "松本さん",
  formalName: "松本様",
  ageNote: "56歳・仮名",
  city: "東京",
  propertyType: "戸建て1棟",
  propertyDetail: "相続した戸建て",

  // 数字
  monthlyRevenueMan: 60, // 万円
  annualRevenueMan: 720, // 万円
  oldFeeRatePct: 20, // %
  newFeeRatePct: 8, // %
  annualOldFeeMan: 144, // 万円（支払っていた手数料）
  annualSavingMan: 86, // 万円（取り戻した額）

  // 短いサマリ（各所で再利用）
  storyPain:
    "相続した戸建てを手数料20%で代行委託。年720万円の売上のうち144万円が手数料で消えていた。",
  storyAfter:
    "SEKAI STAYへの乗り換えで、年間86万円の手数料を取り戻した。",
} as const;
