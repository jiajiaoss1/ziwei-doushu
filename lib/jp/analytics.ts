/**
 * 日本版の計測イベント。
 *
 * Vercel Analytics（Cookie レス）のカスタムイベントを使う。
 * ローカルや Vercel 以外では送信先が無いため、失敗しても黙って無視する。
 */

import { track } from '@vercel/analytics';

export type JaEventProps = Record<string, string | number | boolean>;

export function trackJa(event: string, props?: JaEventProps): void {
  try {
    track(event, props);
  } catch {
    // 計測の失敗で画面を止めない
  }
}
