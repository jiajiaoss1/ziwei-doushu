---
title: Threads 研究 Codebook V3
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [zh]
canonical: true
---

# Threads 研究 Codebook V3

> 基于 533 条合并数据 + 28 条 pilot V3 校准。
> 用于正式编码 100–150 条；编码时必须在 CSV 写 `codebook_version = v3.0`。

---

## 1. 编码单位

- 一条 **主帖** = 一条记录
- 回复只有在能拿到父帖上下文时才编码；否则排除
- 不把同一用户的重复发帖当多个独立样本
- 广告/从业者内容可以保留作行业证据，但必须标 `sample_group=B`、`pilot_relevance=low/medium`、`notes=industry_observer`

---

## 2. 样本组

| 代码 | 定义 | 典型 |
|---|---|---|
| `A_natural` | 从感情/工作/人生选择进入，未主动找命理 | 分手、裁员、婚姻疏离 |
| `B_metaphysical` | 已在找命理/占卜/问事/推荐/价格 | 求推荐老师、问流年、已付费看盘 |

规则：

- 先看用户**行为**，不是看关键词
- 同一个帖子既谈痛又谈算命 → 以“是否在找方案”定组
- 不确定 → `B_metaphysical`? 不，标 `unknown`，不要硬分

---

## 3. 证据等级 E1–E4

| 等级 | 定义 | 例子 | 不能说明 |
|---|---|---|---|
| `E1` | 痛点表达 | 「我不知道要不要分手」 | 不代表在找方案 |
| `E2` | 主动找方案 | 「有没有推荐的老师？」 | 不代表会付钱 |
| `E3` | 真实付费行为 | 「之前算过一次，花 3000」 | 不代表现在还想买 |
| `E4` | 明确购买意向 | 询价、比较价格、预约、说愿意买 | 不代表已付款 |
| `unknown` | 无法判断 | 只有情绪/广告 | 不要推断 |

### 判定顺序

1. 先找**直接证据**（原话/行为）
2. 取最强的一条，不叠加推断
3. 情绪强 ≠ E2/E3
4. “朋友问”是代理样本：最多 E1/E2，不能算 E3
5. 从业者说“客户花 3000” → 不是用户 E3，标 `industry_observer`

---

## 4. 购买阶段

| 代码 | 定义 |
|---|---|
| `not_seeking` | 只是抒发/记录，没有找方案 |
| `seeking` | 在问“有没有推荐/怎么办” |
| `comparing` | 在比较老师/价格/服务/地区 |
| `purchased` | 已经买过/付过费 |
| `abandoned` | 曾经想买但放弃/被劝退 |
| `unknown` | 无法判断 |

> `purchase_stage` 和 `evidence_level` 分开：
> 已购买 = E3；正在找 = E2；只是痛 = E1。

---

## 5. 痛点分类

多标签，用 `;` 分隔。优先用最具体的 code。

### 关系

| 代码 | 定义 | 例子 |
|---|---|---|
| `REL_UNCERTAIN` | 不确定对方想法/关系定位 | 「他到底喜不喜欢我」 |
| `REL_AMBIGUOUS` | 暧昧卡住、忽冷忽热 | 暧昧一阵子就断 |
| `REL_REUNION` | 复合/挽回 | 想和回避型复合 |
| `REL_BREAKUP` | 分手/失恋 | 分手后走不出来 |
| `REL_MARRIAGE_DISTANCE` | 婚姻疏离/沟通少 | 很久没好好吃饭 |
| `REL_AFFAIR` | 外遇/第三者怀疑 | 怀疑老公外遇半年 |
| `REL_SEPARATION` | 分居 | 分居、长期不回家 |
| `REL_INLAWS` | 公婆/家庭界线 | 公婆插手太多 |
| `REL_DIVORCE` | 离婚决策 | 想离婚，该怎么办 |
| `REL_SINGLE` | 单身/催婚 | 被催婚、遇不到对象 |

### 工作

| 代码 | 定义 | 例子 |
|---|---|---|
| `WORK_LAYOFF` | 裁员/资遣/失业 | 待十几年被裁 |
| `WORK_JOB_CHANGE` | 转职/离职犹豫 | 35 岁转职来得及吗 |
| `WORK_CAREER_LOST` | 职涯迷惘/方向 | 30 岁职涯徬徨 |
| `WORK_STARTUP` | 创业/副业 | 想自己做事 |
| `WORK_BURNOUT` | 职场消耗/人际/被逼 | 被老板逼到快疯 |
| `WORK_AGE_CRISIS` | 年龄焦虑（30/35/40） | 35 岁转职 |

