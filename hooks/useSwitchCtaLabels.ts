"use client";

import { usePathname } from "next/navigation";

/**
 * /switch 系LPのバリアント別CTAラベル。
 * 各バリアントの訴求軸に合わせてボタン文言を出し分ける。
 */
export type SwitchCtaLabels = {
  primary: string;
  sticky: string;
  header: string;
};

export function useSwitchCtaLabels(): SwitchCtaLabels {
  const pathname = usePathname();

  if (pathname?.startsWith("/switch/portal")) {
    return {
      primary: "アプリのデモを予約する",
      sticky: "運用のご相談はこちら",
      header: "アプリのデモを予約する",
    };
  }

  if (pathname?.startsWith("/switch/founder")) {
    return {
      primary: "専門家に相談する",
      sticky: "専門家に無料相談する",
      header: "民泊運用のご相談はこちら",
    };
  }

  return {
    primary: "無料で診断レポートをもらう",
    sticky: "無料で診断",
    header: "運用のご相談はこちら",
  };
}
