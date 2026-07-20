import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isTimerexBookingMessage,
  hasOwnLeadNotificationReply,
  findTimerexCandidatesByTime,
  type SlackMessage,
} from "./timerex-classify.ts";

// 本物の TimeRex 予約投稿（TimeRex bot が text に出す新形式）
const realTimerexBooking: SlackMessage = {
  ts: "1782789273.505099",
  bot_profile: { name: "TimeRex" },
  text: "中山亮平さんが予定を追加しました。",
};

const realTimerexBookingLegacy: SlackMessage = {
  ts: "1782707031.887119",
  bot_profile: { name: "TimeRex" },
  text: "今釘　由香里さんよりご予約をいただきました。",
};

// bot (Jennie) 自身の「予約なし」リード通知。
// ヘッダー section に "TimeRex予約なし" の文字が入るため、素朴判定だと誤検出する。
// → これが 2026-06-30 のコジマ誤接続事故の真因（星野の投稿がこの形だった）。
const ownLeadNoBooking: SlackMessage = {
  ts: "1782802642.832009",
  bot_profile: { name: "Jennie" },
  text: "🔔 新規リード: 星野　真梨",
  blocks: [
    { type: "header", text: "🏡 新規リード: 星野　真梨" },
    { type: "section", text: "⚠️ *TimeRex予約なし* — フォーム送信から 21 分経過。営業フォローアップ推奨。" },
    { type: "section", text: "*👤 名前:* 星野　真梨\n*📧 Email:* marimoyama_219@yahoo.co.jp" },
    { type: "context", elements: [{ type: "mrkdwn", text: "Lead ID: `0ee50aee-0c7b-4af1-892f-8f682484b0eb` · 2026-06-30T06:36:27.252993+00:00" }] },
  ],
};

// bot 自身の「予約済み」リード通知（スレッド返信として投稿されたもの）も TimeRex 投稿扱いしてはならない
const ownLeadBooked: SlackMessage = {
  ts: "1782803422.279579",
  bot_profile: { name: "Jennie" },
  text: "🔔 新規リード: 株式会社コジマ　用賀店",
  blocks: [
    { type: "header", text: "🏡 新規リード: 株式会社コジマ　用賀店" },
    { type: "section", text: "✅ *TimeRex 予約済み* (時間窓で同定) — フォーム回答を共有します。" },
    { type: "context", elements: [{ type: "mrkdwn", text: "Lead ID: `e3754f83-21c5-48ce-a2ab-383155aef5e1`" }] },
  ],
};

const unrelatedChatter: SlackMessage = {
  ts: "1782717506.667619",
  user: "UQL194ULT",
  text: "ホームページのポップアップ問い合わせからのやつ、これ誰が対応する？",
};

test("本物の TimeRex 予約投稿は予約投稿と判定される", () => {
  assert.equal(isTimerexBookingMessage(realTimerexBooking), true);
  assert.equal(isTimerexBookingMessage(realTimerexBookingLegacy), true);
});

test("bot 自身の『予約なし』リード通知は TimeRex 予約投稿に誤検出しない（コジマ誤接続の真因）", () => {
  assert.equal(isTimerexBookingMessage(ownLeadNoBooking), false);
});

test("bot 自身の『予約済み』リード通知も TimeRex 予約投稿に誤検出しない", () => {
  assert.equal(isTimerexBookingMessage(ownLeadBooked), false);
});

test("無関係なチャット投稿は予約投稿でない", () => {
  assert.equal(isTimerexBookingMessage(unrelatedChatter), false);
});

// ---- 2026-07-03 カノウ誤接続インシデントの回帰テスト ----
// 佐藤愛美の TimeRex 予約投稿 (09:35:31 JST) に、カノウのリード (09:45:38 JST 送信・予約なし) が
// 時間窓フォールバックで誤接続された。原因: 前回 cron 実行で佐藤愛美リードに使用済みの予約投稿が
// バッチ内 claimedTs では除外できない（リードは1件ずつ別の cron 実行で処理されるため）。

// 佐藤愛美の予約投稿スレッドに付いていた bot 自身のリード通知返信（実データ形）
const satoLeadReplyInThread: SlackMessage = {
  ts: "1783038940.700000",
  bot_profile: { name: "Jennie" },
  text: "🔔 新規リード: 佐藤愛美",
  blocks: [
    { type: "header", text: "🏡 新規リード: 佐藤愛美" },
    { type: "section", text: "✅ *TimeRex 予約済み* — フォーム回答を共有します。" },
    { type: "section", text: "*👤 名前:* 佐藤愛美\n*📧 Email:* aimeizuoteng33@gmail.com" },
    { type: "context", elements: [{ type: "mrkdwn", text: "Lead ID: `80650787-b035-4059-8d74-d0a508d8f5a3` · 2026-07-03T00:15:21.38558+00:00" }] },
  ],
};

const satoTimerexBooking: SlackMessage = {
  ts: "1783038931.064759", // 2026-07-03 00:35:31 UTC
  bot_profile: { name: "TimeRex" },
  text: "佐藤愛美さんが予定を追加しました。",
  reply_count: 2,
};

const humanChatterReply: SlackMessage = {
  ts: "1783039000.000000",
  user: "UQL194ULT",
  text: "この方、私が対応します！",
};

test("bot のリード通知返信が付いたスレッドは使用済みと判定される（カノウ誤接続の真因）", () => {
  assert.equal(hasOwnLeadNotificationReply([satoLeadReplyInThread]), true);
  assert.equal(hasOwnLeadNotificationReply([humanChatterReply, satoLeadReplyInThread]), true);
});

test("人間のコメントだけのスレッドは使用済みと判定されない（漢字↔かな救済は維持）", () => {
  assert.equal(hasOwnLeadNotificationReply([humanChatterReply]), false);
  assert.equal(hasOwnLeadNotificationReply([]), false);
});

test("時間窓候補: カノウのリード時刻から佐藤愛美の予約投稿が候補に挙がる（±15分内・10分差）", () => {
  const candidates = findTimerexCandidatesByTime(
    "2026-07-03T00:45:38.30655+00:00", // カノウ created_at
    [{ ts: satoTimerexBooking.ts, haystack: satoTimerexBooking.text! }],
    new Set(),
  );
  assert.equal(candidates.length, 1);
});

test("時間窓候補: バッチ内 claimedTs に載っている投稿は除外される", () => {
  const candidates = findTimerexCandidatesByTime(
    "2026-07-03T00:45:38.30655+00:00",
    [{ ts: satoTimerexBooking.ts, haystack: satoTimerexBooking.text! }],
    new Set([satoTimerexBooking.ts]),
  );
  assert.equal(candidates.length, 0);
});

test("時間窓候補: 窓外(±15分超)の投稿は候補にならない", () => {
  const candidates = findTimerexCandidatesByTime(
    "2026-07-03T01:00:00+00:00", // 予約投稿から24分29秒後
    [{ ts: satoTimerexBooking.ts, haystack: satoTimerexBooking.text! }],
    new Set(),
  );
  assert.equal(candidates.length, 0);
});
