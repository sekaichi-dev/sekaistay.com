# SEKAI STAY LP/HP 引き継ぎ資料 — 本間ヨシト様

> **作成日**: 2026-05-31
> **作成者**: テンイチ
> **引き継ぎ先**: 本間ヨシト（リード獲得・マーケ責任者 / `design.7247@gmail.com`）
> **対象**: sekaistay.com（HP + LP 3 variants）の設計・改善・運用
> **姉妹資料**: [`ad-ops/HANDOVER_YOSHITO_2026-05-31.md`](ad-ops/HANDOVER_YOSHITO_2026-05-31.md)（広告運用引き継ぎ）

---

## ⚡ サマリー（3分で読める現状）

### サイト構成

| 種別 | URL | 役割 | 実装場所 |
|---|---|---|---|
| **HP** | https://sekaistay.com | 会社全体のマーケサイト・20+ ページ | `app/page.tsx` 他 |
| **LP A**（Control） | /switch | 価格主導・業界半額・手数料8% | `app/switch/page.tsx` |
| **LP B** | /switch/founder | 信頼主導・創業者前面 | `app/switch/founder/page.tsx` |
| **LP C** | /switch/portal | ポータル主導・24h可視化 | `app/switch/portal/page.tsx` |

### 直近1.5ヶ月の改善ハイライト

```
5/15 🎨 Phase B-1 Guesty着想HP改善（Hero/NavCards/事例カード/サービス3バケット）
5/15 🧮 /simulate 削除 → /services と /audit Step02 に計算機を統合
5/17 🎯 /services 低コントラスト一括強化 + Header 不透明化
5/19 ✏️ 「その他の費用は一切なし」誤解表現削除
5/20 🔗 自社ドメイン短縮URL /go/<slug> 実装
5/22 🖼️ OG画像を「SEKAI STAY 8% hero banner」に差替（CDN cache bust v2）
5/22 📝 switch FAQ に解約金記載追加 / 「業界もっともシンプル」→「シンプル」
5/22 📣 Slack通知パイプライン: 10分遅延 + TimeRex予約済み抑制
5/23 🔀 TimeRex予約あり→スレッド返信・なし→既存通知
5/27 🔠 漢字↔かなで名前マッチ失敗 → 時間窓フォールバック追加
```

### 即知っておいてほしい3点

1. 🔴 **Vercel プロジェクト名は `minpaku-audit`**（NOT `sekaistay-com`）— 本番デプロイ先。プロジェクト `sekaistay-com` は別物（プレビュー専用）
2. 🟡 **LP コンテンツ軸は freeze 中**（コピー・訴求内容は変えず、デザインのみ変更する方針）
3. 🟡 **デザインガイドのブランドトークン厳守**（赤系不使用・独自カラー追加禁止）

---

## 0. このドキュメントの読み方

1. **⚡ サマリー**（上記）— 全体像
2. **§1** 役割分担と権限
3. **§2** デプロイ・環境（**重要**: Vercel プロジェクト名）
4. **§3-4** サイト構造 / LP 詳細
5. **§5** デザインシステム（厳守ルール）
6. **§6-7** フォーム / 計測タグ
7. **§9** すぐにやってほしいこと

---

## 1. 役割分担と権限（吉蔵基準 / Human-in-the-Loop）

### ヨシトが単独で判断・実行してよい

| 領域 | 例 |
|---|---|
| LP / HP のコピー差し替え | テキスト修正・FAQ追加・実績数値更新 |
| 画像・OG画像の差し替え | 既存ガイドラインに沿う範囲 |
| 既存セクションの装飾調整 | ボーダー・余白・行間・shadow |
| LP A/Bテストの variant 切替 | 既存3variants内での配信切替 |
| 既存ページの追加・並び替え | NavCards・FAQ・事例の組み替え |

### テンイチに確認すべき（プロダクト連動）

| 領域 | 例 |
|---|---|
| LP の構造変更 | セクション追加削除・フォーム項目変更 |
| 計測タグ実装変更 | 新規 CV 定義・Pixel 追加削除 |
| 新規ドメイン・サブドメイン | カスタムドメイン追加 |
| 新規 LP variant 追加 | A/Bテスト分岐の追加（既存3超え） |
| データソース連動の変更 | Supabase / HubSpot スキーマ変更 |
| 機能追加 | 計算機・診断ツール等の新規実装 |

