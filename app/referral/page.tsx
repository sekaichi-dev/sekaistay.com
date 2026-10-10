import Header from '@/components/Header'
import Footer from '@/components/Footer'

// 紹介制度は展開しない（2026-10-10 吉田）。受付は終了＝フォームも送信も出さない（/api/referral/register は 410）。
// 登録フォーム・規約の旧版は git の履歴（2026-07-01 の紹介制度 Phase1）にある。
export default function ReferralPage() {
  return (
    <>
      <Header />
      <main className="bg-ivory">
        <section className="bg-paper border-b border-rule">
          <div className="container-edit section-hero">
            <h1 className="heading-display text-ink">紹介制度の受付は終了しました</h1>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
