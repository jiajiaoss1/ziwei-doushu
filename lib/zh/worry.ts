/**
 * 煩惱入口（港台版）。
 *
 * 使用者帶著具體煩惱來（感情・工作・人際・自我），
 * 結果頁先共情、再按煩惱調整章節順序，讓解讀對準情境而非「通用的人格描述」。
 */

export type Worry = 'love' | 'work' | 'people' | 'self';

export interface WorryDef {
  key: Worry;
  /** 選項標籤 */
  label: string;
  /** 選項下方的小字 */
  hint: string;
  /** 結果頁開場的共情句 */
  empathy: string;
  /** AI 解讀焦點 */
  focus: 'love' | 'work' | 'general';
  /** 結果頁章節優先順序 */
  sectionOrder: string[];
}

export const WORRY_ORDER: Worry[] = ['love', 'work', 'people', 'self'];

const DEFAULT_ORDER = ['personality', 'love', 'work', 'money', 'decade', 'year', 'patterns'];

export const WORRIES: Record<Worry, WorryDef> = {
  love: {
    key: 'love',
    label: '感情',
    hint: '暗戀・分手・婚姻・緣分',
    empathy:
      '你會點進來，是因為這段關係對你來說很重要。這份在意不是多餘的。先看看命盤裡感情是怎麼運作的——不是要替你決定，而是讓你看見自己的模式。',
    focus: 'love',
    sectionOrder: ['love', 'personality', 'year', 'decade', 'work', 'money', 'patterns'],
  },
  work: {
    key: 'work',
    label: '工作',
    hint: '轉職・創業・瓶頸・被裁',
    empathy:
      '工作上的停滯，常常不是因為你不夠努力。先看看命盤裡，你的資質適合怎麼發揮、現在的流年正推著你往哪裡走。',
    focus: 'work',
    sectionOrder: ['work', 'personality', 'money', 'decade', 'year', 'love', 'patterns'],
  },
  people: {
    key: 'people',
    label: '人際',
    hint: '家人・朋友・同事',
    empathy:
      '和人相處覺得累，不一定是誰的錯。先看看命盤裡，你在人際中的傾向，以及容易耗損的地方——理解之後，比較能保護自己。',
    focus: 'general',
    sectionOrder: ['personality', 'year', 'decade', 'love', 'work', 'money', 'patterns'],
  },
  self: {
    key: 'self',
    label: '自己',
    hint: '迷惘・焦慮・方向',
    empathy:
      '覺得迷惘，不是因為你不夠好，而是還沒找到自己的節奏。先看看命盤裡，你本來是什麼樣的人——這往往比「該做什麼」更早需要被看見。',
    focus: 'general',
    sectionOrder: ['personality', 'year', 'decade', 'love', 'work', 'money', 'patterns'],
  },
};

/** URL 的 w 參數 → 煩惱定義（無效或未指定時回 undefined，不加共情） */
export function worryOf(raw?: string): WorryDef | undefined {
  if (!raw) return undefined;
  return WORRIES[raw as Worry];
}

/** 依煩惱重排章節（null 選項保持原順序） */
export function orderSections<T extends { key: string }>(sections: T[], worry?: WorryDef): T[] {
  if (!worry) return sections;
  const rank = (key: string) => {
    const i = worry.sectionOrder.indexOf(key);
    return i === -1 ? DEFAULT_ORDER.length : i;
  };
  return [...sections].sort((a, b) => rank(a.key) - rank(b.key));
}
