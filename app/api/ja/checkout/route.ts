/**
 * 決済セッション作成 API。
 *
 * POST /api/ja/checkout
 * body: { type: 'love' | 'work', input: JpBirthInput }
 *
 * - β版（JP_BETA_FREE !== 'false'）: 決済不要。鑑定書 URL をそのまま返す。
 * - 有料版: order token を発行し、外部決済ページ URL（`JP_CHECKOUT_URL?order=`）を返す。
 *   未設定なら 503。
 */

import { isValidJpBirthInput, type JpBirthInput } from '@/lib/jp/birth';
import { isBetaFree } from '@/lib/jp/access';
import { buildCheckoutUrl, signOrder } from '@/lib/jp/checkout';

export const dynamic = 'force-dynamic';

interface Body {
  type?: unknown;
  input?: unknown;
}

function reportUrlWithoutToken(input: JpBirthInput, type: 'love' | 'work'): string {
  const qs = new URLSearchParams({
    y: String(input.year),
    m: String(input.month),
    d: String(input.day),
    g: input.gender === 'male' ? 'm' : 'f',
    p: input.prefecture,
    ...(input.unknownTime
      ? { u: '1' }
      : { h: String(input.clockHour), mi: String(input.clockMinute) }),
    type,
  });
  return `/ja/report?${qs.toString()}`;
}

export async function POST(req: Request): Promise<Response> {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const type = body.type === 'love' || body.type === 'work' ? body.type : null;
  if (!type) return Response.json({ error: 'invalid_type' }, { status: 400 });

  const input = body.input as JpBirthInput | undefined;
  if (!input || !isValidJpBirthInput(input)) {
    return Response.json({ error: 'invalid_birth_input' }, { status: 400 });
  }

  if (isBetaFree()) {
    return Response.json({ betaFree: true, url: reportUrlWithoutToken(input, type) });
  }

  let orderToken: string;
  try {
    orderToken = signOrder(type, input);
  } catch {
    return Response.json({ error: 'checkout_not_configured' }, { status: 503 });
  }

  const url = buildCheckoutUrl(orderToken);
  if (!url) {
    return Response.json({ error: 'checkout_not_configured' }, { status: 503 });
  }
  return Response.json({ url });
}
