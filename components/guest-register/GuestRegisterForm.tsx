"use client";

/* 宿泊者名簿フォーム（/guest-register）
 * 物件マスタの形態（民泊/旅館業）で必須項目を自動分岐:
 *  - 民泊: 氏名・住所・職業・連絡先・宿泊日・国籍（+国内住所なし外国籍は旅券番号/写し）
 *  - 旅館業: 氏名・住所・連絡先・宿泊日（+同上。性別/年齢/前泊地/行先地は条例上乗せ・任意）
 * パスポート写真はクライアントで最大1600px/450KB程度に圧縮してから送信（Vercelの4.5MB制限対策）。
 */

import { useCallback, useEffect, useMemo, useState } from "react";

const MAX_GUESTS = 8;

type Lang = "ja" | "en";
type PropertyType = "民泊" | "旅館業";

interface PropertyOption {
  id: string;
  name: string;
  nameEn: string;
  type: PropertyType;
}

interface GuestForm {
  name: string;
  jaResident: boolean | null;
  address: string;
  sameAddress: boolean;
  nationality: string;
  occupation: string;
  contact: string;
  sameContact: boolean;
  passportNo: string;
  photo: File | null;
  photoName: string;
  gender: string;
  age: string;
  prevStay: string;
  nextDest: string;
}

const emptyGuest = (): GuestForm => ({
  name: "", jaResident: null, address: "", sameAddress: false, nationality: "",
  occupation: "", contact: "", sameContact: false, passportNo: "",
  photo: null, photoName: "", gender: "", age: "", prevStay: "", nextDest: "",
});

const NATIONALITY_LABELS: [string, string][] = [
  ["日本", "Japan"], ["韓国", "South Korea"], ["台湾", "Taiwan"], ["香港", "Hong Kong"],
  ["中国", "China"], ["タイ", "Thailand"], ["シンガポール", "Singapore"], ["マレーシア", "Malaysia"],
  ["インドネシア", "Indonesia"], ["フィリピン", "Philippines"], ["ベトナム", "Vietnam"], ["インド", "India"],
  ["英国", "United Kingdom"], ["ドイツ", "Germany"], ["フランス", "France"], ["イタリア", "Italy"],
  ["スペイン", "Spain"], ["ロシア", "Russia"], ["米国", "United States"], ["カナダ", "Canada"],
  ["オーストラリア", "Australia"], ["その他", "Other"],
];

