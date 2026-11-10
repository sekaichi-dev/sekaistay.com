// 宿泊者名簿のテスト送信を片付ける: 受付 ID と完全一致する名簿シートの行を消し、Drive の写真フォルダをゴミ箱へ移す。
//
// 使い方（既定は dry-run＝対象を表示するだけで何も変えない）:
//   node --env-file=$HOME/srv/shared/google-auth/.env.local scripts/guest-register-purge.ts G-261110-ABCD
//   node --env-file=$HOME/srv/shared/google-auth/.env.local scripts/guest-register-purge.ts G-261110-ABCD --commit
// 認証は本番のフォームと同じ GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN_SEKAICHI。
// - 行は削除（空行を残すと以降の追記の位置がずれるため）。旅館業用の No. は =ROW()-5 なので詰め直される
// - Drive はゴミ箱へ移すだけ（共有ドライブのゴミ箱から 30 日は戻せる）
// - 受付中フォルダの原本は日次の掃除（/api/guest-register/cleanup）が 24 時間後に消すので触らない
// - 本番の名簿・本物のゲストの行に使わないこと（テスト送信の後片付け専用）
import {
  FIRST_DATA_ROW, RECEIPT_ID_RE, isReceiptFolderName, isReceiptPhotoName, matchReceiptRows, planProblem, receiptFolderPath,
  type MatchedRow, type RegisterTab,
} from "../lib/guest-register-purge.ts";

const SHEET_ID = (process.env.GUEST_REGISTER_SHEET_ID || "1Kki7oukd5yM73FH8kJvhzTxJyw4MCmlm8x1r09OhhQw").trim();
const DRIVE_FOLDER_ID = (process.env.GUEST_REGISTER_DRIVE_FOLDER_ID || "1jQeGxUv1wPf8hfMgC2HvhZ7SdvPrKvQ6").trim();
const TABS: RegisterTab[] = ["民泊用", "旅館業用"];

const args = process.argv.slice(2);
const receiptId = args.find((a) => !a.startsWith("--")) || "";
const commit = args.includes("--commit");
if (!RECEIPT_ID_RE.test(receiptId)) {
  console.error("受付 ID を G-YYMMDD-XXXX の形で 1 つ指定してください（例: G-261110-ABCD）");
  process.exit(2);
}

async function token(): Promise<string> {
  const env = (k: string) => (process.env[k] || "").trim();
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: env("GOOGLE_CLIENT_ID"), client_secret: env("GOOGLE_CLIENT_SECRET"),
      refresh_token: env("GOOGLE_REFRESH_TOKEN_SEKAICHI"), grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`token ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return ((await res.json()) as { access_token: string }).access_token;
}

let auth: Record<string, string> = {};

async function getJson<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, { ...init, headers: { ...auth, ...(init.headers || {}) } });
  if (!res.ok) throw new Error(`${init.method || "GET"} ${url.split("?")[0]} ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return (await res.json()) as T;
}

async function readTab(tab: RegisterTab): Promise<string[][]> {
  const range = encodeURIComponent(`${tab}!A${FIRST_DATA_ROW}:W`);
  const d = await getJson<{ values?: string[][] }>(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}`);
  return d.values || [];
}

async function findRows(): Promise<MatchedRow[]> {
  const out: MatchedRow[] = [];
  for (const tab of TABS) out.push(...matchReceiptRows(tab, await readTab(tab), receiptId));
  return out;
}

const q = (s: string) => s.replaceAll("\\", "\\\\").replaceAll("'", "\\'");
async function listChildren(parent: string, extra: string): Promise<{ id: string; name: string; mimeType: string }[]> {
  const files: { id: string; name: string; mimeType: string }[] = [];
  let pageToken = "";
  do {
    const query = encodeURIComponent(`'${q(parent)}' in parents and trashed = false${extra ? ` and ${extra}` : ""}`);
    const d = await getJson<{ files?: { id: string; name: string; mimeType: string }[]; nextPageToken?: string }>(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=nextPageToken,files(id,name,mimeType)&pageSize=200&supportsAllDrives=true&includeItemsFromAllDrives=true${pageToken ? `&pageToken=${pageToken}` : ""}`,
    );
    files.push(...(d.files || []));
    pageToken = d.nextPageToken || "";
  } while (pageToken);
  return files;
}

const FOLDER = "mimeType = 'application/vnd.google-apps.folder'";

async function findDriveTargets(row: MatchedRow) {
  const targets: { id: string; name: string; kind: string }[] = [];
  let parent = DRIVE_FOLDER_ID;
  for (const name of receiptFolderPath(row)) {
    const hit = (await listChildren(parent, `${FOLDER} and name = '${q(name)}'`))[0];
    if (!hit) { parent = ""; break; }
    parent = hit.id;
  }
  if (parent) {
    for (const f of await listChildren(parent, FOLDER)) {
      if (isReceiptFolderName(f.name, receiptId)) targets.push({ id: f.id, name: f.name, kind: "写真フォルダ" });
    }
  }
  // フォルダを作れなかった送信の写真は名簿フォルダ直下に置かれる
  for (const f of await listChildren(DRIVE_FOLDER_ID, `not ${FOLDER}`)) {
    if (isReceiptPhotoName(f.name, receiptId)) targets.push({ id: f.id, name: f.name, kind: "直下の写真" });
  }
  return targets;
}

async function main() {
  auth = { Authorization: `Bearer ${await token()}` };
  const rows = await findRows();
  const problem = planProblem(rows);
  console.log(`受付 ID: ${receiptId}（${commit ? "実行" : "dry-run・何も変えません"}）`);
  for (const r of rows) console.log(`  行: ${r.tab}!${r.sheetRow}  ${r.checkin}  ${r.propertyName}  ${r.guestName}`);
  if (problem) {
    console.error(`中止: ${problem}`);
    process.exit(1);
  }
  const driveTargets = await findDriveTargets(rows[0]);
  for (const t of driveTargets) console.log(`  Drive: ${t.kind}「${t.name}」(${t.id})`);
  if (driveTargets.length === 0) console.log("  Drive: 該当なし");

  if (!commit) {
    console.log("dry-run のため変更していません。消すときは --commit を付けて実行してください。");
    return;
  }

  // 消す直前に読み直し、行の位置が変わっていないことを確かめる（並行して追記・削除があったら止める）
  const again = await findRows();
  if (JSON.stringify(again) !== JSON.stringify(rows)) {
    console.error("中止: 確認中に名簿の行が動きました。もう一度 dry-run から実行してください。");
    process.exit(1);
  }
  const meta = await getJson<{ sheets: { properties: { sheetId: number; title: string } }[] }>(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?fields=sheets.properties(sheetId,title)`,
  );
  const sheetId = meta.sheets.find((s) => s.properties.title === rows[0].tab)?.properties.sheetId;
  if (sheetId === undefined) throw new Error(`タブ ${rows[0].tab} が見つかりません`);
  // 下の行から消す（上から消すと後ろの行番号がずれる）
  const requests = [...rows].sort((a, b) => b.sheetRow - a.sheetRow).map((r) => ({
    deleteDimension: { range: { sheetId, dimension: "ROWS", startIndex: r.sheetRow - 1, endIndex: r.sheetRow } },
  }));
  await getJson(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}:batchUpdate`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ requests }),
  });
  console.log(`名簿の行を ${rows.length} 行削除しました。`);
  for (const t of driveTargets) {
    await getJson(`https://www.googleapis.com/drive/v3/files/${t.id}?supportsAllDrives=true&fields=id`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ trashed: true }),
    });
    console.log(`Drive をゴミ箱へ移しました: ${t.name}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
