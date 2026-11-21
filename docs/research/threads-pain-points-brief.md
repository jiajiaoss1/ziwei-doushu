# Threads 首个付费用户群体（Beachhead）研究 Brief

> 对象：在 Threads 上做公开内容调研的 agent / 研究员
> 目的：支持台湾、香港市场首个付费用户群体、付费交付物与定价假设的决策
> 版本：V2（2026-11-21）
> 状态：Ready for execution
> 语言：正文简体中文；搜索关键词保留繁体（要搜港台内容）

---

## 0. 你的任务（先读）

你是「紫微馆」的用户研究员。
你要研究 Threads 的**公开**帖子和回复，回答：

1. 哪些人最需要紫微馆？
2. 他们在什么情境下会考虑付费？
3. 他们为什么不满足于朋友、塔罗、心理咨询、ChatGPT？
4. 他们真正愿意买的是什么交付物？
5. 台湾和香港是否需要不同的定位/交付物/价格？

这不是验证「紫微斗数准不准」。
这是**首个付费用户群体（beachhead）研究**：找到“有真实决策痛点 + 已经尝试过其他方法 + 仍不满意 + 可能愿意付费”的人。

### 必须交付

1. `docs/research/threads-pain-points-findings.md`（分析报告）
2. `docs/research/data/threads-posts.csv`（脱敏研究数据，默认不进 Git）
3. `docs/research/data/raw/*.jsonl`（原始数据，绝不进 Git）
4. 完成 `docs/operations/HANDOVER.md` 时间线一行

---

## 1. 研究问题

### 主要问题

1. 哪些痛点最集中、情绪最强、最接近付费？
2. 台湾 vs 香港：需求、表达、价格、渠道有什么方向性差异？
3. 用户在什么**触发事件**后开始找解决方案？
4. 他们试过什么（朋友/塔罗/紫微/心理咨询/ChatGPT）？为什么不满意？
5. 他们愿意为哪种交付物付费：报告、决策分析、时机、行动建议、持续追问？
6. 他们为什么不信任线上命理产品？
7. NT$680 / NT$980 是否值得进入下一轮验证？

### 次要问题

- 免费 AI 与付费报告/付费追问的边界应该在哪？
- 用户是否担心 AI 迎合、前后矛盾、没有依据？
- 用户是否需要“可反复查看”的结构化报告？

---

## 2. 研究原则

### 2.1 不要把“有痛点”当成“愿意付费”

证据分四级，必须分开记录：

| 等级 | 证据 | 能支持什么 |
|---|---|---|
| E1 | 痛点表达（「我不知道要不要分手」） | 有困扰 |
| E2 | 主动寻找方案（「有没有推荐的老师？」） | 在找方案 |
| E3 | 真实付费行为（「之前算过一次，花 1500」） | 曾付费 |
| E4 | 明确购买意向（询价/比较/愿意买） | 强意向 |

规则：

- E1 ≠ E2 ≠ E3 ≠ E4
- 无法判断 → `unknown`
- 不要从情绪强度推断付费意愿
- 报告要分开呈现：痛点频率、情绪强度、方案搜寻、历史付费、明确意向

### 2.2 分开两类样本

| 组 | 来源 | 目的 |
|---|---|---|
| A. 自然痛点 | 感情/工作/人生选择关键词，**不搜命理词** | 看用户是否会先产生现实问题 |
| B. 命理消费 | 紫微/塔罗/算命/收费/被骗 | 看已接触命理者的消费经验与不满 |

两组分别分析，再交叉比较；不要混成一个总体比例。

### 2.3 台湾、香港分开看

- 分别统计，不直接合并
- 记录 `region_confidence` / `region_evidence`
- 样本不足时标 `n`，只做方向性判断
- 地区不明 → `unknown`

### 2.4 Threads 只能形成假设

Threads 样本不能代表整个市场，也不能证明转化率。
最终结论要经过 8–12 个访谈/真实购买测试验证。

### 2.5 区分四个层次

报告里必须区分：

