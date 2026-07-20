"use client";

import { useEffect, useState } from "react";
import { useSwitchCtaLabels } from "@/hooks/useSwitchCtaLabels";

/**
 * スクロール後にフッター追従で現れる小さなCTA ボタン。
 * 年配オーナーがスクロール中にCTAを見失わないための保険。
 * Hero通過後に出現し、フォーム到達時は非表示。
 * バリアントごとにラベルを出し分け（useSwitchCtaLabels）。
 */
export default function SwitchStickyCTA() {
  const [visible, setVisible] = useState(false);
  const { sticky } = useSwitchCtaLabels();

  useEffect(() => {
    const onScroll = () => {
      const y = window.pageYOffset;
      const form = document.getElementById("contact-form");
      const formTop = form ? form.offsetTop - window.innerHeight : Infinity;
      setVisible(y > 600 && y < formTop);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <a
        href="#contact-form"
        data-cta="contact-form"
        data-cta-label="sticky"
        data-cta-section="sticky"
        className="group relative flex items-center bg-switch-accent text-white font-bold text-sm sm:text-base px-5 sm:px-6 py-3.5 sm:py-4 rounded-md shadow-lg hover:shadow-xl hover:bg-switch-accent-hover hover:-translate-y-0.5 transition-all min-h-[44px]"
      >
        {/* 新着 ping ドット（要素削減後、視認性の核として残す） */}
        <span aria-hidden className="absolute -top-1 -right-1 flex w-3 h-3">
          <span className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75" />
          <span className="relative w-3 h-3 bg-yellow-400 rounded-full border border-white" />
        </span>
        {sticky}
      </a>
    </div>
  );
}
