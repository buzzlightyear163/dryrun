import { useState } from 'react';
import type { FindingKind, Frame, Lane, Report, Slip } from '../data/types';
import { Cur, KTag, Pn } from '../components/Bits';
import { Ev, WLink } from '../components/Ev';
import { amt, int, stripProto } from '../lib/format';
import { BAD, FIND_TAG, GOOD, ORDER, PART_TAG, RES_TAG } from '../lib/verdict';
import { resolveShot } from '../lib/shots';
import { isRunning } from './Head';

export type IndexedFrame = Frame & { k: number; run: number; n: number; runLabel: string };

/* ── Claims ─────────────────────────────────────────────── */
export function Claims({ R }: { R: Report }) {
  const c = R.claims;
  if (!c.length && !isRunning(R)) return null;
  const t = c.filter((x) => x.result === 'true' || x.result === 'works').length;
  const f = c.filter((x) => x.result === 'false' || x.result === 'broken').length;
  const u = c.length - t - f;
  return (
    <Pn
      title="Claims"
      n={c.length || null}
      side={
        <>
          <b>{t}</b> true · <b>{f}</b> false · <b>{u}</b> unproven
        </>
      }
    >
      {c.length ? (
        <div className="scroll">
          <table className="tb clm">
            <thead>
              <tr>
                <th>#</th>
                <th>claim</th>
                <th className="hw">how it was tested</th>
                <th>result</th>
                <th className="ev">evidence</th>
              </tr>
            </thead>
            <tbody>
              {c.map((x, i) => {
                const [label, cls] = RES_TAG[x.result];
                return (
                  <tr key={i} className={cls === 'k-bad' ? 'bad' : ''}>
                    <td className="no">{String(i + 1).padStart(2, '0')}</td>
                    <td className="cl">
                      <b>{x.claim}</b>
                      <span>{x.where}</span>
                    </td>
                    <td className="hw">{x.how}</td>
                    <td className="rs">
                      <KTag t={label} cls={cls} wide />
                    </td>
                    <td className="ev">
                      <Ev text={x.evidence} mint={R.mint} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty">
          The claims are being listed
          <Cur />
        </div>
      )}
    </Pn>
  );
}

/* ── Findings ───────────────────────────────────────────── */
type FF = 'all' | 'bad' | 'good' | 'open';
const inGroup = (k: FindingKind, f: FF) =>
  f === 'all' || (f === 'bad' ? BAD.has(k) : f === 'good' ? GOOD.has(k) : !BAD.has(k) && !GOOD.has(k));

export function Findings({ R }: { R: Report }) {
  const [ff, setFf] = useState<FF>('all');
  const all = [...R.findings].sort((a, b) => ORDER[a.kind] - ORDER[b.kind]);
  const shown = all.filter((x) => inGroup(x.kind, ff));
  const cnt = (f: FF) => all.filter((x) => inGroup(x.kind, f)).length;
  const groups: [FF, string][] = [
    ['all', 'All'],
    ['bad', 'Against'],
    ['good', 'For'],
    ['open', 'Open'],
  ];
  return (
    <Pn
      title="Findings"
      id="fnd"
      n={all.length}
      extra={
        <div className="seg fseg">
          {groups.map(([k, n]) => (
            <button key={k} className={ff === k ? 'on' : ''} onClick={() => setFf(k)}>
              {n} <b>{cnt(k)}</b>
            </button>
          ))}
        </div>
      }
      side="all free · each with its evidence"
    >
      <div className="fl">
        {shown.length ? (
          shown.map((x, i) => {
            const [t, cls] = FIND_TAG[x.kind];
            return (
              <div className="fr" key={i}>
                <KTag t={t} cls={cls} />
                <div className="fb">
                  <div className="ft">
                    {x.title}{' '}
                    {x.href && (
                      <a className="fh" href={x.href} target="_blank" rel="noopener noreferrer">
                        open ↗
                      </a>
                    )}
                  </div>
                  <div className="fd">
                    <Ev text={x.detail} mint={R.mint} />
                  </div>
                  <div className="fe">
                    <span className="k">evidence</span>
                    <span>
                      <Ev text={x.evidence} mint={R.mint} />
                    </span>
                    <span className="fs">{x.src}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty">
            {isRunning(R) ? (
              <>
                Findings appear here as they are found
                <Cur />
              </>
            ) : (
              'No findings in this group.'
            )}
          </div>
        )}
      </div>
    </Pn>
  );
}

/* ── Hands-on ───────────────────────────────────────────── */
function FrameBox({ f, onOpen }: { f: IndexedFrame; onOpen: (k: number) => void }) {
  return (
    <div className="fm">
      <button className={f.red ? 'red' : ''} aria-label={`open screenshot ${f.n}`} onClick={() => onOpen(f.k)}>
        <img src={resolveShot(f.src)} alt={`screenshot: ${f.act}`} loading="lazy" />
        <span className="n">{String(f.n).padStart(2, '0')}</span>
        {f.wallet ? <span className={`wl2${f.red ? ' red' : ''}`}>wallet ×{f.wallet}</span> : null}
      </button>
      <div className={`ac${f.err ? ' bad' : ''}`}>
        {f.act}
        {f.err ? ' · ' + f.err : ''}
      </div>
      {f.url && <div className="su">{stripProto(f.url)}</div>}
    </div>
  );
}

export function Hands({ R, frames, onOpen }: { R: Report; frames: IndexedFrame[]; onOpen: (k: number) => void }) {
  return (
    <Pn title="Hands-on" n={R.runs.length || null} side="sandbox browser · sandbox wallet · nothing signed">
      {R.runs.length ? (
        R.runs.map((run, ri) => (
          <div className="run" key={ri}>
            <div className="rh">
              <span className="k">{run.label}</span>
              <b>{run.title}</b>
              <span className="m">{run.meta}</span>
            </div>
            <div className="ru">
              <a href={run.url} target="_blank" rel="noopener noreferrer nofollow">
                {stripProto(run.url)}
              </a>
            </div>
            <div className="frames">
              {frames
                .filter((f) => f.run === ri)
                .map((f) => (
                  <FrameBox key={f.k} f={f} onOpen={onOpen} />
                ))}
            </div>
            {run.meters && (
              <div className="meters ckm">
                {run.meters.map(([k, v, hi]) => (
                  <div key={k}>
                    <div className="k">{k}</div>
                    <div className={`v${hi ? ' hi' : ''}`}>{v}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="empty">
          {isRunning(R) ? (
            <>
              The sandbox browser is on its way
              <Cur />
            </>
          ) : (
            R.handsEmpty || 'No hands-on visit.'
          )}
        </div>
      )}
    </Pn>
  );
}

/* ── Wallet run ─────────────────────────────────────────── */
function SlipBox({ w, k, onOpen }: { w: Slip; k: number; onOpen: (k: number) => void }) {
  const red = w.flags.length > 0;
  const loud = red ? (/drain/i.test(w.flags.join(' ') + ' ' + w.summary) ? 'DRAIN' : 'RED FLAG') : '';
  const sim = w.kind !== 'connect' && w.kind !== 'signMessage';
  return (
    <div className={`slip${red ? ' red' : ''}`} id={`w${k}`}>
      <div className="slh">
        <b>#{k + 1}</b>
        <b>{w.kindLabel}</b>
        {loud && <b>· {loud}</b>}
        <span>{w.chain}</span>
        <span>
          run {w.run} · step {w.step + 1}
        </span>
        <span className="r">
          {sim ? 'simulated on mainnet' : ''}
          {w.frame != null && (
            <button className="cpb" onClick={() => onOpen(w.frame!)}>
              screenshot
            </button>
          )}
        </span>
      </div>
      <div className="slb">
        {w.summary && <div className="sum">{w.summary}</div>}
        {sim && (
          <>
            {red && (
              <div className="flg">
                {w.flags.map((f, i) => (
                  <div key={i}>▲ {f}</div>
                ))}
              </div>
            )}
            <div className="flows">
              <div className="flow">
                <span className="k">the wallet · sandbox</span>
                {w.mine.length ? (
                  w.mine.map(([s, d], i) => (
                    <div className="fr2" key={i}>
                      <span>{s}</span>
                      <span className={d < 0 ? 'neg' : 'pos'}>{amt(d)}</span>
                    </div>
                  ))
                ) : (
                  <div className="nil">nothing leaves the wallet</div>
                )}
              </div>
              <div className="flow">
                <span className="k">who receives</span>
                {w.receivers.length ? (
                  w.receivers.map((r, i) => (
                    <div className="fr2" key={i}>
                      <span>
                        <WLink w={r.address} />
                        {r.kind && <span className="dim"> {r.kind}</span>}
                      </span>
                      <span className="pos">{r.amount}</span>
                    </div>
                  ))
                ) : (
                  <div className="nil">no one outside the wallet</div>
                )}
              </div>
            </div>
            {w.actions.length > 0 && (
              <div className="acts2">
                <span className="k">what it does, instruction by instruction</span>
                <ol>
                  {w.actions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ol>
              </div>
            )}
            {w.programs.length > 0 && (
              <div className="prg">
                <span className="k">programs</span>
                {w.programs.join(' · ')}
                {w.units ? <span className="dim"> · {int(w.units)} compute units</span> : null}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function Wallet({ R, onOpen }: { R: Report; onOpen: (k: number) => void }) {
  const W = R.wallet;
  const n = W.filter((w) => w.flags.length).length;
  return (
    <Pn
      title="Wallet run"
      n={W.length || null}
      side={
        <>
          {n ? (
            <>
              <b className="down">{n} with red flags</b> ·{' '}
            </>
          ) : null}
          simulated on mainnet · never signed
        </>
      }
    >
      {R.walletTest && (
        <div className="wtest">
          <span className="k">wallet run</span>
          <span>{R.walletTest}</span>
        </div>
      )}
      {W.length ? (
        W.map((w, k) => <SlipBox key={k} w={w} k={k} onOpen={onOpen} />)
      ) : (
        <div className="empty">
          {R.walletEmpty?.text || 'No website was used, so no wallet was offered.'}
          {R.walletEmpty?.tried && (
            <ul className="tried">
              {R.walletEmpty.tried.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Pn>
  );
}

/* ── In plain words ─────────────────────────────────────── */
export function Plain({ R }: { R: Report }) {
  const v = R.verdict;
  if (!v.eli5 && !v.summary && !v.watch) return null;
  return (
    <Pn title="In plain words" side={isRunning(R) ? 'first read, the run is still going' : 'final read'}>
      <div className="prose">
        {v.eli5 && <p className="eli">{v.eli5}</p>}
        {v.summary && <p>{v.summary}</p>}
        {v.watch && (
          <div className="watch">
            <span className="k">what to watch</span>
            <span>{v.watch}</span>
          </div>
        )}
      </div>
    </Pn>
  );
}

/* ── Part by part ───────────────────────────────────────── */
export function Parts({ R }: { R: Report }) {
  if (!R.parts.length) return null;
  return (
    <Pn title="Part by part" n={R.parts.length} side="what each piece is, what works and what does not">
      {R.catchLine && (
        <div className="hookl">
          <span className="k">{R.catchLine.k}</span>
          <span>{R.catchLine.text}</span>
        </div>
      )}
      <table className="tb parts">
        <tbody>
          {R.parts.map((p, i) => {
            const [t, cls] = PART_TAG[p.status];
            return (
              <tr key={i} className={p.hook ? 'hk' : ''}>
                <td className="no">{String(i + 1).padStart(2, '0')}</td>
                <td className="pn2">{p.name}</td>
                <td className="ps">
                  <KTag t={t} cls={cls} wide />
                </td>
                <td>
                  {p.text}
                  <ul>
                    {p.bullets.map((b, j) => (
                      <li key={j} className={b.bad ? 'down' : undefined}>
                        {b.t}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Pn>
  );
}

/* ── Holders and locks ──────────────────────────────────── */
export function Locks({ R }: { R: Report }) {
  const h = R.holders;
  if (!h) return null;
  const used = h.bars.reduce((s, b) => s + b.pct, 0);
  const op = [1, 0.82, 0.64, 0.46];
  let w = 0;
  return (
    <Pn title="Holders and locks on chain" side="top 20 token accounts, read on chain">
      <div className="meters ckm" style={{ gridTemplateColumns: `repeat(${h.meters.length},minmax(0,1fr))` }}>
        {h.meters.map(([k, v]) => (
          <div key={k}>
            <div className="k">{k}</div>
            <div className="v">{v}</div>
          </div>
        ))}
      </div>
      <div className="hbar">
        {h.bars.map((b, i) => (
          <i
            key={i}
            style={{ width: `${b.pct}%`, background: b.pool ? '#555553' : '#f4f4f2', opacity: b.pool ? 1 : op[w++ % 4] }}
            title={`${b.pool ? 'pool / curve' : 'wallet'} · ${b.pct.toFixed(1)}% · ${b.label}`}
          />
        ))}
        <i style={{ width: `${Math.max(0, 100 - used)}%`, background: 'transparent' }} />
      </div>
      <div className="hleg">
        <span>
          <i style={{ background: '#555553' }} />
          pool / curve
        </span>
        <span>
          <i style={{ background: '#f4f4f2' }} />
          wallet
        </span>
      </div>
    </Pn>
  );
}

/* ── What the run did ───────────────────────────────────── */
const LN: Record<Lane, string> = { base: 'check', web: 'web', hands: 'hands-on' };

export function Steps({ R }: { R: Report }) {
  const [lane, setLane] = useState<'all' | Lane>('all');
  const a = R.steps;
  const cnt = { all: a.length, hands: 0, web: 0, base: 0 };
  a.forEach((s) => cnt[s.lane]++);
  const shown = a.filter((s) => lane === 'all' || s.lane === lane);
  const tabs: ['all' | Lane, string][] = [
    ['all', 'All'],
    ['hands', 'Hands-on'],
    ['web', 'Web'],
    ['base', 'Checks'],
  ];
  return (
    <Pn
      title="What the run did"
      n={a.length}
      extra={
        <div className="seg fseg lseg">
          {tabs.map(([k, n]) => (
            <button key={k} className={lane === k ? 'on' : ''} onClick={() => setLane(k)}>
              {n} <b>{cnt[k]}</b>
            </button>
          ))}
        </div>
      }
      side={
        <>
          {R.timing.fastMs ? `first verdict at ${(R.timing.fastMs / 1e3).toFixed(0)} s` : ''}
          {R.timing.deepMs ? ` · done at ${(R.timing.deepMs / 1e3).toFixed(0)} s` : ''}
        </>
      }
    >
      <div className="stl scrl">
        {shown.length ? (
          shown.map((s, i) => (
            <div key={i} className={`sr s-${s.status}`}>
              <span className="tm">+{(s.t / 1e3).toFixed(1)}s</span>
              <i />
              <span className="sn">
                <span className={`ln ${s.lane}`}>{LN[s.lane]}</span>
                {s.name}
                {s.status === 'run' && <Cur />}
              </span>
              <span className="sf">{s.found}</span>
            </div>
          ))
        ) : (
          <div className="empty">{isRunning(R) ? 'starting' : 'nothing in this group'}</div>
        )}
      </div>
    </Pn>
  );
}
