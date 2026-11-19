/**
 * 繁體中文用語集 — 紫微斗數的星曜・宮位・四化・明暗・格局，供香港／台灣市場使用。
 *
 * 以台灣用詞為基準（網路・影片・軟體・螢幕），命理術語港台通用。
 * 語氣統一為「不鐵口直斷」：多用「較容易」「可能」「傾向」。
 */

export interface StarZh {
  /** 顯示名（繁體） */
  nameZh: string;
  /** 一言關鍵字 */
  keyword: string;
  /** 性格・本質（2 句） */
  essence: string;
  /** 感情傾向（1〜2 句） */
  love: string;
  /** 工作傾向（1〜2 句） */
  work: string;
  /** 金錢傾向（1 句） */
  money: string;
  /** 陰影面（1 句） */
  shadow: string;
}

const STAR_ALIASES: Record<string, string> = {
  天机: '天機',
  太阳: '太陽',
  廉贞: '廉貞',
  太阴: '太陰',
  贪狼: '貪狼',
  巨门: '巨門',
  七杀: '七殺',
  破军: '破軍',
};

/** 日文漢字 → 繁體標準（格局名用） */
const JA_TO_ZH: Record<string, string> = {
  禄: '祿',
  権: '權',
  会: '會',
  德: '德',
};

function toZh(name: string): string {
  return name
    .split('')
    .map((ch) => JA_TO_ZH[ch] ?? ch)
    .join('');
}

