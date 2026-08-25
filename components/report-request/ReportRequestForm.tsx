"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fireYahooConversion } from "@/lib/yahoo-ads";
import { resolveAttribution } from "@/lib/attribution";

type PropertySearchResult = {
  source: "airbnb" | "other";
  url: string;
  title?: string;
};

// ─────── Constants ───────

const FEE_CARDS = ["15", "20", "25"] as const;
const OTHER_FEE_OPTIONS = [
  { value: "0", label: "自己運用（0%）" },
  { value: "unknown", label: "わからない" },
  { value: "lt10", label: "10%未満" },
  { value: "10", label: "10%" },
  { value: "11-14", label: "11〜14%" },
  { value: "16-19", label: "16〜19%" },
  { value: "25plus", label: "25%以上" },
];

const YEARS_STOPS: { value: string; label: string }[] = [
  { value: "0", label: "1年未満" },
  { value: "1", label: "1〜2年" },
  { value: "3", label: "3〜5年" },
  { value: "5", label: "5年以上" },
];

const MEETING_URL = "https://timerex.net/s/sekai-stay/d61b424d";
const SEKAI_STAY_FEE = 8;
const REVENUE_MIN_MAN = 10;
const REVENUE_MAX_MAN = 300;
const PROPERTIES_MAX = 30;

// ─────── Types ───────

type FormState = {
  commissionRate: string;
  startingNew: boolean;
  airbnbUrl: string;
  noPropertyYet: boolean;
  totalProperties: number;
  peakRevenueMan: number;
  offpeakRevenueMan: number;
  yearsIdx: number; // 0..3 → YEARS_STOPS index
  name: string;
  email: string;
  phone: string;
  complaints: string;
};

const INITIAL: FormState = {
  commissionRate: "",
  startingNew: false,
  airbnbUrl: "",
  noPropertyYet: false,
  totalProperties: 1,
  peakRevenueMan: 80,
  offpeakRevenueMan: 30,
  yearsIdx: 1,
  name: "",
  email: "",
  phone: "",
  complaints: "",
};

type Step = 1 | 2 | 3;

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

export type ReportRequestFormProps = {
  lpVariant?: string;
  embed?: boolean;
};

// ─────── Helpers ───────

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
  if (man >= REVENUE_MAX_MAN) return `${REVENUE_MAX_MAN}万円以上`;
  return `約${man}万円`;
}

function formatProperties(n: number): string {
  if (n <= 1) return "上記のみ";
  if (n >= PROPERTIES_MAX) return `${PROPERTIES_MAX}棟以上`;
  return `${n}棟`;
}

function commissionPct(code: string): number | null {
  if (!code || code === "unknown") return null;
  if (code === "0") return 0;
  if (code === "lt10") return 8;
  if (code === "11-14") return 12.5;
  if (code === "16-19") return 17.5;
  if (code === "25plus") return 27.5;
  const n = parseInt(code, 10);
  if (!Number.isFinite(n)) return null;
  return n;
}

function rangeMidpointYen(man: number): number {
  const r = manToRange(man);
  const map: Record<string, number> = {
    "0-10": 50_000,
    "10-20": 150_000,
    "20-30": 250_000,
    "30-50": 400_000,
    "50-80": 650_000,
    "80-120": 1_000_000,
    "120-200": 1_600_000,
    "200-300": 2_500_000,
    "300+": 3_500_000,
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
  if (n >= 10_000) {
    const man = Math.round(n / 10_000);
    return `約${man.toLocaleString("ja-JP")}万円`;
  }
  return `約¥${n.toLocaleString("ja-JP")}`;
}

// GA4 (snake_case `event_name`) と Meta Pixel (PascalCase trackCustom 名) の両方に同じ
// ペイロードを発火する。ファネル分析: form_step_complete → 各ステップ通過率、
// form_step_back → 後戻り率、form_submit_error → 最終ステップでの送信失敗率。
function trackFunnel(eventName: string, params: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    // @ts-ignore
    window.gtag?.("event", eventName, params);
  } catch {}
  try {
    const metaName = eventName
      .split("_")
      .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
      .join("");
    // @ts-ignore
    window.fbq?.("trackCustom", metaName, params);
  } catch {}
}

