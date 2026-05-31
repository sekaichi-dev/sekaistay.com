# SEKAI STAY 広告運用 引き継ぎ資料 — 本間ヨシト様

> **作成日**: 2026-05-31
> **作成者**: テンイチ
> **引き継ぎ先**: 本間ヨシト（リード獲得・マーケ責任者 / `design.7247@gmail.com`）
> **対象**: Google Ads / Meta Ads / X Ads の運用全権
> **目的**: テンイチが個別運用していた広告アカウント・戦略・既存資産をヨシトに完全移譲し、6月以降の運用責任者として独立稼働できる状態にする

---

## 0. このドキュメントの読み方

ヨシトが最初に読むべき順:

1. **§1 引き継ぎサマリー** — 全体像を5分で把握
2. **§2 役割分担と意思決定権限** — 何を自分で決めて何を確認するか
3. **§3-5 媒体別現況**（Google / Meta / X）— 各媒体の状態
4. **§9 すぐにやってほしいこと（次のステップ）** — 引き継ぎ後の最初の1週間

戦略の詳細（なぜこの設計か）は `STRATEGY_REPORT_*.md` 3本に集約済み。本ドキュメントは「現況スナップショット + 引き継ぎ事項」に絞っている。

---

## 1. 引き継ぎサマリー

### 体制の現状（2026-05-31 時点）

| 媒体 | 立ち上げ日 | 稼働状態 | 月予算枠 | 直近30日実績 |
|---|---|---|---|---|
| Google Ads | 2026-05-12 | 5キャンペーン稼働中 | ¥39万 | spend ¥164K / CV 10件 / 平均CPA ¥11-15K |
| Meta Ads | 2026-05-14 | 1キャンペーン学習期完了 | ¥10-13万（学習期）→ ¥9万（維持期） | 配信中・CV数値はAds Managerで要確認 |
| X Ads | 2026-05-18 | オーガニック先行 + Boost待機 | ¥15万 | 長文B投稿開始済・Promoted未開始 |
| **合計（暫定）** | — | — | **約 ¥55-60万/月** | — |

### 完了している主要マイルストーン

- ✅ 計測タグ完備（GA4・Google Ads CV・Meta Pixel・Meta CAPI）
- ✅ 3 LP variants 体制（`/switch` / `/switch/founder` / `/switch/portal`）+ A/Bテスト枠組
- ✅ 訴求3パターン（価格 / 信頼 / ポータル）× LPマッピング統一
- ✅ ジロー時代の広告残骸クリーンアップ完了（PEST URL Trigger Lead 偽CV 17,274件削除）
- ✅ 戦略レポート3本（Google/Meta/X）執筆済み
- ✅ 5/22 プロダクトローンチ + PR TIMES 配信実施済み
- ✅ Google Ads は API スナップショット自動化（`sekaichi-dashboard/scripts/snapshot-google-ads.mjs`）

### 未完了 / 引き継ぎ後に判断が必要なもの

- 🟡 GA4 (`G-B7M920RCGR`) 管理者権限がジロー所有のまま → 強化CV有効化がブロック中
- 🟡 Meta Pixel 2つ（`1658477098524563` + `989839370242915`）の統合判断
- 🟡 X Pixel 未取得・Promoted Post 配信開始判断
- 🟡 Meta Phase 2（Retargeting / Lookalike）の立ち上げタイミング（Pixel蓄積14日 / Lead 100件依存）

---

## 2. 役割分担と意思決定権限（吉蔵基準 / Human-in-the-Loop）

セカイチ全体の運用思想として「AI（てんちむ）は提案・観測、人間が判断・実行」を採用している。ヨシトの判断権限は以下の通り。

### ヨシト（マーケ責任者）が単独で判断・実行してよい

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

### 法務・契約系（要 Toyo / 義人 確認）

- 比較広告での競合社名使用
- 「No.1」「業界初」などの最上級表現
- 受賞表記の使用（媒体側の審査がある場合）

---

## 3. Google Ads（現況）

### 3-1. アカウント情報

| 項目 | 値 |
|---|---|
| アカウント名 | SEKAI STAY |
| Customer ID | `861-441-4795` (8614414795) |
| MCC経由 | `311-728-0923` (3117280923) |
| 通貨 / TZ | JPY / Asia/Tokyo |
| 管理者（現状） | テンイチ（`tenichi@sekaichi.org`） |
| アクセス追加方法 | Google Ads UI → ツール → アクセスとセキュリティ → ヨシトのGoogleアカウントを「管理者」または「標準」で招待 |

