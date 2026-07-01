# 紹介者システム Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** sekaistay.com に紹介者登録フォーム・紹介コード発行・紹介者台帳・contact 紹介者欄との突合・Slack #404 通知・規約を、sekaistay-com 内で完結する形で実装する。

**Architecture:** 純粋ロジック（暗号化・コード生成・突合）を依存注入で分離し `node:test` でユニットテスト。DB は Supabase（service role）。振込先の口座番号・名義は AES-256-GCM で暗号化保存。Slack は既存 bot token を流用した汎用投稿関数を新設。管理 API は既存 `X_CONTENT_ADMIN_KEY` でゲート。

**Tech Stack:** Next.js 14 App Router, TypeScript, `@supabase/supabase-js`, Node 25 (`node:crypto`, `node:test`), Tailwind, Vercel。

## Global Constraints

- **本番サイト**: CSS 崩れ・SEO 破壊・404 はビジネス影響大。ページ追加は必ず `npm run dev` で目視確認。
- **メタタグ・構造化データを壊さない**（既存 layout パターン踏襲）。
- **デザイントークン**は `SEKAI_STAY_Creative_Guide.md` / 既存 `app/contact/page.tsx` に準拠（`inputCls`・`Field` パターン流用）。
- **git**: `git add -A`/`.` 禁止。自分が触ったファイルだけ明示 add。ブランチは `feat/referral-system`（作成済み）。commit は push まで含めない（この plan 内では commit のみ）。
- **暗号化形式**: `ivHex:tagHex:cipherHex`（ops `credential-cipher.ts` と同形式）。
- **test 判定**: 既存 `lib/test-classifier.ts` の `classifyKind(name, email)` を流用。`kind==='test'` は Slack 通知を skip。
- **秘密値をコード/ログに出さない**。復号値はサーバ内のみ、クライアントに平文口座を返さない。
- **Node 26** はデフォルトで TS の型注釈を strip する。テストは `node --test "lib/**/*.test.ts"` で実行（`--experimental-strip-types` フラグは不要）。`npm test` が実際にテストを discover・実行することを各 Task で確認する。

---

## File Structure

**新規（ロジック/DB）**
- `lib/crypto.ts` — AES-256-GCM encrypt/decrypt（`REFERRAL_ENC_KEY`）
- `lib/referral-code.ts` — 紹介コード生成・形式検証（純粋）
- `lib/referrer-match.ts` — 突合ロジック（純粋・lookup 注入）
- `lib/referrers.ts` — referrers テーブルの DB 層（insert 冪等・find・list・decrypt reveal）
- `lib/slack-notify.ts` — 汎用 `postToSlack` + 紹介/リード通知ビルダー

**新規（テスト）**
- `lib/crypto.test.ts`, `lib/referral-code.test.ts`, `lib/referrer-match.test.ts`

**新規（マイグレーション）**
- `supabase/migrations/20260701_referrers.sql`
- `supabase/migrations/20260701_lead_referrer_cols.sql`

**新規（ページ/API）**
- `app/referral/page.tsx`, `app/referral/layout.tsx`
- `app/api/referral/register/route.ts`
- `app/admin/referrals/page.tsx`
- `app/api/admin/referrers/route.ts` — 一覧
- `app/api/admin/referrers/resolve/route.ts` — 手動確定
- `app/api/admin/referrers/reveal/route.ts` — 口座復号

**変更**
- `package.json`（`test` script 追加）
- `lib/lead-submissions.ts`（`SubmitPayload`/`LeadSubmissionRow`/insert に referrer 追加）
- `app/api/report-requests/submit/route.ts`（referrer 受領・突合・#404 通知・MAX_LENGTHS）
- `app/contact/page.tsx`（紹介者欄）

---

## Task 1: テスト基盤 + 暗号化ユーティリティ `lib/crypto.ts`

**Files:**
- Modify: `package.json`（scripts に `test` 追加）
- Create: `lib/crypto.ts`
- Test: `lib/crypto.test.ts`

**Interfaces:**
- Produces:
  - `encryptSecret(plain: string): string` — 戻り値 `"ivHex:tagHex:cipherHex"`
  - `decryptSecret(payload: string): string`
  - どちらも `REFERRAL_ENC_KEY`（64 hex = 32 bytes）を `process.env` から読む。未設定・不正長は throw。

- [ ] **Step 1: `package.json` に test script を追加**

`scripts` ブロックに次の1行を追加（末尾カンマ整合に注意）:

```json
    "test": "node --test \"lib/**/*.test.ts\""
```

- [ ] **Step 2: 失敗するテストを書く** — `lib/crypto.test.ts`

```typescript
import { test } from "node:test";
import assert from "node:assert/strict";

process.env.REFERRAL_ENC_KEY =
  "0".repeat(64); // 32 bytes hex, test only

const { encryptSecret, decryptSecret } = await import("./crypto.ts");

test("round-trips a plaintext", () => {
  const enc = encryptSecret("1234567");
  assert.notEqual(enc, "1234567");
  assert.equal(enc.split(":").length, 3);
  assert.equal(decryptSecret(enc), "1234567");
});

test("produces different ciphertext each call (random IV)", () => {
  const a = encryptSecret("同じ平文");
  const b = encryptSecret("同じ平文");
  assert.notEqual(a, b);
  assert.equal(decryptSecret(a), "同じ平文");
  assert.equal(decryptSecret(b), "同じ平文");
});

test("tampered ciphertext fails to decrypt (GCM auth)", () => {
  const enc = encryptSecret("secret");
  const [iv, tag, cipher] = enc.split(":");
  const badCipher = cipher.replace(/.$/, (c) => (c === "0" ? "1" : "0"));
  assert.throws(() => decryptSecret(`${iv}:${tag}:${badCipher}`));
});
```

- [ ] **Step 3: テストが失敗することを確認**

Run: `npm test`
Expected: FAIL（`crypto.ts` が存在しない / import エラー）

- [ ] **Step 4: `lib/crypto.ts` を実装**

```typescript
import crypto from "node:crypto";

const ALGO = "aes-256-gcm";

function getKey(): Buffer {
  const hex = (process.env.REFERRAL_ENC_KEY || "").trim();
  if (hex.length !== 64) {
    throw new Error("REFERRAL_ENC_KEY must be 64 hex chars (32 bytes)");
  }
  return Buffer.from(hex, "hex");
}

export function encryptSecret(plain: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${enc.toString("hex")}`;
}

export function decryptSecret(payload: string): string {
  const key = getKey();
  const [ivHex, tagHex, cipherHex] = payload.split(":");
  if (!ivHex || !tagHex || !cipherHex) {
    throw new Error("invalid encrypted payload format");
  }
  const decipher = crypto.createDecipheriv(ALGO, key, Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  return Buffer.concat([
    decipher.update(Buffer.from(cipherHex, "hex")),
    decipher.final(),
  ]).toString("utf8");
}
```

- [ ] **Step 5: テストが通ることを確認**

Run: `npm test`
Expected: PASS（3 tests）

- [ ] **Step 6: commit**

```bash
git add package.json lib/crypto.ts lib/crypto.test.ts
git commit -m "紹介者: 振込先暗号化ユーティリティ + node:test 基盤を追加"
```

---

## Task 2: 紹介コード生成 `lib/referral-code.ts`

**Files:**
- Create: `lib/referral-code.ts`
- Test: `lib/referral-code.test.ts`

**Interfaces:**
- Produces:
  - `generateReferralCode(rand?: () => number): string` — `SS-XXXXXX`（6 文字、紛らわしい文字除外集合）。`rand` は 0..1 の乱数（デフォルト `Math.random`、テストで注入）。
  - `isValidReferralCodeFormat(code: string): boolean`
  - `normalizeReferralCode(code: string): string` — trim + 大文字化（突合用）

- [ ] **Step 1: 失敗するテストを書く** — `lib/referral-code.test.ts`

```typescript
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  generateReferralCode,
  isValidReferralCodeFormat,
  normalizeReferralCode,
} from "./referral-code.ts";

