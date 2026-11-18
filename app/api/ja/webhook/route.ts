/**
 * 決済 webhook 受信 API。
 *
 * POST /api/ja/webhook
 * header: x-signature: sha256=<hex>（body の HMAC-SHA256）
 * body:   { order: '<order token>', status: 'paid' }
 *
 * 決済成功なら `signUnlock()` で鑑定書 URL を発行して返す。
 * 注文 DB はまだ無いため、対帳・重複実行の抑止は別フェーズ。
 */

import { signUnlock } from '@/lib/jp/access';
import { buildReportUrl, orderBirthKey, verifyOrder, verifyWebhookSignature } from '@/lib/jp/checkout';

export const dynamic = 'force-dynamic';

interface Body {
  order?: unknown;
  status?: unknown;
}

function siteUrl(req: Request): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env;
  try {
    return new URL(req.url).origin;
  } catch {
    return '';
  }
}

export async function POST(req: Request): Promise<Response> {
  const raw = await req.text();
  const signature = req.headers.get('x-signature');
  if (!verifyWebhookSignature(raw, signature)) {
    return Response.json({ error: 'invalid_signature' }, { status: 401 });
  }

  let body: Body;
  try {
    body = JSON.parse(raw) as Body;
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  if (body.status !== 'paid') {
    return Response.json({ error: 'unsupported_status' }, { status: 400 });
  }

  const order = verifyOrder(typeof body.order === 'string' ? body.order : null);
  if (!order) {
    return Response.json({ error: 'invalid_or_expired_order' }, { status: 400 });
  }

  const token = signUnlock(order.type, orderBirthKey(order));
  const url = buildReportUrl(order, token, siteUrl(req));
  return Response.json({ ok: true, url });
}
