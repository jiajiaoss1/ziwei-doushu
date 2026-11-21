---
title: 技術架構
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared, zh, ja]
canonical: true
---

# 技術架構

## 1. 總覽

```text
Browser
  │ HTTPS
  ▼
Caddy（VPS，Let's Encrypt HTTP-01）
  │ reverse_proxy app:3000
  ▼
Next.js 16 standalone（Docker）
  ├─ app/zh/*、app/ja/*（App Router）
  ├─ app/api/zh|ja/interpret（AI SSE）
  ├─ app/api/ja/checkout|webhook（支付骨架）
  ├─ lib/ziwei/*（排盤引擎，共用）
  ├─ lib/zh/*、lib/jp/*（facts/文案/AI prompt）
  └─ 無資料庫（目前）
```

## 2. 技術棧

| 層 | 技術 |
|---|---|
| Framework | Next.js 16 App Router |
| UI | React 19、TypeScript strict、Tailwind |
| Runtime | Node 22（Docker） |
| 排盤 | `iztro` + `lunar-javascript` |
| AI | DeepSeek（OpenAI 兼容 API） |
| 部署 | Vultr Tokyo VPS、Docker Compose、Caddy |
| DNS | 西部数码（west.cn） |
| 憑證 | Let's Encrypt HTTP-01 |
| 測試 | tsx regression scripts + GitHub Actions |
| 套件 | npm（`--legacy-peer-deps` 用於 Docker/npm10） |

## 3. 路由

- `/` → 307 `/zh`
- `/zh/*`：繁中版
- `/ja/*`：日文版
- `/api/health`
- `/api/zh/interpret`、`/api/ja/interpret`
- `/api/ja/checkout`、`/api/ja/webhook`

完整頁面：`ux/PAGE-MAP.md`。

## 4. 資料流

見 `domain/CONTENT-PIPELINE.md`。

重點：

- 排盤是 deterministic
- facts 是 deterministic
- 文案是 TypeScript 模板
- AI 是 optional、非 deterministic
- 沒有 CMS、沒有 DB

## 5. 部署

- `Dockerfile`：Next standalone 多階段
- `docker-compose.yml`：`app` + `caddy`
- `Caddyfile`：HTTP-01、`www` → apex、安全頭
- `scripts/vps/deploy.sh`：pull → build → up → prune

細節：`engineering/DEPLOY.md`。

## 6. 外部依賴

| 依賴 | 用途 | 失敗時 |
|---|---|---|
| DeepSeek API | AI 解讀 | 501/錯誤訊息；模板解讀仍可用 |
| Let's Encrypt | HTTPS | Caddy 重試；憑證到期前處理 |
| west.cn DNS | 網域解析 | 站點不可達 |
| GitHub | 代碼/CI | 無法部署 |

## 7. 安全與限流

- AI：origin、token、IP/token 限流、每日全域/IP 上限
- 支付：order token AES-GCM、webhook HMAC
- 解鎖：HMAC token
- 無使用者帳號、無 DB
- 詳細：`engineering/SECURITY.md`

## 8. 已知技術債

1. `Dockerfile.caddy` 仍編譯 Netlify DNS plugin，compose 仍傳 `NETLIFY_AUTH_TOKEN`；Caddyfile 已改 HTTP-01，插件不再需要
2. AI 限流是進程內計數，單容器可用，多實例不足
3. 無訂單 DB，付款後無法對帳/退款自動化
4. 繁中缺 checkout/webhook
5. 無 Sentry/結構化日誌（只有 Caddy access log）
6. 1GB VPS，構建與並發吃緊
7. 四柱以中國標準時計算，畫面未顯示
