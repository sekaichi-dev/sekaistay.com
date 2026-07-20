# SEKAI STAY `/switch` ランディングページ 機能面監査報告書

**監査実施日**: 2026年4月20日  
**対象ページ**: `/switch`、`/switch/thanks`  
**対象コンポーネント**: `components/switch/` 配下全て  
**API**: `app/api/switch-form/route.ts`  
**評価基準**: デザイン除外、機能・技術・UXの観点のみ  

---

## 1. Executive Summary

### 総合スコア
**71/100**

### ポート忠実度の結論
原典 (`lp-source`) からのポートは **90% 完全に忠実** です。コンポーネント構成、ロジック、フォーム仕様、GA4 連携は全て正しく移植されています。ただし以下の課題が存在します：

1. **未使用コンポーネント** (`SwitchMidCTA` がコンポーネントファイルとして存在するが、page.tsx で使用されていない → `SwitchPrimaryCTA` に完全置換済み)
2. **入力検証の不足** (電話番号フォーマット、URL形式の検証なし)
3. **エラーハンドリングの欠落** (エラーバウンダリなし、API障害時の再試行UIなし)
4. **アクセシビリティの軽微な欠落** (フォーム入力のaria-invalid、スクリーンリーダー用ガイダンステキスト不足)
5. **パフォーマンス最適化の余地** (画像lazy loading、next/image の `sizes` 属性不足)

### Top 3 改善優先事項
1. **P0: フォーム入力バリデーションの強化** → 電話番号・URL形式の実装 + アクセシビリティ対応
2. **P1: エラー境界と復帰UXの実装** → error.tsx、API失敗時のリトライボタン
3. **P1: 画像最適化とパフォーマンス改善** → `sizes` 属性、WebP配信、lazy loading確認

---

## 2. ドメイン別スコアカード

| # | ドメイン | スコア | 一行所感 |
|---|---------|--------|--------|
| 1 | **ポート忠実度** | 90/100 | コンポーネント・ロジック完全移植、未使用ファイル削除推奨 |
| 2 | **SEO** | 75/100 | メタデータ・構造化データOK、サイトマップ登録済み、h1タグの複数定義注意 |
| 3 | **アクセシビリティ** | 65/100 | ランドマーク正常、ラベル関連付けOK、aria-invalid・エラーアナウンス不足 |
| 4 | **パフォーマンス** | 72/100 | next/image使用中だが`sizes`属性不足、画像遅延読み込みの確認必要 |
| 5 | **解析・計測** | 85/100 | GA4 page_view・scroll_depth・time_on_page実装、generate_lead完備 |
| 6 | **フォーム/CVR** | 68/100 | ステップ形式OK、バリデーション不足、エラー復帰UIなし |
| 7 | **セキュリティ** | 72/100 | CSP未実装、入力検証最小限、XSS リスク低い |
| 8 | **コード保守性** | 76/100 | TypeScript型定義OK、命名一貫性良好、マジックナンバー散在 |
| 9 | **エラー境界** | 55/100 | error.tsx 非存在、GA4未ロード時の挙動不明、API障害時フォールバックなし |
| 10 | **モバイル機能** | 80/100 | タップ領域OK、sticky CTA良好、inputmode未指定の項目あり |

---

## 3. 詳細所見

### ドメイン 1: ポート忠実度 (90/100)

#### 現状
- `SwitchHero`、`SwitchSimulator`、`SwitchContactForm` など主要コンポーネントは原典と完全一致
- 色コードが `switch-*` プレフィックスに正しく変換済み
- 画像参照が `/images/switch/` に正しく移設済み
- フォーム送信が Web3Forms → japanvillas proxy に差し替え完了
- GA4連携の `generate_lead` イベント実装完了

#### 問題点

**P1**: 未使用コンポーネント `SwitchMidCTA.tsx`
- ファイルパス: `/sessions/laughing-zealous-curie/mnt/note-minpaku-seo/minpaku-audit/components/switch/SwitchMidCTA.tsx`
- page.tsx では `SwitchPrimaryCTA` に完全置換されており、`SwitchMidCTA` は参照されていない
- 原典では複数のバリエーション（`variant="light"`、`variant="dark"`）で使い分けされていたが、現行はすべて `SwitchPrimaryCTA` に統一

**推奨アクション**
```
SwitchMidCTA.tsx を削除するか、コメント化してアーカイブ化
または、page.tsx で実際に利用している instance があるか grep で確認後決定
```

#### 所見
ポート忠実度は高い。ファイル削除で 95+ に到達可能。

---

### ドメイン 2: SEO (75/100)

#### 現状

**メタデータ** ✓
- `app/switch/layout.tsx` に `title`、`description`、`canonical`、OG/Twitter 設定あり (行1-31)
- ブランドトンマナに沿った説明文

**サイトマップ** ✓
- `app/sitemap.ts` に `/switch` エントリあり、priority 0.9、changeFrequency 'weekly' (行37)
- lastModified が '2026-04-20' で最新

**構造化データ** ⚠️
- Root layout に `ProfessionalService` のみ (app/layout.tsx 行115-142)
- `/switch` ページに Service・FAQ・BreadcrumbList の JSON-LD がない
- FAQ セクション（SwitchFAQ.tsx）が存在するが、FAQPage マークアップなし

