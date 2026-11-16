/**
 * 日本向け 生年月日 → 命盤入力の回帰テスト。
 *
 * ・日本標準時（UTC+9 / 135°E）での真太陽時補正
 * ・23時以降（晩子時）は翌日で排盤
 * ・出生時刻不明は正午固定
 * ・不正な日付の拒否
 */

import { generateChart } from '../../lib/ziwei/algorithm';
import {
  isValidJpBirthInput,
  jpBirthToChartInput,
  type JpBirthInput,
} from '../../lib/jp/birth';

let failures = 0;

function eq(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) {
    failures += 1;
    console.error(`✗ ${name}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  } else {
    console.log(`✓ ${name}`);
  }
}

function truthy(name: string, v: boolean) {
  if (!v) {
    failures += 1;
    console.error(`✗ ${name}`);
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

// 東京 08:00 → 真太陽時で約 +19 分 → 辰（branch 4）
const tokyo = jpBirthToChartInput(base);
eq('東京 08:00 の時辰は辰（4）', tokyo.solar?.branch, 4);
truthy(
  '東京 08:00 の補正は +15〜+22 分',
  (tokyo.solar?.totalCorrectionMinutes ?? 0) > 15 && (tokyo.solar?.totalCorrectionMinutes ?? 0) < 22,
);
eq('東京 08:00 は同日排盤', tokyo.dayOffset, 0);
eq('東京 08:00 の日付は変わらない', tokyo.chartDate, { year: 1990, month: 6, day: 15 });

// 那覇 は経度が西にあるため、同じ 07:00 でも時辰が一つ前になる
const naha = jpBirthToChartInput({
  ...base,
  clockHour: 7,
  prefecture: '沖縄県',
});
const tokyo7 = jpBirthToChartInput({ ...base, clockHour: 7 });
truthy(
  '同じ 07:00 でも東京と那覇で時辰が変わる',
  (naha.solar?.branch ?? -1) !== (tokyo7.solar?.branch ?? -1),
);
truthy('那覇の補正はマイナス', (naha.solar?.totalCorrectionMinutes ?? 0) < 0);

// 23:30 → 晩子時として翌日
const late = jpBirthToChartInput({ ...base, clockHour: 23, clockMinute: 30 });
eq('23:30 は子（0）', late.solar?.branch, 0);
eq('23:30 は翌日排盤', late.dayOffset, 1);
eq('23:30 の排盤日は 6/16', late.chartDate, { year: 1990, month: 6, day: 16 });

// 00:30 → 早子時として同日
const early = jpBirthToChartInput({ ...base, clockHour: 0, clockMinute: 30 });
eq('00:30 は子（0）', early.solar?.branch, 0);
eq('00:30 は同日排盤', early.dayOffset, 0);

// 時刻不明 → 正午（午 = 6）
const unknown = jpBirthToChartInput({ ...base, unknownTime: true, clockHour: 0, clockMinute: 0 });
eq('時刻不明は午（6）', unknown.birthInfo.hour, 6);
eq('時刻不明は日付を変えない', unknown.dayOffset, 0);
truthy('時刻不明の注記がある', unknown.notes.some((n) => n.includes('正午')));

// 不正な日付
truthy('2/30 は不正', !isValidJpBirthInput({ ...base, month: 2, day: 30 }));
let threw = false;
try {
  jpBirthToChartInput({ ...base, month: 2, day: 30 });
} catch {
  threw = true;
}
truthy('2/30 は例外になる', threw);

// 排盤まで通る
const chart = generateChart(tokyo.birthInfo);
eq('排盤の時辰は入力と一致', chart.birthInfo.hour, tokyo.solar?.branch);
truthy('十二宮が揃う', chart.palaces.length === 12);

// 年齢・五行局などの基本整合
truthy('五行局が入る', chart.wuxingJu >= 2 && chart.wuxingJu <= 6);
truthy('大限が並ぶ', chart.daXians.length >= 10);

if (failures > 0) {
  console.error(`\n[ jp-birth ] ${failures} 件失敗`);
  process.exit(1);
}
console.log('\n[jp-birth] すべて通過');
