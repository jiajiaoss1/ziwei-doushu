# 紫微馆 Docs — AI 与团队的唯一入口

> 这份文件是整个仓库的导航。**任何 AI 或新成员，先读这一页。**
> 文件正文用**简体中文**；结构 ID、状态、文件名用英文。目标市场文案示例保留繁中／日文原文，并标注。
> 最后确认：2026-11-21

---

## 1. 现在是什么状态

| 项目 | 现状 |
|---|---|
| 线上 | https://shibikan.com |
| 根路径 | `/` → **307 `/zh`**（港台优先） |
| 市场 | 繁中 `/zh`（主推）、日文 `/ja` |
| 收费 | **β 全免费**；`JP_BETA_FREE=true` |
| 支付 | 只有骨架（order token / webhook / unlock），**未接真实 PSP** |
| AI | DeepSeek，SSE；有 origin/token/限流/日次成本护栏 |
| 部署 | Vultr Tokyo VPS + Docker Compose + Caddy（HTTP-01） |
| 程序 | Next.js 16 + TypeScript + React 19；`lib/ziwei/*` 共用引擎 |

更完整的交接：`operations/HANDOVER.md`。

---

## 2. 如果你是新接手的 AI

**按这个顺序读，不要先读 code：**

1. `ai/AGENT-CONTRACT.md` — 你必须遵守的规则
2. `operations/HANDOVER.md` — 上一棒做到哪、下一棒从哪开始
3. `product/PRD-SHARED.md` — 共同产品定义
4. `product/PRD-ZH.md` 或 `product/PRD-JA.md` — 你要动的市场
5. `decisions/DECISION-LOG.md` — 已定的事，不要推翻
6. `operations/BACKLOG.md` — 现在优先做什么
7. 跟你任务相关的 spec / domain 文件

> 如果你读到的文件和 code 不一致：**先停下来，回报冲突**，不要用 code 反推产品意图。

---

## 3. 按任务的最小阅读集

| 你要做的事 | 先读 |
|---|---|
| 改繁中页面／文案 | `product/PRD-ZH.md` → `product/POSITIONING.md` → `content/TONE-AND-CLAIMS.md` → `ux/PAGE-MAP.md` |
| 改日文页面／文案 | `product/PRD-JA.md` → `content/TONE-AND-CLAIMS.md` → `ux/PAGE-MAP.md` |
| 改付费／定价／解锁 | `product/PRICING.md` → `product/REQUIREMENTS.md` → `decisions/DECISION-LOG.md` → `engineering/SECURITY.md` |
| 改 AI 解读 | `ai/AI-EVALUATION.md` → `domain/ASTROLOGY-RULES.md` → `domain/CONTENT-PIPELINE.md` → `product/PRD-SHARED.md` |
| 改命理规则／格局 | `domain/ASTROLOGY-RULES.md` → `domain/CALENDAR-AND-TIME.md` → `domain/CONTENT-PIPELINE.md` → `engineering/TESTING.md` |
| 部署／排查 | `engineering/DEPLOY.md` → `engineering/ARCHITECTURE.md` → `engineering/MODULE-MAP.md` |
| 做研究 | `research/README.md` → 对应 brief |
| 产品规划 | `product/PRD-*.md` → `product/MARKET-MODEL.md` → `product/REQUIREMENTS.md` → `operations/BACKLOG.md` → `product/METRICS.md` |
| 新增市场 | `product/MARKET-MODEL.md` → `product/PRD-TEMPLATE.md` → `domain/GLOSSARY.md` → `content/TONE-AND-CLAIMS.md` |

---

## 4. 文件地图

