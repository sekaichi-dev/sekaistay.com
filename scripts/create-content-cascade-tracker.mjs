#!/usr/bin/env node
// SEKAI STAY コンテンツカスケード戦略 (X → note → HP) の人間レビュー用 Google Sheet を作成
//
// 使い方:
//   node scripts/create-content-cascade-tracker.mjs
//
// 出力: 新規 Google Sheet を作成し、Anyone-with-link viewer 権限を付与して URL を出力
// 認証: shared/google-auth (sekaichi アカウント・spreadsheets + drive scope 必須)

import { getSheets, getDrive } from "../../../shared/google-auth/index.js";

const SHEET_TITLE = "SEKAI STAY X Content Cascade Tracker";
const ACCOUNT = "sekaichi";

// ─────────────────────────────────────────────────────────────
// Strategy タブの内容（Cover 戦略）
// ─────────────────────────────────────────────────────────────
const STRATEGY_ROWS = [
  ["SEKAI STAY コンテンツカスケード戦略 (X → note → HP)"],
  ["最終更新", new Date().toISOString().slice(0, 10)],
  ["戦略レポート", "https://github.com/sekaichi-dev/sekaistay.com/blob/main/ad-ops/STRATEGY_REPORT_X_2026-05-17.md"],
  [],
  ["■ 進化フロー"],
  ["T+0 (即時)", "X 長文B 投稿 (1,500-2,500字)", "フック・拡散・反応測定"],
  ["T+3〜5d", "note に転載 (2,500-3,500字)", "見出し階層化 + 画像 + 補足戻し / noteフォロワー獲得"],
  ["T+7〜10d", "公式HP に正本掲載 (3,500-5,000字)", "SEO最適化 + CTA + 関連記事 / canonical=HP"],
  [],
  ["■ note→HP の進化フィルター"],
  ["", "X→note: 全本転載 (反応待たず・量を出す)"],
  ["", "note→HP: noteスキ ≥ 10 or PV ≥ 500 の上位50%のみ (質を保つ)"],
  ["", "→ 月20本のX長文 → note 20本 → HP 約10本"],
  [],
  ["■ KPI 目標 (3ヶ月)"],
  ["指標", "M1 (6月)", "M2 (7月)", "M3 (8月)"],
  ["Combined Followers (テン+ジロー)", 1500, 3000, 5000],
  ["架空社員 Followers", 300, 600, 1000],
  ["月間Impressions (3アカウント合算)", "100K", "300K", "600K"],
  ["LP 流入 (X → /switch*)", 80, 250, 500],
  ["X リード (org + paid)", "3-5", "8-12", "15-20"],
  ["Promoted CPL", "¥10K-15K", "¥7K-12K", "¥5K-10K"],
  ["HP 記事蓄積数", 10, 25, 50],
  ["note フォロワー (合算)", 200, 500, 1000],
  [],
  ["■ SEO 重複コンテンツ対策"],
  ["", "HP記事に canonical URL を設定 (HPが正本)"],
  ["", "X / note から「詳細版はHPで」リンク"],
  ["", "公開順序: X → note → HP (HPが後だが canonical で正本扱い)"],
  [],
  ["■ レビューチェックポイント"],
  ["X 投稿前", "テンイチ・ジロー本人が文言確認 → Status=Reviewed → Posted"],
  ["X 投稿後 24-48h", "Impressions / Engagement を Pipeline タブに記入"],
  ["note 投稿前", "Status=Reviewed (X版から拡張済み確認) → Published"],
  ["HP 投稿前", "SEO Keywords 確定 + canonical URL 設定 → Reviewed → Published"],
  [],
  ["■ 凡例 (Status)"],
  ["Draft", "Claude が下書き生成済み・人間レビュー前"],
  ["Reviewed", "人間が文言確認済み・公開待ち"],
  ["Posted/Published", "公開済み・URL 入力済み"],
  ["Boosted", "X のみ・Promoted Post として広告化済み"],
  ["Skipped", "note/HP のみ・フィルター不通過で転載しない判断"],
];

// ─────────────────────────────────────────────────────────────
// Pipeline タブの内容（Detail 戦術）
// ─────────────────────────────────────────────────────────────
const PIPELINE_HEADER = [
  "ID",
  "Account",
  "Pillar",
  "Topic/Hook",
  "LP送客先",
  "X Post Date",
  "X Status",
  "X URL",
  "X Impressions",
  "X Engagement",
  "note Status",
  "note Publish Date",
  "note URL",
  "note Likes/PV",
  "HP Status",
  "HP Publish Date",
  "HP URL",
  "HP SEO Keywords",
  "Review Comments",
];

