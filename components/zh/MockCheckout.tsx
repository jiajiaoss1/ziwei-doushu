'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CHECK_STORAGE_KEY,
  DECISION_LABEL,
  STATUS_LABEL,
  type CheckInput,
} from '@/lib/zh/check';
import {
  ZH_PAID_STORAGE_KEY,
  ZH_PRICE_EARLY,
  ZH_PRICE_ORIGINAL,
  type CheckoutDetails,
} from '@/lib/zh/checkout';
import { CITIES_ZH } from '@/lib/zh/cities';
import { trackZh } from '@/lib/zh/analytics';

const TAIWAN = CITIES_ZH.filter((c) => c.name !== '香港' && c.name !== '澳門');
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

export default function MockCheckout() {
  const router = useRouter();
  const [check, setCheck] = useState<CheckInput | null>(null);
  const [unknownTime, setUnknownTime] = useState(false);
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [city, setCity] = useState('台北市');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    trackZh('zh_checkout_start');
    try {
      const raw = sessionStorage.getItem(CHECK_STORAGE_KEY);
      if (!raw) {
        router.replace('/zh/check');
        return;
      }
      setCheck(JSON.parse(raw) as CheckInput);
    } catch {
      router.replace('/zh/check');
    }
  }, [router]);

  const dateText = useMemo(
    () => (check ? `${check.year} 年 ${check.month} 月 ${check.day} 日` : ''),
    [check],
  );

  async function submit() {
    if (!check) return;
    setError('');
    if (!agree) {
      setError('請先確認服務條款與退款政策。');
      return;
    }
    setSubmitting(true);
    try {
      const details: CheckoutDetails = {
        ...check,
        clockHour: unknownTime ? 12 : hour,
        clockMinute: unknownTime ? 0 : minute,
        unknownTime,
        city,
      };
      const res = await fetch('/api/zh/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });
      const json = (await res.json()) as { mock?: boolean; error?: string };
      if (!res.ok || !json.mock) {
        setError('目前無法建立測試訂單，請稍後再試。');
        return;
      }
      sessionStorage.setItem(ZH_PAID_STORAGE_KEY, JSON.stringify(details));
      trackZh('zh_mock_paid', { amount: ZH_PRICE_EARLY, currency: 'TWD' });
      router.push('/zh/sample?mock=1');
    } catch {
      setError('目前無法建立測試訂單，請稍後再試。');
    } finally {
      setSubmitting(false);
    }
  }

  if (!check) {
    return (
      <div className="ja-wrap-narrow" style={{ padding: '80px 20px', textAlign: 'center', color: '#a49e8f' }}>
        正在讀取你的自查…
      </div>
    );
  }

  return (
    <div className="ja-form" style={{ maxWidth: 620, margin: '0 auto' }}>
      <div className="ja-card" style={{ marginBottom: 20 }}>
        <span className="ja-card-label">你的自查</span>
        <h3 style={{ fontSize: 18 }}>{dateText}｜{STATUS_LABEL[check.status]}｜{DECISION_LABEL[check.decision]}</h3>
        {check.note && <p style={{ color: '#a49e8f', fontSize: 13 }}>「{check.note}」</p>}
      </div>

      <div className="ja-field">
        <label>出生時刻（可不知道）</label>
        <label className="ja-check" style={{ marginBottom: 10 }}>
          <input type="checkbox" checked={unknownTime} onChange={(e) => setUnknownTime(e.target.checked)} />
          不知道時辰，用午時 12:00 推算
        </label>
        {!unknownTime && (
          <div className="ja-row">
            <select className="ja-select" aria-label="出生時刻（時）" value={hour} onChange={(e) => setHour(Number(e.target.value))}>
              {HOURS.map((h) => <option key={h} value={h}>{String(h).padStart(2, '0')} 時</option>)}
            </select>
            <select className="ja-select" aria-label="出生時刻（分）" value={minute} onChange={(e) => setMinute(Number(e.target.value))}>
              {MINUTES.map((m) => <option key={m} value={m}>{String(m).padStart(2, '0')} 分</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="ja-field">
        <label>出生縣市（真太陽時校正用）</label>
        <select className="ja-select" aria-label="出生縣市" value={city} onChange={(e) => setCity(e.target.value)}>
          {TAIWAN.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>
        <p className="ja-hint" style={{ marginTop: 8 }}>不知道時辰也可以買；報告會標註「以午時推算」。</p>
      </div>

      <div style={{ padding: '16px 18px', border: '1px solid rgba(201,165,74,0.25)', borderRadius: 12, margin: '18px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
          <strong>關係決策書</strong>
          <span style={{ color: '#e3c473' }}>NT${ZH_PRICE_EARLY} <small style={{ color: '#8a8577' }}>原價 NT${ZH_PRICE_ORIGINAL}</small></span>
        </div>
        <p className="ja-hint" style={{ margin: '8px 0 0' }}>7 天內、未打開報告可退。測試模式不會向你收費。</p>
      </div>

      <label className="ja-check" style={{ alignItems: 'flex-start', lineHeight: 1.8 }}>
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        <span>我已閱讀並同意服務條款與退款政策。</span>
      </label>

      {error && <p className="ja-error">{error}</p>}

      <button type="button" className="ja-btn" style={{ width: '100%', marginTop: 18 }} onClick={submit} disabled={submitting}>
        {submitting ? '建立測試訂單中…' : '模擬付款（不會收費）'}
      </button>
      <p className="ja-hint" style={{ textAlign: 'center', marginTop: 10 }}>
        目前為測試模式，尚未接真實支付；不會產生真實訂單。
      </p>
      <p style={{ textAlign: 'center', marginTop: 14 }}>
        <Link href="/zh/check/result" className="ja-btn ja-btn-ghost ja-btn-sm">回初步整理</Link>
      </p>
    </div>
  );
}
