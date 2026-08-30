import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ADMIN_KEY = "sekaichi2026"; // shared with /audit admin pattern

type Stat = {
  variant: string;
  label: string;
  views: number;
  leads: number;
  cvr: number;
  cvrPct: string;
  zScore: number | null;
  significant: boolean;
};

const VARIANTS: { id: string; label: string }[] = [
  { id: "switch", label: "A: 価格主導 (control)" },
  { id: "switch-portal", label: "B: ポータル主導" },
  { id: "switch-founder", label: "C: 信頼主導" },
  { id: "switch-short", label: "D: Control短縮版" },
];

// 比率の Z 検定 (control vs variant)
function zScoreCVR(v1: { x: number; n: number }, v2: { x: number; n: number }): number | null {
  if (v1.n === 0 || v2.n === 0) return null;
  const p1 = v1.x / v1.n;
  const p2 = v2.x / v2.n;
  const p = (v1.x + v2.x) / (v1.n + v2.n);
  const se = Math.sqrt(p * (1 - p) * (1 / v1.n + 1 / v2.n));
  if (se === 0) return null;
  return (p2 - p1) / se;
}

async function fetchStats(): Promise<Stat[]> {
  const supabase = getSupabaseAdmin();
  const since = new Date(Date.now() - 30 * 86_400_000).toISOString(); // 過去30日

  const [viewsRes, leadsRes] = await Promise.all([
    supabase
      .from("lp_page_views")
      .select("lp_variant", { count: "exact" })
      .gte("created_at", since)
      .eq("bot", false),
    supabase
      .from("lead_submissions")
      .select("lp_variant", { count: "exact" })
      .gte("created_at", since)
      .eq("kind", "real"),
  ]);

  const viewCounts = new Map<string, number>();
  (viewsRes.data || []).forEach((row: any) => {
    const v = row.lp_variant;
    viewCounts.set(v, (viewCounts.get(v) || 0) + 1);
  });

  const leadCounts = new Map<string, number>();
  (leadsRes.data || []).forEach((row: any) => {
    const v = row.lp_variant ?? "switch"; // null なら control 扱い (control は iframe で lp_variant が記録されない)
    leadCounts.set(v, (leadCounts.get(v) || 0) + 1);
  });

  // controlの基準値 (viewsRes/leadsRes から control 抽出)
  const controlViews = viewCounts.get("switch") || 0;
  const controlLeads = leadCounts.get("switch") || 0;

  return VARIANTS.map(({ id, label }) => {
    const views = viewCounts.get(id) || 0;
    const leads = leadCounts.get(id) || 0;
    const cvr = views > 0 ? leads / views : 0;
    let zScore: number | null = null;
    let significant = false;
    if (id !== "switch" && controlViews > 0 && views > 0) {
      zScore = zScoreCVR({ x: controlLeads, n: controlViews }, { x: leads, n: views });
      significant = zScore !== null && Math.abs(zScore) >= 1.96;
    }
    return {
      variant: id,
      label,
      views,
      leads,
      cvr,
      cvrPct: views > 0 ? `${(cvr * 100).toFixed(2)}%` : "—",
      zScore,
      significant,
    };
  });
}

