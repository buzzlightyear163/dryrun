import type { Report } from '../data/types';
import { CoinLogo, Cur, Meter, Stamp, XIcon } from '../components/Bits';
import { ago, dur } from '../lib/format';
import { KINDS, meterWord, vcls } from '../lib/verdict';

export const isRunning = (R: Report) => R.status === 'running' || R.status === 'queued';

export default function Head({ R }: { R: Report }) {
  const v = R.verdict;
  const running = isRunning(R);
  const stage =
    R.status === 'queued'
      ? 'in the queue'
      : R.stage === 'fast'
        ? 'first read running'
        : R.stage === 'deep' && running
          ? 'testing · the verdict may still move'
          : R.status === 'failed'
            ? 'stopped'
            : `done in ${dur(R.timing.deepMs)}`;
  const letter = (String(R.host || '?').replace(/^[@$]/, '')[0] || '?').toUpperCase();
  return (
    <>
      <section className="rhd">
        <div className="rid">
          {R.mint ? (
            <div className="lg">
              <CoinLogo mint={R.mint} />
            </div>
          ) : (
            <div className="lg pav">
              <span>{letter}</span>
            </div>
          )}
          <div className="rmeta">
            <div className="eyebrow">
              project run · {KINDS[R.kind] || R.kind} · {ago(R.created)} ago · {R.id}
            </div>
            <div className="t1">
              <span className="rhost">{R.host || R.input}</span>
              {v.title && <span className="nm">{v.title}</span>}
            </div>
            <div className="t2">
              {R.chips.map((c, i) => (
                <a key={i} className="sb" href={c.href} target="_blank" rel="noopener noreferrer">
                  {c.post ? (
                    <>
                      <XIcon />
                      <span>{c.label}</span>
                    </>
                  ) : (
                    <>
                      <span className="k">{c.k}</span>
                      {c.label} ↗
                    </>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className={`rverd ${vcls(v.verdict)}${running ? ' live' : ''}`}>
          <div className="k">
            <span>verdict{v.firstRead ? ' · first read' : ''}</span>
            <span className="stg">
              {running && <span className="ldot on" />}
              {stage}
            </span>
          </div>
          <div className="v">
            {v.verdict || 'reading'}
            {running && <Cur />}
          </div>
          <div className="sc">
            {v.score != null && (
              <>
                <b>{v.score}</b>
                <span>/100 · {meterWord(v.score)}</span>
              </>
            )}
          </div>
          <Meter score={v.score} />
          {(v.story != null || v.holders != null) && (
            <div className="vsplit">
              {v.story != null && (
                <span>
                  story <b>{v.story}</b>
                </span>
              )}
              {v.holders != null && (
                <span>
                  holders <b>{v.holders}</b> <Stamp w={v.holdersStamp} />
                </span>
              )}
              {v.weights && <span className="dim">{v.weights}</span>}
            </div>
          )}
          {v.cap && <div className="vcap">{v.cap}</div>}
        </div>
      </section>
      {(v.headline || v.call) && (
        <section className="rhl">
          {v.headline && <p className="hl">{v.headline}</p>}
          {v.call && (
            <p className="call">
              <span className="k">the call</span>
              {v.call}
            </p>
          )}
        </section>
      )}
    </>
  );
}

export function Note({ R }: { R: Report }) {
  const k = R.wallet.findIndex((w) => w.flags.length);
  if (k < 0) return null;
  const w = R.wallet[k];
  const drain = /drain/i.test(w.flags.join(' ') + ' ' + w.summary);
  return (
    <div id="s-note">
      <div className="alarm">
        <span className="k">{drain ? 'wallet drain caught' : 'red flag in a wallet request'}</span>
        <span>{w.summary || w.flags[0]}</span>
        <a href={`#w${k}`}>see the request ↓</a>
      </div>
    </div>
  );
}
