---
title: 内容生成 Pipeline
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared, zh, ja]
canonical: true
---

# 内容生成 Pipeline

> 从「用户输入」到「结果页/报告」的完整资料流。
> 这份文件回答：哪些是算的、哪些是写的、哪些是 AI、改文案要动哪里。

---

## 1. 总览

```mermaid
flowchart TD
  A[首页 / 表单 / 相性] --> B[URL 参数]
  B --> C[birth.ts<br/>时区・真太阳时・晚子时]
  C --> D[generateChart<br/>lib/ziwei/algorithm.ts]
  D --> E[iztro<br/>宫位・主星・四化・大限]
  D --> F[lunar-javascript<br/>农历・节气・干支]
  E --> G[facts.ts<br/>buildZhFacts / buildJpFacts]
  F --> G
  G --> H[glossary.ts<br/>星名・宫位・四化・格局]
  G --> I[interpret.ts<br/>免费解读]
  G --> J[report.ts<br/>付费报告]
  G --> K[compat.ts<br/>相性]
  I --> L[app/zh/result<br/>app/ja/result]
  J --> M[app/zh/report<br/>app/ja/report]
  K --> N[aishou/result]
  L --> O[AiReading]
  O --> P[/api/zh/interpret<br/>/api/ja/interpret]
  P --> Q[llm.ts<br/>prompt + facts digest]
  Q --> R[DeepSeek API]
```

---

## 2. 两市场的文件对应

| 层 | 繁中 `/zh` | 日文 `/ja` |
|---|---|---|
| 出生信息 | `lib/zh/birth.ts`、`cities.ts` | `lib/jp/birth.ts`、`cities.ts` |
| 排盘 | `lib/ziwei/algorithm.ts`（共用） | 同左 |
| facts | `lib/zh/facts.ts` | `lib/jp/facts.ts` |
| 词库/文案 | `lib/zh/glossary.ts` | `lib/jp/glossary.ts` |
| 免费解读 | `lib/zh/interpret.ts` | `lib/jp/interpret.ts` |
| 报告 | `lib/zh/report.ts` | `lib/jp/report.ts` |
| 相性 | `lib/zh/compat.ts` | `lib/jp/compat.ts` |
| 页面 | `app/zh/*` | `app/ja/*` |
| 元件 | `components/zh/*` | `components/jp/*` |
| AI prompt | `lib/zh/llm.ts` | `lib/jp/llm.ts` |
| AI API | `app/api/zh/interpret` | `app/api/ja/interpret` |

**不要跨市场 import 文案**；只共用 `lib/ziwei/*`。

---

## 3. 哪些是确定的

同一出生信息 + 同一年 + 同一版 code：

- 命宫位置、主星、庙旺利陷
- 四化落宫
- 大限起止、流年干支
- 夫妻/官禄/财帛的星
- 格局判定（显示与排序另由 facts/glossary 决定）

## 4. 哪些是手写模板

- 星曜性格/感情/工作/金钱描述：`glossary.ts`
- 免费解读段落：`interpret.ts`
- 报告章节与语气：`report.ts`
- 相性段落：`compat.ts`
- 文章、2027、法务：`articles.ts` / `app/zh/2027` / `legal`

## 5. 哪些是 LLM

- 结果页「AI 深掘/问答」的文字
- 只根据 facts digest + system prompt
- 不是命盘计算的一部分
- 目前繁中/日文都启用（DeepSeek），但可通过 `JP_LLM_API_KEY` 关闭

### 已知限制

1. `buildZhFactsDigest` 只给部分宫位/主星，没有全部 12 宫/煞星/吉星
2. AI API 以 `new Date().getFullYear()` 取流年，忽略用户选的年份
3. 每次生成措辞可能不同；不是 deterministic
4. 限流是进程内计数（单容器可用，多实例不足）

> 这些限制是 `REQUIREMENTS.md` 的 AI 相关需求来源。

---

## 6. 改文案要动哪里

| 想改 | 动这里 |
|---|---|
| 星曜性格/感情/工作/金钱 | `lib/{zh,jp}/glossary.ts` |
| 免费结果页段落 | `lib/{zh,jp}/interpret.ts` |
| 报告章节/语气 | `lib/{zh,jp}/report.ts` |
| 相性文案 | `lib/{zh,jp}/compat.ts` |
| 首页/表单/结果页 UI | `app/{zh,ja}/...`、`components/...` |
| AI prompt/边界 | `lib/{zh,jp}/llm.ts` |
| 命理规则 | `lib/ziwei/*` + 测试 |

改完必跑：

```bash
npx tsc --noEmit
npm test
npm run build
```

---

## 7. 与测试的关系

| 测试 | 保护什么 |
|---|---|
| `jp-birth` / `zh-content` | 时区/真太阳时/晚子时 |
| `jp-content` / `zh-content` | 词库/文案/命盘→解读 |
| `jp-report` | 空宫/简体字/缺落 |
| `jp-patterns` / `zh-patterns` | 格局/排序/出典（需 `--conditions=react-server`） |
| `jp-edge` | 大限/立春/春节/晚子时边界 |
| `jp-llm` / `jp-llm-guard` | AI 护栏 |
| `jp-checkout` | 订单 token/webhook |

---

## 8. 相关文件

- 命理规则：`domain/ASTROLOGY-RULES.md`
- 架构：`engineering/ARCHITECTURE.md`
- 测试：`engineering/TESTING.md`
- AI 质量：`ai/AI-EVALUATION.md`
- 旧版（日文）：`archive/` 无；本文件取代 `ja-content-pipeline.md`
