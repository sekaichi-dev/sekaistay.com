# sekaistay.com トップページ再構成 — 設計書

**日付**: 2026-05-14
**スコープ**: sekaistay.com トップページ（`/`）の構造再設計
**前提**: 続けて Phase B（CTA絞り込み）、Phase C（エリア20ページのテンプレ化）を実施

---

## 1. 背景・問題定義

### 現状
- トップページは14セクション、ファイル単位で約14コンポーネント
- 100ページ超のサイト全体で「同じCTAが10箇所」「同じメッセージが5ページ」など重複多数
- ユーザーフィードバック: 「情報量が多い」

### 問題の再診断（吉蔵視点）
当初「14→7に圧縮」と仮定したが、`/switch` LP（13セクション）が機能している事実から、**セクション数ではなく以下が真の問題**と判定:

1. **ペルソナが曖昧** — 運用中と新規を同時に相手にして主役不在
2. **各セクションの密度が高すぎ** — Hero に4数字+2CTA+サイドカード+画像+テキストリンクが全部入り
3. **MidCTA がなく離脱ポイント多発** — FinalCTAまで間が空く
4. **同じメッセージの多ページ重複** — 「8% vs 業界15-25%」が5ページに登場

### ゴール
- ペルソナを2つに明示分離し、それぞれが「自分の話だ」と感じられる導線
- 各セクションは1メッセージに集中（密度を下げる）
- 早期エンゲージ + MidCTA でコンバージョン経路を短縮
- 詳細は別ページに委任（Homepage はハブ）

---

## 2. アーキテクチャ

### セクション構成（9セクション + Sticky CTA）

```
1. Hero                スリム化（1メッセージ + 1CTA + 画像のみ）
2. AuthorityBar        数字3つ（Credentials を統合）
3. Simulation          10秒シミュレーター（早期エンゲージ）
4. PainPoints          🆕 運用中/新規の2ペルソナ並列
5. MidCTA #1           PainPoints後の感情ピーク
6. Flow                3ステップ
7. Results             事例3件 + 数字サマリ
8. NavCards            🆕 Dashboard / Pricing / FAQ への誘導カード行
9. FinalCTA            無料診断ボタン → /audit
+ Sticky CTA           🆕 全ページ追従
```

### セクション処遇マトリクス

| 現状 | 処遇 | 備考 |
|---|---|---|
| Hero | スリム化 | stats / サイドカード / セカンダリCTA / テキストリンク削除 |
| AuthorityBar | 改修 | 5指標→3指標 + Credentials統合 |
| EntryPoints | 削除 | PainPoints に役割を統合 |
| Simulation | 維持 | 位置を§3に固定 |
| ValueProp | 削除 | PainPoints に統合 |
| Results | 維持 | §7に移動 |
| Dashboard | 移動 | トップから削除、NavCards カード化 → /dashboard-demo |
| Ecosystem | 削除 | /services へ |
| Flow | 維持 | §6 に配置 |
| Pricing | 削除 | NavCards カード化 → /pricing |
| Credentials | 削除 | AuthorityBar 末尾に統合 |
| FAQ | 削除 | NavCards カード化 → /faq |
| FinalCTA | 維持 | §9 |
| FooterCatch | 削除 | FinalCTA に統合 |
| PainPoints | 🆕新規 | §4 |
| MidCTA | 🆕新規 | §5 |
| NavCards | 🆕新規 | §8 |
| Sticky CTA | 🆕新規 | 全画面追従（モバイル優先） |

---

## 3. 各セクションの詳細設計

### 3.1 Hero（スリム化）

**残す**:
- 見出し（line1 + line2）
- ボディコピー1段落
- メインCTA 1個（「無料で物件診断を受ける」→ /audit）
- 画像（右カラム・Plate No.01）

**削除**:
- 4数字stats（AuthorityBar と重複）
- 「8% vs 業界15-25%」比較ブロック（PainPoints側で扱う）
- セカンダリCTA・テキストリンク（CTA分散の原因）
- サイドカード（「A note from the editor」）
- 末尾のゴーストワードマーク

**コピー方針**: 既存コピーを流用、削った要素ぶんは余白で吸収

### 3.2 AuthorityBar（数字3つに圧縮）

**現状**: 5指標 + 注記
**改修後**: 3指標 + Credentials統合（国土交通大臣許可番号等）

候補3指標（content/home/copy.ts の AUTHORITY から3つ選定）:
- 運用支援実績件数
- 平均レビュー（★4.8）
- 国土交通大臣許可番号

### 3.3 Simulation（位置のみ変更）

§3に固定。既存コンポーネント流用。

### 3.4 PainPoints（新規）

**構造**: 2カラム並列

```
┌─────────────────────┬─────────────────────┐
│ [運用中で伸び悩み]   │ [これから始める]     │
├─────────────────────┼─────────────────────┤
│ ・手数料が高い       │ ・運営会社の選び方   │
│ ・稼働率が伸びない   │ ・初期費用が読めない │
│ ・OTA設定が複雑      │ ・本業との両立不安   │
└─────────────────────┴─────────────────────┘
       ↓ どちらにも、同じ答え。 ↓
```

**コンポーネント**: `components/home/PainPoints.tsx`（新規作成）
**コンテンツ**: `content/home/copy.ts` の `PAIN_POINTS` として追加

