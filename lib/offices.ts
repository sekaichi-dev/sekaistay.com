export interface Office {
  id: string
  name: string           // e.g. "中目黒支店"
  postalCode: string     // JSON-LD用（非表示）
  prefecture: string     // e.g. "東京都"
  addressShort: string   // 表示用（町名まで、番地なし）
  addressFull: string    // JSON-LD用（番地入り、サイト上には非表示）
  displayAddress: string // サイト上に見せる文字列
  phone: string          // 代表電話番号（JSON-LD用）
  isHQ: boolean
  areaSlugs: string[]
}

export const OFFICES: Office[] = [
  {
    // 2026-04-27: 本社を恵比寿西 → 中目黒（KM中目黒ビル1F）に移転（吉田指示）。
    // 旧 nakameguro 支店エントリは本社移転に伴い統合・削除。
    id: 'ebisu',
    name: '本社（中目黒）',
    postalCode: '153-0042',
    prefecture: '東京都',
    addressShort: '目黒区青葉台',
    addressFull: '目黒区青葉台2-20-7 KM中目黒ビル1F',
    displayAddress: '東京都目黒区青葉台',
    phone: '+81-3-6455-0842',
    isHQ: true,
    areaSlugs: ['tokyo', 'yokohama', 'hakone', 'atami', 'kawaguchiko'],
  },
  {
    id: 'okinawa',
    name: '沖縄オフィス',
    postalCode: '902-0065',
    prefecture: '沖縄県',
    addressShort: '那覇市壺屋',
    addressFull: '那覇市壺屋1丁目18-45',
    displayAddress: '沖縄県那覇市壺屋',
    phone: '+81-3-6455-0842',
    isHQ: false,
    areaSlugs: ['okinawa', 'kagoshima'],
  },
  {
    id: 'kyoto',
    name: '京都オフィス',
    postalCode: '600-8456',
    prefecture: '京都府',
    addressShort: '京都市下京区',
    addressFull: '京都市下京区東中筋通五条上る天使突抜二丁目402',
    displayAddress: '京都府京都市下京区',
    phone: '+81-3-6455-0842',
    isHQ: false,
    areaSlugs: ['kyoto', 'osaka', 'nara', 'kobe', 'hiroshima', 'nagoya', 'kanazawa'],
  },
  {
    id: 'machida',
    name: '町田オフィス',
    postalCode: '194-0003',
    prefecture: '東京都',
    addressShort: '町田市小川',
    addressFull: '町田市小川1-1-11',
    displayAddress: '東京都町田市小川',
    phone: '+81-3-6455-0842',
    isHQ: false,
    areaSlugs: ['tokyo', 'yokohama', 'hakone'],
  },
  {
    id: 'hokkaido',
    name: '北海道オフィス',
    postalCode: '044-0075',
    prefecture: '北海道',
    addressShort: '虻田郡倶知安町',
    addressFull: '虻田郡倶知安町富士見531',
    displayAddress: '北海道虻田郡倶知安町',
    phone: '+81-3-6455-0842',
    isHQ: false,
    areaSlugs: ['hokkaido', 'niseko'],
  },
  {
    id: 'nagano',
    name: '長野オフィス',
    postalCode: '389-1303',
    prefecture: '長野県',
    addressShort: '上水内郡信濃町',
    addressFull: '上水内郡信濃町野尻264',
    displayAddress: '長野県上水内郡信濃町',
    phone: '+81-3-6455-0842',
    isHQ: false,
    areaSlugs: ['karuizawa', 'sendai'],
  },
]

/** Get the primary office for a given area slug */
export function getOfficeForArea(areaSlug: string): Office | undefined {
  return OFFICES.find(office => office.areaSlugs.includes(areaSlug))
}

/** Get all offices */
export function getAllOffices(): Office[] {
  return OFFICES
}

/** Get HQ office */
export function getHQOffice(): Office {
  return OFFICES.find(office => office.isHQ)!
}
