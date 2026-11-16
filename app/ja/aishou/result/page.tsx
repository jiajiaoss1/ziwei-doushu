import type { Metadata } from 'next';
import Link from 'next/link';
import { generateChart } from '@/lib/ziwei/algorithm';
import { detectPatterns } from '@/lib/ziwei/patterns';
import { isValidJpBirthInput, jpBirthToChartInput, type JpBirthInput } from '@/lib/jp/birth';
import { buildJpFacts, type JpChartFacts } from '@/lib/jp/facts';
import { buildCompat } from '@/lib/jp/compat';
import TrackView from '@/components/jp/TrackView';

export const metadata: Metadata = {
  title: '相性診断の結果',
  robots: { index: false, follow: false },
};

type SP = Promise<Record<string, string | string[] | undefined>>;

function one(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? '') : (v ?? '');
}

function person(sp: Record<string, string | string[] | undefined>, prefix: 'a' | 'b'): JpBirthInput {
  return {
    year: Number(one(sp[`${prefix}_y`])),
    month: Number(one(sp[`${prefix}_m`])),
    day: Number(one(sp[`${prefix}_d`])),
    clockHour: Number(one(sp[`${prefix}_h`])),
    clockMinute: Number(one(sp[`${prefix}_mi`])),
    unknownTime: one(sp[`${prefix}_u`]) === '1',
    prefecture: one(sp[`${prefix}_p`]) || '東京都',
    gender: one(sp[`${prefix}_g`]) === 'm' ? 'male' : 'female',
  };
}

function paragraphs(text: string): string[] {
  const parts = text
    .split('。')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => `${s}。`);
  const out: string[] = [];
  for (let i = 0; i < parts.length; i += 2) out.push(parts.slice(i, i + 2).join(''));
  return out;
}

function resultHref(p: JpBirthInput): string {
  const qs = new URLSearchParams({
    y: String(p.year),
    m: String(p.month),
    d: String(p.day),
    g: p.gender === 'male' ? 'm' : 'f',
    p: p.prefecture,
    ...(p.unknownTime
      ? { u: '1' }
      : { h: String(p.clockHour), mi: String(p.clockMinute) }),
  });
  return `/ja/result?${qs.toString()}`;
}

function Profile({ title, facts }: { title: string; facts: JpChartFacts }) {
  const stars = (palace: { major: { ja: { nameJa: string }; brightness?: { label: string } }[] }) =>
    palace.major.length > 0
      ? palace.major
          .map((s) => `${s.ja.nameJa}${s.brightness ? `（${s.brightness.label}）` : ''}`)
          .join('・')
      : '空宮';
  return (
    <div className="ja-pair-profile">
      <h3>{title}</h3>
      <dl>
        <dt>命宮</dt>
        <dd>{stars(facts.ming)}</dd>
        <dt>夫妻宮</dt>
        <dd>{stars(facts.fuqi)}</dd>
        <dt>官禄宮</dt>
        <dd>{stars(facts.guanlu)}</dd>
        <dt>五行局</dt>
        <dd>{facts.wuxingJuName}</dd>
        <dt>いまの大限</dt>
        <dd>{facts.daxian ? `${facts.daxian.palaceJa}（${facts.daxian.startAge}〜${facts.daxian.endAge}歳）` : '大限前'}</dd>
      </dl>
    </div>
  );
}

export default async function AishouResultPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const a = person(sp, 'a');
  const b = person(sp, 'b');

  if (!isValidJpBirthInput(a) || !isValidJpBirthInput(b)) {
    return (
      <main>
        <div className="ja-wrap-narrow" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <h1 className="ja-serif" style={{ fontSize: 24, marginBottom: 16 }}>
            入力内容を確認してください
          </h1>
          <Link href="/ja/aishou" className="ja-btn">
            入力画面へ戻る
          </Link>
        </div>
      </main>
    );
  }

  const birthA = jpBirthToChartInput(a);
  const chartA = generateChart(birthA.birthInfo);
  const factsA = buildJpFacts(chartA, new Date().getFullYear(), detectPatterns(chartA));

  const birthB = jpBirthToChartInput(b);
  const chartB = generateChart(birthB.birthInfo);
  const factsB = buildJpFacts(chartB, new Date().getFullYear(), detectPatterns(chartB));

  const compat = buildCompat(factsA, factsB);

  return (
    <main>
      <TrackView event="jp_aishou_view" props={{ branch: compat.branchRelation, element: compat.elementRelation }} />
      <section className="ja-result-head">
        <div className="ja-wrap-narrow">
          <div className="ja-eyebrow">COMPATIBILITY RESULT</div>
          <h1>{compat.title}</h1>
          <p style={{ color: '#a49e8f', fontSize: 14, margin: 0 }}>{compat.label}</p>
          <div className="ja-meta">
            <span>
              <b>あなた</b> {a.year}年{a.month}月{a.day}日 ・ {a.prefecture}
            </span>
            <span>
              <b>お相手</b> {b.year}年{b.month}月{b.day}日 ・ {b.prefecture}
            </span>
            <span>
              <b>地支</b> {compat.branchRelation}
            </span>
            <span>
              <b>五行</b> {compat.elementRelation}
            </span>
          </div>
        </div>
      </section>

      <div className="ja-wrap-narrow" style={{ padding: '30px 20px 72px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(201,165,74,0.14), rgba(17,26,51,0.6))',
            border: '1px solid rgba(201,165,74,0.35)',
            borderRadius: 14,
            padding: '22px 24px',
            marginBottom: 30,
          }}
        >
          <div style={{ fontSize: 11, letterSpacing: '0.24em', color: '#e3c473', marginBottom: 12 }}>
            3行サマリー
          </div>
          {compat.summary.map((s) => (
            <p key={s} style={{ margin: '0 0 10px', fontSize: 14, color: '#e6dfd0', lineHeight: 1.9 }}>
              {s}
            </p>
          ))}
        </div>

        <div className="ja-pair-grid" style={{ marginBottom: 34 }}>
          <Profile title="あなたの命盤" facts={factsA} />
          <Profile title="お相手の命盤" facts={factsB} />
        </div>

        <div className="ja-reading">
          {compat.sections.map((s) => (
            <article key={s.title} className="ja-article">
              <h2>{s.title}</h2>
              {paragraphs(s.body).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </article>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
          <Link href={resultHref(a)} className="ja-btn ja-btn-sm">
            あなたの詳細診断
          </Link>
          <Link href={resultHref(b)} className="ja-btn ja-btn-ghost ja-btn-sm">
            お相手の詳細診断
          </Link>
          <Link href="/ja/aishou" className="ja-btn ja-btn-ghost ja-btn-sm">
            条件を変える
          </Link>
        </div>

        <p className="ja-disclaimer">
          本結果は、紫微斗数を用いた自己理解のためのエンターテインメントです。相性を点数化したり、
          関係の成否を保証したりするものではありません。お相手の同意を得たうえでご利用ください。
        </p>
      </div>
    </main>
  );
}
