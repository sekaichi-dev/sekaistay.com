# Meta Ads クリエイティブ Manifest

> **キャンペーン**: SS-Meta-Interest（興味関心ターゲ・初回ローンチ）
> **配信開始予定**: 2026-05-14〜（テンイチ管理画面で実行）
> **実サイズ**: 1254×1254 PNG（Meta 推奨 1080×1080 を上回る・自動リサイズで問題なし）

---

## クリエイティブ一覧

| ファイル名 | 訴求パターン | LP | キャッチコピー | 強み |
|---|---|---|---|---|
| `ss-portal.png` | ポータル主導 | `/switch/portal` | 「あなたの物件、リアルタイムで、ぜんぶ見える。」 | ¥3.3M YTD・継続率97%・iPhone ダッシュボード |
| `ss-price.png` | 価格主導 | `/switch` | 「民泊代行、まだ20%払ってますか？」 | 20% vs 8% 対比・赤CTAで強い行動喚起 |
| `ss-trust.png` | 信頼主導 | `/switch/founder` | 「民泊代行の常識を変えに来ました」 | 創業者2名顔出し・BEST OF SAUNA STAY 2026・スーパホスト多数認定 |

---

## ⚠️ 配信前要確認（景表法 / Meta 審査リスク）

### meta-int-portal-v1.jpg
- **「97%継続率」**: 根拠データ要。実測か想定か？数字の出典資料を Meta 審査時に求められる可能性あり
- **「24時間 4言語対応」**: 自社オペで4言語提供か、AirHost AI 返信依存か。後者なら「AI による多言語対応」表記を推奨
- **ダッシュボード内 ¥3,320,847 YTD / +18.6% YoY**: 想定値ならイメージ表記の注釈（「※イメージ」等）を画像内に入れることを検討

### meta-int-price-v1.jpg
- **「20%」**: 業界相場 15-25% で誇張ではない・OK
- **「業界最安水準の手数料8%」**: 競合調査の根拠資料があれば審査通過しやすい

### meta-int-trust-v1.jpg
- **「BEST OF SAUNA STAY 2026受賞」**: 受賞証明を保管
- **「Airbnb スーパホスト認定多数」**: SEKAI STAY の運用形態（各オーナーアカウントを並列運営）と整合・OK

---

## UTM 付き本番配信 URL

| 訴求 | URL |
|---|---|
| ポータル | `https://sekaistay.com/switch/portal?utm_source=meta&utm_medium=cpc&utm_campaign=SS-Meta-Interest&utm_content=portal-dashboard-v1&utm_term=portal` |
| 価格 | `https://sekaistay.com/switch?utm_source=meta&utm_medium=cpc&utm_campaign=SS-Meta-Interest&utm_content=price-20vs8-v1&utm_term=price` |
| 信頼 | `https://sekaistay.com/switch/founder?utm_source=meta&utm_medium=cpc&utm_campaign=SS-Meta-Interest&utm_content=trust-founders-v1&utm_term=trust` |

> `lp_variant` は LP 側で自動判定。`utm_term` は GA4 / Supabase で訴求軸別 CVR 集計用。

---

## 推奨追加サイズ（後追いで OK）

初期は Feed 正方形 1080×1080 のみで開始。配信1週間後にデータが出てから:

| サイズ | 用途 | 優先度 |
|---|---|---|
| 1080×1080 | Facebook/Instagram Feed | ✅ 必須（提供済み） |
| 1080×1350 | Instagram Feed 縦長（大きく表示） | 🟡 1週間後に追加 |
| 1080×1920 | Instagram Stories / Reels | 🟡 Reels 配置を試す時に |
| 動画15秒 | 信頼主導 T-1 動画版（CTR 1.5-2倍狙い） | 🟢 配信1週間後に |
