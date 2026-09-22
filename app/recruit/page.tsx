import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import RecruitForm from '@/components/RecruitForm'
import { RECRUIT_POSITIONS, RECRUIT_STEPS } from '@/data/recruit'

const FACTS = [
  { value: '8%', label: '運用代行手数料', note: '業界平均15〜25%に対して' },
  { value: '7拠点', label: '全国ネットワーク', note: '東京・大阪・京都・福岡・沖縄・北海道・長野' },
  { value: '(01)第F05780号', label: '住宅宿泊管理業', note: '国土交通大臣登録' },
]

const CULTURE = [
  {
    no: '01',
    title: '人手でなく、仕組みで回す',
    body: '予約の取り込み、ゲストへの一次返信、レポート作成まで自社ツールで自動化しています。手を動かす仕事より、どう仕組みにするかを考える仕事が中心です。',
  },
  {
    no: '02',
    title: '数字がすべて見える',
    body: '売上・稼働率・経費はオーナー様にもリアルタイムで開示しています。社内でも同じで、判断の根拠は勘ではなく数字に置きます。',
  },
  {
    no: '03',
    title: '少人数・裁量が大きい',
    body: '職種の線引きは厳密ではありません。気づいた人が提案し、やってみて、振り返る。決裁までの距離が短い環境です。',
  },
  {
    no: '04',
    title: '働く場所は問わない',
    body: '現場業務を除き、リモート勤務が可能です。オフィスは中目黒。全国7拠点の仲間とはオンラインでつながっています。',
  },
]

