---
title: 页面地图
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared, zh, ja]
canonical: true
---

# 页面地图

> 所有路由、目的、index/noindex、主要 CTA。
> 新增页面或改路由，先更新这里，再改 `next.config.js` / `app/*`。

## 1. 入口

| 路由 | 行为 |
|---|---|
| `/` | 307 → `/zh`（host: shibikan.com / www） |
| `/zh` | 繁中首页 |
| `/ja` | 日文首页 |
| `/api/health` | `{"ok":true}` |

> 根路径固定 `/zh`；日文版不是默认入口。改这个要 ADR。

## 2. 繁中 `/zh`

| 路由 | 目的 | index | 主要 CTA |
|---|---|---|---|
| `/zh` | 首页：Hero、结果范例、信任、价格、FAQ | ✅ | 免费诊断 |
| `/zh/shindan` | 表单：烦恼/情境、生日、时辰、县市 | ✅ | 产生结果 |
| `/zh/result` | 结果：共情、命盘、免费解读、AI、报告入口 | ❌ noindex | 看报告 / AI |
| `/zh/report` | 报告：感情/事业，β 全文 | ❌ noindex | 解锁/付款 |
| `/zh/aishou` | 相性表单 | ✅ | 产生相性 |
| `/zh/aishou/result` | 相性结果 | ❌ noindex | 回诊断 |
| `/zh/2027` | 2027 丁未年专题 | ✅ | 免费诊断 |
| `/zh/articles` | 文章列表 | ✅ | 阅读 |
| `/zh/articles/[slug]` | 6 篇文章 | ✅ | 免费诊断 |
| `/zh/legal/privacy` | 隐私 | ✅ | — |
| `/zh/legal/terms` | 使用条款 | ✅ | — |
| `/zh/legal/tokushoho` | 交易条款 | ✅ | — |
| `/zh/not-found` | 404 | — | 回首页 |

## 3. 日文 `/ja`

| 路由 | 目的 | index | 主要 CTA |
|---|---|---|---|
| `/ja` | 首页 | ✅ | 无料诊断 |
| `/ja/shindan` | 表单 | ✅ | 结果 |
| `/ja/result` | 结果 | ❌ noindex | 鉴定书 / AI |
| `/ja/report` | 恋爱/事业报告 | ❌ noindex | 解锁/付款 |
| `/ja/checkout` | 购买页 | ❌ noindex | 决済/无料 |
| `/ja/aishou` | 相性表单 | ✅ | 结果 |
| `/ja/aishou/result` | 相性结果 | ❌ noindex | — |
| `/ja/2027` | 2027 | ✅ | 诊断 |
| `/ja/articles` | 文章列表 | ✅ | 阅读 |
| `/ja/articles/[slug]` | 6 篇 | ✅ | 诊断 |
| `/ja/legal/*` | 法务 | ✅ | — |
| `/ja/not-found` | 404 | — | — |

## 4. API

| 路由 | 用途 | 状态 |
|---|---|---|
| `/api/health` | 健康检查 | implemented |
| `/api/zh/interpret` | 繁中 AI | beta |
| `/api/ja/interpret` | 日文 AI | beta |
| `/api/ja/checkout` | 日文 checkout | skeleton |
| `/api/ja/webhook` | 日文 webhook | skeleton |
| `/api/zh/checkout` | 繁中 checkout | **未做** |
| `/api/zh/webhook` | 繁中 webhook | **未做** |

## 5. 已知页面问题

- 繁中结果页的报告卡没有价格
- 繁中报告页的锁定区写死事业价格/链接
- 繁中报告页切换类型会丢失 `w`/`s`
- 繁中 AI 免费问答可能替代付费报告
- 繁中页面浏览事件缺失
- 日文 checkout 仍是骨架

## 6. 变更规则

- 新增/删除路由：更新本文件 + `next.config.js` + sitemap（若 index）
- 所有结果/报告/购买页默认 `noindex`
- 营销页、文章、法务页才 index
- 不要让两个市场互相 redirect（除根路径）
