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

// 1枚ぶんの直接アップロード: セッション URL を貰い、そこへ PUT。Drive がファイル ID を返す
export async function uploadPhoto(file: File): Promise<string> {
  const mime = guessMime(file);
  const sessionRes = await fetch("/api/guest-register/photo-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mime, size: file.size }),
  });
  const session = (await sessionRes.json().catch(() => ({}))) as { uploadUrl?: string; error?: string };
  if (!sessionRes.ok || !session.uploadUrl) throw new Error(session.error || `session ${sessionRes.status}`);
  const put = await fetch(session.uploadUrl, { method: "PUT", headers: { "Content-Type": mime }, body: file });
  if (!put.ok) throw new Error(`drive put ${put.status}`);
  const created = (await put.json().catch(() => ({}))) as { id?: string };
  if (!created.id) throw new Error("drive put: no id");
  return created.id;
}
