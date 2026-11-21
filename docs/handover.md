# 紫微館 工作交接（2026-11-21）

> 给接手的 agent：请先读完本文，再动代码。线上是收费前的 β 阶段（全部免费）。

---

## 1. 项目是什么

- **服务**：紫微館（しびかん）— 紫微斗數（中国占術）诊断网站
- **线上**：https://shibikan.com
- **两个语言版本**：
  - 日文版 `/ja`（日本市场，β 免费）
  - 繁体版 `/zh`（香港·台湾市场，当前主推，β 免费）
- **根路径** `shibikan.com/` → **307 跳转 `/zh`**（港台优先）
- **仓库**：`github.com/jiajiaoss1/ziwei-doushu`（private），本地 `main` = 远程 `main`
- **Fork 自**：`Renhuai123/ziwei-doushu`（中文核心引擎；上游有大量 research/古典算法，与本站用户产品关系不大）

## 2. 技术栈与本地开发

```
Next.js 16 (App Router) + TypeScript strict + React 19 + Tailwind
Node 22 / npm 10
引擎: iztro + lunar-javascript（lib/ziwei/* 是核心，两边共用）
```

```bash
npm ci --legacy-peer-deps     # 曾遇 npm cache 权限问题，必要时加 --cache /tmp/xxx
npm run dev                   # http://localhost:3000/zh 或 /ja
npx tsc --noEmit              # 类型检查（改完必跑）
npm test                      # 全部回归测试（见第 7 节）
npm run build                 # 生产构建（改完必跑）
```

## 3. 当前线上状态

| 项 | 状态 |
|---|---|
| 域名 | 西部数码 NS，A `@`/`www` → `45.77.180.73`，已生效 |
| VPS | Vultr Tokyo，Ubuntu 24.04，`/opt/shibikan`，Docker Compose（app + caddy） |
| 证书 | Caddy **HTTP-01**（已从 Netlify DNS-01 切换，Netlify 已废弃） |
| 部署版本 | 线上 = 仓库 `main`（最近：`c18fff1` 根路径跳 /zh） |
| AI | DeepSeek（`api.deepseek.com/v1`），SSE 流式，已启用 |
| 支付 | **只有骨架，未接真实 PSP**（β 免费中） |

## 4. 代码地图

### 4.1 繁体版（当前工作重点）

```
app/zh/
  page.tsx              首页（Hero/卖点/流程/结果范例/更多/信任区块/价格/FAQ/CTA）
  shindan/page.tsx      诊断表单（烦恼+情境选择、港台县市、UTC+8）
  result/page.tsx       结果（共情开场、命盘、章节排序、AI 问答、upsell）
  report/page.tsx       鉴定书（感情/事业，BC 免费、价格 NT$/HKD、信件语气）
  aishou/               相性（表单 + result）
  2027/page.tsx         2027 丁未年专题
  articles/             文章列表 + [slug]（6 篇）
  legal/                隐私/使用条款/交易条款（退款政策已细化）
  not-found.tsx
lib/zh/
  glossary.ts           14 主星・12 宫・四化・明暗・65 格局（繁中，台湾用词）
  facts.ts              命盘→繁中事实层
  interpret.ts          免费解读文案
  report.ts             付费报告（opening/closing 信件语气）
  compat.ts             相性
  worry.ts              烦恼（感情/工作/人际/自己）+ 二级情境 + 共情句
  llm.ts                繁中 AI prompt（禁简体、不断言）
  birth.ts / cities.ts  港台排盘输入（UTC+8、真太阳时）
  pricing.ts            NT$/HKD 定价
  articles.ts           6 篇繁中 SEO 文章
components/zh/          SiteHeaderZh/SiteFooterZh/BirthFormZh/Meiban/PairFormZh/AiReading
app/api/zh/interpret/   繁中 AI API（origin/token/限流/成本护栏）
```

### 4.2 日文版（完整，可参考结构）

```
app/ja/*、lib/jp/*、components/jp/*、app/api/ja/interpret、app/api/ja/checkout、app/api/ja/webhook
```