### 3-2. キャンペーン体制（直近30日実績・2026-05-28 snapshot）

| キャンペーン | 種別 | 訴求 | LP | 日予算 | Spend | Clicks | CV | CPA |
|---|---|---|---|---|---|---|---|---|
| SS-Generic-Price | SEARCH | 価格主導 | /switch | ¥10,000 | ¥88,426 | 131 | 8 | ¥11,053 |
| SS-Generic-Trust | SEARCH | 信頼主導 | /switch/founder | ¥1,000 | ¥20,097 | 21 | 0 | — |
| SS-Geo | SEARCH | 地名×業界 | /switch | ¥2,000 | ¥19,792 | 19 | 2 | ¥9,896 |
| SS-Generic-Portal | SEARCH | ポータル | /switch/portal | ¥1,000 | ¥17,861 | 29 | 0 | — |
| SS-Brand | SEARCH | 指名 | /switch | ¥1,000 | ¥5,232 | 11 | 0 | — |
| **合計** | — | — | — | **¥15,000/日** | **¥151,408** | 211 | 10 | — |

> 入札戦略: Price は `MAXIMIZE_CONVERSIONS`、他は `TARGET_SPEND`（学習データが集まっていないため）
> 旧キャンペーン `SS_Search_Switch_Core_202604` は REMOVED 済み（ジロー時代の残骸）

### 3-3. 効いているキーワード / 効いていないキーワード

**効いている（CV発生・直近30日）**:
- `民泊 代行` (PHRASE) → ¥45,620 spend / 3 CV / CPA ¥15,207
- `民泊 管理代行` (PHRASE) → ¥18,602 spend / 4 CV / CPA ¥4,651 ⭐ 最高効率
- `沖縄 民泊代行` (PHRASE) → ¥8,156 / 1 CV / CPA ¥8,156
- `民泊 運用代行` (PHRASE) → ¥5,986 / 1 CV / CPA ¥5,986
- `福岡 民泊代行` (PHRASE) → ¥2,977 / 1 CV / CPA ¥2,977 ⭐ 最高効率

**効いていない（spend あるが CV ゼロ）**:
- SS-Generic-Portal 全KW（民泊ポータル等）— 検索Vol は最大だが CV に至っていない
- SS-Generic-Trust 全KW（民泊代行 評判/口コミ/ランキング）— 同上
- SS-Brand `sekai stay` (EXACT) — ¥4,099 / 0 CV（指名なのに CV ゼロは要調査）

### 3-4. 否定キーワード設計

**共有リスト「SS共通-オフターゲット」** （ID: 12067846660・全キャンペーン適用）

19件: 求人 / 仕事 / バイト / 旅行 / 旅館 / ホテル / 予約 / 観光 / ブログ / 副業 / 宿泊 / ログイン / ゲスト / 清掃 求人 / やり方 / 始め方 / 登録方法 / 泊まりたい / airbnb ログイン

**SS-Generic-Price キャンペーンレベル**（11件）: 求人 / DIY / 資格 / 申請 / コンテスト / コンテンツ / コンサル / 個人事業主 / 駆けつけ / 住宅宿泊管理業 / 駆け付け

**競合社名の除外**（AdGroupレベル）: dent / コンパス / プレイス / バンク / weli / matatabi / リン / tabiii / pqd / エアサポ / オシエテ / sozonext / matsuri technologies / nakajitsu / all fortune partners / アンドヴィラ / clean-bnb / torayado / abc-booking / hudousanlink / コハダルーム / ペセン

### 3-5. CV 設定

| CV名 | ステータス | カテゴリ | Primary | ルックバック |
|---|---|---|---|---|
| SEKAI STAY (web) generate_lead | ENABLED | SUBMIT_LEAD_FORM | ✓ | 60日 |
| リードフォーム - 送信 | ENABLED | SUBMIT_LEAD_FORM |  | 1日 |
| SEKAI STAY (web) close_convert_lead | HIDDEN | CONVERTED_LEAD | — | 90日 |
| SEKAI STAY (web) qualify_lead | HIDDEN | QUALIFIED_LEAD | — | 90日 |
| SEKAI STAY (web) purchase | HIDDEN | PURCHASE | — | 90日 |

