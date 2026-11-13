import { useEffect, useRef, useState } from 'react';
import type { FeedResponse } from '../data/types';
import { getFeed, type FeedQuery } from '../lib/api';

/** Hämtar flödet och pollar: 4 s när något kör, annars 20 s (som referensen). */
export function useFeed(query: FeedQuery) {
  const [data, setData] = useState<FeedResponse | null>(null);
  const [live, setLive] = useState(false);
  const key = JSON.stringify(query);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    const q = JSON.parse(key) as FeedQuery;
    const load = async () => {
      clearTimeout(timer.current);
      try {
        const j = await getFeed(q);
        if (!alive) return;
        setData(j);
        setLive(true);
        timer.current = window.setTimeout(load, j.running.length || j.queued ? 4e3 : 2e4);
      } catch {
        if (!alive) return;
        setLive(false);
        timer.current = window.setTimeout(load, 8e3);
      }
    };
    load();
    return () => {
      alive = false;
      clearTimeout(timer.current);
    };
  }, [key]);

  return { data, live };
}

/** Sökfält med 250 ms debounce. */
export function useDebounced(value: string, ms = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value.trim()), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}