> 日文版与繁体版**互不影响**：文案/页面/组件各自独立，只共用 `lib/ziwei/*` 引擎。

### 4.3 共用层

```
lib/ziwei/          引擎：排盘、格局、四化、真太阳时（两边只读调用）
lib/site.ts         SITE_URL
scripts/vps/deploy.sh  一键部署
Caddyfile          Caddy 配置（HTTP-01）
docs/ja-deploy-runbook.md  部署手册
docs/ja-backlog.md         待办/决策记录
```

## 5. 部署（VPS）

```bash
ssh root@45.77.180.73
cd /opt/shibikan
git pull
bash scripts/vps/deploy.sh     # build app 镜像 → up -d → prune
```

- 密码/凭据**不在仓库**，找项目负责人拿（对话里曾出现，建议轮换）
- `.env.production` 只在 VPS 上（含 `JP_LLM_API_KEY`、`JP_WEBHOOK_SECRET`、`ACME_EMAIL` 等）
- 部署后验证：
  ```bash
  curl -s -o /dev/null -w "%{http_code}" https://shibikan.com/api/health   # 200
  curl -s -o /dev/null -w "%{http_code}" https://shibikan.com/zh           # 200
  curl -s -o /dev/null -w "%{http_code}" https://shibikan.com/ja           # 200
  curl -s -o /dev/null -w "%{redirect_url}" https://shibikan.com/          # /zh
  ```

## 6. 已完成（2026-11-21 前）

- [x] 日文版全套（首页/诊断/结果/报告/相性/2027/文章/法务/404）+ AI 深掘
- [x] 繁体版全套（同上，与日版对齐）
- [x] 产品化：烦恼入口（4 类 + 情境细分）、结果页共情开场、章节按烦恼重排
- [x] 报告「一封信」语气（opening/closing）
- [x] 首页「為什麼是紫微館」信任区块（不藏/不嚇/不賣/專業）
- [x] AI 问答（结果页可填「想問的問題」，基于命盘回答）
- [x] 课金骨架：HMAC 解锁 token、AES-GCM 订单 token、webhook 签名校验
- [x] CI（install→typecheck→test→build）、回归测试（jp-* + zh-*）
- [x] 根路径跳 `/zh`、Caddy HTTP-01、DNS 迁移、OG 图

## 7. 测试

```bash
npm test    # 依次跑 scripts/regression/*.test.ts
```

**重要**：`lib/ziwei/patterns.ts` 有 `import 'server-only'`，凡引用它的测试必须带条件：

```bash
NODE_OPTIONS=--conditions=react-server npx tsx scripts/regression/jp-patterns.test.ts
NODE_OPTIONS=--conditions=react-server npx tsx scripts/regression/zh-patterns.test.ts
```

测试文件：
- `jp-content.test.ts` / `zh-content.test.ts`：词库完整性、简体字混入、命盘→解读/报告/相性
- `jp-patterns.test.ts` / `zh-patterns.test.ts`：格局覆盖、排序、出典
- `jp-checkout.test.ts` / `jp-llm-guard.test.ts`：课金 token / AI 护栏

## 8. 待办（按优先级）

### P0 — 上线收费前必须

1. **接 Stripe（香港公司 + Stripe HK）**
   - 负责人正在注册香港公司/开户；拿到 `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` 后：
     - 新增 `app/api/zh/checkout/route.ts`（Stripe Checkout Session，币种 TWD/HKD）
     - 新增 `app/api/zh/webhook/route.ts`（校验 Stripe 签名 → `signUnlock` → 返回解锁 URL）
     - 繁体版报告页「付費內容」按钮接支付
   - 现有可复用：`lib/jp/checkout.ts`（AES-GCM 订单、webhook 校验）、`lib/jp/access.ts`（`signUnlock`/`verifyUnlock`/`isBetaFree`）
   - 日文版同理（日本 PSP 或 Stripe，需日本主体）
