// Neutrala "skärmdumpar" som SVG-wireframes. Ersätter referensens riktiga
// sandbox-skärmdumpar (som visar andra projekts sajter). En frame-src som börjar
// med "gen:" ritas här; en vanlig URL (t.ex. /assets/shots/x.jpg) används som den är.
//   gen:<host>|<variant 0-4>

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

const lines = (x: number, y: number, ws: number[], h = 10, gap = 18, fill = '#2a2a2a') =>
  ws.map((w, i) => `<rect x="${x}" y="${y + i * gap}" width="${w}" height="${h}" fill="${fill}"/>`).join('');

function chrome(host: string): string {
  return `<rect width="1280" height="800" fill="#0b0b0b"/>
<rect width="1280" height="44" fill="#151515"/>
<circle cx="22" cy="22" r="6" fill="#333"/><circle cx="42" cy="22" r="6" fill="#333"/><circle cx="62" cy="22" r="6" fill="#333"/>
<rect x="96" y="10" width="560" height="24" fill="#0b0b0b" stroke="#2a2a2a"/>
<text x="110" y="27" font-family="monospace" font-size="13" fill="#8a8a87">${esc(host)}</text>
<rect x="0" y="44" width="1280" height="56" fill="#101010"/>
<rect x="40" y="62" width="120" height="20" fill="#2e2e2e"/>
${lines(760, 67, [70], 10, 0, '#262626')}${lines(850, 67, [70], 10, 0, '#262626')}${lines(940, 67, [70], 10, 0, '#262626')}
<rect x="1090" y="58" width="150" height="30" fill="#e8e8e6"/>`;
}

function body(variant: number, seed: number): string {
  const w = (n: number) => 200 + ((seed >> n) & 0xff);
  switch (variant % 5) {
    case 0: // landningssida
      return `${lines(120, 170, [w(1) + 260, w(3) + 180], 34, 52, '#d9d9d6')}
${lines(120, 300, [w(2) + 300, w(4) + 260, w(5) + 120], 10, 20)}
<rect x="120" y="380" width="180" height="44" fill="#e8e8e6"/><rect x="316" y="380" width="160" height="44" fill="none" stroke="#3a3a3a"/>
${[0, 1, 2].map((i) => `<rect x="${120 + i * 356}" y="490" width="330" height="220" fill="#141414" stroke="#222"/>${lines(144 + i * 356, 520, [160, 260, 220, 240], 10, 22)}`).join('')}`;
    case 1: // swap-kort
      return `<rect x="440" y="150" width="400" height="430" fill="#141414" stroke="#2a2a2a"/>
${lines(470, 180, [120], 14, 0, '#3a3a3a')}
<rect x="470" y="220" width="340" height="96" fill="#0e0e0e" stroke="#262626"/>${lines(490, 245, [90, 170], 12, 34, '#2e2e2e')}
<rect x="620" y="324" width="40" height="40" fill="#1d1d1d" stroke="#333"/>
<rect x="470" y="372" width="340" height="96" fill="#0e0e0e" stroke="#262626"/>${lines(490, 397, [90, 150], 12, 34, '#2e2e2e')}
<rect x="470" y="500" width="340" height="50" fill="#e8e8e6"/>`;
    case 2: // plånboksval
      return `${lines(120, 170, [w(1) + 260], 34, 0, '#3a3a3a')}${lines(120, 240, [w(2) + 300, w(4) + 260], 10, 20, '#1c1c1c')}
<rect width="1280" height="800" y="0" fill="#000" opacity=".62"/>
<rect x="470" y="190" width="340" height="400" fill="#151515" stroke="#333"/>
${lines(500, 220, [150], 14, 0, '#4a4a4a')}
${[0, 1, 2, 3].map((i) => `<rect x="500" y="${264 + i * 74}" width="280" height="58" fill="#0f0f0f" stroke="#2a2a2a"/><rect x="516" y="${278 + i * 74}" width="30" height="30" fill="#333"/>${lines(560, 288 + i * 74, [110 + i * 14], 10, 0, '#3a3a3a')}`).join('')}`;
    case 3: // tabell / dashboard
      return `${lines(80, 140, [260], 24, 0, '#d9d9d6')}
${[0, 1, 2, 3].map((i) => `<rect x="${80 + i * 284}" y="190" width="264" height="100" fill="#141414" stroke="#222"/>${lines(100 + i * 284, 212, [80], 10, 0, '#3a3a3a')}${lines(100 + i * 284, 240, [140], 22, 0, '#d0d0cc')}`).join('')}
<rect x="80" y="320" width="1120" height="420" fill="#101010" stroke="#222"/>
${Array.from({ length: 9 }, (_, i) => `<rect x="80" y="${360 + i * 42}" width="1120" height="1" fill="#1f1f1f"/>${lines(104, 376 + i * 42, [180 + ((seed >> i) & 63)], 10, 0, '#2c2c2c')}${lines(540, 376 + i * 42, [90], 10, 0, '#2c2c2c')}${lines(980, 376 + i * 42, [120], 10, 0, '#2c2c2c')}`).join('')}`;
    default: // signaturförfrågan i plånboken
      return `${lines(120, 170, [w(1) + 260], 34, 0, '#3a3a3a')}
<rect width="1280" height="800" y="0" fill="#000" opacity=".55"/>
<rect x="880" y="60" width="360" height="560" fill="#141414" stroke="#ef4444"/>
${lines(910, 92, [180], 14, 0, '#4a4a4a')}
<rect x="910" y="130" width="300" height="70" fill="#1c0b0b" stroke="#5c1d1d"/>${lines(926, 150, [220, 160], 10, 22, '#7a2b2b')}
${lines(910, 230, [280, 240, 260, 200, 250, 180], 10, 24)}
<rect x="910" y="540" width="140" height="46" fill="none" stroke="#3a3a3a"/><rect x="1070" y="540" width="140" height="46" fill="#ef4444"/>`;
  }
}

export function shotSvg(host: string, variant: number): string {
  const seed = hash(host + variant);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 800">${chrome(host)}${body(variant, seed)}</svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

export function resolveShot(src: string): string {
  if (src.startsWith('gen:')) {
    const [host, v] = src.slice(4).split('|');
    return shotSvg(host || 'site', Number(v) || 0);
  }
  return src;
}
