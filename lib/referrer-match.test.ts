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
