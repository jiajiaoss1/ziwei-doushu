/**
 * 相性鑑定（二人の命盤を重ねて読む）。
 *
 * 命宮・夫妻宮・地支の関係・五行局・大限/流年の四化だけを使い、
 * 断定せず「関係の質」を言葉にする。点数化はしない（景表法・消費者契約法の回避）。
 */

import type { JpChartFacts, PalaceFact, StarFact } from './facts';
import { starJa } from './glossary';

export type BranchRelation = '六合' | '三合' | '冲' | 'その他';
export type ElementRelation = '相生' | '相剋' | '同じ' | '不明';

export interface CompatSection {
  title: string;
  body: string;
}

export interface CompatResult {
  title: string;
  /** 関係の一言ラベル（点数ではない） */
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
  return 'その他';
}

const ELEMENT_ORDER = ['木', '火', '土', '金', '水'];

export function elementOf(wuxingJuName: string): string | undefined {
  const first = wuxingJuName.trim().charAt(0);
  return ELEMENT_ORDER.includes(first) ? first : undefined;
}

export function elementRelation(a?: string, b?: string): ElementRelation {
  if (!a || !b) return '不明';
  if (a === b) return '同じ';
  const ia = ELEMENT_ORDER.indexOf(a);
  const ib = ELEMENT_ORDER.indexOf(b);
  if (ia < 0 || ib < 0) return '不明';
  // 相生：木→火→土→金→水→木
  if ((ia + 1) % 5 === ib || (ib + 1) % 5 === ia) return '相生';
  return '相剋';
}

function firstSentence(text: string): string {
  const idx = text.indexOf('。');
  return idx >= 0 ? text.slice(0, idx + 1) : text;
}

function starName(star: StarFact): string {
  return `${star.ja.nameJa}${star.brightness ? `（${star.brightness.label}）` : ''}`;
}

function effectiveStars(palace: PalaceFact): { ja: ReturnType<typeof starJa>; brightness?: { label: string } }[] {
  return palace.major.length > 0
    ? palace.major.map((s) => ({ ja: s.ja, brightness: s.brightness }))
    : palace.borrowedStars.map((n) => ({ ja: starJa(n) }));
}

function palaceNames(palace: PalaceFact): string {
  const stars = effectiveStars(palace);
  if (stars.length === 0) return '空宮';
  return stars.map((s) => `${s.ja.nameJa}${s.brightness ? `（${s.brightness.label}）` : ''}`).join('・');
}

function palaceOpening(label: string, palace: PalaceFact): string {
  const stars = effectiveStars(palace);
  if (palace.major.length > 0) {
    return `${label}には${palaceNames(palace)}が入っています。${firstSentence(stars[0]?.ja.essence ?? '')}`;
  }
  if (stars.length > 0) {
    return `${label}は空宮で、対宮の${palaceNames(palace)}の影響を受けます。${firstSentence(stars[0]?.ja.essence ?? '')}`;
  }
  return `${label}は空宮です。`;
}

function overlap(a: StarFact[], b: StarFact[]): string[] {
  const names = new Set(b.map((s) => s.name));
  return a.filter((s) => names.has(s.name)).map((s) => s.ja.nameJa);
}

function relationText(rel: BranchRelation): string {
  switch (rel) {
    case '六合':
      return '地支が「六合」で、自然と惹かれ合いやすい組み合わせです。説明しなくても通じる感覚があり、距離が縮まるのは早いでしょう。';
    case '三合':
      return '地支が「三合」で、価値観やテンポが噛み合いやすい組み合わせです。一緒に何かを進めるほど、関係が深まりやすいでしょう。';
    case '冲':
      return '地支が「冲」で、惹かれ合う反面、ぶつかりやすい組み合わせです。違いを面白がれるかどうかが、長続きの分かれ目になります。';
    default:
      return '地支の組み合わせに大きな衝突は見られず、比較的穏やかに関係を育てていけそうです。焦らず、日常の会話を重ねるとよいでしょう。';
  }
}

function elementText(rel: ElementRelation): string {
  switch (rel) {
    case '相生':
      return '五行の関係は「相生」とされ、互いの長所を活かしやすい組み合わせです。相手の状況に合わせて助け合うことを意識するとよいでしょう。';
    case '相剋':
      return '五行は「相剋」で、主導権の取り合いが起きやすい関係です。どちらが上かではなく、役割を分けると安定します。';
    case '同じ':
      return '五行は同じで、感覚が近い分だけ遠慮がなくなるとぶつかりやすい面があります。適度な距離感が助けになります。';
    default:
      return '五行の関係は緩やかで、無理に合わせなくても自然体でいられます。';
  }
}

