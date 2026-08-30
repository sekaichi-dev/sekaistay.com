# sekai stay LP フォーム引き継ぎパッケージ

> 受領者: 劉 添毅（テンイチ）／sekaistay.com 担当
> 渡し主: 吉田 ヒカル（吉蔵 = AI エンジニア）
> 作成日: 2026-05-04

---

## このパッケージの目的

現在 `japanvillas.kss-cloud.com/report-request` で稼働している **物件診断レポート申込フォーム** を、テンイチ側（sekaistay.com）に移管するための引き継ぎ資料一式。

テンイチ側で同等のフォームを sekaistay.com に作り直す前提。**作り直しの参考になる仕様・コード・データの流れ・後続処理** を全部開示する。

---

## 含まれるドキュメント

| # | ファイル | 内容 |
|---|---|---|
| 1 | `01-context.md` | ビジネス背景・LP戦略・なぜ移管するか |
| 2 | `02-form-spec.md` | 現フォームの完全仕様（4ステップ・項目・選択肢・バリデーション） |
| 3 | `03-data-schema.md` | お客様が送ってくる全データ項目（型定義） |
| 4 | `04-backend-flow.md` | フォーム送信後の処理フロー（HubSpot / Sheets / レポート生成 / メール送信） |
| 5 | `05-handover-plan.md` | 移行プラン・Webhook仕様（テンイチ→吉蔵 への顧客データ転送方法） |
| 6 | `form-page.tsx` | 現フォームのソースコード本体（Next.js / TypeScript / React） |
| 7 | `submit-route.ts` | 受信API本体（バリデーション・CSRF・レート制限実装込み） |
| 8 | `report-request-types.ts` | データ型定義 |

---

## 全体の流れ（要点）

```
[お客様] → sekaistay.com の LP → フォーム入力
   ↓
[テンイチ管理] フォーム受信・データ保管
   ↓ (Webhook で転送)
[吉蔵管理] japan-villas-ops で受信
   ↓
[内向きポータル] 営業フォロー・レポート生成・メール送信
```

---

## 移行で決まっていること（2026-05-04 時点）

- **フォーム本体** = テンイチ側で作り直し（このパッケージは参考資料）
- **顧客データの保管場所** = テンイチ側で用意（HubSpot / Notion / Spreadsheet 等、好きな方法で）
- **吉蔵への転送** = Webhook 推奨（仕様は `05-handover-plan.md` 参照）
- **レポート生成・メール送信** = 当面は吉蔵側で継続

---

## 連絡先

- 吉田 ヒカル: hikaru@sekaichi.org
- 質問・実装相談はDiscord #japan-villas または直接連絡で

