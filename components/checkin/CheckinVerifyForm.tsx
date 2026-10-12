"use client";

/* チェックイン時の本人確認（/checkin/<物件ID>・鍵は /c/<物件ID>?k= が置いた httpOnly Cookie）
 * 室内の QR から開く 1 画面: 予約の特定（予約番号 or 姓＋到着日）→ 顔の横に身分証を持った自撮り（1 人 1 枚・最大 8 枚）→ 送信。
 * 写真は名簿フォームと同じく選んだ時点で Drive の受付中フォルダへ直接置き、送信にはファイル ID だけを送る。
 * 位置情報は送信時に 1 回だけ求め、拒否・取得不可でも送信は止めない（結果だけ記録する）。
 * 言語は日・英・韓・中（端末の言語で初期選択）。
 */

import { useEffect, useMemo, useState } from "react";
import { compressImage, readIntoMemory, reportFailure, uploadPhoto } from "@/components/guest-register/photo-upload";

type Lang = "ja" | "en" | "ko" | "zh";
const MAX_PHOTOS = 8;

const T: Record<Lang, {
  label: string; title: string; property: string; lead: string;
  step1: string; bookingRef: string; bookingRefHint: string; noBooking: string; lastName: string; arrivalDate: string;
  step2: string; photoWhy: string; photoTips: string[]; take: string; retake: string; addPerson: string; remove: string; uploading: string;
  step3: string; consent: string; submit: string; submitting: string;
  doneTitle: string; doneBody: string; receipt: string;
  invalidTitle: string; invalidBody: string;
  errBooking: string; errPhoto: string; errConsent: string; errUnreadable: string; errTooLarge: string; errUpload: string; errSubmit: string;
  legal: string;
}> = {
  ja: {
    label: "日本語", title: "チェックイン時の本人確認", property: "ご宿泊施設",
    lead: "法令に基づき、ご到着の確認として「顔と身分証を一緒に写した写真」を1枚お送りください。1分で終わります。",
    step1: "ご予約の確認", bookingRef: "予約番号", bookingRefHint: "予約確認メールやアプリに記載の番号です（Airbnb は HM で始まる確認コード）", noBooking: "予約番号がわからない場合は、姓と到着日を入力してください",
    lastName: "姓", arrivalDate: "到着日",
    step2: "写真を撮る", photoWhy: "顔の横に身分証を持って、1枚撮影してください。外国籍の方はパスポートの顔写真ページをお使いください。",
    photoTips: ["顔と身分証が同じ画面に入るように", "身分証の文字が読めるまで近づけて", "明るい場所で、マスクやサングラスは外して"],
    take: "カメラで撮影する", retake: "撮り直す", addPerson: "同行者の写真を追加", remove: "削除", uploading: "保存中…",
    step3: "送信", consent: "写真は宿泊者名簿とともに3年間保管され、行政機関の求めに応じて提示されることに同意します。",
    submit: "送信する", submitting: "送信中…",
    doneTitle: "本人確認を受け付けました", doneBody: "ご協力ありがとうございます。どうぞごゆっくりお過ごしください。", receipt: "受付番号",
    invalidTitle: "このQRコードは無効です", invalidBody: "お部屋に掲示されているQRコードをもう一度読み取ってください。解決しない場合は運営までご連絡ください。",
    errBooking: "予約番号、または姓と到着日を入力してください", errPhoto: "写真を撮影してください", errConsent: "保管への同意をお願いします",
    errUnreadable: "写真を読み込めませんでした。もう一度撮影してください", errTooLarge: "写真が大きすぎます。もう一度撮影してください", errUpload: "写真の保存に失敗しました。通信環境をご確認のうえ、もう一度お試しください",
    errSubmit: "送信に失敗しました。通信環境をご確認のうえ、もう一度お試しください",
    legal: "旅館業法第6条・住宅宿泊事業法第8条に基づく本人確認です。",
  },
  en: {
    label: "EN", title: "ID check at check-in", property: "Property",
    lead: "Japanese law requires us to confirm your arrival. Please send one photo of your face together with your ID. It takes about a minute.",
    step1: "Your booking", bookingRef: "Booking number", bookingRefHint: "The number in your confirmation email or app (Airbnb: the code starting with HM)", noBooking: "If you don't know it, enter your last name and arrival date instead",
    lastName: "Last name", arrivalDate: "Arrival date",
    step2: "Take the photo", photoWhy: "Hold your ID next to your face and take one photo. Non-Japanese guests: use the photo page of your passport.",
    photoTips: ["Face and ID in the same frame", "Close enough that the ID text is readable", "Good light, no mask or sunglasses"],
    take: "Open camera", retake: "Retake", addPerson: "Add a photo for another guest", remove: "Remove", uploading: "Saving…",
    step3: "Send", consent: "I agree that this photo is kept with the guest register for 3 years and shown to authorities on request.",
    submit: "Send", submitting: "Sending…",
    doneTitle: "ID check received", doneBody: "Thank you. Enjoy your stay.", receipt: "Receipt number",
    invalidTitle: "This QR code is not valid", invalidBody: "Please scan the QR code posted in your room again. If it still fails, contact us.",
    errBooking: "Enter your booking number, or your last name and arrival date", errPhoto: "Please take the photo", errConsent: "Please agree to the retention terms",
    errUnreadable: "We could not read the photo. Please take it again", errTooLarge: "The photo is too large. Please take it again", errUpload: "Could not save the photo. Check your connection and try again",
    errSubmit: "Sending failed. Check your connection and try again",
    legal: "Required under the Hotel Business Act (Art. 6) and the Private Lodging Business Act (Art. 8).",
  },
  ko: {
    label: "한국어", title: "체크인 본인 확인", property: "숙박 시설",
    lead: "일본 법령에 따라 도착 확인을 위해 얼굴과 신분증을 함께 찍은 사진 1장을 보내 주세요. 1분이면 끝납니다.",
    step1: "예약 확인", bookingRef: "예약번호", bookingRefHint: "예약 확인 메일이나 앱에 적힌 번호입니다(Airbnb는 HM으로 시작하는 확인 코드)", noBooking: "예약번호를 모르면 성과 도착일을 입력하세요",
    lastName: "성", arrivalDate: "도착일",
    step2: "사진 촬영", photoWhy: "얼굴 옆에 신분증을 들고 1장 촬영하세요. 외국인은 여권의 사진면을 사용해 주세요.",
    photoTips: ["얼굴과 신분증이 한 화면에 들어오게", "신분증 글자가 읽힐 만큼 가까이", "밝은 곳에서, 마스크·선글라스는 벗고"],
    take: "카메라로 촬영", retake: "다시 찍기", addPerson: "동행자 사진 추가", remove: "삭제", uploading: "저장 중…",
    step3: "전송", consent: "사진이 숙박자 명부와 함께 3년간 보관되며 행정기관의 요청 시 제시되는 것에 동의합니다.",
    submit: "전송", submitting: "전송 중…",
    doneTitle: "본인 확인을 접수했습니다", doneBody: "협조해 주셔서 감사합니다. 편안한 시간 보내세요.", receipt: "접수번호",
    invalidTitle: "이 QR 코드는 유효하지 않습니다", invalidBody: "객실에 게시된 QR 코드를 다시 스캔해 주세요. 해결되지 않으면 운영팀에 연락해 주세요.",
    errBooking: "예약번호 또는 성과 도착일을 입력하세요", errPhoto: "사진을 촬영하세요", errConsent: "보관에 동의해 주세요",
    errUnreadable: "사진을 읽을 수 없습니다. 다시 촬영하세요", errTooLarge: "사진이 너무 큽니다. 다시 촬영하세요", errUpload: "사진 저장에 실패했습니다. 통신 상태를 확인하고 다시 시도하세요",
    errSubmit: "전송에 실패했습니다. 통신 상태를 확인하고 다시 시도하세요",
    legal: "여관업법 제6조·주택숙박사업법 제8조에 따른 본인 확인입니다.",
  },
  zh: {
    label: "中文", title: "入住身份核验", property: "住宿设施",
    lead: "根据日本法律，为确认您已到达，请发送一张脸部与证件同框的照片。约需1分钟。",
    step1: "确认预订", bookingRef: "预订号", bookingRefHint: "预订确认邮件或App中的编号（Airbnb为以HM开头的确认码）", noBooking: "不知道预订号时，请输入姓氏和到达日期",
    lastName: "姓氏", arrivalDate: "到达日期",
    step2: "拍摄照片", photoWhy: "请将证件举在脸旁拍一张照片。外籍旅客请使用护照的照片页。",
    photoTips: ["脸部与证件在同一画面内", "靠近到能看清证件文字", "在明亮处拍摄，摘下口罩和墨镜"],
    take: "打开相机拍摄", retake: "重拍", addPerson: "添加同行者照片", remove: "删除", uploading: "保存中…",
    step3: "发送", consent: "我同意照片与住宿者名簿一同保存3年，并应行政机关要求出示。",
    submit: "发送", submitting: "发送中…",
    doneTitle: "已受理身份核验", doneBody: "感谢配合，祝您入住愉快。", receipt: "受理编号",
    invalidTitle: "此二维码无效", invalidBody: "请重新扫描房间内张贴的二维码。若仍无法使用，请联系我们。",
    errBooking: "请输入预订号，或姓氏和到达日期", errPhoto: "请拍摄照片", errConsent: "请同意保存条款",
    errUnreadable: "无法读取照片，请重新拍摄", errTooLarge: "照片过大，请重新拍摄", errUpload: "照片保存失败，请检查网络后重试",
    errSubmit: "发送失败，请检查网络后重试",
    legal: "依据旅馆业法第6条、住宅住宿事业法第8条进行的身份核验。",
  },
};

