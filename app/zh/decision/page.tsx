import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '關係決策書',
  robots: { index: false, follow: false },
};

export default function DecisionPage() {
  return (
    <main>
      <section className="ja-hero" style={{ padding: '56px 0 24px' }}>
        <div className="ja-wrap-narrow">
          <div className="ja-eyebrow">RELATIONSHIP DECISION</div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)' }}>完整報告準備中</h1>
          <p>
            你已完成初步整理。完整《關係決策書》的付款與報告生成正在準備中，
            目前尚未開放購買，也不會向你收取費用。
          </p>
          <div style={{ marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/zh/check/result" className="ja-btn">回到初步整理</Link>
            <Link href="/zh/check" className="ja-btn ja-btn-ghost">重新自查</Link>
          </div>
          <p className="ja-disclaimer" style={{ marginTop: 28 }}>
            本服務限 18 歲以上。這不是外遇鑑定、法律、醫療或心理治療建議，也不保證結果。
          </p>
        </div>
      </section>
    </main>
  );
}
