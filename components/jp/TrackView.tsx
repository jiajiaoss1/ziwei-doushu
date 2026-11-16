'use client';

import { useEffect } from 'react';
import { trackJa, type JaEventProps } from '@/lib/jp/analytics';

/** ページ表示を1回だけ計測する（サーバーコンポーネントから使う） */
export default function TrackView({ event, props }: { event: string; props?: JaEventProps }) {
  const key = JSON.stringify(props ?? {});
  useEffect(() => {
    trackJa(event, props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, key]);
  return null;
}
