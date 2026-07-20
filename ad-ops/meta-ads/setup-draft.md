# SS-Meta-Interest セットアップ下書き (v2 — ジロー資産対応版)

> **対象**: テンイチが Meta Ads Manager で初回配信を立ち上げるための画面遷移順ガイド。
>
> **前提**: Meta Pixel・CAPI・Domain Verification・PEST URL Trigger Lead 削除すべて完了済み (2026-05-13 時点)。
>
> **AI の役割**: 設定値の下書き。**実行はテンイチが管理画面で行う** (Yoshizo 原則・金銭操作 AI 不可)。
>
> **v2 改訂点 (2026-05-13)**: ジロー時代の既存キャンペーン2本・ad set 8本・ad 16本が稼働済みと判明。汚染履歴を引き継がない clean slate 方針に変更 + 学習期予算の現実化 + クリエイティブ集中化。

---

## 🚨 Section 0: 既存 Meta Ads 環境の現状 (2026-05-13 確認)

### 既存キャンペーン (2)

| キャンペーン名 | 状態 | 過去30日 Leads | CPL | 日予算 |
|---|---|---|---|---|
| `SEKAI STAY_Lead_BroadVsNarrow_202605` | ✅ Active | 17,274 | ¥2 | ¥1,000 |
| `SS_Conversion_Switch_Meta_202604` | ⚠️ Ad sets off | 3,362 | ¥2 | (ad set 予算) |

### 既存 Ad sets (8 / 1 active)

| Ad set | 状態 | Leads | CPL | 命名一致 |
|---|---|---|---|---|
| `AS_Price_Switch_Broad_JP` | ✅ Active | 16,055 | ¥1 | ✓ price |
| `AS_Trust_Switch_Broad_JP` | ⏸ Off | — | — | ✓ trust |
| `AS_Portal_Switch_Broad_JP` | ⏸ Off | — | — | ✓ portal |
| `AS02_Narrow_Minpakufudosan_JP_30-65` | ⏸ Off | 1,239 | ¥4 | — |
| `AS_Broad_Investor_JP` (4 variants) | ⏸ Off | 6〜1,852 | ¥1〜¥56 | — |

> ジローも我々と同じ「Price / Trust / Portal × Switch LP」の3パターン構造を採用していた。命名規則は流用可能だが、**ad set ID 自体に学習履歴が紐づく**ため再利用は不可。

### 既存 Ads (16 / 3 active)

| Ad | 状態 | Leads | CPL |
|---|---|---|---|
| `AD01_Loss_A_AnnualLoss86man` | ✅ Active | 301 | ¥7 |
| `AD03_Compare_A_20vs8` | ✅ Active | 256 | ¥7 |
| `AD05_Service_A_Doubledouble` | ✅ Active | 2,554 | ¥4 |
| (その他 13本) | ⏸ Off | 0〜12,836 | ¥1〜¥8 |

### ⚠️ データの致命的な問題

**¥1〜¥7 per lead は Meta B2B では物理的にあり得ない数字** (通常 CPL ¥3,000〜¥12,000・1000倍安すぎる)。

- 原因: PEST URL Trigger Lead がページビュー・アンカークリックで誤発火していた時期 (〜2026-05-12 削除前) の偽 Lead が累積
- Meta AI はこの「偽 Lead」シグナルで学習済み → **既存 ad set / ad の最適化履歴は全部汚染**
- 「High performing」バッジは偽 CV ベースの判定なので無意味
- そのまま新クリエイティブ載せても Meta AI が偽 Lead 方向に最適化を引っ張る

### Step 0 (テンイチ即実行・1分): 真のデータ確認

Ads Manager の **日付フィルタを「2026-05-13 以降」に変更** → PEST 削除後のクリーンな数字を確認。

- 「Active キャンペーン直近24時間の Lead 数 vs Spend」を観察
- もし依然として ¥10未満/lead なら、PEST 以外にも Lead 発火源がある可能性 → 配信開始前に Pixel Helper で要調査

---

## 🎯 Section 1: 既存資産の処理方針 (テンイチ判断・推奨は Clean Slate)

