import { baseCss } from '../styles.js';

export function stickerHtml({ logoSvg }) {
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8">
<style>
${baseCss()}
@page{ size:A5; margin:0; }
.sheet{ width:148mm; height:210mm; display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:14mm; background:var(--white); }
.logo{ width:78mm; color:var(--black); }
.logo svg{ width:100%; height:auto; }
.tag{ font-size:15pt; letter-spacing:.18em; color:var(--charcoal); font-weight:700; }
.tag .en{ display:block; font-size:9pt; letter-spacing:.22em; margin-top:3mm; }
</style></head>
<body><div class="sheet">
  <div class="logo">${logoSvg}</div>
  <div class="tag">管理物件<span class="en">MANAGED BY SEKAI STAY</span></div>
</div></body></html>`;
}
