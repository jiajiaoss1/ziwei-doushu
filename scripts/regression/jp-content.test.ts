/**
 * 日本語コンテンツの回帰テスト。
 *
 * ・14主星 / 12宮 / 格局の日本語辞書が欠けていないこと
 * ・簡体字の星名が日本語の正字に寄ること
 * ・命盤 → 文章生成まで通り、未定義語が混ざらないこと
 */

import fs from 'node:fs';
import path from 'node:path';
import { generateChart } from '../../lib/ziwei/algorithm';
import { jpBirthToChartInput } from '../../lib/jp/birth';
import { buildJpFacts } from '../../lib/jp/facts';
import { buildFreeReading } from '../../lib/jp/interpret';
import { buildReport } from '../../lib/jp/report';
import { ARTICLES } from '../../lib/jp/articles';
import { parse as parseAiReading } from '../../components/jp/AiReading';
import {
  BRIGHTNESS_JA,
  PALACE_JA,
  PATTERN_JA,
  STAR_JA,
  brightnessJa,
  palaceJa,
  starJa,
} from '../../lib/jp/glossary';

let failures = 0;

function ok(name: string, cond: boolean, detail = '') {
  if (!cond) {
    failures += 1;
    console.error(`✗ ${name}${detail ? `: ${detail}` : ''}`);
  } else {
    console.log(`✓ ${name}`);
  }
}

// 14 主星
const FOURTEEN = ['紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'];
ok('主星辞書が14件', Object.keys(STAR_JA).length === 14, String(Object.keys(STAR_JA).length));
for (const name of FOURTEEN) {
  const ja = starJa(name);
  ok(
    `星 ${name} の日本語が揃う`,
    Boolean(ja.nameJa && ja.kana && ja.essence && ja.love && ja.work && ja.money),
  );
}
ok('七杀 → 七殺', starJa('七杀').nameJa === '七殺');
ok('天机 → 天機', starJa('天机').nameJa === '天機');

// 12 宮（エンジンの表記）
const PALACES = ['命宫', '兄弟', '夫妻', '子女', '财帛', '疾厄', '迁移', '仆役', '官禄', '田宅', '福德', '父母'];
ok('宮位辞書が12件', Object.keys(PALACE_JA).length === 12, String(Object.keys(PALACE_JA).length));
for (const p of PALACES) {
  const ja = palaceJa(p);
  ok(`宮 ${p} の日本語が揃う`, Boolean(ja.nameJa && ja.kana && ja.theme));
}
ok('命宫 → 命宮', palaceJa('命宫').nameJa === '命宮');
ok('迁移 → 遷移宮', palaceJa('迁移').nameJa === '遷移宮');

// 明暗（簡体字の庙を日本語の廟へ）
ok('庙 → 廟', brightnessJa('庙')?.label === '廟');
ok('明暗が8段階', Object.keys(BRIGHTNESS_JA).length === 8);

// 格局：patterns.ts の全パターンに日本語説明があるか
const patternsSrc = fs.readFileSync(
  path.join(process.cwd(), 'lib/ziwei/patterns.ts'),
  'utf8',
);
const patternNames = Array.from(patternsSrc.matchAll(/name: '([^']+)'/g)).map((m) => m[1]);
const uniquePatterns = Array.from(new Set(patternNames));
ok('格局が1件以上ある', uniquePatterns.length > 0, String(uniquePatterns.length));
for (const name of uniquePatterns) {
  ok(`格局 ${name} の日本語説明がある`, Boolean(PATTERN_JA[name]));
}

// 命盤 → 文章生成
const birth = jpBirthToChartInput({
  year: 1990,
  month: 6,
  day: 15,
  clockHour: 8,
  clockMinute: 0,
  unknownTime: false,
  prefecture: '東京都',
  gender: 'male',
});
const chart = generateChart(birth.birthInfo);
const facts = buildJpFacts(chart, 2026);
const reading = buildFreeReading(facts);
const love = buildReport(facts, 'love');
const work = buildReport(facts, 'work');

ok('無料診断のセクションが6件以上', reading.sections.length >= 6, String(reading.sections.length));
ok('ハイライトが3件', reading.highlights.length === 3);
ok('恋愛鑑定書が6セクション', love.sections.length === 6);
ok('事業鑑定書が6セクション', work.sections.length === 6);
ok('恋愛鑑定書の本文が800字以上', love.sections.reduce((n, s) => n + s.body.length, 0) > 800);
ok('事業鑑定書の本文が600字以上', work.sections.reduce((n, s) => n + s.body.length, 0) > 600);
ok('3行サマリーが3件', love.summary.length === 3 && work.summary.length === 3);

const all = JSON.stringify({ reading, love, work });
for (const bad of ['undefined', 'NaN', '[object Object]']) {
  ok(`未定義語 ${bad} が混ざらない`, !all.includes(bad));
}

// 主星の日本語説明が空にならない
for (const palace of facts.palaces) {
  for (const star of palace.major) {
    ok(`主星 ${star.name} の説明が空でない`, Boolean(star.ja.essence));
  }
}

// SEO 記事
ok('記事が6本ある', ARTICLES.length === 6, String(ARTICLES.length));
ok('記事の slug が重複しない', new Set(ARTICLES.map((a) => a.slug)).size === ARTICLES.length);
for (const a of ARTICLES) {
  ok(`記事 ${a.slug} に見出しが4つ以上`, a.sections.length >= 4);
  ok(`記事 ${a.slug} の description が60字以上`, a.description.length >= 60);
  ok(`記事 ${a.slug} の lede が100字以上`, a.lede.length >= 100);
  ok(
    `記事 ${a.slug} の本文が空でない`,
    a.sections.every((sec) => sec.heading && sec.paragraphs.length > 0 && sec.paragraphs.every(Boolean)),
  );
}

// AI 解説の見出し分割（同一行に見出しが来ても壊れない）
const segs = parseAiReading('**【命格】**\n本文です。**【仕事】**\n仕事の本文です。');
ok('AI見出しが2つに分かれる', segs.length === 2 && segs[0].heading === '命格' && segs[1].heading === '仕事');
ok('AI本文に見出し記号が残らない', !segs.some((x) => x.body.includes('【')));

if (failures > 0) {
  console.error(`\n[ jp-content ] ${failures} 件失敗`);
  process.exit(1);
}
console.log('\n[jp-content] すべて通過');
