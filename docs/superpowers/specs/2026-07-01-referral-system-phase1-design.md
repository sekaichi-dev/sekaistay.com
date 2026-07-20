# 紹介者システム Phase 1 — 設計仕様

- **日付**: 2026-07-01
- **対象リポジトリ**: `sekaistay-com`（Vercel / Next.js 14 App Router）
- **スコープ**: Phase 1 のみ（sekaistay-com 内で完結する範囲）
- **Phase 2（別仕様）**: オーナー自動登録・成約自動化・支払（ops / owner-app / discord-claude / 外部営業ポータル連携）

---

## 1. 背景と目的

SEKAI STAY（民泊運用代行）に物件オーナーを紹介してくれた人へ、紹介報酬（成約1件あたり固定額）を振込で支払う。そのための **紹介者登録・紹介の突合・可視化** の基盤を作る。

- 紹介者は `/referral` で登録し、固有の**紹介コード**を得る。
- 紹介を受けた見込みオーナーは `/contact` の**任意の紹介者欄**にコード（と名前）を記入する。
- 記入内容を紹介者台帳と突合し、「誰が紹介したか」を管理画面で追える形にする。
- 報酬は振込で払うため、登録時に**振込先を暗号化保存**する。
- 規約は SEKAI STAY 側に有利（任意謝礼・法的支払義務なし・随時変更可・自己紹介/既存商談は対象外）。

### 決定済みの事業判断（ユーザー確認済み）
| 項目 | 決定 |
|---|---|
| 報酬体系 | 成約1件＝固定額（金額は規約に明記せず「別途通知」） |
| 突合方法 | 紹介コード＋名前の併用（コードはサーバ自動突合、名前のみは管理画面で人が確定） |
| 報酬確定タイミング | 成約（運用委託契約締結）時 ※自動確定は Phase 2 |
| 振込先 | 登録時に暗号化保存 |
| 通知 | Slack `#404-sekaistay-リード獲得` へ自動投稿 |
| 規約 | 自己紹介・既存商談は対象外／SEKAI STAY 都合で変更可／法的支払義務を負わない |

---

## 2. Phase 1 / Phase 2 の境界（重要）

本依頼は 3 つのインフラ（Vercel 本体・Mac mini 自ホスト 2 アプリ・discord-claude bot）＋外部営業ポータルにまたがるため 2 分割する。

**Phase 1（本仕様・sekaistay-com 内で完結・低リスク）**
- `/referral` 登録フォーム＋紹介コード発行＋台帳（Supabase）
- `/contact` 紹介者欄追加＋突合＋attribution 保存
- `/admin/referrals` 台帳ビュー（突合状態・手動確定）
- Slack #404 通知
- 規約

**Phase 2（別仕様・別インフラ・要 production 承認）— 本仕様の対象外**
- 既存オーナーの自動紹介者化・オーナーポータルへのコード表示（ops / owner-app 改修）
- 振込先を ops `payout.ts` から連携（オーナーは再入力不要）
- #405 発火サイン（`C-XXXXXX`）→ 紹介元を辿って報酬自動確定
- 外部紹介者へのメール連絡（成約通知・振込予定）・支払ステータス管理

---

## 3. 確認済みの既存実装（推測でなく実体）

### sekaistay-com（このリポ）
- Supabase プロジェクト `cswdzbmworwpzeihyicd`（sekai-stay-marketing）。`SUPABASE_SERVICE_ROLE_KEY` でサーバ書込。
- `lead_submissions` テーブル（`lib/lead-submissions.ts`）に**紹介者を記録する列は存在しない**。暗号化ヘルパも無い。
- Slack 投稿は `lib/lead-forward.ts` の `forwardLeadToSlack(leadId, opts)` にベタ書き（汎用投稿関数なし）。現状の投稿先は `SLACK_LEAD_CHANNEL_ID`＝`#402-sekaistay面談申込`（`C0AFH8LF3TK`）。**#404 は別チャンネルで未設定**。bot token `SLACK_BOT_TOKEN`。
- マイグレーションは `supabase/migrations/*.sql`。適用は Supabase MCP `apply_migration`（npm script なし）。
- 既存リードフローに `test-classifier.ts`（名前に「テスト/test」等 → `kind=test`、外部通知 skip）。
- 送信 API `app/api/report-requests/submit/route.ts` に Origin チェック・`MAX_LENGTHS` バリデーション・in-memory レート制限あり。
- 管理系の gating に `X_CONTENT_ADMIN_KEY`（Sensitive env）を既に使用。

