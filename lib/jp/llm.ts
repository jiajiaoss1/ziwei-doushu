/**
 * 任意の OpenAI 互換 API を使った「AI 深掘り」レイヤー。
 *
 * 設計：
 *  - 命盤の事実（facts）だけを材料に渡し、盤面にない星を語らせない
 *  - 断定・医療/法律/投資の助言を禁止するシステムプロンプト
 *  - API キーが無い環境では 501 を返し、テンプレート生成にフォールバック
 */

import type { JpChartFacts } from './facts';
import type { PaidReportType } from './access';

export interface LlmConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export function getLlmConfig(): LlmConfig | null {
  const apiKey = process.env.JP_LLM_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const baseUrl = (
    process.env.JP_LLM_BASE_URL ||
    process.env.OPENAI_BASE_URL ||
    'https://api.openai.com/v1'
  ).replace(/\/+$/, '');
  const model = process.env.JP_LLM_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini';
  return { baseUrl, apiKey, model };
}

export function isLlmEnabled(): boolean {
  return getLlmConfig() !== null;
}

function starLine(star: { ja: { nameJa: string }; brightness?: { label: string }; siHua?: string }): string {
  const b = star.brightness ? `（${star.brightness.label}）` : '';
  const h = star.siHua ? `・化${star.siHua === '权' ? '権' : star.siHua}` : '';
  return `${star.ja.nameJa}${b}${h}`;
}

/** モデルに渡す「盤面の事実」。ここに無い情報は書かせない。 */
export function buildFactsDigest(facts: JpChartFacts): string {
  const palace = (name: string) => facts.palaces.find((p) => p.name === name);
  const p = (name: string) => {
    const pal = palace(name);
    if (!pal) return '';
    const majors = pal.major.length > 0 ? pal.major.map(starLine).join('・') : '空宮';
    return `${pal.nameJa}: ${majors}`;
  };

  const lines = [
    `命宮: ${facts.ming.major.map(starLine).join('・') || '空宮'}`,
    p('夫妻'),
    p('官禄'),
    p('财帛'),
    p('田宅'),
    p('福德'),
    p('迁移'),
    `五行局: ${facts.wuxingJuName} / 命主: ${facts.mingZhu} / 身主: ${facts.shenZhu}`,
    facts.daxian
      ? `大限: ${facts.daxian.startAge}〜${facts.daxian.endAge}歳「${facts.daxian.palaceJa}」（${facts.daxian.decadeTheme}）`
      : '大限: まだ大限に入る前',
    `流年 ${facts.liunian.year} ${facts.liunian.stem}${facts.liunian.branch}年: 中心は${facts.liunian.palaceJa}`,
    ...facts.liunian.landed.map(
      (l) => `流年四化: ${l.star}が${l.palaceJa}で${l.hua === '権' ? '化権' : `化${l.hua}`}`,
    ),
    facts.patterns.length > 0
      ? `格局: ${facts.patterns.map((x) => x.nameJa).join('、')}`
      : '格局: 特筆なし',
    `命宮の三方四正: ${facts.sanfang.map((s) => `${s.palaceName}（${s.stars.join('・') || '空宮'}）`).join(' / ')}`,
  ];
  return lines.filter(Boolean).join('\n');
}

export function buildSystemPrompt(): string {
  return [
    'あなたは紫微斗数（中国の伝統的な占術）の読み手です。',
    '以下のルールを必ず守ってください。',
    '1. 与えられた「盤面の事実」だけを根拠にする。そこに無い星・宮位・四化を作らない。',
    '2. 未来を断定しない。「〜しやすい」「〜でしょう」「〜がテーマです」を使う。',
    '3. 医療・法律・投資・ギャンブルの助言をしない。',
    '4. 不安を煽らない。「必ず」「絶対」「当たる」を使わない。',
    '5. 日本語の丁寧語（です・ます）で、やさしい言葉に言い換える。専門用語は初出時に括弧で短く説明する。',
    '6. 見出しは「**【見出し】**」の形式で、4〜5個。各見出しの本文は2〜4文。',
    '7. 最後に「※占いは自己理解のための参考です。将来を保証するものではありません。」を入れる。',
    '8. 全体で600〜900字程度。',
  ].join('\n');
}

export function buildUserPrompt(
  facts: JpChartFacts,
  options: { type?: PaidReportType | 'general'; question?: string } = {},
): string {
  const type = options.type ?? 'general';
  const focus =
    type === 'love'
      ? '恋愛・パートナーシップ（夫妻宮を中心に、命宮・福德宮も参照）'
      : type === 'work'
        ? '仕事・キャリア・お金（官禄宮・財帛宮を中心に、大限・流年も参照）'
        : '本質・恋愛・仕事・今年のテーマ';

  return [
    '以下は相談者の紫微斗数の命盤です。',
    '',
    buildFactsDigest(facts),
    '',
    `読み解きの焦点: ${focus}`,
    options.question ? `相談者の質問: ${options.question}` : '',
    '',
    'この命盤の事実だけを使って、焦点に沿った読み解きを書いてください。',
  ]
    .filter(Boolean)
    .join('\n');
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * OpenAI 互換の chat/completions をストリーミングで呼び、差分テキストを返す。
 * テストでは baseUrl をモックサーバーに向けられる。
 */
export async function* streamChat(
  config: LlmConfig,
  messages: ChatMessage[],
  options: { temperature?: number; maxTokens?: number; signal?: AbortSignal } = {},
): AsyncGenerator<string> {
  const res = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      stream: true,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 1000,
    }),
    signal: options.signal,
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => '');
    throw new Error(`LLM upstream error: ${res.status} ${detail.slice(0, 200)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const raw of lines) {
      const line = raw.trim();
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (!data || data === '[DONE]') continue;
      try {
        const parsed = JSON.parse(data) as {
          choices?: { delta?: { content?: string } }[];
        };
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {
        // 壊れた行は無視（上流の実装差を吸収）
      }
    }
  }
}
