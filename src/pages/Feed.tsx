import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BRAND } from '../config/brand';
import FeedTable, { Seg } from '../components/FeedTable';
import type { Kind } from '../data/types';
import { useDebounced, useFeed } from '../hooks/useFeed';
import { VERDICTS } from '../lib/verdict';

const VF: [string, string][] = [
  ['', 'All'],
  ['REAL', 'Real'],
  ['LIKELY REAL', 'Likely real'],
  ['PARTLY REAL', 'Partly real'],
  ['UNCLEAR', 'Unclear'],
  ['LIKELY LARP', 'Likely larp'],
  ['LARP', 'Larp'],
  ['SCAM', 'Scam'],
];
const KF: ['' | Kind, string][] = [
  ['', 'All'],
  ['post', 'X post'],
  ['site', 'Site'],
  ['coin', 'Coin'],
  ['account', 'Account'],
  ['repo', 'Repo'],
  ['wallet', 'Wallet'],
];
const SF: ['new' | 'score' | 'low', string][] = [
  ['new', 'Newest'],
  ['score', 'Highest score'],
  ['low', 'Lowest score'],
];

export default function Feed() {
  const [params] = useSearchParams();
  const pre = params.get('verdict') || '';
  const [verdict, setVerdict] = useState(VERDICTS.includes(pre as never) ? pre : '');
  const [kind, setKind] = useState<'' | Kind>('');
  const [sort, setSort] = useState<'new' | 'score' | 'low'>('new');
  const [qRaw, setQRaw] = useState('');
  const q = useDebounced(qRaw);
  const { data, live } = useFeed({ verdict, kind, sort, q, limit: 200 });

  useEffect(() => {
    document.title = `Run log · ${BRAND.name}`;
  }, []);

  return (
    <main className="wide">
      <section className="ckhero">
        <div className="eyebrow">
          <span className={`ldot${live ? ' on' : ''}`} />
          run log · every run
        </div>
        <h2 className="px">Run log</h2>
        <p className="cksub">
          Every run with its verdict, its score and the call. Open one for the sandbox screenshots, the wallet requests that were
          caught and the evidence behind each finding.
        </p>
      </section>
      <section className="blk" style={{ paddingTop: 30 }}>
        <div className="fkind">
          <span className="k">verdict</span>
          <Seg id="vf" options={VF} value={verdict} onChange={setVerdict} />
        </div>
        <div className="fkind">
          <span className="k">subject</span>
          <Seg id="kf" options={KF} value={kind} onChange={setKind} />
        </div>
        <div className="ubar">
          <Seg id="sf" options={SF} value={sort} onChange={setSort} />
          <input
            id="fq"
            className="uq"
            value={qRaw}
            onChange={(e) => setQRaw(e.target.value)}
            placeholder="search: name, @handle, CA, site"
            spellCheck={false}
            autoComplete="off"
            aria-label="Search the run log"
          />
          <span className="unote" id="fnote">
            {data
              ? `${data.checks.length} shown · ${data.running.length} running · ${data.queued} queued${BRAND.demo ? ' · demo data' : ''}`
              : live
                ? '—'
                : '—'}
          </span>
        </div>
        <FeedTable rows={data?.checks ?? null} empty={q || verdict || kind ? 'No run matches.' : 'No runs yet.'} />
      </section>
    </main>
  );
}
