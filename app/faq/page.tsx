import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import Reveal from '@/components/motion/Reveal'
import SectionHead from '@/components/ds/SectionHead'
import RelatedLinks from '@/components/ds/RelatedLinks'
import { ContactSense } from '@/components/home/SenseSections'
import FaqAccordion, { type FaqCategory } from '@/components/faq/FaqAccordion'

export const metadata: Metadata = {
  title: 'よくあるご質問（FAQ）',
  description:
    'SEKAI STAYの民泊運用代行サービスに関するよくあるご質問をまとめました。料金、契約、サービス内容、対応エリアなど。',
  openGraph: {
    title: 'よくあるご質問 | SEKAI STAY',
    description: '民泊運用代行に関するよくあるご質問。料金・契約・対応範囲・始め方など。',
    type: 'website',
    locale: 'ja_JP',
    url: 'https://sekaistay.com/faq',
    siteName: 'SEKAI STAY',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'よくあるご質問 | SEKAI STAY',
    description: '民泊運用代行に関するよくあるご質問。料金・契約・対応範囲・始め方など。',
  },
  alternates: { canonical: 'https://sekaistay.com/faq' },
}

// カテゴリ別 Q&A（トップ FAQS を再利用し、各カテゴリに SEKAI 独自の追加質問を加筆）
const FAQ_CATEGORIES: FaqCategory[] = [
  {
    en: 'PRICE',
    ja: '料金',
    items: [
      {
        q: '本当に8%＋月1万円以外、かからないんですか？',
        a: '毎月の運用費はそれだけです。別途かかるのは初期費用、消耗品などの実費、ご希望時の有料オプションのみ。清掃費はゲストの宿泊料に含めて精算するため、月々の持ち出しはありません。',
      },
      {
        q: 'なぜ手数料8%で運営できるのですか？',
        a: '掲載・価格調整・ゲスト対応などの運用を仕組み化し、無駄なコストを抑えているためです。費用を抑えつつ品質を保てるよう、運用の状況はダッシュボードで可視化しています。',
      },
      {
        q: '宿泊がなかった月も費用はかかりますか？',
        a: '固定の月¥10,000のみです。運用代行手数料8%は売上に連動するため、宿泊がなかった月は発生しません。',
      },
      {
        q: '初期費用はいくらですか？',
        a: '他社からの乗り換えで¥100,000／物件、新規立ち上げは立ち上げプラン¥300,000／物件（プロ撮影込み・全8工程）です。かかりうる費用は契約前にすべて金額つきでお伝えします。※2026年8月31日までのお問い合わせは、初期費用10万円割引キャンペーンの対象です。',
      },
      {
        q: '清掃費や備品補充は別途請求されますか？',
        a: '清掃費はゲストの宿泊料に含めて精算するため、オーナー様の月々の持ち出しはありません。消耗品（アメニティ等）の補充は実費＋20%で精算します。清掃の手配と品質管理そのものは、運用代行サービスに含まれています。',
      },
      {
        q: '有料オプションにはどんなものがありますか？',
        a: 'プロカメラマンによる物件撮影、家具家電の購入・設置代行、許認可申請の代行、スマートロック導入、一休.com・じゃらんへの追加掲載、直接予約サイトの構築などを、ご希望に応じて承ります。いずれも事前にお見積もりを提示し、後出しの請求はしません。',
      },
    ],
  },
  {
    en: 'CONTRACT',
    ja: '契約',
    items: [
      {
        q: '最低契約期間6ヶ月の理由は？',
        a: '価格調整と掲載最適化の効果が数字に表れるまで、季節をまたいだ運用期間が必要だからです。7ヶ月目以降の解約金は¥0です。',
      },
      {
        q: '解約したいときの手続きや解約金は？',
        a: '解約は3ヶ月前までにお申し出ください。7ヶ月目以降の解約金は¥0です。6ヶ月未満で途中解約する場合のみ、解約手数料20万円をいただきます。契約終了までにお預かりした予約は、最後まで責任を持って対応します。',
      },
      {
        q: '今の会社との契約が残っています。相談だけでもいいですか？',
        a: 'もちろんです。乗り換えの段取りの整理だけでも、無料相談をお使いください。',
      },
      {
        q: '法人でも個人でも契約できますか？',
        a: 'はい、法人・個人どちらでもご契約いただけます。',
      },
    ],
  },
  {
    en: 'SERVICE',
    ja: '対応範囲・エリア',
    items: [
      {
        q: '地方の物件でも対応できますか？',
        a: '清掃パートナーを確保できているエリアで全国対応しています。まずは物件の所在地をお知らせください。対応可否と、そのエリアでの運用見込みをあわせてご案内します。',
      },
      {
        q: 'ゲスト対応は何語に対応していますか？',
        a: '日本語・英語・中国語・韓国語など、主要な言語に24時間対応しています。海外ゲストにも安心して滞在いただける体制で、レビュー評価を守ります。',
      },
      {
        q: 'どんな物件タイプに対応していますか？',
        a: 'マンション一室、一棟貸し、戸建て、ヴィラ、トレーラーハウスなど、幅広い物件タイプに対応しています。物件ごとに最適な運用方針をご提案します。',
      },
      {
        q: '複数物件をまとめて任せられますか？',
        a: 'はい、複数物件の一括管理も可能です。物件数に応じた効率的な運用体制をご提案します。',
      },
      {
        q: '売上や運用状況はどこまで見えますか？',
        a: 'オーナー専用ダッシュボードで、売上・予約・ゲスト対応・経費の内訳をいつでも確認できます。「任せているけれど見えない」状態をつくりません。',
      },
    ],
  },
  {
    en: 'FLOW',
    ja: '始め方',
    items: [
      {
        q: '民泊が初めてでも大丈夫ですか？',
        a: '物件選定・許認可・立ち上げから伴走します。まずは30分の無料相談で、物件の条件から一緒に整理しましょう。',
      },
      {
        q: '新規立ち上げでは、何をしてもらえますか？',
        a: 'プロ写真撮影・OTAリスティング初期設定（Airbnb・Booking）・Airbnb登録用電話番号の代行取得・料金初期設定（ダイナミックプライシング）・キーボックス設定と設備確認・消耗品/アメニティ初期管理・ハウスマニュアル作成（多言語）・清掃会社の手配と公開まで、開業までの全8工程を立ち上げプランとして一括で代行します。詳しい内訳は料金ページをご覧ください。',
      },
      {
        q: '他社からの乗り換えはスムーズにできますか？',
        a: '現在の契約内容を確認し、引き継ぎの段取りまでサポートします。OTAの引き継ぎは並走で進めるため収益の空白期間はなく、移行は最短2週間ほどで完了します。',
      },
      {
        q: '診断を受けたら、営業の電話がかかってきますか？',
        a: 'かかってきません。入力3分・無料で、1営業日以内に個別レポートをお送りします。',
      },
      {
        q: '契約から開業までどのくらいかかりますか？',
        a: '物件の状況にもよりますが、最短で2週間ほどから開業いただけます。準備が必要な場合も、段取りを整理しながら無理のないスタートをご提案します。',
      },
    ],
  },
]

