---
title: 工作交接
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared]
canonical: true
---

# 紫微馆 工作交接（2026-11-21）

> 给接手的 AI：先读 `docs/README.md` 与 `docs/ai/AGENT-CONTRACT.md`，再读本文。
> 本文只写「现在在哪、下一棒从哪开始」。

---

## 1. 项目

- 服务：紫微馆（しびかん）— 紫微斗数诊断/付费报告
- 线上：https://shibikan.com
- 市场：
  - 繁中 `/zh`（港台，**主推**）
  - 日文 `/ja`（日本）
- 根路径：`/` → **307 `/zh`**
- 仓库：`github.com/jiajiaoss1/ziwei-doushu`（private）

---

## 2. 技术与本地

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

已知：`jp-patterns` / `zh-patterns` 需 `NODE_OPTIONS=--conditions=react-server`；`package.json` 已处理。

---

## 3. 线上状态

| 项目 | 状态 |
|---|---|
| 域名 | 西部数码（west.cn）NS；A `@`/`www` → `45.77.180.73` |
| VPS | Vultr Tokyo，Ubuntu 24.04，`/opt/shibikan` |
| 部署 | Docker Compose：app + Caddy |
| 凭证 | **HTTP-01**（Caddyfile 无 `tls { dns ... }`） |
| 线上版本 | `c18fff1`（根路径跳 `/zh`） |
| 本地 main | 本次文件系统 commit（见 `git log -1`） |
| AI | DeepSeek，SSE，已启用；有 origin/token/限流/日次护栏 |
| 支付 | 只有骨架（order token/webhook/unlock），未接 PSP |
| 收费 | `JP_BETA_FREE=true`，全免费 |

### 部署

```bash
ssh root@45.77.180.73
cd /opt/shibikan
git pull
bash scripts/vps/deploy.sh
```

验证：

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://shibikan.com/api/health
curl -s -o /dev/null -w "%{http_code}\n" https://shibikan.com/zh
curl -s -o /dev/null -w "%{http_code}\n" https://shibikan.com/ja
curl -s -o /dev/null -w "%{redirect_url}\n" https://shibikan.com/
```

详细：`engineering/DEPLOY.md`。

---

## 4. 代码地图

### 繁中（主推）

```text
app/zh/                 首页/诊断/结果/报告/相性/2027/文章/法务
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
lib/ziwei/              排盘、格局、四化、真太阳时
lib/site.ts             SITE_URL
scripts/vps/deploy.sh   一键部署
Caddyfile / docker-compose.yml / Dockerfile
```

---

## 5. 已完成（2026-11-21 前）

- 日文版全套 + AI
- 繁中版全套（页面/测试/OG）
- 产品化：烦恼入口、情境细分、结果页共情、章节排序、报告信件语气、信任区块、AI 问答
- 根路径 `/zh`、Caddy HTTP-01、DNS 西部数码
- 课金骨架：HMAC unlock、AES-GCM order token、webhook 验签
- CI（typecheck/test/build）、25 套回归
- 文件系统（本次）：索引、AI 合约、PRD、需求矩阵、ADR、backlog、handover

---

## 6. 下一步（P0/P1）

### P0 — 收费前

1. Stripe HK（繁中 checkout/webhook）— **blocked：等香港公司/keys**
2. 日文 PSP — blocked：等日本主体
3. 真实客服信箱/特商法主体/退款
4. GA4 + Search Console
5. VPS 2GB、密钥轮换
6. 繁中付费墙 bug、w/s 参数、页面浏览事件

### P1 — 产品打磨（目前 Owner 指定优先）

1. 等 Threads 研究（`research/threads-pain-points-brief.md`）
2. 决定 beachhead：关系卡住 vs 转职
3. 定义付费交付物：是「更多章节」还是「决策/行动书」
4. 再改首页/报告/AI 边界

**不要在没有 Owner 批准前改定位、定价、免费/付费边界、AI 角色。**

---

## 7. 文件系统

- 入口：`docs/README.md`
- AI 规则：`docs/ai/AGENT-CONTRACT.md`
- 工作方法：`docs/ai/WORKING-METHOD.md`
- PRD：`docs/product/PRD-SHARED.md` / `PRD-ZH.md` / `PRD-JA.md`
- 需求矩阵：`docs/product/REQUIREMENTS.md`
- 决策：`docs/decisions/DECISION-LOG.md`
- 待办：`docs/operations/BACKLOG.md`
- 研究：`docs/research/README.md`
- 旧文件：`docs/archive/`

---

## 8. 风险

1. 凭据曾出现在对话 → 尽快轮换
2. 天纪语料 CC BY-NC-SA → 不得直接展示/大量翻译
3. `patterns.ts` 的 `server-only` → 测试条件
4. 繁中报告用 `isBetaFree` + `verifyUnlock`，不是日文的 `getReportAccess`
5. Caddy 已 HTTP-01，但 `Dockerfile.caddy` / `NETLIFY_AUTH_TOKEN` 是遗留
6. 1GB VPS 吃紧
7. 免费 AI 可能替代付费报告

---

## 9. 接手第一步

1. 读 `docs/README.md` → `ai/AGENT-CONTRACT.md` → 本文
2. `git status` 确认干净
3. 跑 `npx tsc --noEmit`、`npm test`、`npm run build`
4. 看 `operations/BACKLOG.md` 的「现在唯一优先」
5. 只选一个 Requirement ID 开工
6. 结束前更新 backlog/changelog/本文时间线

---

## 10. 交接时间线

| # | 截止时间（Asia/Shanghai） | 负责人 | 本阶段完成 | 交接给 | 下一阶段起点 | 状态快照 |
|---|---|---|---|---|---|---|
| 1 | 2026-11-21 09:45 | lead | 繁中版全套、产品化、根路径 `/zh`、Caddy HTTP-01、DNS、交接文件 | 下一位 agent | P0 Stripe HK（等 keys） | main=`79f3827`、线上=`c18fff1` |
| 2 | 2026-11-21 10:31 | lead | 文件系统重构：索引、AI 合约、工作方法、PRD（shared/zh/ja）、需求矩阵、ADR、backlog、handover；旧文件归档；Threads 研究 brief | 下一位 agent | P1 产品打磨：等 Threads 研究 → 定 beachhead/付费交付物 | main=本次 docs commit、线上=`c18fff1`、工作区干净 |

### 交接快照模板

```text
截止时间：
负责人：
main 版本：
线上版本：
未提交/未推送：
本次完成：
未完成/卡住：
下一棒：____，起点：____
```

### 交接规则

1. 每次结束：`git status` 干净 + commit + push + 本文追加一行
2. 截止时间到就交，写清「做到哪、下一步」
3. 不要跨阶段改决策；要改先问 Owner + ADR
4. 凭据不进仓库
5. 部署后验证 `/api/health`、`/zh`、`/ja`、`/` → `/zh`
6. 测试注意 `--conditions=react-server`
