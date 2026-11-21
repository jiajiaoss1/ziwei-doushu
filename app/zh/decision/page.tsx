import type { Metadata } from 'next';
import MockCheckout from '@/components/zh/MockCheckout';

export const metadata: Metadata = {
  title: '關係決策書',
  robots: { index: false, follow: false },
};

export default function DecisionPage() {
  return (
    <main>
      <section className="ja-hero" style={{ padding: '44px 0 18px' }}>
        <div className="ja-wrap-narrow">
          <div className="ja-eyebrow">TEST MODE</div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)' }}>取得完整關係決策書</h1>
          <p>
            補上時辰與縣市。目前為測試模式，不會向你收費，也不會產生真實訂單。
          </p>
        </div>
      </section>
      <div className="ja-wrap-narrow" style={{ padding: '0 20px 72px' }}>
        <MockCheckout />
        <p className="ja-disclaimer">
          本服務限 18 歲以上。這不是外遇鑑定、法律、醫療或心理治療建議，也不保證結果。
        </p>
      </div>
    </main>
  );
}
