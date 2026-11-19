import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { generateChart } from '@/lib/ziwei/algorithm';
import { detectPatterns } from '@/lib/ziwei/patterns';
import { isValidZhBirthInput, zhBirthToChartInput, type ZhBirthInput } from '@/lib/zh/birth';
import { buildZhFacts } from '@/lib/zh/facts';
import { buildFreeReading } from '@/lib/zh/interpret';
import { shichenZh } from '@/lib/zh/cities';
import { signAiToken } from '@/lib/jp/ai-token';
import { birthKey } from '@/lib/jp/access';
import { isLlmEnabled } from '@/lib/jp/llm';
import Meiban from '@/components/zh/Meiban';
import AiReading from '@/components/zh/AiReading';
import { worryOf, orderSections } from '@/lib/zh/worry';

export const metadata: Metadata = {
  title: '診斷結果',
  robots: { index: false, follow: false },
};

type SP = Promise<Record<string, string | string[] | undefined>>;

function one(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? '') : (v ?? '');
}

export default async function ResultPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const input: ZhBirthInput = {
    year: Number(one(sp.y)),
    month: Number(one(sp.m)),
    day: Number(one(sp.d)),
    clockHour: Number(one(sp.h)),
    clockMinute: Number(one(sp.mi)),
    unknownTime: one(sp.u) === '1',
    city: one(sp.p) || '台北市',
    gender: one(sp.g) === 'm' ? 'male' : 'female',
  };

  if (!isValidZhBirthInput(input)) {
    return (
      <main>
        <div className="ja-wrap-narrow" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, marginBottom: 16 }}>請確認輸入內容</h1>
          <p style={{ color: '#a49e8f', marginBottom: 28 }}>
            出生年月日或時刻不正確，請重新輸入。
          </p>
          <Link href="/zh/shindan" className="ja-btn">回到輸入畫面</Link>
        </div>
      </main>
    );
  }

  const birth = zhBirthToChartInput(input);
  const chart = generateChart(birth.birthInfo);
  const thisYear = new Date().getFullYear();
  const rawYear = Number(one(sp.year));
  const flowYear = rawYear >= 2020 && rawYear <= 2100 ? rawYear : thisYear;
  const facts = buildZhFacts(chart, flowYear, detectPatterns(chart));
  const reading = buildFreeReading(facts);

  const h = await headers();
  const ip =
    h.get('x-nf-client-connection-ip') ||
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';
  const aiToken = signAiToken(ip, birthKey({ ...input, prefecture: input.city }));
  const worry = worryOf(one(sp.w));
  const orderedSections = orderSections(reading.sections, worry);

  const dateText = `${input.year} 年 ${input.month} 月 ${input.day} 日`;
  const timeText = input.unknownTime
    ? '時刻不清楚（以正午計算）'
    : `${String(input.clockHour).padStart(2, '0')}:${String(input.clockMinute).padStart(2, '0')}`;

  return (
    <main>
      <section className="ja-hero" style={{ padding: '44px 0 20px' }}>
        <div className="ja-wrap-narrow">
          <div className="ja-eyebrow">DIAGNOSIS RESULT</div>
          {worry && (
            <div
              style={{
                margin: '0 0 20px',
                padding: '14px 18px',
                borderLeft: '3px solid #c9a54a',
                background: 'rgba(201,165,74,0.08)',
                borderRadius: 8,
                fontSize: 14,
                lineHeight: 1.95,
                color: '#e6dfd0',
              }}
            >
              {worry.empathy}
            </div>
          )}
          <h1 style={{ fontSize: 'clamp(22px, 3.6vw, 32px)' }}>{reading.headline}</h1>
          <p>{reading.lead}</p>
        </div>
      </section>

      <div className="ja-wrap-narrow" style={{ padding: '0 20px 72px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 10,
            marginBottom: 26,
            fontSize: 13,
            color: '#a49e8f',
          }}
        >
          <div><b style={{ color: '#e6dfd0' }}>出生年月日</b><br />{dateText}</div>
          <div><b style={{ color: '#e6dfd0' }}>出生時刻</b><br />{timeText}</div>
          <div><b style={{ color: '#e6dfd0' }}>性別</b><br />{input.gender === 'male' ? '男性' : '女性'}</div>
          <div><b style={{ color: '#e6dfd0' }}>出生地</b><br />{input.city}</div>
          <div><b style={{ color: '#e6dfd0' }}>命宮</b><br />{facts.ming.branchName} ・ {shichenZh(facts.ming.branch)}</div>
          <div><b style={{ color: '#e6dfd0' }}>五行局</b><br />{facts.wuxingJuName}</div>
          <div><b style={{ color: '#e6dfd0' }}>年齡</b><br />{facts.age} 歲（虛歲）</div>
          <div><b style={{ color: '#e6dfd0' }}>讀取的年</b><br />{facts.year} 年</div>
        </div>

        <div className="ja-grid-3" style={{ marginBottom: 28 }}>
          {reading.highlights.map((h) => (
            <div key={h.label} className="ja-card">
              <span className="ja-card-label">{h.label}</span>
              <h3>{h.title}</h3>
              <p>{h.body}</p>
            </div>
          ))}
        </div>

        <div className="ja-card" style={{ marginBottom: 28 }}>
          <span className="ja-card-label">你的命盤</span>
          <p style={{ fontSize: 13, color: '#a49e8f', margin: '4px 0 14px' }}>
            12 個宮位裡，配置著你出生時的星曜。金色外框是命宮。
          </p>
          <Meiban facts={facts} />
        </div>

        {orderedSections.map((s) => (
          <article key={s.key} className="ja-article">
            <h2>{s.title}</h2>
            <p>{s.body}</p>
          </article>
        ))}

        <AiReading
          params={{
            y: input.year,
            m: input.month,
            d: input.day,
            h: input.clockHour,
            mi: input.clockMinute,
            u: input.unknownTime,
            g: input.gender === 'male' ? 'm' : 'f',
            p: input.city,
          }}
          enabled={isLlmEnabled()}
          type={worry?.focus ?? 'general'}
          token={aiToken}
        />

        <p className="ja-disclaimer">
          本結果是以紫微斗數進行自我理解的娛樂性內容，不保證未來結果，
          也不能取代醫療、法律、投資等專業建議。若出生時刻不準確，命盤可能不同。
        </p>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/zh/shindan" className="ja-btn ja-btn-ghost ja-btn-sm">重新診斷</Link>
        </div>
      </div>
    </main>
  );
}
