# SEKAI STAY Meta 広告 戦略レポート

> **作成日**: 2026-05-14
> **作成者**: テンイチ
> **目的**: Meta（Facebook + Instagram）広告の戦略・オーディエンス・クリエイティブ・計測の合意
> **姉妹**: [Google 広告](STRATEGY_REPORT_2026-05-12.md) / [X 広告](STRATEGY_REPORT_X_2026-05-17.md)
>
> ⚠️ **現況スナップショット（2026-06-01）**: Meta Ads は **🔴 停止中**。Phase 1 計画は実態と乖離。再開条件・改善方針はテンイチ承認待ち。最新状況は [HANDOVER_YOSHITO §4](HANDOVER_YOSHITO_2026-05-31.md) 参照。

---

## 1. エグゼクティブサマリー

- **2026-05-14 に Meta 広告 Clean Slate 立ち上げ** — ジロー時代の汚染履歴を全て pause し、新キャンペーン `SS-Meta-Interest-202605` を1 ad set + 3 クリエイティブ集中配信で開始
- 学習期予算 **¥7,000/日**（Meta AI 学習基準 50 CV/週を物理的に満たすため逆算）、Day 15 以降は ¥3,000/日 に減額する 2 段階予算設計
- **Meta CAPI 実装完了**（`lib/meta-capi.ts`・サーバーサイド送信 + クライアント Pixel と dedup）。EMQ 8+ が現実的に出る計測スタック
- ジロー時代の致命的不具合 **PEST URL Trigger Lead**（ハッシュリンク毎に Lead 誤発火・既存 ad set の Meta AI 最適化が偽 Lead で全部汚染）を発見・削除
- Google と統一の **3 訴求パターン（価格 / ポータル / 信頼）× 3 LP variant** を Meta dynamic creative で並走し、Day 7 にクリエイティブ別 breakdown で勝者判定する設計
- **5 月の月 25 リード目標は Meta 単体では非現実的**（学習期 14 日 + 残り 4 日のみ・現実目標は 5-15 件）。6 月以降に達成可能（後述）

---

## 2. キャンペーン体制（2026-05-14 立ち上げ予定）

### 2-1. Phase 0（即・Clean Slate 実行）

| 既存資産 | 状態 | 処理 |
|---|---|---|
| `SEKAI STAY_Lead_BroadVsNarrow_202605` | ジロー残骸・PEST 由来偽 Lead で AI 学習汚染 | 🔻 Pause（履歴は保持・削除しない） |
| `SS_Conversion_Switch_Meta_202604` | 同上 | 🔻 Pause |
| `AS_Price_Switch_Broad_JP`（active） | 偽 Lead 17,274 件・CPL ¥1 で学習汚染 | 🔻 Pause |
| `AD01_Loss_A` / `AD03_Compare_A` / `AD05_Service_A`（active） | 同上 | 🔻 Pause |

> **なぜ Clean Slate か**: 既存 ad set / ad の最適化履歴は PEST 由来の偽 Lead（¥1〜¥7/lead = B2B 民泊代行では物理不可能）で全部汚染。Meta AI は「偽 Lead 方向」で学習済みなので、新クリエイティブを既存 ad set に載せても誤学習が引き継がれる。**サルベージは非推奨**（v1 → v2 改訂）。

### 2-2. Phase 1（2026-05-14〜 学習期 14 日）

| キャンペーン | 訴求パターン | LP | 日予算 | 月予算（暫定） | オーディエンス |
|---|---|---|---|---|---|
| **SS-Meta-Interest-202605** | 3 パターン dynamic creative | `/switch` × `/switch/portal` × `/switch/founder` | ¥7,000 | ¥98,000（14 日） | Airbnb / Vrbo / Booking.com / Superhost / 民泊 興味関心 30-65 歳 |

**1 ad set 構成 `AS_Interest_Airbnb_Hosts_JP_v1`**:
- コンバージョンイベント: **Lead**（Pixel + CAPI dedup 済み）
- 入札戦略: **最大量（Highest volume）** — 学習期は CPA キャップ NG
- コンバージョンウィンドウ: クリック後 7 日 + 視聴後 1 日
- 配置: **Facebook Feed + Instagram Feed のみ**（Audience Network / Messenger / Stories / Reels は OFF）
- Advantage+ 配置 / 詳細ターゲット拡張: **OFF**（学習期は精度優先）

