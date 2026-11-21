---
title: 变更记录
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared]
canonical: true
---

# 变更记录

> 只记「产品/架构/流程」级变更，不逐条列 commit。
> 详细历史用 `git log`。

## 2026-11-21

- **文件系统重构**：新增索引、AI 合约、工作方法、共享/分市场 PRD、需求矩阵、ADR、backlog、handover；旧文件移到 `archive/`
- 文档正文统一为**简体中文**；繁中/日文目标文案示例保留原文并标注
- 增量 docs V2：领域模型、历法/时间、市场模型；Agent Contract 增加“产品意图 vs 实现事实”权威矩阵
- 增量 docs V2：Module Map/依赖规则；AI 质量评估最小版（7 个 golden cases）
- AI 质量 baseline 2026-11-21：7/7 通过，误报已记录
- Threads 研究 brief V2：购买证据 E1–E4、自然/命理样本分离、TW/HK 分开、Raw/Research 数据分离、购买触发/信任/决策矩阵
- Threads pilot 20 条：A 组多为 E1，B 组付费样本老/广告多，无 HK，回复无父帖
- 新增 `AGENTS.md` 根目录指针
- 新增 Threads 痛点研究 brief
- 根路径 `/` → `/zh`
- 繁中版完整（首页/诊断/结果/报告/相性/2027/文章/法务）
- 产品化：烦恼入口 + 情境、结果页共情、章节排序、报告信件语气、信任区块、AI 问答
- 港台定价：NT$680 / NT$980（HKD160/230）
- 课金骨架：AES-GCM order token、webhook HMAC、HMAC unlock
- Caddy 改 HTTP-01；DNS 切西部数码

## 2026-11-18

- 日文版格局翻译终审（定贵局/定富局）
- CI 加生产构建
- AI 成本护栏（每日 1000 / IP 20）
- Netlify → 西部数码 DNS

## 2026-11-16

- 日文版上线 VPS
- 第2版校阅反映：空宫借对宫、简体字修正、法务/隐私文案
- 新增 `jp-report` / `jp-edge` 回归

## 2026-11-15

- 繁中/日文双语架构开始
- 日文版初版（首页/诊断/结果/报告/相性/2027/文章）
