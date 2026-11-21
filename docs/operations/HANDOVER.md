---
title: 工作交接
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared]
canonical: true
---

# 紫微館 工作交接（2026-11-21）

> 給接手的 AI：先讀 `docs/README.md` 與 `docs/ai/AGENT-CONTRACT.md`，再讀本文。
> 本文只寫「現在在哪、下一棒從哪開始」。

---

## 1. 專案

- 服務：紫微館（しびかん）— 紫微斗數診斷/付費報告
- 線上：https://shibikan.com
- 市場：
  - 繁中 `/zh`（港台，**主推**）
  - 日文 `/ja`（日本）
- 根路徑：`/` → **307 `/zh`**
- 倉庫：`github.com/jiajiaoss1/ziwei-doushu`（private）

---

## 2. 技術與本地

```text
Next.js 16 App Router + React 19 + TypeScript strict
Node 22 / npm 10（Docker）
iztro + lunar-javascript（lib/ziwei/* 共用）
```

```bash
npm ci --legacy-peer-deps
npm run dev          # /zh 或 /ja
npx tsc --noEmit
npm test             # 25 套件
npm run build
```

已知：`jp-patterns` / `zh-patterns` 需 `NODE_OPTIONS=--conditions=react-server`；`package.json` 已處理。

---

## 3. 線上狀態

| 項目 | 狀態 |
|---|---|
| 域名 | 西部数码（west.cn）NS；A `@`/`www` → `45.77.180.73` |
| VPS | Vultr Tokyo，Ubuntu 24.04，`/opt/shibikan` |
| 部署 | Docker Compose：app + Caddy |
| 憑證 | **HTTP-01**（Caddyfile 無 `tls { dns ... }`） |
| 線上版本 | `c18fff1`（根路徑跳 `/zh`） |
| 本地 main | 本次文件系統 commit（見 `git log -1`） |
| AI | DeepSeek，SSE，已啟用；有 origin/token/限流/日次護欄 |
| 支付 | 只有骨架（order token/webhook/unlock），未接 PSP |
| 收費 | `JP_BETA_FREE=true`，全免費 |

### 部署

```bash
ssh root@45.77.180.73
cd /opt/shibikan
git pull
bash scripts/vps/deploy.sh
```

