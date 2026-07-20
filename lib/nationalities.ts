// 国籍の選択肢（日英）。フォームの <select> と API の検証、名簿スプシのプルダウンの共通ソース。
// 国連加盟193カ国 + 台湾/香港/マカオ/パレスチナ/コソボ/バチカン + 無国籍/その他。
// 定期報告（住宅宿泊事業法）の国籍別内訳は FREQUENT の21カ国が公式バケットで、
// それ以外は定期報告タブ側で「その他」に自動合算される（式: 実人数 − 主要国の和）。

export type NationalityOption = readonly [ja: string, en: string];

// 公式定期報告のバケット順（従来の22択から「その他」を除いたもの）。フォームでは先頭グループに表示。
export const FREQUENT_NATIONALITIES: readonly NationalityOption[] = [
  ["日本", "Japan"], ["韓国", "South Korea"], ["台湾", "Taiwan"], ["香港", "Hong Kong"],
  ["中国", "China"], ["タイ", "Thailand"], ["シンガポール", "Singapore"], ["マレーシア", "Malaysia"],
  ["インドネシア", "Indonesia"], ["フィリピン", "Philippines"], ["ベトナム", "Vietnam"], ["インド", "India"],
  ["英国", "United Kingdom"], ["ドイツ", "Germany"], ["フランス", "France"], ["イタリア", "Italy"],
  ["スペイン", "Spain"], ["ロシア", "Russia"], ["米国", "United States"], ["カナダ", "Canada"],
  ["オーストラリア", "Australia"],
];

