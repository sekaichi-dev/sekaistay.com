// 紛らわしい文字 (0/O/1/I/L/U) を除外した 26 文字集合
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";
const LEN = 6;

export function generateReferralCode(
  rand: () => number = Math.random
): string {
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
