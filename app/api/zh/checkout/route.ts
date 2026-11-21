/**
 * ZH mock checkout API。
 *
 * POST /api/zh/checkout
 * - 只驗證資料與回傳 mock 價格/訂單；不收款、不建立真實訂單。
 * - 真實 PSP 接入前，不把任何資料寫入日誌。
 */

import { randomUUID } from 'node:crypto';
import { CITIES_ZH } from '@/lib/zh/cities';
import { isValidCheckoutDetails, ZH_PRICE_EARLY } from '@/lib/zh/checkout';

export const dynamic = 'force-dynamic';

const TAIWAN_CITIES = new Set(CITIES_ZH.filter((c) => c.name !== '香港' && c.name !== '澳門').map((c) => c.name));

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  if (!isValidCheckoutDetails(body)) {
    return Response.json({ error: 'invalid_checkout' }, { status: 400 });
  }
  if (!TAIWAN_CITIES.has(body.city)) {
    return Response.json({ error: 'invalid_city' }, { status: 400 });
  }

  return Response.json({
    mock: true,
    paid: false,
    orderId: `mock_${randomUUID()}`,
    amount: ZH_PRICE_EARLY,
    currency: 'TWD',
  });
}
