'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CHECK_STORAGE_KEY,
  DECISION_LABEL,
  STATUS_LABEL,
  TRIED_LABEL,
  isAdultBirthDate,
  type CheckInput,
  type Decision,
  type RelationshipStatus,
  type Tried,
} from '@/lib/zh/check';
import { trackZh } from '@/lib/zh/analytics';

type FormState = {
  year: number;
  month: number;
  day: number;
  status: RelationshipStatus | '';
  decision: Decision | '';
  tried: Tried[];
  note: string;
};

const THIS_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: THIS_YEAR - 1939 }, (_, i) => THIS_YEAR - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const STATUS_ORDER: RelationshipStatus[] = [
  'dating',
  'cohabiting',
  'married',
  'separated',
  'divorce_considering',
  'other',
];
const DECISION_ORDER: Decision[] = ['stay', 'talk', 'leave', 'unknown'];
const TRIED_ORDER: Tried[] = ['friends', 'tarot', 'temple', 'teacher', 'ai', 'self', 'none'];

export default function SelfCheck() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    year: 1990,
    month: 1,
    day: 1,
    status: '',
    decision: '',
    tried: [],
    note: '',
  });
  const [error, setError] = useState('');

  const daysInMonth = new Date(form.year, form.month, 0).getDate();

  useEffect(() => {
    trackZh('zh_check_start');
    try {
      const raw = sessionStorage.getItem(CHECK_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<FormState>;
        setForm((prev) => ({ ...prev, ...parsed, tried: Array.isArray(parsed.tried) ? parsed.tried : prev.tried }));
      }
    } catch {
      // sessionStorage 不可用時，從頭開始
    }
  }, []);

  const progress = useMemo(() => (step / 4) * 100, [step]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  }

  function validateStep(current: number): boolean {
    if (current === 1) {
      if (!isAdultBirthDate(form.year, form.month, form.day)) {
        setError('本服務限 18 歲以上；請確認出生年月日。');
        return false;
      }
    }
    if (current === 2 && !form.status) {
      setError('請選擇目前的關係狀態。');
      return false;
    }
    if (current === 3 && !form.decision) {
      setError('請選擇你現在最想決定的事。');
      return false;
    }
    if (current === 4 && form.tried.length === 0) {
      setError('請至少選一個你試過的方式；沒有也可以選「沒有」。');
      return false;
    }
    return true;
  }

  function next() {
    if (!validateStep(step)) return;
    const nextStep = Math.min(4, step + 1);
    setStep(nextStep);
    trackZh('zh_check_step', { step: nextStep });
  }

  function back() {
    setError('');
    setStep((s) => Math.max(1, s - 1));
  }

  function submit() {
    if (!validateStep(4)) return;
    if (!form.status || !form.decision) {
      setError('請完成前面的步驟。');
      return;
    }
    const input: CheckInput = {
      year: form.year,
      month: form.month,
      day: form.day,
      status: form.status,
      decision: form.decision,
      tried: form.tried,
      note: form.note.trim() || undefined,
    };
    try {
      sessionStorage.setItem(CHECK_STORAGE_KEY, JSON.stringify(input));
    } catch {
      setError('無法暫存資料，請確認瀏覽器允許網站儲存。');
      return;
    }
    trackZh('zh_check_complete', {
      status: input.status,
      decision: input.decision,
      tried_count: input.tried.length,
    });
    router.push('/zh/check/result');
  }

  function toggleTried(value: Tried) {
    setError('');
    if (value === 'none') {
      set('tried', form.tried.includes('none') ? [] : ['none']);
      return;
    }
    const withoutNone = form.tried.filter((x) => x !== 'none');
    set('tried', withoutNone.includes(value) ? withoutNone.filter((x) => x !== value) : [...withoutNone, value]);
  }

  return (
    <div className="ja-form" style={{ maxWidth: 620, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span className="ja-eyebrow" style={{ margin: 0 }}>STEP {step} / 4</span>
          <span style={{ fontSize: 12, color: '#a49e8f' }}>約 5 分鐘</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: '#c9a54a', transition: 'width .25s ease' }} />
        </div>
      </div>

      {step === 1 && (
        <>
          <div className="ja-field">
            <label>你的出生年月日（西元）</label>
            <div className="ja-row">
              <select className="ja-select" aria-label="出生年份" value={form.year} onChange={(e) => set('year', Number(e.target.value))}>
                {YEARS.map((y) => <option key={y} value={y}>{y} 年</option>)}
              </select>
              <select className="ja-select" aria-label="出生月份" value={form.month} onChange={(e) => set('month', Number(e.target.value))}>
                {MONTHS.map((m) => <option key={m} value={m}>{m} 月</option>)}
              </select>
              <select className="ja-select" aria-label="出生日期" value={form.day} onChange={(e) => set('day', Number(e.target.value))}>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d} 日</option>)}
              </select>
            </div>
            <p className="ja-hint" style={{ marginTop: 10 }}>
              現在不用填時辰。之後補上時辰與縣市，命盤會更完整。
            </p>
          </div>
          <p className="ja-hint">本服務限 18 歲以上。生日不會放進網址。</p>
        </>
      )}

      {step === 2 && (
        <div className="ja-field">
          <label>你目前的關係狀態</label>
          <div className="ja-radio-group" style={{ flexWrap: 'wrap' }}>
            {STATUS_ORDER.map((s) => (
              <label key={s} className={`ja-radio ${form.status === s ? 'active' : ''}`}>
                <input type="radio" name="status" checked={form.status === s} onChange={() => set('status', s)} />
                {STATUS_LABEL[s]}
              </label>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <>
          <div className="ja-field">
            <label>你現在最想決定的事</label>
            <div className="ja-radio-group" style={{ flexWrap: 'wrap' }}>
              {DECISION_ORDER.map((d) => (
                <label key={d} className={`ja-radio ${form.decision === d ? 'active' : ''}`}>
                  <input type="radio" name="decision" checked={form.decision === d} onChange={() => set('decision', d)} />
                  {DECISION_LABEL[d]}
                </label>
              ))}
            </div>
          </div>
          <div className="ja-field">
            <label>用一句話說你現在最卡的是什麼（可選）</label>
            <textarea
              className="ja-input"
              rows={3}
              maxLength={100}
              value={form.note}
              onChange={(e) => set('note', e.target.value)}
              placeholder="例如：他最近很冷淡，我不知道是工作忙，還是已經不想繼續。"
            />
            <p className="ja-hint">不要填姓名、電話、地址等個人資料。</p>
          </div>
        </>
      )}

      {step === 4 && (
        <div className="ja-field">
          <label>你已經試過哪些方式</label>
          <div style={{ display: 'grid', gap: 10 }}>
            {TRIED_ORDER.map((t) => (
              <label key={t} className={`ja-radio ${form.tried.includes(t) ? 'active' : ''}`} style={{ justifyContent: 'flex-start' }}>
                <input type="checkbox" checked={form.tried.includes(t)} onChange={() => toggleTried(t)} />
                {TRIED_LABEL[t]}
              </label>
            ))}
          </div>
        </div>
      )}

      {error && <p className="ja-error">{error}</p>}

      <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
        {step > 1 && (
          <button type="button" className="ja-btn ja-btn-ghost" style={{ flex: 1 }} onClick={back}>
            上一步
          </button>
        )}
        {step < 4 ? (
          <button type="button" className="ja-btn" style={{ flex: 2 }} onClick={next}>
            下一步
          </button>
        ) : (
          <button type="button" className="ja-btn" style={{ flex: 2 }} onClick={submit}>
            看我的初步整理
          </button>
        )}
      </div>

      <p className="ja-hint" style={{ textAlign: 'center', marginTop: 14 }}>
        免註冊。自查結果只留在這台裝置。
      </p>
    </div>
  );
}
