/**
 * AI エンドポイントのレートリミット／オリジン判定テスト。
 */

import { checkRateLimit, hashIp, isAllowedOrigin, resetRateLimitForTests } from '../../lib/jp/rate-limit';

let failures = 0;
function ok(name: string, cond: boolean, detail = '') {
  if (!cond) {
    failures += 1;
    console.error(`✗ ${name}${detail ? `: ${detail}` : ''}`);
  } else {
    console.log(`✓ ${name}`);
  }
}

async function main() {
  ok('Origin なしは許可', isAllowedOrigin(null, 'https://shibikan.com/api/ja/interpret'));
  ok(
    '同一ホストは許可',
    isAllowedOrigin('https://shibikan.com', 'https://shibikan.com/api/ja/interpret'),
  );
  ok(
    '設定ドメインは許可',
    isAllowedOrigin('https://shibikan.com', 'https://abc.netlify.app/api/ja/interpret', 'https://shibikan.com'),
  );
  ok(
    '別オリジンは拒否',
    !isAllowedOrigin('https://evil.example', 'https://shibikan.com/api/ja/interpret'),
  );
  ok('壊れた Origin は拒否', !isAllowedOrigin('not-a-url', 'https://shibikan.com/api'));

  ok('IP ハッシュは 32 文字', hashIp('203.0.113.1').length === 32);
  ok('同じ IP は同じハッシュ', hashIp('203.0.113.1') === hashIp('203.0.113.1'));
  ok('違う IP は違うハッシュ', hashIp('203.0.113.1') !== hashIp('203.0.113.2'));

  resetRateLimitForTests();
  const key = `ip:${hashIp('198.51.100.1')}`;
  const r1 = await checkRateLimit(key, 2, 60_000);
  const r2 = await checkRateLimit(key, 2, 60_000);
  const r3 = await checkRateLimit(key, 2, 60_000);
  ok('1 回目は許可', r1.ok && r1.remaining === 1);
  ok('2 回目は許可', r2.ok && r2.remaining === 0);
  ok('3 回目は拒否', !r3.ok && r3.retryAfter > 0);

  resetRateLimitForTests();
  const shortKey = `ip:${hashIp('198.51.100.2')}`;
  ok('短い窓の 1 回目', (await checkRateLimit(shortKey, 1, 50)).ok);
  ok('短い窓の 2 回目は拒否', !(await checkRateLimit(shortKey, 1, 50)).ok);
  await new Promise((r) => setTimeout(r, 80));
  ok('窓が過ぎれば再許可', (await checkRateLimit(shortKey, 1, 50)).ok);

  if (failures > 0) {
    console.error(`\n[ jp-ratelimit ] ${failures} 件失敗`);
    process.exit(1);
  }
  console.log('\n[jp-ratelimit] すべて通過');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
