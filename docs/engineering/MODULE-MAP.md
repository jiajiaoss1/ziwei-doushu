---
title: 模块地图与依赖规则
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared, zh, ja]
canonical: true
---

# 模块地图与依赖规则

> 目的：让 AI 改一个功能前，知道它会影响到哪些市场、哪些测试、哪些禁止依赖。
> 本文基于 2026-11-21 的实际 import 关系，不是目标态。

---

## 1. 分层

```text
app/zh/*        app/ja/*        app/api/zh/*     app/api/ja/*
     │               │                │               │
     ▼               ▼                ▼               ▼
components/zh   components/jp    lib/zh/*         lib/jp/*
     │               │                │               │
     └───────────────┴────────────────┴───────────────┘
                             │
                             ▼
                       lib/ziwei/*
                   （排盘/历法/格局，共享核心）
```

`lib/site.ts`、`lib/ziwei/*` 是共享层；`lib/zh` / `lib/jp` 是市场层。

---

## 2. 模块职责

| 模块 | 职责 | 允许依赖 | 禁止 |
|---|---|---|---|
| `lib/ziwei` | 排盘、历法、四化、格局、真太阳时 | 外部算法库 | 不得 import `lib/zh` / `lib/jp` / `components` / `app` |
| `lib/zh` | 繁中 facts/解读/报告/相性/文案 | `lib/ziwei`、`lib/zh` | 不得 import `lib/jp`（当前有例外，见 §4） |
| `lib/jp` | 日文 facts/解读/报告/相性/文案 + AI/支付骨架 | `lib/ziwei`、`lib/jp` | 不得 import `lib/zh` |
| `components/zh` | 繁中表单/命盘/AI/页头页脚 | `lib/zh`、`lib/ziwei` | 不得自己算盘、不得 import `lib/jp` |
| `components/jp` | 日文表单/命盘/AI/页头页脚 | `lib/jp`、`lib/ziwei` | 不得自己算盘、不得 import `lib/zh` |
| `app/zh` | 繁中页面组合 | `lib/zh`、`components/zh`、`lib/ziwei` | 不得写另一市场的文案 |
| `app/ja` | 日文页面组合 | `lib/jp`、`components/jp`、`lib/ziwei` | 不得写另一市场的文案 |
| `app/api/zh` | 繁中 AI API | `lib/zh`、共享 AI/安全模块 | 不得 import `lib/jp/facts` |
| `app/api/ja` | 日文 AI/支付 API | `lib/jp`、共享 AI/安全模块 | 不得 import `lib/zh/facts` |

---

## 3. 高风险模块

| 模块 | 为什么高风险 | 改动要求 |
|---|---|---|
| `lib/ziwei/algorithm.ts` | 排盘错 → 所有市场全错 | 金标准盘 + 全量测试 |
| `lib/ziwei/patterns.ts` | 格局错 → 文案/报告全错；含 `server-only` | `--conditions=react-server` 测试 |
| `lib/ziwei/true-solar-time.ts` | 时辰错 → 命盘整体偏 | 边界时刻测试 |
| `lib/jp/access.ts` | 解锁/定价；繁中也用 | 支付测试 + 两市场回归 |
| `lib/jp/checkout.ts` | 订单 token/webhook | 安全测试 + 手动验证 |
| `lib/jp/llm-guard.ts` | AI 成本/限流 | 429/日限测试 |
| `lib/zh/report.ts` / `lib/jp/report.ts` | 付费内容 | 内容回归 + 人工读 |

---

## 4. 当前实际跨市场依赖（技术债）

以下不是“允许”，是**现状**，改动时要小心：

| 文件 | 依赖 | 原因 | 目标 |
|---|---|---|---|
| `lib/zh/llm.ts` | `lib/jp/access`（仅 type） | 复用 `PaidReportType` | 抽到 `lib/shared/types` |
| `app/zh/result/page.tsx` | `lib/jp/access`、`lib/jp/ai-token`、`lib/jp/llm` | AI/解锁基础设施在 jp 下 | 抽到 `lib/shared/{ai,security}` |
| `app/zh/report/page.tsx` | `lib/jp/access` | 解鎖/β 判斷 | 同上 |
| `app/api/zh/interpret/route.ts` | `lib/jp/access`、`ai-token`、`llm`、`llm-guard`、`rate-limit` | 共享 AI 护栏 | 抽到 `lib/shared/ai` |
| `app/api/ja/*` | `lib/jp/*` | 本市场 | 保持 |

### 例外

- `app/sitemap.ts` 同时 import `lib/zh/articles` 和 `lib/jp/articles`：站点地图需要两个市场，合理例外。
- `components/zh/BirthFormZh.tsx` / `components/jp/BirthFormJa.tsx` import `lib/ziwei/true-solar-time`：共享时间工具，允许。

### 目标重构（不要现在做）

```text
lib/shared/
  ai/          llm.ts, llm-guard.ts, rate-limit.ts, ai-token.ts
  security/    unlock?（与支付相关）
  payment/     checkout.ts, access.ts
  types/       PaidReportType
```

重构前需要 ADR；现在只记录，不动。

---

## 5. 改动影响矩阵

| 你改什么 | 影响 |
|---|---|
| `lib/ziwei/algorithm.ts` | 两个市场全部命盘/报告/测试 |
| `lib/ziwei/patterns.ts` | 两个市场格局、报告、AI digest |
| `lib/zh/glossary.ts` | 仅繁中 |
| `lib/jp/glossary.ts` | 仅日文 |
| `lib/{zh,jp}/facts.ts` | 本市场 + AI digest + 报告 |
| `lib/jp/access.ts` | 日文解锁 + 繁中解锁（现状） |
| `components/{zh,jp}` | 本市场 UI |
| `app/api/*/interpret` | 本市场 AI + 共享护栏 |

---

## 6. 规则

1. 改共享层前，先确认两个市场都要改；不要为单市场改引擎。
2. 市场层不得 import 另一市场的 facts/文案。
3. 组件不得自己算盘；必须走 `lib/{zh,jp}/birth` + `lib/ziwei`。
4. API 不得绕过 AI 护栏（origin/token/限流/日限）。
5. 新增跨市场依赖必须：
   - 在本文登记
   - 说明为什么不能放共享层
   - 加测试
6. 新市场先复用 `lib/ziwei`，不要复制引擎。

---

## 7. 未来可选 enforcement

- ESLint `no-restricted-imports` 规则
- CI import graph check
- 模块边界测试

现在先人工遵守；不要为了 enforcement 引入大依赖。

---

## 8. 相关文件

- `engineering/ARCHITECTURE.md`
- `domain/DOMAIN-MODEL.md`
- `domain/CONTENT-PIPELINE.md`
- `engineering/TESTING.md`
