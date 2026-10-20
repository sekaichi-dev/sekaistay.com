"use client";

/* チェックイン時の本人確認（/checkin/<物件ID>・鍵は /c/<物件ID> が置いた httpOnly Cookie）
 * 入口は 2 つ: 室内 QR と、予約ごとのリンク（bookingId あり・2026-10-19）。リンクは予約が決まっているので予約の入力を省き、
 * 位置情報を必須にする（拒否・取得不可なら送らない。物件からの距離はサーバーが判定する）
 * 保健所要件（Yugo 2026-10-12）に合わせた 1 画面:
 *  - 到着後なるべく早く（遅くともチェックアウトまでに）送ってもらう（チェックイン前には強制しない・テンイチ 2026-10-13 / 10-20）
 *  - 予約の特定（予約番号 or 姓＋到着日）
 *  - 宿泊者全員分: 1 人ずつ氏名・居住地（国内/国外）・顔の横に身分証を持った自撮り。国外居住は旅券の顔写真ページも別に撮る
 *  - 撮影は画面内カメラ（getUserMedia）でその場撮影のみ。カメラロールからの選択はできない。
 *    カメラ API が無い端末だけ「カメラ直接起動」のファイル選択に落とし、その事実（method=file）を送る
 *  - 位置情報は送信時に 1 回だけ求める。QR は拒否・取得不可でも送信は止めない（結果だけ記録する）。リンクは必須
 * 写真は名簿フォームと同じく撮った時点で Drive の受付中フォルダへ直接置き、送信にはファイル ID だけを送る。
 * 言語は日・英・韓・中（端末の言語で初期選択）。
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { compressImage, readIntoMemory, reportFailure, uploadPhoto } from "@/components/guest-register/photo-upload";

type Lang = "ja" | "en" | "ko" | "zh";
type Kind = "selfie" | "passport";
const MAX_GUESTS = 8;

const T: Record<Lang, {
  label: string; title: string; property: string; lead: string;
  leadLink: string; geoNote: string; errGeo: string;
  step1: string; bookingRef: string; bookingRefHint: string; noBooking: string; lastName: string; arrivalDate: string;
  step2: string; allGuests: string; guestN: (n: number) => string; name: string; nameHint: string;
  residence: string; resJa: string; resAbroad: string;
  selfie: string; selfieWhy: string; selfieTips: string[]; passport: string; passportWhy: string;
  take: string; retake: string; addGuest: string; removeGuest: string; uploading: string;
  camTitle: (k: Kind) => string; camShutter: string; camClose: string; camDenied: string; camUnavailable: string; camFallback: string;
  step3: string; consent: string; submit: string; submitting: string;
  doneTitle: string; doneBody: string; receipt: string;
  invalidTitle: string; invalidBody: string;
  errBooking: string; errName: (n: number) => string; errResidence: (n: number) => string; errSelfie: (n: number) => string; errPassport: (n: number) => string;
  errConsent: string; errUnreadable: string; errTooLarge: string; errUpload: string; errSubmit: string;
  legal: string;
}> = {
  ja: {
    label: "日本語", title: "チェックイン時の本人確認", property: "ご宿泊施設",
    lead: "法令に基づき、ご宿泊の方全員の本人確認をお願いしています。ご到着後なるべくお早めに（遅くともチェックアウトまでに）、お部屋でお一人ずつ「顔の横に身分証を持った写真」をその場で撮影してください。",
    leadLink: "法令に基づき、ご宿泊の方全員の本人確認をお願いしています。ご到着後なるべくお早めに（遅くともチェックアウトまでに）、お部屋（またはお宿のすぐ近く）でお一人ずつ「顔の横に身分証を持った写真」をその場で撮影してください。",
    geoNote: "送信時に、お宿にいることの確認のため位置情報の利用を許可してください。",
    errGeo: "位置情報を取得できませんでした。ブラウザの設定で位置情報を許可して、お部屋またはお宿のすぐ近くでもう一度送信してください。許可できない場合は、お部屋に掲示のQRコードからお送りください。",
    step1: "ご予約の確認", bookingRef: "予約番号", bookingRefHint: "予約確認メールやアプリに記載の番号です（Airbnb は HM で始まる確認コード）", noBooking: "予約番号がわからない場合は、姓と到着日を入力してください",
    lastName: "姓", arrivalDate: "到着日",
    step2: "宿泊者全員の写真", allGuests: "宿泊される方全員分が必要です。お一人ずつ追加してください。", guestN: (n) => `宿泊者 ${n}`,
    name: "氏名（身分証のとおり）", nameHint: "パスポートや免許証に記載の表記で",
    residence: "日本国内にお住まいですか", resJa: "国内に住所がある", resAbroad: "国外に住んでいる",
    selfie: "顔＋身分証の写真", selfieWhy: "顔の横に身分証を持って撮影します。国外にお住まいの方はパスポートをお持ちください。",
    selfieTips: ["顔と身分証が同じ画面に入るように", "身分証の文字が読めるまで近づけて", "明るい場所で、マスクやサングラスは外して"],
    passport: "パスポートの顔写真ページ", passportWhy: "写しの保管が法令で求められています。ページ全体が枠に入るように撮影してください。",
    take: "カメラで撮影する", retake: "撮り直す", addGuest: "宿泊者を追加", removeGuest: "この宿泊者を削除", uploading: "保存中…",
    camTitle: (k) => (k === "selfie" ? "顔の横に身分証を持ってください" : "パスポートの顔写真ページを枠に入れてください"),
    camShutter: "撮影", camClose: "閉じる",
    camDenied: "カメラの使用が許可されていません。ブラウザの設定でカメラを許可してから、もう一度お試しください。",
    camUnavailable: "カメラを起動できませんでした。別のブラウザ（Safari / Chrome）でお試しください。",
    camFallback: "この端末ではカメラを直接起動して撮影します。",
    step3: "送信", consent: "写真は宿泊者名簿とともに3年間保管され、行政機関の求めに応じて提示されることに同意します。",
    submit: "送信する", submitting: "送信中…",
    doneTitle: "本人確認を受け付けました", doneBody: "ご協力ありがとうございます。どうぞごゆっくりお過ごしください。", receipt: "受付番号",
    invalidTitle: "このQRコード・リンクは無効です", invalidBody: "お部屋に掲示されているQRコードを読み取るか、ご案内したリンクをもう一度開いてください。解決しない場合は運営までご連絡ください。",
    errBooking: "予約番号、または姓と到着日を入力してください",
    errName: (n) => `宿泊者 ${n}: 氏名を入力してください`, errResidence: (n) => `宿泊者 ${n}: お住まいを選択してください`,
    errSelfie: (n) => `宿泊者 ${n}: 顔＋身分証の写真を撮影してください`, errPassport: (n) => `宿泊者 ${n}: パスポートの顔写真ページを撮影してください`,
    errConsent: "保管への同意をお願いします",
    errUnreadable: "写真を読み込めませんでした。もう一度撮影してください", errTooLarge: "写真が大きすぎます。もう一度撮影してください", errUpload: "写真の保存に失敗しました。通信環境をご確認のうえ、もう一度お試しください",
    errSubmit: "送信に失敗しました。通信環境をご確認のうえ、もう一度お試しください",
    legal: "旅館業法第6条・住宅宿泊事業法第8条に基づく本人確認です。",
  },
  en: {
    label: "EN", title: "ID check at check-in", property: "Property",
    lead: "Japanese law requires us to verify every guest. As soon as possible after you arrive (at the latest before check-out), each guest takes one photo in the room, on the spot, holding their ID next to their face.",
    leadLink: "Japanese law requires us to verify every guest. As soon as possible after you arrive (at the latest before check-out), each guest takes one photo on the spot, in the room or right outside the property, holding their ID next to their face.",
    geoNote: "When you send, please allow location access so we can confirm you are at the property.",
    errGeo: "We could not get your location. Please allow location access in your browser settings and send again from your room or right outside the property. If you cannot, use the QR code posted in your room.",
    step1: "Your booking", bookingRef: "Booking number", bookingRefHint: "The number in your confirmation email or app (Airbnb: the code starting with HM)", noBooking: "If you don't know it, enter your last name and arrival date instead",
    lastName: "Last name", arrivalDate: "Arrival date",
    step2: "Photos of every guest", allGuests: "Required for every guest staying. Add each person below.", guestN: (n) => `Guest ${n}`,
    name: "Full name (as on ID)", nameHint: "Exactly as printed on your passport or licence",
    residence: "Do you live in Japan?", resJa: "I have an address in Japan", resAbroad: "I live outside Japan",
    selfie: "Face + ID photo", selfieWhy: "Hold your ID next to your face. Guests living outside Japan: use your passport.",
    selfieTips: ["Face and ID in the same frame", "Close enough that the ID text is readable", "Good light, no mask or sunglasses"],
    passport: "Passport photo page", passportWhy: "A copy is required by law. Fit the whole page in the frame.",
    take: "Open camera", retake: "Retake", addGuest: "Add a guest", removeGuest: "Remove this guest", uploading: "Saving…",
    camTitle: (k) => (k === "selfie" ? "Hold your ID next to your face" : "Fit the passport photo page in the frame"),
    camShutter: "Take photo", camClose: "Close",
    camDenied: "Camera access is not allowed. Please allow the camera in your browser settings and try again.",
    camUnavailable: "Could not start the camera. Please try another browser (Safari / Chrome).",
    camFallback: "On this device the camera opens directly to take the photo.",
    step3: "Send", consent: "I agree that these photos are kept with the guest register for 3 years and shown to authorities on request.",
    submit: "Send", submitting: "Sending…",
    doneTitle: "ID check received", doneBody: "Thank you. Enjoy your stay.", receipt: "Receipt number",
    invalidTitle: "This QR code or link is not valid", invalidBody: "Please scan the QR code posted in your room, or open the link we sent you again. If it still fails, contact us.",
    errBooking: "Enter your booking number, or your last name and arrival date",
    errName: (n) => `Guest ${n}: please enter the full name`, errResidence: (n) => `Guest ${n}: please select where you live`,
    errSelfie: (n) => `Guest ${n}: please take the face + ID photo`, errPassport: (n) => `Guest ${n}: please photograph the passport photo page`,
    errConsent: "Please agree to the retention terms",
    errUnreadable: "We could not read the photo. Please take it again", errTooLarge: "The photo is too large. Please take it again", errUpload: "Could not save the photo. Check your connection and try again",
    errSubmit: "Sending failed. Check your connection and try again",
    legal: "Required under the Hotel Business Act (Art. 6) and the Private Lodging Business Act (Art. 8).",
  },
  ko: {
    label: "한국어", title: "체크인 본인 확인", property: "숙박 시설",
    lead: "일본 법령에 따라 투숙객 전원의 본인 확인을 부탁드립니다. 도착 후 가능한 한 빨리(늦어도 체크아웃 전까지) 객실에서 한 분씩 얼굴 옆에 신분증을 들고 그 자리에서 사진을 찍어 주세요.",
    leadLink: "일본 법령에 따라 투숙객 전원의 본인 확인을 부탁드립니다. 도착 후 가능한 한 빨리(늦어도 체크아웃 전까지) 객실(또는 숙소 바로 앞)에서 한 분씩 얼굴 옆에 신분증을 들고 그 자리에서 사진을 찍어 주세요.",
    geoNote: "전송할 때 숙소에 계신지 확인하기 위해 위치 정보 사용을 허용해 주세요.",
    errGeo: "위치 정보를 가져올 수 없습니다. 브라우저 설정에서 위치 정보를 허용한 후 객실 또는 숙소 바로 앞에서 다시 전송해 주세요. 허용할 수 없는 경우 객실에 게시된 QR 코드로 보내 주세요.",
    step1: "예약 확인", bookingRef: "예약번호", bookingRefHint: "예약 확인 메일이나 앱에 적힌 번호입니다(Airbnb는 HM으로 시작하는 확인 코드)", noBooking: "예약번호를 모르면 성과 도착일을 입력하세요",
    lastName: "성", arrivalDate: "도착일",
    step2: "투숙객 전원의 사진", allGuests: "투숙하는 모든 분이 필요합니다. 한 분씩 추가하세요.", guestN: (n) => `투숙객 ${n}`,
    name: "이름(신분증 표기대로)", nameHint: "여권이나 면허증에 적힌 표기로",
    residence: "일본에 거주하십니까", resJa: "일본에 주소가 있음", resAbroad: "일본 외 거주",
    selfie: "얼굴＋신분증 사진", selfieWhy: "얼굴 옆에 신분증을 들고 촬영합니다. 일본 외 거주자는 여권을 사용해 주세요.",
    selfieTips: ["얼굴과 신분증이 한 화면에 들어오게", "신분증 글자가 읽힐 만큼 가까이", "밝은 곳에서, 마스크·선글라스는 벗고"],
    passport: "여권 사진면", passportWhy: "법령상 사본 보관이 필요합니다. 페이지 전체가 틀에 들어오게 촬영하세요.",
    take: "카메라로 촬영", retake: "다시 찍기", addGuest: "투숙객 추가", removeGuest: "이 투숙객 삭제", uploading: "저장 중…",
    camTitle: (k) => (k === "selfie" ? "얼굴 옆에 신분증을 들어 주세요" : "여권 사진면을 틀에 맞춰 주세요"),
    camShutter: "촬영", camClose: "닫기",
    camDenied: "카메라 사용이 허용되지 않았습니다. 브라우저 설정에서 카메라를 허용한 후 다시 시도하세요.",
    camUnavailable: "카메라를 시작할 수 없습니다. 다른 브라우저(Safari / Chrome)로 시도하세요.",
    camFallback: "이 기기에서는 카메라를 직접 열어 촬영합니다.",
    step3: "전송", consent: "사진이 숙박자 명부와 함께 3년간 보관되며 행정기관의 요청 시 제시되는 것에 동의합니다.",
    submit: "전송", submitting: "전송 중…",
    doneTitle: "본인 확인을 접수했습니다", doneBody: "협조해 주셔서 감사합니다. 편안한 시간 보내세요.", receipt: "접수번호",
    invalidTitle: "이 QR 코드 또는 링크는 유효하지 않습니다", invalidBody: "객실에 게시된 QR 코드를 스캔하거나 안내해 드린 링크를 다시 열어 주세요. 해결되지 않으면 운영팀에 연락해 주세요.",
    errBooking: "예약번호 또는 성과 도착일을 입력하세요",
    errName: (n) => `투숙객 ${n}: 이름을 입력하세요`, errResidence: (n) => `투숙객 ${n}: 거주지를 선택하세요`,
    errSelfie: (n) => `투숙객 ${n}: 얼굴＋신분증 사진을 촬영하세요`, errPassport: (n) => `투숙객 ${n}: 여권 사진면을 촬영하세요`,
    errConsent: "보관에 동의해 주세요",
    errUnreadable: "사진을 읽을 수 없습니다. 다시 촬영하세요", errTooLarge: "사진이 너무 큽니다. 다시 촬영하세요", errUpload: "사진 저장에 실패했습니다. 통신 상태를 확인하고 다시 시도하세요",
    errSubmit: "전송에 실패했습니다. 통신 상태를 확인하고 다시 시도하세요",
    legal: "여관업법 제6조·주택숙박사업법 제8조에 따른 본인 확인입니다.",
  },
  zh: {
    label: "中文", title: "入住身份核验", property: "住宿设施",
    lead: "根据日本法律，需对全部住客进行身份核验。请在抵达后尽早（最迟于退房前），于房间内由每位住客将证件举在脸旁当场拍一张照片。",
    leadLink: "根据日本法律，需对全部住客进行身份核验。请在抵达后尽早（最迟于退房前），于房间内（或住宿设施门口）由每位住客将证件举在脸旁当场拍一张照片。",
    geoNote: "发送时，请允许使用位置信息，以确认您在住宿设施。",
    errGeo: "无法获取位置信息。请在浏览器设置中允许位置信息，并在房间内或住宿设施门口重新发送。如无法允许，请通过房间内张贴的二维码发送。",
    step1: "确认预订", bookingRef: "预订号", bookingRefHint: "预订确认邮件或App中的编号（Airbnb为以HM开头的确认码）", noBooking: "不知道预订号时，请输入姓氏和到达日期",
    lastName: "姓氏", arrivalDate: "到达日期",
    step2: "全部住客的照片", allGuests: "需要全部住客的照片。请逐一添加。", guestN: (n) => `住客 ${n}`,
    name: "姓名（与证件一致）", nameHint: "按护照或驾照上的写法",
    residence: "您是否居住在日本", resJa: "在日本有住址", resAbroad: "居住在日本以外",
    selfie: "脸部＋证件照片", selfieWhy: "将证件举在脸旁拍摄。居住在日本以外的旅客请使用护照。",
    selfieTips: ["脸部与证件在同一画面内", "靠近到能看清证件文字", "在明亮处拍摄，摘下口罩和墨镜"],
    passport: "护照照片页", passportWhy: "法律要求保存复印件。请将整页放入取景框内拍摄。",
    take: "打开相机拍摄", retake: "重拍", addGuest: "添加住客", removeGuest: "删除此住客", uploading: "保存中…",
    camTitle: (k) => (k === "selfie" ? "请将证件举在脸旁" : "请将护照照片页放入取景框"),
    camShutter: "拍摄", camClose: "关闭",
    camDenied: "未允许使用相机。请在浏览器设置中允许相机后重试。",
    camUnavailable: "无法启动相机。请尝试其他浏览器（Safari / Chrome）。",
    camFallback: "此设备将直接打开相机进行拍摄。",
    step3: "发送", consent: "我同意照片与住宿者名簿一同保存3年，并应行政机关要求出示。",
    submit: "发送", submitting: "发送中…",
    doneTitle: "已受理身份核验", doneBody: "感谢配合，祝您入住愉快。", receipt: "受理编号",
    invalidTitle: "此二维码或链接无效", invalidBody: "请扫描房间内张贴的二维码，或重新打开我们发送的链接。若仍无法使用，请联系我们。",
    errBooking: "请输入预订号，或姓氏和到达日期",
    errName: (n) => `住客 ${n}: 请输入姓名`, errResidence: (n) => `住客 ${n}: 请选择居住地`,
    errSelfie: (n) => `住客 ${n}: 请拍摄脸部＋证件照片`, errPassport: (n) => `住客 ${n}: 请拍摄护照照片页`,
    errConsent: "请同意保存条款",
    errUnreadable: "无法读取照片，请重新拍摄", errTooLarge: "照片过大，请重新拍摄", errUpload: "照片保存失败，请检查网络后重试",
    errSubmit: "发送失败，请检查网络后重试",
    legal: "依据旅馆业法第6条、住宅住宿事业法第8条进行的身份核验。",
  },
};

interface Shot { fileId: string; previewUrl: string; method: "camera" | "file" }

interface GuestForm {
  /** 不変の宿泊者 ID。写真の保存完了を「どの宿泊者に付けるか」はこの ID で決める（添字だと保存中の削除で別人に付く・Codex P1） */
  id: number;
  name: string;
  jaResident: boolean | null;
  selfie: Shot | null;
  passport: Shot | null;
}

