import type { Metadata } from 'next';
import '../ja/ja.css';
import SiteHeaderZh from '@/components/zh/SiteHeaderZh';
import SiteFooterZh from '@/components/zh/SiteFooterZh';
import { SITE_URL } from '@/lib/site';

export const viewport = {
  themeColor: '#0a0e1c',
  colorScheme: 'dark' as const,
};

export const metadata: Metadata = {
  title: {
    default: '紫微館｜用紫微斗數讀你的星盤',
    template: '%s｜紫微館',
  },
  description:
    '輸入出生年月日與時辰，以中國傳統占術・紫微斗數，解讀你的本質、感情與工作傾向。免註冊的免費診斷。',
  keywords: ['紫微斗數', '命盤', '占卜', '感情占卜', '四化', '東方占術'],
  alternates: { canonical: '/zh' },
  openGraph: {
    title: '紫微館｜用紫微斗數讀你的星盤',
    description: '輸入出生年月日與時辰，用紫微斗數解讀你的本質、感情與工作傾向。',
    url: `${SITE_URL}/zh`,
    siteName: '紫微館',
    locale: 'zh_TW',
    type: 'website',
    images: [
      {
        url: '/zh/ogp.png',
        width: 1200,
        height: 630,
        alt: '紫微館 — 用紫微斗數讀你的星盤',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '紫微館｜用紫微斗數讀你的星盤',
    description: '輸入出生年月日與時辰，用紫微斗數解讀你的本質、感情與工作傾向。',
    images: ['/zh/ogp.png'],
  },
};

export default function ZhLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeaderZh />
      {children}
      <SiteFooterZh />
    </>
  );
}