test("format: SS- prefix + 6 chars from safe alphabet", () => {
  const code = generateReferralCode(() => 0);
  assert.match(code, /^SS-[0-9A-Z]{6}$/);
  assert.ok(!/[OIL01U]/.test(code.slice(3)), "excludes ambiguous chars");
});

test("deterministic with injected rand", () => {
  assert.equal(generateReferralCode(() => 0), generateReferralCode(() => 0));
});

test("isValidReferralCodeFormat", () => {
  assert.equal(isValidReferralCodeFormat("SS-ABC234"), true);
  assert.equal(isValidReferralCodeFormat("ss-abc234"), false); // 大文字のみ
  assert.equal(isValidReferralCodeFormat("SS-ABCDEFG"), false); // 7 文字
  assert.equal(isValidReferralCodeFormat("XX-ABC234"), false);
});

test("normalizeReferralCode trims and uppercases", () => {
  assert.equal(normalizeReferralCode("  ss-abc234 "), "SS-ABC234");
});
```

- [ ] **Step 2: テストが失敗することを確認**

Run: `npm test`
Expected: FAIL（`referral-code.ts` 未作成）

- [ ] **Step 3: `lib/referral-code.ts` を実装**

```typescript
// 紛らわしい文字 (0/O/1/I/L/U) を除外した 26 文字集合
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";
const LEN = 6;

export function generateReferralCode(rand: () => number = Math.random): string {
  let s = "";
  for (let i = 0; i < LEN; i++) {
    const idx = Math.floor(rand() * ALPHABET.length) % ALPHABET.length;
    s += ALPHABET[idx];
  }
  return `SS-${s}`;
}

export function isValidReferralCodeFormat(code: string): boolean {
  return new RegExp(`^SS-[${ALPHABET}]{${LEN}}$`).test(code);
}

export function normalizeReferralCode(code: string): string {
  return code.trim().toUpperCase();
}
```

- [ ] **Step 4: テストが通ることを確認**

Run: `npm test`
Expected: PASS（全 test）

- [ ] **Step 5: commit**

```bash
git add lib/referral-code.ts lib/referral-code.test.ts
git commit -m "紹介者: 紹介コード生成・形式検証ユーティリティを追加"
```

---

## Task 3: Supabase マイグレーション（referrers + lead 列）

**Files:**
- Create: `supabase/migrations/20260701_referrers.sql`
- Create: `supabase/migrations/20260701_lead_referrer_cols.sql`

**Interfaces:**
- Produces: Supabase に `referrers` テーブルと `lead_submissions.referrer_*` 列。

- [ ] **Step 1: `supabase/migrations/20260701_referrers.sql` を作成**

```sql
-- 紹介者台帳（Phase 1）
CREATE TABLE IF NOT EXISTS referrers (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at                timestamptz NOT NULL DEFAULT now(),
  code                      text NOT NULL UNIQUE,
  name                      text NOT NULL,
  email                     text NOT NULL,
  phone                     text NOT NULL,
  is_owner                  boolean NOT NULL DEFAULT false,
  bank_name                 text NOT NULL,
  bank_code                 text,
  branch_name               text NOT NULL,
  branch_code               text,
  account_type              text NOT NULL,
  account_number_enc        text NOT NULL,
  account_holder_enc        text NOT NULL,
  account_holder_kana_enc   text NOT NULL,
  terms_version             text NOT NULL,
  terms_agreed_at           timestamptz NOT NULL,
  status                    text NOT NULL DEFAULT 'active',
  kind                      text NOT NULL DEFAULT 'real',
  client_ip                 text,
  user_agent                text
);

-- active な同一メールの重複登録を防ぐ（冪等登録の土台）
CREATE UNIQUE INDEX IF NOT EXISTS idx_referrers_email_active
  ON referrers (lower(email)) WHERE status = 'active';
```

- [ ] **Step 2: `supabase/migrations/20260701_lead_referrer_cols.sql` を作成**

```sql
-- リードに紹介者 attribution を付与
ALTER TABLE lead_submissions
  ADD COLUMN IF NOT EXISTS referrer_code  text,
  ADD COLUMN IF NOT EXISTS referrer_name  text,
  ADD COLUMN IF NOT EXISTS referrer_id    uuid,
  ADD COLUMN IF NOT EXISTS referrer_match text;

CREATE INDEX IF NOT EXISTS idx_lead_submissions_referrer
  ON lead_submissions (referrer_id)
  WHERE referrer_id IS NOT NULL;
```

- [ ] **Step 3: マイグレーションを適用（Supabase MCP）**

Supabase MCP `apply_migration` を project `cswdzbmworwpzeihyicd` に対して 2 本適用する（`name` は `referrers` と `lead_referrer_cols`、`query` は各 SQL 本文）。
※ MCP 権限が無い場合は Supabase ダッシュボード SQL editor に貼って実行し、その旨を報告する。

- [ ] **Step 4: 適用を検証**

Supabase MCP `list_tables` で `referrers` の存在と列を確認。`execute_sql` で:

```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'lead_submissions' AND column_name LIKE 'referrer%';
```
Expected: `referrer_code, referrer_name, referrer_id, referrer_match` の 4 行。

- [ ] **Step 5: commit**

```bash
git add supabase/migrations/20260701_referrers.sql supabase/migrations/20260701_lead_referrer_cols.sql
git commit -m "紹介者: referrers テーブル + lead_submissions attribution 列のマイグレーション"
```

---

## Task 4: 突合ロジック `lib/referrer-match.ts`

**Files:**
- Create: `lib/referrer-match.ts`
- Test: `lib/referrer-match.test.ts`

**Interfaces:**
- Consumes: `normalizeReferralCode`（Task 2）
- Produces:
  - 型 `ReferrerMatch = { referrerId: string | null; match: "code" | "name_candidate" | "unmatched" | null }`
  - `async function resolveReferrerMatch(input: { code?: string; name?: string; lookupByCode: (code: string) => Promise<{ id: string } | null> }): Promise<ReferrerMatch>`

- [ ] **Step 1: 失敗するテストを書く** — `lib/referrer-match.test.ts`

```typescript
import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveReferrerMatch } from "./referrer-match.ts";

const found = async (code: string) => (code === "SS-ABC234" ? { id: "r1" } : null);

test("code hit -> match=code with id", async () => {
  const r = await resolveReferrerMatch({ code: "ss-abc234", lookupByCode: found });
  assert.deepEqual(r, { referrerId: "r1", match: "code" });
});

test("code given but not found -> unmatched", async () => {
  const r = await resolveReferrerMatch({ code: "SS-ZZZZZZ", lookupByCode: found });
  assert.deepEqual(r, { referrerId: null, match: "unmatched" });
});

test("name only -> name_candidate", async () => {
  const r = await resolveReferrerMatch({ name: "山田太郎", lookupByCode: found });
  assert.deepEqual(r, { referrerId: null, match: "name_candidate" });
});

