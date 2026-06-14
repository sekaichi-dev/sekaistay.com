"use client";

/* /audit 専用フォーム (2026-05-14)
 *
 * 機能: LP (/switch/*) の ReportRequestForm と完全同一
 *   - Step 1: 手数料 (card grid + これから始める方 checkbox)
 *   - Step 2: 試算 (LP /switch の SwitchSimulator と同等の 4 スライダー + 損失/節約表示)
 *   - Step 3: ご連絡先 (氏名・メール・電話・課題)
 *   - 同じ /api/report-requests/submit に POST (lpVariant="audit")
 *   - 同じ Meta Pixel/CAPI dedup・GA4 events・timerex redirect
 *
 * デザイン: HP editorial スタイル (ivory/paper/ink パレット)
 *   - chapter-marker + eyebrow ヘッダー
 *   - numbered Field component (01. 02. 03.)
 *   - bg-mist border-rule inputs
 *   - btn-primary 角ボタン (ink filled)
 *   - 3-col 「Step 01 · Label」 progress ledger
 *
 * 注意: ロジック (state/handlers) は ReportRequestForm.tsx と意図的に重複。
 * 共通化するなら lib/report-request-form-helpers.ts に extract する選択肢あり。
 * 今は LP 側の改善が editorial 側に意図せず波及しないよう敢えて独立を選択。
 */

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

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

const MEETING_URL = "https://timerex.net/s/sekai-stay/d61b424d";

// 試算ロジック定数 (SwitchSimulator と同値)
const SEKAI_FEE_PCT = 8;
const SEKAI_FIXED_ANNUAL_MAN = 12; // ¥10,000/月 × 12 = 12万円/年

// ─────── Types ───────

type FormState = {
  commissionRate: string;
  startingNew: boolean;
  feePct: number;
  monthlyRev: number; // 万円
  pastYears: number;
  futureYears: number;
  name: string;
  email: string;
  phone: string;
  complaints: string;
};