### 義人（事業責任者）に確認すべき

| 領域 | 例 |
|---|---|
| ブランドメッセージの方向転換 | 「業界半額・手数料8%」軸を変える |
| 価格・契約条件の表示変更 | 「先着10名初期費用0円」等の条件 |
| 新規ページ群の追加 | 投資家向けページ等の新セクション |

### 法務系（Toyo 確認）

- 比較広告での競合社名使用
- 「No.1」「業界初」等の最上級表現
- 受賞表記の使用

---

## 2. デプロイ・環境 ★最重要

### 2-1. Vercel プロジェクト

| 項目 | 値 |
|---|---|
| **本番プロジェクト名** | **`minpaku-audit`** ⚠️ 名前に注意 |
| 本番ドメイン | https://sekaistay.com |
| プレビュー | https://sekaistay-com.vercel.app（プロジェクト `sekaistay-com`・別物） |
| デプロイトリガー | main push で本番自動デプロイ・PR ごとにプレビュー |
| Organization | sekaichi |

> **なぜ名前がズレているか**: 元々「民泊診断」（minpaku-audit）として立ち上げたサービスをリブランドして SEKAI STAY 本サイトに進化させた経緯。Vercel プロジェクト名は変更コストが高いのでそのまま運用。

### 2-2. ドメイン構成

| ドメイン | 用途 |
|---|---|
| sekaistay.com | 本番マーケサイト |
| sekaistay.com/go/<slug> | 自社ドメイン短縮URL（2026-05-20実装） |
| ops.sekaistay.com | 運営ポータル（sekai-stay-ops プロジェクト・別管理） |

### 2-3. リダイレクト・cron（`vercel.json`）

```json
{
  "redirects": [
    { "source": "/lp", "destination": "/switch", "permanent": true }
  ],
  "crons": [
    { "path": "/api/lead-slack-delayed", "schedule": "* * * * *" }
  ]
}
```

→ `/lp` → `/switch` 恒久リダイレクト  
→ `/api/lead-slack-delayed` を毎分実行（10分遅延 Slack 通知用）

### 2-4. 主要な環境変数（Vercel）

| 変数 | 用途 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 接続 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 公開キー |
| `SUPABASE_SERVICE_ROLE_KEY` | サーバーサイド書き込み |
| `META_PIXEL_ID` | `1658477098524563` |
| `META_CAPI_TOKEN` | Meta CAPI |
| `META_CAPI_TEST_EVENT_CODE` | Meta CAPI テストコード |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | Google Ads conversion ID |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | フォーム送信フォールバック |
| `SLACK_LEAD_WEBHOOK` | Slack リード通知 |
| `DISCORD_LEAD_WEBHOOK` | Discord リード通知 |

### 2-5. 技術スタック

- Next.js 14.2.0（App Router）
- React 18
- TypeScript 5
- Tailwind CSS 3.4
- Supabase SDK v2
- Vercel Edge Functions（API routes）
- Node v22+

---

## 3. サイト構造（全ページ一覧）

### 3-1. HP メイン

| URL | 役割 | 主要コンポーネント |
|---|---|---|
| `/` | トップページ | Hero / AuthorityBar / NavCards / Results / FinalCTA |
| `/about` | 会社案内 | — |
| `/company` | 会社概要 | — |
| `/services` | サービス詳細（3バケット: 集客/運営/開業成長） | SwitchSimulator（Chapter Ⅴ） |
| `/pricing` | 料金プラン | — |
| `/portfolio` | 運営物件ポートフォリオ | — |
| `/case-studies` | 導入事例（7件） | — |
| `/area` | エリア別ページ（20地域） | 動的ルーティング `/area/[slug]` |
| `/audit` | 自己診断（7ステップ・18問） | SwitchSimulator（Step 02） |
| `/blog` | ブログ（59記事） | 動的ルーティング `/blog/[slug]` |
| `/faq` | よくある質問 | — |
| `/contact` | お問い合わせ | — |
| `/privacy` | プライバシーポリシー | Meta CAPI 言及済み |
| `/dashboard-demo` | オーナーポータル デモ | — |
| `/diagnostic` | 旧・診断（→ /audit に統合） | レガシー |

