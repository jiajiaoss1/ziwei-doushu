# 紫微館 Docs — AI 與團隊的唯一入口

> 這份文件是整個倉庫的導航。**任何 AI 或新成員，先讀這一頁。**
> 文件主語言：**中文**；結構 ID、狀態、檔名用英文。使用者文案保留繁中／日文原文。
> 最後確認：2026-11-21

---

## 1. 現在是什麼狀態

| 項目 | 現狀 |
|---|---|
| 線上 | https://shibikan.com |
| 根路徑 | `/` → **307 `/zh`**（港台優先） |
| 市場 | 繁中 `/zh`（主推）、日文 `/ja` |
| 收費 | **β 全免費**；`JP_BETA_FREE=true` |
| 支付 | 只有骨架（order token / webhook / unlock），**未接真實 PSP** |
| AI | DeepSeek，SSE；有 origin/token/限流/日次成本護欄 |
| 部署 | Vultr Tokyo VPS + Docker Compose + Caddy（HTTP-01） |
| 程式 | Next.js 16 + TypeScript + React 19；`lib/ziwei/*` 共用引擎 |

更完整的交接：`operations/HANDOVER.md`。

---

## 2. 如果你是新接手的 AI

**按這個順序讀，不要先讀 code：**

1. `ai/AGENT-CONTRACT.md` — 你必須遵守的規則
2. `operations/HANDOVER.md` — 上一棒做到哪、下一棒從哪開始
3. `product/PRD-SHARED.md` — 共同產品定義
4. `product/PRD-ZH.md` 或 `product/PRD-JA.md` — 你要動的市場
5. `decisions/DECISION-LOG.md` — 已定的事，不要推翻
6. `operations/BACKLOG.md` — 現在優先做什麼
7. 跟你任務相關的 spec / domain 文件

> 如果你讀到的文件和 code 不一致：**先停下來，回報衝突**，不要用 code 反推產品意圖。

---

## 3. 按任務的最小閱讀集

| 你要做的事 | 先讀 |
|---|---|
| 改繁中頁面／文案 | `product/PRD-ZH.md` → `product/POSITIONING.md` → `content/TONE-AND-CLAIMS.md` → `ux/PAGE-MAP.md` |
| 改日文頁面／文案 | `product/PRD-JA.md` → `content/TONE-AND-CLAIMS.md` → `ux/PAGE-MAP.md` |
| 改付費／定價／解鎖 | `product/PRICING.md` → `product/REQUIREMENTS.md` → `decisions/DECISION-LOG.md` → `engineering/SECURITY.md` |
| 改 AI 解讀 | `domain/ASTROLOGY-RULES.md` → `domain/CONTENT-PIPELINE.md` → `product/PRD-SHARED.md` |
| 改命理規則／格局 | `domain/ASTROLOGY-RULES.md` → `domain/CONTENT-PIPELINE.md` → `engineering/TESTING.md` |
| 部署／排查 | `engineering/DEPLOY.md` → `engineering/ARCHITECTURE.md` |
| 做研究 | `research/README.md` → 對應 brief |
| 產品規劃 | `product/PRD-*.md` → `product/REQUIREMENTS.md` → `operations/BACKLOG.md` → `product/METRICS.md` |

---

## 4. 文件地圖

