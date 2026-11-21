---
title: SPEC｜支付、解锁、退款
requirement_id: REQ-ZH-PAY-001 / REQ-ZH-PAY-002 / REQ-ZH-PAY-003
status: draft
owner: 负责人
last_verified: 2026-11-21
applies_to: [zh]
---

# SPEC：支付、解锁、退款

> 目标产品，不代表已实现。
> 依据：`ADR-0007`、`PRD-ZH.md`、`PRICING.md`、`SPECS/zh-decision-report.md`。

---

## 1. 目标

- 台湾用户一次购买《關係決策書》
- NT$680 早鸟 / NT$980 原价
- 不做订阅
- 付款后立即生成
- 1 年访问
- 7 天内、未打开报告可退
- 14 天 1–3 追问

---

## 2. 范围

### 做

- 创建订单
- 跳转 PSP 付款
- webhook 确认付款
- 生成/解锁报告
- 1 年访问 token
- 首次打开记录
- 退款申请/处理
- 退款后撤销访问
- 幂等与重放保护
- 事件埋点

### 不做

- 订阅/分期
- 多商品购物车
- 发票/会计系统
- 用户账户
- HK/其他币种
- 自动退款审批（先人工）
- 税务申报

---

## 3. 关键定义

| 名词 | 定义 |
|---|---|
| 商品 | `decision_report`，只有一个 SKU |
| 订单 | 一次购买；服务端生成 `order_id` |
| 权益 | 报告访问 + 14 天追问 |
| 访问 token | 服务端签发，1 年有效 |
| 首次打开 | 用户第一次成功打开报告全文 |
| 退款 | 7 天内、首次打开前 |

---

## 4. 流程

```text
自查结果页
  → 点击「補上時辰，取得完整關係決策書」
  → 付费页（补时辰 + 县市，确认价格/退款/条款）
  → POST /api/zh/checkout
  → 服务端建订单 + 跳转 PSP
  → 付款成功
  → PSP webhook → 标记 paid
  → 生成报告
  → 签发访问 token
  → 跳转 /zh/decision/report?t=...
  → 首次打开记录
  → 14 天内 1–3 追问
```

### 4.1 创建订单

- 客户端只提交：生辰、县市、关系情境、联系方式（如需收据）
- **价格由服务端决定**，客户端不得传价格
- 订单保存：商品、金额、币种、状态、创建时间、出生资料（加密）、provider refs
- 不把生辰放 URL/analytics

### 4.2 付款

- PSP 托管页面/组件
- 成功后 webhook 为准，不信任前端回调
- 付款失败/取消：订单 `canceled`，不生成

### 4.3 生成/解锁

- webhook `paid` → 校验金额/币种/订单 → 标记 paid
- 生成报告（立即）
- 签发访问 token：`order_id` + `exp = paid_at + 1y`
- 发送/显示报告链接
- 生成失败：重试；连续失败 → 人工/退款

### 4.4 首次打开

- 第一次成功渲染全文时写 `first_opened_at`
- 退款判断依赖该字段
- 只看锁定页/付款页不算打开

### 4.5 追问

- 从 `first_opened_at` 起 14 天
- 1–3 个问题
- AI 回答；敏感/超范围拒绝
- 不转人工

### 4.6 退款

- 用户 7 天内申请
- 条件：`first_opened_at` 为空
- 人工审核 → PSP 退款
- 退款成功：订单 `refunded`，撤销访问 token
- 报告已打开：不自动退；走客服申诉
- 退款记录保留（法务/对账）

---

## 5. 价格与早鸟

- 原价 NT$980
- 早鸟 NT$680
- 币种 TWD
- 价格在服务端配置，不写死在前端
- 早鸟截止时间/数量：**未定**（需 Owner 决定）
- 页面显示：早鸟价 + 原价 + 退款说明
- 不做假折扣/假倒计时

---

## 6. 持久化（阻塞项）

当前 repo **没有订单 DB**；仅靠加密 order token 无法可靠支持：

- 退款
- 幂等
- 1 年访问
- 首次打开时间
- 对账

