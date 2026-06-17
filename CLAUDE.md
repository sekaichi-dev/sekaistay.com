# sekaistay-com — sekaistay.com 公式サイト

> 詳しい情報は `README.md` を参照（ページ一覧・技術スタック）。ここはAIエージェント向けの作業ガイド。

## 何のプロジェクトか
- **本番**: https://sekaistay.com
- 民泊運用代行のマーケティングサイト + 無料診断LP（Sekai Stay事業）
- Next.js 14 (App Router) + TypeScript + Tailwind + Vercel

## AIエージェントが触るときの注意

### デプロイ
- `vercel --prod` で本番反映（sekaichi org）
- mainブランチへのpushで自動デプロイ
- **本番サイトなので**：CSS崩れ・SEO破壊・404はビジネス影響大。変更は必ずローカル `npm run dev` で目視確認してから

### コンテンツ更新
- ブログ記事は `content/blog/` のMDXファイル
- 事例・エリアは `data/` 配下のJSON
- 画像は `public/images/`（manifest: `IMAGES_MANIFEST.md`）

### リード処理フロー
- `/switch*` の各 LP variant のフォーム送信は `/api/report-requests/submit` で受信
- このプロジェクト内で Supabase `lead_submissions` への保存 + 物件診断レポートの生成・メール送信を完結
- リード情報は `lib/lead-forward.ts` の以下2系統で並行転送:
  - `forwardLead` → 吉蔵 CRM (`LEAD_INTAKE_URL`)
  - `forwardLeadToSalesPortal` → sekaistay-sales-portal (公開エンドポイント)
- HubSpot は不採用（2026-05-09 確定・自社CRMへ移行）

### デザイン実装ルール（リニューアル中・必読）
- **デザイン改修・新規セクションは必ず `docs/DESIGN_PARTS.md` のパーツから組む**（`components/ds/` の SectionHead / EditorialList / EditorialRow / CtaBand / GhostWordmark / OtaMarquee、既存共有の ContactSense / motion 等）。該当が無い構成は最も近いベースパーツを選び、派生ルールを `DESIGN_PARTS.md` に追記してから実装する。
- 基準ページは `/services`。原則は `docs/DESIGN.md` / `docs/CREATIVE_GUIDE.md`。sense-trust 踏襲・ティール/アイボリー・Notoゴシック（セリフ不使用）・赤/オレンジ不使用・ピクトグラム多用しない（番号＋罫線主体）。

### SEO・規約
- メタタグ・構造化データは絶対に壊さない（`SEO_AUDIT_REPORT.md` 参照）
- Tailwindのデザイントークンは `SEKAI_STAY_Creative_Guide.md` に定義済み

### 広告コピー・クリエイティブ作成時（必読）

広告コピー（見出し・プライマリテキスト・説明文）やクリエイティブ案を**作成・修正・提案する前**に、以下を**必ず全て読んでから**着手する。直近セッションの文脈や決定事項が永続化されている。

1. `ad-ops/google-ads/copy-drafts.md` — Google広告コピー現行案・却下パターン
2. `ad-ops/meta-ads/copy-drafts.md` — Meta広告コピー現行案
3. `ad-ops/learnings.md` — 出稿で得た学び・修正履歴
4. `~/.claude/projects/-Users-sekaichi-Desktop-claude-code/memory/feedback_ad_copy_creative_alignment.md` — コピー作成原則（創業者=複数 / 信頼訴求3軸 / ネガティブフレーミング禁止 / 実態整合）
5. `~/.claude/projects/-Users-sekaichi-Desktop-claude-code/memory/project_sekai_stay.md` — キャンペーン体制・キーワード実測Vol・NG表現リスト

これらを読まずに見出し案を出すと、過去に却下した案を再提案したり、創業者単数表現・ネガティブフレーミング・誇大表現を含む案が出る事故が起きる（2026-05-14 ss-trust.png 事故等）。

新しい決定や却下理由が出たら、その場で `ad-ops/learnings.md` か該当 copy-drafts.md に追記してから次の提案へ進む（揮発防止）。

## よく使う
```
npm run dev       # ローカル開発（localhost:3000）
npm run build     # 本番ビルド検証
npm run lint      # ESLintチェック
```

## 関連
- `sekai-stay-ai/` — Sekai StayのAIアシスタント（別プロジェクト）
- `sekaistay-sales-portal` — 営業ポータル (lead 並行転送先・別 Vercel project)
- Sekai Stay事業全般のメモリは `~/.claude/projects/-Users-sekaichi-Desktop-claude-code/memory/project_sekai_stay.md`
