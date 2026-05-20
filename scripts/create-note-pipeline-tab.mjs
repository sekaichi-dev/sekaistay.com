#!/usr/bin/env node
// SEKAI STAY note Pipeline タブを生成 (X Pipeline とは別管理)
// Sheet: 19qsHLdmIex59mj-xABMbF4jCatHoy6SN7LE8x4EzWVY
//
// v4 (2026-05-18): N-3 を鎌倉プール付き物件 (2020) → 箱根 2 軒目 (2026) の実話に差し替え
//   - サウナ京都ストーリーから、観光地で 1 軒目に新しい設備を入れる戦略の話へ
//   - インバウンド + グループ利用層への差別化、5 年運用後に箱根に同パターン展開
//
// v3 (2026-05-18): 固有名詞（スーパーホスト等）の注記は不要に
//   - スーパーホスト・Airbnb・Booking.com など固有名詞はそのまま使う
//   - 一般用語化されたカタカナ語（再ポジショニング・リスティング等）のみ日本語化
//
// v2 (2026-05-18): 地方のおじさん向けに用語を日本語化
//   - 「再ポジショニング」→「見せ方を変える」「打ち出し方を変える」
//   - 「ADR」→「平均宿泊単価」(必要なら括弧で原語注記)
//   - 「ダイナミックプライシング」→「需要に応じた日々の価格調整」
//   - 「P/L」→「損益(売上とコスト)」
//   - 「M&A」→「企業の買収・合併」
//   - 横文字を最小限・必要なら必ず日本語注記
//
// v1 (2026-05-18 初版): note 戦略 (X とは別軸の AI 言及ゼロ経営者論考)

import { getSheets } from "../../../shared/google-auth/index.js";

const SPREADSHEET_ID = "19qsHLdmIex59mj-xABMbF4jCatHoy6SN7LE8x4EzWVY";
const ACCOUNT = "sekaichi";

const PIPELINE_HEADER = [
  "ID", "Type", "Pillar", "Title", "LP送客先",
  "Publish Date", "Status",
  "字数", "Notes",
  "📝 Full Draft Content",
];

const DRAFT_N1 = `# 民泊代行を 8% でやろうと決めた日

民泊代行という事業を始めるとき、業界の平均的な手数料は 15-25% でした。
それを 8% でやると決めた日のことを、書いておこうと思います。

## 1. 「相場」を疑うところから始まった

民泊代行業界を調べていた時、ほとんどの会社が手数料 15-25% で見積もりを出していました。

オーナーさんに「これは高くないですか?」と聞くと、多くの方が「他社も同じだから仕方ない」と言う。

でも、なぜそうなっているかを、誰もちゃんと説明していなかったんですよ。

業界全体で「相場はこうだから」を続けてきた結果、手数料が高止まりしている。
そう感じました。

## 2. コストの中身を、ゼロから見直す

民泊代行のコストは、大きく分けると 4 つあります。

- 価格の管理（毎日の値付けの調整）
- お客さん対応（チェックイン前後やトラブル時の連絡）
- 清掃・シーツや布団のリネン交換
- 経理や売上管理などの裏側業務

業界の平均的な手数料 20% の代行会社は、これらをすべて「人が物件に張り付く」前提で組んでいる。

そうすると、1 人の担当者が見られる物件は多くて数十件程度になる。
だから 1 物件あたりの人件費が高くなって、手数料を下げられない。

ここを根本から見直す必要があると思いました。

## 3. 「1 人で 100 物件」を成り立たせる仕組み

うちが取った方針は、運営の仕組みを根本から組み直すことでした。

価格は毎日、全物件について調整する。
お客さん対応は、よくある問い合わせの一次対応を標準化して、人が判断すべきものに集中する。
清掃は信頼できる地元の業者さんと長期で組む。
経理や裏側業務は、人によってやり方が違わないように仕組みで回す。

これで、1 人の担当者が 100 物件以上を見られる構造になった。

業界の平均的な代行と比べると、2 倍以上の効率です。

## 4. 8% でも、品質を上げられる確信があった

「手数料を下げる = 品質が下がる」と言われることがあります。

でも実際は、逆だと思っています。

担当者まかせの運営は、人によって品質がばらつく。
仕組みで回すと、どの物件でも品質が安定する。

スーパーホストとして 5 年やってきた経験を、
担当者まかせにせずに仕組みとして組み直す。
これがうちの民泊代行の本質です。

## 5. これからのこと

民泊代行という業態は、これから 5 年で構造が変わっていくと思っています。

人が物件に張り付くやり方から、仕組みで回すやり方へ。
手数料 15-25% から、もっと適正な水準へ。

そういう変化の起点になりたいと思って、8% で始めました。

業界の常識を、ちゃんと変えていきたいと思います。

---

ここまで読んでいただいてありがとうございました。

もしご自身の物件で「今いくら稼げる物件か」気になる方は、
60 秒で簡易診断ができます → https://sekaistay.com/go/n1`;

