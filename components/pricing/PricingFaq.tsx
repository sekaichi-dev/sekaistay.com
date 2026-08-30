"use client";

import { useState } from "react";

/* 料金FAQ — sense-trust トンマナのアコーディオン（Deep Teal） */
export default function PricingFaq({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="w-full bg-navy-deep py-24 text-white sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <h2 className="label-giant text-[clamp(2.5rem,6vw,4.375rem)] text-white">FAQ</h2>
        <p className="mt-2 text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold text-white">料金についてよくある質問</p>
        <ul className="mt-14 max-w-3xl border-t border-white/15 sm:mt-16">
          {items.map((f, i) => (
            <li key={i} className="border-b border-white/15">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-6 text-left"
                aria-expanded={open === i}
              >
                <span className="flex items-baseline gap-4">
                  <span className="font-grotesk text-[14px] font-bold text-bright-teal">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[15px] font-bold text-white sm:text-[16px]">{f.q}</span>
                </span>
                <span className={`shrink-0 text-bright-teal transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </span>
              </button>
              <div className={`grid overflow-hidden transition-all duration-300 ${open === i ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <p className="pl-9 text-[14px] leading-[1.95] text-white/75">{f.a}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