### 2-3. Phase 2（Day 15+ 学習完了後・¥3,000/日 維持期）

| キャンペーン | 目的 | 立ち上げ条件 |
|---|---|---|
| **SS-Meta-Retargeting** | Pixel 訪問者を追いかける（最も CV 安い） | Pixel 14 日蓄積後・カスタムオーディエンス利用可になり次第 |
| **SS-Meta-Lookalike** | 自社 CRM 契約済みオーナー 1% 類似 | Lead 母集団 100 件突破後 |
| **SS-Meta-Interest**（既存） | 維持配信 | Day 15 から ¥3,000/日 に減額 |

> 設計詳細: [`ad-ops/meta-ads/audience-targeting.md`](meta-ads/audience-targeting.md)

---

## 3. 訴求パターン × LP マッピング（Google/Meta 統一）

| パターン | 訴求軸 | LP | クリエイティブ |
|---|---|---|---|
| **価格主導** | 業界相場の半額・手数料 8% | `/switch` | `creatives/ss-price.png`（1254×1254） |
| **ポータル主導** | 24h ダッシュボード・運営の可視化 | `/switch/portal` | `creatives/ss-portal.png`（1254×1254） |
| **信頼主導** | スーパーホスト多数認定・受賞実績 | `/switch/founder` | `creatives/ss-trust.png`（1254×1254） |

**Meta は同一 ad set に 3 クリエイティブを並走**（Meta dynamic creative で勝者を自動判定）。Google 公式の A/B test 機能（別 ad set 配信）は予算分散になるので使わない。Day 7 にクリエイティブ別 breakdown で勝者判定する設計。

---

## 4. クリエイティブ設計（誇大表現リスクの全面修正）

### 4-1. コピーライティング原則（2026-05-14 確立）

| ❌ NG パターン | 理由 | ✅ 修正方向 |
|---|---|---|
| 「運営の質を落とさず」「品質を維持しながら」 | ネガティブ・フレーミング（「落とす」「失う」可能性を脳に植える・心理学的逆効果） | 自社実績で品質を立証（「スーパーホスト多数認定の運営力で」） |
| 「他の代行は手数料 20% だが質が良い・我々は同等」 | 競合品質を仮定 → 競合で品質不満のスイッチ検討層を否定する形になる | 比較不要・自社の客観事実だけで構築 |
| 「創業者が直接対応」「代表が直接ご相談」 | 実態は営業 = 小川 / 松本、CS = 吉田 が対応 → 景表法リスク | 削除（「業界半額 × 受賞運営」に置換） |
| 「創業者の想い」「日本初の AI 民泊代行」 | 無名創業者の権威借用は刺さらない・AI ハイプ感がブランドと不一致 | 「業界の常識を変える」「Airbnb スーパーホスト多数認定」 |
| 「コストを下げる」（コスト視点） | オーナー視点では弱い | 「手残りを最大化」（価値視点） |

### 4-2. 信頼訴求の設計原則（2026-05-14 確立）

SEKAI STAY 創業者は公開上は無名のため「個人ブランド信頼」は機能しない。**信頼軸は実績（受賞・認定）+ 客観的数字（8%）+ 比較（業界 20%）で構築する**。`ss-trust.png` の創業者顔出し画像は「人間味・親近感」の役割であって「権威の借用」ではない。

### 4-3. 採用された強い訴求（ファクトベース）

- **「業界相場の半額・手数料 8%」** — 業界 15-25% vs 自社 8% = 半額は事実
- **「Airbnb スーパーホスト多数認定」** — 各オーナーアカウントを育成しスーパーホスト化する USP
- **「BEST OF SAUNA STAY 2026 受賞」** — 第三者権威の最強訴求（民泊革命プレスリリース・The Lake House／長野県上水内郡）
- **「業界の常識を変える」** — AI ハイプを避けつつブランドストーリーを示唆
- **「最短 2 週間で切替」** — 行動の心理的ハードルを下げる具体的時間軸
- **「全物件の収益を一画面で」** — ポータル USP の複数物件オーナー訴求
- **「24 時間オーナーダッシュボード」** — Portal の機能訴求

