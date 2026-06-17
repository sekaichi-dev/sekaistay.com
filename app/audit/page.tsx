'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import EngagementTracker from '@/components/EngagementTracker'
import SectionHead from '@/components/ds/SectionHead'
import GhostWordmark from '@/components/ds/GhostWordmark'
import { AuditReportRequestForm } from '@/components/audit/AuditReportRequestForm'

/* ─────────────────────────────────────────────────────────────
 * /audit — 無料物件診断フォーム (2026-05-14)
 *
 * 機能: LP (/switch/*) の ReportRequestForm と完全同一
 *   - 3-step: 手数料 / 物件情報 / ご連絡先
 *   - lpVariant="audit" で /api/report-requests/submit に POST
 *   - 6系統 forward: Supabase / 吉蔵 / sales-portal / Meta CAPI / Sheets / Discord
 *   - 送信後は timerex MTG 予約ページへリダイレクト
 *
 * デザイン: HP editorial スタイル (ivory/paper/ink パレット)
 *   - chapter-marker + eyebrow ヘッダー
 *   - numbered Field component (01〜10)
 *   - bg-mist border-rule inputs
 *   - btn-primary 角ボタン (ink filled)
 *   - 3-col 「Step 01 · Label」 progress ledger
 * ──────────────────────────────────────────────────────────── */

export default function AuditPage() {
  return (
    <>
      <Header />
      <FloatingCTA />
      {/* GA4 計測(scroll_depth/section_view/cta_click)を lp_variant="audit" で送る。
          page_view は layout の config が、フォームの funnel イベントは AuditReportRequestForm が既に送信済み。 */}
      <EngagementTracker lpVariant="audit" />
      <main className="bg-ivory">

        {/* Hero — 他ページと統一（巨大ENラベル＋和文サブ＋リード） */}
        <section data-track-section="hero" className="relative w-full overflow-hidden bg-ivory section-hero pt-28 sm:pt-32">
          <GhostWordmark />
          <div className="relative z-10 container-edit">
            <SectionHead
              as="h1"
              hero
              en="REPORT"
              sub="無料で診断レポートをもらう"
              lead="入力は約3分、費用は一切かかりません。物件の稼働率の改善余地・他社との手数料差・収益を伸ばす運用プランを、専任担当が個別レポートにまとめ、最短1営業日以内にメールでお届けします。診断後にしつこい営業のお電話はありません。"
            />
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {['約3分で入力完了', '最短1営業日でお届け', '営業電話なし・登録不要'].map((t) => (
                <span key={t} className="inline-flex items-center gap-2 text-[13px] font-bold text-ink/70">
                  <svg className="h-4 w-4 shrink-0 text-sekai-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 13l4 4L19 7" />
                  </svg>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <section data-track-section="form" className="w-full bg-paper section-2xl">
          <div className="container-edit mx-auto max-w-2xl">
            <AuditReportRequestForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
