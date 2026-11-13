import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BRAND } from '../config/brand';
import type { Report as R_ } from '../data/types';
import { getReport } from '../lib/api';
import { useSbar, type SbarItem } from '../hooks/useSbar';
import Head, { isRunning, Note } from '../report/Head';
import { Claims, Findings, Hands, Locks, Parts, Plain, Steps, Wallet, type IndexedFrame } from '../report/Sections';
import Team from '../report/Team';
import Side from '../report/Side';
import Lightbox from '../report/Lightbox';

export default function Report() {
  const { id = '' } = useParams();
  const [R, setR] = useState<R_ | null | undefined>(undefined);
  const [at, setAt] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    let t: number | undefined;
    setR(undefined);
    const load = async () => {
      const r = await getReport(id).catch(() => null);
      if (!alive) return;
      setR(r);
      // TODO(backend): referensen strömmar ändringar via EventSource(`/api/check/${id}/events`).
      if (r && isRunning(r)) t = window.setTimeout(load, 700);
    };
    load();
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [id]);

  const frames: IndexedFrame[] = useMemo(() => {
    if (!R) return [];
    let k = 0;
    return R.runs.flatMap((run, ri) => run.frames.map((f, i) => ({ ...f, k: k++, run: ri, n: i + 1, runLabel: run.label })));
  }, [R]);
  const hero = (frames.find((f) => f.red) || frames[0])?.k ?? -1;

  useEffect(() => {
    if (R === undefined) document.title = `run · ${BRAND.name}`;
    else if (!R) document.title = `No such run · ${BRAND.name}`;
    else {
      const v = R.verdict;
      document.title = `${v.verdict ? v.verdict + (v.score != null ? ' ' + v.score : '') + ' · ' : isRunning(R) ? 'running · ' : ''}${R.host} · ${BRAND.name}`;
    }
  }, [R]);

  const sbar: SbarItem[] | null = R
    ? [R.status === 'done' ? 'done' : R.status, ['claims', R.claims.length], ['findings', R.findings.length], ['steps', R.steps.length]]
    : null;
  useSbar(sbar);

  if (R === undefined)
    return (
      <main className="wide" id="page">
        <div className="loading">
          <b>Reading the run</b>findings, evidence and the verdict<span className="cur" />
        </div>
      </main>
    );
  if (!R)
    return (
      <main className="wide" id="page">
        <div className="loading">
          <b>No such run</b>the link is not a run id
        </div>
      </main>
    );

  return (
    <main className="wide" id="page">
      <div id="s-head">
        <Head R={R} />
      </div>
      <Note R={R} />
      <div className="cgrid ckgrid">
        <div>
          <div id="s-claims">
            <Claims R={R} />
          </div>
          <div id="s-find">
            <Findings R={R} />
          </div>
          <div id="s-hands">
            <Hands R={R} frames={frames} onOpen={setAt} />
          </div>
          <div id="s-wallet">
            <Wallet R={R} onOpen={setAt} />
          </div>
          <div id="s-plain">
            <Plain R={R} />
          </div>
          <div id="s-parts">
            <Parts R={R} />
          </div>
          <div id="s-locks">
            <Locks R={R} />
          </div>
          <Team R={R} />
          <div id="s-steps">
            <Steps R={R} />
          </div>
        </div>
        <Side R={R} frames={frames} hero={hero} onOpen={setAt} />
      </div>
      {at != null && frames.length > 0 && <Lightbox frames={frames} at={at} onMove={setAt} onClose={() => setAt(null)} />}
    </main>
  );
}