### 3-2. LP（switch family）

| URL | variant | 役割 | コンポーネント |
|---|---|---|---|
| `/switch` | switch | Control・価格主導 | SwitchHero + SwitchServices + SwitchComparison + SwitchFAQ |
| `/switch/founder` | switch-founder | 信頼主導・創業者前面 | SwitchHeroFounder + 共通 |
| `/switch/portal` | switch-portal | ポータル主導 | SwitchHeroPortal + 共通 |
| `/switch/results` | — | LP内・実績ページ | — |
| `/switch/thanks` | — | フォーム送信後 thanks | — |

### 3-3. アーカイブ済 LP（`app/switch/_archive/`）

| variant | 状態 | アーカイブ理由 |
|---|---|---|
| `kotekote` | アーカイブ | 3variants 集約で「コテコテ」パターンを停止 |
| `simple` | アーカイブ | シンプル思想の追求から外して整理 |

> **archive_unused_variants ポリシー**: 削除せず `_archive/` に保存。再開可能。

### 3-4. API ルート（`app/api/`）

| エンドポイント | 用途 |
|---|---|
| `/api/report-requests/submit` | フォーム送信本体（→ Supabase + 吉蔵CRM + Meta CAPI） |
| `/api/lead-slack-delayed` | 10分遅延 Slack 通知（TimeRex照合付き） |
| `/api/lead-intake` | webhook ブリッジ |

### 3-5. その他

| 項目 | 場所 |
|---|---|
| 短縮URL | `/go/<slug>` で自社内リダイレクト |
| sitemap | `app/sitemap.ts` で動的生成（blog + area + static） |
| OG画像 | `app/opengraph-image.tsx` |
| 構造化データ | JSON-LD (ProfessionalService) |

---

## 4. LP 3 variants — 差別化と訴求設計

### 4-1. 訴求パターン × LP マッピング

| variant | 訴求軸 | Hero メッセージ | 想定ターゲット |
|---|---|---|---|
| **switch**（Control） | 価格主導 | 業界半額・手数料8% | コスト意識の高い既存代行ユーザー |
| **switch/founder** | 信頼主導 | スーパーホスト多数認定・受賞実績 | 初心者・大口投資家・顔の見える運営代行を求める層 |
| **switch/portal** | ポータル主導 | 24h可視化・データドリブン運営 | 複数物件オーナー・データ重視層 |

### 4-2. 共通コンポーネント vs variant 固有

| 共通（全variantで使用） | 場所 |
|---|---|
| `SwitchServices` | components/switch/ |
| `SwitchComparison` | components/switch/ |
| `SwitchFAQ` | components/switch/ |
| `SwitchSimulator` | components/switch/（料金計算機） |
| `LpVariantForm` | components/switch/（フォームラッパー） |
| `ReportRequestForm` | components/report-request/（フォーム本体） |

| variant 固有 | 場所 |
|---|---|
| `SwitchHero` | components/switch/（Control） |
| `SwitchHeroFounder` | components/switch/ |
| `SwitchHeroPortal` | components/switch/ |

### 4-3. レイアウト・metadata

LP3 variantsは共通 layout (`app/switch/layout.tsx`) を使用。metadata（タイトル・OGP）も共通。variant 固有の差分は Hero と一部セクションの順序のみ。

### 4-4. LP A/Bテストの仕組み

`lp_variant` パラメータが LP → フォーム → Supabase → HubSpot/CRM へ全レイヤー伝播する設計（`ab_test_approach`）:

```
ユーザー → /switch* 着地（lp_variant = switch | switch-founder | switch-portal）
  ↓
LpVariantForm → ReportRequestForm に lp_variant を埋め込み
  ↓
POST /api/report-requests/submit （body に lp_variant）
  ↓ 3系統並列転送
  ├─ Supabase lead_submissions（lp_variant カラム保存）
  ├─ 吉蔵 CRM（forwardLead に lp_variant）
  └─ Meta CAPI（custom_data.lp_variant）
  ↓
GA4 generate_lead event（custom parameter: lp_variant）
```

→ 媒体別 × LP variant 別の CVR が Supabase で集計可能。

