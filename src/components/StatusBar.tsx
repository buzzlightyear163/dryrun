import { BRAND, lower } from '../config/brand';
import { useStatus } from '../hooks/useStatus';
import { useSbarItems } from '../hooks/useSbar';

export default function StatusBar() {
  const { status, asof } = useStatus();
  const items = useSbarItems();
  return (
    <div className="sbar">
      <span className="dm">{lower}</span>
      <span className="tk">
        {items ? (
          items.map((it, i) =>
            typeof it === 'string' ? (
              <span key={i}>{it}</span>
            ) : (
              <span key={i}>
                {it[0]} <b>{it[1]}</b>
              </span>
            ),
          )
        ) : !status ? (
          <span>—</span>
        ) : status.paused ? (
          <span>queue on hold</span>
        ) : (
          <>
            <span>
              running <b>{status.running}</b>
            </span>
            <span>
              queued <b>{status.queued}</b>
            </span>
            <span>
              model <b>{BRAND.model}</b>
            </span>
          </>
        )}
      </span>
      {BRAND.demo && <span className="demo">demo data</span>}
      <span className="rt">{asof}</span>
    </div>
  );
}
