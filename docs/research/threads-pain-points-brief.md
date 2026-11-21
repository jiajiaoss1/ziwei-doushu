# Threads 痛点与购买动机调研 Brief

> 对象：在 Threads 上做公开内容调研的 agent
> 目的：为产品/文案收集真实的痛点、决策语言、购买触发与异议
> 更新：2026-11-21
> 状态：Draft（负责人确认后执行）

> 说明：正文用简体中文；搜索关键词保留繁体，因为要搜港台内容。

---

## 0. 你的任务（先读）

你是「紫微馆」的用户研究员。
调研 Threads 的**公开**帖子和回复，整理港台（台湾・香港）用户：

- 在什么情境下
- 用什么话表达痛点
- 卡在什么决定上
- 为什么愿意/不愿意付钱

这不是验证「紫微斗数准不准」，而是找到**购买欲望产生的瞬间和语言**。

### 先读

1. 这份 brief
2. `docs/operations/HANDOVER.md`（产品现状）
3. `docs/operations/BACKLOG.md`（已知问题）

### 交付物

1. `docs/research/threads-pain-points-findings.md`（分析报告）
2. `docs/research/data/threads-posts.csv`（匿名化编码表）
3. 原始数据（URL/原文）放 `docs/research/data/raw/`，**不要提交到 Git**

---

## 1. 调研目标

回答 4 个问题：

1. 用户在什么**事件**之后开始求助/搜索/算命？
2. 他们用什么**原话**描述痛点和决定？
3. 他们试过什么、对什么失望、害怕什么？
4. 什么**证据/承诺/呈现**会让他们愿意付 NT$680 / NT$980？

### 特别想知道

- 「感情决定」和「工作决定」的痛点性质有什么不同
- 「愿意为占卜付钱」的最后一推是什么
- 「用 AI 就好」的瞬间和理由
- 「怪怪的/被骗/不准」具体指什么
- 价格在和什么比较（一顿饭、心理咨询、塔罗、朋友）

---

## 2. 样本范围

| 项目 | 指定 |
|---|---|
| 平台 | Threads 公开帖子、公开回复 |
| 语言 | 繁体中文（台湾/香港用词） |
| 时间 | 最近 3 个月（2026-08-21 ～ 2026-11-21） |
| 目标量 | 帖子 200–300、回复 500+（先 100 帖看饱和） |
| 地区 | 台湾、香港；简体/日文另存 |
| 方法 | 公开搜索、公开帖子；登录才能看的非公开区域不做 |

### 抽样原则

- 4 类痛点平均收集：
  1. 感情（暧昧、复合、分离、婚姻）
  2. 工作（转职、离职、创业、晋升）
  3. 占卜/付费（紫微、塔罗、月老、通灵、价格、被骗）
  4. 决策语言（该不该、要不要、卡住、内耗）
- 不只看主帖，**回复**里购买意图更明显
- 不只看高互动爆款，无名但真实的帖子也重要
- 同一用户重复发帖合并为 1 条

---

## 3. 搜索关键词（保留繁体）

### 感情

```
分手 復合 曖昧 暈船 遠距 結婚 婚前 劈腿 冷淡 已讀不回 放下 感情挽回 復合時機
```

### 工作

```
轉職 離職 裸辭 留任 升遷 創業 副業 裁員 職涯 面試 工作不順
```

### 占卜/付费

```
紫微 塔羅 算命 月老 通靈 老師 諮詢 費用 值得嗎 被騙 退款
```

### 决策语言

```
該不該 要不要 好猶豫 卡住 內耗 不知道怎麼辦 選擇困難
```

> 不固定关键词。调研中出现新说法，记到 `notes`，后半段补充；补充词要写进报告。

---

## 4. 纳入/排除

### 纳入

- 本人正在经历的具体情境
- 有明确 decision question（要不要复合？要不要辞职？）
- 有情绪、时间压力、金钱/关系成本
- 公开帖子、上下文可读

### 排除

- 命理师/塔罗师的广告、招生、免费鉴定宣传
- 新闻、迷因、只有图没有正文
- 能强烈识别第三人隐私的内容
- 简体中文（需要的话另存 `language=zh-Hans`）

---

## 5. 记录格式

`docs/research/data/threads-posts.csv`，列如下：

```csv
post_id,url,platform,posted_at,collected_at,query,post_type,
language,region_signal,author_bio_public,
text_verbatim,situation_summary,decision_question,
relationship_stage,work_stage,
pain_cluster,emotion,urgency,
prior_solutions,paid_before,price_signal,trust_objection,desired_outcome,
engagement_likes,engagement_replies,notes
```

### 列定义