interface Shot { fileId: string; previewUrl: string }

interface Geo { status: "ok" | "denied" | "unavailable"; lat?: number; lng?: number; accuracy?: number }

function detectLang(): Lang {
  const l = (typeof navigator !== "undefined" ? navigator.language : "ja").toLowerCase();
  if (l.startsWith("ja")) return "ja";
  if (l.startsWith("ko")) return "ko";
  if (l.startsWith("zh")) return "zh";
  return "en";
}

// 位置情報は 1 回だけ。getCurrentPosition の timeout は許可ダイアログの待ち時間を含まないので、
// 別のタイマーで 10 秒経ったら「取得不可」として送信を進める（位置情報は任意・送信を止めない）
const GEO_WAIT_MS = 10_000;
function getGeo(): Promise<Geo> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return resolve({ status: "unavailable" });
    let settled = false;
    const done = (g: Geo) => { if (!settled) { settled = true; clearTimeout(timer); resolve(g); } };
    const timer = setTimeout(() => done({ status: "unavailable" }), GEO_WAIT_MS);
    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => done({ status: "ok", lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }),
        (err) => done({ status: err.code === 1 ? "denied" : "unavailable" }),
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
      );
    } catch {
      done({ status: "unavailable" });
    }
  });
}

const inputCls = "w-full rounded-switch-md border border-switch-stone-border bg-white px-3.5 py-3 text-[16px] text-switch-charcoal placeholder:text-switch-stone-text-disabled focus:outline-none focus:border-switch-teal focus:ring-2 focus:ring-switch-teal/20 transition-colors";
const labelCls = "block text-[13px] font-semibold text-switch-charcoal mb-1.5";

