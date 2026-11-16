# 紫微館（日本版）上线清单

> 面向日本市场的日语版部署说明。代码已就绪，以下是「从本地到公开」需要做的事。

---

## 1. 部署形态

| 方案 | 适合 | 说明 |
|---|---|---|
| **Vercel（推荐）** | 先上线验证 | `vercel.json` 已指定 `hnd1`（东京）区域；静态页面走 CDN，`/ja/result`・`/ja/report`・`/api/*` 走函数 |
| 自托管 Node | 需要国内/日本服务器 | `npm run build && npm start`，需自行配 HTTPS 与反向代理 |
| 静态导出 | 不适用 | 结果页与 API 是动态的，不能 `output: export` |

日本用户的个人信息（生年月日）不落库，只在 URL 参数中传递；若后续加历史记录功能，服务器请放在日本区域，避免 APPI 的越境移转同意问题。

---

## 2. 环境变量

复制 `.env.ja.example`，在 Vercel 的 Environment Variables 或服务器 `.env` 中设置：

| 变量 | 必填 | 说明 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | ✅ | 公开域名（无末尾斜杠）。影响 canonical、OGP、sitemap 的绝对 URL |
| `JP_BETA_FREE` | — | 默认 `true`。改 `false` 后事业报告进入付费模式 |
| `JP_UNLOCK_SECRET` | 付费时✅ | 报告解锁 token 的 HMAC 密钥，32 位以上随机串 |
| `JP_CHECKOUT_URL` | 付费时✅ | MoR/Stripe 的结账页 URL；未设置则显示「決済準備中」 |
| `JP_LLM_API_KEY` | — | OpenAI 兼容 Key；设置后结果页出现 AI 深掘り |
| `JP_LLM_BASE_URL` | — | 默认 `https://api.openai.com/v1` |
| `JP_LLM_MODEL` | — | 默认 `gpt-4o-mini` |

---

## 3. 域名与 SEO

1. 绑定域名并强制 HTTPS。
2. `NEXT_PUBLIC_SITE_URL` 改成正式域名后重新部署（否则 OGP/canonical 还是 localhost）。
3. Google Search Console / Bing Webmaster Tools 提交 `https://<domain>/sitemap.xml`。
4. 确认以下页面可访问且 canonical 正确：
   - `/ja`、`/ja/shindan`、`/ja/articles`、6 篇 `/ja/articles/*`、`/ja/aishou`、`/ja/2027`
   - `/ja/legal/*`
5. `/ja/result`、`/ja/report`、`/ja/checkout` 已设 `noindex`，不要放进 sitemap。

---

## 4. 支付接入（事业鉴定书 4,980 円）

