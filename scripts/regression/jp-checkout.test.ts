/**
 * 課金クローズドループ（無状態）の回帰テスト。
 *
 * - order token の暗号化・復号・改竄・期限
 * - webhook 署名検証
 * - 決済 URL / 鑑定書 URL の組み立て
 */

import { createHmac } from 'node:crypto';
import type { JpBirthInput } from '../../lib/jp/birth';
import { birthKey, signUnlock, verifyUnlock } from '../../lib/jp/access';
import {
  buildCheckoutUrl,
  buildReportUrl,
  orderBirthKey,
  signOrder,
  verifyOrder,
  verifyWebhookSignature,
} from '../../lib/jp/checkout';

let failures = 0;
function ok(name: string, cond: boolean, detail = '') {
  if (!cond) {
    failures += 1;
    console.error(`✗ ${name}${detail ? `: ${detail}` : ''}`);
  } else {
    console.log(`✓ ${name}`);
  }
}

const SECRET = 'test-webhook-secret-0123456789abcdef';
const INPUT: JpBirthInput = {
  year: 1990, month: 6, day: 15, clockHour: 8, clockMinute: 0,
  unknownTime: false, prefecture: '東京都', gender: 'male',
};

process.env.JP_WEBHOOK_SECRET = SECRET;

// ── order token ──
const token = signOrder('work', INPUT);
const back = verifyOrder(token);
ok('order 往復（type/生年月日）', back?.type === 'work' && back?.input.year === 1990 && back?.input.prefecture === '東京都');
ok('order token に漢字の平文が出ない', !token.includes('東京都'));

process.env.JP_WEBHOOK_SECRET = 'another-secret-9999999999999999';
ok('別鍵では復号不可', verifyOrder(token) === null);
process.env.JP_WEBHOOK_SECRET = SECRET;

const tampered = token.slice(0, -4) + (token.endsWith('AAAA') ? 'BBBB' : 'AAAA');
ok('改竄 token は拒否', verifyOrder(tampered) === null);
ok('期限切れ token は拒否', verifyOrder(signOrder('work', INPUT, -1)) === null);
ok('ランダム文字列は拒否', verifyOrder('not-a-token') === null);

delete process.env.JP_WEBHOOK_SECRET;
let threw = false;
try { signOrder('work', INPUT); } catch { threw = true; }
ok('鍵未設定なら signOrder は throw', threw);
process.env.JP_WEBHOOK_SECRET = SECRET;

// ── webhook 署名 ──
const body = JSON.stringify({ order: token, status: 'paid' });
const sig = createHmac('sha256', SECRET).update(body).digest('hex');
ok('署名一致', verifyWebhookSignature(body, sig));
ok('sha256= 前缀を許容', verifyWebhookSignature(body, `sha256=${sig}`));
ok('署名不一致は拒否', !verifyWebhookSignature(body, 'deadbeef'));
ok('署名なしは拒否', !verifyWebhookSignature(body, null));
ok('body 改変は拒否', !verifyWebhookSignature(`${body} `, sig));

// ── checkout URL ──
delete process.env.JP_CHECKOUT_URL;
ok('JP_CHECKOUT_URL 未設定なら undefined', buildCheckoutUrl('abc') === undefined);
process.env.JP_CHECKOUT_URL = 'https://pay.example.com/checkout';
ok('order パラメータが付く', Boolean(buildCheckoutUrl('abc')?.includes('order=abc')));
process.env.JP_CHECKOUT_URL = 'https://pay.example.com/c?x=1';
ok('既存 query を壊さない', Boolean(buildCheckoutUrl('abc')?.includes('x=1')));
process.env.JP_CHECKOUT_URL = 'https://pay.example.com/checkout';

// ── 鑑定書 URL と unlock ──
const order = verifyOrder(signOrder('love', INPUT))!;
const unlock = signUnlock('love', birthKey(INPUT));
const ru = buildReportUrl(order, unlock, 'https://shibikan.com');
ok('report URL に type', ru.includes('type=love'));
ok('report URL に unlock token', ru.includes('t='));
ok('report URL に生年月日', ru.includes('y=1990') && ru.includes('p='));
ok('unlock token が検証を通る', verifyUnlock(unlock, 'love', birthKey(INPUT)));
ok('orderBirthKey が birthKey と一致', orderBirthKey(order) === birthKey(INPUT));

// 時刻不明は u=1、時刻ありは h/mi
const unknownOrder = verifyOrder(signOrder('work', { ...INPUT, unknownTime: true }))!;
ok('時刻不明は u=1', buildReportUrl(unknownOrder, unlock, 'https://x.jp').includes('u=1'));
ok('時刻ありは h/mi', ru.includes('h=8') && ru.includes('mi=0'));

if (failures > 0) {
  console.error(`[ jp-checkout ] ${failures} 件失敗`);
  process.exit(1);
}
console.log('[ jp-checkout ] すべて通過');
