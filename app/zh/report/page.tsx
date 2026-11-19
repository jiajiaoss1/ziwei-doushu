import type { Metadata } from 'next';
import Link from 'next/link';
import { generateChart } from '@/lib/ziwei/algorithm';
import { isValidZhBirthInput, zhBirthToChartInput, type ZhBirthInput } from '@/lib/zh/birth';
import { buildZhFacts } from '@/lib/zh/facts';
import { detectPatterns } from '@/lib/ziwei/patterns';
import { buildReport, type ReportType } from '@/lib/zh/report';
import { isBetaFree, verifyUnlock, birthKey } from '@/lib/jp/access';
import { formatZhPrice } from '@/lib/zh/pricing';
import { worryOf } from '@/lib/zh/worry';
import Meiban from '@/components/zh/Meiban';

export const metadata: Metadata = {
  title: '鑑定書',
  robots: { index: false, follow: false },
};

type SP = Promise<Record<string, string | string[] | undefined>>;

function one(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? '') : (v ?? '');
}

function paragraphs(text: string): string[] {
  const parts = text
    .split('。')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => `${s}。`);
  const out: string[] = [];
  for (let i = 0; i < parts.length; i += 2) {
    out.push(parts.slice(i, i + 2).join(''));
  }
  return out;
}

export default async function ReportPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const type: ReportType = one(sp.type) === 'work' ? 'work' : 'love';
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
  const report = buildReport(facts, type);
  const key = birthKey({ ...input, prefecture: input.city });
  const worry = worryOf(one(sp.w));
  const beta = isBetaFree();
  const full = beta || verifyUnlock(one(sp.t) || undefined, type, key);
  const visibleSections = full ? report.sections : report.sections.slice(0, 2);
  const lockedSections = full ? [] : report.sections.slice(2);

  const focus = type === 'love' ? '夫妻' : '官禄';
  const focusLabel = type === 'love' ? '夫妻宮（感情）' : '官祿宮（工作）';
  const otherType: ReportType = type === 'love' ? 'work' : 'love';
  const otherLabel = otherType === 'love' ? '感情鑑定書' : '事業鑑定書';
  const qs = new URLSearchParams({
    y: String(input.year),
    m: String(input.month),
    d: String(input.day),
    g: input.gender === 'male' ? 'm' : 'f',
    p: input.city,
    ...(input.unknownTime
      ? { u: '1' }
      : { h: String(input.clockHour), mi: String(input.clockMinute) }),
    ...(flowYear !== thisYear ? { year: String(flowYear) } : {}),
  });

  return (
    <main>
      <section className="ja-result-head">
        <div className="ja-wrap-narrow">
          <div className="ja-eyebrow">
            PREMIUM REPORT ・ {beta ? 'Beta 免費公開中' : full ? '已購買' : '付費鑑定'}
          </div>
          {worry && (
            <p
              style={{
                margin: '0 0 14px',
                fontSize: 13.5,
                lineHeight: 1.9,
                color: '#a49e8f',
                borderLeft: '3px solid rgba(201,165,74,0.6)',
                paddingLeft: 14,
              }}
            >
              {worry.empathy}
            </p>
          )}
          <h1>{report.title}</h1>
          <p style={{ color: '#a49e8f', fontSize: 14, margin: 0 }}>{report.subtitle}</p>
          <div className="ja-meta">
            <span><b>出生年月日</b> {input.year}年{input.month}月{input.day}日</span>
            <span><b>性別</b> {input.gender === 'male' ? '男性' : '女性'}</span>
            <span><b>出生地</b> {input.city}</span>
            <span><b>著重</b> {focusLabel}</span>
            <span><b>讀取的年</b> {facts.year}年</span>
          </div>
        </div>
      </section>

      <div className="ja-wrap-narrow" style={{ padding: '32px 20px 72px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(201,165,74,0.14), rgba(17,26,51,0.6))',
            border: '1px solid rgba(201,165,74,0.35)',
            borderRadius: 14,
            padding: '22px 24px',
            marginBottom: 34,
          }}
        >
          <div style={{ fontSize: 11, letterSpacing: '0.24em', color: '#e3c473', marginBottom: 12 }}>
            三行摘要
          </div>
          {report.summary.map((s) => (
            <p key={s} style={{ margin: '0 0 10px', fontSize: 14, color: '#e6dfd0', lineHeight: 1.9 }}>
              {s}
            </p>
          ))}
        </div>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 19, letterSpacing: '0.1em', marginBottom: 14 }}>
            命盤（強調{focusLabel}）
          </h2>
          <Meiban facts={facts} focus={focus} />
        </section>

        <div className="ja-reading">
          {visibleSections.map((s) => (
            <article key={s.title} className="ja-article">
              <h2>{s.title}</h2>
              {paragraphs(s.body).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </article>
          ))}
        </div>

        {!full && lockedSections.length > 0 && (
          <div
            style={{
              border: '1px solid rgba(201,165,74,0.4)',
              borderRadius: 14,
              padding: '26px 24px',
              marginTop: 8,
              background: 'linear-gradient(135deg, rgba(201,165,74,0.1), rgba(17,26,51,0.7))',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 11, letterSpacing: '0.24em', color: '#e3c473', marginBottom: 10 }}>
              LOCKED
            </div>
            <h3 style={{ fontSize: 18, margin: '0 0 8px', letterSpacing: '0.08em' }}>
              以下是付費內容
            </h3>
            <p style={{ fontSize: 13, color: '#a49e8f', margin: '0 0 6px' }}>
              {lockedSections.map((s) => s.title).join(' / ')}
            </p>
            <p style={{ fontSize: 13, color: '#a49e8f', margin: '0 0 18px' }}>
              事業鑑定書 全文 ・ {formatZhPrice('work')}（含稅）
            </p>
            <Link href={`/zh/report?${qs.toString()}&type=work`} className="ja-btn ja-btn-sm">
              閱讀全文
            </Link>
            <p style={{ fontSize: 11, color: '#8a8577', marginTop: 12 }}>
              付款方式準備中。目前以 Beta 版免費公開。
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
          <Link
            href={`/zh/report?${qs.toString()}&type=${otherType}`}
            className="ja-btn ja-btn-sm"
          >
            閱讀{otherLabel}
          </Link>
          <Link href={`/zh/result?${qs.toString()}`} className="ja-btn ja-btn-ghost ja-btn-sm">
            回到診斷結果
          </Link>
        </div>

        <p className="ja-disclaimer">
          本鑑定書是以紫微斗數進行自我理解的娛樂性內容，不保證未來結果或特定行動，
          也不能取代醫療、法律、投資等專業建議。{beta
            ? 'Beta 期間免費公開。'
            : full
              ? '本報告已購買。'
              : '付費內容全文將於付款後顯示。'}
        </p>
      </div>
    </main>
  );
}