### 4-4. 3 広告の最終コピー

#### AD_Trust_Founder_v1 — 初動最強シグナル

```
プライマリ:
民泊代行、まだ20%払っていませんか？
SEKAI STAYは手数料8%でAirbnbスーパーホスト多数認定・BEST OF SAUNA STAY 2026受賞。
業界の常識を変える運営体制で、オーナー様の手残りを最大化します。

見出し: 民泊代行の常識を変える
説明: 業界半額×受賞運営
CTA: Learn More → /switch/founder
```

#### AD_Price_20vs8_v1

```
プライマリ:
民泊運用代行の手数料、相場の半額にできます。SEKAI STAYは手数料8%。
Airbnbスーパーホスト多数認定の運営力で、オーナー様の手残りを最大化します。最短2週間で切替可能。

見出し: 手数料8%・業界半額
説明: 最短2週間で切替
CTA: Learn More → /switch
```

#### AD_Portal_Dashboard_v1

```
プライマリ:
「自分の物件、今いくら稼いでる？」がスマホで一目でわかる。
SEKAI STAYは24時間オーナーダッシュボード標準装備。
稼働率・収益・レビュー・清掃状況をリアルタイムで確認できます。

見出し: 24h可視化のオーナーポータル
説明: 全物件を一画面で
CTA: Learn More → /switch/portal
```

### 4-5. CTA 統一（2026-05-14 確立）

3 広告とも **Learn More** で統一。CTA を変数にすると A/B テストでクリエイティブの純粋な効果が見えなくなる。Learn More が選ばれる理由:
- LP の動線（無料診断レポート取得）は「情報収集」体験 → Contact Us より整合する
- Meta Lead 広告で最も CTR が高い CTA
- Yoshizo 原則: 変数を減らせば学習が速い

---

## 5. オーディエンス戦略

### 5-1. Phase 1（学習期）— Interest 1 セット集中

| 項目 | 設定値 | 根拠 |
|---|---|---|
| 地域 | 日本（全国） | 物件可能エリアを限定しない |
| 年齢 | **30〜65 歳** | 民泊オーナー層の主要レンジ |
| 性別 | すべて | 男女比制約なし |
| 詳細ターゲット | `Airbnb` OR `Vrbo` OR `Booking.com` OR `Superhost` OR `民泊` | 検索 vs Meta の違い: 「興味関心」で潜在層を発掘 |
| 言語 | 日本語 | — |
| 詳細ターゲット拡張 | **OFF** | 学習期は精度優先 |

### 5-2. Phase 2（Day 15+）— 3 キャンペーン構造

| Campaign | 狙い | 想定 CPL |
|---|---|---|
| **SS-Meta-Retargeting** | Pixel 訪問者を追いかける | ¥4,000 |
| **SS-Meta-Lookalike** | 既存契約済みオーナー 1% 類似で新規層スケール | ¥8,000 |
| **SS-Meta-Interest** | 興味関心ターゲ・新規発掘 | ¥12,000 |

オーディエンス重複管理: Retargeting → Lookalike → Interest と熱量降順で **下位キャンペーンから上位対象を除外**する設計（自分のキャンペーン同士で入札合戦して CPC が上がるのを防ぐ）。

### 5-3. オーディエンス除外（重要）

- **既存契約済みオーナー CSV** — 自社 CRM からエクスポート（100 件以上あれば LAL ソース兼用）
- **LINE@ 友だちリスト** — 既にナーチャリング中なので除外

---

## 6. 計測体制（2026-05-13 完成・Google と共通基盤）

### 6-1. 計測スタック

```
ユーザー
  ↓
Meta 広告クリック
  ↓
LP /switch* （Meta Pixel + GA4 設置）
  ↓
フォーム送信 → POST /api/report-requests/submit
  ↓ 3 系統並列転送
  ├─ Supabase lead_submissions（保存・raw 一次保管）
  ├─ 吉蔵 CRM（forwardLead）
  └─ Meta CAPI（sendMetaCapiLead・hashed PII 付き）
  ↓
クライアント側で fbq('Lead', { eventID }) + gtag('generate_lead') 発火
  ↓
Meta Ads CV「Lead」（Pixel + CAPI dedup・EMQ 8+ 想定）
```

