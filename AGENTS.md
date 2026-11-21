# AGENTS.md

这个 repo 的产品与工程规则在 `docs/`，不在 code 里。

## 先读

1. `docs/README.md`
2. `docs/ai/AGENT-CONTRACT.md`
3. `docs/operations/HANDOVER.md`
4. 你的任务相关 PRD / SPEC / ADR

## 最重要的三条

1. **不要用 code 反推产品意图。** 需求以 `docs/product/` 与 `docs/decisions/` 为准。
2. **用户可见的变更，先改文件再改 code。** 文件没有需求，只能提 Open Question，不要直接实现。
3. **策略决策（人群／定价／免费付费边界／AI 角色）需 Owner 批准。** 不要自行推翻 ADR。

完整规则：`docs/ai/AGENT-CONTRACT.md`
工作方法：`docs/ai/WORKING-METHOD.md`
