// @splidejs/react-splide はバンドラ解決(moduleResolution: bundler)下で
// package.json の "exports" 経由の型解決に失敗するため、最小の型shimを宣言する。
// （本番ビルド = next build の型チェックを通すための回避）
declare module '@splidejs/react-splide'
declare module '@splidejs/react-splide/css'