test("nothing given -> null match", async () => {
  const r = await resolveReferrerMatch({ lookupByCode: found });
  assert.deepEqual(r, { referrerId: null, match: null });
});
```

- [ ] **Step 2: テストが失敗することを確認**

Run: `npm test`
Expected: FAIL（`referrer-match.ts` 未作成）

- [ ] **Step 3: `lib/referrer-match.ts` を実装**

```typescript
import { normalizeReferralCode, isValidReferralCodeFormat } from "./referral-code.ts";

export type ReferrerMatch = {
  referrerId: string | null;
  match: "code" | "name_candidate" | "unmatched" | null;
};

export async function resolveReferrerMatch(input: {
  code?: string;
  name?: string;
  lookupByCode: (code: string) => Promise<{ id: string } | null>;
}): Promise<ReferrerMatch> {
  const code = (input.code || "").trim();
  const name = (input.name || "").trim();

  if (code) {
    const norm = normalizeReferralCode(code);
    if (isValidReferralCodeFormat(norm)) {
      const hit = await input.lookupByCode(norm);
      if (hit) return { referrerId: hit.id, match: "code" };
    }
    return { referrerId: null, match: "unmatched" };
  }
  if (name) return { referrerId: null, match: "name_candidate" };
  return { referrerId: null, match: null };
}
```

- [ ] **Step 4: テストが通ることを確認**

Run: `npm test`
Expected: PASS（全 test）

- [ ] **Step 5: commit**

```bash
git add lib/referrer-match.ts lib/referrer-match.test.ts
git commit -m "紹介者: コード/名前の突合ロジックを追加"
```

---

## Task 5: referrers DB 層 `lib/referrers.ts`

**Files:**
- Create: `lib/referrers.ts`

**Interfaces:**
- Consumes: `getSupabaseAdmin`（`lib/supabase.ts`）, `encryptSecret`/`decryptSecret`（Task 1）, `generateReferralCode`（Task 2）
- Produces:
  - 型 `ReferrerInput`（平文フォーム値）と `ReferrerRow`（DB 行）
  - `async function insertReferrer(input): Promise<{ row: ReferrerRow; created: boolean }>` — 同一 active メールがあれば既存を返し `created:false`（冪等）
  - `async function findReferrerByCode(code: string): Promise<{ id: string } | null>`
  - `async function listReferrers(): Promise<ReferrerRow[]>`
  - `async function decryptReferrerBank(row: ReferrerRow): Promise<{ accountNumber: string; accountHolder: string; accountHolderKana: string }>`

- [ ] **Step 1: `lib/referrers.ts` を実装**

```typescript
import { getSupabaseAdmin } from "./supabase";
import { encryptSecret, decryptSecret } from "./crypto";
import { generateReferralCode } from "./referral-code";

export type ReferrerInput = {
  name: string;
  email: string;
  phone: string;
  isOwner: boolean;
  bankName: string;
  bankCode?: string;
  branchName: string;
  branchCode?: string;
  accountType: string; // '普通' | '当座'
  accountNumber: string;
  accountHolder: string;
  accountHolderKana: string;
  termsVersion: string;
  kind: "real" | "test";
  clientIp?: string;
  userAgent?: string;
};

export type ReferrerRow = {
  id: string;
  created_at: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  is_owner: boolean;
  bank_name: string;
  bank_code: string | null;
  branch_name: string;
  branch_code: string | null;
  account_type: string;
  account_number_enc: string;
  account_holder_enc: string;
  account_holder_kana_enc: string;
  terms_version: string;
  terms_agreed_at: string;
  status: string;
  kind: string;
  client_ip: string | null;
  user_agent: string | null;
};

export async function findReferrerByCode(code: string): Promise<{ id: string } | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("referrers")
    .select("id")
    .eq("code", code)
    .eq("status", "active")
    .maybeSingle();
  if (error) throw new Error(`findReferrerByCode failed: ${error.message}`);
  return data ? { id: (data as { id: string }).id } : null;
}

export async function insertReferrer(
  input: ReferrerInput,
): Promise<{ row: ReferrerRow; created: boolean }> {
  const supabase = getSupabaseAdmin();

  // 冪等: 同一 active メールがあれば既存を返す
  const { data: existing, error: exErr } = await supabase
    .from("referrers")
    .select("*")
    .ilike("email", input.email)
    .eq("status", "active")
    .maybeSingle();
  if (exErr) throw new Error(`insertReferrer lookup failed: ${exErr.message}`);
  if (existing) return { row: existing as ReferrerRow, created: false };

  const base = {
    name: input.name,
    email: input.email,
    phone: input.phone,
    is_owner: input.isOwner,
    bank_name: input.bankName,
    bank_code: input.bankCode ?? null,
    branch_name: input.branchName,
    branch_code: input.branchCode ?? null,
    account_type: input.accountType,
    account_number_enc: encryptSecret(input.accountNumber),
    account_holder_enc: encryptSecret(input.accountHolder),
    account_holder_kana_enc: encryptSecret(input.accountHolderKana),
    terms_version: input.termsVersion,
    terms_agreed_at: new Date().toISOString(),
    kind: input.kind,
    client_ip: input.clientIp ?? null,
    user_agent: input.userAgent ?? null,
  };

  // code の UNIQUE 衝突時はリトライ
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateReferralCode();
    const { data, error } = await supabase
      .from("referrers")
      .insert({ ...base, code })
      .select()
      .single();
    if (!error) return { row: data as ReferrerRow, created: true };
    // 23505 = unique_violation。email 衝突（並行登録）なら既存返す。
    if (error.code === "23505") {
      const { data: raced } = await supabase
        .from("referrers")
        .select("*")
        .ilike("email", input.email)
        .eq("status", "active")
        .maybeSingle();
      if (raced) return { row: raced as ReferrerRow, created: false };
      continue; // code 衝突なら別コードで再試行
    }
    throw new Error(`insertReferrer failed: ${error.message}`);
  }
  throw new Error("insertReferrer: code generation exhausted retries");
}

export async function listReferrers(): Promise<ReferrerRow[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("referrers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`listReferrers failed: ${error.message}`);
  return (data ?? []) as ReferrerRow[];
}

export async function decryptReferrerBank(row: ReferrerRow): Promise<{
  accountNumber: string;
  accountHolder: string;
  accountHolderKana: string;
}> {
  return {
    accountNumber: decryptSecret(row.account_number_enc),
    accountHolder: decryptSecret(row.account_holder_enc),
    accountHolderKana: decryptSecret(row.account_holder_kana_enc),
  };
}
```

- [ ] **Step 2: 型チェック**

Run: `npx tsc --noEmit`
Expected: エラーなし（既存の型エラーが出る場合は自分の追加分に無いことを確認）

- [ ] **Step 3: commit**

```bash
git add lib/referrers.ts
git commit -m "紹介者: referrers DB 層（冪等 insert・code 衝突リトライ・復号）"
```

---

## Task 6: Slack 汎用投稿 `lib/slack-notify.ts`

**Files:**
- Create: `lib/slack-notify.ts`

**Interfaces:**
- Produces:
  - `async function postToSlack(channelId: string, opts: { text: string; blocks?: Array<Record<string, unknown>>; threadTs?: string }): Promise<{ ok: boolean; error?: string }>`
  - `async function notifyReferralRegistered(input: { code: string; name: string; email: string; phone: string; isOwner: boolean }): Promise<void>` — `SLACK_REFERRAL_CHANNEL_ID` へ投稿。未設定/失敗は握りつぶし（no-op）。
  - `async function notifyReferredLead(input: { name: string; email: string; referrerCode?: string; referrerName?: string; match: string | null; leadId: string }): Promise<void>` — `SLACK_REFERRAL_CHANNEL_ID` へ投稿。

- [ ] **Step 1: `lib/slack-notify.ts` を実装**

```typescript
const SLACK_TIMEOUT_MS = 5000;

export async function postToSlack(
  channelId: string,
  opts: { text: string; blocks?: Array<Record<string, unknown>>; threadTs?: string },
): Promise<{ ok: boolean; error?: string }> {
  const token = (process.env.SLACK_BOT_TOKEN || "").trim();
  if (!token || !channelId) {
    return { ok: true, error: "SLACK_BOT_TOKEN / channelId not configured (skipped)" };
  }
  const payload: Record<string, unknown> = {
    channel: channelId,
    text: opts.text,
    unfurl_links: false,
    unfurl_media: false,
  };
  if (opts.blocks) payload.blocks = opts.blocks;
  if (opts.threadTs) payload.thread_ts = opts.threadTs;

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), SLACK_TIMEOUT_MS);
  try {
    const resp = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      signal: ac.signal,
    });
    const json = (await resp.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!json?.ok) return { ok: false, error: `slack error: ${json?.error || resp.status}` };
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.name === "AbortError" ? "timeout" : String(err?.message || err) };
  } finally {
    clearTimeout(timer);
  }
}