| 選択肢 | 内容 | リスク | 推奨度 |
|---|---|---|---|
| **A) クリーンスレート** | 既存全 pause + 新 campaign 作成 | 過去履歴を捨てる(が汚染履歴なので実質損失なし) | ⭐⭐⭐ **推奨** |
| **B) サルベージ** | `AS_Price_Switch_Broad_JP` のクリエイティブだけ差し替え | 汚染履歴を引き継ぐ・Meta AI 混乱 | ⚠️ 非推奨 |
| **C) パラレル** | 既存 Active 継続 + 新 campaign 並走 | 予算分散・分析複雑化 | ❌ Yoshizo 危険信号#5 (複雑さで複雑さ管理) |

### Clean Slate 手順

1. **既存 Active を pause** (Off にする・削除はしない)
   - Campaign: `SEKAI STAY_Lead_BroadVsNarrow_202605` → Off
   - Ad set: `AS_Price_Switch_Broad_JP` → Off
   - Ads: `AD01_Loss_A_AnnualLoss86man` / `AD03_Compare_A_20vs8` / `AD05_Service_A_Doubledouble` → Off
2. **既存資産は履歴として保持** (削除しない・後日エクスポートで参考データ化)
3. **新 campaign `SS-Meta-Interest-202605` を作成** → Section 2 へ

---

## 0. 配信前チェックリスト

- [x] クリエイティブ3枚を `ad-ops/meta-ads/creatives/` に保存 (ss-portal.png / ss-price.png / ss-trust.png・1254×1254 PNG)
- [x] クリエイティブ表記根拠を全件確認済み (97%継続率 / 4.8満足度 / 24h4言語 / BEST OF SAUNA STAY 2026 / Airbnbスーパホスト多数認定 等・テンイチ承認・2026-05-13)
- [ ] **Step 0: 日付フィルタ「2026-05-13 以降」で真のデータ確認**
- [ ] **Step 1: 既存 Active を Off にする** (Clean Slate 実行)
- [ ] Meta Business Manager の課金カード設定済み確認
- [ ] LP 3種類 (`/switch`・`/switch/portal`・`/switch/founder`) が本番で正常稼働確認
- [ ] (任意) 既存契約済みオーナー CSV の自社CRM エクスポート (除外用・100件以上あれば)

---

## 2. 新キャンペーン作成

**Meta Ads Manager → 作成 → キャンペーン**

| 項目 | 設定値 |
|---|---|
| キャンペーン名 | `SS-Meta-Interest-202605` |
| キャンペーン目的 | **リード (Leads)** |
| 特別な広告カテゴリ | なし |
| キャンペーン予算最適化 (CBO) | **OFF** (広告セットごとに予算管理) |
| A/B テスト | OFF (学習期は素直に走らせる) |
| Advantage キャンペーン予算 | OFF |

> **吉蔵原則**: 学習期は分岐を減らす。CBO・A/B テストは「Meta に任せる」前にデータが必要。

---

## 3. 広告セット作成 — **Set A 単独で開始**

> ⚠️ v1 では3セット並走 (Set A/B/C) を初期推奨にしていたが、Yoshizo 原則で**学習期は1セットに予算集中**に変更。Set B/C は Day 14 以降のデータを見て追加判断。

### Set A: SS-Meta-Int-Airbnb-Hosts (唯一の初期セット)

| 項目 | 設定値 | 根拠 |
|---|---|---|
| Ad set 名 | `AS_Interest_Airbnb_Hosts_JP_v1` | (ジロー名と区別) |
| コンバージョンイベント | **Lead** (Pixel + CAPI dedup 済み) | — |
| パフォーマンスゴール | リード数の最大化 | — |
| **予算 (学習期 Day 1-14)** | **日 ¥7,000** | Meta 学習基準 50CV/週 ÷ 想定 CPL ¥12,000 を満たすため |
| **予算 (維持期 Day 15+)** | 日 ¥3,000 に減額 | 学習完了後の維持 |
| 配信開始日 | テンイチ判断 (推奨: 月曜朝) | — |
| 配信終了日 | 設定なし (手動運用) | — |
| 入札戦略 | **最大量 (Highest volume)** | 学習期は CPA キャップ NG |
| **コンバージョンウィンドウ** | **クリック後7日 + 視聴後1日** | 民泊オーナー検討期間に整合 |

### 配置 (Placements)

⚠️ **Advantage+ 配置は OFF**。手動で以下のみ ON:

- ✅ Facebook Feed
- ✅ Instagram Feed
- ❌ Audience Network (誤クリック多い)
- ❌ Messenger (CV 効率悪い)
- ❌ Stories / Reels (縦動画素材ない・後日追加)
- ❌ Marketplace

### オーディエンス

