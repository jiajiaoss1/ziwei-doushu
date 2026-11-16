#!/usr/bin/env bash
# VPS 上で実行するデプロイ/更新スクリプト。
# 使い方: cd /opt/shibikan && bash scripts/vps/deploy.sh
set -euo pipefail
cd "$(dirname "$0")/../.."

if [[ ! -f .env.production ]]; then
  echo ".env.production がありません。.env.production.example からコピーしてください。" >&2
  exit 1
fi

if [[ -d .git ]]; then
  echo "==> git pull"
  git pull --ff-only
fi

echo "==> build"
docker compose --env-file .env.production build app

echo "==> up"
docker compose --env-file .env.production up -d --remove-orphans

echo "==> prune"
docker image prune -f >/dev/null || true

echo "==> status"
docker compose --env-file .env.production ps
echo
echo "ログ: docker compose --env-file .env.production logs -f app caddy"