### 6-2. 計測 ID 一覧

- **Meta Pixel**: `1658477098524563`（client `fbq` = `app/layout.tsx` ハードコード / server CAPI = `META_PIXEL_ID` env）
- **Meta CAPI**: `META_CAPI_TOKEN` + `META_CAPI_TEST_EVENT_CODE`（Vercel env 管理）
- **GA4**: `G-B7M920RCGR`（Google 戦略と共通）

> ⚠️ **2026-06-01 修正**: 過去ドキュメントで「追加 Pixel `989839370242915`」と記載していたが、**実コード上は元々 1 Pixel のみ**。ROADMAP.md の記述が誤記だった。同時に `META_PIXEL_ID` env が空で CAPI が skip していた問題も修正済み（`1658477098524563` を env 設定）。

### 6-3. CV 設計

| CV 名 | ソース | EMQ 想定 | 用途 |
|---|---|---|---|
| **Lead**（Meta Pixel + CAPI） | フォーム送信 | 8+（PII 完全 hash 送信） | Meta Ads CV 最適化対象 |

### 6-4. UTM 設計

```
?utm_source=meta
&utm_medium=cpc
&utm_campaign=SS-Meta-Interest-202605
&utm_content=trust-founders-v1 | price-20vs8-v1 | portal-dashboard-v1
&utm_term=trust | price | portal
```

`lp_variant` は `<PageViewTracker>` 経由で GA4 / Meta Pixel / Supabase に伝播。LP からダッシュボードまで紐付く設計。

---

## 7. ジロー時代の広告残骸クリーンアップ（2026-05-12〜2026-05-14 実施）

| # | 問題 | 状態 |
|---|---|---|
| 1 | **PEST URL Trigger Lead**: Meta Pixel Event Setup Tool で `URL contains "#"` を Lead トリガー設定。ハッシュリンク毎に Lead 誤発火 → 過去 1 ヶ月の CV 計測が壊滅、Meta AI 学習も汚染 | ✅ 削除済 |
| 2 | **既存キャンペーン 2 本（汚染履歴）**: `SEKAI STAY_Lead_BroadVsNarrow_202605` / `SS_Conversion_Switch_Meta_202604` | 🔻 Pause 予定（2026-05-14 launch 前） |
| 3 | **既存 Ad set 8 本（うち 1 active）**: `AS_Price_Switch_Broad_JP` が偽 Lead 16,055 件で AI 学習汚染 | 🔻 Pause 予定 |
| 4 | **既存 Ads 16 本（うち 3 active）**: `AD01_Loss_A` / `AD03_Compare_A` / `AD05_Service_A` | 🔻 Pause 予定 |
| 5 | **Lead 過剰計上 17,274 件 (CPL ¥1)**: PEST 由来・物理不可能な数字 | ✅ 原因除去済（PEST 削除後は減少見込み） |

### Step 0（テンイチ即実行）— 真のデータ確認

Ads Manager の **日付フィルタを「2026-05-13 以降」に変更** → PEST 削除後のクリーンな数字を確認。もし依然として ¥10 未満/lead なら、PEST 以外にも Lead 発火源がある可能性 → 配信開始前に Pixel Helper で要調査。

---

## 8. 5 月の現実的目標 vs 当初目標

### 8-1. 当初目標と現実のギャップ

| 指標 | 当初目標 | 5 月実現可能性 |
|---|---|---|
| **月予算消化** | ¥240,000（¥8,000/日 × 30 日） | 物理不可（**¥7,000 × 18 日 ≈ ¥126,000** で 5 月終了） |
| **月リード獲得** | 25 件 | 物理不可（**学習期 14 日 + 残り 4 日**で 5-15 件想定） |

### 8-2. なぜギャップが生じたか