export const STAR_ZH: Record<string, StarZh> = {
  紫微: {
    nameZh: '紫微',
    keyword: '尊嚴・格局・向心力',
    essence:
      '天生帶著格局與存在感，自然而然站在人群中心。自尊心較高，遇到不能退讓的場面會顯得固執，但這也連著責任感的強度。',
    love: '對另一半的標準較高，也希望被重視。比起面子，更看重格局；長久關係裡，安心感與彼此的尊重最重要。',
    work: '適合組織核心或需要扛責任的位置。能整合眾人、指出方向時，最能發揮。',
    money: '為了維持體面，支出可能增加；但同時也具備朝目標擴張收入的能力。',
    shadow: '較不容易示弱，容易把孤獨感自己扛下來。',
  },
  天機: {
    nameZh: '天機',
    keyword: '聰明・機變・分析',
    essence:
      '聰明、反應快，習慣從多角度看事情。頭腦轉得快、對變化也柔軟，但想太多時反而動不了。',
    love: '容易讀太多對方的心思，自己越想越煩。比起只靠言語，能用品行讓你安心的對象更合適。',
    work: '適合企劃、分析、專業職等用腦的工作。負責安排流程、拆解問題時較能發揮。',
    money: '算得清楚，但容易被資訊牽著走。減少追逐短線消息、拉長視角，會更穩。',
    shadow: '容易操心，決斷常往後延。',
  },
  太陽: {
    nameZh: '太陽',
    keyword: '開朗・付出・名聲',
    essence:
      '像太陽一樣明亮，會照亮周圍。樂於照顧人、從幫助別人得到成就感；但也容易為了回應期待而硬撐。',
    love: '屬於付出型，從支持對方獲得喜悅。對誰都親切，有時反而被誤會。',
    work: '適合站到人前、教育、公共性質的角色。與評價、名聲的緣分較深。',
    money: '重視人際，交際費容易增加。先編好預算，會比較安心。',
    shadow: '容易過度燃燒自己，也較在意別人的評價。',
  },
  武曲: {
    nameZh: '武曲',
    keyword: '執行・決斷・務實',
    essence:
      '執行力與決斷力兼具。比起情緒更重視結果，會朝目標直線前進；不擅長花言巧語，但用誠實換取信任。',
    love: '表達較含蓄，重視誠實，習慣用行動表示愛意。能理解這種表達方式的人，較容易長久。',
    work: '適合業務、金融、技術等看數字與成果的領域，獨立性也強。',
    money: '對賺錢有企圖心、金錢觀務實；但越被依賴，支出也越容易增加。',
    shadow: '有時較強勢，回過神來常是自己一個人在扛。',
  },
  天同: {
    nameZh: '天同',
    keyword: '溫和・療癒・安穩',
    essence:
      '溫和、能療癒人。不喜歡爭執，會營造平和的氣氛；懂得依賴別人，但也可能太偏好舒服的狀態。',
    love: '追求相處起來安心的關係。有時會太依賴對方，能尊重彼此時間與獨立的關係最理想。',
    work: '適合服務、協調、支援的角色。不硬撐的工作方式較能長久。',
    money: '用錢較大方。娛樂性支出建議有意識地管理。',
    shadow: '容易優先選擇舒服，把事情往後延。',
  },
  廉貞: {
    nameZh: '廉貞',
    keyword: '熱情・美感・複雜',
    essence:
      '熱情與美感兼具。好惡分明，被吸引就會一頭栽進去；魅力帶點複雜，人際關係也容易戲劇化。',
    love: '容易被熱烈的戀愛吸引。熱情是優點，但太在乎對方時容易失衡，保持舒服的距離很重要。',
    work: '適合企劃、美容、法務、創意等需要品味與談判力的領域。',
    money: '收入有起伏，對喜歡的事不手軟；情緒性消費要留意。',
    shadow: '太在意對方，反而把心事都憋著。',
  },
  天府: {
    nameZh: '天府',
    keyword: '包容・穩定・累積',
    essence:
      '包容力與穩定感。能穩穩接住人，守成的力量強，擅長累積。',
    love: '重視安心與穩定。比起華麗，更傾向選擇相處起來能放鬆的對象。',
    work: '適合管理、財務、不動產、總務等支撐基礎的角色。',
    money: '擅長儲蓄，會穩穩地養資產；比起冒大風險，更重視穩健。',
    shadow: '有時太保守，反而錯過機會。',
  },
  太陰: {
    nameZh: '太陰',
    keyword: '細膩・想像力・內在',
    essence:
      '細膩、想像力豐富。能察覺情緒的細微變化，在安靜的環境裡最能發揮；內心世界豐富，帶點浪漫。',
    love: '嚮往浪漫的戀愛。因為較容易受傷，溫柔體貼的對象較合適。',
    work: '適合創意、照護、調查等需要感受力與專注力的工作。',
    money: '務實、會慢慢存錢；有時為了消除不安而出現計畫外支出。',
    shadow: '容易抱著不安與孤獨感，想太多時要留意。',
  },
  貪狼: {
    nameZh: '貪狼',
    keyword: '慾望・社交・多才',
    essence:
      '慾望與社交性兼具。好奇心強、多才多藝，有吸引人的魅力；也懂得玩，擁有享受人生的能力。',
    love: '對認識新對象與戀愛較積極，追求刺激與心動。容易膩，能一起享受變化的關係較合適。',
    work: '適合業務、演藝、企劃、接待等與人互動、展現魅力的工作。',
    money: '花錢與賺錢都大膽。把錢花在喜歡的事上時，記得顧一下預算。',
    shadow: '容易膩、容易分心，太貪心時會累。',
  },
  巨門: {
    nameZh: '巨門',
    keyword: '口才・探究・分析',
    essence:
      '口才與探究兼具。用言語思考、也用言語推動人；分析力強，能看穿事情的另一面。',
    love: '習慣用言語確認心意。因為容易產生誤解，好好對話是關鍵。',
    work: '適合專業職、教育、法務、研究等以知識與言語為武器的工作。',
    money: '務實，但要小心被資訊牽著走。',
    shadow: '容易多疑、話說得太重而傷到人。',
  },
  天相: {
    nameZh: '天相',
    keyword: '協調・服務・調整',
    essence:
      '協調與服務兼具。擅長照顧人、整理場面；協調性高，是可靠的幕後支柱。',
    love: '偏付出型，願意為對方著想；但別失去主體性，關係才走得長。',
    work: '適合秘書、協調、服務、美容等支撐人的工作。',
    money: '偏穩定、少浪費；相對地，常為了別人多花錢。',
    shadow: '容易把自己的希望往後放，也較難拒絕別人的請託。',
  },
  天梁: {
    nameZh: '天梁',
    keyword: '庇護・原則・老成',
    essence:
      '庇護與原則兼具。會照顧人、個性沉穩，有守護周圍的包容力；正義感強，擅長聽人商量。',
    love: '會發揮包容力支持對方；少一點說教，關係較能長久。',
    work: '對教育、福利、公職、諮詢等陪伴與引導人的領域較有興趣。',
    money: '務實，會想到退休金；借錢給人時要謹慎。',
    shadow: '有時較固執，也容易管太多。',
  },
  七殺: {
    nameZh: '七殺',
    keyword: '突破・獨立・行動',
    essence:
      '象徵突破力與獨立心。目標定了就直線前進，大膽、不怕變化。',
    love: '談感情時較熱烈，情緒一來就很高張。要讓關係長久，也需要冷靜認識對方的時間。',
    work: '適合開拓、業務、創業、運動等講求速度與決斷的領域。',
    money: '收入起伏較大，攻與守的切換很重要。',
    shadow: '容易憑氣勢行動，還沒想清楚就先動了。',
  },
  破軍: {
    nameZh: '破軍',
    keyword: '改革・重建・變革',
    essence:
      '改革與重建兼具。有打破舊秩序、創造新東西的力量；即使變化很多，也能從中開出新路。',
    love: '感情裡也傾向追求變化。經歷關係的轉折後，對自己與對方的理解可能更深。',
    work: '適合新事業、變革、重整等從零開始的工作。',
    money: '支出較容易增加。把資金投入事業時，要仔細衡量生活費與手邊現金。',
    shadow: '容易消耗、衝動，記得留時間休息。',
  },
};

