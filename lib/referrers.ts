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
