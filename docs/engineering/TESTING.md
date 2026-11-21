---
title: 測試策略
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared]
canonical: true
---

# 測試策略

> 目標：改文案/命理規則時，不破壞既有輸出；改支付/AI 時，不產生安全漏洞。

## 1. 必跑

```bash
npx tsc --noEmit
npm test
npm run build
```

- `npm test` 目前跑 `scripts/regression/*.test.ts`（25 個套件）
- `jp-patterns` / `zh-patterns` 需要：
  ```bash
  NODE_OPTIONS=--conditions=react-server npx tsx scripts/regression/jp-patterns.test.ts
  NODE_OPTIONS=--conditions=react-server npx tsx scripts/regression/zh-patterns.test.ts
  ```
  `package.json` 的 `test` 已處理。

## 2. 測試分層

| 類型 | 檔案 | 保護 |
|---|---|---|
| 排盤/時間 | `pan-integrity`、`dst-cn`、`clock-adjust`、`sizhu-lichun-boundary`、`iztro-time-index-boundary`、`solar-date-exists` | 命盤/時區/節氣 |
| 命理規則 | `hongluan-tianxi`、`famous-hour-consistency`、`natal-dual-sihua-same-palace`、`neutral-naming` | 星曜/四化/命名 |
| 日文內容 | `jp-birth`、`jp-content`、`jp-compat`、`jp-report`、`jp-edge` | 文案/空宮/大限 |
| 繁中內容 | `zh-content` | 詞庫/解讀/報告/相性 |
| 格局 | `jp-patterns`、`zh-patterns` | 格局/排序/出典 |
| 支付 | `jp-checkout` | order token/webhook |
| AI | `jp-llm`、`jp-llm-guard`、`jp-ratelimit`、`jp-ai-token` | prompt/護欄/限流 |

## 3. CI

`.github/workflows/ci.yml`：

- Node 22
- `npm ci`
- `npm run typecheck`
- `npm test`
- `npm run build`

### npm lock 注意

Docker（npm 10）曾因 `fdir`/`picomatch` hoisting 需要 `npm ci --legacy-peer-deps`。
2026-11-21 已用 npm 10 `ci --dry-run` 驗證目前的 lock 可用；CI 用 `npm ci` 應該正常。

若日後用 npm 11 重新生成 lock，可能再出現同問題；到時優先用 npm 10 重新生成，或在 Docker/CI 加 `--legacy-peer-deps`。

## 4. 尚未覆蓋

- 繁中 checkout/webhook（尚未實作）
- E2E（Playwright/Cypress）
- 視覺回歸/手機版
- 付款真實流程
- AI 事實性/一致性評估（目前只有 prompt/護欄測試）
- 多實例限流

## 5. 金標準盤

至少保留：

- 空宮（命宮/官祿）
- 多主星
- 晚子時 23:59 / 00:00
- 立春/春節邊界
- 大限虛歲邊界

新增規則時，先加金標準盤，再改 code。

## 6. Definition of Done

- [ ] tsc 0
- [ ] npm test 全綠
- [ ] build 成功
- [ ] 部署後 `/api/health`、`/zh`、`/ja` 200
- [ ] 若改文案，人工看一次頁面
- [ ] 若改支付/AI，测 401/403/429/501
