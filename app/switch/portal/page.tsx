"use client";

/* /switch/portal — ポータル主導訴求 LP
 * 仮説: 民泊オーナーの本質的苦痛は「不透明さ」。可視化が動機。
 * Hero でダッシュボード推し → Comparison のダッシュボード行を上に → Testimonials を「数字が見える」系に差替え → Simulator は中盤に降格
 */

import LpFooter from "@/components/switch/_shared/LpFooter";
import LpCompanyInfo from "@/components/switch/_shared/LpCompanyInfo";
import SwitchHeader from "@/components/switch/SwitchHeader";
import SwitchHeroPortal from "@/components/switch/SwitchHeroPortal";
import SwitchServices from "@/components/switch/SwitchServices";
import SwitchComparison from "@/components/switch/SwitchComparison";
import SwitchResults from "@/components/switch/SwitchResults";
import SwitchPricing from "@/components/switch/SwitchPricing";
import SwitchFlow from "@/components/switch/SwitchFlow";
import SwitchFAQ from "@/components/switch/SwitchFAQ";
import SwitchPrimaryCTA from "@/components/switch/SwitchPrimaryCTA";
import SwitchStickyCTA from "@/components/switch/SwitchStickyCTA";
import LpVariantForm from "@/components/switch/LpVariantForm";
import PortalTestimonials from "@/components/switch/PortalTestimonials";
import PageViewTracker from "@/components/switch/PageViewTracker";
import EngagementTracker from "@/components/EngagementTracker";
import WaveDivider from "@/components/switch/deco/WaveDivider";

export default function SwitchPortalPage() {
  const handleApply = () => {
    setTimeout(() => {
      document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  return (
    <>
      <PageViewTracker lpVariant="switch-portal" />
      <EngagementTracker lpVariant="switch-portal" />
      <SwitchHeader />
      <main>
        {/* §1 Hero — ダッシュボード主役 */}
        <div data-track-section="hero">
          <SwitchHeroPortal />
        </div>
        <WaveDivider fromColor="#2d2d2d" toColor="#ffffff" withDots />

        {/* §4 サービス内容 */}
        <div data-track-section="services">
          <SwitchServices />
        </div>

        {/* §5 他社比較 */}
        <div data-track-section="comparison">
          <SwitchComparison />
        </div>

        {/* MidCTA */}
        <div data-track-section="mid-cta-2">
          <SwitchPrimaryCTA title="数字が見える運営に切り替える" />
        </div>

        {/* §7 実績 */}
        <div data-track-section="results">
          <SwitchResults />
        </div>

        {/* §8 オーナー様の声 — Portal専用差し替え版 */}
        <div data-track-section="testimonials">
          <PortalTestimonials />
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

        {/* §13 フォーム */}
        <div data-track-section="form">
          <LpVariantForm
            lpVariant="switch-portal"
            heading="まずはご相談だけでもどうぞ"
            leadCopy="デモ予約＋物件診断レポート無料作成"
            subCopy={<>たったの<strong className="font-bold text-white">&quot;3項目&quot;</strong>で、1営業日以内にメールで専用レポートをお届けします。</>}
          />
        </div>

        {/* §14 会社概要 */}
        <LpCompanyInfo />
      </main>
      <LpFooter />
      <SwitchStickyCTA />
    </>
  );
}
