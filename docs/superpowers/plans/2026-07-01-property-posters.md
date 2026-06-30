# SEKAI STAY 物件ポスター生成ツール Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 物件別データ（住所・WiFi・チェックアウト・ハウスマニュアルURL）を流し込んで、SEKAI STAY の①外壁ステッカー（A5・全物件共通）と②室内ポスター（A4縦・物件別）を印刷用PDFとして一括生成するスタンドアロンCLIツールを作る。

**Architecture:** `tools/poster-generator/` 配下に独立したNode ESMツールを置く（マーケサイト本体のビルドからは分離）。データ読込→QR生成→HTMLテンプレ生成→Playwright（バンドルchromium）でPDF印刷、の4段パイプライン。各物件JSONをループして全PDFを出力する。

**Tech Stack:** Node.js 26 (ESM) / Playwright（PDF印刷・**バンドル chromium 利用。`channel:'chrome'` は dyld ハング歴があるため使わない**）/ qrcode（QRデータURL生成）/ node:test（テスト・追加依存なし）

## Global Constraints

`SEKAI_STAY_Creative_Guide.md` 準拠。以下は全タスク共通要件。

- 配色（HEX 正確に）: SEKAI White `#FFFFFF` / Cloud White `#F7F8FA` / SEKAI Black `#000000` / Charcoal `#2D2D2D` / Deep Teal `#167B81` / SEKAI Teal `#259DA3` / Bright Teal `#54BEC3` / Teal Tint `#E5F4F5`。使用比率の目安 White 60% / Gray 25% / Black 5% / Teal 10%。
- ロゴはデフォルト SEKAI BLACK（`#000000`）。1制作物内でロゴカラーを混在させない。
- フォント: 日本語 `Noto Sans JP` / 英語 `Helvetica Neue, Arial, sans-serif`。見出し 700、本文 400。
- ブランド名は常に半角英大文字 `SEKAI STAY`。表記揺れ（"セカイステイ"等）禁止。
- トーン: クリーン・信頼・安心。**禁止**: 和ステレオタイプ・過剰装飾・ポップすぎ・暗いトーン・テック感の押し出し。
- ロゴ素材: `public/images/switch/logo-symbol.svg`（シンボル）/ `public/images/switch/logo-full.png`（フル）を再利用。
- 緊急連絡先の実値（民泊民宿協会コールセンター電話番号 / 公式LINE対応時間）は**未確定**。`config/contacts.json` に集約し、未確定値は `"要確認"` プレースホルダで持つ（後から1ファイル差し替えで反映）。
- 出力PDFは `tools/poster-generator/out/` に書き出し、git追跡しない（gitignore）。

---

### Task 1: プロジェクト雛形 + データ読込/検証

**Files:**
- Create: `tools/poster-generator/package.json`
- Create: `tools/poster-generator/.gitignore`
- Create: `tools/poster-generator/config/contacts.json`
- Create: `tools/poster-generator/properties.sample.json`
- Create: `tools/poster-generator/src/data.js`
- Test: `tools/poster-generator/test/data.test.js`

**Interfaces:**
- Produces:
  - `loadContacts(path: string): Contacts` — `{ associationPhone: string, lineHours: string, lineUrl: string }`
  - `loadProperties(path: string): Property[]` — 各 `Property` = `{ id, addressJa, addressRomaji, wifiSsid, wifiPassword, checkoutTime, houseManualUrl }`。必須フィールド欠落時は `Error` を throw。

- [ ] **Step 1: package.json を作成**

```json
{
  "name": "sekai-stay-poster-generator",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "generate": "node src/generate.js",
    "test": "node --test"
  },
  "dependencies": {
    "playwright": "^1.49.0",
    "qrcode": "^1.5.4"
  }
}
```

- [ ] **Step 2: .gitignore を作成**

```
node_modules/
out/
properties.json
```

- [ ] **Step 3: 依存をインストール（chromium はキャッシュ済みなので高速）**

Run: `cd tools/poster-generator && npm install && npx playwright install chromium`
Expected: インストール成功（chromium は `~/Library/Caches/ms-playwright` の既存版を利用）。

- [ ] **Step 4: config/contacts.json を作成**

```json
{
  "associationPhone": "要確認",
  "lineHours": "要確認",
  "lineUrl": "https://line.me/R/ti/p/@sekaistay"
}
```

- [ ] **Step 5: properties.sample.json を作成**

