import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: 'SEKAI STAY（株式会社セカイチ）のプライバシーポリシー。個人情報の取り扱い、利用目的、第三者提供、開示請求について。',
  alternates: { canonical: 'https://sekaistay.com/privacy' },
}

const ARTICLES = [
  {
    title: '事業者情報',
    body:
      '株式会社セカイチ（SEKAICHI Inc.）/ 代表者: 劉 添毅、明神 洸次郎 / 所在地: 〒153-0042 東京都目黒区青葉台2-20-7 KM中目黒ビル1F / 住宅宿泊管理業: 国土交通大臣(01)第F05780号',
  },
  {
    title: '収集する個人情報',
    body:
      '氏名、メールアドレス、電話番号、物件に関する情報（物件タイプ、所在地域、部屋数、現在の運用状況、月間売上レンジ等）、お問い合わせ内容、ウェブサイトのアクセスログ情報（IPアドレス、ブラウザ情報、閲覧ページ、アクセス日時等）。',
  },
  {
    title: '利用目的',
    body:
      'お問い合わせへの対応および収益シミュレーションの提供、本サービスに関するご案内・ご提案、サービスの改善・新サービスの開発、統計データの作成（個人を特定できない形式）、法令に基づく対応。',
  },
  {
    title: '第三者提供',
    body: '法令に基づく場合等を除き、お客様の同意なく個人情報を第三者に提供することはありません。',
  },
  {
    title: '外部サービスの利用',
    body:
      '当サイトでは広告効果測定およびサイト改善のため以下の外部サービスを利用しています。【アクセス解析】Google Analytics 4（Google LLC）、Microsoft Clarity（Microsoft Corporation）によりセッション情報・ヒートマップを収集します。【広告効果測定】Google 広告（Google LLC）、Meta Pixel および Conversions API（Meta Platforms, Inc.）により広告経由の成果を計測します。お問い合わせフォームにご入力いただいたメールアドレス・電話番号等の情報は、送信前に不可逆な暗号化（SHA-256 ハッシュ化）を施した上で、上記広告媒体に送信される場合があります。【フォーム送信】一部のお問い合わせフォームの送信処理には Web3Forms（Web3Forms, operated by Surmon Software Ltd.）を利用しています。【タグ管理】Google タグ マネージャー（Google LLC）により上記タグを管理しています。いずれも個人を特定できる形式で第三者に提供されることはありません。',
  },
  {
    title: 'クッキーについて',
    body:
      'サイトの利便性向上およびアクセス解析のためにクッキーを使用しています。ブラウザの設定により拒否可能ですが、一部機能がご利用いただけなくなることがあります。',
  },
  {
    title: '個人情報の管理',
    body: '個人情報への不正アクセス・紛失・破損・改ざん・漏洩を防止するため、必要なセキュリティ対策を講じます。',
  },
  {
    title: '開示・訂正・削除',
    body: 'お客様はご自身の個人情報について、開示・訂正・追加・削除・利用停止を請求できます。本人確認の上、合理的な期間内に対応いたします。',
  },
  {
    title: 'ポリシーの変更',
    body: '必要に応じて本ポリシーを変更することがあります。変更時は当ウェブサイトに掲載してお知らせいたします。',
  },
  {
    title: 'お問い合わせ窓口',
    body: '株式会社セカイチ / 〒153-0042 東京都目黒区青葉台2-20-7 KM中目黒ビル1F / メール: contact@sekaistay.com',
  },
]

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <FloatingCTA />
      <main className="bg-ivory">
        {/* Chapter Ⅰ — masthead */}
        <section className="bg-paper border-b border-rule">
          <div className="container-edit section-hero">
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <p className="eyebrow text-sekai-teal">Legal</p>
            </div>
            <h1 className="heading-display text-ink mb-5">
              プライバシーポリシー
              <span className="block font-sans font-light text-mid-gray text-[0.55em] mt-3">Privacy Policy</span>
            </h1>
            <div className="flex items-center gap-4 mt-8">
              <span className="h-px w-12 bg-rule" />
              <p className="eyebrow-mono text-mid-gray">Last Revised · 2026.04.07</p>
            </div>
          </div>
        </section>

        {/* Chapter Ⅱ — articles */}
        <section className="section-xl">
          <article className="container-narrow px-5 md:px-8 max-w-3xl">
            <div className="bg-paper border border-rule p-8 md:p-12 mb-12">
              <p className="font-sans text-body text-ink leading-[2]">
                株式会社セカイチ（以下「当社」）は、SEKAI STAY（以下「本サービス」）において、
                お客様の個人情報の保護を重要な責務と認識し、以下のとおりプライバシーポリシーを定め、適切な管理・保護に努めます。
              </p>
            </div>

            <div className="chapter-marker">
              <span className="eyebrow-mono text-mid-gray">§ Articles</span>
              <span className="h-px bg-rule flex-1" />
              <p className="eyebrow text-sekai-teal">Ten Provisions</p>
            </div>

            <div className="space-y-0 border-t border-rule">
              {ARTICLES.map((a, i) => (
                <div key={i} className="border-b border-rule py-8 md:py-10">
                  <div className="flex items-start gap-5 md:gap-8">
                    <span className="font-sans font-light text-[32px] md:text-[44px] text-sekai-teal leading-none tabular-nums flex-shrink-0 pt-1">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <p className="eyebrow-mono text-mid-gray mb-2">Article № {String(i + 1).padStart(2, '0')}</p>
                      <h2 className="font-sans font-medium text-[17px] md:text-[20px] text-ink mb-4 leading-snug">
                        {a.title}
                      </h2>
                      <p className="font-sans text-body-sm text-dark-gray leading-[2]">
                        {a.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Colophon */}
            <div className="mt-16 text-center">
              <div className="flex items-center justify-center gap-4">
                <span className="h-px w-12 bg-rule" />
                <p className="eyebrow text-sekai-teal">End of Policy</p>
                <span className="h-px w-12 bg-rule" />
              </div>
              <p className="font-sans text-caption text-mid-gray mt-4">
                © SEKAICHI Inc. — Privacy Policy
              </p>
            </div>
          </article>
        </section>
      </main>
      <Footer />
    </>
  )
}
