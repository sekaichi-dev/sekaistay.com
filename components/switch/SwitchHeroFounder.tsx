"use client";

/* /switch/founder Hero — 信頼主導 (人・創業者型)
 * 仮説: スイッチング先の選定では「会社」より「人」を見る層がいる。
 * オーナー専用ダッシュボード（switch/portal）と統一の dark teal 背景に、
 * 創業者ポートレートを左右に大きく配置し、タイトル端と重ねる構成。
 * 左: 劉 添毅 / 右: 明神 洸次郎
 */

import { useEffect, useState } from "react";
import DotPattern from "./deco/DotPattern";

export default function SwitchHeroFounder() {
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(true), []);

  return (
    <section className="relative bg-switch-charcoal text-white overflow-hidden">
      {/* Ambient teal glows — オーナーポータルと統一 */}
      <div className="absolute top-[-10%] right-[-15%] w-[70%] h-[75%] bg-switch-teal-bright/22 blur-[140px] rounded-full pointer-events-none" aria-hidden />
      <div className="absolute bottom-[-15%] left-[-15%] w-[55%] h-[60%] bg-switch-teal/14 blur-[140px] rounded-full pointer-events-none" aria-hidden />
      <DotPattern opacity={0.04} />

      {/* 写真は背景レイヤー（z-0）— 雰囲気のみ伝える */}
      {/* 左: 劉 添毅 — 下辺を明神に揃える（アスペクト比差を top offset で吸収） */}
      <div className="absolute left-[-30%] sm:left-[-37%] lg:left-[-25%] top-[1.5rem] sm:top-[0rem] lg:top-[-2rem] w-[110%] sm:w-[107%] lg:w-[90%] z-0 pointer-events-none opacity-50 sm:opacity-55 lg:opacity-60">
        <img
          src="/images/switch/founder-tenichi.png?v=2"
          alt=""
          aria-hidden
          className="w-full h-auto select-none"
          loading="eager"
        />
      </div>

      {/* 右: 明神 洸次郎 — カラーで表示 */}
      <div className="absolute right-[-35%] sm:right-[-45%] lg:right-[-32%] top-[1rem] sm:top-[-4rem] lg:top-[-5rem] w-[100%] sm:w-[100%] lg:w-[85%] z-0 pointer-events-none opacity-50 sm:opacity-55 lg:opacity-60">
        <img
          src="/images/switch/founder-koji.png"
          alt=""
          aria-hidden
          className="w-full h-auto select-none"
          loading="eager"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
        <div
          className={`relative transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* キッカー */}
          <div className="text-center mb-8 sm:mb-10 relative z-30">
            <p className="text-[11px] sm:text-[12px] tracking-[0.4em] text-switch-teal-bright/90 font-medium uppercase mb-2">
              From the Founders
            </p>
            <div className="inline-block w-12 h-px bg-switch-teal-bright/40" />
          </div>

          {/* 中央: 大見出し（写真の端と少し重なるように z-20） */}
          <div className="relative z-20 text-center pt-4 pb-8 sm:py-12 lg:py-16 px-2 sm:px-12 lg:px-24">
            <h1 className="font-bold leading-[1.32] tracking-tight text-white">
              <span className="block text-[26px] sm:text-[40px] lg:text-[56px]">
                民泊代行業界を、
              </span>
              <span className="block text-[26px] sm:text-[40px] lg:text-[56px] mt-1.5">
                <span className="text-switch-teal-bright italic font-serif">変えに来ました。</span>
              </span>
            </h1>

            <p className="text-[13px] sm:text-[16px] lg:text-[17px] text-white/80 leading-[1.95] tracking-wide max-w-2xl mx-auto mt-6 sm:mt-8">
              「任せきりで、何が起きてるか分からない」
              <br className="hidden sm:block" />
              ——その業界の常識を、ひっくり返すサービスをつくりました。
            </p>
          </div>

          {/* 浮遊カード（写真の上に被さる）— 左: 劉 / 右: 明神 */}
          <div className="relative z-30 grid grid-cols-2 gap-2 sm:gap-6 max-w-5xl mx-auto mt-6 sm:mt-10">
            <FloatingFounderCard
              name="劉 添毅"
              nameRomaji="Tenichi Liu"
              role="代表取締役 CEO"
              bio={
                <>
                  日米で民泊物件をオーナーとして運営し、業界の不透明な手数料構造と「見えない運用」に当事者として直面。<strong className="text-white">Amazon 米国本社</strong>で培ったオペレーション設計の経験をもとに、「自分が任せたかった代行を、自分でつくる」と決意して創業。
                </>
              }
            />
            <FloatingFounderCard
              name="明神 洸次郎"
              nameRomaji="Kojiro Myojin"
              role="共同代表 Co-CEO"
              bio={
                <>
                  登録者125万人超のYouTubeグループ「<strong className="text-white">カリスマブラザーズ</strong>」のクリエイター「<strong className="text-white">ジロー</strong>」として、人の感情を10年以上動かしてきた。その感性をそのままプロダクトに注ぎ、オーナーポータルと運用フローを一から設計。
                </>
              }
            />
          </div>

          {/* 主CTA */}
          <div className="relative z-30 flex flex-col items-center gap-3 mt-12 sm:mt-14">
            <a
              href="#contact-form"
              data-cta="contact-form"
              data-cta-label="founder-primary"
              className="group inline-flex items-center justify-center bg-switch-accent text-white font-bold text-[15px] sm:text-base px-8 sm:px-10 py-4 rounded-md hover:bg-switch-accent-hover transition-colors duration-300 shadow-[0_0_40px_rgba(235,110,40,0.35)] hover:shadow-[0_0_56px_rgba(235,110,40,0.5)] tracking-wide"
            >
              無料で面談を予約する
              <svg className="ml-3 w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <p className="text-[13px] sm:text-[14px] text-white font-bold tracking-wide mt-1">
              専門チームが、丁寧にお話を伺います。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingFounderCard({
  name,
  nameRomaji,
  role,
  bio,
}: {
  name: string;
  nameRomaji: string;
  role: string;
  bio: React.ReactNode;
}) {
  return (
    <div className="min-w-0 bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl px-3 py-3 sm:px-6 sm:py-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <p className="text-[9px] sm:text-[11px] tracking-[0.2em] text-switch-teal-bright/90 uppercase font-semibold mb-1">{role}</p>
      <h3 className="text-[15px] sm:text-[22px] font-bold text-white leading-tight">{name}</h3>
      <p className="text-[9px] sm:text-[11px] text-white/45 tracking-wider mb-2">{nameRomaji}</p>
      <p className="text-[11px] sm:text-[13px] text-white/75 leading-relaxed">{bio}</p>
    </div>
  );
}
