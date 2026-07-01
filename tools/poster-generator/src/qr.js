import QRCode from 'qrcode';

const escapeWifi = (s) => String(s).replace(/([\\;,:"])/g, '\\$1');

export function wifiPayload(ssid, password) {
  return `WIFI:T:WPA;S:${escapeWifi(ssid)};P:${escapeWifi(password)};;`;
}

export async function qrDataUrl(text) {
  return QRCode.toDataURL(text, { margin: 0, width: 320, errorCorrectionLevel: 'M' });
}
