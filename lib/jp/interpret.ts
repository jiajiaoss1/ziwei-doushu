/**
 * 無料診断の文章生成。
 *
 * 事実（facts）だけを材料に、断定を避けた日本語の読み解きを組み立てる。
 * 同じ命盤なら同じ文章になる（キャッシュ可能・テスト可能）。
 */

import type { JpChartFacts, PalaceFact, StarFact } from './facts';
import { SIHUA_JA, starJa, type SiHuaJaKey } from './glossary';

export interface ReadingHighlight {
  title: string;
  body: string;
  /** カードの見出しに添える短いラベル */
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
  /** 結果ページ冒頭に出す3つの要約 */
  highlights: ReadingHighlight[];
  sections: ReadingSection[];
}

function starLabel(star: StarFact): string {
  const kana = star.ja.kana ? `（${star.ja.kana}）` : '';
  return `${star.ja.nameJa}${kana}`;
}

function brightnessPhrase(star: StarFact): string {
  if (!star.brightness) return '';
  return `が${star.brightness.phrase}`;
}

function firstSentence(text: string): string {
  const idx = text.indexOf('。');
  return idx >= 0 ? text.slice(0, idx + 1) : text;
}

function majorNames(palace: PalaceFact): string {
  return palace.major.map((s) => starLabel(s)).join('・');
}

function huaOf(star: StarFact): SiHuaJaKey | undefined {
  if (star.siHua === '禄') return '禄';
  if (star.siHua === '权') return '権';
  if (star.siHua === '科') return '科';
  if (star.siHua === '忌') return '忌';
  return undefined;
}

function huaSentence(star: StarFact): string {
  const hua = huaOf(star);
  if (!hua) return '';
  const info = SIHUA_JA[hua];
  return `${star.ja.nameJa}は${info.nameJa}（${info.keyword}）を持ち、${info.meaning}。`;
}

function palaceIntro(palace: PalaceFact): string {
  if (palace.major.length > 0) {
    const names = palace.major
      .map((s) => `${s.ja.nameJa}${s.brightness ? `（${s.brightness.label}）` : ''}`)
      .join('・');
    return `${palace.nameJa}には${names}が入っています。`;
  }
  const borrowed = palace.borrowedStars.length > 0
    ? palace.borrowedStars.map((n) => starJa(n).nameJa).join('・')
    : '対宮の主星';
  return `${palace.nameJa}は空宮（くうきゅう）で、対宮の${borrowed}の影響を強く受けます。`;
}

function majorTraits(palace: PalaceFact, field: 'essence' | 'love' | 'work' | 'money'): string {
  const list = palace.major.length > 0
    ? palace.major
    : palace.borrowedStars.map((name) => ({ ja: starJa(name) }));
  return list
    .map((s) => s.ja[field])
    .filter(Boolean)
    .join('');
}

function shaNote(palace: PalaceFact): string {
  if (palace.sha.length === 0) return '';
  const names = palace.sha.slice(0, 2).join('・');
  return `${names}も同じ宮にあり、持ち味を発揮するまでに時間がかかることもあります。焦らず、自分に合ったペースを大切にしましょう。`;
}

function luckyNote(palace: PalaceFact): string {
  if (palace.lucky.length === 0) return '';
  const names = palace.lucky.slice(0, 3).join('・');
  return `${names}などの吉星も入っており、人に恵まれやすい配置です。`;
}

function daxianText(facts: JpChartFacts): string {
  if (facts.isChildhood || !facts.daxian) {
    return '現在はまだ大限（だいげん）に入る前の時期にあたります。土台づくりの時期として、焦らず環境を整えるのがよいでしょう。';
  }
  const dx = facts.daxian;
  const stars = dx.major.length > 0 ? dx.major.map((s) => s.ja.nameJa).join('・') : '空宮';
  return `現在は${dx.startAge}歳から${dx.endAge}歳までの「${dx.palaceJa}」の大限です。${dx.decadeTheme}です。この宮には${stars}が入り、十年単位のテーマを彩ります。`;
}

function liunianText(facts: JpChartFacts): string {
  const ln = facts.liunian;
  const parts: string[] = [];
  parts.push(`${ln.year}年は${ln.stem}${ln.branch}年。${ln.palaceJa}が今年のテーマの中心になりそうです。`);

  const order: SiHuaJaKey[] = ['禄', '権', '科', '忌'];
  for (const hua of order) {
    const hit = ln.landed.find((l) => l.hua === hua);
    if (!hit) continue;
    const phrase =
      hua === '禄'
        ? '追い風が入りやすい'
        : hua === '権'
          ? '主導権が生まれやすい'
          : hua === '科'
            ? '評価や学びの形で実りやすい'
            : 'こだわりや停滞が生まれやすい';
    parts.push(`${hit.star}が${hit.palaceJa || '命盤'}で${SIHUA_JA[hua].nameJa}となり、${hit.theme || 'その領域'}の領域には${phrase}でしょう。`);
  }
  return parts.join('');
}

