const w = (body) => `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="100%" height="100%">${body}</svg>`;

export const PICTOGRAMS = {
  noise: w('<path d="M6 19v10h7l9 7V12l-9 7H6z"/><path d="M30 17a10 10 0 0 1 0 14"/><path d="M36 12a17 17 0 0 1 0 24"/><line x1="40" y1="8" x2="8" y2="40"/>'),
  trash: w('<path d="M10 14h28"/><path d="M14 14l2 26h16l2-26"/><path d="M19 14V9h10v5"/><line x1="21" y1="20" x2="21" y2="34"/><line x1="27" y1="20" x2="27" y2="34"/>'),
  nosmoking: w('<circle cx="24" cy="24" r="18"/><line x1="11" y1="11" x2="37" y2="37"/><path d="M14 27h16v4H14z"/><path d="M33 23v-4a4 4 0 0 0-4-4"/>'),
  capacity: w('<circle cx="16" cy="16" r="6"/><path d="M6 38c0-6 4-10 10-10s10 4 10 10"/><circle cx="34" cy="18" r="5"/><path d="M30 38c0-5 2-8 7-8"/><line x1="40" y1="10" x2="46" y2="16"/><line x1="46" y1="10" x2="40" y2="16"/>'),
  checkout: w('<path d="M28 8h10a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H28"/><path d="M20 16l-8 8 8 8"/><line x1="12" y1="24" x2="32" y2="24"/>'),
  commonarea: w('<path d="M8 22L24 8l16 14"/><path d="M12 20v18h24V20"/><line x1="20" y1="38" x2="20" y2="28"/><line x1="28" y1="38" x2="28" y2="28"/>'),
  equipment: w('<circle cx="24" cy="24" r="6"/><path d="M24 6v6M24 36v6M6 24h6M36 24h6M12 12l4 4M32 32l4 4M36 12l-4 4M16 32l-4 4"/>'),
  phone: w('<path d="M14 8h8l3 9-5 3a18 18 0 0 0 8 8l3-5 9 3v8a3 3 0 0 1-3 3C24 45 5 26 5 11a3 3 0 0 1 3-3z"/>'),
  line: w('<rect x="6" y="9" width="36" height="26" rx="8"/><path d="M16 41l8-6"/><line x1="15" y1="20" x2="15" y2="26"/><path d="M22 26v-6l5 6v-6"/><line x1="32" y1="20" x2="32" y2="26"/>'),
  manual: w('<path d="M10 8h18a4 4 0 0 1 4 4v28H14a4 4 0 0 1-4-4z"/><path d="M32 12h6v28H14"/><line x1="16" y1="16" x2="26" y2="16"/><line x1="16" y1="22" x2="26" y2="22"/>'),
  wifi: w('<path d="M6 18a26 26 0 0 1 36 0"/><path d="M13 26a16 16 0 0 1 22 0"/><path d="M19 33a7 7 0 0 1 10 0"/><circle cx="24" cy="39" r="1.5" fill="currentColor"/>'),
  noparty: w('<circle cx="24" cy="24" r="17"/><line x1="12" y1="12" x2="36" y2="36"/><path d="M15 33l5-12 7 7-12 5z"/><path d="M30 14l1 4M34 18l4 1M31 22l4-1"/>'),
};