2. **真实客服邮箱**：法务页/退款说明目前是 `support@example.com` 占位
3. **法务主体信息**：`app/zh/legal/tokushoho` 的「營運主體資訊」待填（香港公司名/地址）
4. **收费开关**：`JP_BETA_FREE=false`（VPS `.env.production`），并确认繁体版解锁逻辑（感情/事业都收费，见 `lib/zh/pricing.ts`）

### P1 — 产品打磨（负责人指定「产品品质优先」）

- 付费报告按情境定制（现在报告本身通用，只有开场共情按烦恼）
- 结果页信任感增强（真实内容，**不要编造用户好评**，台湾消保法/公平交易法风险）
- 定价页/购买流程说明（退款政策已写，见 tokushoho）

### P2 — 技术（不阻塞）

- Sentry 错误监控（可选）
- 天紀語料原創性審計腳本（负责人说「时间充足再写」；结论：文案为原创、非原话翻译，收费不受 CC BY-NC-SA 限制）
- 根 `/` 的中文 demo 页（`app/page.tsx`）已不再对外展示（被重定向），可后续清理或保留
- AI 多实例全局计数（单容器暂不需要）

### 用户侧（不是 agent 的活）

- GA4 / Search Console、真机检查、secret 轮换、UptimeRobot、VPS 升 2GB

## 9. 关键决策与背景（不要擅自推翻）

| 决策 | 理由 |
|---|---|
| 根路径 → `/zh` | 港台优先，台湾命理市场大、倪海厦认知度高 |
| 繁体版感情报告也收费，日文版恋爱免费 | 定价已定：感情 NT$680/HKD160、事业 NT$980/HKD230 |
| 支付选 Stripe HK | 占卜在 Stripe 仅日/墨/泰禁止，香港不在列表；港台信用卡普及率高 |
| 文案「先共情、再解读」 | 用户洞察：付费买的是情绪价值，不是通用人格描述 |
| 不编造用户口碑 | 台湾消保法/公平交易法对虚假宣传有罚则 |
| 天紀语料不改写 | 文案原创、未翻译原话；致谢已放页脚 |
| 不做日/繁互链 | 负责人明确说不需要 |

## 10. 风险与注意

1. **凭据泄露**：VPS root 密码、DeepSeek key、GitHub PAT、Netlify token 都曾在对话中出现 → **建议尽快轮换**；仓库里不要写任何 key
2. **天纪语料**：`docs/tianji-ziwei/` 是 CC BY-NC-SA（非商用）——网站不得直接展示/翻译其中原话；当前文案是原创，保持这一点
3. **测试地雷**：`patterns.ts` 的 `server-only`（见第 7 节）；Next 16 的 `searchParams`/`headers()` 都是 Promise，必须 `await`
4. **繁体版 price/access**：报告页用 `isBetaFree()` + `verifyUnlock()`（**不是**日文版的 `getReportAccess`，后者对 love 永远免费）
5. **部署顺序**：改完 → `tsc` + `build` + `npm test` → commit → push → VPS `git pull` + `deploy.sh` → curl 验证
6. **网络**：GitHub push 偶发 HTTP2/认证失败，重试 2-3 次即可（曾用 `-c http.version=HTTP/1.1`）

## 11. 常用命令速查

```bash
# 本地
npm run dev
npx tsc --noEmit
npm test
npm run build

# 繁体版关键 URL
/zh                          首页
/zh/shindan                  诊断（带烦恼/情境选择）
/zh/result?y=1990&m=6&d=15&h=8&mi=0&g=m&p=台北市&w=love&s=crush
/zh/report?...&type=love     报告
/zh/aishou                   相性
/zh/2027                     2027 专题
/zh/articles                 文章

# 部署
ssh root@45.77.180.73
cd /opt/shibikan && git pull && bash scripts/vps/deploy.sh
```

## 12. 交接时点的版本

```
main = 00fa65b（.gitignore 补 .dsh-boot-animation）
线上 = c18fff1（根路径跳 /zh）——.gitignore 不影响运行
```

接手第一步建议：读 `docs/ja-backlog.md` + 本文，跑一遍 `npm test` 和 `npm run build`，然后从 P0 的 Stripe 接入开始（等负责人拿到 keys）。
