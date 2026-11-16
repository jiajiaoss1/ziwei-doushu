#!/usr/bin/env node
/**
 * 日本語版の本番スモークテスト。
 *
 * 使い方:
 *   BASE_URL=https://xxx.netlify.app node scripts/smoke-ja.mjs
 *   npm run smoke:ja
 */

import dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');

const BASE = (process.env.BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');
const Q = 'y=1990&m=6&d=15&h=8&mi=0&g=m&p=' + encodeURIComponent('東京都');
const PAIR =
  'a_y=1990&a_m=6&a_d=15&a_h=8&a_mi=0&a_g=m&a_p=' + encodeURIComponent('東京都') +
  '&b_y=1988&b_m=3&b_d=3&b_h=14&b_mi=0&b_g=f&b_p=' + encodeURIComponent('大阪府');

const cases = [
  { path: '/ja', status: 200, canonical: '/ja', contains: '紫微館' },
  { path: '/ja/shindan', status: 200, canonical: '/ja/shindan', contains: '無料診断' },
  { path: `/ja/result?${Q}`, status: 200, noindex: true, contains: '命盤' },
  { path: `/ja/result?y=1988&m=3&d=3&h=14&mi=0&g=f&p=${encodeURIComponent('大阪府')}`, status: 200, noindex: true, contains: '空宮' },
  { path: `/ja/report?${Q}&type=love`, status: 200, noindex: true, contains: '恋愛鑑定書' },
  { path: `/ja/report?${Q}&type=work`, status: 200, noindex: true, contains: '事業鑑定書' },
  { path: `/ja/checkout?${Q}&type=work`, status: 200, noindex: true, contains: 'お支払い' },
  { path: '/ja/aishou', status: 200, canonical: '/ja/aishou', contains: '相性診断' },
  { path: `/ja/aishou/result?${PAIR}`, status: 200, noindex: true, contains: '相性鑑定' },
  { path: '/ja/2027', status: 200, canonical: '/ja/2027', contains: '2027' },
  { path: '/ja/articles', status: 200, canonical: '/ja/articles', contains: '読みもの' },
  { path: '/ja/articles/shibitosu-toha', status: 200, canonical: '/ja/articles/shibitosu-toha', contains: '紫微斗数' },
  { path: '/ja/legal/terms', status: 200, canonical: '/ja/legal/terms', contains: '利用規約' },
  { path: '/ja/legal/privacy', status: 200, canonical: '/ja/legal/privacy', contains: 'プライバシーポリシー' },
  { path: '/ja/legal/tokushoho', status: 200, canonical: '/ja/legal/tokushoho', contains: '特定商取引法' },
  { path: '/ja/does-not-exist', status: 404, contains: 'ページが見つかりません' },
];

const results = [];
const fail = (name, detail) => results.push({ ok: false, name, detail });
const pass = (name) => results.push({ ok: true, name });

async function request(url, options = {}, attempts = 3) {
  let last;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      last = err;
      await new Promise((r) => setTimeout(r, 300 * (i + 1)));
    }
  }
  throw last;
}

async function get(path) {
  const res = await request(`${BASE}${path}`, { redirect: 'manual' });
  return { res, text: await res.text() };
}

for (const c of cases) {
  try {
    const { res, text } = await get(c.path);
    if (res.status !== c.status) {
      fail(`${c.path} status`, `expected ${c.status}, got ${res.status}`);
      continue;
    }
    pass(`${c.path} status ${c.status}`);

    if (c.contains && !text.includes(c.contains)) fail(`${c.path} content`, `missing "${c.contains}"`);

    if (c.canonical) {
      const m = text.match(/<link rel="canonical" href="([^"]+)"/);
      const expected = `${BASE}${c.canonical}`;
      if (!m) fail(`${c.path} canonical`, 'missing');
      else if (m[1] !== expected) fail(`${c.path} canonical`, `expected ${expected}, got ${m[1]}`);
      else pass(`${c.path} canonical`);
    }

    if (c.noindex) {
      if (!/<meta name="robots" content="[^"]*noindex/.test(text)) fail(`${c.path} noindex`, 'missing');
      else pass(`${c.path} noindex`);
    }
  } catch (err) {
    fail(`${c.path} request`, String(err));
  }
}

// OGP image
try {
  const res = await request(`${BASE}/ja/ogp.png`);
  const type = res.headers.get('content-type') || '';
  if (res.status === 200 && type.includes('image/png')) pass('OGP image');
  else fail('OGP image', `${res.status} ${type}`);
} catch (err) {
  fail('OGP image', String(err));
}

// sitemap / robots
try {
  const sm = await (await request(`${BASE}/sitemap.xml`)).text();
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const foreign = locs.filter((u) => !u.startsWith(BASE));
  if (locs.length >= 40 && foreign.length === 0) pass(`sitemap (${locs.length} urls, same host)`);
  else fail('sitemap', `count=${locs.length}, foreign=${foreign.slice(0, 2).join(',')}`);

  const rb = await (await request(`${BASE}/robots.txt`)).text();
  if (rb.includes(`Sitemap: ${BASE}/sitemap.xml`) && rb.includes(`Host: ${BASE}`)) pass('robots');
  else fail('robots', 'host/sitemap mismatch');
} catch (err) {
  fail('sitemap/robots', String(err));
}

// JSON-LD parse
try {
  const { text } = await get('/ja');
  const blocks = [...text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (blocks.length === 0) fail('JSON-LD', 'none on /ja');
  else {
    for (const b of blocks) JSON.parse(b[1]);
    pass(`JSON-LD (${blocks.length} blocks parsed)`);
  }
} catch (err) {
  fail('JSON-LD', String(err));
}

// API: invalid body should be 400 (or 501 when no key)
try {
  const res = await request(`${BASE}/api/ja/interpret`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  });
  if (res.status === 400 || res.status === 501) pass(`API guard ${res.status}`);
  else fail('API guard', `expected 400/501, got ${res.status}`);
} catch (err) {
  fail('API guard', String(err));
}

const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? '✓' : '✗'} ${r.name}${r.detail ? ` — ${r.detail}` : ''}`);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (failed.length > 0) process.exit(1);