/* FAQ JSON-LD（SEO 用にサーバーレンダリング） */
function getFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_CATEGORIES.flatMap((cat) =>
      cat.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      }))
    ),
  }
}

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getFAQSchema()) }}
      />

      <Header />
      <FloatingCTA />

      {/* FAQ — Deep Teal セクション */}
      <section className="w-full bg-navy-deep pb-24 pt-28 text-white sm:pb-32 sm:pt-36">
        <div className="container-edit">
          <SectionHead
            as="h1"
            light
            hero
            en="FAQ"
            sub="民泊運用でよくある質問"
            lead="料金・契約・対応範囲・始め方について、よくいただくご質問をまとめました。ここにない疑問は、お問い合わせからお気軽にお尋ねください。"
          />
          <Reveal as="div" className="mt-14 sm:mt-16">
            <FaqAccordion categories={FAQ_CATEGORIES} />
          </Reveal>
        </div>
      </section>

      {/* 関連ページ導線 */}
      <section className="w-full bg-ivory">
        <div className="container-edit border-t border-rule py-14">
          <RelatedLinks items={[{ href: '/pricing', label: '料金の詳細' }, { href: '/services', label: 'サービス内容' }]} />
        </div>
      </section>

      {/* 末尾CTA — 共通 ContactSense（REPORT / CONTACT） */}
      <ContactSense />

      <Footer />
    </>
  )
}
