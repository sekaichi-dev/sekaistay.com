#!/usr/bin/env node
// SEKAI STAY ローンチ用 Launch Channels タブ生成
// Sheet: 19qsHLdmIex59mj-xABMbF4jCatHoy6SN7LE8x4EzWVY
//
// 設計方針 (2026-05-19):
//   - PR TIMES 配信日 = 6/1 (memory: pr_times_distribution_date)
//   - 配信日に全チャネル砲火 (LinkedIn/Facebook/自社HP同期)
//   - テンイチ・ジロー 2 名で SNS 投稿 (memory: pr_times_strategy)
//
// 投入内容:
//   - PR_TIMES: プレスリリース本体
//   - FB_T (テンイチ FB): 経営者ローンチ報告・自己開示型
//   - FB_J (ジロー FB): 現場視点・パートナーシップ訴求

import { getSheets } from "../../../shared/google-auth/index.js";

const SPREADSHEET_ID = "19qsHLdmIex59mj-xABMbF4jCatHoy6SN7LE8x4EzWVY";
const ACCOUNT = "sekaichi";

const HEADER = [
  "ID", "Channel", "Account", "Publish Date", "Title",
  "Status", "Notes",
  "📝 Full Draft Content",
];

const PR_TIMES_BODY = `【プレスリリース】

業界相場の半額となる手数料 8% の民泊運用代行「SEKAI STAY」本格ローンチ
〜仕組みを前提に運営構造を見直し、1 人で 100 物件以上を見られる体制で全国展開〜

株式会社セカイチ（本社：東京都、代表取締役：劉添毅、以下「セカイチ」）は、業界相場の半額となる手数料 8% の民泊運用代行サービス「SEKAI STAY」を、2026 年 6 月 1 日より本格ローンチいたします。Airbnb スーパーホスト認定の運営者を中心としたチームと、仕組みを前提に再設計したオペレーション構造を組み合わせ、オーナーに透明性の高い運営を提供します。

■ 背景：業界相場 15-25% という構造課題

日本の民泊運用代行業界は、依然として手数料 15-25% が一般的とされています。これは、運営を「人が物件に張り付く」前提で設計してきた業界構造に起因しており、1 人の担当者が見られる物件数が数十件程度に制限され、人件費比率が高止まりしているためです。

その結果、オーナーは「何にお金が消えているのか分からない」「ダイナミックプライシングが日次で動いていない」「月次レポートが数字の羅列で終わっている」といった不満を抱えながら、契約更新時の選択肢が乏しい状態に置かれてきました。

■ SEKAI STAY のアプローチ：仕組みを前提とした運営構造の再設計

セカイチは、運営フローを「毎日繰り返す定型業務」と「判断が必要な非定型業務」に切り分け、定型業務を仕組み化することで、1 人で 100 物件以上を見られる体制を構築しました。

- 価格管理：全物件を日次でチューニング
- カスタマー対応：一次対応の標準化 + 社内エスカレーション体制
- 清掃：信頼パートナーと長期契約・スケジュール配信を自動化
- バックオフィス：Web マーケ出稿・経理などを自動化

この構造により、業界相場の半額となる手数料 8% でも黒字運営が成立し、かつ Airbnb スーパーホストとして 5 年積み重ねてきた運営品質を仕組みとして再現可能にしました。

■ 主な特徴

1. 手数料 8%（業界相場 15-25% の半額以下）
2. オーナーポータルで稼働率・収益・レビュー・清掃状況を 24 時間可視化
3. 月次レポートは数字の羅列ではなく、解釈と打ち手をセットで提供
4. 国土交通大臣登録・Airbnb スーパーホスト認定の運営者を中心としたチーム
5. 全国 7 拠点で対応

■ 代表コメント

「民泊運用代行業界の手数料 15-25% は、人力で物件を回す前提のコストです。業務を分解して、定型と非定型を切り分け、定型を仕組みに任せれば、1 人で見られる物件数は 2 倍以上になります。SEKAI STAY は、そうやって構造から見直した代行サービスです。手数料を下げるだけでなく、運営の透明性も同時に上げることで、業界の常識を変えていきたいと考えています。」（代表取締役 劉添毅）

■ 会社概要

会社名：株式会社セカイチ
代表者：代表取締役 劉添毅
所在地：東京都
事業内容：民泊運用代行（SEKAI STAY）、宿泊施設運営、不動産関連サービス
公式サイト：https://sekaistay.com

■ お問い合わせ

サービスサイト：https://sekaistay.com/switch
60 秒の無料診断（物件情報なしで OK）：https://sekaistay.com/go/pr

【本プレスリリースに関するお問い合わせ】
株式会社セカイチ 広報担当
Email: press@sekaichi.org`;

