import { getSupabaseAdmin } from "./supabase";

export type SubmitPayload = {
  // contact (required)
  name: string;
  email: string;
  phone: string;
  // property
  airbnbUrl?: string;
  totalProperties?: number;
  // revenue / fee
  peakRevenue?: string;
  offpeakRevenue?: string;
  commissionRate?: string;
  operatingYears?: string;
  complaints?: string;
  companyName?: string;
  // ad attribution
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  landingUrl?: string;
  referrer?: string;
  // A/B test
  lpVariant?: string;
  formVariant?: "default" | "lite";
  // どの CTA からフォームを開いたか (例: floating / header / pricing-campaign / audit-page)
  ctaSource?: string;
};

export type LeadSubmissionRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  airbnb_url: string | null;
  total_properties: number | null;
  peak_revenue: string | null;
  offpeak_revenue: string | null;
  commission_rate: string | null;
  operating_years: string | null;
  complaints: string | null;
  company_name: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  gclid: string | null;
  fbclid: string | null;
  landing_url: string | null;
  referrer: string | null;
  lp_variant: string | null;
  form_variant: string;
  cta_source: string | null;
  kind: "real" | "test";
  forwarded_at: string | null;
  forward_error: string | null;
  forward_retry_count: number;
  discord_notified_at: string | null;
  discord_error: string | null;
  client_ip: string | null;
  user_agent: string | null;
};

export async function insertLeadSubmission(input: {
  payload: SubmitPayload;
  kind: "real" | "test";
  clientIp?: string;
  userAgent?: string;
}): Promise<LeadSubmissionRow> {
  const { payload, kind, clientIp, userAgent } = input;
  const supabase = getSupabaseAdmin();

  const row = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    airbnb_url: payload.airbnbUrl ?? null,
    total_properties: payload.totalProperties ?? null,
    peak_revenue: payload.peakRevenue ?? null,
    offpeak_revenue: payload.offpeakRevenue ?? null,
    commission_rate: payload.commissionRate ?? null,
    operating_years: payload.operatingYears ?? null,
    complaints: payload.complaints ?? null,
    company_name: payload.companyName ?? null,
    utm_source: payload.utmSource ?? null,
    utm_medium: payload.utmMedium ?? null,
    utm_campaign: payload.utmCampaign ?? null,
    utm_content: payload.utmContent ?? null,
    utm_term: payload.utmTerm ?? null,
    gclid: payload.gclid ?? null,
    fbclid: payload.fbclid ?? null,
    landing_url: payload.landingUrl ?? null,
    referrer: payload.referrer ?? null,
    lp_variant: payload.lpVariant ?? null,
    form_variant: payload.formVariant ?? "default",
    cta_source: payload.ctaSource ?? null,
    kind,
    client_ip: clientIp ?? null,
    user_agent: userAgent ?? null,
  };

  const { data, error } = await supabase
    .from("lead_submissions")
    .insert(row)
    .select()
    .single();

  if (error) throw new Error(`insertLeadSubmission failed: ${error.message}`);
  return data as LeadSubmissionRow;
}
