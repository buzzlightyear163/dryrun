# Dryrun ($DRYRUN)

Egen rebrand av en klon av **https://runfactcheck.fun/** (Factcheck, $CHECK).
Samma layout, komponenter och flöden som referensen, men med eget namn, egen pixel-logga,
egna texter och **amber `#ffb000`** som accentfärg i stället för originalets vitt/grönt.

## Starta

Dubbelklicka på **`start.bat`**. Första gången installeras allt (tar en minut), sedan öppnas
sajten på http://localhost:5173.

(Manuellt: `npm install` och sedan `npm run dev`. Bygga för produktion: `npm run build` → mappen `dist/`.)

## Routes

| Route | Sida |
| --- | --- |
| `/` | Hero "Real or larp?", run-terminalen, senaste run, 5-stegsrälsen och loggen med filter + sök |
| `/feed` | Run log: filter på verdict, subject (post/site/coin/…), sortering, sök |
| `/docs` | How it works, 7 paneler inkl. verdict-skalan |
| `/c/:id` | Rapporten: verdict-box, claims, findings, hands-on (skärmdumpar + lightbox), wallet run, plain words, part by part, holders, team wallets, stegloggen, sidopanel |
| `*` | 404 |

Testa rapporterna: `/c/Tq4mW8dLp2` (LIKELY REAL, swap), `/c/Bk7rZ2xNq9` (LIKELY LARP, team wallets),
`/c/Gv3sH9kRm1` (SCAM, wallet drain caught). Övriga rader i loggen får en kortare rapport.

## Byta namn, färg, X och CA

Allt varumärke ligger på två ställen:

- **`src/config/brand.ts`**: namn, ticker, X-handle, CA, domän, modellnamn i statusraden, `demo`-flaggan.
  - `ca: ''` → CA-pillret i headern är dolt (precis som referensen innan launch). Klistra in CA:n så visas `$DRYRUN · 6iD8…pump · Copy` och knappen "Run log →" göms.
  - `x: ''` döljer X-knappen och raden "or tag @… under any post on X".
- **`src/styles/brand.css`**: accentfärgen (`--acc`, `--acc2`). Byt hex där så följer allt med.

Logga och grafik: `public/assets/brand/` (`mark.svg`, `favicon.svg`, `og.png`, `pfp.png`, `x-banner.png`).
Titlar och meta-taggar: `index.html`.

## Projektstruktur

```
src/
  config/brand.ts        varumärket
  styles/app.css         basstilarna (rekonstruerade från referensen)
  styles/wallets.css     team wallets-modulen
  styles/brand.css       amber-lagret
  components/            Nav, Footer, StatusBar, FeedTable, Bits (VTag, Meter, Stamp, CoinLogo …), Ev (länkar i bevis)
  layouts/SiteLayout.tsx header + footer + statusrad runt alla sidor
  pages/                 Home, Feed, Docs, Report, NotFound
  report/                rapportens sektioner, Team wallets, sidopanel, lightbox
  hooks/                 useFeed (pollning), useStatus, useRunSubmit, useSbar
  lib/                   api (fixtures), demoRun (lokalt run-läge), verdict, format, shots (wireframe-skärmdumpar)
  data/types.ts          datatyperna för flöde och rapport
public/
  api/                   fixtures: feed.json, status.json, checks/<id>.json
  assets/brand/          logga, favicon, OG, pfp, X-banner
```

Dependencies: React 19, react-router-dom 7, Vite 8, TypeScript (strict), plus typsnitten Geist Mono och Silkscreen
(@fontsource, ligger lokalt i bygget). Inget annat.

## Responsivt

Samma brytpunkter som referensen (1800 / 1700 / 1500 / 1100 / 720 / 640 px): på mobil göms nav-länkarna och
sökfältet i headern, hero-kortet hamnar under terminalen, rälsen blir en lista, tabellerna tappar kolumner och
team wallets blir kort. Kontrollerat på 390, 768 och 1280 px.

## Backend, mock och demo-läge

Sajten är bara frontend. Allt data är **påhittad demo-data** (domäner på `.example`, `@demo_…`-konton,
slumpade adresser) och statusraden visar **"demo data"** så länge `demo: true` i `brand.ts`.

- `TODO(backend)` **Flödet**: `GET /api/feed?limit&sort&verdict&kind&q` → idag `public/api/feed.json`, filtreras i `src/lib/api.ts`.
- `TODO(backend)` **Status**: `GET /api/status` → `public/api/status.json` (pollas var 15:e s).
- `TODO(backend)` **Rapport**: `GET /api/check/:id` + strömning via `EventSource('/api/check/:id/events')` → idag `public/api/checks/<id>.json`.
- `TODO(backend)` **Starta ett run**: `POST /api/check { input, from: "web" }` → `{ id }`. Idag startar formuläret ett
  **lokalt demo-run** (`src/lib/demoRun.ts`) som går igenom köad → first read → testing → klar på ~15 sekunder,
  med verdict UNCLEAR och texten att inget kontrollerades på riktigt.
- Det riktiga arbetet (sandbox-browser, sandbox-wallet, simulering på mainnet, X-bot) finns inte i klonen.

Ingen inloggning finns i referensen och ingen wallet kopplas av besökaren, så det finns inget auth-flöde att mocka.

## Web3

Solana. Adresser och signaturer i bevistexter blir länkar till Solscan. Coin-loggor ritas som pixel-identicons från
mint-adressen. CA-pillret kopierar adressen (med fallback för osäkra kontexter).

## Ersatt jämfört med referensen

- Namn, ticker, logga, favicon, OG-bild, alla texter (hero, räls, docs, footer) är nya.
- Referensens riktiga checks (riktiga X-konton och coins) är ersatta med påhittad demo-data.
- Riktiga sandbox-skärmdumpar är ersatta med neutrala wireframes (`src/lib/shots.ts`). Lägg en riktig bild-URL i en frames `src` så används den.
- Referensens coin-bilder (`/img/<mint>`) är ersatta med identicons.

## Deploy

`vercel.json` finns (SPA-rewrite utom `/api/` och `/assets/`). Pusha till GitHub och importera i Vercel.