interface Geo { status: "ok" | "denied" | "unavailable"; lat?: number; lng?: number; accuracy?: number }

let nextGuestId = 1;
const emptyGuest = (): GuestForm => ({ id: nextGuestId++, name: "", jaResident: null, selfie: null, passport: null });

function detectLang(): Lang {
  const l = (typeof navigator !== "undefined" ? navigator.language : "ja").toLowerCase();
  if (l.startsWith("ja")) return "ja";
  if (l.startsWith("ko")) return "ko";
  if (l.startsWith("zh")) return "zh";
  return "en";
}

function hasCameraApi(): boolean {
  return typeof navigator !== "undefined" && !!navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === "function";
}

// 位置情報は 1 回だけ。getCurrentPosition の timeout は許可ダイアログの待ち時間を含まないので、
// 別のタイマーで待ちを打ち切る。QR は 10 秒で「取得不可」として送信を進める（任意）。
// リンクは距離を判定するので高精度・キャッシュなしで取り、屋内の測位に時間がかかる分 20 秒待つ
function getGeo(required: boolean): Promise<Geo> {
  const waitMs = required ? 20_000 : 10_000;
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return resolve({ status: "unavailable" });
    let settled = false;
    const done = (g: Geo) => { if (!settled) { settled = true; clearTimeout(timer); resolve(g); } };
    const timer = setTimeout(() => done({ status: "unavailable" }), waitMs);
    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => done({ status: "ok", lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }),
        (err) => done({ status: err.code === 1 ? "denied" : "unavailable" }),
        required ? { enableHighAccuracy: true, timeout: 18_000, maximumAge: 0 } : { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
      );
    } catch {
      done({ status: "unavailable" });
    }
  });
}

