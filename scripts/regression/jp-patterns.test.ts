/**
 * 格局（patterns）の日本語表示・並び順・出典の回帰テスト。
 *
 * lib/ziwei/patterns.ts は `import 'server-only'` を持つため、通常の tsx 実行では
 * server-only が throw する。npm test 側で
 *   NODE_OPTIONS=--conditions=react-server tsx ...
 * と実行し、server-only を empty.js に解決させている。
 *
 * 金標準盤：空宮・晚子時（翌日換日）・読年非依存の 3 種を固定で持つ。
 */

import { generateChart } from '../../lib/ziwei/algorithm';
import { detectPatterns, type Pattern } from '../../lib/ziwei/patterns';
import { buildJpFacts } from '../../lib/jp/facts';
import { jpBirthToChartInput } from '../../lib/jp/birth';
import { patternJa } from '../../lib/jp/glossary';

let failures = 0;
function ok(name: string, cond: boolean, detail = '') {
  if (!cond) {
    failures += 1;
    console.error(`✗ ${name}${detail ? `: ${detail}` : ''}`);
  } else {
    console.log(`✓ ${name}`);
  }
}

const RANK: Record<Pattern['level'], number> = {
  excellent: 0,
  good: 1,
  neutral: 2,
  caution: 3,
};

function levelSorted(facts: ReturnType<typeof buildJpFacts>): boolean {
  return facts.patterns.every(
    (p, i) => i === 0 || RANK[facts.patterns[i - 1].level] <= RANK[p.level],
  );
}

const samples = [
  { year: 1990, month: 6, day: 15, hour: 4, gender: 'male' as const, longitude: 139.7 },
  { year: 1988, month: 3, day: 3, hour: 3, gender: 'female' as const },
  { year: 1985, month: 11, day: 2, hour: 6, gender: 'male' as const },
  { year: 1992, month: 8, day: 21, hour: 9, gender: 'female' as const },
  { year: 1979, month: 1, day: 9, hour: 0, gender: 'male' as const },
  { year: 2001, month: 12, day: 30, hour: 11, gender: 'female' as const },
];

let allPatterns = 0;
for (const s of samples) {
  const label = `${s.year}-${s.month}-${s.day}`;
  const chart = generateChart(s);
  const patterns = detectPatterns(chart);
  const facts = buildJpFacts(chart, 2026, patterns);
  allPatterns += patterns.length;

  ok(`${label}: 並び順が強み→注意点`, levelSorted(facts));
  ok(
    `${label}: 格局名の重複がない`,
    new Set(patterns.map((p) => p.name)).size === patterns.length,
  );
  ok(`${label}: 全格局に出典がある`, patterns.every((p) => Boolean(p.source)));
  const untranslated = patterns.filter((p) => !patternJa(p.name)).map((p) => p.name);
  ok(`${label}: 未翻訳の格がない`, untranslated.length === 0, untranslated.join(','));
}
ok('格局の総数が10件以上', allPatterns >= 10, String(allPatterns));

// ── 金標準盤1：空宮の命宮でも破綻しない ──
{
  const chart = generateChart({ year: 1980, month: 1, day: 1, hour: 4, gender: 'male' });
  const ming = chart.palaces.find((p) => p.branch === chart.mingGongBranch);
  ok('金標準盤（空宮）: 命宮に主星がない', (ming?.stars.filter((s) => s.type === 'major').length ?? 0) === 0);

  const patterns = detectPatterns(chart);
  const facts = buildJpFacts(chart, 2026, patterns);
  ok('金標準盤（空宮）: 格局が出る', patterns.length > 0, String(patterns.length));
  ok('金標準盤（空宮）: 未翻訳なし', patterns.every((p) => patternJa(p.name)));
  ok('金標準盤（空宮）: 重複なし', new Set(patterns.map((p) => p.name)).size === patterns.length);
  ok('金標準盤（空宮）: 並び順', levelSorted(facts));
}

// ── 金標準盤2：晚子時（23:30）は翌日換日され、翌日 00:30 と同じ盤・同じ格 ──
{
  const late = jpBirthToChartInput({
    year: 1990, month: 6, day: 15, clockHour: 23, clockMinute: 30,
    unknownTime: false, prefecture: '東京都', gender: 'male',
  });
  const next = jpBirthToChartInput({
    year: 1990, month: 6, day: 16, clockHour: 0, clockMinute: 30,
    unknownTime: false, prefecture: '東京都', gender: 'male',
  });
  ok('金標準盤（晚子時）: 翌日に換日', late.birthInfo.day === 16 && late.birthInfo.hour === 0);
  ok(
    '金標準盤（晚子時）: 翌日同時辰と同じ日付・時辰',
    JSON.stringify([late.birthInfo.year, late.birthInfo.month, late.birthInfo.day, late.birthInfo.hour]) ===
      JSON.stringify([next.birthInfo.year, next.birthInfo.month, next.birthInfo.day, next.birthInfo.hour]),
  );
  const cLate = generateChart(late.birthInfo);
  const cNext = generateChart(next.birthInfo);
  ok('金標準盤（晚子時）: 命宮支が一致', cLate.mingGongBranch === cNext.mingGongBranch);
  ok(
    '金標準盤（晚子時）: 格局が一致',
    JSON.stringify(detectPatterns(cLate).map((p) => p.name)) ===
      JSON.stringify(detectPatterns(cNext).map((p) => p.name)),
  );
}

// ── 金標準盤3：本命格局は読む年（大限・流年）に依存しない ──
{
  const chart = generateChart({ year: 1990, month: 6, day: 15, hour: 4, gender: 'male', longitude: 139.7 });
  const patterns = detectPatterns(chart);
  const y2025 = buildJpFacts(chart, 2025, patterns).patterns.map((p) => p.name);
  const y2027 = buildJpFacts(chart, 2027, patterns).patterns.map((p) => p.name);
  ok('金標準盤（読年）: 格局は読年で変わらない', JSON.stringify(y2025) === JSON.stringify(y2027));
}

// ── 《全書》巻一の格は出典注記付き、宽松版だけの格は付かない ──
const base = generateChart(samples[0]);
const baseFacts = buildJpFacts(base, 2026, detectPatterns(base));
const qiSha = baseFacts.patterns.find((p) => p.name === '七杀朝斗');
ok('《全書》格（七杀朝斗）に出典注記', Boolean(qiSha?.desc.includes('出典')));
const shaPo = baseFacts.patterns.find((p) => p.name === '杀破狼');
ok('宽松版の格（杀破狼）は出典注記なし', !shaPo?.desc.includes('出典'));

// ── テンプレート格局（星名入り）も組み立てられる ──
const temp = patternJa('天机化忌入迁');
ok('模板格の nameJa が正字', temp?.nameJa === '天機化忌入遷', String(temp?.nameJa));
ok('模板格の desc が空でない', Boolean(temp?.desc));

if (failures > 0) {
  console.error(`[ jp-patterns ] ${failures} 件失敗`);
  process.exit(1);
}
console.log('[ jp-patterns ] すべて通過');
