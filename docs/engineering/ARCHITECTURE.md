---
title: 技术架构
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared, zh, ja]
canonical: true
---

# 技术架构

## 1. 总览

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
  ├─ lib/ziwei/*（排盘引擎，共用）
  ├─ lib/zh/*、lib/jp/*（facts/文案/AI prompt）
  └─ 无资料库（目前）
```

## 2. 技术栈

| 层 | 技术 |
|---|---|
| Framework | Next.js 16 App Router |
| UI | React 19、TypeScript strict、Tailwind |
| Runtime | Node 22（Docker） |
| 排盘 | `iztro` + `lunar-javascript` |
| AI | DeepSeek（OpenAI 兼容 API） |
| 部署 | Vultr Tokyo VPS、Docker Compose、Caddy |
| DNS | 西部数码（west.cn） |
| 凭证 | Let's Encrypt HTTP-01 |
| 测试 | tsx regression scripts + GitHub Actions |
| 套件 | npm（`--legacy-peer-deps` 用于 Docker/npm10） |

## 3. 路由

- `/` → 307 `/zh`
- `/zh/*`：繁中版
- `/ja/*`：日文版
- `/api/health`
- `/api/zh/interpret`、`/api/ja/interpret`
- `/api/ja/checkout`、`/api/ja/webhook`

完整页面：`ux/PAGE-MAP.md`。

## 4. 资料流

见 `domain/CONTENT-PIPELINE.md`。

重点：

- 排盘是 deterministic
- facts 是 deterministic
- 文案是 TypeScript 模板
- AI 是 optional、非 deterministic
- 没有 CMS、没有 DB

## 5. 部署

- `Dockerfile`：Next standalone 多阶段
- `docker-compose.yml`：`app` + `caddy`
- `Caddyfile`：HTTP-01、`www` → apex、安全头
- `scripts/vps/deploy.sh`：pull → build → up → prune

细节：`engineering/DEPLOY.md`；模块边界见 `engineering/MODULE-MAP.md`。

## 6. 外部依赖

| 依赖 | 用途 | 失败时 |
|---|---|---|
| DeepSeek API | AI 解读 | 501/错误讯息；模板解读仍可用 |
| Let's Encrypt | HTTPS | Caddy 重试；凭证到期前处理 |
| west.cn DNS | 域名解析 | 站点不可达 |
| GitHub | 代码/CI | 无法部署 |

## 7. 安全与限流

- AI：origin、token、IP/token 限流、每日全域/IP 上限
- 支付：order token AES-GCM、webhook HMAC
- 解锁：HMAC token
- 无用户账号、无 DB
- 详细：`engineering/SECURITY.md`

## 8. 已知技术债

1. `Dockerfile.caddy` 仍编译 Netlify DNS plugin，compose 仍传 `NETLIFY_AUTH_TOKEN`；Caddyfile 已改 HTTP-01，插件不再需要
2. AI 限流是进程内计数，单容器可用，多实例不足
3. 无订单 DB，付款后无法对帐/退款自动化
4. 繁中缺 checkout/webhook
5. 无 Sentry/结构化日志（只有 Caddy access log）
6. 1GB VPS，构建与并发吃紧
7. 四柱以中国标准时计算，画面未显示
