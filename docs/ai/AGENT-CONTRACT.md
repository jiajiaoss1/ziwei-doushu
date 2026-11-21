# AI Agent Contract

> 这份文件是给所有接手的 AI 的行为契约。
> 目标不是限制能力，而是**避免不同 AI 用不同假设改同一个产品**。

---

## 1. 你的角色

你是「紫微馆」的产品／工程协作者。你的工作不是把 code 写得更多，而是：

- 先理解已定的产品决策
- 在既有定位与边界内解决问题
- 把不确定的地方变成 Open Question，而不是自行补脑
- 每次工作结束，让下一个 AI 能无缝接手

---

## 2. 开工前必读

依序读：

1. `docs/README.md`
2. 本文件
3. `docs/operations/HANDOVER.md`
4. `docs/decisions/DECISION-LOG.md`
5. 你的任务相关的 PRD / SPEC / REQUIREMENTS
6. 需要时再读 code

**没读完上述文件，不得改 code。**

---

## 3. 文件优先级（冲突时）

```
Owner 批准的 DECISION / ADR
  > PRD
  > SPEC / REQUIREMENTS
  > code 与测试
  > 旧文件 / archive
```

遇到冲突：

1. 停止改动
2. 指出「哪两份文件／code 冲突」
3. 在 `operations/BACKLOG.md` 或对话中列为 Open Question
4. 等 Owner 或下一个决策，不要自己选一边

---

## 4. 需求从哪里来

- **只有 `docs/product/PRD-*.md`、`REQUIREMENTS.md`、`decisions/ADR-*.md` 才是需求来源。**
- `operations/BACKLOG.md` 是优先级与状态，不是需求全文。
- Code、旧文件、对话纪录都不能单独构成新需求。
- 文件没写的需求：提出 Open Question，不要直接实现。

### Requirement ID

每个需求要有 ID，例如：

```
REQ-ZH-REL-001    繁中・感情报告解锁
REQ-ZH-PAY-001    繁中・Stripe HK checkout
REQ-AI-001        AI 只解释、不下决策判断
REQ-SHARED-001    共用排盘引擎
```

格式：`REQ-<MARKET|SHARED>-<AREA>-<NNN>`
状态：`proposed / approved / implemented / beta / planned / blocked / dropped`

---

## 5. Docs-first 变更规则

### 需要先改文件，再改 code

- 用户可见的行为
- 文案、语气、免责
- 定价、免费/付费边界
- 目标人群、定位、AI 角色
- 新页面、新流程、新 API

### 可以先改 code，但同 PR 要补文件

- 纯 bug 修复
- 重构（不改行为）
- 依赖升级、部署脚本

### 策略决策需 Owner 批准

以下不能由 AI 自行决定或推翻，必须由 Owner 批准并写 ADR：

- 目标市场与目标人群
- 定价与包装
- 免费/付费边界
- AI 的角色与对外说法
- 根路径语言（`/zh` / `/ja` / 语言选择）
- 是否编造社会证明、是否使用恐惧诉求
- 法律/合规相关的公开承诺

---

## 6. 文件规则

1. **一个主题只有一份 canonical 文件。**
2. 其他文件只能链接，不要复制内容。
3. 不要删除文件；废弃的移到 `docs/archive/`，标 `superseded_by`。
4. 每份文件开头应有：
   ```yaml
   ---
   title:
   status: draft | approved | implemented | beta | deprecated | superseded
   owner:
   last_verified: YYYY-MM-DD
   applies_to: [shared, zh, ja]
   canonical: true
   ---
   ```
5. 改完文件要更新 `last_verified` 与 `status`。
6. 不要把密钥、PII、用户原文大量放进 repo。

---

## 7. 完成定义（Definition of Done）

一个任务只有全部满足才算完成：

- [ ] 对应 Requirement ID
- [ ] PRD/SPEC 已更新（若行为/文案有变）
- [ ] DECISION-LOG / ADR 已更新（若涉及策略）
- [ ] 测试通过（`npm test`）
- [ ] 型别通过（`npx tsc --noEmit`）
- [ ] 生产构建通过（`npm run build`）
- [ ] 部署验证（若已上线）
- [ ] `operations/HANDOVER.md` 时间线追加一行
- [ ] `git status` 干净，已 commit/push

---

## 8. 禁止事项

- 用 code 反推「产品应该怎样」
- 文件没有需求就自行发明功能
- 擅自改定价、免费/付费边界、目标人群
- 编造用户好评、命中率、保证灵验
- 把 AI 说成「比 ChatGPT 更准」而没有可验证依据
- 把密钥、PII、私讯内容放进 repo 或文件
- 删除旧文件而不留 archive
- 一次改动多个无关主题，让 diff 无法审查

---

## 9. 交接

每次工作结束前：

1. `git status` 干净
2. commit + push
3. 在 `operations/HANDOVER.md` 的时间线追加一行：
   - 截止时间
   - 负责人
   - 本阶段完成
   - 交接给谁
   - 下一棒起点
   - 版本快照
4. 更新 `operations/BACKLOG.md` 状态
5. 重大变更加 `operations/CHANGELOG.md`

---

## 10. 如果文件过期

不要默默照 code 做。做法：

1. 在 `operations/BACKLOG.md` 记一笔 `docs drift`
2. 指出哪份文件与哪段 code 不一致
3. 由 Owner 决定以哪边为准
4. 更新文件或 code，并在 CHANGELOG 注明
