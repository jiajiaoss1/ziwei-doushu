/**
 * 免費診斷的文字生成（繁體中文・港台版）。
 *
 * 只用 facts 作材料，避免斷言，組合出可重現的解讀。
 */

import type { PalaceFact, StarFact, ZhChartFacts } from './facts';
import { SIHUA_ZH, starZh, type SiHuaZhKey } from './glossary';

export interface ReadingHighlight {
  title: string;
  body: string;
  label: string;
}

export interface ReadingSection {
  key: string;
  title: string;
  body: string;
}

export interface FreeReading {
  headline: string;
  lead: string;
  highlights: ReadingHighlight[];
  sections: ReadingSection[];
}

function starLabel(star: StarFact): string {
  return star.zh.nameZh;
}

function brightnessPhrase(star: StarFact): string {
  if (!star.brightness) return '';
  return `，${star.brightness.phrase}`;
}

function firstSentence(text: string): string {
  const idx = text.indexOf('。');
  return idx >= 0 ? text.slice(0, idx + 1) : text;
}

function majorNames(palace: PalaceFact): string {
  return palace.major.map((s) => starLabel(s)).join('・');
}

function huaOf(star: StarFact): SiHuaZhKey | undefined {
  if (star.siHua === '禄') return '禄';
  if (star.siHua === '权') return '権';
  if (star.siHua === '科') return '科';
  if (star.siHua === '忌') return '忌';
  return undefined;
}

function huaSentence(star: StarFact): string {
  const hua = huaOf(star);
  if (!hua) return '';
  const info = SIHUA_ZH[hua];
  return `${star.zh.nameZh}帶有${info.nameZh}（${info.keyword}），${info.meaning}。`;
}

function palaceIntro(palace: PalaceFact): string {
  if (palace.major.length > 0) {
    const names = palace.major
      .map((s) => `${s.zh.nameZh}${s.brightness ? `（${s.brightness.label}）` : ''}`)
      .join('・');
    return `${palace.nameZh}有${names}。`;
  }
  const borrowed = palace.borrowedStars.length > 0
    ? palace.borrowedStars.map((n) => starZh(n).nameZh).join('・')
    : '對宮的主星';
  return `${palace.nameZh}是空宮，會較明顯受到對宮${borrowed}的影響。`;
}

function majorTraits(palace: PalaceFact, field: 'essence' | 'love' | 'work' | 'money'): string {
  const list = palace.major.length > 0
    ? palace.major
    : palace.borrowedStars.map((name) => ({ zh: starZh(name) }));
  return list
    .map((s) => s.zh[field])
    .filter(Boolean)
    .join('');
}

function shaNote(palace: PalaceFact): string {
  if (palace.sha.length === 0) return '';
  const names = palace.sha.slice(0, 2).join('・');
  return `${names}也在同一個宮，發揮所長可能需要一點時間。不用急，找到自己的節奏最重要。`;
}

function luckyNote(palace: PalaceFact): string {
  if (palace.lucky.length === 0) return '';
  const names = palace.lucky.slice(0, 3).join('・');
  return `${names}等吉星也在，較容易得到人際上的助力。`;
}

function daxianText(facts: ZhChartFacts): string {
  if (facts.isChildhood || !facts.daxian) {
    return '目前還在進入大限之前的階段。適合先把基礎打好，不必急著做重大決定。';
  }
  const dx = facts.daxian;
  const stars = dx.major.length > 0 ? dx.major.map((s) => s.zh.nameZh).join('・') : '空宮';
  return `目前是 ${dx.startAge} 歲到 ${dx.endAge} 歲的「${dx.palaceZh}」大限。${dx.decadeTheme}。這個宮位有${stars}，為這十年的主題添上色彩。`;
}

function liunianText(facts: ZhChartFacts): string {
  const ln = facts.liunian;
  const parts: string[] = [];
  parts.push(`${ln.year} 年是${ln.stem}${ln.branch}年，${ln.palaceZh}較可能是今年的主題中心。`);

  const order: SiHuaZhKey[] = ['禄', '権', '科', '忌'];
  for (const hua of order) {
    const hit = ln.landed.find((l) => l.hua === hua);
    if (!hit) continue;
    const phrase =
      hua === '禄'
        ? '較容易吹起順風'
        : hua === '権'
          ? '較容易產生主導權'
          : hua === '科'
            ? '較容易以評價或學習的形式結果'
            : '較容易出現執著或停滯';
    parts.push(`${hit.star}在${hit.palaceZh || '命盤'}化為${SIHUA_ZH[hua].nameZh}，讓${hit.theme || '這個領域'}較容易${phrase}。`);
  }
  return parts.join('');
}