/** 画面内カメラ。ライブ映像をそのまま canvas に写して JPEG にする（ファイル選択を経由しない＝カメラロールから選べない）。 */
function CameraCapture({ kind, t, onCapture, onClose }: { kind: Kind; t: (typeof T)[Lang]; onCapture: (file: File) => void; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // 撮影は 1 セッション 1 回だけ採用する。閉じた後や 2 回目以降の toBlob 完了は捨てる（連打・閉じた後の上書き防止・Codex P2）
  const takenRef = useRef(false);
  const closedRef = useRef(false);
  const [state, setState] = useState<"starting" | "ready" | "denied" | "unavailable">("starting");

  useEffect(() => {
    let cancelled = false;
    // 開発モードでは effect が「実行→片付け→再実行」と走るので、ここで印を戻す（片付けで closed=true のままだと撮影できない）
    closedRef.current = false;
    takenRef.current = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: kind === "selfie" ? "user" : "environment", width: { ideal: 1600 }, height: { ideal: 1200 } },
          audio: false,
        });
        if (cancelled) { stream.getTracks().forEach((tr) => tr.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setState("ready");
      } catch (e) {
        const name = (e as { name?: string })?.name || "";
        setState(name === "NotAllowedError" || name === "SecurityError" ? "denied" : "unavailable");
      }
    })();
    return () => {
      cancelled = true;
      closedRef.current = true;
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    };
  }, [kind]);

  function shoot() {
    const video = videoRef.current;
    if (!video || !video.videoWidth || takenRef.current || closedRef.current) return;
    takenRef.current = true;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (closedRef.current) return; // 閉じた後に届いた結果は採用しない
      if (!blob) { takenRef.current = false; return; }
      closedRef.current = true;
      onCapture(new File([blob], `${kind}.jpg`, { type: "image/jpeg" }));
    }, "image/jpeg", 0.92);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col" role="dialog" aria-modal="true">
      <div className="px-5 pt-5 pb-3 text-white text-[15px] font-semibold text-center">{t.camTitle(kind)}</div>
      <div className="flex-1 flex items-center justify-center min-h-0 px-3">
        {state === "denied" || state === "unavailable" ? (
          <p className="text-white/90 text-[14px] leading-relaxed text-center max-w-sm">{state === "denied" ? t.camDenied : t.camUnavailable}</p>
        ) : (
          <div className="relative w-full max-w-md aspect-[3/4] bg-black rounded-switch-lg overflow-hidden">
            <video ref={videoRef} playsInline muted autoPlay className={`w-full h-full object-cover ${kind === "selfie" ? "-scale-x-100" : ""}`} />
            {/* ガイド枠: 自撮りは顔（左）と身分証（右）、旅券は横長の枠 */}
            {kind === "selfie" ? (
              <>
                <div className="absolute left-[8%] top-[22%] w-[42%] h-[40%] rounded-full border-2 border-white/70" />
                <div className="absolute right-[6%] top-[34%] w-[40%] h-[22%] rounded-md border-2 border-switch-teal-bright" />
              </>
            ) : (
              <div className="absolute left-[6%] right-[6%] top-[28%] h-[44%] rounded-md border-2 border-switch-teal-bright" />
            )}
          </div>
        )}
      </div>
      <div className="px-5 pb-8 pt-4 flex items-center justify-center gap-4">
        <button type="button" onClick={() => { closedRef.current = true; onClose(); }} className="rounded-pill border border-white/40 px-5 py-3 text-[14px] font-semibold text-white">{t.camClose}</button>
        {state === "ready" && (
          <button type="button" onClick={shoot} className="rounded-pill bg-white px-8 py-3 text-[15px] font-bold text-switch-charcoal">● {t.camShutter}</button>
        )}
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-switch-md border border-switch-stone-border bg-white px-3.5 py-3 text-[16px] text-switch-charcoal placeholder:text-switch-stone-text-disabled focus:outline-none focus:border-switch-teal focus:ring-2 focus:ring-switch-teal/20 transition-colors";
const labelCls = "block text-[13px] font-semibold text-switch-charcoal mb-1.5";

