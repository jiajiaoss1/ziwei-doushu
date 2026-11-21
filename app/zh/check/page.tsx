import type { Metadata } from 'next';
import Link from 'next/link';
import SelfCheck from '@/components/zh/SelfCheck';

export const metadata: Metadata = {
  title: '關係決策自查',
  description: '用 5 分鐘整理你現在的關係處境：你在決定什麼、卡在哪裡、下一步先確認什麼。',
  robots: { index: false, follow: false },
  alternates: { canonical: '/zh/check' },
};

export default function CheckPage() {
  return (
    <main>
      <section className="ja-hero" style={{ padding: '44px 0 18px' }}>
        <div className="ja-wrap-narrow">
          <div className="ja-eyebrow">5-MINUTE CHECK</div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)' }}>先整理你現在的關係處境</h1>
          <p>
            不用先想要不要算命。先回答四個問題，看看你真正要決定的是什麼。
          </p>
        </div>
      </section>
      <div className="ja-wrap-narrow" style={{ padding: '0 20px 72px' }}>
        <SelfCheck />
        <div style={{ textAlign: 'center', marginTop: 22 }}>
          <Link href="/zh" className="ja-btn ja-btn-ghost ja-btn-sm">回到首頁</Link>
        </div>
      </div>
    </main>
  );
}
