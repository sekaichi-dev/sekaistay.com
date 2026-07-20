import { timingSafeEqual } from "crypto";

// 管理APIキー（X_CONTENT_ADMIN_KEY）の定数時間比較チェック。
// 未設定・空・長さ不一致は不許可。URL クエリではなくヘッダ/ボディで受け取ること。
export function isValidAdminKey(given: string | null | undefined): boolean {
  const key = (process.env.X_CONTENT_ADMIN_KEY || "").trim();
  const g = (given || "").trim();
  if (!key || !g) return false;
  const a = Buffer.from(key);
  const b = Buffer.from(g);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
