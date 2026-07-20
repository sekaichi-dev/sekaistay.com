#!/usr/bin/env node
// Supabase lead_submissions → Google Sheets backup
// Runs idempotently: re-syncs only rows whose lead_id is not yet in the sheet.
// Shares the sheet with viewers on first creation.
//
// 使い方:
//   node scripts/sync-leads-to-sheet.mjs                     # 通常同期
//   node scripts/sync-leads-to-sheet.mjs --since=YYYY-MM-DD  # 任意の起点で再同期
//   node scripts/sync-leads-to-sheet.mjs --reshare           # viewer 招待を再送
//
// crontab 推奨: */5 * * * * cd <repo> && node ... >> logs/sync.log 2>&1

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
import { getSheets, getDrive } from "../../../shared/google-auth/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV_FILE = join(__dirname, "..", ".env.vercel.prod");
if (!existsSync(ENV_FILE)) {
  console.error(`Missing ${ENV_FILE}. Run: vercel env pull .env.vercel.prod --environment=production`);
  process.exit(1);
}
config({ path: ENV_FILE });

const SHEET_NAME = "SEKAI STAY Lead Submissions Log";
const TAB_NAME = "leads";
const VIEWERS = ["hikaru@sekaichi.org"];

const HEADER = [
  "lead_id",
  "created_at",
  "kind",
  "name",
  "email",
  "phone",
  "lp_variant",
  "form_variant",
  "airbnb_url",
  "total_properties",
  "peak_revenue",
  "offpeak_revenue",
  "commission_rate",
  "operating_years",
  "company_name",
  "complaints",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
  "landing_url",
  "referrer",
  "forwarded_at",
  "forward_error",
  "forward_retry_count",
];

const args = new Set(process.argv.slice(2));
const sinceArg = process.argv.slice(2).find((a) => a.startsWith("--since="));
const RESHARE = args.has("--reshare");
const SINCE_ISO = sinceArg
  ? new Date(sinceArg.replace("--since=", "")).toISOString()
  : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

async function findOrCreateSheet(sheets, drive) {
  const search = await drive.files.list({
    q: `name='${SHEET_NAME}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`,
    fields: "files(id, name, webViewLink)",
    pageSize: 5,
  });
  if (search.data.files?.length) {
    const f = search.data.files[0];
    return { id: f.id, link: f.webViewLink, created: false };
  }
  const created = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title: SHEET_NAME, locale: "ja_JP", timeZone: "Asia/Tokyo" },
      sheets: [{ properties: { title: TAB_NAME } }],
    },
    fields: "spreadsheetId,spreadsheetUrl,sheets(properties(sheetId,title))",
  });
  const id = created.data.spreadsheetId;
  const tabSheetId = created.data.sheets?.find((s) => s.properties?.title === TAB_NAME)?.properties?.sheetId ?? 0;
  await sheets.spreadsheets.values.update({
    spreadsheetId: id,
    range: `${TAB_NAME}!A1`,
    valueInputOption: "RAW",
    requestBody: { values: [HEADER] },
  });
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: id,
    requestBody: {
      requests: [
        {
          updateSheetProperties: {
            properties: { sheetId: tabSheetId, gridProperties: { frozenRowCount: 1 } },
            fields: "gridProperties.frozenRowCount",
          },
        },
        {
          repeatCell: {
            range: { sheetId: tabSheetId, startRowIndex: 0, endRowIndex: 1 },
            cell: { userEnteredFormat: { textFormat: { bold: true } } },
            fields: "userEnteredFormat.textFormat.bold",
          },
        },
      ],
    },
  });
  return { id, link: created.data.spreadsheetUrl, created: true };
}

async function shareWithViewers(drive, fileId) {
  for (const email of VIEWERS) {
    try {
      await drive.permissions.create({
        fileId,
        sendNotificationEmail: false,
        requestBody: { type: "user", role: "writer", emailAddress: email },
      });
      console.log(`shared with ${email}`);
    } catch (e) {
      const msg = String(e?.message || "");
      if (msg.includes("already") || msg.includes("duplicate")) continue;
      console.warn(`share ${email} failed: ${msg}`);
    }
  }
}

async function getSyncedIds(sheets, sheetId) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${TAB_NAME}!A2:A`,
    majorDimension: "COLUMNS",
  });
  const col = res.data.values?.[0] ?? [];
  return new Set(col.filter(Boolean));
}

function rowToValues(r) {
  return [
    r.id,
    r.created_at,
    r.kind,
    r.name ?? "",
    r.email ?? "",
    r.phone ?? "",
    r.lp_variant ?? "",
    r.form_variant ?? "",
    r.airbnb_url ?? "",
    r.total_properties ?? "",
    r.peak_revenue ?? "",
    r.offpeak_revenue ?? "",
    r.commission_rate ?? "",
    r.operating_years ?? "",
    r.company_name ?? "",
    r.complaints ?? "",
    r.utm_source ?? "",
    r.utm_medium ?? "",
    r.utm_campaign ?? "",
    r.utm_content ?? "",
    r.utm_term ?? "",
    r.gclid ?? "",
    r.fbclid ?? "",
    r.landing_url ?? "",
    r.referrer ?? "",
    r.forwarded_at ?? "",
    r.forward_error ?? "",
    r.forward_retry_count ?? 0,
  ];
}

async function appendRows(sheets, sheetId, rows) {
  if (rows.length === 0) return;
  // Sheets API: max 10MB per request — chunk by 500 rows to be safe.
  const CHUNK = 500;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const slice = rows.slice(i, i + CHUNK);
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${TAB_NAME}!A:AB`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: slice },
    });
  }
}

async function main() {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing in .env.vercel.prod");
  }
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const sheets = getSheets("sekaichi");
  const drive = getDrive("sekaichi");

  const { id: sheetId, link, created } = await findOrCreateSheet(sheets, drive);
  if (created || RESHARE) {
    await shareWithViewers(drive, sheetId);
  }

  const synced = await getSyncedIds(sheets, sheetId);

  const { data: leads, error } = await supabase
    .from("lead_submissions")
    .select("*")
    .gte("created_at", SINCE_ISO)
    .order("created_at", { ascending: true });
  if (error) throw error;

  const newRows = (leads || []).filter((r) => !synced.has(r.id)).map(rowToValues);
  await appendRows(sheets, sheetId, newRows);

  const total = synced.size + newRows.length;
  console.log(
    JSON.stringify({
      ok: true,
      created,
      since: SINCE_ISO,
      newRows: newRows.length,
      totalInSheet: total,
      sheetUrl: link,
      sheetId,
    }),
  );
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: e?.message || String(e) }));
  process.exit(1);
});
