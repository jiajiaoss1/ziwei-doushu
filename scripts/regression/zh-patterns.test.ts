/**
 * 繁體版格局覆蓋・排序・出典回歸測試。
 *
 * lib/ziwei/patterns.ts 有 `server-only`，需以
 *   NODE_OPTIONS=--conditions=react-server tsx ...
 * 執行。
 */

import fs from 'node:fs';
import path from 'node:path';
import { generateChart } from '../../lib/ziwei/algorithm';
import { detectPatterns, type Pattern } from '../../lib/ziwei/patterns';
import { zhBirthToChartInput } from '../../lib/zh/birth';
import { buildZhFacts } from '../../lib/zh/facts';
import { PATTERN_ZH, patternZh } from '../../lib/zh/glossary';

let failures = 0;
function ok(name: string, cond: boolean, detail = '') {
  if (!cond) {
    failures += 1;
    console.error(`✗ ${name}${detail ? `: ${detail}` : ''}`);
  } else {
    console.log(`✓ ${name}`);
  }
}

// ── patterns.ts 的格局名是否都有繁中翻譯 ──
const src = fs.readFileSync(path.join(process.cwd(), 'lib/ziwei/patterns.ts'), 'utf8');
const literal = Array.from(src.matchAll(/name: '([^']+)'/g)).map((m) => m[1]);
const ternary = Array.from(
  src.matchAll(/name:\s*[^,?`$]*\?\s*'([^']+)'\s*:\s*'([^']+)'/g),
).flatMap((m) => [m[1], m[2]]);
const unique = Array.from(new Set([...literal, ...ternary]));
ok('格局名 1 件以上', unique.length > 0, String(unique.length));
for (const name of unique) {
  ok(`格局「${name}」有繁中翻譯`, Boolean(PATTERN_ZH[name]));
}

// ── 真實命盤：格局翻譯・排序・出典 ──
const birth = zhBirthToChartInput({
  year: 1990, month: 6, day: 15, clockHour: 8, clockMinute: 0,
  unknownTime: false, city: '台北市', gender: 'male',
});
const chart = generateChart(birth.birthInfo);
const patterns = detectPatterns(chart);
const facts = buildZhFacts(chart, 2026, patterns);

ok('格局 1 件以上', patterns.length > 0, String(patterns.length));
ok('未翻譯格局為 0', patterns.every((p) => Boolean(patternZh(p.name))));

const RANK: Record<Pattern['level'], number> = { excellent: 0, good: 1, neutral: 2, caution: 3 };
ok(
  '格局排序（強項→留意點）',
  facts.patterns.every((p, i) => i === 0 || RANK[facts.patterns[i - 1].level] <= RANK[p.level]),
);
ok('格局名不重複', new Set(patterns.map((p) => p.name)).size === patterns.length);

const strict = facts.patterns.find((p) => p.name === '七杀朝斗');
ok('《全書》格有出典注記', Boolean(strict?.desc.includes('出典')));

if (failures > 0) {
  console.error(`[ zh-patterns ] ${failures} 件失敗`);
  process.exit(1);
}
console.log('[ zh-patterns ] すべて通過');
