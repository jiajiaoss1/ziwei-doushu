/**
 * ZH 關係決策自查（輕量版）。
 *
 * 只收年月日；預設午時 + 台北市，不啟用真太陽時。
 * 這裡只做「初步整理」，不是完整命盤解讀，也不取代報告。
 */

import { generateChart } from '@/lib/ziwei/algorithm';
import { starZh } from '@/lib/zh/glossary';

export const CHECK_STORAGE_KEY = 'shibikan:zh-check:v1';

export type RelationshipStatus =
  | 'dating'
  | 'cohabiting'
  | 'married'
  | 'separated'
  | 'divorce_considering'
  | 'other';

export type Decision = 'stay' | 'talk' | 'leave' | 'unknown';

export type Tried =
  | 'friends'
  | 'tarot'
  | 'temple'
  | 'teacher'
  | 'ai'
  | 'self'
  | 'none';

export interface CheckInput {
  year: number;
  month: number;
  day: number;
  status: RelationshipStatus;
  decision: Decision;
  note?: string;
  tried: Tried[];
}

export interface LightCheckResult {
  decisionLine: string;
  patternLine: string;
  confirmLine: string;
  suggestion: string;
  chartSummary: string;
  defaults: string;
}

export const STATUS_LABEL: Record<RelationshipStatus, string> = {
  dating: '交往中',
  cohabiting: '同居',
  married: '已婚',
  separated: '分居',
  divorce_considering: '離婚考慮中',
  other: '其他',
};

export const DECISION_LABEL: Record<Decision, string> = {
  stay: '要不要繼續',
  talk: '怎麼談／設界線',
  leave: '要不要離開',
  unknown: '還不知道',
};

export const TRIED_LABEL: Record<Tried, string> = {
  friends: '朋友／家人',
  tarot: '塔羅',
  temple: '宮廟／問事／月老',
  teacher: '真人老師',
  ai: 'ChatGPT／AI',
  self: '自己查資料',
  none: '沒有',
};

const STAR_TRAIT: Record<string, string> = {
  紫微: '希望被尊重，也容易把責任扛在自己身上',
  天機: '想很多，會反覆推演對方的每一句話',
  太陽: '願意付出，但容易把對方的需要放在自己前面',
  武曲: '看條件與實際行動，不喜歡只聽承諾',
  天同: '想和諧，遇到衝突容易先退讓',
  廉貞: '在意界線與忠誠，細節容易被放大',
  天府: '想要穩定與秩序，不喜歡失控',
  太陰: '需要安全感，情緒容易受對方影響',
  貪狼: '想要感覺與新鮮感，容易把心動當成適合',
  巨門: '在意溝通，但一開口就容易變成辯論',
  天相: '重視公平與協調，容易當中間人',
  天梁: '想找可靠的人，也容易用原則壓住自己',
  七殺: '想快速突破，受不了關係一直拖著',
  破軍: '想重新來過，容易在關係裡反覆推翻',
};

function majorNames(palace: { stars: { name: string; type: string }[]; borrowedStars?: string[] }): string[] {
  const own = palace.stars.filter((s) => s.type === 'major').map((s) => s.name);
  return (own.length ? own : (palace.borrowedStars ?? [])).map((n) => starZh(n).nameZh);
}

function starSentence(names: string[]): string {
  if (!names.length) return '你在關係裡容易先看對方的狀態，再決定自己要放多少。';
  const traits = names.map((n) => STAR_TRAIT[n]).filter(Boolean);
  if (!traits.length) return '你在關係裡有自己的節奏，但遇到不確定時容易想太多。';
  return `你在關係裡容易${traits[0]}${traits[1] ? `；同時也${traits[1]}` : ''}。`;
}

function decisionLine(input: CheckInput): string {
  switch (input.decision) {
    case 'stay':
      return '你現在比較像在決定：這段關係還要不要繼續。';
    case 'talk':
      return '你現在比較像在決定：要不要把話說開、把界線畫清楚。';
    case 'leave':
      return '你現在比較像在決定：要不要離開，或先暫停。';
    default:
      return '你現在還不確定要決定什麼；先確認「你要的是什麼」，比急著選邊更重要。';
  }
}

function confirmLine(input: CheckInput): string {
  switch (input.decision) {
    case 'stay':
      return '先確認：你是想繼續，還是只是害怕失去？';
    case 'talk':
      return '先確認：你最想讓對方聽見的一句話是什麼？';
    case 'leave':
      return '先確認：你離開的是這個人，還是這種一直委屈的自己？';
    default:
      return '先確認：如果不用考慮對方反應，你真正想要的是什麼？';
  }
}

function suggestion(input: CheckInput): string {
  switch (input.decision) {
    case 'stay':
      return '先做：寫下三個「繼續的條件」；先問：對方是否願意一起談；先停：在情緒最高點做決定。';
    case 'talk':
      return '先做：把想說的話縮成三句；先問：對方現在有沒有空間聽；先停：不要在深夜用訊息談判。';
    case 'leave':
      return '先做：盤點經濟、住處與支持系統；先問：你需要哪些實際協助；先停：不要在恐懼最高點攤牌。';
    default:
      return '先做：寫下「我不想再…」；先問：你最怕失去什麼；先停：先不要問對方要不要復合。';
  }
}

export function buildLightCheck(input: CheckInput): LightCheckResult {
  // 直接指定午時（branch 6），不經真太陽時校正。
  // 命宮/夫妻宮主星不因性別改變；輕量版不收集性別，用 female 作為排盤占位。
  const chart = generateChart({
    year: input.year,
    month: input.month,
    day: input.day,
    hour: 6,
    gender: 'female',
    province: '台北市',
    city: '台北市',
  });
  const spouse = chart.palaces.find((p) => p.name === '夫妻');
  const ming = chart.palaces.find((p) => p.name === '命宫');
  const fude = chart.palaces.find((p) => p.name === '福德');
  const spouseStars = spouse ? majorNames(spouse) : [];
  const mingStars = ming ? majorNames(ming) : [];
  const fudeStars = fude ? majorNames(fude) : [];

  const patternLine = spouseStars.length
    ? `你的夫妻宮是${spouseStars.join('、')}：${starSentence(spouseStars)}`
    : '你的夫妻宮是空宮：你在關係裡容易先借對方的狀態，來決定自己的位置。';

  const chartSummary = [
    `命宮：${mingStars.join('、') || '空宮'}`,
    `夫妻宮：${spouseStars.join('、') || '空宮'}`,
    `福德宮：${fudeStars.join('、') || '空宮'}`,
  ].join('｜');

  return {
    decisionLine: decisionLine(input),
    patternLine,
    confirmLine: confirmLine(input),
    suggestion: suggestion(input),
    chartSummary,
    defaults: '未含時辰／縣市，以午時 12:00、台北市初步整理；補上時辰與縣市後，命盤與解讀會更完整。',
  };
}

export function isAdultBirthDate(year: number, month: number, day: number, now = new Date()): boolean {
  const birth = new Date(year, month - 1, day);
  if (Number.isNaN(birth.getTime()) || birth > now) return false;
  const adult = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
  return birth <= adult;
}
