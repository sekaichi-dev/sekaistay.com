const INTERNAL_TEST_EMAILS = new Set([
  "ksssshy@gmail.com",
  "hikaru@sekaichi.org",
  "tenichi@sekaichi.org",
  "kojiro@sekaichi.org",
  "yoshito@sekaichi.org",
  "ryosuke@sekaichi.org",
  "ona@sekaichi.org",
  "toyo@sekaichi.org",
]);

const TEST_EMAIL_DOMAINS = [
  "example.com",
  "example.org",
  "example.net",
  "test.com",
  "test.invalid",
  "verify-do-not-process.invalid",
  "japanvillas-e2e.invalid",
];

const TEST_NAME_PATTERNS = /^(test|tst|ttt|あ|い|う|a|aa|aaa|x|xx|xxx)$/i;

export function classifyKind(name: string, email: string): "real" | "test" {
  const trimmedName = name.trim();
  if (TEST_NAME_PATTERNS.test(trimmedName)) return "test";
  if (/^test|テスト|TEST/i.test(trimmedName)) return "test";
  if (INTERNAL_TEST_EMAILS.has(email.toLowerCase())) return "test";
  const domain = email.toLowerCase().split("@")[1] ?? "";
  if (TEST_EMAIL_DOMAINS.includes(domain)) return "test";
  return "real";
}
