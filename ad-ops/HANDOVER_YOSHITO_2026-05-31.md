# SEKAI STAY 広告運用 引き継ぎ資料 — 本間ヨシト様

> **作成日**: 2026-05-31 / **作成者**: テンイチ
> **引き継ぎ先**: 本間ヨシト（リード獲得・マーケ責任者 / `design.7247@gmail.com`）
> **対象**: Google Ads / Meta Ads / X Ads の運用全権
> **目的**: テンイチが個別運用していた広告アカウントと運用知見をヨシトに完全移譲し、6月以降の運用責任者として独立稼働できる状態にする
> **戻る**: [HANDOVER_YOSHITO.md](../HANDOVER_YOSHITO.md)
> **姉妹資料**: [`../HANDOVER_YOSHITO_LP_HP_2026-05-31.md`](../HANDOVER_YOSHITO_LP_HP_2026-05-31.md)（LP/HP 引き継ぎ）

---

## 🔗 外部リンク（よく使うもの・トップ固定）

| 種別 | URL / 場所 |
|---|---|
| 📊 **広告統合ダッシュボード** | https://sekaichi-dashboard.vercel.app/marketing （Spend/Impressions/Clicks/CPC/CPM/CV 6軸・媒体横断） |
| 📈 **LP A/Bテスト分析** | https://sekaichi-dashboard.vercel.app/lp-analytics （CVR・Δ・Z-score） |
| 📥 **SEKAI STAY Lead Submissions Log** | [Google Sheet](https://docs.google.com/spreadsheets/d/1CWTHJyHrjpfg6voaiAZabMkKv21or1BbrGF9e6aBKh4/edit)（全リード一次保管） |
| 🎯 **Google Ads** | https://ads.google.com/aw/overview?ocid=8614414795 （Customer ID `861-441-4795`・MCC 経由 `311-728-0923`） |
| 📘 **Meta Ads Manager** | https://business.facebook.com/adsmanager/manage/campaigns （現在は 🔴 停止中） |
| 🐦 **X Ads** | https://ads.x.com （現状オーガニック優先・Promoted 未稼働） |
| 📂 **SEKAI_STAY_Marketing_Roadmap** | [Google Sheet](https://docs.google.com/spreadsheets/d/1eK0fJk0hQyFM2mRumbah2nVe-IgH87cKcAeeFPC0C4E/edit?gid=1066059999#gid=1066059999)（マーケ戦略・月次タイムライン・KPI） |
| 🧾 **戦略レポート（リポ内）** | [Google Ads](STRATEGY_REPORT_2026-05-12.md) / [Meta Ads](STRATEGY_REPORT_META_2026-05-14.md) / [X Ads](STRATEGY_REPORT_X_2026-05-17.md) |
| 🗺️ **広告運用ロードマップ** | [`ROADMAP.md`](../ROADMAP.md)（リポ直下） |
| 🛠️ **Vercel プロジェクト** | https://vercel.com/sekaichi/sekaistay-com （`prj_qfaTcxdt6mQ18ARDg046q5febS0d`） |
| 📦 **GitHub リポ** | https://github.com/sekaichi-dev/sekaistay.com |

---

## ⚡ サマリー（3分で読める現状）

### 媒体別ステータス（2026-06-01 時点）

| 媒体 | 状態 | 直近30日実績 | 注力先 |
|---|---|---|---|
| **Google Ads** | 🟢 稼働中（4キャンペーン）・CPL 下降中 | spend ¥223K / CV 15件 / **平均 CPL ¥14,889**・直近7日 **¥12,110** | **SS-Generic-Price**（¥10K/日・予算の67%） |
| **Meta Ads** | 🔴 **停止中** | — | 再開判断要 |
| **X Ads** | 🟡 オーガニック先行 | Promoted 未開始 | 長文B 投稿でフォロワー基盤構築中 |

### Google Ads CPL トレンド（2026-06-01・API 直接取得）

| 期間 | Spend | CV | **CPL** | CV/日 |
|---|---:|---:|---:|---:|
| 直近30日 (5/05-5/31) | ¥223,330 | 15 | **¥14,889** | 0.58 |
| 直近14日 (5/18-5/31) | ¥194,752 | 13 | **¥14,981** | 0.93 |
| 直近7日 (5/25-5/31) | ¥121,095 | 10 | **¥12,110** ⬇️ | **1.43** |

**直近1週間で CPL が −19%、CV/日 が +54%** に加速。5/29 Trust/Portal 停止 → Price 集中の効果が顕在化中。

### 6月 CV/CPL 予測

| シナリオ | 前提 | 6月 CV | 6月 CPL |
|---|---|---:|---:|
| 保守 | 直近7日 CPL 維持・日予算上限 ¥15K/日 = 月 ¥450K | **37件** | ¥12,110 |
| 中位 | 直近7日 CV/日 1.43 × 30日 | **43件** | ¥12,110 |
| 楽観 | 学習継続で CPL ¥10K 割れ + 同 CV ペース | **45件** | ¥10,000 |

### Google Ads の改善経緯（4週間で何があったか）

```
5/12  📦 5キャンペーン体制で立ち上げ (Price/Trust/Portal/Geo/Brand・計¥13K/日)
5/18  🔧 入札上限調整・コピー差替え
5/19  💰 Price に予算傾斜開始 (¥3K → ¥10K/日) + Sitelink/Callout/Snippets 追加
5/22  📈 全キャンペーン予算再調整・KW status見直し
5/25  ➕ 競合社名の負KW を大量追加（30件以上）
5/28  ❌ 上記の競合社名負KW を 全部削除（Google Ads 担当者との議論で「データが揃ってない段階で除外KWを増やすのは早い」という結論）
5/29  🛑 SS-Generic-Trust / SS-Generic-Portal を一時停止（3週間 CV ゼロのため）
5/29  🆕 SS-Demand-Generation 新規立ち上げ (YouTube/Discover/Gmail 面・¥2K/日)
```

### 即対応が必要な3点

1. 🟡 **競合社名の除外キーワードは意図的に未設定** — 5/28に Google Ads 担当者との議論で「データが揃ってない段階で除外KWを増やすのは早い」という結論になり全削除。共有除外リスト「SS共通-オフターゲット」(19件) のみ稼働中。データが溜まってから再検討
2. 🔴 **Meta 広告 停止中** — 再開条件・改善方針の合意要
3. 🟡 **SS-Brand の CV ゼロ** — 指名検索で 27 click / 0 CV は計測 or LP着地後の異常の可能性

---

> 戦略の詳細は `STRATEGY_REPORT_*.md` 3本に集約。本ドキュメントは「現況スナップショット + 引き継ぎ事項」に絞っている。

---

## 1. 引き継ぎサマリー（詳細）

### 完了済みマイルストーン

- ✅ 計測タグ完備（GA4・Google Ads CV・Meta Pixel・Meta CAPI）
- ✅ 3 LP variants 体制（`/switch` / `/switch/founder` / `/switch/portal`）
- ✅ 訴求3パターン（価格 / 信頼 / ポータル）× LPマッピング統一
- ✅ ジロー時代の広告残骸クリーンアップ完了（PEST URL Trigger Lead 偽CV 17,274件削除）
- ✅ 戦略レポート3本（Google/Meta/X）執筆済み
- ✅ 5/22 プロダクトローンチ + PR TIMES 配信実施済み
- ✅ Google Ads スナップショット自動化（`sekaichi-dashboard/scripts/snapshot-google-ads.mjs`）
- ✅ 価格訴求への予算傾斜（5/19以降・Price ¥10K/日 = 全体の67%）
- ✅ 効かないキャンペーン2本（Trust / Portal）の停止（5/29）

### 未完了・引き継ぎ後に判断が必要

- 🟡 競合社名の除外KW再構築判断（5/28に担当者判断で削除済・データが揃ってから再検討）
- 🔴 Meta Ads 再開判断（停止理由・改善方針）
- 🟡 GA4 (`G-B7M920RCGR`) 管理者権限がジロー所有のまま → 強化CV有効化がブロック中
- 🟡 Meta Pixel 2つ（`1658477098524563` + `989839370242915`）の統合判断
- 🟡 X Pixel 未取得・Promoted Post 配信開始判断
- 🟡 SS-Demand-Generation 効果検証（5/29立ち上げの新キャンペーン）

---

## 2. 役割分担と意思決定権限（吉蔵基準 / Human-in-the-Loop）

セカイチ全体の運用思想として「AI（てんちむ）は提案・観測、人間が判断・実行」を採用。

### ヨシトが単独で判断・実行してよい

| 領域 | 例 |
|---|---|
| 広告管理画面での日常操作 | 入札変更・配信ON/OFF・除外KW追加・予算微調整（±20%以内） |
| クリエイティブ採用判断 | コピー差替え・画像差替え・新規広告追加 |
| キャンペーン構造の調整 | AdGroup分割・キーワード追加削除 |
| 日次・週次の運用判断 | 学習期/維持期の予算切替・勝者クリエイティブの予算集中 |
| LP A/Bテストの結果判定 | 統計有意（Z≥1.96）に達した variant の勝者確定 |

### 事業責任者（吉田）に確認すべき

| 領域 | 例 |
|---|---|
| 月予算 ±20%超の増減 | ¥55万 → ¥70万/月など |
| KGI目標の再設定 | 月リード数・CPA目標の改訂 |
| 新規媒体の追加 | LINE広告・TikTok広告・Yahoo広告など |
| ブランドメッセージの方向転換 | 「業界半額・手数料8%」軸を変えるなど |

### テンイチに確認すべき（プロダクト連動）

| 領域 | 例 |
|---|---|
| LP 構造の大幅変更 | セクション追加削除・フォーム項目変更 |
| 計測タグの実装変更 | 新規 CV 定義・Pixel 追加削除 |
| 新規ドメインの追加 | サブドメイン追加でのCV計測など |

### 法務系（要 Toyo / 義人 確認）

- 比較広告での競合社名使用
- 「No.1」「業界初」などの最上級表現
- 受賞表記の使用

---

## 3. Google Ads（現況・改善経緯）

### 3-1. アカウント情報

| 項目 | 値 |
|---|---|
| アカウント名 | SEKAI STAY |
| Customer ID | `861-441-4795` (8614414795) |
| MCC経由 | `311-728-0923` (3117280923) — SEKAICHI MCC |
| 通貨 / TZ | JPY / Asia/Tokyo |
| 管理者（現状） | テンイチ（`tenichi@sekaichi.org`） |
| アクセス追加 | Google Ads UI → ツール → アクセスとセキュリティ → ヨシトの Google アカウントを招待 |

#### 🏢 SEKAICHI MCC ↔ SEKAI STAY の関係

Google Ads は **MCC（Manager Account） + 子アカウント** の 2 層構造で管理:

- **SEKAICHI MCC** (`311-728-0923`) = セカイチHD の親管理アカウント。全事業の広告アカウントを統括する hub
- **SEKAI STAY** (`861-441-4795`) = 子アカウント。広告配信・課金・キャンペーン運用はここで実施

**なぜ MCC 構造か**:
- 1 つのログインで複数事業（SEKAI STAY / 将来の他事業）の広告を横断管理
- 課金・予算・CV データは子アカウント単位なので会計上もクリーン
- アクセス権を MCC レベルで一括管理 → 子アカウント単位での権限分離も可能

**ヨシトのアクセス権付与方針**:
- **SEKAI STAY 子アカウントの管理者権限のみ** で運用に必要十分
- MCC レベルの権限は **付与しない**（MCC 経由で他事業の広告アカウントまで見えてしまうため）
- ヨシトが触るのは `sekaichi/Google Ads/SEKAI STAY (861-441-4795)` だけ

**API / CLI でのアクセス（コード経由）**:
```
GOOGLE_ADS_CUSTOMER_ID=8614414795        # 子 = SEKAI STAY (操作対象)
GOOGLE_ADS_LOGIN_CUSTOMER_ID=3117280923  # MCC = SEKAICHI (API ログイン経由)
```
`sekaichi-dashboard/scripts/snapshot-google-ads.mjs` 等は両方を使い分けて API 呼び出し。

> **確信度**: 🟢 Customer ID / MCC ID は API スナップショットで確認済み。🟡 SEKAICHI MCC 配下の他子アカウント構成（buzz-gacha 等）の正確な一覧は要本人確認

### 3-2. キャンペーン構造（5/31 snapshot・直近30日実績）

| キャンペーン | 種別 | ステータス | 入札戦略 | 日予算 | Spend | Clicks | CV | CPA | 注力度 |
|---|---|---|---|---|---|---|---|---|---|
| **SS-Generic-Price** | SEARCH | 🟢 ENABLED | MAXIMIZE_CONVERSIONS | **¥10,000** | ¥120,798 | 160 | **10** | **¥12,080** | ⭐⭐⭐ 主力 |
| **SS-Geo** | SEARCH | 🟢 ENABLED | MAXIMIZE_CONVERSIONS | ¥2,000 | ¥26,836 | 27 | 2 | ¥13,418 | ⭐⭐ 副軸 |
| **SS-Brand** | SEARCH | 🟢 ENABLED | TARGET_SPEND | ¥1,000 | ¥7,416 | 16 | 0 | — | ⭐ 指名 |
| **SS-Demand-Generation-2026-05-29** | DEMAND_GEN | 🟢 ENABLED | MAXIMIZE_CONVERSIONS | ¥2,000 | ¥7,077 | 56 | 0 | — | 🆕 実験 |
| SS-Generic-Trust | SEARCH | 🔴 PAUSED | TARGET_SPEND | ¥1,000 | ¥20,097 | 21 | 0 | — | （5/29停止） |
| SS-Generic-Portal | SEARCH | 🔴 PAUSED | TARGET_SPEND | ¥1,000 | ¥19,004 | 31 | 0 | — | （5/29停止） |
| SS_Search_Switch_Core_202604 | SEARCH | ⚫ REMOVED | — | — | ¥13,285 | 19 | 0 | — | （旧・ジロー残骸） |
| /switch test1 | PMAX | ⚫ REMOVED | — | — | ¥0 | 0 | 0 | — | （削除済） |

**注力先の意図**:
- **SS-Generic-Price** が CV エンジン（10 CV / 12 件中の 83%）。¥10K/日 = 全体予算の 67% を集中投下
- **SS-Geo** は地名×業界の長尾で CPA ¥13K と Price と同等。サブとして温存
- **SS-Brand** は指名検索だが現状 CV ゼロ（要調査）
- **SS-Demand-Generation** は 5/29 に新規立ち上げた YouTube/Discover/Gmail 面の Demand Gen 形式実験。まだ評価には早い
- **Trust / Portal** は3週間 ¥20K ずつ消化して CV ゼロのため 5/29 に停止

### 3-3. 改善経緯（4週間の運用ログ）

```
2026-05-12 ── 5キャンペーン体制で本格稼働開始（Price/Trust/Portal/Geo/Brand）
              初期予算: Price ¥3K / Trust ¥3K / Portal ¥3K / Geo ¥3K / Brand ¥1K = 計¥13K/日
              旧 SS_Search_Switch_Core_202604 (ジロー残骸) を一時停止

2026-05-18 ── 入札上限 (cpcBidCeilingMicros) 調整・全広告コピー差替え
              ジロー時代の景表法違反リスク表現を全削除
              → 「成果型でお約束」「手数料8%だけ」等 NG表現を削除
              → 「業界相場の半額・手数料8%」「Airbnbスーパーホスト多数認定」に統一

2026-05-19 ── Price への予算傾斜開始 + Asset 大量追加
              → Sitelink Asset 3+件、Callout Asset 6件、Structured Snippets 4件
              → 受賞バッジ「BEST OF SAUNA STAY 2026」をサイトリンクで露出

2026-05-22 ── 全キャンペーンの予算再調整 + KW status 一括見直し
              → 価格主導で実績が出始めたので Price 予算を ¥10K/日 に固定

2026-05-25 ── 競合社名の負キーワード 30件以上を大量追加
              → dent / コンパス / プレイス / バンク / weli / matatabi / リン / tabiii /
                 エアサポ / オシエテ / sozonext / matsuri technologies / nakajitsu /
                 all fortune partners / アンドヴィラ / clean-bnb / torayado / 等

2026-05-28 ── 上記の競合社名負KW を 23:58 に全件削除
              → Google Ads 担当者との議論で「データが揃ってない段階で除外KWを増やすのは早い」という結論
              → AD_GROUP_CRITERION REMOVE が 30件以上連続発火
              → CAMPAIGN_CRITERION REMOVE も同時発火
              → 削除理由は記録なし（再構築要）

2026-05-29 ── 戦略大幅見直し
              → SS-Generic-Trust 停止（3週間 ¥20K 消化 / CV ゼロ・KW自体に検索Volほぼなし）
              → SS-Generic-Portal 停止（同上）
              → SS-Geo を MAXIMIZE_CONVERSIONS に切替（TARGET_SPEND から変更）
              → SS-Demand-Generation-2026-05-29 新規立ち上げ
                  (Demand Gen形式・YouTube/Discover/Gmail 面・¥2K/日)
              → SS-Generic-Price に aiMax / assetAutomation 有効化試行
```

### 3-4. 注力キャンペーン: SS-Generic-Price 詳細

**効いている検索KW（CV発生・直近30日）**

| KW | マッチタイプ | Spend | CV | CPA |
|---|---|---|---|---|
| 民泊 管理代行 | PHRASE | ¥24,104 | 4 | **¥6,026** ⭐最高効率 |
| 民泊 代行 | PHRASE | ¥60,197 | 3 | ¥20,066 |
| 民泊 運用代行 | PHRASE | ¥5,986 | 1 | ¥5,986 |

**効いていない（spend ありCV ゼロ）**

| KW | マッチタイプ | Spend | クリック |
|---|---|---|---|
| 民泊 代行 | EXACT | ¥8,069 | 8（PHRASE と被るので EXACT 不要かも） |
| 民泊 運営代行 | EXACT | ¥4,761 | 2 |
| 民泊 管理代行 | EXACT | ¥2,594 | 2 |
| 民泊 代行 費用 | PHRASE | ¥1,434 | 5 |
| 民泊 代行 手数料 | PHRASE | ¥510 | 2 |

**SS-Geo の効率良KW**

| KW | Spend | CV | CPA |
|---|---|---|---|
| 福岡 民泊代行 (PHRASE) | ¥4,172 | 1 | **¥4,172** ⭐ |
| 沖縄 民泊代行 (PHRASE) | ¥9,534 | 1 | ¥9,534 |

### 3-5. 除外キーワード（現状）— ★要対応

| レベル | 件数 | 状態 |
|---|---|---|
| キャンペーンレベル | **0件** | ❌ なし |
| AdGroup レベル | **0件** | ❌ なし |
| 共有除外リスト | 1件 | 🟢 SS共通-オフターゲット（19件・ENABLED） |

**SS共通-オフターゲット（共有リスト・全キャンペーン適用）**
```
求人 / 仕事 / バイト / 旅行 / 旅館 / ホテル / 予約 / 観光 / ブログ /
副業 / 宿泊 / ログイン / ゲスト / 清掃 求人 / やり方 / 始め方 /
登録方法 / 泊まりたい / airbnb ログイン
```

📝 **現状の方針**: 5/25 に追加した競合社名30件以上の負KW（dent / コンパス / matsuri technologies / nakajitsu 等）は 5/28 23:58 に **意図的に全件削除済**。Google Ads 担当者との議論で「データが揃ってない段階で除外KWを増やすのは早い」という結論。
- → 競合社名検索クエリで広告がマッチする状態にある
- → ある程度データが溜まってから検索クエリレポートで実流入を確認し、必要に応じて再追加するのが方針

### 3-6. CV 設定

| CV名 | ステータス | Primary | ルックバック |
|---|---|---|---|
| SEKAI STAY (web) generate_lead | ENABLED | ✓ | 60日 |
| リードフォーム - 送信 | ENABLED | — | 1日 |
| SEKAI STAY (web) qualify_lead | HIDDEN | — | 90日 |
| SEKAI STAY (web) close_convert_lead | HIDDEN | — | 90日 |
| SEKAI STAY (web) purchase | HIDDEN | — | 90日 |

> 主CV = `SEKAI STAY (web) generate_lead`（GA4 import）

### 3-7. 戦略レポート参照

- 詳細: [`STRATEGY_REPORT_2026-05-12.md`](STRATEGY_REPORT_2026-05-12.md)（259行・12章）
- キーワード一覧: [`google-ads/keyword-list.md`](google-ads/keyword-list.md)
- コピー一覧: [`google-ads/copy-drafts.md`](google-ads/copy-drafts.md)
- スナップショット再生成: `cd projects/sekaichi-dashboard && node scripts/snapshot-google-ads.mjs`

---

## 4. Meta Ads（現況: 🔴 停止中）

### 4-1. 停止状況

2026-05-31 時点で **広告配信を停止中**。

戦略レポート（2026-05-14 作成）では Phase 1（学習期 14日 ¥7K/日 → Day 15 から ¥3K/日 維持期 → 6月以降 Retargeting + Lookalike 追加）の計画だったが、実配信は途中で停止している。

**停止理由（推測・要本人確認）**:
- 学習期完了前に CPL が想定外に悪化した可能性
- 予算消化と CV 効率の見合いで判断停止した可能性
- LP A/Bテスト準備期間で広告止めた可能性

### 4-2. アカウント情報

| 項目 | 値 |
|---|---|
| Business Manager | SEKAI STAY |
| Meta Pixel（メイン） | `1658477098524563` |
| Meta Pixel（追加・統合検討中） | `989839370242915` |
| Meta CAPI | 実装完了（`lib/meta-capi.ts`） |
| 環境変数（sekaistay-com） | `META_PIXEL_ID` / `META_CAPI_TOKEN` / `META_CAPI_TEST_EVENT_CODE` |
| 環境変数（sekaichi-dashboard） | `META_ACCESS_TOKEN` / `META_AD_ACCOUNT_ID` |

### 4-3. 直近の配信履歴（戦略レポート時点の計画）

| キャンペーン | 状態 | メモ |
|---|---|---|
| SS-Meta-Interest-202605 | 停止中 | Phase 1 学習期で立ち上げ。3クリエイティブ dynamic creative |
| SS-Meta-Retargeting | 未着手 | Pixel 14日蓄積後の立ち上げ予定だった |
| SS-Meta-Lookalike | 未着手 | Lead 母集団 100件突破後の立ち上げ予定だった |

### 4-4. 3クリエイティブ（dynamic creative）

| 広告ID | 訴求 | LP | コピー要約 |
|---|---|---|---|
| AD_Trust_Founder_v1 | 信頼 | /switch/founder | 「民泊代行、まだ20%払っていませんか？」/ 業界半額×受賞運営 |
| AD_Price_20vs8_v1 | 価格 | /switch | 「手数料8%・業界半額」/ 最短2週間で切替 |
| AD_Portal_Dashboard_v1 | ポータル | /switch/portal | 「24h可視化のオーナーポータル」/ 全物件を一画面で |

> 画像: `meta-ads/creatives/ss-price.png` / `ss-portal.png` / `ss-trust.png`（1254×1254）

### 4-5. ジロー時代の汚染履歴（クリーンアップ済）

| 旧資産 | 状態 |
|---|---|
| `SEKAI STAY_Lead_BroadVsNarrow_202605` | 🔻 Paused |
| `SS_Conversion_Switch_Meta_202604` | 🔻 Paused |
| `AS_Price_Switch_Broad_JP`（偽 Lead 17,274件で AI 学習汚染） | 🔻 Paused |
| PEST URL Trigger Lead 設定 | ✅ 削除済 |

⚠️ **Clean Slate ルール**: 再開時も旧 ad set 履歴の汚染を引き継がないよう、新規 ad set で立ち上げる方針を維持すること。

### 4-6. 再開時の判断事項

ヨシトが再開判断する時のチェックリスト:
- [ ] 停止理由をテンイチに確認（戦略変更 / コスト悪化 / 一時休止 etc）
- [ ] 戦略レポート [`STRATEGY_REPORT_META_2026-05-14.md`](STRATEGY_REPORT_META_2026-05-14.md) 通読
- [ ] Phase 1 から再開するか、Lookalike 含む Phase 2 構造で立ち上げ直すか判断
- [ ] 月予算と入札戦略を吉田と再合意
- [ ] LP A/Bテスト勝者がいるならその LP に絞って再配信

### 4-7. 戦略レポート参照

- 詳細: [`STRATEGY_REPORT_META_2026-05-14.md`](STRATEGY_REPORT_META_2026-05-14.md)（370行・13章）
- セットアップ手順: [`meta-ads/setup-draft.md`](meta-ads/setup-draft.md)
- オーディエンス設計: [`meta-ads/audience-targeting.md`](meta-ads/audience-targeting.md)
- CAPI セットアップ: [`setup-guides/meta-conversions-api.md`](setup-guides/meta-conversions-api.md)

---

## 5. X Ads（現況: 🟡 オーガニック先行）

### 5-1. アカウント体制

| アカウント | 担当 | 開設状況 | フォロワー | X Premium+ |
|---|---|---|---|---|
| **@tenichiliu** | テンイチ（本人） | ✅ 開設済 | 新規構築中 | ✅ 課金済（長文4000字解禁） |
| **[@jiroisagame](https://x.com/jiroisagame)** | ジロー（明神 洸次郎【iFund】） | ✅ 開設済（既存資産） | **約 40,000** | 要確認 |
| **@ss_unei_chan**（架空社員） | アバター運用 | ⚠️ 未作成 | — | 作成後にOAuth実行で自動投稿即有効化可能 |

> **戦略上の含意**: ジロー @jiroisagame は **すでに約4万人フォロワー** を保有する大型アカウント。**ハンドル名がゲーム実況系っぽいだけで、発信内容は iFund（ファンド運営・約40社投資）と民泊運用がメイン**。Bio にも「民泊と言えばSEKAI STAY!!!」と明記済み。フォロワー属性は **投資家・ファンド関係者・民泊オーナー / 業界関係者層 = SEKAI STAY のターゲット層と直接重なる高エンゲージ層**。SEKAI STAY コンテンツへの反応が良いことが期待でき、4万人がそのまま SEKAI STAY のリーチ資産になる
> 透明性: 架空社員 bio に「SEKAI STAY 運営チームメンバー」と明記（虚構ではなく実在運用チームのペルソナ化）
> @jiroisagame は自動投稿せず手動投稿運用（ジロー本人がトーン・タイミング判断）

### 5-2. 投稿フォーマット

| 種別 | 字数 | 頻度 |
|---|---|---|
| 通常投稿 | 280字以内 | 週5本/アカウント |
| 長文B | 280-4000字（X Premium+ 必須） | 週2本/アカウント |
| スレッドC | 280字 × 5-10連 | 週1本/アカウント |

→ 月間 約 80 投稿（テン+ジロー+架空社員 合算）

### 5-3. 「Boost the Winners」運用モデル

```
Day 0: 長文B 投稿（オーガニック単体）
Day 2: X Ads Manager で impression / engagement / link click を測定
       エンゲージ率 ≥3% + link click ≥10 の上位 20% を抽出
Day 3: 該当投稿を Promoted Post として広告化
       入札: 手動 CPC ¥150-300
       ターゲ: 既存 X Ads 9パターンと同じオーディエンス
Day 7: 勝者継続・敗者停止判定
```

### 5-4. 予算配分（月¥15万）

| 配信種別 | 役割 | 月予算 |
|---|---|---|
| 既存 X Ads 9パターン（price/portal/trust × 3） | コールド配信・新規開拓 | ¥80,000（¥2,667/日） |
| Boost the Winners | オーガニック投稿の広告化 | ¥70,000（¥2,333/日） |

### 5-5. 未完了の準備項目

- ⚠️ X Pixel 未取得（`NEXT_PUBLIC_X_PIXEL_ID` env 未登録）
- ⚠️ Promoted Post 配信未開始
- ⚠️ @ss_unei_chan アカウント未作成

### 5-6. KPI（3ヶ月）

> **前提**: @jiroisagame は約40,000 follower の既存資産。**発信内容は iFund・民泊運用がメイン** で SEKAI STAY ターゲット層（投資家・民泊オーナー・業界関係者）と直接重なる高エンゲージ層。4万人がそのまま SEKAI STAY のリーチ資産として機能する想定で KPI を設計

| 指標 | M1（6月） | M2（7月） | M3（8月） |
|---|---|---|---|
| @tenichiliu Followers（新規構築） | 800 | 2,000 | 4,000 |
| @ss_unei_chan Followers（架空社員・新規） | 200 | 800 | 1,500 |
| @jiroisagame Followers（既存4万人 + 純増） | 40,500 | 41,500 | 43,000 |
| **3アカウント合算 Reach 資産** | **~41,500** | **~44,300** | **~48,500** |
| 月間 Impressions（3アカウント合算・@jiroisagame の影響大） | 500K | 1.0M | 1.8M |
| LP 流入（X → /switch*） | 250 | 600 | 1,200 |
| X リード（org + paid） | 8-12 | 18-28 | 35-50 |
| Promoted CPL | ¥10-15K | ¥7-12K | ¥5-10K |

### 5-7. 戦略レポート参照

- 詳細: [`STRATEGY_REPORT_X_2026-05-17.md`](STRATEGY_REPORT_X_2026-05-17.md)（338行・12章）
- 既存9パターンコピー: [`x-ads/copy-drafts.md`](x-ads/copy-drafts.md)
- 長文B ドラフトバンク: [`x-ads/long-form-content-bank.md`](x-ads/long-form-content-bank.md)
- オーディエンス設計: [`x-ads/audience-targeting.md`](x-ads/audience-targeting.md)

---

## 6. 共通基盤（LP / 計測 / フォーム）

### 6-1. LP 3 variants（全媒体共通）

| URL | lp_variant | 役割 | 連動訴求 |
|---|---|---|---|
| `/switch` | `switch` | Control（Full LP・価格主導兼用） | 業界半額・手数料8% |
| `/switch/founder` | `switch-founder` | 創業者前面・信頼主導 | スーパーホスト・受賞 |
| `/switch/portal` | `switch-portal` | オーナーポータル前面 | 24hダッシュボード・可視化 |

> ルート規約: LP URLはルートを `/switch` に統一（`/lp/xxx` は使わない）
> 全 variant が共通で `LpVariantForm` → `ReportRequestForm` を内包
> `lp_variant` は GA4 / Meta Pixel / Supabase に伝播

### 6-2. 計測スタック

```
広告クリック → LP /switch*（GA4 + Meta Pixel 設置）
  ↓
ReportRequestForm 送信 → POST /api/report-requests/submit
  ↓ 3系統並列転送（fire-and-forget）
  ├─ Supabase lead_submissions（raw 一次保管）
  ├─ 吉蔵 CRM（forwardLead）
  └─ Meta CAPI（sendMetaCapiLead・hashed PII）
  ↓
クライアント側で fbq('Lead', {eventID}) + gtag('generate_lead') 発火
```

### 6-3. 計測ID一覧

| 項目 | 値 |
|---|---|
| GA4 | `G-B7M920RCGR`（layout.tsx ハードコード） |
| Google Tag | `GT-WVRTJXNR` |
| Google Ads Conversion | `SEKAI STAY (web) generate_lead`（GA4 import） |
| Meta Pixel（メイン） | `1658477098524563` |
| Meta Pixel（追加） | `989839370242915` |
| Meta CAPI | env: `META_CAPI_TOKEN` + `META_CAPI_TEST_EVENT_CODE` |

### 6-4. UTM 規約

```
Google: utm_source=google&utm_medium=cpc&utm_campaign=<キャンペーン名>
Meta:   utm_source=meta&utm_medium=cpc&utm_campaign=SS-Meta-Interest-202605
        &utm_content=trust-founders-v1|price-20vs8-v1|portal-dashboard-v1
X (org): utm_source=x&utm_medium=organic&utm_campaign=longform&utm_content=<account>_<topic>
X (paid): utm_source=x&utm_medium=cpc&utm_campaign=boost-the-winners&utm_content=<original_post_id>
```

---

## 7. 監視・ガードレール

すべて検知のみ。AI は自動で配信停止しない。ヨシトが管理画面で停止判断する。

| シグナル | しきい値 | 通知先 |
|---|---|---|
| 日予算超過 | 単媒体 ¥30,000/日 超 | Inbox `danger` + Slack `#001-ai-agent-hq` |
| 週予算超過 | 計画比 +20% | Inbox `danger` + Slack 同上 |
| CPA 異常 | 過去7日中央値の 2倍 超 | Inbox `danger` + Slack 同上 |
| CV ゼロ | 24時間 CV=0 かつ予算消化あり | Inbox `general` + Slack 同上 |
| 単一広告コスト | 単一広告グループで ¥50,000 消化＆ CV=0 | Inbox `general` |

---

## 8. ダッシュボード・ツール

### 8-1. パフォーマンスデータ取得

| ツール | 用途 | 場所 |
|---|---|---|
| Google Ads スナップショット | API から最新状態を取得 → memory 自動保存 | `projects/sekaichi-dashboard/scripts/snapshot-google-ads.mjs` |
| Google Ads Fetcher | コスト・インプ・クリック・CV取得 | `projects/sekaichi-dashboard/src/lib/ad-fetchers/google.ts` |
| Meta Ads Fetcher | spend・impressions・clicks・CV取得 | `projects/sekaichi-dashboard/src/lib/ad-fetchers/meta.ts` |
| ヨシダさん Web広告&LP分析ダッシュボード | 統合ダッシュボード | Slack `#400-sekaistay全体` 2026-05-28 投稿参照 |

### 8-2. 学習ログ運用

- `ad-ops/learnings.md` に「仮説 → 試行 → 結果 → 学び」を蓄積
- AI が下書き、ヨシトが週次で「気づき」を追記する想定
- 確定した学びは「恒久ナレッジ」セクションに昇格

### 8-3. 戦略レポート再生成

ad-ops/STRATEGY_REPORT_*.md は配信データが揃ったタイミングで週次更新。新たな戦略変更時はヨシトが作成し、レビューを義人 → テンイチの順に通す運用。

---

## 9. すぐにやってほしいこと

### 🔴 Day 1（引き継ぎ当日）

- [ ] **Google Ads アクセス権付与**（テンイチが UI から招待 → ヨシト `design.7247@gmail.com` 受諾）
- [ ] **Meta Business Manager アクセス権付与**（同上）
- [ ] **このドキュメント（HANDOVER_YOSHITO_2026-05-31.md）を通読**
- [ ] **3つの戦略レポートを通読**（Google / Meta / X・所要時間 約1時間）
- [ ] テンイチと 30分の引き継ぎMTG（質疑応答 + 直近の運用判断の意図共有・特に「Meta停止理由」を確認。除外KW削除は Google Ads 担当者と合意済の方針）

### 🟡 Week 1（6/1〜6/7）

- [ ] **検索クエリレポートで競合社名流入をウォッチ**（除外KW追加はまだ早いと担当者合意済・データ蓄積後に再判断）
- [ ] **SS-Brand CV ゼロ問題の原因究明**（指名検索 27 click / 0 CV）
  - LP着地後の挙動確認（GA4 イベント発火確認）
  - 計測タグ設定の確認
- [ ] **Meta Ads 再開判断**
  - 停止理由ヒアリング
  - 再開条件・予算・運用方針の合意
- [ ] **SS-Demand-Generation 効果検証**（5/29立ち上げ・1週間データ）
  - CPL / CV が見合うなら継続、ダメなら停止判断
- [ ] **第1回 週次振り返り**（金曜・先週分の数値レビュー + 翌週の仮説立案）

### 🟢 Week 2-4（6/8〜6/30）

- [ ] **GA4 (G-B7M920RCGR) 権限移行**（ジロー → ヨシト・テンイチ）
- [ ] **X Pixel 取得 + Vercel env 登録**（`NEXT_PUBLIC_X_PIXEL_ID`）
- [ ] **Meta Pixel 統合判断**（`1658477098524563` と `989839370242915` のどちらに寄せるか）
- [ ] **X Boost the Winners 開始**（オーガニック上位20%抽出 → Promoted化）
- [ ] **LP A/Bテスト勝者判定**（Z≥1.96 達成 variant の選定）
- [ ] **6月実績で7月の予算配分見直し**（CPA 最良チャネルへ傾斜配分）

---

## 10. 既知の課題・未解決事項

| # | 課題 | 緊急度 | 詳細 |
|---|---|---|---|
| 1 | 競合社名の負KW未設定 | 🟡 中 | 5/25 追加 → 5/28 全削除（Google Ads 担当者と「データ蓄積前に増やすのは早い」と合意）。共有リスト「SS共通-オフターゲット」(19件) のみ稼働。データ溜まり次第再検討 |
| 2 | Meta 広告 停止中 | 🔴 高 | 戦略レポート時点の計画と実態が乖離。再開判断要 |
| 3 | SS-Brand CV ゼロ | 🟠 中 | 指名検索 27 click あって CV ゼロは異常。計測タグ or LP着地後の挙動要調査 |
| 4 | GA4 管理者権限がジロー所有 | 🟡 低 | 強化CV有効化のみブロック中。配信には影響なし |
| 5 | Meta Pixel 2つ並存 | 🟡 低 | layout.tsx に追加Pixelハードコード。統合判断要 |
| 6 | X Pixel 未取得 | 🟡 低 | X Ads CV最適化が機能しない。早期取得推奨 |
| 7 | SS-Demand-Generation 効果未検証 | 🟡 低 | 5/29 立ち上げ・¥7K消化・CV ゼロ。継続/停止判断要 |
| 8 | 5月のリード目標（75件）未達 | — | 戦略レポート §8 で「5月は実証期」に再定義済み。6-7月達成パスに移行 |

> コンタクト一覧は [HANDOVER_YOSHITO.md §📞 主要コンタクト](../HANDOVER_YOSHITO.md) 参照。

---

## 11. 主要ドキュメント・コード参照先

### 戦略・運用基盤

| ファイル | 内容 |
|---|---|
| `ad-ops/README.md` | 運用基盤・役割分担・KGI |
| `ad-ops/STRATEGY_REPORT_2026-05-12.md` | Google広告戦略（259行・12章） |
| `ad-ops/STRATEGY_REPORT_META_2026-05-14.md` | Meta広告戦略（370行・13章） |
| `ad-ops/STRATEGY_REPORT_X_2026-05-17.md` | X長文×広告戦略（338行・12章） |
| `ad-ops/learnings.md` | 学習ログ（仮説→試行→結果→学び） |

### 媒体別アセット

| ディレクトリ | 内容 |
|---|---|
| `ad-ops/google-ads/` | キーワード一覧・コピー集 |
| `ad-ops/meta-ads/` | オーディエンス設計・コピー集・クリエイティブ画像 |
| `ad-ops/x-ads/` | 既存9パターンコピー・長文Bドラフトバンク |
| `ad-ops/setup-guides/` | 計測タグセットアップ手順 |
| `ad-ops/note/` | note 投稿コンテンツ |

### コード

| ファイル | 内容 |
|---|---|
| `projects/sekaistay-com/lib/meta-capi.ts` | Meta CAPI 実装 |
| `projects/sekaistay-com/app/(landing)/switch/page.tsx` | /switch LP |
| `projects/sekaistay-com/app/(landing)/switch/founder/page.tsx` | /switch/founder LP |
| `projects/sekaistay-com/app/(landing)/switch/portal/page.tsx` | /switch/portal LP |
| `projects/sekaistay-com/components/report-request/ReportRequestForm.tsx` | フォーム本体 |
| `projects/sekaistay-com/app/api/report-requests/submit/route.ts` | フォーム送信エンドポイント |
| `projects/sekaichi-dashboard/src/lib/ad-fetchers/google.ts` | Google Ads API fetcher |
| `projects/sekaichi-dashboard/src/lib/ad-fetchers/meta.ts` | Meta Marketing API fetcher |
| `projects/sekaichi-dashboard/scripts/snapshot-google-ads.mjs` | Google Ads スナップショット生成 |

### スナップショット

`~/.claude/projects/-Users-sekaichi-Desktop-claude-code/memory/project_sekai_stay_google_ads_learnings.md` — Google Ads の最新キャンペーン構造・キーワード設計・除外KW・CV設定・直近30日の変更履歴と実績（API 自動生成・本ドキュメントもこれを参照）

### Vercel 環境変数（広告関連抜粋）

| プロジェクト | 変数 | 用途 |
|---|---|---|
| sekaistay-com | `META_PIXEL_ID` | Meta Pixel ID |
| sekaistay-com | `META_CAPI_TOKEN` | Meta CAPI トークン |
| sekaistay-com | `META_CAPI_TEST_EVENT_CODE` | Meta CAPI テストコード |
| sekaistay-com | `NEXT_PUBLIC_GOOGLE_ADS_ID` | GA4/Google Ads クライアント側 ID |
| sekaichi-dashboard | `GOOGLE_ADS_DEVELOPER_TOKEN` | Google Ads API |
| sekaichi-dashboard | `GOOGLE_ADS_CUSTOMER_ID` | 8614414795 |
| sekaichi-dashboard | `GOOGLE_REFRESH_TOKEN_SEKAICHI` | Google Ads API OAuth |
| sekaichi-dashboard | `META_ACCESS_TOKEN` | Meta Marketing API |
| sekaichi-dashboard | `META_AD_ACCOUNT_ID` | Meta 広告アカウント ID |

---

## 12. 引き継ぎ完了の判定基準

以下が全て揃ったら引き継ぎ完了とする:

- [ ] ヨシトが Google Ads / Meta Ads / X Ads の全管理画面に自分のアカウントでログインできる
- [ ] ヨシトが戦略レポート3本 + このドキュメントを通読済み
- [ ] テンイチとの引き継ぎMTGを実施（30-60分）
- [ ] 競合社名の除外KW（担当者合意済・データ蓄積後の再検討タイミング判断）
- [ ] Meta 再開判断（再開 or 当面停止維持）完了
- [ ] 第1回週次振り返り（金曜）を実施
- [ ] 引き継ぎ後 2週間以内に、ヨシトが独立して1つ以上の運用判断を実行

完了後、ヨシトは月次で吉田に進捗報告、随時テンイチにプロダクト連動の相談、という運用に移行する。

---

*このドキュメントは 2026-05-31 時点のスナップショット。引き継ぎ完了後はヨシトが必要に応じて更新する。Google Ads データは `snapshot-google-ads.mjs` の出力に基づく。*
