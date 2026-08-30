"use client";

import { useScrollFade } from "@/hooks/useScrollFade";
import SectionHead from "./deco/SectionHead";
import { TANAKA } from "./_tanaka";

export default function SwitchPainPoints() {
  const ref = useScrollFade();

  return (
    <section className="py-16 sm:py-20 bg-white" ref={ref}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="fade-in mb-10">
          <SectionHead
            enLabel="オーナーのリアルな声"
            jaTitle={
              <>
                「<span className="text-switch-teal">20%</span>も払ってるのに、
                <br className="sm:hidden" />
                この対応？」
              </>
            }
          />
        </div>

        {/* 松本さんストーリー */}
        <div className="fade-in bg-switch-charcoal text-white rounded-md p-5 sm:p-10 mb-10 shadow">
          <p className="text-[15px] sm:text-lg leading-normal">
            {TANAKA.name}（{TANAKA.ageNote}・{TANAKA.city}）。{TANAKA.propertyDetail}を{" "}
            <span className="text-switch-teal-bright font-bold">
              手数料{TANAKA.oldFeeRatePct}%
            </span>
            で代行会社に委託。年間売上{TANAKA.annualRevenueMan}万円のうち
            <span className="text-switch-teal-bright font-bold text-xl">
              {" "}
              {TANAKA.annualOldFeeMan}万円
            </span>
            を手数料として支払い続けてきた。
            なのに稼働率も最適化されていない宿泊者の満足度も不透明….。
            <span className="block mt-4 text-xl sm:text-2xl font-bold leading-snug">
              「年間
              <span className="text-switch-teal-bright">
                {TANAKA.annualOldFeeMan}万円以上
              </span>
              払って、この対応か──」
            </span>
          </p>
        </div>

        {/* Pain cards */}
        <div className="stagger grid sm:grid-cols-2 gap-4">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "手数料がもったいない",
              desc: "20%だと、せっかくの手取りが薄くなる",
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ),
              title: "状況が見えない",
              desc: "常に確認したいけど月1のレポートだけ",
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "稼働率をもっとあげたい",
              desc: "休日や行事に合わせて適切な値段を設定したい",
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
              title: "物件の見せ方が微妙",
              desc: "OTA掲載が上位に上がってこない",
            },
          ].map((p, i) => (
            <div
              key={i}
              className="fade-in relative bg-gradient-to-br from-switch-accent/5 via-white to-white rounded-md p-4 sm:p-6 flex items-center gap-3 sm:gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border border-switch-accent/25"
            >
              <span className="absolute -top-2 -left-2 bg-switch-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                0{i + 1}
              </span>
              <div className="text-switch-accent shrink-0 w-14 h-14 rounded-full bg-switch-accent/10 flex items-center justify-center">
                {p.icon}
              </div>
              <div>
                <p className="text-base font-bold text-switch-charcoal">{p.title}</p>
                <p className="text-sm text-switch-gray-mid">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
