# 03. データスキーマ

> 出典: `src/lib/report-requests.ts`（同梱の `report-request-types.ts` 参照）

## 顧客が送ってくる全項目

フォーム送信時に `POST /api/report-requests/submit` に送られる JSON の完全構造。

```typescript
type SubmitPayload = {
  // ── 必須 ──
  name: string;              // お名前（最大100文字）
  email: string;             // メール（email形式・最大200文字）
  phone: string;             // 電話番号（最大50文字）

  // ── 物件情報（default form では airbnbUrl 必須／lite form では任意）──
  airbnbUrl: string;         // Airbnb 物件URL（最大1000文字・hostバリデーション有り）

  // ── 売上（Range文字列）──
  peakRevenue?: string;      // "0-10" / "10-20" / ... / "300+"
  offpeakRevenue?: string;   // 同上

  // ── 手数料・運用 ──
  commissionRate?: string;   // "15" / "20" / "25" / "unknown"
  operatingYears?: string;   // "0" / "1" / "3" / "5"

  // ── その他 ──
  totalProperties?: number;  // 1〜30（30 = 30棟以上）
  complaints?: string;       // 不満・要望（最大2000文字）
  companyName?: string;      // 会社名（lite form 用・任意）

  // ── 広告経路 ──
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  landingUrl?: string;
  referrer?: string;

  // ── フォーム種別 ──
  formVariant?: "default" | "lite";  // default = 4ステップ / lite = メアド先取り型
};
```

## 永続化されるレコード

サーバー側で受信後、以下の構造で `data/report-requests.json` に保存される（DB 化予定）。

```typescript
type ReportRequest = {
  // ── 自動付与 ──
  id: string;                // "req_" + 12桁hex
  createdAt: string;         // ISO8601
  status: "pending" | "generating" | "completed" | "sent" | "failed";

  // ── 入力データ（上記 SubmitPayload の全項目）──
  name: string;
  email: string;
  phone?: string;
  airbnbUrl?: string;
  bookingUrl?: string;       // 旧フィールド（互換維持・新規申請では使用禁止）
  peakRevenue?: string;
  offpeakRevenue?: string;
  commissionRate?: string;
  operatingYears?: string;
  totalProperties?: number;
  complaints?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  landingUrl?: string;
  referrer?: string;
  formVariant?: "default" | "lite";
  companyName?: string;

  // ── レポート生成・送信メタ ──
  slug?: string;             // レポートURL slug
  reportUrl?: string;        // 生成済みレポート URL
  generatedAt?: string;
  scheduledSendAt?: string;  // 承認時にセット・cron が拾って送信
  sentAt?: string;
  sendError?: string;

  // ── 承認エスカレーション ──
  requiresApproval?: boolean;
  approvedAt?: string;
  approvedBy?: string;       // session email

  // ── HubSpot 連携 ID ──
  hubspotContactId?: string;
  hubspotDealId?: string;
  hubspotTicketId?: string;
  hubspotNoteId?: string;

  // ── 種別 ──
  kind?: "real" | "test";    // テスト判定用（自動分類）

  // ── レポート品質メタ ──
  reportPlatform?: "airbnb" | "booking";
  reportPhotoHealth?: { total: number; embedded: number; failed: number };

  // ── その他 ──
  archived?: boolean;
  error?: string;
  generatorLog?: string;
};
```

## テスト判定ロジック

submit route で以下のヒューリスティックで `kind` を自動分類する（集計から除外するため）:

```typescript
const INTERNAL_TEST_EMAILS = new Set([
  "ksssshy@gmail.com", "hikaru@sekaichi.org", "tenichi@sekaichi.org",
  "kojiro@sekaichi.org", "yoshito@sekaichi.org", "ryosuke@sekaichi.org",
  "ona@sekaichi.org", "toyo@sekaichi.org",
]);
const TEST_EMAIL_DOMAINS = ["example.com", "example.org", "example.net",
  "test.com", "test.invalid", "verify-do-not-process.invalid",
  "japanvillas-e2e.invalid"];
const TEST_NAME_PATTERNS = /^(test|tst|...|あ|い|う|a|aa|aaa|x|xx)$/i;

function classifyKind(name, email): "real" | "test" {
  if (TEST_NAME_PATTERNS.test(name.trim())) return "test";
  if (/^test|テスト|TEST/i.test(name.trim())) return "test";
  if (INTERNAL_TEST_EMAILS.has(email.toLowerCase())) return "test";
  const domain = email.toLowerCase().split("@")[1] ?? "";
  if (TEST_EMAIL_DOMAINS.includes(domain)) return "test";
  return "real";
}
```

テンイチ側でも同じロジックを実装することを推奨（吉蔵側に転送する前にテスト除外しておくとクリーン）。

