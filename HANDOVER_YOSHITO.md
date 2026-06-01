# 本間ヨシト 様 — マーケ責任者 引き継ぎインデックス

> **作成日**: 2026-05-31
> **作成者**: テンイチ
> **引き継ぎ先**: 本間ヨシト（リード獲得・マーケ責任者 / `design.7247@gmail.com`）
> **役割**: マーケ統括（広告 Google/Meta/X + LP/HP + SNS + PR TIMES + リード獲得）

---

## 📚 引き継ぎドキュメント 一覧（6セクション）

| # | セクション | ファイル | 内容 |
|---|---|---|---|
| 1 | 🎯 **広告運用** | [ad-ops/HANDOVER_YOSHITO_2026-05-31.md](ad-ops/HANDOVER_YOSHITO_2026-05-31.md) | Google / Meta / X 広告の現況・改善経緯・運用ルール |
| 2 | 🌐 **LP / HP** | [HANDOVER_YOSHITO_LP_HP_2026-05-31.md](HANDOVER_YOSHITO_LP_HP_2026-05-31.md) | sekaistay.com 全体（HP + LP 3 variants）の設計・ソースマップ |
| 3 | 📱 **SNS / オーガニックコンテンツ** | [handover/SNS_2026-05-31.md](handover/SNS_2026-05-31.md) | X / note / LinkedIn / Facebook の自動投稿パイプライン |
| 4 | 📰 **PR / メディア露出** | [handover/PR_MEDIA_2026-05-31.md](handover/PR_MEDIA_2026-05-31.md) | PR TIMES・JIRO 出演・ウェビナー・受賞バッジ |
| 5 | 📥 **リード獲得パイプライン** | [handover/LEAD_PIPELINE_2026-05-31.md](handover/LEAD_PIPELINE_2026-05-31.md) | フォーム → 6系統転送 → TimeRex照合 → Discord/Slack通知 |
| 6 | 📐 **ブランド・コピーガイドライン** | [handover/BRAND_GUIDELINES_2026-05-31.md](handover/BRAND_GUIDELINES_2026-05-31.md) | Creative Guide + コピー規約 + 媒体別トーン |
| 7 | 📝 **6月コンテンツドラフト設計** | [handover/JUNE_CONTENT_DRAFTS_2026-06.md](handover/JUNE_CONTENT_DRAFTS_2026-06.md) | オーガニック5本柱 + 架空社員4本柱の月次配分・各軸 6本ストック・週次ローテ |

---

## ⚡ 即知っておいてほしい

セクション横断で「初日にミスする / ブランド毀損する / 数字を誤読する」レベルだけに絞った。

### 📊 マスター運用 Sheets（毎日 / 毎週見る場所）

