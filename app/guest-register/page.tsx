import type { Metadata } from "next";
import GuestRegisterForm from "@/components/guest-register/GuestRegisterForm";
import { registerManifestHref } from "@/lib/guest-register-manifest";

type SearchParams = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

// ホーム画面に追加したときの名前と開き先は名簿ページ専用の manifest で決める（サイト全体の manifest は変えない）
export function generateMetadata({ searchParams }: { searchParams: SearchParams }): Metadata {
  const lang = first(searchParams.lang);
  return {
    title: "宿泊者名簿のご登録 | Guest Registration — SEKAI STAY",
    description:
      "SEKAI STAY 管理施設の宿泊者名簿登録フォーム。旅館業法・住宅宿泊事業法に基づき、ご宿泊者全員のご登録をお願いしています。",
    robots: { index: false, follow: false },
    manifest: registerManifestHref(first(searchParams.p), lang),
    // capable: false = 単独表示（standalone）にしない。省略すると Next が apple-mobile-web-app-capable=yes を出す
    appleWebApp: { capable: false, title: lang === "en" ? "Guest Register" : "宿泊者名簿" },
  };
}

export default function GuestRegisterPage() {
  return <GuestRegisterForm />;
}
