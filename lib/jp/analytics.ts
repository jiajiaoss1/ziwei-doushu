/**
 * 日本版の計測イベント。
 *
 * GA4（NEXT_PUBLIC_GA_ID）にカスタムイベントを送る。
 * 未設定・ローカル・ブロッカー環境では静かに無視する。
 */

export type JaEventProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackJa(event: string, props?: JaEventProps): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  try {
    window.gtag('event', event, props ?? {});
  } catch {
    // 計測の失敗で画面を止めない
  }
}