| 文件 | 用途 | 状态 |
|---|---|---|
| `ai/AGENT-CONTRACT.md` | AI 行为规则 | canonical |
| `ai/WORKING-METHOD.md` | 我们怎么持续迭代 | canonical |
| `ai/AI-EVALUATION.md` | AI 输出质量评估（最小版） | canonical |
| `ai/evaluation/golden-cases.jsonl` | 7 个金标准案例 | canonical |
| `ai/evaluation/results/2026-11-21.md` | 首次 baseline 结果 | canonical |
| `product/PRD-SHARED.md` | 共同产品定义、AI 政策、合规 | canonical |
| `product/PRD-ZH.md` | 港台市场 PRD | canonical |
| `product/PRD-JA.md` | 日本市场 PRD | canonical |
| `product/PRD-TEMPLATE.md` | 新市场 PRD 模板（ko/vi） | template |
| `product/SPECS/` | 功能 SPEC 与模板 | canonical |
| `product/REQUIREMENTS.md` | 已实现／β／计划／放弃的需求矩阵 | canonical |
| `product/POSITIONING.md` | 目标人群、JTBD、痛点、差异化 | approved |
| `product/MARKET-MODEL.md` | Market/Locale、TW/HK/JP、继承与覆盖 | canonical |
| `product/PRICING.md` | 定价、包装、免费/付费边界 | canonical |
| `product/METRICS.md` | 漏斗与事件定义 | draft |
| `domain/ASTROLOGY-RULES.md` | 流派、术语、边界、空宫/流年规则 | canonical |
| `domain/DOMAIN-MODEL.md` | 核心对象、关系、事实边界 | canonical |
| `domain/CALENDAR-AND-TIME.md` | 时区、真太阳时、晚子时、历法 | canonical |
| `domain/CONTENT-PIPELINE.md` | 命盘→facts→文案→AI 的资料流 | canonical |
| `domain/GLOSSARY.md` | 中日术语对照 | canonical |
| `ux/PAGE-MAP.md` | 路由、页面目的、index/noindex | canonical |
| `content/TONE-AND-CLAIMS.md` | 语气、禁用断言、AI 揭露 | canonical |
| `engineering/ARCHITECTURE.md` | 技术架构与资料流 | canonical |
| `engineering/DEPLOY.md` | VPS 部署与运维 | canonical |
| `engineering/TESTING.md` | 测试策略与 CI | canonical |
| `engineering/MODULE-MAP.md` | 模块职责、依赖规则、跨市场技术债 | canonical |
| `engineering/SECURITY.md` | 密钥、限流、支付安全 | canonical |
| `decisions/DECISION-LOG.md` | 决策索引 | canonical |
| `decisions/ADR-*.md` | 单一决策记录 | canonical |
| `decisions/ADR-TEMPLATE.md` | 新 ADR 模板 | template |
| `operations/BACKLOG.md` | 唯一待办 | canonical |
| `operations/HANDOVER.md` | 交接与时间线 | canonical |
| `operations/CHANGELOG.md` | 重大变更 | canonical |
| `research/README.md` | 研究资料规范 | canonical |
| `research/threads-pain-points-brief.md` | Threads beachhead 研究 brief V2 | ready |
| `research/threads-pilot-2026-11-21.md` | 旧 423 条 pilot 结论 | draft |
| `research/threads-pilot-v2-2026-11-21.md` | 新 339 条 pilot V2 结论 | draft |
| `research/threads-pilot-v3-2026-11-21.md` | 合并 533 条 pilot V3 结论 | draft |
| `research/threads-codebook-v3.md` | Threads 编码定义 V3 | canonical |
| `archive/` | 被取代的旧文件 | superseded |
| `tianji-ziwei/` | 天纪语料（参考，非产品文件） | reference |

---

## 5. 文件优先级（冲突时）

```
Owner 批准的 DECISION / ADR
  > PRD
  > SPEC / REQUIREMENTS
  > code 与测试
  > 旧文件 / archive
```

- **code 是实现，不是意图。** 不要用 code 反推「产品应该怎样」。
- 旧文件只作历史参考；有新决策就以新文件为准。
- 同一主题只能有一份 canonical 文件；其他文件用链接，不要复制。

---

## 6. 变更规则（摘要）

1. 任何用户可见的行为／文案／定价／定位变更：**先更新 PRD/SPEC，再改 code**。
2. 策略决策（人群、定价、免费/付费边界、AI 角色、根路径语言）需 Owner 批准，并写 ADR。
3. 纯 bug 修复可先改 code，但同一个 PR 要补 changelog/spec 注记。
4. 完成定义：code + test + docs + deploy 验证 + HANDOVER 时间线。
5. 不要把密钥、PII、用户原文大量放进 repo。

完整规则：`ai/AGENT-CONTRACT.md`。

---

## 7. 状态图例

| 状态 | 意思 |
|---|---|
| `proposed` | 提案，未批准 |
| `approved` | 已批准，未实现 |
| `implemented` | 已上线 |
| `beta` | 已上线但 β 免费／实验中 |
| `planned` | 已排入 backlog |
| `blocked` | 卡在外部条件 |
| `dropped` | 明确不做 |
| `superseded` | 被新文件取代 |

---

## 8. 快速链接

- 线上：https://shibikan.com/zh ／ https://shibikan.com/ja
- 健康检查：https://shibikan.com/api/health
- 目前优先：`operations/BACKLOG.md`
- 目前交接：`operations/HANDOVER.md`
- 决策索引：`decisions/DECISION-LOG.md`
- 研究 brief：`research/threads-pain-points-brief.md`