const FB_T_BODY = `民泊運用代行「SEKAI STAY」を、本日 6 月 1 日に本格ローンチします。

業界相場 15-25% という手数料を、ずっと疑ってきました。
オーナーさんから「毎月払ってるけど、何に消えてるか分からない」と言われ続けてきて、業界の中にいる側として、申し開きがなかった。

それを 8% でやると決めた日のことを、たまに思い出します。
今日はそのサービスの正式ローンチの日です。

何をやってきたか、簡単に書いておきます。

業界相場 20% は、運営を「人が物件に張り付く」前提のコスト構造です。
1 人の担当者が見られる物件は、頑張っている会社でも数十件程度。だから手数料を下げられない。

うちは、AI を前提に運営構造を全部組み直しました。

- 価格管理は日次で自動チューニング
- カスタマー対応は一次自動化 + 社内エスカレーション
- 清掃は信頼パートナーと長期契約、スケジュール配信は自動
- Web マーケ出稿・経理などのバックオフィス業務は自動化

これで 1 人で 100 物件以上を見られる体制になりました。
業界の代行と比べると、2 倍以上の効率です。

その上で、Airbnb スーパーホストとして 5 年積み上げてきた運営品質を、属人化させずに仕組みに落とし込む。
これが SEKAI STAY の本質です。

「手数料を下げる = 品質が下がる」と言われることが多いですが、実際は逆だと思っています。
担当者まかせの運営は人によってばらつくけど、仕組みで回せば品質は均質化する。

業界の常識を、ちゃんと変えていきたいと思っています。

オーナーさん向けに、60 秒の無料診断（物件情報の入力なしで OK）を用意しています。
気になる方は → https://sekaistay.com/go/fbt

応援していただける方は、シェアしていただけると嬉しいです。
SEKAI STAY 代表 劉添毅`;

const FB_J_BODY = `民泊運用代行「SEKAI STAY」が本日 6 月 1 日にローンチしました。

現場側を担当しているジロー（@jirosan）です。
オーナーさんとの一次接点・物件の運営設計をやっている人間として、現場視点から書いておきます。

僕がこのサービスでやろうとしているのは、3 つだけです。

1. 価格を「毎日」動かす運営
2. 月次レポートに「解釈」と「打ち手」を必ず入れる運営
3. トラブル対応で「報告」だけで終わらせない運営

業界の代行を見ていると、ここが抜けてる会社が本当に多い。
ダイナミックプライシングを 3 ヶ月放置してたり、月次レポートが数字の羅列で終わっていたり、トラブル対応が「こうなりました」の連絡だけで終わっていたり。

僕は、オーナーさんが「数字を出す人」ではなくて「数字を動かす人」を選ぶべきだと思っています。

代表の劉と、AI を前提に運営構造を組み直す方針で 1 年以上やってきました。
1 人で 100 物件以上を見られる体制になって、手数料 8% でも黒字で回せる構造になっています。

ここからは、もっと多くのオーナーさんと一緒に、業界の常識を変えていきたいと思います。

特に、こんな方に届けばと思っています。
- 今の代行に何か違和感があるけど、変えるべきか迷っている方
- 月次レポートが数字の羅列で「何のために払っているか」見えなくなっている方
- 価格を 3 ヶ月以上動かしてもらっていない方

60 秒の無料診断（物件情報の入力なしで OK）はこちらから。
→ https://sekaistay.com/go/fbj

オーナーさんからの紹介・パートナー連携も歓迎です。お気軽にメッセージください。`;