### 4-5. A/Bテスト判定ルール

- 統計有意性: **Z-score ≥ 1.96**（95%有意）
- 計測期間: **1週間単位**
- メトリクス: CVR + Δ vs control
- 詳細: `ab_test_measurement` 設定参照

---

## 5. デザインシステム ★厳守

### 5-1. Tailwind ブランドトークン（`tailwind.config.js`）

**プライマリ**
- Sekai Black: `#0B0B0B`
- Sekai Charcoal: `#2D2D2D`
- Deep Teal: `#0F5F65`
- **Sekai Teal**: `#167B81`（メインブランド）
- Bright Teal: `#54BEC3`

**エディトリアル ニュートラル**
- Ivory: `#FBF9F4`
- Bone: `#F4EEE4`
- Paper / Mist / Rule / Ink（階調）

**Switch LP 専用**
- `switch-teal` / `switch-charcoal` / `switch-accent`: `#E8653A`（オレンジ）
- yellow-400（アクセント）

### 5-2. 配色ポリシー（lp_color_policy）

| ルール | 詳細 |
|---|---|
| ✅ 使う | sekai-charcoal / sekai-teal-bright / yellow-400 / switch-accent |
| ❌ 不使用 | **赤系（赤・濃赤・スカーレット等）** |
| ❌ 不使用 | 独自カラー（ゴールド・黒・派手な原色を勝手に追加） |

### 5-3. フォント

| 用途 | フォント | weight |
|---|---|---|
| 本文（和文） | Noto Sans JP | 300 / 400 / 500 / 600 / 700 |
| 本文フォールバック（欧文） | Helvetica Neue | — |
| 見出し（明朝） | Shippori Mincho | 400/500/600/700 |
| 数字・特殊 | Fraunces | variable |

→ `font-feature-settings` で日本語詰め有効

### 5-4. レスポンシブ

- **流動スケール**: `clamp()` で fluid typography
- **画像**: Unsplash リモート画像対応（AVIF / WebP 配信）
- **モバイル等価性** (mobile_ui_parity): デスクトップの装飾（点線等）はモバイルでも表示

### 5-5. シンプル variant 思想（simple_variant_philosophy）

「シンプル」を選んだら全セクション一貫してミニマル。以下は **シンプル思想に反するので削除**:
- 追従CTA
- 波線アニメ
- 中間CTA挿入
- dark-gradient block

### 5-6. AI メッセージング（lp_design_ai_mention）

LP / マーケコピーで「AI」という言葉を **押し出さない**。
- ❌ AI化 → ✅ 仕組み化
- ❌ AI自動 → ✅ 日次自動

---

## 6. フォーム送信パイプライン

### 6-1. フロー全体

```
ReportRequestForm（client component）
  ↓ ユーザー送信
POST /api/report-requests/submit （app/api/report-requests/submit/route.ts）
  ↓ fire-and-forget 並列転送
  ├─ Supabase lead_submissions（raw 一次保管・lp_variant カラム保存）
  ├─ 吉蔵 CRM forwardLead（lib/lead-forward.ts）
  ├─ sekaistay-sales-portal webhook
  ├─ Discord lead webhook
  ├─ Slack lead webhook（即時送信）
  └─ Meta CAPI sendMetaCapiLead（lib/meta-capi.ts・hashed PII）
  ↓
client → fbq('Lead', {eventID}) + gtag('generate_lead')
  ↓
10分後（cron 毎分）/api/lead-slack-delayed
  → TimeRex予約済みかチェック
  → 予約あり: スレッド返信
  → 予約なし: 既存通知に「⚠️ TimeRex予約なし」マーカー追加
```

### 6-2. 主要ファイル

| ファイル | 役割 |
|---|---|
| `components/report-request/ReportRequestForm.tsx` | フォーム本体 |
| `components/switch/LpVariantForm.tsx` | LP variant ラッパー |
| `app/api/report-requests/submit/route.ts` | サブミット受信エンドポイント |
| `lib/lead-submissions.ts` | Supabase 書き込み |
| `lib/lead-forward.ts` | 吉蔵 CRM 転送 |
| `lib/meta-capi.ts` | Meta CAPI 送信 |
| `app/api/lead-slack-delayed/route.ts` | 10分遅延 Slack 通知 |

