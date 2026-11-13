import type { Report } from '../data/types';
import { Pn, Stamp } from '../components/Bits';
import { resolveShot } from '../lib/shots';
import { stripProto } from '../lib/format';
import type { IndexedFrame } from './Sections';

function KV({ rows }: { rows: [string, string, string?][] }) {
  return (
    <div className="kv">
      {rows.map(([k, v, href]) => [
        <div key={k + 'k'}>{k}</div>,
        <div key={k + 'v'}>
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {v} ↗
            </a>
          ) : (
            v
          )}
        </div>,
      ])}
    </div>
  );
}

export default function Side({ R, frames, hero, onOpen }: { R: Report; frames: IndexedFrame[]; hero: number; onOpen: (k: number) => void }) {
  const s = R.side;
  const hf = frames.find((f) => f.k === hero) || frames[0];
  const list = frames.slice(-12);
  return (
    <div id="s-side">
      {hf ? (
        <div className="pn shot">
          <div className="ph">
            <h3>The product</h3>
            <span className="n">{frames.length}</span>
            <span className="side">sandbox screenshots</span>
          </div>
          <button className="main" onClick={() => onOpen(hf.k)}>
            <img src={resolveShot(hf.src)} alt={`screenshot: ${hf.act}`} />
            <span className="tg">
              {hf.runLabel}
              {hf.red ? ' · red flag' : ''}
            </span>
          </button>
          <div className="cap">
            <b>{hf.act}</b>
            {hf.url ? ' · ' + stripProto(hf.url) : ''}
          </div>
          {list.length > 1 && (
            <div className="thumbs">
              {list.map((f) => (
                <button key={f.k} className={f.k === hf.k ? 'on' : ''} title={`${f.runLabel} · ${f.act}`} onClick={() => onOpen(f.k)}>
                  <img src={resolveShot(f.src)} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}
      {s.coin && (
        <Pn title="The coin" side="holders now">
          <div className="cstamp">
            <Stamp w={s.coin.stamp} />
            <b>{s.coin.score}</b>
            <span>{s.coin.line}</span>
          </div>
          <KV rows={s.coin.kv} />
          {s.coin.why.length > 0 && (
            <div className="hwhy">
              {s.coin.why.map(([n, t], i) => (
                <div key={i}>
                  <span className={n < 0 ? 'down' : 'up'}>{n > 0 ? '+' + n : n}</span>
                  {t}
                </div>
              ))}
            </div>
          )}
        </Pn>
      )}
      {s.who && (
        <Pn title="Who and where">
          <KV rows={s.who} />
        </Pn>
      )}
      <Pn title="This run">
        <div className="kv">
          {s.check.map(([k, v]) => [
            <div key={k + 'k'}>{k}</div>,
            <div key={k + 'v'}>{k === 'input' ? <span className="mono">{v}</span> : v}</div>,
          ])}
        </div>
      </Pn>
    </div>
  );
}
