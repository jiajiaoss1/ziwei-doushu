/**
 * 相性鑑定（把兩個人的命盤疊起來讀）・繁體中文（港台版）。
 *
 * 只用命宮・夫妻宮・地支關係・五行局・大限/流年四化，
 * 不斷言，只描述「關係的質地」。不打分數（避免景表法・消費者契約法問題）。
 */

import type { PalaceFact, StarFact, ZhChartFacts } from './facts';
import { starZh } from './glossary';

export type BranchRelation = '六合' | '三合' | '冲' | '其他';
export type ElementRelation = '相生' | '相剋' | '相同' | '不明';

export interface CompatSection {
  title: string;
  body: string;
}

export interface CompatResult {
  title: string;
  label: string;
  summary: string[];
  sections: CompatSection[];
  branchRelation: BranchRelation;
  elementRelation: ElementRelation;
}

const ROKUGO: [number, number][] = [
  [0, 1],
  [2, 11],
  [3, 10],
  [4, 9],
  [5, 8],
  [6, 7],
];

const SANGO: number[][] = [
  [0, 4, 8],
  [1, 5, 9],
  [2, 6, 10],
  [3, 7, 11],
];

export function branchRelation(a: number, b: number): BranchRelation {
  if (ROKUGO.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) return '六合';
  if (SANGO.some((g) => g.includes(a) && g.includes(b) && a !== b)) return '三合';
  if ((a - b + 12) % 12 === 6) return '冲';
  return '其他';
}

const ELEMENT_ORDER = ['木', '火', '土', '金', '水'];

export function elementOf(wuxingJuName: string): string | undefined {
  const first = wuxingJuName.trim().charAt(0);
  return ELEMENT_ORDER.includes(first) ? first : undefined;
}

export function elementRelation(a?: string, b?: string): ElementRelation {
  if (!a || !b) return '不明';
  if (a === b) return '相同';
  const ia = ELEMENT_ORDER.indexOf(a);
  const ib = ELEMENT_ORDER.indexOf(b);
  if (ia < 0 || ib < 0) return '不明';
  if ((ia + 1) % 5 === ib || (ib + 1) % 5 === ia) return '相生';
  return '相剋';
}

function firstSentence(text: string): string {
  const idx = text.indexOf('。');
  return idx >= 0 ? text.slice(0, idx + 1) : text;
}

function starName(star: StarFact): string {
  return `${star.zh.nameZh}${star.brightness ? `（${star.brightness.label}）` : ''}`;
}

function effectiveStars(palace: PalaceFact): { zh: ReturnType<typeof starZh>; brightness?: { label: string } }[] {
  return palace.major.length > 0
    ? palace.major.map((s) => ({ zh: s.zh, brightness: s.brightness }))
    : palace.borrowedStars.map((n) => ({ zh: starZh(n) }));
}

function palaceNames(palace: PalaceFact): string {
  const stars = effectiveStars(palace);
  if (stars.length === 0) return '空宮';
  return stars.map((s) => `${s.zh.nameZh}${s.brightness ? `（${s.brightness.label}）` : ''}`).join('・');
}

function palaceOpening(label: string, palace: PalaceFact): string {
  const stars = effectiveStars(palace);
  if (palace.major.length > 0) {
    return `${label}有${palaceNames(palace)}。${firstSentence(stars[0]?.zh.essence ?? '')}`;
  }
  if (stars.length > 0) {
    return `${label}是空宮，會受到對宮${palaceNames(palace)}的影響。${firstSentence(stars[0]?.zh.essence ?? '')}`;
  }
  return `${label}是空宮。`;
}

function overlap(a: StarFact[], b: StarFact[]): string[] {
  const names = new Set(b.map((s) => s.name));
  return a.filter((s) => names.has(s.name)).map((s) => s.zh.nameZh);
}

function relationText(rel: BranchRelation): string {
  switch (rel) {
    case '六合':
      return '地支是「六合」，屬於自然容易互相吸引的組合。就算不特別說明也能懂彼此，距離拉近得比較快。';
    case '三合':
      return '地支是「三合」，價值觀與步調較容易對上。一起推進某件事，關係較容易加深。';
    case '冲':
      return '地支是「冲」，會互相吸引，但也容易起衝突。能不能把差異當有趣，會決定關係能不能長久。';
    default:
      return '地支的組合沒有明顯衝突，關係較能平穩地培養。不用急，日常對話多累積就好。';
  }
}

function elementText(rel: ElementRelation): string {
  switch (rel) {
    case '相生':
      return '五行關係是「相生」，屬於容易彼此加分、互相扶持的組合。配合對方的狀況互相幫助，會更好。';
    case '相剋':
      return '五行是「相剋」，關係裡較容易出現主導權的拉扯。重點不是誰在上面，而是把角色分清楚，就會穩。';
    case '相同':
      return '五行相同，感覺接近，也因為這樣少了顧慮，反而容易碰撞。適度的距離感會有幫助。';
    default:
      return '五行關係較緩和，不用勉強配合，也能自然相處。';
  }
}