### 6-3. フォーム文言の最新状態

LP の form 文言（`lp_form_copy`）:
- 「24時間以内に担当者からご連絡」 → **「物件診断レポート無料作成」**
- 「3項目で、1営業日以内にメールで専用レポート」訴求
- 「まだAirBnBに掲載していない・アクティブなリスティングが無い」（form_copy_update）

CTA ボタン文言（`lp_button_language` / `lp_button_text_style`）:
- 「無料で面談を予約する」「専門家に無料相談する」
- 「運用に関するご相談はこちら」（`sekaistay_lp_cta_language`）

---

## 7. 計測タグ・SEO

### 7-1. 計測ID 一覧

| 項目 | 値 | 場所 |
|---|---|---|
| GA4 | `G-B7M920RCGR` | `app/layout.tsx` ハードコード |
| Google Tag | `GT-WVRTJXNR` | layout.tsx |
| Meta Pixel（メイン） | `1658477098524563` | layout.tsx |
| Meta Pixel（追加） | `989839370242915` | layout.tsx（統合検討中） |
| Meta CAPI | env: `META_CAPI_TOKEN` | サーバー側 |
| Microsoft Clarity | （ヒートマップ） | env で有効化 |
| X Ads UWT | （X Pixel） | env で有効化（未設定） |
| Google Ads Conversion | `NEXT_PUBLIC_GOOGLE_ADS_ID` | env |

### 7-2. SEO 設定

| 項目 | 設定 |
|---|---|
| sitemap | `app/sitemap.ts`（動的生成・blog + area + static） |
| robots.txt | `app/robots.ts` |
| OGP / Twitter Card | `app/opengraph-image.tsx`（2026-05-22 「SEKAI STAY 8% hero banner」に差替） |
| 構造化データ | JSON-LD (ProfessionalService) |
| Canonical | 自動付与 |

### 7-3. SEO 監査

- `SEO_AUDIT_REPORT.md` に監査結果保存

---

## 8. コンテンツ管理

### 8-1. ブログ（59記事）

| 項目 | 設定 |
|---|---|
| 形式 | JSON（1ファイル 1 記事） |
| 配置 | `content/blog/*.json` |
| 読込 | `lib/blog.ts`（起動時） |
| ルーティング | `/blog/[slug]` 動的 |
| 戦略 | PR配信前に自社HP記事10本を5月中に蓄積（hp_article_strategy） |

### 8-2. エリア（20地域）

| 項目 | 設定 |
|---|---|
| データ | `lib/areas.ts` |
| 表示 | `/area/[slug]` 動的 |

### 8-3. 導入事例（7件）

| 項目 | 設定 |
|---|---|
| データ | `lib/case-studies.ts` |
| 表示 | `/case-studies` |

### 8-4. 診断・スコアリング

| 項目 | 場所 |
|---|---|
| 設問 | `data/questions.ts`（7ステップ・18問） |
| スコアリング | `lib/scoring.ts` |
| 表示 | `/audit` |

---

## 9. 改善経緯（直近1.5ヶ月）

