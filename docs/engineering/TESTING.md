---
title: 测试策略
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared]
canonical: true
---

# 测试策略

> 目标：改文案/命理规则时，不破坏既有输出；改支付/AI 时，不产生安全漏洞。

## 1. 必跑

```bash
npx tsc --noEmit
npm test
npm run build
```

- `npm test` 目前跑 `scripts/regression/*.test.ts`（25 个套件）
- `jp-patterns` / `zh-patterns` 需要：
  ```bash
  NODE_OPTIONS=--conditions=react-server npx tsx scripts/regression/jp-patterns.test.ts
  NODE_OPTIONS=--conditions=react-server npx tsx scripts/regression/zh-patterns.test.ts
  ```
  `package.json` 的 `test` 已处理。

## 2. 测试分层

| 类型 | 文件 | 保护 |
|---|---|---|
| 排盘/时间 | `pan-integrity`、`dst-cn`、`clock-adjust`、`sizhu-lichun-boundary`、`iztro-time-index-boundary`、`solar-date-exists` | 命盘/时区/节气 |
| 命理规则 | `hongluan-tianxi`、`famous-hour-consistency`、`natal-dual-sihua-same-palace`、`neutral-naming` | 星曜/四化/命名 |
| 日文内容 | `jp-birth`、`jp-content`、`jp-compat`、`jp-report`、`jp-edge` | 文案/空宫/大限 |
| 繁中内容 | `zh-content` | 词库/解读/报告/相性 |
| 格局 | `jp-patterns`、`zh-patterns` | 格局/排序/出典 |
| 支付 | `jp-checkout` | order token/webhook |
| AI | `jp-llm`、`jp-llm-guard`、`jp-ratelimit`、`jp-ai-token` | prompt/护栏/限流 |

## 3. CI

`.github/workflows/ci.yml`：

- Node 22
- `npm ci`
- `npm run typecheck`
- `npm test`
- `npm run build`

### npm lock 注意

Docker（npm 10）曾因 `fdir`/`picomatch` hoisting 需要 `npm ci --legacy-peer-deps`。
2026-11-21 已用 npm 10 `ci --dry-run` 验证目前的 lock 可用；CI 用 `npm ci` 应该正常。

若日后用 npm 11 重新生成 lock，可能再出现同问题；到时优先用 npm 10 重新生成，或在 Docker/CI 加 `--legacy-peer-deps`。

## 4. AI 输出

AI 文本的质量评估见 `ai/AI-EVALUATION.md`；工程测试不替代人工评估。

## 5. 尚未覆盖

- 繁中 checkout/webhook（尚未实现）
- E2E（Playwright/Cypress）
- 视觉回归/手机版
- 付款真实流程
- AI 事实性/一致性评估（目前只有 prompt/护栏测试）
- 多实例限流

## 5. 金标准盘

至少保留：

- 空宫（命宫/官禄）
- 多主星
- 晚子时 23:59 / 00:00
- 立春/春节边界
- 大限虚岁边界

新增规则时，先加金标准盘，再改 code。

## 6. Definition of Done

- [ ] tsc 0
- [ ] npm test 全绿
- [ ] build 成功
- [ ] 部署后 `/api/health`、`/zh`、`/ja` 200
- [ ] 若改文案，人工看一次页面
- [ ] 若改支付/AI，测 401/403/429/501