1. **5/14 立ち上げで 5 月稼働日は 18 日のみ**（30 日想定の予算組み）
2. **Clean Slate で学習履歴ゼロから開始** — Meta AI は最初 50 CV を蓄積するまで配信精度が安定しない（通常 14 日）
3. **学習期は予算消化効率 50-70%**（Meta AI が CV データを集めながら最適化）
4. **Retargeting / Lookalike キャンペーンは Pixel 蓄積 14 日後 / Lead 100 件後にしか立ち上げられない**（依存関係）

### 8-3. 推奨：目標を期間ベースで再定義

| 期間 | 性質 | 現実的目標 |
|---|---|---|
| **5 月後半（学習期）** | データ蓄積 | 消化 ¥10-13 万 / リード 5-15 件 |
| **6 月（Retargeting + Lookalike 追加）** | 本格運用 | 消化 ¥20-25 万 / リード 15-30 件 |
| **7 月以降（最適化期）** | チューニング後 | 消化 ¥24 万 / リード 25 件達成 |

→ 「5 月で 25 件達成」を「**5 月は実証・データ蓄積期間**」と再定義することで、6-7 月の実達成パスが見える。

---

## 9. 配信後モニタリング設計

### Day 1（launch 翌朝）
- [ ] 3 広告とも「配信中」ステータス
- [ ] Pixel イベント発火確認（Meta Events Manager → Test Events）
- [ ] CAPI イベント発火確認（同上・Server サイド）
- [ ] 予算消化ペース（¥7,000/日 に対する進捗）
- [ ] UTM パラメータが Supabase `lead_submissions` テーブルに記録されているか

### Day 3
- [ ] 各広告のインプレッション・クリック・CTR
- [ ] フリークエンシー（5 超で警戒）
- [ ] CV 発生有無
- [ ] **真の CPL（¥3,000-12,000 範囲か）** — もし再び ¥100 未満なら Pixel 設定要再確認

### Day 7（学習期完了見込み）
- [ ] CPL 確認（目標 ¥12,000 以下）
- [ ] **クリエイティブ別 breakdown で 3 パターンの CPL 比較**
  - 勝者は配信継続
  - CPL が他の 2 倍以上 + impression 十分配信されている負け 1 本は OFF
  - 3 本とも近い場合は全部継続して data 蓄積

### Day 14（学習完了想定・Step 2 ゲート）
- [ ] 予算を学習期 ¥7,000/日 → 維持期 ¥3,000/日 に減額
- [ ] **SS-Meta-Retargeting キャンペーン立ち上げ判断**（Pixel 14 日蓄積・カスタムオーディエンス利用可）
- [ ] Lead 母集団 100 件突破していれば **SS-Meta-Lookalike** 立ち上げ判断

### 異常検知ライン（即停止判断）
- 単一広告セットで ¥10,000 消化 + CV=0
- CPL が ¥20,000 超で 3 日継続
- フリークエンシー 5 超
- **CPL が ¥100 未満で推移（= Pixel 計測がまた壊れているサイン）**

---

## 10. 次のステップ（優先順）

### 🔴 今日中（2026-05-14）

- [ ] 既存 Active キャンペーン / ad set / ad の **Clean Slate Pause 実行**（テンイチ）
- [ ] 真のデータ確認（日付フィルタ「2026-05-13 以降」・1 分）
- [ ] **新 Campaign `SS-Meta-Interest-202605` 立ち上げ**（テンイチが Ads Manager で実行）
- [ ] 義人さん（事業責任者）レビュー受けて戦略修正

### 🟡 今週中（5/14-5/20）

- [ ] Day 1-3 モニタリング・Pixel/CAPI 発火確認
- [ ] 自社 CRM 既存契約済みオーナー CSV エクスポート（除外用 + 将来 LAL ソース）
- [ ] LINE@ 友だちリスト除外用 CSV 確認
- [x] ~~Meta Pixel `989839370242915` の `1658477098524563` への統合判断~~ → **解決済み（2026-06-01）**: `989839370242915` は 2026-05-10 の誤切替の名残・コードは既に `1658477098524563` 統一・env も登録済み

### 🟢 月末〜来月（5/21-6/15）

- [ ] Day 7 breakdown で勝者クリエイティブ判定
- [ ] Day 14 予算減額 + Retargeting キャンペーン立ち上げ
- [ ] Lead 100 件達成日に Lookalike キャンペーン立ち上げ
- [ ] 6 月本格運用への移行プラン策定

