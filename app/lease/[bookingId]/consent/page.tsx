import type { Metadata } from "next";
import { cookies } from "next/headers";
import LeaseConsentForm from "@/components/lease/LeaseConsentForm";
import { LEASE_KEY_COOKIE, isLeaseLinkKey } from "@/lib/lease-consent";

// マンスリー（30 泊以上）の建物一時使用賃貸借契約の同意フォーム。画面だけで、予約・契約本文・送信先は ops の公開 API。
// 鍵は入口（/lease/<予約番号>?k=）が httpOnly Cookie に移してある。ここで読んで部品へ渡す（URL には出さない）。
// Cookie が無い・形が違うときは部品が「このリンクは現在ご利用いただけません」を出す。
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "建物一時使用賃貸借契約 | SEKAI STAY" },
  description: "SEKAI STAY のマンスリー（30 泊以上）ご予約の建物一時使用賃貸借契約への同意フォームです。",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function LeaseConsentPage({ params }: { params: { bookingId: string } }) {
  const raw = cookies().get(LEASE_KEY_COOKIE)?.value || "";
  return <LeaseConsentForm bookingId={params.bookingId} linkKey={isLeaseLinkKey(raw) ? raw : ""} />;
}