const REFERRAL_CHANNEL = () => (process.env.SLACK_REFERRAL_CHANNEL_ID || "").trim();

export async function notifyReferralRegistered(input: {
  code: string;
  name: string;
  email: string;
  phone: string;
  isOwner: boolean;
}): Promise<void> {
  const lines = [
    `*🎁 新規紹介者登録*`,
    `*コード:* \`${input.code}\``,
    `*氏名:* ${input.name}`,
    `*メール:* ${input.email}`,
    `*電話:* ${input.phone}`,
    `*区分:* ${input.isOwner ? "既存オーナー(自己申告)" : "外部紹介者"}`,
  ];
  const res = await postToSlack(REFERRAL_CHANNEL(), {
    text: `🎁 新規紹介者登録: ${input.name}`,
    blocks: [{ type: "section", text: { type: "mrkdwn", text: lines.join("\n") } }],
  });
  if (!res.ok) console.warn(`[referral] slack notify (registered) failed: ${res.error}`);
}

export async function notifyReferredLead(input: {
  name: string;
  email: string;
  referrerCode?: string;
  referrerName?: string;
  match: string | null;
  leadId: string;
}): Promise<void> {
  const matchLabel =
    input.match === "code"
      ? "✅ コード一致"
      : input.match === "name_candidate"
        ? "🔎 名前のみ(要確認)"
        : input.match === "unmatched"
          ? "⚠️ コード不一致(要確認)"
          : "(紹介者情報なし)";
  const lines = [
    `*🤝 紹介付きリード*`,
    `*見込み客:* ${input.name} / ${input.email}`,
    `*紹介コード:* ${input.referrerCode || "(なし)"}`,
    `*紹介者名:* ${input.referrerName || "(なし)"}`,
    `*突合:* ${matchLabel}`,
  ];
  const res = await postToSlack(REFERRAL_CHANNEL(), {
    text: `🤝 紹介付きリード: ${input.name}`,
    blocks: [
      { type: "section", text: { type: "mrkdwn", text: lines.join("\n") } },
      { type: "context", elements: [{ type: "mrkdwn", text: `Lead ID: \`${input.leadId}\`` }] },
    ],
  });
  if (!res.ok) console.warn(`[referral] slack notify (lead) failed: ${res.error}`);
}
```

- [ ] **Step 2: 型チェック**

Run: `npx tsc --noEmit`
Expected: 自分の追加分にエラーなし

- [ ] **Step 3: commit**

```bash
git add lib/slack-notify.ts
git commit -m "紹介者: Slack #404 汎用投稿 + 登録/リード通知ビルダー"
```

---

## Task 7: 登録 API `/api/referral/register`

**Files:**
- Create: `app/api/referral/register/route.ts`

**Interfaces:**
- Consumes: `insertReferrer`（Task 5）, `notifyReferralRegistered`（Task 6）, `classifyKind`（`lib/test-classifier.ts`）
- Produces: `POST /api/referral/register` → `{ code: string }`（201）/ エラー時 `{ error }`

`TERMS_VERSION` は `"2026-07-01"` 固定文字列で定義する。

- [ ] **Step 1: `app/api/referral/register/route.ts` を実装**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { insertReferrer } from "@/lib/referrers";
import { notifyReferralRegistered } from "@/lib/slack-notify";
import { classifyKind } from "@/lib/test-classifier";

export const runtime = "nodejs";

const TERMS_VERSION = "2026-07-01";

const ALLOWED_HOSTS = new Set([
  "sekaistay.com",
  "www.sekaistay.com",
  "localhost:3000",
  "localhost",
]);

const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

const rateMap = new Map<string, number[]>();
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT = 10;

function checkRate(ip: string): boolean {
  const now = Date.now();
  const recent = (rateMap.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) return false;
  recent.push(now);
  rateMap.set(ip, recent);
  return true;
}

function trim(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function originHost(req: NextRequest): string | null {
  for (const h of [req.headers.get("origin"), req.headers.get("referer")]) {
    if (h) { try { return new URL(h).host.toLowerCase(); } catch {} }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const host = originHost(req);
  if (process.env.NODE_ENV === "production" && (!host || !ALLOWED_HOSTS.has(host))) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }
  const ip = (req.headers.get("x-forwarded-for")?.split(",")[0].trim()) || "unknown";
  if (!checkRate(ip)) {
    return NextResponse.json({ error: "登録の上限に達しました。時間をおいてお試しください。" }, { status: 429 });
  }

  let body: any;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 });
  }

  // honeypot: 隠しフィールド website が埋まっていたら bot として静かに成功扱い
  if (trim(body.website, 100)) {
    return NextResponse.json({ code: "SS-000000" }, { status: 201 });
  }

  const name = trim(body.name, 100);
  const email = trim(body.email, 200);
  const phone = trim(body.phone, 50);
  const bankName = trim(body.bankName, 100);
  const branchName = trim(body.branchName, 100);
  const accountType = trim(body.accountType, 10);
  const accountNumber = trim(body.accountNumber, 20);
  const accountHolder = trim(body.accountHolder, 100);
  const accountHolderKana = trim(body.accountHolderKana, 100);
  const termsAgreed = body.termsAgreed === true;

  if (!name) return NextResponse.json({ error: "お名前を入力してください" }, { status: 400 });
  if (!email || !EMAIL_RE.test(email))
    return NextResponse.json({ error: "メールアドレスの形式が正しくありません" }, { status: 400 });
  if (!phone) return NextResponse.json({ error: "電話番号を入力してください" }, { status: 400 });
  if (!bankName || !branchName || !accountNumber || !accountHolder || !accountHolderKana)
    return NextResponse.json({ error: "振込先情報をすべて入力してください" }, { status: 400 });
  if (accountType !== "普通" && accountType !== "当座")
    return NextResponse.json({ error: "口座種別を選択してください" }, { status: 400 });
  if (!/^[0-9]{1,10}$/.test(accountNumber))
    return NextResponse.json({ error: "口座番号は数字で入力してください" }, { status: 400 });
  if (!termsAgreed)
    return NextResponse.json({ error: "規約への同意が必要です" }, { status: 400 });

  const kind = classifyKind(name, email);
  const userAgent = req.headers.get("user-agent")?.slice(0, 500) || undefined;

  try {
    const { row, created } = await insertReferrer({
      name, email, phone,
      isOwner: body.isOwner === true,
      bankName,
      bankCode: trim(body.bankCode, 10) || undefined,
      branchName,
      branchCode: trim(body.branchCode, 10) || undefined,
      accountType,
      accountNumber, accountHolder, accountHolderKana,
      termsVersion: TERMS_VERSION,
      kind,
      clientIp: ip,
      userAgent,
    });

    if (created && kind === "real") {
      await notifyReferralRegistered({
        code: row.code, name: row.name, email: row.email, phone: row.phone, isOwner: row.is_owner,
      }).catch(() => {});
    }
    return NextResponse.json({ code: row.code }, { status: 201 });
  } catch (err: any) {
    console.error("[referral/register] failed:", err?.message || err);
    return NextResponse.json({ error: "登録に失敗しました。時間をおいて再度お試しください。" }, { status: 500 });
  }
}
```

