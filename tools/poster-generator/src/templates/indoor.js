// src/templates/indoor.js
import { baseCss } from '../styles.js';
import { PICTOGRAMS } from '../pictograms.js';

const RULES = [
  { key: 'noise', ja: '夜間は静かに', en: 'Keep quiet at night' },
  { key: 'trash', ja: 'ゴミは分別', en: 'Sort the trash' },
  { key: 'nosmoking', ja: '禁煙', en: 'No smoking' },
  { key: 'capacity', ja: '定員厳守・来訪者不可', en: 'No extra guests' },
  { key: 'checkout', ja: '時間内に退室', en: 'Check out on time' },
  { key: 'commonarea', ja: '共用部は静かに', en: 'Respect shared areas' },
  { key: 'equipment', ja: '設備は丁寧に', en: 'Use facilities with care' },
];

const ruleCard = (r) => `
  <div class="rule">
    <div class="rule-ico">${PICTOGRAMS[r.key]}</div>
    <div class="rule-ja">${r.ja}</div>
    <div class="rule-en en">${r.en}</div>
  </div>`;

export function indoorHtml({ property, contacts, logoSvg, qr }) {
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8">
<style>
${baseCss()}
@page{ size:A4; margin:0; }
.sheet{ width:210mm; height:297mm; padding:14mm 14mm 10mm; background:var(--white);
  display:flex; flex-direction:column; gap:6mm; }
.header{ display:flex; align-items:center; justify-content:space-between;
  border-bottom:2px solid var(--light-gray); padding-bottom:4mm; }
.header .logo{ width:46mm; color:var(--black); }
.header .logo svg{ width:100%; height:auto; }
.welcome{ text-align:right; }
.welcome b{ font-size:16pt; } .welcome .en{ font-size:10pt; }

.section-title{ font-size:12pt; font-weight:700; color:var(--deep-teal);
  display:flex; align-items:center; gap:2mm; margin-bottom:2mm; }
.section-title .en{ color:var(--mid-gray); font-size:9pt; font-weight:400; }

.emerg{ background:var(--teal-tint); border-radius:3mm; padding:5mm; }
.emerg-row{ display:flex; gap:4mm; }
.emerg-911{ flex:1; display:flex; gap:3mm; }
.num{ flex:1; background:var(--white); border:1.5px solid var(--bright-teal);
  border-radius:2mm; padding:3mm; text-align:center; }
.num .big{ font-size:22pt; font-weight:700; color:var(--charcoal); }
.num .lbl{ font-size:8.5pt; color:var(--dark-gray); }
.contact-row{ display:flex; gap:4mm; margin-top:4mm; }
.contact{ flex:1; display:flex; align-items:center; gap:3mm; background:var(--white);
  border-radius:2mm; padding:3mm 4mm; }
.contact .ico{ width:9mm; height:9mm; color:var(--deep-teal); flex:none; }
.contact .v{ font-size:13pt; font-weight:700; }
.contact .s{ font-size:8.5pt; color:var(--mid-gray); }
.contact .qr{ width:18mm; height:18mm; margin-left:auto; }
.contact .qr img{ width:100%; height:100%; }

.info{ display:flex; gap:4mm; }
.info-main{ flex:1; background:var(--cloud); border-radius:3mm; padding:5mm; }
.addr-ja{ font-size:15pt; font-weight:700; }
.addr-ro{ font-size:9.5pt; }
.wifi-line{ margin-top:3mm; font-size:11pt; }
.wifi-line b{ color:var(--deep-teal); }
.checkout-line{ margin-top:2mm; font-size:11pt; }
.info-wifiqr{ width:30mm; text-align:center; align-self:center; }
.info-wifiqr img{ width:26mm; height:26mm; }
.info-wifiqr .c{ font-size:7.5pt; color:var(--mid-gray); }

.rules{ display:grid; grid-template-columns:repeat(7,1fr); gap:2mm; }
.rule{ text-align:center; }
.rule-ico{ width:13mm; height:13mm; margin:0 auto 1.5mm; color:var(--deep-teal); }
.rule-ja{ font-size:8.5pt; font-weight:700; line-height:1.3; }
.rule-en{ font-size:7pt; line-height:1.2; }

.footer{ margin-top:auto; display:flex; align-items:center; justify-content:space-between;
  border-top:1px solid var(--light-gray); padding-top:3mm; }
.footer .manual{ display:flex; align-items:center; gap:3mm; }
.footer .manual img{ width:18mm; height:18mm; }
.footer .manual .t b{ font-size:10pt; } .footer .manual .t .en{ font-size:8pt; }
.footer .brand{ font-size:9pt; color:var(--mid-gray); letter-spacing:.1em; }
</style></head>
<body><div class="sheet">

  <div class="header">
    <div class="logo">${logoSvg}</div>
    <div class="welcome"><b>ようこそ</b><div class="en">WELCOME</div></div>
  </div>

  <div>
    <div class="section-title">🆘 緊急連絡先 <span class="en">EMERGENCY</span></div>
    <div class="emerg">
      <div class="emerg-row">
        <div class="emerg-911">
          <div class="num"><div class="big">110</div><div class="lbl">警察 / Police</div></div>
          <div class="num"><div class="big">119</div><div class="lbl">消防・救急 / Fire & Ambulance</div></div>
        </div>
      </div>
      <div class="contact-row">
        <div class="contact">
          <div class="ico">${PICTOGRAMS.phone}</div>
          <div><div class="v">${contacts.associationPhone}</div>
            <div class="s">運営の困りごと（24h）/ Support 24h</div></div>
        </div>
        <div class="contact">
          <div class="ico">${PICTOGRAMS.line}</div>
          <div><div class="v">SEKAI STAY LINE</div>
            <div class="s">一次窓口 ${contacts.lineHours} / First contact</div></div>
          <div class="qr"><img src="${qr.line}" alt="LINE QR"></div>
        </div>
      </div>
    </div>
  </div>

  <div>
    <div class="section-title">📶 この物件 <span class="en">THIS PROPERTY</span></div>
    <div class="info">
      <div class="info-main">
        <div class="addr-ja">${property.addressJa}</div>
        <div class="addr-ro en">${property.addressRomaji}</div>
        <div class="wifi-line"><b>WiFi</b> ${property.wifiSsid} / <b>PW</b> ${property.wifiPassword}</div>
        <div class="checkout-line"><b style="color:var(--deep-teal)">Check-out</b> ${property.checkoutTime}</div>
      </div>
      <div class="info-wifiqr">
        <img src="${qr.wifi}" alt="WiFi QR">
        <div class="c">WiFi 自動接続<br>Scan to connect</div>
      </div>
    </div>
  </div>

  <div>
    <div class="section-title">⚠️ お願い <span class="en">HOUSE RULES</span></div>
    <div class="rules">${RULES.map(ruleCard).join('')}</div>
  </div>

  <div class="footer">
    <div class="manual">
      <img src="${qr.manual}" alt="House manual QR">
      <div class="t"><b>ハウスマニュアル</b><div class="en">Full house guide</div></div>
    </div>
    <div class="brand">SEKAI STAY</div>
  </div>

</div></body></html>`;
}
