/**
 * 鑑定書・相性の「空宮」「星名の字体」「欠損」回帰テスト。
 *
 * 空宮の命宮でも `には が` のような欠落や、`のあなたは` の空欄を作らない。
 * 画面に出る星曜名に簡体字を残さない。
 */

import { generateChart } from '../../lib/ziwei/algorithm';
import { jpBirthToChartInput, type JpBirthInput } from '../../lib/jp/birth';
import { buildJpFacts, type JpChartFacts } from '../../lib/jp/facts';
import { buildReport } from '../../lib/jp/report';
import { buildFreeReading } from '../../lib/jp/interpret';
import { buildCompat } from '../../lib/jp/compat';

let failures = 0;
function ok(name: string, cond: boolean, detail = '') {
  if (!cond) {
    failures += 1;
    console.error(`✗ ${name}${detail ? `: ${detail}` : ''}`);
  } else {
    console.log(`✓ ${name}`);
  }
}

const SIMPLIFIED = ['虚', '华', '盖', '辅', '钺', '罗', '铃', '马', '鸾', '诰', '寿', '贵', '龙', '凤', '阁', '红', '阴', '阳', '杀', '贞', '机', '贪', '门', '军', '厨', '伤'];

function factsOf(input: JpBirthInput): JpChartFacts {
  return buildJpFacts(generateChart(jpBirthToChartInput(input).birthInfo), 2026);
}

const charts: [string, JpBirthInput][] = [
  ['A', { year: 1990, month: 6, day: 15, clockHour: 8, clockMinute: 0, unknownTime: false, prefecture: '東京都', gender: 'male' }],
  ['B（空宮）', { year: 1988, month: 3, day: 3, clockHour: 14, clockMinute: 0, unknownTime: false, prefecture: '大阪府', gender: 'female' }],
  ['C', { year: 1995, month: 11, day: 20, clockHour: 23, clockMinute: 40, unknownTime: false, prefecture: '北海道', gender: 'female' }],
  ['D（官禄宮が空宮）', { year: 1985, month: 1, day: 1, clockHour: 14, clockMinute: 0, unknownTime: false, prefecture: '東京都', gender: 'female' }],
  ['E（命宮・夫妻宮が複数星）', { year: 1985, month: 1, day: 1, clockHour: 6, clockMinute: 0, unknownTime: false, prefecture: '東京都', gender: 'female' }],
];

for (const [label, input] of charts) {
  const f = factsOf(input);
  const reports = [buildReport(f, 'love'), buildReport(f, 'work')];
  const free = buildFreeReading(f);
  const all = JSON.stringify([reports, free]);

  ok(`${label}: 空欄の星名（にはが）がない`, !all.includes('にはが'));
  ok(`${label}: 空欄の主語（、のあなたは）がない`, !/[、。]のあなたは/.test(all));
  ok(`${label}: 未定義語がない`, !/undefined|NaN|\[object Object\]/.test(all));
  ok(`${label}: 句点の重複がない`, !all.includes('。。'));

  for (const bad of SIMPLIFIED) {
    ok(`${label}: 簡体字「${bad}」が残らない`, !all.includes(bad));
  }

  if (f.ming.isEmpty) {
    const loveBody = reports[0].sections.map((s) => s.body).join('');
    ok(`${label}: 空宮の説明がある`, loveBody.includes('空宮') && loveBody.includes('対宮'));
    ok(`${label}: 空宮でも主語が空にならない`, !/[、。]あなたは、$/.test(loveBody));
  }

  const c = buildCompat(f, f);
  ok(`${label}: 相性に未定義語がない`, !/undefined|NaN/.test(JSON.stringify(c)));
}

ok('陰陽表記が日本語', /^[陽陰][男女]$/.test(factsOf({ year: 1988, month: 3, day: 3, clockHour: 14, clockMinute: 0, unknownTime: false, prefecture: '大阪府', gender: 'female' }).yinYangGender));

if (failures > 0) {
  console.error(`\n[ jp-report ] ${failures} 件失敗`);
  process.exit(1);
}
console.log('\n[jp-report] すべて通過');