```
2026-05-14 ── サーチバーに「AirBnB」を明示
2026-05-15 ── 🎨 Phase B-1 Guesty着想 HP 改善
              → Hero に category eyebrow + 数字3つ + 軽CTA を統合
              → AuthorityBar を page.tsx から外す（数字は Hero に統合）
              → 事例カードを効果ファースト見出しに転換
              → NavCards を 3段ファンネル（軽/中/重）に置換
              → FinalCTA の text link を軽CTA「30秒試算」に統一
              → /services の9サービスを3バケット（集客/運営/開業成長）に整理
              → /services 縦割りカラム + クリックでモーダル表示
              → /services の Results case 写真・数字大きさ・縦揃え調整
              → /simulate を削除 → /services Chapter Ⅴ Clear Pricing に統合
              → /audit Step 02 を LP SwitchSimulator 同等の計算機に置換
              → Noto Sans JP の weight 300/600 を追加読み込み
              → Chapter◯ 表記を全面削除（refactor）

2026-05-17 ── /services 低コントラスト一括強化
              → Case№ をピル状バッジに変更
              → Airbnb/Booking ホスト評価を Portfolio 同様の dark band に
              → Case№ バッジと物件 spec を白系に
              → Airbnb/Booking 数字を 32px に拡大・水平ラベル+数字に
              → Header の半透明背景を不透明化、Clear Pricing 説明文を強化

2026-05-19 ── ✏️ 「その他の費用は一切なし」系の誤解を招く表現を削除（fix）

2026-05-20 ── 🔗 自社ドメイン短縮URL /go/<slug> 実装 + 全投稿URLを置換

2026-05-21 ── 🖼️ LP OG画像を新ブランディングサムネに差替

2026-05-22 ── 🖼️ OG画像を「SEKAI STAY 8% hero banner」に正式差替（v2でCDN cache bust）
              → switch FAQ: 6ヶ月以内解約に手数料発生する旨を明記
              → switch FAQ: 解約金後に「(最低契約期間 6ヶ月)」配置・末尾の※注釈削除
              → switch LP: 「業界でもっともシンプルな料金体系」→「シンプルな料金体系」
              → /home/FinalCTA: モバイルで見出し・CTAが横にはみ出る問題を修正
              → Leads: Slack 通知を 6 系統目の forward 経路として追加
              → Slack: フォーム送信通知を 10分遅延 + TimeRex予約済み抑制
              → Slack: TimeRex予約なしリードに離脱マーカー追加

2026-05-23 ── Slack: TimeRex投稿の判定を blocks/bot_profile まで拡張
              → Slack: TimeRex予約あり→スレッド返信、なし→既存通知

2026-05-27 ── lead-slack-delayed: 漢字↔かなで名前マッチ失敗するケースに時間窓フォールバック

2026-05-29 ── ROADMAP: Phase 2 (Meta CAPI) + Phase 3 (X Pixel) 実装済み項目を [x] 化
```

---

## 10. 既知の課題・未解決事項

| # | 課題 | 緊急度 | 詳細 |
|---|---|---|---|
| 1 | Meta Pixel 2つ並存 | 🟡 中 | `1658477098524563` と `989839370242915` のどちらに寄せるか統合判断要 |
| 2 | X Pixel 未取得 | 🟡 中 | `NEXT_PUBLIC_X_PIXEL_ID` env 未登録・X Ads CV最適化が機能しない |
| 3 | LP A/Bテストの勝者未確定 | 🟡 中 | 3 variants の CVR Z-score ≥ 1.96 達成判定要 |
| 4 | `/diagnostic` レガシー残置 | 🟢 低 | `/audit` に統合済みだがレガシー URL がリンク残ってる可能性 |
| 5 | ブログ59記事の運用ペース | 🟡 中 | PR配信前に10本蓄積戦略あり・継続運用方針要確認 |

---

## 11. すぐにやってほしいこと

### 🔴 Day 1（引き継ぎ当日）

- [ ] **Vercel アクセス権付与**（テンイチが org admin から ヨシトを sekaichi org に招待）
- [ ] **GitHub リポジトリアクセス権付与**（sekaichi-dev/sekaistay.com）
- [ ] **このドキュメント通読**
- [ ] **README.md / CLAUDE.md 通読**（`projects/sekaistay-com/`）
- [ ] **デザインガイド通読**（`SEKAI_STAY_Creative_Guide.md`）
- [ ] テンイチと 30分の引き継ぎMTG（プロジェクト名が `minpaku-audit` であることを必ず確認）

### 🟡 Week 1（6/1〜6/7）

- [ ] **ローカル環境セットアップ**（`npm install && npm run dev`）
- [ ] **Vercel CLI で env 取得**（`vercel env pull .env.local`）
- [ ] **LP 3 variants の Hero を実機で確認**（PC + モバイル）
- [ ] **直近1.5ヶ月の改善経緯（§9）を理解**
- [ ] **第1回 週次振り返り**（金曜・LP CVR / 計測タグ動作確認 / 改善仮説）

### 🟢 Week 2-4（6/8〜6/30）

- [ ] **LP A/Bテスト勝者判定**（Z≥1.96 達成 variant の確定・敗者 archive 検討）
- [ ] **Meta Pixel 統合判断**
- [ ] **X Pixel 取得 + env 登録**
- [ ] **SEO 監査結果（`SEO_AUDIT_REPORT.md`）の対応**
- [ ] **6月実績で 7月の改善方針策定**

