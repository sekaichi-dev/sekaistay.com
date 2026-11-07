import type { Metadata } from "next";
import LeaseConsentForm from "@/components/lease/LeaseConsentForm";

// マンスリー（30 泊以上）の建物一時使用賃貸借契約の同意フォーム。画面だけで、予約・契約本文・送信先は ops の公開 API。
// k（鍵）はアクセス解析タグ（GA・広告ピクセル）に URL ごと渡らないよう、読み込み直後にアドレスバーから外して
// sessionStorage に移す（再読み込みでも開けるように）。ページ側は server で受けた k をそのまま部品へ渡す。
export const metadata: Metadata = {
  title: { absolute: "建物一時使用賃貸借契約 | SEKAI STAY" },
  description: "SEKAI STAY のマンスリー（30 泊以上）ご予約の建物一時使用賃貸借契約への同意フォームです。",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

const STRIP_KEY_SCRIPT = `(function(){try{var u=new URL(location.href);var k=u.searchParams.get("k");if(!k)return;try{sessionStorage.setItem("lease-k:"+u.pathname,k)}catch(e){}u.searchParams.delete("k");history.replaceState(history.state,"",u.pathname+u.search+u.hash)}catch(e){}})();`;

export default function LeasePage({
  params,
  searchParams,
}: {
  params: { bookingId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const k = searchParams.k;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: STRIP_KEY_SCRIPT }} />
      <LeaseConsentForm bookingId={params.bookingId} linkKey={typeof k === "string" ? k : ""} />
    </>
  );
}
