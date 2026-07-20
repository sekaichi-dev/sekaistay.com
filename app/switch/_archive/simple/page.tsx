"use client";

/* /switch/simple — シンプル版 (装飾控えめ・上質ミニマル)
 * セクション構成は /switch のコンテンツ（Simulator / PainPoints / Services / Comparison /
 * Results / Testimonials / Pricing / Flow / FAQ）を維持。
 * 取り除く装飾: WaveDivider × 2、SwitchPrimaryCTA × 3、SwitchStickyCTA、LpVariantForm の teal-gradient burst
 * → ヘッダー以下を「Hero と同じ ivory ラグジュアリー世界観」に統一する。
 */

import LpFooter from "@/components/switch/_shared/LpFooter";
import LpCompanyInfo from "@/components/switch/_shared/LpCompanyInfo";
import SwitchHeader from "@/components/switch/SwitchHeader";
import SwitchHeroSimple from "@/components/switch/SwitchHeroSimple";
import SwitchSimulator from "@/components/switch/SwitchSimulator";
import SwitchPainPoints from "@/components/switch/SwitchPainPoints";
import SwitchServices from "@/components/switch/SwitchServices";
import SwitchComparison from "@/components/switch/SwitchComparison";
import SwitchResults from "@/components/switch/SwitchResults";
import SwitchTestimonials from "@/components/switch/SwitchTestimonials";
import SwitchPricing from "@/components/switch/SwitchPricing";
import SwitchFlow from "@/components/switch/SwitchFlow";
import SwitchFAQ from "@/components/switch/SwitchFAQ";
import SimpleContactForm from "@/components/switch/SimpleContactForm";
import PageViewTracker from "@/components/switch/PageViewTracker";

export default function SwitchSimplePage() {
  const handleApply = () => {
    setTimeout(() => {
      document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  return (
    <>
      <PageViewTracker lpVariant="switch-simple" />
      <SwitchHeader />
      <main>
        {/* §1 Hero — シンプル装飾版 */}
        <SwitchHeroSimple />

        {/* §2 簡易診断（コンテンツ維持） */}
        <SwitchSimulator onApply={handleApply} />

        {/* §3 共感ストーリー */}
        <SwitchPainPoints />

        {/* §4 サービス内容 */}
        <SwitchServices />

        {/* §5 他社比較 */}
        <SwitchComparison />

        {/* §7 実績 */}
        <SwitchResults />

        {/* §8 オーナー様の声 */}
        <SwitchTestimonials />

        {/* §9 料金 */}
        <SwitchPricing />

        {/* §10 ご利用の流れ */}
        <SwitchFlow />

        {/* §11 FAQ */}
        <SwitchFAQ />

        {/* §13 フォーム — シンプル版（lp_variant=switch-simple） */}
        <SimpleContactForm />

        {/* §14 会社概要 */}
        <LpCompanyInfo />
      </main>
      <LpFooter />
      {/* SwitchStickyCTA は意図的に削除 — 追従CTA はシンプル思想に反する */}
    </>
  );
}
