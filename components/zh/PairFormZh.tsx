'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CITIES_ZH } from '@/lib/zh/cities';
import { isValidGregorianDate } from '@/lib/ziwei/true-solar-time';
import { trackZh } from '@/lib/zh/analytics';

interface Person {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  unknown: boolean;
  gender: 'male' | 'female';
  city: string;
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
  value: Person;
  onChange: (p: Person) => void;
  years: number[];
}) {
  const daysInMonth = new Date(value.year, value.month, 0).getDate();
  return (
    <div className="ja-card" style={{ padding: '18px 18px 22px', marginBottom: 16 }}>
      <div className="ja-eyebrow" style={{ marginBottom: 10 }}>{label}</div>
      <div className="ja-field">
        <label>出生年月日（西元）</label>
        <div className="ja-row">
          <select className="ja-select" aria-label={`${label}的出生年`} value={value.year} onChange={(e) => onChange({ ...value, year: Number(e.target.value) })}>
            {years.map((y) => <option key={y} value={y}>{y}年</option>)}
          </select>
          <select className="ja-select" aria-label={`${label}的出生月`} value={value.month} onChange={(e) => onChange({ ...value, month: Number(e.target.value) })}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => <option key={m} value={m}>{m}月</option>)}
          </select>
          <select className="ja-select" aria-label={`${label}的出生日`} value={value.day} onChange={(e) => onChange({ ...value, day: Number(e.target.value) })}>
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}日</option>)}
          </select>
        </div>
      </div>
      <div className="ja-field">
        <label>出生時刻</label>
        <label className="ja-check" style={{ marginBottom: 8 }}>
          <input type="checkbox" checked={value.unknown} onChange={(e) => onChange({ ...value, unknown: e.target.checked })} />
          出生時刻不清楚
        </label>
        {!value.unknown && (
          <div className="ja-row">
            <select className="ja-select" aria-label={`${label}的出生時`} value={value.hour} onChange={(e) => onChange({ ...value, hour: Number(e.target.value) })}>
              {HOURS.map((h) => <option key={h} value={h}>{String(h).padStart(2, '0')}時</option>)}
            </select>
            <select className="ja-select" aria-label={`${label}的出生分`} value={value.minute} onChange={(e) => onChange({ ...value, minute: Number(e.target.value) })}>
              {MINUTES.map((m) => <option key={m} value={m}>{String(m).padStart(2, '0')}分</option>)}
            </select>
          </div>
        )}
      </div>
      <div className="ja-field">
        <label>性別</label>
        <div className="ja-radio-group">
          <label className={`ja-radio ${value.gender === 'female' ? 'active' : ''}`}>
            <input type="radio" name={`${label}-g`} checked={value.gender === 'female'} onChange={() => onChange({ ...value, gender: 'female' })} />
            女性
          </label>
          <label className={`ja-radio ${value.gender === 'male' ? 'active' : ''}`}>
            <input type="radio" name={`${label}-g`} checked={value.gender === 'male'} onChange={() => onChange({ ...value, gender: 'male' })} />
            男性
          </label>
        </div>
      </div>
      <div className="ja-field">
        <label>出生地（縣市）</label>
        <select className="ja-select" aria-label={`${label}的出生縣市`} value={value.city} onChange={(e) => onChange({ ...value, city: e.target.value })}>
          {CITIES_ZH.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>
      </div>
    </div>
  );
}

const INITIAL_A: Person = { year: 1990, month: 1, day: 1, hour: 12, minute: 0, unknown: false, gender: 'female', city: '台北市' };
const INITIAL_B: Person = { year: 1990, month: 1, day: 1, hour: 12, minute: 0, unknown: false, gender: 'male', city: '台北市' };

export default function PairFormZh() {
  const router = useRouter();
  const thisYear = new Date().getFullYear();
  const years = useMemo(() => Array.from({ length: thisYear - 1929 }, (_, i) => thisYear - i), [thisYear]);
  const [a, setA] = useState<Person>(INITIAL_A);
  const [b, setB] = useState<Person>(INITIAL_B);
  const [error, setError] = useState('');

  const submit = () => {
    setError('');
    for (const p of [a, b]) {
      if (!isValidGregorianDate(p.year, p.month, p.day)) {
        setError('出生年月日有誤，請確認。');
        return;
      }
    }
    const params = new URLSearchParams();
    const put = (prefix: 'a' | 'b', p: Person) => {
      params.set(`${prefix}_y`, String(p.year));
      params.set(`${prefix}_m`, String(p.month));
      params.set(`${prefix}_d`, String(p.day));
      params.set(`${prefix}_g`, p.gender === 'male' ? 'm' : 'f');
      params.set(`${prefix}_p`, p.city);
      if (p.unknown) params.set(`${prefix}_u`, '1');
      else {
        params.set(`${prefix}_h`, String(p.hour));
        params.set(`${prefix}_mi`, String(p.minute));
      }
    };
    put('a', a);
    put('b', b);
    trackZh('zh_aishou_submit', { a_unknown: a.unknown, b_unknown: b.unknown });
    router.push(`/zh/aishou/result?${params.toString()}`);
  };

  return (
    <div>
      <PersonFields label="你" value={a} onChange={setA} years={years} />
      <PersonFields label="對方" value={b} onChange={setB} years={years} />
      {error && <p className="ja-error">{error}</p>}
      <button type="button" className="ja-btn" style={{ width: '100%', marginTop: 8 }} onClick={submit}>
        免費看相性
      </button>
      <p className="ja-hint" style={{ textAlign: 'center' }}>免註冊・約 30 秒</p>
    </div>
  );
}