---

## 12. 主要コンタクト

| 名前 | 役割 | 連絡先 | いつ連絡するか |
|---|---|---|---|
| **吉田（事業責任者）** | SEKAI STAY 全体統括 | `hikaru@sekaichi.org` | 価格・契約条件の表示変更・ブランド方針 |
| **テンイチ（代表）** | プロダクト統括・LP実装・計測タグ | `tenichi@sekaichi.org` | LP構造変更・計測タグ追加・新規ドメイン |
| **Toyo（法務）** | 契約・法務 | — | 比較広告・最上級表現・受賞表記の審査 |
| **小川（営業）** | クロージング・CRM | `contact@sekaichi.org` | リード品質フィードバック |

組織図全体: `projects/sekai-stay-ops/data/info/org-chart.json`

---

## 13. 主要ドキュメント・ファイル参照先

### ドキュメント

| ファイル | 内容 |
|---|---|
| `README.md` | 技術スタック・ページ一覧・セットアップ・デザインシステム・SEO |
| `CLAUDE.md` | AI エージェント向け作業ガイド |
| `ROADMAP.md` | 広告運用ロードマップ |
| `SEKAI_STAY_Creative_Guide.md` | ブランドガイドライン |
| `IMAGES_MANIFEST.md` | 画像アセット目録 |
| `SEO_AUDIT_REPORT.md` | SEO 監査結果 |
| `ad-ops/HANDOVER_YOSHITO_2026-05-31.md` | 広告運用引き継ぎ（姉妹資料） |

### LP / HP 主要コード

| ファイル | 内容 |
|---|---|
| `app/layout.tsx` | GA4 / Meta Pixel / グローバル設定 |
| `app/page.tsx` | HP トップページ |
| `app/switch/layout.tsx` | LP 共通レイアウト |
| `app/switch/page.tsx` | LP A（switch / Control / 価格主導） |
| `app/switch/founder/page.tsx` | LP B（信頼主導） |
| `app/switch/portal/page.tsx` | LP C（ポータル主導） |
| `app/switch/_archive/` | アーカイブ済 LP（kotekote / simple） |
| `components/switch/` | LP 専用コンポーネント |
| `components/report-request/ReportRequestForm.tsx` | フォーム本体 |
| `components/home/` | HP セクション |
| `components/services/` | /services セクション |
| `components/audit/` | /audit 診断 |
| `tailwind.config.js` | ブランドトークン |
| `next.config.js` | リダイレクト・画像最適化 |
| `vercel.json` | リダイレクト・cron |

### API / Lib

| ファイル | 内容 |
|---|---|
| `app/api/report-requests/submit/route.ts` | フォーム送信本体 |
| `app/api/lead-slack-delayed/route.ts` | 10分遅延 Slack 通知 |
| `lib/lead-submissions.ts` | Supabase 書き込み |
| `lib/lead-forward.ts` | 吉蔵 CRM 転送 |
| `lib/meta-capi.ts` | Meta CAPI 送信 |
| `lib/blog.ts` | ブログ JSON 読込 |
| `lib/areas.ts` | エリアデータ |
| `lib/case-studies.ts` | 導入事例データ |
| `lib/scoring.ts` | 診断スコアリング |

---

## 14. 引き継ぎ完了の判定基準

以下が全て揃ったら引き継ぎ完了とする:

- [ ] ヨシトが Vercel + GitHub にアクセスできる
- [ ] ヨシトがローカルで `npm run dev` を起動できる
- [ ] ヨシトがこのドキュメント + README + CLAUDE.md + Creative Guide を通読済み
- [ ] テンイチとの引き継ぎMTGを実施
- [ ] 引き継ぎ後 2週間以内に、ヨシトが独立して 1つ以上の LP/HP 改善（コピー修正・装飾調整など）をデプロイ
- [ ] LP A/Bテスト勝者判定の運用フローを理解

完了後、ヨシトは LP/HP の日常運用を担当、構造変更時はテンイチに相談、価格・契約条件は吉田と合意、という運用に移行する。

---

*このドキュメントは 2026-05-31 時点のスナップショット。引き継ぎ完了後はヨシトが必要に応じて更新する。*
