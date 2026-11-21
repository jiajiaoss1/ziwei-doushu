---
title: 部署與運維
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared]
canonical: true
---

# 部署與運維（VPS）

> 現行架構：Vultr Tokyo + Docker Compose + Caddy（HTTP-01）。
> 舊的 Netlify DNS-01 文件已移到 `archive/`，不要照舊文件做。

## 1. 伺服器

| 項目 | 值 |
|---|---|
| 提供商 | Vultr（Tokyo / JP） |
| IP | `45.77.180.73` |
| 系統 | Ubuntu 24.04 LTS |
| 代碼 | `/opt/shibikan` |
| 服務 | Caddy 80/443；app 3000 只在容器內 |
| 憑證 | Let's Encrypt HTTP-01（Caddy 自動續期） |

## 2. DNS

| 項目 | 值 |
|---|---|
| 註冊商 | 西部数码（west.cn） |
| Nameserver | `ns1.myhostadmin.net` ～ `ns6.myhostadmin.net` |
| A `@` | `45.77.180.73`（TTL 600） |
| A `www` | `45.77.180.73`（TTL 600） |

**不要再把 NS 指回 Netlify。**

檢查：

```bash
whois -h whois.verisign-grs.com shibikan.com | grep -i "name server"
dig @ns1.myhostadmin.net shibikan.com A +short
dig @8.8.8.8 shibikan.com A +short
```

## 3. 標準發版流程

### 本地

```bash
npx tsc --noEmit
npm test
npm run build
git add -A && git commit -m "..."
git push origin main
```

### VPS

```bash
ssh root@45.77.180.73
cd /opt/shibikan
git pull
bash scripts/vps/deploy.sh
```

`deploy.sh`：`git pull` → `docker compose build app` → `up -d` → `prune` → `ps`。

### 部署後驗證

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://shibikan.com/api/health   # 200
curl -s -o /dev/null -w "%{http_code}\n" https://shibikan.com/zh           # 200
curl -s -o /dev/null -w "%{http_code}\n" https://shibikan.com/ja           # 200
curl -s -o /dev/null -w "%{redirect_url}\n" https://shibikan.com/          # /zh
```

## 4. HTTPS / Caddy

- `Caddyfile` 目前**沒有** `tls { dns ... }`，使用 HTTP-01
- Caddy 自動申請/續期；80 必須開放
- `www` → `https://shibikan.com{uri}` 301

### 技術債

`Dockerfile.caddy` 仍編譯 `caddy-dns/netlify`，`docker-compose.yml` 仍傳 `NETLIFY_AUTH_TOKEN`，但 Caddyfile 已不用。
清理時：

1. `Caddyfile` 保持 HTTP-01
2. compose 的 caddy 改回 `image: caddy:2-alpine`，移除 `NETLIFY_AUTH_TOKEN`
3. 刪 `Dockerfile.caddy`
4. 重啟 Caddy，確認憑證仍正常

## 5. 環境變數

位置：`/opt/shibikan/.env.production`，**不進 Git**。

| 變數 | 用途 |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | canonical/OGP/sitemap |
| `NEXT_PUBLIC_GA_ID` | GA4 |
| `ACME_EMAIL` | Let's Encrypt 通知 |
| `JP_BETA_FREE` | `true` β 全免費 |
| `JP_UNLOCK_SECRET` | 解鎖 token |
| `JP_AI_TOKEN_SECRET` | AI token |
| `JP_WEBHOOK_SECRET` | webhook/order token |
| `JP_LLM_API_KEY` | DeepSeek key |
| `JP_LLM_BASE_URL` | `https://api.deepseek.com/v1` |
| `JP_LLM_MODEL` | `deepseek-chat` |
| `JP_CHECKOUT_URL` | 外部支付頁（可選） |
| `NETLIFY_AUTH_TOKEN` | 舊 Caddy DNS-01 遺留，待移除 |

> `NEXT_PUBLIC_*` 是 build-time；改完要重新 `deploy.sh`。

## 6. 常用命令

```bash
cd /opt/shibikan

docker compose --env-file .env.production ps
docker compose --env-file .env.production logs -f app
docker compose --env-file .env.production logs -f caddy
docker compose --env-file .env.production restart app
docker compose --env-file .env.production restart caddy

df -h /
free -h
docker system df
```

## 7. 故障排查

| 現象 | 處理 |
|---|---|
| build OOM / `Killed` | `free -h`；升 2GB 或加 swap |
| 容器 unhealthy | `logs -f app` |
| 502/504 | 看 app 日誌；確認 health |
| 憑證失敗 | 80 是否開放；Caddy 日誌；DNS 是否指向 VPS |
| 域名不解析 | `dig @ns1.myhostadmin.net`；west.cn |
| AI 501 | `JP_LLM_API_KEY` 未設 |
| 支付「準備中」 | `JP_BETA_FREE=true` 或未設 `JP_CHECKOUT_URL` |

## 8. 安全

- SSH key only，關閉 password
- UFW 只開 22/80/443
- `.env.production` 權限 `600`
- 定期輪換曾暴露的密鑰
- 見 `engineering/SECURITY.md`

## 9. 備份

- 無 DB；備份 `.env.production` 與 Caddy volume（憑證可重簽）
- 代碼在 GitHub
- VPS 可重建；保留 DNS/部署文件