export interface PalaceZh {
  nameZh: string;
  /** 這個宮掌管的領域（短說明） */
  theme: string;
  /** 大限・流年用的主題句 */
  decade: string;
}

export const PALACE_ZH: Record<string, PalaceZh> = {
  命宫: { nameZh: '命宮', theme: '性格與人生主軸', decade: '重新檢視自己定位的十年' },
  兄弟: { nameZh: '兄弟宮', theme: '兄弟姊妹與身邊的人際關係', decade: '人際連結成為支撐的十年' },
  夫妻: { nameZh: '夫妻宮', theme: '感情與婚姻', decade: '感情與伴侶關係成為主題的十年' },
  子女: { nameZh: '子女宮', theme: '子女・創作', decade: '養育與創造成為主題的十年' },
  财帛: { nameZh: '財帛宮', theme: '金錢與收入的取得方式', decade: '金錢觀與理財方式受檢視的十年' },
  疾厄: { nameZh: '疾厄宮', theme: '健康與體質', decade: '身心保養成為主題的十年' },
  迁移: { nameZh: '遷移宮', theme: '外出・環境變化', decade: '走出去、改變環境成為主題的十年' },
  仆役: { nameZh: '交友宮', theme: '朋友與部屬的關係', decade: '夥伴與團隊關係成為主題的十年' },
  官禄: { nameZh: '官祿宮', theme: '工作與社會地位', decade: '工作與位置大幅變動的十年' },
  田宅: { nameZh: '田宅宮', theme: '居住與資產', decade: '整理居住與基礎的十年' },
  福德: { nameZh: '福德宮', theme: '內心的充實與興趣', decade: '內心滿足與樂趣成為主題的十年' },
  父母: { nameZh: '父母宮', theme: '父母與長輩的關係', decade: '長輩與家族關係成為主題的十年' },
};

export type SiHuaZhKey = '禄' | '権' | '科' | '忌';

