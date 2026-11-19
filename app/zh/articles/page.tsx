import type { Metadata } from 'next';
import Link from 'next/link';
import { ARTICLES } from '@/lib/zh/articles';

export const metadata: Metadata = {
  title: '專欄｜從紫微斗數基礎到感情・工作的讀法',
  description:
    '用白話整理紫微斗數的基礎、與星座占卜的差異、感情與工作的讀法。第一次接觸也能看懂。',
  alternates: { canonical: '/zh/articles' },
};

const CATEGORY_ORDER = ['基礎', '感情', '工作', '相性', '運勢'];

export default function ArticlesPage() {
  const articles = [...ARTICLES].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category),
  );

  return (
    <main>
      <section className="ja-hero" style={{ padding: '56px 0 32px' }}>
        <div className="ja-wrap-narrow">
          <div className="ja-eyebrow">ARTICLES</div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)' }}>專欄</h1>
          <p>從紫微斗數的基礎，到感情與工作的讀法。</p>
        </div>
      </section>

      <div className="ja-wrap-narrow" style={{ padding: '0 20px 72px' }}>
        <div style={{ display: 'grid', gap: 16 }}>
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/zh/articles/${a.slug}`}
              className="ja-card"
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <span className="ja-card-label">{a.category}</span>
              <h2 style={{ fontSize: 19, margin: '6px 0 10px', letterSpacing: '0.04em' }}>
                {a.title}
              </h2>
              <p style={{ fontSize: 13.5, color: '#a49e8f', margin: 0 }}>{a.description}</p>
              <span style={{ display: 'inline-block', marginTop: 12, fontSize: 12, color: '#e3c473' }}>
                閱讀文章 →
              </span>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <Link href="/zh/shindan" className="ja-btn">免費診斷</Link>
        </div>
      </div>
    </main>
  );
}