> 主CV = `SEKAI STAY (web) generate_lead`（GA4 import）

### 3-6. 戦略レポート

- 詳細: [`STRATEGY_REPORT_2026-05-12.md`](STRATEGY_REPORT_2026-05-12.md)（12章構成・全259行）
- キーワード一覧: [`google-ads/keyword-list.md`](google-ads/keyword-list.md)
- コピー一覧: [`google-ads/copy-drafts.md`](google-ads/copy-drafts.md)
- スナップショット再生成: `cd projects/sekaichi-dashboard && node scripts/snapshot-google-ads.mjs`

---

## 4. Meta Ads（現況）

### 4-1. アカウント情報

| 項目 | 値 |
|---|---|
| Business Manager | SEKAI STAY |
| Meta Pixel（メイン） | `1658477098524563` |
| Meta Pixel（追加・統合検討中） | `989839370242915` |
| Meta CAPI | 実装完了（`lib/meta-capi.ts`） |
| 環境変数（Vercel） | `META_PIXEL_ID` / `META_CAPI_TOKEN` / `META_CAPI_TEST_EVENT_CODE` / `META_ACCESS_TOKEN` / `META_AD_ACCOUNT_ID` |

### 4-2. キャンペーン体制

**Phase 1（学習期 14日・2026-05-14〜）**

| キャンペーン | Ad Set | 配置 | 日予算 | 入札戦略 |
|---|---|---|---|---|
| SS-Meta-Interest-202605 | AS_Interest_Airbnb_Hosts_JP_v1 | FB Feed + IG Feed のみ | ¥7,000 | 最大量（Highest Volume） |

**Phase 2（学習完了後・¥3,000/日 維持期）** ← 6月以降

| キャンペーン | 役割 | 立ち上げ条件 |
|---|---|---|
| SS-Meta-Interest（既存） | 維持配信 | Day 15 から ¥3,000/日 に減額 |
| SS-Meta-Retargeting | Pixel 訪問者追跡 | Pixel 14日蓄積完了後 |
| SS-Meta-Lookalike | 既存契約済オーナー 1% 類似 | Lead 母集団 100 件突破後 |

### 4-3. クリエイティブ（3パターン dynamic creative）

| 広告ID | 訴求 | LP | コピー要約 |
|---|---|---|---|
| AD_Trust_Founder_v1 | 信頼 | /switch/founder | 「民泊代行、まだ20%払っていませんか？」/ 業界半額×受賞運営 |
| AD_Price_20vs8_v1 | 価格 | /switch | 「手数料8%・業界半額」/ 最短2週間で切替 |
| AD_Portal_Dashboard_v1 | ポータル | /switch/portal | 「24h可視化のオーナーポータル」/ 全物件を一画面で |

> CTA は3広告とも `Learn More` で統一（A/Bテストの変数を減らす目的）
> 画像: `meta-ads/creatives/ss-price.png` / `ss-portal.png` / `ss-trust.png`（1254×1254）

### 4-4. ジロー時代の汚染履歴（クリーンアップ済）

| 旧資産 | 状態 | メモ |
|---|---|---|
| `SEKAI STAY_Lead_BroadVsNarrow_202605` | 🔻 Paused | PEST 由来偽 Lead で AI 学習汚染 |
| `SS_Conversion_Switch_Meta_202604` | 🔻 Paused | 同上 |
| `AS_Price_Switch_Broad_JP` | 🔻 Paused | 偽 Lead 17,274 件（CPL ¥1）で汚染 |
| `AD01_Loss_A` / `AD03_Compare_A` / `AD05_Service_A` | 🔻 Paused | 同上 |
| **PEST URL Trigger Lead 設定**（Pixel Event Setup Tool） | ✅ 削除済 | ハッシュリンク毎に Lead 誤発火する設定 |

⚠️ **重要**: 旧 active キャンペーン群はPause済みだが履歴は残してある。**新規 ad set を旧 ad set にぶら下げず、Clean Slate で新規立ち上げる**こと（AI 学習履歴の汚染を引き継がないため）。

### 4-5. 戦略レポート

- 詳細: [`STRATEGY_REPORT_META_2026-05-14.md`](STRATEGY_REPORT_META_2026-05-14.md)（13章構成・全370行）
- セットアップ手順: [`meta-ads/setup-draft.md`](meta-ads/setup-draft.md)
- オーディエンス設計: [`meta-ads/audience-targeting.md`](meta-ads/audience-targeting.md)
- CAPI セットアップ: [`setup-guides/meta-conversions-api.md`](setup-guides/meta-conversions-api.md)

