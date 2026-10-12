import type { Metadata } from "next";
import CheckinVerifyForm from "@/components/checkin/CheckinVerifyForm";
import { fetchProperties } from "@/lib/guest-register";
import { verifyRoomKey } from "@/lib/checkin-verify";

// 室内 QR（/checkin/<物件ID>?k=<鍵>）の入口。鍵が合わない・物件が無い・秘密が未設定なら撮影ページを出さない（fail-closed）。
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "チェックイン時の本人確認 | ID Check — SEKAI STAY",
  description: "SEKAI STAY 管理施設のチェックイン時の本人確認。お部屋のQRコードから、顔と身分証を一緒に写した写真をお送りください。",
  robots: { index: false, follow: false },
};

export default async function CheckinPage({
  params,
  searchParams,
}: {
  params: { propertyId: string };
  searchParams: { k?: string | string[] };
}) {
  const propertyId = (params.propertyId || "").trim();
  const key = (Array.isArray(searchParams.k) ? searchParams.k[0] : searchParams.k || "").trim();
  const secret = (process.env.CHECKIN_QR_SECRET || "").trim();

  let property: { id: string; name: string; nameEn: string } | undefined;
  if (secret && verifyRoomKey(propertyId, key, secret)) {
    try {
      property = (await fetchProperties()).find((p) => p.id === propertyId && p.active);
    } catch (e) {
      console.error("[checkin] properties fetch failed:", e);
    }
  }

  if (!property) return <CheckinVerifyForm invalid />;
  return <CheckinVerifyForm propertyId={property.id} roomKey={key} propertyName={property.name} propertyNameEn={property.nameEn} />;
}