- [ ] **Step 2: 型チェック + ビルド**

Run: `npx tsc --noEmit`
Expected: 自分の追加分にエラーなし

- [ ] **Step 3: commit**

```bash
git add app/api/referral/register/route.ts
git commit -m "紹介者: 登録 API /api/referral/register（バリデーション・冪等・honeypot・#404通知）"
```

---

## Task 8: `/referral` ページ + レイアウト + 規約

**Files:**
- Create: `app/referral/layout.tsx`
- Create: `app/referral/page.tsx`

**Interfaces:**
- Consumes: `POST /api/referral/register`（Task 7）

- [ ] **Step 1: `app/referral/layout.tsx` を作成**

`app/contact/layout.tsx` を参考に、metadata を設定:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '紹介者登録 | SEKAI STAY',
  description: 'SEKAI STAY に物件オーナーをご紹介いただける方の登録フォーム。紹介コードを発行します。',
  robots: { index: false, follow: false },
}

export default function ReferralLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 2: `app/referral/page.tsx` を作成**

`app/contact/page.tsx` の構造（Header/Footer/Field/inputCls・成功ステート）を踏襲。全文:

```tsx
'use client'

import { useState, FormEvent } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { IconCheck, IconArrowRight } from '@/components/Icons'

const inputCls =
  'w-full bg-mist border border-rule px-5 py-4 text-[15px] font-sans text-ink placeholder:text-mid-gray/70 outline-none transition focus:border-sekai-teal focus:bg-paper'

export default function ReferralPage() {
  const [submitting, setSubmitting] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const data = new FormData(e.currentTarget)
    const payload = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      isOwner: data.get('isOwner') === 'on',
      bankName: String(data.get('bankName') || '').trim(),
      bankCode: String(data.get('bankCode') || '').trim(),
      branchName: String(data.get('branchName') || '').trim(),
      branchCode: String(data.get('branchCode') || '').trim(),
      accountType: String(data.get('accountType') || '').trim(),
      accountNumber: String(data.get('accountNumber') || '').trim(),
      accountHolder: String(data.get('accountHolder') || '').trim(),
      accountHolderKana: String(data.get('accountHolderKana') || '').trim(),
      termsAgreed: data.get('termsAgreed') === 'on',
      website: String(data.get('website') || ''), // honeypot
    }
    try {
      const res = await fetch('/api/referral/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const body = await res.json().catch(() => ({}))
      if (res.ok && body.code) {
        setCode(body.code)
      } else {
        setError(body?.error || '登録に失敗しました。時間をおいて再度お試しください。')
      }
    } catch {
      setError('通信エラーが発生しました。時間をおいて再度お試しください。')
    }
    setSubmitting(false)
  }

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
  }

  return (
    <>
      <Header />
      <main className="bg-ivory">
        <section className="bg-paper border-b border-rule">
          <div className="container-edit section-hero">
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <p className="eyebrow text-sekai-teal">Referral</p>
            </div>
            <h1 className="heading-display text-ink mb-5">
              紹介者登録
              <span className="block font-sans font-light text-mid-gray text-[0.6em] mt-3">Introducer Registration</span>
            </h1>
            <p className="lead text-dark-gray max-w-2xl">
              SEKAI STAY に物件オーナーをご紹介いただける方の登録フォームです。ご登録で紹介コードを発行します。
              成約時には所定の紹介謝礼をお振込みします（詳細は規約をご確認ください）。
            </p>
          </div>
        </section>

        <section className="section-xl">
          <div className="container-narrow px-5 md:px-8 max-w-2xl">
            {code ? (
              <div className="bg-paper border border-rule">
                <div className="bg-ink text-ivory px-8 py-10 text-center">
                  <div className="w-14 h-14 border-[3px] border-bright-teal flex items-center justify-center mx-auto mb-5">
                    <IconCheck size={22} className="text-bright-teal" />
                  </div>
                  <p className="eyebrow-mono text-bright-teal mb-3">Registered</p>
                  <h2 className="font-sans text-[22px] md:text-[26px] mb-4">登録が完了しました</h2>
                  <p className="font-sans text-body-sm text-ivory/80 mb-5">あなたの紹介コード</p>
                  <div className="text-[32px] md:text-[40px] font-mono tracking-widest text-bright-teal mb-5">{code}</div>
                  <button onClick={copyCode} className="btn btn-primary text-[14px]">
                    {copied ? 'コピーしました' : 'コードをコピー'}
                  </button>
                  <p className="font-sans text-caption text-ivory/70 mt-6 leading-[1.9]">
                    このコードを紹介先の方にお伝えください。<br />
                    お問い合わせフォームの「紹介者コード」欄にご記入いただくと紹介が記録されます。<br />
                    <strong className="text-ivory">この画面のコードは必ず保存してください。</strong>
                  </p>
                </div>
              </div>
            ) : (
              <div>
                {error && (
                  <div className="mb-6 bg-paper border border-red-300 text-red-700 px-4 py-3 text-[14px] font-sans">{error}</div>
                )}
                <form onSubmit={handleSubmit} className="bg-paper border border-rule p-6 md:p-10 space-y-7">
                  <Field number="01" label="お名前" required>
                    <input type="text" name="name" required className={inputCls} placeholder="山田 太郎" />
                  </Field>
                  <Field number="02" label="メールアドレス" required>
                    <input type="email" name="email" required className={inputCls} placeholder="example@email.com" />
                  </Field>
                  <Field number="03" label="電話番号" required>
                    <input type="tel" name="phone" required className={inputCls} placeholder="090-1234-5678" />
                  </Field>

                  <label className="flex items-center gap-3 font-sans text-[14px] text-ink">
                    <input type="checkbox" name="isOwner" className="w-4 h-4 accent-sekai-teal" />
                    私は SEKAI STAY の物件オーナーです
                  </label>

                  <div className="pt-2 border-t border-rule">
                    <p className="eyebrow-mono text-mid-gray mt-6 mb-4">振込先情報（紹介謝礼のお支払いに使用）</p>
                    <div className="grid grid-cols-2 gap-4">
                      <Field number="04" label="銀行名" required>
                        <input type="text" name="bankName" required className={inputCls} placeholder="〇〇銀行" />
                      </Field>
                      <Field number="05" label="銀行コード">
                        <input type="text" name="bankCode" className={inputCls} placeholder="0001" inputMode="numeric" />
                      </Field>
                      <Field number="06" label="支店名" required>
                        <input type="text" name="branchName" required className={inputCls} placeholder="〇〇支店" />
                      </Field>
                      <Field number="07" label="支店コード">
                        <input type="text" name="branchCode" className={inputCls} placeholder="001" inputMode="numeric" />
                      </Field>
                    </div>
                    <div className="mt-4">
                      <Field number="08" label="口座種別" required>
                        <select name="accountType" required className={inputCls} defaultValue="">
                          <option value="" disabled>選択してください</option>
                          <option value="普通">普通</option>
                          <option value="当座">当座</option>
                        </select>
                      </Field>
                    </div>
                    <div className="mt-4">
                      <Field number="09" label="口座番号" required>
                        <input type="text" name="accountNumber" required className={inputCls} placeholder="1234567" inputMode="numeric" />
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <Field number="10" label="口座名義" required>
                        <input type="text" name="accountHolder" required className={inputCls} placeholder="山田 太郎" />
                      </Field>
                      <Field number="11" label="口座名義（カナ）" required>
                        <input type="text" name="accountHolderKana" required className={inputCls} placeholder="ヤマダ タロウ" />
                      </Field>
                    </div>
                  </div>

                  {/* honeypot（bot 対策・視覚的に隠す） */}
                  <input type="text" name="website" tabIndex={-1} autoComplete="off"
                    className="hidden" aria-hidden="true" />

                  <div className="pt-4 border-t border-rule">
                    <TermsBox />
                    <label className="flex items-start gap-3 font-sans text-[14px] text-ink mt-4">
                      <input type="checkbox" name="termsAgreed" required className="w-4 h-4 mt-1 accent-sekai-teal" />
                      <span>上記の紹介プログラム規約に同意します（必須）</span>
                    </label>
                  </div>

                  <div className="pt-2">
                    <button type="submit" disabled={submitting}
                      className="btn btn-primary w-full justify-center text-[15px] py-4 disabled:opacity-50">
                      {submitting ? '登録中...' : (<>紹介者として登録する<IconArrowRight size={14} /></>)}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function TermsBox() {
  return (
    <div className="bg-bone border border-rule p-5 text-[13px] font-sans text-dark-gray leading-[1.9] max-h-56 overflow-y-auto">
      <p className="font-medium text-ink mb-2">紹介プログラム規約（2026-07-01版）</p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>本紹介謝礼は SEKAI STAY による任意的・恩恵的なものであり、SEKAI STAY は本規約に基づく法的な支払義務を負いません。</li>
        <li>謝礼の対象は、ご紹介いただいた見込みオーナーが SEKAI STAY と運用委託契約を締結（成約）した場合に限ります。契約に至らなかった場合、または成約後に解約・キャンセルとなった場合は対象外です。</li>
        <li>ご自身の紹介、および SEKAI STAY が既に商談中・接触済みの見込み先は対象外です。</li>
        <li>同一の見込み先に複数の紹介があった場合、最初に有効に成立した紹介を優先します。</li>
        <li>謝礼額・支払条件および本規約の内容は、SEKAI STAY が随時変更・終了できるものとします。</li>
        <li>ご登録の個人情報および振込先情報は、SEKAI STAY のプライバシーポリシーに従って取り扱います。</li>
        <li>反社会的勢力でないことを表明・確約いただきます。虚偽申告・不正行為が判明した場合、対象外または返還の対象とします。</li>
        <li>謝礼額は本規約に明記せず、SEKAI STAY が別途定め通知します。</li>
      </ol>
    </div>
  )
}

function Field({ number, label, required, children }: {
  number: string; label: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline gap-3 mb-3">
        <span className="font-sans font-light text-[22px] text-sekai-teal leading-none tabular-nums">{number}</span>
        <label className="font-sans font-medium text-[14px] md:text-[15px] text-ink">
          {label}{required && <span className="text-sekai-teal ml-1 font-sans">*</span>}
        </label>
      </div>
      {children}
    </div>
  )
}
```

