import { baseCss } from '../styles.js';

export function stickerHtml({ logoSvg }) {
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8">
<style>
${baseCss()}
@page{ size:A5; margin:0; }
.sheet{ width:148mm; height:210mm; display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:10mm; background:var(--white); }
.logo{ width:88mm; }
.logo img, .logo svg{ width:100%; height:auto; display:block; }
.tag{ font-size:13pt; letter-spacing:.28em; color:var(--mid-gray); font-weight:700; }
</style></head>
<body><div class="sheet">
  <div class="logo">${logoSvg}</div>
  <div class="tag">管理物件</div>
</div></body></html>`;
}