export default function CheckinVerifyForm(props: { invalid?: boolean; propertyId?: string; propertyName?: string; propertyNameEn?: string }) {
  const [lang, setLang] = useState<Lang>("ja");
  useEffect(() => { setLang(detectLang()); }, []);
  const t = T[lang];

  const [bookingRef, setBookingRef] = useState("");
  const [useName, setUseName] = useState(false);
  const [lastName, setLastName] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [shots, setShots] = useState<Shot[]>([]);
  const [busy, setBusy] = useState(false);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [receiptId, setReceiptId] = useState("");

  const propertyLabel = useMemo(() => {
    if (!props.propertyName) return "";
    return lang !== "ja" && props.propertyNameEn ? props.propertyNameEn : props.propertyName;
  }, [lang, props.propertyName, props.propertyNameEn]);

  const langToggle = (
    <div className="inline-flex rounded-pill border border-white/25 overflow-hidden text-[12px] font-semibold tracking-wide">
      {(Object.keys(T) as Lang[]).map((l) => (
        <button key={l} type="button" onClick={() => setLang(l)}
          className={`px-2.5 py-1.5 text-center whitespace-nowrap transition-colors ${lang === l ? "bg-white text-switch-charcoal" : "text-white/70 hover:text-white"}`}>
          {T[l].label}
        </button>
      ))}
    </div>
  );

  const header = (
    <header className="bg-switch-charcoal">
      <div className="max-w-xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
        <img src="/images/switch/logo-lockup.png" alt="SEKAI STAY" className="h-[22px] w-auto invert shrink-0" />
        {langToggle}
      </div>
    </header>
  );

  if (props.invalid) {
    return (
      <div className="min-h-screen bg-switch-cloud">
        {header}
        <main className="max-w-xl mx-auto px-5 py-10">
          <h1 className="text-[22px] font-bold text-switch-charcoal mb-3">{t.invalidTitle}</h1>
          <p className="text-[15px] text-switch-gray-dark leading-relaxed">{t.invalidBody}</p>
        </main>
      </div>
    );
  }

  async function onPhoto(file: File | null) {
    if (!file || shots.length >= MAX_PHOTOS) return;
    setError("");
    setBusy(true);
    const ref = bookingRef; // テレメトリには予約番号だけ（姓は送らない）
    try {
      const source = await readIntoMemory(file);
      if (!source) {
        setError(t.errUnreadable);
        reportFailure("read", "UNREADABLE", `checkin ${file.type || "(no type)"} ${file.size}B`, ref);
        return;
      }
      let compressed: File;
      try {
        // 身分証の文字が読める解像度を残す（旅券写しと同じ 1600px/450KB 目安）
        const r = await compressImage(source, 1600, 450_000, "checkin.jpg");
        compressed = r.file;
        if (!r.compressed) reportFailure("compress-fallback", "ORIGINAL_SENT", `checkin ${source.type || "(no type)"} ${source.size}B`, ref);
      } catch {
        setError(t.errTooLarge);
        reportFailure("compress", "TOO_LARGE", `checkin ${file.type || "(no type)"} ${file.size}B`, ref);
        return;
      }
      try {
        const fileId = await uploadPhoto(compressed);
        setShots((prev) => [...prev, { fileId, previewUrl: URL.createObjectURL(compressed) }]);
      } catch (e) {
        setError(t.errUpload);
        reportFailure("upload", String((e as Error)?.message || e), `checkin ${compressed.type} ${compressed.size}B (orig ${file.size}B)`, ref);
      }
    } finally {
      setBusy(false);
    }
  }

  function removeShot(i: number) {
    setShots((prev) => {
      URL.revokeObjectURL(prev[i].previewUrl);
      return prev.filter((_, j) => j !== i);
    });
  }

  // 表示中の入力方式だけを検証・送信する（切り替え前の値は使わない）
  function validate(): string | null {
    const ok = useName
      ? lastName.trim().length > 0 && /^\d{4}-\d{2}-\d{2}$/.test(arrivalDate)
      : /^[A-Za-z0-9]{1,20}$/.test(bookingRef.trim());
    if (!ok) return t.errBooking;
    if (shots.length === 0) return t.errPhoto;
    if (!consent) return t.errConsent;
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) { setError(v); return; }
    setSubmitting(true);
    try {
      const geo = await getGeo();
      const res = await fetch("/api/checkin-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website: "",
          payload: {
            propertyId: props.propertyId,
            bookingRef: useName ? "" : bookingRef.trim(),
            lastName: useName ? lastName.trim() : "",
            arrivalDate: useName ? arrivalDate : "",
            photoFileIds: shots.map((s) => s.fileId),
            geo,
          },
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; receiptId?: string; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || t.errSubmit);
        reportFailure("submit", data.error || `HTTP ${res.status}`, "checkin", bookingRef);
        return;
      }
      setReceiptId(data.receiptId || "");
    } catch (e) {
      setError(t.errSubmit);
      reportFailure("submit", String((e as Error)?.message || e), "checkin fetch threw", bookingRef);
    } finally {
      setSubmitting(false);
    }
  }

  const sectionHead = (num: string, title: string) => (
    <div className="flex items-baseline gap-3 mb-4">
      <span className="font-mono-editorial text-[11px] tracking-ticker text-switch-teal-deep/70">{num}</span>
      <h2 className="text-[19px] font-bold text-switch-charcoal tracking-tight">{title}</h2>
      <span className="flex-1 h-px bg-switch-stone-border translate-y-[-4px]" />
    </div>
  );

  if (receiptId) {
    return (
      <div className="min-h-screen bg-switch-cloud">
        {header}
        <main className="max-w-xl mx-auto px-5 py-10">
          <div className="rounded-switch-lg border border-switch-teal bg-switch-teal-tint p-6">
            <h1 className="text-[22px] font-bold text-switch-teal-deep mb-2">✓ {t.doneTitle}</h1>
            <p className="text-[15px] text-switch-charcoal leading-relaxed mb-4">{t.doneBody}</p>
            <p className="text-[13px] text-switch-gray-mid">{t.receipt}: <span className="font-mono-editorial text-switch-charcoal">{receiptId}</span></p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-switch-cloud">
      {header}
      <main className="max-w-xl mx-auto px-5 py-8">
        <h1 className="text-[24px] font-bold text-switch-charcoal tracking-tight mb-1">{t.title}</h1>
        {propertyLabel && <p className="text-[13px] text-switch-gray-mid mb-3">{t.property}: <span className="text-switch-charcoal font-semibold">{propertyLabel}</span></p>}
        <p className="text-[15px] text-switch-gray-dark leading-relaxed mb-8">{t.lead}</p>

        <form onSubmit={onSubmit} noValidate>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          {/* 送信中（位置情報の取得待ちを含む・最大 10 秒）は全入力を止め、開始時の値と違う内容が送られないようにする（Codex 2 巡目） */}
          <fieldset disabled={submitting} className="space-y-10 min-w-0 border-0 p-0 m-0">

          <section>
            {sectionHead("01", t.step1)}
            {!useName ? (
              <div>
                <label htmlFor="bookingRef" className={labelCls}>{t.bookingRef}</label>
                <input id="bookingRef" autoCapitalize="characters" autoComplete="off" className={inputCls} value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 20))} placeholder="12345678 / HMABC12345" />
                <p className="mt-1.5 text-[12px] text-switch-gray-mid">{t.bookingRefHint}</p>
                <button type="button" onClick={() => setUseName(true)} className="mt-3 text-[13px] text-switch-teal-deep underline underline-offset-2">{t.noBooking}</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lastName" className={labelCls}>{t.lastName}</label>
                  <input id="lastName" className={inputCls} value={lastName} onChange={(e) => setLastName(e.target.value.slice(0, 100))} autoComplete="family-name" />
                </div>
                <div>
                  <label htmlFor="arrivalDate" className={labelCls}>{t.arrivalDate}</label>
                  <input id="arrivalDate" type="date" className={inputCls} value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} />
                </div>
                <button type="button" onClick={() => setUseName(false)} className="text-left text-[13px] text-switch-teal-deep underline underline-offset-2 sm:col-span-2">{t.bookingRef} →</button>
              </div>
            )}
          </section>

          <section>
            {sectionHead("02", t.step2)}
            <p className="text-[14px] text-switch-gray-dark leading-relaxed mb-3">{t.photoWhy}</p>
            <div className="flex gap-4 items-start mb-4">
              <svg viewBox="0 0 120 90" className="w-[120px] h-[90px] shrink-0" aria-hidden="true">
                <rect x="1" y="1" width="118" height="88" rx="6" fill="#ffffff" stroke="#d6d3d0" />
                <circle cx="42" cy="34" r="13" fill="#e5f4f5" stroke="#259da3" strokeWidth="2" />
                <path d="M20 78c3-14 12-22 22-22s19 8 22 22" fill="#e5f4f5" stroke="#259da3" strokeWidth="2" />
                <rect x="72" y="28" width="36" height="24" rx="3" fill="#ffffff" stroke="#167b81" strokeWidth="2" />
                <circle cx="81" cy="38" r="4" fill="#259da3" />
                <rect x="88" y="34" width="16" height="2.5" fill="#aaa69f" />
                <rect x="88" y="40" width="12" height="2.5" fill="#aaa69f" />
                <rect x="76" y="46" width="28" height="2.5" fill="#aaa69f" />
              </svg>
              <ul className="text-[13px] text-switch-gray-dark leading-relaxed list-disc pl-4 min-w-0">
                {t.photoTips.map((tip) => <li key={tip}>{tip}</li>)}
              </ul>
            </div>

            {shots.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {shots.map((s, i) => (
                  <div key={s.fileId} className="relative rounded-switch-md overflow-hidden border border-switch-teal bg-white">
                    <img src={s.previewUrl} alt="" className="w-full aspect-[3/4] object-cover" />
                    <button type="button" onClick={() => removeShot(i)}
                      className="absolute top-1.5 right-1.5 rounded-pill bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-switch-charcoal border border-switch-stone-border">
                      {t.remove}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {shots.length < MAX_PHOTOS && (
              <label className={`inline-flex items-center gap-2 rounded-switch-md px-5 py-3 text-[15px] font-semibold cursor-pointer transition-colors ${shots.length === 0 ? "bg-switch-teal text-white hover:bg-switch-teal-deep" : "border border-switch-stone-border bg-white text-switch-charcoal hover:bg-switch-stone-over"}`}>
                <input type="file" accept="image/*" capture="user" className="hidden" disabled={busy}
                  onClick={(e) => { (e.target as HTMLInputElement).value = ""; }}
                  onChange={(e) => onPhoto(e.target.files?.[0] || null)} />
                {busy ? t.uploading : shots.length === 0 ? `📷 ${t.take}` : `+ ${t.addPerson}`}
              </label>
            )}
          </section>

          <section>
            {sectionHead("03", t.step3)}
            <label className="flex items-start gap-3 text-[13px] text-switch-gray-dark leading-relaxed mb-5">
              <input id="consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-switch-teal" />
              <span>{t.consent}</span>
            </label>
            {error && <p className="mb-4 rounded-switch-md border border-danger-border bg-danger-bg px-4 py-3 text-[13px] text-danger" role="alert">{error}</p>}
            <button type="submit" disabled={submitting || busy}
              className="w-full rounded-switch-md bg-switch-teal px-5 py-3.5 text-[16px] font-bold text-white hover:bg-switch-teal-deep disabled:opacity-50 transition-colors">
              {submitting ? t.submitting : t.submit}
            </button>
            <p className="mt-4 text-[11.5px] text-switch-gray-mid leading-relaxed">{t.legal}</p>
          </section>
          </fieldset>
        </form>
      </main>
    </div>
  );
}
