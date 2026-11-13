import { useNavigate } from 'react-router-dom';
import type { FeedItem } from '../data/types';
import { ago } from '../lib/format';
import { CoinLogo, Stamp, VTag } from './Bits';

function Row({ c }: { c: FeedItem }) {
  const nav = useNavigate();
  const s = c.score;
  const sub = c.call || c.headline || (c.status === 'running' ? 'the run is going' : c.status === 'queued' ? 'waiting in the queue' : '');
  return (
    <tr
      data-href={`/c/${c.id}`}
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest('a')) nav(`/c/${c.id}`);
      }}
    >
      <td>{c.verdict ? <VTag v={c.verdict} /> : <VTag v={null} wait={c.status === 'queued' ? 'queued' : 'running'} />}</td>
      <td>
        {s != null ? (
          <>
            <span className="shr">
              <i style={{ width: `${Math.max(0, Math.min(100, s))}%` }} />
            </span>
            <b>{s}</b>
          </>
        ) : (
          <span className="dim">—</span>
        )}
      </td>
      <td className="ckname">
        <b>{c.host}</b>
        {c.title && <span className="mut"> · {c.title}</span>}
        <small>{sub}</small>
      </td>
      <td>
        {c.mint ? (
          <span className="ckcoin">
            <span className="clg">
              <CoinLogo mint={c.mint} />
            </span>
            <span>
              <b>${c.sym || c.mint.slice(0, 4)}</b>
              <Stamp w={c.coinStamp} />
            </span>
          </span>
        ) : (
          <span className="dim">—</span>
        )}
      </td>
      <td className="r mut">{ago(c.created)}</td>
    </tr>
  );
}

export default function FeedTable({ rows, empty }: { rows: FeedItem[] | null; empty: string }) {
  return (
    <div className="pn">
      <div className="scroll">
        <table className="tb ut ckfeed" id="feed">
          <colgroup>
            <col style={{ width: 150 }} />
            <col style={{ width: 120 }} />
            <col />
            <col style={{ width: 210 }} />
            <col style={{ width: 70 }} />
          </colgroup>
          <thead>
            <tr>
              <th>verdict</th>
              <th>score</th>
              <th>project · the call</th>
              <th>coin</th>
              <th className="r">age</th>
            </tr>
          </thead>
          <tbody>
            {rows == null ? (
              <tr>
                <td colSpan={5} className="dim" style={{ padding: '22px 14px' }}>
                  Reading the log…
                </td>
              </tr>
            ) : rows.length ? (
              rows.map((c) => <Row key={c.id} c={c} />)
            ) : (
              <tr>
                <td colSpan={5} className="dim" style={{ padding: '22px 14px' }}>
                  {empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Seg<T extends string>({
  id,
  options,
  value,
  onChange,
}: {
  id?: string;
  options: [T, string][];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="seg" id={id}>
      {options.map(([v, label]) => (
        <button key={v || 'all'} type="button" className={v === value ? 'on' : ''} onClick={() => onChange(v)}>
          {label}
        </button>
      ))}
    </div>
  );
}
