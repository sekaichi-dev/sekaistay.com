import QRCode from 'qrcode';

export function wifiPayload(ssid, password) {
  return `WIFI:T:WPA;S:${ssid};P:${password};;`;
}

export async function qrDataUrl(text) {
  return QRCode.toDataURL(text, { margin: 0, width: 320, errorCorrectionLevel: 'M' });
}