---

## 5. X Ads（現況）

### 5-1. アカウント体制（3アカウント運用）

| アカウント | 担当 | 役割 | 投稿頻度 |
|---|---|---|---|
| **@tenichiliu** | テンイチ（本人） | 経営者目線・業界構造論・受賞PR | 通常×週5・長文B×週2・スレッドC×週1 |
| **@jirosan**（仮置きハンドル） | ジロー（本人） | 現場運用ノウハウ・OTA運用テクニック | 通常×週5・長文B×週2 |
| **@ss_unei_chan**（架空社員） | アバター運用 | 日常業務・家具選定・オーナー対応 | 通常×週4・長文B×週1 |

> 透明性: 架空社員 bio に「SEKAI STAY 運営チームメンバー」と明記（虚構ではなく実在運用チームのペルソナ化）

### 5-2. アカウント開設状況

| アカウント | 開設状況 | X Premium+ |
|---|---|---|
| @tenichiliu | ✅ 開設済 | ✅ 課金済（長文4000字解禁） |
| @jirosan（仮） | 開設要確認 | 開設後課金 |
| @ss_unei_chan | ⚠️ アカウント未作成 | 作成後OAuth実行で自動投稿即有効化可能 |

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

- ⚠️ X Pixel 未取得（`NEXT_PUBLIC_X_PIXEL_ID` env 未登録・ROADMAP Phase 3）
- ⚠️ Promoted Post 配信未開始（5/25 以降開始予定だったが、現在状況確認要）

### 5-6. KPI（3ヶ月）

| 指標 | M1（6月） | M2（7月） | M3（8月） |
|---|---|---|---|
| Combined Followers（テン+ジロー） | 1,500 | 3,000 | 5,000 |
| 月間 Impressions（3アカウント合算） | 100K | 300K | 600K |
| LP 流入（X → /switch*） | 80 | 250 | 500 |
| X リード（org + paid） | 3-5 | 8-12 | 15-20 |
| Promoted CPL | ¥10-15K | ¥7-12K | ¥5-10K |

### 5-7. 戦略レポート

- 詳細: [`STRATEGY_REPORT_X_2026-05-17.md`](STRATEGY_REPORT_X_2026-05-17.md)（12章構成・全338行）
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

数値は初月のテンタティブ。月次レビューで調整可能。

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
- AI が下書き、ヨシトが週次で「気づき」を追記する想定（テンイチが従来やっていた役割）
- 確定した学びは「恒久ナレッジ」セクションに昇格

### 8-3. 戦略レポート再生成

ad-ops/STRATEGY_REPORT_*.md は配信データが揃ったタイミングで週次更新。新たな戦略変更時はヨシトが作成し、レビューを義人 → テンイチの順に通す運用。

---

## 9. すぐにやってほしいこと（引き継ぎ後の最初の1週間）

### 🔴 Day 1（引き継ぎ当日）

- [ ] **Google Ads アクセス権付与**（テンイチが UI から招待 → ヨシトの Google アカウント `design.7247@gmail.com` 受諾）
- [ ] **Meta Business Manager アクセス権付与**（同上・ヨシトを管理者または広告主として追加）
- [ ] **3つの戦略レポートを通読**（Google / Meta / X・所要時間 約1時間）
- [ ] **このドキュメント（HANDOVER_YOSHITO_2026-05-31.md）を通読**
- [ ] テンイチと30分の引き継ぎMTG（質疑応答 + 直近の運用判断の意図共有）

### 🟡 Week 1（6/1〜6/7）

- [ ] **Google Ads 直近30日の検索クエリレポート確認** → 否定KW追加候補抽出
- [ ] **Meta Ads Day 14 振り返り**（学習期完了判定 → ¥3,000/日 維持期に切替判断）
- [ ] **Meta Phase 2 立ち上げ判断**:
  - SS-Meta-Retargeting（Pixel 14日蓄積完了していれば即可）
  - SS-Meta-Lookalike（Lead 母集団 100件突破していれば可。未達なら待機）
