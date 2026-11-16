/**
 * 日本向け 出生情報 → 命盤入力
 *
 * 日本の標準時（UTC+9 / 中央経線 135°E）を前提に、真太陽時（経度差＋均時差）で
 * 時辰を求め、23時以降（晩子時）は翌日で排盤する。
 */

import type { BirthInfo } from '@/lib/ziwei/types';
import {
  calculateTrueSolarTime,
  formatTrueSolarClock,
  formatSignedMinutes,
  isValidGregorianDate,
  resolveZiweiDayOffset,
  shiftGregorianDate,
  type TrueSolarTimeResult,
} from '@/lib/ziwei/true-solar-time';
import { getPrefecture, JST_OFFSET_MINUTES, type PrefectureJa } from './cities';

export interface JpBirthInput {
  year: number;
  month: number;
  day: number;
  clockHour: number;
  clockMinute: number;
  unknownTime: boolean;
  prefecture: string;
  gender: 'male' | 'female';
}

export interface JpBirthResult {
  birthInfo: BirthInfo;
  /** 真太陽時の計算結果（時刻不明時は undefined） */
  solar?: TrueSolarTimeResult;
  prefecture?: PrefectureJa;
  /** 排盤に使う日付（晩子時で翌日になる場合がある） */
  chartDate: { year: number; month: number; day: number };
  /** 入力日からの日数差 */
  dayOffset: number;
  /** 画面に出す注記 */
  notes: string[];
}

export function isValidJpBirthInput(input: JpBirthInput): boolean {
  if (!isValidGregorianDate(input.year, input.month, input.day)) return false;
  if (input.year < 1900 || input.year > 2100) return false;
  if (input.gender !== 'male' && input.gender !== 'female') return false;
  if (input.unknownTime) return true;
  if (
    !Number.isInteger(input.clockHour) ||
    !Number.isInteger(input.clockMinute) ||
    input.clockHour < 0 ||
    input.clockHour > 23 ||
    input.clockMinute < 0 ||
    input.clockMinute > 59
  ) {
    return false;
  }
  return true;
}

export function jpBirthToChartInput(input: JpBirthInput): JpBirthResult {
  if (!isValidJpBirthInput(input)) {
    throw new RangeError('出生日時が正しくありません。');
  }

  const prefecture = getPrefecture(input.prefecture);
  const notes: string[] = [];

  // 時刻不明 → 正午固定（真太陽時補正はしない）
  if (input.unknownTime) {
    const birthInfo: BirthInfo = {
      year: input.year,
      month: input.month,
      day: input.day,
      hour: 6, // 午（11:00–13:00）
      gender: input.gender,
      province: prefecture?.name,
      city: prefecture?.capital,
      longitude: prefecture?.longitude,
    };
    notes.push(
      '出生時刻が不明のため、正午（12:00）で計算しています。命宮が変わる可能性があります。',
    );
    return {
      birthInfo,
      prefecture,
      chartDate: { year: input.year, month: input.month, day: input.day },
      dayOffset: 0,
      notes,
    };
  }

  // 都道府県不明 → 補正なし（135°E 扱い）
  const longitude = prefecture?.longitude;
  const solar = calculateTrueSolarTime({
    year: input.year,
    month: input.month,
    day: input.day,
    clockHour: input.clockHour,
    clockMinute: input.clockMinute,
    longitude,
    utcOffsetMinutes: JST_OFFSET_MINUTES,
  });

  const dayOffset = resolveZiweiDayOffset(solar, 'next-day');
  const chartDate = shiftGregorianDate(
    { year: input.year, month: input.month, day: input.day },
    dayOffset,
  );

  if (longitude !== undefined) {
    const diff = formatSignedMinutes(solar.totalCorrectionMinutes);
    notes.push(`真太陽時で ${diff} 分補正しています（${prefecture?.name ?? ''}）。`);
  }

  if (dayOffset !== 0) {
    notes.push(
      `23時以降のため、翌日（${chartDate.year}年${chartDate.month}月${chartDate.day}日）の命盤として計算しています。`,
    );
  }

  const birthInfo: BirthInfo = {
    year: chartDate.year,
    month: chartDate.month,
    day: chartDate.day,
    hour: solar.branch,
    gender: input.gender,
    province: prefecture?.name,
    city: prefecture?.capital,
    longitude,
    origInput: {
      year: input.year,
      month: input.month,
      day: input.day,
      clockHour: input.clockHour,
      clockMinute: input.clockMinute,
    },
  };

  return {
    birthInfo,
    solar,
    prefecture,
    chartDate,
    dayOffset,
    notes,
  };
}

/** 真太陽時の時刻表示（例：8:18） */
export function formatSolarClock(solar?: TrueSolarTimeResult): string | undefined {
  if (!solar) return undefined;
  return formatTrueSolarClock(solar);
}

/** 時辰（地支）の日本語名 */
export const SHICHEN_JA = [
  '子（ね）',
  '丑（うし）',
  '寅（とら）',
  '卯（う）',
  '辰（たつ）',
  '巳（み）',
  '午（うま）',
  '未（ひつじ）',
  '申（さる）',
  '酉（とり）',
  '戌（いぬ）',
  '亥（い）',
];

export function shichenJa(branch: number): string {
  return SHICHEN_JA[branch] ?? '';
}