### 自我/金钱/人际

| 代码 | 定义 |
|---|---|
| `SELF_ANXIETY` | 焦虑/内耗/想太多 |
| `SELF_DIRECTION` | 人生方向/选择困难 |
| `SELF_WORTH` | 自信/自我怀疑 |
| `MONEY_SCARCITY` | 金钱压力/收入不稳 |
| `MONEY_SCAM` | 怕被骗/怕花冤枉钱 |
| `PEOPLE_FAMILY` | 家庭关系（非婚姻） |
| `PEOPLE_FRIEND` | 朋友关系 |
| `PEOPLE_COLLEAGUE` | 同事/职场人际 |

---

## 6. 触发事件

单选主触发，多个可放 `notes`。

| 代码 | 定义 |
|---|---|
| `TRIGGER_BREAKUP` | 分手/被分手 |
| `TRIGGER_AFFAIR_SUSPICION` | 怀疑外遇/第三者 |
| `TRIGGER_SEPARATION` | 分居 |
| `TRIGGER_INLAW_CONFLICT` | 公婆/家庭冲突 |
| `TRIGGER_MARRIAGE_DISTANCE` | 婚姻疏离/长期没沟通 |
| `TRIGGER_LAYOFF` | 裁员/资遣/失业 |
| `TRIGGER_JOB_CHANGE` | 转职/离职/新工作落差 |
| `TRIGGER_AGE_CRISIS` | 30/35/40 岁危机 |
| `TRIGGER_YEAR_END` | 年末/明年流年 |
| `TRIGGER_FAILED_READING` | 之前算命不准/不满意 |
| `TRIGGER_FEAR_SALES` | 被恐惧诉求推销（不补会怎样） |
| `TRIGGER_FAMILY_PRESSURE` | 家人催婚/介绍/压力 |
| `TRIGGER_OTHER` | 其他 |

---

## 7. 替代方案与满意度

### 方案

| 代码 | 定义 |
|---|---|
| `ALT_FRIENDS` | 朋友/家人 |
| `ALT_TAROT` | 塔罗 |
| `ALT_ZIWEI` | 紫微/八字 |
| `ALT_TEMPLE` | 宫庙/问事/月老/鸟卦/通灵 |
| `ALT_THERAPY` | 心理咨询 |
| `ALT_AI` | ChatGPT/AI 算命/AI 占卜 |
| `ALT_SELF` | 自己查资料/看书 |
| `ALT_NONE` | 没有替代方案 |
| `ALT_OTHER` | 其他 |

### 满意度

` satisfied` / `mixed` / `unsatisfied` / `unknown`

> 例：试过很多老师仍觉得“十个老师十种说法” → `ALT_ZIWEI;ALT_TAROT` + `unsatisfied`。

---

## 8. 信任异议

多标签：

| 代码 | 定义 |
|---|---|
| `TRUST_INACCURATE` | 怕不准/觉得不准 |
| `TRUST_SCAM` | 怕被骗/怕被坑 |
| `TRUST_PRICE` | 怕贵/怕花冤枉钱 |
| `TRUST_PRIVACY` | 隐私顾虑 |
| `TRUST_DISBELIEF` | 不相信命理 |
| `TRUST_AI` | 不信任 AI |
| `TRUST_FEAR_MARKETING` | 反感恐惧诉求/诅咒 |
| `TRUST_INDUSTRY_CHAOS` | 觉得行业收费乱/推销多 |
| `TRUST_NO_HUMAN` | 需要真人背书 |

---

## 9. 想要的结果

| 代码 | 定义 |
|---|---|
| `WANT_ANSWER` | 要一个答案 |
| `WANT_TIMING` | 要时机/什么时候 |
| `WANT_ACTION` | 要具体行动/怎么谈 |
| `WANT_COMFORT` | 要被理解/安慰 |
| `WANT_VALIDATION` | 要验证自己想的对不对 |
| `WANT_HOW_TO_ASK` | 不知道怎么问/怎么用报告 |
| `WANT_FOLLOW_UP` | 想要持续追问 |

---

## 10. 价格

字段：

