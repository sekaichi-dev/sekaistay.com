#!/usr/bin/env node
// SEKAI STAY X Content Tracker - X Pipeline タブを更新
// Sheet: 19qsHLdmIex59mj-xABMbF4jCatHoy6SN7LE8x4EzWVY
//
// v11 (2026-05-19): タブ整理 - X Pipeline は通常運用のみに整理
//   - LAUNCH 関連 (T-LAUNCH, J-LAUNCH) → Launch Channels タブに移管
//   - Deferred 行 (J-3, U-5) を削除
//   - PIPELINE_HEADER を 20 列 → 12 列に圧縮 (note/HP カラムは別タブで管理)
//   - 通常運用 6 行のみに整理: T-1, T-2, T-3, T-4, J-4, U-6

import { getSheets } from "../../../shared/google-auth/index.js";

const SPREADSHEET_ID = "19qsHLdmIex59mj-xABMbF4jCatHoy6SN7LE8x4EzWVY";
const ACCOUNT = "sekaichi";

const PIPELINE_HEADER = [
  "ID", "Account", "Pillar", "Topic/Hook", "LP送客先",
  "Publish Date", "Status",
  "Notes",
  "📝 Full Draft Content",
];

const DRAFT_T1 = `「8%って、ボランティアでやってるんですか?」

民泊代行の手数料の話をすると、最近よく聞かれる。

業界相場が15-25%だから、半額以下に見える。
当然の質問だと思う。

でも、ちゃんと黒字なんですよね。

なんで可能か、構造の話を書きます。

---

業界相場 20% は、運営を「人が物件に張り付く」前提のコスト。
業界の代行で頑張ってる会社でも、1 人あたり数十件が上限くらいだと思う。
だから手数料を下げられない。

うちは、AI で効率化する前提で運営構造を全部見直した。

- 価格管理は日次で自動チューニング
- カスタマー対応は一次自動化 + 社内エスカレーション
- 清掃は信頼パートナーと長期契約・スケジュール配信は自動
- Web マーケ出稿・経理などのバックオフィス業務は自動化

これで 1 人で 100 物件以上を見られるようになった。
8% でも黒字になる構造です。

---

「安く回してるなら、品質が落ちるのでは?」とも言われる。

実は逆で、仕組みで回してるからこそ品質が均質化するんですよ。

例えば、ダイナミックプライシング。
毎日触ってるか、放置してるかで、稼働率は月単位で 5-10% 変わる。

人力で 100 物件全部を毎日触るのは無理。

毎日のチューニングは仕組みに任せて、難しい判断は社内で見る。
この前提があって初めて、8% でもスーパーホストの運営力が生きてくる。

---

要は、業界相場 20% は「人力で数十件を抱える」コスト構造。

仕組みを真ん中に置けば、1 人で 100 物件以上を見られる。業界の 2 倍以上の効率。
8% でも黒字になります。
品質も、人力依存より仕組みベースのほうが均質。

ここは、誰でも同じ構造で再現できるはず。

うちの物件、今いくら損してるか診断できます。
よかったら → https://sekaistay.com/go/t1

※ Airbnb 未掲載・アクティブなリスティングが無いオーナーもOKです`;

