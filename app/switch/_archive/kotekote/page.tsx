"use client";

/* /switch/kotekote — コテコテ版 (装飾過多・countdown timer・Hero内Comparison)
 * セクション構成・コピーは /switch と完全同一。Hero とフォームの装飾だけが differ。
 */

import LpFooter from "@/components/switch/_shared/LpFooter";
import LpCompanyInfo from "@/components/switch/_shared/LpCompanyInfo";
import SwitchHeader from "@/components/switch/SwitchHeader";
import SwitchHeroKotekote from "@/components/switch/SwitchHeroKotekote";
import SwitchSimulator from "@/components/switch/SwitchSimulator";
import SwitchPainPoints from "@/components/switch/SwitchPainPoints";
import SwitchServices from "@/components/switch/SwitchServices";
import SwitchComparison from "@/components/switch/SwitchComparison";
import SwitchResults from "@/components/switch/SwitchResults";
import SwitchTestimonials from "@/components/switch/SwitchTestimonials";
import SwitchPricing from "@/components/switch/SwitchPricing";
import SwitchFlow from "@/components/switch/SwitchFlow";
import SwitchFAQ from "@/components/switch/SwitchFAQ";
import SwitchPrimaryCTA from "@/components/switch/SwitchPrimaryCTA";
import SwitchStickyCTA from "@/components/switch/SwitchStickyCTA";
import LpVariantForm from "@/components/switch/LpVariantForm";
import WaveDivider from "@/components/switch/deco/WaveDivider";
import PageViewTracker from "@/components/switch/PageViewTracker";

export default function SwitchKotekokePage() {
  const handleApply = () => {
    setTimeout(() => {
      document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  return (
    <>
      <PageViewTracker lpVariant="switch-kotekote" />
      <SwitchHeader />
      <main>
        {/* §1 Hero — コテコテ装飾版（Top strip強化 + Hero内Comparison） */}
        <SwitchHeroKotekote />
        <WaveDivider fromColor="#2d2d2d" toColor="#167b81" withDots />

        {/* §2 簡易診断 */}
        <SwitchSimulator onApply={handleApply} />
        <WaveDivider fromColor="#167b81" toColor="#ffffff" />

        {/* §3 共感ストーリー */}
        <SwitchPainPoints />

        {/* MidCTA① */}
        <SwitchPrimaryCTA />

        {/* §4 サービス内容 */}
        <SwitchServices />

        {/* MidCTA② */}
        <SwitchPrimaryCTA title="どんなサービスなのか気になった方へ" />

        {/* §5 他社比較 */}
        <SwitchComparison />

        {/* MidCTA③ — 数値比較 */}
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
            note: "※ 1部屋想定・月額固定費 ¥10,000/部屋 込みで試算",
          }}
        />

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

        {/* §13 フォーム — lp_variant=switch-kotekote */}
        <LpVariantForm
          lpVariant="switch-kotekote"
          heading="まずはご相談だけでもどうぞ"
          leadCopy="お名前・メール・電話の30秒入力で、24時間以内に担当者からご連絡"
          subCopy="物件情報の入力は不要。お話を伺ってから、必要に応じてレポートをお作りします。無理な勧誘は致しません。"
        />

        {/* §14 会社概要 */}
        <LpCompanyInfo />
      </main>
      <LpFooter />
      <SwitchStickyCTA />
    </>
  );
}