```json
[
  {
    "id": "shinagawa-101",
    "addressJa": "東京都品川区戸越3-4-18 ゴールドステージビル 101",
    "addressRomaji": "101 Gold Stage Bldg, 3-4-18 Togoshi, Shinagawa-ku, Tokyo",
    "wifiSsid": "SEKAI-SHINAGAWA-101",
    "wifiPassword": "stay-welcome-101",
    "checkoutTime": "11:00",
    "houseManualUrl": "https://manual.sekaistay.com/shinagawa-101"
  }
]
```

- [ ] **Step 6: 失敗するテストを書く**

```js
// test/data.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadProperties, loadContacts } from '../src/data.js';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('loadProperties returns parsed properties', () => {
  const props = loadProperties(join(root, 'properties.sample.json'));
  assert.equal(props.length, 1);
  assert.equal(props[0].id, 'shinagawa-101');
  assert.equal(props[0].checkoutTime, '11:00');
});

test('loadProperties throws on missing required field', () => {
  assert.throws(
    () => loadProperties(join(root, 'test', 'fixtures', 'bad.json')),
    /missing required field: addressJa/
  );
});

test('loadContacts returns contacts object', () => {
  const c = loadContacts(join(root, 'config', 'contacts.json'));
  assert.ok('associationPhone' in c);
  assert.ok('lineUrl' in c);
});
```

- [ ] **Step 7: fixture を作成**

```bash
mkdir -p tools/poster-generator/test/fixtures
cat > tools/poster-generator/test/fixtures/bad.json <<'EOF'
[{ "id": "x", "wifiSsid": "s", "wifiPassword": "p", "checkoutTime": "11:00", "houseManualUrl": "u", "addressRomaji": "r" }]
EOF
```

- [ ] **Step 8: テスト失敗を確認**

Run: `cd tools/poster-generator && node --test test/data.test.js`
Expected: FAIL（`src/data.js` 未作成）

- [ ] **Step 9: src/data.js を実装**

```js
// src/data.js
import { readFileSync } from 'node:fs';

const REQUIRED = ['id', 'addressJa', 'addressRomaji', 'wifiSsid', 'wifiPassword', 'checkoutTime', 'houseManualUrl'];

export function loadProperties(path) {
  const props = JSON.parse(readFileSync(path, 'utf8'));
  if (!Array.isArray(props)) throw new Error('properties file must be a JSON array');
  for (const p of props) {
    for (const field of REQUIRED) {
      if (p[field] == null || p[field] === '') {
        throw new Error(`property ${p.id ?? '(no id)'}: missing required field: ${field}`);
      }
    }
  }
  return props;
}

export function loadContacts(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}
```

- [ ] **Step 10: テスト成功を確認**

Run: `cd tools/poster-generator && node --test test/data.test.js`
Expected: PASS（3件）

- [ ] **Step 11: コミット**

```bash
git add tools/poster-generator/package.json tools/poster-generator/.gitignore tools/poster-generator/config/contacts.json tools/poster-generator/properties.sample.json tools/poster-generator/src/data.js tools/poster-generator/test/data.test.js tools/poster-generator/test/fixtures/bad.json
git commit -m "ポスター生成: プロジェクト雛形とデータ読込/検証"
```

---

### Task 2: QRコード生成モジュール

**Files:**
- Create: `tools/poster-generator/src/qr.js`
- Test: `tools/poster-generator/test/qr.test.js`

**Interfaces:**
- Consumes: なし
- Produces:
  - `async qrDataUrl(text: string): Promise<string>` — `data:image/png;base64,...` を返す
  - `wifiPayload(ssid: string, password: string): string` — `WIFI:T:WPA;S:<ssid>;P:<password>;;` 形式

- [ ] **Step 1: 失敗するテストを書く**

```js
// test/qr.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { qrDataUrl, wifiPayload } from '../src/qr.js';

test('wifiPayload builds WIFI string', () => {
  assert.equal(wifiPayload('SEKAI-X', 'pw123'), 'WIFI:T:WPA;S:SEKAI-X;P:pw123;;');
});

test('qrDataUrl returns a png data url', async () => {
  const url = await qrDataUrl('https://example.com');
  assert.match(url, /^data:image\/png;base64,/);
});
```

- [ ] **Step 2: テスト失敗を確認**

Run: `cd tools/poster-generator && node --test test/qr.test.js`
Expected: FAIL（`src/qr.js` 未作成）

- [ ] **Step 3: src/qr.js を実装**

```js
// src/qr.js
import QRCode from 'qrcode';

export function wifiPayload(ssid, password) {
  return `WIFI:T:WPA;S:${ssid};P:${password};;`;
}

export async function qrDataUrl(text) {
  return QRCode.toDataURL(text, { margin: 0, width: 320, errorCorrectionLevel: 'M' });
}
```

