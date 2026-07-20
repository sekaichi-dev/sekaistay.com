# SEKAI STAY クリエイティブガイド（sense-trust.co.jp デザイン踏襲）

> sense-trust.co.jp の**デザイン（レイアウト・タイポgrid・余白・コンポーネント・モーション）を忠実に踏襲**するためのガイド。
> **色味のみ SEKAI STAY 独自（ティール/アイボリー）に置換**。文章・画像・ロゴは SEKAI STAY 独自。
> 全ページはこのガイドに沿って実装する。「同じデザインで再現できる部分はそのまま、難しい部分のみガイドに沿って判断」。

---

## 0. 設計思想（Atmosphere）
- **エディトリアル × 大胆タイポ**。巨大な英語ラベル（ネガティブトラッキング）＋小さな和文サブで各セクションを開く。
- 余白を大きく取り、要素は少なく、1セクション1メッセージ。
- キネティックなモーション（スライドアップ／スクランブル／ワイプ／マーキー）で「動き」を与える。
- ベースは明色（アイボリー）と濃色（ティール）の交互。グレーパネル・筆ストロークをアクセントに。

---

## 1. カラー（SEKAIに置換済み）
sense-trust の navy/white を SEKAI のティール/アイボリーに置換する。
| 役割 | 値 | 用途 |
|------|-----|------|
| teal（旧navy） | `#167B81` | 濃色セクション背景・主アクション |
| teal-deep（旧navy-deep） | `#0E565A` | 最濃色セクション（FAQ・Footer等） |
| teal-light | `#1F9CA2` | 交互タイルの明るい方 |
| bright-teal | `#54BEC3` | 数字・アクセント・hover |
| ivory | `#FBF9F4` | 明色セクション基調 |
| mist | 既存 | 明色セクションの変化（FLOW等） |
| ink | `#1A1A1A` | 明色上の本文・見出し |
| 濃色上の補助テキスト | `rgba(255,255,255,0.75)` | 濃色セクション本文 |
| 罫線 | rule（明色）/ white(明色上は非表示) | **極細枠線は使わない**（white/15 等は禁止） |

---

## 2. タイポグラフィ
sense-trust 実測値ベース。
- **本文（JP）**: Noto Sans JP / 400 / 16px / line-height 1.5 / letter-spacing normal / color ink。
- **巨大ENラベル**: グロテスク（sense-trust は nimbus-sans → 無料の `Helvetica Neue, Arial`＝`.label-giant`で代替）/ 700 / **line-height 0.8〜0.95** / **letter-spacing は詰める（-0.02em〜、sense-trustは-3〜-5px）**。
  - セクション見出し: `clamp(2.5rem, 6vw, 4.375rem)`（実測 news で 60px）。
  - 大型セクション（ABOUT等）: さらに大きく `clamp(3rem, 9.5vw, 8rem)`。
- **和文サブ（ENラベル直下）**: Noto Sans JP / 700 / 18px相当（`clamp(1.125rem,1.8vw,1.375rem)`）/ ink。EN の **すぐ下** に `mt-2` で置く。
- **リード文**: 14〜16px / line-height 1.85〜1.95 / 補助色（ink/75 または white/75）。
- **数字（実績・料金）**: グロテスク（`font-grotesk`）/ 700 / 特大 `clamp(3rem,7vw,4.5rem)`、単位は小さく bright-teal。

### セクションヘッダーの型（最重要・全セクション共通）
```
<h2 class="label-giant text-[clamp(2.5rem,6vw,4.375rem)] {light?text-white:text-ink}">ENGLISH</h2>
<p class="mt-2 text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold {light?text-white:text-ink}">和文サブ</p>
```
- 既存の `SectionLabel` コンポーネントがこの型。**新規セクションは必ずこれを使う**。

---

## 3. レイアウト / グリッド / 余白
- **コンテンツ幅**: `max-w-6xl`（≒1152px）を `mx-auto` ＋ `px-6 sm:px-8`。濃色帯・画像はフルブリード可。
- **セクション縦リズム**: 明色セクション `py-24 sm:py-32`。セクション間は色替えで区切る（**極細罫線は使わない**。明示的に線を入れる場合のみ `border-rule` 1本）。
- **ヘッダー→中身**: ENラベル＋和文サブの後、`mt-12 sm:mt-16` で本文/グリッドへ（詰める場合は個別調整可）。
- **グリッド**: カードは `grid gap-8 md:grid-cols-3`（事例）/ `md:grid-cols-4`（実績数字・FLOW）/ `lg:grid-cols-2`（2カラム）。

---

## 4. コンポーネント定義