const X_T_LAUNCH_BODY = `「民泊代行は高すぎる、品質も読めない」

業界でよく言われること。

今日、SEKAI STAY を世に正式に発表します。

業界相場の半額・手数料 8%。それでもスーパーホストの運営力が生きてくる構造を作りたくて、立ち上げました。

---

民泊代行の手数料相場は 15-25%。

これを「人が物件に張り付く」運営構造のコストだと考えてる。

僕たちは、AI で効率化する前提で運営構造を全部見直しました。

- 価格管理は日次で自動チューニング（人力では追いつかない速度）
- カスタマー対応は一次自動化 + 社内エスカレーション（属人化を排除）
- 清掃は信頼パートナーと長期契約・スケジュール配信は自動（バラ売りしない）
- Web マーケ出稿・経理などのバックオフィス業務は自動化（外注しない）

これで 1 人で 100 物件以上を見られるようになりました。
業界の 2 倍以上の効率です。

仕組みを真ん中に置いた事業構造だから、8% でもスーパーホストの運営力が生きてくる。

---

ここまでの実証:

- BEST OF SAUNA STAY 2026 受賞（THE LAKE HOUSE 野尻湖）
- 他社からの乗り換えオーナーで +30% 増収多数
- 全国主要エリアで運営中

数字は嘘をつかない。

---

僕たちが向き合いたいのは、こんなオーナーさんです:

- 今の代行に手数料を払いすぎてると感じてる
- 数字が見えない運営にモヤモヤしてる
- もっと稼働を上げたいけど時間がない
- これから民泊を始めたいけど、何から手をつければいいか分からない

1 つでも当てはまったら、よかったら相談してください。

---

民泊運用代行を、もっと透明に、もっと公平に。

業界の常識を変えていきます。

詳細はプレスリリースに書きました → [PR TIMES Link]

うちの物件、いくら損してるか診断できます。
よかったら → https://sekaistay.com/go/xlt

※ Airbnb 未掲載のオーナーも OK`;

const X_J_LAUNCH_BODY = `今日、SEKAI STAY を正式発表します。

僕は現場で運営代行をやってる立場。
（テンイチは経営の話、僕は現場の話を書きます）

「8%」って聞くと、「安すぎる、品質落ちる」って思いますよね。
僕も最初そう思いました。

---

だからチームに入る前に、めちゃくちゃ中を見たんです。

実際に見て納得したポイント、3 つあります。

---

1️⃣ AI に毎日価格を触らせてる

Pricelabs（AI 価格自動化）+ DP API で、毎日全物件の価格が自動更新。
月 1 で人が設定して放置する代行とは、稼働率も ADR も別物です。

同エリア相場の 1.3-1.6 倍の稼働を出してる物件が複数。

---

2️⃣ オーナーポータルで「数字が見える運営」が標準

オーナーさんがいつでも収益・稼働・レビューを自分で確認できる。
代行と毎月メールでやり取りする必要がない。

融資・確定申告・複数物件管理で、これが効くんですよ。

---

3️⃣ 24 時間対応の体制が組まれてる

清掃・カスタマー対応を完全に外注に丸投げしてる代行が多いんですが、
うちは一次対応を自動化 + 信頼パートナーの長期契約 + 社内エスカレーション。

保健所対応・近隣トラブルも 24 時間社内で動けます。

---

僕が SEKAI STAY に入ったのは、こういう「AI 中心で真剣に作ってある代行」をオーナーさんに届けたかったから。

業界のほとんどが「人力 × 高手数料」モデルで止まってる中で、
「仕組み化 × 業界半額」を成立させてる稀有な構造です。

今日からは僕も、現場で見えてきたことをここで発信していきます。
よろしくお願いします。

詳細はプレスリリース → [PR TIMES Link]

うちの物件、いくら損してるか診断 →
https://sekaistay.com/go/xlj

※ Airbnb 未掲載のオーナーも OK`;

const ROWS = [
  ["PR_TIMES", "PR TIMES", "株式会社セカイチ", "2026-06-01 10:00",
    "業界相場の半額となる手数料 8% の民泊運用代行「SEKAI STAY」本格ローンチ",
    "Draft",
    "🔴 配信前: タイトル・本文・画像 (3-5 枚) 確定要 | カテゴリ: サービス・住宅/不動産",
    PR_TIMES_BODY],
  ["X_T_LAUNCH", "X (Twitter)", "@tenichiliu (テンイチ)", "2026-06-01 10:30",
    "X 長文B: SEKAI STAY 正式発表 (経営者ビジョン軸・業界構造変革訴求)",
    "Draft",
    "🟢 PR TIMES 配信 30 分後に投稿 | 100 物件以上 + AI 自動化 | 🔴 [PR TIMES Link] に挿入要",
    X_T_LAUNCH_BODY],
  ["X_J_LAUNCH", "X (Twitter)", "@jirosan (ジロー)", "2026-06-01 11:00",
    "X 長文B: SEKAI STAY 正式発表 (現場視点・3 つの実証ポイント)",
    "Draft",
    "🟢 PR TIMES 配信 1h 後に投稿 | AI 価格・ポータル・24h 対応 | 🔴 [PR TIMES Link] に挿入要 | ジロー初投稿",
    X_J_LAUNCH_BODY],
  ["FB_T", "Facebook", "@tenichiliu (テンイチ)", "2026-06-01 11:30",
    "FB: SEKAI STAY 本格ローンチ報告 (経営者ストーリー型)",
    "Draft",
    "🟢 PR TIMES 配信 1.5h 後 | 構造変革の意思決定の話 | 画像: テンイチ単独 + サービスカード",
    FB_T_BODY],
  ["FB_J", "Facebook", "@jirosan (ジロー)", "2026-06-01 12:00",
    "FB: SEKAI STAY ローンチ (現場視点・3 つの運営原則)",
    "Draft",
    "🟢 PR TIMES 配信 2h 後 | 現場側からの実証訴求 | 画像: 現場視察 or オーナーポータル画面",
    FB_J_BODY],
];

