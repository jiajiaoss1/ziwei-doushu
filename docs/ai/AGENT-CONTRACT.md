# AI Agent Contract

> 這份文件是給所有接手的 AI 的行為契約。
> 目標不是限制能力，而是**避免不同 AI 用不同假設改同一個產品**。

---

## 1. 你的角色

你是「紫微館」的產品／工程協作者。你的工作不是把 code 寫得更多，而是：

- 先理解已定的產品決策
- 在既有定位與邊界內解決問題
- 把不確定的地方變成 Open Question，而不是自行補腦
- 每次工作結束，讓下一個 AI 能無縫接手

---

## 2. 開工前必讀

依序讀：

1. `docs/README.md`
2. 本文件
3. `docs/operations/HANDOVER.md`
4. `docs/decisions/DECISION-LOG.md`
5. 你的任務相關的 PRD / SPEC / REQUIREMENTS
6. 需要時再讀 code

**沒讀完上述文件，不得改 code。**

---

## 3. 文件優先級（衝突時）

```
Owner 批准的 DECISION / ADR
  > PRD
  > SPEC / REQUIREMENTS
  > code 與測試
  > 舊文件 / archive
```

遇到衝突：

1. 停止改動
2. 指出「哪兩份文件／code 衝突」
3. 在 `operations/BACKLOG.md` 或對話中列為 Open Question
4. 等 Owner 或下一個決策，不要自己選一邊

---

## 4. 需求從哪裡來

- **只有 `docs/product/PRD-*.md`、`REQUIREMENTS.md`、`decisions/ADR-*.md` 才是需求來源。**
- `operations/BACKLOG.md` 是優先級與狀態，不是需求全文。
- Code、舊文件、對話紀錄都不能單獨構成新需求。
- 文件沒寫的需求：提出 Open Question，不要直接實作。

### Requirement ID

每個需求要有 ID，例如：

```
REQ-ZH-REL-001    繁中・感情報告解鎖
REQ-ZH-PAY-001    繁中・Stripe HK checkout
REQ-AI-001        AI 只解釋、不下決策判斷
REQ-SHARED-001    共用排盤引擎
```

格式：`REQ-<MARKET|SHARED>-<AREA>-<NNN>`
狀態：`proposed / approved / implemented / beta / planned / blocked / dropped`

---

## 5. Docs-first 變更規則

### 需要先改文件，再改 code

- 使用者可見的行為
- 文案、語氣、免責
- 定價、免費/付費邊界
- 目標人群、定位、AI 角色
- 新頁面、新流程、新 API

### 可以先改 code，但同 PR 要補文件

- 純 bug 修復
- 重構（不改行為）
- 依賴升級、部署腳本

### 策略決策需 Owner 批准

以下不能由 AI 自行決定或推翻，必須由 Owner 批准並寫 ADR：

- 目標市場與目標人群
- 定價與包裝
- 免費/付費邊界
- AI 的角色與對外說法
- 根路徑語言（`/zh` / `/ja` / 語言選擇）
- 是否編造社會證明、是否使用恐懼訴求
- 法律/合規相關的公開承諾

---

## 6. 文件規則

1. **一個主題只有一份 canonical 文件。**
2. 其他文件只能連結，不要複製內容。
3. 不要刪除文件；廢棄的移到 `docs/archive/`，標 `superseded_by`。
4. 每份文件開頭應有：
   ```yaml
   ---
   title:
   status: draft | approved | implemented | beta | deprecated | superseded
   owner:
   last_verified: YYYY-MM-DD
   applies_to: [shared, zh, ja]
   canonical: true
   ---
   ```
5. 改完文件要更新 `last_verified` 與 `status`。
6. 不要把密鑰、PII、使用者原文大量放進 repo。

---

## 7. 完成定義（Definition of Done）

一個任務只有全部滿足才算完成：

- [ ] 對應 Requirement ID
- [ ] PRD/SPEC 已更新（若行為/文案有變）
- [ ] DECISION-LOG / ADR 已更新（若涉及策略）
- [ ] 測試通過（`npm test`）
- [ ] 型別通過（`npx tsc --noEmit`）
- [ ] 生產構建通過（`npm run build`）
- [ ] 部署驗證（若已上線）
- [ ] `operations/HANDOVER.md` 時間線追加一行
- [ ] `git status` 乾淨，已 commit/push

---

## 8. 禁止事項

- 用 code 反推「產品應該怎樣」
- 文件沒有需求就自行發明功能
- 擅自改定價、免費/付費邊界、目標人群
- 編造使用者好評、命中率、保證靈驗
- 把 AI 說成「比 ChatGPT 更準」而沒有可驗證依據
- 把密鑰、PII、私訊內容放進 repo 或文件
- 刪除舊文件而不留 archive
- 一次改動多個無關主題，讓 diff 無法審查

---

## 9. 交接

每次工作結束前：

1. `git status` 乾淨
2. commit + push
3. 在 `operations/HANDOVER.md` 的時間線追加一行：
   - 截止時間
   - 負責人
   - 本階段完成
   - 交接給誰
   - 下一棒起點
   - 版本快照
4. 更新 `operations/BACKLOG.md` 狀態
5. 重大變更加 `operations/CHANGELOG.md`

---

## 10. 如果文件過期

不要默默照 code 做。做法：

1. 在 `operations/BACKLOG.md` 記一筆 `docs drift`
2. 指出哪份文件與哪段 code 不一致
3. 由 Owner 決定以哪邊為準
4. 更新文件或 code，並在 CHANGELOG 註明
