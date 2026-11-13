import { useState } from 'react';
import type { Report, Team as TeamT } from '../data/types';
import { copyText, short } from '../lib/format';

const CopyIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <rect x="5" y="5" width="8.5" height="8.5" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M3.5 10.5h-.6A1.4 1.4 0 0 1 1.5 9.1V2.9c0-.8.6-1.4 1.4-1.4h6.2c.8 0 1.4.6 1.4 1.4v.6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    />
  </svg>
);

function Cp({ a }: { a: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className={`wl-cp${done ? ' done' : ''}`}
      type="button"
      title={`Copy ${a}`}
      aria-label="Copy address"
      onClick={() =>
        copyText(a).then((ok) => {
          if (!ok) return;
          setDone(true);
          setTimeout(() => setDone(false), 1400);
        })
      }
    >
      <CopyIcon />
    </button>
  );
}

const sol = (a: string) => `https://solscan.io/account/${a}`;

function Graph({ t }: { t: TeamT }) {
  const n = t.wallets.length;
  const W = 560;
  const step = n > 1 ? (W - 112) / (n - 1) : 0;
  return (
    <div className="wl-svgw">
      <svg className="wl-svg" viewBox={`0 0 ${W} 262`} style={{ maxWidth: W }} role="img" aria-label="Who funded whom">
        {t.wallets.map((w, i) => {
          const x = n > 1 ? 56 + i * step : W / 2;
          const held = /^[1-9]/.test(w.held) ? w.held : '';
          return (
            <g key={w.address} className={`n w${w.main ? ' main' : ''}${w.bad ? ' bad' : ''}`} transform={`translate(${x},168)`}>
              <a href={sol(w.address)} target="_blank" rel="noopener noreferrer">
                <title>{`${w.address}: ${w.roles.join(', ')}`}</title>
                <circle r={w.main ? 10 : 8} />
                <text y={-17} className="r">
                  {w.roles[0]}
                </text>
                <text y={27} className="a">
                  {short(w.address)}
                </text>
                {held && held !== '0%' && (
                  <text y={41} className="p">
                    {held}
                  </text>
                )}
              </a>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function Team({ R }: { R: Report }) {
  const t = R.team;
  const [open, setOpen] = useState<Set<number>>(new Set());
  if (!t) return null;
  const sym = R.sym ? '$' + R.sym : 'coin';
  return (
    <div className="pn" id="s-team">
      <div className="ph">
        <h3>Team wallets</h3>
        <span className="side">every wallet tied to the project: what it holds, bought, sold, who funded it</span>
      </div>
      <div id="wmount">
        <div className="wl">
          <div className="wl-tiles">
            {t.tiles.map((x, i) => (
              <div key={i} className={`wl-tile${x.warn ? ' warn' : ''}`}>
                <span className="lb">{x.lb}</span>
                <b>{x.v}</b>
                <small>{x.sub}</small>
              </div>
            ))}
          </div>
          <section className="wl-card">
            <div className="wl-h">
              <b>What the wallets show</b>
              <span>{t.findings.length} findings · each with its proof</span>
            </div>
            <ol className="wl-fl">
              {t.findings.map((f, i) => (
                <li key={i} className={f.tone}>
                  <span className="k">{f.tone === 'bad' ? 'Risk' : f.tone === 'ok' ? 'Good' : 'Info'}</span>
                  <div>
                    <b>{f.title}</b>
                    <p>{f.text}</p>
                    <div className="ev">{f.ev}</div>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <section className="wl-card">
            <div className="wl-h">
              <b>Who funded whom</b>
              <span>first SOL into each wallet · no shared funder found</span>
            </div>
            <Graph t={t} />
            <div className="wl-leg">
              <span>
                <i className="lf" />
                funder
              </span>
              <span>
                <i className="lx" />
                exchange
              </span>
              <span>
                <i className="lw" />
                project wallet
              </span>
              <span>
                <i className="lb" />
                with a red flag
              </span>
              <span>
                <i className="ll" />
                escrow / lock
              </span>
              <span>
                <i className="lt" />
                dev's tokens moved
              </span>
            </div>
            <ul className="wl-flist">
              <li>
                <div className="fh">
                  <span className="mute">first funder not known</span>
                </div>
                <div className="fk">
                  {t.wallets.map((w) => (
                    <span key={w.address} className={`fw${w.bad ? ' bad' : ''}`}>
                      <span className={`wl-chip${w.main ? ' main' : ''}`}>{w.roles[0]}</span>
                      <a href={sol(w.address)} target="_blank" rel="noopener noreferrer">
                        {short(w.address)}
                      </a>
                    </span>
                  ))}
                </div>
              </li>
            </ul>
          </section>
          <section className="wl-card">
            <div className="wl-h">
              <b>Every wallet</b>
              <span>{t.wallets.length} wallets · roles from the chain and from what the project shows</span>
            </div>
            <div className="wl-tw">
              <table className="wl-t">
                <thead>
                  <tr>
                    <th>Wallet</th>
                    <th className="n">SOL</th>
                    <th className="n">{sym} held</th>
                    <th>Traded this coin</th>
                    <th>Funded by</th>
                    <th>To exchanges</th>
                    <th className="n">Launches</th>
                    <th>Flags</th>
                  </tr>
                </thead>
                <tbody>
                  {t.wallets.flatMap((w, i) => {
                    const isOpen = open.has(i);
                    return [
                      <tr key={w.address} className={`wl-row${w.bad ? ' hasbad' : ''}`}>
                        <td className="who" data-l="Wallet">
                          <div className="wl-roles">
                            {w.roles.map((r, j) => (
                              <span key={r} className={`wl-chip${w.main && j === 0 ? ' main' : ''}`}>
                                {r}
                              </span>
                            ))}
                          </div>
                          <span className="wl-addr">
                            <a href={sol(w.address)} target="_blank" rel="noopener noreferrer" title={`${w.address} on Solscan`}>
                              {short(w.address)}
                            </a>
                            <Cp a={w.address} />
                          </span>
                          {w.kind && <span className="wl-kind">{w.kind}</span>}
                        </td>
                        <td className="n" data-l="SOL">
                          <div className="c">{w.sol}</div>
                        </td>
                        <td className="n" data-l={`${sym} held`}>
                          <div className="c">
                            <b>{w.held}</b>
                            <small>{w.heldSub}</small>
                          </div>
                        </td>
                        <td data-l="Traded">
                          <div className="c">
                            <span className={w.tradedSub ? undefined : 'mute'}>{w.traded}</span>
                            {w.tradedSub && <small>{w.tradedSub}</small>}
                          </div>
                        </td>
                        <td data-l="Funded by">
                          <div className="c">
                            <span className="mute">{w.funded}</span>
                          </div>
                        </td>
                        <td data-l="To exchanges">
                          <div className="c">
                            <span className="mute">{w.exchanges}</span>
                          </div>
                        </td>
                        <td className="n" data-l="Launches">
                          <div className="c">
                            {w.launchesSub ? (
                              <>
                                <b>{w.launches}</b>
                                <small>{w.launchesSub}</small>
                              </>
                            ) : (
                              <span className="mute">{w.launches}</span>
                            )}
                          </div>
                        </td>
                        <td className="fl" data-l="Flags">
                          <div className="c">
                            {w.flags.map((f, j) => (
                              <span key={j} className={`wl-flag ${f.tone || ''}`}>
                                {f.t}
                              </span>
                            ))}
                            <button
                              className="wl-more"
                              type="button"
                              aria-expanded={isOpen}
                              onClick={() =>
                                setOpen((s) => {
                                  const n = new Set(s);
                                  if (n.has(i)) n.delete(i);
                                  else n.add(i);
                                  return n;
                                })
                              }
                            >
                              {isOpen ? 'hide' : 'details'}
                            </button>
                          </div>
                        </td>
                      </tr>,
                      <tr key={w.address + '-sub'} className="wl-sub" hidden={!isOpen}>
                        <td colSpan={8}>
                          <div className="wl-subin">
                            {w.details.map(([lb, txt]) => (
                              <div key={lb}>
                                <span className="lb">{lb}</span>
                                {txt}
                              </div>
                            ))}
                            <div className="src">coin data: launch records and trade records (demo)</div>
                          </div>
                        </td>
                      </tr>,
                    ];
                  })}
                </tbody>
              </table>
            </div>
          </section>
          <div className="wl-foot">{t.foot}</div>
        </div>
      </div>
    </div>
  );
}
