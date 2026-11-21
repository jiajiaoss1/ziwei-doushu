---
title: 安全与密钥
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared]
canonical: true
---

# 安全与密钥

## 1. 密钥清单

| 变数 | 用途 | 备注 |
|---|---|---|
| `JP_UNLOCK_SECRET` | 报告解锁 HMAC | 曾出现在对话，建议轮换 |
| `JP_AI_TOKEN_SECRET` | AI token HMAC | 曾出现在对话，建议轮换 |
| `JP_WEBHOOK_SECRET` | webhook 验签 + order token | 不可泄漏 |
| `JP_LLM_API_KEY` | DeepSeek | 只放 VPS |
| `NETLIFY_AUTH_TOKEN` | 旧 Caddy DNS-01 | Caddyfile 已 HTTP-01，待移除 |
| `ACME_EMAIL` | Let's Encrypt | 非密钥 |

**不要**把任何 key 写进 repo、docs、截图、聊天。已暴露的要轮换。

## 2. 部署安全

- SSH 只用 key，关闭 password
- UFW 只开 22/80/443
- `.env.production` `chmod 600`
- VPS 定期 `apt upgrade` / unattended-upgrades
- Docker socket 等于 root，限制登录

## 3. Web/API

- HTTPS 强制（Caddy）
- HSTS、X-Content-Type-Options、Referrer-Policy、Permissions-Policy
- AI API：
  - 同源检查（`Origin`）
  - 短命 token（IP + 生日 + 15 分）
  - IP 10/10min、token 5/15min
  - 每日 IP 20 / 全域 1000
- 支付：
  - order token AES-256-GCM
  - webhook HMAC-SHA256
  - 验签失败 401

## 4. 隐私

- 无账号、无 DB
- 生日资料主要存在 URL 参数
- URL 参数会进浏览器历史/日志/分析工具，法务页要揭露
- 不要把用户原文/PII 放进 repo

## 5. 已知风险

1. 密钥曾在对话出现，必须轮换
2. `NETLIFY_AUTH_TOKEN` 仍存在但已不需要
3. 限流是进程内计数，多实例可绕过
4. 无 Sentry/告警，错误可能无人知道
5. 1GB VPS，DDoS/突发流量风险
6. 无订单 DB，付款后对帐/退款靠 PSP

## 6. 事件处理

若怀疑泄漏：

1. 立即轮换该密钥
2. 重启相关服务
3. 检查 access log / PSP 后台
4. 在 `operations/CHANGELOG.md` 记录（不写密钥）
5. 通知 Owner
