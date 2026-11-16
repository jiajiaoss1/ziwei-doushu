#!/usr/bin/env bash
# Ubuntu 22.04/24.04 の新規 VPS 初期設定。
# 実行: sudo bash scripts/vps/bootstrap.sh
set -euo pipefail

if [[ $EUID -ne 0 ]]; then
  echo "sudo で実行してください: sudo bash scripts/vps/bootstrap.sh" >&2
  exit 1
fi

apt-get update
apt-get install -y ca-certificates curl git ufw

# Docker（公式の convenience script）
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
fi
systemctl enable --now docker

# 2GB 未満なら 2GB の swap を作る（next build の OOM 対策）
if [[ $(awk '/MemTotal/ {print int($2/1024)}' /proc/meminfo) -lt 2048 ]] && ! swapon --show | grep -q '/swapfile'; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  echo "swapon: 2GB 追加"
fi

# ファイアウォール
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 443/udp
ufw --force enable

echo
echo "完了。次:"
echo "  git clone <repo> /opt/shibikan && cd /opt/shibikan"
echo "  cp .env.production.example .env.production && vi .env.production"
echo "  bash scripts/vps/deploy.sh"
