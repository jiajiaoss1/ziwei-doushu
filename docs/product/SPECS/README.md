# SPECS

每個付費/核心功能一份 SPEC，檔名 `<market>-<feature>.md`，例如：

- `zh-paid-report.md`
- `zh-checkout.md`
- `shared-ai-reading.md`

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

## 1. 目標用戶 / 問題
## 2. 範圍（做 / 不做）
## 3. 流程
## 4. 文案
## 5. 邊界與錯誤
## 6. 指標
## 7. 測試
## 8. 上線計畫
```

規則：

- 沒有 Requirement ID 不開 SPEC
- 沒有 Owner 批准不從 draft 轉 approved
- 改行為先改 SPEC，再改 code
