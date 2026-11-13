export type Verdict =
  | 'REAL'
  | 'LIKELY REAL'
  | 'PARTLY REAL'
  | 'UNCLEAR'
  | 'LIKELY LARP'
  | 'LARP'
  | 'SCAM';

export type Kind = 'post' | 'site' | 'coin' | 'account' | 'wallet' | 'repo';
export type RunStatus = 'queued' | 'running' | 'done' | 'failed';

/** En rad i flödet (/api/feed). */
export interface FeedItem {
  id: string;
  kind: Kind;
  input: string;
  host: string;
  title?: string;
  call?: string;
  headline?: string;
  verdict: Verdict | null;
  score: number | null;
  status: RunStatus;
  created: number; // ms sedan epoch, räknas om relativt i fixtures (se lib/api.ts)
  mint?: string | null;
  sym?: string | null;
  coinStamp?: string | null;
}

export interface FeedResponse {
  checks: FeedItem[];
  running: string[];
  queued: number;
  today: { checks: number };
}

export interface StatusResponse {
  running: number;
  queued: number;
  paused: boolean;
  until: number | null;
}

/* ── Rapport (/c/:id) ─────────────────────────────────────── */

export type ClaimResult = 'true' | 'works' | 'false' | 'broken' | 'unproven';
export type FindingKind = 'works' | 'claim-true' | 'fails' | 'claim-false' | 'risk' | 'unverified' | 'info';
export type PartStatus = 'works' | 'true' | 'broken' | 'false' | 'risk' | 'unproven' | 'n/a';
export type Lane = 'base' | 'web' | 'hands';

export interface Chip {
  k?: string; // "site", "coin", "x", "code" — saknas för X-posten
  label: string;
  href: string;
  post?: boolean;
}

export interface Claim {
  claim: string;
  where: string;
  how: string;
  result: ClaimResult;
  evidence: string;
}

export interface Finding {
  kind: FindingKind;
  title: string;
  detail: string;
  evidence: string;
  src: string;
  href?: string;
}

export interface Frame {
  src: string;
  act: string;
  url?: string;
  err?: string;
  wallet?: number;
  red?: boolean;
  text?: string;
}

export interface Run {
  label: string; // "first visit", "run 2 · auto"
  title: string;
  meta: string;
  url: string;
  frames: Frame[];
  meters?: [string, string, boolean?][];
}

export interface Slip {
  kind: string; // "connect", "signTransaction", ...
  kindLabel: string;
  chain: string;
  run: number;
  step: number;
  summary: string;
  flags: string[];
  mine: [string, number][];
  receivers: { address: string; kind?: string; amount: string }[];
  actions: string[];
  programs: string[];
  units?: number;
  frame?: number;
}

export interface Part {
  name: string;
  status: PartStatus;
  text: string;
  bullets: { t: string; bad?: boolean }[];
  hook?: boolean;
}

export interface HolderBar {
  pct: number;
  pool?: boolean;
  label: string;
}

export interface TeamWallet {
  roles: string[];
  main?: boolean;
  address: string;
  kind?: string;
  sol: string;
  held: string;
  heldSub: string;
  traded: string;
  tradedSub?: string;
  funded: string;
  exchanges: string;
  launches: string;
  launchesSub?: string;
  flags: { t: string; tone?: 'bad' | 'warn' }[];
  bad?: boolean;
  details: [string, string][];
}

export interface Team {
  tiles: { lb: string; v: string; sub: string; warn?: boolean }[];
  findings: { tone: 'bad' | 'ok' | 'info'; title: string; text: string; ev: string }[];
  wallets: TeamWallet[];
  foot: string;
}

export interface Step {
  t: number; // ms från start
  lane: Lane;
  name: string;
  found: string;
  status: 'ok' | 'warn' | 'bad' | 'run';
}

export interface Report {
  id: string;
  kind: Kind;
  input: string;
  host: string;
  created: number;
  status: RunStatus;
  stage?: 'fast' | 'deep' | 'final';
  mint?: string | null;
  sym?: string | null;
  chips: Chip[];
  verdict: {
    verdict: Verdict | null;
    score: number | null;
    title?: string;
    firstRead?: boolean;
    story?: number;
    holders?: number;
    holdersStamp?: string;
    weights?: string;
    cap?: string;
    headline?: string;
    call?: string;
    eli5?: string;
    summary?: string;
    watch?: string;
  };
  timing: { fastMs?: number; deepMs?: number };
  claims: Claim[];
  findings: Finding[];
  runs: Run[];
  handsEmpty?: string;
  walletTest?: string;
  wallet: Slip[];
  walletEmpty?: { text: string; tried?: string[] };
  catchLine?: { k: string; text: string };
  parts: Part[];
  holders?: { meters: [string, string][]; bars: HolderBar[] };
  team?: Team;
  steps: Step[];
  side: {
    coin?: { stamp: string; score: number; line: string; kv: [string, string, string?][]; why: [number, string][] };
    who?: [string, string, string?][];
    check: [string, string][];
  };
}
