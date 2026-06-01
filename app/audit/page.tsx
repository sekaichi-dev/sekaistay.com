'use client'

import Header from '@/components/Header'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import EngagementTracker from '@/components/EngagementTracker'
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
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: '無料物件診断' }]} />

        {/* Hero / Masthead */}
        <section data-track-section="hero" className="bg-paper border-b border-rule">
          <div className="container-edit section-hero">
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <p className="eyebrow text-sekai-teal">Free Property Audit</p>
            </div>
            <h1 className="heading-display text-ink mb-5">
              無料物件診断
              <span className="block font-sans font-light text-mid-gray text-[0.6em] mt-3">
                3 minutes · personalized report
              </span>
            </h1>
            <p className="lead text-dark-gray max-w-2xl">
              あなたの物件の稼働率改善余地・手数料比較・運営ロードマップを、SEKAI STAY
              の担当アナリストが個別レポートとしてお届けします。最短24時間後にメールでご返送します。
            </p>
          </div>
        </section>

        {/* Form */}
        <section data-track-section="form" className="section-xl">
          <div className="container-edit max-w-2xl mx-auto px-5 md:px-8">
            <AuditReportRequestForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