async function main() {
  const sheets = getSheets(ACCOUNT);

  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const existing = meta.data.sheets.find(s => s.properties.title === "Launch Channels");

  let launchSheetId;
  if (existing) {
    launchSheetId = existing.properties.sheetId;
    console.log("ℹ️  Launch Channels タブは既存 — 内容をクリアして上書き");
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: "'Launch Channels'!A1:Z200",
    });
  } else {
    const addResp = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          { addSheet: { properties: { title: "Launch Channels" } } },
        ],
      },
    });
    launchSheetId = addResp.data.replies[0].addSheet.properties.sheetId;
    console.log("✅ Launch Channels タブを新規作成");
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: "'Launch Channels'!A1",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [HEADER, ...ROWS] },
  });

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        // 列幅 (8 列): ID 100, Channel 110, Account 170, Date 130, Title 340, Status 80, Notes 280, Draft 750
        { updateDimensionProperties: { range: { sheetId: launchSheetId, dimension: "COLUMNS", startIndex: 0, endIndex: 1 }, properties: { pixelSize: 100 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: launchSheetId, dimension: "COLUMNS", startIndex: 1, endIndex: 2 }, properties: { pixelSize: 110 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: launchSheetId, dimension: "COLUMNS", startIndex: 2, endIndex: 3 }, properties: { pixelSize: 170 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: launchSheetId, dimension: "COLUMNS", startIndex: 3, endIndex: 4 }, properties: { pixelSize: 130 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: launchSheetId, dimension: "COLUMNS", startIndex: 4, endIndex: 5 }, properties: { pixelSize: 340 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: launchSheetId, dimension: "COLUMNS", startIndex: 5, endIndex: 6 }, properties: { pixelSize: 80 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: launchSheetId, dimension: "COLUMNS", startIndex: 6, endIndex: 7 }, properties: { pixelSize: 280 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: launchSheetId, dimension: "COLUMNS", startIndex: 7, endIndex: 8 }, properties: { pixelSize: 750 }, fields: "pixelSize" } },
        { updateDimensionProperties: { range: { sheetId: launchSheetId, dimension: "ROWS", startIndex: 1, endIndex: 6 }, properties: { pixelSize: 460 }, fields: "pixelSize" } },
        // wrap (Notes + Full Draft)
        {
          repeatCell: {
            range: { sheetId: launchSheetId, startRowIndex: 1, endRowIndex: 200, startColumnIndex: 6, endColumnIndex: 8 },
            cell: { userEnteredFormat: { wrapStrategy: "WRAP", verticalAlignment: "TOP", textFormat: { fontSize: 9 } } },
            fields: "userEnteredFormat(wrapStrategy,verticalAlignment,textFormat)",
          },
        },
        // ヘッダーカラー (オレンジ系で X/note と区別)
        {
          repeatCell: {
            range: { sheetId: launchSheetId, startRowIndex: 0, endRowIndex: 1 },
            cell: { userEnteredFormat: { textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } }, backgroundColor: { red: 0.85, green: 0.45, blue: 0.25 }, horizontalAlignment: "CENTER" } },
            fields: "userEnteredFormat(textFormat,backgroundColor,horizontalAlignment)",
          },
        },
        {
          updateSheetProperties: {
            properties: { sheetId: launchSheetId, gridProperties: { frozenRowCount: 1, frozenColumnCount: 1 } },
            fields: "gridProperties.frozenRowCount,gridProperties.frozenColumnCount",
          },
        },
      ],
    },
  });

  console.log(`\n✅ Launch Channels 反映完了: ${ROWS.length} 行 (PR TIMES + FB-T + FB-J)`);
  console.log(`📊 https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit#gid=${launchSheetId}`);
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  console.error(err);
  process.exit(1);
});
