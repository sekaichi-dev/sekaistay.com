import path from "path";
import crypto from "crypto";
import { updateJson, readJson } from "./atomic-json";

const DATA_PATH = path.join(process.cwd(), "data", "report-requests.json");

export type ReportRequestStatus =
  | "pending"
  | "generating"
  | "completed"
  | "sent"
  | "failed";

// "real" = 通常の実申請（自動処理対象）
// "test" = テスト申請（自動処理スキップ・集計除外・「テスト」バッジ表示）
export type ReportRequestKind = "real" | "test";

export type ReportRequest = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
  airbnbUrl?: string;
  bookingUrl?: string;
  peakRevenue?: string;
  offpeakRevenue?: string;
  commissionRate?: string;
  operatingYears?: string;
  totalProperties?: number;
  complaints?: string;
  // ── 広告経路トラッキング（クライアント側で URL から自動回収）──
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  landingUrl?: string;
  referrer?: string;
  status: ReportRequestStatus;
  slug?: string;
  reportUrl?: string;
  generatedAt?: string;
  scheduledSendAt?: string; // ISO — 承認時にセット。Scheduled cron picks up when < now.
  sentAt?: string;
  sendError?: string;
  hubspotDealId?: string;
  hubspotContactId?: string;
  hubspotTicketId?: string;
  hubspotNoteId?: string;
  error?: string;
  generatorLog?: string;
  archived?: boolean;
  // ── 種別（実申請 / テスト）── 未設定は "real" 扱い
  kind?: ReportRequestKind;
  // ── フォーム入口種別 ──
  // "default" = 4ステップ入力フォーム（/report-request）
  // "lite"    = メアド・電話・氏名先取り型（/report-request-lite）
  // 任意続行で物件URLや売上を埋めた人だけレポ自動生成、未入力は営業フォロー前提。
  formVariant?: "default" | "lite";
  // 任意項目（lite フォーム用。default フォームでは空のまま）
  companyName?: string;
  // ── 承認エスカレーション ── レポート生成後、人間が内容確認して承認するまで送信されない
  requiresApproval?: boolean;
  approvedAt?: string;
  approvedBy?: string; // session email (e.g. "hikaru@sekaichi.org")
  // ── レポート品質メタ（INC-028 対応）──
  // platform: スクレーパが解釈した data source (airbnb / booking)
  // photoHealth: ギャラリー画像が何枚 base64 埋込できたか
  reportPlatform?: "airbnb" | "booking";
  reportPhotoHealth?: { total: number; embedded: number; failed: number };
};

type Store = { requests: ReportRequest[] };

const EMPTY: Store = { requests: [] };

async function load(): Promise<Store> {
  const store = await readJson<Store>(DATA_PATH, EMPTY);
  return store.requests ? store : EMPTY;
}

export async function listRequests(): Promise<ReportRequest[]> {
  const store = await load();
  return [...store.requests].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getRequest(id: string): Promise<ReportRequest | null> {
  const store = await load();
  return store.requests.find((r) => r.id === id) ?? null;
}

export async function createRequest(
  input: Omit<ReportRequest, "id" | "createdAt" | "status">,
): Promise<ReportRequest> {
  const req: ReportRequest = {
    ...input,
    id: "req_" + crypto.randomBytes(6).toString("hex"),
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  await updateJson<Store>(DATA_PATH, EMPTY, (s) => {
    const next = s.requests ? s : { requests: [] };
    return { requests: [...next.requests, req] };
  });
  return req;
}

export async function updateRequest(
  id: string,
  patch: Partial<ReportRequest>,
): Promise<ReportRequest | null> {
  let updated: ReportRequest | null = null;
  await updateJson<Store>(DATA_PATH, EMPTY, (s) => {
    const requests = s.requests ? [...s.requests] : [];
    const idx = requests.findIndex((r) => r.id === id);
    if (idx === -1) return { requests };
    requests[idx] = { ...requests[idx], ...patch };
    updated = requests[idx];
    return { requests };
  });
  return updated;
}