export interface SiHuaZh {
  nameZh: string;
  keyword: string;
  meaning: string;
}

export const SIHUA_ZH: Record<SiHuaZhKey, SiHuaZh> = {
  禄: { nameZh: '化祿', keyword: '福氣・連結', meaning: '事情較能順暢推進，人與機會的緣分較容易出現' },
  権: { nameZh: '化權', keyword: '力量・主導', meaning: '自己決定、推動事情的力量變強，同時責任與壓力也較容易伴隨而來' },
  科: { nameZh: '化科', keyword: '名聲・學習', meaning: '較容易連結到評價與信任，知識與品味會成為優勢' },
  忌: { nameZh: '化忌', keyword: '執著・停滯', meaning: '執著變強、事情較容易停滯；另一方面，這個領域也可能成為成長的課題' },
};

export interface BrightnessZh {
  label: string;
  phrase: string;
  level: number;
}

export const BRIGHTNESS_ZH: Record<string, BrightnessZh> = {
  廟: { label: '廟', phrase: '非常強', level: 5 },
  旺: { label: '旺', phrase: '強', level: 4 },
  得: { label: '得', phrase: '自然', level: 3 },
  利: { label: '利', phrase: '適中', level: 3 },
  平: { label: '平', phrase: '平均', level: 2 },
  不: { label: '不', phrase: '偏低', level: 1 },
  陷: { label: '陷', phrase: '內斂', level: 1 },
  地: { label: '地', phrase: '特殊形式', level: 2 },
};

export interface PatternZh {
  nameZh: string;
  desc: string;
}

