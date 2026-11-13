import { useEffect, useState } from 'react';
import type { StatusResponse } from '../data/types';
import { getStatus } from '../lib/api';

/** Pollar status var 15:e sekund, som referensens common.js. */
export function useStatus() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [asof, setAsof] = useState('—');
  useEffect(() => {
    let alive = true;
    const tick = () =>
      getStatus()
        .then((s) => {
          if (!alive) return;
          setStatus(s);
          setAsof(new Date().toLocaleTimeString());
        })
        .catch(() => {});
    tick();
    const t = setInterval(tick, 15e3);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);
  return { status, asof };
}