const PIPELINE_ROWS = [
  [
    "T-1", "@tenichiliu", "業界トレンド", "なぜ8%で回せるか（業界半額の構造解説）",
    "/switch",
    "2026-05-18 08:00", "Draft", "", "", "",
    "Pending", "", "", "",
    "Pending", "", "", "", "",
  ],
  [
    "T-2", "@tenichiliu", "オーナー成功事例", "BEST OF SAUNA STAY 2026 受賞振り返り",
    "/switch/founder",
    "2026-05-21 08:00", "Draft", "", "", "",
    "Pending", "", "", "",
    "Pending", "", "", "", "",
  ],
  [
    "J-3", "@jirosan", "OTA運用テクニック", "Airbnb価格を毎日触ってわかったこと（DP実例）",
    "/switch/portal",
    "2026-05-19 12:00", "Draft", "", "", "",
    "Pending", "", "", "",
    "Pending", "", "", "", "",
  ],
  [
    "J-4", "@jirosan", "法務制度", "2026年 民泊新法 周辺で何が変わるか",
    "/switch",
    "2026-05-23 12:00", "Draft", "", "", "",
    "Pending", "", "", "",
    "Pending", "", "", "", "",
  ],
  [
    "U-5", "@ss_unei_chan", "民泊家具・アメニティ", "家具選定で失敗した話",
    "/switch/portal",
    "2026-05-20 19:00", "Draft", "", "", "",
    "Pending", "", "", "",
    "Pending", "", "", "", "",
  ],
  [
    "U-6", "@ss_unei_chan", "オーナー成功事例", "オーナーポータルが救った深夜の融資資料",
    "/switch/portal",
    "2026-05-24 19:00", "Draft", "", "", "",
    "Pending", "", "", "",
    "Pending", "", "", "", "",
  ],
  [
    "T-LAUNCH", "@tenichiliu", "業界トレンド + オーナー成功事例", "🚀 SEKAI STAY 本格発表 (経営者ビジョン軸)",
    "/switch/founder",
    "2026-05-22 10:00", "Draft", "", "", "",
    "Pending (同日)", "2026-05-22", "", "",
    "Pending", "2026-05-24", "", "民泊運用代行 8% / スーパーホスト多数認定 / 業界半額", "PR TIMES URL を [PR TIMES Link] に挿入要",
  ],
  [
    "J-LAUNCH", "@jirosan", "OTA運用 + オーナー成功事例", "🚀 SEKAI STAY 本格発表 (現場実証3ポイント)",
    "/switch",
    "2026-05-22 10:00", "Draft", "", "", "",
    "Pending (同日)", "2026-05-22", "", "",
    "Pending", "2026-05-24", "", "民泊代行 現場 / DP 毎日 / オーナーポータル", "PR TIMES URL を [PR TIMES Link] に挿入要",
  ],
];

