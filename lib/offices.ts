export interface Office {
  prefecture: string   // e.g. "東京都"
  addressShort: string // 町名まで、番地なし
  phone: string        // 代表電話番号（JSON-LD用）
}

// 2026-04-27: 本社を恵比寿西 → 中目黒（KM中目黒ビル1F）に移転（吉田指示）。
const HQ_OFFICE: Office = {
  prefecture: '東京都',
  addressShort: '目黒区青葉台',
  phone: '+81-3-6455-0842',
}

/** Get HQ office */
export function getHQOffice(): Office {
  return HQ_OFFICE
}