1. **观察到的事实**：帖子原文/行为
2. **研究编码**：按 Codebook 分类
3. **研究推论**：从样本模式推导的假设
4. **产品建议**：团队根据推论做的设计/商业决策

不要把 2/3/4 写成 1。

---

## 3. 样本与搜索

### 3.1 时间与数量

| 项目 | 指定 |
|---|---|
| 平台 | Threads 公开帖子、公开回复 |
| 语言 | 繁体中文（台湾/香港用词） |
| 时间 | 最近 3 个月（2026-08-21 ～ 2026-11-21） |
| 试采样 | 40 条（A/B × TW/HK 各约 10） |
| 正式采集 | 100–150 条（不是 300；先看饱和） |
| 回复 | 尽量 300+，但不必机械凑数 |
| 访谈 | 8–12 人（研究后期） |

### 3.2 A 组：自然痛点关键词（不搜命理）

**感情**

```
分手 復合 曖昧 暈船 遠距 婚前 劈腿 冷淡 已讀不回 放下 感情挽回
```

**工作**

```
轉職 離職 裸辭 留任 升遷 創業 副業 裁員 職涯 面試 工作不順
```

**决策/情绪**

```
該不該 要不要 好猶豫 卡住 內耗 不知道怎麼辦 選擇困難
```

> A 组不主动搜「紫微/塔罗/算命」，否则会污染自然需求样本。

### 3.3 B 组：命理消费关键词

```
紫微 塔羅 算命 占卜 月老 通靈 老師 諮詢 費用 價格 值得嗎 被騙 退款
```

### 3.4 ChatGPT / 免费 AI 替代行为

```
ChatGPT 感情
ChatGPT 曖昧
ChatGPT 轉職
AI 算命
AI 塔羅
聊天機器人 感情
```

A/B 组都记录 `alternative_solution`，但 ChatGPT 要单独编码，不要只塞进备注。

### 3.5 纳入 / 排除

**纳入**

- 本人正在经历的具体情境
- 有 decision question（要不要复合/辞职/继续）
- 有情绪、时间压力、金钱/关系成本
- 公开且上下文可读

**排除**

- 命理师/塔罗师广告、招生、免费鉴定宣传
- 新闻、迷因、只有图无正文
- 能强烈识别第三人隐私
- 简体中文（另存 `zh-Hans`，不混入繁中样本）

---

## 4. 数据结构：Raw 与 Research 分开

### 4.1 Raw Data（不提交 Git）

`docs/research/data/raw/*.jsonl`：

```json
{"record_id":"r001","url":"...","thread_id":"...","parent_post_id":"...","post_type":"reply","posted_at":"...","collected_at":"...","text":"...","query":"...","notes":"..."}
```

规则：

- 只收研究所需最少信息
- 默认**不收集** `author_bio_public`
- 不收集用户名/头像/私信
- 设定访问权限、保留期限、删除机制
- 绝不提交 Git

### 4.2 Research Dataset（默认不提交 Git）

`docs/research/data/threads-posts.csv`：只放脱敏摘要与编码。

字段：

```csv
record_id,thread_id,parent_post_id,post_type,platform,posted_at,collected_at,query,sample_group,
language,region,region_confidence,region_evidence,context_available,
text_summary,decision_question,pain_cluster,emotion,urgency,
purchase_stage,evidence_level,trigger_event,
alternative_solution,alternative_satisfaction,
price_signal,price_currency,price_context,
trust_objection,desired_outcome,
coding_confidence,coder_id,codebook_version,notes
```

### 4.3 字段定义

