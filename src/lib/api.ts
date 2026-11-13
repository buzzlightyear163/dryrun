// Datalager. Läser statiska fixtures under /public/api/*.json.
// TODO(backend): byt fetch-anropen mot riktiga endpoints (se README → "Backend").
import type { FeedItem, FeedResponse, Kind, Report, StatusResponse } from '../data/types';
import { demoFeedItems, demoReport, isDemoId } from './demoRun';

type Raw<T> = T & { ago?: number };

const loadedAt = Date.now();
const abs = (ago?: number) => loadedAt - (ago ?? 0) * 1000;

let feedCache: Promise<FeedResponse> | null = null;

async function getJSON<T>(url: string): Promise<T> {
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error(`${url} → ${r.status}`);
  return (await r.json()) as T;
}

function baseFeed(): Promise<FeedResponse> {
  if (!feedCache) {
    feedCache = getJSON<Omit<FeedResponse, 'checks'> & { checks: Raw<FeedItem>[] }>('/api/feed.json').then((j) => ({
      ...j,
      checks: j.checks.map(({ ago, ...c }) => ({ ...c, created: abs(ago) })),
    }));
    feedCache.catch(() => (feedCache = null));
  }
  return feedCache;
}

export interface FeedQuery {
  verdict?: string; // kommaseparerad lista, tom = alla
  kind?: '' | Kind;
  sort?: 'new' | 'score' | 'low';
  q?: string;
  limit?: number;
}

export async function getFeed(query: FeedQuery = {}): Promise<FeedResponse> {
  const j = await baseFeed();
  const mine = demoFeedItems();
  let a: FeedItem[] = [...mine, ...j.checks];
  const vs = (query.verdict || '').split(',').filter(Boolean);
  if (vs.length) a = a.filter((c) => c.verdict && vs.includes(c.verdict));
  if (query.kind) a = a.filter((c) => c.kind === query.kind);
  const q = (query.q || '').toLowerCase();
  if (q)
    a = a.filter((c) =>
      [c.host, c.title, c.input, c.call, c.mint, c.sym].some((x) => String(x || '').toLowerCase().includes(q)),
    );
  if (query.sort === 'score') a = [...a].sort((x, y) => (y.score ?? -1) - (x.score ?? -1));
  else if (query.sort === 'low') a = [...a].sort((x, y) => (x.score ?? 101) - (y.score ?? 101));
  else a = [...a].sort((x, y) => y.created - x.created);
  const running = mine.filter((c) => c.status === 'running').map((c) => c.id);
  return {
    checks: a.slice(0, query.limit ?? 200),
    running: [...j.running, ...running],
    queued: j.queued,
    today: { checks: j.today.checks + mine.length },
  };
}

export async function getStatus(): Promise<StatusResponse> {
  const s = await getJSON<StatusResponse>('/api/status.json');
  const mine = demoFeedItems().filter((c) => c.status === 'running').length;
  return { ...s, running: s.running + mine };
}

export async function getReport(id: string): Promise<Report | null> {
  if (isDemoId(id)) return demoReport(id);
  if (!/^[0-9A-Za-z]{10}$/.test(id)) return null;
  try {
    const r = await getJSON<Raw<Report>>(`/api/checks/${id}.json`);
    const { ago, ...rest } = r;
    return { ...rest, created: abs(ago) };
  } catch {
    // Ingen detaljerad fixture: bygg en kort rapport från flödesraden.
    const feed = await baseFeed();
    const row = feed.checks.find((c) => c.id === id);
    return row ? reportFromRow(row) : null;
  }
}

/** Kort rapport för flödesrader som saknar egen fixture. */
function reportFromRow(c: FeedItem): Report {
  const site = c.kind === 'site' ? `https://${c.host}/` : '';
  return {
    id: c.id,
    kind: c.kind,
    input: c.input,
    host: c.host,
    created: c.created,
    status: c.status,
    stage: 'final',
    mint: c.mint,
    sym: c.sym,
    chips: [
      ...(c.kind === 'post' ? [{ label: 'the post', href: 'https://x.com/', post: true }] : []),
      ...(site ? [{ k: 'site', label: c.host, href: site }] : []),
      ...(c.mint ? [{ k: 'coin', label: '$' + (c.sym || c.mint.slice(0, 4)), href: `https://solscan.io/token/${c.mint}` }] : []),
    ],
    verdict: {
      verdict: c.verdict,
      score: c.score,
      title: c.title,
      headline: c.headline || c.call,
      call: c.call,
      summary:
        'Demo report. The full breakdown (claims, wallet run, team wallets) appears here once the backend is connected.',
    },
    timing: { fastMs: 11800, deepMs: 71400 },
    claims: [],
    findings: [],
    runs: [],
    handsEmpty: 'Demo data: this run has no stored hands-on visit.',
    wallet: [],
    walletEmpty: { text: 'Demo data: this run has no stored wallet requests.' },
    parts: [],
    steps: [
      { t: 0, lane: 'base', name: 'Input', found: c.input.slice(0, 60), status: 'ok' },
      { t: 11800, lane: 'base', name: 'First read: claims + a first verdict', found: 'stored', status: 'ok' },
      { t: 71400, lane: 'base', name: 'Final verdict', found: `${c.verdict} ${c.score}`, status: 'ok' },
    ],
    side: {
      check: [
        ['first verdict', '11.8 s'],
        ['finished', '1 min 11 s'],
        ['input', c.input],
      ],
    },
  };
}