export const PATTERN_ZH: Record<string, PatternZh> = {
  三奇加会: { nameZh: '三奇加會', desc: '三顆吉星齊聚，才華與機運較容易被看見。' },
  化权入官: { nameZh: '化權入官', desc: '工作上較容易掌握主導權。' },
  化禄入财: { nameZh: '化祿入財', desc: '財運較順，金錢流動較容易。' },
  双禄朝垣: { nameZh: '雙祿朝垣', desc: '兩個祿星支撐命宮，收穫較多。' },
  君臣庆会: { nameZh: '君臣慶會', desc: '核心人物與輔佐角色齊備，在組織裡較能發揮。' },
  天同天梁格: { nameZh: '天同天梁格', desc: '性格溫和，人生較穩定。' },
  巨日同宫: { nameZh: '巨日同宮', desc: '以言語與太陽的力量帶動他人。' },
  巨火羊: { nameZh: '巨火羊', desc: '言語上較容易出現摩擦，需要留意。' },
  府相朝垣: { nameZh: '府相朝垣', desc: '穩定與協調，適合一步一腳印地累積。' },
  廉杀羊: { nameZh: '廉殺羊', desc: '熱情與突破力兼具，但衝突也較容易發生。' },
  廉贞天相格: { nameZh: '廉貞天相格', desc: '以美感與協調力整理人際關係。' },
  日月同宫: { nameZh: '日月同宮', desc: '太陽與太陰位在同一個宮（丑宮或未宮）。' },
  日月夹命: { nameZh: '日月夾命', desc: '太陽與太陰夾住命宮。' },
  昌曲夹命: { nameZh: '昌曲夾命', desc: '學習與表達較有優勢。' },
  明珠出海: { nameZh: '明珠出海', desc: '才能與個性較容易在外在世界被看見。' },
  机月同梁: { nameZh: '機月同梁', desc: '兼具聰明與務實，在組織裡較穩定。' },
  机月同梁三星会: { nameZh: '機月同梁三星會', desc: '機月同梁再加強，穩健的成功較容易累積。' },
  杀破狼: { nameZh: '殺破狼', desc: '變化與挑戰的人生，在波動中成長。' },
  武曲七杀: { nameZh: '武曲七殺', desc: '決斷與突破力強，適合獨立或創業。' },
  武贪格: { nameZh: '武貪格', desc: '行動力與慾望相合，晚較容易收成。' },
  火铃夹命: { nameZh: '火鈴夾命', desc: '急躁與衝動要留意。' },
  石中隐玉: { nameZh: '石中隱玉', desc: '才能藏在內裡，不易外露。' },
  科权双会: { nameZh: '科權雙會', desc: '名聲與實力較容易同時到手。' },
  空劫夹命: { nameZh: '空劫夾命', desc: '放下執著，路較容易打開。' },
  紫府同宫: { nameZh: '紫府同宮', desc: '帝王與庫藏之星同宮，格局與穩定兼具。' },
  紫微入命: { nameZh: '紫微入命', desc: '有格局與責任感，適合站在人前。' },
  羊陀夹忌: { nameZh: '羊陀夾忌', desc: '壓力較重，別什麼都自己扛。' },
  辅弼同会: { nameZh: '輔弼同會', desc: '左右幫手齊備，人際支撐較強。' },
  辅弼夹命: { nameZh: '輔弼夾命', desc: '周圍助力較容易聚集。' },
  铃昌陀武: { nameZh: '鈴昌陀武', desc: '計畫與速度的平衡較受考驗。' },
  阳梁昌禄: { nameZh: '陽梁昌祿', desc: '名聲、學習與付出三者齊備。' },
  马头带箭: { nameZh: '馬頭帶箭', desc: '與遠行、移動有緣，行動力開運。' },
  魁钺同会: { nameZh: '魁鉞同會', desc: '較容易得到長輩提攜。' },
  魁钺夹命: { nameZh: '魁鉞夾命', desc: '貴人環繞，較容易被拉一把。' },
  日出扶桑: { nameZh: '日出扶桑', desc: '太陽在卯宮，守命宮或官祿宮。' },
  月落亥宫: { nameZh: '月朗天門', desc: '太陰在亥宮守命宮，感受力與沉穩較容易發揮。' },
  月生沧海: { nameZh: '月生滄海', desc: '太陰在子宮，守田宅宮。' },
  辅弼拱主: { nameZh: '輔弼拱主', desc: '紫微在命宮，左輔・右弼拱照或夾住。' },
  禄马佩印: { nameZh: '祿馬佩印', desc: '天馬在命宮，祿存或化祿同宮或鄰宮，印星同宮。' },
  坐贵向贵: { nameZh: '坐貴向貴', desc: '天魁・天鉞分別在命宮與對宮，互相支撐。' },
  七杀朝斗: { nameZh: '七殺朝斗', desc: '七殺在子・午・寅・申之一守命宮，古典上與地位、名譽的象意相關。' },
  日月并明: { nameZh: '日月並明', desc: '太陽在巳宮、太陰在酉宮，命宮在巳或酉。' },
  日月同临: { nameZh: '日月同臨', desc: '太陽與太陰同守命宮。' },
  科权禄拱: { nameZh: '科權祿拱', desc: '化科・化權・化祿三化聚在命宮三方四正。' },
  贪火相逢: { nameZh: '貪火相逢', desc: '貪狼與火星同守命宮，且兩星皆廟旺。' },
  武曲守垣: { nameZh: '武曲守垣', desc: '武曲在卯宮守命宮。' },
  紫府朝垣: { nameZh: '紫府朝垣', desc: '命宮在寅或申宮，紫微與天府同宮。' },
  权禄生逢: { nameZh: '權祿生逢', desc: '化權與化祿同守命宮，且兩星皆廟旺。' },
  巨机居卯: { nameZh: '巨機居卯', desc: '巨門與天機同宮卯位，守命宮。' },
  明禄暗禄: { nameZh: '明祿暗祿', desc: '祿存在命宮，對宮有化祿。' },
  科明暗禄: { nameZh: '科明暗祿', desc: '命宮有化科，對宮有祿存。' },
  日月夹财: { nameZh: '日月夾財', desc: '武曲在命宮或財帛宮，被太陽與太陰夾住。' },
  财禄夹马: { nameZh: '財祿夾馬', desc: '天馬在命宮，武曲與祿存夾住；星曜生旺時更佳。' },
  日月照璧: { nameZh: '日月照璧', desc: '太陽與太陰在田宅宮；落在墓庫時更佳。' },
  金灿光辉: { nameZh: '金燦光輝', desc: '太陽單獨在午宮守命。' },
  火贪格: { nameZh: '火貪格', desc: '貪狼與火星相會，行動力與挑戰慾較容易升高。' },
  铃贪格: { nameZh: '鈴貪格', desc: '貪狼與鈴星相會，較容易以變化為契機開出新局。' },
  禄存守命: { nameZh: '祿存守命', desc: '祿存在命宮，較重視務實與穩定。' },
  禄存守身: { nameZh: '祿存守身', desc: '祿存在身宮，人生後半較容易累積財運與穩定。' },
  天马入命: { nameZh: '天馬入命', desc: '天馬在命宮，行動力與移動、環境變化的緣分較深。' },
  天马在迁: { nameZh: '天馬在遷', desc: '天馬在遷移宮，與外界、遠方的緣分較容易產生。' },
  昌曲坐命: { nameZh: '昌曲坐命', desc: '文昌・文曲在命宮，學習與表達力較容易發揮。' },
  昌曲同会: { nameZh: '昌曲同會', desc: '文昌・文曲聚在命宮三方四正，知性與文筆較容易發揮。' },
  化科入命: { nameZh: '化科入命', desc: '化科在命宮，較容易得到評價與信任。' },
  化科入身: { nameZh: '化科入身', desc: '化科在身宮，人生後半較容易累積評價與知識經驗。' },
};

