import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ARTICLES, getArticle } from '@/lib/zh/articles';
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
    alternates: { canonical: `/zh/articles/${article.slug}` },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.description,
      url: `${SITE_URL}/zh/articles/${article.slug}`,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      locale: 'zh_TW',
      images: [{ url: '/zh/ogp.png', width: 1200, height: 630, alt: '紫微館' }],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: 'zh-Hant',
    author: { '@type': 'Organization', name: '紫微館' },
    publisher: { '@type': 'Organization', name: '紫微館', url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/zh/articles/${article.slug}`,
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: `${SITE_URL}/zh` },
      { '@type': 'ListItem', position: 2, name: '專欄', item: `${SITE_URL}/zh/articles` },
      { '@type': 'ListItem', position: 3, name: article.title, item: `${SITE_URL}/zh/articles/${article.slug}` },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="ja-wrap-narrow" style={{ padding: '44px 20px 72px' }}>
        <nav style={{ fontSize: 11.5, color: '#8a8577', marginBottom: 18 }}>
          <Link href="/zh" style={{ color: '#8a8577', textDecoration: 'none' }}>首頁</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <Link href="/zh/articles" style={{ color: '#8a8577', textDecoration: 'none' }}>專欄</Link>
        </nav>

        <span className="ja-card-label">{article.category}</span>
        <h1 style={{ fontSize: 'clamp(24px, 3.6vw, 32px)', lineHeight: 1.6, letterSpacing: '0.04em', margin: '10px 0 12px' }}>
          {article.title}
        </h1>
        <p style={{ fontSize: 12, color: '#8a8577', marginBottom: 24 }}>
          更新：{article.updatedAt}
        </p>

        <div className="ja-reading">
          <p style={{ fontSize: 15, lineHeight: 2, color: '#e6dfd0' }}>{article.lede}</p>

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
              <h2>常見問題</h2>
              {article.faq.map((f) => (
                <div key={f.q} style={{ marginBottom: 16 }}>
                  <p style={{ fontWeight: 600, color: '#e6dfd0', marginBottom: 4 }}>Q. {f.q}</p>
                  <p>A. {f.a}</p>
                </div>
              ))}
            </article>
          )}
        </div>

        <div
          style={{
            marginTop: 28,
            padding: '20px 22px',
            border: '1px solid rgba(201,165,74,0.3)',
            borderRadius: 14,
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 13, color: '#a49e8f', margin: '0 0 14px' }}>
            先看看自己的命盤，再對照這篇文章。
          </p>
          <Link href="/zh/shindan" className="ja-btn ja-btn-sm">免費診斷</Link>
        </div>

        {related.length > 0 && (
          <div style={{ marginTop: 36 }}>
            <h2 style={{ fontSize: 16, marginBottom: 14 }}>相關文章</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              {related.map((a) => (
                <Link
                  key={a.slug}
                  href={`/zh/articles/${a.slug}`}
                  className="ja-card"
                  style={{ textDecoration: 'none', color: 'inherit', padding: '14px 16px' }}
                >
                  <span style={{ fontSize: 12, color: '#e3c473' }}>{a.category}</span>
                  <div style={{ fontSize: 14, marginTop: 4 }}>{a.title}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