export function buildCompat(a: JpChartFacts, b: JpChartFacts): CompatResult {
  const rel = branchRelation(a.ming.branch, b.ming.branch);
  const el = elementRelation(elementOf(a.wuxingJuName), elementOf(b.wuxingJuName));

  const aLovesB = overlap(a.fuqi.major, b.ming.major);
  const bLovesA = overlap(b.fuqi.major, a.ming.major);
  const loveMatch =
    aLovesB.length > 0 || bLovesA.length > 0
      ? `あなたが惹かれやすいタイプと、お相手の本質に「${[...new Set([...aLovesB, ...bLovesA])].join('・')}」が重なっています。`
      : '価値観や考え方に違いがあるからこそ、お相手を新鮮に感じやすいでしょう。';

  const label =
    rel === '六合' || rel === '三合'
      ? '自然に噛み合いやすい関係'
      : rel === '冲'
        ? '惹かれ合うほど、違いも出やすい関係'
        : el === '相生'
          ? 'ゆるやかに支え合える関係'
          : '違いを楽しむ関係';

  const aLoveHua = a.liunian.landed.filter((l) => l.palaceName === '夫妻');
  const bLoveHua = b.liunian.landed.filter((l) => l.palaceName === '夫妻');

  const aKey = effectiveStars(a.ming)[0]?.ja.keyword || '静かな芯';
  const bKey = effectiveStars(b.ming)[0]?.ja.keyword || '穏やかな芯';

  const summary = [
    `あなたは${aKey}、お相手は${bKey}を持つ人。`,
    relationText(rel).split('。')[0] + '。',
    'お互いの違いを否定せず、それぞれの得意なことを活かして支え合うことが、関係を深める鍵になります。',
  ];

  const sections: CompatSection[] = [
    {
      title: '1. お二人の基本性質',
      body: [
        palaceOpening('あなたの命宮', a.ming),
        palaceOpening('お相手の命宮', b.ming),
        '命宮の星の組み合わせによって、お互いの感じ方や関係の築き方にも違いが生まれます。まずは、お互いのペースの違いを知ることから始めましょう。',
        '命宮の星は、相手にとっての「安心の型」を映します。相手がどこでホッとするのかを観察すると、関係の手がかりになります。',
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      title: '2. 惹かれ合うポイント',
      body: [
        relationText(rel),
        loveMatch,
        el === '相生'
          ? '困ったときに自然と助け合えるので、遠慮しすぎないことが関係を育てます。'
          : '惹かれる理由を言葉にすると、相手により伝わりやすくなります。',
        '「なぜこの人なのか」を3つ言葉にしてみると、関係の軸がはっきりします。',
      ].join(''),
    },
    {
      title: '3. すれ違いやすいポイント',
      body: [
        `あなたの影の面は「${(effectiveStars(a.ming)[0]?.ja.shadow || 'こだわり').replace(/。$/, '')}」。`,
        `お相手の影の面は「${(effectiveStars(b.ming)[0]?.ja.shadow || 'ためらい').replace(/。$/, '')}」。`,
        elementText(el),
        a.fuqi.sha.length > 0 || b.fuqi.sha.length > 0
          ? '夫妻宮に緊張の星があり、すれ違いが起きたときに「言わなくても分かる」を前提にすると、こじれやすくなります。'
          : '大きな緊張の星は少ないため、溜め込まずに言葉にすれば、大きな衝突にはなりにくいでしょう。',
      ].join(''),
    },
    {
      title: '4. 関係の育て方',
      body: [
        `お二人の関係は「${label}」です。`,
        rel === '冲'
          ? 'ぶつかったときは、どちらが正しいかを決めず、それぞれの言い分を一度並べてみてください。違いが分かると、驚くほど楽になります。'
          : '定期的に「今どう感じているか」を話す時間をつくると、すれ違いが大きくなる前に整えられます。',
        '一緒に何かを作る・学ぶといった、共通のテーマがあると関係が長続きしやすいでしょう。',
        '月に一度、関係を振り返る時間をつくると、小さな違和感を早めに拾えます。',
      ].join(''),
    },
    {
      title: '5. 縁の時期',
      body: [
        a.daxian
          ? `あなたは現在「${a.daxian.palaceJa}」の大限（${a.daxian.startAge}〜${a.daxian.endAge}歳）。${a.daxian.decadeTheme}です。`
          : 'あなたはまだ大限に入る前の時期です。',
        b.daxian
          ? `お相手は「${b.daxian.palaceJa}」の大限（${b.daxian.startAge}〜${b.daxian.endAge}歳）。${b.daxian.decadeTheme}です。`
          : 'お相手はまだ大限に入る前の時期です。',
        aLoveHua.length > 0 || bLoveHua.length > 0
          ? `今年は夫妻宮に${[...aLoveHua, ...bLoveHua].map((l) => `${l.star}の${l.hua === '権' ? '化権' : `化${l.hua}`}`).join('、')}が関わるため、恋愛やパートナーシップについて考える機会が増えそうです。`
          : '今年は恋愛面の大きな動きは少なく、関係を育てる年になりそうです。',
        '縁は、日常の延長線上で動きます。特別な場所より、いつもの場所での会話を大切にしてください。',
      ].join(''),
    },
    {
      title: '6. お二人へのアドバイス',
      body: [
        '相性は「合う・合わない」を決めるものではなく、関係の地図です。',
        '違いが出たときは、相手を変えようとするより、役割を分けることを考えてみてください。',
        '占いは、お二人の選択を縛るものではありません。しっくりくる部分だけを、関係づくりのヒントにしてください。',
      ].join(''),
    },
  ];

  return {
    title: 'お二人の相性鑑定',
    label,
    summary,
    sections,
    branchRelation: rel,
    elementRelation: el,
  };
}
