"use client";

import { useEffect, useMemo, useState } from "react";

// ── Constants ──

const COMMISSION_OPTIONS = [
  { value: "15", label: "15%" },
  { value: "20", label: "20%" },
  { value: "25", label: "25%" },
  { value: "unknown", label: "わからない" },
];

const YEARS_OPTIONS = [
  { value: "0", label: "1年未満" },
  { value: "1", label: "1〜2年" },
  { value: "3", label: "3〜5年" },
  { value: "5", label: "5年以上" },
];

const MEETING_URL = "https://timerex.net/s/sekai-stay/d61b424d";
const SEKAI_STAY_FEE = 8;
const MAX_REVENUE_MAN = 300;

// ── Types ──

type PropertyChoice = {
  source: "airbnb" | "other";
  url: string;
  title?: string;
  thumbnail?: string;
};

type FormState = {
  // step 1: property
  property: PropertyChoice | null;
  manualUrl: string;
  totalProperties: number; // 1〜30+
  // step 2: revenue
  peakRevenueMan: number;
  offpeakRevenueMan: number;
  // step 3: fee + years
  commissionRate: string;
  operatingYears: string;
  // step 4: contact
  name: string;
  email: string;
  phone: string;
  complaints: string;
};

const INITIAL: FormState = {
  property: null,
  manualUrl: "",
  totalProperties: 1,
  peakRevenueMan: 80,
  offpeakRevenueMan: 20,
  commissionRate: "",
  operatingYears: "",
  name: "",
  email: "",
  phone: "",
  complaints: "",
};

type Step = 1 | 2 | 3 | 4;

// ── Helpers ──

function manToRange(man: number): string {
  if (man < 10) return "0-10";
  if (man < 20) return "10-20";
  if (man < 30) return "20-30";
  if (man < 50) return "30-50";
  if (man < 80) return "50-80";
  if (man < 120) return "80-120";
  if (man < 200) return "120-200";
  if (man < 300) return "200-300";
  return "300+";
}

function formatMan(man: number): string {
  if (man >= MAX_REVENUE_MAN) return `${MAX_REVENUE_MAN}万円以上`;
  return `約${man}万円`;
}

function formatProperties(n: number): string {
  if (n >= 30) return "30棟以上";
  return `${n}棟`;
}

// 手数料レンジのテンプレ選択肢。フォーム上は 15/20/25/わからない だが、念のため
// メール/レポート側(scheduled-sender.ts, template sim-fee)と同じく最近傍丸め。
const TEMPLATE_FEE_OPTIONS = [10, 15, 20, 25, 30];
function commissionPct(code: string): number | null {
  if (!code || code === "unknown") return null;
  const n = parseInt(code, 10);
  if (!Number.isFinite(n)) return null;
  return TEMPLATE_FEE_OPTIONS.reduce(
    (a, b) => (Math.abs(b - n) < Math.abs(a - n) ? b : a),
    TEMPLATE_FEE_OPTIONS[0],
  );
}

// peakMan/offpeakMan（スライダー生値・万円）→ レンジ文字列 → 中央値（円）
// に変換。メール(scripts/report/scheduled-sender.ts#revenueMidpointYen)と
// レポート(build-report-html.ts setSelected)と同じ変換を使って、全接点で
// 同じ中央値ベースの手数料差額金額を表示するための統一。
function rangeMidpointYen(man: number): number {
  const r = manToRange(man);
  const map: Record<string, number> = {
    "0-10": 50000,
    "10-20": 150000,
    "20-30": 250000,
    "30-50": 400000,
    "50-80": 650000,
    "80-120": 1000000,
    "120-200": 1600000,
    "200-300": 2500000,
    "300+": 3500000,
  };
  return map[r] ?? 0;
}

function estimateAnnualLoss(peakMan: number, offpeakMan: number, commission: string): number | null {
  const peak = rangeMidpointYen(peakMan);
  const off = rangeMidpointYen(offpeakMan);
  const curFee = commissionPct(commission);
  if (!peak || !off || curFee == null) return null;
  const delta = curFee - SEKAI_STAY_FEE;
  if (delta <= 0) return null;
  const annualRevenue = peak * 6 + off * 6;
  return Math.round((annualRevenue * delta) / 100);
}

function formatYen(n: number): string {
  if (n >= 10000) {
    const man = Math.round(n / 10000);
    return `約${man.toLocaleString("ja-JP")}万円`;
  }
  return `約¥${n.toLocaleString("ja-JP")}`;
}

