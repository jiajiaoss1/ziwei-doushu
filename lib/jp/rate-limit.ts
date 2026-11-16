/**
 * AI エンドポイントの簡易レートリミット。
 *
 * プロセス内メモリのカウンタで制限する（インスタンス単位）。
 * 強いグローバル制限が必要になったら Upstash Redis などに置き換える。
 */

import crypto from 'node:crypto';

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfter: number;
}

interface Bucket {
  count: number;
  reset: number;
}

const memory = new Map<string, Bucket>();

/** IP をそのまま保存しないための短いハッシュ */
export function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 32);
}

/** 同一オリジン（または設定ドメイン）からの呼び出しだけ許可 */
export function isAllowedOrigin(
  origin: string | null,
  requestUrl: string,
  siteUrl?: string,
): boolean {
  if (!origin) return true; // curl / サーバー間は Origin なし。IP 制限側で抑える
  try {
    const allowed = new Set<string>([new URL(requestUrl).host]);
    if (siteUrl) allowed.add(new URL(siteUrl).host);
    return allowed.has(new URL(origin).host);
  } catch {
    return false;
  }
}

export async function checkRateLimit(
  key: string,
  limit = 10,
  windowMs = 10 * 60 * 1000,
): Promise<RateLimitResult> {
  const now = Date.now();
  const current = memory.get(key) ?? null;
  const bucket: Bucket =
    !current || current.reset <= now
      ? { count: 1, reset: now + windowMs }
      : { count: current.count + 1, reset: current.reset };

  memory.set(key, bucket);

  const remaining = Math.max(0, limit - bucket.count);
  return {
    ok: bucket.count <= limit,
    remaining,
    retryAfter: Math.max(1, Math.ceil((bucket.reset - now) / 1000)),
  };
}

/** テスト用 */
export function resetRateLimitForTests(): void {
  memory.clear();
}
