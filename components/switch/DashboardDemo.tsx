"use client";

import { useState } from "react";

/**
 * Premium版オーナーポータルのデモUI。
 * 8タブ構成（ホーム / 予約 / 状況 / 連絡 / 経費 / 分析 / 申告 / 設定）で中身のUIを切り替える。
 */

/* ============ Icons ============ */
const Icons = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M3 12l9-9 9 9" />
      <path d="M5 10v10h14V10" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M21 12a8 8 0 01-11.6 7.1L4 20l.9-5.4A8 8 0 1121 12z" />
    </svg>
  ),
  card: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M14 7h7v7" />
    </svg>
  ),
  doc: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M8 13h8M8 17h6" />
    </svg>
  ),
  gear: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 010-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.5V3a2 2 0 014 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.5 1H21a2 2 0 010 4h-.1a1.7 1.7 0 00-1.5 1z" />
    </svg>
  ),
  upload: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
    </svg>
  ),
  send: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" />
    </svg>
  ),
};

const bottomTabs = [
  { label: "ホーム", icon: Icons.home },
  { label: "予約", icon: Icons.plus },
  { label: "状況", icon: Icons.calendar },
  { label: "連絡", icon: Icons.chat },
  { label: "経費", icon: Icons.card },
  { label: "分析", icon: Icons.chart },
  { label: "申告", icon: Icons.doc },
  { label: "設定", icon: Icons.gear },
];

const properties = [
  { name: "北海道一棟貸しA", emoji: "🏔️", rating: 4.83, occupancy: 74, pricePerNight: 170000, bg: "from-[#4a9a9e] to-[#2d7a7e]", location: "北海道ニセコ町" },
  { name: "名古屋マンション一室B", emoji: "🏢", rating: 4.71, occupancy: 62, pricePerNight: 150000, bg: "from-[#4a9a9e] to-[#3d8a8e]", location: "愛知県名古屋市" },
  { name: "京都町家貸切C", emoji: "🏯", rating: 4.97, occupancy: 81, pricePerNight: 40000, bg: "from-[#5aaa9e] to-[#3a8a7e]", location: "京都府京都市" },
];

