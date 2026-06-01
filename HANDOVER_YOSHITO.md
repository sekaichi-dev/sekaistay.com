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

### 戦略の中核

1. 🔴 **Price 主導 LP の仮説検証中**（広告 × LP/HP）— Google Ads で **SS-Generic-Trust / SS-Generic-Portal を 5/29 停止**（3週間 CV ゼロのため）。**SS-Generic-Price (¥10K/日・予算の67%)** に絞り込み。LP も `/switch`（価格主導）が一番コンバージョンする仮説で 3バリアント A/B 検証中。広告運用 §3 + LP/HP §3
2. 🟢 **Google Ads が現状もっとも順調な広告媒体・CPL は明確な下降トレンド**（広告）— CPL は **30日 ¥14,889 → 14日 ¥14,981 → 7日 ¥12,110**（直近1週間で −19%）、CV/日 も **0.58 → 0.93 → 1.43** と倍以上に加速。Price 単独 CPA ¥10,483、Geo CPA ¥9,407。5/29 の Trust/Portal 停止後、Price への予算集中が効き始めている。**6月 CV 予測: 直近7日ペース（1.43 CV/日 × 30日）= 約 40 件以上、CPL ¥10,000 台前半まで下がる試算**（日予算上限 ¥15K で月 ¥450K・直近7日 CPL 維持なら CV 37 件、学習がさらに進めば CPL ¥10K 割れ + CV 45 件レンジ）。広告運用 §3
3. 🔴 **Meta Ads は停止中** — 戦略レポート（5/14 作成）の Phase 1 計画と実態が乖離。再開条件・改善方針の合意要。広告運用 §4

### 媒体・コピー・通知の地雷

