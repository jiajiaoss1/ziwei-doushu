/**
 * 有料レポート（恋愛鑑定書 / 事業鑑定書）の文章生成。
 *
 * 無料診断より踏み込み、宮位・四化・大限・流年の組み合わせから
 * 「相手像」「職種」「時期」「注意点」「行動提案」まで組み立てる。
 */

import type { JpChartFacts, PalaceFact, StarFact } from './facts';
import { SIHUA_JA, starJa } from './glossary';

export type ReportType = 'love' | 'work';

export interface ReportSection {
  title: string;
  body: string;
}

export interface PaidReport {
  type: ReportType;
  title: string;
  subtitle: string;
  /** 冒頭に出す3行サマリー */
  summary: string[];
  sections: ReportSection[];
  generatedAt: string;
}

/** 夫妻宮の主星から見た「惹かれやすい相手像」 */
const PARTNER_IMAGE: Record<string, string> = {
  紫微: '堂々としていて、あなたを対等に尊重してくれる人',
  天機: '頭の回転が速く、会話が弾む人',
  太陽: '明るく面倒見のよい、人の輪の中心にいる人',
  武曲: '口数は少ないけれど、行動で信頼を示してくれる人',
  天同: '穏やかで、一緒にいるだけで肩の力が抜ける人',
  廉貞: '個性的で、目を離せない魅力を持った人',
  天府: '包容力があり、そばにいると安心できる人',
  太陰: '繊細で、あなたの気持ちを細やかに察してくれる人',
  貪狼: '社交的で、一緒にいると刺激をもらえる人',
  巨門: '知識欲が旺盛で、話していて飽きない人',
  天相: '気配りができ、あなたを陰で支えてくれる人',
  天梁: '年上のような落ち着きと包容力のある人',
  七殺: '決断が早く、ぐいぐい引っ張ってくれる人',
  破軍: '型にはまらない自由さを持った人',
};

/** 官禄宮の主星から見た「向いている働き方」 */
const JOB_TYPES: Record<string, string> = {
  紫微: '管理職・経営・組織のトップとして、方針を示す働き方',
  天機: '企画・分析・コンサル・専門職として、知を武器にする働き方',
  太陽: '教育・広報・公的機関・接客など、人前に立つ働き方',
  武曲: '営業・金融・技術・製造など、成果と数字で評価される働き方',
  天同: 'サービス・福祉・調整役など、人を支える働き方',
  廉貞: '企画・美容・法務・クリエイティブなど、センスが問われる働き方',
  天府: '財務・総務・不動産・管理など、基盤を守る働き方',
  太陰: 'デザイン・ライティング・ケア・研究など、感性と集中を使う働き方',
  貪狼: '営業・芸能・エンタメ・企画など、人を惹きつける働き方',
  巨門: '教育・法務・研究・専門職など、言葉と知識を扱う働き方',
  天相: '秘書・調整・サービス・美容など、人を整える働き方',
  天梁: '医療・教育・公職・相談業など、導く働き方',
  七殺: '開拓営業・独立・スポーツなど、勝負が問われる働き方',
  破軍: '新規事業・変革・立て直しなど、ゼロから生み出す働き方',
};

function borrowedFacts(palace: PalaceFact): StarFact[] {
  return palace.borrowedStars.map((name) => ({
    name,
    ja: starJa(name),
    type: 'major' as const,
  }));
}

/** 主星がなければ対宮の星を「借りて」読む（空宮の扱い） */
function palaceStars(palace: PalaceFact): StarFact[] {
  return palace.major.length > 0 ? palace.major : borrowedFacts(palace);
}

function starNames(palace: PalaceFact): string {
  return palaceStars(palace).map((s) => s.ja.nameJa).join('・');
}

function primaryStar(palace: PalaceFact): StarFact | undefined {
  return palaceStars(palace)[0];
}

/** 宮の書き出し。空宮なら対宮の星を明示する */
function opening(palace: PalaceFact): string {
  if (palace.major.length > 0) {
    return `${palace.nameJa}には${starNames(palace)}が入っています。`;
  }
  if (palace.borrowedStars.length > 0) {
    return `${palace.nameJa}は空宮で、対宮の${starNames(palace)}の影響を強く受けます。`;
  }
  return `${palace.nameJa}は空宮です。`;
}

