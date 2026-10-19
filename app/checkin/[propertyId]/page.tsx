import type { Metadata } from "next";
import { cookies } from "next/headers";
import CheckinVerifyForm from "@/components/checkin/CheckinVerifyForm";
import { fetchProperties } from "@/lib/guest-register";
import { CHECKIN_COOKIE, checkinSecretsFromEnv, readCheckinAccess } from "@/lib/checkin-verify";

// 撮影ページ。鍵は URL でなく /c/<物件ID>?k= が置いた httpOnly Cookie から読む。
// Cookie が無い・鍵が合わない・物件が無い・秘密が未設定なら撮影ページを出さない（fail-closed）。
// 予約ごとのリンクから来た場合、物件の位置（物件マスタ G・H 列）が無ければ距離を判定できないので出さない。
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "チェックイン時の本人確認 | ID Check — SEKAI STAY",
  description: "SEKAI STAY 管理施設のチェックイン時の本人確認。お部屋のQRコードまたはご案内したリンクから、顔と身分証を一緒に写した写真をお送りください。",
  robots: { index: false, follow: false },
};

export default async function CheckinPage({ params }: { params: { propertyId: string } }) {
  const propertyId = (params.propertyId || "").trim();
  const access = readCheckinAccess(cookies().get(CHECKIN_COOKIE)?.value, propertyId, checkinSecretsFromEnv());

  let property: { id: string; name: string; nameEn: string; lat?: number } | undefined;
  if (access) {
    try {
      property = (await fetchProperties()).find((p) => p.id === propertyId && p.active);
    } catch (e) {
      console.error("[checkin] properties fetch failed:", e);
    }
  }

  if (!access || !property || (access.via === "link" && property.lat === undefined)) return <CheckinVerifyForm invalid />;
  return (
    <CheckinVerifyForm
      propertyId={property.id}
      propertyName={property.name}
      propertyNameEn={property.nameEn}
      bookingId={access.via === "link" ? access.bookingId : undefined}
    />
  );
}
