/**
 * AI トークン（IP + 生年月日 + 期限）の検証テスト。
 */

import { signAiToken, verifyAiToken } from '../../lib/jp/ai-token';
import { hashIp } from '../../lib/jp/rate-limit';

let failures = 0;
function ok(name: string, cond: boolean) {
  if (!cond) {
    failures += 1;
    console.error(`✗ ${name}`);
  } else {
    console.log(`✓ ${name}`);
  }
}

const birth = '1990-6-15|8:0|male|東京都';
const token = signAiToken('203.0.113.1', birth);
ok('同じ IP・生年月日で通る', verifyAiToken(token, '203.0.113.1', birth));
ok('IP が違えば拒否', !verifyAiToken(token, '203.0.113.2', birth));
ok('生年月日が違えば拒否', !verifyAiToken(token, '203.0.113.1', birth + 'x'));
ok('空トークンは拒否', !verifyAiToken(undefined, '203.0.113.1', birth));
ok('改ざんは拒否', !verifyAiToken(`${token}x`, '203.0.113.1', birth));

const expired = signAiToken('203.0.113.1', birth, -10);
ok('期限切れは拒否', !verifyAiToken(expired, '203.0.113.1', birth));

ok('IP ハッシュは 32 文字', hashIp('203.0.113.1').length === 32);

if (failures > 0) {
  console.error(`\n[ jp-ai-token ] ${failures} 件失敗`);
  process.exit(1);
}
console.log('\n[jp-ai-token] すべて通過');
