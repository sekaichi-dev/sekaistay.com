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
