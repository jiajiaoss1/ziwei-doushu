/**
 * 自动生成 sitemap.xml
 *
 * 包含：
 *  - 主页、起盘页、合盘页
 *  - /library 古籍库（主页 + 3 部古籍 + 章节页）
 *  - /knowledge 知识库（主页 + 14×13 主题页）
 */

import type { MetadataRoute } from 'next';
import { ALL_BOOKS } from '@/lib/classics';
import { getAllKnowledgeRoutes } from '@/lib/seo/knowledge';
import { SITE_URL } from '@/lib/site';
import { ARTICLES } from '@/lib/jp/articles';

const BASE_URL = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastmod = new Date('2026-04-28');

  // 日本語版（日本市場向け）— 更新日はビルド日を使う
  const jaLastmod = new Date();
  const jaPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/ja`, priority: 1.0, changeFrequency: 'weekly', lastModified: jaLastmod },
    { url: `${BASE_URL}/ja/shindan`, priority: 0.9, changeFrequency: 'weekly', lastModified: jaLastmod },
    { url: `${BASE_URL}/ja/articles`, priority: 0.8, changeFrequency: 'weekly', lastModified: jaLastmod },
    { url: `${BASE_URL}/ja/aishou`, priority: 0.85, changeFrequency: 'weekly', lastModified: jaLastmod },
    { url: `${BASE_URL}/ja/2027`, priority: 0.85, changeFrequency: 'weekly', lastModified: jaLastmod },
    ...ARTICLES.map((a) => ({
      url: `${BASE_URL}/ja/articles/${a.slug}`,
      priority: 0.8,
      changeFrequency: 'monthly' as const,
      lastModified: new Date(a.updatedAt),
    })),
    { url: `${BASE_URL}/ja/legal/terms`, priority: 0.2, changeFrequency: 'yearly', lastModified: jaLastmod },
    { url: `${BASE_URL}/ja/legal/privacy`, priority: 0.2, changeFrequency: 'yearly', lastModified: jaLastmod },
    { url: `${BASE_URL}/ja/legal/tokushoho`, priority: 0.2, changeFrequency: 'yearly', lastModified: jaLastmod },
  ];

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, priority: 1.0, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/chart`, priority: 0.95, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/heming`, priority: 0.7, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/library`, priority: 0.85, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/knowledge`, priority: 0.9, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/terms`, priority: 0.3, changeFrequency: 'monthly', lastModified: lastmod },
    { url: `${BASE_URL}/privacy`, priority: 0.3, changeFrequency: 'monthly', lastModified: lastmod },
  ];

  // 古籍页
  const libraryPages: MetadataRoute.Sitemap = ALL_BOOKS.flatMap(book => {
    const bookHome: MetadataRoute.Sitemap[number] = {
      url: `${BASE_URL}/library/${book.slug}`,
      priority: 0.75,
      changeFrequency: 'monthly',
      lastModified: lastmod,
    };
    const chapters: MetadataRoute.Sitemap = book.chapters.map((_, i) => ({
      url: `${BASE_URL}/library/${book.slug}/${i}`,
      priority: 0.7,
      changeFrequency: 'monthly',
      lastModified: lastmod,
    }));
    return [bookHome, ...chapters];
  });

  // 知识库 14×13
  const knowledgePages: MetadataRoute.Sitemap = getAllKnowledgeRoutes().map(({ slug, topic }) => ({
    url: `${BASE_URL}/knowledge/${slug}/${topic}`,
    priority: 0.7,
    changeFrequency: 'monthly',
    lastModified: lastmod,
  }));

  return [...jaPages, ...staticPages, ...libraryPages, ...knowledgePages];
}