const INITIAL: FormState = {
  commissionRate: "",
  startingNew: false,
  feePct: 20,
  monthlyRev: 60,
  pastYears: 3,
  futureYears: 5,
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

function commissionToFeePct(cr: string): number {
  if (/^\d+$/.test(cr)) return parseInt(cr, 10);
  switch (cr) {
    case "0":
      return SEKAI_FEE_PCT;
    case "lt10":
      return 9;
    case "11-14":
      return 12;
    case "16-19":
      return 17;
    case "25plus":
      return 30;
    default:
      return 20; // unknown / empty
  }
}

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

// ─────── Main Form ───────

const LP_VARIANT = "audit";

export function AuditReportRequestForm() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [attribution, setAttribution] = useState<AdAttribution>({});

  // attribution capture
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const get = (k: string) => params.get(k)?.slice(0, 200) || undefined;
    setAttribution({
      utmSource: get("utm_source"),
      utmMedium: get("utm_medium"),
      utmCampaign: get("utm_campaign"),
      utmContent: get("utm_content"),
      utmTerm: get("utm_term"),
      gclid: get("gclid"),
      fbclid: get("fbclid"),
      landingUrl: params.get("landing_url")?.slice(0, 1000) || window.location.href.slice(0, 1000),
      referrer: document.referrer ? document.referrer.slice(0, 1000) : undefined,
    });
  }, []);

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
      ...(v ? { commissionRate: "" } : {}),
    }));
  }
  // Step 2 はスライダ駆動なので常に valid
  const canNextFromStep2 = true;
  const canSubmit = useMemo(
    () => form.name.trim() && form.email.trim() && form.phone.trim(),
    [form.name, form.email, form.phone],
  );

  function handleNext() {
    const fromStep = step;
    const nextStep: Step = fromStep === 1 && form.startingNew ? 3 : ((fromStep + 1) as Step);
    if (fromStep === 1) {
      // Step 1 → Step 2 への遷移時に feePct を commissionRate から初期化
      if (nextStep === 2 && form.commissionRate) {
        const inferred = commissionToFeePct(form.commissionRate);
        setForm((f) => ({ ...f, feePct: inferred }));
      }
      trackFunnel("form_step_complete", {
        step: 1,
        next_step: nextStep,
        lp_variant: LP_VARIANT,
        starting_new: form.startingNew,
        commission_rate: form.commissionRate || "unset",
      });
    } else if (fromStep === 2) {
      trackFunnel("form_step_complete", {
        step: 2,
        next_step: nextStep,
        lp_variant: LP_VARIANT,
        fee_pct: form.feePct,
        monthly_revenue_man: form.monthlyRev,
        past_years: form.pastYears,
        future_years: form.futureYears,
      });
    }
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    const fromStep = step;
    const toStep: Step =
      fromStep === 3 && form.startingNew ? 1 : ((fromStep > 1 ? fromStep - 1 : fromStep) as Step);
    trackFunnel("form_step_back", {
      from_step: fromStep,
      to_step: toStep,
      lp_variant: LP_VARIANT,
    });
    setStep(toStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const skipEstimate = form.startingNew;
      // 試算結果（推定年間損失）を complaints に埋め込んで CRM 側で参照可能にする
      const estimateMarker = skipEstimate
        ? "[これから民泊を始める方]"
        : `[試算] 月売上${form.monthlyRev}万円・現手数料${form.feePct}%・運用${form.pastYears}年・予定${form.futureYears}年`;
      const complaintsOut = `${estimateMarker}${form.complaints ? "\n" + form.complaints : ""}`;

      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        airbnbUrl: "",
        peakRevenue: skipEstimate ? "" : manToRange(form.monthlyRev),
        offpeakRevenue: skipEstimate ? "" : manToRange(form.monthlyRev),
        commissionRate: form.commissionRate,
        operatingYears: skipEstimate ? "" : String(form.pastYears),
        complaints: complaintsOut,
        totalProperties: 1,
        lpVariant: LP_VARIANT,
        // 新フィールド (API schema 未対応・将来拡張用)
        feePct: skipEstimate ? undefined : form.feePct,
        monthlyRevenueMan: skipEstimate ? undefined : form.monthlyRev,
        pastYears: skipEstimate ? undefined : form.pastYears,
        futureYears: skipEstimate ? undefined : form.futureYears,
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
          lp_variant: LP_VARIANT,
          error_type: "server_error",
          status: res.status,
          error_message: String(data?.error || "unknown").slice(0, 200),
        });
        setSubmitting(false);
        return;
      }
      try {
        // @ts-ignore
        window.gtag?.("event", "generate_lead", {
          lp_variant: LP_VARIANT,
          form_variant: "default",
          commission_rate: form.commissionRate,
        });
        const eventID = typeof data?.eventId === "string" ? data.eventId : undefined;
        // @ts-ignore
        window.fbq?.(
          "track",
          "Lead",
          { lp_variant: LP_VARIANT, content_name: "report_request", currency: "JPY", value: 0 },
          eventID ? { eventID } : undefined,
        );
        if (typeof window !== "undefined" && window.parent === window) {
          // @ts-ignore
          window.fbq?.("track", "CompleteRegistration", {
            lp_variant: LP_VARIANT,
            form_id: LP_VARIANT,
            currency: "JPY",
            value: 0,
          });
        }
      } catch {}
      await new Promise((r) => setTimeout(r, 150));
      try {
        window.location.href = MEETING_URL;
      } catch {
        window.location.href = MEETING_URL;
      }
    } catch {
      setError("送信できませんでした。少し時間をおいてもう一度お試しください。");
      trackFunnel("form_submit_error", {
        lp_variant: LP_VARIANT,
        error_type: "network_error",
      });
      setSubmitting(false);
    }
  }

  return (
    <div>
      {/* Progress Ledger — editorial 3-column */}
      <ProgressLedger step={step} />

      {/* Chapter Header per step */}
      <div className="chapter-marker mt-10">
        <span className="rule-teal-sm" />
        <p className="eyebrow text-sekai-teal">
          {step === 1 && "Step 01 · 手数料"}
          {step === 2 && "Step 02 · 試算"}
          {step === 3 && "Step 03 · ご連絡先"}
        </p>
      </div>
      <h2 className="font-sans font-bold text-[24px] md:text-[28px] text-ink leading-snug mb-8 jp-keep">
        {step === 1 && "今の運営代行の手数料を教えてください"}
        {step === 2 && "あなたの物件、SEKAI STAYでどう変わる？"}
        {step === 3 && "レポートをお届けする連絡先を教えてください"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-10">
        {step === 1 && (
          <Step1Fee
            commissionRate={form.commissionRate}
            onChange={(v) => update("commissionRate", v)}
            startingNew={form.startingNew}
            onStartingNew={handleStartingNew}
          />
        )}
        {step === 2 && (
          <Step2Estimate
            feePct={form.feePct}
            monthlyRev={form.monthlyRev}
            pastYears={form.pastYears}
            futureYears={form.futureYears}
            onFeePct={(v) => update("feePct", v)}
            onMonthlyRev={(v) => update("monthlyRev", v)}
            onPastYears={(v) => update("pastYears", v)}
            onFutureYears={(v) => update("futureYears", v)}
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
          <div className="bg-paper border border-red-300 text-red-700 px-5 py-4 text-[14px] font-sans">
            {error}
          </div>
        )}

        {/* Navigation — editorial buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-rule">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="btn btn-ghost flex-1 justify-center text-[14px]"
            >
              ← 戻る
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              disabled={(step === 1 && !canNextFromStep1) || (step === 2 && !canNextFromStep2)}
              onClick={handleNext}
              className="btn btn-primary flex-1 justify-center text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              次へ →
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting || !canSubmit}
              className="btn btn-primary flex-1 justify-center text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "送信中..." : "無料レポート申込 →"}
            </button>
          )}
        </div>

        {step === 3 && (
          <p className="text-[12px] text-center leading-relaxed text-mid-gray font-sans">
            ご入力いただいた情報は暗号化して送信され、レポート作成以外の目的では使用されません。
          </p>
        )}
      </form>
    </div>
  );
}

// ─────── ProgressLedger ───────

function ProgressLedger({ step }: { step: Step }) {
  const items = [
    { n: 1, label: "Fee" },
    { n: 2, label: "Estimate" },
    { n: 3, label: "Contact" },
  ];
  return (
    <div className="bg-rule grid grid-cols-3 gap-px border border-rule rounded-switch-lg overflow-hidden">
      {items.map((s) => {
        const active = s.n <= step;
        return (
          <div key={s.n} className={`p-4 ${active ? "bg-ink text-ivory" : "bg-paper text-mid-gray"}`}>
            <p className={`eyebrow-mono mb-1 ${active ? "text-bright-teal" : "text-mid-gray"}`}>
              Step {String(s.n).padStart(2, "0")}
            </p>
            <p className={`font-sans text-[13px] ${active ? "text-ivory" : "text-mid-gray"}`}>{s.label}</p>
          </div>
        );
      })}
    </div>
  );
}

// ─────── Field (editorial numbered label) ───────

function Field({
  number,
  label,
  required,
  children,
  hint,
}: {
  number: string;
  label: string;
  required?: boolean;
  children: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-3 mb-3">
        <span className="font-sans font-light text-[22px] text-sekai-teal leading-none tabular-nums">{number}</span>
        <label className="font-sans font-medium text-[14px] md:text-[15px] text-ink">
          {label}
          {required && <span className="text-sekai-teal ml-1 font-sans">*</span>}
        </label>
      </div>
      {children}
      {hint && <p className="text-[12px] text-mid-gray mt-2 font-sans leading-relaxed">{hint}</p>}
    </div>
  );
}

const editorialInput =
  "w-full bg-mist border border-rule px-5 py-4 text-[15px] font-sans text-ink placeholder:text-mid-gray/70 outline-none transition focus:border-sekai-teal focus:bg-paper";

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
    <Field number="01" label="現在の運営代行手数料" required>
      <div className={`grid grid-cols-2 gap-3 transition-opacity ${dimmed}`}>
        {FEE_CARDS.map((v) => {
          const selected = commissionRate === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              disabled={startingNew}
              className={`py-6 text-[22px] font-bold border transition-all active:scale-[0.98] font-sans ${
                selected
                  ? "bg-ink text-ivory border-ink"
                  : "bg-paper text-ink border-rule hover:border-sekai-teal/60"
              }`}
            >
              {v}%
            </button>
          );
        })}
        <div
          className={`border transition-all relative ${
            otherSelected ? "bg-ink border-ink" : "bg-paper border-rule"
          }`}
        >
          <select
            value={otherSelected ? commissionRate : ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={startingNew}
            className={`w-full h-full px-4 py-6 text-center text-[15px] font-semibold appearance-none cursor-pointer bg-transparent focus:outline-none focus:ring-2 focus:ring-sekai-teal/30 font-sans ${
              otherSelected ? "text-ivory" : "text-ink"
            }`}
          >
            <option value="" disabled>
              その他 ▾
            </option>
            {OTHER_FEE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="text-ink">
                {o.label}
              </option>
            ))}
          </select>
          <span
            className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[11px] ${
              otherSelected ? "text-ivory/70" : "text-mid-gray"
            }`}
          >
            ▾
          </span>
        </div>
      </div>
      <label className="flex items-start gap-2 mt-4 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={startingNew}
          onChange={(e) => onStartingNew(e.target.checked)}
          className="mt-1 w-4 h-4 accent-sekai-teal shrink-0 cursor-pointer"
        />
        <span className="text-[13px] leading-relaxed text-dark-gray font-sans">これから民泊を始める方</span>
      </label>
    </Field>
  );
}

// ─────── Step 2: Estimate (LP SwitchSimulator equivalent in editorial design) ───────

function Step2Estimate({
  feePct,
  monthlyRev,
  pastYears,
  futureYears,
  onFeePct,
  onMonthlyRev,
  onPastYears,
  onFutureYears,
}: {
  feePct: number;
  monthlyRev: number;
  pastYears: number;
  futureYears: number;
  onFeePct: (v: number) => void;
  onMonthlyRev: (v: number) => void;
  onPastYears: (v: number) => void;
  onFutureYears: (v: number) => void;
}) {
  const [touched, setTouched] = useState(false);
  const markTouched = () => {
    if (!touched) setTouched(true);
  };

  const result = useMemo(() => {
    const diff = Math.max(0, feePct - SEKAI_FEE_PCT) / 100;
    const annualRevMan = monthlyRev * 12;
    const annualWasteMan = annualRevMan * diff;
    const annualNetDiffMan = Math.max(0, annualWasteMan - SEKAI_FIXED_ANNUAL_MAN);
    const annualSaving = Math.round(annualNetDiffMan);
    const pastLoss = annualSaving * pastYears;
    const futureLoss = annualSaving * futureYears;
    const totalLoss = pastLoss + futureLoss;
    const futureSaving = annualSaving * futureYears;
    return { pastLoss, futureLoss, totalLoss, annualSaving, futureSaving };
  }, [feePct, monthlyRev, pastYears, futureYears]);

  return (
    <div className="space-y-10">
      <Field number="02" label="今の代行会社の手数料率">
        <div className="text-[26px] font-bold text-sekai-teal mb-3 font-sans tabular-nums">{feePct}%</div>
        <input type="range" min={8} max={35} step={1} value={feePct}
          onChange={(e) => { onFeePct(parseInt(e.target.value, 10)); markTouched(); }}
          className="w-full accent-sekai-teal" />
        <div className="flex justify-between text-[11px] text-mid-gray mt-2 font-sans">
          <span>8%</span><span>35%</span>
        </div>
      </Field>

      <Field number="03" label="物件の月間総売上">
        <div className="text-[26px] font-bold text-sekai-teal mb-3 font-sans tabular-nums">{monthlyRev}万円</div>
        <input type="range" min={10} max={500} step={5} value={monthlyRev}
          onChange={(e) => { onMonthlyRev(parseInt(e.target.value, 10)); markTouched(); }}
          className="w-full accent-sekai-teal" />
        <div className="flex justify-between text-[11px] text-mid-gray mt-2 font-sans">
          <span>10万円</span><span>500万円</span>
        </div>
      </Field>

      <Field number="04" label="これまでの運用期間">
        <div className="text-[26px] font-bold text-sekai-teal mb-3 font-sans tabular-nums">{pastYears}年</div>
        <input type="range" min={0} max={15} step={1} value={pastYears}
          onChange={(e) => { onPastYears(parseInt(e.target.value, 10)); markTouched(); }}
          className="w-full accent-sekai-teal" />
        <div className="flex justify-between text-[11px] text-mid-gray mt-2 font-sans">
          <span>0年</span><span>15年</span>
        </div>
      </Field>

      <Field number="05" label="今後あと何年運用する予定">
        <div className="text-[26px] font-bold text-sekai-teal mb-3 font-sans tabular-nums">{futureYears}年</div>
        <input type="range" min={1} max={20} step={1} value={futureYears}
          onChange={(e) => { onFutureYears(parseInt(e.target.value, 10)); markTouched(); }}
          className="w-full accent-sekai-teal" />
        <div className="flex justify-between text-[11px] text-mid-gray mt-2 font-sans">
          <span>1年</span><span>20年</span>
        </div>
      </Field>

      <div
        className={`border border-rule overflow-hidden transition-opacity duration-300 ${touched ? "opacity-100" : "opacity-70"}`}
        aria-live="polite"
      >
        {!touched && (
          <p className="bg-paper px-5 py-3 text-[12px] text-mid-gray text-center border-b border-rule font-sans">
            ↑ スライダを動かすと、あなたの数字が出ます
          </p>
        )}

        <div className="bg-ink text-ivory p-8 md:p-10 text-center">
          <p className="eyebrow-mono text-bright-teal mb-5">今の代行業者のままだと</p>
          <p className="font-sans font-light leading-none text-ivory mb-6 tabular-nums">
            <span className="text-[44px] md:text-[64px] mr-1">−</span>
            <span className="text-[56px] md:text-[80px]">{result.totalLoss}</span>
            <span className="text-[22px] md:text-[28px] ml-3 text-ivory/70">万円</span>
          </p>
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-ivory/20 max-w-md mx-auto">
            <div>
              <p className="eyebrow-mono text-ivory/60 mb-2">過去 {pastYears} 年</p>
              <p className="font-sans text-[20px] md:text-[22px] text-ivory/90 tabular-nums">
                −{result.pastLoss}<span className="text-[12px] text-ivory/60 ml-1">万円</span>
              </p>
            </div>
            <div>
              <p className="eyebrow-mono text-ivory/60 mb-2">今後 {futureYears} 年</p>
              <p className="font-sans text-[20px] md:text-[22px] text-ivory/90 tabular-nums">
                −{result.futureLoss}<span className="text-[12px] text-ivory/60 ml-1">万円</span>
              </p>
            </div>
          </div>
        </div>

        <div className="relative bg-paper flex items-center justify-center py-5 border-y border-rule">
          <div className="w-9 h-9 rounded-full bg-sekai-teal flex items-center justify-center">
            <svg className="w-4 h-4 text-ivory" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        <div className="bg-mist p-8 md:p-10 text-center">
          <p className="eyebrow-mono text-sekai-teal mb-5">SEKAI STAY に切り替えると</p>
          <p className="font-sans font-light leading-tight text-ink mb-2 tabular-nums">
            <span className="text-[20px] md:text-[24px]">{futureYears}年で</span>
            <span className="text-[44px] md:text-[60px] text-sekai-teal mx-2 font-medium">{result.futureSaving}</span>
            <span className="text-[22px] md:text-[24px] text-sekai-teal">万円</span>
            <span className="text-[16px] md:text-[18px] text-dark-gray ml-1">節約</span>
          </p>
          <p className="text-[13px] text-dark-gray mt-3 font-sans">
            年間<span className="font-bold text-sekai-teal mx-1 tabular-nums">{result.annualSaving}</span>万円が手元に戻る
          </p>
          <p className="text-[11px] text-mid-gray mt-4 font-sans">
            ※ 手数料 8% ＋ 物件あたり月額 ¥10,000 で計算
          </p>
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
    <div className="space-y-8">
      <Field number="07" label="お名前" required>
        <input
          type="text"
          value={name}
          onChange={(e) => onChange("name", e.target.value)}
          autoComplete="name"
          maxLength={100}
          placeholder="山田 太郎"
          className={editorialInput}
        />
      </Field>
      <Field number="08" label="メールアドレス" required>
        <input
          type="email"
          inputMode="email"
          value={email}
          onChange={(e) => onChange("email", e.target.value)}
          autoComplete="email"
          maxLength={200}
          placeholder="example@email.com"
          className={editorialInput}
        />
      </Field>
      <Field number="09" label="電話番号" required>
        <input
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => onChange("phone", e.target.value)}
          autoComplete="tel"
          maxLength={50}
          placeholder="090-1234-5678"
          className={editorialInput}
        />
      </Field>
      <Field number="10" label="現状の課題（任意）">
        <textarea
          value={complaints}
          onChange={(e) => onChange("complaints", e.target.value)}
          rows={5}
          maxLength={2000}
          placeholder="現代行や運営面でのご不満・ご要望があればお書きください"
          className={editorialInput + " resize-none"}
        />
      </Field>
    </div>
  );
}