export function starZh(name: string): StarZh {
  const key = STAR_ZH[name] ? name : (STAR_ALIASES[name] ?? name);
  return (
    STAR_ZH[key] ?? {
      nameZh: toZh(name),
      keyword: '',
      essence: '',
      love: '',
      work: '',
      money: '',
      shadow: '',
    }
  );
}

const PALACE_ALIASES: Record<string, string> = {
  命宮: '命宫',
  財帛: '财帛',
  遷移: '迁移',
  僕役: '仆役',
  交友: '仆役',
  交友宮: '仆役',
  官祿: '官禄',
  福德: '福德',
};

export function palaceZh(name: string): PalaceZh {
  const key = PALACE_ZH[name] ? name : (PALACE_ALIASES[name] ?? name);
  return PALACE_ZH[key] ?? { nameZh: toZh(name), theme: '', decade: '' };
}

export function sihuaZh(key: SiHuaZhKey): SiHuaZh {
  return SIHUA_ZH[key];
}

export function brightnessZh(raw?: string): BrightnessZh | undefined {
  if (!raw) return undefined;
  const key = raw === '庙' ? '廟' : raw;
  if (key === '地') return BRIGHTNESS_ZH['平'];
  return BRIGHTNESS_ZH[key];
}

export function patternZh(name: string): PatternZh | undefined {
  const exact = PATTERN_ZH[name];
  if (exact) return exact;
  // 化祿入命 / 化忌入命 / 化忌入遷 等模板格
  const m = name.match(/^(.+?)化(祿|權|科|忌)入(命|遷)$/);
  if (m) {
    const star = starZh(m[1]).nameZh;
    const hua = m[2];
    const where = m[3] === '命' ? '命宮' : '遷移宮';
    return {
      nameZh: `${star}化${hua}入${where === '命宮' ? '命' : '遷'}`,
      desc:
        hua === '祿'
          ? `生年四化之化祿在${where}，人際與機會、事情的成果較容易連結。`
          : hua === '忌'
            ? `生年四化之化忌在${where}，對某些事情容易特別在意，需要慢慢面對。`
            : `${star}化${hua}，在${where}形成變化。`,
    };
  }
  return undefined;
}
