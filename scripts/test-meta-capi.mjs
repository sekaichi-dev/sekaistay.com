#!/usr/bin/env node
/**
 * Meta CAPI 接続テストスクリプト
 *
 * 使い方:
 *   META_PIXEL_ID=xxx META_CAPI_TOKEN=yyy META_CAPI_TEST_EVENT_CODE=TESTxxx \
 *     node scripts/test-meta-capi.mjs
 *
 * または .env.local を用意してから:
 *   node --env-file=.env.local scripts/test-meta-capi.mjs
 *
 * 目的:
 *   - META_CAPI_TOKEN が Pixel に対して正しい権限を持つか確認
 *   - テストイベントが Meta Events Manager に届くか確認
 *   - 問題発生時のエラーメッセージを人間が読みやすい形で出力
 */

import crypto from "node:crypto";

const PIXEL_ID = process.env.META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_TOKEN;
const TEST_EVENT_CODE = process.env.META_CAPI_TEST_EVENT_CODE;
const API_VERSION = process.env.META_CAPI_API_VERSION || "v23.0";

function sha256(v) {
  return crypto.createHash("sha256").update(v).digest("hex");
}

async function runTest() {
  console.log("=== Meta CAPI 接続テスト ===\n");

  // 環境変数チェック
  const missing = [];
  if (!PIXEL_ID) missing.push("META_PIXEL_ID");
  if (!ACCESS_TOKEN) missing.push("META_CAPI_TOKEN");
  if (!TEST_EVENT_CODE) missing.push("META_CAPI_TEST_EVENT_CODE (optional but needed for Test Events tab)");

  if (missing.length > 0) {
    console.error("❌ 不足している環境変数:");
    missing.forEach((m) => console.error(`   - ${m}`));
    process.exit(1);
  }

  console.log(`Pixel ID:        ${PIXEL_ID}`);
  console.log(`Test Event Code: ${TEST_EVENT_CODE || "(not set)"}`);
  console.log(`API Version:     ${API_VERSION}`);
  console.log(`Token:           ${ACCESS_TOKEN.slice(0, 10)}... (masked)\n`);

  const eventId = crypto.randomUUID();
  const eventTime = Math.floor(Date.now() / 1000);

  // テスト用ダミーデータ（ハッシュ化済み）
  const payload = {
    data: [
      {
        event_name: "Lead",
        event_time: eventTime,
        event_id: eventId,
        action_source: "website",
        event_source_url: "https://sekaistay.com/switch",
        user_data: {
          em: [sha256("test@example.com")],
          ph: [sha256("819012345678")],
          fn: [sha256("taro")],
          ln: [sha256("yamada")],
          client_ip_address: "127.0.0.1",
          client_user_agent: "TestScript/1.0",
        },
        custom_data: {
          lp_variant: "switch",
          content_name: "report_request",
          currency: "JPY",
          value: 0,
        },
      },
    ],
    test_event_code: TEST_EVENT_CODE,
  };

  const url = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(ACCESS_TOKEN)}`;

  console.log("送信中...");
  console.log(`  event_id: ${eventId}`);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => null);

    if (res.ok) {
      console.log("\n✅ 成功! Meta が CAPI イベントを受信しました");
      console.log("   レスポンス:", JSON.stringify(json, null, 2));
      console.log("\n次のステップ:");
      console.log("  1. Meta Events Manager → テストイベント タブ を開く");
      console.log(`  2. event_id "${eventId}" のイベントが表示されることを確認`);
      console.log('  3. "Server" ラベルが付いていることを確認');
      console.log("  4. Pixel (Browser) のイベントも確認するには sekaistay.com/switch にアクセスしてフォームを送信");
    } else {
      console.error(`\n❌ エラー: HTTP ${res.status}`);
      console.error("   エラー詳細:", JSON.stringify(json, null, 2));
      console.error("\n診断:");
      if (json?.error?.code === 100 && json?.error?.error_subcode === 33) {
        console.error("  → code 100/33: Pixel にアクセス権限がないか、Pixel が存在しない");
        console.error(`  → Pixel ID ${PIXEL_ID} に対応するトークンが必要です`);
        console.error("  → 修正方法: Meta Events Manager → Pixel 1658477098524563 → 設定 → CAPI → トークン再生成");
        console.error("  →          新しいトークンを vercel env add META_CAPI_TOKEN production で登録");
      } else if (json?.error?.message?.includes("Invalid OAuth access token")) {
        console.error("  → アクセストークンが無効または期限切れです");
        console.error("  → 修正方法: Meta Events Manager で新しいトークンを発行");
      } else {
        console.error("  → 不明なエラー。上記 JSON を確認してください");
      }
    }
  } catch (err) {
    console.error("\n❌ ネットワークエラー:", err.message);
  }
}

runTest();