### 4-1. ボタン / リンク
- 主CTA: 角丸 `rounded-md`、塗り `bg-navy(=teal)`、白文字、`min-h-[54px] px-8`、`font-bold`、右に矢印 `→`、hover で `-translate-y-0.5` ＋ `bg-navy-hover`。
- テキストリンク: `font-bold text-sekai-teal`（濃色上は white）＋矢印、hover `opacity-70`。**装飾英語ラベルは付けない**。

### 4-2. 大型パネル（ORIGINAL SYSTEM 型）
- 角丸 `rounded-[10px]`、背景ライトグレー `#EAECEF`、内側パディング大（`lg:px-[60px] lg:py-[44-60px]`）。
- 縦に積層、間隔は詰める（`gap-4〜5`）。
- 中身: 番号(01/02…グロテスク) ＋ ネイビー(=ink/teal)太字タイトル(1.5rem) ＋ 本文(1rem, opacity 0.8)。図/画像を右に併置可（**枠外へはみ出させる場合は上・右方向のみ。下方向は出さない**＝次要素と重ねない）。

### 4-3. カード（実績/マガジン）
- `rounded-lg border border-rule bg-paper`、画像 `aspect-[4/3]`、hover で画像 `scale-110`（必要なら grayscale→color）。
- 本文: タイトル(1.125rem bold) ＋ 数字/メタ(bright-teal) ＋ 補足(13px, ink/65)。

### 4-4. アコーディオン（FAQ）
- 区切り線リスト（`divide`/`border-b`）、左に番号(グロテスク bright-teal)、右に `＋`→`×`(45°回転)トグル、`grid-rows-[0fr]→[1fr]` で開閉アニメ。

### 4-5. スライダー（BUSINESS）
- 角丸画像 `aspectRatio 1400/900`。**入ってくる画像が前の画像の上に右からワイプイン**（`@keyframes biz-wipe`: clip-path inset(0 0 0 100%)→0 ＋ scale1.12→1, 1s）。前画像は背面で全面表示のまま＝**左に背景色を出さない**。コピーは右上固定。

### 4-6. マーキー帯
- `overflow-hidden` のフルブリード帯。中身を3周分 `flex` で並べ `.marquee` で横スクロール。**枠線（border-y）は付けない**。OTAロゴは白(`brightness-0 invert`)・透過・横マージン大（`mx-10 sm:mx-16`）、ロゴ毎に高さ個別調整。

### 4-7. 巨大ゴーストワードマーク
- セクション背面に薄い巨大英字（`label-giant`, `text-ink/[0.04]` 等）。縦書き/横可。スクロールで**スクランブル収束**（`ScrambleText`）。

---

## 5. モーション（GSAP ScrollTrigger ＋ Splide）
- **スライドアップ**（`TextSlideUp`）: 行マスク overflow-hidden、inner を translateY(110%→0)、0.6〜0.75s、scroll-in で発火。見出しに使用。
- **スクランブル**（`ScrambleText`）: ランダム文字→最終へ収束、scroll-in 1回。巨大ゴースト文字に使用。
- **リベール**（`Reveal`）: opacity 0→1 ＋ yPercent/y 移動、stagger 可。本文・カードに使用。**※画面下端に接する要素は overflow-hidden で切れないよう注意**（stagger の translate が枠で切れる事故あり）。
- **ワイプ**（`biz-wipe`）: スライダー。
- **マーキー**（`.marquee`）: 横スクロール無限。
- すべて `prefers-reduced-motion` で無効化（既存コンポーネント準拠）。

---

## 6. ページ共通構成
- **Header**: 透明→スクロールで `bg-ivory`＋下境界。ロゴ(横ロックアップ)＋日本語ナビ（事業内容/料金/実績・オーナーの声/民泊マガジン/FAQ/SEKAI STAYとは）＋CTA(無料収益診断/無料相談)。英語表記は出さない。
- **FloatingCTA**: 右下固定「無料で収益診断を受ける」。
- **Footer**: teal-deep、巨大ゴーストワードマーク、リンク列。
- **CTA方針**: 主CV=無料収益診断、副CV=無料相談。各ページ末尾にCTA帯。

---

## 7. 実装ルール（このサイト固有の禁止/必須）
- ❌ 極細枠線（`border-white/15`等）をセクション/タイルに付けない。
- ❌ 装飾だけの英語ラベル（意味のない飾り英字）。ENラベルは構造見出しのみ。
- ❌ AI生成風画像・赤系配色・モバイルで潰れた見出し。
- ✅ 各セクションは `SectionLabel`（EN＋和文サブ）で開く。
- ✅ 濃色↔明色の交互でリズム。色は #167B81 軸。
- ✅ 変更後は :3004 で PC/モバイル両幅を確認（横スクロール・重なり・見切れがないこと）。
