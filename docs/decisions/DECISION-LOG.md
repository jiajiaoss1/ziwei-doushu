---
title: 決策索引
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared]
canonical: true
---

# 決策索引（Decision Log）

> 任何策略決策都要有 ADR。
> 沒有新 ADR，不得推翻舊決策；要改，先問 Owner。

| ID | 決策 | 狀態 | 日期 |
|---|---|---|---|
| ADR-0001 | 根路徑 `/` → `/zh`（港台優先） | Accepted | 2026-11-21 |
| ADR-0002 | 港台定價 NT$680 / NT$980；日本 ¥2,980 / ¥4,980 | Accepted | 2026-11-21 |
| ADR-0003 | AI 是受命盤事實約束的解讀層，不是自由算命師 | Accepted | 2026-11-21 |
| ADR-0004 | 繁中感情/事業都付費；日文戀愛免費、事業付費 | Accepted | 2026-11-21 |
| ADR-0005 | VPS + west.cn DNS + Caddy HTTP-01；Netlify 廢止 | Accepted | 2026-11-21 |
| ADR-0006 | 文件系統：中文主語言、英文 ID、共享+分市場 PRD | Accepted | 2026-11-21 |

## 待決（Open Decisions）

| 主題 | 狀態 | 備註 |
|---|---|---|
| 先打「關係卡住」還是「轉職」 | Proposed | 等 Threads 研究/訪談 |
| 是否加 NT$299 入門款 | Proposed | 未定 |
| 免費 AI 是否限制為解釋型 | Proposed（方向已寫入 ADR-0003） | 待實作 |
| 付費報告是否改成「決策書」 | Proposed | 待 Owner |
| 日文版是否重回 `/` 或加語言選擇 | Proposed | 目前 `/` → `/zh` |
