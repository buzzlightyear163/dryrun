# Branding TODO

Klart: namn **Dryrun**, ticker **$DRYRUN**, amber `#ffb000`, pixel-logga (▶ med streckat spår), favicon,
OG-bild, pfp (`public/assets/brand/pfp.png`), X-banner (`x-banner.png`, nedre vänstra hörnet tomt för pfp:n),
alla texter.

Kvar att fylla i (`src/config/brand.ts` om inget annat står):

- [ ] **X-handle**: `x: 'dryrunfun'` är bara ett förslag. Byt till ditt riktiga konto (eller `''` för att dölja).
- [ ] **CA**: `ca: ''`. Klistra in vid launch, då visas CA-pillret med Copy.
- [ ] **Domän**: `domain` + `og:`-taggarna i `index.html` (lägg en absolut URL på `og:image` när domänen finns).
- [ ] **Modellnamn** i statusraden (`model`), om din backend kör något annat.
- [ ] **Demo-data**: `public/api/` är påhittad. Sätt `demo: false` först när riktig backend är kopplad,
      annars ska "demo data"-märkningen stå kvar.
- [ ] **Backend / API-nycklar**: se README → "Backend, mock och demo-läge" (`TODO(backend)` i koden).
