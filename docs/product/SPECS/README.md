# SPECS

每个付费/核心功能一份 SPEC，文件名 `<market>-<feature>.md`，例如：

- `zh-paid-report.md`
- `zh-checkout.md`
- `shared-ai-reading.md`

## 现有 SPEC

| 文件 | 需求 | 状态 |
|---|---|---|
| `zh-decision-report.md` | REQ-ZH-012 | approved |
| `zh-home-selfcheck.md` | REQ-ZH-013 | approved |

## SPEC 模板

```md
---
title:
requirement_id: REQ-XX-...
status: draft
owner:
last_verified:
---

# SPEC: 功能名

## 1. 目标用户 / 问题
## 2. 范围（做 / 不做）
## 3. 流程
## 4. 文案
## 5. 边界与错误
## 6. 指标
## 7. 测试
## 8. 上线计划
```

规则：

- 没有 Requirement ID 不开 SPEC
- 没有 Owner 批准不从 draft 转 approved
- 改行为先改 SPEC，再改 code
