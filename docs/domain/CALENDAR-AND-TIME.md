---
title: 历法与时间规则
status: approved
owner: 负责人
last_verified: 2026-11-21
applies_to: [shared, zh, ja]
canonical: true
---

# 历法与时间规则

> 时间规则是命理产品最容易出错的部分。
> AI 不得用“常识”推断；改任何一条都要有金标准盘和回归测试。

---

## 1. 输入

用户填：

- 公历年/月/日
- 当地钟表时间（时/分）
- 出生城市/都道府县
- 性别
- 是否“时刻不清楚”

允许年份：**1900–2100**。
时刻不清楚 → 以正午（12:00）计算，不做真太阳时校正，页面提示。

---

## 2. 时区与中央经线

| 市场 | 时区 | 中央经线 | 偏移 |
|---|---|---|---|
| 港台 | UTC+8（CST） | 120°E | `CST_OFFSET_MINUTES = 480` |
| 日本 | UTC+9（JST） | 135°E | `JST_OFFSET_MINUTES = 540` |

城市/都道府县只用于取代表经度；不是精确到出生医院的距离。

---

## 3. 真太阳时

实现：`lib/ziwei/true-solar-time.ts` 的 `calculateTrueSolarTime()`。

```text
真太阳时 = 钟表时间
          + (出生地经度 − 时区中央经线) × 4 分钟
          + 均时差（NOAA 近似）
```

- 均时差：NOAA fractional-year 近似，1900–2026 范围内足够判断两小时时辰边界
- 精度：分钟；边界按最近一秒取整，避免浮点毛刺
- 无经度：不校正，保持钟表时间
- **不处理夏令时/历史时区变更**
- 如果用户填的是“当年钟表读数”，历史时区/战时夏令时可能造成偏差（已知限制）

---

## 4. 晚子时（23:00–23:59）

实现：`resolveZiweiDayOffset(solar, 'next-day')`。

- 真太阳时落在 23:00–23:59 → 视为**次日**排盘
- 时辰仍为子时（branch 0）
- `BirthInfo.origInput` 保留用户原始输入，页面说明“已换到次日”
- 不支持把晚子时当日的流派（`current-day` 仅为引擎选项，产品统一 `next-day`）

---

## 5. 农历与换年

实现：`lib/ziwei/algorithm.ts` 的 `getLunarInfo()`，依赖 `lunar-javascript`。

### 紫微排盘年

- 以**农历正月初一**换年（与 `astro.config:yearDivide='normal'` 同口径）
- 闰月：`lunarMonth` 为负表示闰月
- 农历年/月/日用于排盘

### 节气四柱

- 年柱/月柱用 `getEightChar()`，**立春/节气精确到时刻**
- 日柱/时柱按原算法
- 时柱用“时辰中点”（`hour * 2`）近似，和排盘时辰同口径
- 结果在 `LunarInfo.fourPillars`

### 非节气四柱

- 年柱用农历年（正月初一换年）
- 月柱按农历月（初一换月）
- 结果在 `LunarInfo.fourPillarsLunar`
- 与节气四柱在交节当天可能不同

> **四柱目前以中国标准时计算**，日本/港台出生者在立春当天可能差一小时。
> 画面没有显示四柱；若将来显示，需要先加 `utcOffset` 支持。

---

## 6. 流年

- 产品使用“读取的年”选择器，按**日历年（1/1–12/31）**解释
- 四化由 `getLiuNianSiHua(year)` 按该年天干计算
- 春節/立春换年流派差异写在 FAQ，不假装唯一正确
- 2027：丁未年；立春 2027-02-04；春节 2027-02-06
- `facts.year` 决定流年四化；`chart.currentAge`/大限受当前日期影响

### 已知缺口

- AI API 用 `new Date().getFullYear()`，忽略用户选的流年
- 没有严格按春節/立春交节时刻切换流年

---

## 7. 当前日期的影响

- `chart.currentAge`（虚岁）由引擎按当前日期计算
- `currentDaXianIndex` 随年龄变
- 同一出生信息，不同日期打开，大限可能不同
- 页面显示“读取的年”，但大限是“现在”的大限

---

## 8. 测试对应

| 测试 | 覆盖 |
|---|---|
| `jp-birth` | 日本时区/真太阳时/晚子时 |
| `zh-content` | 港台输入/真太阳时 |
| `jp-edge` | 大限边界、2027 立春/春节、23:59/00:00 |
| `sizhu-lichun-boundary` | 节气四柱立春边界 |
| `clock-adjust` / `dst-cn` | 钟表时间/中国夏令时 |
| `solar-date-exists` | 日期合法性 |
| `iztro-time-index-boundary` | 时辰索引边界 |

---

## 9. 变更规则

1. 改时间规则 → 先加金标准盘（含边界时刻）
2. 更新本文 + `ASTROLOGY-RULES.md`
3. 跑 `npm test` + `npm run build`
4. 部署后用已知案例人工核对
5. 不要为单个市场改共享时间算法；市场差异放在 `cities.ts` / 输入层

---

## 10. 相关文件

- `lib/ziwei/true-solar-time.ts`
- `lib/ziwei/algorithm.ts`
- `lib/zh/birth.ts` / `lib/jp/birth.ts`
- `lib/zh/cities.ts` / `lib/jp/cities.ts`
- `domain/ASTROLOGY-RULES.md`
- `engineering/TESTING.md`
