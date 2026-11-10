// 宿泊者名簿ページ専用の Web App Manifest（玄関の共有 iPad で「ホーム画面に追加」したときの名前と開き先）。
// サイト全体の /manifest.json は start_url が "/"（トップページ）なので、名簿ページで追加すると開き先がずれうる。
// 開き先は開いている ?p=（施設固定）と lang を保つ。表示は Safari のまま（display: browser）にする:
// iOS の単独表示（standalone）はカメラ・権限の挙動が Safari と違うことがあり、実機で確かめていないため。

const PROPERTY_ID_RE = /^[A-Za-z0-9_-]{1,32}$/;

export function registerStartUrl(p: string | null | undefined, lang: string | null | undefined): string {
  const params = new URLSearchParams();
  if (p && PROPERTY_ID_RE.test(p)) params.set("p", p);
  params.set("lang", lang === "en" ? "en" : "ja");
  return `/guest-register?${params.toString()}`;
}

export function registerManifestHref(p: string | null | undefined, lang: string | null | undefined): string {
  const params = new URLSearchParams();
  if (p && PROPERTY_ID_RE.test(p)) params.set("p", p);
  params.set("lang", lang === "en" ? "en" : "ja");
  return `/api/guest-register/manifest?${params.toString()}`;
}

export function buildRegisterManifest(p: string | null | undefined, lang: string | null | undefined) {
  const en = lang === "en";
  const startUrl = registerStartUrl(p, lang);
  return {
    name: en ? "Guest Register" : "宿泊者名簿",
    short_name: en ? "Guest Register" : "宿泊者名簿",
    id: startUrl,
    start_url: startUrl,
    scope: "/guest-register",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#0f766e",
    lang: en ? "en" : "ja",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
