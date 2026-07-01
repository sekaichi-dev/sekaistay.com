// src/generate.js
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { loadProperties, loadContacts } from './data.js';
import { qrDataUrl, wifiPayload } from './qr.js';
import { stickerHtml } from './templates/sticker.js';
import { indoorHtml } from './templates/indoor.js';
import { htmlToPdf } from './render.js';

export async function generateAll({ propertiesPath, contactsPath, logoPath, outDir }) {
  const properties = loadProperties(propertiesPath);
  const contacts = loadContacts(contactsPath);
  // ロゴは PNG フルロゴ(シンボル＋SEKAI STAYワードマーク)を base64 <img> で埋め込む。
  // テンプレは logoSvg にこの markup を差し込む(名称は歴史的経緯・実体はロゴ markup)。
  const logoB64 = readFileSync(logoPath).toString('base64');
  const logoSvg = `<img alt="SEKAI STAY" src="data:image/png;base64,${logoB64}">`;
  const written = [];

  const stickerPath = join(outDir, 'sticker-A5.pdf');
  await htmlToPdf(stickerHtml({ logoSvg }), stickerPath);
  written.push(stickerPath);

  for (const property of properties) {
    const qr = {
      line: await qrDataUrl(contacts.lineUrl),
      manual: await qrDataUrl(property.houseManualUrl),
      wifi: await qrDataUrl(wifiPayload(property.wifiSsid, property.wifiPassword)),
    };
    const html = indoorHtml({ property, contacts, logoSvg, qr });
    const outPath = join(outDir, `indoor-${property.id}.pdf`);
    await htmlToPdf(html, outPath);
    written.push(outPath);
  }
  return written;
}

// CLI: node src/generate.js [propertiesPath]
const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  const root = dirname(fileURLToPath(import.meta.url));
  const repo = join(root, '..', '..', '..');
  const propertiesPath = process.argv[2] || join(root, '..', 'properties.sample.json');
  generateAll({
    propertiesPath,
    contactsPath: join(root, '..', 'config', 'contacts.json'),
    logoPath: join(repo, 'public', 'images', 'switch', 'logo-full.png'),
    outDir: join(root, '..', 'out'),
  }).then((p) => console.log(`生成完了 (${p.length}件):\n` + p.join('\n')))
    .catch((e) => { console.error(e); process.exit(1); });
}