const DRAFT_T2 = `「同じエリアで運営してるのに、なんでうちだけ稼働 78% なんですか?」

先日、別の代行業者で運営してるオーナーさんに聞かれた。

野尻湖の物件の話です。
THE LAKE HOUSE 野尻湖、今年「BEST OF SAUNA STAY 2026」を受賞しました。

受賞自体は、正直、副産物だと思ってる。

本当に伝えたいのは、ADR（1 泊あたりの平均価格）10 万円超のハイエンド物件で「稼働率」を上げに行く時、何が一番効いたかという話。

---

物件のスペックは元から強かった。
ADR は 10 万円超のレンジ。問題は、ハイエンド帯で稼働率をどう上げるか、だった。

稼働を上げに行くために、僕らがやったのは大きく 4 つ。
インパクトが大きかった順で書きます。

---

1️⃣ サムネ写真の最適化（一番効いた）

OTA の検索結果は、サムネ 1 枚で 8 割決まる。

ハイエンド物件は特に、「この値段で泊まる体験」を 1 枚で伝えられないと、そもそも詳細ページに来てもらえない。

サムネ候補を 5-10 パターン用意して、各 OTA でテスト。
最終的に選んだ 1 枚で、Airbnb の検索結果からの流入が大きく増えました。

「物件のシンボル」を写真の主役に置く。
これが一番効いた打ち手です。

2️⃣ OTA の面を、増やせるだけ増やす

立ち上げから Airbnb と Booking.com は押さえていた。
そこから、VRBO・Expedia・楽天トラベル・じゃらん・一休・Trip.com など、増やせる面は全部増やしました。

媒体ごとに刺さる顧客層が違うんですよね。

- Trip.com: 中華圏のインバウンド
- 一休: 国内富裕層
- Booking.com: 欧米インバウンド
- 楽天 / じゃらん: 国内一般層

ハイエンド物件は特に、媒体を絞ると取りこぼしが大きい。
面を増やすだけで稼働率が上がる典型例です。

3️⃣ リスティング文章の書き直し

機能羅列型から、ストーリー型に変えた。

「サウナ・薪ストーブ・湖畔徒歩 3 分」→「夜、湖畔のサウナから戻って薪ストーブの前でグラスを傾ける」みたいな、滞在体験の解像度を上げる文章に変更。

ハイエンド帯の意思決定者は、機能じゃなくて体験で予約する。

4️⃣ ダイナミックプライシング（ここがハイエンド帯の肝）

価格は Pricelabs + AI で毎日チューニングしてます。

ハイエンド帯（ADR 10 万円超）のダイナミックプライシングが面白いのは、**数千円単位の調整でも収益が動くこと**。

例えば ¥108,000 → ¥112,000 に上げても、ゲストから見れば「10 万円超」というカテゴリは変わらない。心理的な価格帯を超えないので、高い印象を与えずに収益を最大化できる。

逆に、¥20,000 帯で同じ数千円を動かすと、ゲストの判断に大きく影響します。
ハイエンド帯はこの「微調整で動ける余地」が大きい。

人が月 1 で触る運用だと、この粒度は絶対に追いつかない。
だから毎日触れる仕組みが必要なんです。

---

結果:

ADR: 維持しつつ稼働 +20% 以上
稼働: 78%（同エリア・同価格帯の 1.4-1.6 倍）
レビュー単価: 大幅 UP

---

これって、運用代行を変えるとか、手数料を下げる以前の話だと思うんですよね。

そもそも、自分の物件の戦い方が間違ってないか?

オーナーさんとの面談でいつも聞くこと:

- サムネ 1 枚で「この物件らしさ」が伝わってるか
- 強い OTA を全部押さえてるか
- リスティング文章が「機能羅列」になっていないか
- 価格は日次で動いているか

ここの答えが曖昧だと、運用代行を変えても結果は変わらない。

---

うちは、運用代行を変えてくれたオーナーに、最初の 1 ヶ月でこの 4 つを全部見直します。

だから他社からの乗り換えで「同じ物件なのに +30% 増収」が起きる。

受賞は副産物。
でも、オーナーさんと喜びを分かち合えたのは、本当に嬉しかった。

あなたの物件、いくら損してるか診断できます。
よかったら → https://sekaistay.com/go/t2

※ Airbnb 未掲載のオーナーも OK`;

