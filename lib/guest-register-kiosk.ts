// 施設の玄関に置いた共有端末（iPad 等）で名簿を書いてもらう物件。
// この物件の名簿フォームは: 写真はその場のカメラでだけ撮る（アルバムから選べない）・入力の自動補完を切る・
// 送信したら画面を空に戻す・旅館業の任意項目（年齢・前泊地・行先地・到着/出発時刻）を必須にする
// （渋谷区旅館業法施行細則 第7条の記載事項）。T422 = 西新宿access渋谷stay（2026-11-10 保健所の再検査対応）。
export const KIOSK_PROPERTY_IDS: ReadonlySet<string> = new Set(["T422"]);

export function isKioskProperty(propertyId: string | null | undefined): boolean {
  return !!propertyId && KIOSK_PROPERTY_IDS.has(propertyId);
}

// URL の p= が施設一覧にある物件なら、その物件で固定する（ほかの物件名を見せない・選び間違えさせない）。
export function resolveLockedProperty<T extends { id: string }>(
  urlPropertyId: string | null | undefined,
  properties: readonly T[] | null | undefined,
): T | null {
  if (!urlPropertyId || !properties) return null;
  return properties.find((p) => p.id === urlPropertyId) || null;
}
