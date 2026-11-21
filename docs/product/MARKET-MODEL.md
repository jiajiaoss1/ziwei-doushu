---
title: 市场模型（Market / Locale）
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared, zh, ja]
canonical: true
---

# 市场模型（Market / Locale）

> Market 决定商业、法规、支付、渠道；Locale 决定语言、术语、表达。
> 两者不能简单等同。当前产品只有 **一个 `/zh` 共用台港**，不要提前假装已经分市场。

---

## 1. 定义

| 概念 | 例子 | 决定什么 |
|---|---|---|
| Market | TW / HK / JP / KR / VN | 货币、定价、支付、法律主体、退款、渠道、路由/SEO |
| Locale | zh-TW / zh-HK / ja-JP / ko-KR / vi-VN | 语言、术语、语气、日期格式 |

一个 Market 可以用一个 Locale（JP → ja-JP），也可以共用一个 Locale（TW/HK → zh-Hant）。

---

## 2. 当前矩阵

| Market | Locale | 路由 | 时区 | 货币 | 价格 | 支付 | 法务主体 | 状态 |
|---|---|---|---|---|---|---|---|---|
| TW | zh-TW | `/zh`（共用） | UTC+8 | TWD | 感情 680 / 事业 980 | 未接 | 占位 | β |
| HK | zh-HK | `/zh`（共用） | UTC+8 | HKD | 感情 160 / 事业 230 | 未接 | 占位 | β |
| JP | ja-JP | `/ja` | UTC+9 | JPY | 恋爱 2,980 / 事业 4,980 | 骨架 | 占位 | β |
| KR | ko-KR | 未建 | UTC+9 | KRW | 未定 | 未接 | 未定 | 未开始 |
| VN | vi-VN | 未建 | UTC+7 | VND | 未定 | 未接 | 未定 | 未开始 |

> TW/HK 目前共用 `/zh`，不是 `/zh-TW` / `/zh-HK`；也没有独立法务/支付。
> 这是**当前实现**，不是长期目标。

---

## 3. 共享 / 市场 / Locale 的边界

### 共享（不能按市场改）

- 排盘引擎 `lib/ziwei/*`
- `BirthInfo` / `ZiweiChart` / `ChartFacts` 的结构
- 空宫、四化、大限、流年规则
- AI 的总政策（不得虚构事实、不得断定未来）
- 基础 UI 组件/设计语言

### Market 层（可以不同）

- 货币/价格/税
- 支付方式/PSP
- 法律主体/特商法/退款
- 路由/域名/SEO
- 时区/城市/都道府县
- 市场定位/渠道

### Locale 层（可以不同）

- 术语/翻译
- 语气/文案
- 日期/数字格式
- 文化适配

### 禁止

- 在 `lib/ziwei` 里写市场文案
- `lib/zh` 和 `lib/jp` 互相 import
- 为了一个市场改共享命理规则
- 把 TW/HK 的差异硬编码进共享 facts

---

## 4. 配置继承与覆盖

```text
Shared defaults
  → Market override（货币/法律/支付/路由）
    → Locale override（术语/语气）
```

规则：

1. 能共享的不要复制
2. 市场差异必须有文档 + 测试
3. 覆盖项要写清楚「为什么这个市场不同」
4. 不能用一个市场的假设覆盖另一个市场
5. 新增市场先写本文件，再写 PRD/代码

---

## 5. 新增市场检查清单

- [ ] 在本文加一行（Market/Locale/路由/时区/货币/支付/法务）
- [ ] 新建 `PRD-<MARKET>.md`（从 `PRD-TEMPLATE.md` 复制）
- [ ] 术语/语气：`GLOSSARY.md` / `TONE-AND-CLAIMS.md`
- [ ] 时区/城市：`lib/<market>/cities.ts` + birth.ts
- [ ] 定价：`lib/<market>/pricing.ts` 或 access
- [ ] 法务页：特商法/隐私/退款
- [ ] 支付：PSP/币种/退款
- [ ] 路由 + sitemap + hreflang（如果需要）
- [ ] 回归测试（内容/命盘/支付）
- [ ] 更新 `docs/README.md` 阅读路径

---

## 6. 现在不做的事

- 不把 TW/HK 拆成两个路由/两份 PRD（除非支付/法务真的分叉）
- 不建 `markets/TW.md`、`MARKET-HK.md` 这种空目录
- 不为 KR/VN 提前写空文档
- 不在共享层加 `if market === ...` 的文案分支

---

## 7. 待决问题

1. TW/HK 什么时候需要分路由/分法务/分支付？
2. 日本市场是否要回到更显眼的入口？
3. KR/VN 的优先级？
4. 是否要做 hreflang / 多语言子目录？
5. 香港公司/日本主体分别覆盖哪些市场？