const DRAFT_T3 = `「今の代行、ちょっと変えたいんですよね」

最近、毎週のように相談がある言葉。

ただ、変えればいいって話じゃない。
変えるべきタイミングを間違えると、もっと悪くなる場合もあるから、慎重に書きます。

---

オーナーさんとの面談で見てきた、
代行を変えるべき 3 つの兆候。

---

兆候 1: 月次レポートが「数字の羅列」で終わってる

数字は出てるけど、解釈や次の打ち手の提案がない。
「先月は稼働 68% でした」だけのレポートは、運営してない証拠です。

ちゃんと運営してる代行は、必ず:

- なぜ伸びた / 落ちたか
- 来月どう動かすか
- どこに投資すべきか

を月次レポートで提示してくれる。

---

兆候 2: 価格が 3 ヶ月以上動いていない

民泊の需要は日次で動きます。
近隣のフェス・天気予報・競合の値動き・OTA 検索順位、全部が価格に影響する。

3 ヶ月同じ価格で放置されてたら、ほぼ確実に取りこぼし。

ちなみに、うちは Pricelabs + Claude で毎日価格を触ってます。
人間の手で 100 物件分やるのは無理。AI 前提で組まないと、もう追いつかない時代です。

---

兆候 3: トラブル対応が「報告」で終わってる

「ゲストからクレームがありました」だけ送ってくる代行が多い。

でも、オーナーが知りたいのは:

- 何が原因だったか
- どう対応したか
- 再発防止のために何を変えたか

報告だけで提案がない = オーナーに思考の負担を投げてるだけ。
静かに代行を変えるべき兆候だと思ってます。

---

じゃあ、いつ変えるべきか。

ベストタイミングは「契約更新の 1-2 ヶ月前」。

やめると決めてから動いても、引き継ぎで物件が止まる期間が必ず出る。
事前準備しておくと、切替日に予約が途切れずに済みます。

---

要は、代行業者は「数字を出す人」じゃなくて「数字を動かす人」を選ぶべき。

3 ヶ月放置されてる物件、月次レポートが薄い物件、トラブルが報告だけで終わる物件。
どれか当てはまったら、変えどきかもしれません。

うちの物件、いま変えるべきタイミングか診断できます。
よかったら → https://sekaistay.com/go/t3

※ Airbnb 未掲載のオーナーも OK`;

const DRAFT_T4 = `「20 万円の家具をケチって、100 万円逃してます」

これは、オーナーさんとの面談で僕がよく使う言い回し。

民泊の家具投資、もっと真面目に考えていい領域だと思ってる。

---

具体的な話で書きます。

京都の町家を改装した 1 棟貸し物件。
オーナーさんは「町家の雰囲気が出ればいい」と、IKEA でひとまず揃えた状態でリスティング開始。

ADR ¥26,000 / 稼働 65%
月の売上 約 50 万円。

ここで僕らがやったのは、家具投資 30 万円。

ただ、30 万円を全部に均等にかけるんじゃなくて、お金をかける所と削る所を仕分けるのがポイントです。

**お金をかける = 物件の印象を決める「シンボル」家具**

- ダイニングテーブル・チェア
- ソファ

写真の中心に来るもの、ゲストが滞在中に必ず触れるもの。
ここをケチると物件全体が一気に安く見える。

**雰囲気を作る = アート・小物（コスパよく揃える）**

- アート作品・額縁
- 観葉植物・花瓶
- クッション・ブランケット

ここはお金をかけるところじゃない。物件のテーマや雰囲気に合うものを、コスパよく配置するのが正解。
1 万円のアートでも、選び方と配置で「ちゃんとしてる感」は十分作れる。

**コスパ重視 = 物件の印象を左右しない家具・消耗品**

- 洗濯機・冷蔵庫・照明・ラグ
- 食器類・カトラリー
- アメニティ（シャンプー類・タオル類）

ここはブランドより耐久性とメンテのしやすさで選ぶ。

**造作家具を使う = 既製品より高見え・機能性**

- ダイニングテーブルは一枚板の天板にお金をかける（既製品より高見えする）
- 壁と同化したビルトインソファでリビングを広く使える
- 二段ベッドも丁寧に造作するとゲスト人数を増やせて売上が上がる

**テレビをやめる = 非日常 + スペース最大化 + コストセーブ**

プロジェクター + ロールスクリーンに置き換えると、3 つ同時に効く。
ゲストには非日常体験、リビングは広く使え、コストも下がる。

---

これで価格を ADR ¥32,000 に再設定 → 稼働 72%。

月の売上 約 70 万円（+20 万円 / 月）。

家具投資 30 万円は、1.5 ヶ月で回収（+20 万円/月 × 1.5 ヶ月）。
1 年で見ると、家具投資を引いても +210 万円の上振れが残る計算です。

---

家具投資を渋るオーナーさんに、よく言われる:

「壊れたらどうするんですか」
「次のテナントの好みに合うか分からない」
「最低限でいいです、ビジネス用なので」

全部わかります。

でも、数字で考えると、家具投資 30 万円をケチって ADR を ¥6,000 下げる判断が、
年間 100 万円以上の機会損失になる。

---

家具投資の判断フレーム（経営者目線）:

1. 回収期間 ≤ 6 ヶ月 が許容ライン
2. ADR の上昇余地 = 物件タイプ × エリア × 競合との差別化
3. 業務用・耐久性あるものを選ぶ（年 1 回交換は前提にしない）
4. 写真映えは ADR を上げる燃料

家具リストごとに ROI 計算してから、買うか買わないか決める。

ちなみに、うちはこの ROI 計算を、独自開発の AI エージェントと運営ポータルで半自動化してます。

過去 100 物件分の家具 × 売上データを蓄積してあるので、運営チームがオーナーさんに毎月こういう提案を出せる:

- 物件タイプ・エリアに似た物件で、何の家具が一番売上に効いたか
- 検討中の家具を入れたら、年間 ADR がいくら動くか
- 既存の家具の中で、ROI が低くて入れ替え候補になるもの

オーナーさんは、運営ポータルのチャットでこの提案を確認して、承認 or 却下するだけ。

家具を 1 から選ぶ手間はなくて、運営からの提案に「Yes / No」で答える運営に変わる。
これがうちが提供したいオーナー体験です。

※ 提案を 1 タップで承認・却下できるボタンは現在開発中。今はチャットで「OK です」「これは見送り」と返してもらう運用です。

---

要は、民泊家具は「コスト」じゃない。
「投資」です。

30 万円の家具で、年間 240 万円の売上差を作れる。
回収 6 ヶ月以内なら、ほぼ確実に黒字。

家具投資の ROI を計算しないオーナーさんは、無自覚に機会を逃してる。

うちの物件、家具投資で何が増収できそうか診断できます。
よかったら → https://sekaistay.com/go/t4

※ Airbnb 未掲載のオーナーも OK`;