const T = {
  ja: {
    eyebrow: "GUEST REGISTRATION",
    title: "宿泊者名簿のご登録",
    lede: "日本の法令（旅館業法・住宅宿泊事業法）により、ご宿泊者全員の名簿登録が義務付けられています。チェックイン前のご登録にご協力ください。",
    sec1: "ご宿泊情報",
    property: "ご宿泊施設",
    propertyPlaceholder: "施設を選択してください",
    propertyLoading: "読み込み中…",
    propertyError: "施設一覧を取得できませんでした。再読み込みしてください。",
    checkin: "チェックイン日",
    checkout: "チェックアウト日",
    nights: (n: number) => `${n}泊`,
    sec2: "宿泊者情報",
    repBadge: "代表者",
    compBadge: (i: number) => `同行者 ${i}`,
    addGuest: "＋ 同行者を追加",
    removeGuest: "削除",
    guestNote: "ご宿泊者全員（お子様を含む）のご登録が必要です。",
    name: "氏名",
    namePh: "山田 太郎 / TARO YAMADA",
    nameHint: "外国籍の方はパスポート表記と同じローマ字でご記入ください。",
    residence: "お住まい",
    residenceJa: "日本国内に住所がある",
    residenceAbroad: "日本国外に居住",
    nationality: "国籍",
    nationalityPh: "選択してください",
    address: "住所",
    addressPh: "都道府県から番地まで / Full home address",
    sameAsRep: "代表者と同じ",
    occupation: "職業",
    occupationPh: "会社員、学生 など",
    contact: "連絡先（電話またはメール）",
    contactPh: "090-1234-5678 / name@example.com",
    passportTitle: "パスポート情報",
    passportWhy: "日本国内に住所をお持ちでない外国籍のお客様は、法令によりパスポート番号の記録と写しの保管が必要です。",
    passportNo: "パスポート番号",
    passportPhoto: "パスポート写真ページの画像",
    photoSelect: "画像を選択",
    photoRetake: "画像を変更",
    photoAttached: "添付済み",
    photoHint: "顔写真のあるページを撮影してください。画像は自動で圧縮されます。",
    photoTooLarge: "画像が大きすぎます。設定を下げて撮影するか、スクリーンショットをお試しください。",
    optionalTitle: "追加情報（任意・自治体条例対応）",
    gender: "性別",
    genderOptions: ["", "男", "女", "その他"],
    genderLabels: ["選択しない", "男", "女", "その他"],
    age: "年齢",
    prevStay: "前泊地",
    prevStayPh: "例: 自宅、東京都内ホテル",
    nextDest: "行先地",
    nextDestPh: "例: 京都、帰国",
    sec3: "確認・送信",
    note: "備考（任意）",
    notePh: "運営への連絡事項があればご記入ください",
    consent: "入力した情報が旅館業法・住宅宿泊事業法に基づく宿泊者名簿として3年間保管され、法令に基づき行政機関等へ提示・報告される場合があることに同意します。",
    privacy: "プライバシーポリシー",
    submit: "登録する",
    submitting: "送信中…",
    successTitle: "ご登録ありがとうございました",
    successBody: "宿泊者名簿への登録が完了しました。当日のチェックインをお待ちしております。",
    receiptId: "受付ID",
    successMore: "同じご予約で登録漏れの方がいる場合は、このページから追加でご登録いただけます。",
    registerMore: "続けて登録する",
    errRequired: "未入力の必須項目があります",
    errProperty: "ご宿泊施設を選択してください",
    errDates: "チェックイン日・チェックアウト日を正しく入力してください",
    errName: (w: string) => `${w}: 氏名を入力してください`,
    errResidence: (w: string) => `${w}: お住まいを選択してください`,
    errAddress: (w: string) => `${w}: 住所を入力してください`,
    errNationality: (w: string) => `${w}: 国籍を選択してください`,
    errOccupation: (w: string) => `${w}: 職業を入力してください`,
    errContact: (w: string) => `${w}: 連絡先を入力してください`,
    errPassportNo: (w: string) => `${w}: パスポート番号を入力してください`,
    errPhoto: (w: string) => `${w}: パスポート写真を添付してください`,
    errConsent: "保管への同意にチェックしてください",
    errSubmit: "送信に失敗しました。通信環境をご確認のうえ再度お試しください。",
    who: (i: number) => (i === 0 ? "代表者" : `同行者${i}`),
    legalFoot: "この名簿は作成日から3年間保管され、旅館業法第6条・住宅宿泊事業法第8条に基づき、行政機関の求めに応じて提示されます。",
  },
  en: {
    eyebrow: "GUEST REGISTRATION",
    title: "Guest Registration",
    lede: "Japanese law (Hotel Business Act / Private Lodging Business Act) requires all guests to be registered before check-in. Please complete this form for every member of your party.",
    sec1: "Your Stay",
    property: "Property",
    propertyPlaceholder: "Select your property",
    propertyLoading: "Loading…",
    propertyError: "Could not load the property list. Please reload the page.",
    checkin: "Check-in date",
    checkout: "Check-out date",
    nights: (n: number) => `${n} night${n > 1 ? "s" : ""}`,
    sec2: "Guest Details",
    repBadge: "Lead guest",
    compBadge: (i: number) => `Guest ${i + 1}`,
    addGuest: "+ Add another guest",
    removeGuest: "Remove",
    guestNote: "Every guest, including children, must be registered.",
    name: "Full name",
    namePh: "TARO YAMADA",
    nameHint: "Please write your name exactly as it appears in your passport.",
    residence: "Where do you live?",
    residenceJa: "I have an address in Japan",
    residenceAbroad: "I live outside Japan",
    nationality: "Nationality",
    nationalityPh: "Select",
    address: "Home address",
    addressPh: "Full home address",
    sameAsRep: "Same as lead guest",
    occupation: "Occupation",
    occupationPh: "e.g. Office worker, Student",
    contact: "Contact (phone or email)",
    contactPh: "+81-90-1234-5678 / name@example.com",
    passportTitle: "Passport",
    passportWhy: "Guests of foreign nationality without an address in Japan are required by law to provide their passport number and a copy of their passport.",
    passportNo: "Passport number",
    passportPhoto: "Photo of your passport ID page",
    photoSelect: "Choose image",
    photoRetake: "Change image",
    photoAttached: "Attached",
    photoHint: "Take a photo of the page with your portrait. The image is compressed automatically.",
    photoTooLarge: "The image is too large. Please try a smaller photo or a screenshot.",
    optionalTitle: "Additional details (optional)",
    gender: "Gender",
    genderOptions: ["", "男", "女", "その他"],
    genderLabels: ["Prefer not to say", "Male", "Female", "Other"],
    age: "Age",
    prevStay: "Previous place of stay",
    prevStayPh: "e.g. Home, hotel in Tokyo",
    nextDest: "Next destination",
    nextDestPh: "e.g. Kyoto, returning home",
    sec3: "Review & Submit",
    note: "Notes (optional)",
    notePh: "Anything you would like us to know",
    consent: "I agree that this information will be kept for 3 years as the official guest register required by Japanese law, and may be disclosed to government authorities as required by law.",
    privacy: "Privacy Policy",
    submit: "Register",
    submitting: "Submitting…",
    successTitle: "Thank you!",
    successBody: "Your registration is complete. We look forward to welcoming you.",
    receiptId: "Receipt ID",
    successMore: "If anyone in your party has not been registered yet, you can submit another registration from this page.",
    registerMore: "Register more guests",
    errRequired: "Some required fields are missing",
    errProperty: "Please select your property",
    errDates: "Please enter valid check-in and check-out dates",
    errName: (w: string) => `${w}: please enter the full name`,
    errResidence: (w: string) => `${w}: please select where you live`,
    errAddress: (w: string) => `${w}: please enter the home address`,
    errNationality: (w: string) => `${w}: please select the nationality`,
    errOccupation: (w: string) => `${w}: please enter the occupation`,
    errContact: (w: string) => `${w}: please enter a contact`,
    errPassportNo: (w: string) => `${w}: please enter the passport number`,
    errPhoto: (w: string) => `${w}: please attach a passport photo`,
    errConsent: "Please agree to the data retention terms",
    errSubmit: "Submission failed. Please check your connection and try again.",
    who: (i: number) => (i === 0 ? "Lead guest" : `Guest ${i + 1}`),
    legalFoot: "This register is kept for 3 years and presented to government authorities upon request, as required by the Hotel Business Act (Art. 6) and the Private Lodging Business Act (Art. 8).",
  },
} as const;

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  try {
    return await createImageBitmap(file);
  } catch {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("decode failed")); };
      img.src = url;
    });
  }
}

