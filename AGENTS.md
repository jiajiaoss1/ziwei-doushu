# AGENTS.md

這個 repo 的產品與工程規則在 `docs/`，不在 code 裡。

## 先讀

1. `docs/README.md`
2. `docs/ai/AGENT-CONTRACT.md`
3. `docs/operations/HANDOVER.md`
4. 你的任務相關 PRD / SPEC / ADR

## 最重要的三條

1. **不要用 code 反推產品意圖。** 需求以 `docs/product/` 與 `docs/decisions/` 為準。
2. **使用者可見的變更，先改文件再改 code。** 文件沒有需求，只能提 Open Question，不要直接實作。
3. **策略決策（人群／定價／免費付費邊界／AI 角色）需 Owner 批准。** 不要自行推翻 ADR。

完整規則：`docs/ai/AGENT-CONTRACT.md`
工作方法：`docs/ai/WORKING-METHOD.md`
