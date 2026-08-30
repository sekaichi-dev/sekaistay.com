"use client";

/* A/B test page-view tracker. 各 variant ページに `<PageViewTracker lpVariant="..." />` を配置。
 * sessionStorage で同一セッション内の重複送信を防ぐ + サーバー側でも IP+UA+day dedup。
 */

import { useEffect } from "react";

type Props = { lpVariant: string };

export default function PageViewTracker({ lpVariant }: Props) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `pv:${lpVariant}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    const params = new URLSearchParams(window.location.search);
    const get = (k: string) => params.get(k)?.slice(0, 200) || null;

    fetch("/api/track/page-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        lpVariant,
        referrer: document.referrer || null,
        utmSource: get("utm_source"),
        utmMedium: get("utm_medium"),
        utmCampaign: get("utm_campaign"),
        utmContent: get("utm_content"),
      }),
    }).catch(() => {
      sessionStorage.removeItem(key);
    });
  }, [lpVariant]);

  return null;
}
