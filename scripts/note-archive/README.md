# note-archive

SEKAI STAY note (https://note.com/sekaistay) のジロー時代量産記事 329本を「下書きに戻す」一括処理スクリプト。

## 前提

- Keep 25本 / Cull 329本 のリストは `keep-keys.txt` / `cull-keys.txt` に確定済み
- note.com アカウント: info@sekaistay.com (ログイン情報は .env)
- 2FA は無効化されていること

## セットアップ

```bash
cd projects/sekaistay-com/scripts/note-archive
npm install
cp .env.example .env  # 編集して NOTE_PASSWORD を入れる
npx playwright install chromium
```

## 使い方

### 1. ログインだけ実行（auth.json 生成）

```bash
HEADLESS=false npm run login
```

`auth.json` が作られればOK。screenshots/ にログイン確認用スクショが残る。

### 2. dry-run（1記事だけ・実際の非公開操作は行わない）

```bash
HEADLESS=false npm run dry
```

screenshots/ に「メニュー開閉」「下書きに戻すボタン検出」のスクショが残る。テンイチが目視で確認。

### 3. 本実行（329本処理）

```bash
npm run archive
```

- 1記事あたり5秒間隔（DELAY_MS で調整可）
- 進捗は `archive.log` に追記
- 結果は `results-<timestamp>.json`

## 環境変数

| 名前 | デフォルト | 説明 |
|---|---|---|
| `NOTE_EMAIL` | (必須) | note ログインメール |
| `NOTE_PASSWORD` | (必須) | note ログインパスワード |
| `DRY_RUN` | false | true なら操作直前で止まる |
| `LIMIT` | 0 (=全件) | 処理する記事数の上限 |
| `DELAY_MS` | 5000 | 記事間の待機時間 |
| `HEADLESS` | true | false にすると目視可能 |

## トラブルシュート

- **「menu-not-found」が多発**: note.com UI 変更の可能性。dry-run のスクショを見て selector を archive.js 内の `menuSelectors` 配列で調整
- **ログイン失敗**: 2FA が有効化されていないか確認。screenshots/03-login-error.png に画面が残る
- **レート制限/BAN**: DELAY_MS を 10000 以上に伸ばす。それでも止まればテンイチに連絡して手動切替判断

## 既知の制約

- note.com は記事一括選択の管理画面が無く、1記事ずつ編集画面を開く必要がある
- 完全削除ではなく「下書きに戻す」= 復元可能。誤って残したい記事を処理しても元に戻せる
