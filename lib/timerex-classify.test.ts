import { test } from "node:test";
import assert from "node:assert/strict";
import { isTimerexBookingMessage, type SlackMessage } from "./timerex-classify.ts";

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