const DRAFT_J4 = `保健所と毎月やり取りしてる立場から書きます。

民泊周りの法務、2026 年現在で押さえておきたいポイントを整理します。
現場感の話です。

---

まず、基本の前提:

- 民泊新法（住宅宿泊事業法）は 2018 年 6 月から運用されてる制度
- 年間 180 日の営業日数上限がある
- 2023 年 12 月に改正旅館業法が施行され、宿泊拒否事由の整理や差別禁止規定が入った

新法施行から 8 年経って、運用フェーズが安定してきた一方で、
自治体ごとの運用差が広がってる印象です。

---

現場で見ている主要な動きは 3 つ。

1️⃣ 「180 日上限」運用の自治体差が出ている

180 日上限は全国共通ですが、運用の厳しさは自治体によってかなり違います。
通報を受けてから動く自治体もあれば、定期的に現地確認に来る自治体もある。
都内 23 区では、通報ベースの確認が以前より増えてる、という肌感はあります。

2️⃣ 旅館業法・特区民泊への流入が増えている

180 日上限がボトルネックになるオーナーは、
簡易宿所（旅館業法）や特区民泊への切替を選ぶ流れが出てます。

特区民泊の認定エリアは限定的で、
大阪府・東京都大田区・福岡市・新潟市・北九州市・千葉市あたりが代表的。
京都市は特区民泊エリアではなく、旅館業法（簡易宿所）ベースで運用するオーナーが多いです。

3️⃣ 近隣対応・騒音対応の要件は厳しくなる方向

近隣からの通報に対する一次対応時間は条例で定められていますが、
自治体によってはこれを短縮する方向で議論が進んでいるという話も聞きます。

具体的な時間軸はまだ自治体ごとにバラバラなので、運営する地域の条例を確認するのが大事です。

---

オーナーが今、現場感で考えるべきこと:

- 自分の物件がある自治体の「条例での運用」を一度ちゃんと把握する
- 180 日上限を超えそうな物件は、旅館業法か特区民泊への切替を検討
- 切替には半年-1 年かかるから、年初から動き始めるのが正解
- 24 時間対応できる代行を選ばないと、近隣トラブルで指導が来た時の対応が遅れる

---

うちが実際にやってる現場対応:

- 24 時間電話 / LINE 対応（一次応答を自動化 → 社内エスカレーション）
- 騒音センサーを物件に設置（IoT 検知 → 近隣リスクをスコア化 → 即対応）
- 近隣トラブルの過去事例を AI に学習させて、対応提案を生成
- 旅館業法切替の手続きサポート（保健所提出書類のテンプレ整備）

---

要は、民泊運営の法務は自治体ごとに違うし、運用の厳しさも年々上がる方向です。

オーナー個人で全部キャッチアップするのは無理がある時代になってきました。
法務対応を「オーナーまかせ」にしてる代行は、トラブル時に動けません。

うちは保健所対応・旅館業法切替まで一気通貫でサポートしてます。
よかったら → https://sekaistay.com/go/j4

※ Airbnb 未掲載のオーナーも OK`;

