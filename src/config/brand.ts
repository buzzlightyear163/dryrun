// ─────────────────────────────────────────────────────────────
// ALLT VARUMÄRKE PÅ ETT STÄLLE. Byt namn, ticker, X, CA här.
// Färgen byts i src/styles/brand.css (--acc).
// ─────────────────────────────────────────────────────────────

export const BRAND = {
  /** Visas i loggan (gemener), titlar och texter. */
  name: 'Dryrun',
  /** Utan $. */
  ticker: 'DRYRUN',
  /** X-handle utan @. Tom sträng döljer X-knappen och "tag @…"-raden. */
  x: 'dryrunfun',
  /** Contract address. Tom sträng = CA-pillret döljs (som referensen gör innan launch). */
  ca: '',
  /** Domänen, används i README och meta. */
  domain: 'dryrun.fun',
  /** Modellnamnet som visas i statusraden. */
  model: 'Claude Opus 5.5',
  /** true = visar "demo data" i statusraden och flödet. Sätt false när riktig backend är kopplad. */
  demo: true,
} as const;

export const lower = BRAND.name.toLowerCase();