const DRAFT_N2 = `# 民泊代行の中身を、お金の流れから見直す

民泊代行という業態は、なぜ手数料が下がらないのか。
業界の中にいる人間として、整理しておきたいと思います。

## 1. 民泊代行のお金の流れ

民泊代行業の売上は、宿泊代金に対する手数料です。
業界の平均的な水準は 15-25%、つまり宿泊代金 100 万円の物件で、代行会社の売上は 15-25 万円。

このうち、代行会社が抱えるコストは大きく 5 つに分かれます。

- 価格の管理・予約の管理に関わる人件費
- お客さん対応の人件費（24 時間体制）
- 清掃・リネン（シーツや布団）にかかる費用
- 経理・税務・行政への申請対応などの裏側業務
- マーケティング（集客・宣伝）と営業

このうち、清掃・リネンはオーナーさんが別建てで負担することが多いので、
実際に代行会社が抱えているのは **人件費 + 裏側業務 + 集客** です。

## 2. 「人件費」が手数料を縛っている

業界の代行会社の運営を見ると、ほとんどが「1 人が見られる物件数」で縛られています。

具体的には、頑張っている会社でも 1 人あたり多くて数十件程度。
価格の調整、予約の確認、お客さん対応をすべて手作業で回すと、これ以上は物理的に難しい。

逆算してみます。

- 都内の 1 棟貸し物件の月の売上: 60-100 万円
- 手数料 20% でも代行会社の売上は: 月 12-20 万円 / 物件
- 担当者 1 人で 50 物件を見ると: 月 600-1,000 万円分の売上を 1 人で持つ
- 担当者の人件費や諸経費を引くと、利益は意外と薄い

つまり業界の平均的な 20% という手数料は、**人が物件に張り付くやり方を維持するために必要な水準** なんです。
ここを下げると、人力モデルの会社は赤字になる。

## 3. やり方を変えると、何が起きるか

ここからが本題です。

民泊運用の業務を分けると、**毎日繰り返す決まった業務** と **判断が要る非定型な業務** に分かれます。

決まった業務（毎日の価格の調整、予約確認、レポート集計、経費の仕分け）は、仕組みで回せる。
判断が要る業務（クレーム対応、複雑な交渉、戦略判断）は、人が必要。

業界の代行会社の多くは、両方を「人」でやっている。
だから 1 人あたりの担当物件数が伸びない。

ここを切り分けて、決まった業務は仕組みに、判断が要る業務に人を集中させると、1 人で見られる物件数が一気に増える。
うちの構造では、1 人で 100 物件以上を見られる設計になっています。

業界の平均的な代行会社と比べて、2 倍以上の効率です。

## 4. 8% は、やり方が変われば成立する

ここまでの整理を前提に、手数料 8% を逆算してみます。

宿泊代金 100 万円の物件で、代行会社の売上は 8 万円。
1 人で 100 物件を見られれば、月の売上 800 万円分を 1 人で持てる。

担当者の人件費を業界水準で見積もっても、十分に利益が出る構造になります。

つまり 8% は、運営のやり方を変えることで成立する価格です。
業界の平均的な手数料 20% の半額以下に見えますが、ちゃんと回ります。

## 5. 競合と何が違うか

「他社もツールを入れているじゃないか」という指摘があるかもしれません。

そのとおりで、業界の他社も部分的にツールを入れています。
ただ、それは今までの人力のやり方に「ツールを足す」設計で、
1 人あたりの担当物件数を 2 倍にする発想にはなっていない。

うちは逆で、**仕組みを前提に運営の流れを全部組み直した**。
だから 1 人 100 物件以上が成立して、8% という価格が出せる。

## 6. これからの民泊代行業

民泊代行という業態は、これから「仕組み型」と「人力型」に分かれていくと思います。

人力型は手数料 15-25% を維持しつつ、丁寧な対応で差別化する。
仕組み型は手数料を下げて、扱う物件数を増やす。

オーナーさんは、どちらが自分に合っているかを選ぶ時代になる。
そういう業界の変化の起点になりたいと思っています。

---

ここまで読んでいただいてありがとうございました。

もしご自身の物件の代行手数料が「業界相場のままで本当に妥当か」気になる方は、
60 秒で簡易診断ができます → https://sekaistay.com/go/n2`;