function patternsText(facts: ZhChartFacts): string {
  if (facts.patterns.length === 0) return '';
  const top = facts.patterns.slice(0, 3);
  return top.map((p) => `「${p.nameZh}」${p.desc}`).join('');
}

export function buildFreeReading(facts: ZhChartFacts): FreeReading {
  const ming = facts.ming;
  const effectiveMing = ming.major.length > 0
    ? ming.major.map((s) => s.zh)
    : ming.borrowedStars.map((n) => starZh(n));
  const mainStar = effectiveMing[0];
  const headline = mainStar
    ? `${mainStar.nameZh}命宮，${mainStar.keyword}的人`
    : '內在沉靜的人';

  const lead = '從出生時的星曜配置，為你解讀本質、感情傾向與今年的主題。';

  const highlights: ReadingHighlight[] = [
    {
      label: '本質',
      title: '你的資質',
      body: mainStar
        ? ming.major.length > 0
          ? `${mainStar.nameZh}的命宮。${firstSentence(mainStar.essence)}`
          : `命宮是空宮，會受到對宮${mainStar.nameZh}的影響。${firstSentence(mainStar.essence)}`
        : firstSentence('內在沉靜，不會過度迎合周圍的人。'),
    },
    {
      label: '感情',
      title: '感情傾向',
      body: facts.fuqi.major.length > 0
        ? `${facts.fuqi.major.map((s) => s.zh.nameZh).join('・')}的夫妻宮。${firstSentence(facts.fuqi.major[0].zh.love)}`
        : facts.fuqi.borrowedStars.length > 0
          ? `夫妻宮是空宮，較容易受到對宮${facts.fuqi.borrowedStars.map((n) => starZh(n).nameZh).join('・')}的影響。`
          : '夫妻宮是空宮，透過對方認識自己的感情較容易出現。',
    },
    {
      label: '今年',
      title: `${facts.year} 年的主題`,
      body: `${facts.year} 年是${facts.liunian.stem}${facts.liunian.branch}年。${facts.liunian.palaceZh}是中心，${facts.liunian.landed
        .slice(0, 2)
        .map((l) => `${l.star}的${SIHUA_ZH[l.hua].nameZh}`)
        .join('、')}形成流勢。`,
    },
  ];

  const sections: ReadingSection[] = [
    {
      key: 'personality',
      title: '性格與資質',
      body: [
        palaceIntro(ming),
        majorTraits(ming, 'essence'),
        ming.major.map(huaSentence).join(''),
        shaNote(ming),
        mainStar?.shadow ? `陰影面是：${mainStar.shadow}` : '',
        facts.sanfang.length > 0
          ? `三方四正有${facts.sanfang.map((s) => `${s.palaceName}的${s.stars.join('・') || '空宮'}`).join('、')}，支撐人生基礎。`
          : '',
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      key: 'love',
      title: '感情與伴侶關係',
      body: [
        palaceIntro(facts.fuqi),
        majorTraits(facts.fuqi, 'love'),
        facts.fuqi.major.map((s) => s.zh.shadow).join(''),
        luckyNote(facts.fuqi),
        shaNote(facts.fuqi),
        facts.liunian.landed.some((l) => l.palaceName === '夫妻')
          ? '今年夫妻宮也受到四化影響，思考感情與伴侶關係的機會較多。'
          : '',
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      key: 'work',
      title: '工作與志向',
      body: [
        palaceIntro(facts.guanlu),
        majorTraits(facts.guanlu, 'work'),
        facts.guanlu.sha.length > 0
          ? '官祿宮也有帶來緊張感的星曜。不必硬撐，關鍵時刻找人商量、把事情交出去，會走得更長久。'
          : '',
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      key: 'money',
      title: '金錢觀',
      body: [
        palaceIntro(facts.caibo),
        majorTraits(facts.caibo, 'money'),
        palaceIntro(facts.tianzhai),
        majorTraits(facts.tianzhai, 'money'),
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      key: 'decade',
      title: '目前的十年（大限）',
      body: daxianText(facts),
    },
    {
      key: 'year',
      title: `${facts.year} 年運勢`,
      body: liunianText(facts),
    },
  ];

  if (facts.patterns.length > 0) {
    sections.push({
      key: 'patterns',
      title: '命盤中的格局',
      body: patternsText(facts),
    });
  }

  return { headline, lead, highlights, sections };
}
