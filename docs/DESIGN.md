# DESIGN.md — SEKAI STAY

> AIエージェントが一貫したUIを生成するための設計仕様。全ページ実装の単一基準。
> 根幹は [`BRAND_FOUNDATION.md`](./BRAND_FOUNDATION.md) を参照（タグライン「あなたの物件を、観光資産に。」／世界観「上質な驚き × 信頼」）。
> 確定日: 2026-06-15 ／ 形式: Google Stitch DESIGN.md（droga5 参照）

---

## 1. Visual Theme & Atmosphere

**Editorial Gallery — 観光資産を、一流誌のように見せる。**

民泊代行サイトの「機能の羅列・チープなギミック」を捨て、旅・建築の上質なエディトリアル誌の手触りへ。巨大タイポ × 大胆な余白 × 実写 × ハイコントラストで、「あっと驚く」と「信頼できる」を同居させる。

- キーワード: **Bold Typography / Editorial / High Contrast / Cinematic / Calm Confidence（番頭の落ち着き）**
- 驚きを置く場所: 巨大見出し、フルブリードの実写、数字が動く瞬間、視点転換のコピー。
- 信頼を置く場所: 紙のような余白と静けさ、端正なグリッド、要所だけの真鍮、過剰演出の排除。
- 一言で: 「静かで、堂々としていて、上質。」

---

## 2. Color Palette & Roles

紙のような上質ベース（ivory/ink）を主役に、ティールと真鍮を**差し色**として高コントラストに効かせる。

### ベース（Neutrals）
| Role | Token | HEX | 用途 |
|------|-------|-----|------|
| Background | `ivory` | `#FBF9F4` | ページ標準背景 |
| Surface | `paper` | `#FFFDF9` | カード・浮遊面 |
| Subtle | `mist` | `#F7F5F0` | 区切りの薄背景 |
| Ink | `ink` | `#1A1A1A` | 本文・標準テキスト |
| Near-black | `sekai-black` | `#0B0B0B` | 巨大見出し・濃いセクション |
| Rule | `rule` | `#E6E1D6` | 罫線・境界 |

### 差し色（Accents）
| Role | Token | HEX | 用途 |
|------|-------|-----|------|
| Primary | `sekai-teal` | `#167B81` | 主要アクション・リンク・成功 |
| Primary hover | `bright-teal` | `#54BEC3` | hover・装飾 |
| Deep | `deep-teal` | `#0F5F65` | アイコン・限定 |
| Dark immersive | `teal-ink` | `#073A3E` 〜 `#04100f` | 没入ダークセクション背景 |
| **Brass（新規）** | `brass` | `#C9A86A` | 明背景での要所アクセント |
| **Brass on dark（新規）** | `brass-bright` | `#F0D8A4` | 暗背景での「観光資産」「8%」等 |

### ルール
- **使用比率**: ivory/ink が主役（約75%）／ teal ≈ 10%／ brass < 5%／ near-black は濃セクションに。
- **真鍮は“格”の合図**。多用すると安っぽくなる。「観光資産」「8%」「受賞」など**意味のある一点**だけに。
- **赤系は機能色のみ**（`danger #B91C1C` フォーム検証等）。ブランド表現に赤は使わない。
- CSS変数（`tailwind.config.js` に定義）:
  ```
  --brass: #C9A86A; --brass-bright: #F0D8A4;
  ivory #FBF9F4 / ink #1A1A1A / sekai-teal #167B81 / teal-ink #073A3E
  ```

---

## 3. Typography Rules

「大胆タイポ主導」。日本語本文の可読性は死守しつつ、英字・数字・見出しに**個性的なラテン書体**で編集感（格）を出す。

### 3.1 日本語フォント
- **Noto Sans JP** — weights 300 / 400 / 500 / 700。CSS変数 `--font-noto-sans-jp`。
- 役割: 見出し=700、本文=400、ラベル/ナビ=500。

### 3.2 ラテンフォント（英字・数字）
- **Space Grotesk**（見出し・数字・統計）— CSS変数 `--font-space-grotesk`。個性的グロテスク。`%`・`+57%`・`8` などの数字に“格”を出す。tabular-nums。
- **Space Mono**（ラベル・セクション番号・英タグ）— CSS変数 `--font-space-mono`。大文字＋トラッキングで `AUDIT` `SEKAI STAY` `01 / 02` の編集タグに。
- 代替: Space Grotesk → Archivo / IBM Plex Sans、Space Mono → IBM Plex Mono。

### 3.3 サイズ & ウェイト階層（大胆スケール）
| Role | Size (clamp) | Weight | line-height | letter-spacing |
|------|--------------|--------|-------------|----------------|
| Display Hero | `clamp(2.75rem, 7.6vw, 5.5rem)` | 700 | 1.08 | `-0.03em` |
| Display XL | `clamp(2.5rem, 6vw, 4.5rem)` | 700 | 1.1 | `-0.025em` |
| Heading | `clamp(1.75rem, 3.6vw, 2.75rem)` | 700 | 1.2 | `-0.01em` |
| Sub | `clamp(1.125rem, 2vw, 1.5rem)` | 500 | 1.4 | `0` |
| Body | `16px`（モバイルも下限16px） | 400 | **1.8** | `0.01em` |
| Body small | `14px` | 400 | 1.75 | `0.01em` |
| Eyebrow (mono) | `12px` | 500 | 1 | **`0.3em`** uppercase |
| Stat number (grotesk) | `clamp(3rem, 8vw, 5rem)` | 700 | 1 | `-0.02em` |