- [ ] **X Pixel 取得 + Vercel env 登録**（`NEXT_PUBLIC_X_PIXEL_ID`）
- [ ] **GA4 (G-B7M920RCGR) 権限移行**（ジロー → ヨシト・テンイチ）
  - ルート1: ジローが `@sekaichi.org` Workspace アカウントなら admin.google.com から権限移行（10分）
  - ルート2: ジロー直接連絡で権限追加依頼
  - ルート3: Google サポートに所有者復元申請
- [ ] **第1回 週次振り返り**（金曜・先週分の数値レビュー + 翌週の仮説立案）

### 🟢 Week 2-4（6/8〜6/30）

- [ ] **Meta Pixel 統合判断**（`1658477098524563` と `989839370242915` のどちらに寄せるか）
- [ ] **X Boost the Winners 開始**（オーガニック上位20%抽出 → Promoted化）
- [ ] **LP A/Bテスト勝者判定**（Z≥1.96 達成 variant の選定・敗者 archive）
- [ ] **6月実績で7月の予算配分見直し**（CPA 最良チャネルへ傾斜配分）

---

## 10. 既知の課題・未解決事項

| # | 課題 | 緊急度 | メモ |
|---|---|---|---|
| 1 | GA4 管理者権限がジロー所有のまま | 🟡 | 強化CV有効化のみブロック中。配信には影響なし |
| 2 | Meta Pixel 2つ並存（`1658477098524563` + `989839370242915`） | 🟡 | layout.tsx に追加Pixelハードコード。統合判断要 |
| 3 | X Pixel 未取得 | 🟡 | X Ads CV最適化が機能しない。早期取得推奨 |
| 4 | SS-Brand CV ゼロ | 🟠 | 指名検索 11 click あって CV ゼロは異常。LP着地後の挙動要調査 |
| 5 | SS-Generic-Portal / Trust の CV ゼロ | 🟠 | 価格主導以外のパターンは CV 出ていない。LP/コピーの磨き込みか媒体・KWの構造的問題かの切り分け要 |
| 6 | 5月のリード目標（75件）未達 | — | 戦略レポート §8 で「5月は実証期」に再定義済み。6-7月達成パスに移行 |

---

## 11. 主要コンタクト

| 名前 | 役割 | 連絡先 | いつ連絡するか |
|---|---|---|---|
| **吉田（事業責任者）** | SEKAI STAY 全体統括・予算承認 | `hikaru@sekaichi.org` | 月予算±20%超変更・KGI改訂・新規媒体追加 |
| **テンイチ（代表）** | プロダクト統括・LP実装・計測タグ | `tenichi@sekaichi.org` | LP構造変更・計測タグ追加・新規ドメイン追加 |
| **小川（営業）** | クロージング・CRM | `contact@sekaichi.org` | リード品質フィードバック・成約率連携 |
| **明神（独立営業）** | 営業 | `kojiro@sekaichi.org` | 営業導線の確認 |
| **Toyo（法務）** | 契約・法務 | — | 比較広告・最上級表現・受賞表記の審査確認 |
| **ジロー（X運用パートナー）** | コンテンツ運用 | — | X長文投稿スケジュール調整 |

組織図全体: `projects/sekai-stay-ops/data/info/org-chart.json`（ops.sekaistay.com で閲覧可能）

---

## 12. 主要ドキュメント・コード参照先

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

`~/.claude/projects/-Users-sekaichi-Desktop-claude-code/memory/project_sekai_stay_google_ads_learnings.md` — Google Ads の最新キャンペーン構造・キーワード設計・否定KW・CV設定・直近30日の変更履歴と実績（API 自動生成）

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

## 13. 引き継ぎ完了の判定基準

以下が全て揃ったら引き継ぎ完了とする:

- [ ] ヨシトが Google Ads / Meta Ads / X Ads の全管理画面に自分のアカウントでログインできる
- [ ] ヨシトが戦略レポート3本 + このドキュメントを通読済み
- [ ] テンイチとの引き継ぎMTGを実施（30-60分）
- [ ] 第1回週次振り返り（金曜）を実施
- [ ] 引き継ぎ後 2週間以内に、ヨシトが独立して1つ以上の運用判断を実行（予算変更 / 入札変更 / KW追加 / クリエイティブ差替えなど）

完了後、ヨシトは月次で吉田に進捗報告、随時テンイチにプロダクト連動の相談、という運用に移行する。

---

*このドキュメントは 2026-05-31 時点のスナップショット。引き継ぎ完了後はヨシトが必要に応じて更新する。*