// 最大1600px・450KB目安にJPEG圧縮。デコード不可(HEIC等)は3.5MB以下ならそのまま送る。
async function compressImage(file: File): Promise<File> {
  if (file.size <= 450_000) return file;
  try {
    const bitmap = await loadBitmap(file);
    const w = "width" in bitmap ? bitmap.width : 0;
    const h = "height" in bitmap ? bitmap.height : 0;
    if (!w || !h) throw new Error("empty image");
    const scale = Math.min(1, 1600 / Math.max(w, h));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no canvas");
    ctx.drawImage(bitmap as CanvasImageSource, 0, 0, canvas.width, canvas.height);
    let result: Blob | null = null;
    for (const quality of [0.8, 0.65, 0.5]) {
      result = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
      if (result && result.size <= 450_000) break;
    }
    if (!result) throw new Error("toBlob failed");
    if (result.size > 3_500_000) throw new Error("TOO_LARGE");
    return new File([result], "passport.jpg", { type: "image/jpeg" });
  } catch (e) {
    if (file.size <= 3_500_000) return file;
    throw new Error("TOO_LARGE");
  }
}

const inputCls = "w-full rounded-switch-md border border-switch-stone-border bg-white px-3.5 py-2.5 text-[15px] text-ink placeholder:text-switch-stone-text-disabled focus:outline-none focus:border-sekai-teal focus:ring-2 focus:ring-sekai-teal/20 transition-colors";
const labelCls = "block text-[13px] font-semibold text-ink mb-1.5";
const requiredMark = <span className="ml-1 text-[10px] font-bold text-switch-accent align-middle">*</span>;

