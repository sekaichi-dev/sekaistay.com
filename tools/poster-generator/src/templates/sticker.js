import { baseCss } from '../styles.js';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function stickerHtml({ logoSvg, property }) {
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8">
<style>
${baseCss()}
@page{ size:A5; margin:0; }
.sheet{ width:148mm; height:210mm; display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:10mm; background:var(--white); }
.logo{ width:88mm; }
.logo img, .logo svg{ width:100%; height:auto; display:block; }
.name{ font-size:17pt; font-weight:700; color:var(--charcoal); text-align:center;
  padding:0 12mm; line-height:1.5; }
</style></head>
<body><div class="sheet">
  <div class="logo">${logoSvg}</div>
  <div class="name">${esc(property.name)}</div>
</div></body></html>`;
}
