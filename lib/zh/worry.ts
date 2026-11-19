/**
 * 煩惱入口（港台版）。
 *
 * 二層結構：
 *   1. 煩惱（感情・工作・人際・自己）
 *   2. 情境（例如感情底下的暗戀・分手・交往婚姻・單身催婚）
 *
 * 結果頁依情境給共情句並重排章節，讓解讀對準「你現在發生的事」。
 */

export type Worry = 'love' | 'work' | 'people' | 'self';

export interface Scenario {
  key: string;
  label: string;
  hint: string;
  /** 情境專屬的共情句 */
  empathy: string;
}

export interface WorryDef {
  key: Worry;
  label: string;
  hint: string;
  /** 未選情境時的共情句 */
  empathy: string;
  focus: 'love' | 'work' | 'general';
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

export const SCENARIOS: Record<Worry, Scenario[]> = {
  love: [
    {
      key: 'crush',
      label: '暗戀',
      hint: '喜歡一個人，還不確定對方怎麼想',
      empathy:
        '你現在可能在反覆看手機，想著「他會不會回」。喜歡一個人卻不確定對方的心意，這種懸著的感觉很耗人——你沒有想太多，是這段關係本來就讓人不安。',
    },
    {
      key: 'breakup',
      label: '分手・復合',
      hint: '分開了，或還想挽回',
      empathy:
        '分手之後，最難的往往不是失去，而是那些「如果當初我…」。你還在想這段關係，不代表你軟弱，只代表你認真愛過。先看看命盤裡，這段感情對你意味著什麼。',
    },
    {
      key: 'partner',
      label: '交往・婚姻',
      hint: '關係裡有卡住的地方',
      empathy:
        '交往久了、結婚之後，有些話反而更難說出口。你不是不愛了，是累積的東西太多。先看看命盤裡，你在關係中的模式，再決定要不要說、怎麼說。',
    },
    {
      key: 'single',
      label: '單身・催婚',
      hint: '想找對象，或被催得煩',
      empathy:
        '被問「怎麼還沒對象」的時候，你笑著帶過，但心裡其實很煩。不是你不夠好，是時機、選擇與緣分的問題。先看看命盤裡，你的感情節奏。',
    },
  ],
  work: [
    {
      key: 'change',
      label: '轉職',
      hint: '想換工作，還在猶豫',
      empathy:
        '想換工作，卻又怕換了更糟。這種卡住不是優柔寡斷，是你知道這個決定很重要。先看看命盤裡，你適合什麼樣的工作方式、現在的流年推著你往哪走。',
    },
    {
      key: 'startup',
      label: '創業',
      hint: '想自己做事，或已經開始',
      empathy:
        '想自己做事的人，心裡都有一個「不想再這樣下去」的聲音。先看看命盤裡，你的資質適合獨立還是組織，以及什麼時候比較適合動。',
    },
    {
      key: 'stuck',
      label: '瓶頸・被裁',
      hint: '卡住、失去方向、被裁員',
      empathy:
        '被卡住、被裁員，最難受的往往不是錢，是「我是不是不行」的自我懷疑。先看看命盤裡，這一段是不是本來就該轉彎。',
    },
  ],
  people: [
    {
      key: 'family',
      label: '家人',
      hint: '和父母、伴侶家人相處',
      empathy: '家人之間的為難，常常是「在意」和「受傷」同時存在。先看看命盤裡，你在家庭關係中的傾向。',
    },
    {
      key: 'friend',
      label: '朋友',
      hint: '友誼變質、漸行漸遠',
      empathy: '有些朋友走著走著就遠了，不是誰的錯，是節奏不同了。先看看命盤裡，你在人際中的模式。',
    },
    {
      key: 'colleague',
      label: '同事・職場',
      hint: '辦公室的人際壓力',
      empathy: '職場的人際壓力，有時候比工作本身更累。先看看命盤裡，你在團隊中的位置與容易耗損的地方。',
    },
  ],
  self: [
    {
      key: 'lost',
      label: '迷惘',
      hint: '不知道自己要什麼',
      empathy: '不知道自己要什麼，不是沒有方向，是還沒找到讓自己安心的地方。先看看命盤裡，你本來是什麼樣的人。',
    },
    {
      key: 'anxious',
      label: '焦慮',
      hint: '想太多、靜不下來',
      empathy: '腦子停不下來的時候，最需要的不是「別想太多」，而是知道為什麼會這樣。先看看命盤裡，你的敏感從哪裡來。',
    },
    {
      key: 'direction',
      label: '方向',
      hint: '接下來該往哪裡走',
      empathy: '站在路口，每個方向都好像有道理，又都不確定。先看看命盤裡，你的節奏與適合的移動方式。',
    },
  ],
};

/** URL 的 w 參數 → 煩惱定義（無效或未指定時回 undefined，不加共情） */
export function worryOf(raw?: string): WorryDef | undefined {
  if (!raw) return undefined;
  return WORRIES[raw as Worry];
}

/** URL 的 s 參數 → 情境（需搭配煩惱） */
export function scenarioOf(worry: WorryDef | undefined, raw?: string): Scenario | undefined {
  if (!worry || !raw) return undefined;
  return SCENARIOS[worry.key].find((s) => s.key === raw);
}

/** 共情句：情境優先，其次煩惱 */
export function empathyOf(worry?: WorryDef, scenario?: Scenario): string | undefined {
  return scenario?.empathy ?? worry?.empathy;
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
