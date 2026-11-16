import { NextResponse } from 'next/server';
import { generateChart } from '@/lib/ziwei/algorithm';
import { detectPatterns } from '@/lib/ziwei/patterns';
import { isValidJpBirthInput, jpBirthToChartInput, type JpBirthInput } from '@/lib/jp/birth';
import { buildJpFacts } from '@/lib/jp/facts';
import { buildSystemPrompt, buildUserPrompt, getLlmConfig, streamChat } from '@/lib/jp/llm';
import type { PaidReportType } from '@/lib/jp/access';
import { checkRateLimit, hashIp, isAllowedOrigin } from '@/lib/jp/rate-limit';
import { verifyAiToken } from '@/lib/jp/ai-token';
import { birthKey } from '@/lib/jp/access';

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
  // 同一オリジン以外のブラウザ呼び出しを拒否
  if (!isAllowedOrigin(req.headers.get('origin'), req.url, process.env.NEXT_PUBLIC_SITE_URL)) {
    return NextResponse.json({ error: 'forbidden_origin' }, { status: 403 });
  }

  const config = getLlmConfig();
  if (!config) {
    return NextResponse.json(
      {
        error: 'llm_not_configured',
        message:
          'AI解説は現在準備中です。テンプレートの読み解きをご利用ください。',
      },
      { status: 501 },
    );
  }

  // IP 単位の制限（10 分に 10 回）
  const ip =
    req.headers.get('x-nf-client-connection-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';
  const limit = await checkRateLimit(`ip:${hashIp(ip)}`, 10, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'rate_limited', message: 'しばらく時間をおいてからお試しください。' },
      {
        status: 429,
        headers: {
          'Retry-After': String(limit.retryAfter),
          'X-RateLimit-Remaining': '0',
        },
      },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const input: JpBirthInput = {
    year: Number(body.y),
    month: Number(body.m),
    day: Number(body.d),
    clockHour: Number(body.h ?? 0),
    clockMinute: Number(body.mi ?? 0),
    unknownTime: Boolean(body.u),
    prefecture: body.p || '東京都',
    gender: body.g === 'm' ? 'male' : 'female',
  };

  if (!isValidJpBirthInput(input)) {
    return NextResponse.json({ error: 'invalid_birth' }, { status: 400 });
  }

  if (!verifyAiToken(body.token, ip, birthKey(input))) {
    return NextResponse.json({ error: 'invalid_token' }, { status: 401 });
  }

  // 同じトークンの使い回しも制限（15 分に 5 回）
  const tokenLimit = await checkRateLimit(`token:${hashIp(body.token!)}`, 5, 15 * 60 * 1000);
  if (!tokenLimit.ok) {
    return NextResponse.json(
      { error: 'rate_limited', message: 'しばらく時間をおいてからお試しください。' },
      { status: 429, headers: { 'Retry-After': String(tokenLimit.retryAfter) } },
    );
  }

  const question = (body.question ?? '').slice(0, 200);
  const type: 'general' | PaidReportType =
    body.type === 'love' || body.type === 'work' ? body.type : 'general';

  let facts;
  try {
    const birth = jpBirthToChartInput(input);
    const chart = generateChart(birth.birthInfo);
    facts = buildJpFacts(chart, new Date().getFullYear(), detectPatterns(chart));
  } catch {
    return NextResponse.json({ error: 'chart_failed' }, { status: 422 });
  }

  const messages = [
    { role: 'system' as const, content: buildSystemPrompt() },
    { role: 'user' as const, content: buildUserPrompt(facts, { type, question }) },
  ];

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const delta of streamChat(config, messages, { maxTokens: 1200 })) {
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

export async function GET() {
  return NextResponse.json({ error: 'method_not_allowed' }, { status: 405 });
}
