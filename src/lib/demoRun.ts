// Lokalt demo-läge för "Run"-formuläret. Referensen POST:ar till /api/check och
// strömmar resultatet; här simuleras ett körande run i webbläsaren så att hela
// UI-flödet (kö → first read → testing → klar) går att se utan backend.
// TODO(backend): ersätt startRun() med POST /api/check och demoReport() med
// GET /api/check/:id + EventSource(`/api/check/${id}/events`).
import type { FeedItem, Kind, Report, Step } from '../data/types';
import { short, stripProto } from './format';

const KEY = 'dryrun.demo-runs';
const FIRST_READ = 4200;
const DONE = 14500;

interface DemoRun {
  id: string;
  input: string;
  kind: Kind;
  host: string;
  started: number;
}

function load(): DemoRun[] {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || '[]') as DemoRun[];
  } catch {
    return [];
  }
}

function save(a: DemoRun[]) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(a.slice(0, 20)));
  } catch {
    /* privat läge: demo-runs lever bara tills sidan laddas om */
  }
}

export const isDemoId = (id: string) => load().some((r) => r.id === id);

const ADDR = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export function classify(raw: string): { kind: Kind; host: string } | null {
  const v = raw.trim();
  if (!v) return null;
  if (/^https?:\/\/(www\.)?(x|twitter)\.com\/\w+\/status\//i.test(v)) {
    const h = v.match(/(?:x|twitter)\.com\/(\w+)/i)?.[1] || 'x';
    return { kind: 'post', host: '@' + h };
  }
  if (/^@\w{1,15}$/.test(v) || /^https?:\/\/(www\.)?(x|twitter)\.com\/\w{1,15}\/?$/i.test(v))
    return { kind: 'account', host: '@' + v.replace(/^.*\.com\//, '').replace(/^@|\/$/g, '') };
  if (/github\.com\/[\w.-]+\/[\w.-]+/i.test(v))
    return { kind: 'repo', host: v.match(/github\.com\/([\w.-]+\/[\w.-]+)/i)![1] };
  if (ADDR.test(v)) return v.endsWith('pump') ? { kind: 'coin', host: '$' + v.slice(0, 4) } : { kind: 'wallet', host: short(v) };
  if (/^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(v))
    return { kind: 'site', host: stripProto(v).replace(/\/.*$/, '').toLowerCase() };
  return null;
}

export function startRun(input: string): { id?: string; error?: string } {
  const c = classify(input);
  if (!c) return { error: 'Paste a post link, a site, a contract address, a wallet or an @handle.' };
  const abc = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let id = 'd';
  for (let i = 0; i < 9; i++) id += abc[Math.floor(Math.random() * abc.length)];
  save([{ id, input: input.trim(), ...c, started: Date.now() }, ...load()]);
  return { id };
}

function phase(r: DemoRun) {
  const e = Date.now() - r.started;
  return { e, stage: e < FIRST_READ ? 'fast' : e < DONE ? 'deep' : 'final' } as const;
}

const CALL = 'Demo mode: no backend is connected, so nothing was really checked.';

export function demoFeedItems(): FeedItem[] {
  return load().map((r) => {
    const { stage } = phase(r);
    const done = stage === 'final';
    return {
      id: r.id,
      kind: r.kind,
      input: r.input,
      host: r.host,
      title: 'your run (demo)',
      call: done ? CALL : undefined,
      verdict: stage === 'fast' ? null : 'UNCLEAR',
      score: stage === 'fast' ? null : done ? 30 : 34,
      status: done ? 'done' : 'running',
      created: r.started,
      mint: r.kind === 'coin' ? r.input : null,
      sym: r.kind === 'coin' ? r.input.slice(0, 4) : null,
    };
  });
}

export function demoReport(id: string): Report | null {
  const r = load().find((x) => x.id === id);
  if (!r) return null;
  const { e, stage } = phase(r);
  const done = stage === 'final';
  const site = r.kind === 'site' ? `https://${r.host}/` : '';
  const all: Step[] = [
    { t: 0, lane: 'base', name: `Input (${r.kind})`, found: r.input.slice(0, 70), status: 'ok' },
    { t: 500, lane: 'base', name: 'Read the post, the site and the code', found: 'demo: no reader connected', status: 'warn' },
    { t: 1300, lane: 'base', name: 'Coin on chain (launch records + mint account)', found: r.kind === 'coin' ? 'demo: no RPC configured' : 'no coin in the input', status: r.kind === 'coin' ? 'warn' : 'ok' },
    { t: 2600, lane: 'base', name: 'Team wallets: every wallet tied to the project', found: 'demo: skipped', status: 'warn' },
    { t: FIRST_READ - 200, lane: 'base', name: 'First read: claims + a first verdict', found: 'first call UNCLEAR 34', status: 'ok' },
    { t: 5200, lane: 'hands', name: 'Sandbox browser: open the site', found: site ? stripProto(site) : 'no site to open', status: 'ok' },
    { t: 7600, lane: 'hands', name: 'Sandbox wallet: connect, press the main button', found: 'demo: no sandbox wallet attached', status: 'warn' },
    { t: 9400, lane: 'web', name: 'Web search', found: r.host, status: 'ok' },
    { t: 12000, lane: 'base', name: 'Teardown: the project part by part', found: 'demo: nothing to take apart', status: 'ok' },
    { t: DONE - 300, lane: 'base', name: 'Final verdict', found: 'UNCLEAR 30 (demo)', status: 'ok' },
  ];
  const steps = all.filter((s) => s.t <= e).map((s, i, a) => (!done && i === a.length - 1 ? { ...s, status: 'run' as const } : s));
  const frames =
    site && e > 5200
      ? [
          { src: `gen:${r.host}|0`, act: `open ${r.host}/`, url: site },
          ...(e > 7600 ? [{ src: `gen:${r.host}|2`, act: 'connect the wallet', url: site, err: 'demo: no sandbox wallet attached' }] : []),
        ]
      : [];
  return {
    id: r.id,
    kind: r.kind,
    input: r.input,
    host: r.host,
    created: r.started,
    status: done ? 'done' : 'running',
    stage,
    mint: r.kind === 'coin' ? r.input : null,
    sym: r.kind === 'coin' ? r.input.slice(0, 4) : null,
    chips: [
      ...(r.kind === 'post' ? [{ label: 'the post', href: r.input, post: true }] : []),
      ...(site ? [{ k: 'site', label: r.host, href: site }] : []),
    ],
    verdict:
      stage === 'fast'
        ? { verdict: null, score: null, title: 'your run (demo)' }
        : {
            verdict: 'UNCLEAR',
            score: done ? 30 : 34,
            firstRead: !done,
            title: 'your run (demo)',
            headline: done
              ? 'This is a demo run. The interface works end to end, but no reader, sandbox browser or wallet is connected yet, so no claim was tested.'
              : undefined,
            call: done ? CALL : undefined,
            eli5: done ? 'Nothing was checked for real. Connect the backend and the same page fills with the actual findings.' : undefined,
            summary: done
              ? 'Every section below is wired to the same data shape the real backend returns: claims, findings, the hands-on visit, the wallet requests, the part-by-part teardown, holders and team wallets.'
              : undefined,
            watch: done ? 'See README → Backend for the endpoints to connect.' : undefined,
          },
    timing: { fastMs: e >= FIRST_READ ? FIRST_READ : undefined, deepMs: done ? DONE : undefined },
    claims:
      stage === 'fast'
        ? []
        : [
            {
              claim: 'The project does what its post says.',
              where: 'in the input',
              how: 'Demo mode: the claim was listed but not tested.',
              result: 'unproven',
              evidence: r.input,
            },
          ],
    findings: done
      ? [
          {
            kind: 'info',
            title: 'Demo run',
            detail: 'No backend is connected. Findings from the real run land here, each with its evidence.',
            evidence: 'TODO(backend)',
            src: 'demo',
          },
        ]
      : [],
    runs: frames.length
      ? [{ label: 'first visit', title: 'Opened the site and pressed the obvious buttons', meta: 'demo', url: site, frames }]
      : [],
    handsEmpty: site ? undefined : 'No hands-on visit: there was no website to use.',
    walletTest: e > 7600 && site ? 'demo: the sandbox wallet is not attached, so no request could reach it' : undefined,
    wallet: [],
    walletEmpty: {
      text: done || e > 7600 ? 'Nothing asked the sandbox wallet to connect or sign (demo mode).' : 'The sandbox wallet is offered on every hands-on run. Requests land here the moment the site asks.',
    },
    parts: [],
    steps,
    side: {
      check: [
        ['opened', new Date(r.started).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })],
        ['first verdict', e >= FIRST_READ ? '4.2 s' : '—'],
        ['finished', done ? '14.5 s' : '—'],
        ['mode', 'demo · TODO(backend)'],
        ['input', r.input],
      ],
    },
  };
}