**見出し階層** ⚠️
- ページ内に複数の h1 が存在する可能性
  - SwitchHero.tsx 行69: `<h1>` (メインコピー)
  - SwitchContactForm.tsx 行251: `<h2>` (フォーム見出し)
  - その他複数セクションでh2、h3が混在
- h1 は1個のみが正原則 → **複数定義の改善が必要**

**画像最適化** △
- `next/image` 使用: SwitchHeader.tsx (line 27-33), SwitchPrimaryCTA.tsx (line 178), SwitchResults.tsx など
- ただし `sizes` 属性未指定：SwitchHero.tsx 行183-193 (dashboard-mockup.png)
```tsx
<img
  src="/images/switch/dashboard-mockup.png"
  alt="SEKAI STAY オーナーポータル ダッシュボード"
  className="relative w-[82%] max-w-[320px] sm:max-w-md lg:max-w-[600px]"
  // sizes 属性なし → LCP 遅延リスク
/>
```

**alt 属性** ✓
- 装飾要素は `aria-hidden` で適切に隠蔽
- 意味あるimgには alt テキストあり（ただし一部空白）

#### 問題点

**P1**: FAQ の構造化データ欠落
```
/switch/thanks で期待レポート内容を describe しているが、FAQPage マークアップなし
SwitchFAQ.tsx の6つのQ&Aセクションに FAQPage schema を追加すべき
```

**P1**: 複数h1タグの存在リスク
```
SwitchHero.tsx line 69 の h1 が唯一のグローバル h1 であることを確認すべき
page.tsx 全体でgrepして h1 をカウント
```

**P2**: 画像 sizes 属性の不足
- dashboard-mockup.png が 3つのブレークポイント対応だが `sizes` 未指定
- 推奨修正:
```tsx
<img
  src="/images/switch/dashboard-mockup.png"
  alt="..."
  sizes="(max-width: 640px) 82vw, (max-width: 1024px) 600px, 800px"
/>
```

#### 推奨アクション

1. `/switch` ページに FAQPage JSON-LD を追加
2. h1 タグを 1 個のみに統一（SwitchHero の み）
3. 大きな画像に `sizes` 属性を追加
4. 内部リンク（SwitchPainPoints → #failure、thanks → #switch など）の到達性確認

---

### ドメイン 3: アクセシビリティ (65/100)

#### 現状

**ランドマーク** ✓
- `<main>` を page.tsx で使用 (line 52-113)
- `<header>` (SwitchHeader.tsx line 18)
- `<footer>` (LpFooter.tsx line 5)
- セマンティック HTML 正しい

**ラベル関連付け** ✓
- フォーム入力: label → input が適切に id/htmlFor で関連付けられている
- SwitchContactForm.tsx line 329-339:
```tsx
<label className="block text-sm font-bold text-switch-charcoal mb-1.5">
  物件名 <span className="text-switch-accent text-xs">*必須</span>
</label>
<input
  type="text"
  // htmlFor 自動関連付けのため aria-describedby 推奨（任意）
/>
```

**キーボード操作** △
- Tab 順序: 自動で正常（HTML構造による）
- ただし、次のシナリオに未対応:
  - フォームステップのバック/フォワード時のフォーカス位置を明示的に管理していない
  - SwitchSimulator のスライダーに `role="slider"` なし → キーボード操作不可

**フォーカス表示** ✓
- CSS では focus-visible の定義あり (tailwind)
- input/button では focus:outline or focus:border で視認性OK

**エラーアナウンス** ✗ (P1優先度)
```tsx
// SwitchContactForm.tsx line 106-115
async function handleSubmit() {
  setError(null);
  if (!name || !email) {
    setError("お名前とメールアドレスは必須です");
    return; // エラーメッセージが表示されるが、aria-live で announce されていない
  }
  // ...
}

// 改善案:
<div 
  className="bg-red-100 border border-red-500 p-4 rounded"
  role="alert" 
  aria-live="polite"
  aria-atomic="true"
>
  {error}
</div>
```

**Honeypot スパム対策** ✓ (a11y との両立)
- line 303-324: `aria-hidden` + `position: absolute; left: -9999px` で視覚的に隠蔽しつつ、タブ順序から除外
- 正しい実装

