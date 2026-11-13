# Referensanalys: runfactcheck.fun

Analyserad 2026-11-11 i webbläsaren (DOM, nätverk, CSS, JS).

## Teknik
Ingen ramverkskod: statisk HTML per route + `app.css` (~51 KB) + vanilla-JS (`common.js`, `checkui.js`,
`check.js`, `feed.js`, `report.js`, dynamiskt `wallets.js` + `wallets.css`). Data via `/api/live`, `/api/status`,
`/api/feed`, `/api/check/:id` och SSE `/api/check/:id/events`. Inget sitemap.xml; robots.txt har bara
Cloudflares standardhuvud.

## Routes
`/` (check), `/feed` (case log), `/docs`, `/c/:id` (rapport, id = 10 tecken [0-9A-Za-z]). Övrigt ger 404 "not found".

## Layout
- Sticky header 68 px: logga + ticker, 3 länkar, sökfält (max 520 px), CA-pill, X-knapp, vit CTA.
- Fast statusrad 32 px längst ner: namn (inverterat), running / queued / modell, klocka.
- Innehåll i `.wide` = min(1840 px, 100% − 48 px).
- Hem: hero (grid 1fr / 470 px) med terminal-input och "latest check"-kort, 5-kolumnsräls, flöde med segmentfilter och tabell.
- Rapport: verdict-box till höger i huvudet, rubrikrad, 2-kolumnsgrid (innehåll / sidopanel).

## Designsystem
- Typsnitt: Geist Mono 400–700 (allt), Silkscreen 700 (pixelrubriker, verdict-ord).
- Färger: svart `#000`, ytor `#070707/#0e0e0e/#161616`, text `#f4f4f2/#c4c4c1/#8a8a87/#555553`,
  linjer `#222/#333`, upp `#22c55e`, ner `#ef4444`. Inga radier, inga skuggor.
- Brytpunkter: 1800, 1700, 1500, 1100, 720, 640 px.

## Komponenter
Segmentknappar, verdict-taggar (7 nivåer), stämplar (OK/NEUTRAL/SKETCHY/CABAL/RIGGED/RUGGED/DEAD), poängmätare
med 7 band och markör, ktag (true/false/risk …), kv-tabeller, paneler `.pn/.ph`, skärmdumpsramar, lightbox,
wallet-"slips" med flöden, team wallets-modul (tiles, fynd, funder-graf, tabell med expanderbara rader).

## Animationer
Pulserande live-prick (2 s), blinkande cursor (1.05 s steps), hover-övergångar 0.15 s, `fresh`-färg på nya rader.

## Funktioner
Starta check (POST), pollning av flöde (4 s vid körning / 20 s annars) och status (15 s), filter + debouncad sök
(250 ms), förvalt verdict via `?verdict=`, kopiera CA, rapport med strömning, filter på fynd och steg, lightbox med
pilar/Esc, kopiera wallet-adresser.

## Externa integrationer
Solscan-länkar, X-länkar, GitHub-länkar. Backend: Claude Opus 5.5 som granskare, sandbox-browser och sandbox-wallet
med simulering på Solana mainnet (finns inte i klonen).
