'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CHECK_STORAGE_KEY,
  DECISION_LABEL,
  STATUS_LABEL,
  TRIED_LABEL,
  buildLightCheck,
  type CheckInput,
  type LightCheckResult,
} from '@/lib/zh/check';
import { trackZh } from '@/lib/zh/analytics';

export default function SelfCheckResult() {
  const router = useRouter();
  const [input, setInput] = useState<CheckInput | null>(null);
  const [result, setResult] = useState<LightCheckResult | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(CHECK_STORAGE_KEY);
      if (!raw) {
        router.replace('/zh/check');
        return;
      }
      const parsed = JSON.parse(raw) as CheckInput;
      const built = buildLightCheck(parsed);
      setInput(parsed);
      setResult(built);
      trackZh('zh_result_view', { status: parsed.status, decision: parsed.decision });
    } catch {
      setFailed(true);
    }
  }, [router]);

  if (failed) {
    return (
      <main>
        <div className="ja-wrap-narrow" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, marginBottom: 16 }}>無法產生初步整理</h1>
          <p style={{ color: '#a49e8f', marginBottom: 24 }}>請重新做一次自查。</p>
          <Link href="/zh/check" className="ja-btn">回到自查</Link>
        </div>
      </main>
    );
  }

  if (!input || !result) {
    return (
      <main>
        <div className="ja-wrap-narrow" style={{ padding: '80px 20px', textAlign: 'center', color: '#a49e8f' }}>
          正在整理你的處境…
        </div>
      </main>
    );
  }

  function restart() {
    try {
      sessionStorage.removeItem(CHECK_STORAGE_KEY);
    } catch {
      // ignore
    }
    router.push('/zh/check');
  }

  return (
    <main>
      <section className="ja-hero" style={{ padding: '44px 0 20px' }}>
        <div className="ja-wrap-narrow">
          <div className="ja-eyebrow">YOUR FIRST CLARITY</div>
          <h1 style={{ fontSize: 'clamp(22px, 3.6vw, 32px)' }}>你的初步整理</h1>
          <p style={{ color: '#a49e8f' }}>
            {STATUS_LABEL[input.status]}｜{DECISION_LABEL[input.decision]}
          </p>
          <div
            style={{
              marginTop: 18,
              padding: '12px 15px',
              border: '1px solid rgba(201,165,74,0.25)',
              borderRadius: 10,
              background: 'rgba(201,165,74,0.07)',
              fontSize: 12.5,
              lineHeight: 1.9,
              color: '#d8cfb9',
            }}
          >
            {result.defaults}
          </div>
        </div>
      </section>

      <div className="ja-wrap-narrow" style={{ padding: '0 20px 72px' }}>
        <div className="ja-cards" style={{ marginTop: 8 }}>
          <div className="ja-card">
            <span className="ja-card-label">01 你現在最像在決定什麼</span>
            <h3 style={{ fontSize: 18, lineHeight: 1.7 }}>{result.decisionLine}</h3>
          </div>
          <div className="ja-card">
            <span className="ja-card-label">02 你最常卡住的模式</span>
            <h3 style={{ fontSize: 18, lineHeight: 1.7 }}>{result.patternLine}</h3>
            <p style={{ marginTop: 8, color: '#a49e8f', fontSize: 12.5 }}>{result.chartSummary}</p>
          </div>
          <div className="ja-card">
            <span className="ja-card-label">03 你下一步最該先確認什麼</span>
            <h3 style={{ fontSize: 18, lineHeight: 1.7 }}>{result.confirmLine}</h3>
          </div>
          <div className="ja-card" style={{ borderColor: 'rgba(201,165,74,0.4)' }}>
            <span className="ja-card-label">建議</span>
            <h3 style={{ fontSize: 17, lineHeight: 1.8 }}>{result.suggestion}</h3>
          </div>
        </div>

        {input.note && (
          <div style={{ marginTop: 18, padding: '14px 16px', borderLeft: '3px solid #c9a54a', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
            <div className="ja-eyebrow" style={{ marginBottom: 6 }}>你說的處境</div>
            <p style={{ margin: 0, color: '#d8cfb9', fontSize: 14, lineHeight: 1.9 }}>{input.note}</p>
          </div>
        )}

        <div style={{ marginTop: 22, padding: '18px 18px', border: '1px solid rgba(201,165,74,0.25)', borderRadius: 12 }}>
          <div className="ja-eyebrow">NEXT</div>
          <h2 style={{ fontSize: 20, margin: '4px 0 10px' }}>補上時辰，取得完整關係決策書</h2>
          <p style={{ color: '#a49e8f', fontSize: 13, lineHeight: 1.9 }}>
            完整版會把「繼續／談／離開」三個選項、溝通腳本與時機整理成一份可回看的報告。
          </p>
          <p style={{ color: '#e3c473', fontSize: 14, margin: '12px 0 4px' }}>
            早鳥 NT$680（原價 NT$980）
          </p>
          <p style={{ color: '#a49e8f', fontSize: 12, margin: 0 }}>7 天內、未打開報告可退。</p>
          <Link
            href="/zh/decision"
            className="ja-btn"
            style={{ marginTop: 16, width: '100%' }}
            onClick={() => trackZh('zh_pay_cta_click', { from: 'result' })}
          >
            補上時辰，取得完整關係決策書
          </Link>
          <p className="ja-hint" style={{ marginTop: 10, textAlign: 'center' }}>
            付款與完整報告目前準備中；你的自查結果已留在這台裝置。
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: 22 }}>
          <button type="button" className="ja-btn ja-btn-ghost ja-btn-sm" onClick={restart}>
            重新填寫
          </button>
        </div>

        <p className="ja-disclaimer">
          這是初步整理，不是完整命盤解讀，也不是外遇鑑定、法律、醫療或心理治療建議。不保證結果。
        </p>
      </div>
    </main>
  );
}
