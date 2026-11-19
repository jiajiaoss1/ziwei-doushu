/**
 * 繁體中文（港台版）的 AI 深掘 prompt 層。
 *
 * 只把命盤事實給模型，禁止虛構星曜、斷定未來、醫療法律投資建議。
 * 傳輸（streamChat / getLlmConfig）沿用日文版同一套 OpenAI 兼容實作。
 */

import type { ZhChartFacts } from './facts';
import type { PaidReportType } from '@/lib/jp/access';

function starLine(star: {
  zh: { nameZh: string };
  brightness?: { label: string };
  siHua?: string;
}): string {
  const b = star.brightness ? `（${star.brightness.label}）` : '';
  const h = star.siHua ? `・化${star.siHua === '权' ? '權' : star.siHua}` : '';
  return `${star.zh.nameZh}${b}${h}`;
}

/** 給模型的「盤面事實」；這裡沒有的資訊，不能寫進解讀。 */
export function buildZhFactsDigest(facts: ZhChartFacts): string {
  const palace = (name: string) => facts.palaces.find((p) => p.name === name);
  const p = (name: string) => {
    const pal = palace(name);
    if (!pal) return '';
    const majors = pal.major.length > 0 ? pal.major.map(starLine).join('・') : '空宮';
    return `${pal.nameZh}: ${majors}`;
  };

  const lines = [
    `命宮: ${facts.ming.major.map(starLine).join('・') || '空宮'}`,
    p('夫妻'),
    p('官禄'),
    p('财帛'),
    p('田宅'),
    p('福德'),
    p('迁移'),
    `五行局: ${facts.wuxingJuName} / 命主: ${facts.mingZhu} / 身主: ${facts.shenZhu}`,
    facts.daxian
      ? `大限: ${facts.daxian.startAge}〜${facts.daxian.endAge} 歲「${facts.daxian.palaceZh}」（${facts.daxian.decadeTheme}）`
      : '大限: 還沒進入大限',
    `流年 ${facts.liunian.year} ${facts.liunian.stem}${facts.liunian.branch}年: 中心是${facts.liunian.palaceZh}`,
    ...facts.liunian.landed.map(
      (l) => `流年四化: ${l.star}在${l.palaceZh}${l.hua === '権' ? '化權' : `化${l.hua}`}`,
    ),
    facts.patterns.length > 0
      ? `格局: ${facts.patterns.map((x) => x.nameZh).join('、')}`
      : '格局: 無特別',
    `命宮三方四正: ${facts.sanfang.map((s) => `${s.palaceName}（${s.stars.join('・') || '空宮'}）`).join(' / ')}`,
  ];
  return lines.filter(Boolean).join('\n');
}

export function buildZhSystemPrompt(): string {
  return [
    '你是紫微斗數（中國傳統占術）的解讀者。',
    '請務必遵守以下規則：',
    '1. 只以提供的「盤面事實」為依據。不要虛構不存在的星曜・宮位・四化。',
    '2. 不要斷定未來。使用「較容易」「可能」「會是主題」等說法。',
    '3. 不提供醫療・法律・投資・博弈的建議。',
    '4. 不煽動不安。不使用「一定」「絕對」「靈驗」。',
    '5. 使用繁體中文（台灣用語），不要使用簡體字（例如：強、發、這、時、門、馬、見、長、東、車、電、話、變、邊、說、對、應）。',
    '6. 標題用「**【標題】**」格式，4〜5 個。每段正文 2〜4 句。',
    '7. 最後加上「※占卜是為了自我理解的參考。不保證未來。」',
    '8. 全文約 600〜900 字。',
  ].join('\n');
}

export function buildZhUserPrompt(
  facts: ZhChartFacts,
  options: { type?: PaidReportType | 'general'; question?: string } = {},
): string {
  const type = options.type ?? 'general';
  const focus =
    type === 'love'
      ? '感情・伴侶關係（以夫妻宮為主，命宮・福德宮參考）'
      : type === 'work'
        ? '工作・事業・金錢（官祿宮・財帛宮為主，大限・流年參考）'
        : '本質・感情・工作・今年主題';

  return [
    '以下是諮詢者的紫微斗數命盤。',
    '',
    buildZhFactsDigest(facts),
    '',
    `解讀焦點: ${focus}`,
    options.question ? `諮詢者的問題: ${options.question}` : '',
    '',
    '請只用這張命盤的事實，沿著焦點寫出解讀。',
  ]
    .filter(Boolean)
    .join('\n');
}
