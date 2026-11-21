---
title: 决策索引
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared]
canonical: true
---

# 决策索引（Decision Log）

> 任何策略决策都要有 ADR。
> 没有新 ADR，不得推翻旧决策；要改，先问 Owner。

| ID | 决策 | 状态 | 日期 |
|---|---|---|---|
| ADR-0001 | 根路径 `/` → `/zh`（港台优先） | Accepted | 2026-11-21 |
| ADR-0002 | 港台定价 NT$680 / NT$980；日本 ¥2,980 / ¥4,980 | Accepted（ZH 部分被 0007 取代） | 2026-11-21 |
| ADR-0003 | AI 是受命盘事实约束的解读层，不是自由算命师 | Accepted | 2026-11-21 |
| ADR-0004 | 繁中感情/事业都付费；日文恋爱免费、事业付费 | Accepted（ZH 部分被 0007 取代） | 2026-11-21 |
| ADR-0005 | VPS + west.cn DNS + Caddy HTTP-01；Netlify 废止 | Accepted | 2026-11-21 |
| ADR-0006 | 文件系统：中文主语言、英文 ID、共享+分市场 PRD | Accepted | 2026-11-21 |
| ADR-0007 | ZH 首发：婚姻关系决策 × 已试过命理者；单 SKU 關係決策書 | Accepted | 2026-11-21 |

## 待决（Open Decisions）

| 主题 | 状态 | 备注 |
|---|---|---|
| 是否加 NT$299 入门款 | Proposed | 未定；当前只做 NT$680/980 单 SKU |
| 免费 AI 是否限制为解释型 | Proposed（方向已写入 ADR-0003） | 待实现 |
| 日文版是否重回 `/` 或加语言选择 | Proposed | 目前 `/` → `/zh` |