const DRAFT_U6 = `「これがあって本当に救われた」

オーナーさんからこう言われたのが、嬉しかったんですよね。

オーナーポータルの話を書きます。

---

K さんという、3 物件持ちのオーナーさん。

先月、新しい物件の取得を検討してて、銀行から「既存 3 物件の過去 2 年分の収益データ」の提出を求められた。

提出までは 2 週間。
急ぎではないけど、楽な仕事でもないやつ。

---

オーナーさんが直面したのは、こういう作業でした。

毎月、代行会社からは月次レポートが届いている。
ただ、銀行が見たいのは「OTA 別」「月別」「物件別」の収益内訳。
月次レポートをそのまま渡しても、銀行のフォーマットには合わない。

- 3 物件分の月次レポートを 24 ヶ月分かき集める
- 代行会社が変わるとフォーマットも変わるので、Excel に転記して揃える
- 銀行が見たい粒度に組み直す
- 合計 72 シート分の集計

人力でやると数日かかる作業。
**毎月もらってる素材を銀行向けに整形し直す** ところに、オーナーは一番時間を取られます。

---

でも、うちのオーナーポータルには「収益データのカスタム出力」機能がある。

期間・OTA・物件・粒度（月次・週次・日次）を指定すると、
裏側で予約データを結合・整形して、PDF / Excel で出力。

「銀行融資申請用」「確定申告用」のテンプレもプリセットしてあるので、選ぶだけで使える。

K さんは、ポータルにログイン → 物件 3 件と過去 24 ヶ月を選ぶ → 「銀行融資申請用」テンプレでダウンロード。

5 分で終わりました。

「今までこれに半日かけてたのが、5 分で済んだ」

---

うちのオーナーポータルは「24 時間ダッシュボード」って機能として打ち出してるけど、
本当の価値は **「オーナーさんが代行業者に依頼しなくても、自分でやりたい粒度のデータが手に入る」** ことだと思ってます。

確定申告・融資申請・複数物件比較。
オーナーが投資家として動くタイミングで、データが必要になる場面は意外と多い。
そのたびに代行業者にお願いして待つ、というやり取りが消える。

ダッシュボードは「機能」じゃなくて「オーナーさんの自由度」です。

あなたの物件の収益、いつでも自分で出力できるダッシュボードがあります。
よかったら → https://sekaistay.com/go/u6

※ Airbnb 未掲載のオーナーも OK`;

const PIPELINE_ROWS = [
  ["T-1", "@tenichiliu", "業界トレンド",
    '"8%って、ボランティアでやってるんですか?" — 業界相場の半額で回せる構造を分解',
    "/switch", "2026-05-18 08:00", "Draft",
    "✨ 100物件以上 + バックオフィス AI 自動化を明示",
    DRAFT_T1],
  ["T-2", "@tenichiliu", "オーナー成功事例",
    '"なんでうちだけ稼働78%なんですか?" — 受賞振り返り・ニッチを攻める',
    "/switch/founder", "2026-05-21 08:00", "Draft",
    "サウナ × 民泊 / ポジショニング再設計 / +30%増収",
    DRAFT_T2],
  ["T-3", "@tenichiliu", "業界トレンド",
    '"今の代行、ちょっと変えたいんですよね" — 代行を変えるべき3つの兆候 + ベストタイミング',
    "/switch", "2026-05-19 08:00", "Draft",
    "民泊代行 / 乗り換えタイミング / 月次レポート / 価格設定",
    DRAFT_T3],
  ["T-4", "@tenichiliu", "民泊家具・アメニティ",
    '"20万円の家具をケチって、100万円逃してます" — 家具投資ROIフレーム',
    "/switch/portal", "2026-05-20 08:00", "Draft",
    "家具投資ROI / シンボル家具 vs コスパ / 造作家具 / プロジェクター",
    DRAFT_T4],
  ["J-4", "@jirosan", "法務制度",
    "2026 年 民泊新法 周辺で何が変わるか（保健所と毎月やり取りしてる現場感）",
    "/switch", "2026-05-23 12:00", "Draft",
    "民泊新法 / 保健所対応 / 騒音問題 / 旅館業法切替",
    DRAFT_J4],
  ["U-6", "@ss_unei_chan", "オーナー成功事例",
    '"これがあって本当に救われた" — オーナーポータルが救った深夜0時の融資資料',
    "/switch/portal", "2026-05-24 19:00", "Draft",
    "オーナーポータル / 24時間ダッシュボード / 収益エクスポート",
    DRAFT_U6],
];

