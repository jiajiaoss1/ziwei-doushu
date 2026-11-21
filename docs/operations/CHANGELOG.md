---
title: 變更記錄
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared]
canonical: true
---

# 變更記錄

> 只記「產品/架構/流程」級變更，不逐條列 commit。
> 詳細歷史用 `git log`。

## 2026-11-21

- **文件系統重構**：新增索引、AI 合約、工作方法、共享/分市場 PRD、需求矩陣、ADR、backlog、handover；舊文件移到 `archive/`
- 新增 `AGENTS.md` 根目錄指針
- 新增 Threads 痛點研究 brief
- 根路徑 `/` → `/zh`
- 繁中版完整（首頁/診斷/結果/報告/相性/2027/文章/法務）
- 產品化：煩惱入口 + 情境、結果頁共情、章節排序、報告信件語氣、信任區塊、AI 問答
- 港台定價：NT$680 / NT$980（HKD160/230）
- 課金骨架：AES-GCM order token、webhook HMAC、HMAC unlock
- Caddy 改 HTTP-01；DNS 切西部数码

## 2026-11-18

- 日文版格局翻譯終審（定貴局/定富局）
- CI 加生產構建
- AI 成本護欄（每日 1000 / IP 20）
- Netlify → 西部数码 DNS

## 2026-11-16

- 日文版上線 VPS
- 第2版校閲反映：空宮借對宮、簡體字修正、法務/隱私文案
- 新增 `jp-report` / `jp-edge` 回歸

## 2026-11-15

- 繁中/日文雙語架構開始
- 日文版初版（首頁/診斷/結果/報告/相性/2027/文章）
