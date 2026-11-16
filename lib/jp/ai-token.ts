/**
 * AI エンドポイント用の短命トークン。
 *
 * 結果ページを開いた時点で「IP ハッシュ + 生年月日キー + 期限」に署名した
 * トークンを発行し、API 側で同じ IP・同じ生年月日かを検証する。
 * これにより、ページを経由しない直接叩き（curl 等）を弾く。
 */

import crypto from 'node:crypto';
import { hashIp } from './rate-limit';

const DEFAULT_TTL_SECONDS = 15 * 60;

function secret(): string {
  return process.env.JP_AI_TOKEN_SECRET || process.env.JP_UNLOCK_SECRET || 'shibikan-dev-secret';
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
}

export interface AiTokenPayload {
  ip: string;
  birthKey: string;
  exp: number;
}

export function signAiToken(
  ip: string,
  birthKey: string,
  ttlSeconds = DEFAULT_TTL_SECONDS,
): string {
  const payload = Buffer.from(
    JSON.stringify({ ip: hashIp(ip), birthKey, exp: Math.floor(Date.now() / 1000) + ttlSeconds }),
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifyAiToken(
  token: string | undefined,
  ip: string,
  birthKey: string,
): boolean {
  if (!token || !token.includes('.')) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as AiTokenPayload;
    if (data.ip !== hashIp(ip)) return false;
    if (data.birthKey !== birthKey) return false;
    if (typeof data.exp !== 'number' || data.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}
