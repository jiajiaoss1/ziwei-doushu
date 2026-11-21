---
title: 研究資料
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared, zh, ja]
canonical: true
---

# 研究資料

> 研究的目的不是「證明命理準」，而是理解使用者的決策、語言、購買阻力。

## 1. 規則

- 只收集公開資料；不碰私訊/非公開社群
- 原始資料（URL/原文）放 `research/data/raw/`，**不進 Git**
- 對外報告要匿名化、摘要化，不大量轉載
- 遵守平台條款/頻率限制，不繞過登入/CAPTCHA
- 每份研究要寫：樣本、搜尋詞、期間、限制

## 2. 目前研究

| 文件 | 狀態 | 用途 |
|---|---|---|
| `threads-pain-points-brief.md` | approved | Threads 痛點/購買動機 |
| `threads-pain-points-findings.md` | 待產出 | 研究結論 |

## 3. 新增研究

1. 在 `research/` 建 `<topic>-brief.md`
2. 用 `AGENT-CONTRACT` 的規則，寫清任務/樣本/欄位/交付物
3. 執行後建 `<topic>-findings.md`
4. 把結論回寫到 `product/POSITIONING.md` / `PRD-*.md`
5. 在 `operations/CHANGELOG.md` 記一筆

## 4. 研究結論的用法

- 只能用來**支持/修正假設**，不是直接當需求
- 要能回答「這會改變哪個決策？」
- 不要用單一爆款貼文代表整個市場
