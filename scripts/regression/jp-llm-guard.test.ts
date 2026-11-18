/**
 * AI コストガードの回帰テスト。
 * グローバル日次上限・IP 日次上限・リセット。
 */

import {
  takeGlobalSlot,
  takeIpDailySlot,
  resetGuards,
  LLM_DAILY_GLOBAL_LIMIT,
  LLM_DAILY_IP_LIMIT,
} from '../../lib/jp/llm-guard';

let failures = 0;
function ok(name: string, cond: boolean, detail = '') {
  if (!cond) {
    failures += 1;
    console.error(`✗ ${name}${detail ? `: ${detail}` : ''}`);
  } else {
    console.log(`✓ ${name}`);
  }
}

resetGuards();

// ── グローバル ──
let granted = 0;
for (let i = 0; i < LLM_DAILY_GLOBAL_LIMIT; i++) {
  if (takeGlobalSlot().ok) granted++;
}
ok('グローバル上限ちょうどまで許可', granted === LLM_DAILY_GLOBAL_LIMIT, String(granted));
ok('グローバル上限超過は拒否', !takeGlobalSlot().ok);
ok('グローバル上限は 1000', LLM_DAILY_GLOBAL_LIMIT === 1000);

// ── IP 日次 ──
resetGuards();
let ipGranted = 0;
for (let i = 0; i < LLM_DAILY_IP_LIMIT; i++) {
  if (takeIpDailySlot('hash-a').ok) ipGranted++;
}
ok('IP 上限ちょうどまで許可', ipGranted === LLM_DAILY_IP_LIMIT, String(ipGranted));
ok('IP 上限超過は拒否', !takeIpDailySlot('hash-a').ok);
ok('別 IP は独立', takeIpDailySlot('hash-b').ok);
ok('IP 上限は 20', LLM_DAILY_IP_LIMIT === 20);

// ── リセット ──
resetGuards();
ok('reset 後は再許可', takeGlobalSlot().ok && takeIpDailySlot('hash-a').ok);

if (failures > 0) {
  console.error(`[ jp-llm-guard ] ${failures} 件失敗`);
  process.exit(1);
}
console.log('[ jp-llm-guard ] すべて通過');
