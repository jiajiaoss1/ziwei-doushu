/**
 * 有料レポートのアクセス制御（β版は全公開）。
 *
 * 正式版では、決済事業者（Stripe / Paddle / Lemon Squeezy など）の
 * 決済完了後に `signUnlock()` でトークンを発行し、レポートURLに `?t=` で付与する。
 * トークンは「レポート種別 + 生年月日等 + 有効期限」に紐づく HMAC。
 */

import crypto from 'node:crypto';
import type { JpBirthInput } from './birth';

export type PaidReportType = 'love' | 'work';

export const REPORT_PRICES: Record<PaidReportType, number> = {
  love: 2980,
  work: 4980,
};

/** β版として無料公開するか（既定: true） */
export function isBetaFree(): boolean {
  return process.env.JP_BETA_FREE !== 'false';
}

/** 外部決済ページ（MoR 等）の URL。未設定なら「準備中」表示。 */
export function getCheckoutUrl(): string | undefined {
  const url = process.env.JP_CHECKOUT_URL;
  return url && url.startsWith('http') ? url : undefined;
}

function secret(): string {
  return process.env.JP_UNLOCK_SECRET || 'shibikan-dev-secret-change-me';
}

/** 生年月日等から、レポートに紐づくキーを作る */
export function birthKey(input: JpBirthInput): string {
  const h = input.unknownTime ? 'u' : `${input.clockHour}:${input.clockMinute}`;
  return [input.year, input.month, input.day, h, input.gender, input.prefecture].join('|');
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
}

/** 決済完了後に発行するアンロックトークン */
export function signUnlock(type: PaidReportType, key: string, ttlSeconds = 60 * 60 * 24 * 30): string {
  const payload = Buffer.from(
    JSON.stringify({ type, key, exp: Math.floor(Date.now() / 1000) + ttlSeconds }),
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifyUnlock(token: string | undefined, type: PaidReportType, key: string): boolean {
  if (!token || !token.includes('.')) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      type?: string;
      key?: string;
      exp?: number;
    };
    if (data.type !== type || data.key !== key) return false;
    if (typeof data.exp !== 'number' || data.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}

export interface ReportAccess {
  /** 全文を表示してよいか */
  full: boolean;
  /** β版の無料公開か */
  beta: boolean;
  /** 有料本文の価格 */
  price: number;
}

export function getReportAccess(
  type: PaidReportType,
  key: string,
  token: string | undefined,
): ReportAccess {
  const beta = isBetaFree();
  // 恋愛レポートは無料、事業レポートのみ有料（β期間中は無料）
  if (type === 'love') return { full: true, beta, price: 0 };
  if (beta) return { full: true, beta, price: REPORT_PRICES[type] };
  return { full: verifyUnlock(token, type, key), beta, price: REPORT_PRICES[type] };
}
