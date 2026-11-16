import type { Metadata } from 'next';
import './ja.css';
import SiteHeader from '@/components/jp/SiteHeader';
import SiteFooter from '@/components/jp/SiteFooter';
import { SITE_URL } from '@/lib/site';

export const viewport = {
  themeColor: '#0a0e1c',
  colorScheme: 'dark' as const,
};

export const metadata: Metadata = {
  title: {
    default: '紫微館｜紫微斗数で読む、あなたの星の設計図',
    template: '%s｜紫微館',
  },
  description:
    '生年月日と出生時刻から、中国伝統の占術・紫微斗数（しびとすう）で、あなたの本質・恋愛・仕事の傾向を読み解きます。登録不要の無料診断。',
  keywords: ['紫微斗数', 'しびとすう', '占い', '恋愛占い', '命盤', '四化', '東洋占術'],
  alternates: { canonical: '/ja' },
  openGraph: {
    title: '紫微館｜紫微斗数で読む、あなたの星の設計図',
    description:
      '生年月日と出生時刻から、中国伝統の占術・紫微斗数で、あなたの本質・恋愛・仕事の傾向を読み解きます。',
    url: `${SITE_URL}/ja`,
    siteName: '紫微館',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: '/ja/ogp.png',
        width: 1200,
        height: 630,
        alt: '紫微館 — 紫微斗数で読む、あなたの星の設計図',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '紫微館｜紫微斗数で読む、あなたの星の設計図',
    description: '生年月日と出生時刻から、本質・恋愛・仕事の傾向を読み解きます。登録不要の無料診断。',
    images: ['/ja/ogp.png'],
  },
};

export default function JaLayout({ children }: { children: React.ReactNode }) {
  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '紫微館',
    alternateName: 'SHIBIKAN',
    url: `${SITE_URL}/ja`,
    inLanguage: 'ja',
    description:
      '生年月日と出生時刻から、中国伝統の占術・紫微斗数で本質・恋愛・仕事の傾向を読み解く無料診断サービス。',
    publisher: {
      '@type': 'Organization',
      name: '紫微館',
      url: SITE_URL,
      logo: `${SITE_URL}/icon.png`,
    },
  };

  return (
    <div className="ja-root" lang="ja">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
      <a className="ja-skip" href="#ja-content">
        本文へスキップ
      </a>
      <SiteHeader />
      <div id="ja-content">{children}</div>
      <SiteFooter />
    </div>
  );
}
