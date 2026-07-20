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

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { resolveAttribution } from "@/lib/attribution";

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

export function AuditReportRequestForm({ ctaSource }: { ctaSource?: string } = {}) {
  const [step, setStep] = useState<Step>(1);
  const rootRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [attribution, setAttribution] = useState<AdAttribution>({});

  // attribution capture: 現 URL 優先 → 欠けた項目は 90 日クッキー (ss_attr) から復元
  useEffect(() => {
    if (typeof window === "undefined") return;
    setAttribution(resolveAttribution());
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
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
        ctaSource: ctaSource || "audit-page",
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
    <div ref={rootRef} className="scroll-mt-24">
      {/* Progress Ledger — editorial 3-column */}
      <ProgressLedger step={step} />

      {/* Step Header */}
      <p className="mt-10 font-grotesk text-[12px] font-bold tracking-[0.18em] text-sekai-teal">
        STEP {String(step).padStart(2, "0")} <span className="text-ink/30">/ 03</span>
      </p>
      <h2 className="mt-3 mb-8 text-[clamp(1.375rem,2.6vw,1.75rem)] font-bold leading-snug text-ink jp-keep">
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

        {/* Navigation */}
        <div className="flex flex-col gap-3 border-t border-rule pt-7 sm:flex-row">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-rule px-6 py-3.5 text-[14px] font-bold text-ink transition hover:bg-mist"
            >
              ← 戻る
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              disabled={(step === 1 && !canNextFromStep1) || (step === 2 && !canNextFromStep2)}
              onClick={handleNext}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-[15px] font-bold text-white transition hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-40"
            >
              次へ →
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting || !canSubmit}
              className="btn btn-cta !rounded-full flex-1 justify-center disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "送信中..." : "無料で診断レポートをもらう →"}
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
    { n: 1, label: "手数料" },
    { n: 2, label: "試算" },
    { n: 3, label: "ご連絡先" },
  ];
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {items.map((s, i) => {
        const done = s.n < step;
        const active = s.n <= step;
        const current = s.n === step;
        return (
          <div key={s.n} className="flex flex-1 items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-grotesk text-[13px] font-bold transition-colors ${
                  active ? "bg-sekai-teal text-white" : "bg-rule text-ink/40"
                }`}
              >
                {done ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  s.n
                )}
              </span>
              <span className={`whitespace-nowrap text-[12px] font-bold ${current ? "text-ink" : "text-ink/40"} ${current ? "" : "hidden sm:inline"}`}>
                {s.label}
              </span>
            </div>
            {i < items.length - 1 && <span className={`h-px flex-1 ${s.n < step ? "bg-sekai-teal" : "bg-rule"}`} />}
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
  children: (id: string) => ReactNode;
  hint?: ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <div className="mb-3 flex items-baseline gap-3">
        <span className="font-grotesk text-[1.125rem] font-bold leading-none text-sekai-teal tabular-nums">{number}</span>
        <label htmlFor={id} className="text-[14px] font-bold text-ink md:text-[15px]">
          {label}
          {required && <span className="ml-1 text-sekai-teal">*</span>}
        </label>
      </div>
      {children(id)}
      {hint && <p className="mt-2 text-[12px] leading-relaxed text-ink/55">{hint}</p>}
    </div>
  );
}

const editorialInput =
  "w-full rounded-[10px] border border-rule bg-white px-5 py-3.5 text-[15px] text-ink placeholder:text-ink/40 outline-none transition focus:border-sekai-teal focus:ring-2 focus:ring-sekai-teal/20";

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
      {(id) => (
      <>
      <div className={`grid grid-cols-2 gap-3 transition-opacity ${dimmed}`}>
        {FEE_CARDS.map((v) => {
          const selected = commissionRate === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              disabled={startingNew}
              className={`rounded-[12px] border py-6 font-grotesk text-[22px] font-bold transition-all active:scale-[0.98] ${
                selected
                  ? "border-sekai-teal bg-sekai-teal text-white"
                  : "border-rule bg-white text-ink hover:border-sekai-teal/60"
              }`}
            >
              {v}%
            </button>
          );
        })}
        <div
          className={`relative rounded-[12px] border transition-all ${
            otherSelected ? "border-sekai-teal bg-sekai-teal" : "border-rule bg-white"
          }`}
        >
          <select
            id={id}
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
      </>
      )}
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
    const annualRevMan = monthlyRev * 12;
    const otherFee = annualRevMan * (feePct / 100);
    const sekaiCost = annualRevMan * (SEKAI_FEE_PCT / 100) + SEKAI_FIXED_ANNUAL_MAN;
    const annualSaving = Math.max(0, Math.round(otherFee - sekaiCost));
    const futureSaving = annualSaving * futureYears;
    const max = Math.max(otherFee, sekaiCost, 1);
    return {
      annualSaving,
      futureSaving,
      otherFee: Math.round(otherFee),
      sekaiCost: Math.round(sekaiCost),
      otherPct: Math.round((otherFee / max) * 100),
      sekaiPct: Math.round((sekaiCost / max) * 100),
    };
  }, [feePct, monthlyRev, futureYears]);

  return (
    <div className="space-y-10">
      <Field number="02" label="今の代行会社の手数料率">
        {(id) => (
        <>
        <div className="text-[26px] font-bold text-sekai-teal mb-3 font-sans tabular-nums">{feePct}%</div>
        <input id={id} type="range" min={8} max={35} step={1} value={feePct} aria-valuetext={`${feePct}%`}
          onChange={(e) => { onFeePct(parseInt(e.target.value, 10)); markTouched(); }}
          className="w-full accent-sekai-teal" />
        <div className="flex justify-between text-[11px] text-mid-gray mt-2 font-sans">
          <span>8%</span><span>35%</span>
        </div>
        </>
        )}
      </Field>

      <Field number="03" label="物件の月間総売上">
        {(id) => (
        <>
        <div className="text-[26px] font-bold text-sekai-teal mb-3 font-sans tabular-nums">{monthlyRev}万円</div>
        <input id={id} type="range" min={10} max={500} step={5} value={monthlyRev} aria-valuetext={`${monthlyRev}万円`}
          onChange={(e) => { onMonthlyRev(parseInt(e.target.value, 10)); markTouched(); }}
          className="w-full accent-sekai-teal" />
        <div className="flex justify-between text-[11px] text-mid-gray mt-2 font-sans">
          <span>10万円</span><span>500万円</span>
        </div>
        </>
        )}
      </Field>

      <Field number="04" label="これまでの運用期間">
        {(id) => (
        <>
        <div className="text-[26px] font-bold text-sekai-teal mb-3 font-sans tabular-nums">{pastYears}年</div>
        <input id={id} type="range" min={0} max={15} step={1} value={pastYears} aria-valuetext={`${pastYears}年`}
          onChange={(e) => { onPastYears(parseInt(e.target.value, 10)); markTouched(); }}
          className="w-full accent-sekai-teal" />
        <div className="flex justify-between text-[11px] text-mid-gray mt-2 font-sans">
          <span>0年</span><span>15年</span>
        </div>
        </>
        )}
      </Field>

      <Field number="05" label="今後あと何年運用する予定">
        {(id) => (
        <>
        <div className="text-[26px] font-bold text-sekai-teal mb-3 font-sans tabular-nums">{futureYears}年</div>
        <input id={id} type="range" min={1} max={20} step={1} value={futureYears} aria-valuetext={`${futureYears}年`}
          onChange={(e) => { onFutureYears(parseInt(e.target.value, 10)); markTouched(); }}
          className="w-full accent-sekai-teal" />
        <div className="flex justify-between text-[11px] text-mid-gray mt-2 font-sans">
          <span>1年</span><span>20年</span>
        </div>
        </>
        )}
      </Field>

      <div
        className={`overflow-hidden rounded-[14px] border border-rule transition-opacity duration-300 ${touched ? "opacity-100" : "opacity-70"}`}
        aria-live="polite"
      >
        {!touched && (
          <p className="border-b border-rule bg-paper px-5 py-3 text-center text-[12px] text-ink/55">
            ↑ スライダを動かすと、あなたの数字が出ます
          </p>
        )}

        <div className="bg-navy p-8 text-white md:p-10">
          <p className="text-[clamp(1.125rem,2.4vw,1.5rem)] font-bold leading-snug text-white">
            SEKAI STAY に切り替えると
          </p>
          <p className="mt-2 text-[13px] font-bold text-white/80">今後{futureYears}年の累計で</p>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
            <span className="font-grotesk text-[clamp(2.75rem,11vw,4.5rem)] font-bold leading-none tracking-tight text-white tabular-nums">
              +{result.futureSaving}
            </span>
            <span className="text-[16px] font-bold text-white">万円 おトク</span>
          </p>
          <p className="mt-3 text-[13px] text-white/85">
            年間<span className="font-grotesk mx-1 font-bold text-white tabular-nums">+{result.annualSaving}</span>万円が手元に戻る
          </p>

          {/* 年間手数料の比較バー */}
          <div className="mt-7 space-y-4">
            <FeeBar label="一般的な代行" amount={result.otherFee} pct={result.otherPct} tone="muted" />
            <FeeBar label="SEKAI STAY" amount={result.sekaiCost} pct={result.sekaiPct} tone="teal" />
          </div>

          <p className="mt-5 text-[11px] leading-[1.7] text-white/70">
            ※ 年間の手数料（売上に対する手数料率＋固定費）の比較。手数料8%＋物件あたり月額¥10,000で試算。実際の金額は契約条件・物件により異なります。
          </p>
        </div>
      </div>
    </div>
  );
}

function FeeBar({ label, amount, pct, tone }: { label: string; amount: number; pct: number; tone: "muted" | "teal" }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-[12px]">
        <span className={`font-bold ${tone === "teal" ? "text-white" : "text-white/70"}`}>{label}</span>
        <span className="font-grotesk font-bold tabular-nums text-white">約 {amount}万円/年</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-white/15">
        <div
          className={`h-full rounded-full transition-all duration-500 ${tone === "teal" ? "bg-bright-teal" : "bg-white/35"}`}
          style={{ width: `${Math.max(4, pct)}%` }}
        />
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
        {(id) => (
        <input
          id={id}
          type="text"
          value={name}
          onChange={(e) => onChange("name", e.target.value)}
          autoComplete="name"
          maxLength={100}
          placeholder="山田 太郎"
          className={editorialInput}
        />
        )}
      </Field>
      <Field number="08" label="メールアドレス" required>
        {(id) => (
        <input
          id={id}
          type="email"
          inputMode="email"
          value={email}
          onChange={(e) => onChange("email", e.target.value)}
          autoComplete="email"
          maxLength={200}
          placeholder="example@email.com"
          className={editorialInput}
        />
        )}
      </Field>
      <Field number="09" label="電話番号" required>
        {(id) => (
        <input
          id={id}
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => onChange("phone", e.target.value)}
          autoComplete="tel"
          maxLength={50}
          placeholder="090-1234-5678"
          className={editorialInput}
        />
        )}
      </Field>
      <Field number="10" label="現状の課題（任意）">
        {(id) => (
        <textarea
          id={id}
          value={complaints}
          onChange={(e) => onChange("complaints", e.target.value)}
          rows={5}
          maxLength={2000}
          placeholder="現代行や運営面でのご不満・ご要望があればお書きください"
          className={editorialInput + " resize-none"}
        />
        )}
      </Field>
    </div>
  );
}
