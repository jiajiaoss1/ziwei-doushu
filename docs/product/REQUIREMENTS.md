---
title: 需求矩陣（已實現／β／計劃）
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared, zh, ja]
canonical: true
---

# 需求矩陣

> 這是「做到哪」的唯一來源。PRD 寫為什麼/是什麼；這裡寫狀態。
> 每個新需求必須有 ID，並在 PR/commit 中引用。

狀態：

```
proposed / approved / implemented / beta / planned / blocked / dropped
```

---

## 1. 共同（Shared）

| ID | 需求 | 狀態 | 文件 | 程式 | 測試 |
|---|---|---|---|---|---|
| REQ-SHARED-001 | 紫微斗數排盤引擎 | implemented | `domain/ASTROLOGY-RULES.md` | `lib/ziwei/algorithm.ts` | `pan-integrity` 等 |
| REQ-SHARED-002 | 真太陽時 / 時區 / 晚子時 | implemented | `domain/ASTROLOGY-RULES.md` | `lib/jp/birth.ts`、`lib/zh/birth.ts` | `jp-birth`、`jp-edge` |
| REQ-SHARED-003 | 格局判定與排序 | implemented | `domain/ASTROLOGY-RULES.md` | `lib/ziwei/patterns*.ts` | `jp-patterns`、`zh-patterns` |
| REQ-SHARED-004 | 命盤→facts→文案 pipeline | implemented | `domain/CONTENT-PIPELINE.md` | `lib/{jp,zh}/facts.ts` | `jp-content`、`zh-content` |
| REQ-SHARED-005 | AI 受 facts 約束 | beta | `PRD-SHARED.md` §4 | `lib/{jp,zh}/llm.ts`、`app/api/*/interpret` | `jp-llm`、`jp-llm-guard` |
| REQ-SHARED-006 | AI origin/token/限流/成本護欄 | implemented | `engineering/SECURITY.md` | `lib/jp/llm-guard.ts`、`rate-limit.ts`、`ai-token.ts` | `jp-ratelimit`、`jp-ai-token` |
| REQ-SHARED-007 | Docker + Caddy 部署 | implemented | `engineering/DEPLOY.md` | `Dockerfile`、`Caddyfile`、`docker-compose.yml` | smoke / 手動 |
| REQ-SHARED-008 | CI（typecheck/test/build） | implemented | `engineering/TESTING.md` | `.github/workflows/*` | CI |
| REQ-SHARED-009 | 文件系統（索引/合約/ADR） | approved | `README.md`、`ai/*` | docs | — |
| REQ-SHARED-010 | 全局限流（跨實例） | planned | `engineering/SECURITY.md` | 目前進程內 | — |

---

## 2. 繁中（ZH）

| ID | 需求 | 狀態 | 文件 | 程式 | 測試 |
|---|---|---|---|---|---|
| REQ-ZH-001 | 首頁（Hero/範例/信任/價格/FAQ） | implemented | `PRD-ZH.md` | `app/zh/page.tsx` | `zh-content` |
| REQ-ZH-002 | 診斷表單（煩惱+情境+港台縣市） | implemented | `PRD-ZH.md` | `app/zh/shindan`、`components/zh` | `zh-content` |
| REQ-ZH-003 | 結果頁（共情/命盤/章節排序） | implemented | `PRD-ZH.md` | `app/zh/result` | `zh-content` |
| REQ-ZH-004 | 感情/事業報告（信件語氣） | implemented | `PRD-ZH.md` | `app/zh/report`、`lib/zh/report.ts` | `zh-content` |
| REQ-ZH-005 | 報告 β 全免費/解鎖 | beta | `PRICING.md` | `app/zh/report`、`lib/jp/access.ts` | `jp-checkout` |
| REQ-ZH-006 | 港台定價顯示 | implemented | `PRICING.md` | `lib/zh/pricing.ts` | `zh-content` |
| REQ-ZH-007 | AI 問答（結果頁） | beta | `PRD-SHARED.md` §4 | `components/zh/AiReading`、`/api/zh/interpret` | `jp-llm-guard` |
| REQ-ZH-008 | 相性 | implemented | `PRD-ZH.md` | `app/zh/aishou` | `zh-content` |
| REQ-ZH-009 | 2027 專題 | implemented | `PRD-ZH.md` | `app/zh/2027` | `zh-content` |
| REQ-ZH-010 | 文章 6 篇 | implemented | `PRD-ZH.md` | `lib/zh/articles.ts` | `zh-content` |
| REQ-ZH-011 | 法務頁（隱私/條款/交易） | beta | `content/TONE-AND-CLAIMS.md` | `app/zh/legal` | — |
| REQ-ZH-REL-001 | 感情報告鎖定區價格/連結依 type 正確 | planned | `PRD-ZH.md` §7 | `app/zh/report` | 待加 |
| REQ-ZH-REL-002 | 報告頁保留 `w`/`s` 情境參數 | planned | `PRD-ZH.md` §7 | `app/zh/report` | 待加 |
| REQ-ZH-CONV-001 | 結果頁報告卡顯示價格 | proposed | `PRD-ZH.md` | `app/zh/result` | — |
| REQ-ZH-CONV-002 | 報告樣本/試讀 | proposed | `PRD-ZH.md` | 未做 | — |
| REQ-ZH-CONV-003 | 報告按情境客製（不只開場） | proposed | `PRD-ZH.md` | `lib/zh/report.ts` | — |
| REQ-ZH-PAY-001 | Stripe HK checkout | planned | `PRICING.md` | 未做 | — |
| REQ-ZH-PAY-002 | Stripe webhook + 解鎖 | planned | `PRICING.md` | 未做 | — |
| REQ-ZH-PAY-003 | 收據/退款/客服 | planned | `PRICING.md` | 未做 | — |