const DRAFT_N3 = `# 鎌倉でプール付き 1 棟貸しを作ったら、平均宿泊単価が 2 倍になった話

ある鎌倉の 1 棟貸し物件で、平均宿泊単価（1 泊あたりの平均価格）が 2 倍になった話を書きます。

派手な改装をしたわけではありません。
やったのは、**観光地で誰もやっていなかったことを 1 軒目にやっただけ** です。

## 1. 2020 年、鎌倉で物件を引き受けたとき

その物件は、鎌倉市内の築 20 年の戸建てでした。
オーナーの K さん（仮名）が 2019 年に取得して、最初の 1 年は別の代行会社で運用していました。

スペックは悪くなかった。

- 立地: 鎌倉駅から車で 10 分・海まで徒歩圏
- 広さ: 120 平米、大人 6 人 + 子供 2 人まで対応
- 設備: 庭付き、駐車場 2 台、戸建てなので 1 棟独立

稼働率（部屋が埋まる割合）は月 60-70%。
1 泊あたりの平均単価は ¥28,000 でした。

K さんからは「もう少し伸ばせる余地があるはず」とよく相談を受けていました。
ただ、2020 年の春に新型コロナが来て、観光地の民泊はどこも稼働がガクッと落ちる時期に入っていました。

## 2. 「鎌倉で観光客の取り合いをしても勝てない」見立て

鎌倉駅周辺の 1 棟貸し物件を 30 件ほど並べて見たとき、気づいたことがありました。

ほとんどの物件が「鎌倉観光に来る人」をお客さんに想定して、価格と見せ方を組んでいる。
つまり、**全物件がほぼ同じ層を取り合っている** 状態だったんです。

そうすると、立地が駅近の物件が強くて、それ以外は価格を下げて稼働を取りに行くしかなくなる。
K さんの物件は駅近ではないので、その消耗戦に巻き込まれていた。

ここで考えたのは、「観光客向けで勝てないなら、別のお客さんを取りに行けないか」ということでした。

## 3. 「プール付きの物件が、鎌倉エリアに 1 軒もなかった」

物件の特徴を改めて見直しました。

- 戸建てで隣家との距離がある
- 庭が広く、改装の自由度がある
- 駐車場 2 台で、グループ利用に向いている
- 6-8 人が泊まれる広さがある

ここから出てきた仮説は、「グループで来てワイワイ過ごしたい人」と「特別な体験を求める訪日外国人」をお客さんにする、ということでした。

そして、当時の鎌倉エリアの 1 棟貸しを全部調べてみると、**プール付きの物件が 1 軒もなかった** んです。

葉山や逗子の高級別荘では見たことがあるけど、鎌倉エリアの民泊で予約できるプール付き 1 棟貸しはゼロ。
ここに勝機があると思いました。

## 4. やったこと

K さんと相談して、庭にコンパクトな屋外プールを設置することにしました。

- 通年で温水稼働できる設計（冬は温泉気分でも入れる）
- 子供も大人も使える深さ
- 設置・配管工事込みで初期費用は数百万円

物件名は「鎌倉プール付き 1 棟貸し別荘」に変更。
写真は夏の家族 4 人がプールで遊んでいるイメージで撮り直し。
Airbnb と Booking.com の物件ページを書き直して、グループ利用と訪日外国人を意識した説明文に切り替えました。

## 5. ¥28,000 → ¥62,000 になった

リニューアル公開から半年で、数字はこうなりました。

- 1 泊あたりの平均単価: ¥28,000 → ¥62,000 (約 2.2 倍)
- 稼働率: 65% → 78% (上昇)
- 月の売上: 約 2.5 倍

稼働率も単価も両方上がったのは、お客さんの層が変わって、競合との取り合いから抜けたからです。

2020 年は国内の家族・グループ利用が中心。
2023 年以降は訪日外国人の予約が増えて、円安効果も乗って 1 泊 ¥70,000-80,000 の予約も入るようになりました。

K さんからは「同じ土地・同じ建物なのに、こんなに変わるとは思わなかった」と言ってもらっています。

## 6. なぜこの変化が起きたか

これは、「観光地で全員と同じ土俵に乗らない」というシンプルな話だと思います。

民泊運用でよくあるのは、**全物件を「その土地の観光客向け」で運用してしまうこと** です。

立地が良い物件はそれで勝てるけど、立地で勝てない物件は、単価が頭打ちになる。
そのまま「稼働率を上げる」方向に走ると、価格を下げざるを得なくなり、収益はさらに下がる。

ここで効くのが、**そのエリアでまだ誰もやっていない打ち出し方を、最初にやる判断** でした。

これは私見ですが、観光地ほど物件が均質化していて、
1 軒目に何か特徴ある設備を入れた物件は、長く優位性を保てる、というのが 5 年運用してきた印象です。

## 7. そして 2026 年、箱根に 2 軒目をオープン

鎌倉の物件が安定して回り出して、5 年が経った今年、
K さんは **箱根にも同じプール付き 1 棟貸し物件を 1 軒オープン** させました。

鎌倉で得た学びを、ほぼそのまま箱根に持っていく形です。

- 観光地で、まだプール付き 1 棟貸しが少ないエリアを選ぶ
- 戸建てで、グループ利用と訪日外国人を狙う
- 通年稼働できる温水プール

箱根の物件は今 4 月にオープンしたばかりですが、ゴールデンウィークの予約は 1 泊 ¥80,000 台で埋まりました。

「同じパターンを別の土地でやれば再現できる」というのが、5 年運用してきた中で K さんが得た一番の確信だと思います。

## 8. これからのこと

物件の打ち出し方は、「立地」「広さ」「価格」だけじゃない。
**「そのエリアで、まだ誰もやっていないこと」** を 1 軒目にやる判断ができるかどうかで、収益は大きく変わる。

うちでは、こういう物件単位の見直しを、運営の一部として組み込んでいます。
1 物件ずつ、丁寧に。

K さんの鎌倉と箱根の物件は今もうちで運用していて、毎月安定して伸びています。

---

ここまで読んでいただいてありがとうございました。

もしご自身の物件で「もっと単価を伸ばせる気がする」と感じている方は、
60 秒で簡易診断ができます → https://sekaistay.com/go/n3`;

