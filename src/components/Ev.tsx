// Gör länkar av URL:er, Solana-signaturer och adresser i bevistext (som referensens CK.evidence).
import type { ReactNode } from 'react';

const RX = /(https?:\/\/[^\s<>"';,)]+)|([1-9A-HJ-NP-Za-km-z]{64,90})|([1-9A-HJ-NP-Za-km-z]{32,44})/g;

export function Ev({ text, mint }: { text: string; mint?: string | null }) {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  RX.lastIndex = 0;
  while ((m = RX.exec(text))) {
    const before = text.slice(last, m.index);
    // adresser/signaturer räknas bara när de står fritt
    if ((m[2] || m[3]) && m.index > 0 && !/[\s:(]/.test(text[m.index - 1])) continue;
    out.push(before);
    if (m[1]) {
      const tail = (m[1].match(/[.:!?\]]+$/) || [''])[0];
      const url = tail ? m[1].slice(0, -tail.length) : m[1];
      const label = url.replace(/^https?:\/\//, '');
      out.push(
        <a key={k++} href={url} target="_blank" rel="noopener noreferrer nofollow">
          {label.length > 70 ? label.slice(0, 68) + '…' : label}
        </a>,
        tail,
      );
    } else if (m[2]) {
      out.push(
        <a key={k++} href={`https://solscan.io/tx/${m[2]}`} target="_blank" rel="noopener noreferrer">
          tx {m[2].slice(0, 6)}…{m[2].slice(-4)}
        </a>,
      );
    } else if (m[3]) {
      const a = m[3];
      out.push(
        <a key={k++} href={`https://solscan.io/${a === mint ? 'token' : 'account'}/${a}`} target="_blank" rel="noopener noreferrer" title={a}>
          {a.slice(0, 4)}…{a.slice(-4)}
        </a>,
      );
    }
    last = m.index + m[0].length;
  }
  out.push(text.slice(last));
  return <>{out}</>;
}

/** Kort adress med Solscan-länk (BL.wlink). */
export function WLink({ w, label }: { w: string; label?: string }) {
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(w)) return <span className="dim">—</span>;
  return (
    <a href={`https://solscan.io/account/${w}`} target="_blank" rel="noopener noreferrer" title={w}>
      {label || `${w.slice(0, 4)}…${w.slice(-4)}`}
    </a>
  );
}
