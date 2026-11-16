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

当前实现：

```
购买页 → 外部结账（JP_CHECKOUT_URL）
       → 支付成功回调（你的 webhook）
       → 服务端 signUnlock('work', birthKey, ttl) 生成 token
       → 跳转 /ja/report?...&t=<token> → 全文显示
```

接入步骤：

1. 选支付商：Stripe（需日本账户）或 Paddle / Lemon Squeezy（MoR，代收代缴 JCT）。
2. 在支付商后台创建商品「事業鑑定書 4,980円」，把结账 URL 填入 `JP_CHECKOUT_URL`。
3. 回调里校验支付状态，然后用 `lib/jp/access.ts` 的 `signUnlock()` 生成 token。
4. token 默认 30 天有效；退款/争议时把 `JP_UNLOCK_SECRET` 轮换即可让旧 token 失效。
5. 上线前跑一遍「无 token → 锁定 / 有 token → 全文」，命令见 README。

> 注意：`JP_BETA_FREE=false` 之后，恋爱报告仍免费（`getReportAccess` 里写死），只有事业报告收费。

---

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

本地/非 Vercel 环境下事件会被静默忽略，不影响页面。

---

## 7. 上线前自检

```bash
cd repo
npm ci
npx tsc --noEmit
npm test          # 14 组
npm run build
npm start         # http://localhost:3000/ja
```

- [ ] `/ja`、`/ja/shindan`、6 篇文章、法务页 200
- [ ] 1990-06-15 东京 08:00 → 真太陽時 8:18、辰の刻
- [ ] 23:30 出生 → 翌日排盘
- [ ] 未填时刻 → 正午计算，页面有提示
- [ ] 无 API Key 时 `/api/ja/interpret` 返回 501，页面不显示 AI 面板
- [ ] 付费模式：无 token 锁定、有 token 全文

---

## 8. 已知限制

- `<html lang>` 现在是 `ja`（面向日本市场优先），中文 Demo 页在 `<body lang="zh-CN">` 下；日本版内部再以 `lang="ja"` 覆盖。
- 紫微斗数使用中国农历；日本旧暦在极少数日期会差一天，建议在 FAQ 说明。
- 日语内容由 LLM 生成并逐句校对，但仍建议上线前请母语者通读。
- 生年月日只存在 URL 参数中，刷新/分享会带上参数；若后续做账号体系，需要重新设计存储与同意流程。