function formatDeadline(d: Date): { label: string } {
  const label = d.toLocaleString("ja-JP", {
    month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
  return { label };
}

function useCountdown(deadline: Date) {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, deadline.getTime() - now.getTime());
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s, expired: diff === 0 };
}

// ── Page ──

type Theme = "light" | "dark";

type AdAttribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  landingUrl?: string;
  referrer?: string;
};

export default function ReportRequestPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [isEmbed, setIsEmbed] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [annualLoss, setAnnualLoss] = useState<number | null>(null);
  const [attribution, setAttribution] = useState<AdAttribution>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setIsEmbed(params.get("embed") === "1");
    const t = params.get("theme");
    if (t === "dark") setTheme("dark");
    // 広告経路の自動回収（iframe URL に sekaistay 側から forwarding される）
    const get = (k: string) => params.get(k)?.slice(0, 200) || undefined;
    setAttribution({
      utmSource: get("utm_source"),
      utmMedium: get("utm_medium"),
      utmCampaign: get("utm_campaign"),
      utmContent: get("utm_content"),
      utmTerm: get("utm_term"),
      gclid: get("gclid"),
      fbclid: get("fbclid"),
      landingUrl: params.get("landing_url")?.slice(0, 1000) || undefined,
      referrer: document.referrer ? document.referrer.slice(0, 1000) : undefined,
    });
  }, []);

  useEffect(() => {
    if (!isEmbed || typeof window === "undefined") return;
    document.documentElement.style.background = "transparent";
    document.body.style.background = "transparent";
    const notifyHeight = () => {
      const height = document.body.scrollHeight;
      try {
        window.parent.postMessage({ type: "japan-villas-height", height }, "*");
      } catch {
        /* parent unreachable */
      }
    };
    notifyHeight();
    const observer = new ResizeObserver(notifyHeight);
    observer.observe(document.body);
    window.addEventListener("load", notifyHeight);
    const interval = setInterval(notifyHeight, 1000);
    return () => {
      observer.disconnect();
      window.removeEventListener("load", notifyHeight);
      clearInterval(interval);
    };
  }, [isEmbed]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const canNextFromStep1 = useMemo(() => {
    return form.property !== null || form.manualUrl.trim().length > 0;
  }, [form.property, form.manualUrl]);

  const canNextFromStep2 = useMemo(() => {
    return form.peakRevenueMan >= 0 && form.offpeakRevenueMan >= 0;
  }, [form.peakRevenueMan, form.offpeakRevenueMan]);

  const canNextFromStep3 = useMemo(() => {
    return form.commissionRate !== "" && form.operatingYears !== "";
  }, [form.commissionRate, form.operatingYears]);

  const canSubmit = useMemo(() => {
    return form.name.trim() && form.email.trim() && form.phone.trim();
  }, [form.name, form.email, form.phone]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      // 2026-04-27〜: Airbnb 単一化（copy-rules.md ⑦原則）。Booking.com URL は受付けない。
      const airbnbUrl = form.property?.source === "airbnb" ? form.property.url : (form.manualUrl.includes("airbnb") ? form.manualUrl : "");
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        airbnbUrl,
        peakRevenue: manToRange(form.peakRevenueMan),
        offpeakRevenue: manToRange(form.offpeakRevenueMan),
        commissionRate: form.commissionRate,
        operatingYears: form.operatingYears,
        complaints: form.complaints,
        totalProperties: form.totalProperties,
        ...attribution,
      };
      const res = await fetch("/api/report-requests/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "送信に失敗しました。時間をおいて再度お試しください。");
        setSubmitting(false);
        return;
      }
      setDeadline(new Date(Date.now() + 24 * 60 * 60 * 1000));
      setAnnualLoss(estimateAnnualLoss(form.peakRevenueMan, form.offpeakRevenueMan, form.commissionRate));
      setDone(true);
      try {
        if (typeof window !== "undefined" && window.parent !== window) {
          window.parent.postMessage(
            { type: "japan-villas-form-submitted", form_id: "switch" },
            "*"
          );
        }
      } catch {
        /* parent unreachable */
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("送信できませんでした。少し時間をおいてもう一度お試しください。");
      setSubmitting(false);
    }
  }

  if (done) {
    return <DoneScreen isEmbed={isEmbed} theme={theme} deadline={deadline} annualLoss={annualLoss} />;
  }

  return (
    <div
      className={isEmbed ? "" : "min-h-screen"}
      data-jv-theme={theme}
      style={{ background: isEmbed ? "transparent" : theme === "dark" ? "#0B0D0E" : "var(--jv-bg)" }}
    >
      <ThemeOverride theme={theme} />
      <div className="max-w-xl mx-auto px-5 pb-20" style={{ paddingTop: isEmbed ? 24 : 48 }}>
        {!isEmbed && (
          <img
            src="/assets/brand/sekai-stay-logo.png"
            alt="SEKAI STAY"
            style={{ height: 28, width: "auto", display: "block", marginBottom: 32 }}
          />
        )}

        <ProgressBar step={step} />

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-6">
          {step === 1 && (
            <Step1Property
              property={form.property}
              manualUrl={form.manualUrl}
              totalProperties={form.totalProperties}
              onSelect={(p) => update("property", p)}
              onManualUrl={(v) => update("manualUrl", v)}
              onTotalProperties={(v) => update("totalProperties", v)}
            />
          )}

          {step === 2 && (
            <Step2Revenue
              peakMan={form.peakRevenueMan}
              offpeakMan={form.offpeakRevenueMan}
              onChange={(k, v) => update(k, v as never)}
            />
          )}

          {step === 3 && (
            <Step3FeeYears
              commissionRate={form.commissionRate}
              operatingYears={form.operatingYears}
              onChange={(k, v) => update(k, v as never)}
            />
          )}

          {step === 4 && (
            <Step4Contact
              name={form.name}
              email={form.email}
              phone={form.phone}
              complaints={form.complaints}
              onChange={(k, v) => update(k, v as never)}
            />
          )}

          {error && (
            <div
              className="rounded-lg px-4 py-3 text-[14px]"
              style={{ background: "#FDEEEF", border: "1px solid #F5C2C7", color: "var(--jv-red)" }}
            >
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))}
                className="flex-1 rounded-lg py-3 text-[15px] font-medium transition-all active:scale-[0.98]"
                style={{ background: "#FFFFFF", color: "var(--jv-t1)", border: "1px solid #DADCE0" }}
              >
                ← 戻る
              </button>
            )}
            {step === 1 && (
              <button
                type="button"
                disabled={!canNextFromStep1}
                onClick={() => setStep(2)}
                className="flex-1 rounded-lg py-3 text-[15px] font-semibold transition-all active:scale-[0.98]"
                style={{
                  background: canNextFromStep1 ? "var(--jv-accent-strong)" : "#C8CBD0",
                  color: "#fff",
                  cursor: canNextFromStep1 ? "pointer" : "not-allowed",
                  opacity: canNextFromStep1 ? 1 : 0.8,
                }}
              >
                次へ →
              </button>
            )}
            {step === 2 && (
              <button
                type="button"
                disabled={!canNextFromStep2}
                onClick={() => setStep(3)}
                className="flex-1 rounded-lg py-3 text-[15px] font-semibold transition-all active:scale-[0.98]"
                style={{
                  background: canNextFromStep2 ? "var(--jv-accent-strong)" : "#C8CBD0",
                  color: "#fff",
                  cursor: canNextFromStep2 ? "pointer" : "not-allowed",
                  opacity: canNextFromStep2 ? 1 : 0.8,
                }}
              >
                次へ →
              </button>
            )}
            {step === 3 && (
              <button
                type="button"
                disabled={!canNextFromStep3}
                onClick={() => setStep(4)}
                className="flex-1 rounded-lg py-3 text-[15px] font-semibold transition-all active:scale-[0.98]"
                style={{
                  background: canNextFromStep3 ? "var(--jv-accent-strong)" : "#C8CBD0",
                  color: "#fff",
                  cursor: canNextFromStep3 ? "pointer" : "not-allowed",
                  opacity: canNextFromStep3 ? 1 : 0.8,
                }}
              >
                次へ →
              </button>
            )}
            {step === 4 && (
              <button
                type="submit"
                disabled={submitting || !canSubmit}
                className="flex-1 rounded-lg py-3 text-[15px] font-semibold transition-all active:scale-[0.98]"
                style={{
                  background: submitting || !canSubmit ? "#9AA0A6" : "var(--jv-accent-strong)",
                  color: "#fff",
                  cursor: submitting ? "wait" : canSubmit ? "pointer" : "not-allowed",
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? "送信中..." : "無料レポートを申し込む"}
              </button>
            )}
          </div>

          {step === 4 && (
            <p className="text-[11px] text-center leading-relaxed" style={{ color: "var(--jv-t3)" }}>
              ご入力いただいた情報は暗号化して送信され、レポート作成以外の目的では使用されません。
            </p>
          )}
        </form>

        {!isEmbed && (
          <p className="text-[12px] text-center mt-10" style={{ color: "var(--jv-t3)" }}>
            © SEKAI STAY · 株式会社セカイチ
          </p>
        )}
      </div>
    </div>
  );
}

