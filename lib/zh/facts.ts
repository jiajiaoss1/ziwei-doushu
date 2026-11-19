/**
 * 命盤 → 繁體中文「事實」的轉換層（香港／台灣版）。
 *
 * 這裡只做結構化：宮位、星曜、四化、大限、流年、格局。
 * 文字化交給 interpret.ts / report.ts。
 */

import type { Palace, Star, ZiweiChart } from '@/lib/ziwei/types';
import { BRANCHES, STEMS } from '@/lib/ziwei/constants';
import { getLiuNianSiHua } from '@/lib/ziwei/sihua';
import type { Pattern } from '@/lib/ziwei/patterns';
import {
  brightnessZh,
  palaceZh,
  patternZh,
  starZh,
  type BrightnessZh,
  type StarZh,
} from './glossary';

export type HuaKey = '禄' | '権' | '科' | '忌';

export interface StarFact {
  name: string;
  zh: StarZh;
  type: Star['type'];
  brightnessRaw?: string;
  brightness?: BrightnessZh;
  siHua?: string;
}

export interface PalaceFact {
  name: string;
  nameZh: string;
  theme: string;
  branch: number;
  branchName: string;
  stemName: string;
  stars: StarFact[];
  major: StarFact[];
  lucky: string[];
  sha: string[];
  isEmpty: boolean;
  borrowedFromName?: string;
  borrowedStars: string[];
}

export interface DaxianFact {
  index: number;
  startAge: number;
  endAge: number;
  palaceName: string;
  palaceZh: string;
  decadeTheme: string;
  major: StarFact[];
}

export interface LiunianFact {
  year: number;
  stem: string;
  branch: string;
  sihua: Record<string, string>;
  landed: {
    hua: HuaKey;
    star: string;
    palaceName: string;
    palaceZh: string;
    theme: string;
  }[];
  palaceName: string;
  palaceZh: string;
}

export interface PatternFact {
  name: string;
  nameZh: string;
  desc: string;
  level: Pattern['level'];
  levelLabel: string;
}

export interface ZhChartFacts {
  chart: ZiweiChart;
  year: number;
  age: number;
  gender: 'male' | 'female';
  yinYangGender: string;
  wuxingJuName: string;
  mingZhu: string;
  shenZhu: string;
  ming: PalaceFact;
  fuqi: PalaceFact;
  guanlu: PalaceFact;
  caibo: PalaceFact;
  tianzhai: PalaceFact;
  fude: PalaceFact;
  qianyi: PalaceFact;
  xiongdi: PalaceFact;
  palaces: PalaceFact[];
  daxian?: DaxianFact;
  isChildhood: boolean;
  liunian: LiunianFact;
  patterns: PatternFact[];
  sanfang: { palaceName: string; stars: string[] }[];
}

const LEVEL_LABEL: Record<Pattern['level'], string> = {
  excellent: '強項',
  good: '順風',
  neutral: '特質',
  caution: '留意點',
};

const LEVEL_RANK: Record<Pattern['level'], number> = {
  excellent: 0,
  good: 1,
  neutral: 2,
  caution: 3,
};

function toHua(raw?: string): HuaKey | undefined {
  if (!raw) return undefined;
  if (raw === '权') return '権';
  if (raw === '禄' || raw === '科' || raw === '忌' || raw === '権') return raw;
  return undefined;
}

function starFact(star: Star): StarFact {
  return {
    name: star.name,
    zh: starZh(star.name),
    type: star.type,
    brightnessRaw: star.brightnessRaw,
    brightness: brightnessZh(star.brightnessRaw),
    siHua: star.siHua,
  };
}

function palaceFact(palace: Palace): PalaceFact {
  const info = palaceZh(palace.name);
  const stars = palace.stars.map(starFact);
  return {
    name: palace.name,
    nameZh: info.nameZh,
    theme: info.theme,
    branch: palace.branch,
    branchName: BRANCHES[palace.branch] ?? '',
    stemName: STEMS[palace.stem] ?? '',
    stars,
    major: stars.filter((s) => s.type === 'major'),
    lucky: stars.filter((s) => s.type === 'lucky').map((s) => s.zh.nameZh),
    sha: stars.filter((s) => s.type === 'sha').map((s) => s.zh.nameZh),
    isEmpty: palace.isEmpty ?? stars.filter((s) => s.type === 'major').length === 0,
    borrowedFromName: palace.borrowedFromName,
    borrowedStars: palace.borrowedStars ?? [],
  };
}

