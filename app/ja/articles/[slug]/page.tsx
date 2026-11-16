import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ARTICLES, getArticle } from '@/lib/jp/articles';
import { SITE_URL } from '@/lib/site';

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/ja/articles/${article.slug}` },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.description,
      url: `${SITE_URL}/ja/articles/${article.slug}`,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      images: [{ url: '/ja/ogp.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: ['/ja/ogp.png'],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = ARTICLES.filter((a) => a.slug !== article.slug);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: 'ja',
    author: { '@type': 'Organization', name: '紫微館' },
    publisher: { '@type': 'Organization', name: '紫微館', url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/ja/articles/${article.slug}`,
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'トップ', item: `${SITE_URL}/ja` },
      { '@type': 'ListItem', position: 2, name: '読みもの', item: `${SITE_URL}/ja/articles` },
      { '@type': 'ListItem', position: 3, name: article.title, item: `${SITE_URL}/ja/articles/${article.slug}` },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="ja-wrap-narrow" style={{ padding: '44px 20px 72px' }}>
        <nav style={{ fontSize: 11.5, color: '#8a8577', marginBottom: 18 }}>
          <Link href="/ja" style={{ color: '#8a8577', textDecoration: 'none' }}>
            トップ
          </Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <Link href="/ja/articles" style={{ color: '#8a8577', textDecoration: 'none' }}>
            読みもの
          </Link>
        </nav>

        <h1 className="ja-serif" style={{ fontSize: 'clamp(24px, 3.6vw, 32px)', lineHeight: 1.6, letterSpacing: '0.04em', margin: '0 0 12px' }}>
          {article.title}
        </h1>
        <div style={{ fontSize: 11.5, color: '#8a8577', marginBottom: 26 }}>
          公開：{article.publishedAt} ・ 更新：{article.updatedAt}
        </div>

        <p style={{ fontSize: 14.5, color: '#d9d3c5', lineHeight: 2.05, marginBottom: 30 }}>
          {article.lede}
        </p>

        <div className="ja-reading">
          {article.sections.map((s) => (
            <article key={s.heading} className="ja-article">
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </article>
          ))}

          {article.faq && article.faq.length > 0 && (
            <article className="ja-article">
              <h2>よくある質問</h2>
              {article.faq.map((f) => (
                <div key={f.q} style={{ marginBottom: 14 }}>
                  <p style={{ color: '#e3c473', marginBottom: 4 }}>Q. {f.q}</p>
                  <p style={{ margin: 0 }}>A. {f.a}</p>
                </div>
              ))}
            </article>
          )}
        </div>

        <div
          style={{
            marginTop: 30,
            padding: '22px 20px',
            textAlign: 'center',
            border: '1px solid rgba(201,165,74,0.3)',
            borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(201,165,74,0.1), rgba(17,26,51,0.6))',
          }}
        >
          <p style={{ fontSize: 14, color: '#e6dfd0', margin: '0 0 14px' }}>
            あなたの命盤も、無料で見てみませんか。
          </p>
          <Link href="/ja/shindan" className="ja-btn ja-btn-sm">
            無料で診断する
          </Link>
        </div>

        <div style={{ marginTop: 36 }}>
          <h2 className="ja-serif" style={{ fontSize: 16, letterSpacing: '0.1em', marginBottom: 12 }}>
            あわせて読みたい
          </h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {related.map((a) => (
              <Link
                key={a.slug}
                href={`/ja/articles/${a.slug}`}
                style={{ color: '#a49e8f', textDecoration: 'none', fontSize: 13.5 }}
              >
                ・{a.title}
              </Link>
            ))}
          </div>
        </div>

        <p className="ja-disclaimer">
          本記事は、紫微斗数を用いた自己理解のための情報提供です。将来の結果を保証するものではなく、
          医療・法律・投資などの専門的助言ではありません。
        </p>
      </div>
    </main>
  );
}
