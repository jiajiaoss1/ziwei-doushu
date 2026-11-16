import type { Metadata } from 'next';
import Link from 'next/link';
import { generateChart } from '@/lib/ziwei/algorithm';
import { isValidJpBirthInput, jpBirthToChartInput, type JpBirthInput } from '@/lib/jp/birth';
import { buildJpFacts } from '@/lib/jp/facts';
import { detectPatterns } from '@/lib/ziwei/patterns';
import { buildReport, type ReportType } from '@/lib/jp/report';
import { getReportAccess, REPORT_PRICES, birthKey } from '@/lib/jp/access';
import { resolveFlowYear } from '@/lib/jp/year';
import Meiban from '@/components/jp/Meiban';
import TrackView from '@/components/jp/TrackView';

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
  const input: JpBirthInput = {
    year: Number(one(sp.y)),
    month: Number(one(sp.m)),
    day: Number(one(sp.d)),
    clockHour: Number(one(sp.h)),
    clockMinute: Number(one(sp.mi)),
    unknownTime: one(sp.u) === '1',
    prefecture: one(sp.p) || '東京都',
    gender: one(sp.g) === 'm' ? 'male' : 'female',
  };

  if (!isValidJpBirthInput(input)) {
    return (
      <main>
        <div className="ja-wrap-narrow" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <h1 className="ja-serif" style={{ fontSize: 24, marginBottom: 16 }}>
            入力内容を確認してください
          </h1>
          <Link href="/ja/shindan" className="ja-btn">
            入力画面へ戻る
          </Link>
        </div>
      </main>
    );
  }

  const birth = jpBirthToChartInput(input);
  const chart = generateChart(birth.birthInfo);
  const thisYear = new Date().getFullYear();
  const flowYear = resolveFlowYear(one(sp.year), thisYear);
  const facts = buildJpFacts(chart, flowYear, detectPatterns(chart));
  const report = buildReport(facts, type);
  const key = birthKey(input);
  const access = getReportAccess(type, key, one(sp.t) || undefined);
  const visibleSections = access.full ? report.sections : report.sections.slice(0, 2);
  const lockedSections = access.full ? [] : report.sections.slice(2);

  const focus = type === 'love' ? '夫妻' : '官禄';
  const focusLabel = type === 'love' ? '夫妻宮（恋愛）' : '官禄宮（仕事）';
  const otherType: ReportType = type === 'love' ? 'work' : 'love';
  const otherLabel = otherType === 'love' ? '恋愛鑑定書' : '事業鑑定書';
  const qs = new URLSearchParams({
    y: String(input.year),
    m: String(input.month),
    d: String(input.day),
    g: input.gender === 'male' ? 'm' : 'f',
    p: input.prefecture,
    ...(input.unknownTime
      ? { u: '1' }
      : { h: String(input.clockHour), mi: String(input.clockMinute) }),
    ...(flowYear !== thisYear ? { year: String(flowYear) } : {}),
  });

  return (
    <main>
      <TrackView event="jp_report_view" props={{ type, full: access.full, beta: access.beta }} />
      <section className="ja-result-head">
        <div className="ja-wrap-narrow">
          <div className="ja-eyebrow">
            PREMIUM REPORT ・ {access.beta ? 'ベータ版無料公開中' : access.full ? '購入済み' : '有料鑑定'}
          </div>
          <h1>{report.title}</h1>
          <p style={{ color: '#a49e8f', fontSize: 14, margin: 0 }}>{report.subtitle}</p>
          <div className="ja-meta">
            <span>
              <b>生年月日</b> {input.year}年{input.month}月{input.day}日
            </span>
            <span>
              <b>性別</b> {input.gender === 'male' ? '男性' : '女性'}
            </span>
            <span>
              <b>出生地</b> {input.prefecture}
            </span>
            <span>
              <b>着目</b> {focusLabel}
            </span>
            <span>
              <b>読む年</b> {facts.year}年
            </span>
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
            3行サマリー
          </div>
          {report.summary.map((s) => (
            <p key={s} style={{ margin: '0 0 10px', fontSize: 14, color: '#e6dfd0', lineHeight: 1.9 }}>
              {s}
            </p>
          ))}
        </div>

        <section style={{ marginBottom: 36 }}>
          <h2 className="ja-serif" style={{ fontSize: 19, letterSpacing: '0.1em', marginBottom: 14 }}>
            命盤（{focusLabel}を強調）
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

        {!access.full && lockedSections.length > 0 && (
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
            <h3 className="ja-serif" style={{ fontSize: 18, margin: '0 0 8px', letterSpacing: '0.08em' }}>
              ここから先は有料パートです
            </h3>
            <p style={{ fontSize: 13, color: '#a49e8f', margin: '0 0 6px' }}>
              {lockedSections.map((s) => s.title).join(' / ')}
            </p>
            <p style={{ fontSize: 13, color: '#a49e8f', margin: '0 0 18px' }}>
              事業鑑定書 全文 ・ ¥{REPORT_PRICES.work.toLocaleString('ja-JP')}（税込）
            </p>
            <Link
              href={`/ja/checkout?${qs.toString()}&type=work`}
              className="ja-btn ja-btn-sm"
            >
              全文を読む
            </Link>
            <p style={{ fontSize: 11, color: '#8a8577', marginTop: 12 }}>
              決済は準備中です。現在はベータ版として無料公開しています。
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
          <Link
            href={`/ja/report?${qs.toString()}&type=${otherType}`}
            className="ja-btn ja-btn-sm"
          >
            {otherLabel}を読む
          </Link>
          <Link href={`/ja/result?${qs.toString()}`} className="ja-btn ja-btn-ghost ja-btn-sm">
            診断結果に戻る
          </Link>
        </div>

        <p className="ja-disclaimer">
          本鑑定書は、紫微斗数を用いた自己理解のためのエンターテインメントです。将来の結果や特定の行動を保証するものではなく、
          医療・法律・投資などの専門的な助言に代わるものではありません。{access.beta
            ? 'ベータ版期間中は無料で公開しています。'
            : access.full
              ? '本レポートは購入済みです。'
              : '有料パートの全文は、決済後にご覧いただけます。'}
        </p>
      </div>
    </main>
  );
}