- [ ] **Step 3: ローカル目視確認**

Run: `npm run dev`（別ターミナル）→ ブラウザで `http://localhost:3000/referral`
確認: フォーム表示・CSS 崩れなし・規約ボックススクロール・必須バリデーション。`REFERRAL_ENC_KEY` を `.env.local` に仮値（64 hex）投入した上で実登録 → 成功画面にコード表示。Supabase `referrers` に暗号化行が入ることを確認。

- [ ] **Step 4: commit**

```bash
git add app/referral/page.tsx app/referral/layout.tsx
git commit -m "紹介者: /referral 登録ページ + 規約"
```

---

## Task 9: `/contact` 紹介者欄 + submit 突合 + #404 通知

**Files:**
- Modify: `lib/lead-submissions.ts`
- Modify: `app/api/report-requests/submit/route.ts`
- Modify: `app/contact/page.tsx`

**Interfaces:**
- Consumes: `resolveReferrerMatch`（Task 4）, `findReferrerByCode`（Task 5）, `notifyReferredLead`（Task 6）
- Produces: リード送信時に `referrer_*` 列が保存され、`kind==='real'` かつ紹介者情報ありなら #404 通知。

- [ ] **Step 1: `lib/lead-submissions.ts` に referrer フィールドを追加**

`SubmitPayload` 型に追加（`formVariant` の後）:

```typescript
  // referrer attribution (Phase 1)
  referrerCode?: string;
  referrerName?: string;
  referrerId?: string;
  referrerMatch?: "code" | "name_candidate" | "unmatched";
```

`LeadSubmissionRow` 型に追加（`user_agent` の後）:

```typescript
  referrer_code: string | null;
  referrer_name: string | null;
  referrer_id: string | null;
  referrer_match: string | null;
```

`insertLeadSubmission` の `row` オブジェクトに追加（`user_agent` の後）:

```typescript
    referrer_code: payload.referrerCode ?? null,
    referrer_name: payload.referrerName ?? null,
    referrer_id: payload.referrerId ?? null,
    referrer_match: payload.referrerMatch ?? null,
```

- [ ] **Step 2: submit route で突合 + 通知を配線** — `app/api/report-requests/submit/route.ts`

import に追加:

```typescript
import { resolveReferrerMatch } from "@/lib/referrer-match";
import { findReferrerByCode } from "@/lib/referrers";
import { notifyReferredLead } from "@/lib/slack-notify";
```

`MAX_LENGTHS` に追加:

```typescript
  referrerCode: 20,
  referrerName: 100,
```

payload 構築の**前**（`const kind = classifyKind(...)` の直前あたり）で referrer 入力を取得し突合:

```typescript
  const referrerCodeIn = trim(body.referrerCode, MAX_LENGTHS.referrerCode);
  const referrerNameIn = trim(body.referrerName, MAX_LENGTHS.referrerName);
  const referrerMatch = await resolveReferrerMatch({
    code: referrerCodeIn || undefined,
    name: referrerNameIn || undefined,
    lookupByCode: findReferrerByCode,
  });
```

`payload` オブジェクトに追加（`formVariant` の後）:

```typescript
    referrerCode: referrerCodeIn || undefined,
    referrerName: referrerNameIn || undefined,
    referrerId: referrerMatch.referrerId || undefined,
    referrerMatch: referrerMatch.match || undefined,
```

`insertLeadSubmission` 成功後（`const row = await insertLeadSubmission(...)` の直後）に通知を追加（既存 forward の Promise.allSettled より前でよい・失敗握りつぶし）:

```typescript
    if (kind === "real" && referrerMatch.match) {
      await notifyReferredLead({
        name, email,
        referrerCode: referrerCodeIn || undefined,
        referrerName: referrerNameIn || undefined,
        match: referrerMatch.match,
        leadId: row.id,
      }).catch(() => {});
    }
```