- **[SEKAI STAY Marketing Roadmap](https://docs.google.com/spreadsheets/d/1eK0fJk0hQyFM2mRumbah2nVe-IgH87cKcAeeFPC0C4E/edit?gid=1066059999#gid=1066059999)** — 全体戦略・施策の月次タイムライン・KPI（マーケ運用のマスター資料）
- **[SEKAI STAY SNSコンテンツ](https://docs.google.com/spreadsheets/d/19qsHLdmIex59mj-xABMbF4jCatHoy6SN7LE8x4EzWVY/edit?gid=1990050856#gid=1990050856)** — X/note/LinkedIn 投稿ドラフトとステータス（SNS handover §3-7 X Cascade Tracker と同一）

### 戦略の中核

1. 🔴 **Price 主導 LP の仮説検証中**（広告 × LP/HP）— Google Ads で **SS-Generic-Trust / SS-Generic-Portal を 5/29 停止**（3週間 CV ゼロのため）。**SS-Generic-Price (¥10K/日・予算の67%)** に絞り込み。LP も `/switch`（価格主導）が一番コンバージョンする仮説で 3バリアント A/B 検証中。広告運用 §3 + LP/HP §3
2. 🟢 **Google Ads が現状もっとも順調な広告媒体・CPL は明確な下降トレンド**（広告）— CPL は **30日 ¥14,889 → 14日 ¥14,981 → 7日 ¥12,110**（直近1週間で −19%）、CV/日 も **0.58 → 0.93 → 1.43** と倍以上に加速。Price 単独 CPA ¥10,483、Geo CPA ¥9,407。5/29 の Trust/Portal 停止後、Price への予算集中が効き始めている。**6月 CV 予測: 直近7日ペース（1.43 CV/日 × 30日）= 約 40 件以上、CPL ¥10,000 台前半まで下がる試算**（日予算上限 ¥15K で月 ¥450K・直近7日 CPL 維持なら CV 37 件、学習がさらに進めば CPL ¥10K 割れ + CV 45 件レンジ）。広告運用 §3
3. 🔴 **Meta Ads は停止中** — 戦略レポート（5/14 作成）の Phase 1 計画と実態が乖離。再開条件・改善方針の合意要。広告運用 §4

### 媒体・コピー・通知の地雷

4. 🟡 **媒体別 AI 言及ポリシー**（ブランド/SNS/PR/HP 横断）— **X = OK**、**note / HP / PR TIMES = AI 言及禁止**。「AI化」→「仕組み化」、「AI自動」→「日次自動」へ言い換え。初日にコピー書くと必ず引っかかる地雷。ブランド §1 + SNS §3
5. 🟡 **リード通知**（リード獲得）— 全リードは **Discord に即時**。Slack `#402-sekaistay面談申込` は **TimeRex ネイティブアプリが予約済みを投稿**、**Jennie がフォーム内容をスレッドに補完**。総数・経路別集計は [dashboard/marketing](https://sekaichi-dashboard.vercel.app/marketing)、LP CVR/Z-score は [/lp-analytics](https://sekaichi-dashboard.vercel.app/lp-analytics)。リード獲得 §3
6. 🟡 **X (@tenichiliu) は公式バッジ・X Premium 課金中・継続運用は未稼働**（SNS）— 長文投稿 (280字超) が使え Bio 上部表示や SEO 効果がある資産。**リリース投稿（5/22）と数本のツイートは手動投稿済み**だが、**自動投稿 cron は未配置・継続コンテンツドラフトも未作成**（1ヶ月分ドラフトはテンイチが順次作成中）。手動スポット稼働状態で、「自動運用が回ってる」と勘違いしないように。SNS §2
7. 🟢 **ジローの X [@jiroisagame](https://x.com/jiroisagame) は既存約 4 万人フォロワー資産**（SNS）— **ハンドル名がゲーム実況系っぽいだけで、発信内容は iFund（ファンド運営・約40社投資）と民泊運用がメイン**。Bio にも「民泊と言えばSEKAI STAY!!!」と明記済み。フォロワー属性は **投資家・ファンド関係者・民泊オーナー / 業界関係者層 = SEKAI STAY ターゲット層と直接重なる高エンゲージ層**。4万人がそのまま SEKAI STAY のリーチ資産として機能する前提で KPI 設計済み。**自動投稿はせず手動運用**（ジロー本人がトーン・タイミング判断）。SNS §3 + 広告運用 §5

---

## 🧭 読む順番

- **Day 1**: このインデックス + ad-ops §1-3 + LP/HP §1-3 + 30分 引き継ぎMTG
- **Week 1**: ad-ops 全体（戦略レポート3本含）/ LP/HP 全体 / SNS / リード獲得
- **Week 2**: PR/メディア / ブランドガイドライン

---

## 📞 主要コンタクト

| 名前 | 役割 / 相談先 | 連絡先 |
|---|---|---|
| **吉田 hikaru** | 事業責任者・予算判断・ブランド方針判断 | `hikaru@sekaichi.org` |
| **テンイチ 劉添毅** | 代表・プロダクト/LP実装/計測タグ・広告管理画面の認証 | `tenichi@sekaichi.org` |
| **小川** | 営業（クロージング・CRM）・リード品質フィードバック | `contact@sekaichi.org` |
| **明神 洸次郎（ジロー）** | 独立営業 / コンテンツ・メディア出演パートナー | `kojiro@sekaichi.org` |
| **Toyo** | 法務・契約・比較広告/最上級表現の審査 | — |

組織図全体: `projects/sekai-stay-ops/data/info/org-chart.json`

---

## 🎬 Day 1 アクション

**アクセス権付与（テンイチ実行）**: Google Ads / Meta Business Manager / Vercel sekaichi org / GitHub `sekaichi-dev/sekaistay.com` / Discord `#sekai-stay` / Slack `#400-sekaistay全体`

**引き継ぎMTG（30-60分）でテンイチと確認**:
- Price 主導 LP の仮説検証状況（Trust/Portal 停止・Price 一本化の判定基準）
- Meta Ads の停止理由・再開条件
- リード通知 dedup ロジック（TimeRex 照合）の現状の挙動
- PR TIMES（5/22 配信済み）の反響分析状況
- 吉蔵 CRM vs HubSpot 移行判断

**引き継ぎ完了の判定**: 全アクセス権付与済・全ドキュメント通読・引き継ぎMTG実施・2週間以内に独立判断を1つ以上実行・第1回週次振り返り（金曜）実施

---

*2026-05-31 時点のスナップショット。引き継ぎ完了後はヨシトが必要に応じて更新。*
