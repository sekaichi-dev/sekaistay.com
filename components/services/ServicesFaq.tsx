"use client";

import { useState } from "react";
import TextSlideUp from "@/components/motion/TextSlideUp";

/* 運用代行FAQ — sense-trust トンマナのアコーディオン（Deep Teal） */
export default function ServicesFaq({
  items,
  sub = "よくある質問",
}: {
  items: { q: string; a: string }[];
  sub?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="w-full bg-paper section-2xl">
      <div className="container-edit lg:grid lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <TextSlideUp as="h2" className="label-giant text-[clamp(2.5rem,6vw,4.375rem)] tracking-[-0.03em] leading-[0.85] text-ink">FAQ</TextSlideUp>
          <p className="mt-2 text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold text-ink">{sub}</p>
        </div>
        <ul className="mt-10 border-t border-rule lg:mt-0">
          {items.map((f, i) => (
            <li key={i} className="border-b border-rule">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="group flex w-full items-center justify-between gap-4 py-6 text-left"
                aria-expanded={open === i}
              >
                <span className="flex items-baseline gap-4 sm:gap-5">
                  <span
                    className={`font-grotesk text-[clamp(1.125rem,2vw,1.5rem)] font-bold leading-none tabular-nums tracking-tight transition-all duration-300 ease-out ${
                      open === i ? "scale-110 text-sekai-teal" : "text-ink/25 group-hover:text-ink/50"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[15px] font-bold text-ink sm:text-[16px]">{f.q}</span>
                </span>
                <span className={`shrink-0 text-sekai-teal transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </span>
              </button>
              <div className={`grid overflow-hidden transition-all duration-300 ${open === i ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <p className="pl-10 text-[14px] leading-[1.95] text-ink/70 sm:pl-[3.25rem]">{f.a}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