function findPalace(facts: ZhChartFacts, name: string): PalaceFact {
  return facts.palaces.find((p) => p.name === name) ?? facts.ming;
}

export function buildZhFacts(
  chart: ZiweiChart,
  year: number = new Date().getFullYear(),
  patternList: Pattern[] = [],
): ZhChartFacts {
  const palaces = chart.palaces.map(palaceFact);
  const byName = (name: string) => palaces.find((p) => p.name === name) ?? palaces[0];

  const ming = byName('命宫');
  const mingBranch = ming.branch;
  const sanfangBranches = [mingBranch, (mingBranch + 4) % 12, (mingBranch + 8) % 12, (mingBranch + 6) % 12];
  const sanfang = sanfangBranches
    .map((b) => palaces.find((p) => p.branch === b))
    .filter((p): p is PalaceFact => Boolean(p))
    .map((p) => ({ palaceName: p.nameZh, stars: p.major.map((s) => s.zh.nameZh) }));

  const dxIndex = chart.currentDaXianIndex;
  const dx = dxIndex >= 0 ? chart.daXians[dxIndex] : undefined;
  const dxPalace = dx ? palaces.find((p) => p.branch === dx.palaceBranch) : undefined;

  const ln = getLiuNianSiHua(year);
  const landed = (Object.entries(ln.transforms) as [string, string][]).map(([huaRaw, starName]) => {
    const hua = toHua(huaRaw) ?? '禄';
    const palace = palaces.find((p) => p.stars.some((s) => s.name === starName));
    return {
      hua,
      star: starZh(starName).nameZh,
      palaceName: palace?.name ?? '',
      palaceZh: palace?.nameZh ?? '',
      theme: palace?.theme ?? '',
    };
  });

  const yearBranchIdx = ((year - 4) % 12 + 12) % 12;
  const liunianPalace = palaces.find((p) => p.branch === yearBranchIdx);

  const detected = patternList
    .map((p) => {
      const zh = patternZh(p.name);
      if (!zh) return null;
      return {
        name: p.name,
        nameZh: zh.nameZh,
        desc: p.source?.includes('卷一') ? `${zh.desc}（《紫微斗數全書》卷一 出典）` : zh.desc,
        level: p.level,
        levelLabel: LEVEL_LABEL[p.level],
      } satisfies PatternFact;
    })
    .filter((p): p is PatternFact => Boolean(p))
    .sort((a, b) => LEVEL_RANK[a.level] - LEVEL_RANK[b.level]);

  const facts: ZhChartFacts = {
    chart,
    year,
    age: chart.currentAge,
    gender: chart.birthInfo.gender,
    yinYangGender: starZh(chart.yinYangGender ?? '').nameZh,
    wuxingJuName: chart.wuxingJuName,
    mingZhu: starZh(chart.mingZhu ?? '').nameZh,
    shenZhu: starZh(chart.shenZhu ?? '').nameZh,
    ming,
    fuqi: byName('夫妻'),
    guanlu: byName('官禄'),
    caibo: byName('财帛'),
    tianzhai: byName('田宅'),
    fude: byName('福德'),
    qianyi: byName('迁移'),
    xiongdi: byName('兄弟'),
    palaces,
    daxian: dx && dxPalace
      ? {
          index: dxIndex,
          startAge: dx.startAge,
          endAge: dx.endAge,
          palaceName: dx.palaceName,
          palaceZh: dxPalace.nameZh,
          decadeTheme: palaceZh(dxPalace.name).decade,
          major: dxPalace.major,
        }
      : undefined,
    isChildhood: dxIndex < 0,
    liunian: {
      year,
      stem: ln.stemName,
      branch: BRANCHES[yearBranchIdx] ?? '',
      sihua: ln.transforms,
      landed,
      palaceName: liunianPalace?.name ?? '',
      palaceZh: liunianPalace?.nameZh ?? '',
    },
    patterns: detected,
    sanfang,
  };

  return facts;
}

export { findPalace };
