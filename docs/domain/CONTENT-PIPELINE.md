---
title: 內容生成 Pipeline
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared, zh, ja]
canonical: true
---

# 內容生成 Pipeline

> 從「使用者輸入」到「結果頁/報告」的完整資料流。
> 這份文件回答：哪些是算的、哪些是寫的、哪些是 AI、改文案要動哪裡。

---

## 1. 總覽

```mermaid
flowchart TD
  A[首頁 / 表單 / 相性] --> B[URL 參數]
  B --> C[birth.ts<br/>時區・真太陽時・晚子時]
  C --> D[generateChart<br/>lib/ziwei/algorithm.ts]
  D --> E[iztro<br/>宮位・主星・四化・大限]
  D --> F[lunar-javascript<br/>農曆・節氣・干支]
  E --> G[facts.ts<br/>buildZhFacts / buildJpFacts]
  F --> G
  G --> H[glossary.ts<br/>星名・宮位・四化・格局]
  G --> I[interpret.ts<br/>免費解讀]
  G --> J[report.ts<br/>付費報告]
  G --> K[compat.ts<br/>相性]
  I --> L[app/zh/result<br/>app/ja/result]
  J --> M[app/zh/report<br/>app/ja/report]
  K --> N[aishou/result]
  L --> O[AiReading]
  O --> P[/api/zh/interpret<br/>/api/ja/interpret]
  P --> Q[llm.ts<br/>prompt + facts digest]
  Q --> R[DeepSeek API]
```

---

## 2. 兩市場的檔案對應

| 層 | 繁中 `/zh` | 日文 `/ja` |
|---|---|---|
| 出生資訊 | `lib/zh/birth.ts`、`cities.ts` | `lib/jp/birth.ts`、`cities.ts` |
| 排盤 | `lib/ziwei/algorithm.ts`（共用） | 同左 |
| facts | `lib/zh/facts.ts` | `lib/jp/facts.ts` |
| 詞庫/文案 | `lib/zh/glossary.ts` | `lib/jp/glossary.ts` |
| 免費解讀 | `lib/zh/interpret.ts` | `lib/jp/interpret.ts` |
| 報告 | `lib/zh/report.ts` | `lib/jp/report.ts` |
| 相性 | `lib/zh/compat.ts` | `lib/jp/compat.ts` |
| 頁面 | `app/zh/*` | `app/ja/*` |
| 元件 | `components/zh/*` | `components/jp/*` |
| AI prompt | `lib/zh/llm.ts` | `lib/jp/llm.ts` |
| AI API | `app/api/zh/interpret` | `app/api/ja/interpret` |

**不要跨市場 import 文案**；只共用 `lib/ziwei/*`。

---

## 3. 哪些是確定的

同一出生資訊 + 同一年 + 同一版 code：

- 命宮位置、主星、廟旺利陷
- 四化落宮
- 大限起止、流年干支
- 夫妻/官祿/財帛的星
- 格局判定（顯示與排序另由 facts/glossary 決定）

## 4. 哪些是手寫模板

- 星曜性格/感情/工作/金錢描述：`glossary.ts`
- 免費解讀段落：`interpret.ts`
- 報告章節與語氣：`report.ts`
- 相性段落：`compat.ts`
- 文章、2027、法務：`articles.ts` / `app/zh/2027` / `legal`

## 5. 哪些是 LLM

- 結果頁「AI 深掘/問答」的文字
- 只根據 facts digest + system prompt
- 不是命盤計算的一部分
- 目前繁中/日文都啟用（DeepSeek），但可透過 `JP_LLM_API_KEY` 關閉

### 已知限制

1. `buildZhFactsDigest` 只給部分宮位/主星，沒有全部 12 宮/煞星/吉星
2. AI API 以 `new Date().getFullYear()` 取流年，忽略使用者選的年份
3. 每次生成措辭可能不同；不是 deterministic
4. 限流是進程內計數（單容器可用，多實例不足）

> 這些限制是 `REQUIREMENTS.md` 的 AI 相關需求來源。

---

## 6. 改文案要動哪裡

| 想改 | 動這裡 |
|---|---|
| 星曜性格/感情/工作/金錢 | `lib/{zh,jp}/glossary.ts` |
| 免費結果頁段落 | `lib/{zh,jp}/interpret.ts` |
| 報告章節/語氣 | `lib/{zh,jp}/report.ts` |
| 相性文案 | `lib/{zh,jp}/compat.ts` |
| 首頁/表單/結果頁 UI | `app/{zh,ja}/...`、`components/...` |
| AI prompt/邊界 | `lib/{zh,jp}/llm.ts` |
| 命理規則 | `lib/ziwei/*` + 測試 |

改完必跑：

```bash
npx tsc --noEmit
npm test
npm run build
```

---

## 7. 與測試的關係

| 測試 | 保護什麼 |
|---|---|
| `jp-birth` / `zh-content` | 時區/真太陽時/晚子時 |
| `jp-content` / `zh-content` | 詞庫/文案/命盤→解讀 |
| `jp-report` | 空宮/簡體字/缺落 |
| `jp-patterns` / `zh-patterns` | 格局/排序/出典（需 `--conditions=react-server`） |
| `jp-edge` | 大限/立春/春節/晚子時邊界 |
| `jp-llm` / `jp-llm-guard` | AI 護欄 |
| `jp-checkout` | 訂單 token/webhook |

---

## 8. 相關文件

- 命理規則：`domain/ASTROLOGY-RULES.md`
- 架構：`engineering/ARCHITECTURE.md`
- 測試：`engineering/TESTING.md`
- 舊版（日文）：`archive/` 無；本文件取代 `ja-content-pipeline.md`
