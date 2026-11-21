/**
 * ZH mock checkout API 回歸測試。
 * 不接真錢；只驗證 server 定價與基本驗證。
 */

import { POST } from '../../app/api/zh/checkout/route';

let failures = 0;
function ok(name: string, cond: boolean, detail = '') {
  if (!cond) {
    failures += 1;
    console.error(`✗ ${name}${detail ? `: ${detail}` : ''}`);
  } else {
    console.log(`✓ ${name}`);
  }
}

const base = {
  year: 1988,
  month: 3,
  day: 3,
  status: 'married',
  decision: 'stay',
  tried: ['tarot'],
  note: '',
  clockHour: 12,
  clockMinute: 0,
  unknownTime: false,
  city: '台北市',
};

async function post(body: unknown) {
  return POST(new Request('http://localhost/api/zh/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }));
}

async function main() {
  const res = await post(base);
  const json = (await res.json()) as { mock?: boolean; amount?: number; currency?: string };
  ok('有效資料回 200', res.status === 200, String(res.status));
  ok('回傳 mock', json.mock === true);
  ok('server 定價 680', json.amount === 680, String(json.amount));
  ok('幣種 TWD', json.currency === 'TWD');

  const override = await post({ ...base, amount: 1, price: 1 });
  const overrideJson = (await override.json()) as { amount?: number };
  ok('客戶端價格被忽略', overrideJson.amount === 680, String(overrideJson.amount));

  const badCity = await post({ ...base, city: '香港' });
  ok('HK 被拒', badCity.status === 400, String(badCity.status));

  const badHour = await post({ ...base, clockHour: 24 });
  ok('非法時辰被拒', badHour.status === 400, String(badHour.status));

  const bad = await POST(new Request('http://localhost/api/zh/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{',
  }));
  ok('非法 JSON 回 400', bad.status === 400, String(bad.status));

}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

if (failures > 0) {
  console.error(`\n[ zh-checkout ] ${failures} 項失敗`);
  process.exit(1);
}
console.log('\n[ zh-checkout ] すべて通過');
