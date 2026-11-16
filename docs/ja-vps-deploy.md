# 紫微館 VPS デプロイ手順（Vultr 東京 / ConoHa）

Next.js を **Docker + Caddy** で 1 台の VPS に載せる構成です。  
Netlify は止めずに残し、DNS を切り替えて移行します（失敗したら戻せる）。

## 構成

```
Internet
  │ 443/80
  ▼
Caddy（自動 HTTPS / www→apex リダイレクト）
  │ 3000
  ▼
Next.js standalone（Docker）
```

- DB なし。注文情報もまだ持たない
- 永続データは `.env.production` と Caddy の証明書ボリュームだけ
- 1 コンテナで動くので、AI のレートリミットもプロセス内で一貫する

## 0. 前提

- ドメイン `shibikan.com` の DNS は **Netlify DNS** のまま
- VPS は **Ubuntu 24.04 / 2GB RAM** 推奨（1GB でも swap で可）
- ローカルに SSH 鍵がある

## 1. VPS を作る

Vultr → Deploy New Server:

- Type: Cloud Compute
- Location: **Tokyo**
- Image: Ubuntu 24.04 LTS
- Plan: 2GB RAM（$12/月目安）
- SSH Key: 自分の公開鍵を登録
- IPv4 を有効化

作成後に **IP アドレス**を控える。

## 2. DNS を VPS に向ける

Netlify → **Domain management** → `shibikan.com` → DNS records:

| Type | Name | Value | TTL |
|---|---|---|---|
| A | `@` | `<VPS_IP>` | 300 |
| A | `www` | `<VPS_IP>` | 300 |

- 既存の Netlify 用 A レコードは**削除せず値だけ控えておく**（ロールバック用）
- NS は変えない（Netlify DNS のまま）
- 反映確認: `dig +short A shibikan.com`

> Caddy は HTTP-01 / TLS-ALPN で証明書を取るため、DNS が VPS を向いてから証明書が発行される。先に DNS を向けてから Caddy を起動するのが楽。

## 3. 初期設定

```bash
ssh root@<VPS_IP>

apt-get update
apt-get install -y git
git clone https://github.com/jiajiaoss1/ziwei-doushu.git /opt/shibikan
cd /opt/shibikan
sudo bash scripts/vps/bootstrap.sh
```

`bootstrap.sh` がやること:

- Docker インストール
- メモリ 2GB 未満なら 2GB swap 作成
- UFW で 22/80/443 を許可

## 4. 環境変数

```bash
cd /opt/shibikan
cp .env.production.example .env.production
vi .env.production
```

最低限:

```dotenv
NEXT_PUBLIC_SITE_URL=https://shibikan.com
ACME_EMAIL=your-real-email@example.com

JP_BETA_FREE=true
JP_UNLOCK_SECRET=<openssl rand -base64 32>
JP_AI_TOKEN_SECRET=<openssl rand -base64 32>

NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX   # 取れたら
```

- `NEXT_PUBLIC_*` は **ビルド時に埋め込まれる**ので、変えたら再ビルド
- `.env.production` は Git にコミットしない

## 5. デプロイ

```bash
cd /opt/shibikan
bash scripts/vps/deploy.sh
```

初回はビルド込みで 3–6 分。  
Caddy が証明書を取るまで 1–2 分待つ。

```bash
docker compose --env-file .env.production ps
docker compose --env-file .env.production logs -f caddy
```

## 6. 動作確認

```bash
curl -I https://shibikan.com/          # 307 → /ja
curl -I https://shibikan.com/ja        # 200
curl -I https://www.shibikan.com/ja    # 301 → https://shibikan.com/ja
curl -s https://shibikan.com/api/health # {"ok":true}
```

証明書:

```bash
echo | openssl s_client -connect shibikan.com:443 -servername shibikan.com 2>&1 \
  | grep -E "subject=|issuer="
```

## 7. 更新

```bash
cd /opt/shibikan
bash scripts/vps/deploy.sh
```

`git pull` → `docker compose build` → `up -d` → 古い image を prune。

## 8. ログ・運用

```bash
cd /opt/shibikan

# アプリ
docker compose --env-file .env.production logs -f app

# Caddy
docker compose --env-file .env.production logs -f caddy

# 再起動
docker compose --env-file .env.production restart app

# ディスク
docker system df
```

- Caddy の証明書は `caddy_data` ボリュームに保存され、自動更新
- DB がないのでバックアップは `.env.production` と Caddy ボリューム程度
- 監視は UptimeRobot などで `https://shibikan.com/api/health` を 5 分間隔

## 9. セキュリティ

- SSH は鍵ログインのみ（password ログイン無効化）
- UFW は 22/80/443 のみ
- `unattended-upgrades` を有効化
- Docker は root 相当。VPS 自体の更新を怠らない

SSH  hardening 例（任意）:

```bash
sed -i 's/^#\?PasswordAuthentication .*/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl reload ssh
```

## 10. ロールバック（Netlify に戻す）

Netlify DNS の A レコードを、移行前に控えた値に戻す:

```
A @   -> <old Netlify A>
A www -> <old Netlify A>
```

TTL 300 なら数分で戻る。Netlify のサイトは消さずに残しておく。

## 11. 注意点

- **1GB VPS はビルドで OOM しやすい**。2GB か swap 必須
- `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_GA_ID` を変えたら **必ず再ビルド**
- Caddy は 80/443 を直接使う。他の Web サーバー（Nginx/Apache）を同時に動かさない
- 中国本土からのアクセスは VPS の回線次第。日本向けなので東京リージョンでOK
- 決済導入後は注文 DB が必要。この構成に PostgreSQL を足すか、PSP 側の決済リンクを使う
