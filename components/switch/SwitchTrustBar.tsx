"use client";

import CountUp from "./deco/CountUp";

const items: {
  label: string;
  value: string;
  sub: string;
  countTarget?: number;
  suffix?: string;
}[] = [
  {
    label: "住宅宿泊管理業者",
    value: "登録済み",
    sub: "民泊新法対応",
  },
  {
    label: "オーナー継続率",
    value: "",
    sub: "解約金ゼロでもこの数字",
    countTarget: 97,
    suffix: "%",
  },
  {
    label: "ゲスト対応",
    value: "24h / 4言語",
    sub: "日・英・中・韓",
  },
  {
    label: "対応エリア",
    value: "全国対応",
    sub: "物件タイプ問わず",
  },
];

export default function SwitchTrustBar() {
  return (
    <section className="bg-gradient-to-b from-white via-white to-switch-cloud border-y border-switch-gray-light relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6">
          {items.map((it, i) => (
            <div
              key={it.label}
              className={`text-center px-2 ${
                i < items.length - 1
                  ? "sm:border-r sm:border-switch-gray-light/60"
                  : ""
              }`}
            >
              <p className="text-[11px] text-switch-teal font-bold tracking-wider mb-2">
                {it.label}
              </p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-switch-charcoal leading-tight">
                {it.countTarget !== undefined ? (
                  <CountUp
                    target={it.countTarget}
                    suffix={it.suffix ?? ""}
                    className="gradient-text-hero"
                  />
                ) : (
                  it.value
                )}
              </p>
              <p className="text-[10px] sm:text-xs text-switch-gray-mid mt-2">
                {it.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