function partnerImage(palace: PalaceFact): string {
  const first = palace.major[0];
  if (first && PARTNER_IMAGE[first.ja.nameJa]) return PARTNER_IMAGE[first.ja.nameJa];
  if (palace.borrowedStars.length > 0) {
    const borrowed = starJa(palace.borrowedStars[0]).nameJa;
    if (PARTNER_IMAGE[borrowed]) return PARTNER_IMAGE[borrowed];
  }
  return '落ち着きと誠実さを感じさせる人';
}

function jobType(palace: PalaceFact): string {
  const first = palace.major[0];
  if (first && JOB_TYPES[first.ja.nameJa]) return JOB_TYPES[first.ja.nameJa];
  if (palace.borrowedStars.length > 0) {
    const borrowed = starJa(palace.borrowedStars[0]).nameJa;
    if (JOB_TYPES[borrowed]) return JOB_TYPES[borrowed];
  }
  return '自分のペースを守れる働き方';
}

function traits(palace: PalaceFact, field: 'essence' | 'love' | 'work' | 'money'): string {
  return palaceStars(palace).map((s) => s.ja[field]).join('');
}

function shadows(palace: PalaceFact): string {
  return palaceStars(palace).map((s) => s.ja.shadow).join('');
}

function shaText(palace: PalaceFact, label: string): string {
  if (palace.sha.length === 0) return '';
  const names = palace.sha.slice(0, 2).join('・');
  if (label === '夫妻宮') {
    return `${label}には${names}が入っています。気持ちが先走ったり、思いどおりに進まなかったりすることもあるため、焦らず対話を重ねることが大切です。`;
  }
  return `${label}には${names}が入っています。計画どおりに進みにくい場面もあるため、確認を重ねながら、余裕を持って進めるとよいでしょう。`;
}

function luckyText(palace: PalaceFact): string {
  if (palace.lucky.length === 0) return '';
  return `${palace.lucky.slice(0, 3).join('・')}などの吉星も入り、人に恵まれやすい配置です。`;
}

function hasHuaIn(facts: JpChartFacts, palaceName: string, hua: string): boolean {
  return facts.liunian.landed.some((l) => l.palaceName === palaceName && l.hua === hua);
}

function huaIn(facts: JpChartFacts, palaceName: string): string[] {
  return facts.liunian.landed
    .filter((l) => l.palaceName === palaceName)
    .map((l) => `${l.star}の${SIHUA_JA[l.hua].nameJa}`);
}

function daxianLine(facts: JpChartFacts): string {
  if (facts.isChildhood || !facts.daxian) {
    return '現在は大限に入る前の準備期間です。焦って結論を出さず、自分の輪郭を確かめる時間にするとよいでしょう。';
  }
  const dx = facts.daxian;
  const dxStars = dx.major.map((s) => s.ja.nameJa).join('・') || '静かな星';
  return `現在は${dx.startAge}歳から${dx.endAge}歳までの「${dx.palaceJa}」の大限。${dx.decadeTheme}にあたり、${dxStars}がこの十年を彩ります。`;
}

function yearLine(facts: JpChartFacts): string {
  const ln = facts.liunian;
  const bits = ln.landed.map(
    (l) => `${l.star}が${l.palaceJa}で${SIHUA_JA[l.hua].nameJa}`,
  );
  return `${ln.year}年は${ln.stem}${ln.branch}年。${bits.join('、')}という流れがあります。`;
}

function topPatterns(facts: JpChartFacts): string {
  if (facts.patterns.length === 0) return '';
  return facts.patterns
    .slice(0, 2)
    .map((p) => `「${p.nameJa}」${p.desc}`)
    .join('');
}

