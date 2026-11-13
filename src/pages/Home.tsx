import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../config/brand';
import { Meter } from '../components/Bits';
import FeedTable, { Seg } from '../components/FeedTable';
import { useDebounced, useFeed } from '../hooks/useFeed';
import { useRunSubmit } from '../hooks/useRunSubmit';
import { ago } from '../lib/format';
import { meterWord, vcls } from '../lib/verdict';

const FILTERS: [string, string][] = [
  ['', 'All'],
  ['REAL,LIKELY REAL', 'Real'],
  ['PARTLY REAL', 'Partly real'],
  ['UNCLEAR', 'Unclear'],
  ['LIKELY LARP,LARP', 'Larp'],
  ['SCAM', 'Scam'],
];

const RAIL = [
  'the post, the site and the code are read first',
  'a sandbox wallet connects to the site and presses the button it exists for: swap, buy, stake, claim, launch',
  'every signature the site asks for is caught, left unsigned and dry-run on mainnet: what you would lose or get',
  'the coin on chain: holders, locks, the dev and team wallets, where the fees end up',
  'a first verdict in seconds, the full run in about two minutes, every claim with its proof',
];

function RunTerm() {
  const { value, setValue, busy, msg, onSubmit } = useRunSubmit();
  return (
    <div className="term ckterm">
      <div className="lab">
        <span>Run a project</span>
        <b>post link · site · CA · wallet · @handle · repo</b>
      </div>
      <form autoComplete="off" onSubmit={onSubmit}>
        <span className="p">&gt;</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://x.com/… or a CA"
          spellCheck={false}
          autoCapitalize="off"
          aria-label="What to run"
          autoFocus
        />
        <button className="go" disabled={busy}>
          RUN ↵
        </button>
      </form>
      <div className={`msg${msg?.bad ? ' bad' : ''}`}>{msg?.text}</div>
    </div>
  );
}

export default function Home() {
  const [vf, setVf] = useState('');
  const [qRaw, setQRaw] = useState('');
  const q = useDebounced(qRaw);
  const { data, live } = useFeed({ verdict: vf, q, limit: 60 });
  useEffect(() => {
    document.title = `${BRAND.name} · real or larp?`;
  }, []);

  const latest = !vf && !q ? data?.checks.find((c) => c.status === 'done' && c.verdict) : undefined;

  return (
    <main className="wide">
      <section className="ckhero">
        <div className="ckh2">
          <div>
            <div className="eyebrow">
              <span className={`ldot${live ? ' on' : ''}`} />
              project dry run · every finding free
            </div>
            <h2 className="px">
              Real or larp<span className="q">?</span>
            </h2>
            <p className="cksub">
              Drop a link, a contract address or an @handle. {BRAND.name} opens the project in its own sandbox browser, connects a
              sandbox wallet, presses the button the site is built around (swap, buy, stake, claim, launch) and catches everything the
              site wants signed. Nothing is ever signed: each request is dry-run on mainnet so you see what signing would really do. The
              code, the team wallets and the chain get checked as well. Every claim comes back true, false or unproven, with the proof.
            </p>
            <RunTerm />
            {BRAND.x && (
              <div className="ckx" id="ckx">
                or tag <b>@{BRAND.x}</b> under any post on X: the verdict lands in the thread
              </div>
            )}
          </div>
          {latest && (
            <Link className={`rverd lat ${vcls(latest.verdict)}`} id="latest" to={`/c/${latest.id}`}>
              <div className="k">
                <span>latest run</span>
                <span className="stg">{ago(latest.created)} ago</span>
              </div>
              <div className="lw">
                {latest.host}
                {latest.title && <span>{latest.title}</span>}
              </div>
              <div className="v">{latest.verdict}</div>
              <div className="sc">
                {latest.score != null && (
                  <>
                    <b>{latest.score}</b>
                    <span>/100 · {meterWord(latest.score)}</span>
                  </>
                )}
              </div>
              <Meter score={latest.score} />
              {latest.call && <div className="lc">{latest.call}</div>}
              <div className="lo">open the report →</div>
            </Link>
          )}
        </div>
        <div className="ckrail">
          {RAIL.map((t, i) => (
            <div key={i}>
              <b>{String(i + 1).padStart(2, '0')}</b>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="blk" style={{ paddingTop: 44 }}>
        <div className="sh">
          <div>
            <div className="eyebrow">recent runs</div>
            <h2 className="px">The log</h2>
          </div>
          <div className="side" id="fside">
            {data ? (
              <>
                <b>{data.today.checks}</b> runs today · <b>{data.running.length}</b> running · <b>{data.queued}</b> queued
              </>
            ) : (
              '—'
            )}
          </div>
        </div>
        <div className="ubar">
          <Seg id="vf" options={FILTERS} value={vf} onChange={setVf} />
          <input
            id="fq"
            className="uq"
            value={qRaw}
            onChange={(e) => setQRaw(e.target.value)}
            placeholder="search: name, @handle, CA, site"
            spellCheck={false}
            autoComplete="off"
            aria-label="Search the log"
          />
          <span className="unote" id="fnote">
            {data ? `${data.checks.length} shown${BRAND.demo ? ' · demo data' : ''}` : '—'}
          </span>
        </div>
        <FeedTable rows={data?.checks ?? null} empty={q || vf ? 'No run matches.' : 'No runs yet: paste the first one above.'} />
      </section>
    </main>
  );
}