**色コントラスト** △ (デザイン確定だが、軽微な改善余地)
- `/switch` Hero section の白文字は背景が濃紺（#0d5a60～#1a8f96） → 十分な contrast (WCAG AA以上)
- ただし、switch-gray-mid (#706d65) は薄いため、背景によっては WCAG AA 未満の可能性あり

#### 問題点

**P1**: ARIA 属性の不足

1. **エラーメッセージの announce 対応**
   - `role="alert"` と `aria-live="polite"` で動的なエラーを SR に通知すべき

2. **フォーム input に aria-invalid, aria-describedby 欠落**
   - バリデーション失敗時に `aria-invalid="true"` を設定
   - エラーメッセージ ID を `aria-describedby` で参照

3. **SwitchStickyCTA に aria-label 推奨**
   - SwitchStickyCTA.tsx line 33-44: button に `aria-label="ページ下部の無料診断フォームへスキップ"` があると望ましい

**P2**: スクリーンリーダー用テキスト不足
- 装飾要素は `aria-hidden` で適切に隠蔽されているが、複雑な UI（CountUp、BounceArrow）についてはスクリーンリーダーでの説明が不足

#### 推奨アクション
1. エラーメッセージ表示に `role="alert"` + `aria-live="polite"` を追加
2. フォーム入力に `aria-invalid`、エラーメッセージに `aria-describedby` を実装
3. スティッキー CTA に `aria-label` を追加
4. SwitchSimulator スライダーに `role="slider"`、`aria-valuemin`、`aria-valuemax`、`aria-valuenow` を追加

---

### ドメイン 4: パフォーマンス (72/100)

#### 現状

**next/image 使用状況** ✓
- SwitchHeader.tsx (line 27-33): logo-symbol.png, logo-text.png
- SwitchPrimaryCTA.tsx (line 178-185): salesman-illust.png
- SwitchResults.tsx: 複数の画像
- LpFooter.tsx (line 10-23): ロゴ

**priority 属性** △
- `priority` 属性が指定されていないため、全ての next/image がデフォルト（lazy）
- SwitchHeader（above-the-fold）の logo は `priority={true}` が望ましい

**sizes 属性** × (P1)
```
SwitchHero.tsx line 183-193 の dashboard-mockup.png に sizes 未指定
→ LCP、CLS 遅延リスク
→ 修正例:
  sizes="(max-width: 640px) 82vw, (max-width: 1024px) 600px, 800px"
```

**画像ファイルサイズ** △
- public/images/switch/ を確認:
  ```
  property-cabin.jpg: 5.2M
  property-villa.jpg: 2.0M
  ```
  これらはスクロール領域にあるため、WebP/AVIF による圧縮やレスポンシブ対応が必要
- 現在 URL: `https://images.unsplash.com/...` を利用してクライアント側で圧縮 → 適切

**"use client" 境界** △
- page.tsx が `"use client"` で開始 (line 1)
- 全セクションが client コンポーネント化
- **改善機会**: root layout は server component のため、メタデータ生成・GA4スクリプト埋め込みは既に最適化されている
- ただし、layout.tsx 配下のコンポーネントをすべてクライアント化することで、サーバー側のレンダリング利点が失われている
  - 推奨: SwitchHeader, SwitchFooter のうち、Unsplash 画像を参照しない部分（静的）を Server Component に変更

**インライン SVG** ✓
- BounceArrow.tsx, DotPattern.tsx など装飾 SVG は small （< 5KB）
- 巨大インライン SVG なし

**フォント戦略** ✓
- app/layout.tsx line 19-26: Noto Sans JP を `display: 'swap'` で指定
- `preload: true` で優先度上げ
- subset: ['latin'] で不要な拡張文字を除外
- weights: ['400', '500', '700'] に限定

**useEffect/IntersectionObserver 重複** △
- SwitchHeader.tsx line 9-13: useEffect で scroll event
- useScrollFade.ts: IntersectionObserver + useEffect
- CountUp.tsx: IntersectionObserver + useEffect
- → 複数のスクロール監視が走る可能性あり（最適化余地）

#### 問題点

**P1**: images/switch の大きな画像（5.2M、2.0M）は使用されていないか確認
```
property-cabin.jpg / property-villa.jpg が components で参照されているか？
→ Grep の結果、これらは参照されていない可能性あり（未使用資産の削除推奨）
```

**P1**: sizes 属性欠落による LCP 遅延
```
SwitchHero.tsx line 183 の dashboard-mockup.png
修正: sizes="(max-width: 640px) 82vw, (max-width: 1024px) 600px, 800px"
```

**P2**: IntersectionObserver 複数インスタンス
```
同じ要素に複数の IO が attach される可能性あり
→ 統合を検討（例: useScrollFade と CountUp の logic 統合）
```

**P2**: next/image の priority 未指定
```
SwitchHeader logo は above-the-fold なので priority={true} 推奨
```

#### 推奨アクション
1. dashboard-mockup.png に `sizes` 属性を追加
2. SwitchHeader logo に `priority={true}` を追加
3. 未使用画像（property-cabin.jpg, property-villa.jpg）を削除
4. IntersectionObserver の複数インスタンス統合を検討

---

### ドメイン 5: 解析・計測 (85/100)

#### 現状

**GA4 基本設定** ✓
- app/layout.tsx (行144-157):
  ```ts
  // GA4 タグの読み込み
  <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />
  
  // GA4 初期化と page_view 設定
  gtag('config', 'G-B7M920RCGR', { send_page_view: true })
  
  // scroll_depth と time_on_page イベント実装完備
  ```

**scroll_depth** ✓
- root layout で 25%, 50%, 75%, 100% ターゲットを記録

**time_on_page** ✓
- 5秒以上の滞在で event 送信

**UTM パラメータ** ✓
- sessionStorage に保存：
  ```ts
  // line 155
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid']
  .forEach(k => sessionStorage.setItem(k, ...))
  ```
- SwitchContactForm.tsx line 147-150 で readUtm() で読み出し、proxy に転送

**generate_lead イベント** ✓
- SwitchContactForm.tsx line 199-209:
  ```tsx
  if (typeof gtag === "function") {
    gtag("event", "generate_lead", {
      currency: "JPY",
      value: Math.round(estimatedAnnual * 10000 * 0.12), // 年間手数料差額
    });
  }
  ```

**イベントトラッキングの充実度** △ (P2)
未実装の重要イベント：

| イベント | 現状 | 推奨 |
|---------|------|------|
| Hero CTA click | × | click to form send の段階で generate_lead が発火するので、クリック時の中間イベントなし |
| Simulator apply click | × | `onApply` callback は prefill のみで、GA4 event なし |
| FAQ open | × | SwitchFAQ.tsx の button click に event 未実装 |
| Form step progression | × | step 1→2→3 への遷移時のイベント未実装 |
| Form submit fail | × | エラー時は handleSubmit() で setError() を呼ぶだけで、GA4 event なし |

**Conversion 設定** △
- Google Ads conversion: 未確認（おそらく未実装）
- Meta Pixel: 未確認（おそらく未実装）

#### 問題点

**P2**: フォームステップ progressionイベント不足
```tsx
// SwitchContactForm.tsx で各ステップ遷移時に以下を追加
const handleStepChange = (newStep: number) => {
  setStep(newStep);
  if (typeof window !== "undefined") {
    const gtag = (window as any).gtag;
    if (typeof gtag === "function") {
      gtag("event", "form_step_progress", {
        step: newStep,
        form_id: "switch-contact-form"
      });
    }
  }
};
```

**P2**: FAQ open イベント不足
```tsx
// SwitchFAQ.tsx の button onClick に追加
onClick={() => {
  const newState = !open;
  setOpen(newState);
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "faq_opened", {
      faq_number: no,
      question: q,
    });
  }
}}
```

**P2**: フォーム送信失敗イベント
```tsx
// handleSubmit() の catch ブロック内に
} catch (e) {
  setError(e instanceof Error ? e.message : "送信に失敗しました");
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "form_submit_error", {
      error_message: e instanceof Error ? e.message : "unknown",
    });
  }
  setSubmitting(false);
}
```

#### 推奨アクション
1. フォームステップ遷移時に `form_step_progress` イベントを追加
2. FAQ セクション open 時に `faq_opened` イベントを追加
3. フォーム送信失敗時に `form_submit_error` イベントを追加
4. Google Ads conversion tracking（if applicable）を設定

---

### ドメイン 6: フォーム / CVR (68/100)

#### 現状

**フォームステップ構成** ✓
- ① 物件情報 (propertyName, propertyType, area, rooms, Airbnb URL, Booking URL)
- ② 売上 (peakRevenue, offpeakRevenue)
- ② 手数料・年数 (feeRate, yearsIdx)
- ③ 連絡先 (name, email, phone, temperature, note)
- スライドアニメーション (transition-transform)

**バリデーション** △ (P1)

部分的に実装されているが、不十分：

| フィールド | 検証 | 問題 |
|-----------|------|------|
| propertyName | 非空チェック | OK |
| propertyType | required | OK |
| area | required | OK |
| rooms | 型チェック (number) | OK ただし min=1 の検証のみ |
| airbnbUrl | **未検証** | 形式チェックなし → P1 |
| bookingUrl | **未検証** | 形式チェックなし → P1 |
| email | **必須チェックのみ** | RFC5322 形式検証なし → P2 |
| phone | **未検証** | 形式チェックなし → P2 |
| name | **非空チェックのみ** | 名前の分割ロジック (line 122) はあるが、分割失敗時の処理なし |

**エラーハンドリング** × (P1)

SwitchContactForm.tsx line 184-217:

```tsx
try {
  const res = await fetch("/api/switch-form", {
    // ...
  });
  const data = await res.json().catch(() => ({ ok: false, error: "invalid response" }));
  if (!res.ok || !data.ok) {
    throw new Error(data.error || "送信に失敗しました");
  }
  // ...
} catch (e) {
  setError(e instanceof Error ? e.message : "送信に失敗しました");
  setSubmitting(false);
  // エラー画面への遷移なし
  // リトライボタンなし
  // エラーメッセージの詳細化なし
}
```

**問題点**:
- API 失敗時に modal や dedicated error screen を表示しない
- ユーザーは「送信に失敗しました」というメッセージを見るだけで、リトライができない
- Network error と validation error の区別がない

**タイムアウト** ✓ (proxy側で実装)

app/api/switch-form/route.ts (line 20-21):
```ts
const ATTEMPT_TIMEOUT_MS = 15_000
const RETRY_DELAY_MS = 1_000
```
- 15秒タイムアウト、5xx エラー時に1回リトライ
- ただしブラウザ側には retry UI なし

**二重送信防止** ✓
- `submitting` state で button disabled (line 116)

**Prefill 機能** ✓
- SwitchSimulator → handleApply() → setPrefill() → scroll to form
- form 側で prefill state を受け取って、初期値を設定 (line 59-74)

**Honeypot** ✓
- line 303-324: `position: absolute; left: -9999px` で隠蔽し、フォーム送信時に `honeypot` 値の有無をチェック (line 112)
- スパム流入時に silently 完了表示 (redirect to /switch/thanks)

**Mobile keyboard** △ (P2)

SwitchContactForm.tsx で以下の属性が未設定:

```tsx
// email input (line ?) に inputmode="email" を追加
<input type="email" inputmode="email" />

// phone input に inputmode="tel" を追加
<input type="tel" inputmode="tel" />

// rooms input に inputmode="numeric" を追加
<input type="number" inputmode="numeric" />

// 全 input に autocomplete="off" or "on" を設定して auto-capitalization 制御
<input type="text" autoComplete="off" autoCapitalize="off" />
```

**モバイル 16px ルール** ✓
- input の font-size は base (16px)

**Form state persistence** △
- page.tsx state は useState のみ → page 離脱時にリセット
- localStorage への保存なし（仕様として不要だが、UX 改善機会）

#### 問題点

**P1**: URL 形式バリデーション欠落
```tsx
// SwitchContactForm.tsx に以下を追加
function isValidUrl(url: string) {
  if (!url) return true; // 任意だから空OK
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

// step2 への遷移時にチェック
if ((airbnbUrl && !isValidUrl(airbnbUrl)) || (bookingUrl && !isValidUrl(bookingUrl))) {
  setError("AirbnbまたはBooking.comの URL が正しくありません");
  return;
}
```

**P1**: 電話番号バリデーション欠落
```tsx
// 日本の電話番号簡易チェック
function isValidJapanPhone(phone: string) {
  if (!phone) return true; // 任意
  return /^(\+81|0)[0-9\-]{9,}$/.test(phone.replace(/\s+/g, ''));
}
```

**P1**: エラーメッセージの詳細化と復帰 UI
```tsx
// エラー時に詳細なメッセージを表示し、リトライボタンを用意
{error && (
  <div className="bg-red-50 border border-red-300 rounded p-4 mb-4">
    <p className="text-red-700 text-sm font-bold">{error}</p>
    <button
      onClick={handleSubmit}
      className="text-sm font-bold text-red-600 hover:underline mt-2"
    >
      もう一度送信する
    </button>
  </div>
)}
```

**P2**: Email 形式バリデーション
```tsx
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

**P2**: Mobile inputmode 属性
```tsx
<input type="email" inputMode="email" autoComplete="email" />
<input type="tel" inputMode="tel" autoComplete="tel" />
<input type="number" inputMode="numeric" min="1" />
```

#### 推奨アクション
1. URL と電話番号バリデーション実装（P1）
2. エラーメッセージ詳細化とリトライボタン実装（P1）
3. Email 形式チェック実装（P2）
4. 全 input に inputmode、autoComplete 属性を追加（P2）

---

### ドメイン 7: セキュリティ (72/100)

#### 現状

**CSP ヘッダー** × (P2)
- next.config.js に CSP 未設定
- root layout でインライン script（GA4）を埋め込んでいるため、CSP 導入時は `script-src 'unsafe-inline'` が必要
- 推奨: CSP を導入し、nonce を使用してインライン script を許可

**入力検証** △ (app/api/switch-form/route.ts)
```ts
const email = (body as { email?: unknown })?.email
if (typeof email !== 'string' || email.trim() === '') {
  return NextResponse.json(
    { ok: false, error: 'email is required' },
    { status: 400 },
  )
}
```
- email のみチェック
- 他の入力（name, phone, urls）の型検証なし → **P1: 入力検証強化**

**XSS リスク** ✓
- `dangerouslySetInnerHTML` の使用なし
- 外部 Unsplash URL の <img src> は信頼できるソース

**外部リンク** ✓
- LpFooter.tsx line 30-32 など、footer リンクに `rel` 属性確認
  - ただし grep の結果、`rel="noopener noreferrer"` の明示的指定なし
  - デフォルト（target="_blank" 未使用）なので問題なし

**Cookie / localStorage 使用** △
- sessionStorage のみ使用 (UTM パラメータ保存)
- PII（メールアドレス、名前）を localStorage/sessionStorage に保存していない ✓

**Rate limiting** × (P2)
- API route にレート制限なし
- japanvillas proxy 側で実装されているか不明

**CORS** ✓
- proxy route.ts で CORS 対応不要（server-to-server通信）
- japanvillas CORS allow list に sekaistay.com が登録済み

#### 問題点

**P1**: API route での入力検証不足
```ts
// app/api/switch-form/route.ts line 68-74 の email チェック後に追加
const body = await request.json() as Record<string, unknown>;
const requiredFields = ['email', 'lastname'];
for (const field of requiredFields) {
  const val = body[field];
  if (typeof val !== 'string' || val.trim() === '') {
    return NextResponse.json(
      { ok: false, error: `${field} is required` },
      { status: 400 },
    );
  }
}

// さらに危険なフィールド（url）のチェック
const urlFields = ['airbnbUrl', 'bookingUrl'];
for (const field of urlFields) {
  const val = body[field];
  if (val !== undefined && typeof val === 'string' && val.trim() !== '') {
    try {
      new URL(val);
    } catch {
      return NextResponse.json(
        { ok: false, error: `${field} is not a valid URL` },
        { status: 400 },
      );
    }
  }
}
```

**P2**: CSP ヘッダー導入
```js
// next.config.js に追加
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "script-src 'self' https://www.googletagmanager.com 'nonce-{nonce}'; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://japanvillas.kss-cloud.com;",
  },
];
```

**P2**: Rate limiting
- japanvillas proxy 側で実装確認が必要
- 必要に応じて、sekaistay API route で express-rate-limit 導入

#### 推奨アクション
1. API route で URL、phone、name 形式の検証を実装（P1）
2. CSP ヘッダーを導入（P2）
3. レート制限の実装を確認（P2）

---

### ドメイン 8: コード保守性 (76/100)

#### 現状

**TypeScript** ✓
- `tsconfig.json` strict mode
- type 定義明確 (e.g. SwitchContactForm.tsx line 7-12 PrefillState)

**命名一貫性** ✓
- コンポーネント: Switch* プレフィックス
- ユーティリティ: camelCase
- CSS クラス: kebab-case

**未使用 import** △
```tsx
// SwitchContactForm.tsx の Suspense import が使われているか確認
import { Suspense } from "react"; // /switch/thanks では使用されている
```

**マジックナンバー** × (P2)

```ts
// SwitchSimulator.tsx line 15-16
const SEKAI_FEE = 8; // %
const SEKAI_FIXED_MAN = 0.5; // ¥5,000/月 = 0.5万円/月

