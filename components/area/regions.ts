import type { Area } from '@/lib/areas'

export type RegionId =
  | 'hokkaido'
  | 'tohoku'
  | 'kanto'
  | 'chubu'
  | 'kansai'
  | 'chugoku-shikoku'
  | 'kyushu-okinawa'

export interface Region {
  id: RegionId
  label: string
  labelEn: string
}

export const REGIONS: Region[] = [
  { id: 'hokkaido', label: '北海道', labelEn: 'Hokkaido' },
  { id: 'tohoku', label: '東北', labelEn: 'Tohoku' },
  { id: 'kanto', label: '関東', labelEn: 'Kanto' },
  { id: 'chubu', label: '中部・北陸', labelEn: 'Chubu / Hokuriku' },
  { id: 'kansai', label: '関西', labelEn: 'Kansai' },
  { id: 'chugoku-shikoku', label: '中国・四国', labelEn: 'Chugoku / Shikoku' },
  { id: 'kyushu-okinawa', label: '九州・沖縄', labelEn: 'Kyushu / Okinawa' },
]

/** 47都道府県 → 地方ブロック（lib/areas.ts の prefecture 表記に対応） */
const PREF_TO_REGION: Record<string, RegionId> = {
  北海道: 'hokkaido',
  青森県: 'tohoku',
  岩手県: 'tohoku',
  宮城県: 'tohoku',
  秋田県: 'tohoku',
  山形県: 'tohoku',
  福島県: 'tohoku',
  茨城県: 'kanto',
  栃木県: 'kanto',
  群馬県: 'kanto',
  埼玉県: 'kanto',
  千葉県: 'kanto',
  東京都: 'kanto',
  神奈川県: 'kanto',
  新潟県: 'chubu',
  富山県: 'chubu',
  石川県: 'chubu',
  福井県: 'chubu',
  山梨県: 'chubu',
  長野県: 'chubu',
  岐阜県: 'chubu',
  静岡県: 'chubu',
  愛知県: 'chubu',
  三重県: 'kansai',
  滋賀県: 'kansai',
  京都府: 'kansai',
  大阪府: 'kansai',
  兵庫県: 'kansai',
  奈良県: 'kansai',
  和歌山県: 'kansai',
  鳥取県: 'chugoku-shikoku',
  島根県: 'chugoku-shikoku',
  岡山県: 'chugoku-shikoku',
  広島県: 'chugoku-shikoku',
  山口県: 'chugoku-shikoku',
  徳島県: 'chugoku-shikoku',
  香川県: 'chugoku-shikoku',
  愛媛県: 'chugoku-shikoku',
  高知県: 'chugoku-shikoku',
  福岡県: 'kyushu-okinawa',
  佐賀県: 'kyushu-okinawa',
  長崎県: 'kyushu-okinawa',
  熊本県: 'kyushu-okinawa',
  大分県: 'kyushu-okinawa',
  宮崎県: 'kyushu-okinawa',
  鹿児島県: 'kyushu-okinawa',
  沖縄県: 'kyushu-okinawa',
}

export function regionIdOf(area: Area): RegionId {
  return PREF_TO_REGION[area.prefecture] ?? 'kanto'
}

export function groupAreasByRegion(areas: Area[]): Record<RegionId, Area[]> {
  const groups = {
    hokkaido: [],
    tohoku: [],
    kanto: [],
    chubu: [],
    kansai: [],
    'chugoku-shikoku': [],
    'kyushu-okinawa': [],
  } as Record<RegionId, Area[]>
  for (const area of areas) {
    groups[regionIdOf(area)].push(area)
  }
  return groups
}