- [ ] **Step 4: テスト成功を確認**

Run: `cd tools/poster-generator && node --test test/qr.test.js`
Expected: PASS（2件）

- [ ] **Step 5: コミット**

```bash
git add tools/poster-generator/src/qr.js tools/poster-generator/test/qr.test.js
git commit -m "ポスター生成: QRコード生成モジュール（URL/WiFi）"
```

---

### Task 3: 共通スタイル + ピクトグラム素材

**Files:**
- Create: `tools/poster-generator/src/styles.js`
- Create: `tools/poster-generator/src/pictograms.js`
- Test: `tools/poster-generator/test/pictograms.test.js`

**Interfaces:**
- Consumes: なし
- Produces:
  - `baseCss(): string` — ブランドトークン（CSS変数）とリセット、フォント指定を含むCSS文字列
  - `PICTOGRAMS: Record<string, string>` — キー → インラインSVG文字列。キー: `noise, trash, nosmoking, capacity, checkout, commonarea, equipment, phone, line, manual, wifi`

- [ ] **Step 1: 失敗するテストを書く**

```js
// test/pictograms.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PICTOGRAMS } from '../src/pictograms.js';
import { baseCss } from '../src/styles.js';

const RULE_KEYS = ['noise', 'trash', 'nosmoking', 'capacity', 'checkout', 'commonarea', 'equipment'];

test('all rule pictograms exist and are svg', () => {
  for (const k of RULE_KEYS) {
    assert.ok(PICTOGRAMS[k], `missing pictogram: ${k}`);
    assert.match(PICTOGRAMS[k], /<svg[\s\S]*<\/svg>/);
  }
});

test('baseCss exposes brand color tokens', () => {
  const css = baseCss();
  assert.match(css, /#167B81/i);
  assert.match(css, /Noto Sans JP/);
});
```

- [ ] **Step 2: テスト失敗を確認**

Run: `cd tools/poster-generator && node --test test/pictograms.test.js`
Expected: FAIL（モジュール未作成）

- [ ] **Step 3: src/styles.js を実装**

```js
// src/styles.js
export function baseCss() {
  return `
    :root{
      --white:#FFFFFF; --cloud:#F7F8FA; --black:#000000; --charcoal:#2D2D2D;
      --deep-teal:#167B81; --teal:#259DA3; --bright-teal:#54BEC3; --teal-tint:#E5F4F5;
      --mid-gray:#9AA0A6; --light-gray:#DADCE0;
    }
    *{ box-sizing:border-box; margin:0; padding:0; }
    html,body{
      font-family:"Noto Sans JP","Helvetica Neue",Arial,sans-serif;
      color:var(--charcoal); background:var(--white);
      -webkit-print-color-adjust:exact; print-color-adjust:exact;
    }
    .en{ font-family:"Helvetica Neue",Arial,sans-serif; color:var(--mid-gray); }
    h1,h2,h3{ font-weight:700; }
  `;
}
```

- [ ] **Step 4: src/pictograms.js を実装**

各SVGは `viewBox="0 0 48 48"`、線アイコン（stroke=currentColor）。色は利用側で `color` 指定。