### sekai-stay-ops（Phase 2 対象・参考）
- オーナー振込先は `src/lib/payout.ts`（Redis `data:payout-accounts` + file fallback、`PAYOUT_ENCRYPTION_KEY` で暗号化、オーナーメールキー）。オーナーは `/owner/payout` で登録済み。
- 暗号化形式は `ivHex:tagHex:cipherHex`（AES-256-GCM）。本仕様も同形式に揃える。

---

## 4. データモデル

### 4.1 新テーブル `referrers`

```sql
CREATE TABLE referrers (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at                timestamptz NOT NULL DEFAULT now(),
  code                      text NOT NULL UNIQUE,        -- SS-XXXXXX
  name                      text NOT NULL,
  email                     text NOT NULL,
  phone                     text NOT NULL,
  is_owner                  boolean NOT NULL DEFAULT false,  -- 自己申告
  -- 振込先（平文：管理画面での識別に必要・低機微）
  bank_name                 text NOT NULL,
  bank_code                 text,
  branch_name               text NOT NULL,
  branch_code               text,
  account_type              text NOT NULL,               -- '普通' | '当座'
  -- 振込先（暗号化：iv:tag:cipher）
  account_number_enc        text NOT NULL,
  account_holder_enc        text NOT NULL,
  account_holder_kana_enc   text NOT NULL,
  -- 規約
  terms_version             text NOT NULL,
  terms_agreed_at           timestamptz NOT NULL,
  -- 運用
  status                    text NOT NULL DEFAULT 'active', -- 'active' | 'disabled'
  kind                      text NOT NULL DEFAULT 'real',   -- 'real' | 'test'
  client_ip                 text,
  user_agent                text
);

CREATE UNIQUE INDEX idx_referrers_email_active
  ON referrers (lower(email)) WHERE status = 'active';
```

- **冪等**: 同一メール（active）で再登録が来たら新規作成せず既存レコードのコードを返す。
- **暗号化対象**: 口座番号・口座名義・名義カナ。銀行名/支店名/種別は平文（管理画面の可読性と、機微度の低さから）。

### 4.2 `lead_submissions` への列追加

```sql
ALTER TABLE lead_submissions
  ADD COLUMN IF NOT EXISTS referrer_code  text,
  ADD COLUMN IF NOT EXISTS referrer_name  text,
  ADD COLUMN IF NOT EXISTS referrer_id    uuid,   -- 突合できた場合のみ referrers.id
  ADD COLUMN IF NOT EXISTS referrer_match text;   -- 'code' | 'name_candidate' | 'unmatched' | NULL
```

`referrer_match` の意味：
- `NULL` … 紹介者欄が未記入
- `code` … コードが `referrers` に一致（`referrer_id` セット）
- `name_candidate` … コード未記入で名前のみ → 管理画面で人が確定
- `unmatched` … コード記入だが台帳に無い（管理画面で確認）

---

## 5. 紹介コード発行

- 形式：`SS-` + Crockford Base32 6桁（`0/O/1/I/L/U` を除く 32→実質 charset `0123456789ABCDEFGHJKMNPQRSTVWXYZ` から紛らわしい文字を排除した安全集合を使用）。
- 生成 → `referrers.code` の UNIQUE 制約で衝突時はリトライ（最大 N 回）。
- `lib/referral-code.ts` に `generateReferralCode()`（純粋関数、乱数注入可でテスト容易）と `isValidReferralCodeFormat()`。

---

## 6. `/referral` ページ＋登録フォーム

- 既存 `app/contact/page.tsx` と同じエディトリアル調（`Header`/`Footer`/`FloatingCTA`/`Field` パターン、`SEKAI_STAY_Creative_Guide.md` トークン）。
- 入力項目：
  1. 氏名（必須）
  2. メール（必須）
  3. 電話（必須）
  4. SEKAI STAY 物件オーナーですか（チェック・任意 → `is_owner`）
  5. 振込先：銀行名／銀行コード（任意）／支店名／支店コード（任意）／口座種別（普通・当座）／口座番号／口座名義／名義カナ（必須群）
  6. 規約同意チェック（必須。未チェックは送信不可）
