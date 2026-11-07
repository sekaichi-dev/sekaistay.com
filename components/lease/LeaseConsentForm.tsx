"use client";

/* マンスリー（30 泊以上）の建物一時使用賃貸借契約の同意フォーム（/lease/<予約番号>?k=<鍵>）
 * 予約・契約本文・受付状態は ops の公開 API（GET /api/public/lease）から読み、送信も同じ API へ POST する。
 * このサイトは何も保存しない（鍵の検証・保存・取り込みはすべて ops）。
 * 見た目は宿泊者名簿（components/guest-register/GuestRegisterForm.tsx）の作りを写している（名簿のコードは触らない）。
 * 鍵は入口 /lease/<予約番号>?k= が httpOnly Cookie に移し、consent ページが prop で渡す（URL・解析タグには出ない）。
 * 身分証の写真は名簿と同じ compressImage で 1600px/450KB 目安に縮め、data URL にして本文に入れる。
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { compressImage, readIntoMemory } from "@/components/guest-register/photo-upload";
import {
  LEASE_FIELD_MAX, LEASE_ID_IMAGE_MAX_BYTES, classifySubmitResponse, dataUrlBytes, fieldLabel, formatJst, formatYen, formatYmd,
  isImageDataUrl, isLeaseBookingId, isLeaseLinkKey, leaseApiUrl, opsLeaseApiBase, parseLeaseView, pendingItems, pickLabel, purposeTextRule,
  type LeaseFormValues, type LeaseLang, type LeaseSubmitOutcome, type LeaseView,
} from "@/lib/lease-consent";

const T = {
  ja: {
    eyebrow: "MONTHLY STAY AGREEMENT",
    title: "建物一時使用賃貸借契約のご同意",
    lede: "30 泊以上のご予約は、宿泊ではなく建物一時使用賃貸借契約（借地借家法第 40 条）の締結が条件です。契約の内容をご確認のうえ、ご利用の目的・借主の情報・身分証の写真をご提出ください。",
    loading: "読み込み中…",
    sec1: "ご予約と契約の要点",
    sec2: "ご利用の目的",
    sec3: "借主の情報と本人確認",
    sec4: "同意と送信",
    property: "物件",
    address: "所在地",
    period: "期間",
    nights: (n: number) => `${n}泊`,
    guestName: "予約名",
    rent: "賃料（総額）",
    reservationId: "予約番号",
    summaryHead: "契約の要点",
    stepsHead: "手順",
    steps: [
      "下の「契約全文を読む」で契約の全文をご確認ください。",
      "ご利用の目的・借主の情報・身分証の写真をご入力ください。",
      "同意にチェックして送信してください。入室方法は Airbnb のメッセージでお送りします。",
    ],
    readFull: "契約全文を読む / Read the full agreement",
    closeFull: "契約全文を閉じる",
    tabJa: "日本語（正本）",
    tabEn: "English (reference)",
    fullNote: "日本語版が正本です。英語版は参考訳です。",
    purpose: "ご利用の目的",
    purposePlaceholder: "選択してください",
    purposeText: "目的の内容",
    purposeTextOptional: "任意: 詳しい内容があればご記入ください（空欄でも送信できます）",
    purposeTextRequired: "「その他」を選んだ場合は、内容を 2 文字以上でご記入ください",
    optional: "（任意）",
    fullName: "氏名（身分証と同じ表記）",
    email: "メールアドレス",
    nationality: "国籍",
    homeAddress: "住所（現住所）",
    idType: "身分証の種類",
    idTypePlaceholder: "選択してください",
    idPhoto: "身分証の写真",
    idPhotoPick: "写真を選ぶ・撮影する",
    idPhotoChange: "別の写真を選ぶ",
    idPhotoBusy: "写真を処理しています…",
    idPhotoNote: "身分証の写真は、契約の締結と本人確認のためだけに使い、退去日から 90 日後に削除します。",
    idPhotoUnreadable: "この写真は読み込めませんでした。JPEG または PNG の写真で選び直してください（iPhone の場合は「カメラ」で撮影すると確実です）。",
    idPhotoTooLarge: "写真が大きすぎます。撮影し直すか、別の写真を選んでください。",
    agree: "契約全文を読み、内容に同意して、建物一時使用賃貸借契約を締結します。",
    agreeHint: "先に 01 の「契約全文を読む」で全文を開いてください。",
    submit: "同意して送信する",
    submitting: "送信しています…",
    pendingHead: "送信するには:",
    successTitle: "ご同意を受け付けました",
    agreedTitle: "契約は締結済みです",
    successBody: "ご同意を受け付けました。入室方法は Airbnb のメッセージでお送りします。",
    submittedAt: "同意日時",
    receiptDownload: "控えを保存する",
    receiptShow: "控えを表示",
    receiptHide: "控えを閉じる",
    closedTitle: "受付は終了しました",
    closedBody: "このリンクでの受付は終了しました。ご不明な点は Airbnb のメッセージでご連絡ください。",
    unavailableTitle: "このリンクは現在ご利用いただけません",
    unavailableBody: "お手数ですが、Airbnb のメッセージでご連絡ください。",
    retry: "再読み込み",
    errInvalid: "次の項目をご確認ください:",
    errChanged: "ご予約の内容が変わったため、契約の内容も更新されました。ページを再読み込みして、改めてご確認ください。",
    errAfterArrival: "到着日を過ぎたため、このフォームでは受け付けできません。Airbnb のメッセージでご連絡ください。",
    errNotOpen: "現在このご予約の受付を一時的に停止しています。時間をおいて再読み込みするか、Airbnb のメッセージでご連絡ください。",
    errTooLarge: "写真が大きすぎて送信できませんでした。別の写真を選んでください。",
    errTooMany: "送信の回数が上限に達しました。Airbnb のメッセージでご連絡ください。",
    errNotFound: "このリンクは現在ご利用いただけません。Airbnb のメッセージでご連絡ください。",
    errGeneric: "送信できませんでした。時間をおいてもう一度お試しください。",
    errNetwork: "通信できませんでした。電波の良い場所でもう一度お試しください。",
  },
  en: {
    eyebrow: "MONTHLY STAY AGREEMENT",
    title: "Fixed-term Building Lease Agreement",
    lede: "Bookings of 30 nights or more are not accommodation but require a fixed-term (temporary use) building lease agreement under Article 40 of the Act on Land and Building Leases. Please review the agreement and submit your purpose of use, your details and a photo of your ID.",
    loading: "Loading…",
    sec1: "Your booking and key terms",
    sec2: "Purpose of use",
    sec3: "Your details and ID",
    sec4: "Consent and submit",
    property: "Property",
    address: "Address",
    period: "Dates",
    nights: (n: number) => `${n} night${n === 1 ? "" : "s"}`,
    guestName: "Booking name",
    rent: "Rent (total)",
    reservationId: "Reservation code",
    summaryHead: "Key terms",
    stepsHead: "Steps",
    steps: [
      "Read the full agreement using “Read the full agreement” below.",
      "Enter your purpose of use, your details and a photo of your ID.",
      "Tick the consent box and submit. We will send entry instructions via Airbnb messages.",
    ],
    readFull: "契約全文を読む / Read the full agreement",
    closeFull: "Close the full agreement",
    tabJa: "日本語（正本）",
    tabEn: "English (reference)",
    fullNote: "The Japanese version is the governing text. The English version is a reference translation.",
    purpose: "Purpose of use",
    purposePlaceholder: "Please select",
    purposeText: "Details",
    purposeTextOptional: "Optional: add details if you like (you can leave this blank)",
    purposeTextRequired: "If you chose “Other”, please describe your purpose (2+ characters)",
    optional: " (optional)",
    fullName: "Full name (as shown on your ID)",
    email: "Email address",
    nationality: "Nationality",
    homeAddress: "Home address",
    idType: "Type of ID",
    idTypePlaceholder: "Please select",
    idPhoto: "Photo of your ID",
    idPhotoPick: "Choose or take a photo",
    idPhotoChange: "Choose a different photo",
    idPhotoBusy: "Processing the photo…",
    idPhotoNote: "Your ID photo is used only to conclude the agreement and verify your identity, and is deleted 90 days after you move out.",
    idPhotoUnreadable: "We couldn't read this photo. Please choose a JPEG or PNG photo (on iPhone, taking it with the camera works best).",
    idPhotoTooLarge: "This photo is too large. Please retake it or choose another photo.",
    agree: "I have read the full agreement, agree to its terms and conclude the fixed-term building lease agreement.",
    agreeHint: "Please open the full agreement in section 01 first.",
    submit: "Agree and submit",
    submitting: "Submitting…",
    pendingHead: "To submit, please complete:",
    successTitle: "Thank you — we have received your consent",
    agreedTitle: "The agreement has been concluded",
    successBody: "We have received your consent. We will send entry instructions via Airbnb messages.",
    submittedAt: "Consented at",
    receiptDownload: "Save your copy",
    receiptShow: "View your copy",
    receiptHide: "Close your copy",
    closedTitle: "This form is closed",
    closedBody: "This link is no longer accepting submissions. If you have any questions, please contact us via Airbnb messages.",
    unavailableTitle: "This link is currently unavailable",
    unavailableBody: "Please contact us via Airbnb messages.",
    retry: "Reload",
    errInvalid: "Please check the following:",
    errChanged: "Your booking has changed, so the agreement has been updated. Please reload the page and review it again.",
    errAfterArrival: "Your arrival date has passed, so we can't accept this form. Please contact us via Airbnb messages.",
    errNotOpen: "Submissions for this booking are temporarily paused. Please reload later or contact us via Airbnb messages.",
    errTooLarge: "The photo was too large to send. Please choose another photo.",
    errTooMany: "The submission limit has been reached. Please contact us via Airbnb messages.",
    errNotFound: "This link is currently unavailable. Please contact us via Airbnb messages.",
    errGeneric: "We couldn't submit the form. Please try again in a little while.",
    errNetwork: "We couldn't connect. Please try again where you have a better signal.",
  },
};

const inputCls = "w-full rounded-switch-md border border-switch-stone-border bg-white px-3.5 py-2.5 text-[15px] text-switch-charcoal placeholder:text-switch-stone-text-disabled focus:outline-none focus:border-switch-teal focus:ring-2 focus:ring-switch-teal/20 transition-colors";
const labelCls = "block text-[13px] font-semibold text-switch-charcoal mb-1.5";
const hintCls = "mt-1.5 text-[12px] leading-[1.7] text-switch-gray-mid";
const cardCls = "bg-white border border-switch-gray-pale rounded-switch-lg shadow-switch-card p-6 sm:p-8 mb-6";
const requiredMark = <span className="ml-1 text-[10px] font-bold text-switch-teal align-middle">*</span>;

type Load = { kind: "loading" } | { kind: "unavailable" } | { kind: "ready"; view: LeaseView };
type Done = { receiptHtml: string; submittedAt: string; submittedAtJst: string; agreed: boolean };

const emptyForm = (): LeaseFormValues => ({
  purposeCategory: "", purposeText: "", fullName: "", email: "", nationality: "", address: "",
  idType: "", idImage: "", agree: false, fullTextViewedAt: "",
});

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(typeof r.result === "string" ? r.result : "");
    r.onerror = () => reject(new Error("read failed"));
    r.readAsDataURL(file);
  });
}

export default function LeaseConsentForm({ bookingId, linkKey }: { bookingId: string; linkKey: string }) {
  const [lang, setLang] = useState<LeaseLang>("ja");
  const [load, setLoad] = useState<Load>({ kind: "loading" });
  const [form, setForm] = useState<LeaseFormValues>(emptyForm);
  const [fullOpen, setFullOpen] = useState(false);
  const [fullTab, setFullTab] = useState<LeaseLang>("ja");
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [outcome, setOutcome] = useState<LeaseSubmitOutcome | null>(null);
  const [done, setDone] = useState<Done | null>(null);
  const [networkError, setNetworkError] = useState(false);
  const keyRef = useRef("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = T[lang];
  const base = opsLeaseApiBase({ NEXT_PUBLIC_OPS_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_OPS_PUBLIC_API_BASE });

  useEffect(() => {
    if (!navigator.language.startsWith("ja")) setLang("en");
    const k = linkKey;
    keyRef.current = k;
    if (!isLeaseBookingId(bookingId) || !isLeaseLinkKey(k)) {
      setLoad({ kind: "unavailable" });
      return;
    }
    let cancelled = false;
    fetch(leaseApiUrl(base, bookingId, k), { cache: "no-store", credentials: "omit" })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (cancelled) return;
        const view = parseLeaseView(json);
        if (!view) {
          setLoad({ kind: "unavailable" });
          return;
        }
        setLang(view.lang);
        setFullTab(view.lang);
        if (view.booking.guestName) setForm((f) => (f.fullName ? f : { ...f, fullName: view.booking.guestName || "" }));
        if (view.state === "submitted" || view.state === "agreed") {
          setDone({ receiptHtml: view.receiptHtml, submittedAt: "", submittedAtJst: "", agreed: view.state === "agreed" });
        }
        setLoad({ kind: "ready", view });
      })
      .catch(() => { if (!cancelled) setLoad({ kind: "unavailable" }); });
    return () => { cancelled = true; };
  }, [base, bookingId, linkKey]);

  const view = load.kind === "ready" ? load.view : null;
  const purposes = useMemo(() => view?.purposes ?? [], [view]);
  const purposeOpt = purposes.find((p) => p.value === form.purposeCategory);
  const textRule = purposeTextRule(form.purposeCategory, form.purposeText, purposeOpt?.textRequired);
  const pending = pendingItems(form, lang, purposes);
  const canSubmit = pending.length === 0 && !submitting && !photoBusy;

  const set = <K extends keyof LeaseFormValues>(key: K, value: LeaseFormValues[K]) => setForm((f) => ({ ...f, [key]: value }));

  function openFullText() {
    setFullOpen((o) => !o);
    setForm((f) => (f.fullTextViewedAt ? f : { ...f, fullTextViewedAt: new Date().toISOString() }));
  }

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;
    setPhotoError("");
    setPhotoBusy(true);
    try {
      const inMemory = await readIntoMemory(picked);
      if (!inMemory) throw new Error("UNREADABLE");
      const { file } = await compressImage(inMemory, 1600, 450 * 1024, "id.jpg");
      const dataUrl = await readFileAsDataUrl(file);
      if (!isImageDataUrl(dataUrl)) throw new Error("UNREADABLE");
      if (dataUrlBytes(dataUrl) > LEASE_ID_IMAGE_MAX_BYTES) throw new Error("TOO_LARGE");
      set("idImage", dataUrl);
    } catch (err) {
      setPhotoError((err as Error).message === "TOO_LARGE" ? t.idPhotoTooLarge : t.idPhotoUnreadable);
    } finally {
      setPhotoBusy(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!view || !canSubmit) return;
    setSubmitting(true);
    setOutcome(null);
    setNetworkError(false);
    try {
      const res = await fetch(leaseApiUrl(base, bookingId, keyRef.current), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        cache: "no-store",
        body: JSON.stringify({
          purposeCategory: form.purposeCategory,
          purposeText: form.purposeText.trim(),
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          nationality: form.nationality.trim(),
          address: form.address.trim(),
          idType: form.idType,
          idImage: form.idImage,
          agree: true,
          fingerprint: view.fingerprint,
          version: view.version,
          fullTextViewedAt: form.fullTextViewedAt,
          lang,
        }),
      });
      let json: unknown = null;
      try { json = await res.json(); } catch {}
      const out = classifySubmitResponse(res.status, json);
      if (out.kind === "ok") {
        setDone({ receiptHtml: out.receiptHtml, submittedAt: out.submittedAt, submittedAtJst: out.submittedAtJst, agreed: false });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setOutcome(out);
      }
    } catch {
      setOutcome({ kind: "error" });
      setNetworkError(true);
    } finally {
      setSubmitting(false);
    }
  }
  function outcomeMessage(o: LeaseSubmitOutcome): string {
    switch (o.kind) {
      case "invalid": return t.errInvalid;
      case "changed": return t.errChanged;
      case "after_arrival": return t.errAfterArrival;
      case "not_open": return t.errNotOpen;
      case "too_large": return t.errTooLarge;
      case "too_many": return t.errTooMany;
      case "not_found": return t.errNotFound;
      default: return networkError ? t.errNetwork : t.errGeneric;
    }
  }

  const langToggle = (
    <div className="inline-flex rounded-pill border border-white/25 overflow-hidden text-[12px] font-semibold tracking-wide">
      {(["ja", "en"] as LeaseLang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`w-16 py-1.5 text-center transition-colors ${lang === l ? "bg-white text-switch-charcoal" : "text-white/70 hover:text-white"}`}
        >
          {l === "ja" ? "日本語" : "EN"}
        </button>
      ))}
    </div>
  );

  const sectionHead = (num: string, title: string) => (
    <div className="flex items-baseline gap-3 mb-5">
      <span className="font-mono-editorial text-[11px] tracking-ticker text-switch-teal-deep/70">{num}</span>
      <h2 className="text-[20px] sm:text-[22px] font-bold text-switch-charcoal tracking-tight">{title}</h2>
      <span className="flex-1 h-px bg-switch-stone-border translate-y-[-4px]" />
    </div>
  );

  const messageCard = (title: string, body: string, action?: React.ReactNode) => (
    <div className="bg-white border border-switch-gray-pale rounded-switch-lg shadow-switch-card p-8 sm:p-10 text-center">
      <h2 className="text-[20px] font-bold text-switch-charcoal mb-3">{title}</h2>
      <p className="text-[14px] text-switch-gray-dark leading-[1.9]">{body}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );

  const b = view?.booking;
  const bookingRows: [string, string][] = b
    ? ([
        [t.property, b.propertyName || ""],
        [t.address, b.propertyAddress || ""],
        [t.period, b.arrival && b.departure ? `${formatYmd(b.arrival, lang)} 〜 ${formatYmd(b.departure, lang)}${b.nights ? `（${t.nights(b.nights)}）` : ""}` : ""],
        [t.guestName, b.guestName || ""],
        [t.reservationId, b.reservationId || ""],
        [t.rent, formatYen(b.rentTotalJpy)],
      ] as [string, string][]).filter(([, v]) => v)
    : [];

  return (
    <div className="min-h-screen bg-switch-cloud" data-clarity-mask="true">
      <header className="bg-switch-charcoal">
        <div className="max-w-2xl mx-auto px-5 py-5 flex items-center justify-between gap-4">
          <img src="/images/switch/logo-lockup.png" alt="SEKAI STAY" className="h-[22px] w-auto invert shrink-0" />
          {langToggle}
        </div>
        <div className="max-w-2xl mx-auto px-5 pb-10 pt-2">
          <p className="font-mono-editorial text-[10px] tracking-ticker text-switch-teal-bright mb-3">{t.eyebrow}</p>
          <h1 className="text-[26px] sm:text-[32px] font-bold text-white tracking-tight leading-snug mb-3">{t.title}</h1>
          <p className="text-[14px] sm:text-[15px] leading-[1.9] text-white/70 max-w-xl">{t.lede}</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-10 pb-20">
        {load.kind === "loading" ? (
          <p className="text-center text-[14px] text-switch-gray-mid py-10">{t.loading}</p>
        ) : load.kind === "unavailable" ? (
          messageCard(
            t.unavailableTitle,
            t.unavailableBody,
            <button type="button" onClick={() => window.location.reload()} className="rounded-switch-md border border-switch-stone-border bg-white px-6 py-3 text-[14px] font-semibold text-switch-charcoal hover:bg-switch-stone-over transition-colors">
              {t.retry}
            </button>,
          )
        ) : done ? (
          <SuccessCard t={t} lang={lang} done={done} bookingId={bookingId} />
        ) : view && view.state === "closed" ? (
          messageCard(t.closedTitle, t.closedBody)
        ) : view && view.contract ? (
          <form onSubmit={onSubmit} noValidate>
            {/* 01 ご予約と契約の要点 */}
            <section className={cardCls}>
              {sectionHead("01", t.sec1)}
              {bookingRows.length > 0 && (
                <dl className="rounded-switch-md bg-switch-stone-01 border border-switch-gray-pale px-4 py-3 mb-6 divide-y divide-switch-gray-pale">
                  {bookingRows.map(([k, v]) => (
                    <div key={k} className="flex gap-4 py-2 text-[14px]">
                      <dt className="w-24 shrink-0 text-switch-gray-mid">{k}</dt>
                      <dd className="flex-1 min-w-0 break-words font-semibold text-switch-charcoal">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {view.summary[lang].length > 0 && (
                <div className="mb-6">
                  <h3 className="text-[14px] font-bold text-switch-charcoal mb-2">{t.summaryHead}</h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-[14px] leading-[1.8] text-switch-gray-dark">
                    {view.summary[lang].map((line, i) => <li key={i} className="break-words">{line}</li>)}
                  </ul>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-[14px] font-bold text-switch-charcoal mb-2">{t.stepsHead}</h3>
                <ol className="space-y-1.5 text-[14px] leading-[1.8] text-switch-gray-dark">
                  {t.steps.map((s, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span className="shrink-0 w-5 h-5 mt-[3px] rounded-full bg-switch-teal-tint text-switch-teal-deep text-[11px] font-bold flex items-center justify-center">{i + 1}</span>
                      <span className="flex-1 min-w-0">{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <button
                type="button"
                onClick={openFullText}
                aria-expanded={fullOpen}
                className="w-full rounded-switch-md border border-switch-teal bg-white px-5 py-3 text-[14px] font-semibold text-switch-teal-deep hover:bg-switch-teal-tint transition-colors"
              >
                {fullOpen ? t.closeFull : t.readFull}
              </button>
              {fullOpen && (
                <div className="mt-4">
                  <div className="flex gap-2 mb-2" role="tablist">
                    {(["ja", "en"] as LeaseLang[]).map((l) => (
                      <button
                        key={l}
                        type="button"
                        role="tab"
                        aria-selected={fullTab === l}
                        onClick={() => setFullTab(l)}
                        className={`rounded-pill px-3.5 py-1.5 text-[12px] font-semibold border transition-colors ${fullTab === l ? "bg-switch-charcoal text-white border-switch-charcoal" : "bg-white text-switch-gray-dark border-switch-stone-border"}`}
                      >
                        {l === "ja" ? t.tabJa : t.tabEn}
                      </button>
                    ))}
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto rounded-switch-md border border-switch-stone-border bg-switch-stone-01 p-4">
                    <pre className="whitespace-pre-wrap break-words font-sans text-[13px] leading-[1.9] text-switch-charcoal">
                      {fullTab === "ja" ? view.contract.ja : view.contract.en || view.contract.ja}
                    </pre>
                  </div>
                  <p className={hintCls}>{t.fullNote}</p>
                </div>
              )}
            </section>

            {/* 02 ご利用の目的 */}
            <section className={cardCls}>
              {sectionHead("02", t.sec2)}
              <div className="space-y-5">
                <div>
                  <label htmlFor="ls-purpose" className={labelCls}>{t.purpose}{requiredMark}</label>
                  <select id="ls-purpose" value={form.purposeCategory} onChange={(e) => set("purposeCategory", e.target.value)} className={inputCls}>
                    <option value="">{t.purposePlaceholder}</option>
                    {purposes.map((p) => <option key={p.value} value={p.value}>{pickLabel(p, lang)}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="ls-purpose-text" className={labelCls}>
                    {t.purposeText}
                    {textRule.required ? requiredMark : <span className="font-normal text-switch-gray-mid">{t.optional}</span>}
                  </label>
                  <input
                    id="ls-purpose-text"
                    type="text"
                    value={form.purposeText}
                    maxLength={LEASE_FIELD_MAX.purposeText}
                    onChange={(e) => set("purposeText", e.target.value)}
                    className={inputCls}
                  />
                  <p className={hintCls}>{textRule.required ? t.purposeTextRequired : t.purposeTextOptional}</p>
                </div>
              </div>
            </section>

            {/* 03 借主の情報と本人確認 */}
            <section className={cardCls}>
              {sectionHead("03", t.sec3)}
              <div className="space-y-5">
                <div>
                  <label htmlFor="ls-name" className={labelCls}>{t.fullName}{requiredMark}</label>
                  <input id="ls-name" type="text" autoComplete="name" value={form.fullName} maxLength={LEASE_FIELD_MAX.fullName} onChange={(e) => set("fullName", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="ls-email" className={labelCls}>{t.email}{requiredMark}</label>
                  <input id="ls-email" type="email" inputMode="email" autoComplete="email" value={form.email} maxLength={LEASE_FIELD_MAX.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="ls-nationality" className={labelCls}>{t.nationality}{requiredMark}</label>
                  <input id="ls-nationality" type="text" autoComplete="country-name" value={form.nationality} maxLength={LEASE_FIELD_MAX.nationality} onChange={(e) => set("nationality", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="ls-address" className={labelCls}>{t.homeAddress}{requiredMark}</label>
                  <textarea id="ls-address" rows={2} autoComplete="street-address" value={form.address} maxLength={LEASE_FIELD_MAX.address} onChange={(e) => set("address", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="ls-idtype" className={labelCls}>{t.idType}{requiredMark}</label>
                  <select id="ls-idtype" value={form.idType} onChange={(e) => set("idType", e.target.value)} className={inputCls}>
                    <option value="">{t.idTypePlaceholder}</option>
                    {view.idTypes.map((o) => <option key={o.value} value={o.value}>{pickLabel(o, lang)}</option>)}
                  </select>
                </div>
                <div>
                  <span className={labelCls}>{t.idPhoto}{requiredMark}</span>
                  <input ref={fileInputRef} id="ls-idphoto" type="file" accept="image/*" onChange={onPhoto} className="hidden" />
                  {form.idImage ? (
                    <div className="flex items-center gap-4">
                      <img src={form.idImage} alt={t.idPhoto} className="w-28 h-20 object-cover rounded-switch-md border border-switch-stone-border bg-switch-stone-01" />
                      <button type="button" onClick={() => fileInputRef.current?.click()} disabled={photoBusy} className="rounded-switch-md border border-switch-stone-border bg-white px-4 py-2.5 text-[13px] font-semibold text-switch-charcoal hover:bg-switch-stone-over transition-colors disabled:opacity-50">
                        {photoBusy ? t.idPhotoBusy : t.idPhotoChange}
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={photoBusy} className="w-full rounded-switch-md border border-dashed border-switch-stone-border bg-switch-stone-01 px-4 py-5 text-[14px] font-semibold text-switch-teal-deep hover:bg-switch-stone-over transition-colors disabled:opacity-50">
                      {photoBusy ? t.idPhotoBusy : t.idPhotoPick}
                    </button>
                  )}
                  {photoError && <p className="mt-2 text-[13px] leading-[1.7] text-danger">{photoError}</p>}
                  <p className={hintCls}>{t.idPhotoNote}</p>
                </div>
              </div>
            </section>

            {/* 04 同意と送信 */}
            <section className={cardCls}>
              {sectionHead("04", t.sec4)}
              <label className={`flex items-start gap-3 ${form.fullTextViewedAt ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}>
                <input
                  type="checkbox"
                  checked={form.agree}
                  disabled={!form.fullTextViewedAt}
                  onChange={(e) => set("agree", e.target.checked)}
                  className="mt-1 h-5 w-5 shrink-0 accent-switch-teal"
                />
                <span className="text-[14px] leading-[1.8] text-switch-charcoal">{t.agree}</span>
              </label>
              {!form.fullTextViewedAt && <p className={hintCls}>{t.agreeHint}</p>}

              {outcome && (
                <div className="mt-5 rounded-switch-md border border-danger-border bg-danger-bg px-4 py-3 text-[13px] leading-[1.8] text-danger" role="alert">
                  <p>{outcomeMessage(outcome)}</p>
                  {outcome.kind === "invalid" && outcome.fields.length > 0 && (
                    <ul className="list-disc pl-5 mt-1">{outcome.fields.map((f) => <li key={f}>{fieldLabel(f, lang)}</li>)}</ul>
                  )}
                  {outcome.kind === "changed" && (
                    <button type="button" onClick={() => window.location.reload()} className="mt-2 underline font-semibold">{t.retry}</button>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="mt-6 w-full rounded-switch-md bg-switch-teal px-6 py-3.5 text-[15px] font-bold text-white hover:bg-switch-teal-deep transition-colors disabled:bg-switch-stone-03 disabled:cursor-not-allowed"
              >
                {submitting ? t.submitting : t.submit}
              </button>
              {pending.length > 0 && (
                <div className="mt-3 text-[12px] leading-[1.8] text-switch-gray-mid" aria-live="polite">
                  <p>{t.pendingHead}</p>
                  <ul className="list-disc pl-5">{pending.map((p) => <li key={p}>{p}</li>)}</ul>
                </div>
              )}
            </section>
          </form>
        ) : null}
      </main>
    </div>
  );
}

function SuccessCard({ t, lang, done, bookingId }: { t: (typeof T)["ja"] | (typeof T)["en"]; lang: LeaseLang; done: Done; bookingId: string }) {
  const [showReceipt, setShowReceipt] = useState(false);
  const when = formatJst(done.submittedAt, lang) || (lang === "ja" ? done.submittedAtJst : "");
  const href = done.receiptHtml ? `data:text/html;charset=utf-8,${encodeURIComponent(done.receiptHtml)}` : "";
  return (
    <div className="bg-white border border-switch-gray-pale rounded-switch-lg shadow-switch-card p-8 sm:p-10 text-center">
      <div className="mx-auto w-14 h-14 rounded-full bg-switch-teal-tint flex items-center justify-center mb-5">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-switch-teal">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="text-[22px] font-bold text-switch-charcoal mb-2">{done.agreed ? t.agreedTitle : t.successTitle}</h2>
      <p className="text-[14px] text-switch-gray-dark leading-[1.9] mb-6">{t.successBody}</p>
      {when && (
        <div className="inline-block bg-switch-stone-01 border border-switch-gray-pale rounded-switch-md px-5 py-3 mb-6">
          <span className="block font-mono-editorial text-[10px] tracking-ticker text-switch-gray-mid mb-1">{t.submittedAt}</span>
          <span className="text-[15px] font-bold text-switch-teal-deep">{when}</span>
        </div>
      )}
      {href && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={href}
            download={`lease-${bookingId}.html`}
            className="rounded-switch-md bg-switch-teal px-6 py-3 text-[14px] font-semibold text-white hover:bg-switch-teal-deep transition-colors"
          >
            {t.receiptDownload}
          </a>
          <button
            type="button"
            onClick={() => setShowReceipt((s) => !s)}
            className="rounded-switch-md border border-switch-stone-border bg-white px-6 py-3 text-[14px] font-semibold text-switch-charcoal hover:bg-switch-stone-over transition-colors"
          >
            {showReceipt ? t.receiptHide : t.receiptShow}
          </button>
        </div>
      )}
      {href && showReceipt && (
        // 控えは ops が組んだ HTML。スクリプトを動かさず別の origin 扱いにするため sandbox（属性値なし）で表示する
        <iframe sandbox="" srcDoc={done.receiptHtml} title={t.receiptShow} className="mt-6 w-full h-[70vh] rounded-switch-md border border-switch-stone-border bg-white" />
      )}
    </div>
  );
}
