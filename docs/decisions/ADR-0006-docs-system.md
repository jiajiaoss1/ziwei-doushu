# ADR-0006 文件系統

- 日期：2026-11-21
- 狀態：Accepted
- 批准人：负责人

## 背景

多個 AI 交替接手，每次都要重讀 code、猜產品意圖，導致方向漂移、重複討論。

## 決定

1. 文件主語言：**中文**；結構 ID/狀態/檔名用英文。
2. PRD 拆分：`PRD-SHARED.md` + `PRD-ZH.md` + `PRD-JA.md`（未來 ko/vi 各一份）。
3. 根目錄 `AGENTS.md` 放短指針，完整規則在 `docs/ai/AGENT-CONTRACT.md`。
4. 舊文件一次性遷移到新結構；廢棄的放 `archive/`。
5. 策略決策由 Owner 批准，寫 ADR；AI 只給建議。
6. Docs-first：使用者可見變更先改 PRD/SPEC，再改 code。
7. 每次工作結束更新 `HANDOVER` 時間線。

## 後果

- 文件成為唯一真相，code 不是意圖來源
- 新 AI 有固定閱讀路徑
- 文件維護成本上升，但可避免重複摸索
