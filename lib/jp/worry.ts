/**
 * 悩み入口（日本版）。
 *
 * 利用者は具体的な悩みを抱えて来る（恋愛・仕事・人間関係・自分）。
 * 結果ページはまず共感し、悩みに合わせて章の順番を変える。
 */

export type Worry = 'love' | 'work' | 'people' | 'self';

export interface WorryDef {
  key: Worry;
  label: string;
  hint: string;
  empathy: string;
  focus: 'love' | 'work' | 'general';
  sectionOrder: string[];
}

export const WORRY_ORDER: Worry[] = ['love', 'work', 'people', 'self'];

const DEFAULT_ORDER = ['personality', 'love', 'work', 'money', 'decade', 'year', 'patterns'];

export const WORRIES: Record<Worry, WorryDef> = {
  love: {
    key: 'love',
    label: '恋愛',
    hint: '片思い・別れ・結婚・ご縁',
    empathy:
      'ここを開いたのは、その関係があなたにとって大切だからですね。気にかけることは、むだではありません。まずは命盤のなかで、恋愛がどう動いているかを見てみましょう。決めるのはあなたです。',
    focus: 'love',
    sectionOrder: ['love', 'personality', 'year', 'decade', 'work', 'money', 'patterns'],
  },
  work: {
    key: 'work',
    label: '仕事',
    hint: '転職・独立・行き詰まり',
    empathy:
      '仕事の停滞は、努力が足りないからとは限りません。命盤のなかで、あなたの資質がどう活きるか、今の流れがどこへ向かっているかを見てみましょう。',
    focus: 'work',
    sectionOrder: ['work', 'personality', 'money', 'decade', 'year', 'love', 'patterns'],
  },
  people: {
    key: 'people',
    label: '人間関係',
    hint: '家族・友人・職場',
    empathy:
      '人付き合いの疲れは、誰が悪いという話ではないことが多いです。命盤のなかで、あなたの対人傾向と、消耗しやすいところを見てみましょう。',
    focus: 'general',
    sectionOrder: ['personality', 'year', 'decade', 'love', 'work', 'money', 'patterns'],
  },
  self: {
    key: 'self',
    label: '自分',
    hint: '迷い・不安・方向性',
    empathy:
      '迷っているのは、努力が足りないからではなく、自分のペースをまだ見つけていないだけかもしれません。まずは命盤のなかで、あなたが本来どんな人かを見てみましょう。',
    focus: 'general',
    sectionOrder: ['personality', 'year', 'decade', 'love', 'work', 'money', 'patterns'],
  },
};

export function worryOf(raw?: string): WorryDef | undefined {
  if (!raw) return undefined;
  return WORRIES[raw as Worry];
}

export function orderSections<T extends { key: string }>(sections: T[], worry?: WorryDef): T[] {
  if (!worry) return sections;
  const rank = (key: string) => {
    const i = worry.sectionOrder.indexOf(key);
    return i === -1 ? DEFAULT_ORDER.length : i;
  };
  return [...sections].sort((a, b) => rank(a.key) - rank(b.key));
}
