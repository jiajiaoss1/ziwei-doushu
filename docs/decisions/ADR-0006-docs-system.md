# ADR-0006 文件系统

- 日期：2026-11-21
- 状态：Accepted
- 批准人：负责人

## 背景

多个 AI 交替接手，每次都要重读 code、猜产品意图，导致方向漂移、重复讨论。

## 决定

1. 文件正文用**简体中文**；结构 ID/状态/文件名用英文；目标市场文案示例保留繁中/日文原文。
2. PRD 拆分：`PRD-SHARED.md` + `PRD-ZH.md` + `PRD-JA.md`（未来 ko/vi 各一份）。
3. 根目录 `AGENTS.md` 放短指针，完整规则在 `docs/ai/AGENT-CONTRACT.md`。
4. 旧文件一次性迁移到新结构；废弃的放 `archive/`。
5. 策略决策由 Owner 批准，写 ADR；AI 只给建议。
6. Docs-first：用户可见变更先改 PRD/SPEC，再改 code。
7. 每次工作结束更新 `HANDOVER` 时间线。

## 后果

- 文件成为唯一真相，code 不是意图来源
- 新 AI 有固定阅读路径
- 文件维护成本上升，但可避免重复摸索