```js
// src/pictograms.js
const w = (body) => `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="100%" height="100%">${body}</svg>`;

export const PICTOGRAMS = {
  noise: w('<path d="M6 19v10h7l9 7V12l-9 7H6z"/><path d="M30 17a10 10 0 0 1 0 14"/><path d="M36 12a17 17 0 0 1 0 24"/><line x1="40" y1="8" x2="8" y2="40"/>'),
  trash: w('<path d="M10 14h28"/><path d="M14 14l2 26h16l2-26"/><path d="M19 14V9h10v5"/><line x1="21" y1="20" x2="21" y2="34"/><line x1="27" y1="20" x2="27" y2="34"/>'),
  nosmoking: w('<circle cx="24" cy="24" r="18"/><line x1="11" y1="11" x2="37" y2="37"/><path d="M14 27h16v4H14z"/><path d="M33 23v-4a4 4 0 0 0-4-4"/>'),
  capacity: w('<circle cx="16" cy="16" r="6"/><path d="M6 38c0-6 4-10 10-10s10 4 10 10"/><circle cx="34" cy="18" r="5"/><path d="M30 38c0-5 2-8 7-8"/><line x1="40" y1="10" x2="46" y2="16"/><line x1="46" y1="10" x2="40" y2="16"/>'),
  checkout: w('<path d="M28 8h10a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H28"/><path d="M20 16l-8 8 8 8"/><line x1="12" y1="24" x2="32" y2="24"/>'),
  commonarea: w('<path d="M8 22L24 8l16 14"/><path d="M12 20v18h24V20"/><line x1="20" y1="38" x2="20" y2="28"/><line x1="28" y1="38" x2="28" y2="28"/>'),
  equipment: w('<circle cx="24" cy="24" r="6"/><path d="M24 6v6M24 36v6M6 24h6M36 24h6M12 12l4 4M32 32l4 4M36 12l-4 4M16 32l-4 4"/>'),
  phone: w('<path d="M14 8h8l3 9-5 3a18 18 0 0 0 8 8l3-5 9 3v8a3 3 0 0 1-3 3C24 45 5 26 5 11a3 3 0 0 1 3-3z"/>'),
  line: w('<rect x="6" y="9" width="36" height="26" rx="8"/><path d="M16 41l8-6"/><line x1="15" y1="20" x2="15" y2="26"/><path d="M22 26v-6l5 6v-6"/><line x1="32" y1="20" x2="32" y2="26"/>'),
  manual: w('<path d="M10 8h18a4 4 0 0 1 4 4v28H14a4 4 0 0 1-4-4z"/><path d="M32 12h6v28H14"/><line x1="16" y1="16" x2="26" y2="16"/><line x1="16" y1="22" x2="26" y2="22"/>'),
  wifi: w('<path d="M6 18a26 26 0 0 1 36 0"/><path d="M13 26a16 16 0 0 1 22 0"/><path d="M19 33a7 7 0 0 1 10 0"/><circle cx="24" cy="39" r="1.5" fill="currentColor"/>'),
};
```

- [ ] **Step 5: テスト成功を確認**

Run: `cd tools/poster-generator && node --test test/pictograms.test.js`
Expected: PASS（2件）

- [ ] **Step 6: コミット**

```bash
git add tools/poster-generator/src/styles.js tools/poster-generator/src/pictograms.js tools/poster-generator/test/pictograms.test.js
git commit -m "ポスター生成: 共通CSSトークンとピクトグラムSVG"
```

---

### Task 4: 外壁ステッカー テンプレート（A5）

**Files:**
- Create: `tools/poster-generator/src/templates/sticker.js`
- Test: `tools/poster-generator/test/sticker.test.js`

**Interfaces:**
- Consumes: `baseCss()` from `src/styles.js`、ロゴSVG文字列（呼び出し元が読み込んで渡す）
- Produces: `stickerHtml({ logoSvg: string }): string` — A5の完結HTMLドキュメント文字列

- [ ] **Step 1: 失敗するテストを書く**

```js
// test/sticker.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stickerHtml } from '../src/templates/sticker.js';

test('sticker html includes brand name and A5 page size', () => {
  const html = stickerHtml({ logoSvg: '<svg></svg>' });
  assert.match(html, /SEKAI STAY/);
  assert.match(html, /管理物件/);
  assert.match(html, /size:\s*A5/);
  assert.match(html, /<svg><\/svg>/);
});
```

- [ ] **Step 2: テスト失敗を確認**

Run: `cd tools/poster-generator && node --test test/sticker.test.js`
Expected: FAIL（テンプレ未作成）

- [ ] **Step 3: src/templates/sticker.js を実装**

```js
// src/templates/sticker.js
import { baseCss } from '../styles.js';

export function stickerHtml({ logoSvg }) {
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8">
<style>
${baseCss()}
@page{ size:A5; margin:0; }
.sheet{ width:148mm; height:210mm; display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:14mm; background:var(--white); }
.logo{ width:78mm; color:var(--black); }
.logo svg{ width:100%; height:auto; }
.tag{ font-size:15pt; letter-spacing:.18em; color:var(--charcoal); font-weight:700; }
.tag .en{ display:block; font-size:9pt; letter-spacing:.22em; margin-top:3mm; }
</style></head>
<body><div class="sheet">
  <div class="logo">${logoSvg}</div>
  <div class="tag">管理物件<span class="en">MANAGED BY SEKAI STAY</span></div>
</div></body></html>`;
}
```

- [ ] **Step 4: テスト成功を確認**

Run: `cd tools/poster-generator && node --test test/sticker.test.js`
Expected: PASS（1件）

- [ ] **Step 5: コミット**

```bash
git add tools/poster-generator/src/templates/sticker.js tools/poster-generator/test/sticker.test.js
git commit -m "ポスター生成: 外壁ステッカーA5テンプレート"
```

---

### Task 5: 室内ポスター テンプレート（A4縦）

**Files:**
- Create: `tools/poster-generator/src/templates/indoor.js`
- Test: `tools/poster-generator/test/indoor.test.js`

**Interfaces:**
- Consumes: `baseCss()`、`PICTOGRAMS`、`Property`、`Contacts`、事前生成したQRデータURL群
- Produces:
  - `indoorHtml({ property, contacts, logoSvg, qr }): string` — A4縦の完結HTML。
  - `qr` = `{ line: string, manual: string, wifi: string }`（いずれも data URL）

- [ ] **Step 1: 失敗するテストを書く**

```js
// test/indoor.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { indoorHtml } from '../src/templates/indoor.js';

