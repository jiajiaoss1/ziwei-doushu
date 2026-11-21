---
title: 指標與漏斗
status: draft
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared, zh, ja]
canonical: true
---

# 指標與漏斗

> 沒有指標，就沒有產品迭代；只有感覺。
> 目前 GA4 尚未確認啟用，頁面瀏覽事件也不完整，以下同時標「應有」與「現有」。

---

## 1. 北極星（暫定）

**每週完成的付費報告數**（β 期間用「完整報告閱讀數」替代）。

理由：它同時反映流量、診斷完成、報告吸引力、付款信任。

> 尚未用數據驗證；等 GA4/付款上線後再定。

---

## 2. 漏斗

```text
入口曝光
  → 進入診斷 /zh/shindan
  → 完成診斷（產生結果）
  → 結果頁閱讀
  → 點擊報告
  → 報告頁閱讀
  → 點擊付款
  → 完成付款
  → 開啟報告
  → 7/30 天回訪
```

### 各階段指標

| 階段 | 指標 | 定義 |
|---|---|---|
| 診斷 | 診斷完成率 | 進入 shindan → 成功產生 result |
| 結果 | 結果頁到達率 | result_view / 診斷完成 |
| 結果 | 章節閱讀深度 | 捲動/展開（待埋點） |
| 報告 | 報告點擊率 | report 連結點擊 / result_view |
| 報告 | 報告到達率 | report_view / 報告點擊 |
| 付款 | 付款點擊率 | checkout 點擊 / report_view |
| 付款 | 付款完成率 | 付款成功 / checkout 點擊 |
| 售後 | 退款率 | 退款 / 付款 |
| 回訪 | 7/30 天回訪 | 同一使用者再次診斷/閱讀 |

---

## 3. 現有事件

### 繁中 `/zh`

| 事件 | 位置 | 狀態 |
|---|---|---|
| `zh_diagnosis_submit` | `BirthFormZh` | 已埋 |
| `zh_aishou_submit` | `PairFormZh` | 已埋 |
| `zh_ai_generate` | `AiReading` | 已埋 |
| 頁面瀏覽（result/report/checkout） | — | **缺** |

### 日文 `/ja`

| 事件 | 位置 |
|---|---|
| `jp_diagnosis_submit` | 診断フォーム |
| `jp_result_view` | 結果頁 |
| `jp_report_view` | 鑑定書 |
| `jp_checkout_view` | 購入画面 |
| `jp_ai_generate` | AI |
| `jp_aishou_submit` / `jp_aishou_view` | 相性 |

### 問題

- 繁中頁面瀏覽事件缺失，漏斗中段看不到
- GA4 是否已設定需確認（`NEXT_PUBLIC_GA_ID`）
- 事件屬性（方案/價格/煩惱/情境）不完整
- 沒有付款事件（尚未接 PSP）

---

## 4. 事件設計原則

1. 一個事件只代表一個行為
2. 屬性用 snake_case
3. 不上傳 PII（生日、姓名、精確地址）
4. 事件名稱區分市場：`zh_*` / `ja_*`
5. 付款事件要帶 `type`（love/work）、`price`、`currency`

---

## 5. 待補事件

- `zh_result_view`
- `zh_report_view`（帶 `type`, `full`, `beta`）
- `zh_report_click`（從結果頁）
- `zh_checkout_view`
- `zh_checkout_click`
- `zh_purchase`（付款成功）
- `zh_unlock_view`（帶 token 解鎖）
- `zh_share`（相性/結果分享）

---

## 6. 分析節奏

- 每週看：診斷完成率、報告點擊率、AI 使用率
- 每月看：付款轉化、退款、回訪、通路來源
- 每次改版前：先定義要看哪個指標，避免「改完不知道有沒有用」

---

## 7. Open Questions

1. 北極星用「付款數」還是「完整報告閱讀數」？
2. 是否要追蹤「免費 → 付費」的同一個使用者？（目前無帳號）
3. 是否接受 Cookie/GA4？法務頁要更新到什麼程度？
4. 退款率多少算異常？
