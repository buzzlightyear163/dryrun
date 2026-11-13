// Formatterare — samma beteende som referensens common.js / checkui.js.

export const age = (t: number): string => {
  const s = Math.max(0, (Date.now() - t) / 1e3);
  return s < 60
    ? Math.floor(s) + 's'
    : s < 3600
      ? Math.floor(s / 60) + 'm'
      : s < 86400
        ? Math.floor(s / 3600) + 'h'
        : Math.floor(s / 86400) + 'd';
};

export const ago = (t?: number | null): string => (t ? age(t) : '—');

export const short = (w?: string | null): string =>
  w && w.length > 12 ? w.slice(0, 4) + '…' + w.slice(-4) : String(w || '?');

export const isAddr = (a?: string | null): boolean => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(String(a || ''));

export const dur = (ms?: number | null): string =>
  ms == null
    ? '—'
    : ms < 1e3
      ? Math.round(ms) + ' ms'
      : ms < 6e4
        ? (ms / 1e3).toFixed(ms < 1e4 ? 1 : 0) + ' s'
        : Math.floor(ms / 6e4) + ' min ' + Math.round((ms % 6e4) / 1e3) + ' s';

export const amt = (x: number | null | undefined, dp = 4): string => {
  if (x == null || isNaN(x)) return '—';
  const a = Math.abs(+x);
  return (
    (+x > 0 ? '+' : +x < 0 ? '−' : '') +
    (a >= 1e6
      ? (a / 1e6).toFixed(2) + 'M'
      : a >= 1e4
        ? Math.round(a).toLocaleString('en-US')
        : a.toLocaleString('en-US', { maximumFractionDigits: a < 1 ? dp + 2 : dp }))
  );
};

export const int = (x?: number | null): string =>
  x == null || isNaN(x) ? '—' : Math.round(+x).toLocaleString('en-US');

export const stripProto = (u: string): string => String(u).replace(/^https?:\/\/(www\.)?/, '');

/** Kopiera text, med fallback för osäkra kontexter (som referensen). */
export function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(
      () => true,
      () => legacyCopy(text),
    );
  }
  return Promise.resolve(legacyCopy(text));
}

function legacyCopy(text: string): boolean {
  const t = document.createElement('textarea');
  t.value = text;
  t.style.cssText = 'position:fixed;opacity:0';
  document.body.appendChild(t);
  t.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  t.remove();
  return ok;
}
