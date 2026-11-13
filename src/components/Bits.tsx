// Små återanvändbara byggstenar: verdict-taggar, stämplar, mätare, coin-logga.
import type { ReactNode } from 'react';
import type { Verdict } from '../data/types';
import { BANDS, vcls } from '../lib/verdict';

export function VTag({ v, wait, small }: { v: Verdict | null; wait?: string; small?: boolean }) {
  return v ? (
    <span className={`vtag ${vcls(v)}${small ? ' sm' : ''}`}>{v}</span>
  ) : (
    <span className="vtag v-wait">{wait || 'running'}</span>
  );
}

export function Stamp({ w }: { w?: string | null }) {
  if (!w) return null;
  return <span className={`stamp st-${w.toLowerCase()}`}>{w}</span>;
}

export function KTag({ t, cls, wide }: { t: string; cls: string; wide?: boolean }) {
  return <span className={`ktag${wide ? ' w' : ''} ${cls}`}>{t}</span>;
}

export function Meter({ score }: { score: number | null }) {
  const s = score;
  return (
    <div className="meter">
      <div className="mbar">
        {BANDS.map(([a, b, n], i) => (
          <i
            key={i}
            className={`b${i}${s != null && s >= a && (s < b || (b === 100 && s <= 100)) ? ' on' : ''}`}
            style={{ flex: b - a }}
            title={`${n} ${a}-${b}`}
          />
        ))}
        {s != null && <b className="mk" style={{ left: `${Math.max(0, Math.min(100, s))}%` }} />}
      </div>
      <div className="mlab">
        <span>larp</span>
        <span>sketchy</span>
        <span>neutral</span>
        <span>real</span>
        <span>solid</span>
      </div>
    </div>
  );
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Pixel-identicon från mint-adressen. Ersätter referensens /img/<mint>-bilder. */
export function CoinLogo({ mint }: { mint: string }) {
  const h = hash(mint);
  const hue = h % 360;
  const cells: ReactNode[] = [];
  for (let y = 0; y < 5; y++)
    for (let x = 0; x < 3; x++) {
      if ((h >> (y * 3 + x)) & 1) {
        cells.push(<rect key={`${x}${y}`} x={x + 1} y={y + 1} width="1" height="1" />);
        if (x < 2) cells.push(<rect key={`m${x}${y}`} x={5 - x} y={y + 1} width="1" height="1" />);
      }
    }
  return (
    <svg viewBox="0 0 7 7" shapeRendering="crispEdges" aria-hidden="true" style={{ display: 'block', width: '100%', height: '100%' }}>
      <rect width="7" height="7" fill={`hsl(${hue} 28% 12%)`} />
      <g fill={`hsl(${hue} 62% 62%)`}>{cells}</g>
    </svg>
  );
}

export const XIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.8-6.3L6.4 22H3.3l7.3-8.3L1 2h6.3l4.4 5.8zm-1.1 18h1.7L6.3 3.9H4.5z" />
  </svg>
);

export const Cur = () => <span className="cur" />;

/** Panel ("pn") med rubrikrad, som referensens pn()-hjälpare. */
export function Pn({
  title,
  n,
  side,
  extra,
  className,
  id,
  children,
}: {
  title: ReactNode;
  n?: number | string | null;
  side?: ReactNode;
  extra?: ReactNode;
  className?: string;
  id?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`pn${className ? ' ' + className : ''}`} id={id}>
      <div className="ph">
        <h3>{title}</h3>
        {n != null && <span className="n">{n}</span>}
        {extra}
        {side && <span className="side">{side}</span>}
      </div>
      {children}
    </div>
  );
}