const property = {
  id: 'x1', addressJa: '東京都品川区戸越3-4-18',
  addressRomaji: '3-4-18 Togoshi, Shinagawa-ku',
  wifiSsid: 'SEKAI-X1', wifiPassword: 'pw', checkoutTime: '11:00',
  houseManualUrl: 'https://m.example.com/x1',
};
const contacts = { associationPhone: '03-0000-0000', lineHours: '9:00-21:00', lineUrl: 'https://line.me/x' };
const qr = { line: 'data:image/png;base64,AAA', manual: 'data:image/png;base64,BBB', wifi: 'data:image/png;base64,CCC' };

test('indoor html contains emergency numbers and property data', () => {
  const html = indoorHtml({ property, contacts, logoSvg: '<svg></svg>', qr });
  assert.match(html, /110/);
  assert.match(html, /119/);
  assert.match(html, /03-0000-0000/);
  assert.match(html, /9:00-21:00/);
  assert.match(html, /東京都品川区戸越3-4-18/);
  assert.match(html, /SEKAI-X1/);
  assert.match(html, /11:00/);
  assert.match(html, /size:\s*A4/);
  assert.match(html, /data:image\/png;base64,CCC/);
});

test('indoor html does NOT mention kurasheed24 / seed24', () => {
  const html = indoorHtml({ property, contacts, logoSvg: '<svg></svg>', qr });
  assert.doesNotMatch(html, /seed24/i);
  assert.doesNotMatch(html, /くらし[ーし]ど/);
});
```

- [ ] **Step 2: テスト失敗を確認**

Run: `cd tools/poster-generator && node --test test/indoor.test.js`
Expected: FAIL（テンプレ未作成）

- [ ] **Step 3: src/templates/indoor.js を実装**

```js
// src/templates/indoor.js
import { baseCss } from '../styles.js';
import { PICTOGRAMS } from '../pictograms.js';

const RULES = [
  { key: 'noise', ja: '夜間は静かに', en: 'Keep quiet at night' },
  { key: 'trash', ja: 'ゴミは分別', en: 'Sort the trash' },
  { key: 'nosmoking', ja: '禁煙', en: 'No smoking' },
  { key: 'capacity', ja: '定員厳守・来訪者不可', en: 'No extra guests' },
  { key: 'checkout', ja: '時間内に退室', en: 'Check out on time' },
  { key: 'commonarea', ja: '共用部は静かに', en: 'Respect shared areas' },
  { key: 'equipment', ja: '設備は丁寧に', en: 'Use facilities with care' },
];

const ruleCard = (r) => `
  <div class="rule">
    <div class="rule-ico">${PICTOGRAMS[r.key]}</div>
    <div class="rule-ja">${r.ja}</div>
    <div class="rule-en en">${r.en}</div>
  </div>`;

