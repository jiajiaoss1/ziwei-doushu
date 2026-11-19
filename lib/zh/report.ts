/**
 * 付費報告（感情鑑定書 / 事業鑑定書）的文字生成（繁體中文・港台版）。
 *
 * 比免費診斷更深入，從宮位・四化・大限・流年的組合，
 * 整理「對象形象」「職種」「時機」「注意點」「行動建議」。
 */

import type { PalaceFact, StarFact, ZhChartFacts } from './facts';
import { SIHUA_ZH, starZh } from './glossary';

export type ReportType = 'love' | 'work';

export interface ReportSection {
  title: string;
  body: string;
}

export interface PaidReport {
  type: ReportType;
  title: string;
  subtitle: string;
  /** 開頭：像一封信的稱謂與開場 */
  opening: string;
  summary: string[];
  sections: ReportSection[];
  /** 結尾：寫給你的話 */
  closing: string;
  generatedAt: string;
}

/** 從夫妻宮主星看的「容易吸引你的人」 */
const PARTNER_IMAGE: Record<string, string> = {
  紫微: '氣場穩重、能平等尊重你的人',
  天機: '腦筋轉得快、聊天總有話題的人',
  太陽: '開朗、會照顧人、常站在人群中心的人',
  武曲: '話不多，但會用行動證明可靠的人',
  天同: '溫和，光是待在身邊就能讓人放鬆的人',
  廉貞: '有個性、讓人移不開目光的人',
  天府: '有包容力，待在旁邊就覺得安心的人',
  太陰: '細膩，能察覺你情緒變化的人',
  貪狼: '擅長社交，相處起來常帶來新鮮刺激的人',
  巨門: '求知慾強，聊起來不容易膩的人',
  天相: '會體貼人，在背後默默支持你的人',
  天梁: '有長輩般的沉穩與包容力的人',
  七殺: '決斷明快、能帶著你往前衝的人',
  破軍: '不受框架限制、帶著自由感的人',
};

/** 從官祿宮主星看的「適合的工作方式」 */
const JOB_TYPES: Record<string, string> = {
  紫微: '管理職・經營・組織領導等，負責指出方向的工作',
  天機: '企劃・分析・顧問・專業職等，以知識為武器的工作',
  太陽: '教育・公關・公部門・接待等，需要站到人前的工作',
  武曲: '業務・金融・技術・製造等，以成果與數字說話的工作',
  天同: '服務・福利・協調等，支撐他人的工作',
  廉貞: '企劃・美容・法務・創意等，講究品味的工作',
  天府: '財務・總務・不動產・管理等，守護基礎的工作',
  太陰: '設計・寫作・照護・研究等，運用感受力與專注的工作',
  貪狼: '業務・演藝・娛樂・企劃等，吸引人的工作',
  巨門: '教育・法務・研究・專業職等，處理語言與知識的工作',
  天相: '秘書・協調・服務・美容等，幫人整理與調整的工作',
  天梁: '醫療・教育・公職・諮詢等，帶人前進的工作',
  七殺: '開發業務・創業・運動等，講求勝負的工作',
  破軍: '新事業・變革・重整等，從零開始創造的工作',
};

function borrowedFacts(palace: PalaceFact): StarFact[] {
  return palace.borrowedStars.map((name) => ({
    name,
    zh: starZh(name),
    type: 'major' as const,
  }));
}

/** 沒有主星時，借對宮主星來讀（空宮處理） */
function palaceStars(palace: PalaceFact): StarFact[] {
  return palace.major.length > 0 ? palace.major : borrowedFacts(palace);
}

function starNames(palace: PalaceFact): string {
  return palaceStars(palace).map((s) => s.zh.nameZh).join('・');
}

function primaryStar(palace: PalaceFact): StarFact | undefined {
  return palaceStars(palace)[0];
}

function opening(palace: PalaceFact): string {
  if (palace.major.length > 0) {
    return `${palace.nameZh}有${starNames(palace)}。`;
  }
  if (palace.borrowedStars.length > 0) {
    return `${palace.nameZh}是空宮，會較明顯受到對宮${starNames(palace)}的影響。`;
  }
  return `${palace.nameZh}是空宮。`;
}