> **重要（2026-11 调查）**：主流全球支付商对「占い」有明确限制，不能按普通数字商品接。
> - Stripe 日本：禁止「霊媒サービス・算命師」（[Stripe 禁止/限制业务](https://stripe.com/cn/legal/restricted-businesses) 的日本管辖条款）
> - Creem：禁止「Metaphysical, fortune-telling, and spiritual outcome services」（[Creem 审核政策](https://docs.creem.io/merchant-of-record/account-reviews/account-reviews)）
> - Dodo：把「Spiritual & Astrology」列为需严格审查，仅限娱乐、不得预测（[Dodo 政策](https://docs.dodopayments.com/miscellaneous/merchant-acceptance)）
> - Lemon Squeezy：社区反馈自 2026-02 起不接受中国开发者；且其禁止清单也需要逐条确认
>
> 因此，**可落地的路线是日本本地支付代行**（接受「占い」业种），而不是 Stripe/MoR：
> - AXES Payment（SBI 集团）：有「有料占いサイト」导入实绩（[事例](https://www.axes-payment.co.jp/case/horoscope.html)）
> - SUI Credit Service（シマトモ）：明确列出「占い」为可对应业种（[业种](https://shimatomo.com/industries)）
> - 其他：GMO PG / KOMOJU 等需事前审查，向营业确认「占い」可否
>
> 这些都需要**日本法人或日本个人事业主 + 日本地址 + 日本银行账户**，并提交网站、特商法表记、价格、退款政策、免责说明。费率与保证金按业种报价。

当前代码已就绪的流程：

```
购买页 → 外部结账（JP_CHECKOUT_URL）
       → 支付成功回调（你的 webhook）
       → 服务端 signUnlock('work', birthKey, ttl) 生成 token
       → 跳转 /ja/report?...&t=<token> → 全文显示
```

接入步骤：

1. 先完成日本主体与 PSP 事前审查（提交本网站、特商法、利用规约、隐私政策、退款条款）。
2. 在 PSP 侧创建「事業鑑定書 4,980円」的支付链接/API，把 URL 填入 `JP_CHECKOUT_URL`。
3. 回调里校验支付状态，然后用 `lib/jp/access.ts` 的 `signUnlock()` 生成 token。
4. token 默认 30 天有效；退款/争议时把 `JP_UNLOCK_SECRET` 轮换即可让旧 token 失效。
5. 上线前跑一遍「无 token → 锁定 / 有 token → 全文」。

> `JP_BETA_FREE=false` 之后，恋爱报告仍免费（`getReportAccess` 里写死），只有事业报告收费。
> 在主体/PSP 准备好之前，保持 `JP_BETA_FREE=true`，用免费版验证内容与转化。

---

## 4.5 ドメイン

- `.jp` は日本国内の住所（通知を受け取れる住所）が必要。`.co.jp` は日本で登記した法人のみ（[JPRS](https://jprs.jp/faq/registration/)）。
- 日本主体・住所がない段階では **.com を先に取得**し、後から `.jp` を取得して 301 リダイレクトするのが現実的。
- 日本ユーザーは `.jp` / `.co.jp` を「国内事業者」のサインとして見るが、`.com` でも信頼は得られる。実際は特商法表記・会社情報・日本語の品質・SSL の方が効く。
- 候補：`shibikan.jp` / `shibikan.com`（短く、ハイフン・数字なし）。ブランド名で取り、キーワード（uranai / shibitosu）は title/description 側で拾う。
- 日本語ドメイン（IDN）はメインにしない（メール・共有・入力の事故）。必要なら防御的に取得。
- `.jp` は WHOIS で登録者情報が公開されるため、住所は事業用のものを使う。
- 取得後、`NEXT_PUBLIC_SITE_URL` を正式ドメインに変更して再デプロイ（OGP/canonical/sitemap が全部これ基準）。

## 5. 法务上线清单

- [ ] **特定商取引法表记**：填入事业者名、所在地、电话、邮件、退换货条款（现在都是「準備中」）
- [ ] **隐私政策**：若接入支付/分析工具，补充委托方与越境移转说明
- [ ] **景品表示法**：确认没有「必ず当たる」「的中率○%」等表述
- [ ] **消费者契约法**：不出现「断定的判断の提供」；不碰霊感商法（霊障・因縁・お祓い）
- [ ] **医师法・药机法**：健康相关文案不写病名、诊断、治疗
- [ ] **未成年**：页面已有提示，必要时加年龄确认
- [ ] **JCT**：MoR 由服务商代缴；自建支付需确认消费税处理
- [ ] **著作权**：不使用倪海厦原话（CC BY-NC-SA，禁商用），只用公版古籍

---

## 6. 计量与转化

Vercel Analytics 已接入，事件名：

| 事件 | 触发 | 用途 |
|---|---|---|
| `jp_diagnosis_submit` | 点击「無料で診断する」 | 表单转化率 |
| `jp_result_view` | 结果页渲染 | 诊断完成率 |
| `jp_report_view` | 鉴定书页渲染（带 `type` / `full` / `beta`） | 付费墙曝光 |
| `jp_checkout_view` | 结账页渲染 | 购买意向 |
| `jp_ai_generate` | 点击 AI 生成 | 功能使用率 |

`NEXT_PUBLIC_GA_ID` 未設定時はタグを読み込まず、イベントも送信しない。

---

## 7. 上线前自检

```bash
cd repo
npm ci
npx tsc --noEmit
npm test          # 19 组
npm run build
npm start         # http://localhost:3000/ja
```

- [ ] `/ja`、`/ja/shindan`、6 篇文章、法务页 200
- [ ] 1990-06-15 东京 08:00 → 真太陽時 8:18、辰の刻
- [ ] 23:30 出生 → 翌日排盘
- [ ] 未填时刻 → 正午计算，页面有提示
- [ ] 无 API Key 时 `/api/ja/interpret` 返回 501，页面不显示 AI 面板
- [ ] 付费模式：无 token 锁定、有 token 全文
- [ ] 本番スモーク：`BASE_URL=https://<domain> npm run smoke:ja`（36 項目）

---

## 8. 已知限制

- `<html lang>` 现在是 `ja`（面向日本市场优先），中文 Demo 页在 `<body lang="zh-CN">` 下；日本版内部再以 `lang="ja"` 覆盖。
- 紫微斗数使用中国农历；日本旧暦在极少数日期会差一天，建议在 FAQ 说明。
- 日语内容由 LLM 生成并逐句校对，但仍建议上线前请母语者通读。
- 生年月日只存在 URL 参数中，刷新/分享会带上参数；若后续做账号体系，需要重新设计存储与同意流程。


---

## 9. GA4 と Search Console

### GA4

1. https://analytics.google.com → 管理 → プロパティを作成
2. データストリーム → Web → URL に `https://shibikan.com`
3. 測定 ID（`G-XXXXXXXXXX`）をコピー
4. Netlify → Environment variables → `NEXT_PUBLIC_GA_ID` に設定
5. Deploys → Trigger deploy → **Clear cache and deploy site**
6. GA4 の「リアルタイム」で `/ja` を開いて確認

カスタムイベントは `jp_*`（診断送信・結果閲覧・鑑定書閲覧・購入画面・AI 生成・相性）で送信される。

### Search Console

1. https://search.google.com/search-console → **ドメイン** プロパティで `shibikan.com` を追加
2. Netlify DNS → Add record:
   - Type: `TXT`
   - Name: `@`
   - Value: Google が表示する `google-site-verification=...`
3. 所有権を確認
4. **サイトマップ** に `https://shibikan.com/sitemap.xml` を送信
5. Bing Webmaster Tools は「Google Search Console からインポート」でOK

> ルート `/` は 307 で `/ja` に飛ぶため、Search Console では `/ja` を正規URLとして扱う。sitemap は日本語ページのみ（中国語デモは除外）。


---

## 10. VPS 構成

Netlify の無料枠が止まる場合の移行先として、VPS + Docker + Caddy の手順を [ja-vps-deploy.md](./ja-vps-deploy.md) に用意している。
