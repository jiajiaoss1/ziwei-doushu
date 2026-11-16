'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PREFECTURES_JA } from '@/lib/jp/cities';
import { isValidGregorianDate } from '@/lib/ziwei/true-solar-time';
import { trackJa } from '@/lib/jp/analytics';

interface PersonState {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  unknown: boolean;
  gender: 'male' | 'female';
  prefecture: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

function PersonFields({
  label,
  value,
  onChange,
  years,
}: {
  label: string;
  value: PersonState;
  onChange: (next: PersonState) => void;
  years: number[];
}) {
  const daysInMonth = new Date(value.year, value.month, 0).getDate();
  const set = <K extends keyof PersonState>(key: K, v: PersonState[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="ja-form" style={{ padding: '22px 18px' }}>
      <div
        className="ja-serif"
        style={{ fontSize: 16, color: '#e3c473', letterSpacing: '0.12em', marginBottom: 16 }}
      >
        {label}
      </div>

      <div className="ja-field" style={{ marginBottom: 16 }}>
        <label>生年月日（西暦）</label>
        <div className="ja-row">
          <select
            className="ja-select"
            aria-label={`${label}の生まれた年`}
            value={value.year}
            onChange={(e) => set('year', Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}年
              </option>
            ))}
          </select>
          <select
            className="ja-select"
            aria-label={`${label}の生まれた月`}
            value={value.month}
            onChange={(e) => set('month', Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}月
              </option>
            ))}
          </select>
          <select
            className="ja-select"
            aria-label={`${label}の生まれた日`}
            value={value.day}
            onChange={(e) => set('day', Number(e.target.value))}
          >
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}日
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="ja-field" style={{ marginBottom: 16 }}>
        <label>出生時刻</label>
        <label className="ja-check" style={{ marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={value.unknown}
            onChange={(e) => set('unknown', e.target.checked)}
          />
          わからない
        </label>
        {!value.unknown && (
          <div className="ja-row">
            <select
              className="ja-select"
              aria-label={`${label}の出生時刻（時）`}
              value={value.hour}
              onChange={(e) => set('hour', Number(e.target.value))}
            >
              {HOURS.map((h) => (
                <option key={h} value={h}>
                  {String(h).padStart(2, '0')}時
                </option>
              ))}
            </select>
            <select
              className="ja-select"
              aria-label={`${label}の出生時刻（分）`}
              value={value.minute}
              onChange={(e) => set('minute', Number(e.target.value))}
            >
              {MINUTES.map((m) => (
                <option key={m} value={m}>
                  {String(m).padStart(2, '0')}分
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="ja-field" style={{ marginBottom: 16 }}>
        <label>性別</label>
        <div className="ja-radio-group">
          <label className={`ja-radio ${value.gender === 'female' ? 'active' : ''}`}>
            <input
              type="radio"
              checked={value.gender === 'female'}
              onChange={() => set('gender', 'female')}
            />
            女性
          </label>
          <label className={`ja-radio ${value.gender === 'male' ? 'active' : ''}`}>
            <input
              type="radio"
              checked={value.gender === 'male'}
              onChange={() => set('gender', 'male')}
            />
            男性
          </label>
        </div>
      </div>

      <div className="ja-field" style={{ marginBottom: 0 }}>
        <label>出生地（都道府県）</label>
        <select
          className="ja-select"
          aria-label={`${label}の出生都道府県`}
          value={value.prefecture}
          onChange={(e) => set('prefecture', e.target.value)}
        >
          {PREFECTURES_JA.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function PairFormJa() {
  const router = useRouter();
  const thisYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: thisYear - 1929 }, (_, i) => thisYear - i),
    [thisYear],
  );

  const initial = (prefecture: string): PersonState => ({
    year: 1990,
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
    unknown: false,
    gender: 'female',
    prefecture,
  });

  const [a, setA] = useState<PersonState>(initial('東京都'));
  const [b, setB] = useState<PersonState>(initial('東京都'));
  const [error, setError] = useState('');

  const submit = () => {
    setError('');
    if (!isValidGregorianDate(a.year, a.month, a.day) || !isValidGregorianDate(b.year, b.month, b.day)) {
      setError('存在しない日付があります。生年月日を確認してください。');
      return;
    }
    const params = new URLSearchParams();
    const put = (prefix: 'a' | 'b', p: PersonState) => {
      params.set(`${prefix}_y`, String(p.year));
      params.set(`${prefix}_m`, String(p.month));
      params.set(`${prefix}_d`, String(p.day));
      params.set(`${prefix}_g`, p.gender === 'male' ? 'm' : 'f');
      params.set(`${prefix}_p`, p.prefecture);
      if (p.unknown) params.set(`${prefix}_u`, '1');
      else {
        params.set(`${prefix}_h`, String(p.hour));
        params.set(`${prefix}_mi`, String(p.minute));
      }
    };
    put('a', a);
    put('b', b);
    trackJa('jp_aishou_submit', { a_unknown: a.unknown, b_unknown: b.unknown });
    router.push(`/ja/aishou/result?${params.toString()}`);
  };

  return (
    <div>
      <div className="ja-pair-grid">
        <PersonFields label="あなた" value={a} onChange={setA} years={years} />
        <PersonFields label="お相手" value={b} onChange={setB} years={years} />
      </div>

      {error && <p className="ja-error">{error}</p>}

      <button type="button" className="ja-btn" style={{ width: '100%', marginTop: 18 }} onClick={submit}>
        相性を診断する
      </button>
      <p className="ja-hint" style={{ textAlign: 'center' }}>
        登録不要・無料・お相手の同意を得たうえでご利用ください
      </p>
    </div>
  );
}
