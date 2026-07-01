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
