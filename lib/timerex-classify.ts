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
  reply_count?: number;
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

/**
 * TimeRex 予約投稿のスレッド返信一覧に、bot 自身のリード通知が既に付いているか判定。
 *
 * 重要な注意 (2026-07-03 incident):
 *   時間窓フォールバックの「使用済み投稿の除外」(claimedTs) は同一 cron 実行のバッチ内でしか
 *   効かない。cron は毎分起動しリードは 1 件ずつ別々の実行で処理されるため、前回以前の実行で
 *   別リード（佐藤愛美）に使用済みの予約投稿が「未使用」に見え、±15分内に送信された無関係な
 *   離脱リード（カノウ）がそのスレッドへ誤接続 +「予約済み」誤ラベルされた。
 *   → スレッド返信に bot のリード通知が付いていれば cron 実行をまたいだ「使用済み」とみなす。
 */
export function hasOwnLeadNotificationReply(replies: SlackMessage[]): boolean {
  return replies.some((r) => isOwnLeadNotification(messageHaystack(r)));
}

export type TimerexCandidate = { ts: string; haystack: string; replyCount?: number };

export const TIME_WINDOW_MS = 15 * 60_000;

/**
 * 名前マッチが外れたリードに対する時間窓フォールバックの候補列挙（純粋関数）。
 * フォーム送信時刻 ±15分以内の TimeRex 投稿のうち、バッチ内で他リードに使用済み (claimedTs) の
 * ものを除いて返す。呼び出し側はさらに Slack スレッド返信の使用済み判定
 * (hasOwnLeadNotificationReply) を通した上で「ちょうど1件」の場合のみ採用すること。
 */
export function findTimerexCandidatesByTime(
  leadCreatedAt: string,
  timerexMessages: TimerexCandidate[],
  claimedTs: Set<string>,
): TimerexCandidate[] {
  const leadMs = new Date(leadCreatedAt).getTime();
  return timerexMessages.filter((m) => {
    if (claimedTs.has(m.ts)) return false;
    const tsMs = parseFloat(m.ts) * 1000;
    return Math.abs(tsMs - leadMs) <= TIME_WINDOW_MS;
  });
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