export default function CheckinVerifyForm(props: { invalid?: boolean; propertyId?: string; propertyName?: string; propertyNameEn?: string; bookingId?: string }) {
  const [lang, setLang] = useState<Lang>("ja");
  // 予約ごとのリンクから来た（予約は決まっている・位置情報が必須）
  const viaLink = !!props.bookingId;
  useEffect(() => { setLang(detectLang()); }, []);
  const t = T[lang];

  const [bookingRef, setBookingRef] = useState("");
  const [useName, setUseName] = useState(false);
  const [lastName, setLastName] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [guests, setGuests] = useState<GuestForm[]>([emptyGuest()]);
  const [camera, setCamera] = useState<{ guestId: number; kind: Kind } | null>(null);
  const [busy, setBusy] = useState<string | null>(null); // `${guestId}:${kind}`
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [receiptId, setReceiptId] = useState("");
  const [cameraApi, setCameraApi] = useState(true);
  useEffect(() => { setCameraApi(hasCameraApi()); }, []);

  const propertyLabel = useMemo(() => {
    if (!props.propertyName) return "";
    return lang !== "ja" && props.propertyNameEn ? props.propertyNameEn : props.propertyName;
  }, [lang, props.propertyName, props.propertyNameEn]);

  const updateGuest = useCallback((guestId: number, patch: Partial<GuestForm>) => {
    setGuests((prev) => prev.map((g) => (g.id === guestId ? { ...g, ...patch } : g)));
  }, []);

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

  // 撮った写真（画面内カメラ or カメラ直接起動のファイル）を縮小して Drive へ置き、ファイル ID をカードに持つ。
  // 既存の写真は新しい写真の保存が成功したときだけ置き換える（撮り直しをキャンセルしても元の写真が残る・Codex P2）
  async function onPhoto(guestId: number, kind: Kind, file: File | null, method: "camera" | "file") {
    if (!file) return;
    setError("");
    const slot = `${guestId}:${kind}`;
    setBusy(slot);
    const ref = bookingRef;
    try {
      const source = await readIntoMemory(file);
      if (!source) {
        setError(t.errUnreadable);
        reportFailure("read", "UNREADABLE", `checkin ${kind} ${file.type || "(no type)"} ${file.size}B`, ref);
        return;
      }
      let compressed: File;
      try {
        // 身分証の文字が読める解像度を残す（旅券写しと同じ 1600px/450KB 目安）
        const r = await compressImage(source, 1600, 450_000, `${kind}.jpg`);
        compressed = r.file;
        if (!r.compressed) reportFailure("compress-fallback", "ORIGINAL_SENT", `checkin ${kind} ${source.type || "(no type)"} ${source.size}B`, ref);
      } catch {
        setError(t.errTooLarge);
        reportFailure("compress", "TOO_LARGE", `checkin ${kind} ${file.type || "(no type)"} ${file.size}B`, ref);
        return;
      }
      try {
        const fileId = await uploadPhoto(compressed);
        const shot: Shot = { fileId, previewUrl: URL.createObjectURL(compressed), method };
        setGuests((prev) => prev.map((g) => {
          if (g.id !== guestId) return g; // 保存中に削除された宿泊者なら捨てる（別人に付けない）
          const old = kind === "selfie" ? g.selfie : g.passport;
          if (old) URL.revokeObjectURL(old.previewUrl);
          return kind === "selfie" ? { ...g, selfie: shot } : { ...g, passport: shot };
        }));
      } catch (e) {
        setError(t.errUpload);
        reportFailure("upload", String((e as Error)?.message || e), `checkin ${kind} ${compressed.type} ${compressed.size}B (orig ${file.size}B)`, ref);
      }
    } finally {
      setBusy(null);
    }
  }

  function removeGuest(guestId: number) {
    setGuests((prev) => {
      const g = prev.find((x) => x.id === guestId);
      if (g?.selfie) URL.revokeObjectURL(g.selfie.previewUrl);
      if (g?.passport) URL.revokeObjectURL(g.passport.previewUrl);
      return prev.filter((x) => x.id !== guestId);
    });
  }

  // 表示中の入力方式だけを検証・送信する（切り替え前の値は使わない）
  function validate(): string | null {
    const ok = viaLink || (useName
      ? lastName.trim().length > 0 && /^\d{4}-\d{2}-\d{2}$/.test(arrivalDate)
      : /^[A-Za-z0-9]{1,20}$/.test(bookingRef.trim()));
    if (!ok) return t.errBooking;
    for (let i = 0; i < guests.length; i++) {
      const g = guests[i];
      if (!g.name.trim()) return t.errName(i + 1);
      if (g.jaResident === null) return t.errResidence(i + 1);
      if (!g.selfie) return t.errSelfie(i + 1);
      if (g.jaResident === false && !g.passport) return t.errPassport(i + 1);
    }
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
      const geo = await getGeo(viaLink);
      if (viaLink && geo.status !== "ok") {
        setError(t.errGeo);
        reportFailure("geo", geo.status.toUpperCase(), "checkin link", props.bookingId || "");
        return;
      }
      const res = await fetch("/api/checkin-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website: "",
          payload: {
            propertyId: props.propertyId,
            via: viaLink ? "link" : "qr",
            bookingRef: viaLink ? props.bookingId : useName ? "" : bookingRef.trim(),
            lastName: !viaLink && useName ? lastName.trim() : "",
            arrivalDate: !viaLink && useName ? arrivalDate : "",
            guests: guests.map((g) => ({
              name: g.name.trim(),
              jaResident: g.jaResident === true,
              selfieFileId: g.selfie?.fileId || "",
              passportFileId: g.jaResident === false ? g.passport?.fileId || "" : "",
              method: g.selfie?.method === "file" || g.passport?.method === "file" ? "file" : "camera",
            })),
            geo,
          },
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; receiptId?: string; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || t.errSubmit);
        reportFailure("submit", data.error || `HTTP ${res.status}`, viaLink ? "checkin link" : "checkin", viaLink ? props.bookingId || "" : bookingRef);
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

  // 撮影ボタン。カメラ API がある端末は画面内カメラ、無い端末だけカメラ直接起動のファイル選択（method=file を記録）
  const shotButton = (guestId: number, kind: Kind, shot: Shot | null) => {
    const slot = `${guestId}:${kind}`;
    const isBusy = busy === slot;
    const cls = `inline-flex items-center gap-2 rounded-switch-md px-4 py-2.5 text-[14px] font-semibold cursor-pointer transition-colors ${shot ? "border border-switch-stone-border bg-white text-switch-charcoal hover:bg-switch-stone-over" : "bg-switch-teal text-white hover:bg-switch-teal-deep"}`;
    const label = isBusy ? t.uploading : shot ? t.retake : `📷 ${t.take}`;
    if (cameraApi) {
      return (
        <button type="button" disabled={isBusy || !!busy} onClick={() => setCamera({ guestId, kind })} className={cls}>{label}</button>
      );
    }
    return (
      <label className={cls}>
        <input type="file" accept="image/*" capture={kind === "selfie" ? "user" : "environment"} className="hidden" disabled={isBusy || !!busy}
          onClick={(e) => { (e.target as HTMLInputElement).value = ""; }}
          onChange={(e) => onPhoto(guestId, kind, e.target.files?.[0] || null, "file")} />
        {label}
      </label>
    );
  };

  const preview = (shot: Shot | null, kind: Kind) => shot && (
    <img src={shot.previewUrl} alt="" className={`rounded-switch-md border border-switch-teal bg-white object-cover ${kind === "selfie" ? "w-[96px] aspect-[3/4]" : "w-[128px] aspect-[4/3]"}`} />
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
      {camera && (
        <CameraCapture
          kind={camera.kind}
          t={t}
          onClose={() => setCamera(null)}
          onCapture={(file) => { const c = camera; setCamera(null); void onPhoto(c.guestId, c.kind, file, "camera"); }}
        />
      )}
      <main className="max-w-xl mx-auto px-5 py-8">
        <h1 className="text-[24px] font-bold text-switch-charcoal tracking-tight mb-1">{t.title}</h1>
        {propertyLabel && <p className="text-[13px] text-switch-gray-mid mb-3">{t.property}: <span className="text-switch-charcoal font-semibold">{propertyLabel}</span></p>}
        <p className={`text-[15px] text-switch-gray-dark leading-relaxed ${viaLink ? "mb-2" : "mb-8"}`}>{viaLink ? t.leadLink : t.lead}</p>
        {viaLink && <p className="text-[13px] text-switch-gray-mid leading-relaxed mb-8">📍 {t.geoNote}</p>}

        <form onSubmit={onSubmit} noValidate>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          {/* 送信中（位置情報の取得待ちを含む・最大 10 秒）は全入力を止め、開始時の値と違う内容が送られないようにする */}
          <fieldset disabled={submitting} className="space-y-10 min-w-0 border-0 p-0 m-0">

          <section>
            {sectionHead("01", t.step1)}
            {viaLink ? (
              <p className="text-[14px] text-switch-gray-dark">{t.bookingRef}: <span className="font-mono-editorial text-switch-charcoal font-semibold">{props.bookingId}</span></p>
            ) : !useName ? (
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
            <p className="text-[14px] text-switch-gray-dark leading-relaxed mb-2">{t.allGuests}</p>
            {!cameraApi && <p className="text-[12px] text-switch-gray-mid mb-3">{t.camFallback}</p>}
            <div className="flex gap-4 items-start mb-5">
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
                {t.selfieTips.map((tip) => <li key={tip}>{tip}</li>)}
              </ul>
            </div>

            <div className="space-y-5">
              {guests.map((g, i) => (
                <div key={g.id} className="rounded-switch-lg border border-switch-stone-border bg-white p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h3 className="text-[15px] font-bold text-switch-charcoal">{t.guestN(i + 1)}</h3>
                    {guests.length > 1 && (
                      <button type="button" disabled={!!busy} onClick={() => removeGuest(g.id)} className="text-[12px] text-switch-gray-mid underline underline-offset-2 hover:text-danger disabled:opacity-50">{t.removeGuest}</button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor={`name-${i}`} className={labelCls}>{t.name}</label>
                      <input id={`name-${i}`} className={inputCls} value={g.name} onChange={(e) => updateGuest(g.id, { name: e.target.value.slice(0, 100) })} autoComplete="name" placeholder="TARO YAMADA" />
                      <p className="mt-1 text-[12px] text-switch-gray-mid">{t.nameHint}</p>
                    </div>
                    <div>
                      <span className={labelCls}>{t.residence}</span>
                      <div className="grid grid-cols-2 gap-2">
                        {([true, false] as const).map((val) => (
                          <button key={String(val)} type="button" onClick={() => updateGuest(g.id, { jaResident: val })}
                            className={`rounded-switch-md border px-3 py-2.5 text-[13px] font-semibold transition-colors ${g.jaResident === val ? "border-switch-teal bg-switch-teal-tint text-switch-teal-deep" : "border-switch-stone-border bg-white text-switch-charcoal hover:bg-switch-stone-over"}`}>
                            {val ? t.resJa : t.resAbroad}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className={labelCls}>{t.selfie}</span>
                      <p className="text-[12px] text-switch-gray-mid mb-2">{t.selfieWhy}</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        {preview(g.selfie, "selfie")}
                        {shotButton(g.id, "selfie", g.selfie)}
                      </div>
                    </div>
                    {g.jaResident === false && (
                      <div>
                        <span className={labelCls}>{t.passport}</span>
                        <p className="text-[12px] text-switch-gray-mid mb-2">{t.passportWhy}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          {preview(g.passport, "passport")}
                          {shotButton(g.id, "passport", g.passport)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {guests.length < MAX_GUESTS && (
              <button type="button" onClick={() => setGuests((prev) => [...prev, emptyGuest()])}
                className="mt-4 inline-flex items-center gap-2 rounded-switch-md border border-switch-stone-border bg-white px-4 py-2.5 text-[14px] font-semibold text-switch-charcoal hover:bg-switch-stone-over">
                + {t.addGuest}
              </button>
            )}
          </section>

          <section>
            {sectionHead("03", t.step3)}
            <label className="flex items-start gap-3 text-[13px] text-switch-gray-dark leading-relaxed mb-5">
              <input id="consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-switch-teal" />
              <span>{t.consent}</span>
            </label>
            {error && <p className="mb-4 rounded-switch-md border border-danger-border bg-danger-bg px-4 py-3 text-[13px] text-danger" role="alert">{error}</p>}
            <button type="submit" disabled={submitting || !!busy}
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
