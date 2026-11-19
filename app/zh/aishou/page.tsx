import type { Metadata } from 'next';
import Link from 'next/link';
import PairFormZh from '@/components/zh/PairFormZh';

export const metadata: Metadata = {
  title: '相性診斷｜把兩張命盤疊起來讀',
  description:
    '輸入兩人的出生年月日，排出命盤，從命宮・夫妻宮・地支關係・五行・大限解讀相性。免註冊・免費。',
  alternates: { canonical: '/zh/aishou' },
};

export default function AishouPage() {
  return (
    <main>
      <section className="ja-hero" style={{ padding: '48px 0 26px' }}>
        <div className="ja-wrap-narrow">
          <div className="ja-eyebrow">COMPATIBILITY</div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)' }}>相性診斷</h1>
          <p>把兩張命盤疊在一起，解讀互相吸引的地方，以及容易錯身的地方。</p>
        </div>
      </section>

      <div className="ja-wrap-narrow" style={{ padding: '0 20px 72px' }}>
        <PairFormZh />

        <div
          style={{
            marginTop: 24,
            padding: '16px 18px',
            border: '1px solid rgba(201,165,74,0.18)',
            borderRadius: 12,
            fontSize: 12.5,
            color: '#a49e8f',
            lineHeight: 1.9,
          }}
        >
          <div style={{ color: '#e3c473', marginBottom: 6, letterSpacing: '0.08em' }}>使用說明</div>
          <p style={{ margin: 0 }}>
            相性診斷會使用對方的出生年月日。請在取得對方同意後使用。
            輸入內容只用在顯示診斷結果，不會儲存在伺服器。
          </p>
        </div>

        <p className="ja-disclaimer">
          本服務是以紫微斗數進行自我理解的娛樂性內容。相性不會打分數，
          也不保證關係的成敗。
        </p>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/zh" className="ja-btn ja-btn-ghost ja-btn-sm">回到首頁</Link>
        </div>
      </div>
    </main>
  );
}
