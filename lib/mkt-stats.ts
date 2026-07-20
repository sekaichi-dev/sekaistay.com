import { getSupabaseAdmin } from "@/lib/supabase";

/*
 * パラメータ別トラッキング集計 (2026-07-08)
 * /mkt/board (画面) と /api/mkt/stats (manage 向け JSON) の共通ロジック。
 */

export type MktRow = {
  campaign: string;
  source: string;
  views: number;
  leads: number; // テスト含む全CV
  testLeads: number;
  realLeads: number;
  cvrPct: string;
};

export type MktStats = {
  rows: MktRow[];
  totalViews: number;
  totalLeads: number;
  totalTest: number;
};

// Supabase (PostgREST) はサーバー側で 1 レスポンス最大 1000 行に丸めるため、
// .limit() だけでは足りない。range ページングで全行を取り切る。
async function fetchAllRows(
  table: string,
  columns: string,
  since: string | null,
  extraFilter?: (q: any) => any,
): Promise<any[]> {
  const supabase = getSupabaseAdmin();
  const PAGE = 1000;
  const MAX_PAGES = 50; // 5万行までの安全弁
  const all: any[] = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    let q = supabase.from(table).select(columns).range(page * PAGE, page * PAGE + PAGE - 1);
    if (since) q = q.gte("created_at", since);
    if (extraFilter) q = extraFilter(q);
    const { data, error } = await q;
    if (error) throw new Error(`${table} fetch failed: ${error.message}`);
    all.push(...(data || []));
    if (!data || data.length < PAGE) break;
  }
  return all;
}

export async function fetchMktStats(days: number | null): Promise<MktStats> {
  const since = days ? new Date(Date.now() - days * 86_400_000).toISOString() : null;

  const [viewsData, leadsData] = await Promise.all([
    fetchAllRows("lp_page_views", "utm_campaign, utm_source, bot", since, (q) => q.eq("bot", false)),
    fetchAllRows("lead_submissions", "utm_campaign, utm_source, kind", since),
  ]);

  const key = (c: unknown, s: unknown) => `${c || "(パラメータなし)"} ${s || "(直接/検索)"}`;
  const map = new Map<string, MktRow>();
  const get = (c: unknown, s: unknown): MktRow => {
    const k = key(c, s);
    let row = map.get(k);
    if (!row) {
      row = {
        campaign: String(c || "(パラメータなし)"),
        source: String(s || "(直接/検索)"),
        views: 0,
        leads: 0,
        testLeads: 0,
        realLeads: 0,
        cvrPct: "—",
      };
      map.set(k, row);
    }
    return row;
  };

  viewsData.forEach((r: any) => {
    get(r.utm_campaign, r.utm_source).views += 1;
  });
  leadsData.forEach((r: any) => {
    const row = get(r.utm_campaign, r.utm_source);
    row.leads += 1;
    if (r.kind === "test") row.testLeads += 1;
    else row.realLeads += 1;
  });

  const rows = Array.from(map.values())
    .map((r) => ({
      ...r,
      cvrPct: r.views > 0 ? `${((r.realLeads / r.views) * 100).toFixed(2)}%` : "—",
    }))
    .sort((a, b) => b.leads - a.leads || b.views - a.views);

  return {
    rows,
    totalViews: rows.reduce((s, r) => s + r.views, 0),
    totalLeads: rows.reduce((s, r) => s + r.leads, 0),
    totalTest: rows.reduce((s, r) => s + r.testLeads, 0),
  };
}