- [ ] **Step 3: `/contact` フォームに紹介者欄を追加** — `app/contact/page.tsx`

`handleSubmit` 内の `message` 取得の後に追加:

```typescript
    const referrerCode = String(data.get('referrerCode') || '').trim()
    const referrerName = String(data.get('referrerName') || '').trim()
```

`fetch` の body に追加（`referrer:` の行の後など、`referrer: ...document.referrer...` とは別物なので注意）:

```typescript
          referrerCode: referrerCode || undefined,
          referrerName: referrerName || undefined,
```

フォームの「お問い合わせ内容」Field（number="04"）の後に紹介者欄 Field を追加:

```tsx
                  <Field number="05" label="紹介者コード（任意）">
                    <input type="text" name="referrerCode" className={inputCls}
                      placeholder="SS-XXXXXX" />
                  </Field>
                  <Field number="06" label="紹介者のお名前（任意）">
                    <input type="text" name="referrerName" className={inputCls}
                      placeholder="紹介してくれた方のお名前" />
                  </Field>
```

その直前に案内文を1行入れる（任意・Field の外側）:

```tsx
                  <p className="font-sans text-caption text-mid-gray -mb-2">
                    SEKAI STAY の紹介者から紹介された方は、以下にご記入ください。
                  </p>
```

- [ ] **Step 4: 型チェック + ビルド**

Run: `npx tsc --noEmit && npm run build`
Expected: 自分の変更に起因するエラーなし、ビルド成功

- [ ] **Step 5: ローカル目視 + 疎通確認**

Run: `npm run dev` → `/contact` に紹介者欄が表示されること。Task 8 で作った紹介者コードを入力して送信 → `lead_submissions` に `referrer_code`/`referrer_id`/`referrer_match='code'` が入ることを Supabase で確認。存在しないコード → `unmatched`。名前のみ → `name_candidate`。

- [ ] **Step 6: commit**

```bash
git add lib/lead-submissions.ts app/api/report-requests/submit/route.ts app/contact/page.tsx
git commit -m "紹介者: contact 紹介者欄 + submit 突合 + #404 リード通知"
```

---

## Task 10: 管理台帳 `/admin/referrals` + API 3 本

**Files:**
- Create: `app/api/admin/referrers/route.ts`（一覧）
- Create: `app/api/admin/referrers/resolve/route.ts`（手動確定）
- Create: `app/api/admin/referrers/reveal/route.ts`（口座復号）
- Create: `app/admin/referrals/page.tsx`

**Interfaces:**
- Consumes: `listReferrers`/`decryptReferrerBank`（Task 5）, `getSupabaseAdmin`
- Produces: 管理者が紹介者・紹介付きリードを閲覧、突合の手動確定、口座 reveal。全 API は `X_CONTENT_ADMIN_KEY` 必須。

`ADMIN_KEY` は `process.env.X_CONTENT_ADMIN_KEY` を使う。判定ヘルパは各 route にインラインで持つ（DRY より薄さ優先・既存流儀）。

- [ ] **Step 1: 一覧 API `app/api/admin/referrers/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { listReferrers } from "@/lib/referrers";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

function authed(req: NextRequest): boolean {
  const key = (process.env.X_CONTENT_ADMIN_KEY || "").trim();
  const given = req.nextUrl.searchParams.get("key") || req.headers.get("x-admin-key") || "";
  return !!key && given === key;
}

function mask(numberEnc: string): string {
  // 暗号化済み値は復号しない一覧では末尾表示しない。プレースホルダのみ。
  return "••••（reveal で表示）";
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const referrers = (await listReferrers()).map((r) => ({
    id: r.id, code: r.code, name: r.name, email: r.email, phone: r.phone,
    isOwner: r.is_owner, bankName: r.bank_name, branchName: r.branch_name,
    accountType: r.account_type, accountMasked: mask(r.account_number_enc),
    createdAt: r.created_at, status: r.status, kind: r.kind,
  }));

  const supabase = getSupabaseAdmin();
  const { data: leads } = await supabase
    .from("lead_submissions")
    .select("id, created_at, name, email, referrer_code, referrer_name, referrer_id, referrer_match")
    .not("referrer_match", "is", null)
    .order("created_at", { ascending: false })
    .limit(500);

  return NextResponse.json({ referrers, leads: leads ?? [] });
}
```

- [ ] **Step 2: 手動確定 API `app/api/admin/referrers/resolve/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

function authed(req: NextRequest, key?: string): boolean {
  const admin = (process.env.X_CONTENT_ADMIN_KEY || "").trim();
  return !!admin && (key || req.headers.get("x-admin-key") || "") === admin;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!authed(req, body.key)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const leadId = String(body.leadId || "");
  const referrerId = String(body.referrerId || "");
  if (!leadId || !referrerId) return NextResponse.json({ error: "leadId and referrerId required" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("lead_submissions")
    .update({ referrer_id: referrerId, referrer_match: "code" })
    .eq("id", leadId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: reveal API `app/api/admin/referrers/reveal/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { decryptReferrerBank } from "@/lib/referrers";
import type { ReferrerRow } from "@/lib/referrers";

export const runtime = "nodejs";

