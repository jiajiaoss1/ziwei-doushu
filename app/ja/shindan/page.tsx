import type { Metadata } from 'next';
import Link from 'next/link';
import BirthFormJa from '@/components/jp/BirthFormJa';
import { resolveFlowYear } from '@/lib/jp/year';

export const metadata: Metadata = {
  title: '無料診断｜生年月日を入力するだけ',
  description:
    '生年月日・出生時刻・都道府県を入力するだけで、紫微斗数の命盤と、本質・恋愛・今年のテーマを無料で読み解きます。登録不要。',
  alternates: { canonical: '/ja/shindan' },
};

export default async function ShindanPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string | string[] }>;
}) {
  const sp = await searchParams;
  const rawYear = Array.isArray(sp.year) ? sp.year[0] : sp.year;
  const flowYear = rawYear ? resolveFlowYear(rawYear) : undefined;

  return (
    <main>
      <section className="ja-hero" style={{ padding: '48px 0 28px' }}>
        <div className="ja-wrap-narrow">
          <div className="ja-eyebrow">FREE DIAGNOSIS</div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)' }}>無料診断</h1>
          <p>
            生年月日と出生地を入れるだけで、あなたの命盤を計算します。
            {flowYear ? `（${flowYear}年の運気を読むモード）` : ''}
          </p>
        </div>
      </section>

      <div className="ja-wrap-narrow" style={{ padding: '0 20px 72px' }}>
        <BirthFormJa flowYear={flowYear} />

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
          <div style={{ color: '#e3c473', marginBottom: 6, letterSpacing: '0.08em' }}>
            入力について
          </div>
          <p style={{ margin: 0 }}>
            出生時刻がわからない場合は「出生時刻がわからない」にチェックを入れてください。正午で計算します。
            出生地は真太陽時の補正にのみ使い、都道府県単位で計算します。
          </p>
        </div>

        <p className="ja-disclaimer">
          本サービスは紫微斗数を用いた自己理解のためのエンターテインメントです。将来を保証するものではなく、
          医療・法律・投資などの専門的助言ではありません。
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
