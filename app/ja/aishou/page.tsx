import type { Metadata } from 'next';
import Link from 'next/link';
import PairFormJa from '@/components/jp/PairFormJa';

export const metadata: Metadata = {
  title: '相性診断｜二人の命盤を重ねて読む',
  description:
    '生年月日から二人の命盤を出し、命宮・夫妻宮・地支の関係・五行・大限から相性を読み解きます。登録不要・無料。',
  alternates: { canonical: '/ja/aishou' },
};

export default function AishouPage() {
  return (
    <main>
      <section className="ja-hero" style={{ padding: '48px 0 26px' }}>
        <div className="ja-wrap-narrow">
          <div className="ja-eyebrow">COMPATIBILITY</div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)' }}>相性診断</h1>
          <p>お二人の命盤を重ねて、惹かれ合うポイントと、すれ違いやすいところを読み解きます。</p>
        </div>
      </section>

      <div className="ja-wrap-narrow" style={{ padding: '0 20px 72px' }}>
        <PairFormJa />

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
          <div style={{ color: '#e3c473', marginBottom: 6, letterSpacing: '0.08em' }}>ご利用にあたって</div>
          <p style={{ margin: 0 }}>
            相性診断は、お相手の生年月日をお預かりします。お相手の同意を得たうえでご利用ください。
            入力内容は診断の表示にのみ使い、サーバーには保存しません。
          </p>
        </div>

        <p className="ja-disclaimer">
          本サービスは紫微斗数を用いた自己理解のためのエンターテインメントです。相性を点数化したり、
          関係の成否を保証したりするものではありません。
        </p>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/ja" className="ja-btn ja-btn-ghost ja-btn-sm">
            トップへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