// その他すべての国・地域（作成時は英名アルファベット順・表示時に言語別で並べ替え）
export const OTHER_NATIONALITIES: readonly NationalityOption[] = [
  ["アフガニスタン", "Afghanistan"], ["アルバニア", "Albania"], ["アルジェリア", "Algeria"],
  ["アンドラ", "Andorra"], ["アンゴラ", "Angola"], ["アンティグア・バーブーダ", "Antigua and Barbuda"],
  ["アルゼンチン", "Argentina"], ["アルメニア", "Armenia"], ["オーストリア", "Austria"],
  ["アゼルバイジャン", "Azerbaijan"], ["バハマ", "Bahamas"], ["バーレーン", "Bahrain"],
  ["バングラデシュ", "Bangladesh"], ["バルバドス", "Barbados"], ["ベラルーシ", "Belarus"],
  ["ベルギー", "Belgium"], ["ベリーズ", "Belize"], ["ベナン", "Benin"], ["ブータン", "Bhutan"],
  ["ボリビア", "Bolivia"], ["ボスニア・ヘルツェゴビナ", "Bosnia and Herzegovina"], ["ボツワナ", "Botswana"],
  ["ブラジル", "Brazil"], ["ブルネイ", "Brunei"], ["ブルガリア", "Bulgaria"],
  ["ブルキナファソ", "Burkina Faso"], ["ブルンジ", "Burundi"], ["カーボベルデ", "Cabo Verde"],
  ["カンボジア", "Cambodia"], ["カメルーン", "Cameroon"], ["中央アフリカ", "Central African Republic"],
  ["チャド", "Chad"], ["チリ", "Chile"], ["コロンビア", "Colombia"], ["コモロ", "Comoros"],
  ["コンゴ民主共和国", "Congo (DRC)"], ["コンゴ共和国", "Congo (Republic)"], ["コスタリカ", "Costa Rica"],
  ["コートジボワール", "Côte d'Ivoire"], ["クロアチア", "Croatia"], ["キューバ", "Cuba"],
  ["キプロス", "Cyprus"], ["チェコ", "Czechia"], ["デンマーク", "Denmark"], ["ジブチ", "Djibouti"],
  ["ドミニカ国", "Dominica"], ["ドミニカ共和国", "Dominican Republic"], ["エクアドル", "Ecuador"],
  ["エジプト", "Egypt"], ["エルサルバドル", "El Salvador"], ["赤道ギニア", "Equatorial Guinea"],
  ["エリトリア", "Eritrea"], ["エストニア", "Estonia"], ["エスワティニ", "Eswatini"],
  ["エチオピア", "Ethiopia"], ["フィジー", "Fiji"], ["フィンランド", "Finland"], ["ガボン", "Gabon"],
  ["ガンビア", "Gambia"], ["ジョージア", "Georgia"], ["ガーナ", "Ghana"], ["ギリシャ", "Greece"],
  ["グレナダ", "Grenada"], ["グアテマラ", "Guatemala"], ["ギニア", "Guinea"],
  ["ギニアビサウ", "Guinea-Bissau"], ["ガイアナ", "Guyana"], ["ハイチ", "Haiti"],
  ["ホンジュラス", "Honduras"], ["ハンガリー", "Hungary"], ["アイスランド", "Iceland"],
  ["イラン", "Iran"], ["イラク", "Iraq"], ["アイルランド", "Ireland"], ["イスラエル", "Israel"],
  ["ジャマイカ", "Jamaica"], ["ヨルダン", "Jordan"], ["カザフスタン", "Kazakhstan"], ["ケニア", "Kenya"],
  ["キリバス", "Kiribati"], ["コソボ", "Kosovo"], ["クウェート", "Kuwait"], ["キルギス", "Kyrgyzstan"],
  ["ラオス", "Laos"], ["ラトビア", "Latvia"], ["レバノン", "Lebanon"], ["レソト", "Lesotho"],
  ["リベリア", "Liberia"], ["リビア", "Libya"], ["リヒテンシュタイン", "Liechtenstein"],
  ["リトアニア", "Lithuania"], ["ルクセンブルク", "Luxembourg"], ["マカオ", "Macau"],
  ["マダガスカル", "Madagascar"], ["マラウイ", "Malawi"], ["モルディブ", "Maldives"], ["マリ", "Mali"],
  ["マルタ", "Malta"], ["マーシャル諸島", "Marshall Islands"], ["モーリタニア", "Mauritania"],
  ["モーリシャス", "Mauritius"], ["メキシコ", "Mexico"], ["ミクロネシア", "Micronesia"],
  ["モルドバ", "Moldova"], ["モナコ", "Monaco"], ["モンゴル", "Mongolia"], ["モンテネグロ", "Montenegro"],
  ["モロッコ", "Morocco"], ["モザンビーク", "Mozambique"], ["ミャンマー", "Myanmar"],
  ["ナミビア", "Namibia"], ["ナウル", "Nauru"], ["ネパール", "Nepal"], ["オランダ", "Netherlands"],
  ["ニュージーランド", "New Zealand"], ["ニカラグア", "Nicaragua"], ["ニジェール", "Niger"],
  ["ナイジェリア", "Nigeria"], ["北朝鮮", "North Korea"], ["北マケドニア", "North Macedonia"],
  ["ノルウェー", "Norway"], ["オマーン", "Oman"], ["パキスタン", "Pakistan"], ["パラオ", "Palau"],
  ["パレスチナ", "Palestine"], ["パナマ", "Panama"], ["パプアニューギニア", "Papua New Guinea"],
  ["パラグアイ", "Paraguay"], ["ペルー", "Peru"], ["ポーランド", "Poland"], ["ポルトガル", "Portugal"],
  ["カタール", "Qatar"], ["ルーマニア", "Romania"], ["ルワンダ", "Rwanda"],
  ["セントクリストファー・ネービス", "Saint Kitts and Nevis"], ["セントルシア", "Saint Lucia"],
  ["セントビンセント・グレナディーン", "Saint Vincent and the Grenadines"], ["サモア", "Samoa"],
  ["サンマリノ", "San Marino"], ["サントメ・プリンシペ", "São Tomé and Príncipe"],
  ["サウジアラビア", "Saudi Arabia"], ["セネガル", "Senegal"], ["セルビア", "Serbia"],
  ["セーシェル", "Seychelles"], ["シエラレオネ", "Sierra Leone"], ["スロバキア", "Slovakia"],
  ["スロベニア", "Slovenia"], ["ソロモン諸島", "Solomon Islands"], ["ソマリア", "Somalia"],
  ["南アフリカ", "South Africa"], ["南スーダン", "South Sudan"], ["スリランカ", "Sri Lanka"],
  ["スーダン", "Sudan"], ["スリナム", "Suriname"], ["スウェーデン", "Sweden"], ["スイス", "Switzerland"],
  ["シリア", "Syria"], ["タジキスタン", "Tajikistan"], ["タンザニア", "Tanzania"],
  ["東ティモール", "Timor-Leste"], ["トーゴ", "Togo"], ["トンガ", "Tonga"],
  ["トリニダード・トバゴ", "Trinidad and Tobago"], ["チュニジア", "Tunisia"],
  ["トルコ", "Türkiye (Turkey)"], ["トルクメニスタン", "Turkmenistan"], ["ツバル", "Tuvalu"],
  ["ウガンダ", "Uganda"], ["ウクライナ", "Ukraine"], ["アラブ首長国連邦", "United Arab Emirates"],
  ["ウルグアイ", "Uruguay"], ["ウズベキスタン", "Uzbekistan"], ["バヌアツ", "Vanuatu"],
  ["バチカン", "Vatican City"], ["ベネズエラ", "Venezuela"], ["イエメン", "Yemen"],
  ["ザンビア", "Zambia"], ["ジンバブエ", "Zimbabwe"],
];

// 最後の受け皿（リストに該当が無い場合のみ）
export const FALLBACK_NATIONALITIES: readonly NationalityOption[] = [
  ["無国籍", "Stateless"], ["その他", "Other"],
];

export const ALL_NATIONALITY_JA: readonly string[] = [
  ...FREQUENT_NATIONALITIES, ...OTHER_NATIONALITIES, ...FALLBACK_NATIONALITIES,
].map(([ja]) => ja);
