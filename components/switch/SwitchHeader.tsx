"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSwitchCtaLabels } from "@/hooks/useSwitchCtaLabels";

export default function SwitchHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { header } = useSwitchCtaLabels();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="h-[68px]" />
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-sm shadow-sm py-3"
            : "bg-white/85 backdrop-blur-sm py-3"
        }`}
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-3">
          <a href="/switch" className="flex items-center gap-2.5 min-h-[44px]">
            <Image
              src="/images/switch/logo-symbol.png"
              alt="SEKAI STAY"
              width={32}
              height={43}
              className="h-8 w-auto object-contain"
            />
            <div className="flex flex-col leading-none">
              <Image
                src="/images/switch/logo-text.png"
                alt="SEKAI STAY"
                width={120}
                height={16}
                className="h-4 w-auto object-contain hidden sm:inline-block"
              />
              <span className="sm:hidden text-[15px] font-bold text-switch-charcoal tracking-wide">
                SEKAI STAY
              </span>
              <span className="hidden sm:block text-[10px] text-switch-gray-mid mt-1 tracking-wide">
                民泊運用代行 · 手数料8%
              </span>
            </div>
          </a>
          <a
            href="#contact-form"
            data-cta="contact-form"
            data-cta-label="header"
            data-cta-section="header"
            className="bg-switch-accent text-white text-[10px] sm:text-sm font-bold px-3 sm:px-5 py-2.5 rounded-md hover:bg-switch-accent-hover transition-all shadow-sm min-h-[44px] flex items-center whitespace-nowrap"
          >
            {header}
          </a>
        </div>
      </header>
    </>
  );
}
