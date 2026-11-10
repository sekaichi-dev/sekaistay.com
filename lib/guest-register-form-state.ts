// 宿泊者名簿フォームの入力状態（画面の useState と同じ形）と、玄関の共有端末で使う「空に戻す」「無操作の判定」。
// 画面の初期化はここの blankRegisterFields() だけを使う（送信後の初期化と無操作の初期化で対象がずれないように）。

/** 写真の撮り方。camera = カメラ直接起動の入力（capture 属性つき・共有端末）から / file = 通常のファイル選択から */
export type PhotoMethod = "" | "camera" | "file";

export interface GuestForm {
  name: string;
  /** お子様カード（削除可）。API へは送らない表示用の区分。 */
  isChild: boolean;
  jaResident: boolean | null;
  address: string;
  sameAddress: boolean;
  nationality: string;
  occupation: string;
  contact: string;
  sameContact: boolean;
  passportNo: string;
  /** Drive 受付中フォルダに置いた写真のファイル ID（"" = 未添付） */
  photoFileId: string;
  photoName: string;
  photoMethod: PhotoMethod;
  /** 撮影（ファイルの更新時刻）から選択までの秒数。-1 = 不明 */
  photoAgeSec: number;
  facePhotoFileId: string;
  facePhotoName: string;
  facePhotoMethod: PhotoMethod;
  facePhotoAgeSec: number;
  gender: string;
  age: string;
  prevStay: string;
  nextDest: string;
}

export const emptyGuest = (isChild = false): GuestForm => ({
  name: "", isChild, jaResident: null, address: "", sameAddress: false, nationality: "",
  occupation: "", contact: "", sameContact: false, passportNo: "",
  photoFileId: "", photoName: "", photoMethod: "", photoAgeSec: -1,
  facePhotoFileId: "", facePhotoName: "", facePhotoMethod: "", facePhotoAgeSec: -1,
  gender: "", age: "", prevStay: "", nextDest: "",
});

/** 共有端末で人が入れ替わるときに消す項目（施設と表示言語は残す）。 */
export interface RegisterFields {
  checkin: string;
  checkout: string;
  checkinTime: string;
  checkoutTime: string;
  bookingRef: string;
  consent: boolean;
  guests: GuestForm[];
}

export function blankRegisterFields(): RegisterFields {
  return { checkin: "", checkout: "", checkinTime: "", checkoutTime: "", bookingRef: "", consent: false, guests: [emptyGuest()] };
}

function guestHasData(g: GuestForm): boolean {
  const blank = emptyGuest(g.isChild);
  return (Object.keys(blank) as (keyof GuestForm)[]).some((k) => k !== "isChild" && g[k] !== blank[k]);
}

/** 1 文字でも入力（選択・写真・同意・同行者カードの追加を含む）があるか。無操作リセットはこのときだけ動かす */
export function hasEnteredData(f: RegisterFields): boolean {
  const blank = blankRegisterFields();
  if (f.checkin !== blank.checkin || f.checkout !== blank.checkout) return true;
  if (f.checkinTime !== blank.checkinTime || f.checkoutTime !== blank.checkoutTime) return true;
  if (f.bookingRef !== blank.bookingRef || f.consent !== blank.consent) return true;
  if (f.guests.length !== 1) return true;
  return f.guests.some(guestHasData);
}

/** 無操作 3 分で確認を出し、さらに 30 秒反応が無ければ空に戻す（玄関の共有端末）。 */
export const KIOSK_IDLE_MS = 180_000;
export const KIOSK_WARN_MS = 30_000;

export type IdlePhase = { phase: "active" } | { phase: "warn"; secondsLeft: number } | { phase: "expired" };

export function idlePhase(now: number, lastActivity: number, idleMs = KIOSK_IDLE_MS, warnMs = KIOSK_WARN_MS): IdlePhase {
  const idle = now - lastActivity;
  if (idle < idleMs) return { phase: "active" };
  if (idle >= idleMs + warnMs) return { phase: "expired" };
  return { phase: "warn", secondsLeft: Math.max(1, Math.ceil((idleMs + warnMs - idle) / 1000)) };
}

/** カメラ（ファイル入力）を開いたまま戻らないときに、無操作の判定を止めておく上限 */
export const PICKER_PAUSE_MAX_MS = 10 * 60_000;

/**
 * 1 秒ごとの判定。送信中・写真のアップロード中・カメラを開いている間は「操作中」として数え直す
 * （撮影や送信の途中で入力が消えないように）。返す lastActivity を次の判定に使う。
 */
export function kioskIdleTick(
  now: number,
  s: { lastActivity: number; pickerOpenedAt: number; busy: boolean },
): { phase: IdlePhase; lastActivity: number } {
  const pickerOpen = s.pickerOpenedAt > 0 && now - s.pickerOpenedAt < PICKER_PAUSE_MAX_MS;
  if (s.busy || pickerOpen) return { phase: { phase: "active" }, lastActivity: now };
  return { phase: idlePhase(now, s.lastActivity), lastActivity: s.lastActivity };
}

/** 撮影から選択までの秒数（ファイルの更新時刻から）。未来・不明・1 日超は -1 */
export function photoAgeSec(lastModified: number | undefined, now: number): number {
  if (!lastModified || !Number.isFinite(lastModified)) return -1;
  const sec = Math.round((now - lastModified) / 1000);
  return sec >= 0 && sec <= 86_400 ? sec : -1;
}