### 3.5 MidCTA #1（新規）

PainPoints直下に配置。/switch の `SwitchPrimaryCTA` パターンを homepage 用に簡略化:
- 見出し: 「どちらの悩みも、まず物件診断から」
- CTA: 「無料で物件診断を受ける」→ /audit

**コンポーネント**: `components/home/MidCTA.tsx`（新規・/switch の SwitchPrimaryCTA を参考に独立実装）

### 3.6 Flow（既存維持）

§6 に配置。既存コンポーネント流用。

### 3.7 Results（既存維持・位置変更）

§7 に配置。「詳しく見る」リンクは /case-studies へ。

### 3.8 NavCards（新規）

3カードの誘導行:

```
┌──────────────┬──────────────┬──────────────┐
│ Dashboard    │ Pricing      │ FAQ          │
│ 運営の見える │ 8%手数料の   │ よくある     │
│ 化を体験     │ 料金体系     │ ご質問       │
│ → /dashboard │ → /pricing   │ → /faq       │
└──────────────┴──────────────┴──────────────┘
```

**コンポーネント**: `components/home/NavCards.tsx`（新規）

### 3.9 FinalCTA（既存維持）

§9 に配置。FooterCatch の要素を統合（必要なら）。
セカンダリCTA「ご相談」は維持判断保留（Phase B で再検討）。

### 3.10 Sticky CTA（新規）

- スクロール300px以降で表示
- モバイル優先（PCではフッタ近接で控えめ）
- 文言: 「無料で物件診断を受ける」
- 既存 `components/FloatingCTA.tsx` を活用、必要なら改修

---

## 4. データフロー / 依存関係

### コンテンツ
- 既存 `content/home/copy.ts` を拡張: `PAIN_POINTS`, `MID_CTA`, `NAV_CARDS` を追加
- 削除セクションの定数（VALUE_PROP, ECOSYSTEM, PRICING, CREDENTIALS, FAQ, FOOTER_CATCH）は**残置**（コードコメントで `// kept for /services, /pricing, /faq pages` と注記、または該当ページへ移動）

### コンポーネント
- 新規: `PainPoints.tsx`, `MidCTA.tsx`, `NavCards.tsx`
- 削除候補: `ValueProp.tsx`, `Ecosystem.tsx`, `Pricing.tsx`, `Credentials.tsx`, `FAQ.tsx`, `FooterCatch.tsx`, `EntryPoints.tsx`
  - **方針**: 即削除はせず、まず `app/page.tsx` から import を外す。本番運用後ユーザー判断でファイル本体を削除（ロールバック容易性確保）

### リンク先
- `/audit` — 全CTAの主遷移先
- `/dashboard-demo` — NavCards カード1
- `/pricing` — NavCards カード2
- `/faq` — NavCards カード3
- `/case-studies` — Results 内の「詳しく見る」

---

## 5. エラーハンドリング / リスク

### リスク1: SEO 影響
**対応**: メタタグ・構造化データは変更しない。`app/page.tsx` の metadata は維持。

### リスク2: コンバージョン低下
**対応**:
- 既存 `EngagementTracker` でセクション別エンゲージ計測
- 切替後1週間で /audit 完了率を比較
- 大幅悪化（>20%減）なら旧構成に即ロールバック

### リスク3: モバイル表示崩れ
**対応**:
- PainPoints の2カラムはモバイルで縦積み
- NavCards も同様に縦積み
- Sticky CTA はモバイルでも違和感ないよう既存FloatingCTAの実装を踏襲

### リスク4: 削除セクションの依存
**対応**: 削除前に `grep -r "ValueProp\|Ecosystem\|..." app/` で他ページからの参照を確認

---

## 6. テスト戦略

- **ローカル**: `npm run dev` で全セクションの表示・モバイル/タブレット/PCで目視確認
- **ビルド**: `npm run build` でSSGビルド通過確認
- **Lighthouse**: LCP/CLS/TBT が現状値以下を維持
- **本番**: Vercel preview デプロイで実機確認 → main マージ

---

## 7. スコープ外（Phase B/C で扱う）

- /switch から流用するCTA絞り込み（FinalCTA のセカンダリCTA処遇など） → Phase B
- 他ページ（/services, /about, /case-studies）の重複削減 → Phase B
- エリア20ページのテンプレ化 → Phase C
- 多言語対応（en）→ 将来課題
- HubSpot連携 → 採用しない（CLAUDE.md 確定済）

---

## 8. 実装順序の予感（writing-plans で詳細化）

1. 新規3コンポーネント作成（PainPoints, MidCTA, NavCards）
2. 既存コンポーネント改修（Hero スリム化, AuthorityBar 圧縮）
3. `app/page.tsx` のレイアウト変更
4. ローカル検証
5. Vercel preview デプロイ
6. main マージ → 本番デプロイ
7. 本番運用安定後（ユーザー判断）、削除セクションのファイル本体を削除（ロールバック余地確保）

---

## 9. オープン課題

- AuthorityBar の3指標の具体的選定（content/home/copy.ts の現状 AUTHORITY を確認して決定）
- MidCTA のコピー文言（実装時に確定）
- Sticky CTA の表示条件詳細（モバイル限定にするか、PCでも表示するか）
- FooterCatch 完全削除 or FinalCTA への統合詳細
