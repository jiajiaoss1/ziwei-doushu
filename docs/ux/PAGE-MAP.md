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
| `/zh` | 首页：婚姻关系决策定位、6 部分、适合/不适合、价格、FAQ | ✅ | 关系决策自查 |
| `/zh/check` | 关系决策自查（4 步，只收年月日） | ❌ noindex | 看初步整理 |
| `/zh/check/result` | 自查结果（3 判断 + 1 建议） | ❌ noindex | 付费 CTA（准备中） |
| `/zh/decision` | Mock checkout（测试模式，不收款） | ❌ noindex | 模拟付款 |
| `/zh/sample` | 《關係決策書》虛構範例 | ✅ | 自查 |
| `/zh/shindan` | 旧诊断表单（legacy） | ✅ | 产生结果 |
| `/zh/result` | 旧结果页（legacy） | ❌ noindex | 看报告 / AI |
| `/zh/report` | 旧报告页（legacy） | ❌ noindex | 解锁/付款 |
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
| `/api/zh/checkout` | 繁中 mock checkout（不收款） | beta |
| `/api/zh/webhook` | 繁中 webhook | **未做** |

## 5. 已知页面问题

- 繁中结果页的报告卡没有价格
- 繁中报告页的锁定区写死事业价格/链接
- 繁中报告页切换类型会丢失 `w`/`s`
- 繁中 AI 免费问答可能替代付费报告
- 繁中页面浏览事件缺失
- `/zh/check` 结果依赖 sessionStorage；清除后需重新自查
- `/zh/decision` 是 mock checkout，真实支付未接
- 日文 checkout 仍是骨架

## 6. 变更规则

- 新增/删除路由：更新本文件 + `next.config.js` + sitemap（若 index）
- 所有结果/报告/购买页默认 `noindex`
- 营销页、文章、法务页才 index
- 不要让两个市场互相 redirect（除根路径）