- 送信先：新 API `POST /api/referral/register`。
- 成功状態：**`SS-XXXXXX` を大きく表示＋コピーボタン**、「この画面のコードを保存してください（メール送付は今後対応）」の注記。
- クライアント側 UX：contact と同じ submitting/error/done ステート。

### 割り切り（Phase 1 既知の制限）
- 外部紹介者へのメール送付は Phase 2。Phase 1 は画面表示のみ。
- 口座情報の本人確認・実在性チェックはしない（振込時に人が確認）。

---

## 7. `/contact` 紹介者欄

- `app/contact/page.tsx` のフォーム末尾に**任意**2フィールドを追加：
  - 紹介者コード（`referrerCode`）
  - 紹介者お名前（`referrerName`）
  - ヘルパー「SEKAI STAY の紹介者から紹介された方はご記入ください」
- 送信 payload（`/api/report-requests/submit`）に `referrerCode` / `referrerName` を追加。
- サーバ側（submit route → `insertLeadSubmission`）で：
  - `referrerCode` があれば `referrers` を **大文字化・trim して code で検索**。
    - ヒット → `referrer_id` セット、`referrer_match='code'`
    - ミス → `referrer_match='unmatched'`
  - コード無し・名前あり → `referrer_match='name_candidate'`
  - 両方無し → すべて NULL
- `SubmitPayload` / `LeadSubmissionRow` / `insertLeadSubmission` / `MAX_LENGTHS` を拡張。突合は submit route で実行（`lib/referrer-match.ts` に関数分離）。

---

## 8. `/admin/referrals` 台帳ビュー

- データ取得はサーバ API `GET /api/admin/referrers?key=<X_CONTENT_ADMIN_KEY>`（キー不一致は 401）。
- 表示：
  - **紹介者一覧**：コード・氏名・メール・電話・オーナー種別・登録日・口座（既定はマスク `****1234`）。
  - **紹介付きリード一覧**：`lead_submissions` の `referrer_*` が非 NULL の行。突合状態バッジ（code / name_candidate / unmatched）。
  - **手動確定 UI**：`name_candidate` / `unmatched` のリードに対し、管理者が該当紹介者を選んで `referrer_id`/`referrer_match='code'` に更新（`POST /api/admin/referrers/resolve`）。
  - **口座 reveal**：明示ボタンで復号値を表示（`POST /api/admin/referrers/reveal`、同じ admin キー）。
- 既存 `/admin`（localStorage ベースの旧診断台帳）とは別ページ。認証はデータ API のキーゲートで担保（クライアントの見た目ガードには依存しない）。

---

## 9. Slack #404 通知

- `lib/slack-notify.ts`（新規）に汎用 `postToSlack(channelId, blocks, opts?)` を実装（`chat.postMessage`、`SLACK_BOT_TOKEN`）。
- `forwardLeadToSlack`（既存）は挙動を変えずに、共通の投稿部分を `postToSlack` に寄せる（任意リファクタ。壊さないことを優先し、最小なら新関数のみ追加でも可）。
- 新 env `SLACK_REFERRAL_CHANNEL_ID`（＝#404 の channel_id）。
- 通知トリガー：
  1. **新規紹介者登録**（`/api/referral/register` 成功時、`kind=real` のみ）
  2. **紹介付きリード受信**（submit route で `referrer_*` が入ったとき、`kind=real` のみ・突合状態を明記）
- test（`kind=test`）は skip（既存パターン踏襲）。
- **デプロイ前提**：Jennie bot を #404 に招待し channel_id を取得（Slack MCP `slack_search_channels` で引く）。#404 が Slack Connect（外部メンバー有）でも bot token 投稿は可。

---

## 10. 規約（ドラフト）

`/referral` ページ内および `/referral/terms`（または同ページ内アコーディオン）に掲示。`terms_version`（例 `2026-07-01`）を保存。要点：

