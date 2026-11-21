---
title: 頁面地圖
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared, zh, ja]
canonical: true
---

# 頁面地圖

> 所有路由、目的、index/noindex、主要 CTA。
> 新增頁面或改路由，先更新這裡，再改 `next.config.js` / `app/*`。

## 1. 入口

| 路由 | 行為 |
|---|---|
| `/` | 307 → `/zh`（host: shibikan.com / www） |
| `/zh` | 繁中首頁 |
| `/ja` | 日文首頁 |
| `/api/health` | `{"ok":true}` |

> 根路徑固定 `/zh`；日文版不是預設入口。改這個要 ADR。

## 2. 繁中 `/zh`

| 路由 | 目的 | index | 主要 CTA |
|---|---|---|---|
| `/zh` | 首頁：Hero、結果範例、信任、價格、FAQ | ✅ | 免費診斷 |
| `/zh/shindan` | 表單：煩惱/情境、生日、時辰、縣市 | ✅ | 產生結果 |
| `/zh/result` | 結果：共情、命盤、免費解讀、AI、報告入口 | ❌ noindex | 看報告 / AI |
| `/zh/report` | 報告：感情/事業，β 全文 | ❌ noindex | 解鎖/付款 |
| `/zh/aishou` | 相性表單 | ✅ | 產生相性 |
| `/zh/aishou/result` | 相性結果 | ❌ noindex | 回診斷 |
| `/zh/2027` | 2027 丁未年專題 | ✅ | 免費診斷 |
| `/zh/articles` | 文章列表 | ✅ | 閱讀 |
| `/zh/articles/[slug]` | 6 篇文章 | ✅ | 免費診斷 |
| `/zh/legal/privacy` | 隱私 | ✅ | — |
| `/zh/legal/terms` | 使用條款 | ✅ | — |
| `/zh/legal/tokushoho` | 交易條款 | ✅ | — |
| `/zh/not-found` | 404 | — | 回首頁 |

## 3. 日文 `/ja`

| 路由 | 目的 | index | 主要 CTA |
|---|---|---|---|
| `/ja` | 首頁 | ✅ | 無料診断 |
| `/ja/shindan` | 表單 | ✅ | 結果 |
| `/ja/result` | 結果 | ❌ noindex | 鑑定書 / AI |
| `/ja/report` | 戀愛/事業報告 | ❌ noindex | 解鎖/付款 |
| `/ja/checkout` | 購買頁 | ❌ noindex | 決済/無料 |
| `/ja/aishou` | 相性表單 | ✅ | 結果 |
| `/ja/aishou/result` | 相性結果 | ❌ noindex | — |
| `/ja/2027` | 2027 | ✅ | 診断 |
| `/ja/articles` | 文章列表 | ✅ | 閱讀 |
| `/ja/articles/[slug]` | 6 篇 | ✅ | 診断 |
| `/ja/legal/*` | 法務 | ✅ | — |
| `/ja/not-found` | 404 | — | — |

## 4. API

| 路由 | 用途 | 狀態 |
|---|---|---|
| `/api/health` | 健康檢查 | implemented |
| `/api/zh/interpret` | 繁中 AI | beta |
| `/api/ja/interpret` | 日文 AI | beta |
| `/api/ja/checkout` | 日文 checkout | skeleton |
| `/api/ja/webhook` | 日文 webhook | skeleton |
| `/api/zh/checkout` | 繁中 checkout | **未做** |
| `/api/zh/webhook` | 繁中 webhook | **未做** |

## 5. 已知頁面問題

- 繁中結果頁的報告卡沒有價格
- 繁中報告頁的鎖定區寫死事業價格/連結
- 繁中報告頁切換類型會丟失 `w`/`s`
- 繁中 AI 免費問答可能替代付費報告
- 繁中頁面瀏覽事件缺失
- 日文 checkout 仍是骨架

## 6. 變更規則

- 新增/刪除路由：更新本文件 + `next.config.js` + sitemap（若 index）
- 所有結果/報告/購買頁預設 `noindex`
- 行銷頁、文章、法務頁才 index
- 不要讓兩個市場互相 redirect（除根路徑）
