/**
 * 港台版（繁體中文）計測事件。
 * GA4（NEXT_PUBLIC_GA_ID）未設定時は静かに無視する。
 */

export type ZhEventProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackZh(event: string, props?: ZhEventProps): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  try {
    window.gtag('event', event, props ?? {});
  } catch {
    // 計測失敗不影響畫面
  }
}