export default function DashboardDemo({ noteClass = 'text-switch-gray-mid' }: { noteClass?: string } = {}) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex justify-center">
      <div className="relative w-[260px] sm:w-[300px]">
        <div className="rounded-[34px] bg-black p-[8px] shadow-2xl">
          <div className="rounded-[26px] bg-white overflow-hidden" style={{ height: "560px" }}>
            {/* Status bar */}
            <div className="flex items-center justify-between px-6 pt-3 pb-1">
              <span className="text-xs font-bold text-black">9:41</span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-black">●●●●●</span>
                <span className="text-xs text-black">■</span>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto" style={{ height: "460px" }}>
              {activeTab === 0 && <HomeView />}
              {activeTab === 1 && <NewReservationView />}
              {activeTab === 2 && <CalendarStatusView />}
              {activeTab === 3 && <ChatView />}
              {activeTab === 4 && <ExpensesView />}
              {activeTab === 5 && <AnalyticsView />}
              {activeTab === 6 && <TaxView />}
              {activeTab === 7 && <SettingsView />}
            </div>

            {/* Bottom nav */}
            <div className="bg-white border-t border-switch-gray-light px-1 py-1.5">
              <div className="flex justify-between">
                {bottomTabs.map((tab, i) => (
                  <button
                    key={tab.label}
                    onClick={() => setActiveTab(i)}
                    className={`flex flex-col items-center gap-0.5 px-1 transition-colors ${
                      activeTab === i ? "text-switch-teal-deep" : "text-switch-gray-mid"
                    }`}
                  >
                    <span className="w-4 h-4">{tab.icon}</span>
                    <span className="text-[7px] font-bold">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className={`text-[10px] ${noteClass} text-center mt-2`}>
          ※こちらのダッシュボードはサンプルです。
        </p>
      </div>
    </div>
  );
}

/* ============ 0. Home ============ */
function HomeView() {
  return (
    <>
      <div className="flex items-center justify-between px-5 pt-2 pb-3">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/switch/logo-symbol.png" alt="SEKAI STAY" className="h-4 w-auto" />
            <span className="text-[9px] font-bold text-switch-charcoal tracking-wide">SEKAI STAY</span>
          </div>
          <span className="text-[8px] text-switch-gray-mid tracking-[0.15em]">OWNER PORTAL</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-4 h-4 text-switch-charcoal">
            {Icons.bell}
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-switch-teal-deep rounded-full" />
          </div>
          <div className="w-8 h-8 rounded-full bg-switch-teal-deep text-white flex items-center justify-center text-xs font-bold">
            M
          </div>
        </div>
      </div>

      <div className="px-5 pb-4">
        <p className="text-[10px] text-switch-gray-mid mb-1">4月18日(土)</p>
        <h2 className="text-lg font-bold text-black leading-tight">
          Good morning, Matsumotoさん
        </h2>
      </div>

      <div className="px-5 grid grid-cols-2 gap-2 mb-3">
        <StatCard label="今月売上" value="¥1.08M" change="+24%" positive />
        <StatCard label="稼働率" value="74%" change="+8pt" positive />
        <StatCard label="新規予約" value="9件" sub="今週" />
        <StatCard label="未対応" value="2件" alert="連絡" />
      </div>

      <div className="px-5 mb-4">
        <div className="bg-switch-teal-tint rounded-2xl p-4">
          <p className="text-[9px] text-switch-teal-deep font-bold tracking-[0.1em] mb-1">
            YEAR-TO-DATE NET INCOME
          </p>
          <p className="text-2xl font-bold text-switch-teal-deep mb-3">¥3,320,847</p>
          <svg viewBox="0 0 260 40" className="w-full h-8 mb-2">
            <polyline
              fill="none"
              stroke="#167B81"
              strokeWidth="2"
              points="0,35 30,30 60,28 90,25 120,22 150,18 180,20 210,15 240,12 260,8"
            />
          </svg>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-switch-teal-deep">⌃</span>
            <span className="text-[10px] text-switch-teal-deep font-bold">+18.4% YoY</span>
          </div>
        </div>
      </div>

      <div className="px-5 mb-4">
        <p className="text-[9px] text-switch-gray-mid font-bold tracking-[0.1em] mb-2">QUICK ACTIONS</p>
        <div className="flex gap-3 justify-between">
          {[
            { icon: Icons.plus, label: "新規予約" },
            { icon: Icons.chat, label: "連絡" },
            { icon: Icons.card, label: "経費" },
            { icon: Icons.chart, label: "分析" },
          ].map((a) => (
            <button key={a.label} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-switch-teal-tint text-switch-teal-deep flex items-center justify-center hover:bg-switch-teal-tint/80 transition-colors">
                <span className="w-5 h-5">{a.icon}</span>
              </div>
              <span className="text-[9px] text-switch-gray-dark">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[9px] text-switch-gray-mid font-bold tracking-[0.1em]">PROPERTIES</p>
          <span className="text-[10px] text-switch-gray-mid">3件</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5">
          {properties.map((p) => (
            <button
              key={p.name}
              className={`flex-shrink-0 w-40 rounded-xl overflow-hidden bg-gradient-to-br ${p.bg} text-white`}
            >
              <div className="flex items-center justify-center h-16 text-3xl">{p.emoji}</div>
              <div className="px-3 pb-2.5 pt-1">
                <p className="text-[10px] font-bold leading-tight mb-1 truncate">{p.name}</p>
                <div className="flex items-center gap-1 text-[9px] text-white/80">
                  <span>★ {p.rating}</span>
                  <span>· {p.occupancy}%稼働</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

/* ============ 1. 予約 (新規予約フォーム) ============ */
function NewReservationView() {
  const [selected, setSelected] = useState(0);
  const selectedProperty = properties[selected];
  const nights = 3;
  const pax = 4;
  const normalPrice = selectedProperty.pricePerNight * nights;

  return (
    <>
      <div className="px-5 pt-3 pb-2">
        <h2 className="text-base font-bold text-black leading-tight">新規予約</h2>
        <p className="text-[10px] text-switch-gray-mid mt-0.5">オーナー権限で直接予約を確定 (¥0計上)</p>
      </div>

      <div className="px-5 pb-3">
        <p className="text-[9px] text-switch-gray-mid mb-1.5">物件選択</p>
        <div className="space-y-1.5">
          {properties.map((p, i) => (
            <button
              key={p.name}
              onClick={() => setSelected(i)}
              className={`w-full flex items-center gap-2 bg-white rounded-xl p-2 text-left transition-all ${
                selected === i ? "border-2 border-switch-teal-deep bg-switch-teal-tint/30" : "border border-switch-gray-light"
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${p.bg} flex items-center justify-center text-base`}>
                {p.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-black truncate">{p.name}</p>
                <p className="text-[9px] text-switch-gray-mid">¥{p.pricePerNight.toLocaleString()}/泊</p>
              </div>
              {selected === i && (
                <svg className="w-4 h-4 text-switch-teal-deep flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-3">
        <p className="text-[9px] text-switch-gray-mid mb-1.5">日程</p>
        <div className="space-y-1.5">
          <DateField label="チェックイン" value="2026年5月2日 (土)" />
          <DateField label="チェックアウト" value="2026年5月5日 (火)" />
        </div>
      </div>

      <div className="px-5 pb-3">
        <p className="text-[9px] text-switch-gray-mid mb-1.5">人数</p>
        <div className="bg-white border border-switch-gray-light rounded-xl px-3 py-2.5 flex items-center justify-between">
          <span className="text-[11px] text-switch-gray-dark">大人</span>
          <span className="text-[12px] font-bold text-black">{pax} 名</span>
        </div>
      </div>

      <div className="px-5 pb-3">
        <div className="bg-switch-teal-tint rounded-xl p-3">
          <div className="flex items-center justify-between pb-2 border-b border-switch-teal/20 mb-2">
            <span className="text-[10px] text-switch-gray-mid">通常宿泊料金</span>
            <span className="text-[11px] text-switch-gray-mid line-through">
              ¥{normalPrice.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-switch-teal-deep">オーナー予約</span>
            <span className="text-lg font-bold text-switch-teal-deep tabular-nums">¥0</span>
          </div>
          <p className="text-[9px] text-switch-gray-mid">※ オーナー利用のため売上には計上されません</p>
        </div>
      </div>

      <div className="px-5 pb-4">
        <button className="w-full bg-switch-teal-deep text-white font-bold text-[12px] py-3 rounded-xl hover:bg-[#0e5d62] transition-colors">
          この内容で予約する
        </button>
      </div>
    </>
  );
}

function DateField({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-switch-gray-light rounded-xl px-3 py-2">
      <p className="text-[9px] text-switch-gray-mid mb-0.5">{label}</p>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-black">{value}</span>
        <span className="w-3.5 h-3.5 text-switch-gray-mid">{Icons.calendar}</span>
      </div>
    </div>
  );
}

/* ============ 2. 状況 (予約カレンダー) ============ */
const otaColors = {
  Airbnb: "#dc3545",
  "Booking.com": "#1e5cb8",
  Direct: "#2e8b57",
  Expedia: "#f5b942",
  Owner: "#e67a2b",
} as const;

type Ota = keyof typeof otaColors;

type CalendarCell = { day: number; ota?: Ota; badge?: string };

function buildCalendar(): (CalendarCell | null)[] {
  // 2026年5月: 1日=金曜
  // 日月火水木金土
  const cells: (CalendarCell | null)[] = [];
  // Week 1: 空,空,空,空,空,1,2
  cells.push(null, null, null, null, null, { day: 1 }, { day: 2, ota: "Owner", badge: "¥0" });
  // Week 2: 3,4,5,6,7,8,9
  cells.push(
    { day: 3, ota: "Owner", badge: "¥0" },
    { day: 4, ota: "Owner", badge: "¥0" },
    { day: 5, ota: "Owner" },
    { day: 6 },
    { day: 7 },
    { day: 8 },
    { day: 9, ota: "Owner" },
  );
  // Week 3: 10-16
  cells.push(
    { day: 10, ota: "Owner" },
    { day: 11 },
    { day: 12 },
    { day: 13 },
    { day: 14 },
    { day: 15, ota: "Airbnb" },
    { day: 16, ota: "Airbnb" },
  );
  // Week 4: 17-23
  cells.push(
    { day: 17 },
    { day: 18 },
    { day: 19 },
    { day: 20 },
    { day: 21 },
    { day: 22 },
    { day: 23 },
  );
  // Week 5: 24-30
  cells.push(
    { day: 24 },
    { day: 25 },
    { day: 26 },
    { day: 27 },
    { day: 28 },
    { day: 29 },
    { day: 30 },
  );
  // Week 6: 31
  cells.push({ day: 31 }, null, null, null, null, null, null);
  return cells;
}

function CalendarStatusView() {
  const cells = buildCalendar();
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

  return (
    <>
      <div className="px-5 pt-3 pb-2">
        <h2 className="text-base font-bold text-black leading-tight">予約状況</h2>
        <p className="text-[10px] text-switch-gray-mid mt-0.5">2026年 5月・タップで詳細</p>
      </div>

      {/* Legend */}
      <div className="px-5 pb-2 flex flex-wrap gap-x-2 gap-y-0.5">
        {(Object.entries(otaColors) as [Ota, string][]).map(([name, color]) => (
          <span key={name} className="inline-flex items-center gap-1 text-[8px] text-switch-gray-dark">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
            {name}
          </span>
        ))}
      </div>

      {/* Calendar */}
      <div className="px-5 pb-3">
        <div className="bg-white border border-switch-gray-light rounded-xl p-2">
          <div className="grid grid-cols-7 mb-1">
            {weekdays.map((w, i) => (
              <div
                key={w}
                className={`text-[9px] text-center font-bold ${
                  i === 0 ? "text-[#dc3545]" : i === 6 ? "text-[#1e5cb8]" : "text-switch-gray-mid"
                }`}
              >
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1.5">
            {cells.map((c, i) => {
              if (!c) return <div key={i} className="h-8" />;
              const dow = i % 7;
              const dayColor =
                dow === 0 ? "text-[#dc3545]" : dow === 6 ? "text-[#1e5cb8]" : "text-black";
              return (
                <div key={i} className="relative h-8 flex flex-col items-center justify-start">
                  <span className={`text-[10px] font-bold ${dayColor}`}>{c.day}</span>
                  {c.badge && (
                    <span
                      className="absolute -top-0.5 -right-1 text-[7px] font-bold text-white rounded px-0.5"
                      style={{ background: c.ota ? otaColors[c.ota] : undefined }}
                    >
                      {c.badge}
                    </span>
                  )}
                  {c.ota && (
                    <span
                      className="absolute bottom-0.5 w-5 h-0.5 rounded-full"
                      style={{ background: otaColors[c.ota] }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 直近の予約 */}
      <div className="px-5 pb-4">
        <p className="text-[9px] text-switch-gray-mid mb-1.5">直近の予約</p>
        <div className="space-y-1.5">
          <RecentReservationCard
            property="北海道一棟貸しA"
            price="¥510,000"
            finalPrice="¥0"
            range="2026-05-02 → 2026-05-05"
            ota="Owner"
          />
          <RecentReservationCard
            property="北海道一棟貸しA"
            price="¥340,000"
            range="2026-05-15 → 2026-05-17"
            ota="Airbnb"
          />
          <RecentReservationCard
            property="京都町家貸切C"
            price="¥186,000"
            range="2026-05-01 → 2026-05-04"
            ota="Direct"
          />
        </div>
      </div>
    </>
  );
}

function RecentReservationCard({
  property,
  price,
  finalPrice,
  range,
  ota,
}: {
  property: string;
  price: string;
  finalPrice?: string;
  range: string;
  ota: Ota;
}) {
  const color = otaColors[ota];
  const bg =
    ota === "Owner"
      ? "bg-[#fff4e6]"
      : ota === "Airbnb"
      ? "bg-[#fdeaec]"
      : ota === "Direct"
      ? "bg-[#e6f5ec]"
      : ota === "Booking.com"
      ? "bg-[#e4ecf7]"
      : "bg-[#fef5d9]";
  return (
    <div
      className="bg-white border border-switch-gray-light rounded-xl p-2.5 border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-start justify-between mb-1">
        <p className="text-[11px] font-bold text-black">{property}</p>
        <span
          className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${bg}`}
          style={{ color }}
        >
          {ota}
        </span>
      </div>
      <div className="flex items-center gap-1.5 mb-0.5">
        {finalPrice ? (
          <>
            <span className="text-[10px] text-switch-gray-mid line-through">{price}</span>
            <span className="text-[12px] font-bold" style={{ color }}>
              {finalPrice}
            </span>
          </>
        ) : (
          <span className="text-[12px] font-bold text-black">{price}</span>
        )}
      </div>
      <p className="text-[9px] text-switch-gray-mid">{range}</p>
    </div>
  );
}

/* ============ 3. 連絡 (運営チャット) ============ */
type ChatMsg = { from: "team" | "me"; name?: string; text: string; time: string };

const chatMessages: ChatMsg[] = [
  { from: "team", name: "運営チーム / 田中", text: "5月のチェックインガイドを更新しました。ご確認ください。", time: "14:32" },
  { from: "me", text: "GW期間の清掃スタッフの増員をお願いできますか？", time: "10:15" },
  { from: "team", name: "運営チーム / 木村", text: "了解しました。3名増員で手配済みです。", time: "10:42" },
  { from: "team", name: "運営チーム / 田中", text: "Lake Houseの口コミが新たに3件追加されました ⭐5.0", time: "昨日" },
  { from: "me", text: "ありがとうございます。4月の収支レポートも楽しみにしています。", time: "昨日" },
];

function ChatView() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-3 pb-2 flex-shrink-0">
        <h2 className="text-base font-bold text-black leading-tight">運営チャット</h2>
        <p className="text-[10px] text-switch-gray-mid mt-0.5">運営チームと直接やりとり</p>
      </div>

      <div className="flex-1 px-4 pb-2 space-y-2.5 overflow-y-auto">
        {chatMessages.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col ${m.from === "me" ? "items-end" : "items-start"}`}
          >
            {m.name && <span className="text-[8px] text-switch-gray-mid mb-0.5 px-1">{m.name}</span>}
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-1.5 ${
                m.from === "me"
                  ? "bg-switch-teal-deep text-white"
                  : "bg-white border border-switch-gray-light text-black"
              }`}
            >
              <p className="text-[10px] leading-snug">{m.text}</p>
            </div>
            <span className="text-[8px] text-switch-gray-mid mt-0.5 px-1">{m.time}</span>
          </div>
        ))}
      </div>

      <div className="flex-shrink-0 px-3 py-2 border-t border-switch-gray-light flex items-center gap-2">
        <input
          type="text"
          placeholder="運営チームへメッセージ…"
          className="flex-1 text-[10px] bg-white border border-switch-gray-light rounded-full px-3 py-1.5 focus:outline-none focus:border-switch-teal-deep"
          readOnly
        />
        <button className="flex-shrink-0 w-7 h-7 rounded-full bg-switch-teal-deep text-white flex items-center justify-center">
          <span className="w-3.5 h-3.5">{Icons.send}</span>
        </button>
      </div>
    </div>
  );
}

/* ============ 4. 経費 ============ */
const expenses = [
  { title: "外壁塗装の補修", property: "北海道一棟貸しA", category: "修繕費", date: "2026-02-14", amount: 28000 },
  { title: "アメニティ補充", property: "北海道一棟貸しA", category: "消耗品費", date: "2026-03-02", amount: 12500 },
  { title: "3月分電気・ガス・水道", property: "北海道一棟貸しA", category: "水道光熱費", date: "2026-03-31", amount: 32400 },
  { title: "清掃用品", property: "京都町家貸切C", category: "消耗品費", date: "2026-04-05", amount: 8600 },
  { title: "火災保険 年払い", property: "全物件", category: "保険料", date: "2026-04-10", amount: 103400 },
];
const expenseTotal = expenses.reduce((a, b) => a + b.amount, 0);

function ExpensesView() {
  return (
    <>
      <div className="px-5 pt-3 pb-2">
        <h2 className="text-base font-bold text-black leading-tight">経費</h2>
        <p className="text-[10px] text-switch-gray-mid mt-0.5">領収書から自動入力</p>
      </div>

      <div className="px-5 pb-3">
        <div className="bg-switch-teal-tint/50 border-2 border-dashed border-switch-teal/50 rounded-xl p-4 text-center">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto mb-2 text-switch-teal-deep">
            <span className="w-5 h-5">{Icons.upload}</span>
          </div>
          <p className="text-[11px] font-bold text-black mb-0.5">領収書をアップロード</p>
          <p className="text-[9px] text-switch-gray-mid mb-2.5">PDF・画像をドラッグするか選択してください</p>
          <div className="flex justify-center gap-1.5 mb-2">
            <button className="text-[9px] font-bold bg-switch-teal-deep text-white px-2.5 py-1 rounded-md">📷 画像</button>
            <button className="text-[9px] font-bold bg-white border border-switch-gray-light text-switch-gray-dark px-2.5 py-1 rounded-md">📄 PDF</button>
            <button className="text-[9px] font-bold bg-white border border-switch-gray-light text-switch-gray-dark px-2.5 py-1 rounded-md">📸 撮影</button>
          </div>
          <span className="inline-block text-[8px] font-bold bg-switch-teal-deep text-white px-2 py-0.5 rounded-full">
            ✨ 自動仕分け対応
          </span>
        </div>
      </div>

      <div className="px-5 pb-4">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[9px] text-switch-gray-mid">登録済み経費</p>
          <p className="text-[9px] text-switch-gray-mid">計 ¥{expenseTotal.toLocaleString()}</p>
        </div>
        <div className="space-y-1.5">
          {expenses.map((e) => (
            <div key={e.title} className="bg-white border border-switch-gray-light rounded-xl p-2.5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-black truncate">{e.title}</p>
                  <p className="text-[9px] text-switch-gray-mid">
                    {e.property}・{e.category}
                  </p>
                  <p className="text-[9px] text-switch-gray-mid">{e.date}</p>
                </div>
                <span className="text-[12px] font-bold text-black tabular-nums flex-shrink-0 ml-2">
                  ¥{e.amount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ============ 5. 分析 ============ */
const occupancyByMonth = [
  { m: "1月", v: 18 },
  { m: "2月", v: 32 },
  { m: "3月", v: 48 },
  { m: "4月", v: 64 },
  { m: "5月", v: 81 },
  { m: "6月", v: 52 },
];
const revparData = [60, 72, 88, 100, 125, 118];

function AnalyticsView() {
  return (
    <>
      <div className="px-5 pt-3 pb-2">
        <h2 className="text-base font-bold text-black leading-tight">パフォーマンス分析</h2>
        <p className="text-[10px] text-switch-gray-mid mt-0.5">稼働率・平均単価・客室収益を俯瞰</p>
      </div>

      <div className="px-5 pb-3 grid grid-cols-3 gap-1.5">
        <KpiCard label="稼働率" value="74%" change="+8%" />
        <KpiCard label="平均単価" value="¥168k" change="+4%" />
        <KpiCard label="客室収益" value="¥124k" change="+12%" />
      </div>

      <div className="px-5 pb-3">
        <div className="bg-white border border-switch-gray-light rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-black">月次 客室収益</span>
            <span className="text-[9px] text-switch-gray-mid">過去6ヶ月</span>
          </div>
          <svg viewBox="0 0 240 60" className="w-full h-14">
            <polyline
              fill="none"
              stroke="#167B81"
              strokeWidth="2"
              points={revparData
                .map((v, i) => `${(i * 240) / (revparData.length - 1)},${60 - (v * 50) / 130}`)
                .join(" ")}
            />
            {revparData.map((v, i) => (
              <circle
                key={i}
                cx={(i * 240) / (revparData.length - 1)}
                cy={60 - (v * 50) / 130}
                r={2}
                fill="#167B81"
              />
            ))}
          </svg>
          <div className="flex justify-between text-[8px] text-switch-gray-mid mt-1">
            {occupancyByMonth.map((m) => (
              <span key={m.m}>{m.m}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 pb-4">
        <div className="bg-white border border-switch-gray-light rounded-xl p-3">
          <p className="text-[10px] font-bold text-black mb-2">稼働率推移</p>
          <div className="space-y-1.5">
            {occupancyByMonth.map((m) => (
              <div key={m.m} className="flex items-center gap-2">
                <span className="text-[9px] text-switch-gray-mid w-6">{m.m}</span>
                <div className="flex-1 h-1.5 bg-switch-gray-light rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-switch-teal to-switch-teal-deep rounded-full"
                    style={{ width: `${m.v}%` }}
                  />
                </div>
                <span className="text-[9px] font-bold text-black tabular-nums w-8 text-right">
                  {m.v}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function KpiCard({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <div className="bg-white border border-switch-gray-light rounded-xl px-2 py-2">
      <p className="text-[8px] text-switch-gray-mid mb-0.5">{label}</p>
      <p className="text-sm font-bold text-black leading-none mb-1 tabular-nums">{value}</p>
      <p className="text-[8px] font-bold text-[#2e8b57]">▲ {change}</p>
    </div>
  );
}

/* ============ 6. 申告 (確定申告) ============ */
const yearMonthlyRevenue = [
  { m: "1月", v: 24 },
  { m: "2月", v: 38 },
  { m: "3月", v: 51 },
  { m: "4月", v: 72 },
  { m: "5月", v: 108 },
  { m: "6月", v: 58 },
  { m: "7月", v: 32 },
  { m: "8月", v: 28 },
  { m: "9月", v: 25 },
  { m: "10月", v: 9 },
  { m: "11月", v: 5 },
  { m: "12月", v: 14 },
];
const maxRev = Math.max(...yearMonthlyRevenue.map((x) => x.v));

function TaxView() {
  return (
    <>
      <div className="px-5 pt-3 pb-2 flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-black leading-tight">確定申告</h2>
          <p className="text-[10px] text-switch-gray-mid mt-0.5">2026年 収支レポート</p>
        </div>
        <button className="text-[9px] font-bold bg-switch-teal-deep text-white px-2.5 py-1 rounded-md">
          CSV
        </button>
      </div>

      <div className="px-5 pb-3">
        <div className="bg-switch-teal-tint rounded-xl p-3">
          <p className="text-[9px] text-switch-teal-deep font-bold tracking-[0.1em] mb-1">純収益</p>
          <p className="text-2xl font-bold text-switch-teal-deep tabular-nums">¥3,320,847</p>
        </div>
      </div>

      <div className="px-5 pb-3 grid grid-cols-2 gap-2">
        <div className="bg-white border border-switch-gray-light rounded-xl px-3 py-2">
          <p className="text-[9px] text-switch-gray-mid mb-0.5">総売上</p>
          <p className="text-sm font-bold text-black tabular-nums">¥454万</p>
          <p className="text-[9px] text-switch-gray-mid">39件</p>
        </div>
        <div className="bg-white border border-switch-gray-light rounded-xl px-3 py-2">
          <p className="text-[9px] text-switch-gray-mid mb-0.5">経費</p>
          <p className="text-sm font-bold text-black tabular-nums">¥18.5万</p>
          <p className="text-[9px] text-switch-gray-mid">5件</p>
        </div>
      </div>

      <div className="px-5 pb-4">
        <div className="bg-white border border-switch-gray-light rounded-xl p-3">
          <p className="text-[10px] font-bold text-black mb-2">月別売上</p>
          <div className="space-y-1">
            {yearMonthlyRevenue.map((m) => (
              <div key={m.m} className="flex items-center gap-1.5">
                <span className="text-[8px] text-switch-gray-mid w-6">{m.m}</span>
                <div className="flex-1 h-1.5 bg-switch-gray-light rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-switch-teal to-switch-teal-deep rounded-full"
                    style={{ width: `${(m.v / maxRev) * 100}%` }}
                  />
                </div>
                <span className="text-[8px] font-bold text-black tabular-nums w-10 text-right">
                  ¥{m.v}万
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ============ 7. 設定 ============ */
function SettingsView() {
  return (
    <>
      <div className="px-5 pt-3 pb-2">
        <h2 className="text-base font-bold text-black leading-tight">設定</h2>
        <p className="text-[10px] text-switch-gray-mid mt-0.5">アカウント・通知・連携</p>
      </div>

      <div className="px-5 pb-3">
        <div className="bg-white border border-switch-gray-light rounded-xl p-3 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-switch-teal-deep text-white flex items-center justify-center text-sm font-bold">
            M
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-black">Matsumoto Ryosuke</p>
            <p className="text-[9px] text-switch-gray-mid truncate">matsumoto@sekaichi.org</p>
            <span className="inline-flex items-center gap-1 text-[8px] text-switch-teal-deep font-bold mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-switch-teal-deep" />
              オーナー権限
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-3">
        <p className="text-[9px] text-switch-gray-mid mb-1.5">通知</p>
        <div className="bg-white border border-switch-gray-light rounded-xl divide-y divide-switch-gray-light overflow-hidden">
          <SettingsRow label="新規予約" status="ON" />
          <SettingsRow label="チェックイン前日" status="ON" />
          <SettingsRow label="清掃完了" status="ON" />
          <SettingsRow label="月次レポート" status="OFF" />
        </div>
      </div>

      <div className="px-5 pb-4">
        <p className="text-[9px] text-switch-gray-mid mb-1.5">連携サービス</p>
        <div className="bg-white border border-switch-gray-light rounded-xl divide-y divide-switch-gray-light overflow-hidden">
          <SettingsRow label="Beds24" status="接続済" connected />
          <SettingsRow label="Slack" status="接続済" connected />
          <SettingsRow label="LINE" status="未接続" />
        </div>
      </div>
    </>
  );
}

function SettingsRow({
  label,
  status,
  connected,
}: {
  label: string;
  status: string;
  connected?: boolean;
}) {
  const isOn = status === "ON" || connected;
  return (
    <div className="flex items-center justify-between px-3 py-2.5">
      <span className="text-[11px] text-black">{label}</span>
      <span
        className={`text-[9px] font-bold ${
          isOn ? "text-switch-teal-deep" : "text-switch-gray-mid"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

/* ============ Shared: StatCard ============ */
function StatCard({
  label,
  value,
  change,
  positive,
  sub,
  alert,
}: {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  sub?: string;
  alert?: string;
}) {
  return (
    <div className="bg-white border border-switch-gray-light rounded-xl px-3 py-2.5">
      <p className="text-[9px] text-switch-gray-mid mb-1">{label}</p>
      <p className="text-lg font-bold text-black leading-none mb-0.5">{value}</p>
      {change && (
        <p className={`text-[9px] font-bold ${positive ? "text-[#2e8b57]" : "text-switch-gray-mid"}`}>
          ▲ {change}
        </p>
      )}
      {sub && <p className="text-[9px] text-switch-gray-mid">{sub}</p>}
      {alert && (
        <p className="text-[9px] text-[#dc3545] font-bold">
          <span className="inline-block w-1.5 h-1.5 bg-[#dc3545] rounded-full mr-0.5 align-middle" />
          {alert}
        </p>
      )}
    </div>
  );
}
