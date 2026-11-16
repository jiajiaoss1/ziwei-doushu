/**
 * 相性ロジックの回帰テスト。
 *
 * ・地支の六合・三合・冲の判定
 * ・五行の相生・相剋
 * ・二人の命盤から6セクションの文章が生成され、未定義語が混ざらない
 */

import { generateChart } from '../../lib/ziwei/algorithm';
import { jpBirthToChartInput, type JpBirthInput } from '../../lib/jp/birth';
import { buildJpFacts, type JpChartFacts } from '../../lib/jp/facts';
import { branchRelation, elementRelation, elementOf, buildCompat } from '../../lib/jp/compat';
import { resolveFlowYear } from '../../lib/jp/year';

let failures = 0;
function ok(name: string, cond: boolean, detail = '') {
  if (!cond) {
    failures += 1;
    console.error(`✗ ${name}${detail ? `: ${detail}` : ''}`);
  } else {
    console.log(`✓ ${name}`);
  }
}

// 地支
ok('子丑は六合', branchRelation(0, 1) === '六合');
ok('寅亥は六合', branchRelation(2, 11) === '六合');
ok('申子は三合', branchRelation(8, 0) === '三合');
ok('子午は冲', branchRelation(0, 6) === '冲');
ok('丑寅はその他', branchRelation(1, 2) === 'その他');

// 五行
ok('水二局は水', elementOf('水二局') === '水');
ok('木と火は相生', elementRelation('木', '火') === '相生');
ok('火と木も相生', elementRelation('火', '木') === '相生');
ok('木と土は相剋', elementRelation('木', '土') === '相剋');
ok('金と金は同じ', elementRelation('金', '金') === '同じ');
ok('不明は不明', elementRelation(undefined, '木') === '不明');

// 流年の解決
ok('2027 はそのまま', resolveFlowYear('2027', 2026) === 2027);
ok('範囲外は今年', resolveFlowYear('1899', 2026) === 2026);
ok('小数は今年', resolveFlowYear('2027.5', 2026) === 2026);
ok('文字列は今年', resolveFlowYear('abc', 2026) === 2026);
ok('未指定は今年', resolveFlowYear(undefined, 2026) === 2026);

// 二人の命盤
function factsOf(input: JpBirthInput): JpChartFacts {
  const birth = jpBirthToChartInput(input);
  return buildJpFacts(generateChart(birth.birthInfo), 2027);
}

const a = factsOf({
  year: 1990,
  month: 6,
  day: 15,
  clockHour: 8,
  clockMinute: 0,
  unknownTime: false,
  prefecture: '東京都',
  gender: 'male',
});
const b = factsOf({
  year: 1992,
  month: 3,
  day: 3,
  clockHour: 14,
  clockMinute: 0,
  unknownTime: false,
  prefecture: '大阪府',
  gender: 'female',
});

const compat = buildCompat(a, b);
ok('6セクションある', compat.sections.length === 6, String(compat.sections.length));
ok('3行サマリー', compat.summary.length === 3);
ok('タイトルがある', compat.title.length > 0);
ok('ラベルがある', compat.label.length > 0);
ok('地支の関係が入る', ['六合', '三合', '冲', 'その他'].includes(compat.branchRelation));
ok('五行の関係が入る', ['相生', '相剋', '同じ', '不明'].includes(compat.elementRelation));

const all = JSON.stringify(compat);
for (const bad of ['undefined', 'NaN', '[object Object]']) {
  ok(`未定義語 ${bad} が混ざらない`, !all.includes(bad));
}
ok('本文が800字以上', compat.sections.reduce((n, s) => n + s.body.length, 0) > 800);

// 同じ二人なら同じ結果（決定論）
const compat2 = buildCompat(a, b);
ok('同じ入力で同じ結果', JSON.stringify(compat.summary) === JSON.stringify(compat2.summary));

if (failures > 0) {
  console.error(`\n[ jp-compat ] ${failures} 件失敗`);
  process.exit(1);
}
console.log('\n[jp-compat] すべて通過');