1. 本紹介報酬は SEKAI STAY による**任意的・恩恵的な謝礼**であり、SEKAI STAY は本規約に基づく**法的な支払義務を負わない**。
2. 報酬対象は、紹介された見込みオーナーが SEKAI STAY と**運用委託契約を締結（成約）した場合のみ**。契約に至らなかった場合・成約後に解約/キャンセルされた場合は対象外。
3. **自己紹介、および SEKAI STAY が既に商談中・接触済みの見込み先は対象外**。
4. 同一見込み先に複数の紹介があった場合、**最初に有効に成立した紹介**を優先。
5. 報酬額・支払条件・本規約の内容は、SEKAI STAY が**随時変更・終了できる**。
6. 個人情報および振込先情報は SEKAI STAY のプライバシーポリシーに従い取り扱う。
7. 反社会的勢力の排除、虚偽申告・不正行為があった場合の対象外・返還。
8. 報酬額は本規約に明記せず、SEKAI STAY が別途定め通知する。

※ 最終文言は本仕様レビュー時に確定。法的表現は「支払義務を負わない任意謝礼」の建て付けを保つ。

---

## 11. 暗号化・セキュリティ

- `lib/crypto.ts`（新規）：AES-256-GCM。env `REFERRAL_ENC_KEY`（32 バイト＝64 hex）。`encrypt(plain): "iv:tag:cipher"` / `decrypt(str): plain`。ops の `credential-cipher.ts` と同形式。
- `/api/referral/register`：既存 submit route と同様に Origin チェック・`MAX_LENGTHS` 相当の長さ制限・in-memory レート制限・honeypot 隠しフィールドを流用。
- 口座情報はサーバ（service role）でのみ復号。クライアントに平文口座を返さない（登録直後も画面には出さない）。
- admin API はすべて `X_CONTENT_ADMIN_KEY` 必須。

---

## 12. 追加する環境変数

| env | 用途 | 備考 |
|---|---|---|
| `REFERRAL_ENC_KEY` | 振込先暗号化 | 新規生成（64 hex）。Vercel Production に投入 |
| `SLACK_REFERRAL_CHANNEL_ID` | #404 投稿先 | channel_id を取得して投入 |
| `SLACK_BOT_TOKEN` | Slack 投稿 | 既存（流用） |
| `X_CONTENT_ADMIN_KEY` | 管理 API ゲート | 既存（流用） |

---

## 13. テスト方針

- `lib/referral-code.ts`：形式・一意性（衝突リトライ）ユニットテスト。
- `lib/crypto.ts`：暗号ラウンドトリップ、改ざん検知（tag 不正で失敗）。
- `lib/referrer-match.ts`：code一致/未一致/名前のみ/両方無しの分岐。
- `test-classifier` 流用の test 判定が /referral 登録・紹介付きリード通知の skip に効くこと。
- ローカル `npm run dev` で `/referral`・`/contact`・`/admin/referrals` を目視（CSS 崩れ・SEO 非破壊）。
- 本番検証は本名相当＋捨てアドレスで（テスト名は suppression される既知挙動）。

---

## 14. 変更ファイル一覧（見取り図）

**新規**
- `app/referral/page.tsx`, `app/referral/layout.tsx`
- `app/api/referral/register/route.ts`
- `app/admin/referrals/page.tsx`
- `app/api/admin/referrers/route.ts`, `.../resolve/route.ts`, `.../reveal/route.ts`
- `lib/referrers.ts`（insert/find/idempotent）, `lib/referral-code.ts`, `lib/crypto.ts`, `lib/slack-notify.ts`, `lib/referrer-match.ts`
- `supabase/migrations/20260701_referrers.sql`, `supabase/migrations/20260701_lead_referrer_cols.sql`
- 各ユニットテスト

**変更**
- `app/contact/page.tsx`（紹介者欄）
- `app/api/report-requests/submit/route.ts`（referrer 受領・突合・#404 通知・MAX_LENGTHS）
- `lib/lead-submissions.ts`（`SubmitPayload`/`LeadSubmissionRow`/insert に referrer 追加）
- `lib/lead-forward.ts`（`postToSlack` 切り出し・任意）

---

## 15. Phase 2 への布石（本仕様で壊さない設計）

- `referrers` の暗号化フィールド構成を ops `payout.ts` に寄せておき、将来オーナー台帳と統合しやすくする。
- `referrer_code` をリードに保存しておくことで、Phase 2 で「成約した新オーナー → 元リード → 紹介コード」を辿れる素地を作る（※コードを営業ポータル/CRM まで運ぶ設計は Phase 2 で扱う）。
