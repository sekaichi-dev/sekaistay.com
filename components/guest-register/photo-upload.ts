// 名簿フォームと本人確認ページで共用する写真まわりのブラウザ側処理。
// 選んだ写真をメモリに読み切り → 縮小 → /api/guest-register/photo-session の URL へ直接 PUT（Drive のファイル ID を返す）。
// 失敗はテレメトリで運営に見える（送信可否には影響しない）。GuestRegisterForm.tsx から切り出し（2026-10-12）。

export async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
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

export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024; // サーバー側 MAX_UPLOAD_BYTES と同値

// maxDim px・targetBytes 目安にJPEG圧縮。デコード不可(HEIC等)や巨大画像は MAX_UPLOAD_BYTES 以下ならそのまま送る
// （compressed=false。運営がどれだけ起きているか見えるよう呼び出し側で記録する）。
export async function compressImage(file: File, maxDim = 1600, targetBytes = 450_000, outName = "photo.jpg"): Promise<{ file: File; compressed: boolean }> {
  if (file.size <= targetBytes) return { file, compressed: true };
  try {
    const bitmap = await loadBitmap(file);
    const w = "width" in bitmap ? bitmap.width : 0;
    const h = "height" in bitmap ? bitmap.height : 0;
    if (!w || !h) throw new Error("empty image");
    const scale = Math.min(1, maxDim / Math.max(w, h));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no canvas");
    ctx.drawImage(bitmap as CanvasImageSource, 0, 0, canvas.width, canvas.height);
    let result: Blob | null = null;
    for (const quality of [0.8, 0.65, 0.5]) {
      result = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
      if (result && result.size <= targetBytes) break;
    }
    if (!result) throw new Error("toBlob failed");
    return { file: new File([result], outName, { type: "image/jpeg" }), compressed: true };
  } catch {
    if (file.size <= MAX_UPLOAD_BYTES) return { file, compressed: false };
    throw new Error("TOO_LARGE");
  }
}

// 選んだ写真をその場でメモリに読み切る。Android では撮影直後やクラウド上の写真を選ぶと、選択後に
// ファイルが読めなくなることがあり（2026-10-08 実例）、そのままだと縮小もアップロードも黙って失敗する。
// 読めなければここで止めてゲストに選び直しを案内し、読めたらメモリ上のコピーを以降の処理に使う。
export async function readIntoMemory(file: File): Promise<File | null> {
  try {
    const bytes = await file.arrayBuffer();
    if (bytes.byteLength === 0) return null;
    return new File([bytes], file.name, { type: file.type });
  } catch {
    return null;
  }
}

// Android 等で file.type が空になる HEIC は拡張子から補う
export function guessMime(file: File): string {
  if (file.type) return file.type;
  const m = /\.([a-z0-9]+)$/i.exec(file.name);
  return ({ heic: "image/heic", heif: "image/heif", png: "image/png", webp: "image/webp" } as Record<string, string>)[(m?.[1] || "").toLowerCase()] || "image/jpeg";
}

