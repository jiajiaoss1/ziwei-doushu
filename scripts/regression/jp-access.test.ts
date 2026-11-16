/**
 * 有料レポートのアクセス制御テスト。
 *
 * ・HMAC トークンの往復（種別・生年月日キー・期限）
 * ・改ざん・種別違い・キー違いの拒否
 * ・β版では全文公開、恋愛は常に無料
 */

import {
  REPORT_PRICES,
  birthKey,
  getReportAccess,
  signUnlock,
  verifyUnlock,
  type PaidReportType,
} from '../../lib/jp/access';
import type { JpBirthInput } from '../../lib/jp/birth';

let failures = 0;

function ok(name: string, cond: boolean) {
  if (!cond) {
    failures += 1;
    console.error(`✗ ${name}`);
  } else {
    console.log(`✓ ${name}`);
  }
}

const input: JpBirthInput = {
  year: 1990,
  month: 6,
  day: 15,
  clockHour: 8,
  clockMinute: 0,
  unknownTime: false,
  prefecture: '東京都',
  gender: 'male',
};

const key = birthKey(input);
const other: JpBirthInput = { ...input, day: 16 };
const otherKey = birthKey(other);

// 往復
const token = signUnlock('work', key);
ok('トークンが検証を通る', verifyUnlock(token, 'work', key));
ok('種別が違えば拒否', !verifyUnlock(token, 'love', key));
ok('生年月日が違えば拒否', !verifyUnlock(token, 'work', otherKey));
ok('空トークンは拒否', !verifyUnlock(undefined, 'work', key));

// 改ざん
const [payload, sig] = token.split('.');
ok('署名の改ざんは拒否', !verifyUnlock(`${payload}.${sig.slice(0, -2)}xx`, 'work', key));
ok('ペイロードの差し替えは拒否', !verifyUnlock(`${payload}x.${sig}`, 'work', key));

// 期限切れ
const expired = signUnlock('work', key, -10);
ok('期限切れは拒否', !verifyUnlock(expired, 'work', key));

// 価格
ok('恋愛は2,980円', REPORT_PRICES.love === 2980);
ok('事業は4,980円', REPORT_PRICES.work === 4980);

// β版（テスト環境では JP_BETA_FREE 未設定 = 無料）
const work = getReportAccess('work', key, undefined);
ok('β版では事業レポートも全文', work.full && work.beta);
const love = getReportAccess('love', key, undefined);
ok('恋愛レポートは常に無料で全文', love.full && love.price === 0);

if (failures > 0) {
  console.error(`\n[ jp-access ] ${failures} 件失敗`);
  process.exit(1);
}
console.log('\n[jp-access] すべて通過');