export default function GuestRegisterForm() {
  const [lang, setLang] = useState<Lang>("ja");
  const [properties, setProperties] = useState<PropertyOption[] | null>(null);
  const [propertiesError, setPropertiesError] = useState(false);
  const [propertyId, setPropertyId] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState<GuestForm[]>([emptyGuest()]);
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [receiptId, setReceiptId] = useState("");
  const [photoBusy, setPhotoBusy] = useState<number | null>(null);

  const t = T[lang];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("lang");
    if (q === "en" || (q !== "ja" && !navigator.language.startsWith("ja"))) setLang("en");
    const p = params.get("p");
    if (p) setPropertyId(p);
  }, []);

  useEffect(() => {
    fetch("/api/guest-register/properties")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setProperties(d.properties || []))
      .catch(() => setPropertiesError(true));
  }, []);

  const property = useMemo(
    () => properties?.find((p) => p.id === propertyId) || null,
    [properties, propertyId],
  );

  const nights = useMemo(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(checkin) || !/^\d{4}-\d{2}-\d{2}$/.test(checkout)) return 0;
    const n = Math.round((Date.parse(checkout) - Date.parse(checkin)) / 86_400_000);
    return Number.isFinite(n) ? n : 0;
  }, [checkin, checkout]);

  const updateGuest = useCallback((index: number, patch: Partial<GuestForm>) => {
    setGuests((prev) => prev.map((g, i) => (i === index ? { ...g, ...patch } : g)));
  }, []);

  const needsPassport = (g: GuestForm) => g.jaResident === false && g.nationality !== "" && g.nationality !== "日本";

  async function onPhotoChange(index: number, file: File | null) {
    if (!file) return;
    setError("");
    setPhotoBusy(index);
    try {
      const compressed = await compressImage(file);
      updateGuest(index, { photo: compressed, photoName: file.name });
    } catch {
      updateGuest(index, { photo: null, photoName: "" });
      setError(t.photoTooLarge);
    } finally {
      setPhotoBusy(null);
    }
  }

  function validate(): string | null {
    if (!property) return t.errProperty;
    if (nights < 1 || nights > 90) return t.errDates;
    for (let i = 0; i < guests.length; i++) {
      const g = guests[i];
      const who = t.who(i);
      if (!g.name.trim()) return t.errName(who);
      if (g.jaResident === null) return t.errResidence(who);
      if (!g.nationality) return t.errNationality(who);
      if (!(i > 0 && g.sameAddress) && !g.address.trim()) return t.errAddress(who);
      if (property.type === "民泊" && !g.occupation.trim()) return t.errOccupation(who);
      if (!(i > 0 && g.sameContact) && !g.contact.trim()) return t.errContact(who);
      if (needsPassport(g)) {
        if (!g.passportNo.trim()) return t.errPassportNo(who);
        if (!g.photo) return t.errPhoto(who);
      }
    }
    if (!consent) return t.errConsent;
    return null;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSubmitting(true);
    try {
      const rep = guests[0];
      const payload = {
        propertyId,
        checkin,
        checkout,
        note,
        guests: guests.map((g, i) => ({
          name: g.name,
          jaResident: g.jaResident === true,
          address: i > 0 && g.sameAddress ? rep.address : g.address,
          nationality: g.nationality,
          occupation: g.occupation,
          contact: i > 0 && g.sameContact ? rep.contact : g.contact,
          passportNo: g.passportNo,
          gender: g.gender,
          age: g.age,
          prevStay: g.prevStay,
          nextDest: g.nextDest,
        })),
      };
      const form = new FormData();
      form.set("payload", JSON.stringify(payload));
      form.set("website", (document.getElementById("gr-website") as HTMLInputElement)?.value || "");
      guests.forEach((g, i) => {
        if (needsPassport(g) && g.photo) form.set(`photo_${i}`, g.photo);
      });
      const res = await fetch("/api/guest-register", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.error || t.errSubmit);
        return;
      }
      setReceiptId(data.receiptId || "OK");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError(t.errSubmit);
    } finally {
      setSubmitting(false);
    }
  }

  function resetForNext() {
    setGuests([emptyGuest()]);
    setNote("");
    setConsent(false);
    setReceiptId("");
    setError("");
  }

  const langToggle = (
    <div className="inline-flex rounded-pill border border-white/25 overflow-hidden text-[12px] font-semibold tracking-wide">
      {(["ja", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`px-3.5 py-1.5 transition-colors ${lang === l ? "bg-white text-switch-charcoal" : "text-white/70 hover:text-white"}`}
        >
          {l === "ja" ? "日本語" : "EN"}
        </button>
      ))}
    </div>
  );

  const sectionHead = (num: string, title: string) => (
    <div className="flex items-baseline gap-3 mb-5">
      <span className="font-mono-editorial text-[11px] tracking-ticker text-deep-teal/70">{num}</span>
      <h2 className="text-[18px] sm:text-[20px] font-bold text-ink tracking-tight">{title}</h2>
      <span className="flex-1 h-px bg-rule translate-y-[-4px]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-ivory">
      {/* ヘッダーバンド */}
      <header className="bg-switch-charcoal">
        <div className="max-w-2xl mx-auto px-5 py-5 flex items-center justify-between">
          <span className="text-white font-display font-bold tracking-[0.18em] text-[15px]">SEKAI STAY</span>
          {langToggle}
        </div>
        <div className="max-w-2xl mx-auto px-5 pb-10 pt-2">
          <p className="font-mono-editorial text-[10px] tracking-ticker text-bright-teal mb-3">{t.eyebrow}</p>
          <h1 className="text-[26px] sm:text-[32px] font-bold text-white tracking-tight leading-snug mb-3">{t.title}</h1>
          <p className="text-[13px] sm:text-[14px] leading-[1.9] text-white/70 max-w-xl">{t.lede}</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-10 pb-20">
        {receiptId ? (
          <div className="bg-paper border border-rule rounded-switch-lg shadow-switch-card p-8 sm:p-10 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-teal-tint flex items-center justify-center mb-5">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-sekai-teal">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-[22px] font-bold text-ink mb-2">{t.successTitle}</h2>
            <p className="text-[14px] text-ink/70 leading-[1.9] mb-6">{t.successBody}</p>
            <div className="inline-block bg-mist border border-rule rounded-switch-md px-5 py-3 mb-6">
              <span className="block font-mono-editorial text-[10px] tracking-ticker text-ink/50 mb-1">{t.receiptId}</span>
              <span className="font-mono-editorial text-[16px] font-bold text-deep-teal">{receiptId}</span>
            </div>
            <p className="text-[12px] text-ink/55 leading-relaxed mb-6">{t.successMore}</p>
            <button
              type="button"
              onClick={resetForNext}
              className="rounded-switch-md border border-switch-stone-border bg-white px-6 py-3 text-[14px] font-semibold text-ink hover:bg-switch-stone-over transition-colors"
            >
              {t.registerMore}
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            {/* honeypot */}
            <input id="gr-website" type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            {/* 01 ご宿泊情報 */}
            <section className="bg-paper border border-rule rounded-switch-lg shadow-switch-card p-6 sm:p-8 mb-6">
              {sectionHead("01", t.sec1)}
              <div className="space-y-5">
                <div>
                  <label htmlFor="gr-property" className={labelCls}>{t.property}{requiredMark}</label>
                  <select
                    id="gr-property"
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">
                      {propertiesError ? t.propertyError : properties === null ? t.propertyLoading : t.propertyPlaceholder}
                    </option>
                    {(properties || []).map((p) => (
                      <option key={p.id} value={p.id}>
                        {lang === "en" && p.nameEn ? p.nameEn : p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="gr-checkin" className={labelCls}>{t.checkin}{requiredMark}</label>
                    <input id="gr-checkin" type="date" value={checkin} onChange={(e) => setCheckin(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="gr-checkout" className={labelCls}>{t.checkout}{requiredMark}</label>
                    <input id="gr-checkout" type="date" value={checkout} min={checkin || undefined} onChange={(e) => setCheckout(e.target.value)} className={inputCls} />
                  </div>
                </div>
                {nights > 0 && (
                  <p className="text-[12px] text-deep-teal font-semibold">{t.nights(nights)}</p>
                )}
              </div>
            </section>

            {/* 02 宿泊者情報 */}
            <section className="bg-paper border border-rule rounded-switch-lg shadow-switch-card p-6 sm:p-8 mb-6">
              {sectionHead("02", t.sec2)}
              <p className="text-[12px] text-ink/60 leading-relaxed -mt-2 mb-5">{t.guestNote}</p>

              <div className="space-y-8">
                {guests.map((g, i) => (
                  <div key={i} className={i > 0 ? "border-t border-rule pt-7" : ""}>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-block rounded-pill px-3 py-1 text-[11px] font-bold tracking-wide ${i === 0 ? "bg-deep-teal text-white" : "bg-teal-tint text-deep-teal"}`}>
                        {i === 0 ? t.repBadge : t.compBadge(i)}
                      </span>
                      {i > 0 && (
                        <button
                          type="button"
                          onClick={() => setGuests((prev) => prev.filter((_, j) => j !== i))}
                          className="text-[12px] text-ink/50 hover:text-danger underline underline-offset-2"
                        >
                          {t.removeGuest}
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className={labelCls}>{t.name}{requiredMark}</label>
                        <input type="text" value={g.name} maxLength={100} placeholder={t.namePh}
                          onChange={(e) => updateGuest(i, { name: e.target.value })} className={inputCls} />
                        <p className="mt-1 text-[11px] text-ink/45">{t.nameHint}</p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>{t.residence}{requiredMark}</label>
                          <div className="space-y-1.5">
                            {([true, false] as const).map((v) => (
                              <label key={String(v)} className="flex items-center gap-2.5 rounded-switch-md border border-switch-stone-border bg-white px-3.5 py-2.5 cursor-pointer has-[:checked]:border-sekai-teal has-[:checked]:bg-teal-tint/40 transition-colors">
                                <input
                                  type="radio"
                                  name={`residence-${i}`}
                                  checked={g.jaResident === v}
                                  onChange={() => updateGuest(i, { jaResident: v })}
                                  className="accent-[#167B81]"
                                />
                                <span className="text-[13px] text-ink">{v ? t.residenceJa : t.residenceAbroad}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className={labelCls}>{t.nationality}{requiredMark}</label>
                          <select value={g.nationality} onChange={(e) => updateGuest(i, { nationality: e.target.value })} className={inputCls}>
                            <option value="">{t.nationalityPh}</option>
                            {NATIONALITY_LABELS.map(([ja, en]) => (
                              <option key={ja} value={ja}>{lang === "en" ? en : ja}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[13px] font-semibold text-ink">{t.address}{requiredMark}</label>
                          {i > 0 && (
                            <label className="flex items-center gap-1.5 text-[12px] text-ink/60 cursor-pointer">
                              <input type="checkbox" checked={g.sameAddress} className="accent-[#167B81]"
                                onChange={(e) => updateGuest(i, { sameAddress: e.target.checked })} />
                              {t.sameAsRep}
                            </label>
                          )}
                        </div>
                        {!(i > 0 && g.sameAddress) && (
                          <input type="text" value={g.address} maxLength={300} placeholder={t.addressPh}
                            onChange={(e) => updateGuest(i, { address: e.target.value })} className={inputCls} />
                        )}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        {property?.type === "民泊" && (
                          <div>
                            <label className={labelCls}>{t.occupation}{requiredMark}</label>
                            <input type="text" value={g.occupation} maxLength={100} placeholder={t.occupationPh}
                              onChange={(e) => updateGuest(i, { occupation: e.target.value })} className={inputCls} />
                          </div>
                        )}
                        <div className={property?.type === "民泊" ? "" : "sm:col-span-2"}>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-[13px] font-semibold text-ink">{t.contact}{requiredMark}</label>
                            {i > 0 && (
                              <label className="flex items-center gap-1.5 text-[12px] text-ink/60 cursor-pointer">
                                <input type="checkbox" checked={g.sameContact} className="accent-[#167B81]"
                                  onChange={(e) => updateGuest(i, { sameContact: e.target.checked })} />
                                {t.sameAsRep}
                              </label>
                            )}
                          </div>
                          {!(i > 0 && g.sameContact) && (
                            <input type="text" value={g.contact} maxLength={200} placeholder={t.contactPh}
                              onChange={(e) => updateGuest(i, { contact: e.target.value })} className={inputCls} />
                          )}
                        </div>
                      </div>

                      {needsPassport(g) && (
                        <div className="rounded-switch-md border border-brass/40 bg-brass/5 p-4 sm:p-5">
                          <p className="text-[13px] font-bold text-ink mb-1">{t.passportTitle}</p>
                          <p className="text-[11.5px] text-ink/60 leading-relaxed mb-4">{t.passportWhy}</p>
                          <div className="space-y-4">
                            <div>
                              <label className={labelCls}>{t.passportNo}{requiredMark}</label>
                              <input type="text" value={g.passportNo} maxLength={30} placeholder="XX1234567"
                                onChange={(e) => updateGuest(i, { passportNo: e.target.value })} className={inputCls} />
                            </div>
                            <div>
                              <label className={labelCls}>{t.passportPhoto}{requiredMark}</label>
                              <label className={`inline-flex items-center gap-2 rounded-switch-md border px-4 py-2.5 text-[13px] font-semibold cursor-pointer transition-colors ${g.photo ? "border-sekai-teal bg-teal-tint text-deep-teal" : "border-switch-stone-border bg-white text-ink hover:bg-switch-stone-over"}`}>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => onPhotoChange(i, e.target.files?.[0] || null)}
                                />
                                {photoBusy === i ? "…" : g.photo ? `✓ ${t.photoAttached}` : t.photoSelect}
                              </label>
                              {g.photo && (
                                <span className="ml-3 text-[12px] text-ink/55 break-all">{g.photoName}</span>
                              )}
                              <p className="mt-1.5 text-[11px] text-ink/45">{t.photoHint}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {property?.type === "旅館業" && (
                        <details className="rounded-switch-md border border-rule bg-mist/60 px-4 py-3">
                          <summary className="text-[12.5px] font-semibold text-ink/70 cursor-pointer select-none">{t.optionalTitle}</summary>
                          <div className="grid sm:grid-cols-2 gap-4 pt-4">
                            <div>
                              <label className={labelCls}>{t.gender}</label>
                              <select value={g.gender} onChange={(e) => updateGuest(i, { gender: e.target.value })} className={inputCls}>
                                {t.genderOptions.map((v, gi) => (
                                  <option key={gi} value={v}>{t.genderLabels[gi]}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className={labelCls}>{t.age}</label>
                              <input type="text" inputMode="numeric" value={g.age} maxLength={10}
                                onChange={(e) => updateGuest(i, { age: e.target.value })} className={inputCls} />
                            </div>
                            <div>
                              <label className={labelCls}>{t.prevStay}</label>
                              <input type="text" value={g.prevStay} maxLength={100} placeholder={t.prevStayPh}
                                onChange={(e) => updateGuest(i, { prevStay: e.target.value })} className={inputCls} />
                            </div>
                            <div>
                              <label className={labelCls}>{t.nextDest}</label>
                              <input type="text" value={g.nextDest} maxLength={100} placeholder={t.nextDestPh}
                                onChange={(e) => updateGuest(i, { nextDest: e.target.value })} className={inputCls} />
                            </div>
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {guests.length < MAX_GUESTS && (
                <button
                  type="button"
                  onClick={() => setGuests((prev) => [...prev, emptyGuest()])}
                  className="mt-7 w-full rounded-switch-md border border-dashed border-switch-stone-03 bg-white py-3.5 text-[14px] font-semibold text-deep-teal hover:bg-teal-tint/40 hover:border-sekai-teal transition-colors"
                >
                  {t.addGuest}
                </button>
              )}
            </section>

            {/* 03 確認・送信 */}
            <section className="bg-paper border border-rule rounded-switch-lg shadow-switch-card p-6 sm:p-8">
              {sectionHead("03", t.sec3)}
              <div className="space-y-5">
                <div>
                  <label htmlFor="gr-note" className={labelCls}>{t.note}</label>
                  <textarea id="gr-note" value={note} maxLength={500} rows={3} placeholder={t.notePh}
                    onChange={(e) => setNote(e.target.value)} className={inputCls} />
                </div>
                <label className="flex items-start gap-3 rounded-switch-md border border-rule bg-mist/60 p-4 cursor-pointer">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 accent-[#167B81] shrink-0" />
                  <span className="text-[12.5px] text-ink/75 leading-relaxed">
                    {t.consent}{" "}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-deep-teal underline underline-offset-2">{t.privacy}</a>
                  </span>
                </label>

                {error && (
                  <div className="rounded-switch-md border border-danger-border bg-danger-bg px-4 py-3 text-[13px] text-danger" role="alert">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || photoBusy !== null}
                  className="w-full rounded-switch-md bg-switch-accent hover:bg-switch-accent-hover disabled:bg-switch-stone-03 disabled:cursor-not-allowed py-4 text-[16px] font-bold text-white tracking-wide transition-colors active:scale-[0.99]"
                >
                  {submitting ? t.submitting : t.submit}
                </button>
                <p className="text-[11px] text-ink/45 leading-relaxed">{t.legalFoot}</p>
              </div>
            </section>
          </form>
        )}
      </main>

      <footer className="border-t border-rule py-8">
        <p className="text-center text-[11px] tracking-[0.14em] text-ink/40">
          © SEKAI STAY — Guest Register
        </p>
      </footer>
    </div>
  );
}