export function indoorHtml({ property, contacts, logoSvg, qr }) {
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8">
<style>
${baseCss()}
@page{ size:A4; margin:0; }
.sheet{ width:210mm; height:297mm; padding:14mm 14mm 10mm; background:var(--white);
  display:flex; flex-direction:column; gap:6mm; }
.header{ display:flex; align-items:center; justify-content:space-between;
  border-bottom:2px solid var(--light-gray); padding-bottom:4mm; }
.header .logo{ width:46mm; color:var(--black); }
.header .logo svg{ width:100%; height:auto; }
.welcome{ text-align:right; }
.welcome b{ font-size:16pt; } .welcome .en{ font-size:10pt; }

.section-title{ font-size:12pt; font-weight:700; color:var(--deep-teal);
  display:flex; align-items:center; gap:2mm; margin-bottom:2mm; }
.section-title .en{ color:var(--mid-gray); font-size:9pt; font-weight:400; }

.emerg{ background:var(--teal-tint); border-radius:3mm; padding:5mm; }
.emerg-row{ display:flex; gap:4mm; }
.emerg-911{ flex:1; display:flex; gap:3mm; }
.num{ flex:1; background:var(--white); border:1.5px solid var(--bright-teal);
  border-radius:2mm; padding:3mm; text-align:center; }
.num .big{ font-size:22pt; font-weight:700; color:var(--charcoal); }
.num .lbl{ font-size:8.5pt; color:var(--dark-gray); }
.contact-row{ display:flex; gap:4mm; margin-top:4mm; }
.contact{ flex:1; display:flex; align-items:center; gap:3mm; background:var(--white);
  border-radius:2mm; padding:3mm 4mm; }
.contact .ico{ width:9mm; height:9mm; color:var(--deep-teal); flex:none; }
.contact .v{ font-size:13pt; font-weight:700; }
.contact .s{ font-size:8.5pt; color:var(--mid-gray); }
.contact .qr{ width:18mm; height:18mm; margin-left:auto; }
.contact .qr img{ width:100%; height:100%; }

.info{ display:flex; gap:4mm; }
.info-main{ flex:1; background:var(--cloud); border-radius:3mm; padding:5mm; }
.addr-ja{ font-size:15pt; font-weight:700; }
.addr-ro{ font-size:9.5pt; } 
.wifi-line{ margin-top:3mm; font-size:11pt; }
.wifi-line b{ color:var(--deep-teal); }
.checkout-line{ margin-top:2mm; font-size:11pt; }
.info-wifiqr{ width:30mm; text-align:center; align-self:center; }
.info-wifiqr img{ width:26mm; height:26mm; }
.info-wifiqr .c{ font-size:7.5pt; color:var(--mid-gray); }

.rules{ display:grid; grid-template-columns:repeat(7,1fr); gap:2mm; }
.rule{ text-align:center; }
.rule-ico{ width:13mm; height:13mm; margin:0 auto 1.5mm; color:var(--deep-teal); }
.rule-ja{ font-size:8.5pt; font-weight:700; line-height:1.3; }
.rule-en{ font-size:7pt; line-height:1.2; }

.footer{ margin-top:auto; display:flex; align-items:center; justify-content:space-between;
  border-top:1px solid var(--light-gray); padding-top:3mm; }
.footer .manual{ display:flex; align-items:center; gap:3mm; }
.footer .manual img{ width:18mm; height:18mm; }
.footer .manual .t b{ font-size:10pt; } .footer .manual .t .en{ font-size:8pt; }
.footer .brand{ font-size:9pt; color:var(--mid-gray); letter-spacing:.1em; }
</style></head>
<body><div class="sheet">

  <div class="header">
    <div class="logo">${logoSvg}</div>
    <div class="welcome"><b>ようこそ</b><div class="en">WELCOME</div></div>
  </div>

  <div>
    <div class="section-title">🆘 緊急連絡先 <span class="en">EMERGENCY</span></div>
    <div class="emerg">
      <div class="emerg-row">
        <div class="emerg-911">
          <div class="num"><div class="big">110</div><div class="lbl">警察 / Police</div></div>
          <div class="num"><div class="big">119</div><div class="lbl">消防・救急 / Fire & Ambulance</div></div>
        </div>
      </div>
      <div class="contact-row">
        <div class="contact">
          <div class="ico">${PICTOGRAMS.phone}</div>
          <div><div class="v">${contacts.associationPhone}</div>
            <div class="s">運営の困りごと（24h）/ Support 24h</div></div>
        </div>
        <div class="contact">
          <div class="ico">${PICTOGRAMS.line}</div>
          <div><div class="v">SEKAI STAY LINE</div>
            <div class="s">一次窓口 ${contacts.lineHours} / First contact</div></div>
          <div class="qr"><img src="${qr.line}" alt="LINE QR"></div>
        </div>
      </div>
    </div>
  </div>

  <div>
    <div class="section-title">📶 この物件 <span class="en">THIS PROPERTY</span></div>
    <div class="info">
      <div class="info-main">
        <div class="addr-ja">${property.addressJa}</div>
        <div class="addr-ro en">${property.addressRomaji}</div>
        <div class="wifi-line"><b>WiFi</b> ${property.wifiSsid} / <b>PW</b> ${property.wifiPassword}</div>
        <div class="checkout-line"><b style="color:var(--deep-teal)">Check-out</b> ${property.checkoutTime}</div>
      </div>
      <div class="info-wifiqr">
        <img src="${qr.wifi}" alt="WiFi QR">
        <div class="c">WiFi 自動接続<br>Scan to connect</div>
      </div>
    </div>
  </div>

  <div>
    <div class="section-title">⚠️ お願い <span class="en">HOUSE RULES</span></div>
    <div class="rules">${RULES.map(ruleCard).join('')}</div>
  </div>

  <div class="footer">
    <div class="manual">
      <img src="${qr.manual}" alt="House manual QR">
      <div class="t"><b>ハウスマニュアル</b><div class="en">Full house guide</div></div>
    </div>
    <div class="brand">SEKAI STAY</div>
  </div>

</div></body></html>`;
}
```

- [ ] **Step 4: テスト成功を確認**

Run: `cd tools/poster-generator && node --test test/indoor.test.js`
Expected: PASS（2件）

- [ ] **Step 5: コミット**

```bash
git add tools/poster-generator/src/templates/indoor.js tools/poster-generator/test/indoor.test.js
git commit -m "ポスター生成: 室内ポスターA4テンプレート"
```

---

### Task 6: PDFレンダリング（Playwright）

**Files:**
- Create: `tools/poster-generator/src/render.js`
- Test: `tools/poster-generator/test/render.test.js`

**Interfaces:**
- Consumes: HTML文字列
- Produces: `async htmlToPdf(html: string, outPath: string): Promise<void>` — `printBackground:true`・`preferCSSPageSize:true` でCSSの`@page`サイズを尊重してPDF出力

- [ ] **Step 1: 失敗するテストを書く**

```js
// test/render.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { htmlToPdf } from '../src/render.js';
import { readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

test('htmlToPdf writes a real pdf file', async () => {
  const out = join('out', 'test-render.pdf');
  await htmlToPdf('<!doctype html><html><body><h1>hi</h1></body></html>', out);
  const head = readFileSync(out).subarray(0, 5).toString('latin1');
  assert.equal(head, '%PDF-');
  rmSync(out, { force: true });
});
```

- [ ] **Step 2: テスト失敗を確認**

Run: `cd tools/poster-generator && node --test test/render.test.js`
Expected: FAIL（`src/render.js` 未作成）

- [ ] **Step 3: src/render.js を実装**

`channel` は指定しない（バンドルchromium。`channel:'chrome'` の dyld ハング回避）。

```js
// src/render.js
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export async function htmlToPdf(html, outPath) {
  mkdirSync(dirname(outPath), { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.pdf({ path: outPath, printBackground: true, preferCSSPageSize: true });
  } finally {
    await browser.close();
  }
}
```

- [ ] **Step 4: テスト成功を確認**

Run: `cd tools/poster-generator && node --test test/render.test.js`
Expected: PASS（1件・`out/test-render.pdf` を生成→削除）

- [ ] **Step 5: コミット**

```bash
git add tools/poster-generator/src/render.js tools/poster-generator/test/render.test.js
git commit -m "ポスター生成: Playwright PDF出力（バンドルchromium）"
```

---

### Task 7: CLIオーケストレータ + READMEとエンドツーエンド生成

**Files:**
- Create: `tools/poster-generator/src/generate.js`
- Create: `tools/poster-generator/README.md`
- Test: `tools/poster-generator/test/generate.test.js`

**Interfaces:**
- Consumes: `loadProperties`, `loadContacts`, `qrDataUrl`, `wifiPayload`, `stickerHtml`, `indoorHtml`, `htmlToPdf`、ロゴ読込
- Produces:
  - `async generateAll({ propertiesPath, contactsPath, logoPath, outDir }): Promise<string[]>` — 生成したPDFパス配列を返す。ステッカーは1回、室内ポスターは物件ごと。

- [ ] **Step 1: 失敗するテストを書く**

```js
// test/generate.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateAll } from '../src/generate.js';
import { existsSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const repo = join(root, '..', '..');

test('generateAll produces sticker + one indoor pdf', async () => {
  const outDir = join(root, 'out', 'e2e');
  rmSync(outDir, { recursive: true, force: true });
  const pdfs = await generateAll({
    propertiesPath: join(root, 'properties.sample.json'),
    contactsPath: join(root, 'config', 'contacts.json'),
    logoPath: join(repo, 'public', 'images', 'switch', 'logo-symbol.svg'),
    outDir,
  });
  assert.ok(pdfs.some((p) => p.includes('sticker')));
  assert.ok(pdfs.some((p) => p.includes('shinagawa-101')));
  for (const p of pdfs) assert.ok(existsSync(p), `missing ${p}`);
  rmSync(outDir, { recursive: true, force: true });
});
```

- [ ] **Step 2: テスト失敗を確認**

Run: `cd tools/poster-generator && node --test test/generate.test.js`
Expected: FAIL（`src/generate.js` 未作成）

- [ ] **Step 3: src/generate.js を実装**

```js
// src/generate.js
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { loadProperties, loadContacts } from './data.js';
import { qrDataUrl, wifiPayload } from './qr.js';
import { stickerHtml } from './templates/sticker.js';
import { indoorHtml } from './templates/indoor.js';
import { htmlToPdf } from './render.js';

export async function generateAll({ propertiesPath, contactsPath, logoPath, outDir }) {
  const properties = loadProperties(propertiesPath);
  const contacts = loadContacts(contactsPath);
  const logoSvg = readFileSync(logoPath, 'utf8');
  const written = [];

  const stickerPath = join(outDir, 'sticker-A5.pdf');
  await htmlToPdf(stickerHtml({ logoSvg }), stickerPath);
  written.push(stickerPath);

  for (const property of properties) {
    const qr = {
      line: await qrDataUrl(contacts.lineUrl),
      manual: await qrDataUrl(property.houseManualUrl),
      wifi: await qrDataUrl(wifiPayload(property.wifiSsid, property.wifiPassword)),
    };
    const html = indoorHtml({ property, contacts, logoSvg, qr });
    const outPath = join(outDir, `indoor-${property.id}.pdf`);
    await htmlToPdf(html, outPath);
    written.push(outPath);
  }
  return written;
}

// CLI: node src/generate.js [propertiesPath]
const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  const root = dirname(fileURLToPath(import.meta.url));
  const repo = join(root, '..', '..', '..');
  const propertiesPath = process.argv[2] || join(root, '..', 'properties.sample.json');
  generateAll({
    propertiesPath,
    contactsPath: join(root, '..', 'config', 'contacts.json'),
    logoPath: join(repo, 'public', 'images', 'switch', 'logo-symbol.svg'),
    outDir: join(root, '..', 'out'),
  }).then((p) => console.log(`生成完了 (${p.length}件):\n` + p.join('\n')));
}
```

- [ ] **Step 4: テスト成功を確認**

Run: `cd tools/poster-generator && node --test test/generate.test.js`
Expected: PASS（1件）

- [ ] **Step 5: 実データのサンプルで生成し、PDFを目視確認**

Run: `cd tools/poster-generator && npm run generate`
Expected: `out/sticker-A5.pdf` と `out/indoor-shinagawa-101.pdf` が生成される。
両PDFを開いて確認: A5/A4サイズ・ロゴ表示・110/119・連絡先・住所/WiFi/チェックアウト・ピクト7種・QR3種が崩れず配置されている（`open out/indoor-shinagawa-101.pdf`）。

- [ ] **Step 6: README.md を作成**

```markdown
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
```

- [ ] **Step 7: コミット**

```bash
git add tools/poster-generator/src/generate.js tools/poster-generator/README.md tools/poster-generator/test/generate.test.js
git commit -m "ポスター生成: CLIオーケストレータとREADME（全PDF一括生成）"
```

---

### Task 8: 全テスト通し + ブランド最終チェック

**Files:**
- Modify: なし（検証のみ）

- [ ] **Step 1: 全テストを実行**

Run: `cd tools/poster-generator && npm test`
Expected: 全テストファイル PASS（data / qr / pictograms / sticker / indoor / render / generate）

- [ ] **Step 2: Creative Guide 整合の目視チェックリスト**

生成PDFを開き、以下を確認:
- 配色がティール＋白基調（ガイド比率に近い）／和ステレオタイプ・過剰装飾なし
- ロゴが黒・単色（混色なし）
- ブランド名は半角大文字 `SEKAI STAY` のみ（表記揺れなし）
- 室内ポスターに seed24 / くらしーど24 の文字が出ていない
- 緊急ブロックが最上部・住所が読みやすい大きさ

- [ ] **Step 3: 確認事項を仕様書に残す（連絡先実値）**

`config/contacts.json` の `associationPhone` と `lineHours` が `"要確認"` のままなら、テンイチに実値を確認する旨を最終報告に明記。

---

## 自己レビュー結果

- **Spec coverage:** 仕様書§2(成果物)→Task4/5、§3(制作方式)→Task6、§4(ステッカー)→Task4、§5(室内構成)→Task5、§6(物件別フィールド)→Task1/5、§7(スコープ外)→各テンプレで遵守、§8(意思決定)→Global Constraints/テンプレに反映。くらしーど24非表示は indoor.test.js で機械的に検証。110/119・チェックアウトは Task5 で網羅。✓
- **Placeholder scan:** 連絡先実値のみ意図的に `"要確認"`（外部依存・未確定のため config 化）。それ以外にTBD/TODOなし。✓
- **Type consistency:** `qr={line,manual,wifi}`、`Property` の7フィールド、`loadProperties/loadContacts/qrDataUrl/wifiPayload/stickerHtml/indoorHtml/htmlToPdf/generateAll` の名称はタスク間で一致。✓
