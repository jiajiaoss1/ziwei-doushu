/**
 * 自动生成 sitemap.xml
 *
 * 包含：
 *  - 主页、起盘页、合盘页
 *  - /library 古籍库（主页 + 3 部古籍 + 章节页）
 *  - /knowledge 知识库（主页 + 14×13 主题页）
 */

import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { ARTICLES } from '@/lib/jp/articles';

const BASE_URL = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
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

  // 日本版ドメインのため、中国語デモページは sitemap に含めない
  // 繁体中文版（港台向け）
  const zhLastmod = new Date();
  const zhPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/zh`, priority: 1.0, changeFrequency: 'weekly', lastModified: zhLastmod },
    { url: `${BASE_URL}/zh/shindan`, priority: 0.9, changeFrequency: 'weekly', lastModified: zhLastmod },
    { url: `${BASE_URL}/zh/aishou`, priority: 0.85, changeFrequency: 'weekly', lastModified: zhLastmod },
    { url: `${BASE_URL}/zh/2027`, priority: 0.85, changeFrequency: 'weekly', lastModified: zhLastmod },
    { url: `${BASE_URL}/zh/legal/terms`, priority: 0.2, changeFrequency: 'yearly', lastModified: zhLastmod },
    { url: `${BASE_URL}/zh/legal/privacy`, priority: 0.2, changeFrequency: 'yearly', lastModified: zhLastmod },
    { url: `${BASE_URL}/zh/legal/tokushoho`, priority: 0.2, changeFrequency: 'yearly', lastModified: zhLastmod },
  ];
  return [...jaPages, ...zhPages];
}
