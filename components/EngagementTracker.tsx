"use client";

/**
 * EngagementTracker — LP 改善データ収集の client-side tracker
 *
 * 機能:
 * 1. scroll_depth イベント (25/50/75/100% で 1 回ずつ)
 * 2. section_view イベント (`data-track-section="..."` 要素が viewport に入った時に 1 回)
 * 3. cta_click イベント (`data-cta` または `[href^="#"]` 要素の押下時)
 *
 * すべて `lp_variant` をパラメータに含めて GA4 + dataLayer に送信。
 *
 * 使い方: 各 LP ページに `<EngagementTracker lpVariant="switch" />` を配置。
 */

import { useEffect } from "react";
import {
  trackEvent,
  checkAndMarkSent,
  SCROLL_DEPTH_THRESHOLDS,
  getScrollDepthPercent,
} from "@/lib/engagement-tracking";

type Props = {
  lpVariant: string;
};

export default function EngagementTracker({ lpVariant }: Props) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // ── 1. Scroll depth ─────────────────────────────────
    const scrollHandler = () => {
      const percent = getScrollDepthPercent();
      for (const threshold of SCROLL_DEPTH_THRESHOLDS) {
        if (percent >= threshold) {
          const key = `scroll_depth:${lpVariant}:${threshold}`;
          if (checkAndMarkSent(key)) {
            trackEvent("scroll_depth", {
              percent: threshold,
              lp_variant: lpVariant,
            });
          }
        }
      }
    };
    window.addEventListener("scroll", scrollHandler, { passive: true });

    // ── 2. Section view (IntersectionObserver) ──────────
    const sections = document.querySelectorAll<HTMLElement>(
      "[data-track-section]"
    );
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const name = (entry.target as HTMLElement).dataset.trackSection;
          if (!name) continue;
          const key = `section_view:${lpVariant}:${name}`;
          if (checkAndMarkSent(key)) {
            trackEvent("section_view", {
              section_name: name,
              lp_variant: lpVariant,
            });
          }
        }
      },
      { threshold: 0.3 } // 30% visible
    );
    sections.forEach((s) => sectionObserver.observe(s));

    // ── 3. CTA click (event delegation) ─────────────────
    const clickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 優先順位: data-cta が明示されている要素 → その他のCTA系要素
      const ctaEl = target.closest<HTMLElement>(
        "[data-cta], a[href^='#contact-form'], a[href*='timerex.net'], a[href*='Calendly']"
      );
      if (!ctaEl) return;

      const ctaLabel = (
        ctaEl.getAttribute("data-cta-label") ||
        ctaEl.textContent ||
        ""
      )
        .trim()
        .slice(0, 60);
      const ctaType = ctaEl.getAttribute("data-cta") || "scroll-to-form";

      // section context: CTA 自身の data-cta-section を最優先(固定ヘッダー/sticky 等、
      // viewport 観測される data-track-section を持たせたくない CTA 用)。
      // 無ければ親の data-track-section、それも無ければ "unknown"。
      const sectionEl = ctaEl.closest<HTMLElement>("[data-track-section]");
      const section =
        ctaEl.getAttribute("data-cta-section") ||
        sectionEl?.dataset.trackSection ||
        "unknown";

      trackEvent("cta_click", {
        cta_label: ctaLabel,
        cta_type: ctaType,
        section,
        lp_variant: lpVariant,
      });
    };
    document.addEventListener("click", clickHandler, { capture: true });

    return () => {
      window.removeEventListener("scroll", scrollHandler);
      sectionObserver.disconnect();
      document.removeEventListener("click", clickHandler, { capture: true });
    };
  }, [lpVariant]);

  return null;
}
