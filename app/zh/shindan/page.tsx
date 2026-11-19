import type { Metadata } from 'next';
import Link from 'next/link';
import BirthFormZh from '@/components/zh/BirthFormZh';

export const metadata: Metadata = {
  title: '免費診斷｜只要輸入出生年月日',
  description:
    '輸入出生年月日・出生時刻・縣市，就能免費取得紫微斗數命盤，並解讀你的本質、感情與今年的主題。免註冊。',
  alternates: { canonical: '/zh/shindan' },
};

export default async function ShindanPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string | string[] }>;
}) {
  const sp = await searchParams;
  const rawYear = Array.isArray(sp.year) ? sp.year[0] : sp.year;
  const flowYear = rawYear ? Number(rawYear) : undefined;

  return (
    <main>
      <section className="ja-hero" style={{ padding: '48px 0 28px' }}>
        <div className="ja-wrap-narrow">
          <div className="ja-eyebrow">FREE DIAGNOSIS</div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)' }}>免費診斷</h1>
          <p>
            只要輸入出生年月日與出生地，就能計算你的命盤。
            {flowYear ? `（${flowYear} 年運勢模式）` : ''}
          </p>
        </div>
      </section>

      <div className="ja-wrap-narrow" style={{ padding: '0 20px 72px' }}>
        <BirthFormZh flowYear={flowYear} />

        <div
          style={{
            marginTop: 24,
            padding: '16px 18px',
            border: '1px solid rgba(201,165,74,0.18)',
            borderRadius: 12,
            fontSize: 12.5,
            color: '#a49e8f',
            lineHeight: 1.9,
          }}
        >
          <div style={{ color: '#e3c473', marginBottom: 6, letterSpacing: '0.08em' }}>輸入說明</div>
          <p style={{ margin: 0 }}>
            出生時刻不清楚時，請勾選「出生時刻不清楚」，系統會以正午計算。
            出生地僅用於真太陽時校正，以縣市為單位計算。
          </p>
        </div>

        <p className="ja-disclaimer">
          本服務是以紫微斗數進行自我理解的娛樂性內容，不保證未來結果，
          也不能取代醫療、法律、投資等專業建議。
        </p>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/zh" className="ja-btn ja-btn-ghost ja-btn-sm">回到首頁</Link>
        </div>
      </div>
    </main>
  );
}