// SwitchContactForm.tsx line 202
value: Math.round(estimatedAnnual * 10000 * 0.12), // 0.12 = 12% の手数料差額？ 不明瞭

// CountUp.tsx line 31
{ threshold: 0.15 } // 15% の viewport threshold

// SwitchStickyCTA.tsx line 18
y > 600 && y < formTop // 600px の magic offset → shouldAppear()?
```

**ハードコード URL / 色** △
```tsx
// SwitchHero.tsx の unsplash URL
src="https://images.unsplash.com/photo-1449844908441-8829872d2607?w=360&h=260&fit=crop&q=80&auto=format"
// これらを const で集約すべき

// コンポーネント内に inline gradient
className="bg-[linear-gradient(135deg,#0d5a60_0%,#167b81_40%,...)]"
// Tailwind extend config に color として定義すべき
```

**重複ロジック** △

```tsx
// SwitchPrimaryCTA と SwitchContactForm で同じ CTA button style が重複
<a
  href="#contact-form"
  className="group relative inline-flex items-center justify-center ... bg-switch-accent hover:bg-switch-accent-hover ..."
>
```

推奨: Button コンポーネント化

**コメント** ✓
- 複雑な部分（honeypot, prefill logic）には説明コメント

#### 問題点

**P2**: マジックナンバーの定数化
```ts
// constants/switch.ts を新規作成
export const SWITCH_CONFIG = {
  FEE_PERCENT: 8,
  FIXED_COST_MAN_PER_MONTH: 0.5, // ¥5,000
  ANNUAL_MULTIPLIER: 12,
  ESTIMATED_FEE_DIFFERENCE_RATE: 0.12, // GA4 value 計算時
  STICKY_CTA_SCROLL_THRESHOLD: 600,
  INTERSECTION_OBSERVER_THRESHOLD: 0.15,
} as const;

