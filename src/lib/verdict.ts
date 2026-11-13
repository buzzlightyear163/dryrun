import type { ClaimResult, FindingKind, Kind, PartStatus, Verdict } from '../data/types';

export const VERDICTS: Verdict[] = ['REAL', 'LIKELY REAL', 'PARTLY REAL', 'UNCLEAR', 'LIKELY LARP', 'LARP', 'SCAM'];

const VCLS: Record<Verdict, string> = {
  REAL: 'v-real',
  'LIKELY REAL': 'v-lreal',
  'PARTLY REAL': 'v-part',
  UNCLEAR: 'v-unc',
  'LIKELY LARP': 'v-llarp',
  LARP: 'v-larp',
  SCAM: 'v-scam',
};

export const vcls = (v?: Verdict | null): string => (v && VCLS[v]) || 'v-unc';

export const meterWord = (s?: number | null): string =>
  s == null
    ? ''
    : s >= 80
      ? 'Looks solid'
      : s >= 62
        ? 'Looking real'
        : s >= 54
          ? 'Leaning real'
          : s >= 47
            ? 'Neutral'
            : s > 38
              ? 'Leaning sketchy'
              : s > 20
                ? 'Sketchy'
                : 'Larp';

export const BANDS: [number, number, string][] = [
  [0, 20, 'Larp'],
  [20, 38, 'Sketchy'],
  [38, 47, 'Leaning sketchy'],
  [47, 54, 'Neutral'],
  [54, 62, 'Leaning real'],
  [62, 80, 'Looking real'],
  [80, 100, 'Looks solid'],
];

export const KINDS: Record<Kind, string> = {
  post: 'X post',
  site: 'site',
  coin: 'coin',
  account: 'account',
  wallet: 'wallet',
  repo: 'repo',
};

export const FIND_TAG: Record<FindingKind, [string, string]> = {
  works: ['works', 'k-ok'],
  'claim-true': ['true', 'k-ok'],
  fails: ['fails', 'k-bad'],
  'claim-false': ['false', 'k-bad'],
  risk: ['risk', 'k-bad'],
  unverified: ['unverified', 'k-dim'],
  info: ['info', 'k-dim'],
};

export const RES_TAG: Record<ClaimResult, [string, string]> = {
  true: ['true', 'k-ok'],
  works: ['works', 'k-ok'],
  false: ['false', 'k-bad'],
  broken: ['broken', 'k-bad'],
  unproven: ['unproven', 'k-dim'],
};

export const PART_TAG: Record<PartStatus, [string, string]> = {
  works: ['works', 'k-ok'],
  true: ['true', 'k-ok'],
  broken: ['broken', 'k-bad'],
  false: ['false', 'k-bad'],
  risk: ['risk', 'k-bad'],
  unproven: ['unproven', 'k-dim'],
  'n/a': ['n/a', 'k-wait'],
};

export const GOOD = new Set<FindingKind>(['works', 'claim-true']);
export const BAD = new Set<FindingKind>(['claim-false', 'fails', 'risk']);
export const ORDER: Record<FindingKind, number> = {
  'claim-false': 0,
  fails: 1,
  risk: 2,
  'claim-true': 3,
  works: 4,
  unverified: 5,
  info: 6,
};