function partnerImage(palace: PalaceFact): string {
  const first = palace.major[0];
  if (first && PARTNER_IMAGE[first.zh.nameZh]) return PARTNER_IMAGE[first.zh.nameZh];
  if (palace.borrowedStars.length > 0) {
    const borrowed = starZh(palace.borrowedStars[0]).nameZh;
    if (PARTNER_IMAGE[borrowed]) return PARTNER_IMAGE[borrowed];
  }
  return '給人沉穩與誠實感的人';
}

function jobType(palace: PalaceFact): string {
  const first = palace.major[0];
  if (first && JOB_TYPES[first.zh.nameZh]) return JOB_TYPES[first.zh.nameZh];
  if (palace.borrowedStars.length > 0) {
    const borrowed = starZh(palace.borrowedStars[0]).nameZh;
    if (JOB_TYPES[borrowed]) return JOB_TYPES[borrowed];
  }
  return '能守住自己節奏的工作方式';
}

function traits(palace: PalaceFact, field: 'essence' | 'love' | 'work' | 'money'): string {
  return palaceStars(palace).map((s) => s.zh[field]).join('');
}

function shadows(palace: PalaceFact): string {
  return palaceStars(palace).map((s) => s.zh.shadow).join('');
}

function shaText(palace: PalaceFact, label: string): string {
  if (palace.sha.length === 0) return '';
  const names = palace.sha.slice(0, 2).join('・');
  if (label === '夫妻宮') {
    return `${label}有${names}。有時情緒會跑在前面、事情不照預期走，別急，慢慢對話很重要。`;
  }
  return `${label}有${names}。有些時候難以照計畫推進，邊確認邊留點餘地，會比較順。`;
}

function luckyText(palace: PalaceFact): string {
  if (palace.lucky.length === 0) return '';
  return `${palace.lucky.slice(0, 3).join('・')}等吉星也在，較容易得到人際上的助力。`;
}

function hasHuaIn(facts: ZhChartFacts, palaceName: string, hua: string): boolean {
  return facts.liunian.landed.some((l) => l.palaceName === palaceName && l.hua === hua);
}

function huaIn(facts: ZhChartFacts, palaceName: string): string[] {
  return facts.liunian.landed
    .filter((l) => l.palaceName === palaceName)
    .map((l) => `${l.star}的${SIHUA_ZH[l.hua].nameZh}`);
}

function daxianLine(facts: ZhChartFacts): string {
  if (facts.isChildhood || !facts.daxian) {
    return '目前是大限之前的準備期。不必急著下結論，適合先確認自己的輪廓。';
  }
  const dx = facts.daxian;
  const dxStars = dx.major.map((s) => s.zh.nameZh).join('・') || '靜靜的星';
  return `目前是 ${dx.startAge} 歲到 ${dx.endAge} 歲的「${dx.palaceZh}」大限。${dx.decadeTheme}，${dxStars}為這十年添上色彩。`;
}

function yearLine(facts: ZhChartFacts): string {
  const ln = facts.liunian;
  const bits = ln.landed.map((l) => `${l.star}在${l.palaceZh}化為${SIHUA_ZH[l.hua].nameZh}`);
  return `${ln.year} 年是${ln.stem}${ln.branch}年。${bits.join('、')}。`;
}

function topPatterns(facts: ZhChartFacts): string {
  if (facts.patterns.length === 0) return '';
  return facts.patterns
    .slice(0, 2)
    .map((p) => `「${p.nameZh}」${p.desc}`)
    .join('');
}

