# ADR-0005 部署与 DNS

- 日期：2026-11-21
- 状态：Accepted
- 批准人：负责人

## 决定

- VPS：Vultr Tokyo（Ubuntu 24.04）
- 部署：Docker Compose（app + Caddy）
- DNS：西部数码（west.cn），A `@`/`www` → `45.77.180.73`
- 凭证：Caddy HTTP-01（不使用 Netlify DNS-01）
- Netlify：不再用于部署/DNS

## 理由

- Netlify 免费额度耗尽、部署暂停
- VPS 可控、成本低、日本延迟好
- HTTP-01 不依赖外部 DNS API

## 后果

- 80 必须开放
- `Dockerfile.caddy` / `NETLIFY_AUTH_TOKEN` 是遗留，待清理
- 不要再把 NS 指回 Netlify
