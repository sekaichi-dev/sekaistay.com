/**
 * TimeRex 予約完了投稿の判定ロジック（純粋関数・テスト可能なよう route から分離）。
 *
 * 重要な注意 (2026-06-30 incident):
 *   #402 のリード通知 bot (Jennie) は、自身の投稿のヘッダーに必ず "TimeRex" の文字を含む
 *   （"✅ TimeRex 予約済み" / "⚠️ TimeRex予約なし"）。素朴に haystack.includes("timerex") で
 *   判定すると bot 自身のリード通知を「TimeRex 予約投稿」と誤検出し、時間窓フォールバックが
 *   新規リードを別リードのスレッドに誤接続する事故が起きる。
 *   → bot 自身のリード通知 (Lead ID / 新規リード を含む) は明示的に除外する。
 */

export type SlackBlockElement = {
  type?: string;
  text?: string | { text?: string };
  elements?: SlackBlockElement[];
  fields?: Array<{ text?: string }>;
};

export type SlackMessage = {
  type?: string;
  ts: string;
  user?: string;
  bot_id?: string;
  username?: string;
  bot_profile?: { name?: string };
  app_id?: string;
  text?: string;
  attachments?: Array<{ text?: string; fallback?: string; pretext?: string; title?: string }>;
  blocks?: SlackBlockElement[];
};

export function extractBlockText(node: unknown): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractBlockText).join(" ");
  if (typeof node === "object") {
    const obj = node as Record<string, unknown>;
    const parts: string[] = [];
    for (const v of Object.values(obj)) {
      if (typeof v === "string") parts.push(v);
      else if (v && (Array.isArray(v) || typeof v === "object")) parts.push(extractBlockText(v));
    }
    return parts.join(" ");
  }
  return "";
}

export function messageHaystack(msg: SlackMessage): string {
  const parts: string[] = [
    msg.text || "",
    msg.username || "",
    msg.bot_profile?.name || "",
  ];
  for (const a of msg.attachments || []) {
    parts.push(a.text || "", a.fallback || "", a.pretext || "", a.title || "");
  }
  parts.push(extractBlockText(msg.blocks));
  return parts.join("\n");
}

/**
 * リード通知 bot (Jennie) 自身の投稿か判定。
 * 通知本文には必ず「新規リード」ヘッダーと "Lead ID:" コンテキストが入る。
 * 本物の TimeRex 予約投稿にはどちらも含まれない。
 */
export function isOwnLeadNotification(haystack: string): boolean {
  const lower = haystack.toLowerCase();
  return lower.includes("lead id:") || haystack.includes("新規リード");
}

export function isTimerexBookingMessage(msg: SlackMessage): boolean {
  const haystack = messageHaystack(msg);
  // bot 自身のリード通知は除外（headerNote に "TimeRex" が入り誤検出するため）
  if (isOwnLeadNotification(haystack)) return false;
  const lower = haystack.toLowerCase();
  if (lower.includes("timerex")) return true;
  // 文言ベースの fallback: 予約確定パターン
  if (haystack.includes("ご予約をいただきました")) return true;
  if (haystack.includes("予定を追加しました")) return true;
  return false;
}
