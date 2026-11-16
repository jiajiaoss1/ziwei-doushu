'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PREFECTURES_JA } from '@/lib/jp/cities';
import { calculateTrueSolarTime, isValidGregorianDate } from '@/lib/ziwei/true-solar-time';
import { JST_OFFSET_MINUTES } from '@/lib/jp/cities';
import { shichenJa } from '@/lib/jp/birth';
import { trackJa } from '@/lib/jp/analytics';

export interface BirthFormInitial {
  year?: number;
  month?: number;
  day?: number;
  clockHour?: number;
  clockMinute?: number;
  unknownTime?: boolean;
  prefecture?: string;
  gender?: 'male' | 'female';
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

export default function BirthFormJa({
  initial,
  flowYear,
}: {
  initial?: BirthFormInitial;
  /** 読む年（流年）。指定すると結果URLに year を引き継ぐ */
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
  const [prefecture, setPrefecture] = useState(initial?.prefecture ?? '東京都');
  const [error, setError] = useState('');

  const pref = PREFECTURES_JA.find((p) => p.name === prefecture);

  const solar = useMemo(() => {
    if (unknown) return null;
    if (!isValidGregorianDate(year, month, day)) return null;
    return calculateTrueSolarTime({
      year,
      month,
      day,
      clockHour: hour,
      clockMinute: minute,
      longitude: pref?.longitude,
      utcOffsetMinutes: JST_OFFSET_MINUTES,
    });
  }, [unknown, year, month, day, hour, minute, pref?.longitude]);

  const daysInMonth = new Date(year, month, 0).getDate();

  const submit = () => {
    setError('');
    if (!isValidGregorianDate(year, month, day)) {
      setError('存在しない日付です。生年月日を確認してください。');
      return;
    }
    const params = new URLSearchParams({
      y: String(year),
      m: String(month),
      d: String(day),
      g: gender,
      p: prefecture,
    });
    if (unknown) params.set('u', '1');
    else {
      params.set('h', String(hour));
      params.set('mi', String(minute));
    }
    trackJa('jp_diagnosis_submit', {
      unknown_time: unknown,
      gender,
      prefecture,
    });
    router.push(`/ja/result?${params.toString()}`);
  };

  return (
    <div className="ja-form">
      <div className="ja-field">
        <label>生年月日（西暦）</label>
        <div className="ja-row">
          <select className="ja-select" aria-label="生まれた年" value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}年
              </option>
            ))}
          </select>
          <select className="ja-select" aria-label="生まれた月" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}月
              </option>
            ))}
          </select>
          <select className="ja-select" aria-label="生まれた日" value={day} onChange={(e) => setDay(Number(e.target.value))}>
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}日
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="ja-field">
        <label>出生時刻</label>
        <label className="ja-check" style={{ marginBottom: 10 }}>
          <input
            type="checkbox"
            checked={unknown}
            onChange={(e) => setUnknown(e.target.checked)}
          />
          出生時刻がわからない
        </label>
        {!unknown && (
          <div className="ja-row">
            <select
              className="ja-select"
              aria-label="出生時刻（時）"
              value={hour}
              onChange={(e) => setHour(Number(e.target.value))}
            >
              {HOURS.map((h) => (
                <option key={h} value={h}>
                  {String(h).padStart(2, '0')}時
                </option>
              ))}
            </select>
            <select
              className="ja-select"
              aria-label="出生時刻（分）"
              value={minute}
              onChange={(e) => setMinute(Number(e.target.value))}
            >
              {MINUTES.map((m) => (
                <option key={m} value={m}>
                  {String(m).padStart(2, '0')}分
                </option>
              ))}
            </select>
          </div>
        )}
        {!unknown && solar && pref && (
          <p className="ja-hint" style={{ marginTop: 8 }}>
            真太陽時 {String(solar.hour).padStart(2, '0')}:
            {String(solar.minute).padStart(2, '0')}（
            {solar.totalCorrectionMinutes >= 0 ? '+' : ''}
            {Math.round(solar.totalCorrectionMinutes)}分）／{shichenJa(solar.branch)}の刻
          </p>
        )}
        {unknown && (
          <p className="ja-hint" style={{ marginTop: 8 }}>
            時刻が不明の場合、正午（12:00）で計算します。
          </p>
        )}
      </div>

      <div className="ja-field">
        <label>性別</label>
        <div className="ja-radio-group">
          <label className={`ja-radio ${gender === 'female' ? 'active' : ''}`}>
            <input
              type="radio"
              name="gender"
              checked={gender === 'female'}
              onChange={() => setGender('female')}
            />
            女性
          </label>
          <label className={`ja-radio ${gender === 'male' ? 'active' : ''}`}>
            <input
              type="radio"
              name="gender"
              checked={gender === 'male'}
              onChange={() => setGender('male')}
            />
            男性
          </label>
        </div>
      </div>

      <div className="ja-field">
        <label>出生地（都道府県）</label>
        <select
          className="ja-select"
          aria-label="出生都道府県"
          value={prefecture}
          onChange={(e) => setPrefecture(e.target.value)}
        >
          {PREFECTURES_JA.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}（{p.capital}）
            </option>
          ))}
        </select>
        <p className="ja-hint" style={{ marginTop: 8 }}>
          真太陽時の補正にのみ使用します。わからない場合は東京で計算します。
        </p>
      </div>

      {error && <p className="ja-error">{error}</p>}

      <button type="button" className="ja-btn" style={{ width: '100%' }} onClick={submit}>
        無料で診断する
      </button>
      <p className="ja-hint" style={{ textAlign: 'center' }}>
        登録不要・約30秒で結果が表示されます
      </p>
    </div>
  );
}