const PIPELINE_ROWS = [
  ["N-1", "A. 経営者自己開示", "業界トレンド",
    "民泊代行を 8% でやろうと決めた日",
    "/switch", "2026-05-19 09:00", "Draft",
    "約 1,800 字",
    "けんすう note 寄り・落ち着いた自己開示・AI 言及ゼロ",
    DRAFT_N1],
  ["N-2", "B. 業界構造分析", "業界トレンド",
    "民泊代行の中身を、お金の流れから見直す",
    "/switch", "2026-05-21 09:00", "Draft",
    "約 2,200 字",
    "経営学的フレームで業界を分解・横文字最小化",
    DRAFT_N2],
  ["N-3", "C. オーナー成功物語", "オーナー成功事例",
    "鎌倉でプール付き 1 棟貸しを作ったら、平均宿泊単価が 2 倍になった話",
    "/switch/founder", "2026-05-23 09:00", "Draft",
    "約 2,500 字",
    "鎌倉プール付き物件 (2020) → 5 年運用 → 2026 箱根 2 軒目オープンの実話",
    DRAFT_N3],
];

async function main() {
  const sheets = getSheets(ACCOUNT);

  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const existing = meta.data.sheets.find(s => s.properties.title === "note Pipeline");

  let noteSheetId;
  if (existing) {
    noteSheetId = existing.properties.sheetId;
    console.log("ℹ️  note Pipeline タブは既存 — 既存の内容をクリアして上書き");
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: "'note Pipeline'!A1:Z200",
    });
  } else {
    const addResp = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          { addSheet: { properties: { title: "note Pipeline" } } },
        ],
      },
    });
    noteSheetId = addResp.data.replies[0].addSheet.properties.sheetId;
    console.log("✅ note Pipeline タブを新規作成");
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: "'note Pipeline'!A1",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [PIPELINE_HEADER, ...PIPELINE_ROWS] },
  });

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        // 列幅 (10 列): ID 60, Type 140, Pillar 140, Title 340, LP 120, Date 130, Status 80, 字数 90, Notes 240, Draft 750
        { updateDimensionProperties: { range: { sheetId: noteSheetId, dimension: "COLUMNS", startIndex: 0, endIndex: 1 }, properties: { pixelSize: 60 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: noteSheetId, dimension: "COLUMNS", startIndex: 1, endIndex: 2 }, properties: { pixelSize: 140 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: noteSheetId, dimension: "COLUMNS", startIndex: 2, endIndex: 3 }, properties: { pixelSize: 140 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: noteSheetId, dimension: "COLUMNS", startIndex: 3, endIndex: 4 }, properties: { pixelSize: 340 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: noteSheetId, dimension: "COLUMNS", startIndex: 4, endIndex: 5 }, properties: { pixelSize: 120 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: noteSheetId, dimension: "COLUMNS", startIndex: 5, endIndex: 6 }, properties: { pixelSize: 130 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: noteSheetId, dimension: "COLUMNS", startIndex: 6, endIndex: 7 }, properties: { pixelSize: 80 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: noteSheetId, dimension: "COLUMNS", startIndex: 7, endIndex: 8 }, properties: { pixelSize: 90 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: noteSheetId, dimension: "COLUMNS", startIndex: 8, endIndex: 9 }, properties: { pixelSize: 240 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: noteSheetId, dimension: "COLUMNS", startIndex: 9, endIndex: 10 }, properties: { pixelSize: 750 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: noteSheetId, dimension: "ROWS", startIndex: 1, endIndex: 4 }, properties: { pixelSize: 480 }, fields: "pixelSize" } },
        // wrap (Notes + Full Draft)
        {
          repeatCell: {
            range: { sheetId: noteSheetId, startRowIndex: 1, endRowIndex: 200, startColumnIndex: 8, endColumnIndex: 10 },
            cell: { userEnteredFormat: { wrapStrategy: "WRAP", verticalAlignment: "TOP", textFormat: { fontSize: 9 } } },
            fields: "userEnteredFormat(wrapStrategy,verticalAlignment,textFormat)",
          },
        },
        {
          repeatCell: {
            range: { sheetId: noteSheetId, startRowIndex: 0, endRowIndex: 1 },
            cell: { userEnteredFormat: { textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } }, backgroundColor: { red: 0.55, green: 0.45, blue: 0.7 }, horizontalAlignment: "CENTER" } },
            fields: "userEnteredFormat(textFormat,backgroundColor,horizontalAlignment)",
          },
        },
        {
          updateSheetProperties: {
            properties: { sheetId: noteSheetId, gridProperties: { frozenRowCount: 1, frozenColumnCount: 1 } },
            fields: "gridProperties.frozenRowCount,gridProperties.frozenColumnCount",
          },
        },
      ],
    },
  });

  console.log(`\n✅ note Pipeline v2 反映: ${PIPELINE_ROWS.length} 行 (地方のおじさん向け表現に書き直し)`);
  console.log(`📊 https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit#gid=${noteSheetId}`);
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  console.error(err);
  process.exit(1);
});
