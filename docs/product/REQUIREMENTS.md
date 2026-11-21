---
title: 需求矩阵（已实现／β／计划）
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared, zh, ja]
canonical: true
---

# 需求矩阵

> 这是「做到哪」的唯一来源。PRD 写为什么/是什么；这里写状态。
> 每个新需求必须有 ID，并在 PR/commit 中引用。

状态：

```
proposed / approved / implemented / beta / planned / blocked / dropped
```

---

## 1. 共同（Shared）

| ID | 需求 | 状态 | 文件 | 程序 | 测试 |
|---|---|---|---|---|---|
| REQ-SHARED-001 | 紫微斗数排盘引擎 | implemented | `domain/ASTROLOGY-RULES.md` | `lib/ziwei/algorithm.ts` | `pan-integrity` 等 |
| REQ-SHARED-002 | 真太阳时 / 时区 / 晚子时 | implemented | `domain/ASTROLOGY-RULES.md` | `lib/jp/birth.ts`、`lib/zh/birth.ts` | `jp-birth`、`jp-edge` |
| REQ-SHARED-003 | 格局判定与排序 | implemented | `domain/ASTROLOGY-RULES.md` | `lib/ziwei/patterns*.ts` | `jp-patterns`、`zh-patterns` |
| REQ-SHARED-004 | 命盘→facts→文案 pipeline | implemented | `domain/CONTENT-PIPELINE.md` | `lib/{jp,zh}/facts.ts` | `jp-content`、`zh-content` |
| REQ-SHARED-005 | AI 受 facts 约束 | beta | `PRD-SHARED.md` §4 | `lib/{jp,zh}/llm.ts`、`app/api/*/interpret` | `jp-llm`、`jp-llm-guard` |
| REQ-SHARED-006 | AI origin/token/限流/成本护栏 | implemented | `engineering/SECURITY.md` | `lib/jp/llm-guard.ts`、`rate-limit.ts`、`ai-token.ts` | `jp-ratelimit`、`jp-ai-token` |
| REQ-SHARED-007 | Docker + Caddy 部署 | implemented | `engineering/DEPLOY.md` | `Dockerfile`、`Caddyfile`、`docker-compose.yml` | smoke / 手动 |
| REQ-SHARED-008 | CI（typecheck/test/build） | implemented | `engineering/TESTING.md` | `.github/workflows/*` | CI |
| REQ-SHARED-009 | 文件系统（索引/合约/ADR） | approved | `README.md`、`ai/*` | docs | — |
| REQ-SHARED-010 | 全局限流（跨实例） | planned | `engineering/SECURITY.md` | 目前进程内 | — |
| REQ-AI-002 | AI digest 补空宫借对宫/borrowed stars | planned | `ai/AI-EVALUATION.md` | `lib/{zh,jp}/llm.ts` | 待加 |

---

## 2. 繁中（ZH）

| ID | 需求 | 状态 | 文件 | 程序 | 测试 |
|---|---|---|---|---|---|
| REQ-ZH-001 | 首页（Hero/范例/信任/价格/FAQ） | implemented | `PRD-ZH.md` | `app/zh/page.tsx` | `zh-content` |
| REQ-ZH-002 | 诊断表单（烦恼+情境+港台县市） | implemented | `PRD-ZH.md` | `app/zh/shindan`、`components/zh` | `zh-content` |
| REQ-ZH-003 | 结果页（共情/命盘/章节排序） | implemented | `PRD-ZH.md` | `app/zh/result` | `zh-content` |
| REQ-ZH-004 | 感情/事业报告（信件语气） | implemented | `PRD-ZH.md` | `app/zh/report`、`lib/zh/report.ts` | `zh-content` |
| REQ-ZH-005 | 报告 β 全免费/解锁 | beta | `PRICING.md` | `app/zh/report`、`lib/jp/access.ts` | `jp-checkout` |
| REQ-ZH-006 | 港台定价显示 | implemented | `PRICING.md` | `lib/zh/pricing.ts` | `zh-content` |
| REQ-ZH-007 | AI 问答（结果页） | beta | `PRD-SHARED.md` §4 | `components/zh/AiReading`、`/api/zh/interpret` | `jp-llm-guard` |
| REQ-ZH-008 | 相性 | implemented | `PRD-ZH.md` | `app/zh/aishou` | `zh-content` |
| REQ-ZH-009 | 2027 专题 | implemented | `PRD-ZH.md` | `app/zh/2027` | `zh-content` |
| REQ-ZH-010 | 文章 6 篇 | implemented | `PRD-ZH.md` | `lib/zh/articles.ts` | `zh-content` |
| REQ-ZH-011 | 法务页（隐私/条款/交易） | beta | `content/TONE-AND-CLAIMS.md` | `app/zh/legal` | — |
| REQ-ZH-012 | 關係決策書：免费自查 + 6 部分报告 + 14 天追问 | approved | `PRD-ZH.md`、`SPECS/zh-decision-report.md` | 未实现 | 待加 |
| REQ-ZH-013 | 首页 + 关系决策自查（4 步/结果/付费 CTA） | beta | `PRD-ZH.md`、`SPECS/zh-home-selfcheck.md` | `app/zh/check`、`components/zh/SelfCheck*` | `zh-check` |
| REQ-ZH-014 | 《關係決策書》範例頁 | beta | `SPECS/zh-decision-report.md` | `app/zh/sample` | smoke |
| REQ-ZH-PAY-004 | Mock checkout（測試模式，不收款） | beta | `SPECS/zh-payment-refund.md` | `app/api/zh/checkout`、`components/zh/MockCheckout` | `zh-checkout` |
| REQ-ZH-REL-001 | 感情报告锁定区价格/链接依 type 正确 | planned | `PRD-ZH.md` §7 | `app/zh/report` | 待加 |
| REQ-ZH-REL-002 | 报告页保留 `w`/`s` 情境参数 | planned | `PRD-ZH.md` §7 | `app/zh/report` | 待加 |
| REQ-ZH-CONV-001 | 结果页报告卡显示价格 | proposed | `PRD-ZH.md` | `app/zh/result` | — |
| REQ-ZH-CONV-002 | 报告样本/试读 | proposed | `PRD-ZH.md` | 未做 | — |
| REQ-ZH-CONV-003 | 报告按情境客制（不只开场） | proposed | `PRD-ZH.md` | `lib/zh/report.ts` | — |
| REQ-ZH-PAY-001 | ZH checkout（服务端定价/PSP 跳转） | planned | `SPECS/zh-payment-refund.md` | 未做 | — |
| REQ-ZH-PAY-002 | ZH webhook + 解锁/幂等 | planned | `SPECS/zh-payment-refund.md` | 未做 | — |
| REQ-ZH-PAY-003 | 退款/访问撤销/客服 | planned | `SPECS/zh-payment-refund.md` | 未做 | — |