export function buildCompat(a: ZhChartFacts, b: ZhChartFacts): CompatResult {
  const rel = branchRelation(a.ming.branch, b.ming.branch);
  const el = elementRelation(elementOf(a.wuxingJuName), elementOf(b.wuxingJuName));

  const aLovesB = overlap(a.fuqi.major, b.ming.major);
  const bLovesA = overlap(b.fuqi.major, a.ming.major);
  const loveMatch =
    aLovesB.length > 0 || bLovesA.length > 0
      ? `你容易喜歡的類型，和對方的本質有「${[...new Set([...aLovesB, ...bLovesA])].join('・')}」重疊。`
      : '正因為價值觀與想法不同，對方較容易讓你感到新鮮。';

  const label =
    rel === '六合' || rel === '三合'
      ? '自然就能對上的關係'
      : rel === '冲'
        ? '越吸引，越容易看見差異的關係'
        : el === '相生'
          ? '能慢慢互相扶持的關係'
          : '能享受差異的關係';

  const aLoveHua = a.liunian.landed.filter((l) => l.palaceName === '夫妻');
  const bLoveHua = b.liunian.landed.filter((l) => l.palaceName === '夫妻');

  const aKey = effectiveStars(a.ming)[0]?.zh.keyword || '沉靜的內在';
  const bKey = effectiveStars(b.ming)[0]?.zh.keyword || '溫和的內在';

  const summary = [
    `你是${aKey}，對方是${bKey}的人。`,
    `${relationText(rel).split('。')[0]}。`,
    '不否定彼此的差異，各自發揮擅長的事、互相扶持，會是讓關係更深的關鍵。',
  ];

  const sections: CompatSection[] = [
    {
      title: '1. 兩人的基本特質',
      body: [
        palaceOpening('你的命宮', a.ming),
        palaceOpening('對方的命宮', b.ming),
        '命宮星曜的組合，會讓彼此的感受方式與關係建立方式出現差異。先從理解彼此節奏不同開始。',
        '命宮的星，映照出對方心中「安心的樣子」。觀察對方在哪裡放鬆，會是關係的線索。',
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      title: '2. 互相吸引的地方',
      body: [
        relationText(rel),
        loveMatch,
        el === '相生'
          ? '遇到困難時較容易自然互相幫助，別太客氣，關係會更成長。'
          : '把「為什麼被吸引」說成語言，會比較容易傳達給對方。',
        '把「為什麼是這個人」寫成三個理由，關係的主軸就會清楚。',
      ].join(''),
    },
    {
      title: '3. 容易錯身的地方',
      body: [
        `你的陰影面是「${(effectiveStars(a.ming)[0]?.zh.shadow || '執著').replace(/。$/, '')}」。`,
        `對方的陰影面是「${(effectiveStars(b.ming)[0]?.zh.shadow || '猶豫').replace(/。$/, '')}」。`,
        elementText(el),
        a.fuqi.sha.length > 0 || b.fuqi.sha.length > 0
          ? '夫妻宮有帶來緊張感的星；發生摩擦時，如果預設「不說也該懂」，比較容易僵住。'
          : '大的緊張星不多，只要不悶著、把話說出來，就不太會變成大衝突。',
      ].join(''),
    },
    {
      title: '4. 關係的培養方式',
      body: [
        `你們的關係是「${label}」。`,
        rel === '冲'
          ? '起衝突時，先別急著分對錯，把雙方說法並排看看。看見差異後，反而會輕鬆很多。'
          : '定期留時間聊「現在感覺如何」，比較能在差異變大前整理好。',
        '一起做點什麼、一起學點什麼，有共同主題的關係較容易長久。',
        '一個月留一次回顧關係的時間，比較能提早發現小小的不對勁。',
      ].join(''),
    },
    {
      title: '5. 緣分的時期',
      body: [
        a.daxian
          ? `你目前是「${a.daxian.palaceZh}」的大限（${a.daxian.startAge}〜${a.daxian.endAge} 歲）。${a.daxian.decadeTheme}。`
          : '你還在進入大限之前的階段。',
        b.daxian
          ? `對方是「${b.daxian.palaceZh}」的大限（${b.daxian.startAge}〜${b.daxian.endAge} 歲）。${b.daxian.decadeTheme}。`
          : '對方還在進入大限之前的階段。',
        aLoveHua.length > 0 || bLoveHua.length > 0
          ? `今年夫妻宮有${[...aLoveHua, ...bLoveHua].map((l) => `${l.star}的${l.hua === '権' ? '化權' : `化${l.hua}`}`).join('、')}參與，思考感情與伴侶關係的機會較多。`
          : '今年感情面的大變動較少，是培養關係的一年。',
        '緣分常在日常的延長線上動起來。比起特別的場所，更值得珍惜平常的對話。',
      ].join(''),
    },
    {
      title: '6. 給兩人的建議',
      body: [
        '相性不是拿來決定「合不合」，而是關係的地圖。',
        '出現差異時，與其想改變對方，不如先想想怎麼分工。',
        '占卜不是拿來綁住你們選擇的東西。只把覺得合適的部分，當成經營關係的提示。',
      ].join(''),
    },
  ];

  return {
    title: '兩人的相性鑑定',
    label,
    summary,
    sections,
    branchRelation: rel,
    elementRelation: el,
  };
}