| 項目 | 設定値 |
|---|---|
| 地域 | 日本 (全国) |
| 年齢 | **30〜65歳** |
| 性別 | すべて |
| 詳細ターゲット | `Airbnb` OR `Vrbo` OR `Booking.com` OR `Superhost` OR `民泊` |
| 言語 | 日本語 |
| **詳細ターゲット拡張** | **OFF** (学習期は精度優先) |

### オーディエンス除外

- (任意) 既存契約済みオーナー CSV (自社CRM から100件以上あれば)

---

## 4. 広告作成 — **3 クリエイティブを同一 ad set 内に並走**

> **方針 (2026-05-14 更新)**: 同一 ad set 内に3クリエイティブを入れる = Meta の dynamic creative 機能で勝者を自動判定。**ad set 単位で学習データ集計されるので分裂しない**。Meta 公式の「A/B test」機能 (別 ad set 配信) は予算分散になるので使わない。
>
> 3パターン (信頼 / 価格 / ポータル) を全部初動から走らせて、Day 7 のクリエイティブ別 breakdown で勝者を判定する。
>
> **CTA 統一 (2026-05-14 確立)**: 3広告とも **Learn More** で統一。CTA を変数にすると A/B テストでクリエイティブの純粋な効果が見えなくなる。Yoshizo 原則「変数を減らせば学習が速い」。Learn More が選ばれる理由: LP の動線 (無料診断レポート取得) は「情報収集」体験で「営業と話す」体験ではないため、Contact Us より整合する + Meta Lead 広告で最も CTR が高い CTA。

### 広告1: AD_Trust_Founder_v1 (最強の初動シグナル)

| 項目 | 設定値 |
|---|---|
| 広告名 | `AD_Trust_Founder_v1` |
| メディア | `creatives/ss-trust.png` (1254×1254) |
| 見出し | `民泊代行の常識を変える` |
| 説明 | `業界半額×受賞運営` |
| CTA ボタン | `Learn More` |
| URL | `https://sekaistay.com/switch/founder?utm_source=meta&utm_medium=cpc&utm_campaign=SS-Meta-Interest-202605&utm_content=trust-founders-v1&utm_term=trust` |

**プライマリテキスト**:
```
民泊代行、まだ20%払っていませんか？
SEKAI STAYは手数料8%でAirbnbスーパーホスト多数認定・BEST OF SAUNA STAY 2026受賞。
業界の常識を変える運営体制で、オーナー様の手残りを最大化します。
```

> ⚠️ **信頼訴求の設計原則 (2026-05-14 確立)**: SEKAI STAY の創業者は公開上は無名のため「個人ブランド信頼」は機能しない。信頼軸は**実績 (受賞・認定) + 客観的数字 (8%) + 比較 (業界20%)** で構築する。創業者の顔出し画像は「人間味・親近感」の役割であって「権威の借用」ではない。「創業者の想い」「代表が直接対応」等の創業者ベース訴求は ❌ NG。

### 広告2: AD_Price_20vs8_v1

| 項目 | 設定値 |
|---|---|
| 広告名 | `AD_Price_20vs8_v1` |
| メディア | `creatives/ss-price.png` (1254×1254) |
| 見出し | `手数料8%・業界半額` |
| 説明 | `最短2週間で切替` |
| CTA ボタン | `詳しくはこちら` |
| URL | `https://sekaistay.com/switch?utm_source=meta&utm_medium=cpc&utm_campaign=SS-Meta-Interest-202605&utm_content=price-20vs8-v1&utm_term=price` |

**プライマリテキスト**:
```
民泊運用代行の手数料、相場の半額にできます。SEKAI STAYは手数料8%。
Airbnbスーパーホスト多数認定の運営力で、オーナー様の手残りを最大化します。最短2週間で切替可能。
```

> ⚠️ **コピーライティング原則 (2026-05-14 確立)**:
> - ❌ NG「運営の質を落とさず」: 「落とさず」がネガティブ・フレーミング (読者の脳に「落ちる可能性」を植える)・心理学的逆効果
> - ❌ NG 競合品質を仮定する表現: 「他の代行は手数料20%だが質が良い」を暗黙の前提にすると、競合で品質に不満があってスイッチ検討中の読者を否定する
> - ✅ OK 自社実績で証明: 「Airbnbスーパーホスト多数認定の運営力で」= 客観的事実で品質を立証 (比較不要)
> - ✅ OK オーナー視点の利得表現: 「コストを下げる」より「手残りを最大化」(コスト視点 → 価値視点)