| 列 | 定义 |
|---|---|
| `post_id` | 平台内 ID（不明用 URL hash） |
| `url` | 公开帖子 URL（内部用，报告不露出） |
| `post_type` | `original` / `reply` / `quote` |
| `language` | `zh-Hant` / `zh-Hans` / `mixed` |
| `region_signal` | 台湾/香港用词、地名、币种（`TW` / `HK` / `unknown`） |
| `author_bio_public` | 仅公开简介里的属性，可空 |
| `text_verbatim` | 原文，不改写 |
| `situation_summary` | 1–2 句摘要，不抄全文 |
| `decision_question` | 本人真正要决定的事 |
| `relationship_stage` | `single` / `ambiguous` / `dating` / `committed` / `married` / `breakup` / `na` |
| `work_stage` | `student` / `employed` / `job-hunting` / `considering-quit` / `founder` / `na` |
| `pain_cluster` | 下节 codebook，可多选（`;` 分隔） |
| `emotion` | `anxiety` / `confusion` / `shame` / `hope` / `anger` / `numb` |
| `urgency` | `now` / `weeks` / `months` / `unknown` |
| `prior_solutions` | 朋友、塔罗、紫微、心理咨询、ChatGPT 等（`;`） |
| `paid_before` | `yes` / `no` / `unknown`（是否为占卜/咨询付过费） |
| `price_signal` | 价格提及（太贵/便宜/多少愿意付） |
| `trust_objection` | `怕不準` / `怕被騙` / `隱私` / `覺得貴` / `不信命理`（`;`） |
| `desired_outcome` | `answer` / `timing` / `action` / `comfort` / `validation` |
| `engagement_likes` | 抓取时数量 |
| `engagement_replies` | 抓取时数量 |
| `notes` | 上下文、例外、搜索词 |

> `text_verbatim` 只内部保存；对外报告要匿名化、摘要、短引用。

---

## 6. Codebook（初版）

### 痛点（12–15）

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

### 异议（5）

```
怕不準
怕被騙
覺得貴
隱私顧慮
不相信命理
```

### 想要的结果（5）

```
要一個答案
要時機
要具體行動
要被理解/安慰
要驗證自己想的對不對
```

### 规则

- 一条帖子可多标签
- 必须读 `text_verbatim` 再打标签，不能只看摘要
- 犹豫时在 `notes` 写原因
- 预留 10% 人工复核，保留判断依据

---

## 7. 工作步骤

1. 读 `docs/operations/HANDOVER.md` 和本 brief
2. 每个搜索词先收 20 条公开帖子
3. 按纳入/排除过滤
4. 写入 `threads-posts.csv`
5. 100 条时检查饱和（是否还出现新痛点）
6. 不够再补到 200–300 条
7. 打标签，按频率、强度、付费意愿整理
8. 写 `threads-pain-points-findings.md`
9. 原始数据放 `data/raw/`，CSV 匿名化后保存
10. 完成后在 `docs/operations/HANDOVER.md` 时间线加一行

---

## 8. 最终报告结构

`docs/research/threads-pain-points-findings.md`：

1. **摘要**（5 条）
2. **方法**（搜索词、时间、数量、排除、局限）
3. **Top 20 痛点**（频率 × 情绪强度 × 付费意愿）
4. **按痛点分组的原文**（每组 5–10 条，匿名化）
5. **用户旅程**（trigger → search → compare → objection → purchase/abandon）
6. **分群矩阵**（感情/工作 × 急迫/观望 × 价格敏感/价值敏感）
7. **购买阻力 Top 5**
8. **有效语言 / NG 表达**
9. **待验证假设 10 条**
10. **局限与下一步**（Dcard/IG/访谈）

### 报告必须写

- 数量与搜索词（可复现）
- 样本偏差（Threads 偏年轻、偏文字表达、偏特定社群）
- 不大量转载原文（匿名化、摘要）
- 不写「占卜很准」这种结论

---

## 9. 质量与伦理

- 只做公开信息；不碰私信、非公开社群、登录才能看的区域
- 遵守平台条款/频率限制
- 不绕过登录或 CAPTCHA；需要登录就改人工收集
- 用户名/URL 只内部管理，报告匿名化
- 敏感内容（病名、暴力、未成年）只做摘要，不留原文
- 记录抓取时间，数字标注「抓取时点」

---

## 10. 完成条件（Definition of Done）

- [ ] 100 条以上（尽量 200–300）帖子、500+ 回复
- [ ] CSV 必填列完整
- [ ] 痛点/异议/想要结果的标签完成
- [ ] `threads-pain-points-findings.md` 按结构写完
- [ ] 原文已匿名化
- [ ] 搜索词、数量、局限写清楚
- [ ] 原始数据没有提交到 Git
- [ ] `docs/operations/HANDOVER.md` 加完成行

---

## 11. 不要做

- 验证紫微斗数的准确率/命中率
- 人肉/定位用户
- 攻击竞品
- 报告里大量转载原文
- 把抓取数据外传