export default async function SwitchResultsPage({ searchParams }: { searchParams: { admin?: string } }) {
  if (searchParams?.admin !== ADMIN_KEY) {
    redirect("/");
  }

  const stats = await fetchStats();
  const sorted = [...stats].sort((a, b) => b.cvr - a.cvr);
  const winner = sorted[0]?.views > 0 ? sorted[0] : null;
  const totalViews = stats.reduce((s, x) => s + x.views, 0);
  const totalLeads = stats.reduce((s, x) => s + x.leads, 0);

  return (
    <main className="min-h-screen bg-ivory text-ink">
      <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">A/B Test Results — /switch</h1>
          <p className="text-[12px] text-ink/55">過去30日 ・ bot/test 除外</p>
        </div>
        <p className="text-[14px] text-ink/65 mb-10">
          バランス (control) / シンプル / コテコテ の3パターン CVR 比較。
        </p>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          <SummaryCard label="合計訪問" value={totalViews.toLocaleString()} />
          <SummaryCard label="合計リード" value={totalLeads.toLocaleString()} />
          <SummaryCard
            label="全体CVR"
            value={totalViews > 0 ? `${((totalLeads / totalViews) * 100).toFixed(2)}%` : "—"}
          />
          <SummaryCard label="勝ちパターン" value={winner ? winner.label : "—"} highlight />
        </div>

        {/* Detail table */}
        <div className="bg-paper border border-rule rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-rule">
            <h2 className="text-lg font-bold">パターン別パフォーマンス</h2>
            <p className="text-[12px] text-ink/55 mt-0.5">Z-score ≥ 1.96 で control との差が統計的に有意 (p &lt; 0.05)</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bone">
                <tr className="text-left text-[12px] text-ink/60 uppercase tracking-wider">
                  <th className="px-6 py-3 font-semibold">パターン</th>
                  <th className="px-3 py-3 font-semibold text-right">訪問</th>
                  <th className="px-3 py-3 font-semibold text-right">リード</th>
                  <th className="px-3 py-3 font-semibold text-right">CVR</th>
                  <th className="px-3 py-3 font-semibold text-right">Δ vs control</th>
                  <th className="px-6 py-3 font-semibold text-right">Z-score</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((s) => {
                  const control = stats.find((x) => x.variant === "switch")!;
                  const delta = s.variant === "switch" ? null : control.cvr > 0 ? (s.cvr - control.cvr) / control.cvr : null;
                  return (
                    <tr key={s.variant} className="border-t border-rule">
                      <td className="px-6 py-3.5">
                        <div className="font-semibold">{s.label}</div>
                        <div className="text-[11px] text-ink/45 font-mono">{s.variant}</div>
                      </td>
                      <td className="px-3 py-3.5 text-right tabular-nums">{s.views.toLocaleString()}</td>
                      <td className="px-3 py-3.5 text-right tabular-nums">{s.leads.toLocaleString()}</td>
                      <td className="px-3 py-3.5 text-right tabular-nums font-bold">{s.cvrPct}</td>
                      <td className={`px-3 py-3.5 text-right tabular-nums font-medium ${
                        delta === null ? "text-ink/30" : delta > 0 ? "text-success" : delta < 0 ? "text-danger" : "text-ink/50"
                      }`}>
                        {delta === null ? "—" : `${delta > 0 ? "+" : ""}${(delta * 100).toFixed(1)}%`}
                      </td>
                      <td className={`px-6 py-3.5 text-right tabular-nums ${
                        s.zScore === null ? "text-ink/30" : s.significant ? "text-success font-bold" : "text-ink/50"
                      }`}>
                        {s.zScore === null ? "—" : s.zScore.toFixed(2)}
                        {s.significant && <span className="ml-1 text-[10px] uppercase tracking-wider">有意</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-[12px] text-ink/55 leading-relaxed bg-paper border border-rule rounded-lg p-5">
          <p className="font-semibold text-ink mb-2">読み方</p>
          <ul className="space-y-1.5">
            <li>• <strong>CVR</strong> = リード数 / 訪問数</li>
            <li>• <strong>Δ vs control</strong> = control に対する CVR の相対変化</li>
            <li>• <strong>Z-score</strong> = 2比率検定。±1.96 を超えると 95% 有意水準で差あり</li>
            <li>• control の lp_variant は &quot;switch&quot;。 simple / kotekote と Supabase で同じ尺度で比較</li>
            <li>• 各 variant 毎に 200 訪問以上で結果に信頼性が出始める (1日 30〜50訪問なら1週間)</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

function SummaryCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "bg-deep-teal text-ivory border-deep-teal" : "bg-paper border-rule text-ink"}`}>
      <p className={`text-[10px] uppercase tracking-[0.15em] mb-1 ${highlight ? "text-ivory/70" : "text-ink/50"}`}>{label}</p>
      <p className="text-xl sm:text-2xl font-bold tabular-nums tracking-tight">{value}</p>
    </div>
  );
}
