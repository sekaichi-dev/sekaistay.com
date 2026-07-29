"use client";

/* ─────────────────────────────────────────────────────────────
 * /switch — sekaistay.com のネイティブ実装（社内LPを完全移植）
 *
 * 以前は sekaistay-lp.vercel.app を iframe でミラーしていたが、
 * SEO・LCP・保守性のため sekaistay.com 本体に直接統合。
 * 色クラスは `switch-` プレフィックス版に置換済み（色衝突回避）。
 * ───────────────────────────────────────────────────────────── */

import LpFooter from "@/components/switch/_shared/LpFooter";
import LpCompanyInfo from "@/components/switch/_shared/LpCompanyInfo";
import SwitchHeader from "@/components/switch/SwitchHeader";
import SwitchHero from "@/components/switch/SwitchHero";
import SwitchSimulator from "@/components/switch/SwitchSimulator";
import SwitchPainPoints from "@/components/switch/SwitchPainPoints";
import SwitchServices from "@/components/switch/SwitchServices";
import SwitchComparison from "@/components/switch/SwitchComparison";
import SwitchResults from "@/components/switch/SwitchResults";
import SwitchTestimonials from "@/components/switch/SwitchTestimonials";
import SwitchPricing from "@/components/switch/SwitchPricing";
import SwitchFlow from "@/components/switch/SwitchFlow";
import SwitchFAQ from "@/components/switch/SwitchFAQ";
import LpVariantForm from "@/components/switch/LpVariantForm";
import SwitchPrimaryCTA from "@/components/switch/SwitchPrimaryCTA";
import FloatingCTA from "@/components/FloatingCTA";
import WaveDivider from "@/components/switch/deco/WaveDivider";
import PageViewTracker from "@/components/switch/PageViewTracker";
import EngagementTracker from "@/components/EngagementTracker";
import Script from "next/script";

export default function SwitchPage() {
  const handleApply = () => {
    setTimeout(() => {
      document
        .getElementById("contact-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  return (
    <>
      {/* X conversion tracking event code — /switch ページ到達で発火（ベースピクセル rd63n は app/layout.tsx で初期化済み） */}
      <Script id="x-switch-conversion" strategy="afterInteractive">
        {`twq('event', 'tw-rd63n-rd6oo', {});`}
      </Script>
      <PageViewTracker lpVariant="switch" />
      <EngagementTracker lpVariant="switch" />
      <SwitchHeader />
      <main>
        {/* §1 Hero */}
        <div data-track-section="hero">
          <SwitchHero />
        </div>
        <WaveDivider fromColor="#2d2d2d" toColor="#167b81" withDots />

        {/* §2 簡易診断 */}
        <div data-track-section="simulator">
          <SwitchSimulator onApply={handleApply} />
        </div>
        <WaveDivider fromColor="#167b81" toColor="#ffffff" />

        {/* §3 共感ストーリー（松本さん・悩み） */}
        <div data-track-section="pain-points">
          <SwitchPainPoints />
        </div>

        {/* MidCTA① — 共感 → プライマリCTA（濃紺ヒーロー） */}
        <div data-track-section="mid-cta-1">
          <SwitchPrimaryCTA />
        </div>

        {/* §4 サービス内容 */}
        <div data-track-section="services">
          <SwitchServices />
        </div>

        {/* MidCTA② — 機能 → プライマリCTA（同デザイン） */}
        <div data-track-section="mid-cta-2">
          <SwitchPrimaryCTA title="どんなサービスなのか気になった方へ" />
        </div>

        {/* §5 他社比較 */}
        <div data-track-section="comparison">
          <SwitchComparison />
        </div>

        {/* MidCTA③ — 差分 → PrimaryCTA（同デザイン + 数値比較） */}
        <div data-track-section="mid-cta-3">
          <SwitchPrimaryCTA
            title="他社との手数料差は、あなたの物件だと…"
            compareStat={{
              leftLabel: "松本さんの場合（手数料20%）",
              leftValue: 1440000,
              leftSuffix: "/ 年",
              rightLabel: "SEKAI STAY（手数料8%）",
              rightValue: 696000,
              rightSuffix: "/ 年",
              diffLabel: "年間差額",
              diffValue: 744000,
              diffSuffix: "/ 年",
              note: "※ 1物件想定・月額固定費 ¥10,000/物件 込みで試算",
            }}
          />
        </div>

        {/* §7 実績 */}
        <div data-track-section="results">
          <SwitchResults />
        </div>

        {/* §8 オーナー様の声（松本さん・乗り換え後） */}
        <div data-track-section="testimonials">
          <SwitchTestimonials />
        </div>

        {/* §9 料金 */}
        <div data-track-section="pricing">
          <SwitchPricing />
        </div>

        {/* §10 ご利用の流れ */}
        <div data-track-section="flow">
          <SwitchFlow />
        </div>

        {/* §11 FAQ */}
        <div data-track-section="faq">
          <SwitchFAQ />
        </div>

        {/* §13 お問い合わせフォーム — Supabase lead_submissions に lp_variant="switch" で保存・
            吉蔵 CRM + sekaistay-sales-portal の 2 系統に並列転送。 */}
        <div data-track-section="form">
          <LpVariantForm
            lpVariant="switch"
            heading="まずはご相談だけでもどうぞ"
            leadCopy="物件診断レポート無料作成"
            subCopy={<>たったの<strong className="font-bold text-white">&quot;3項目&quot;</strong>で、1営業日以内にメールで専用レポートをお届けします。</>}
          />
        </div>

        {/* §14 会社概要 */}
        <LpCompanyInfo />
      </main>
      <LpFooter />
      <FloatingCTA />
    </>
  );
}