---

## 3. 日文（JA）

| ID | 需求 | 狀態 | 文件 | 程式 | 測試 |
|---|---|---|---|---|---|
| REQ-JA-001 | 日文首頁/診斷/結果 | implemented | `PRD-JA.md` | `app/ja` | `jp-*` |
| REQ-JA-002 | 恋愛鑑定書（無料） | implemented | `PRD-JA.md` | `app/ja/report`、`lib/jp/report.ts` | `jp-report` |
| REQ-JA-003 | 事業鑑定書（有料） | beta | `PRD-JA.md` | `app/ja/report`、`lib/jp/access.ts` | `jp-checkout` |
| REQ-JA-004 | AI 深掘り | beta | `PRD-SHARED.md` §4 | `components/jp/AiReading`、`/api/ja/interpret` | `jp-llm` |
| REQ-JA-005 | checkout/webhook 骨架 | implemented | `PRICING.md` | `app/api/ja/checkout`、`webhook` | `jp-checkout` |
| REQ-JA-006 | 實際 PSP 接続 | planned | `PRICING.md` | 未做 | — |
| REQ-JA-007 | 法務實數據 | planned | `content/TONE-AND-CLAIMS.md` | `app/ja/legal` | — |

---

## 4. 法務／合規

| ID | 需求 | 狀態 | 備註 |
|---|---|---|---|
| REQ-LEGAL-001 | 特商法營運主體資訊 | planned | 目前「準備中」 |
| REQ-LEGAL-002 | 真實客服信箱 | planned | 目前 `support@example.com` |
| REQ-LEGAL-003 | 退款政策最終版 | planned | 草稿已寫 |
| REQ-LEGAL-004 | 日本律師確認 | planned | 收費前 |
| REQ-LEGAL-005 | 天紀語料商用邊界 | planned | CC BY-NC-SA 4.0 |
| REQ-LEGAL-006 | AI 揭露與免責 | approved | 見 `TONE-AND-CLAIMS` |

---

## 5. 成長／分析

| ID | 需求 | 狀態 | 備註 |
|---|---|---|---|
| REQ-GROW-001 | GA4 啟用 | planned | `NEXT_PUBLIC_GA_ID` |
| REQ-GROW-002 | Search Console + sitemap | planned | 使用者側 |
| REQ-GROW-003 | 繁中頁面瀏覽事件 | planned | 目前缺 |
| REQ-GROW-004 | 付款事件 | planned | 接 PSP 後 |
| REQ-GROW-005 | Threads 痛點研究 | approved | brief 已寫 |
| REQ-GROW-006 | 電子報/CRM | proposed | 未做 |
| REQ-GROW-007 | 文章內鏈/CTA | proposed | 未做 |

---

## 6. 運維

| ID | 需求 | 狀態 | 備註 |
|---|---|---|---|
| REQ-OPS-001 | VPS 升 2GB | planned | 目前 1GB |
| REQ-OPS-002 | secret 輪換 | planned | 曾出現在對話 |
| REQ-OPS-003 | Uptime 監控 | planned | `/api/health` |
| REQ-OPS-004 | Sentry | proposed | 未做 |
| REQ-OPS-005 | Caddy 移除 Netlify 插件 | planned | `Caddyfile` 已 HTTP-01，但 Dockerfile.caddy 仍帶 plugin |