function authed(req: NextRequest, key?: string): boolean {
  const admin = (process.env.X_CONTENT_ADMIN_KEY || "").trim();
  return !!admin && (key || req.headers.get("x-admin-key") || "") === admin;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!authed(req, body.key)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const id = String(body.referrerId || "");
  if (!id) return NextResponse.json({ error: "referrerId required" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("referrers").select("*").eq("id", id).single();
  if (error || !data) return NextResponse.json({ error: "not found" }, { status: 404 });

  const bank = await decryptReferrerBank(data as ReferrerRow);
  return NextResponse.json({ ...bank });
}
```

- [ ] **Step 4: 管理ページ `app/admin/referrals/page.tsx`**

```tsx
'use client'

import { useState } from 'react'

type Referrer = {
  id: string; code: string; name: string; email: string; phone: string;
  isOwner: boolean; bankName: string; branchName: string; accountType: string;
  accountMasked: string; createdAt: string; status: string; kind: string
}
type Lead = {
  id: string; created_at: string; name: string; email: string;
  referrer_code: string | null; referrer_name: string | null;
  referrer_id: string | null; referrer_match: string | null
}

export default function ReferralsAdminPage() {
  const [key, setKey] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [referrers, setReferrers] = useState<Referrer[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [error, setError] = useState('')
  const [reveal, setReveal] = useState<Record<string, string>>({})

  const load = async () => {
    setError('')
    const res = await fetch(`/api/admin/referrers?key=${encodeURIComponent(key)}`)
    if (!res.ok) { setError('認証に失敗しました'); return }
    const data = await res.json()
    setReferrers(data.referrers); setLeads(data.leads); setLoaded(true)
  }

  const doReveal = async (id: string) => {
    const res = await fetch('/api/admin/referrers/reveal', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, referrerId: id }),
    })
    if (!res.ok) return
    const b = await res.json()
    setReveal((m) => ({ ...m, [id]: `${b.accountNumber} / ${b.accountHolder}（${b.accountHolderKana}）` }))
  }

  const resolve = async (leadId: string, referrerId: string) => {
    if (!referrerId) return
    const res = await fetch('/api/admin/referrers/resolve', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, leadId, referrerId }),
    })
    if (res.ok) load()
  }

  if (!loaded) {
    return (
      <div className="max-w-md mx-auto p-8 mt-20">
        <h1 className="text-xl font-medium mb-4">紹介者台帳（管理）</h1>
        <input type="password" value={key} onChange={(e) => setKey(e.target.value)}
          placeholder="管理キー" className="w-full border px-4 py-3 mb-3" />
        <button onClick={load} className="btn btn-primary w-full justify-center">読み込む</button>
        {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <section>
        <h2 className="text-lg font-medium mb-3">紹介者一覧（{referrers.length}）</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="border-b text-left">
              <th className="p-2">コード</th><th className="p-2">氏名</th><th className="p-2">連絡先</th>
              <th className="p-2">区分</th><th className="p-2">口座</th><th className="p-2">登録日</th>
            </tr></thead>
            <tbody>
              {referrers.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="p-2 font-mono">{r.code}</td>
                  <td className="p-2">{r.name}</td>
                  <td className="p-2">{r.email}<br />{r.phone}</td>
                  <td className="p-2">{r.isOwner ? 'オーナー' : '外部'}{r.kind === 'test' ? '(test)' : ''}</td>
                  <td className="p-2">
                    {r.bankName} {r.branchName} {r.accountType}<br />
                    {reveal[r.id] || r.accountMasked}
                    {!reveal[r.id] && <button onClick={() => doReveal(r.id)} className="ml-2 text-sekai-teal underline">reveal</button>}
                  </td>
                  <td className="p-2">{new Date(r.createdAt).toLocaleDateString('ja-JP')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-3">紹介付きリード（{leads.length}）</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="border-b text-left">
              <th className="p-2">日時</th><th className="p-2">見込み客</th><th className="p-2">紹介コード</th>
              <th className="p-2">紹介者名</th><th className="p-2">突合</th><th className="p-2">確定</th>
            </tr></thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b">
                  <td className="p-2">{new Date(l.created_at).toLocaleDateString('ja-JP')}</td>
                  <td className="p-2">{l.name}<br />{l.email}</td>
                  <td className="p-2 font-mono">{l.referrer_code || '-'}</td>
                  <td className="p-2">{l.referrer_name || '-'}</td>
                  <td className="p-2">{badge(l.referrer_match)}</td>
                  <td className="p-2">
                    {l.referrer_match !== 'code' && (
                      <select defaultValue="" onChange={(e) => resolve(l.id, e.target.value)} className="border px-1 py-1">
                        <option value="" disabled>紹介者を選択</option>
                        {referrers.map((r) => <option key={r.id} value={r.id}>{r.code} {r.name}</option>)}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function badge(match: string | null): string {
  if (match === 'code') return '✅ コード一致'
  if (match === 'name_candidate') return '🔎 名前のみ'
  if (match === 'unmatched') return '⚠️ 不一致'
  return '-'
}
```

- [ ] **Step 5: 型チェック + ビルド**

Run: `npx tsc --noEmit && npm run build`
Expected: 自分の変更に起因するエラーなし、ビルド成功

- [ ] **Step 6: ローカル目視**

Run: `npm run dev` → `/admin/referrals`。`X_CONTENT_ADMIN_KEY` を `.env.local` に入れてキー入力 → 一覧表示・reveal 復号・name_candidate リードの手動確定が動くこと。

- [ ] **Step 7: commit**

```bash
git add app/api/admin/referrers/route.ts app/api/admin/referrers/resolve/route.ts app/api/admin/referrers/reveal/route.ts app/admin/referrals/page.tsx
git commit -m "紹介者: /admin/referrals 台帳ビュー + 一覧/確定/reveal API"
```

---

## Task 11: デプロイ前提の整備（env・Slack・検証チェックリスト）

**Files:** なし（設定・ドキュメント作業）

このタスクはコードではなく、本番反映に必要な設定を揃える。**本番反映（push/deploy）は人間承認が必要**なため、この plan では「準備の完了」までとし、実際の `vercel --prod`/push はユーザー承認後に行う。

- [ ] **Step 1: `REFERRAL_ENC_KEY` を生成し Vercel Production に投入**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
出力（64 hex）を控え、`printf '%s' "<value>" | vercel env add REFERRAL_ENC_KEY production`（echo パイプ禁止・改行混入注意）。投入後 `vercel env ls` で存在確認。**ローカル `.env.local` にも同じ値を入れる**（開発検証用）。
※ この鍵は暗号化データの復号に必須。紛失すると既存口座データが復号不能になるため、値は安全に保管する。

- [ ] **Step 2: #404 チャンネル ID を取得し `SLACK_REFERRAL_CHANNEL_ID` を投入**

Slack MCP `slack_search_channels`（or `slack_list_channels`）で「404-sekaistay-リード獲得」の `channel_id` を取得。`printf '%s' "<Cxxxx>" | vercel env add SLACK_REFERRAL_CHANNEL_ID production`。
**Jennie bot（`SLACK_BOT_TOKEN` のアプリ）を #404 に招待**しておく（未招待だと `not_in_channel` で投稿失敗）。#404 が Slack Connect でも bot token 投稿は可。

- [ ] **Step 3: `X_CONTENT_ADMIN_KEY` の存在確認**

`vercel env ls` に既存で存在するはず（Sensitive）。無ければ生成して投入。ローカル `.env.local` にも同値を入れて `/admin/referrals` を検証。

- [ ] **Step 4: 全テスト + ビルドの最終確認**

Run: `npm test && npx tsc --noEmit && npm run build`
Expected: 全 test PASS・型エラーなし・ビルド成功。

- [ ] **Step 5: 本番反映の承認をユーザーに求める**

このブランチ `feat/referral-system` を PR にする準備が整ったことを報告し、**push / PR / 本番デプロイの承認**を求める（外部反映は人間判断）。承認後に ship スキルで main 反映 → `vercel --prod` → `/referral`・`/contact`・#404 通知の本番スモーク。

---

## Self-Review（プラン↔仕様の突合）

**Spec coverage:**
- §4.1 referrers テーブル → Task 3 ✅ / §4.2 lead 列 → Task 3 ✅
- §5 コード発行 → Task 2 ✅
- §6 /referral フォーム → Task 8 ✅（振込先・オーナーチェック・規約同意・成功時コード表示）
- §7 /contact 紹介者欄 + 突合 → Task 4 + Task 9 ✅
- §8 /admin/referrals + reveal + 手動確定 → Task 10 ✅
- §9 Slack #404 通知（登録・リード）→ Task 6 + Task 7 + Task 9 ✅
- §10 規約 → Task 8 `TermsBox` ✅
- §11 暗号化・レート制限・honeypot・Origin → Task 1 + Task 7 ✅
- §12 env → Task 11 ✅
- §13 テスト → Task 1/2/4 ユニット + 各 Task の dev 目視 ✅

**Placeholder scan:** 具体コード・具体コマンドを全 step に記載。TBD/TODO なし（規約文言のみ「レビュー時確定」だが本文は完成済み）。

**Type consistency:** `ReferrerRow`/`ReferrerInput`（Task 5）は Task 10 reveal で再利用。`ReferrerMatch.match` の enum（`code`/`name_candidate`/`unmatched`/`null`）は Task 4→9→10 で一貫。`generateReferralCode(rand?)` の署名は Task 2 定義・Task 5 で引数なし呼び出し（デフォルト `Math.random`）で整合。`encryptSecret`/`decryptSecret` 名は Task 1→5 で一貫。

**既知の割り切り（仕様どおり）:** 外部紹介者へのメール送付は Phase 2。Phase 1 は登録時コード画面表示のみ。成約自動確定・オーナー自動登録・振込先の owner 台帳連携も Phase 2。
