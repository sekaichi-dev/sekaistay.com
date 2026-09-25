import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import SectionHead from '@/components/ds/SectionHead'
import EditorialList from '@/components/ds/EditorialList'
import NumberCards from '@/components/ds/NumberCards'
import GhostWordmark from '@/components/ds/GhostWordmark'
import Reveal from '@/components/motion/Reveal'
import PositionList from '@/components/recruit/PositionList'
import RecruitForm from '@/components/RecruitForm'
import { RECRUIT_POSITIONS, RECRUIT_STEPS } from '@/data/recruit'

const FACTS = [
  {
    no: '01',
    title: 'AIによるDXで、業界平均の半額以下へ',
    body: '業界平均15〜25%という相場は、すべてを人の手で回す前提で組み上がった金額です。予約管理・ゲスト対応・レポート作成をAIと自社ツールで自動化し、手数料8%でも運用品質を落とさない体制をつくっています。',
    meta: '手数料 8%',
  },
  {
    no: '02',
    title: '全国展開で、どこの物件でも運用できる',
    body: '北海道から沖縄まで、各地域のチームで清掃・ゲスト対応・駆け付けまでカバーしています。エリアが増えても同じ品質で運用できることを前提に、仕組みをつくっています。',
    meta: '全国展開',
  },
  {
    no: '03',
    title: '日本一透明性の高い民泊運用を目指す',
    body: '売上・稼働率・経費は、オーナー様専用のダッシュボードでリアルタイムに開示しています。何にいくらかかり、なぜその判断をしたのか。運営の中身を隠さないことを、サービスの前提に置いています。',
    meta: '国土交通大臣 (01)第F05780号',
  },
]

const CULTURE = [
  {
    no: '01',
    title: '人手でなく、仕組みで回す',
    body: '予約の取り込み、ゲストへの一次返信、レポート作成まで自社ツールで自動化しています。手を動かす仕事より、どう仕組みにするかを考える仕事が中心です。',
    effect: '定型業務は自動化',
  },
  {
    no: '02',
    title: '判断の根拠は数字に置く',
    body: '稼働率・単価・経費は社内でも同じように見えています。勘や声の大きさではなく、データで議論します。',
    effect: '全員が同じ数字を見る',
  },
  {
    no: '03',
    title: '少人数・裁量が大きい',
    body: '職種の線引きは厳密ではありません。気づいた人が提案し、やってみて、振り返る。決裁までの距離が短い環境です。',
    effect: '提案から実装まで',
  },
  {
    no: '04',
    title: '働く場所は問わない',
    body: '現場業務を除きリモート勤務が可能です。オフィスは中目黒。全国の仲間とはオンラインでつながっています。',
    effect: 'リモート可',
  },
]

export default function RecruitPage() {
  return (
    <>
      <Header />
      <Breadcrumb items={[{ label: '採用情報' }]} />
      <main>
        {/* 1. Hero（ivory） */}
        <section className="relative w-full overflow-hidden bg-ivory section-hero pt-28 sm:pt-32">
          <GhostWordmark />
          <div className="relative z-10 container-edit">
            <SectionHead
              as="h1"
              hero
              en="RECRUIT"
              sub="宿を預かる会社ではなく、宿の価値を伸ばす会社へ。"
              lead="SEKAI STAY は、民泊・宿泊施設の運用代行サービスです。属人的な運用が当たり前だった業界を、仕組みと透明性で組み替えていく。その実装を一緒に進める仲間を募集しています。"
            />
            <Reveal as="div" delay={0.16}>
              <a href="#recruit-form" className="btn btn-primary mt-10">
                募集職種を見て応募する
              </a>
            </Reveal>
          </div>
        </section>

        {/* 2. 募集職種（paper）*/}
        <section className="w-full bg-paper section-2xl">
          <div className="container-edit">
            <SectionHead
              en="POSITIONS"
              sub="募集職種"
              lead="給与・待遇は経験と担当範囲に応じて個別にご提示します。下記以外の職種にご興味がある方も、フォームの「その他 / まずは話を聞きたい」からご連絡ください。"
            />
            <div className="mt-14">
              <PositionList positions={RECRUIT_POSITIONS} />
            </div>
          </div>
        </section>

        {/* 3. 事業の現在地（ivory）*/}
        <section className="w-full bg-ivory section-2xl">
          <div className="container-edit">
            <SectionHead
              en="OUR WORK"
              sub="民泊の運用代行を、仕組みで成り立たせる。"
              lead="掲載管理からゲスト対応、価格調整、清掃、駆け付け対応まで。運用のすべてをワンストップで引き受けながら、業界水準より低い手数料で成立させることに取り組んでいます。"
            />
            <div className="mt-14">
              <EditorialList columns={1} items={FACTS} />
            </div>
          </div>
        </section>

        {/* 4. 働き方（navy）*/}
        <section className="w-full bg-navy section-2xl">
          <div className="container-edit">
            <SectionHead light en="HOW WE WORK" sub="SEKAI STAY の働き方" />
            <div className="mt-14">
              <NumberCards columns={4} items={CULTURE} />
            </div>
          </div>
        </section>

        {/* 5. 選考の流れ（paper） */}
        <section className="w-full bg-paper section-2xl">
          <div className="container-edit">
            <SectionHead en="PROCESS" sub="選考の流れ" />
            <div className="mt-14">
              <EditorialList columns={2} items={RECRUIT_STEPS.map((s) => ({ no: s.no, title: s.title, body: s.body }))} />
            </div>
          </div>
        </section>

        {/* 6. 応募フォーム（ivory） */}
        <section id="recruit-form" className="w-full scroll-mt-24 bg-ivory section-2xl">
          <div className="container-edit">
            <SectionHead
              en="APPLICATION"
              sub="応募フォーム"
              lead="履歴書・職務経歴書のご用意は不要です。内容を確認のうえ、採用担当より3営業日以内にご連絡いたします。"
            />
            <div className="mx-auto mt-14 max-w-2xl">
              <RecruitForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
