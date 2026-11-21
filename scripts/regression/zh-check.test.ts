/**
 * ZH 關係決策自查（輕量版）回歸測試。
 */

import { buildLightCheck, isAdultBirthDate } from '../../lib/zh/check';

let failures = 0;
function ok(name: string, cond: boolean, detail = '') {
  if (!cond) {
    failures += 1;
    console.error(`✗ ${name}${detail ? `: ${detail}` : ''}`);
  } else {
    console.log(`✓ ${name}`);
  }
}

const now = new Date(2026, 10, 21);
ok('1990-01-01 已成年', isAdultBirthDate(1990, 1, 1, now));
ok('2010-01-01 未成年', !isAdultBirthDate(2010, 1, 1, now));
ok('未来日期不算成年', !isAdultBirthDate(2030, 1, 1, now));

const base = {
  year: 1988,
  month: 3,
  day: 3,
  status: 'married' as const,
  tried: ['tarot'] as const,
};

const stay = buildLightCheck({ ...base, decision: 'stay', tried: [...base.tried] });
const talk = buildLightCheck({ ...base, decision: 'talk', tried: [...base.tried] });
const leave = buildLightCheck({ ...base, decision: 'leave', tried: [...base.tried] });
const unknown = buildLightCheck({ ...base, decision: 'unknown', tried: [...base.tried] });

ok('stay 有決策句', stay.decisionLine.includes('要不要繼續'), stay.decisionLine);
ok('talk 有決策句', talk.decisionLine.includes('把話說開'), talk.decisionLine);
ok('leave 有決策句', leave.decisionLine.includes('要不要離開'), leave.decisionLine);
ok('unknown 有決策句', unknown.decisionLine.includes('還不確定'), unknown.decisionLine);
ok('四個決策句不同', new Set([stay.decisionLine, talk.decisionLine, leave.decisionLine, unknown.decisionLine]).size === 4);
ok('模式句有夫妻宮', stay.patternLine.includes('夫妻宮'), stay.patternLine);
ok('摘要含命宮/夫妻/福德', ['命宮', '夫妻宮', '福德宮'].every((x) => stay.chartSummary.includes(x)), stay.chartSummary);
ok('有預設值標註', stay.defaults.includes('未含時辰'), stay.defaults);
ok('沒有保證/命中率', !/保證|命中率|一定/.test(JSON.stringify(stay)), JSON.stringify(stay));
ok('沒有 undefined/NaN', !/undefined|NaN/.test(JSON.stringify(stay)), JSON.stringify(stay));

if (failures > 0) {
  console.error(`\n[ zh-check ] ${failures} 項失敗`);
  process.exit(1);
}
console.log('\n[ zh-check ] すべて通過');
