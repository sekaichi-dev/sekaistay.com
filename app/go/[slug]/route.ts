import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * 短縮 URL → 完全な UTM 付き URL へ 302 リダイレクト
 *
 * 投稿に貼るのは sekaistay.com/go/<slug>。
 * 実際の遷移先は /switch・/switch/founder・/switch/portal に UTM パラメータが付与される。
 *
 * Slug 命名規約:
 *   - X 長文B (utm_source=x, campaign=longform): t1, t2, t3, t4, j4, u6
 *   - note (utm_source=note): n1, n2, n3
 *   - ローンチ 6/1 (campaign=launch/launch_20260601): pr, fbt, fbj, xlt, xlj
 */
const REDIRECT_MAP: Record<string, string> = {
  // X 長文B (utm_source=x, utm_medium=organic, utm_campaign=longform)
  t1: "/switch?utm_source=x&utm_medium=organic&utm_campaign=longform&utm_content=tenichi_8pct_structure",
  t2: "/switch/founder?utm_source=x&utm_medium=organic&utm_campaign=longform&utm_content=tenichi_award_breakdown",
  t3: "/switch?utm_source=x&utm_medium=organic&utm_campaign=longform&utm_content=tenichi_agency_switch_signals",
  t4: "/switch/portal?utm_source=x&utm_medium=organic&utm_campaign=longform&utm_content=tenichi_furniture_roi",
  j4: "/switch?utm_source=x&utm_medium=organic&utm_campaign=longform&utm_content=jiro_minpaku_law_2026",
  u6: "/switch/portal?utm_source=x&utm_medium=organic&utm_campaign=longform&utm_content=unei_owner_dashboard_use",

  // note (utm_source=note, utm_medium=organic)
  n1: "/switch?utm_source=note&utm_medium=organic&utm_campaign=note_founder&utm_content=tenichi_8pct_decision",
  n2: "/switch?utm_source=note&utm_medium=organic&utm_campaign=note_industry&utm_content=tenichi_cost_structure",
  n3: "/switch/founder?utm_source=note&utm_medium=organic&utm_campaign=note_story&utm_content=tenichi_kamakura_pool",

  // 6/1 ローンチ
  pr: "/switch?utm_source=prtimes&utm_medium=press&utm_campaign=launch_20260601",
  fbt: "/switch?utm_source=facebook&utm_medium=organic&utm_campaign=launch_tenichi",
  fbj: "/switch?utm_source=facebook&utm_medium=organic&utm_campaign=launch_jiro",
  xlt: "/switch/founder?utm_source=x&utm_medium=organic&utm_campaign=launch&utm_content=launch_tenichi",
  xlj: "/switch?utm_source=x&utm_medium=organic&utm_campaign=launch&utm_content=launch_jiro",
};

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const slug = params.slug.toLowerCase();
  const dest = REDIRECT_MAP[slug];

  // 未定義 slug → /switch (ベースLP) にフォールバック
  const target = dest ?? "/switch";

  return NextResponse.redirect(new URL(target, req.url), { status: 302 });
}
