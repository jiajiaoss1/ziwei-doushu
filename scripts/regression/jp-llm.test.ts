/**
 * AI 深掘りレイヤーのテスト。
 *
 * ・APIキー未設定なら無効（501 フォールバック）と判定される
 * ・プロンプトに盤面の事実だけが入り、未定義語が混ざらない
 * ・OpenAI 互換の SSE を正しく読み取れる／上流エラーを投げる
 */

import http from 'node:http';
import { generateChart } from '../../lib/ziwei/algorithm';
import { jpBirthToChartInput } from '../../lib/jp/birth';
import { buildJpFacts } from '../../lib/jp/facts';
import {
  buildFactsDigest,
  buildSystemPrompt,
  buildUserPrompt,
  getLlmConfig,
  streamChat,
  type LlmConfig,
} from '../../lib/jp/llm';

let failures = 0;

async function main() {
function ok(name: string, cond: boolean, detail = '') {
  if (!cond) {
    failures += 1;
    console.error(`✗ ${name}${detail ? `: ${detail}` : ''}`);
  } else {
    console.log(`✓ ${name}`);
  }
}

// APIキー未設定 → 無効
delete process.env.JP_LLM_API_KEY;
delete process.env.OPENAI_API_KEY;
ok('APIキー未設定なら無効', getLlmConfig() === null);

// 事実の収集
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

const digest = buildFactsDigest(facts);
ok('ダイジェストに命宮が入る', digest.includes('命宮'));
ok('ダイジェストに大限が入る', digest.includes('大限'));
ok('ダイジェストに流年が入る', digest.includes('流年'));
ok('ダイジェストに未定義語がない', !/undefined|NaN|\[object/.test(digest));

const system = buildSystemPrompt();
ok('システムプロンプトが断定を禁止', system.includes('断定しない'));
ok('システムプロンプトが医療・投資を禁止', system.includes('医療・法律・投資'));
ok('システムプロンプトが見出し形式を指定', system.includes('**【見出し】**'));

const user = buildUserPrompt(facts, { type: 'work', question: '転職のタイミングは？' });
ok('ユーザープロンプトに質問が入る', user.includes('転職のタイミングは？'));
ok('ユーザープロンプトに官禄宮が入る', user.includes('官禄宮'));

// モック SSE サーバー
const sse = [
  'data: {"choices":[{"delta":{"content":"命宮には"}}]}\n\n',
  'data: {"choices":[{"delta":{"content":"七殺があります。"}}]}\n\n',
  'data: [DONE]\n\n',
];
const server = http.createServer((req, res) => {
  if (req.url?.startsWith('/fail')) {
    res.writeHead(500);
    res.end('boom');
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/event-stream' });
  for (const chunk of sse) res.write(chunk);
  res.end();
});

await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
const port = typeof address === 'object' && address ? address.port : 0;
const config: LlmConfig = {
  baseUrl: `http://127.0.0.1:${port}`,
  apiKey: 'test',
  model: 'test-model',
};

let text = '';
for await (const delta of streamChat(config, [{ role: 'user', content: 'test' }])) {
  text += delta;
}
ok('SSE の差分を連結できる', text === '命宮には七殺があります。', text);

let threw = false;
try {
  for await (const _ of streamChat(
    { ...config, baseUrl: `http://127.0.0.1:${port}/fail` },
    [{ role: 'user', content: 'test' }],
  )) {
    // noop
  }
} catch {
  threw = true;
}
ok('上流エラーで例外', threw);

server.close();

if (failures > 0) {
  console.error(`\n[ jp-llm ] ${failures} 件失敗`);
  process.exit(1);
}
console.log('\n[jp-llm] すべて通過');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
