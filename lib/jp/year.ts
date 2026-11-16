/**
 * 流年（読む年）の解決。
 *
 * URL の `year` は外部入力なので、整数・範囲内だけを受け付け、
 * それ以外は今年にフォールバックする。
 */

export const FLOW_YEAR_MIN = 1900;
export const FLOW_YEAR_MAX = 2100;

export function resolveFlowYear(
  value: unknown,
  now: number = new Date().getFullYear(),
): number {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(n) || n < FLOW_YEAR_MIN || n > FLOW_YEAR_MAX) {
    return Number.isInteger(now) ? now : new Date().getFullYear();
  }
  return n;
}