// ─────────────────────────────────────────────────────────────
// メイン処理
// ─────────────────────────────────────────────────────────────
async function main() {
  const sheets = getSheets(ACCOUNT);
  const drive = getDrive(ACCOUNT);

  console.log(`📝 Creating Google Sheet: ${SHEET_TITLE}`);

  // 1. Sheet 作成（2タブ）
  const createRes = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title: SHEET_TITLE, locale: "ja_JP", timeZone: "Asia/Tokyo" },
      sheets: [
        { properties: { title: "Strategy", index: 0, gridProperties: { rowCount: 60, columnCount: 6 } } },
        { properties: { title: "Pipeline", index: 1, gridProperties: { rowCount: 200, columnCount: 19 } } },
      ],
    },
  });
  const spreadsheetId = createRes.data.spreadsheetId;
  const sheetUrl = createRes.data.spreadsheetUrl;
  console.log(`✅ Sheet created: ${spreadsheetId}`);

  // 2. Strategy タブにデータ書き込み
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "Strategy!A1",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: STRATEGY_ROWS },
  });

  // 3. Pipeline タブにヘッダー + データ書き込み
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "Pipeline!A1",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [PIPELINE_HEADER, ...PIPELINE_ROWS] },
  });

  // 4. フォーマット: ヘッダー bold + 凍結行 + 列幅自動
  const strategySheetId = createRes.data.sheets[0].properties.sheetId;
  const pipelineSheetId = createRes.data.sheets[1].properties.sheetId;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        // Strategy: 1行目をタイトル風（太字・大）
        {
          repeatCell: {
            range: { sheetId: strategySheetId, startRowIndex: 0, endRowIndex: 1 },
            cell: { userEnteredFormat: { textFormat: { bold: true, fontSize: 14 }, backgroundColor: { red: 0.92, green: 0.95, blue: 0.92 } } },
            fields: "userEnteredFormat(textFormat,backgroundColor)",
          },
        },
        // Pipeline: ヘッダー行を太字 + 背景色 + 凍結
        {
          repeatCell: {
            range: { sheetId: pipelineSheetId, startRowIndex: 0, endRowIndex: 1 },
            cell: { userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.85, green: 0.92, blue: 0.95 }, horizontalAlignment: "CENTER" } },
            fields: "userEnteredFormat(textFormat,backgroundColor,horizontalAlignment)",
          },
        },
        {
          updateSheetProperties: {
            properties: { sheetId: pipelineSheetId, gridProperties: { frozenRowCount: 1, frozenColumnCount: 1 } },
            fields: "gridProperties.frozenRowCount,gridProperties.frozenColumnCount",
          },
        },
        // Pipeline: Status 列に Data Validation（プルダウン）
        // X Status (G列 = index 6)
        {
          setDataValidation: {
            range: { sheetId: pipelineSheetId, startRowIndex: 1, endRowIndex: 200, startColumnIndex: 6, endColumnIndex: 7 },
            rule: {
              condition: { type: "ONE_OF_LIST", values: [{ userEnteredValue: "Draft" }, { userEnteredValue: "Reviewed" }, { userEnteredValue: "Posted" }, { userEnteredValue: "Boosted" }] },
              showCustomUi: true,
              strict: false,
            },
          },
        },
        // note Status (K列 = index 10)
        {
          setDataValidation: {
            range: { sheetId: pipelineSheetId, startRowIndex: 1, endRowIndex: 200, startColumnIndex: 10, endColumnIndex: 11 },
            rule: {
              condition: { type: "ONE_OF_LIST", values: [{ userEnteredValue: "Pending" }, { userEnteredValue: "Drafted" }, { userEnteredValue: "Reviewed" }, { userEnteredValue: "Published" }, { userEnteredValue: "Skipped" }] },
              showCustomUi: true,
              strict: false,
            },
          },
        },
        // HP Status (O列 = index 14)
        {
          setDataValidation: {
            range: { sheetId: pipelineSheetId, startRowIndex: 1, endRowIndex: 200, startColumnIndex: 14, endColumnIndex: 15 },
            rule: {
              condition: { type: "ONE_OF_LIST", values: [{ userEnteredValue: "Pending" }, { userEnteredValue: "Drafted" }, { userEnteredValue: "Reviewed" }, { userEnteredValue: "Published" }, { userEnteredValue: "Skipped" }] },
              showCustomUi: true,
              strict: false,
            },
          },
        },
        // Pipeline: 列幅調整
        { updateDimensionProperties: { range: { sheetId: pipelineSheetId, dimension: "COLUMNS", startIndex: 0, endIndex: 1 }, properties: { pixelSize: 80 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: pipelineSheetId, dimension: "COLUMNS", startIndex: 1, endIndex: 2 }, properties: { pixelSize: 120 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: pipelineSheetId, dimension: "COLUMNS", startIndex: 2, endIndex: 3 }, properties: { pixelSize: 150 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: pipelineSheetId, dimension: "COLUMNS", startIndex: 3, endIndex: 4 }, properties: { pixelSize: 280 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: pipelineSheetId, dimension: "COLUMNS", startIndex: 18, endIndex: 19 }, properties: { pixelSize: 250 }, fields: "pixelSize" } },
        // Strategy: 列幅
        { updateDimensionProperties: { range: { sheetId: strategySheetId, dimension: "COLUMNS", startIndex: 0, endIndex: 1 }, properties: { pixelSize: 200 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: strategySheetId, dimension: "COLUMNS", startIndex: 1, endIndex: 4 }, properties: { pixelSize: 280 }, fields: "pixelSize" } },
      ],
    },
  });

  // 5. Anyone-with-link viewer 権限
  await drive.permissions.create({
    fileId: spreadsheetId,
    requestBody: { role: "reader", type: "anyone" },
  });

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`✅ Tracker created and shared (Anyone with link can view)`);
  console.log(`📊 URL: ${sheetUrl}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  if (err.errors) console.error(JSON.stringify(err.errors, null, 2));
  process.exit(1);
});