- `price_signal`：原文提到的金额/价格描述
- `price_currency`：`TWD` / `HKD` / `other` / `unknown`
- `price_context`：`actual_paid` / `inquiry` / `other_quote` / `hypothetical` / `free` / `red_envelope` / `unknown`

规则：

- 用户自己付的 → `actual_paid`
- 用户问价/预算 → `inquiry`
- 从业者说“客户花 3000” → `other_quote`
- “红包随喜” → `red_envelope`
- 不要把所有金额都当“付费意愿”

---

## 11. 地区

- `region`：`TW` / `HK` / `unknown`
- `region_confidence`：`high` / `medium` / `low`
- `region_evidence`：`text_city` / `cantonese` / `currency` / `query` / `profile`

规则：

- `zh_TW` 只是语言标记，不等于台湾
- 香港用词（嘅/喺/唔/咁/冇）可提高 HK 置信度
- 只有 `query=香港算命` 不能直接判 HK，最多 `medium`
- 不确定 → `unknown`，不要硬分

---

## 12. 编码流程

```text
读上下文
  → 判断 sample_group
  → 先定 evidence_level
  → 再定 purchase_stage
  → 痛点（多标签）
  → trigger（单选）
  → alternatives + satisfaction
  → trust objections
  → desired outcome
  → price
  → region / confidence
  → notes
```

要求：

- 必须读原文，不能只看摘要
- 先证据，后推断
- 不确定 → `unknown` / `low`
- 10% 双编码校准
- CSV 写 `codebook_version=v3.0`

---

## 13. 常见错误

1. 把 E1 痛点写成 E2/E3
2. 把“朋友问”写成本人 E3
3. 把从业者报价写成用户付费
4. 把广告/课程/服务文案当用户需求
5. 把 `zh_TW` 直接当台湾
6. 把回复脱离父帖编码
7. 把“被恐惧推销”写成“有购买意向”
8. 把“算命推荐”里的眼镜/美食广告当样本
9. 把情绪强度当付费意愿
10. 用单一爆款代表市场

---

## 14. Pilot V3 示例（匿名化）

| 场景 | 编码 |
|---|---|
| 待十几年被裁，难过 | `A_natural`; `E1`; `not_seeking`; `WORK_LAYOFF`; `TRIGGER_LAYOFF`; `WANT_COMFORT` |
| 新北求推荐，价格不贵、怕花冤枉钱 | `B_metaphysical`; `E2`; `seeking`; `MONEY_SCAM`; `TRIGGER_OTHER`; `TRUST_PRICE;TRUST_SCAM`; `WANT_ANSWER` |
| 之前被騙、花 3000 算命 | `B_metaphysical`; `E3`; `purchased`; `MONEY_SCAM`; `TRIGGER_FAILED_READING`; `ALT_ZIWEI` + `unsatisfied`; `TRUST_SCAM` |
| 第一次看命盘，已付费但不会问 | `B_metaphysical`; `E3`; `purchased`; `WANT_HOW_TO_ASK`; `TRIGGER_OTHER` |
| 鸟卦补人缘 3800，不补会忧郁 | `B_metaphysical`; `E2`; `comparing`; `MONEY_SCAM`; `TRIGGER_FEAR_SALES`; `ALT_TEMPLE` + `mixed`; `TRUST_FEAR_MARKETING`; `price_context=other_quote` |
| 香港从业者说收费 3000–5000、推销风水阵 | `B_metaphysical`; `industry_observer`; `E3` 不适用（`unknown`）; `TRUST_INDUSTRY_CHAOS`; `price_context=other_quote` |

---

## 15. CSV 字段

正式编码沿用：

```csv
record_id,source_id,thread_id,parent_post_id,post_type,platform,posted_at,collected_at,query,sample_group,pilot_relevance,language,region,region_confidence,region_evidence,context_available,text_summary,decision_question,pain_cluster,emotion,urgency,purchase_stage,evidence_level,trigger_event,alternative_solution,alternative_satisfaction,price_signal,price_currency,price_context,trust_objection,desired_outcome,coding_confidence,coder_id,codebook_version,notes
```

---

## 16. 版本

- `v2.0-pilot`：20 条试点
- `v3.0`：28 条 pilot V3 + 533 条合并数据校准；本文件
- 下一版只在正式编码发现定义冲突时升级；不要随意改 code