export function buildLoveReport(facts: JpChartFacts): PaidReport {
  const ming = facts.ming;
  const fuqi = facts.fuqi;
  const mainStar = primaryStar(ming);
  const partner = partnerImage(fuqi);

  const loveHua = hasHuaIn(facts, '夫妻', '禄') || hasHuaIn(facts, '夫妻', '科');
  const loveJi = hasHuaIn(facts, '夫妻', '忌');
  const fuqiHua = huaIn(facts, '夫妻');

  const summary = [
    `本質は${mainStar ? mainStar.ja.keyword : '静かな芯'}。恋愛では${partner}に惹かれやすいでしょう。`,
    fuqiHua.length > 0
      ? `今年は夫妻宮に${fuqiHua.join('、')}が入り、恋愛やパートナーシップについて見直す機会が増えそうです。`
      : '今年は恋愛面よりも、自分を整えることが関係を育てます。',
    loveJi
      ? 'こだわりや執着が強く出やすいので、相手を変えようとせず、対話を重ねることが鍵になります。'
      : '焦らず距離を縮めると、関係が長続きしやすいでしょう。',
  ];

  const sections: ReportSection[] = [
    {
      title: '1. 恋愛の土台になる性格',
      body: [
        opening(ming),
        traits(ming, 'essence'),
        mainStar?.ja.shadow ? `影の面では、${mainStar.ja.shadow}` : '',
        `恋愛の場面でも、この${mainStar?.ja.keyword ?? '資質'}がそのまま出ます。無理に別人を演じるより、自分のペースを大切にしたほうが、長く愛される関係になります。`,
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      title: '2. 惹かれやすい相手と、惹きつける魅力',
      body: [
        opening(fuqi),
        `あなたが惹かれやすいのは、${partner}。`,
        traits(fuqi, 'love'),
        luckyText(fuqi),
        `あなた自身の魅力は、${mainStar?.ja.keyword ?? '落ち着き'}。相手を探すより、その魅力が自然に出る場に身を置くと、縁が動きやすくなります。`,
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      title: '3. 関係が深まるまで',
      body: [
        `恋愛の進み方は、命宮と夫妻宮の組み合わせで変わります。`,
        `${primaryStar(ming) ? `${primaryStar(ming)!.ja.nameJa}の` : ''}あなたは、${traits(ming, 'love')}`,
        `相手を知る時間を惜しまず、小さな約束を重ねることが、関係の土台になります。`,
        fuqi.sha.length > 0
          ? '夫妻宮に緊張の星があるため、最初の勢いだけで突っ走ると、後で息切れしやすいでしょう。'
          : '大きな障害は少なく、自然な流れで距離が縮まりやすい配置です。',
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      title: '4. つまずきやすいポイント',
      body: [
        shadows(fuqi) || shadows(ming),
        shaText(fuqi, '夫妻宮'),
        loveJi
          ? '今年は特に、相手の反応を読みすぎて不安になりやすい時期です。確認しすぎるより、自分の時間を充実させることが安心につながります。'
          : '相手のペースと自分のペースが違うときに、どちらかに合わせすぎないことが大切です。',
        '「こうあるべき」を手放すと、関係がぐっと楽になります。',
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      title: '5. 縁が動く時期',
      body: [
        daxianLine(facts),
        yearLine(facts),
        loveHua
          ? '今年は夫妻宮に恵みの星が入り、出会いや関係の前進が起こりやすい年です。誘いには軽やかに乗ってみましょう。'
          : '縁は、日常の延長線上で動きます。新しい場所より、いつもの場所での出会いを大切にするとよいでしょう。',
        topPatterns(facts),
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      title: '6. あなたへのアドバイス',
      body: [
        `あなたの恋愛の鍵は「${mainStar?.ja.keyword ?? '自分のペース'}」です。`,
        '相手に合わせて自分を小さくするより、自分の好きなこと・大切にしていることを言葉で伝えるほうが、結果的に良い関係になります。',
        '月に一度、関係を振り返る時間をつくると、小さな違和感を早めに拾えます。',
        '占いは、あなたの選択を縛るものではありません。しっくりくる部分だけを持ち帰ってください。',
      ].join(''),
    },
  ];

  return {
    type: 'love',
    title: '恋愛鑑定書',
    subtitle: `${starNames(ming) || '命宮'}の命宮から読み解く、あなたの恋愛傾向`,
    summary,
    sections,
    generatedAt: new Date().toISOString(),
  };
}

export function buildWorkReport(facts: JpChartFacts): PaidReport {
  const ming = facts.ming;
  const guanlu = facts.guanlu;
  const caibo = facts.caibo;
  const mainStar = primaryStar(ming);
  const job = jobType(guanlu);

  const workHua = hasHuaIn(facts, '官禄', '禄') || hasHuaIn(facts, '官禄', '権') || hasHuaIn(facts, '官禄', '科');
  const workJi = hasHuaIn(facts, '官禄', '忌');
  const guanluHua = huaIn(facts, '官禄');

  const summary = [
    `本質は${mainStar ? mainStar.ja.keyword : '堅実さ'}。仕事では${job}が向いています。`,
    guanluHua.length > 0
      ? `今年は官禄宮に${guanluHua.join('、')}が入り、仕事の流れが動きやすい年です。`
      : '今年は大きな転換より、実力の蓄積が実を結ぶ年になりそうです。',
    workJi
      ? '仕事の宮にこだわりの星が入るため、抱え込みすぎず、任せることを覚えると突破口が開けます。'
      : '攻めるなら、準備が整ったタイミングを逃さないことが大切です。',
  ];

  const sections: ReportSection[] = [
    {
      title: '1. 仕事の資質',
      body: [
        opening(ming),
        traits(ming, 'essence'),
        mainStar?.ja.shadow ? `仕事の場では、${mainStar.ja.shadow.replace(/。$/, '')}という面も出やすいので、意識して人に頼るとバランスが取れます。` : '',
        `この資質は、${job}で特に活きるでしょう。`,
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      title: '2. 向いている働き方・職種',
      body: [
        opening(guanlu),
        `向いているのは、${job}です。`,
        luckyText(guanlu),
        '組織か独立かで迷ったときは、どちらが自分の資質に合うかで選ぶと、長続きします。',
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      title: '3. お金の流れ',
      body: [
        opening(caibo),
        traits(caibo, 'money'),
        opening(facts.tianzhai),
        '収入が増えたときほど、固定費と投資の割合を先に決めておくと、安定しやすくなります。',
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      title: '4. 転機の読み方',
      body: [
        daxianLine(facts),
        yearLine(facts),
        workHua
          ? '今年は官禄宮に追い風が入り、仕事の評価や役割が動きやすい年です。準備してきたことを前に出すチャンスでしょう。'
          : '大きな転機は、焦ってつくるものではありません。今年は土台を整えることが、来年の跳躍につながります。',
        topPatterns(facts),
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      title: '5. 注意したいこと',
      body: [
        shaText(guanlu, '官禄宮') || '官禄宮に大きな緊張の星はなく、比較的安定して力を発揮しやすい配置です。',
        workJi
          ? 'こだわりが強いあまり、一人で抱え込んでしまうと疲弊します。早めに相談することも仕事のうちだと考えると楽になります。'
          : '調子が良いときほど、確認作業を省かないことが事故を防ぎます。',
        '体調と相談しながら、無理のないペースを守ることが、結果的に一番の近道です。',
      ]
        .filter(Boolean)
        .join(''),
    },
    {
      title: '6. 行動のヒント',
      body: [
        `あなたの仕事の鍵は「${mainStar?.ja.keyword ?? '自分の強み'}」です。`,
        '得意なことを一つ選び、それを言葉で説明できるようにすると、仕事の幅が広がります。',
        '転機が来たときは、大きな決断より小さな実験から始めると、失敗しても戻れます。',
        '占いは、あなたの選択を縛るものではありません。しっくりくる部分だけを持ち帰ってください。',
      ].join(''),
    },
  ];

  return {
    type: 'work',
    title: '事業鑑定書',
    subtitle: `${starNames(ming) || '命宮'}の命宮から読み解く、仕事とお金の設計図`,
    summary,
    sections,
    generatedAt: new Date().toISOString(),
  };
}

export function buildReport(facts: JpChartFacts, type: ReportType): PaidReport {
  return type === 'love' ? buildLoveReport(facts) : buildWorkReport(facts);
}
