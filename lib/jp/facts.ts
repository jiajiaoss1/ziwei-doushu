/**
 * 命盤 → 日本語で扱いやすい「事実」へ変換する層。
 *
 * ここでは解釈をせず、宮位・星・四化・大限・流年・格局を構造化するだけ。
 * 文章化は interpret.ts / report.ts が担当する。
 */

import type { Palace, Star, ZiweiChart } from '@/lib/ziwei/types';
import { BRANCHES, STEMS } from '@/lib/ziwei/constants';
import { getLiuNianSiHua } from '@/lib/ziwei/sihua';
import type { Pattern } from '@/lib/ziwei/patterns';
import { brightnessJa, jaStarName, patternJa, palaceJa, starJa, type BrightnessJa, type StarJa } from './glossary';

export type HuaKey = '禄' | '権' | '科' | '忌';

export interface StarFact {
  name: string;
  ja: StarJa;
  type: Star['type'];
  brightnessRaw?: string;
  brightness?: BrightnessJa;
  /** 本命四化（禄権科忌） */
  siHua?: string;
}

export interface PalaceFact {
  name: string;
  nameJa: string;
  kana: string;
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
  palaceJa: string;
  decadeTheme: string;
  major: StarFact[];
}

export interface LiunianFact {
  year: number;
  stem: string;
  branch: string;
  /** 流年四化（星名） */
  sihua: Record<string, string>;
  /** 流年四化がどの宮に入るか */
  landed: {
    hua: HuaKey;
    star: string;
    palaceName: string;
    palaceJa: string;
    theme: string;
  }[];
  /** 流年の命宮（年支の宮） */
  palaceName: string;
  palaceJa: string;
}

export interface PatternFact {
  name: string;
  nameJa: string;
  kana: string;
  desc: string;
  level: Pattern['level'];
  levelLabel: string;
}

export interface JpChartFacts {
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
  /** 命宮の三方四正（主要星の名前） */
  sanfang: { palaceName: string; stars: string[] }[];
}

const LEVEL_LABEL: Record<Pattern['level'], string> = {
  excellent: '強み',
  good: '追い風',
  neutral: '特徴',
  caution: '注意点',
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
    ja: starJa(star.name),
    type: star.type,
    brightnessRaw: star.brightnessRaw,
    brightness: brightnessJa(star.brightnessRaw),
    siHua: star.siHua,
  };
}

function palaceFact(palace: Palace): PalaceFact {
  const info = palaceJa(palace.name);
  const stars = palace.stars.map(starFact);
  return {
    name: palace.name,
    nameJa: info.nameJa,
    kana: info.kana,
    theme: info.theme,
    branch: palace.branch,
    branchName: BRANCHES[palace.branch] ?? '',
    stemName: STEMS[palace.stem] ?? '',
    stars,
    major: stars.filter((s) => s.type === 'major'),
    lucky: stars.filter((s) => s.type === 'lucky').map((s) => s.ja.nameJa),
    sha: stars.filter((s) => s.type === 'sha').map((s) => s.ja.nameJa),
    isEmpty: palace.isEmpty ?? stars.filter((s) => s.type === 'major').length === 0,
    borrowedFromName: palace.borrowedFromName,
    borrowedStars: palace.borrowedStars ?? [],
  };
}

function findPalace(facts: JpChartFacts, name: string): PalaceFact {
  return facts.palaces.find((p) => p.name === name) ?? facts.ming;
}

export function buildJpFacts(
  chart: ZiweiChart,
  year: number = new Date().getFullYear(),
  patternList: Pattern[] = [],
): JpChartFacts {
  const palaces = chart.palaces.map(palaceFact);
  const byName = (name: string) => palaces.find((p) => p.name === name) ?? palaces[0];

  const ming = byName('命宫');
  const mingBranch = ming.branch;
  const sanfangBranches = [mingBranch, (mingBranch + 4) % 12, (mingBranch + 8) % 12, (mingBranch + 6) % 12];
  const sanfang = sanfangBranches
    .map((b) => palaces.find((p) => p.branch === b))
    .filter((p): p is PalaceFact => Boolean(p))
    .map((p) => ({ palaceName: p.nameJa, stars: p.major.map((s) => s.ja.nameJa) }));

  const dxIndex = chart.currentDaXianIndex;
  const dx = dxIndex >= 0 ? chart.daXians[dxIndex] : undefined;
  const dxPalace = dx ? palaces.find((p) => p.branch === dx.palaceBranch) : undefined;

  const ln = getLiuNianSiHua(year);
  const landed = (Object.entries(ln.transforms) as [string, string][]).map(([huaRaw, starName]) => {
    const hua = toHua(huaRaw) ?? '禄';
    const palace = palaces.find((p) => p.stars.some((s) => s.name === starName));
    return {
      hua,
      star: starJa(starName).nameJa,
      palaceName: palace?.name ?? '',
      palaceJa: palace?.nameJa ?? '',
      theme: palace?.theme ?? '',
    };
  });

  const yearBranchIdx = ((year - 4) % 12 + 12) % 12;
  const liunianPalace = palaces.find((p) => p.branch === yearBranchIdx);

  const detected = patternList
    .map((p) => {
      const ja = patternJa(p.name);
      if (!ja) return null;
      return {
        name: p.name,
        nameJa: ja.nameJa,
        kana: ja.kana,
        desc: ja.desc,
        level: p.level,
        levelLabel: LEVEL_LABEL[p.level],
      } satisfies PatternFact;
    })
    .filter((p): p is PatternFact => Boolean(p));

  const facts: JpChartFacts = {
    chart,
    year,
    age: chart.currentAge,
    gender: chart.birthInfo.gender,
    yinYangGender: jaStarName(chart.yinYangGender ?? ''),
    wuxingJuName: chart.wuxingJuName,
    mingZhu: starJa(chart.mingZhu ?? '').nameJa,
    shenZhu: starJa(chart.shenZhu ?? '').nameJa,
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
          palaceJa: dxPalace.nameJa,
          decadeTheme: palaceJa(dxPalace.name).decade,
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
      palaceJa: liunianPalace?.nameJa ?? '',
    },
    patterns: detected,
    sanfang,
  };

  return facts;
}

export { findPalace };
