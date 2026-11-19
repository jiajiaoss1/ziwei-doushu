/**
 * 繁體中文（港台版）AI 深掘 API。
 *
 * 與日文版相同的守門（origin / token / 限流 / 成本護欄），只把 prompt 換成繁中。
 */

import { NextResponse } from 'next/server';
import { generateChart } from '@/lib/ziwei/algorithm';
import { detectPatterns } from '@/lib/ziwei/patterns';
import { isValidZhBirthInput, zhBirthToChartInput, type ZhBirthInput } from '@/lib/zh/birth';
import { buildZhFacts } from '@/lib/zh/facts';
import { buildZhSystemPrompt, buildZhUserPrompt } from '@/lib/zh/llm';
import { getLlmConfig, streamChat } from '@/lib/jp/llm';
import type { PaidReportType } from '@/lib/jp/access';
import { checkRateLimit, hashIp, isAllowedOrigin } from '@/lib/jp/rate-limit';
import { verifyAiToken } from '@/lib/jp/ai-token';
import { birthKey } from '@/lib/jp/access';
import { takeGlobalSlot, takeIpDailySlot, LLM_MAX_OUTPUT_TOKENS } from '@/lib/jp/llm-guard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Body {
  y?: number;
  m?: number;
  d?: number;
  h?: number;
  mi?: number;
  u?: boolean;
  g?: 'm' | 'f';
  p?: string;
  type?: 'general' | PaidReportType;
  question?: string;
  token?: string;
}

export async function POST(req: Request) {
  // 只允許同源瀏覽器呼叫
  if (!isAllowedOrigin(req.headers.get('origin'), req.url, process.env.NEXT_PUBLIC_SITE_URL)) {
    return NextResponse.json({ error: 'forbidden_origin' }, { status: 403 });
  }

  const config = getLlmConfig();
  if (!config) {
    return NextResponse.json(
      {
        error: 'llm_not_configured',
        message: 'AI 解讀目前準備中，請先使用上面的模板解讀。',
      },
      { status: 501 },
    );
  }

  // IP 限制（10 分鐘 10 次）
  const ip =
    req.headers.get('x-nf-client-connection-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';
  const limit = await checkRateLimit(`ip:${hashIp(ip)}`, 10, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'rate_limited', message: '請稍後再試。' },
      {
        status: 429,
        headers: { 'Retry-After': String(limit.retryAfter), 'X-RateLimit-Remaining': '0' },
      },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const input: ZhBirthInput = {
    year: Number(body.y),
    month: Number(body.m),
    day: Number(body.d),
    clockHour: Number(body.h ?? 0),
    clockMinute: Number(body.mi ?? 0),
    unknownTime: Boolean(body.u),
    city: body.p || '台北市',
    gender: body.g === 'm' ? 'male' : 'female',
  };

  if (!isValidZhBirthInput(input)) {
    return NextResponse.json({ error: 'invalid_birth' }, { status: 400 });
  }

  if (!verifyAiToken(body.token, ip, birthKey({ ...input, prefecture: input.city }))) {
    return NextResponse.json({ error: 'invalid_token' }, { status: 401 });
  }

  // 同一 token 的使用次數限制（15 分鐘 5 次）
  const tokenLimit = await checkRateLimit(`token:${hashIp(body.token!)}`, 5, 15 * 60 * 1000);
  if (!tokenLimit.ok) {
    return NextResponse.json(
      { error: 'rate_limited', message: '請稍後再試。' },
      { status: 429, headers: { 'Retry-After': String(tokenLimit.retryAfter) } },
    );
  }

  // 成本護欄：每 IP 每日 20 次 / 全域每日 1000 次
  const ipDaily = takeIpDailySlot(hashIp(ip));
  if (!ipDaily.ok) {
    return NextResponse.json(
      { error: 'ai_daily_limit', message: '今天的 AI 解讀已達上限。請改用模板解讀。' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0' } },
    );
  }
  const globalDaily = takeGlobalSlot();
  if (!globalDaily.ok) {
    return NextResponse.json(
      { error: 'ai_daily_limit', message: '今天的 AI 解讀已達上限。請改用模板解讀。' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0' } },
    );
  }

  const question = (body.question ?? '').slice(0, 200);
  const type: 'general' | PaidReportType =
    body.type === 'love' || body.type === 'work' ? body.type : 'general';

  let facts;
  try {
    const birth = zhBirthToChartInput(input);
    const chart = generateChart(birth.birthInfo);
    facts = buildZhFacts(chart, new Date().getFullYear(), detectPatterns(chart));
  } catch {
    return NextResponse.json({ error: 'chart_failed' }, { status: 422 });
  }

  const messages = [
    { role: 'system' as const, content: buildZhSystemPrompt() },
    { role: 'user' as const, content: buildZhUserPrompt(facts, { type, question }) },
  ];

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const delta of streamChat(config, messages, { maxTokens: LLM_MAX_OUTPUT_TOKENS })) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: delta })}\n\n`));
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'llm_error';
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: 'llm_upstream', message })}\n\n`),
        );
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
