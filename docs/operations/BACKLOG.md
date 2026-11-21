---
title: Backlog
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared, zh, ja]
canonical: true
---

# Backlog

> 唯一待辦來源。不要另外開 `*-backlog.md`。
> 每項盡量對應 `REQUIREMENTS.md` 的 ID；策略項等 Owner 批准。

更新：2026-11-21

---

## 現在唯一優先（Next）

**產品打磨：先定「付費交付物」與目標 beachhead。**

- 等 Threads 研究結果（`research/threads-pain-points-brief.md`）
- 用研究決定：關係 vs 事業、免費/付費邊界、AI 角色
- 產出：更新 `POSITIONING.md` / `PRD-ZH.md`，再開 SPEC
- 不要先改首頁文案

> 在 Owner 批准定位前，不改首頁主命題與定價。

---

## P0 — 上線收費前必須

| 項目 | 狀態 | 備註 |
|---|---|---|
| Stripe HK（繁中 checkout/webhook） | blocked | 等香港公司/keys |
| 日文 PSP 接続 | blocked | 等日本主體 |
| 真實客服信箱 | planned | `support@example.com` |
| 特商法營運主體 | planned | 香港/日本各自 |
| 退款政策最終版 | planned | 草稿已寫 |
| 付費前檢查清單 | planned | 見下 |
| 1GB VPS → 2GB | planned | 收費前 |
| 密鑰輪換 | planned | 曾出現在對話 |
| GA4 | planned | `NEXT_PUBLIC_GA_ID` |
| Search Console + sitemap | planned | 使用者側 |
| 繁中頁面瀏覽事件 | planned | 目前缺 |
| 感情報告付費牆 bug | planned | REQ-ZH-REL-001 |
| 報告頁保留 w/s | planned | REQ-ZH-REL-002 |

### 收費前檢查清單

- [ ] 付款成功 → 解鎖連結可用
- [ ] 重複 webhook 不會重複發 token
- [ ] 退款/客訴流程
- [ ] 價格、稅、幣別在購買前可見
- [ ] 法務頁無「準備中」
- [ ] 真實客服信箱
- [ ] 1GB → 2GB
- [ ] 密鑰已輪換

---

## P1 — 產品打磨（Owner 指定品質優先）

| 項目 | 狀態 | 備註 |
|---|---|---|
| 目標 beachhead 決策 | proposed | 等研究 |
| 付費報告改成「決策/行動書」 | proposed | 需 Owner |
| 報告按情境客製 | proposed | 先定模組化方案 |
| 結果頁價格透明 | proposed | 卡片顯示 NT$/HKD |
| 報告樣本/試讀 | proposed | 脫敏樣本 |
| 信任區塊（不編好評） | proposed | 方法/作者/樣本 |
| 免費 AI 限制為解釋型 | proposed | 方向見 ADR-0003 |
| 付費 AI 追問 | proposed | 需先有付費 |
| 購買流程說明 | proposed | 退款/交付 |

---

## P2 — 成長與內容

| 項目 | 狀態 | 備註 |
|---|---|---|
| Threads 痛點研究 | in progress | agent 執行中 |
| Dcard/IG 三角驗證 | proposed | 研究後 |
| 文章內鏈/CTA | proposed | 文章 → 診斷 |
| 電子報/CRM | proposed | 無帳號 |
| 相性分享 OGP | proposed | 分享導線 |
| 2027 季節性 | proposed | 年末再看 |
| 使用者訪談 10–15 人 | proposed | 研究飽和後 |

---

## P2 — 技術債

| 項目 | 狀態 | 備註 |
|---|---|---|
| Caddy 移除 Netlify plugin/token | planned | `Dockerfile.caddy` 遺留 |
| AI 全局限流（Upstash 等） | planned | 目前進程內 |
| 訂單 DB/對帳 | planned | 接 PSP 時 |
| Sentry | proposed | 無監控 |
| 四柱 utcOffset | proposed | 若顯示四柱 |
| 中國 demo 頁清理 | proposed | `/` 已 redirect |

---

## 已完成（近期）

- 繁中版全套（頁面/測試/OG）
- 產品化：煩惱入口、情境、共情、章節排序、報告信件語氣、信任區塊、AI 問答
- 根路徑 `/zh`、Caddy HTTP-01、DNS 切西部数码
- 日文版格局翻譯/審查
- 文件系統（本次）

歷史細節：`archive/ja-backlog-2026-11-18.md`。

---

## 不做（現在）

- 真人即時諮詢
- 訂閱制
- App
- 命理師入駐
- 自動多語言切換
