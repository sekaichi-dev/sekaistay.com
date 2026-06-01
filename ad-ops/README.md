# SEKAI STAY — Ad Ops 運用基盤

> **目的**: Google Ads / Meta Ads / X Ads の運用を、AI（Claude）が観測・分析・提案、テンイチが判断・実行する「一緒に学ぶ」体制で回す。
>
> **最終ゴール**: 月50万円予算で 75 リード（Google 35 / Meta 25 / X 15）を獲得しつつ、何が効いて何が効かなかったかを学習ログに蓄積し、3ヶ月以内に「再現可能な広告運用ノウハウ」を会社の資産にする。

---

## 役割分担（吉蔵基準・Human-in-the-Loop）

> AI が金銭操作を直接握らない。広告アカウントの実行はすべてテンイチ。AI は下書き・観測・提案。

| 領域 | AI（てんちむ） | テンイチ |
|---|---|---|
| 広告アカウント設定・課金紐付け | — | ✅ 実行 |
| キーワード・オーディエンス・コピー下書き | ✅ 作成 | ✅ 採用判断 |
| クリエイティブ画像（既存素材選定 + 簡易加工） | ✅ ドラフト | ✅ 採用判断 |
| クリエイティブ画像（撮影・本人画像） | — | ✅ 用意 |
| LP（ランディングページ）の実装・改善 | ✅ コード | ✅ レビュー・マージ |
| 広告 Live 化・予算変更・配信 ON/OFF | — | ✅ 管理画面で実行 |
| 計測タグ実装（Google Ads CV / Meta CAPI） | ✅ コード | ✅ レビュー・マージ |
| パフォーマンス観測（日次・週次） | ✅ 自動収集・要約 | — |
| 改善提案（入札・配分・除外KW追加） | ✅ Inbox 提案 | ✅ 採用判断 |
| 異常検知（予算超過・CPA 異常・CV ゼロ） | ✅ Inbox `danger` 通知 | ✅ 停止判断・実行 |
| 学習ログ蓄積（[learnings.md](learnings.md)） | ✅ 自動記録 | ✅ 週次振り返り |

### AI が **絶対にやらない** こと

- 広告アカウント管理画面への自動ログイン・配信操作
- 予算の自動変更
- 配信の自動停止・自動再開
- クレジットカード情報・課金情報の操作

---

## ガードレール（金銭操作の閾値）

すべて検知のみ。**AI は配信停止しない**。テンイチが管理画面で停止判断する。

| シグナル | しきい値 | 通知先 |
|---|---|---|
| 日予算超過 | 単媒体 ¥30,000/日 超 | Inbox `danger` + Slack `#001-ai-agent-hq` |
| 週予算超過 | 計画比 +20% | Inbox `danger` + Slack 同上 |
| CPA 異常 | 過去7日中央値の 2倍 超 | Inbox `danger` + Slack 同上 |
| CV ゼロ | 24時間 CV=0 かつ予算消化あり | Inbox `general` + Slack 同上 |
| 単一広告コスト | 単一広告グループで ¥50,000 消化＆ CV=0 | Inbox `general` |

> 数値は初月のテンタティブ。月次レビューで調整。

---

## ディレクトリ構成

```
ad-ops/
├── README.md                          ← この文書
├── HANDOVER_YOSHITO_2026-05-31.md    ← ヨシト向け広告運用引き継ぎ（現況スナップショット）
├── STRATEGY_REPORT_2026-05-12.md     ← Google 広告戦略レポート
├── STRATEGY_REPORT_META_2026-05-14.md ← Meta 広告戦略レポート
├── STRATEGY_REPORT_X_2026-05-17.md   ← X 長文 × Boost the Winners 戦略レポート
├── learnings.md                       ← 学習ログ（仮説 → 試行 → 結果 → 学び）
├── google-ads/
│   ├── keyword-list.md                ← キーワード一覧
│   └── copy-drafts.md                 ← 検索広告コピー
├── meta-ads/
│   ├── audience-targeting.md          ← オーディエンス設計
│   ├── copy-drafts.md                 ← クリエイティブコピー
│   └── setup-draft.md                 ← Ads Manager セットアップ手順（v2）
├── x-ads/
│   ├── copy-drafts.md                 ← X 広告コピー
│   ├── audience-targeting.md          ← オーディエンス設計
│   └── long-form-content-bank.md      ← 長文B ドラフト集
├── note/
│   └── note-content-bank.md           ← note 記事ドラフト
└── setup-guides/
    ├── google-ads-conversion.md       ← Google Ads CV 計測
    ├── meta-conversions-api.md        ← Meta CAPI
    └── x-ads-account.md               ← X Ads アカウント
```

