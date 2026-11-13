import { useEffect } from 'react';
import { resolveShot } from '../lib/shots';
import type { IndexedFrame } from './Sections';

/** Skärmdumpsvisare (referensens .lbx): pilar, Esc, klick utanför stänger. */
export default function Lightbox({ frames, at, onMove, onClose }: { frames: IndexedFrame[]; at: number; onMove: (k: number) => void; onClose: () => void }) {
  const pos = frames.findIndex((f) => f.k === at);
  const f = frames[pos];
  const step = (d: number) => onMove(frames[(pos + d + frames.length) % frames.length].k);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  });

  if (!f) return null;
  return (
    <div
      className="lbx"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        const t = e.target as HTMLElement;
        if (t === e.currentTarget || t.classList.contains('im')) onClose();
      }}
    >
      <div className="lt2">
        <b>{f.runLabel}</b>
        <span>
          {pos + 1} / {frames.length}
        </span>
        {f.red && <b className="down">red flag</b>}
        <button className="x" onClick={onClose}>
          close · esc
        </button>
      </div>
      <div className="im">
        <img src={resolveShot(f.src)} alt={`screenshot: ${f.act}`} />
        <button className="nv pv" aria-label="previous" onClick={() => step(-1)}>
          ‹
        </button>
        <button className="nv nx" aria-label="next" onClick={() => step(1)}>
          ›
        </button>
      </div>
      <div className="cp2">
        <div>
          <b>{f.act}</b>
          {f.err ? ' · ' + f.err : ''}
          {f.wallet ? ` · wallet asked ×${f.wallet}` : ''}
        </div>
        {f.url && <div className="u">{f.url}</div>}
        {f.text && <div className="tx">{f.text}</div>}
      </div>
    </div>
  );
}
