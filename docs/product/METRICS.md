---
title: 指标与漏斗
status: draft
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared, zh, ja]
canonical: true
---

# 指标与漏斗

> 没有指标，就没有产品迭代；只有感觉。
> 目前 GA4 尚未确认启用，页面浏览事件也不完整，以下同时标「应有」与「现有」。

---

## 1. 北极星（暂定）

**每周完成的付费报告数**（β 期间用「完整报告阅读数」替代）。

理由：它同时反映流量、诊断完成、报告吸引力、付款信任。

> 尚未用数据验证；等 GA4/付款上线后再定。

---

## 2. 漏斗

```text
入口曝光
  → 进入诊断 /zh/shindan
  → 完成诊断（产生结果）
  → 结果页阅读
  → 点击报告
  → 报告页阅读
  → 点击付款
  → 完成付款
  → 开启报告
  → 7/30 天回访
```

### 各阶段指标

| 阶段 | 指标 | 定义 |
|---|---|---|
| 诊断 | 诊断完成率 | 进入 shindan → 成功产生 result |
| 结果 | 结果页到达率 | result_view / 诊断完成 |
| 结果 | 章节阅读深度 | 卷动/展开（待埋点） |
| 报告 | 报告点击率 | report 链接点击 / result_view |
| 报告 | 报告到达率 | report_view / 报告点击 |
| 付款 | 付款点击率 | checkout 点击 / report_view |
| 付款 | 付款完成率 | 付款成功 / checkout 点击 |
| 售后 | 退款率 | 退款 / 付款 |
| 回访 | 7/30 天回访 | 同一用户再次诊断/阅读 |

---

## 3. 现有事件

### 繁中 `/zh`

| 事件 | 位置 | 状态 |
|---|---|---|
| `zh_diagnosis_submit` | `BirthFormZh` | 已埋 |
| `zh_aishou_submit` | `PairFormZh` | 已埋 |
| `zh_ai_generate` | `AiReading` | 已埋 |
| 页面浏览（result/report/checkout） | — | **缺** |

### 日文 `/ja`

| 事件 | 位置 |
|---|---|
| `jp_diagnosis_submit` | 診断フォーム |
| `jp_result_view` | 結果ページ |
| `jp_report_view` | 鑑定書 |
| `jp_checkout_view` | 購入画面 |
| `jp_ai_generate` | AI |
| `jp_aishou_submit` / `jp_aishou_view` | 相性 |

### 问题

- 繁中页面浏览事件缺失，漏斗中段看不到
- GA4 是否已设置需确认（`NEXT_PUBLIC_GA_ID`）
- 事件属性（方案/价格/烦恼/情境）不完整
- 没有付款事件（尚未接 PSP）

---

## 4. 事件设计原则

1. 一个事件只代表一个行为
2. 属性用 snake_case
3. 不上传 PII（生日、姓名、精确地址）
4. 事件名称区分市场：`zh_*` / `ja_*`
5. 付款事件要带 `type`（love/work）、`price`、`currency`

---

## 5. 待补事件

- `zh_result_view`
- `zh_report_view`（带 `type`, `full`, `beta`）
- `zh_report_click`（从结果页）
- `zh_checkout_view`
- `zh_checkout_click`
- `zh_purchase`（付款成功）
- `zh_unlock_view`（带 token 解锁）
- `zh_share`（相性/结果分享）

---

## 6. 分析节奏

- 每周看：诊断完成率、报告点击率、AI 使用率
- 每月看：付款转化、退款、回访、通路来源
- 每次改版前：先定义要看哪个指标，避免「改完不知道有没有用」

---

## 7. Open Questions

1. 北极星用「付款数」还是「完整报告阅读数」？
2. 是否要追踪「免费 → 付费」的同一个用户？（目前无账号）
3. 是否接受 Cookie/GA4？法务页要更新到什么程度？
4. 退款率多少算异常？