// ゲスト端末での失敗を運営に見えるようにする（送信の可否には影響させない）
export function reportFailure(stage: string, message: string, detail = "", bookingRef = "") {
  try {
    void fetch("/api/guest-register/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage, message, detail, bookingRef }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

// アップロード 1 回ぶんの失敗と、その後どうするか。
// retry = 回線起因（fetch が投げた TypeError/AbortError・Google の 5xx/429）でもう一度直接送る価値がある
// fallback = 直接送信はこれ以上試さず当サーバー経由へ（セッション発行の回数上限 429。再試行で枠を 2 倍使うので上限に当たりやすい）
// stop = やり直しても同じ（MIME・サイズなど当サーバーの 4xx）
type NextStep = "retry" | "fallback" | "stop";
class UploadHopError extends Error {
  readonly next: NextStep;
  constructor(message: string, next: NextStep) { super(message); this.next = next; }
}

function hopError(e: unknown): UploadHopError {
  if (e instanceof UploadHopError) return e;
  const name = (e as Error)?.name || "";
  const message = String((e as Error)?.message || e);
  // fetch がネットワーク層で失敗すると Chrome は "Failed to fetch"、Safari は "Load failed" の TypeError を投げる
  return new UploadHopError(message, name === "TypeError" || name === "AbortError" ? "retry" : "stop");
}

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

// PUT 応答の受信前に回線が切れたとき（TypeError/AbortError）、本体は Drive に届いている場合がある。
// bytes */<size> クエリで状態照会し、200/201 で id が返ればそれを使う（再送しない）。
// 2026-10-22 の失敗 2 件（iPhone「Load failed」・Android「Failed to fetch」）が契機:
// どちらも受付中フォルダに同バイト数のファイルが作成されていた＝本体は届き、応答受信だけ失敗。
export async function queryDriveUploadStatus(sessionUrl: string, size: number): Promise<string | null> {
  try {
    const res = await fetch(sessionUrl, {
      method: "PUT",
      headers: { "Content-Range": `bytes */${size}` },
    });
    if (res.status === 200 || res.status === 201) {
      const data = (await res.json().catch(() => ({}))) as { id?: string };
      return data.id ?? null;
    }
    return null;
  } catch {
    return null;
  }
}

// 直接アップロード: セッション URL を貰い、そこへ PUT。Drive がファイル ID を返す
async function uploadDirect(file: File, mime: string): Promise<string> {
  const sessionRes = await fetch("/api/guest-register/photo-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mime, size: file.size }),
  });
  const session = (await sessionRes.json().catch(() => ({}))) as { uploadUrl?: string; error?: string };
  if (!sessionRes.ok || !session.uploadUrl) {
    const next: NextStep = sessionRes.status === 429 ? "fallback" : sessionRes.status >= 500 ? "retry" : "stop";
    throw new UploadHopError(session.error || `session ${sessionRes.status}`, next);
  }
  let put: Response;
  try {
    put = await fetch(session.uploadUrl, { method: "PUT", headers: { "Content-Type": mime }, body: file });
  } catch (e) {
    // PUT 本体は Drive に届いたが応答受信に失敗した可能性がある。再送前に状態を照会する
    if ((e as Error)?.name === "TypeError" || (e as Error)?.name === "AbortError") {
      const recoveredId = await queryDriveUploadStatus(session.uploadUrl, file.size);
      if (recoveredId) return recoveredId;
    }
    throw e;
  }
  if (!put.ok) throw new UploadHopError(`drive put ${put.status}`, put.status >= 500 || put.status === 429 ? "retry" : "stop");
  const created = (await put.json().catch(() => ({}))) as { id?: string };
  if (!created.id) throw new UploadHopError("drive put: no id", "stop");
  return created.id;
}

// 迂回路: 当サーバーへ同一オリジンで POST し、サーバーが Drive へ置く（4MB まで）
export const PROXY_MAX_BYTES = 4 * 1024 * 1024; // サーバー側 MAX_PROXY_UPLOAD_BYTES と同値
async function uploadViaServer(file: File, mime: string): Promise<string> {
  const res = await fetch("/api/guest-register/photo", { method: "POST", headers: { "Content-Type": mime }, body: file });
  const data = (await res.json().catch(() => ({}))) as { id?: string; error?: string };
  if (!res.ok || !data.id) throw new UploadHopError(data.error || `proxy ${res.status}`, "stop");
  return data.id;
}

/**
 * 1枚ぶんのアップロード。Google へ直接（2 回）→ だめなら当サーバー経由。
 * 直接送信はゲストの回線によっては Google に届かず TypeError で終わる（2026-10-03〜10-21 に 11 件・iPhone/Android とも）。
 * 迂回で成功したときは upload-fallback として記録し、どれだけの回線が直接送れないかを運営が数えられるようにする。
 */
export async function uploadPhoto(file: File, bookingRef = ""): Promise<string> {
  const mime = guessMime(file);
  const started = Date.now();
  const hops: string[] = [];
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      return await uploadDirect(file, mime);
    } catch (e) {
      const err = hopError(e);
      hops.push(`direct#${attempt}: ${err.message}`);
      if (err.next === "stop") throw new Error(hops.join(" / "));
      if (err.next === "fallback") break;
      await sleep(attempt * 1000);
    }
  }
  if (file.size > PROXY_MAX_BYTES) throw new Error(`${hops.join(" / ")} / proxy skipped: ${file.size}B > ${PROXY_MAX_BYTES}B`);
  try {
    const id = await uploadViaServer(file, mime);
    const online = typeof navigator !== "undefined" && "onLine" in navigator ? String(navigator.onLine) : "?";
    reportFailure("upload-fallback", "DIRECT_FAILED", `${hops.join(" / ")} | ${Date.now() - started}ms online=${online} ${mime} ${file.size}B`, bookingRef);
    return id;
  } catch (e) {
    hops.push(`proxy: ${hopError(e).message}`);
    throw new Error(`${hops.join(" / ")} | ${Date.now() - started}ms`);
  }
}
