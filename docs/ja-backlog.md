# 紫微館 Backlog

更新日：2026-11-16  
現状：**VPS（Vultr 東京）で本番稼働中**。`https://shibikan.com` は Caddy + Next.js。Netlify は DNS と証明書用トークンのみ依存。β版は全無料、AI は未設定（501）。

---

## P0：公開前に必須

- [ ] **GA4 を有効化**
  - GA4 プロパティ作成 → `G-XXXXXXXXXX`
  - Netlify DNS / VPS の `.env.production` に `NEXT_PUBLIC_GA_ID`
  - `bash scripts/vps/deploy.sh` で再ビルド
- [ ] **Search Console**
  - ドメインプロパティ `shibikan.com` を DNS TXT で認証
  - `https://shibikan.com/sitemap.xml` を送信（現在 14 URL）
  - `/ja` を URL 検査 → インデックス登録リクエスト
  - Bing は GSC からインポート
- [ ] **真機チェック**
  - iPhone / Android で トップ → 診断 → 結果 → 鑑定書 → 相性 → 2027
  - 390px で横スクロール・文字切れ・CTA 位置
- [ ] **VPS を 2GB に増強**
  - リリース前に Vultr の Change Plan
  - 1GB + swap はテスト用。ビルド・同時アクセスで余裕なし
- [ ] **secret をローテーション**
  - `JP_UNLOCK_SECRET` / `JP_AI_TOKEN_SECRET` はチャットに出たため、公開前に再生成
  - `NETLIFY_AUTH_TOKEN` も必要なら再発行
- [ ] **法務**
  - 特商法の事業者名・所在地・電話を確定
  - プライバシー / 利用規約 / 返金条件を日本の弁護士が確認
  - `support@example.com` を実在アドレスへ
- [ ] **監視**
  - UptimeRobot などで `https://shibikan.com/api/health` を 5 分間隔
  - `.env.production` のバックアップ（安全な場所）

---

## P1：課金クローズドループ

- [ ] 日本法人/事業者を確定
- [ ] PSP を選定（AXES / SUI など。Stripe は占い不可）
- [ ] チェックアウトセッション作成
- [ ] Webhook 署名検証
- [ ] 注文テーブル（DB）と管理画面
- [ ] 決済成功 → `signUnlock()` で鑑定書 URL 発行
- [ ] 領収書メール / 返金 / 問い合わせ導線
- [ ] `JP_BETA_FREE=false` に切り替え、価格・税表示を最終確認

---

## P2：集客・改善

- [ ] 記事の内部リンク強化（記事 → 診断 → 鑑定書）
- [ ] 結果ページの CTA / 鑑定書プレビューの改善
- [ ] メール取得（CRM）と無料診断後のフォロー
- [ ] Search Console / GA4 のデータを見て記事テーマを追加
- [ ] 2027 ページの季節性・公開タイミング見直し
- [ ] 相性結果の共有導線（OGP 画像含む）
- [ ] AI を有効化する場合：
  - `JP_LLM_API_KEY` 設定
  - コスト上限・レート制限（グローバル）を確認
  - AI 出力の免責・レビュー

---

## P3：技術的負債

- [ ] AI レート制限のグローバル化（Upstash Redis など。現在はプロセス内 + token）
- [ ] 四柱を画面に出す場合、`utcOffset` 対応（現在は中国標準時前提）
- [ ] 中国語デモページの扱いを決定（残す / 404 / `/zh` に移す）
- [ ] Netlify の扱い
  - DNS zone と `NETLIFY_AUTH_TOKEN` は Caddy の DNS-01 に必要なので残す
  - ホスティングプロジェクトは安定 2 週間後に削除
  - 完全移行するなら Cloudflare DNS + Caddy `dns cloudflare` へ
- [ ] 金標準盤を追加（大限境界・節気境界・空宮のパターン）
- [ ] `npm test` / `smoke:ja` を CI（GitHub Actions）に組み込む
- [ ] エラーモニタリング（Sentry 等）

---

## 保留・決定事項

- 交友宮表記を採用（三合派）。奴僕宮に変える場合は `glossary.ts` の 1 行
- 明暗は 7 段階、`地 → 平`
- 流年は暦年セレクタ。春節/立春境界は FAQ で説明
- AI はキー未設定のためオフ。オンにする場合は P2 の項目を先に