---

## 学習サイクル

### 日次（AI 自動）
- GA4 / Google Ads / Meta Ads Manager / X Ads Manager から指標取得
- 媒体別・LP variant 別に整形して `reports/YYYY-MM-DD.md` に保存
- Discord `#sekai-stay` に1日サマリ投稿
- 異常検知時は Inbox `danger`

### 週次（人間 + AI）
- 月曜朝にAIが先週分の振り返り下書きを生成（Inbox `general`）
- テンイチが「気づき」を追記（5-10分）
- 学んだことを `learnings.md` に追記（AI が下書き、テンイチが承認・編集）

### 月次（人間主導）
- KGI 達成度レビュー
- 媒体別の予算配分見直し
- LP A/B テスト勝者の確定 → 次のテスト仮説立案

---

## 訴求パターン × LP マッピング（Google/Meta/X 共通・2026-05-09 確定）

> **全媒体で同じ 3 パターン**を並走。広告コピー軸と LP の訴求点を一致させてメッセージ整合を最大化。

| パターン | 訴求軸 | 対応 LP | 想定オーディエンス |
|---|---|---|---|
| **価格主導** | 業界相場の半額・手数料8% | `/switch` | コスト意識の高い既存代行ユーザー |
| **ポータル主導** | 24h ダッシュボード・運営の可視化・データドリブン | `/switch/portal` | 複数物件オーナー・データドリブン投資家 |
| **信頼主導** | スーパーホスト・国交大臣認定・レビュー4.8 | `/switch/founder` | 初心者・大口投資家・顔の見える運営代行を求める層 |

各媒体のコピー詳細は `google-ads/copy-drafts.md` / `meta-ads/copy-drafts.md` / `x-ads/copy-drafts.md` 参照。

---

## KGI（初月）

| 指標 | 目標 |
|---|---|
| 月間総リード数（広告 + オーガニック） | 110 |
| 広告経由リード | 75（Google 35 / Meta 25 / X 15） |
| 平均 CPA | ¥6,667 以下（予算50万 ÷ 75リード） |
| 各パターンの最低サンプル | 各媒体 50 クリック以上を1週間で確保 |

> パフォーマンスが低調なら、コンバージョン定義を「問い合わせフォーム送信」→「LINE@登録」に切り替え検討（より浅いCVで母数を増やす）。

---

## 関連リンク

### 広告対象 LP（3 variants）

| URL | lp_variant | 役割 |
|---|---|---|
| `/switch` | `switch` | **Control** — Full 17-section LP（シンプル・価格主導） |
| `/switch/founder` | `switch-founder` | 創業者前面・信頼主導（Founder ストーリー強化） |
| `/switch/portal` | `switch-portal` | オーナーポータル前面・ポータル主導 |

> 全 variant が共通で `LpVariantForm` (`components/switch/LpVariantForm.tsx`) → `ReportRequestForm` (`components/report-request/ReportRequestForm.tsx`) を内包。`lp_variant` は GA4 / Meta Pixel / Supabase に伝播。

### フォーム送信フロー

```
ReportRequestForm (client)
  ↓ POST /api/report-requests/submit
Supabase (lead_submissions テーブル) + 自社CRM (forwardLead to 吉蔵)
  ↓ res 200 OK
client → fbq("track", "Lead", { lp_variant, content_name: "report_request" })
client → gtag("event", "generate_lead", { lp_variant, form_variant, commission_rate })
```

PII（name / email / phone）はサーバーサイドで保持されるため、**Meta CAPI を `/api/report-requests/submit` 内に統合実装済み**（`lib/meta-capi.ts`）。EMQ 8+ が現実的。

### 既存計測タグ

- GA4: `G-B7M920RCGR`（layout.tsx ハードコード）
- Meta Pixel: `1658477098524563`（env: `META_PIXEL_ID`、Production 登録済み）
- Meta CAPI: 実装完了（env: `META_CAPI_TOKEN` + `META_CAPI_TEST_EVENT_CODE`、Production 登録済み）
- 親プロジェクト: `~/.claude/projects/-Users-sekaichi-Desktop-claude-code/memory/project_sekai_stay.md`
- ブランドガイド: `SEKAI_STAY_Creative_Guide.md`
- 画像資産マニフェスト: `IMAGES_MANIFEST.md`
