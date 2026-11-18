/**
 * 課金クローズドループの無状態実装。
 *
 * 設計:
 *  - 決済前に「order token」を発行し、外部決済ページに `?order=` で渡す。
 *    token は AES-256-GCM 暗号化（生年月日などの個人情報を PSP に読ませない）。
 *  - PSP からの webhook で署名を検証し、order token を復号して
 *    `signUnlock()` の鑑定書 URL を発行する。
 *
 * 前提:
 *  - `JP_WEBHOOK_SECRET`（webhook 署名検証と order token 暗号化の鍵）が必要。
 *  - 注文テーブル（DB）はまだ無い。対帳・返金・管理画面は別フェーズ。
 */

import crypto from 'node:crypto';
import type { JpBirthInput } from './birth';
import type { PaidReportType } from './access';
import { birthKey } from './access';

export interface CheckoutOrder {
  type: PaidReportType;
  input: JpBirthInput;
  /** 有効期限（Unix 秒） */
  exp: number;
}

const ORDER_TTL_SECONDS = 60 * 30;

function secret(): string {
  const s = process.env.JP_WEBHOOK_SECRET;
  if (!s) throw new Error('JP_WEBHOOK_SECRET is not configured');
  return s;
}

/** 暗号鍵（AES-256 用に 32 byte へ派生） */
function orderKey(): Buffer {
  return crypto.createHash('sha256').update(`order:${secret()}`).digest();
}

/** 決済前の order token を発行（AES-256-GCM） */
export function signOrder(
  type: PaidReportType,
  input: JpBirthInput,
  ttlSeconds = ORDER_TTL_SECONDS,
): string {
  const payload = JSON.stringify({
    type,
    input,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  } satisfies CheckoutOrder);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', orderKey(), iv);
  const ct = Buffer.concat([cipher.update(payload, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag(); // 16 bytes
  return Buffer.concat([iv, tag, ct]).toString('base64url');
}

/** webhook で order token を復号・検証。失敗時は null */
export function verifyOrder(token: string | null | undefined): CheckoutOrder | null {
  if (!token) return null;
  try {
    const raw = Buffer.from(token, 'base64url');
    if (raw.length < 12 + 16 + 2) return null;
    const iv = raw.subarray(0, 12);
    const tag = raw.subarray(12, 28);
    const ct = raw.subarray(28);
    const decipher = crypto.createDecipheriv('aes-256-gcm', orderKey(), iv);
    decipher.setAuthTag(tag);
    const json = Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8');
    const data = JSON.parse(json) as Partial<CheckoutOrder>;
    if (data.type !== 'love' && data.type !== 'work') return null;
    if (!data.input || typeof data.exp !== 'number') return null;
    if (data.exp < Math.floor(Date.now() / 1000)) return null;
    return data as CheckoutOrder;
  } catch {
    return null;
  }
}

/** PSP から送られる webhook 署名（`sha256=<hex>` 形式も許容） */
export function verifyWebhookSignature(rawBody: string, signature: string | null | undefined): boolean {
  if (!signature) return false;
  let secretValue: string;
  try {
    secretValue = secret();
  } catch {
    return false;
  }
  const given = signature.startsWith('sha256=') ? signature.slice(7) : signature;
  const expected = crypto.createHmac('sha256', secretValue).update(rawBody).digest('hex');
  const a = Buffer.from(given, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** 外部決済ページ URL に order token を付ける。未設定なら undefined */
export function buildCheckoutUrl(orderToken: string): string | undefined {
  const url = process.env.JP_CHECKOUT_URL;
  if (!url || !url.startsWith('http')) return undefined;
  const u = new URL(url);
  u.searchParams.set('order', orderToken);
  return u.toString();
}

/** order から鑑定書 URL を組み立てる（report ページのパラメータ体系に合わせる） */
export function buildReportUrl(order: CheckoutOrder, unlockToken: string, siteUrl: string): string {
  const input = order.input;
  const qs = new URLSearchParams({
    y: String(input.year),
    m: String(input.month),
    d: String(input.day),
    g: input.gender === 'male' ? 'm' : 'f',
    p: input.prefecture,
    ...(input.unknownTime
      ? { u: '1' }
      : { h: String(input.clockHour), mi: String(input.clockMinute) }),
    type: order.type,
    t: unlockToken,
  });
  const base = siteUrl.replace(/\/$/, '');
  return `${base}/ja/report?${qs.toString()}`;
}

/** order の生年月日キー（`signUnlock` 用） */
export function orderBirthKey(order: CheckoutOrder): string {
  return birthKey(order.input);
}