| 字段 | 定义 |
|---|---|
| `record_id` | 内部随机 ID |
| `thread_id` | 讨论串 ID |
| `parent_post_id` | 回复对应的父帖 ID |
| `post_type` | `post` / `reply` |
| `sample_group` | `A_natural` / `B_metaphysical` |
| `language` | `zh-Hant` / `zh-Hans` / `mixed` |
| `region` | `TW` / `HK` / `unknown` |
| `region_confidence` | `high` / `medium` / `low` |
| `region_evidence` | 用词/地名/币种，仅必要信息 |
| `context_available` | `true` / `false` |
| `text_summary` | 1–2 句脱敏摘要，不抄原文 |
| `decision_question` | 本人真正要决定的事 |
| `pain_cluster` | Codebook，多选 `;` |
| `emotion` | `anxiety` / `confusion` / `shame` / `hope` / `anger` / `numb` |
| `urgency` | `now` / `weeks` / `months` / `unknown` |
| `purchase_stage` | `not_seeking` / `seeking` / `comparing` / `purchased` / `abandoned` / `unknown` |
| `evidence_level` | `E1`–`E4` / `unknown` |
| `trigger_event` | 分手/复职/转职/被裁/家人催婚/节日/生日等 |
| `alternative_solution` | 朋友/塔罗/紫微/心理咨询/ChatGPT/其他 |
| `alternative_satisfaction` | `satisfied` / `unsatisfied` / `mixed` / `unknown` |
| `price_signal` | 价格提及（贵/便宜/愿意付多少） |
| `price_currency` | `TWD` / `HKD` / `other` / `unknown` |
| `price_context` | `actual_paid` / `inquiry` / `other_quote` / `hypothetical` |
| `trust_objection` | 怕不准/怕被骗/隐私/觉得贵/不信命理（`;`） |
| `desired_outcome` | `answer` / `timing` / `action` / `comfort` / `validation` |
| `coding_confidence` | `high` / `medium` / `low` |
| `coder_id` | 编码者（agent 或人名代号） |
| `codebook_version` | 例如 `v2.0` |
| `notes` | 判断依据/例外 |

> `text_summary` 不是原文；原文只在 Raw Data。

---

## 5. Codebook（V2 初版）

> Codebook 的标签保留繁体，便于直接匹配港台原文与编码；正文说明用简体。

### 5.1 痛点

```
關係：不確定對方想法
關係：復合/挽回
關係：曖昧卡住
關係：結婚時機
關係：遠距/跨國
關係：背叛/劈腿
關係：放下/失戀
工作：轉職猶豫
工作：留任痛苦
工作：創業/副業恐懼
工作：升遷/人際瓶頸
工作：裁員/失業
自我：內耗/反覆思考
自我：選擇困難
金錢：怕花錢/怕被騙
```

### 5.2 购买阶段

```
not_seeking   只是抒发，没有找方案
seeking       在问“有没有人推荐/怎么办”
comparing     在比较老师/价格/服务
purchased     已经买过
abandoned     曾经想买但放弃
unknown       无法判断
```

### 5.3 购买触发事件

```
分手/離婚
復合失敗
曖昧卡住
被催婚
轉職/離職
被裁員
創業/副業
家庭衝突
節日/生日/年末
朋友推薦
看到廣告/貼文
其他
```

### 5.4 替代方案

```
朋友/家人
塔羅
紫微/八字
月老/通靈
心理諮商
ChatGPT/AI
自己查資料
其他
```

### 5.5 信任异议

```
怕不準
怕被騙
覺得貴
隱私顧慮
不相信命理
不信任 AI
需要真人背書
```

### 5.6 想要的结果

```
要一個答案
要時機
要具體行動
要被理解/安慰
要驗證自己想的對不對
```

### 5.7 编码规则

- 一条可多标签
- 必须读上下文，不能只看摘要
- 证据等级取“最强直接证据”，不从语气推断
- `unknown` 是合法值，不要强行填
- 先做 10% 双编码校准，再扩大样本
- 记录 `coder_id` / `codebook_version`

---

## 6. 采集流程

### 阶段 1：试采样（约 40 条）

覆盖：

- A 组 TW / HK
- B 组 TW / HK

目的：检查关键词、地区识别、上下文、字段可用性。
不要用这 40 条推断市场规模。

### 阶段 2：编码校准（10%）

1. AI 先按 Codebook 编码
2. 人工复核 10%（或另一个 agent 独立编码）
3. 比较分歧：痛点/阶段/证据等级/替代方案
4. 修订标签定义与正反例
5. 固定 `codebook_version`

