---
title: 安全與密鑰
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared]
canonical: true
---

# 安全與密鑰

## 1. 密鑰清單

| 變數 | 用途 | 備註 |
|---|---|---|
| `JP_UNLOCK_SECRET` | 報告解鎖 HMAC | 曾出現在對話，建議輪換 |
| `JP_AI_TOKEN_SECRET` | AI token HMAC | 曾出現在對話，建議輪換 |
| `JP_WEBHOOK_SECRET` | webhook 驗簽 + order token | 不可洩漏 |
| `JP_LLM_API_KEY` | DeepSeek | 只放 VPS |
| `NETLIFY_AUTH_TOKEN` | 舊 Caddy DNS-01 | Caddyfile 已 HTTP-01，待移除 |
| `ACME_EMAIL` | Let's Encrypt | 非密鑰 |

**不要**把任何 key 寫進 repo、docs、截圖、聊天。已暴露的要輪換。

## 2. 部署安全

- SSH 只用 key，關閉 password
- UFW 只開 22/80/443
- `.env.production` `chmod 600`
- VPS 定期 `apt upgrade` / unattended-upgrades
- Docker socket 等於 root，限制登入

## 3. Web/API

- HTTPS 強制（Caddy）
- HSTS、X-Content-Type-Options、Referrer-Policy、Permissions-Policy
- AI API：
  - 同源檢查（`Origin`）
  - 短命 token（IP + 生日 + 15 分）
  - IP 10/10min、token 5/15min
  - 每日 IP 20 / 全域 1000
- 支付：
  - order token AES-256-GCM
  - webhook HMAC-SHA256
  - 驗簽失敗 401

## 4. 隱私

- 無帳號、無 DB
- 生日資料主要存在 URL 參數
- URL 參數會進瀏覽器歷史/日誌/分析工具，法務頁要揭露
- 不要把使用者原文/PII 放進 repo

## 5. 已知風險

1. 密鑰曾在對話出現，必須輪換
2. `NETLIFY_AUTH_TOKEN` 仍存在但已不需要
3. 限流是進程內計數，多實例可繞過
4. 無 Sentry/告警，錯誤可能無人知道
5. 1GB VPS，DDoS/突發流量風險
6. 無訂單 DB，付款後對帳/退款靠 PSP

## 6. 事件處理

若懷疑洩漏：

1. 立即輪換該密鑰
2. 重啟相關服務
3. 檢查 access log / PSP 後台
4. 在 `operations/CHANGELOG.md` 記錄（不寫密鑰）
5. 通知 Owner
