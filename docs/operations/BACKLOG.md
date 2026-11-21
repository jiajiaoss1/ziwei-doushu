---
title: Backlog
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared, zh, ja]
canonical: true
---

# Backlog

> 唯一待办来源。不要另外开 `*-backlog.md`。
> 每项尽量对应 `REQUIREMENTS.md` 的 ID；策略项等 Owner 批准。

更新：2026-11-21

---

## 现在唯一优先（Next）

**产品打磨：先定「付费交付物」与目标 beachhead。**

- 等 Threads 研究结果（`research/threads-pain-points-brief.md`）
- 用研究决定：关系 vs 事业、免费/付费边界、AI 角色
- 产出：更新 `POSITIONING.md` / `PRD-ZH.md`，再开 SPEC
- 不要先改首页文案

> 在 Owner 批准定位前，不改首页主命题与定价。

---

## P0 — 上线收费前必须

| 项目 | 状态 | 备注 |
|---|---|---|
| Stripe HK（繁中 checkout/webhook） | blocked | 等香港公司/keys |
| 日文 PSP 接続 | blocked | 等日本主体 |
| 真实客服信箱 | planned | `support@example.com` |
| 特商法营运主体 | planned | 香港/日本各自 |
| 退款政策最终版 | planned | 草稿已写 |
| 付费前检查清单 | planned | 见下 |
| 1GB VPS → 2GB | planned | 收费前 |
| 密钥轮换 | planned | 曾出现在对话 |
| GA4 | planned | `NEXT_PUBLIC_GA_ID` |
| Search Console + sitemap | planned | 用户侧 |
| 繁中页面浏览事件 | planned | 目前缺 |
| 感情报告付费墙 bug | planned | REQ-ZH-REL-001 |
| 报告页保留 w/s | planned | REQ-ZH-REL-002 |

### 收费前检查清单

- [ ] 付款成功 → 解锁链接可用
- [ ] 重复 webhook 不会重复发 token
- [ ] 退款/投诉流程
- [ ] 价格、税、币别在购买前可见
- [ ] 法务页无「准备中」
- [ ] 真实客服信箱
- [ ] 1GB → 2GB
- [ ] 密钥已轮换

---

## P1 — 产品打磨（Owner 指定质量优先）

| 项目 | 状态 | 备注 |
|---|---|---|
| 目标 beachhead 决策 | proposed | 等研究 |
| 付费报告改成「决策/行动书」 | proposed | 需 Owner |
| 报告按情境客制 | proposed | 先定模块化方案 |
| 结果页价格透明 | proposed | 卡片显示 NT$/HKD |
| 报告样本/试读 | proposed | 脱敏样本 |
| 信任区块（不编好评） | proposed | 方法/作者/样本 |
| 免费 AI 限制为解释型 | proposed | 方向见 ADR-0003 |
| 付费 AI 追问 | proposed | 需先有付费 |
| 购买流程说明 | proposed | 退款/交付 |

---

## P2 — 成长与内容

| 项目 | 状态 | 备注 |
|---|---|---|
| Threads 痛点研究 | in progress | agent 执行中 |
| Dcard/IG 三角验证 | proposed | 研究后 |
| 文章内链/CTA | proposed | 文章 → 诊断 |
| 电子报/CRM | proposed | 无账号 |
| 相性分享 OGP | proposed | 分享导线 |
| 2027 季节性 | proposed | 年末再看 |
| 用户访谈 10–15 人 | proposed | 研究饱和后 |

---

## P2 — 技术债

| 项目 | 状态 | 备注 |
|---|---|---|
| Caddy 移除 Netlify plugin/token | planned | `Dockerfile.caddy` 遗留 |
| AI 全局限流（Upstash 等） | planned | 目前进程内 |
| 订单 DB/对帐 | planned | 接 PSP 时 |
| Sentry | proposed | 无监控 |
| 四柱 utcOffset | proposed | 若显示四柱 |
| 中国 demo 页清理 | proposed | `/` 已 redirect |

---

## 已完成（近期）

- 繁中版全套（页面/测试/OG）
- 产品化：烦恼入口、情境、共情、章节排序、报告信件语气、信任区块、AI 问答
- 根路径 `/zh`、Caddy HTTP-01、DNS 切西部数码
- 日文版格局翻译/审查
- 文件系统（本次）
- 增量 docs V2：`DOMAIN-MODEL` / `CALENDAR-AND-TIME` / `MARKET-MODEL` / 产品意图矩阵

历史细节：`archive/ja-backlog-2026-11-18.md`。

---

## 不做（现在）

- 真人即时咨询
- 订阅制
- App
- 命理师入驻
- 自动多语言切换
