// 室内掲示用の本人確認 QR シートを物件ごとに作る（印刷して室内の玄関内側かテーブルに置く。チェックアウトまでに送ってもらう・2026-10-13 テンイチ決定）。
// 使い方: CHECKIN_QR_SECRET=... node scripts/checkin-qr.mjs [--base https://sekaistay.com] [--out tmp/checkin-qr] [--only 351180,351183]
// 物件一覧は本番の /api/guest-register/properties（公開・有効物件のみ）から取る。
// 秘密は Vercel の CHECKIN_QR_SECRET と同じ値を渡す（違う値で作った QR は本番で「無効」になる）。
import { createHmac } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import QRCode from "qrcode";

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const BASE = opt("--base", "https://sekaistay.com").replace(/\/+$/, "");
const OUT = opt("--out", "tmp/checkin-qr");
const ONLY = (opt("--only", "") || "").split(",").map((s) => s.trim()).filter(Boolean);
const SECRET = (process.env.CHECKIN_QR_SECRET || "").trim();
if (!SECRET) { console.error("CHECKIN_QR_SECRET is required"); process.exit(1); }

// lib/checkin-verify.ts の roomKey と同じ計算（TS を読めない環境でも動くよう複製）
const roomKey = (id) => createHmac("sha256", SECRET).update(`checkin:${id}`).digest("hex").slice(0, 16);

const res = await fetch(`${BASE}/api/guest-register/properties`, { headers: { accept: "application/json" } });
if (!res.ok) { console.error(`properties ${res.status}`); process.exit(1); }
const { properties } = await res.json();
const targets = properties.filter((p) => ONLY.length === 0 || ONLY.includes(p.id));

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function sheetHtml(p, url, svg) {
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><title>本人確認 QR ${esc(p.name)}</title>
<style>
@page{size:A4;margin:14mm}
body{font-family:"Hiragino Sans","Noto Sans JP","Noto Sans CJK JP",system-ui,sans-serif;color:#2d2d2d;margin:0}
.sheet{max-width:180mm;margin:0 auto}
.brand{font-size:11px;letter-spacing:.14em;color:#167b81;font-weight:700}
h1{font-size:26px;margin:4px 0 2px;line-height:1.25}
h1 small{display:block;font-size:15px;font-weight:600;color:#4e4c49;margin-top:4px}
.prop{font-size:15px;color:#4e4c49;margin:6px 0 14px}
.qrwrap{display:flex;gap:18px;align-items:flex-start}
.qr{width:62mm;height:62mm;flex:none;border:1px solid #d6d3d0;padding:4mm;border-radius:6px;background:#fff}
.qr svg{width:100%;height:100%}
.steps{flex:1;min-width:0}
.steps ol{margin:0;padding-left:1.2em;font-size:14px;line-height:1.6}
.steps li{margin-bottom:8px}
.steps b{display:block}
.sub{color:#706d65;font-size:12px}
.why{margin-top:14px;padding:10px 12px;background:#e5f4f5;border-radius:6px;font-size:12px;line-height:1.6;color:#167b81}
.foot{margin-top:12px;font-size:10px;color:#706d65;word-break:break-all}
</style></head><body><div class="sheet">
<div class="brand">SEKAI STAY</div>
<h1>チェックイン時の本人確認<small>ID check at check-in ／ 체크인 본인 확인 ／ 入住身份核验</small></h1>
<div class="prop">${esc(p.name)}${p.nameEn ? ` ／ ${esc(p.nameEn)}` : ""}</div>
<div class="qrwrap">
  <div class="qr">${svg}</div>
  <div class="steps"><ol>
    <li><b>チェックアウトまでに、お部屋でこのQRコードをスマートフォンで読み取ってください。</b><span class="sub">Before check-out, scan this code with your phone in the room. ／ 체크아웃 전까지 객실에서 이 QR 코드를 스마트폰으로 스캔하세요. ／ 退房前请在房间内用手机扫描此二维码。</span></li>
    <li><b>予約番号（または姓と到着日）と、宿泊される全員のお名前を入力します。</b><span class="sub">Enter your booking number (or last name and arrival date) and the name of every guest. ／ 예약번호(또는 성과 도착일)와 투숙객 전원의 이름을 입력하세요. ／ 输入预订号（或姓氏和到达日期）及全部住客姓名。</span></li>
    <li><b>宿泊される方全員が、顔の横に身分証を持って1人1枚ずつその場で撮影します。日本国外にお住まいの方はパスポートの顔写真ページも撮影します。</b><span class="sub">Every guest takes one photo on the spot holding their ID next to their face. Guests living outside Japan also photograph the passport photo page. ／ 투숙객 전원이 얼굴 옆에 신분증을 들고 1인 1장씩 그 자리에서 촬영합니다. 일본 외 거주자는 여권 사진면도 촬영합니다. ／ 全部住客各自将证件举在脸旁当场拍一张照片；居住在日本以外的旅客还需拍摄护照照片页。</span></li>
  </ol>
  <div class="why">法令（旅館業法・住宅宿泊事業法）に基づく本人確認です。写真は宿泊者名簿とともに3年間保管し、行政機関の求めに応じて提示します。<br>Required by Japanese law. The photo is kept with the guest register for 3 years and shown to authorities on request.</div>
  </div>
</div>
<div class="foot">${esc(url)}</div>
</div></body></html>`;
}

await mkdir(OUT, { recursive: true });
const index = [];
for (const p of targets) {
  const url = `${BASE}/c/${encodeURIComponent(p.id)}?k=${roomKey(p.id)}`; // /c/ は鍵を Cookie に移して /checkin/ へ転送する入口
  const svg = await QRCode.toString(url, { type: "svg", errorCorrectionLevel: "M", margin: 0 });
  const file = path.join(OUT, `${p.id}.html`);
  await writeFile(file, sheetHtml(p, url, svg));
  index.push({ id: p.id, name: p.name, url, file });
  console.log(`${p.id}\t${p.name}\t${url}`);
}
await writeFile(path.join(OUT, "index.json"), JSON.stringify(index, null, 2));
console.log(`\n${index.length} sheets → ${OUT}/ (open each .html and print to PDF)`);