export function buildLoveReport(facts: ZhChartFacts): PaidReport {
  const ming = facts.ming;
  const fuqi = facts.fuqi;
  const mainStar = primaryStar(ming);
  const partner = partnerImage(fuqi);

  const loveHua = hasHuaIn(facts, '夫妻', '禄') || hasHuaIn(facts, '夫妻', '科');
  const loveJi = hasHuaIn(facts, '夫妻', '忌');
  const fuqiHua = huaIn(facts, '夫妻');

  const summary = [
    `本質是${mainStar ? mainStar.zh.keyword : '沉靜的內在'}。感情上，較容易喜歡上${partner}。`,
    fuqiHua.length > 0
      ? `今年夫妻宮有${fuqiHua.join('、')}，重新檢視感情與伴侶關係的機會較多。`
      : '今年比起感情，先把自己整理好，反而更能培養關係。',
    loveJi
      ? '執著容易變強，別急著改變對方，持續對話會是關鍵。'
      : '不著急、慢慢拉近距離，關係較能長久。',
  ];

  const sections: ReportSection[] = [
    {
      title: '1. 感情的基礎性格',
      body: [
        opening(ming),
        traits(ming, 'essence'),
        mainStar?.zh.shadow ? `陰影面是：${mainStar.zh.shadow}` : '',
        `在感情裡，這份${mainStar?.zh.keyword ?? '特質'}也會直接展現。與其勉強扮演別人，不如重視自己的節奏，關係反而更長久。`,
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      title: '2. 容易吸引你的對象與你的魅力',
      body: [
        opening(fuqi),
        `你較容易被${partner}吸引。`,
        traits(fuqi, 'love'),
        luckyText(fuqi),
        `你自己的魅力是${mainStar?.zh.keyword ?? '沉穩'}。與其到處找對象，不如待在那份魅力自然出現的地方，緣分較容易動起來。`,
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      title: '3. 關係變深之前',
      body: [
        '感情的推進方式，會因命宮與夫妻宮的組合而不同。',
        `${primaryStar(ming) ? `${primaryStar(ming)!.zh.nameZh}的` : ''}你，${traits(ming, 'love')}`,
        '願意花時間認識對方、重複累積小約定，會成為關係的基礎。',
        fuqi.sha.length > 0
          ? '夫妻宮有帶來緊張感的星，一開始就憑氣勢衝太快，之後容易後繼無力。'
          : '較大的阻礙不多，關係較容易自然拉近。',
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      title: '4. 容易卡住的地方',
      body: [
        shadows(fuqi) || shadows(ming),
        shaText(fuqi, '夫妻宮'),
        loveJi
          ? '今年特別容易讀太多對方的反應而不安。比起一再確認，把時間拿去充實自己，反而更安心。'
          : '當雙方節奏不同時，別只顧著配合其中一方，這點很重要。',
        '放下「應該要怎樣」的框架，關係會輕鬆很多。',
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      title: '5. 緣分動起來的時期',
      body: [
        daxianLine(facts),
        yearLine(facts),
        loveHua
          ? '今年夫妻宮有帶來福氣的星，較容易出現相遇或關係前進。邀約不妨輕鬆地答應看看。'
          : '緣分常在日常的延長線上動起來。比起新場所，更值得珍惜平常熟悉的地方。',
        topPatterns(facts),
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      title: '6. 給你的建議',
      body: [
        `你的感情關鍵是「${mainStar?.zh.keyword ?? '自己的節奏'}」。`,
        '與其配合對方把自己縮小，不如把喜歡的事、重視的事用語言說出來，結果往往會是更好的關係。',
        '一個月留一次時間回顧關係，比較能提早發現小小的不對勁。',
        '占卜不是拿來綁住你選擇的東西。只帶走覺得合適的部分就好。',
      ].join(''),
    },
  ];

  return {
    type: 'love',
    title: '感情鑑定書',
    subtitle: `從${starNames(ming) || '命宮'}的命宮，解讀你的感情傾向`,
    opening:
      '這份鑑定書，不是要告訴你「該怎麼做」。而是想陪你把這陣子的感受，一條一條看清楚。有些地方你會點頭，有些地方你會想反駁——都很好。能停下來讀這些，本身就代表你在認真對待自己。',
    summary,
    sections,
    closing:
      '寫到這裡，想跟你說：你不需要馬上變得堅強，也不需要立刻做出決定。把這份報告收好，過一陣子再讀一次，你會看到不一樣的東西。',
    generatedAt: new Date().toISOString(),
  };
}

export function buildWorkReport(facts: ZhChartFacts): PaidReport {
  const ming = facts.ming;
  const guanlu = facts.guanlu;
  const caibo = facts.caibo;
  const mainStar = primaryStar(ming);
  const job = jobType(guanlu);

  const workHua = hasHuaIn(facts, '官禄', '禄') || hasHuaIn(facts, '官禄', '権') || hasHuaIn(facts, '官禄', '科');
  const workJi = hasHuaIn(facts, '官禄', '忌');
  const guanluHua = huaIn(facts, '官禄');

  const summary = [
    `本質是${mainStar ? mainStar.zh.keyword : '務實'}。工作上，${job}較適合你。`,
    guanluHua.length > 0
      ? `今年官祿宮有${guanluHua.join('、')}，工作的流動較容易起變化。`
      : '今年比起大轉換，累積實力較可能結果。',
    workJi
      ? '工作宮有執著的星，別什麼都自己扛，學會交出去，突破點會打開。'
      : '若要進攻，別錯過準備好的時機。',
  ];

  const sections: ReportSection[] = [
    {
      title: '1. 工作的資質',
      body: [
        opening(ming),
        traits(ming, 'essence'),
        mainStar?.zh.shadow
          ? `在工作場合，也容易出現「${mainStar.zh.shadow.replace(/。$/, '')}」的一面，有意識地請人幫忙會比較平衡。`
          : '',
        `這份資質在${job}上特別能發揮。`,
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      title: '2. 適合的工作方式與職種',
      body: [
        opening(guanlu),
        `適合你的是${job}。`,
        luckyText(guanlu),
        '在組織與獨立之間猶豫時，選比較符合自己資質的那一邊，會走得比較長。',
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      title: '3. 金錢的流向',
      body: [
        opening(caibo),
        traits(caibo, 'money'),
        opening(facts.tianzhai),
        '收入增加時，先把固定支出與投資的比例定下來，會比較穩定。',
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      title: '4. 轉機的讀法',
      body: [
        daxianLine(facts),
        yearLine(facts),
        workHua
          ? '今年官祿宮有順風，工作評價與角色較容易起變化。準備好的事，不妨拿出來試。'
          : '大的轉機不用急著製造。今年把基礎打好，會連結到明年的跳躍。',
        topPatterns(facts),
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      title: '5. 想留意的事',
      body: [
        shaText(guanlu, '官祿宮') || '官祿宮沒有太大的緊張星，是比較穩定、能發揮力量的配置。',
        workJi
          ? '執著太強而一個人全扛，容易累。早點商量，也是工作的一部分，這樣想會輕鬆些。'
          : '狀況越好時，越不要省略確認步驟，能避免事故。',
        '邊留意身體狀況、邊守住不過度的節奏，結果反而是最快的路。',
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      title: '6. 行動的提示',
      body: [
        `你的工作關鍵是「${mainStar?.zh.keyword ?? '自己的強項'}」。`,
        '挑一件擅長的事，練到能用語言說明，工作的路會變寬。',
        '轉機來的時候，比起大決定，先從小小的實驗開始，失敗了也回得來。',
        '占卜不是拿來綁住你選擇的東西。只帶走覺得合適的部分就好。',
      ].join(''),
    },
  ];

  return {
    type: 'work',
    title: '事業鑑定書',
    subtitle: `從${starNames(ming) || '命宮'}的命宮，解讀工作與金錢的設計圖`,
    opening:
      '這份鑑定書，是為正在考慮下一步的你準備的。不是要替你決定離開或留下，而是把「你的資質」與「現在的流年」攤開來看，讓你自己判斷。',
    summary,
    sections,
    closing:
      '工作的事，急不來，但也拖不得。把這份報告當成一段對話，而不是判決——最後做決定的人，還是你。',
    generatedAt: new Date().toISOString(),
  };
}

export function buildReport(facts: ZhChartFacts, type: ReportType): PaidReport {
  return type === 'love' ? buildLoveReport(facts) : buildWorkReport(facts);
}
