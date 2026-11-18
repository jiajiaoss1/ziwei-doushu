# 紫微館 部署与运维 Runbook

> 面向：需要在 VPS 上部署 / 排查问题的人（包括未来的自己）。
> 最后更新：2026-11-18（DNS 从 Netlify 切回西部数码当天）

---

## 1. 服务器

| 项 | 值 |
|---|---|
| 提供商 | Vultr（Tokyo / JP） |
| 公网 IP | **45.77.180.73** |
| 系统 | Ubuntu 24.04 LTS |
| 登录用户 | `root` |
| 代码路径 | `/opt/shibikan` |
| 服务端口 | 80 / 443（Caddy），3000 仅容器内 |

### 登录

```bash
ssh root@45.77.180.73
```

### 密码忘了怎么办

Vultr 控制台 → **Products → Compute → shibikan** → **Settings** → **Change Password** → 设新密码 → **重启服务器**（重启后才生效）。

> 重启会中断几十秒；如果 DNS 还没指向 VPS，线上访客不受影响。

### 免密登录（可选，建议做）

```bash
# 在自己电脑上生成 key
ssh-keygen -t ed25519 -C "weikong@mac"
# 把公钥内容追加到 VPS
ssh root@45.77.180.73 'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys' < ~/.ssh/id_ed25519.pub
```

---

## 2. 代码仓库

| 项 | 值 |
|---|---|
| GitHub | https://github.com/jiajiaoss1/ziwei-doushu |
| 分支 | `main` |
| 本地工作副本 | `/Users/WEIKONG/claudesessions/ziweidoushu` |

---

## 3. 标准发版流程

### 本地

```bash
cd /Users/WEIKONG/claudesessions/ziweidoushu
npx tsc --noEmit          # 类型检查
npm test                  # 回归测试
git add -A && git commit -m "..." && git push origin main
```

### VPS

```bash
ssh root@45.77.180.73
cd /opt/shibikan
git pull
bash scripts/vps/deploy.sh
```

`deploy.sh` 依次执行：`git pull` → `docker compose build app` → `up -d` → `prune` → `ps`。

### 部署后验证

```bash
cd /opt/shibikan
docker compose --env-file .env.production ps    # app/caddy 应为 Up (healthy)
curl -s http://127.0.0.1:3000/api/health        # {"ok":true}
```

### 从本地验证（DNS 未切换时）

```bash
# 强制把域名解析到 VPS，绕过 DNS
curl --resolve shibikan.com:443:45.77.180.73 https://shibikan.com/api/health
```

---

## 4. DNS（2026-11-18 起）

| 项 | 值 |
|---|---|
| 域名注册商 | **西部数码（west.cn）** |
| Nameserver | `ns1.myhostadmin.net` ~ `ns6.myhostadmin.net` |
| A 记录 | `@` → `45.77.180.73`，`www` → `45.77.180.73`（TTL 600） |
| 管理入口 | 西部数码 → 域名管理 → shibikan.com → DNS 解析 |

### 历史

- 2026-11-16 起曾用 **Netlify DNS**（`p05.nsone.net`）
- 2026-11-18：Netlify 账户额度耗尽（`production deploys paused`），DNS 切回西部数码 NS
- **不要再把 NS 指回 Netlify**

### 检查 DNS 是否生效

```bash
# 注册局委派（最权威）
whois -h whois.verisign-grs.com shibikan.com | grep -i "name server"

# 西部数码权威 DNS
dig @ns1.myhostadmin.net shibikan.com A +short   # 应返回 45.77.180.73

# 公共 DNS（缓存刷新后）
dig @8.8.8.8 shibikan.com A +short
```

---

## 5. HTTPS 证书

- Caddy 自动申请 / 续期（Let's Encrypt）
- 当前配置：**DNS-01 via Netlify**（`Caddyfile` 的 `tls { dns netlify {env.NETLIFY_AUTH_TOKEN} }`）
- **待办**：Netlify 已弃用，需要改成 **HTTP-01**（不依赖 DNS API）：
  - 删除 `Caddyfile` 里的 `tls { ... }` 块
  - `docker compose --env-file .env.production restart caddy`
- 现有证书约 88 天有效期，不急于重签，但到期前必须改好

---

## 6. 常用运维命令

```bash
cd /opt/shibikan

# 状态
docker compose --env-file .env.production ps

# 日志
docker compose --env-file .env.production logs -f app
docker compose --env-file .env.production logs -f caddy

# 重启应用
docker compose --env-file .env.production restart app

# 磁盘 / 内存
df -h /
free -h
docker system df
```

---

## 7. 环境变量（`.env.production`）

位置：`/opt/shibikan/.env.production`，**绝不提交到 Git**。

| 变量 | 用途 |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | 公开域名（影响 canonical / OGP / sitemap） |
| `NEXT_PUBLIC_GA_ID` | GA4 测量 ID |
| `ACME_EMAIL` | Let's Encrypt 通知地址 |
| `NETLIFY_AUTH_TOKEN` | 当前仅 Caddy DNS-01 使用（待移除） |
| `JP_BETA_FREE` | `true` = β 全免费；`false` = 事业报告收费 |
| `JP_UNLOCK_SECRET` | 鉴定书解锁 token 的 HMAC 密钥 |
| `JP_AI_TOKEN_SECRET` | AI 接口 token 密钥 |
| `JP_WEBHOOK_SECRET` | 支付 webhook 签名 + order token 加密 |
| `JP_LLM_API_KEY` | LLM API key（配置后 AI 面板启用） |
| `JP_LLM_BASE_URL` | 默认 `https://api.openai.com/v1`（DeepSeek 用 `https://api.deepseek.com/v1`） |
| `JP_LLM_MODEL` | 默认 `gpt-4o-mini`（DeepSeek 用 `deepseek-chat`） |
| `JP_CHECKOUT_URL` | 外部支付页 URL（未设 = 決済準備中） |

> `NEXT_PUBLIC_*` 在 **构建时** 注入，改完必须重新 `deploy.sh`。

---

## 8. 故障排查

| 现象 | 处理 |
|---|---|
| `git pull` 报本地修改冲突 | `git stash` 或 `git checkout -- .` 后重试 |
| `.env.production がありません` | `cp .env.production.example .env.production` 并填值 |
| build 失败 / OOM | `free -h` 看内存（1GB 不足，换 2GB）；`df -h` 看磁盘 |
| 容器 unhealthy | `docker compose ... logs -f app` 看错误 |
| 域名解析不到 | `dig @ns1.myhostadmin.net shibikan.com A`；确认西部数码 DNS 已就绪 |
| 证书续期失败 | 检查 Caddy 日志；确认已改为 HTTP-01 或 DNS API 可用 |
| AI 返回 501 | `.env.production` 的 `JP_LLM_API_KEY` 未配置 |
| 支付返回「決済準備中」 | `JP_CHECKOUT_URL` 未配置或 `JP_BETA_FREE=false` |

---

## 9. 安全清单

- [ ] SSH 改密钥登录，禁用密码（`PasswordAuthentication no`）
- [ ] 轮换已暴露的 token：GitHub PAT、Netlify token
- [ ] `.env.production` 定期备份（安全位置）
- [ ] UFW 只放 22/80/443
- [ ] `unattended-upgrades` 保持开启