驗證：

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://shibikan.com/api/health
curl -s -o /dev/null -w "%{http_code}\n" https://shibikan.com/zh
curl -s -o /dev/null -w "%{http_code}\n" https://shibikan.com/ja
curl -s -o /dev/null -w "%{redirect_url}\n" https://shibikan.com/
```

詳細：`engineering/DEPLOY.md`。

---

## 4. 代碼地圖

### 繁中（主推）

```text
app/zh/                 首頁/診斷/結果/報告/相性/2027/文章/法務
lib/zh/                 glossary/facts/interpret/report/compat/worry/llm/pricing
components/zh/          SiteHeaderZh/SiteFooterZh/BirthFormZh/PairFormZh/AiReading/Meiban
app/api/zh/interpret/   AI API
```

### 日文

```text
app/ja/*、lib/jp/*、components/jp/*
app/api/ja/interpret、checkout、webhook
```

### 共用

```text
lib/ziwei/              排盤、格局、四化、真太陽時
lib/site.ts             SITE_URL
scripts/vps/deploy.sh   一鍵部署
Caddyfile / docker-compose.yml / Dockerfile
```

---

## 5. 已完成（2026-11-21 前）

- 日文版全套 + AI
- 繁中版全套（頁面/測試/OG）
- 產品化：煩惱入口、情境細分、結果頁共情、章節排序、報告信件語氣、信任區塊、AI 問答
- 根路徑 `/zh`、Caddy HTTP-01、DNS 西部数码
- 課金骨架：HMAC unlock、AES-GCM order token、webhook 驗簽
- CI（typecheck/test/build）、25 套回歸
- 文件系統（本次）：索引、AI 合約、PRD、需求矩陣、ADR、backlog、handover

---

## 6. 下一步（P0/P1）

### P0 — 收費前

1. Stripe HK（繁中 checkout/webhook）— **blocked：等香港公司/keys**
2. 日文 PSP — blocked：等日本主體
3. 真實客服信箱/特商法主體/退款
4. GA4 + Search Console
5. VPS 2GB、密鑰輪換
6. 繁中付費牆 bug、w/s 參數、頁面瀏覽事件

### P1 — 產品打磨（目前 Owner 指定優先）

1. 等 Threads 研究（`research/threads-pain-points-brief.md`）
2. 決定 beachhead：關係卡住 vs 轉職
3. 定義付費交付物：是「更多章節」還是「決策/行動書」
4. 再改首頁/報告/AI 邊界

**不要在没有 Owner 批准前改定位、定價、免費/付費邊界、AI 角色。**

---

## 7. 文件系統

- 入口：`docs/README.md`
- AI 規則：`docs/ai/AGENT-CONTRACT.md`
- 工作方法：`docs/ai/WORKING-METHOD.md`
- PRD：`docs/product/PRD-SHARED.md` / `PRD-ZH.md` / `PRD-JA.md`
- 需求矩陣：`docs/product/REQUIREMENTS.md`
- 決策：`docs/decisions/DECISION-LOG.md`
- 待辦：`docs/operations/BACKLOG.md`
- 研究：`docs/research/README.md`
- 舊文件：`docs/archive/`

---

## 8. 風險

1. 憑據曾出現在對話 → 盡快輪換
2. 天紀語料 CC BY-NC-SA → 不得直接展示/大量翻譯
3. `patterns.ts` 的 `server-only` → 測試條件
4. 繁中報告用 `isBetaFree` + `verifyUnlock`，不是日文的 `getReportAccess`
5. Caddy 已 HTTP-01，但 `Dockerfile.caddy` / `NETLIFY_AUTH_TOKEN` 是遺留
6. 1GB VPS 吃緊
7. 免費 AI 可能替代付費報告

---

## 9. 接手第一步

1. 讀 `docs/README.md` → `ai/AGENT-CONTRACT.md` → 本文
2. `git status` 確認乾淨
3. 跑 `npx tsc --noEmit`、`npm test`、`npm run build`
4. 看 `operations/BACKLOG.md` 的「現在唯一優先」
5. 只選一個 Requirement ID 開工
6. 結束前更新 backlog/changelog/本文時間線

---

## 10. 交接時間線

| # | 截止時間（Asia/Shanghai） | 負責人 | 本階段完成 | 交接給 | 下一階段起點 | 狀態快照 |
|---|---|---|---|---|---|---|
| 1 | 2026-11-21 09:45 | lead | 繁中版全套、產品化、根路徑 `/zh`、Caddy HTTP-01、DNS、交接文件 | 下一位 agent | P0 Stripe HK（等 keys） | main=`79f3827`、線上=`c18fff1` |
| 2 | 2026-11-21 10:31 | lead | 文件系統重構：索引、AI 合約、工作方法、PRD（shared/zh/ja）、需求矩陣、ADR、backlog、handover；舊文件歸檔；Threads 研究 brief | 下一位 agent | P1 產品打磨：等 Threads 研究 → 定 beachhead/付費交付物 | main=本次 docs commit、線上=`c18fff1`、工作區乾淨 |

### 交接快照模板

```text
截止時間：
負責人：
main 版本：
線上版本：
未提交/未推送：
本次完成：
未完成/卡住：
下一棒：____，起點：____
```

### 交接規則

1. 每次結束：`git status` 乾淨 + commit + push + 本文追加一行
2. 截止時間到就交，寫清「做到哪、下一步」
3. 不要跨階段改決策；要改先問 Owner + ADR
4. 憑據不進倉庫
5. 部署後驗證 `/api/health`、`/zh`、`/ja`、`/` → `/zh`
6. 測試注意 `--conditions=react-server`
