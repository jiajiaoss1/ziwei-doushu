---
title: 部署与运维
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared]
canonical: true
---

# 部署与运维（VPS）

> 现行架构：Vultr Tokyo + Docker Compose + Caddy（HTTP-01）。
> 旧的 Netlify DNS-01 文件已移到 `archive/`，不要照旧文件做。

## 1. 服务器

| 项目 | 值 |
|---|---|
| 提供商 | Vultr（Tokyo / JP） |
| IP | `45.77.180.73` |
| 系统 | Ubuntu 24.04 LTS |
| 代码 | `/opt/shibikan` |
| 服务 | Caddy 80/443；app 3000 只在容器内 |
| 凭证 | Let's Encrypt HTTP-01（Caddy 自动续期） |

## 2. DNS

| 项目 | 值 |
|---|---|
| 注册商 | 西部数码（west.cn） |
| Nameserver | `ns1.myhostadmin.net` ～ `ns6.myhostadmin.net` |
| A `@` | `45.77.180.73`（TTL 600） |
| A `www` | `45.77.180.73`（TTL 600） |

**不要再把 NS 指回 Netlify。**

检查：

```bash
whois -h whois.verisign-grs.com shibikan.com | grep -i "name server"
dig @ns1.myhostadmin.net shibikan.com A +short
dig @8.8.8.8 shibikan.com A +short
```

## 3. 标准发版流程

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

### 部署后验证

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://shibikan.com/api/health   # 200
curl -s -o /dev/null -w "%{http_code}\n" https://shibikan.com/zh           # 200
curl -s -o /dev/null -w "%{http_code}\n" https://shibikan.com/ja           # 200
curl -s -o /dev/null -w "%{redirect_url}\n" https://shibikan.com/          # /zh
```

## 4. HTTPS / Caddy

- `Caddyfile` 目前**没有** `tls { dns ... }`，使用 HTTP-01
- Caddy 自动申请/续期；80 必须开放
- `www` → `https://shibikan.com{uri}` 301

### 技术债

`Dockerfile.caddy` 仍编译 `caddy-dns/netlify`，`docker-compose.yml` 仍传 `NETLIFY_AUTH_TOKEN`，但 Caddyfile 已不用。
清理时：

1. `Caddyfile` 保持 HTTP-01
2. compose 的 caddy 改回 `image: caddy:2-alpine`，移除 `NETLIFY_AUTH_TOKEN`
3. 删 `Dockerfile.caddy`
4. 重启 Caddy，确认凭证仍正常

## 5. 环境变数

位置：`/opt/shibikan/.env.production`，**不进 Git**。

| 变数 | 用途 |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | canonical/OGP/sitemap |
| `NEXT_PUBLIC_GA_ID` | GA4 |
| `ACME_EMAIL` | Let's Encrypt 通知 |
| `JP_BETA_FREE` | `true` β 全免费 |
| `JP_UNLOCK_SECRET` | 解锁 token |
| `JP_AI_TOKEN_SECRET` | AI token |
| `JP_WEBHOOK_SECRET` | webhook/order token |
| `JP_LLM_API_KEY` | DeepSeek key |
| `JP_LLM_BASE_URL` | `https://api.deepseek.com/v1` |
| `JP_LLM_MODEL` | `deepseek-chat` |
| `JP_CHECKOUT_URL` | 外部支付页（可选） |
| `NETLIFY_AUTH_TOKEN` | 旧 Caddy DNS-01 遗留，待移除 |

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

| 现象 | 处理 |
|---|---|
| build OOM / `Killed` | `free -h`；升 2GB 或加 swap |
| 容器 unhealthy | `logs -f app` |
| 502/504 | 看 app 日志；确认 health |
| 凭证失败 | 80 是否开放；Caddy 日志；DNS 是否指向 VPS |
| 域名不解析 | `dig @ns1.myhostadmin.net`；west.cn |
| AI 501 | `JP_LLM_API_KEY` 未设 |
| 支付「准备中」 | `JP_BETA_FREE=true` 或未设 `JP_CHECKOUT_URL` |

## 8. 安全

- SSH key only，关闭 password
- UFW 只开 22/80/443
- `.env.production` 权限 `600`
- 定期轮换曾暴露的密钥
- 见 `engineering/SECURITY.md`

## 9. 备份

- 无 DB；备份 `.env.production` 与 Caddy volume（凭证可重签）
- 代码在 GitHub
- VPS 可重建；保留 DNS/部署文件