### 広告3: AD_Portal_Dashboard_v1

| 項目 | 設定値 |
|---|---|
| 広告名 | `AD_Portal_Dashboard_v1` |
| メディア | `creatives/ss-portal.png` (1254×1254) |
| 見出し | `24h可視化のオーナーポータル` |
| 説明 | `全物件を一画面で` |
| CTA ボタン | `詳しくはこちら` |
| URL | `https://sekaistay.com/switch/portal?utm_source=meta&utm_medium=cpc&utm_campaign=SS-Meta-Interest-202605&utm_content=portal-dashboard-v1&utm_term=portal` |

**プライマリテキスト**:
```
「自分の物件、今いくら稼いでる？」がスマホで一目でわかる。
SEKAI STAYは24時間オーナーダッシュボード標準装備。
稼働率・収益・レビュー・清掃状況をリアルタイムで確認できます。
```

---

## 5. 配信後モニタリング

### Day 1 (launch 翌朝・テンイチが確認)

- [ ] 3広告とも「配信中」ステータス
- [ ] Pixel イベント発火確認 (Meta Events Manager → Test Events タブ)
- [ ] CAPI イベント発火確認 (同上・Server サイド)
- [ ] 予算消化ペース (¥7,000/日に対する進捗)
- [ ] **UTM パラメータが Supabase `lead_submissions` テーブルに記録されているか確認**

### Day 3 (テンイチが確認)

- [ ] 各広告のインプレッション・クリック・CTR
- [ ] フリークエンシー (同一ユーザー表示回数・5超で警戒)
- [ ] CV 発生有無
- [ ] 真の CPL (¥3,000-12,000 範囲か?もしまた ¥100未満なら Pixel 設定要再確認)

### Day 7 (学習期完了見込み)

- [ ] CPL 確認 (目標 ¥12,000 以下)
- [ ] **Ads タブ → Breakdown → 「広告別」で3クリエイティブの CPL を比較**
   - 勝者 (CPL 最低) は配信継続
   - CPL が他の2倍以上 + impression は十分配信されてる負け1本は OFF
   - 3本とも CPL が近い場合は全部継続して data 蓄積
- [ ] Set A の CPL 良好なら Set B (宿泊事業者) を ¥3,000/日 で追加検討

### Day 14 (学習完了想定・Step 2 ゲート)

- [ ] **予算を学習期 ¥7,000/日 → 維持期 ¥3,000/日 に減額**
- [ ] **SS-Meta-Retargeting キャンペーン立ち上げ判断** (Pixel 14日蓄積・カスタムオーディエンス利用可)
- [ ] Lead 母集団100件突破していれば **SS-Meta-Lookalike キャンペーン** 立ち上げ判断

### 異常検知ライン (即停止判断)

- 単一広告セットで ¥10,000 消化 + CV=0
- CPL が ¥20,000 超で3日継続
- フリークエンシー 5 超
- **CPL が ¥100 未満で推移 (= Pixel 計測がまた壊れているサイン)**

---

## 6. Step 2 / Step 3 への伏線 (launch 同時に予約)

ad-ops/meta-ads/audience-targeting.md の3キャンペーン構想:
- Campaign 1: SS-Meta-Retargeting (Pixel 蓄積後)
- Campaign 2: SS-Meta-Lookalike (CRM 100件後)
- Campaign 3: SS-Meta-Interest (今回 launch するのはコレ)

### テンイチカレンダー予約 (launch 当日に入れる)

| 日付 | アクション |
|---|---|
| launch + 7日 | Day 7 観測・3クリエイティブ別 breakdown で勝者判定 |
| launch + 14日 | 予算減額 + SS-Meta-Retargeting 立ち上げ判断 |
| Lead 100件達成日 | SS-Meta-Lookalike 立ち上げ判断 |

---

## 7. 関連リンク

- クリエイティブ: [creatives/MANIFEST.md](creatives/MANIFEST.md)
- オーディエンス設計 (3キャンペーン全体): [audience-targeting.md](audience-targeting.md)
- コピー全パターン: [copy-drafts.md](copy-drafts.md)
- 学習ログ: [../learnings.md](../learnings.md)
- 計測実装: `lib/meta-capi.ts` + `/api/report-requests/submit`
- 親プロジェクト: `~/.claude/projects/-Users-sekaichi-Desktop-claude-code/memory/project_sekai_stay.md`
