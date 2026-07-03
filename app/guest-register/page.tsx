import type { Metadata } from "next";
import GuestRegisterForm from "@/components/guest-register/GuestRegisterForm";

export const metadata: Metadata = {
  title: "宿泊者名簿のご登録 | Guest Registration — SEKAI STAY",
  description:
    "SEKAI STAY 管理施設の宿泊者名簿登録フォーム。旅館業法・住宅宿泊事業法に基づき、ご宿泊者全員のご登録をお願いしています。",
  robots: { index: false, follow: false },
};

export default function GuestRegisterPage() {
  return <GuestRegisterForm />;
}
