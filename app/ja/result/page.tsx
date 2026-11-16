import type { Metadata } from 'next';
import Link from 'next/link';
import { generateChart } from '@/lib/ziwei/algorithm';
import {
  formatSolarClock,
  isValidJpBirthInput,
  jpBirthToChartInput,
  shichenJa,
  type JpBirthInput,
} from '@/lib/jp/birth';
import { buildJpFacts } from '@/lib/jp/facts';
import { detectPatterns } from '@/lib/ziwei/patterns';
import { buildFreeReading } from '@/lib/jp/interpret';
import { isLlmEnabled } from '@/lib/jp/llm';
import { resolveFlowYear } from '@/lib/jp/year';
import Meiban from '@/components/jp/Meiban';
import AiReading from '@/components/jp/AiReading';
import TrackView from '@/components/jp/TrackView';

export const metadata: Metadata = {
  title: '診断結果',
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

export default async function ResultPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
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
          <p style={{ color: '#a49e8f', marginBottom: 28 }}>
            生年月日または時刻が正しくありません。もう一度入力してください。
          </p>
          <Link href="/ja/shindan" className="ja-btn">
            入力画面へ戻る
          </Link>
        </div>
      </main>
    );
  }

  const thisYear = new Date().getFullYear();
  const flowYear = resolveFlowYear(one(sp.year), thisYear);

  const birth = jpBirthToChartInput(input);
  const chart = generateChart(birth.birthInfo);
  const facts = buildJpFacts(chart, flowYear, detectPatterns(chart));
  const reading = buildFreeReading(facts);
  const yearOptions = [thisYear, thisYear + 1, thisYear + 2].filter((y) => y <= 2100);

  const dateLabel = `${input.year}年${input.month}月${input.day}日`;
  const timeLabel = input.unknownTime
    ? '不明（正午で計算）'
    : `${String(input.clockHour).padStart(2, '0')}:${String(input.clockMinute).padStart(2, '0')}`;
  const solarLabel = formatSolarClock(birth.solar);
  const params = new URLSearchParams({
    y: String(input.year),
    m: String(input.month),
    d: String(input.day),
    g: input.gender === 'male' ? 'm' : 'f',
    p: input.prefecture,
    ...(input.unknownTime
      ? { u: '1' }
      : { h: String(input.clockHour), mi: String(input.clockMinute) }),
  });
  const yearQs = new URLSearchParams(params);
  if (flowYear !== thisYear) yearQs.set('year', String(flowYear));
  const loveHref = `/ja/report?${yearQs.toString()}&type=love`;
  const workHref = `/ja/report?${yearQs.toString()}&type=work`;

  return (
    <main>
      <TrackView event="jp_result_view" props={{ unknown_time: input.unknownTime }} />
      <section className="ja-result-head">
        <div className="ja-wrap-narrow">
          <div className="ja-eyebrow">DIAGNOSIS RESULT</div>
          <h1>{reading.headline}</h1>
          <p style={{ color: '#a49e8f', fontSize: 14, margin: 0 }}>{reading.lead}</p>
          <div className="ja-meta">
            <span>
              <b>生年月日</b> {dateLabel}
            </span>
            <span>
              <b>出生時刻</b> {timeLabel}
              {solarLabel ? `（真太陽時 ${solarLabel}）` : ''}
            </span>
            <span>
              <b>性別</b> {input.gender === 'male' ? '男性' : '女性'}
            </span>
            <span>
              <b>出生地</b> {input.prefecture}
            </span>
            <span>
              <b>命宮</b> {facts.ming.branchName} ・ {shichenJa(facts.ming.branch)}
            </span>
            <span>
              <b>五行局</b> {facts.wuxingJuName}
            </span>
            <span>
              <b>年齢</b> {facts.age}歳（数え）
            </span>
            <span>
              <b>読む年</b> {facts.year}年
            </span>
          </div>
        </div>
      </section>

      <div className="ja-wrap-narrow" style={{ padding: '36px 20px 72px' }}>
        {birth.notes.length > 0 && (
          <div
            style={{
              border: '1px dashed rgba(201,165,74,0.3)',
              borderRadius: 10,
              padding: '12px 16px',
              marginBottom: 26,
              fontSize: 12,
              color: '#a49e8f',
            }}
          >
            {birth.notes.map((n) => (
              <div key={n}>・{n}</div>
            ))}
          </div>
        )}

        {/* 流年切替 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
            marginBottom: 24,
            fontSize: 12,
            color: '#8a8577',
          }}
        >
          <span>読む年：</span>
          {yearOptions.map((y) => {
            const qs = new URLSearchParams(params);
            if (y !== thisYear) qs.set('year', String(y));
            const active = y === flowYear;
            return (
              <Link
                key={y}
                href={`/ja/result?${qs.toString()}`}
                style={{
                  padding: '4px 12px',
                  borderRadius: 999,
                  textDecoration: 'none',
                  border: `1px solid ${active ? '#c9a54a' : 'rgba(201,165,74,0.25)'}`,
                  color: active ? '#e3c473' : '#a49e8f',
                  background: active ? 'rgba(201,165,74,0.12)' : 'transparent',
                }}
              >
                {y}年
              </Link>
            );
          })}
        </div>

        {/* highlights */}
        <div className="ja-cards ja-cards-3" style={{ marginBottom: 36 }}>
          {reading.highlights.map((h) => (
            <div key={h.label} className="ja-card">
              <span className="ja-card-label">{h.label}</span>
              <h3>{h.title}</h3>
              <p>{h.body}</p>
            </div>
          ))}
        </div>

        {/* meiban */}
        <section style={{ marginBottom: 40 }}>
          <h2
            className="ja-serif"
            style={{ fontSize: 20, letterSpacing: '0.1em', marginBottom: 6, fontWeight: 600 }}
          >
            あなたの命盤
          </h2>
          <p style={{ fontSize: 12, color: '#8a8577', marginBottom: 16 }}>
            12の宮に、生まれ持った星が配置されています。金色の枠が命宮です。
          </p>
          <Meiban facts={facts} />
        </section>

        {/* sections */}
        <div className="ja-reading">
          {reading.sections.map((s) => (
            <article key={s.key} className="ja-article">
              <h2>{s.title}</h2>
              {paragraphs(s.body).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </article>
          ))}
        </div>

        <AiReading
          enabled={isLlmEnabled()}
          type="general"
          params={{
            y: input.year,
            m: input.month,
            d: input.day,
            h: input.clockHour,
            mi: input.clockMinute,
            u: input.unknownTime,
            g: input.gender === 'male' ? 'm' : 'f',
            p: input.prefecture,
          }}
        />

        {/* upsell */}
        <section style={{ marginTop: 40 }}>
          <h2 className="ja-serif" style={{ fontSize: 20, letterSpacing: '0.1em', marginBottom: 8 }}>
            もっと詳しく読む
          </h2>
          <p style={{ fontSize: 13, color: '#a49e8f', marginBottom: 18 }}>
            β版のあいだは、以下の鑑定書を無料で公開しています。
          </p>
          <div className="ja-cards">
            <Link
              href={loveHref}
              className="ja-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <span className="ja-card-label">恋愛</span>
              <h3>恋愛鑑定書</h3>
              <p>
                惹かれやすい相手像、関係の育て方、つまずきポイント、縁が動く時期までを読み解きます。
              </p>
              <span style={{ display: 'inline-block', marginTop: 12, color: '#e3c473', fontSize: 13 }}>
                読んでみる →
              </span>
            </Link>
            <Link
              href="/ja/aishou"
              className="ja-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <span className="ja-card-label">相性</span>
              <h3>相性診断</h3>
              <p>お相手の生年月日を入れると、二人の命盤から相性を読み解きます。無料です。</p>
              <span style={{ display: 'inline-block', marginTop: 12, color: '#e3c473', fontSize: 13 }}>
                見てみる →
              </span>
            </Link>
            <Link
              href={workHref}
              className="ja-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <span className="ja-card-label">仕事</span>
              <h3>事業鑑定書</h3>
              <p>
                仕事の資質、向いている職種、お金の流れ、転機の読み方、行動のヒントをお伝えします。
              </p>
              <span style={{ display: 'inline-block', marginTop: 12, color: '#e3c473', fontSize: 13 }}>
                読んでみる →
              </span>
            </Link>
          </div>
        </section>

        <p className="ja-disclaimer">
          本結果は、紫微斗数を用いた自己理解のためのエンターテインメントです。将来の結果や特定の行動を保証するものではなく、
          医療・法律・投資などの専門的助言ではありません。出生時刻が正確でない場合、命盤が変わる可能性があります。
        </p>

        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <Link href="/ja/shindan" className="ja-btn ja-btn-ghost ja-btn-sm">
            条件を変えて診断する
          </Link>
        </div>
      </div>
    </main>
  );
}