---

## 3. 日文（JA）

| ID | 需求 | 状态 | 文件 | 程序 | 测试 |
|---|---|---|---|---|---|
| REQ-JA-001 | 日文首页/诊断/结果 | implemented | `PRD-JA.md` | `app/ja` | `jp-*` |
| REQ-JA-002 | 恋爱鉴定书（无料） | implemented | `PRD-JA.md` | `app/ja/report`、`lib/jp/report.ts` | `jp-report` |
| REQ-JA-003 | 事业鉴定书（有料） | beta | `PRD-JA.md` | `app/ja/report`、`lib/jp/access.ts` | `jp-checkout` |
| REQ-JA-004 | AI 深掘り | beta | `PRD-SHARED.md` §4 | `components/jp/AiReading`、`/api/ja/interpret` | `jp-llm` |
| REQ-JA-005 | checkout/webhook 骨架 | implemented | `PRICING.md` | `app/api/ja/checkout`、`webhook` | `jp-checkout` |
| REQ-JA-006 | 实际 PSP 接続 | planned | `PRICING.md` | 未做 | — |
| REQ-JA-007 | 法务实数据 | planned | `content/TONE-AND-CLAIMS.md` | `app/ja/legal` | — |

---

## 4. 法务／合规

| ID | 需求 | 状态 | 备注 |
|---|---|---|---|
| REQ-LEGAL-001 | 特商法营运主体信息 | planned | 目前「准备中」 |
| REQ-LEGAL-002 | 真实客服信箱 | planned | 目前 `support@example.com` |
| REQ-LEGAL-003 | 退款政策最终版 | planned | 草稿已写 |
| REQ-LEGAL-004 | 日本律师确认 | planned | 收费前 |
| REQ-LEGAL-005 | 天纪语料商用边界 | planned | CC BY-NC-SA 4.0 |
| REQ-LEGAL-006 | AI 揭露与免责 | approved | 见 `TONE-AND-CLAIMS` |

---

## 5. 成长／分析

| ID | 需求 | 状态 | 备注 |
|---|---|---|---|
| REQ-GROW-001 | GA4 启用 | planned | `NEXT_PUBLIC_GA_ID` |
| REQ-GROW-002 | Search Console + sitemap | planned | 用户侧 |
| REQ-GROW-003 | 繁中页面浏览事件 | planned | 目前缺 |
| REQ-GROW-004 | 付款事件 | planned | 接 PSP 后 |
| REQ-GROW-005 | Threads 痛点研究 | approved | brief 已写 |
| REQ-GROW-006 | 电子报/CRM | proposed | 未做 |
| REQ-GROW-007 | 文章内链/CTA | proposed | 未做 |

---

## 6. 运维

| ID | 需求 | 状态 | 备注 |
|---|---|---|---|
| REQ-OPS-001 | VPS 升 2GB | planned | 目前 1GB |
| REQ-OPS-002 | secret 轮换 | planned | 曾出现在对话 |
| REQ-OPS-003 | Uptime 监控 | planned | `/api/health` |
| REQ-OPS-004 | Sentry | proposed | 未做 |
| REQ-OPS-005 | Caddy 移除 Netlify 插件 | planned | `Caddyfile` 已 HTTP-01，但 Dockerfile.caddy 仍带 plugin |
