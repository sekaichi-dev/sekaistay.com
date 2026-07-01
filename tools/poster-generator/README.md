# SEKAI STAY 物件ポスター生成ツール

物件別データから ①外壁ステッカー(A5) と ②室内ポスター(A4) の印刷用PDFを一括生成する。

## 使い方
1. `npm install && npx playwright install chromium`
2. `config/contacts.json` に連絡先（協会電話・LINE対応時間・LINE URL）を記入
3. `properties.json` を用意（形式は `properties.sample.json` 参照）
4. `npm run generate`（または `node src/generate.js path/to/properties.json`）
5. `out/` に PDF が出力される → 印刷・ラミネート

## 仕様
要件定義: `../../docs/superpowers/specs/2026-07-01-property-posters-design.md`

## 注意
- 連絡先の実値（協会電話番号・LINE対応時間）は `config/contacts.json` で要更新（初期値は "要確認"）。
- Playwright は **バンドル chromium** を使う（`channel:'chrome'` は dyld ハング歴があり使わない）。
