/**
 * 港台版：出生資訊 → 命盤輸入
 *
 * 以 UTC+8（中央經線 120°E）為前提，用真太陽時（經度差＋均時差）求時辰；
 * 23 時以後（晚子時）以翌日排盤。
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
import { CST_OFFSET_MINUTES, getCity, type CityZh } from './cities';

export interface ZhBirthInput {
  year: number;
  month: number;
  day: number;
  clockHour: number;
  clockMinute: number;
  unknownTime: boolean;
  city: string;
  gender: 'male' | 'female';
}

export interface ZhBirthResult {
  birthInfo: BirthInfo;
  solar?: TrueSolarTimeResult;
  city?: CityZh;
  chartDate: { year: number; month: number; day: number };
  dayOffset: number;
  notes: string[];
}

export function isValidZhBirthInput(input: ZhBirthInput): boolean {
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

export function zhBirthToChartInput(input: ZhBirthInput): ZhBirthResult {
  if (!isValidZhBirthInput(input)) {
    throw new RangeError('出生日期或時刻不正確。');
  }

  const city = getCity(input.city);
  const notes: string[] = [];

  // 時刻不清楚 → 以正午固定（不做真太陽時校正）
  if (input.unknownTime) {
    const birthInfo: BirthInfo = {
      year: input.year,
      month: input.month,
      day: input.day,
      hour: 6, // 午（11:00–13:00）
      gender: input.gender,
      province: city?.name,
      city: city?.capital,
      longitude: city?.longitude,
    };
    notes.push('出生時刻不清楚，因此以正午（12:00）計算；命宮可能因此不同。');
    return {
      birthInfo,
      city,
      chartDate: { year: input.year, month: input.month, day: input.day },
      dayOffset: 0,
      notes,
    };
  }

  const longitude = city?.longitude;
  const solar = calculateTrueSolarTime({
    year: input.year,
    month: input.month,
    day: input.day,
    clockHour: input.clockHour,
    clockMinute: input.clockMinute,
    longitude,
    utcOffsetMinutes: CST_OFFSET_MINUTES,
  });

  const dayOffset = resolveZiweiDayOffset(solar, 'next-day');
  const chartDate = shiftGregorianDate(
    { year: input.year, month: input.month, day: input.day },
    dayOffset,
  );

  if (longitude !== undefined) {
    const diff = formatSignedMinutes(solar.totalCorrectionMinutes);
    notes.push(`已依真太陽時校正 ${diff} 分（${city?.name ?? ''}）。`);
  }

  if (dayOffset !== 0) {
    notes.push(
      `因 23 時以後出生，以翌日（${chartDate.year} 年 ${chartDate.month} 月 ${chartDate.day} 日）的命盤計算。`,
    );
  }

  const birthInfo: BirthInfo = {
    year: chartDate.year,
    month: chartDate.month,
    day: chartDate.day,
    hour: solar.branch,
    gender: input.gender,
    province: city?.name,
    city: city?.capital,
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
    city,
    chartDate,
    dayOffset,
    notes,
  };
}

/** 真太陽時顯示（例：8:18） */
export function formatSolarClock(solar?: TrueSolarTimeResult): string | undefined {
  if (!solar) return undefined;
  return formatTrueSolarClock(solar);
}
