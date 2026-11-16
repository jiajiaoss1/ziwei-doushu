/**
 * AI エンドポイントの簡易レートリミット。
 *
 * Netlify 上では Blobs（永続ストア）にカウンタを置き、複数インスタンスでも
 * ある程度共有する。ローカルや Blobs が使えない環境ではプロセス内メモリに
 * フォールバックする（インスタンスごとの制限になる点は許容）。
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

async function getBlobStore(): Promise<
  { get: (k: string, o?: unknown) => Promise<unknown>; setJSON: (k: string, v: unknown) => Promise<unknown> } | null
> {
  try {
    const mod = await import('@netlify/blobs');
    return mod.getStore('ja-rate-limit') as never;
  } catch {
    return null;
  }
}

export async function checkRateLimit(
  key: string,
  limit = 10,
  windowMs = 10 * 60 * 1000,
): Promise<RateLimitResult> {
  const now = Date.now();
  const store = await getBlobStore();

  let bucket: Bucket | null = null;
  if (store) {
    try {
      bucket = (await store.get(key, { type: 'json' })) as Bucket | null;
    } catch {
      bucket = null;
    }
  }

  if (!bucket) bucket = memory.get(key) ?? null;

  if (!bucket || bucket.reset <= now) {
    bucket = { count: 1, reset: now + windowMs };
  } else {
    bucket = { count: bucket.count + 1, reset: bucket.reset };
  }

  memory.set(key, bucket);

  if (store) {
    try {
      await store.setJSON(key, bucket);
    } catch {
      // Blobs が使えなくてもメモリ側で継続
    }
  }

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
