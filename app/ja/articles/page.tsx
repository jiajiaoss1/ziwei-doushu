import type { Metadata } from 'next';
import Link from 'next/link';
import { ARTICLES } from '@/lib/jp/articles';

export const metadata: Metadata = {
  title: '読みもの｜紫微斗数の基礎から恋愛・仕事の読み方まで',
  description:
    '紫微斗数の基礎、星座占いとの違い、恋愛・仕事の読み方をやさしく解説する読みもの一覧です。初めての方にもわかりやすい言葉でまとめています。',
  alternates: { canonical: '/ja/articles' },
};

const CATEGORY_ORDER = ['基礎', '恋愛', '仕事', '相性', '運気'];

export default function ArticlesPage() {
  const articles = [...ARTICLES].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category),
  );

  return (
    <main>
      <section className="ja-hero" style={{ padding: '56px 0 32px' }}>
        <div className="ja-wrap-narrow">
          <div className="ja-eyebrow">ARTICLES</div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)' }}>読みもの</h1>
          <p>紫微斗数の基礎から、恋愛・仕事の読み方まで。</p>
        </div>
      </section>

      <div className="ja-wrap-narrow" style={{ padding: '0 20px 72px' }}>
        <div style={{ display: 'grid', gap: 16 }}>
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/ja/articles/${a.slug}`}
              className="ja-card"
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <span className="ja-card-label">{a.category}</span>
              <h2 className="ja-serif" style={{ fontSize: 19, margin: '6px 0 10px', letterSpacing: '0.04em' }}>
                {a.title}
              </h2>
              <p style={{ fontSize: 13.5, color: '#a49e8f', margin: 0 }}>{a.description}</p>
              <span style={{ display: 'inline-block', marginTop: 12, fontSize: 12, color: '#e3c473' }}>
                読む →
              </span>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <Link href="/ja/shindan" className="ja-btn">
            無料で診断する
          </Link>
        </div>
      </div>
    </main>
  );
}
