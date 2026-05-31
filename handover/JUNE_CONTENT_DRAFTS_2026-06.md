# 2026-06 オーガニック投稿コンテンツドラフト設計

> **作成日**: 2026-06-01 / **対象期間**: 2026-06-01 〜 2026-06-30
> **戻る**: [HANDOVER_YOSHITO.md](../HANDOVER_YOSHITO.md)
> **データソース**: [sekaichi-dashboard.vercel.app/sekai-stay/lead](https://sekaichi-dashboard.vercel.app/sekai-stay/lead)（コンテンツ軸 5本柱 + X 架空社員 4本柱）
> **ドラフト本体 (Sheet)**: [Cascade Tracker（X Pipeline + note Pipeline）](https://docs.google.com/spreadsheets/d/19qsHLdmIex59mj-xABMbF4jCatHoy6SN7LE8x4EzWVY/edit?gid=185326281)

---

## ⚡ 設計コンセプト

主戦場は **X（テンイチ + 架空社員）+ note + 自社HP + 比較メディア** の 4チャネル。

| 軸 | 対象 | 視点 |
|---|---|---|
| **5本柱**（オーナー向け） | X (@tenichiliu) + note + 自社HP + 比較メディア | オーナー視点の知識・実例 |
| **4本柱**（プロダクト軸） | X (@ss_unei_chan) 架空社員のみ | SEKAI STAY プロダクト中身の話 |

両軸 **週1で話題ローテ**。実際のドラフト本文は Sheet で管理（人間が確認しやすい形式）。

---

## ⚠️ 対象から外したチャネル

| チャネル | 理由 |
|---|---|
| **X (@jirosan)** | ジロー本人が顔出しで投稿しているので AI 文面の許容ゼロ。自動投稿対象外・本人が手動で適宜投稿 |
| **Facebook** | テンイチ・ジローのコネクションが実の友達なので、**発表の場としてマイルストーン/プロダクトリリース時のみ**運用。通常投稿対象外 |
| **LinkedIn** | GTMBPO の発信がすでに流れていてキャラがブレるため SEKAI STAY としては **対象外** |

---

## 1. オーガニック獲得 5本柱（オーナー向け）

### 1-1. 軸一覧

| # | 軸 | 内容 | 例 |
|---|---|---|---|
| 1 | **オーナー成功事例** | 運用代行切替/AIエージェント導入で粗利向上した実例 | 築20年戸建で稼働率35→78% |
| 2 | **おすすめ民泊家具・アメニティ** | ゲスト満足度・レビュー向上の家具/家電/アメニティ | レビュー4.9維持の必須アメニティ10選 |
| 3 | **OTA運用テクニック** | Airbnb/Booking.com/一休 別最適化・写真・タイトル・DP | Airbnbタイトル改善でCTR2倍 |
| 4 | **法務・制度** | 特区民泊／旅館業／民泊新法・届出フロー | 物件用途別最適制度の使い分け |
| 5 | **業界トレンド・データ** | インバウンド需要・地域別稼働率・競合動向・金利影響 | インバウンド回復データ2026 |

### 1-2. チャネル別 6月頻度

| チャネル | 担当 | 6月本数 | 5本柱の回し方 |
|---|---|---:|---|
| **X (@tenichiliu)** | テンイチ（自動投稿パイプライン経由・ドラフトはSheet） | **10本**（週 2-3本） | 5軸 × 2周ローテ（T-5〜T-14） |
| **X (@ss_unei_chan)** | テンイチがドラフト供給・cron 立ち上げ後自動投稿 | **22本**（週 5-6本） | **別軸=4本柱**（後述§2） |
| **note** | テンイチ | **4本** | 5軸ローテ（N-4〜N-7） |
| **自社HP** | テンイチ | **3-4本** | 5軸ローテ・X 長文B → note → HP のカスケード（SEO蓄積） |
| **比較メディア** | テンイチ | 月1本 | 軸3「OTA運用テクニック」軸で深掘り（5社比較記事の派生） |

---

## 2. X（架空社員）プロダクト軸 4本柱（週1ローテ）

### 2-1. 軸一覧

| # | 軸 | 内容 |
|---|---|---|
| 1 | **AIエージェント機能** | 料金最適化AI/自動応答/レビュー対応など |
| 2 | **物件管理ダッシュボード** | オーナーポータル/KPI可視化/収益レポート |
| 3 | **運用フロー設計** | AI×人間の分業/トラブル対応/エスカレーション |
| 4 | **プロダクト進化** | 開発ロードマップ/新機能テスト/UF反映 |

### 2-2. 6月 週次ローテ（@ss_unei_chan）

| 週 | 期間 | 軸 | ID | 想定投稿数 |
|---|---|---|---|---:|
| W1 | 6/1-6/7 | 軸1 AIエージェント機能 | U-7〜U-12 | 6本 |
| W2 | 6/8-6/14 | 軸2 物件管理ダッシュボード | U-13〜U-18 | 6本 |
| W3 | 6/15-6/21 | 軸3 運用フロー設計 | U-19〜U-23 | 5本 |
| W4 | 6/22-6/28 | 軸4 プロダクト進化 | U-24〜U-28 | 5本 |
| W5 | 6/29-6/30 | （バッファ・本数調整用） | — | — |

合計 **22本/月**

---

## 3. ドラフト本体（Sheet）

実際の投稿内容（Topic/Hook・Publish Date・LP送客先・Full Draft Content）は **下記 Sheet で管理**:

### 3-1. X Pipeline
- URL: https://docs.google.com/spreadsheets/d/19qsHLdmIex59mj-xABMbF4jCatHoy6SN7LE8x4EzWVY/edit?gid=185326281
- 列: ID / Account / Pillar / Topic/Hook / LP送客先 / Publish Date / Notes / Full Draft Content / Tweet URL / Tweet Status / Image URL / Image Status
- 6月分追加済み: T-5〜T-14（@tenichiliu 10本）+ U-7〜U-28（@ss_unei_chan 22本）合計 **32 本**

### 3-2. note Pipeline
- URL: https://docs.google.com/spreadsheets/d/19qsHLdmIex59mj-xABMbF4jCatHoy6SN7LE8x4EzWVY/edit?gid=1392438780
- 列: ID / Type / Pillar / Title / LP送客先 / Publish Date
- 6月分追加済み: N-4〜N-7 合計 **4本**

### 3-3. Strategy（戦略 overview）
- URL: https://docs.google.com/spreadsheets/d/19qsHLdmIex59mj-xABMbF4jCatHoy6SN7LE8x4EzWVY/edit?gid=1990050856
- T+0 X → T+3-5d note → T+7-10d HP のカスケード戦略・KPI 目標

---

## 4. ワークフロー

```
1. Sheet で投稿企画（Topic/Hook を Pillar に沿って起案）
   ↓
2. テンイチが Full Draft Content を書き込み（Sheet 上）
   ↓
3. テンイチが内容承認後、Tweet Status を "ready" に
   ↓
4. cron が "ready" を拾って実投稿 → Tweet URL を書き戻し
   ↓
5. T+3-5d: X 長文 → note に転載（note Pipeline）
   ↓
6. T+7-10d: noteスキ≥10 or PV≥500 の上位50% → 自社HP に正本掲載
```

⚠️ **現状 cron は未配置**。立ち上げまでは X (@ss_unei_chan) は手動投稿、@tenichiliu は既存パイプライン経由。

---

## 5. プラットフォーム別ポリシー（重要・抜粋）

詳細はブランド §1 + SNS §3 参照。

| 媒体 | AI 言及 | トーン |
|---|---|---|
| **X (@tenichiliu)** | ✅ OK | 控えめ・現場感重視・経営者目線 |
| **X (@ss_unei_chan)** | ✅ OK（積極的） | プロダクトの中身を語る運用マネージャー視点 |
| **note** | ❌ 禁止（「AI化」→「仕組み化」） | AI感ゼロ・地方おじさん向け・物語性重視 |
| **自社HP** | ❌ 禁止 | 控えめ・SEO最適化 |
| **比較メディア** | ❌ 禁止 | 客観事実重視 |

### コピー NG（全媒体共通）
- 「1人で100物件以上」「業界もっとも〜」→ NG
- スーパーホスト認定は「自慢」でなく「運営力が生きてくる」程度
- 業者目線の言葉（「最近相談される」等）→ NG。オーナー視点で書く

---

## 6. 関連ファイル

| ファイル | 用途 |
|---|---|
| `projects/sekaichi-x/` | X 自動投稿パイプライン（cron 未配置・要立ち上げ） |
| `handover/SNS_2026-05-31.md` | SNS 引き継ぎ（チャネル別運用詳細） |
| `handover/BRAND_GUIDELINES_2026-05-31.md` | コピー・トーン規約 |
| Dashboard: `/sekai-stay/lead` | 5本柱・4本柱の正本（戦略変更時はこちらが先） |
| Cascade Tracker Sheet | ドラフト本体・投稿スケジュール（人間が確認・編集する場） |

---

## 7. このドキュメントの位置付け

- **6月の月次設計のスナップショット**。週次でテンイチ + ヨシトが見直し可
- **個別投稿のドラフトは Sheet で管理**（人間が読みやすい・編集しやすい形）
- ローテ順は厳密ではなく、その日の話題性で前後入れ替え可
- **7月分は別ドキュメント（`JULY_CONTENT_DRAFTS_2026-07.md`）+ Sheet 続行で更新**