4. 🟡 **媒体別 AI 言及ポリシー**（ブランド/SNS/PR/HP 横断）— **X = OK**、**note / HP / PR TIMES = AI 言及禁止**。「AI化」→「仕組み化」、「AI自動」→「日次自動」へ言い換え。初日にコピー書くと必ず引っかかる地雷。ブランド §1 + SNS §3
5. 🟡 **リード通知**（リード獲得）— 全リードは **Discord に即時**。Slack `#402-sekaistay面談申込` は **TimeRex ネイティブアプリが予約済みを投稿**、**Jennie がフォーム内容をスレッドに補完**。総数・経路別集計は [dashboard/marketing](https://sekaichi-dashboard.vercel.app/marketing)、LP CVR/Z-score は [/lp-analytics](https://sekaichi-dashboard.vercel.app/lp-analytics)。リード獲得 §3
6. 🟡 **X (@tenichiliu) は公式バッジ・X Premium 課金中・継続運用は未稼働**（SNS）— 長文投稿 (280字超) が使え Bio 上部表示や SEO 効果がある資産。**リリース投稿（5/22）と数本のツイートは手動投稿済み**だが、**自動投稿 cron は未配置・継続コンテンツドラフトも未作成**（1ヶ月分ドラフトはテンイチが順次作成中）。手動スポット稼働状態で、「自動運用が回ってる」と勘違いしないように。SNS §2

---

## 🧭 推奨される読む順番

**Day 1（引き継ぎ当日）— 必読**:
1. このインデックス（5分）
2. ad-ops の §1-3（広告現況サマリー・15分）
3. LP/HP の §1-3（サイト構造・15分）
4. テンイチとの 30分 引き継ぎMTG

**Week 1 — 通読**:
5. ad-ops 全体（戦略レポート3本含む・約2時間）
6. LP/HP 全体（約1時間）
7. SNS 引き継ぎ
8. リード獲得パイプライン引き継ぎ

**Week 2 — 必要に応じて**:
9. PR/メディア
10. ブランドガイドライン

---

## 🎯 役割分担（全セクション共通）

詳細は各引き継ぎ資料の役割分担セクションを参照。要約:

| 領域 | ヨシトが単独実行 | テンイチ承認 | 義人承認 |
|---|---|---|---|
| 広告日常運用 | ✅ | — | — |
| LP/HP コピー変更 | ✅ | — | — |
| LP/HP 構造変更 | — | ✅ | — |
| 月予算 ±20%超 | — | — | ✅ |
| ブランド方針転換 | — | — | ✅ |
| 計測タグ追加削除 | — | ✅ | — |
| SNS 投稿スケジュール変更 | ✅ | — | — |
| PR TIMES 配信内容 | — | — | ✅ |

---

## 📞 主要コンタクト

| 名前 | 役割 | 連絡先 |
|---|---|---|
| **吉田 hikaru** | 事業責任者（SEKAI STAY 全体統括） | `hikaru@sekaichi.org` |
| **テンイチ 劉添毅** | 代表（プロダクト・LP実装・計測タグ） | `tenichi@sekaichi.org` |
| **小川** | 営業（クロージング・CRM） | `contact@sekaichi.org` |
| **明神 洸次郎** | 独立営業 | `kojiro@sekaichi.org` |
| **Toyo** | 法務・契約 | — |
| **ジロー** | コンテンツ・メディア出演パートナー | — |

組織図全体: `projects/sekai-stay-ops/data/info/org-chart.json`

---

## 🎬 Day 1 統合アクション

各セクションで列挙されている Day 1 タスクをまとめると以下:

### 🔴 アクセス権付与（テンイチ実行）

- [ ] Google Ads アカウント招待 → `design.7247@gmail.com`
- [ ] Meta Business Manager 招待
- [ ] Vercel sekaichi org に招待
- [ ] GitHub `sekaichi-dev/sekaistay.com` リポジトリ
- [ ] Discord `#sekai-stay` チャネルアクセス
- [ ] Slack `#400-sekaistay全体` 関連チャネル

### 🟡 通読（ヨシト実行）

- [ ] このインデックス
- [ ] ad-ops/HANDOVER_YOSHITO_2026-05-31.md（必須）
- [ ] HANDOVER_YOSHITO_LP_HP_2026-05-31.md（必須）
- [ ] handover/ の4ドキュメント（時間がある時）
- [ ] 各サブ資料が参照する README / Creative Guide

### 🟢 引き継ぎMTG（30-60分）

特に確認すべき事項:
- [ ] Price 主導 LP の仮説検証状況（Trust/Portal 停止・Price 一本化の経緯と判定基準）
- [ ] Meta Ads の停止理由・再開条件
- [ ] リード通知 dedup ロジック（TimeRex 照合）の現状の挙動
- [ ] PR TIMES（5/22 配信済み）の反響分析状況
- [ ] 吉蔵 CRM vs HubSpot 移行判断

---

## ✅ 引き継ぎ完了の判定基準

以下が全て揃ったら引き継ぎ完了:

- [ ] 全アクセス権付与済み
- [ ] 全ドキュメント通読
- [ ] テンイチとの引き継ぎMTG実施
- [ ] 引き継ぎ後 2週間以内に、ヨシトが独立して1つ以上の運用判断を実行
- [ ] 第1回 週次振り返り（金曜）を実施

完了後、ヨシトはマーケ全領域の日常運用を担当、構造変更時はテンイチに相談、ブランド方針は吉田と合意、という運用に移行する。

---

## 🆘 困った時

| 状況 | 連絡先 |
|---|---|
| 広告管理画面の権限 / 認証エラー | テンイチ |
| LP / HP のコード変更で迷ったら | テンイチ |
| 計測タグの確認 | テンイチ |
| 予算判断 | 吉田 |
| ブランド方針判断 | 吉田 |
| リード品質フィードバック | 小川 |
| 法務確認（比較広告・最上級表現） | Toyo |

---

*このドキュメントは 2026-05-31 時点のスナップショット。引き継ぎ完了後はヨシトが必要に応じて更新する。*