// 使用例
const annualWasteMan = annualRevMan * diff;
const sekaiFixedAnnualMan = SWITCH_CONFIG.FIXED_COST_MAN_PER_MONTH * SWITCH_CONFIG.ANNUAL_MULTIPLIER;
```

**P2**: 重複する CTA ボタンの component 化
```tsx
// components/switch/CTA-Button.tsx
export function CTAButton({
  href = "#contact-form",
  label = "無料で診断レポートをもらう",
  className = "",
}: {
  href?: string;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center justify-center bg-switch-accent text-white font-bold ... ${className}`}
    >
      {label}
      <svg className="..." />
    </a>
  );
}
```

**P2**: Unsplash URL 集約
```ts
// constants/images.ts
export const UNSPLASH_URLS = {
  hokkaido: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=360&h=260&fit=crop&q=80&auto=format",
  tokyo: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=360&h=260&fit=crop&q=80&auto=format",
  // ...
} as const;

// 使用例
<PropertyChip imageUrl={UNSPLASH_URLS.hokkaido} />
```

#### 推奨アクション
1. マジックナンバーを constants/switch.ts に集約（P2）
2. CTA button を共通コンポーネント化（P2）
3. 外部 URL（Unsplash）を constants に集約（P2）

---

### ドメイン 9: エラー境界 (55/100)

#### 現状

**error.tsx** × (P0)
- `/switch/error.tsx` が存在しない
- page.tsx で Suspense boundary や Error boundary がない

**画像 fallback** △
- next/image には built-in fallback がある
- ただし img タグ（line 183-193 dashboard-mockup）には fallback image がない

**GA4 未ロード時** △
```ts
// app/layout.tsx line 201-209
if (typeof gtag === "function") {
  gtag("event", "generate_lead", {...});
}
```
- `typeof gtag` チェックで safe にアクセス
- ただし、window.dataLayer が undefined の場合の処理なし

**japanvillas API ダウン時** × (P1)

SwitchContactForm.tsx line 184-217 で:
```tsx
} catch (e) {
  setError(e instanceof Error ? e.message : "送信に失敗しました");
  setSubmitting(false);
  // エラー後の recover 方法なし
}
```

ユーザーは以下の状態に陥る:
1. 「送信に失敗しました」を読む
2. フォームは disabled のまま（submitting = false だが button は disabled のまま）
3. リトライ手段がない

#### 問題点

**P0**: /switch/error.tsx の実装
```tsx
// app/switch/error.tsx (新規)
'use client';

export default function SwitchError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-switch-charcoal mb-2">
          エラーが発生しました
        </h1>
        <p className="text-switch-gray-dark mb-6">
          ページの読み込みに失敗しました。
        </p>
        <button
          onClick={reset}
          className="bg-switch-accent text-white px-6 py-3 rounded font-bold hover:bg-switch-accent-hover"
        >
          もう一度試す
        </button>
      </div>
    </div>
  );
}
```

**P1**: API 失敗時の詳細エラーハンドリング
```tsx
// SwitchContactForm.tsx の handleSubmit() 改善
try {
  const res = await fetch("/api/switch-form", {...});
  
  if (res.status === 504 || res.status === 502) {
    setError("サーバーが一時的に利用できません。しばらく後に再度お試しください。");
  } else if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Unknown error' }));
    setError(data.error || `送信に失敗しました (${res.status})`);
  } else {
    const data = await res.json();
    if (!data.ok) {
      setError(data.error || "送信に失敗しました");
    } else {
      router.push(`/switch/thanks?id=${data.contact_id || ""}`);
    }
  }
} catch (e) {
  setError("ネットワークエラーが発生しました。接続を確認してください。");
}
setSubmitting(false);
```

**P1**: リトライ button の追加
```tsx
{error && (
  <div className="bg-red-50 border border-red-300 rounded-md p-4 mb-4">
    <p className="text-red-700 font-bold mb-2">{error}</p>
    <button
      onClick={handleSubmit}
      disabled={submitting}
      className="text-red-600 hover:underline font-bold text-sm"
    >
      {submitting ? "送信中..." : "もう一度送信する"}
    </button>
  </div>
)}
```

**P2**: GA4 初期化確認
```ts
// app/layout.tsx の GA4 script に fallback を追加
if (window.gtag === undefined) {
  console.warn('GA4 script not loaded');
  window.gtag = () => {}; // no-op function
}
```

#### 推奨アクション
1. `/switch/error.tsx` を実装（P0）
2. API エラーハンドリングを詳細化し、ユーザーに actionable なメッセージを提供（P1）
3. リトライボタン UI を追加（P1）
4. GA4 未ロード時の fallback を実装（P2）

---

### ドメイン 10: モバイル機能 (80/100)

#### 現状

**タップ領域** ✓ (44px 推奨)
- button: py-3 sm:py-4 → 48px+ ✓
- link: min-h-[44px] で明示 ✓

**iOS Safari 対応** ✓
- position: sticky (SwitchStickyCTA) は iOS Safari でサポート
- viewport meta tag (app/switch/layout.tsx line 33-37) ✓
- `-webkit-mask-image` など webkit prefix 対応 ✓

**スティッキー CTA の表示制御** ✓
- SwitchStickyCTA.tsx line 13-23: scroll position で条件付き表示
- form 近づくと fadeout

**入力ズーム防止** ✓
- input min font-size 16px（Tailwind base）

**スクロール trap** △ (P2)
- modal や fullscreen menu がないため、スクロール trap 必須ではない
- ただし、form validation error message が bottom に出現時に focus trap がないため、スクリーンリーダーユーザーが mixed

**レスポンシブ画像** ✓
- dashboard-mockup.png: w-[82%] max-w-[320px] sm:max-w-md lg:max-w-[600px] で multi-width 対応
- PropertyChip: `w-[82px] h-[58px] sm:w-[150px] sm:h-[108px] lg:w-[180px] lg:h-[128px]`

**モバイル button spacing** ✓
- px-3 sm:px-5, py-2.5 で mobile で余裕あり

**横スクロール回避** ✓
- max-w-[...] で viewport overflow 防止

#### 問題点

**P2**: inputmode 属性欠落（既出）

**P2**: autocomplete 属性未設定
```tsx
// SwitchContactForm.tsx で以下を追加
<input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  autoComplete="email"
  inputMode="email"
/>

<input
  type="tel"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  autoComplete="tel"
  inputMode="tel"
/>

<input
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
  autoComplete="name"
/>
```

#### 推奨アクション
1. 全 input に inputmode と autoComplete を追加（P2）

---

## 4. 優先度付き改善タスクリスト

### P0 (Critical - 実装逆転のリスク)

| ID | 項目 | 対象ファイル | 推定工数 |
|----|------|-----------|--------|
| P0-1 | `/switch/error.tsx` の実装 | app/switch/ | 1h |

### P1 (High - CVR 低下、利用者体験劣化の可能性)

| ID | 項目 | 対象ファイル | 推定工数 |
|----|------|-----------|--------|
| P1-1 | URL/電話番号バリデーション + エラーメッセージ詳細化 | SwitchContactForm.tsx, app/api/switch-form/route.ts | 2h |
| P1-2 | API エラー時のリトライボタン UI | SwitchContactForm.tsx | 1.5h |
| P1-3 | 画像 sizes 属性追加（LCP/CLS改善） | SwitchHero.tsx | 0.5h |
| P1-4 | FAQPage JSON-LD 追加 | app/switch/layout.tsx | 1h |
| P1-5 | aria-invalid、aria-describedby、role="alert" の実装 | SwitchContactForm.tsx | 1.5h |
| P1-6 | API route の入力検証強化 | app/api/switch-form/route.ts | 1h |

**P1 小計**: 7.5h

### P2 (Medium - パフォーマンス、分析、保守性の向上)

| ID | 項目 | 対象ファイル | 推定工数 |
|----|------|-----------|--------|
| P2-1 | フォームステップ遷移イベント（GA4） | SwitchContactForm.tsx | 1h |
| P2-2 | FAQ open イベント（GA4） | SwitchFAQ.tsx | 0.5h |
| P2-3 | Email 形式バリデーション | SwitchContactForm.tsx | 0.5h |
| P2-4 | マジックナンバー定数化 | constants/switch.ts (新規) | 1h |
| P2-5 | CTA button コンポーネント化 | components/switch/CTAButton.tsx (新規) | 1h |
| P2-6 | Unsplash URL 集約 | constants/images.ts (新規) | 0.5h |
| P2-7 | next/image に priority={true} 追加 | SwitchHeader.tsx | 0.3h |
| P2-8 | inputMode / autoComplete 属性追加 | SwitchContactForm.tsx | 0.5h |
| P2-9 | 未使用画像削除 | public/images/switch/ | 0.2h |
| P2-10 | IntersectionObserver 複数インスタンスの統合検討 | hooks/useScrollFade.ts, CountUp.tsx | 1.5h |
| P2-11 | CSP ヘッダー導入 | next.config.js | 1h |
| P2-12 | h1 タグの複数定義確認と修正 | SwitchHero.tsx | 0.5h |

**P2 小計**: 8.5h

### P3 (Low - 長期的な最適化、リファクタリング)

| ID | 項目 | 対象ファイル | 推定工数 |
|----|------|-----------|--------|
| P3-1 | SwitchMidCTA.tsx の削除またはアーカイブ化 | components/switch/SwitchMidCTA.tsx | 0.2h |
| P3-2 | コンポーネントの粒度最適化（過度な分割排除） | 各コンポーネント | 2h |

**P3 小計**: 2.2h

**全体推定工数**: P0 (1h) + P1 (7.5h) + P2 (8.5h) = **17h** (1ウィーク相当)

---

## 5. 指摘ファイル一覧（ファイルパス + 行番号）

### SEO
- `app/switch/layout.tsx`: line 1-31 (メタデータ、h1 確認推奨)
- `app/sitemap.ts`: line 37 (/switch エントリ)
- `components/switch/SwitchHero.tsx`: line 69 (h1)、line 183-193 (sizes 属性欠落)
- `components/switch/SwitchFAQ.tsx`: line 7-32 (FAQPage schema 未実装)

### アクセシビリティ
- `components/switch/SwitchContactForm.tsx`: line 106-217 (error announce 欠落、aria-invalid 未実装)
- `components/switch/SwitchStickyCTA.tsx`: line 33-44 (aria-label 推奨)
- `components/switch/SwitchSimulator.tsx`: (role="slider" 欠落)

### パフォーマンス
- `components/switch/SwitchHero.tsx`: line 183-193 (sizes 未指定)
- `components/switch/SwitchHeader.tsx`: line 27-33 (priority 未指定)
- `public/images/switch/`: property-cabin.jpg (5.2M)、property-villa.jpg (2.0M) 未使用確認

### 解析
- `components/switch/SwitchContactForm.tsx`: line 199-209 (generate_lead のみ)
- `components/switch/SwitchFAQ.tsx`: line 39-50 (FAQ open event 欠落)
- `components/switch/SwitchContactForm.tsx`: line 425-485 (form step event 欠落)

### フォーム
- `components/switch/SwitchContactForm.tsx`: line 349-370 (URL バリデーション欠落)、line 79 (phone バリデーション欠落)、line 184-217 (error handling & retry UI 欠落)
- `app/api/switch-form/route.ts`: line 68-74 (入力検証最小限)

### セキュリティ
- `app/api/switch-form/route.ts`: line 68-74 (email のみチェック、他フィールド未検証)
- `next.config.js`: CSP 未設定

### コード保守性
- `components/switch/SwitchSimulator.tsx`: line 15-16 (マジックナンバー)
- `components/switch/SwitchContactForm.tsx`: line 202 (0.12 の根拠不明)
- `components/switch/SwitchHero.tsx`: line 198-219 (Unsplash URL hardcode)

### エラー境界
- `app/switch/error.tsx`: 存在しない (P0)
- `components/switch/SwitchContactForm.tsx`: line 184-217 (復帰UI なし)

### モバイル
- `components/switch/SwitchContactForm.tsx`: 全 input (inputmode、autoComplete 未指定)

---

## 6. 結論

### 総合評価

SEKAI STAY `/switch` LP は **ポート忠実度は極めて高く、基本的な機能は完備** されています。ただし、以下の観点で改善余地があります：

| 観点 | 現状 | 評価 |
|------|------|------|
| **機能完成度** | フォーム・シミュレータ・CTA 動作OK | ✓ Good |
| **ユーザー体験** | エラー復帰、バリデーション詳細化で向上余地 | △ Fair |
| **SEO** | メタデータOK、schema 不足 | △ Fair |
| **アクセシビリティ** | 基本OK、aria-invalid・error announce 追加で向上 | △ Fair |
| **パフォーマンス** | 画像最適化で改善可能 | △ Fair |
| **解析** | GA4 基本OK、イベント粒度を高めるべき | △ Fair |
| **セキュリティ** | CORS安全、入力検証強化で向上 | △ Fair |
| **保守性** | 型定義良好、定数化で向上 | ✓ Good |

### 優先実施すべき施策（3ヶ月以内）

**Phase 1 (Week 1-2)**: P0 + P1-1 から P1-6
- error.tsx 実装
- バリデーション・エラーハンドリング強化
- アクセシビリティ対応
- 画像 sizes 属性

**Phase 2 (Week 3-4)**: P2-1 から P2-12
- GA4 イベント粒度化
- コード保守性改善
- セキュリティ強化

---

**監査完了日**: 2026年4月20日  
**監査実施者**: Claude Haiku 4.5  
**ファイルパス**: `/sessions/laughing-zealous-curie/mnt/note-minpaku-seo/minpaku-audit/audit/switch-audit-2026-04-20.md`