function isAirbnbUrl(url: string): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return /(^|\.)airbnb\.(com|jp|co\.jp)$/.test(host) || host === "abnb.me" || host.startsWith("m.airbnb.");
  } catch {
    return false;
  }
}

function useCountdown(deadline: Date | null) {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    if (!deadline) return;
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, [deadline]);
  if (!deadline) return { h: 0, m: 0, s: 0, expired: true };
  const diff = Math.max(0, deadline.getTime() - now.getTime());
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return { h, m, s, expired: diff === 0 };
}

// ─────── Main Form ───────

export function ReportRequestForm({ lpVariant, embed = false }: ReportRequestFormProps) {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [annualLoss, setAnnualLoss] = useState<number | null>(null);
  const [attribution, setAttribution] = useState<AdAttribution>({});

  // attribution capture: 現 URL 優先 → 欠けた項目は 90 日クッキー (ss_attr) から復元
  useEffect(() => {
    if (typeof window === "undefined") return;
    setAttribution(resolveAttribution());
  }, []);

  // iframe height notify
  useEffect(() => {
    if (!embed || typeof window === "undefined") return;
    const notifyHeight = () => {
      const height = document.body.scrollHeight;
      try {
        window.parent.postMessage({ type: "japan-villas-height", height }, "*");
      } catch {}
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
  }, [embed]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const canNextFromStep1 = useMemo(
    () => form.startingNew || form.commissionRate !== "",
    [form.commissionRate, form.startingNew],
  );

  function handleStartingNew(v: boolean) {
    setForm((f) => ({
      ...f,
      startingNew: v,
      ...(v ? { commissionRate: "", noPropertyYet: true } : {}),
    }));
  }
  const canNextFromStep2 = useMemo(
    () => form.noPropertyYet || form.airbnbUrl.trim() !== "",
    [form.airbnbUrl, form.noPropertyYet],
  );
  const canSubmit = useMemo(
    () => form.name.trim() && form.email.trim() && form.phone.trim(),
    [form.name, form.email, form.phone],
  );

  const submitLabel = useMemo(() => {
    if (lpVariant === "switch-founder") return "専門家に相談する";
    if (lpVariant === "switch-portal") return "アプリのデモを予約する";
    return "無料レポート申込";
  }, [lpVariant]);

  function handleNext() {
    const fromStep = step;
    const nextStep: Step = fromStep === 1 && form.startingNew ? 3 : ((fromStep + 1) as Step);
    if (fromStep === 1) {
      trackFunnel("form_step_complete", {
        step: 1,
        next_step: nextStep,
        lp_variant: lpVariant || "direct",
        starting_new: form.startingNew,
        commission_rate: form.commissionRate || "unset",
      });
    } else if (fromStep === 2) {
      trackFunnel("form_step_complete", {
        step: 2,
        next_step: nextStep,
        lp_variant: lpVariant || "direct",
        no_property_yet: form.noPropertyYet,
        has_property_url: !form.noPropertyYet && form.airbnbUrl.trim() !== "",
        total_properties: form.totalProperties,
        operating_years: YEARS_STOPS[form.yearsIdx]?.value ?? "",
      });
    }
    setStep(nextStep);
  }

  function handleBack() {
    const fromStep = step;
    const toStep: Step =
      fromStep === 3 && form.startingNew ? 1 : ((fromStep > 1 ? fromStep - 1 : fromStep) as Step);
    trackFunnel("form_step_back", {
      from_step: fromStep,
      to_step: toStep,
      lp_variant: lpVariant || "direct",
    });
    setStep(toStep);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const markers: string[] = [];
      if (form.startingNew) markers.push("[これから民泊を始める方]");
      if (form.noPropertyYet && !form.startingNew) markers.push("[物件未掲載]");
      const complaintsOut = markers.length > 0
        ? `${markers.join(" ")}${form.complaints ? "\n" + form.complaints : ""}`
        : form.complaints;
      const yearsValue = YEARS_STOPS[form.yearsIdx]?.value ?? "";
      const skipPropertyDetails = form.startingNew;
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        airbnbUrl: form.noPropertyYet ? "" : form.airbnbUrl.trim(),
        peakRevenue: skipPropertyDetails ? "" : manToRange(form.peakRevenueMan),
        offpeakRevenue: skipPropertyDetails ? "" : manToRange(form.offpeakRevenueMan),
        commissionRate: form.commissionRate,
        operatingYears: skipPropertyDetails ? "" : yearsValue,
        complaints: complaintsOut,
        totalProperties: form.totalProperties,
        lpVariant,
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
        trackFunnel("form_submit_error", {
          lp_variant: lpVariant || "direct",
          error_type: "server_error",
          status: res.status,
          error_message: String(data?.error || "unknown").slice(0, 200),
        });
        setSubmitting(false);
        return;
      }
      setDeadline(new Date(Date.now() + 24 * 60 * 60 * 1000));
      setAnnualLoss(skipPropertyDetails ? null : estimateAnnualLoss(form.peakRevenueMan, form.offpeakRevenueMan, form.commissionRate));
      // GA4 event (fire before redirect)
      try {
        // @ts-ignore
        // GA4 標準推奨イベント名 `generate_lead` を使用。Google Ads 側で既存の
        // "SEKAI STAY (web) generate_lead" CV にそのまま紐付けるため。
        window.gtag?.("event", "generate_lead", {
          lp_variant: lpVariant || "direct",
          form_variant: "default",
          commission_rate: form.commissionRate,
        });
        // Meta Pixel Lead: サーバ側 CAPI と同じ eventID を渡して dedup を効かせる。
        // currency/value は Meta Diagnostics 「Send valid currency information」要件のため必須。
        const eventID = typeof data?.eventId === "string" ? data.eventId : undefined;
        // @ts-ignore
        window.fbq?.(
          "track",
          "Lead",
          { lp_variant: lpVariant || "direct", content_name: "report_request", currency: "JPY", value: 0 },
          eventID ? { eventID } : undefined,
        );
        // CompleteRegistration: フォーム送信成功時の高品質シグナル (KGI トラッキング用)。
        // top-level 経路 (window.parent === window) でのみ直接 fire。iframe embed 経由の場合は
        // 親 frame 側の postMessage listener が同イベントを fire するため二重計上回避。
        if (typeof window !== "undefined" && window.parent === window) {
          // @ts-ignore
          window.fbq?.("track", "CompleteRegistration", {
            lp_variant: lpVariant || "direct",
            form_id: lpVariant || "report-request",
            currency: "JPY",
            value: 0,
          });
        }
        // X (Twitter) Pixel Lead 発火。NEXT_PUBLIC_X_LEAD_EVENT_ID は X Ads Manager で
        // Lead イベントを作成すると発行される tw-XXXXX-YYYYY 形式の ID。未設定なら no-op。
        const xLeadEventId = process.env.NEXT_PUBLIC_X_LEAD_EVENT_ID;
        if (xLeadEventId && typeof window !== "undefined") {
          // @ts-ignore
          window.twq?.("event", xLeadEventId, {
            conversion_id: typeof data?.eventId === "string" ? data.eventId : undefined,
            value: null,
            currency: "JPY",
            contents: [{ content_name: "report_request", content_type: "lead" }],
          });
        }
        // Yahoo!広告 コンバージョン（送信完了時点＝完了ページ相当）
        fireYahooConversion();
      } catch {}
      // iframe parent notify
      try {
        if (typeof window !== "undefined" && window.parent !== window) {
          window.parent.postMessage(
            { type: "japan-villas-form-submitted", form_id: lpVariant || "report-request" },
            "*",
          );
        }
      } catch {}
      // MTG予約フォームへリダイレクト（fbq/gtag が beacon を送り終えるよう短いディレイ）
      await new Promise((r) => setTimeout(r, 150));
      try {
        if (embed && typeof window !== "undefined" && window.parent !== window) {
          try {
            if (window.top) {
              window.top.location.href = MEETING_URL;
            } else {
              window.location.href = MEETING_URL;
            }
          } catch {
            window.parent.postMessage({ type: "japan-villas-redirect", url: MEETING_URL }, "*");
          }
        } else {
          window.location.href = MEETING_URL;
        }
      } catch {
        window.location.href = MEETING_URL;
      }
    } catch {
      setError("送信できませんでした。少し時間をおいてもう一度お試しください。");
      trackFunnel("form_submit_error", {
        lp_variant: lpVariant || "direct",
        error_type: "network_error",
      });
      setSubmitting(false);
    }
  }

  if (done) {
    return <DoneScreen embed={embed} deadline={deadline} annualLoss={annualLoss} />;
  }

  return (
    <div className={embed ? "" : "py-8"}>
      <div className="max-w-xl mx-auto px-5">
        <ProgressBar step={step} />

        <h2 className="text-[18px] font-semibold text-ink mt-5 mb-1">
          {step === 1 && "今の運営代行の手数料を教えてください"}
          {step === 2 && "物件の情報を教えてください"}
          {step === 3 && "レポートをお届けするご連絡先を教えてください"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-5">
          {step === 1 && (
            <Step1Fee
              commissionRate={form.commissionRate}
              onChange={(v) => update("commissionRate", v)}
              startingNew={form.startingNew}
              onStartingNew={handleStartingNew}
            />
          )}
          {step === 2 && (
            <Step2Property
              airbnbUrl={form.airbnbUrl}
              noPropertyYet={form.noPropertyYet}
              totalProperties={form.totalProperties}
              peakMan={form.peakRevenueMan}
              offpeakMan={form.offpeakRevenueMan}
              yearsIdx={form.yearsIdx}
              onAirbnbUrl={(v) => update("airbnbUrl", v)}
              onNoPropertyYet={(v) => update("noPropertyYet", v)}
              onTotalProperties={(v) => update("totalProperties", v)}
              onPeakMan={(v) => update("peakRevenueMan", v)}
              onOffpeakMan={(v) => update("offpeakRevenueMan", v)}
              onYearsIdx={(v) => update("yearsIdx", v)}
            />
          )}
          {step === 3 && (
            <Step3Contact
              name={form.name}
              email={form.email}
              phone={form.phone}
              complaints={form.complaints}
              onChange={(k, v) => update(k, v as never)}
            />
          )}

          {error && (
            <div className="rounded-lg px-4 py-3 text-sm bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-2">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 rounded-lg py-3 text-[15px] font-medium bg-white text-ink border border-rule transition-all active:scale-[0.98]"
              >
                ← 戻る
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                disabled={
                  (step === 1 && !canNextFromStep1) ||
                  (step === 2 && !canNextFromStep2)
                }
                onClick={handleNext}
                className="flex-1 rounded-lg py-3 text-[15px] font-semibold text-white transition-all active:scale-[0.98] bg-sekai-teal disabled:bg-mid-gray disabled:cursor-not-allowed disabled:opacity-80"
              >
                次へ →
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting || !canSubmit}
                className="flex-1 rounded-lg py-3 text-[15px] font-semibold text-white transition-all active:scale-[0.98] bg-sekai-teal disabled:bg-mid-gray disabled:cursor-not-allowed"
                style={{ opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? "送信中..." : submitLabel}
              </button>
            )}
          </div>

          {step === 3 && (
            <p className="text-[11px] text-center leading-relaxed text-mid-gray">
              ご入力いただいた情報は暗号化して送信され、レポート作成以外の目的では使用されません。
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

// ─────── ProgressBar ───────

function ProgressBar({ step }: { step: Step }) {
  const labels = ["手数料", "物件情報", "ご連絡先"];
  return (
    <div className="flex items-center gap-1">
      {labels.map((label, i) => {
        const idx = (i + 1) as Step;
        const state = idx < step ? "done" : idx === step ? "active" : "pending";
        return (
          <div key={label} className="flex items-center flex-1">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 ${
                  state === "pending" ? "bg-rule text-mid-gray" : "bg-sekai-teal text-white"
                }`}
              >
                {state === "done" ? "✓" : idx}
              </div>
              <span
                className={`text-[12px] font-medium truncate ${
                  state === "pending" ? "text-mid-gray" : "text-ink"
                }`}
              >
                {label}
              </span>
            </div>
            {i < labels.length - 1 && <div className="w-3 h-px bg-rule" />}
          </div>
        );
      })}
    </div>
  );
}

// ─────── Step 1: Fee ───────

function Step1Fee({
  commissionRate,
  onChange,
  startingNew,
  onStartingNew,
}: {
  commissionRate: string;
  onChange: (v: string) => void;
  startingNew: boolean;
  onStartingNew: (v: boolean) => void;
}) {
  const isCardValue = (FEE_CARDS as readonly string[]).includes(commissionRate);
  const otherSelected = !isCardValue && commissionRate !== "";
  const dimmed = startingNew ? "opacity-40 pointer-events-none" : "";

  return (
    <div className="flex flex-col gap-3">
      <div className={`grid grid-cols-2 gap-2.5 transition-opacity ${dimmed}`}>
        {FEE_CARDS.map((v) => {
          const selected = commissionRate === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              disabled={startingNew}
              className={`rounded-xl py-5 text-[20px] font-bold border-2 transition-all active:scale-[0.98] ${
                selected
                  ? "bg-sekai-teal text-white border-sekai-teal shadow-sm"
                  : "bg-white text-ink border-rule hover:border-sekai-teal/40"
              }`}
            >
              {v}%
            </button>
          );
        })}
        <div
          className={`rounded-xl border-2 transition-all relative ${
            otherSelected
              ? "bg-sekai-teal border-sekai-teal shadow-sm"
              : "bg-white border-rule"
          }`}
        >
          <select
            value={otherSelected ? commissionRate : ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={startingNew}
            className={`w-full h-full px-4 py-5 text-center text-[15px] font-semibold rounded-xl appearance-none cursor-pointer bg-transparent focus:outline-none focus:ring-2 focus:ring-sekai-teal/30 ${
              otherSelected ? "text-white" : "text-ink"
            }`}
          >
            <option value="" disabled>その他 ▾</option>
            {OTHER_FEE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="text-ink">
                {o.label}
              </option>
            ))}
          </select>
          <span
            className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] ${
              otherSelected ? "text-white/70" : "text-mid-gray"
            }`}
          >
            ▾
          </span>
        </div>
      </div>
      <label className="flex items-start gap-2 mt-1 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={startingNew}
          onChange={(e) => onStartingNew(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-sekai-teal shrink-0 cursor-pointer"
        />
        <span className="text-[13px] leading-relaxed text-dark-gray">
          これから民泊を始める方
        </span>
      </label>
    </div>
  );
}

// ─────── Step 2: Property + Revenue + Years ───────

function Step2Property({
  airbnbUrl,
  noPropertyYet,
  totalProperties,
  peakMan,
  offpeakMan,
  yearsIdx,
  onAirbnbUrl,
  onNoPropertyYet,
  onTotalProperties,
  onPeakMan,
  onOffpeakMan,
  onYearsIdx,
}: {
  airbnbUrl: string;
  noPropertyYet: boolean;
  totalProperties: number;
  peakMan: number;
  offpeakMan: number;
  yearsIdx: number;
  onAirbnbUrl: (v: string) => void;
  onNoPropertyYet: (v: boolean) => void;
  onTotalProperties: (v: number) => void;
  onPeakMan: (v: number) => void;
  onOffpeakMan: (v: number) => void;
  onYearsIdx: (v: number) => void;
}) {
  const [searchResults, setSearchResults] = useState<PropertySearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const looksLikeUrl = (v: string) => /^https?:\/\//i.test(v.trim());
  const showUrlError =
    !noPropertyYet &&
    looksLikeUrl(airbnbUrl) &&
    airbnbUrl.trim() !== "" &&
    !isAirbnbUrl(airbnbUrl.trim());

  useEffect(() => {
    if (noPropertyYet) {
      abortRef.current?.abort();
      setSearchResults([]);
      setSearchOpen(false);
      setSearching(false);
      return;
    }
    const q = airbnbUrl.trim();
    if (q.length < 2 || looksLikeUrl(q)) {
      abortRef.current?.abort();
      setSearchResults([]);
      setSearchOpen(false);
      setSearching(false);
      return;
    }
    const ac = new AbortController();
    abortRef.current?.abort();
    abortRef.current = ac;
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/property-search?q=${encodeURIComponent(q)}`, { signal: ac.signal });
        const data = await res.json();
        if (ac.signal.aborted) return;
        setSearchResults(Array.isArray(data?.results) ? data.results : []);
        setSearchOpen(true);
      } catch {
        if (!ac.signal.aborted) setSearchResults([]);
      } finally {
        if (!ac.signal.aborted) setSearching(false);
      }
    }, 400);
    return () => {
      clearTimeout(t);
      ac.abort();
      setSearching(false);
    };
  }, [airbnbUrl, noPropertyYet]);

  function pickResult(r: PropertySearchResult) {
    onAirbnbUrl(r.url);
    setSearchOpen(false);
    setSearchResults([]);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Operating years */}
      <div>
        <label className="block text-[14px] font-semibold mb-1 text-ink">運用年数</label>
        <div className="text-[20px] font-bold text-sekai-teal mb-2">{YEARS_STOPS[yearsIdx]?.label ?? ""}</div>
        <input
          type="range"
          min={0}
          max={YEARS_STOPS.length - 1}
          step={1}
          value={yearsIdx}
          onChange={(e) => onYearsIdx(parseInt(e.target.value, 10))}
          className="w-full accent-sekai-teal"
        />
        <div className="flex justify-between text-[10px] text-mid-gray mt-1">
          {YEARS_STOPS.map((s) => (
            <span key={s.value}>{s.label}</span>
          ))}
        </div>
      </div>

      {/* Peak revenue */}
      <div>
        <label className="block text-[14px] font-semibold mb-1 text-ink">ピーク月の売上（1物件あたり）</label>
        <div className="text-[24px] font-bold text-sekai-teal mb-2">{formatMan(peakMan)}</div>
        <input
          type="range"
          min={REVENUE_MIN_MAN}
          max={REVENUE_MAX_MAN}
          step={10}
          value={peakMan}
          onChange={(e) => onPeakMan(parseInt(e.target.value, 10))}
          className="w-full accent-sekai-teal"
        />
        <div className="flex justify-between text-[11px] text-mid-gray mt-1">
          <span>10万円</span>
          <span>300万円以上</span>
        </div>
      </div>

      {/* Off-peak revenue */}
      <div>
        <label className="block text-[14px] font-semibold mb-1 text-ink">オフピーク月の売上（1物件あたり）</label>
        <div className="text-[24px] font-bold text-sekai-teal mb-2">{formatMan(offpeakMan)}</div>
        <input
          type="range"
          min={REVENUE_MIN_MAN}
          max={REVENUE_MAX_MAN}
          step={10}
          value={offpeakMan}
          onChange={(e) => onOffpeakMan(parseInt(e.target.value, 10))}
          className="w-full accent-sekai-teal"
        />
        <div className="flex justify-between text-[11px] text-mid-gray mt-1">
          <span>10万円</span>
          <span>300万円以上</span>
        </div>
      </div>

      {/* Property name search */}
      <div className="relative">
        <label className="block text-[14px] font-semibold mb-2 text-ink">
          物件名をAirBnBで検索 <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={airbnbUrl}
          onChange={(e) => onAirbnbUrl(e.target.value)}
          onFocus={() => { if (searchResults.length > 0) setSearchOpen(true); }}
          onBlur={() => { setTimeout(() => setSearchOpen(false), 150); }}
          placeholder="2文字以上でAirBnB検索を開始"
          disabled={noPropertyYet}
          className={`w-full px-4 py-3 rounded-lg border bg-white text-[15px] placeholder:text-mid-gray focus:outline-none focus:ring-2 focus:ring-sekai-teal/20 disabled:bg-light-gray disabled:cursor-not-allowed disabled:opacity-60 ${
            showUrlError ? "border-red-300" : "border-rule"
          }`}
        />
        {searching && !noPropertyYet && (
          <p className="text-[12px] text-mid-gray mt-1.5">物件を検索しています…</p>
        )}
        {searchOpen && !noPropertyYet && searchResults.length > 0 && (
          <ul className="absolute z-20 left-0 right-0 mt-1 max-h-72 overflow-y-auto rounded-lg border border-rule bg-white shadow-lg">
            {searchResults.slice(0, 6).map((r) => (
              <li key={r.url}>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); pickResult(r); }}
                  className="w-full text-left px-3 py-2 text-[14px] hover:bg-light-gray flex items-center gap-2"
                >
                  <span className="inline-block px-1.5 py-0.5 text-[10px] rounded font-bold bg-rose-50 text-rose-600 shrink-0">
                    Airbnb
                  </span>
                  <span className="truncate">{r.title || r.url}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {showUrlError && (
          <p className="text-[12px] text-red-600 mt-1.5">Airbnb の URL を入力してください</p>
        )}
        <label className="flex items-start gap-2 mt-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={noPropertyYet}
            onChange={(e) => onNoPropertyYet(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-sekai-teal shrink-0 cursor-pointer"
          />
          <span className="text-[13px] leading-relaxed text-dark-gray">
            まだ物件をAirBnBに掲載していない・アクティブなリスティングが無い
          </span>
        </label>
        {noPropertyYet && (
          <p className="text-[12px] text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mt-2 leading-relaxed">
            ※ 新規立ち上げ物件の初期費用は別途お見積もりとなります（サイト記載の初期費用無料は運用中の物件が対象です）
          </p>
        )}
      </div>

      {/* Total properties */}
      <div>
        <label className="block text-[14px] font-semibold mb-1 text-ink">他にも物件を管理されてますか？</label>
        <div className="text-[20px] font-bold text-sekai-teal mb-2">{formatProperties(totalProperties)}</div>
        <input
          type="range"
          min={1}
          max={PROPERTIES_MAX}
          step={1}
          value={totalProperties}
          onChange={(e) => onTotalProperties(parseInt(e.target.value, 10))}
          className="w-full accent-sekai-teal"
        />
        <div className="flex justify-between text-[11px] text-mid-gray mt-1">
          <span>1棟</span>
          <span>30棟以上</span>
        </div>
      </div>
    </div>
  );
}

// ─────── Step 3: Contact ───────

function Step3Contact({
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
  onChange: (k: "name" | "email" | "phone" | "complaints", v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-[14px] font-semibold mb-1.5 text-ink">
          お名前 <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onChange("name", e.target.value)}
          autoComplete="name"
          maxLength={100}
          className="w-full px-4 py-3 rounded-lg border border-rule bg-white text-[15px] focus:outline-none focus:ring-2 focus:ring-sekai-teal/20"
        />
      </div>
      <div>
        <label className="block text-[14px] font-semibold mb-1.5 text-ink">
          メールアドレス <span className="text-red-600">*</span>
        </label>
        <input
          type="email"
          inputMode="email"
          value={email}
          onChange={(e) => onChange("email", e.target.value)}
          autoComplete="email"
          maxLength={200}
          className="w-full px-4 py-3 rounded-lg border border-rule bg-white text-[15px] focus:outline-none focus:ring-2 focus:ring-sekai-teal/20"
        />
      </div>
      <div>
        <label className="block text-[14px] font-semibold mb-1.5 text-ink">
          電話番号 <span className="text-red-600">*</span>
        </label>
        <input
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => onChange("phone", e.target.value)}
          autoComplete="tel"
          maxLength={50}
          className="w-full px-4 py-3 rounded-lg border border-rule bg-white text-[15px] focus:outline-none focus:ring-2 focus:ring-sekai-teal/20"
        />
      </div>
      <div>
        <label className="block text-[14px] font-semibold mb-1.5 text-ink">
          現状の課題（任意）
        </label>
        <textarea
          value={complaints}
          onChange={(e) => onChange("complaints", e.target.value)}
          rows={4}
          maxLength={2000}
          placeholder="現代行や運営面でのご不満・ご要望があればお書きください"
          className="w-full px-4 py-3 rounded-lg border border-rule bg-white text-[14px] placeholder:text-mid-gray focus:outline-none focus:ring-2 focus:ring-sekai-teal/20"
        />
      </div>
    </div>
  );
}

// ─────── Done Screen ───────

function DoneScreen({
  embed,
  deadline,
  annualLoss,
}: {
  embed: boolean;
  deadline: Date | null;
  annualLoss: number | null;
}) {
  const countdown = useCountdown(deadline);
  const deadlineLabel = deadline
    ? deadline.toLocaleString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className={embed ? "" : "py-12 min-h-screen bg-white"}>
      <div className="max-w-xl mx-auto px-5">
        <div className="rounded-2xl p-8 mb-5 bg-white border border-rule shadow-sm">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5 bg-teal-tint">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#167B81" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-[22px] font-semibold mb-3 text-ink">
            診断結果と詳細レポートを送ります
          </h1>
          <p className="text-[15px] leading-relaxed mb-5 text-dark-gray">
            <strong className="text-ink">24時間後</strong>に、物件専用の分析レポート（専用URL）をご入力のメールアドレスへお送りします。
          </p>
          {deadlineLabel && (
            <div className="rounded-lg p-4 mb-2 bg-teal-tint border border-bright-teal/30">
              <p className="text-[12px] mb-1 text-sekai-teal font-semibold">送信予定</p>
              <p className="text-[18px] font-bold mb-1 text-ink">{deadlineLabel} ごろ</p>
              {!countdown.expired && (
                <p className="text-[13px] font-mono tabular-nums text-sekai-teal">
                  残り {String(countdown.h).padStart(2, "0")}:{String(countdown.m).padStart(2, "0")}:
                  {String(countdown.s).padStart(2, "0")}
                </p>
              )}
            </div>
          )}
        </div>

        {annualLoss && annualLoss > 0 && (
          <div className="rounded-2xl p-6 mb-5 bg-white border border-rule">
            <p className="text-[12px] font-semibold mb-2 text-sekai-teal tracking-wider">
              あなたが今、失っている可能性のあるコスト
            </p>
            <p className="text-[13px] leading-relaxed mb-3 text-dark-gray">現在の代行手数料で年間</p>
            <p className="text-[32px] font-bold leading-none mb-3 text-deep-teal">{formatYen(annualLoss)}</p>
            <p className="text-[12px] leading-relaxed text-mid-gray">
              SEKAI STAY 8% への切替で削減できる見込み額（申請内容から概算）。
            </p>
          </div>
        )}

        <div className="rounded-2xl p-6 mb-5 bg-white border border-rule shadow-sm">
          <p className="text-[13px] font-semibold mb-2 text-ink">
            レポートを待たずに、直接話を聞きたい方へ
          </p>
          <p className="text-[13px] leading-relaxed mb-4 text-dark-gray">
            申請内容を踏まえて、その場で収益改善の仮プランをご提示します。
          </p>
          <a
            href={MEETING_URL}
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg py-3 text-center text-[15px] font-semibold text-white bg-sekai-teal transition-all active:scale-[0.98]"
          >
            ミーティングを予約する →
          </a>
        </div>

        <div className="rounded-lg p-4 text-[13px] leading-relaxed bg-white border border-rule text-dark-gray">
          <p className="mb-1 text-ink font-medium">お急ぎの場合</p>
          <p>contact@sekaichi.org（担当：小川）までお問い合わせください。</p>
        </div>
      </div>
    </div>
  );
}
