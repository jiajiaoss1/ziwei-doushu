#!/usr/bin/env node
/**
 * AI 质量 baseline runner（手动 review 用）。
 *
 * 读取 docs/ai/evaluation/golden-cases.jsonl，
 * 从结果页取得短期 AI token，调用生产 API，保存输出到 /tmp/ai-eval/。
 *
 * 注意：会消耗 token/额度；不要进 CI。
 */
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.AI_EVAL_BASE || 'https://shibikan.com';
const OUT = process.env.AI_EVAL_OUT || '/tmp/ai-eval';
const cases = fs
  .readFileSync('docs/ai/evaluation/golden-cases.jsonl', 'utf8')
  .trim()
  .split('\n')
  .map((line) => JSON.parse(line));

fs.mkdirSync(OUT, { recursive: true });

function qs(input) {
  const p = new URLSearchParams({
    y: String(input.year),
    m: String(input.month),
    d: String(input.day),
    g: input.gender === 'male' ? 'm' : 'f',
    p: input.place,
  });
  if (input.unknownTime) p.set('u', '1');
  else {
    p.set('h', String(input.clockHour));
    p.set('mi', String(input.clockMinute));
  }
  return p;
}

function parseSse(text) {
  let out = '';
  for (const line of text.split('\n')) {
    if (!line.startsWith('data: ')) continue;
    const raw = line.slice(6).trim();
    if (raw === '[DONE]') continue;
    try {
      const j = JSON.parse(raw);
      if (typeof j.text === 'string') out += j.text;
      if (j.error) throw new Error(j.message || j.error);
    } catch (e) {
      if (e instanceof Error && e.message) throw e;
    }
  }
  return out;
}

const results = [];
for (const c of cases) {
  const market = c.market === 'JP' ? 'ja' : 'zh';
  const resultPath = market === 'ja' ? '/ja/result' : '/zh/result';
  const url = `${BASE}${resultPath}?${qs(c.input)}`;
  try {
    const html = await (await fetch(url)).text();
    const token = html.match(/eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*/)?.[0];
    if (!token) throw new Error('token not found');

    const body = {
      y: c.input.year,
      m: c.input.month,
      d: c.input.day,
      h: c.input.clockHour,
      mi: c.input.clockMinute,
      u: c.input.unknownTime,
      g: c.input.gender === 'male' ? 'm' : 'f',
      p: c.input.place,
      type: c.focus,
      question: c.question,
      token,
    };
    const res = await fetch(`${BASE}/api/${market}/interpret`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
    const output = parseSse(text);
    const file = path.join(OUT, `${c.case_id}.txt`);
    fs.writeFileSync(file, output, 'utf8');

    const hits = (c.forbidden || []).filter((w) => output.includes(w));
    results.push({ id: c.case_id, status: res.status, chars: output.length, hits, file });
    console.log(`${c.case_id}: ${res.status}, ${output.length} chars, forbidden=${hits.join(',') || 'none'}`);
  } catch (err) {
    results.push({ id: c.case_id, error: String(err) });
    console.error(`${c.case_id}: ERROR ${err}`);
  }
}

fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(results, null, 2));
const bad = results.filter((r) => r.error || (r.hits && r.hits.length)).length;
if (bad) process.exitCode = 1;
