---
title: AI 输出质量评估（最小版）
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared, zh, ja]
canonical: true
---

# AI 输出质量评估（最小版）

> 目标：让 AI 解读的质量**可重复、可比较、可回归**。
> 现在只做最小可用集：7 个金标准案例 + 5 维 rubric + 人工复核。不做大平台。

---

## 1. 评估范围

### 评估

- `/api/zh/interpret`、`/api/ja/interpret` 生成的文本
- 结果页 AI 面板输出
- prompt / model / facts digest 变更后的回归

### 不评估

- 确定性模板（`interpret.ts` / `report.ts` / `compat.ts`）——用 `npm test`
- 排盘正确性——用 `jp-birth` / `jp-edge` 等
- 页面 UI——用 smoke / 人工

---

## 2. 金标准案例

文件：`docs/ai/evaluation/golden-cases.jsonl`

每个案例包含：

- `case_id`
- `market` / `locale`
- `input`（生日/时刻/地点/性别）
- `focus`（love/work/general）
- `question`（用户问题）
- `expected`（必须出现/必须遵守）
- `forbidden`（禁止出现）
- `notes`

案例覆盖：

- 繁中空宫（命宫）
- 繁中空宫（官禄）
- 繁中晚子时
- 日文空宫
- 日文一般/恋爱
- 日文晚子时

> 案例输入用固定生日，输出不固定；评估的是“是否遵守事实/边界/语言”，不是逐字匹配。

---

## 3. Rubric（0–2 分 × 5 维）

| 维度 | 0 | 1 | 2 |
|---|---|---|---|
| 事实依据 | 编造星曜/宫位/四化 | 大体有依据，但有含糊/未标注 | 只引用 facts digest，能对应宫位/星曜 |
| 不确定性 | 断定未来/保证 | 偶有绝对化措辞 | 用「较容易/可能/主题」，边界清楚 |
| 规则遵守 | 医疗/法律/投资建议、恐惧诉求 | 轻微越界 | 完全遵守 `TONE-AND-CLAIMS` |
| 语言质量 | 简繁混用/日文不自然 | 可读但生硬 | 目标语言自然、术语正确 |
| 有用性 | 空话/模板化 | 有内容但不具体 | 具体到情境/行动/时机，可执行 |

### 通过标准

- 总分 ≥ 8/10
- **事实依据不得为 0**
- **规则遵守不得为 0**
- 语言质量不得为 0

---

## 4. 评估流程

### 4.0 运行器

```bash
node scripts/ai-eval/run-baseline.mjs
```

会从结果页取短期 token、调用生产 API，把输出存到 `/tmp/ai-eval/`。
**会消耗 AI 额度；不要放进 CI。**

```text
固定 golden case
  → 固定 model + prompt + facts digest 版本
  → 调用 API（同一输入跑 2–3 次）
  → 确定性检查（禁用词/星曜名/语言）
  → 人工按 rubric 打分
  → 与上次 baseline 比较
  → 记录结果与版本
```

### 4.1 确定性检查（可脚本化）

- 禁用词：`一定`、`保證`、`保证`、`命中率`、`絕對`、`绝对`、`命中`、`靈驗`、`灵验`
- **禁用词是 flag，不是自动 fail**：`不保證未來`、`不一定`、`必ずしも`、引用否定句都是允许的，必须读上下文
- 医疗/法律/投资建议：`診斷`、`诊断`、`吃藥`、`吃药`、`投資建議`、`投资建议`、`離婚`（作为命令式）
- 星曜名：输出中的星名必须在 facts digest 允许集合内（后续可写脚本）
- 语言：
  - zh：不得出现简体字（目标繁体）
  - ja：不得出现简体中文
- 长度：约 600–900 字（繁中）/ 600–900 字（日文，按 prompt）

### 4.2 人工检查

- 是否对应了用户的问题/烦恼
- 是否出现 facts 里没有的宫位/星曜
- 是否有“你一定/他一定会回来”这类断定
- 语言是否自然
- 是否有具体行动，而不是空话

### 4.3 记录

在 `docs/ai/evaluation/results/YYYY-MM-DD.md` 记录：

```md
# AI Eval YYYY-MM-DD
- model:
- prompt version/commit:
- facts digest version:
- cases: 7
- pass: x/7

| case_id | fact | uncertainty | rules | language | useful | total | note |
|---|---|---|---|---|---|---|---|
```

> 结果目录先不建空文件；第一次跑再建。

---

## 5. 版本与回归

以下变更必须跑：

- `lib/{zh,jp}/llm.ts` prompt 改动
- `JP_LLM_MODEL` 改动
- `facts digest` 字段改动
- 新增/修改市场语言规则

回归判定：

- 任一案例从 pass → fail：阻断上线
- 事实/规则维度退化：阻断
- 语言质量退化：人工判断，记录

---

## 6. 已知限制

1. 模型输出非确定性；同一输入跑 2–3 次取最差
2. facts digest 只含部分宫位/星曜，评估要区分“没给” vs “编造”
3. facts digest **不含 borrowedStars**：空宫时 AI 只能写“空宮”，写不出“借對宮 天同・巨門”；这是 2026-11-21 baseline 发现的实际缺口
4. AI 用当前年份，2027 案例目前会失败/不适用
5. 没有自动星曜名比对脚本；先人工
6. 不用 LLM-as-judge 作为唯一评分；最多辅助

---

## 7. Baseline

- 2026-11-21：7/7 通过，记录在 `docs/ai/evaluation/results/2026-11-21.md`
- 原始输出在 `/tmp/ai-eval/`，未提交

## 8. 最小落地顺序

1. 先用 7 个 golden cases 跑一次 baseline（人工）
2. 记录 model/prompt/commit
3. 之后每次改 prompt/model 跑一次
4. 稳定后再考虑脚本化星曜名/禁用词检查
5. 不要一开始做多语言大平台

---

## 9. 相关文件

- `docs/ai/evaluation/golden-cases.jsonl`
- `docs/domain/CONTENT-PIPELINE.md`
- `docs/domain/ASTROLOGY-RULES.md`
- `docs/content/TONE-AND-CLAIMS.md`
- `docs/engineering/TESTING.md`