### 阶段 3：正式采集（100–150 条）

- A/B 分开
- TW/HK 分开
- 记录来源关键词、采集日期、纳入理由
- 接近饱和就停，不机械凑数

### 阶段 4：定向补样

只补证据不足的格子：

- 某地区样本太少
- 只有 E1，没有 E2–E4
- ChatGPT 替代样本太少
- 某类交付物需求只有个例
- 某个购买阶段缺上下文

### 阶段 5：分析

- TW/HK 方向性差异
- A/B 交叉
- 痛点 × 证据等级
- 购买触发 Top 10
- 替代方案与 AI 替代行为
- 信任因素与购买阻力
- 需求 → 交付物映射

### 阶段 6：访谈（8–12 人）

从样本中选：

- 不同地区
- 不同痛点
- 不同购买阶段（E2–E4 优先）
- 不同替代方案（尤其 ChatGPT）

验证：他们真的会为什么付费、什么情况下不买。

---

## 7. 最终报告结构

`docs/research/threads-pain-points-findings.md`：

1. **Executive Summary**：最值得进入的机会是什么？
2. **Methodology**：样本、关键词、偏差、限制
3. **Pain Point Landscape**：Top 20 痛点（频率 × 强度）
4. **Purchase Trigger Top 10**：什么事件让人开始找付费方案
5. **Purchase Evidence**：E1–E4 分布；谁真的有购买行为/意向
6. **Alternative Solutions**：朋友/塔罗/心理咨商/ChatGPT 为什么不够
7. **Trust & Objections**：为什么不信任/不买
8. **Segment Matrix**：TW/HK × 痛点 × 购买阶段 × 价格敏感
9. **Product Opportunity**：应该卖什么交付物
10. **Positioning & Copy**：应该怎么表达
11. **Hypotheses & Validation**：哪些还是假设，下一步怎么验

### 必须附带的决策矩阵

| 决策 | 研究要给出 |
|---|---|
| Beachhead | 首个目标群体是谁 |
| 首要场景 | 感情还是事业，依据 |
| 首发市场 | TW 还是 HK，是否分市场 |
| 付费交付物 | 报告/决策/时机/行动/追问 |
| 免费 AI | 免费给到什么程度 |
| 付费 AI | 是否要持续追问 |
| 信任设计 | 什么证据能降低阻力 |
| 定价 | NT$680/980 是否进入下一轮验证 |

> Threads 只能形成价格假设，不能证明转化率；价格要靠访谈/真实购买测试。

---

## 8. 质量与伦理

- 只做公开信息；不碰私信/非公开社群/登录才可见内容
- 遵守平台条款/频率限制；不绕过登录/CAPTCHA
- 默认不收集 `author_bio_public`；不收集用户名
- Raw Data 限制访问、不提交 Git、设定删除期限
- 报告匿名化，不大量转载原文
- 敏感内容（病名/暴力/未成年）只做摘要
- 记录采集时间，数字标“采集时点”

---

## 9. 完成条件（Definition of Done）

- [ ] 试采样 40 条 + 正式 100–150 条（或饱和说明）
- [ ] A/B、TW/HK 都有样本
- [ ] `evidence_level` / `purchase_stage` / `trigger_event` 已编码
- [ ] 10% 双编码校准完成，`codebook_version` 固定
- [ ] Report 11 节 + 决策矩阵完成
- [ ] 原始数据未进 Git
- [ ] 结论区分事实/编码/推论/建议
- [ ] `HANDOVER.md` 加完成行

---

## 10. 不要做

- 验证紫微斗数准确率/命中率
- 把痛点频率直接当付费意愿
- 把 A/B 组合并成一个总体比例
- 把 Threads 当市场规模/转化率证据
- 人肉/定位用户
- 大量转载原文
- 用“大家都说准”替代证据

---

## 11. 一句话

> 我们要找的不是“最想算命的人”，而是**正在做重要决定、已经试过其他方法、仍然没有得到满意答案，并且有付费证据/意向的人**。
