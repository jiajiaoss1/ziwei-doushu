'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CITIES_ZH, CST_OFFSET_MINUTES, shichenZh } from '@/lib/zh/cities';
import { calculateTrueSolarTime, isValidGregorianDate } from '@/lib/ziwei/true-solar-time';
import { trackZh } from '@/lib/zh/analytics';

export interface BirthFormInitial {
  year?: number;
  month?: number;
  day?: number;
  clockHour?: number;
  clockMinute?: number;
  unknownTime?: boolean;
  city?: string;
  gender?: 'male' | 'female';
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

export default function BirthFormZh({
  initial,
  flowYear,
}: {
  initial?: BirthFormInitial;
  /** 讀取的年（流年）。指定時會带到結果 URL */
  flowYear?: number;
}) {
  const router = useRouter();
  const thisYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: thisYear - 1929 }, (_, i) => thisYear - i),
    [thisYear],
  );

  const [year, setYear] = useState(initial?.year ?? 1990);
  const [month, setMonth] = useState(initial?.month ?? 1);
  const [day, setDay] = useState(initial?.day ?? 1);
  const [hour, setHour] = useState(initial?.clockHour ?? 12);
  const [minute, setMinute] = useState(initial?.clockMinute ?? 0);
  const [unknown, setUnknown] = useState(initial?.unknownTime ?? false);
  const [gender, setGender] = useState<'male' | 'female'>(initial?.gender ?? 'female');
  const [city, setCity] = useState(initial?.city ?? '台北市');
  const [error, setError] = useState('');

  const spot = CITIES_ZH.find((c) => c.name === city);

  const solar = useMemo(() => {
    if (unknown) return null;
    if (!isValidGregorianDate(year, month, day)) return null;
    return calculateTrueSolarTime({
      year,
      month,
      day,
      clockHour: hour,
      clockMinute: minute,
      longitude: spot?.longitude,
      utcOffsetMinutes: CST_OFFSET_MINUTES,
    });
  }, [unknown, year, month, day, hour, minute, spot?.longitude]);

  const daysInMonth = new Date(year, month, 0).getDate();

  const submit = () => {
    setError('');
    if (!isValidGregorianDate(year, month, day)) {
      setError('這個日期不存在，請確認出生年月日。');
      return;
    }
    const params = new URLSearchParams({
      y: String(year),
      m: String(month),
      d: String(day),
      g: gender,
      p: city,
    });
    if (unknown) params.set('u', '1');
    else {
      params.set('h', String(hour));
      params.set('mi', String(minute));
    }
    trackZh('zh_diagnosis_submit', { unknown_time: unknown, gender, city });
    router.push(`/zh/result?${params.toString()}`);
  };

  return (
    <div className="ja-form">
      <div className="ja-field">
        <label>出生年月日（西元）</label>
        <div className="ja-row">
          <select className="ja-select" aria-label="出生年份" value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {years.map((y) => (
              <option key={y} value={y}>{y}年</option>
            ))}
          </select>
          <select className="ja-select" aria-label="出生月份" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>{m}月</option>
            ))}
          </select>
          <select className="ja-select" aria-label="出生日期" value={day} onChange={(e) => setDay(Number(e.target.value))}>
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>{d}日</option>
            ))}
          </select>
        </div>
      </div>

      <div className="ja-field">
        <label>出生時刻</label>
        <label className="ja-check" style={{ marginBottom: 10 }}>
          <input type="checkbox" checked={unknown} onChange={(e) => setUnknown(e.target.checked)} />
          出生時刻不清楚
        </label>
        {!unknown && (
          <div className="ja-row">
            <select className="ja-select" aria-label="出生時刻（時）" value={hour} onChange={(e) => setHour(Number(e.target.value))}>
              {HOURS.map((h) => (
                <option key={h} value={h}>{String(h).padStart(2, '0')}時</option>
              ))}
            </select>
            <select className="ja-select" aria-label="出生時刻（分）" value={minute} onChange={(e) => setMinute(Number(e.target.value))}>
              {MINUTES.map((m) => (
                <option key={m} value={m}>{String(m).padStart(2, '0')}分</option>
              ))}
            </select>
          </div>
        )}
        {!unknown && solar && spot && (
          <p className="ja-hint" style={{ marginTop: 8 }}>
            真太陽時 {String(solar.hour).padStart(2, '0')}:
            {String(solar.minute).padStart(2, '0')}（
            {solar.totalCorrectionMinutes >= 0 ? '+' : ''}
            {Math.round(solar.totalCorrectionMinutes)}分）／{shichenZh(solar.branch)}
          </p>
        )}
        {unknown && (
          <p className="ja-hint" style={{ marginTop: 8 }}>時刻不清楚時，以正午（12:00）計算。</p>
        )}
      </div>

      <div className="ja-field">
        <label>性別</label>
        <div className="ja-radio-group">
          <label className={`ja-radio ${gender === 'female' ? 'active' : ''}`}>
            <input type="radio" name="gender" checked={gender === 'female'} onChange={() => setGender('female')} />
            女性
          </label>
          <label className={`ja-radio ${gender === 'male' ? 'active' : ''}`}>
            <input type="radio" name="gender" checked={gender === 'male'} onChange={() => setGender('male')} />
            男性
          </label>
        </div>
      </div>

      <div className="ja-field">
        <label>出生地（縣市）</label>
        <select className="ja-select" aria-label="出生縣市" value={city} onChange={(e) => setCity(e.target.value)}>
          {CITIES_ZH.map((c) => (
            <option key={c.name} value={c.name}>{c.name}（{c.capital}）</option>
          ))}
        </select>
        <p className="ja-hint" style={{ marginTop: 8 }}>僅用於真太陽時校正；不清楚時以台北計算。</p>
      </div>

      {error && <p className="ja-error">{error}</p>}

      <button type="button" className="ja-btn" style={{ width: '100%' }} onClick={submit}>
        免費診斷
      </button>
      <p className="ja-hint" style={{ textAlign: 'center' }}>免註冊・約 30 秒顯示結果</p>
    </div>
  );
}
