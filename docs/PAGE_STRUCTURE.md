# ページ構成仕様（トップ＝sense-trust踏襲デザインに統一）

> 各ページを `CREATIVE_GUIDE.md` に沿って再設計するための構成＋コピー方針。
> 共通: Header(透明→ivory) / FloatingCTA / Footer(teal-deep)。各セクションは `SectionLabel`(EN＋和文サブ)で開く。
> 濃色(teal #167B81)↔明色(ivory)の交互。主CV=無料収益診断／副CV=無料相談。
> 各ページ末尾に CTA 帯（teal、無料診断＋相談）。

## 共通ヘッダー（各ページ冒頭）
全ページに統一の「ページヘッダー」: 巨大ENラベル＋和文サブ＋1行リード（明色 or 画像帯）。トップの ABOUT 見出しと同型。

---

## /services 事業内容（BUSINESS）
1. ページヘッダー: `BUSINESS` / 事業内容 / 「観光資産としての価値最大化のための各種サービス」
2. 4事業（トップのBIZ_ITEMSと一致）: 民泊運用代行 / 民泊の開業支援 / 民泊アンバサダーコミュニティ / 民泊向けオプション提供 — 各を深掘り（含まれる業務）
3. 民泊運用代行の含まれる業務（掲載管理・価格調整・ゲスト対応・清掃手配・多言語・ダッシュボード）を ORIGINAL SYSTEM型パネルで
4. 料金要点（8%＋¥10,000）→ /pricing 導線
5. CTA帯

## /pricing 料金（PRICE）
1. ヘッダー: `PRICE` / 民泊運営代行の料金プラン
2. 基本料金（8%＋¥10,000）大型ステートメント（トップValueBandと同型）
3. 料金に含まれるもの / かかりうる実費・オプション（ORIGINAL SYSTEM型パネル）
4. 解約金¥0(7ヶ月〜)・最低契約の理由
5. 料金FAQ（アコーディオン）
6. CTA帯

## /case-studies 実績・オーナーの声（RESULTS / WORKS）
1. ヘッダー: `RESULTS` / 民泊運営代行の実績
2. 全体平均の数字（稼働率61%/月商+57%/満足度4.8/継続率97%）= トップResultsSenseと同型(teal)
3. 事例カード（物件タイプ別 before→after・受賞）= CaseSense型
4. オーナーの声（コメントカード）
5. 対応エリア導線
6. CTA帯

## /about SEKAI STAYとは（ABOUT）
1. ヘッダー: `ABOUT SEKAI STAY` / SEKAI STAYとは（トップABOUT見出しと完全一致の大型タイポ）
2. ステートメント「物件の価値最大化×透明性のある民泊運用」＋本文（トップと一致）
3. 選ばれる3つの理由（トップのパネル3つと一致）
4. ミッション/ビジョン/バリュー
5. 代表メッセージ導線（MESSAGE）/ 会社概要導線（COMPANY）
6. CTA帯

## /company 会社概要（COMPANY）
1. ヘッダー: `COMPANY` / 会社概要
2. 会社概要テーブル（社名・所在地・代表・設立・登録番号・事業内容）
3. 拠点
4. 軽CTA

## /faq よくある質問（FAQ）
1. ヘッダー: `FAQ` / よくある質問（Deep Teal、トップFaqTealSenseと同型）
2. カテゴリ別アコーディオン（料金/契約/対応範囲/エリア/始め方）
3. CTA帯

## /contact お問い合わせ（CONTACT）
1. ヘッダー: `CONTACT` / お問い合わせ・ご相談（トップContactSense型 2分割: 無料診断/相談）
2. 相談で話せること
3. 簡易フォーム（既存フォーム流用、デザインのみ統一）
4. 安心要素（売り込みなし）

## /blog 民泊マガジン（MAGAZINE）
1. ヘッダー: `MAGAZINE` / 民泊マガジン
2. カテゴリ＋記事一覧（MagazineSense/カードのトンマナで統一、BlogGridを再スキン）
3. 個別記事(/blog/[slug])は本文＋関連記事＋本文中CTA

## /area/[slug] エリアLP
1. ヘッダー: `AREA` / 〇〇の民泊運用代行
2. エリア市場感 / 対応状況・該当事例
3. 料金・サービス要点（共通）
4. CTA（診断）

---

## 実装方針（フェーズ3）
- 既存の `SenseSections`/`SenseSections2` の共通部品（`SectionLabel`/`Reveal`/`TextSlideUp`/`ScrambleText`/`OtaChips`/パネル/カード/アコーディオン）を**ページ横断で再利用**。
- 旧コンポーネント（EditorialSimulator・ServiceBucketsInteractive・FAQClient 等）は、トップと同型の新セクションに**置き換え or 再スキン**。
- フォーム系（contact/audit）は機能を維持し**見た目のみ**ガイドに統一。
- **1ページずつ実装→:3004でPC/モバイル確認→次へ**（横スクロール・重なり・見切れ・極細枠線なしを毎回チェック）。
- 着手順: services → pricing → case-studies → about → company → faq → contact → blog → area。
