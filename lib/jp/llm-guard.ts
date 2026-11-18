/**
 * AI コストガード（プロセス内）。
 *
 * - グローバル: 1 日 1000 回まで（超過時は呼び出し側でテンプレートに降格）
 * - IP: 1 日 20 回まで（既存の「10 回/10 分」レート制限と併用）
 * - 1 回の出力上限: 1200 tokens に固定
 *
 * 前提: 単一コンテナ。複数インスタンスに増やす場合は Upstash Redis 等へ移す。
 */

/** グローバル 1 日の上限（回） */
export const LLM_DAILY_GLOBAL_LIMIT = 1000;
/** 1 IP あたり 1 日の上限（回） */
export const LLM_DAILY_IP_LIMIT = 20;
/** 1 回あたりの出力上限（tokens） */
export const LLM_MAX_OUTPUT_TOKENS = 1200;

function utcDay(): string {
  return new Date().toISOString().slice(0, 10);
}

// ── グローバル日次カウント ──
let globalDay = '';
let globalCount = 0;

export function takeGlobalSlot(limit = LLM_DAILY_GLOBAL_LIMIT): {
  ok: boolean;
  remaining: number;
} {
  const day = utcDay();
  if (globalDay !== day) {
    globalDay = day;
    globalCount = 0;
  }
  if (globalCount >= limit) return { ok: false, remaining: 0 };
  globalCount += 1;
  return { ok: true, remaining: limit - globalCount };
}

// ── IP 日次カウント ──
const ipDay = new Map<string, { day: string; count: number }>();
const IP_MAP_SOFT_CAP = 10_000;

export function takeIpDailySlot(
  ipHash: string,
  limit = LLM_DAILY_IP_LIMIT,
): { ok: boolean; remaining: number } {
  const day = utcDay();
  // 念のため肥大化を防ぐ（日をまたいだ古いエントリをまとめて捨てる）
  if (ipDay.size > IP_MAP_SOFT_CAP) {
    for (const [k, v] of ipDay) {
      if (v.day !== day) ipDay.delete(k);
    }
  }
  const cur = ipDay.get(ipHash);
  if (!cur || cur.day !== day) {
    ipDay.set(ipHash, { day, count: 1 });
    return { ok: true, remaining: limit - 1 };
  }
  if (cur.count >= limit) return { ok: false, remaining: 0 };
  cur.count += 1;
  return { ok: true, remaining: limit - cur.count };
}

/** テスト用: 状態をリセット */
export function resetGuards(): void {
  globalDay = '';
  globalCount = 0;
  ipDay.clear();
}
