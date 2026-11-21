/**
 * ZH mock checkout（不接真錢）。
 *
 * 只做流程驗證：價格由 server 固定，客戶端不得覆蓋。
 * 真實 PSP 接入前，不收集卡號、不向用戶收費。
 */

import type { CheckInput } from '@/lib/zh/check';

export const ZH_PRICE_EARLY = 680;
export const ZH_PRICE_ORIGINAL = 980;
export const ZH_PAID_STORAGE_KEY = 'shibikan:zh-checkout:v1';

export interface CheckoutDetails extends CheckInput {
  clockHour: number;
  clockMinute: number;
  unknownTime: boolean;
  city: string;
}

export function isValidCheckoutDetails(value: unknown): value is CheckoutDetails {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  if (typeof v.year !== 'number' || typeof v.month !== 'number' || typeof v.day !== 'number') return false;
  if (typeof v.status !== 'string' || typeof v.decision !== 'string') return false;
  if (!Array.isArray(v.tried) || typeof v.city !== 'string') return false;
  if (typeof v.clockHour !== 'number' || v.clockHour < 0 || v.clockHour > 23) return false;
  if (typeof v.clockMinute !== 'number' || v.clockMinute < 0 || v.clockMinute > 59) return false;
  if (typeof v.unknownTime !== 'boolean') return false;
  return true;
}