export default function RecruitPage() {
  return (
    <>
      <Header />
      <Breadcrumb items={[{ label: '採用情報' }]} />
      <main className="bg-ivory">
        {/* Ⅰ — masthead */}
        <section className="bg-paper border-b border-rule">
          <div className="container-edit section-hero">
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <p className="eyebrow text-sekai-teal">Recruit</p>
            </div>
            <h1 className="heading-display text-ink mb-5">
              採用情報
              <span className="block font-sans font-light text-mid-gray text-[0.6em] mt-3">Join SEKAI STAY</span>
            </h1>
            <p className="lead text-dark-gray max-w-2xl">
              宿を預かる会社ではなく、宿の価値を伸ばす会社へ。
              属人的な運用が残る民泊業界を、仕組みと透明性で変えていくチームで、一緒に働く仲間を募集しています。
            </p>
            <div className="mt-10">
              <a href="#recruit-form" className="btn btn-primary">
                募集職種を見て応募する
              </a>
            </div>
          </div>
        </section>

        {/* Ⅱ — 事業の現在地 */}
        <section className="section-xl">
          <div className="container-edit px-5 md:px-8">
            <div className="chapter-marker">
              <span className="eyebrow-mono text-mid-gray">§ 01</span>
              <span className="h-px bg-rule flex-1" />
              <p className="eyebrow text-sekai-teal">What we do</p>
            </div>
            <h2 className="heading-section text-ink max-w-3xl heading-mb">
              民泊の運用代行を、
              <span className="font-sans text-sekai-teal">仕組み</span>で成り立たせる。
            </h2>
            <p className="font-sans text-body text-dark-gray max-w-3xl leading-[1.95]">
              SEKAI STAY は、株式会社セカイチが運営する民泊・宿泊施設の運用代行サービスです。
              業界の相場である手数料15〜25%は、すべてを人の手で回す前提で組み上がった金額でした。
              私たちは一つひとつの業務を分解してツールに落とし込み、手数料8%という水準で運営品質をむしろ高めることに取り組んでいます。
              数字もプロセスもオーナー様に開示する——その当たり前を、業界の標準にしていくのが私たちの仕事です。
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {FACTS.map((f) => (
                <div key={f.label} className="border-t-2 border-sekai-teal pt-5">
                  <p className="font-sans text-[1.75rem] font-bold leading-none text-sekai-teal">{f.value}</p>
                  <p className="mt-4 font-sans text-[15px] font-bold text-ink">{f.label}</p>
                  <p className="mt-2 font-sans text-caption text-mid-gray leading-[1.8]">{f.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ⅲ — 働き方 */}
        <section className="section-xl bg-bone border-y border-rule">
          <div className="container-edit px-5 md:px-8">
            <div className="chapter-marker">
              <span className="eyebrow-mono text-mid-gray">§ 02</span>
              <span className="h-px bg-rule flex-1" />
              <p className="eyebrow text-sekai-teal">How we work</p>
            </div>
            <h2 className="heading-section text-ink max-w-3xl heading-mb">SEKAI STAY の働き方</h2>
            <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
              {CULTURE.map((c) => (
                <div key={c.no} className="border-t border-rule pt-6">
                  <span className="eyebrow-mono text-mid-gray">{c.no}</span>
                  <h3 className="mt-3 font-sans text-[1.125rem] font-bold text-ink">{c.title}</h3>
                  <p className="mt-3 font-sans text-body-sm text-dark-gray leading-[1.95]">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ⅳ — 募集職種 */}
        <section className="section-xl">
          <div className="container-edit px-5 md:px-8">
            <div className="chapter-marker">
              <span className="eyebrow-mono text-mid-gray">§ 03</span>
              <span className="h-px bg-rule flex-1" />
              <p className="eyebrow text-sekai-teal">Open positions</p>
            </div>
            <h2 className="heading-section text-ink max-w-3xl heading-mb">募集職種</h2>

            <div className="space-y-8">
              {RECRUIT_POSITIONS.map((p, i) => (
                <article key={p.id} id={p.id} className="border border-rule bg-paper">
                  <div className="bg-ink text-ivory px-6 md:px-8 py-6 flex flex-wrap items-baseline justify-between gap-3">
                    <div>
                      <p className="eyebrow-mono text-bright-teal mb-1">№ {String(i + 1).padStart(2, '0')} · {p.en}</p>
                      <h3 className="font-sans text-[19px] md:text-[21px] font-bold">{p.title}</h3>
                    </div>
                    <div className="font-sans text-[12.5px] text-ivory/70 text-right leading-[1.9]">
                      <p>{p.employment}</p>
                      <p>{p.location}</p>
                    </div>
                  </div>

                  <div className="px-6 md:px-8 py-7">
                    <p className="font-sans text-body-sm text-dark-gray leading-[1.95]">{p.summary}</p>

                    <div className="mt-7 grid gap-8 md:grid-cols-2">
                      <div>
                        <p className="eyebrow text-sekai-teal mb-3">仕事内容</p>
                        <ul className="space-y-2">
                          {p.duties.map((d) => (
                            <li key={d} className="flex gap-3 font-sans text-body-sm text-ink leading-[1.9]">
                              <span className="mt-[0.7em] h-px w-3 flex-shrink-0 bg-sekai-teal" />
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="eyebrow text-sekai-teal mb-3">求める人物像</p>
                        <ul className="space-y-2">
                          {p.wanted.map((w) => (
                            <li key={w} className="flex gap-3 font-sans text-body-sm text-ink leading-[1.9]">
                              <span className="mt-[0.7em] h-px w-3 flex-shrink-0 bg-sekai-teal" />
                              <span>{w}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8 border-t border-rule pt-6">
                      <a href="#recruit-form" className="btn btn-ghost-teal">
                        この職種に応募する
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <p className="mt-8 font-sans text-body-sm text-mid-gray leading-[1.95]">
              ※ 給与・待遇は経験と担当範囲に応じて個別にご提示します。上記以外の職種にご興味がある方も、
              フォームの「その他 / まずは話を聞きたい」からお気軽にご連絡ください。
            </p>
          </div>
        </section>

        {/* Ⅴ — 選考フロー */}
        <section className="section-xl bg-bone border-y border-rule">
          <div className="container-edit px-5 md:px-8">
            <div className="chapter-marker">
              <span className="eyebrow-mono text-mid-gray">§ 04</span>
              <span className="h-px bg-rule flex-1" />
              <p className="eyebrow text-sekai-teal">Process</p>
            </div>
            <h2 className="heading-section text-ink max-w-3xl heading-mb">選考の流れ</h2>
            <div className="grid gap-8 md:grid-cols-4">
              {RECRUIT_STEPS.map((s) => (
                <div key={s.no} className="border-t-2 border-sekai-teal pt-5">
                  <span className="font-sans block text-[1.75rem] font-bold leading-none text-sekai-teal">{s.no}</span>
                  <h3 className="mt-4 font-sans text-[1.0625rem] font-bold text-ink">{s.title}</h3>
                  <p className="mt-3 font-sans text-body-sm text-dark-gray leading-[1.9]">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ⅵ — 応募フォーム */}
        <section id="recruit-form" className="section-xl bg-mist scroll-mt-24">
          <div className="container-narrow px-5 md:px-8 max-w-2xl">
            <div className="chapter-marker">
              <span className="eyebrow-mono text-mid-gray">§ 05</span>
              <span className="h-px bg-rule flex-1" />
              <p className="eyebrow text-sekai-teal">Application</p>
            </div>
            <h2 className="heading-section text-ink heading-mb">応募フォーム</h2>
            <p className="font-sans text-body-sm text-dark-gray mb-10 leading-[1.95]">
              履歴書・職務経歴書のご用意は不要です。内容を確認のうえ、採用担当より3営業日以内にご連絡いたします。
            </p>
            <RecruitForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
