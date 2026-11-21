# ADR-0005 部署與 DNS

- 日期：2026-11-21
- 狀態：Accepted
- 批准人：负责人

## 決定

- VPS：Vultr Tokyo（Ubuntu 24.04）
- 部署：Docker Compose（app + Caddy）
- DNS：西部数码（west.cn），A `@`/`www` → `45.77.180.73`
- 憑證：Caddy HTTP-01（不使用 Netlify DNS-01）
- Netlify：不再用於部署/DNS

## 理由

- Netlify 免費額度耗盡、部署暫停
- VPS 可控、成本低、日本延遲好
- HTTP-01 不依賴外部 DNS API

## 後果

- 80 必須開放
- `Dockerfile.caddy` / `NETLIFY_AUTH_TOKEN` 是遺留，待清理
- 不要再把 NS 指回 Netlify