| 文件 | 用途 | 狀態 |
|---|---|---|
| `ai/AGENT-CONTRACT.md` | AI 行為規則 | canonical |
| `ai/WORKING-METHOD.md` | 我們怎麼持續迭代 | canonical |
| `product/PRD-SHARED.md` | 共同產品定義、AI 政策、合規 | canonical |
| `product/PRD-ZH.md` | 港台市場 PRD | canonical |
| `product/PRD-JA.md` | 日本市場 PRD | canonical |
| `product/PRD-TEMPLATE.md` | 新市場 PRD 模板（ko/vi） | template |
| `product/SPECS/` | 功能 SPEC 與模板 | canonical |
| `product/REQUIREMENTS.md` | 已實現／β／計劃／放棄的需求矩陣 | canonical |
| `product/POSITIONING.md` | 目標人群、JTBD、痛點、差異化 | draft |
| `product/PRICING.md` | 定價、包裝、免費/付費邊界 | canonical |
| `product/METRICS.md` | 漏斗與事件定義 | draft |
| `domain/ASTROLOGY-RULES.md` | 流派、術語、邊界、空宮/流年規則 | canonical |
| `domain/CONTENT-PIPELINE.md` | 命盤→facts→文案→AI 的資料流 | canonical |
| `domain/GLOSSARY.md` | 中日術語對照 | canonical |
| `ux/PAGE-MAP.md` | 路由、頁面目的、index/noindex | canonical |
| `content/TONE-AND-CLAIMS.md` | 語氣、禁用斷言、AI 揭露 | canonical |
| `engineering/ARCHITECTURE.md` | 技術架構與資料流 | canonical |
| `engineering/DEPLOY.md` | VPS 部署與運維 | canonical |
| `engineering/TESTING.md` | 測試策略與 CI | canonical |
| `engineering/SECURITY.md` | 密鑰、限流、支付安全 | canonical |
| `decisions/DECISION-LOG.md` | 決策索引 | canonical |
| `decisions/ADR-*.md` | 單一決策記錄 | canonical |
| `decisions/ADR-TEMPLATE.md` | 新 ADR 模板 | template |
| `operations/BACKLOG.md` | 唯一待辦 | canonical |
| `operations/HANDOVER.md` | 交接與時間線 | canonical |
| `operations/CHANGELOG.md` | 重大變更 | canonical |
| `research/README.md` | 研究資料規範 | canonical |
| `research/threads-pain-points-brief.md` | Threads 調研 brief | approved |
| `archive/` | 被取代的舊文件 | superseded |
| `tianji-ziwei/` | 天紀語料（參考，非產品文件） | reference |

---

## 5. 文件優先級（衝突時）

```
Owner 批准的 DECISION / ADR
  > PRD
  > SPEC / REQUIREMENTS
  > code 與測試
  > 舊文件 / archive
```

- **code 是實現，不是意圖。** 不要用 code 反推「產品應該怎樣」。
- 舊文件只作歷史參考；有新決策就以新文件為準。
- 同一主題只能有一份 canonical 文件；其他文件用連結，不要複製。

---

## 6. 變更規則（摘要）

1. 任何使用者可見的行為／文案／定價／定位變更：**先更新 PRD/SPEC，再改 code**。
2. 策略決策（人群、定價、免費/付費邊界、AI 角色、根路徑語言）需 Owner 批准，並寫 ADR。
3. 純 bug 修復可先改 code，但同一個 PR 要補 changelog/spec 註記。
4. 完成定義：code + test + docs + deploy 驗證 + HANDOVER 時間線。
5. 不要把密鑰、PII、使用者原文大量放進 repo。

完整規則：`ai/AGENT-CONTRACT.md`。

---

## 7. 狀態圖例

| 狀態 | 意思 |
|---|---|
| `proposed` | 提案，未批准 |
| `approved` | 已批准，未實作 |
| `implemented` | 已上線 |
| `beta` | 已上線但 β 免費／實驗中 |
| `planned` | 已排入 backlog |
| `blocked` | 卡在外部條件 |
| `dropped` | 明確不做 |
| `superseded` | 被新文件取代 |

---

## 8. 快速連結

- 線上：https://shibikan.com/zh ／ https://shibikan.com/ja
- 健康檢查：https://shibikan.com/api/health
- 目前優先：`operations/BACKLOG.md`
- 目前交接：`operations/HANDOVER.md`
- 決策索引：`decisions/DECISION-LOG.md`
- 研究 brief：`research/threads-pain-points-brief.md`