// ── Progress Bar ──

function ProgressBar({ step }: { step: Step }) {
  const labels = ["物件情報", "売上", "手数料", "ご連絡先"];
  return (
    <div className="flex items-center gap-1">
      {labels.map((label, i) => {
        const idx = (i + 1) as Step;
        const state = idx < step ? "done" : idx === step ? "active" : "pending";
        return (
          <div key={label} className="flex items-center flex-1">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0"
                style={{
                  background: state === "pending" ? "#E8EAED" : "var(--jv-accent-strong)",
                  color: state === "pending" ? "#9AA0A6" : "#fff",
                }}
              >
                {state === "done" ? "✓" : idx}
              </div>
              <span
                className="text-[11px] font-medium truncate"
                style={{ color: state === "pending" ? "var(--jv-t3)" : "var(--jv-t1)" }}
              >
                {label}
              </span>
            </div>
            {i < labels.length - 1 && <div className="w-3 h-px" style={{ background: "#E8EAED" }} />}
          </div>
        );
      })}
    </div>
  );
}

// ── Step 1: Property ──

function Step1Property({
  property,
  manualUrl,
  totalProperties,
  onSelect,
  onManualUrl,
  onTotalProperties,
}: {
  property: PropertyChoice | null;
  manualUrl: string;
  totalProperties: number;
  onSelect: (p: PropertyChoice | null) => void;
  onManualUrl: (v: string) => void;
  onTotalProperties: (v: number) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PropertyChoice[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState<string | null>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setSearchErr(null);
      setShowAll(false);
      return;
    }
    setShowAll(false);
    const t = setTimeout(async () => {
      setSearching(true);
      setSearchErr(null);
      try {
        const res = await fetch(`/api/report-requests/property-search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (!res.ok) {
          setSearchErr(data.error || "検索できませんでした");
          setResults([]);
        } else {
          setResults(data.results || []);
        }
      } catch {
        setSearchErr("検索を読み込めませんでした。少し待って再度お試しください。");
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  const INITIAL_VISIBLE = 6;
  const visibleResults = showAll ? results : results.slice(0, INITIAL_VISIBLE);
  const hiddenCount = Math.max(0, results.length - INITIAL_VISIBLE);

  return (
    <StepCard title="メインの物件の情報を教えてください" subtitle="掲載サイトで物件を検索、またはURLを貼り付け">
      <div>
        <label className="block text-[13px] font-medium mb-1.5" style={{ color: "var(--jv-t1)" }}>
          物件名で検索
        </label>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="例：MOUNTAIN VILLA ニセコ"
          className="w-full px-4 py-3 rounded-lg text-[15px] outline-none"
          style={{ background: "#FFFFFF", border: "1px solid #DADCE0", color: "var(--jv-t1)" }}
        />
        {searching && <SearchingIndicator />}
        {searchErr && <p className="text-[12px] mt-2" style={{ color: "var(--jv-red)" }}>{searchErr}</p>}
        {!searching && query.length >= 2 && results.length === 0 && !searchErr && (
          <p className="text-[12px] mt-2" style={{ color: "var(--jv-t3)" }}>
            候補が見つかりませんでした。下のURL貼付けをご利用ください。
          </p>
        )}
        {results.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            {visibleResults.map((r) => {
              const selected = property?.url === r.url;
              return (
                <button
                  key={r.url}
                  type="button"
                  onClick={() => onSelect(selected ? null : r)}
                  className="flex items-center gap-3 rounded-lg p-3 text-left transition-all active:scale-[0.99]"
                  style={{
                    background: selected ? "var(--jv-accent-dim)" : "#FFFFFF",
                    border: selected ? "2px solid var(--jv-accent-strong)" : "1px solid #DADCE0",
                  }}
                >
                  {r.thumbnail && (
                    <img
                      src={r.thumbnail}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover shrink-0"
                      style={{ background: "#E8EAED" }}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium truncate" style={{ color: "var(--jv-t1)" }}>
                      {r.title || r.url}
                    </div>
                    <div className="text-[11px] mt-0.5 uppercase tracking-wider" style={{ color: "var(--jv-t3)" }}>
                      {r.source === "airbnb" ? "Airbnb" : "その他"}
                    </div>
                  </div>
                  {selected && (
                    <span className="text-[11px] px-2 py-1 rounded" style={{ background: "var(--jv-accent-strong)", color: "#fff" }}>
                      選択中
                    </span>
                  )}
                </button>
              );
            })}
            {!showAll && hiddenCount > 0 && (
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="rounded-lg py-2 text-[13px] font-medium transition-colors"
                style={{
                  background: "transparent",
                  color: "var(--jv-accent-strong)",
                  border: "1px dashed var(--jv-accent-strong)",
                }}
              >
                もっと見る（残り {hiddenCount} 件）
              </button>
            )}
            {showAll && results.length > INITIAL_VISIBLE && (
              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="rounded-lg py-2 text-[12px] font-medium transition-colors"
                style={{ background: "transparent", color: "var(--jv-t3)" }}
              >
                折りたたむ
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: "#E8EAED" }} />
        <span className="text-[11px]" style={{ color: "var(--jv-t3)" }}>または</span>
        <div className="flex-1 h-px" style={{ background: "#E8EAED" }} />
      </div>

      <div>
        <label className="block text-[13px] font-medium mb-1.5" style={{ color: "var(--jv-t1)" }}>
          物件のURLを貼り付け
        </label>
        <input
          type="url"
          value={manualUrl}
          onChange={(e) => onManualUrl(e.target.value)}
          placeholder="https://www.airbnb.jp/rooms/..."
          className="w-full px-4 py-3 rounded-lg text-[15px] outline-none"
          style={{ background: "#FFFFFF", border: "1px solid #DADCE0", color: "var(--jv-t1)" }}
        />
        <p className="text-[11px] mt-1.5" style={{ color: "var(--jv-t3)" }}>
          Airbnb のURLに対応しています。
        </p>
      </div>

      <PropertiesSlider value={totalProperties} onChange={onTotalProperties} />
    </StepCard>
  );
}

// ── Step 2: Revenue ──

function Step2Revenue({
  peakMan,
  offpeakMan,
  onChange,
}: {
  peakMan: number;
  offpeakMan: number;
  onChange: (k: keyof FormState, v: unknown) => void;
}) {
  return (
    <StepCard title="月別の売上" subtitle="正確な数値がなくてもおおよそで構いません">
      <MoneySlider
        label="ピーク月の売上"
        value={peakMan}
        onChange={(v) => onChange("peakRevenueMan", v)}
      />
      <MoneySlider
        label="オフピーク月の売上"
        value={offpeakMan}
        onChange={(v) => onChange("offpeakRevenueMan", v)}
      />
    </StepCard>
  );
}

// ── Step 3: Fee + Years ──

function Step3FeeYears({
  commissionRate,
  operatingYears,
  onChange,
}: {
  commissionRate: string;
  operatingYears: string;
  onChange: (k: keyof FormState, v: unknown) => void;
}) {
  return (
    <StepCard title="手数料・運用年数" subtitle="現在の運営代行の情報を教えてください">
      <ChoiceGrid
        label="現在の運営代行手数料"
        required
        value={commissionRate}
        onChange={(v) => onChange("commissionRate", v)}
        options={COMMISSION_OPTIONS}
        columns={2}
      />
      <ChoiceGrid
        label="運用年数"
        required
        value={operatingYears}
        onChange={(v) => onChange("operatingYears", v)}
        options={YEARS_OPTIONS}
        columns={2}
      />
    </StepCard>
  );
}

// ── Step 4: Contact ──

function Step4Contact({
  name,
  email,
  phone,
  complaints,
  onChange,
}: {
  name: string;
  email: string;
  phone: string;
  complaints: string;
  onChange: (k: keyof FormState, v: unknown) => void;
}) {
  return (
    <>
      <StepCard title="レポートをお届けするご連絡先を教えてください">
        <TextField label="お名前" required value={name} onChange={(v) => onChange("name", v)} placeholder="山田 太郎" />
        <TextField label="メールアドレス" required type="email" value={email} onChange={(v) => onChange("email", v)} placeholder="owner@example.com" hint="レポートURLの送付先" />
        <TextField label="電話番号" required value={phone} onChange={(v) => onChange("phone", v)} placeholder="090-1234-5678" type="tel" />
      </StepCard>

      <StepCard title="現状の課題" subtitle="任意・レポートの精度が上がります">
        <div>
          <label className="block text-[13px] font-medium mb-1.5" style={{ color: "var(--jv-t1)" }}>
            現代行や運営面でのご不満・ご要望
          </label>
          <textarea
            value={complaints}
            onChange={(e) => onChange("complaints", e.target.value)}
            rows={4}
            placeholder="例：稼働率が伸び悩んでいる / 手数料が高い / 対応が遅い など"
            className="w-full px-4 py-3 rounded-lg text-[15px] outline-none resize-y"
            style={{ background: "#FFFFFF", border: "1px solid #DADCE0", color: "var(--jv-t1)" }}
          />
        </div>
      </StepCard>
    </>
  );
}

// ── Reusable UI ──

function StepCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "#FFFFFF", border: "1px solid #DADCE0", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}
    >
      <div className="mb-4">
        <h2 className="text-[16px] font-semibold leading-tight" style={{ color: "var(--jv-t1)" }}>{title}</h2>
        {subtitle && <p className="text-[12px] mt-0.5" style={{ color: "var(--jv-t3)" }}>{subtitle}</p>}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function TextField({
  label, required, hint, type = "text", value, onChange, placeholder,
}: {
  label: string; required?: boolean; hint?: string;
  type?: "text" | "email" | "tel" | "url"; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="flex items-baseline gap-2 mb-1.5">
        <span className="text-[13px] font-medium" style={{ color: "var(--jv-t1)" }}>{label}</span>
        {required && (
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "#FDEEEF", color: "var(--jv-red)" }}>必須</span>
        )}
        {hint && !required && <span className="text-[11px]" style={{ color: "var(--jv-t3)" }}>{hint}</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg text-[15px] outline-none"
        style={{ background: "#FFFFFF", border: "1px solid #DADCE0", color: "var(--jv-t1)" }}
      />
    </div>
  );
}

function MoneySlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[13px] font-medium" style={{ color: "var(--jv-t1)" }}>{label}</span>
        <span className="text-[18px] font-bold" style={{ color: "var(--jv-accent-strong)" }}>{formatMan(value)}</span>
      </div>
      <input
        type="range"
        min={0}
        max={MAX_REVENUE_MAN}
        step={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: "var(--jv-accent-strong)" }}
      />
      <div className="flex justify-between text-[10px] mt-1" style={{ color: "var(--jv-t3)" }}>
        <span>0</span>
        <span>100</span>
        <span>200</span>
        <span>300万+</span>
      </div>
    </div>
  );
}

function PropertiesSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[13px] font-medium" style={{ color: "var(--jv-t1)" }}>全ての管理物件数</span>
        <span className="text-[18px] font-bold" style={{ color: "var(--jv-accent-strong)" }}>{formatProperties(value)}</span>
      </div>
      <input
        type="range"
        min={1}
        max={30}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: "var(--jv-accent-strong)" }}
      />
      <div className="flex justify-between text-[10px] mt-1" style={{ color: "var(--jv-t3)" }}>
        <span>1</span>
        <span>10</span>
        <span>20</span>
        <span>30+</span>
      </div>
    </div>
  );
}

function ChoiceGrid({
  label, required, value, onChange, options, columns,
}: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; columns: 2 | 3 | 4;
}) {
  const colClass = columns === 2 ? "grid-cols-2" : columns === 3 ? "grid-cols-3" : "grid-cols-4";
  return (
    <div>
      <label className="flex items-baseline gap-2 mb-1.5">
        <span className="text-[13px] font-medium" style={{ color: "var(--jv-t1)" }}>{label}</span>
        {required && (
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "#FDEEEF", color: "var(--jv-red)" }}>必須</span>
        )}
      </label>
      <div className={`grid gap-2 ${colClass}`}>
        {options.map((o) => {
          const selected = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className="rounded-lg py-3 text-[14px] font-medium transition-all active:scale-[0.97]"
              style={{
                background: selected ? "var(--jv-accent-strong)" : "#FFFFFF",
                color: selected ? "#fff" : "var(--jv-t1)",
                border: selected ? "2px solid var(--jv-accent-strong)" : "1px solid #DADCE0",
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Done Screen ──

function ThemeOverride({ theme }: { theme: Theme }) {
  if (theme !== "dark") return null;
  return (
    <style jsx global>{`
      [data-jv-theme="dark"] {
        --jv-bg: #0B0D0E !important;
        --jv-card: #141618 !important;
        --jv-border: #2A2D30 !important;
        --jv-t1: #F4F5F7 !important;
        --jv-t2: #B8BABE !important;
        --jv-t3: #7A7C80 !important;
        --jv-accent-dim: rgba(47, 191, 165, 0.18) !important;
        --jv-accent-soft: rgba(47, 191, 165, 0.35) !important;
      }
      [data-jv-theme="dark"] .rounded-2xl {
        background: #141618 !important;
        border-color: #2A2D30 !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.3) !important;
      }
      [data-jv-theme="dark"] .rounded-2xl[style*="#FFF7E6"],
      [data-jv-theme="dark"] .rounded-2xl[style*="rgb(255, 247, 230)"] {
        background: rgba(184, 135, 70, 0.10) !important;
        border-color: rgba(184, 135, 70, 0.35) !important;
      }
      [data-jv-theme="dark"] .rounded-lg[style*="#F1F3F4"],
      [data-jv-theme="dark"] .rounded-lg[style*="rgb(241, 243, 244)"] {
        background: #1C1F22 !important;
      }
      [data-jv-theme="dark"] input[type="text"],
      [data-jv-theme="dark"] input[type="email"],
      [data-jv-theme="dark"] input[type="tel"],
      [data-jv-theme="dark"] input[type="url"],
      [data-jv-theme="dark"] input[type="search"],
      [data-jv-theme="dark"] input[type="number"],
      [data-jv-theme="dark"] textarea,
      [data-jv-theme="dark"] select {
        background: #1C1F22 !important;
        border-color: #2E3135 !important;
        color: #F4F5F7 !important;
      }
      [data-jv-theme="dark"] input::placeholder,
      [data-jv-theme="dark"] textarea::placeholder {
        color: #7A7C80 !important;
      }
      [data-jv-theme="dark"] button[type="button"][style*="background: #FFFFFF"],
      [data-jv-theme="dark"] button[type="button"][style*="background:#FFFFFF"] {
        background: #1C1F22 !important;
        color: #F4F5F7 !important;
        border-color: #2E3135 !important;
      }
    `}</style>
  );
}

function DoneScreen({
  isEmbed,
  theme,
  deadline,
  annualLoss,
}: {
  isEmbed: boolean;
  theme: Theme;
  deadline: Date | null;
  annualLoss: number | null;
}) {
  const deadlineLabel = deadline ? formatDeadline(deadline) : null;
  const countdown = useCountdown(deadline ?? new Date(Date.now() + 24 * 60 * 60 * 1000));
  return (
    <div
      className={isEmbed ? "" : "min-h-screen"}
      data-jv-theme={theme}
      style={{ background: isEmbed ? "transparent" : theme === "dark" ? "#0B0D0E" : "var(--jv-bg)" }}
    >
      <ThemeOverride theme={theme} />
      <div className="max-w-xl mx-auto px-5 pb-20" style={{ paddingTop: isEmbed ? 24 : 64 }}>
        {!isEmbed && (
          <img
            src="/assets/brand/sekai-stay-logo.png"
            alt="SEKAI STAY"
            style={{ height: 28, width: "auto", display: "block", marginBottom: 40 }}
          />
        )}

        <div
          className="rounded-2xl p-8 mb-5"
          style={{ background: "#FFFFFF", border: "1px solid #DADCE0", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
            style={{ background: "var(--jv-accent-dim)" }}
          >
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="var(--jv-accent-strong)" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-[22px] font-semibold mb-3" style={{ color: "var(--jv-t1)" }}>
            診断結果と詳細レポートを送ります
          </h1>
          <p className="text-[15px] leading-relaxed mb-5" style={{ color: "var(--jv-t2)" }}>
            <strong style={{ color: "var(--jv-t1)" }}>24時間後</strong>に、物件専用の分析レポート（専用URL）をご入力のメールアドレスへお送りします。
          </p>
          {deadlineLabel && (
            <div
              className="rounded-lg p-4 mb-2"
              style={{ background: "var(--jv-accent-dim)", border: "1px solid var(--jv-accent-soft)" }}
            >
              <p className="text-[12px] mb-1" style={{ color: "var(--jv-accent-strong)", fontWeight: 600 }}>送信予定</p>
              <p className="text-[18px] font-bold mb-1" style={{ color: "var(--jv-t1)" }}>
                {deadlineLabel.label} ごろ
              </p>
              {!countdown.expired && (
                <p className="text-[13px] font-mono tabular-nums" style={{ color: "var(--jv-accent-strong)" }}>
                  残り {String(countdown.h).padStart(2, "0")}:{String(countdown.m).padStart(2, "0")}:{String(countdown.s).padStart(2, "0")}
                </p>
              )}
            </div>
          )}
        </div>

        {annualLoss && annualLoss > 0 && (
          <div
            className="rounded-2xl p-6 mb-5"
            style={{ background: "#FFF7E6", border: "1px solid #F0D8A8" }}
          >
            <p className="text-[12px] font-semibold mb-2" style={{ color: "#B88746", letterSpacing: "0.04em" }}>
              あなたが今、失っている可能性のあるコスト
            </p>
            <p className="text-[13px] leading-relaxed mb-3" style={{ color: "var(--jv-t2)" }}>
              現在の代行手数料で年間
            </p>
            <p className="text-[32px] font-bold leading-none mb-4" style={{ color: "#B88746" }}>
              {formatYen(annualLoss)}
            </p>
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              <ReportPreviewThumb src="/report-preview/preview-1.png" alt="診断スコア" />
              <ReportPreviewThumb src="/report-preview/preview-2.png" alt="改善ロードマップ" />
              <ReportPreviewThumb src="/report-preview/preview-3.png" alt="収益シミュレーション" />
            </div>
            <p className="text-[12px] leading-relaxed" style={{ color: "var(--jv-t3)" }}>
              SEKAI STAY 8% への切替で削減できる見込み額（申請内容から概算）。上のプレビューは届くレポートのイメージです。
            </p>
          </div>
        )}

        <div
          className="rounded-2xl p-6 mb-5"
          style={{ background: "#FFFFFF", border: "1px solid #DADCE0", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
        >
          <p className="text-[13px] font-semibold mb-2" style={{ color: "var(--jv-t1)" }}>
            レポートを待たずに、直接話を聞きたい方へ
          </p>
          <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--jv-t2)" }}>
            申請内容を踏まえて、その場で収益改善の仮プランをご提示します。
          </p>
          <a
            href={MEETING_URL}
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg py-3 text-center text-[15px] font-semibold transition-all active:scale-[0.98]"
            style={{ background: "var(--jv-accent-strong)", color: "#FFFFFF" }}
          >
            ミーティングを予約する →
          </a>
        </div>

        <div
          className="rounded-lg p-4 text-[13px] leading-relaxed"
          style={{ background: "#F1F3F4", color: "var(--jv-t2)" }}
        >
          <p className="mb-1" style={{ color: "var(--jv-t1)", fontWeight: 500 }}>お急ぎの場合</p>
          <p>contact@sekaichi.org までお問い合わせください。</p>
        </div>

        {!isEmbed && (
          <p className="text-[12px] text-center mt-8" style={{ color: "var(--jv-t3)" }}>
            © SEKAI STAY · 株式会社セカイチ
          </p>
        )}
      </div>
    </div>
  );
}

function SearchingIndicator() {
  return (
    <div
      className="flex items-center gap-2.5 mt-3 px-3 py-2.5 rounded-lg"
      style={{ background: "var(--jv-accent-dim)", border: "1px solid var(--jv-accent-soft)" }}
      role="status"
      aria-live="polite"
    >
      <span className="jv-spinner" aria-hidden="true" />
      <span className="text-[12px] font-medium" style={{ color: "var(--jv-accent-strong)" }}>
        物件を検索しています<span className="jv-dots" aria-hidden="true" />
      </span>
      <style jsx>{`
        .jv-spinner {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid var(--jv-accent-soft);
          border-top-color: var(--jv-accent-strong);
          animation: jv-spin 0.8s linear infinite;
          flex-shrink: 0;
        }
        @keyframes jv-spin {
          to { transform: rotate(360deg); }
        }
        .jv-dots::after {
          content: "";
          display: inline-block;
          width: 1ch;
          text-align: left;
          animation: jv-dots 1.2s steps(4, end) infinite;
        }
        @keyframes jv-dots {
          0%   { content: ""; }
          25%  { content: "."; }
          50%  { content: ".."; }
          75%  { content: "..."; }
          100% { content: ""; }
        }
      `}</style>
    </div>
  );
}

function ReportPreviewThumb({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="shrink-0 rounded-md overflow-hidden"
      style={{
        width: 110,
        height: 70,
        background: "#FFFFFF",
        border: "1px solid rgba(184,135,70,0.25)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
}

