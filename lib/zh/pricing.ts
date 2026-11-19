/**
 * 繁體中文版（港台）定價。
 *
 * 台灣以 NT$ 顯示、香港以 HKD 顯示；兩地共用同一份報告。
 * β 期間全免費，收費後感情・事業兩份報告都需要解鎖。
 */

export type ZhReportType = 'love' | 'work';

export const ZH_PRICES: Record<ZhReportType, { TWD: number; HKD: number }> = {
  love: { TWD: 680, HKD: 160 },
  work: { TWD: 980, HKD: 230 },
};

/** 例：NT$ 980 / HKD 230 */
export function formatZhPrice(type: ZhReportType): string {
  const p = ZH_PRICES[type];
  return `NT$ ${p.TWD.toLocaleString('en-US')} / HKD ${p.HKD}`;
}
