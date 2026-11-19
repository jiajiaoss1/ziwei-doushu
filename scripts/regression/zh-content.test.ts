/**
 * 繁體中文（港台版）內容回歸測試。
 *
 * - 詞庫缺漏（14 主星 / 12 宮 / 四化 / 明暗 / 格局）
 * - 簡體字混入
 * - 命盤 → 解讀 / 報告 / 相性 是否會產生異常（undefined / NaN / 空句）
 */

import { generateChart } from '../../lib/ziwei/algorithm';
import { zhBirthToChartInput } from '../../lib/zh/birth';
import { buildZhFacts } from '../../lib/zh/facts';
import { buildFreeReading } from '../../lib/zh/interpret';
import { buildReport } from '../../lib/zh/report';
import { buildCompat } from '../../lib/zh/compat';
import {
  BRIGHTNESS_ZH,
  PALACE_ZH,
  PATTERN_ZH,
  SIHUA_ZH,
  STAR_ZH,
  palaceZh,
  patternZh,
  starZh,
} from '../../lib/zh/glossary';

let failures = 0;
function ok(name: string, cond: boolean, detail = '') {
  if (!cond) {
    failures += 1;
    console.error(`✗ ${name}${detail ? `: ${detail}` : ''}`);
  } else {
    console.log(`✓ ${name}`);
  }
}

// ── 詞庫完整性 ──
const FOURTEEN = ['紫微', '天機', '太陽', '武曲', '天同', '廉貞', '天府', '太陰', '貪狼', '巨門', '天相', '天梁', '七殺', '破軍'];
for (const s of FOURTEEN) {
  ok(`主星 ${s} 有資料`, Boolean(STAR_ZH[s]?.essence));
}
ok('12 宮齊全', Object.keys(PALACE_ZH).length === 12, String(Object.keys(PALACE_ZH).length));
ok('四化齊全', Object.keys(SIHUA_ZH).length === 4);
ok('明暗 8 檔', Object.keys(BRIGHTNESS_ZH).length === 8, String(Object.keys(BRIGHTNESS_ZH).length));
ok('格局 65 條以上', Object.keys(PATTERN_ZH).length >= 65, String(Object.keys(PATTERN_ZH).length));

// ── 簡體 → 繁體 ──
ok('七杀 → 七殺', starZh('七杀').nameZh === '七殺', starZh('七杀').nameZh);
ok('天机 → 天機', starZh('天机').nameZh === '天機');
ok('廉贞 → 廉貞', starZh('廉贞').nameZh === '廉貞');
ok('命宫 → 命宮', palaceZh('命宫').nameZh === '命宮');
ok('官禄 → 官祿', palaceZh('官禄').nameZh === '官祿宮');
ok('七杀朝斗 格局', patternZh('七杀朝斗')?.nameZh === '七殺朝斗', patternZh('七杀朝斗')?.nameZh);
ok('模板格：天机化忌入迁', Boolean(patternZh('天机化忌入迁')?.desc));

// ── 命盤 → 解讀 / 報告 / 相性 ──
const birth = zhBirthToChartInput({
  year: 1990, month: 6, day: 15, clockHour: 8, clockMinute: 0,
  unknownTime: false, city: '台北市', gender: 'male',
});
const chart = generateChart(birth.birthInfo);
const facts = buildZhFacts(chart, 2026, []);
const reading = buildFreeReading(facts);
const love = buildReport(facts, 'love');
const work = buildReport(facts, 'work');
const compat = buildCompat(facts, facts);
const all = JSON.stringify([reading, love, work, compat]);

ok('免費解讀有標題', Boolean(reading.headline));
ok('免費解讀 6 段以上', reading.sections.length >= 6, String(reading.sections.length));
ok('感情報告 6 段', love.sections.length === 6);
ok('事業報告 6 段', work.sections.length === 6);
ok('無 undefined / NaN', !/undefined|NaN|\[object Object\]/.test(all));
ok('無連續句號', !all.includes('。。'));

const SIMPLIFIED = ['禄', '权', '会', '强', '时', '门', '马', '见', '长', '发', '这', '东', '车', '电', '话', '变', '边', '说', '对', '应'];
for (const bad of SIMPLIFIED) {
  ok(`無簡體字「${bad}」`, !all.includes(bad));
}

if (failures > 0) {
  console.error(`[ zh-content ] ${failures} 件失敗`);
  process.exit(1);
}
console.log('[ zh-content ] すべて通過');