### 需要的最小数据

```text
orders
  id, product, amount, currency, status,
  birth_data_encrypted, created_at, paid_at,
  provider, provider_order_id, provider_payment_id,
  first_opened_at, refunded_at, refund_reason

payment_events
  id, order_id, provider_event_id, type, raw_hash, created_at

entitlements
  order_id, access_exp, followup_exp, revoked_at
```

### 方案（未定）

- A. PostgreSQL（repo 已有 `pg` 依赖；需 VPS 增加服务/内存）
- B. SQLite（单机简单；需新依赖/备份）
- C. 托管 DB（Supabase/Neon 等；需网络/费用）

> **选型前不实现支付。** 这是本 SPEC 的阻塞项。

---

## 7. 安全

- webhook：原始 body + 签名 + 时间戳/重放保护
- 幂等：`provider_event_id` 唯一；重复事件不重复发货
- 金额/币种/订单状态服务端校验
- 生辰加密存储；日志/analytics 不出现 PII
- 访问 token：HMAC/加密，1 年有效，可撤销
- 退款/管理操作：仅服务端/受控后台
- secrets 只放环境变量；不提交 Git
- rate limit：checkout/webhook/refund
- 失败不泄露内部错误/密钥

---

## 8. 错误状态

| 情况 | 处理 |
|---|---|
| 付款失败 | 订单 canceled；可重试 |
| 用户取消 | 订单 canceled；不生成 |
| webhook 延迟 | 显示「確認中」；后台重试 |
| 重复 webhook | 幂等，不重复生成 |
| 金额不符 | 拒绝发货，告警 |
| 生成失败 | 重试；连续失败退款/人工 |
| 退款失败 | 订单保持 paid+refund_pending；人工处理 |
| token 过期 | 提示联系客服；不可续期（除非新订单） |
| 首次打开后申请退款 | 拒绝自动退款；人工申诉 |
| 追问过期 | 关闭，提示已过期 |
| 追问敏感/超范围 | 拒绝并说明边界 |

---

## 9. 文案（繁中目标）

### 付费页

> 你的關係決策書
> 早鳥 NT$680（原價 NT$980）
> 含 6 部分報告、命盤圖、1 年回看、14 天內 1–3 個追問。

### 退款

> 7 天內、尚未打開報告，可申請退款。

### 条款勾选

> 我已閱讀並同意服務條款與退款政策。

### 付款中

> 正在確認付款，請不要關閉頁面。

### 付款失敗

> 付款沒有完成，尚未產生報告。你可以重新嘗試。

### 退款中

> 退款申請已收到，我們會依付款方式處理。

---

## 10. 指标

- checkout_start
- payment_success
- payment_failed（按原因）
- report_generated
- first_open
- refund_requested
- refund_completed
- followup_used
- 早鸟/原价转化

不记 PII。

---

## 11. 测试

### 单元

- 服务端价格不可被客户端覆盖
- order token 过期/篡改
- webhook 签名/重放/金额校验
- 退款条件（首次打开前后）
- access token 1 年/撤销
- follow-up 14 天

### 集成

- checkout → webhook → 生成 → 打开
- 重复 webhook 不重复生成
- 退款成功撤销访问
- 生成失败重试/退款
- 付款失败不生成
- 直接访问付费页无订单 → 回自查

### 安全

- 无 PII 日志
- secrets 不泄露
- rate limit
- CSRF/Origin

### 回归

- `npx tsc --noEmit`
- `npm test`
- `npm run build`

---

## 12. 上线前阻塞

1. PSP 选型/合同/密钥
2. 订单持久化方案
3. 公司主体/税务/收据
4. 退款人工流程/客服信箱
5. 服务条款/退款政策最终版
6. 真实评价/beta

---

## 13. 未决

- PSP 用哪家（Stripe HK / MoR / 其他）
- PostgreSQL / SQLite / 托管 DB
- 早鸟截止时间/数量
- 价格是否含税
- 收据/发票怎么开
- 退款由谁审批、多久处理
- 是否需要 email 收据