async function main() {
  const sheets = getSheets(ACCOUNT);

  await sheets.spreadsheets.values.clear({
    spreadsheetId: SPREADSHEET_ID,
    range: "'X Pipeline'!A1:Z200",
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: "'X Pipeline'!A1",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [PIPELINE_HEADER, ...PIPELINE_ROWS] },
  });

  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const pipelineSheet = meta.data.sheets.find(s => s.properties.title === "X Pipeline" || s.properties.title === "Pipeline");
  const pipelineSheetId = pipelineSheet.properties.sheetId;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        // 列幅 (9 列): ID 60, Account 120, Pillar 140, Topic 340, LP 120, Date 130, Status 80, Notes 240, Draft 750
        { updateDimensionProperties: { range: { sheetId: pipelineSheetId, dimension: "COLUMNS", startIndex: 0, endIndex: 1 }, properties: { pixelSize: 60 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: pipelineSheetId, dimension: "COLUMNS", startIndex: 1, endIndex: 2 }, properties: { pixelSize: 120 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: pipelineSheetId, dimension: "COLUMNS", startIndex: 2, endIndex: 3 }, properties: { pixelSize: 140 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: pipelineSheetId, dimension: "COLUMNS", startIndex: 3, endIndex: 4 }, properties: { pixelSize: 340 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: pipelineSheetId, dimension: "COLUMNS", startIndex: 4, endIndex: 5 }, properties: { pixelSize: 120 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: pipelineSheetId, dimension: "COLUMNS", startIndex: 5, endIndex: 6 }, properties: { pixelSize: 130 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: pipelineSheetId, dimension: "COLUMNS", startIndex: 6, endIndex: 7 }, properties: { pixelSize: 80 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: pipelineSheetId, dimension: "COLUMNS", startIndex: 7, endIndex: 8 }, properties: { pixelSize: 240 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: pipelineSheetId, dimension: "COLUMNS", startIndex: 8, endIndex: 9 }, properties: { pixelSize: 750 }, fields: "pixelSize" } },
        // 行高
        { updateDimensionProperties: { range: { sheetId: pipelineSheetId, dimension: "ROWS", startIndex: 1, endIndex: PIPELINE_ROWS.length + 1 }, properties: { pixelSize: 360 }, fields: "pixelSize" } },
        // wrap (Notes + Full Draft)
        {
          repeatCell: {
            range: { sheetId: pipelineSheetId, startRowIndex: 1, endRowIndex: 200, startColumnIndex: 7, endColumnIndex: 9 },
            cell: { userEnteredFormat: { wrapStrategy: "WRAP", verticalAlignment: "TOP", textFormat: { fontSize: 9 } } },
            fields: "userEnteredFormat(wrapStrategy,verticalAlignment,textFormat)",
          },
        },
        // ヘッダー (青系)
        {
          repeatCell: {
            range: { sheetId: pipelineSheetId, startRowIndex: 0, endRowIndex: 1 },
            cell: { userEnteredFormat: { textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } }, backgroundColor: { red: 0.25, green: 0.45, blue: 0.7 }, horizontalAlignment: "CENTER" } },
            fields: "userEnteredFormat(textFormat,backgroundColor,horizontalAlignment)",
          },
        },
        // 凍結
        {
          updateSheetProperties: {
            properties: { sheetId: pipelineSheetId, gridProperties: { frozenRowCount: 1, frozenColumnCount: 1 } },
            fields: "gridProperties.frozenRowCount,gridProperties.frozenColumnCount",
          },
        },
      ],
    },
  });

  console.log(`\n✅ X Pipeline v11 反映: ${PIPELINE_ROWS.length} 行 (通常運用のみ・LAUNCH/deferred は別タブ)`);
  console.log(`📊 https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit#gid=${pipelineSheetId}`);
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  console.error(err);
  process.exit(1);
});
