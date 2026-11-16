import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '2027年（丁未）の運気｜紫微斗数の四化で読む一年',
  description:
    '2027年は丁未年。紫微斗数では太陰化禄・天同化権・天機化科・巨門化忌の四化で一年の流れを読みます。自分の命盤のどこに入るかで変わる、2027年の過ごし方を解説します。',
  alternates: { canonical: '/ja/2027' },
  openGraph: {
    title: '2027年（丁未）の運気｜紫微斗数の四化で読む一年',
    description:
      '2027年は丁未年。太陰化禄・天同化権・天機化科・巨門化忌。自分の命盤で読む一年のテーマを解説します。',
    url: `${SITE_URL}/ja/2027`,
    images: [{ url: '/ja/ogp.png', width: 1200, height: 630 }],
  },
};

const SIHUA_2027 = [
  {
    hua: '化禄',
    star: '太陰',
    kana: 'たいいん',
    theme: '恵み・暮らし',
    text: '暮らしや人間関係に、自然な恵みが入りやすい流れです。日常生活を整えることが、そのまま運を育てます。',
  },
  {
    hua: '化権',
    star: '天同',
    kana: 'てんどう',
    theme: '主導・穏やかさ',
    text: '穏やかさの中に、自分で決める力が生まれます。無理に強く出るより、ゆるやかに主導権を取るとうまくいきます。',
  },
  {
    hua: '化科',
    star: '天機',
    kana: 'てんき',
    theme: '学び・評価',
    text: '学びや企画が評価につながりやすい年です。準備してきた知識を、外に出す機会をつくりましょう。',
  },
  {
    hua: '化忌',
    star: '巨門',
    kana: 'きょもん',
    theme: '言葉・こだわり',
    text: '言葉の行き違いや、こだわりが強く出やすいサインです。会話や契約の場面では、確認を丁寧に。',
  },
];

export default function Year2027Page() {
  const faq = [
    {
      q: '2027年の運気はいつから切り替わりますか？',
      a: '紫微斗数の流年は、一般的に旧正月（春節）を境に切り替わるとされます。2027年の春節は2月6日ごろです。',
    },
    {
      q: '四化がどの宮に入るかは、どうやって見ますか？',
      a: '無料診断の結果ページに、その年の四化と入る宮を表示しています。生年月日を入れると、2027年の位置まで確認できます。',
    },
  ];
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="ja-hero" style={{ padding: '56px 0 36px' }}>
        <div className="ja-wrap-narrow">
          <div className="ja-eyebrow">2027 ・ 丁未</div>
          <h1 style={{ fontSize: 'clamp(26px, 4.4vw, 40px)' }}>
            2027年の運気を、
            <br />
            自分の命盤で読む。
          </h1>
          <p>
            2027年は丁未（ひのとひつじ）年。紫微斗数では、その年の四化が自分の命盤のどの宮に入るかで、
            一年のテーマが変わります。
          </p>
          <div className="ja-cta-row">
            <Link href="/ja/shindan?year=2027" className="ja-btn">
              2027年を無料で見る
            </Link>
            <Link href="/ja/articles/shibitosu-2027" className="ja-btn ja-btn-ghost">
              記事で詳しく読む
            </Link>
          </div>
          <p className="ja-hint">登録不要 ・ 約30秒 ・ 無料</p>
        </div>
      </section>

      <section className="ja-section">
        <div className="ja-wrap-narrow">
          <h2 className="ja-section-title">2027年の四化</h2>
          <p className="ja-section-lead">丁の年は、太陰・天同・天機・巨門の四つが動きます。</p>
          <div className="ja-cards" style={{ marginBottom: 20 }}>
            {SIHUA_2027.map((s) => (
              <div key={s.hua} className="ja-card">
                <span className="ja-card-label">{s.hua}</span>
                <h3>
                  {s.star}（{s.kana}）
                </h3>
                <p style={{ color: '#e3c473', fontSize: 12, marginBottom: 8 }}>{s.theme}</p>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ja-section">
        <div className="ja-wrap-narrow">
          <h2 className="ja-section-title">読むときの3つのポイント</h2>
          <div className="ja-steps">
            <div className="ja-step">
              <strong>大限の中の1年として見る</strong>
              <p>10年単位の大限が土台。その上に2027年の四化が重なります。</p>
            </div>
            <div className="ja-step">
              <strong>四化が入る宮でテーマが変わる</strong>
              <p>官禄宮なら仕事、夫妻宮なら恋愛、財帛宮ならお金が主題になりやすいでしょう。</p>
            </div>
            <div className="ja-step">
              <strong>化忌は「見直しのサイン」</strong>
              <p>怖がるのではなく、確認と準備に時間をかける場所として捉えます。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="ja-section">
        <div className="ja-wrap-narrow" style={{ textAlign: 'center' }}>
          <h2 className="ja-section-title">
            あなたの2027年は、
            <span style={{ whiteSpace: 'nowrap' }}>どこが動く？</span>
          </h2>
          <p className="ja-section-lead">
            生年月日を入れると、2027年の四化がどの宮に入るかを無料で表示します。
          </p>
          <Link href="/ja/shindan?year=2027" className="ja-btn">
            2027年を無料で見る
          </Link>
        </div>
      </section>

      <section className="ja-section" id="faq">
        <div className="ja-wrap-narrow">
          <h2 className="ja-section-title">よくある質問</h2>
          <div className="ja-faq">
            {faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="ja-section" style={{ textAlign: 'center' }}>
        <div className="ja-wrap-narrow">
          <p className="ja-disclaimer" style={{ borderTop: 'none' }}>
            本ページは、紫微斗数を用いた自己理解のための情報提供です。2027年の結果を保証するものではなく、
            医療・法律・投資などの専門的助言ではありません。
          </p>
        </div>
      </section>
    </main>
  );
}
