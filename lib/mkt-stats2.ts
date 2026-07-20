import { getSupabaseAdmin } from "@/lib/supabase";

/*
 * パラメータ別トラッキング集計 v2 (2026-07-19)
 * manage.kss-cloud.com の /marketing/lp 刷新版ダッシュボード向け。
 * 既存の lib/mkt-stats.ts（/api/mkt/stats・/mkt/board 用）は一切変更しない。ここは独立。
 *
 * v1 との違い:
 *   - 集計単位を campaign × source × content × lp_variant まで細分化（どのLP/媒体/属性で割れるか）。
 *   - views を「ページビュー数」ではなく visitor_hash の distinct 数（重複を潰したユニーク訪問）で数える。
 *   - from/to（YYYY-MM-DD）で任意期間を指定（省略時は全期間）。
 */

export type Mkt2Row = {
  campaign: string;
  source: string;
  content: string;
  lpVariant: string;
  viewsUnique: number; // その group 内の distinct visitor_hash
  cv: number; // フォーム送信（テスト含む）
  cvTest: number; // kind=test
  cvReal: number; // テスト以外
  cvrPct: string; // cvReal / viewsUnique
};

export type Mkt2Stats = {
  rows: Mkt2Row[];
  totalViewsUnique: number; // 全体の distinct visitor_hash（LP 横断で重複も潰す）
  totalCv: number;
  totalCvTest: number;
  totalCvReal: number;
};

// PostgREST は 1 レスポンス最大 1000 行に丸めるため range ページングで全行取り切る（board/stats と同方式）。
async function fetchAllRows(
  table: string,
  columns: string,
  fromISO: string | null,
  toISO: string | null,
  extraFilter?: (q: any) => any,
): Promise<any[]> {
  const supabase = getSupabaseAdmin();
  const PAGE = 1000;
  const MAX_PAGES = 200; // 20万行までの安全弁
  const all: any[] = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    // ORDER BY 必須: order 無しの range はページ間で行が重複/欠落し、1000行超で件数がサイレントにズレる。
    let q = supabase.from(table).select(columns).order("created_at", { ascending: true }).range(page * PAGE, page * PAGE + PAGE - 1);
    if (fromISO) q = q.gte("created_at", fromISO);
    if (toISO) q = q.lt("created_at", toISO);
    if (extraFilter) q = extraFilter(q);
    const { data, error } = await q;
    if (error) throw new Error(`${table} fetch failed: ${error.message}`);
    all.push(...(data || []));
    if (!data || data.length < PAGE) break;
  }
  return all;
}

const NORM_CAMPAIGN = (v: unknown) => String(v || "(パラメータなし)");
const NORM_SOURCE = (v: unknown) => String(v || "(直接/検索)");
const NORM_CONTENT = (v: unknown) => String(v || "");
const NORM_LP = (v: unknown) => String(v || "");

// YYYY-MM-DD → ISO。to は「その日を含む」ため翌日 00:00 未満で切る。
function dayStartISO(d: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return null;
  return new Date(`${d}T00:00:00.000Z`).toISOString();
}
function dayAfterISO(d: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return null;
  return new Date(new Date(`${d}T00:00:00.000Z`).getTime() + 86_400_000).toISOString();
}

export async function fetchMktStats2(from: string | null, to: string | null): Promise<Mkt2Stats> {
  const fromISO = from ? dayStartISO(from) : null;
  const toISO = to ? dayAfterISO(to) : null;

  const [viewsData, leadsData] = await Promise.all([
    fetchAllRows("lp_page_views", "utm_campaign, utm_source, utm_content, lp_variant, visitor_hash, bot", fromISO, toISO, (q) => q.eq("bot", false)),
    fetchAllRows("lead_submissions", "utm_campaign, utm_source, utm_content, lp_variant, kind", fromISO, toISO),
  ]);

  // 区切り文字(U+001F)でグループキーの境界を明示。素朴連結は "a"+"bc" と "ab"+"c" が衝突しうる。
  const SEP = "\x1f";
  const key = (c: string, s: string, ct: string, lp: string) => `${c}${SEP}${s}${SEP}${ct}${SEP}${lp}`;
  type Agg = { campaign: string; source: string; content: string; lpVariant: string; visitors: Set<string>; noHash: number; cv: number; cvTest: number; cvReal: number };
  const map = new Map<string, Agg>();
  const get = (c: string, s: string, ct: string, lp: string): Agg => {
    const k = key(c, s, ct, lp);
    let a = map.get(k);
    if (!a) { a = { campaign: c, source: s, content: ct, lpVariant: lp, visitors: new Set(), noHash: 0, cv: 0, cvTest: 0, cvReal: 0 }; map.set(k, a); }
    return a;
  };

  const globalVisitors = new Set<string>();
  let globalNoHash = 0;

  for (const r of viewsData) {
    const a = get(NORM_CAMPAIGN(r.utm_campaign), NORM_SOURCE(r.utm_source), NORM_CONTENT(r.utm_content), NORM_LP(r.lp_variant));
    const h = r.visitor_hash ? String(r.visitor_hash) : "";
    if (h) { a.visitors.add(h); globalVisitors.add(h); }
    else { a.noHash += 1; globalNoHash += 1; }
  }
  for (const r of leadsData) {
    const a = get(NORM_CAMPAIGN(r.utm_campaign), NORM_SOURCE(r.utm_source), NORM_CONTENT(r.utm_content), NORM_LP(r.lp_variant));
    a.cv += 1;
    if (r.kind === "test") a.cvTest += 1; else a.cvReal += 1;
  }

  const rows: Mkt2Row[] = Array.from(map.values()).map((a) => {
    const viewsUnique = a.visitors.size + a.noHash;
    return {
      campaign: a.campaign,
      source: a.source,
      content: a.content,
      lpVariant: a.lpVariant,
      viewsUnique,
      cv: a.cv,
      cvTest: a.cvTest,
      cvReal: a.cvReal,
      cvrPct: viewsUnique > 0 ? `${((a.cvReal / viewsUnique) * 100).toFixed(2)}%` : "—",
    };
  }).sort((x, y) => y.cv - x.cv || y.viewsUnique - x.viewsUnique);

  return {
    rows,
    totalViewsUnique: globalVisitors.size + globalNoHash,
    totalCv: rows.reduce((s, r) => s + r.cv, 0),
    totalCvTest: rows.reduce((s, r) => s + r.cvTest, 0),
    totalCvReal: rows.reduce((s, r) => s + r.cvReal, 0),
  };
}