---

## 11. 義人さんへの確認事項

事業視点で以下のレビューをお願いします:

1. **Clean Slate 方針への合意**: 既存 active キャンペーン（PEST 由来偽 Lead で AI 学習汚染）を Pause して新規立ち上げに切り替える方針でよいか？「過去履歴をサルベージ」案は AI 誤学習を引き継ぐリスクで非推奨にしています
2. **5 月の現実的目標再設定への合意**: ¥24 万消化・25 件は 5 月では物理不可。¥10-13 万消化・5-15 件に再設定し、6-7 月で本来目標達成する流れでよいか？
3. **訴求パターン優先順位**: 価格 / ポータル / 信頼の 3 パターンを Meta dynamic creative で並走しますが、事業戦略的に最も伸ばしたいパターンはあるか？（Day 7 以降の予算再配分の判断材料）
4. **自社 CRM 既存契約済みオーナー CSV 提供**: 除外用 + 将来 LAL ソース。100 件以上ありそうか？
5. **LINE@ 友だちリスト除外**: 既にナーチャリング中なら除外。エクスポート可能か？
6. ~~**追加 Pixel `989839370242915`** の統合判断~~ → **2026-06-01 解決済み**: 2026-05-10 の誤切替の名残でコードは既に `1658477098524563` 単一・env も登録済み・CAPI 発火再開

---

## 12. 関連ドキュメント

- [`ad-ops/STRATEGY_REPORT_2026-05-12.md`](STRATEGY_REPORT_2026-05-12.md) — Google 広告戦略レポート（姉妹資料）
- [`ad-ops/README.md`](README.md) — 運用基盤・役割分担・KGI
- [`ad-ops/meta-ads/setup-draft.md`](meta-ads/setup-draft.md) — Ads Manager 画面遷移順セットアップ手順（v2 改訂版）
- [`ad-ops/meta-ads/audience-targeting.md`](meta-ads/audience-targeting.md) — 3 キャンペーン構造のオーディエンス設計
- [`ad-ops/meta-ads/copy-drafts.md`](meta-ads/copy-drafts.md) — 全コピー候補集
- [`ad-ops/meta-ads/creatives/MANIFEST.md`](meta-ads/creatives/MANIFEST.md) — クリエイティブ画像マニフェスト
- [`ad-ops/setup-guides/meta-conversions-api.md`](setup-guides/meta-conversions-api.md) — CAPI セットアップ手順
- [`ad-ops/learnings.md`](learnings.md) — 仮説・試行・学びの蓄積ログ
- メモリ: `~/.claude/projects/-Users-sekaichi-Desktop-claude-code/memory/project_sekai_stay.md`

---

## 13. 用語集

- **PEST (Pixel Event Setup Tool)**: Meta Pixel の URL ベース Lead 自動検出機能（ジロー残骸の根本原因）
- **EMQ (Event Match Quality)**: Meta 広告での CV 品質スコア（PII ハッシュ精度）。10 点満点で 8 以上が理想
- **CAPI (Conversions API)**: Meta のサーバーサイド CV 送信。クライアント Pixel と組み合わせ dedup 設計
- **Dynamic Creative**: 同一 ad set 内に複数クリエイティブを入れ、Meta AI が自動で勝者を判定する機能
- **Lookalike Audience (LAL)**: 既存ソース（顧客 / 訪問者 / リード）に類似する新規層を Meta AI が発掘する機能。1% = 最高精度・3% = 母集団広め
- **学習期 (Learning Phase)**: Meta AI が CV データを蓄積して入札を最適化する期間（通常 14 日 / 50 CV 必要）
- **Clean Slate**: 過去履歴（汚染含む）を捨てて新規立ち上げする方針
- **CBO (Campaign Budget Optimization)**: キャンペーン単位の予算自動配分機能。学習期は OFF 推奨（分岐を減らす）

---

*このレポートは 2026-05-14 時点のスナップショット。配信データが揃ったら週次でアップデート予定（姉妹レポート Google 戦略と同じサイクル）。*