### 3.4 字間・約物（日本語）
- 巨大見出しは**ネガティブトラッキング**（`-0.02 〜 -0.03em`）で詰めてインパクト。
- 日本語本文 line-height は **1.8**（読み慣れない層の可読性を確保）。
- 行頭に句読点・閉じ括弧を残さない（禁則）。意味のまとまりで `<br>` を入れ、助詞一文字の孤立を避ける。
- 数字・英字は Space Grotesk が自動適用されるよう本文も `font-feature-settings` 配慮。

---

## 4. Component Stylings

| Component | 仕様 |
|-----------|------|
| **Primary Button** | bg `#167B81` / text `#fff` / radius `6px` / 最小高 `54px` / weight 700 / hover: `translateY(-1px)` + `#1a8b91` |
| **Ghost Button** | 透明 / border `1px rgba(255,255,255,.3)`（暗背景）or `ink/20`（明背景） / hover で border濃く |
| **Eyebrow Label** | Space Mono 12px / uppercase / `letter-spacing .3em` / 直前に幅32pxの真鍮ルール `#C9A86A` |
| **Stat Block** | 数字=Space Grotesk 700（大）+ 単位/ラベル小。tabular-nums。区切りは縦罫 `rule` |
| **Section Number** | Space Mono `01 / 02`。セクション見出しの上に小さく |
| **Card** | bg `paper` / border `1px rule` / radius `2px`（角を立てて編集的）/ hover で border `ink` |
| **Pill / Badge** | radius `999px` or `8px` / 真鍮or теールの細枠。「受賞」等に |

---

## 5. Layout Principles

- コンテナ: 標準 `max-width: 1180px`／本文ナロー `880px`／左右パディング `clamp(1.25rem, 4vw, 3rem)`。
- **フルブリードのセクション**（特にHero・実写・濃色帯）。セクション縦余白は大胆に `clamp(4.5rem, 9vw, 7.5rem)`。
- **エディトリアルな非対称**: 左寄せの大見出し＋右に余白 or 実写、という誌面的レイアウトを基本に。
- 1セクション=1メッセージ。詰め込まない。余白で“格”を出す。

---

## 6. Depth & Elevation

- **基本フラット**。影は多用しない（チープ化の元）。
- 浮遊UI（ダッシュボード・FloatingCTA・モーダル）のみ柔らかい `lift` シャドウ:
  - `lift`: `0 4px 16px rgba(26,26,26,.06), 0 20px 40px rgba(26,26,26,.05)`
- 実写の上のテキストは**スクリム（暗gradient）**で沈めて可読性を担保（影に頼らない）。
- モーション: Ken Burns（写真のゆっくり寄り18s）／段階フェードアップ（`cubic-bezier(.22,1,.36,1)`）／数字カウントアップ。`prefers-reduced-motion` で無効化。

---

## 7. Do's & Don'ts

### Do
- 巨大見出し＋ネガティブトラッキングで visual impact を出す。
- 真鍮は「観光資産」「8%」「受賞」など**意味のある一点**に限定。
- 実写（運営物件・チーム）を主役に。スクリムで文字を立てる。
- 数字は Space Grotesk・tabular-nums で“データの説得力”を見せる。
- 1画面1メッセージ。余白を恐れない。

### Don't
- **AI生成風の図版・抽象イラストを使わない**（実写・実データUIに置換）。
- **「AI」語を使わない**（「独自の仕組み」「データに基づく」と言い換え）。
- **赤をブランド表現に使わない**（機能色のみ）。
- 旧Heroのような**安っぽいギミック**（「日本初」「先着10」金バッジ、巨大8%メガグラデ、浮遊カード乱舞）を復活させない。
- モバイルで見出しを潰さない（`whitespace-nowrap`の極小化禁止）。
- 本文に Space Mono を使わない（ラベル専用）。
- 最上級・断言（「業界No.1」等）を書かない。

---

## 8. Responsive Behavior

- ブレークポイント: `sm 640 / md 768 / lg 1024`（Tailwind標準）。
- 見出しは clamp で自動縮小。Hero見出しはモバイルでも `2.75rem` 以上を確保（潰さない）。
- 本文は**モバイルでも下限16px**。line-height 1.8 維持。
- 最小タップターゲット **48 × 48px**。
- モバイルは縦積み・**1画面1メッセージ**。実写スクリムは強め（明部での可読性確保）。
- FloatingCTA はスクロール量で出し分け、コンテンツを隠さない。

---

## 9. Agent Prompt Guide（クイックリファレンス）

```
世界観: Editorial Gallery — 巨大タイポ × 余白 × 実写 × ハイコントラスト。上質な驚き×信頼。
配色: ベース ivory #FBF9F4 / ink #1A1A1A / near-black #0B0B0B。差し色 teal #167B81。真鍮 #C9A86A(明)/#F0D8A4(暗)は要所のみ<5%。赤はブランド禁止。
書体: JP=Noto Sans JP / 英見出し・数字=Space Grotesk / 英ラベル・番号=Space Mono(uppercase, ls .3em)。
見出し: 巨大・weight700・letter-spacing -0.02〜-0.03em。本文: 16px / line-height 1.8。
要素: Primary btn=teal/radius6/min-h54。Eyebrow=mono+真鍮ルール。Stat=Space Grotesk数字。Card=paper/border rule/radius2。
余白: container 1180 / narrow 880。section padding clamp(4.5rem,9vw,7.5rem)。フルブリード・左寄せ非対称。
NG: AI画像/「AI」語/赤/安っぽいギミック/モバイル潰れ見出し/本文にmono/最上級表現。
```
