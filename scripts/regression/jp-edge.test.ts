/**
 * 日本語版の境界回帰：大限の年齢境界、2027年立春/春節、晚子時。
 *
 * ・大限は 12 個・連続・重複なし。虚歳の境界（start/end/end+1）で正しい index を返す。
 * ・2027-02-03 は丙午、02-04（立春）から丁未。春節前は農暦年が丙午のまま。
 * ・23:59 は翌日、00:00 は当日。
 *
 * 注：四柱はエンジンが中国標準時前提で計算する。日本語版の画面には表示していない。
 *     将来表示する場合は utcOffset 対応が必要（docs/domain/ASTROLOGY-RULES.md 参照）。
 */

import { generateChart } from '../../lib/ziwei/algorithm';
import { getDaXianIndexForAge } from '../../lib/ziwei/yunxian-context';
import { jpBirthToChartInput, type JpBirthInput } from '../../lib/jp/birth';

let failures = 0;
function ok(name: string, cond: boolean, detail = '') {
  if (!cond) {
    failures += 1;
    console.error(`✗ ${name}${detail ? `: ${detail}` : ''}`);
  } else {
    console.log(`✓ ${name}`);
  }
}

const base: JpBirthInput = {
  year: 1990,
  month: 6,
  day: 15,
  clockHour: 8,
  clockMinute: 0,
  unknownTime: false,
  prefecture: '東京都',
  gender: 'male',
};

const charts = [
  base,
  { ...base, year: 1985, month: 1, day: 1, clockHour: 14, clockMinute: 0 },
  { ...base, year: 1988, month: 3, day: 3, clockHour: 14, clockMinute: 0, prefecture: '大阪府' },
  { ...base, year: 1995, month: 11, day: 20, clockHour: 23, clockMinute: 40, prefecture: '北海道' },
];

for (const input of charts) {
  const chart = generateChart(jpBirthToChartInput(input).birthInfo);
  ok(`${input.year}: 大限が12個`, chart.daXians.length === 12, String(chart.daXians.length));

  let contiguous = true;
  for (let i = 1; i < chart.daXians.length; i++) {
    if (chart.daXians[i].startAge !== chart.daXians[i - 1].endAge + 1) contiguous = false;
  }
  ok(`${input.year}: 大限が連続している`, contiguous);

  for (let i = 0; i < chart.daXians.length; i++) {
    const dx = chart.daXians[i];
    ok(`${input.year}: 大限${i} start=${dx.startAge}`, getDaXianIndexForAge(chart, dx.startAge) === i);
    ok(`${input.year}: 大限${i} end=${dx.endAge}`, getDaXianIndexForAge(chart, dx.endAge) === i);
    if (i + 1 < chart.daXians.length) {
      ok(`${input.year}: 大限${i} の翌年は次へ`, getDaXianIndexForAge(chart, dx.endAge + 1) === i + 1);
    }
  }

  if (chart.currentDaXianIndex >= 0) {
    ok(
      `${input.year}: 現在の大限 index が虚歳と一致`,
      chart.currentDaXianIndex === getDaXianIndexForAge(chart, chart.currentAge),
      `${chart.currentAge} / ${chart.currentDaXianIndex}`,
    );
  }
}

// 2027年 立春・春節
function pillars(year: number, month: number, day: number) {
  const chart = generateChart(
    jpBirthToChartInput({ ...base, year, month, day, clockHour: 12, clockMinute: 0 }).birthInfo,
  );
  return chart.lunarInfo;
}

const feb3 = pillars(2027, 2, 3);
const feb4 = pillars(2027, 2, 4);
const feb6 = pillars(2027, 2, 6);
ok('2027-02-03 の節気年柱は丙午', feb3.fourPillars?.[0] === '丙午', feb3.fourPillars?.[0]);
ok('2027-02-04（立春）の節気年柱は丁未', feb4.fourPillars?.[0] === '丁未', feb4.fourPillars?.[0]);
ok('2027-02-04 は農暦年ではまだ丙午', feb4.fourPillarsLunar?.[0] === '丙午', feb4.fourPillarsLunar?.[0]);
ok('2027-02-06（春節）の農暦年は丁未', feb6.fourPillarsLunar?.[0] === '丁未', feb6.fourPillarsLunar?.[0]);

// 晚子時
const late = jpBirthToChartInput({ ...base, clockHour: 23, clockMinute: 59 });
ok('23:59 は子（0）', late.solar?.branch === 0);
ok('23:59 は翌日', late.chartDate.day === 16 && late.dayOffset === 1);
const midnight = jpBirthToChartInput({ ...base, clockHour: 0, clockMinute: 0 });
ok('00:00 は子（0）', midnight.solar?.branch === 0);
ok('00:00 は当日', midnight.chartDate.day === 15 && midnight.dayOffset === 0);

if (failures > 0) {
  console.error(`\n[ jp-edge ] ${failures} 件失敗`);
  process.exit(1);
}
console.log('\n[jp-edge] すべて通過');