function patternsText(facts: JpChartFacts): string {
  if (facts.patterns.length === 0) return '';
  const top = facts.patterns.slice(0, 3);
  return top.map((p) => `「${p.nameJa}」${p.desc}`).join('');
}

export function buildFreeReading(facts: JpChartFacts): FreeReading {
  const ming = facts.ming;
  const mingStars = ming.major;
  const effectiveMing = ming.major.length > 0
    ? ming.major.map((s) => s.ja)
    : ming.borrowedStars.map((n) => starJa(n));
  const mainStar = effectiveMing[0];
  const headline = mainStar
    ? `${mainStar.nameJa}の命宮を持つ、${mainStar.keyword}の人`
    : '静かな芯を持つ人';

  const lead = `生まれ持った星の配置から、あなたの本質・恋愛の傾向・今年のテーマを読み解きました。`;

  const highlights: ReadingHighlight[] = [
    {
      label: '本質',
      title: 'あなたの資質',
      body: mainStar
        ? ming.major.length > 0
          ? `${mainStar.nameJa}（${mainStar.kana}）の命宮。${firstSentence(mainStar.essence)}`
          : `命宮は空宮。対宮の${mainStar.nameJa}（${mainStar.kana}）の影響を受けます。${firstSentence(mainStar.essence)}`
        : firstSentence('静かな芯を持ち、周囲に合わせすぎない人です。'),
    },
    {
      label: '恋愛',
      title: '恋愛の傾向',
      body: facts.fuqi.major.length > 0
        ? `${facts.fuqi.major.map((s) => s.ja.nameJa).join('・')}の夫妻宮。${firstSentence(facts.fuqi.major[0].ja.love)}`
        : facts.fuqi.borrowedStars.length > 0
          ? `夫妻宮は空宮。対宮の${facts.fuqi.borrowedStars.map((n) => starJa(n).nameJa).join('・')}の影響を受けやすいでしょう。`
          : '夫妻宮は空宮。対宮の影響を受け、相手を通して自分を知る恋になりやすいでしょう。',
    },
    {
      label: '今年',
      title: `${facts.year}年のテーマ`,
      body: `${facts.year}年は${facts.liunian.stem}${facts.liunian.branch}年。${facts.liunian.palaceJa}が中心になり、${facts.liunian.landed
        .slice(0, 2)
        .map((l) => `${l.star}の${SIHUA_JA[l.hua].nameJa}`)
        .join('、')}が流れをつくります。`,
    },
  ];

  const sections: ReadingSection[] = [
    {
      key: 'personality',
      title: '性格と資質',
      body: [
        palaceIntro(ming),
        majorTraits(ming, 'essence'),
        mingStars.map(huaSentence).join(''),
        shaNote(ming),
        mainStar?.shadow ? `影の面としては、${mainStar.shadow}` : '',
        facts.sanfang.length > 0
          ? `三方四正（さんぽうししょう）には${facts.sanfang.map((s) => `${s.palaceName}の${s.stars.join('・') || '空宮'}`).join('、')}が並び、人生の土台を支えています。`
          : '',
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      key: 'love',
      title: '恋愛・パートナーシップ',
      body: [
        palaceIntro(facts.fuqi),
        majorTraits(facts.fuqi, 'love'),
        facts.fuqi.major.map((s) => s.ja.shadow).join(''),
        luckyNote(facts.fuqi),
        shaNote(facts.fuqi),
        facts.liunian.landed.some((l) => l.palaceName === '夫妻')
          ? '今年は夫妻宮にも四化の影響が及ぶため、恋愛やパートナーシップについて考える機会が増えそうです。'
          : '',
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      key: 'work',
      title: '仕事・天職',
      body: [
        palaceIntro(facts.guanlu),
        majorTraits(facts.guanlu, 'work'),
        facts.guanlu.sha.length > 0
          ? '官禄宮には緊張感をもたらす星も入っています。頑張りすぎず、要所で周囲に相談したり、仕事を任せたりすることが長続きのコツです。'
          : '',
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      key: 'money',
      title: 'お金との付き合い方',
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
      title: 'いまの十年（大限）',
      body: daxianText(facts),
    },
    {
      key: 'year',
      title: `${facts.year}年の運気`,
      body: liunianText(facts),
    },
  ];

  if (facts.patterns.length > 0) {
    sections.push({
      key: 'patterns',
      title: 'あなたの命盤にある格局',
      body: patternsText(facts),
    });
  }

  return { headline, lead, highlights, sections };
}
