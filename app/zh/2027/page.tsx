import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '2027 年（丁未）運勢｜用紫微斗數四化讀一年',
  description:
    '2027 年是丁未年。紫微斗數以太陰化祿・天同化權・天機化科・巨門化忌的四化，讀一年的流勢。看看四化落在自己命盤的哪個宮，2027 年會很不一樣。',
  alternates: { canonical: '/zh/2027' },
  openGraph: {
    title: '2027 年（丁未）運勢｜用紫微斗數四化讀一年',
    description: '2027 年是丁未年。太陰化祿・天同化權・天機化科・巨門化忌，用命盤讀一年主題。',
    url: `${SITE_URL}/zh/2027`,
    locale: 'zh_TW',
    type: 'website',
  },
};

const SIHUA_2027 = [
  {
    hua: '化祿',
    star: '太陰',
    theme: '福氣・生活',
    text: '生活與人際之間，較容易自然出現福氣。把日常整理好，本身就在培養運勢。',
  },
  {
    hua: '化權',
    star: '天同',
    theme: '主導・溫和',
    text: '溫和之中，會長出自己決定的力量。不必用力強出頭，慢慢拿回主導權反而順。',
  },
  {
    hua: '化科',
    star: '天機',
    theme: '學習・評價',
    text: '學習與企劃較容易連結到評價。把準備好的知識，找機會拿出來。',
  },
  {
    hua: '化忌',
    star: '巨門',
    theme: '言語・執著',
    text: '較容易察覺言語的誤差與想法差異。重要的對話與契約，一項一項確認清楚。',
  },
];

export default function Year2027Page() {
  const faq = [
    {
      q: '2027 年的運勢什麼時候切換？',
      a: '本服務以曆年（1 月 1 日〜12 月 31 日）顯示要讀的年。也有流派以農曆新年（春節）或立春切換。2027 年的春節是 2 月 6 日。',
    },
    {
      q: '四化落在哪個宮要怎麼看？',
      a: '免費診斷的結果頁會顯示該年的四化與入宮。輸入出生年月日，就能確認 2027 年的位置。',
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
            2027 年的運勢，<br />用自己的命盤來讀。
          </h1>
          <p>
            2027 年是丁未年。紫微斗數裡，這一年的四化落在自己命盤的哪個宮，
            就會決定那一年的主題。
          </p>
          <div className="ja-cta-row">
            <Link href="/zh/shindan?year=2027" className="ja-btn">免費看 2027 年</Link>
            <Link href="/zh" className="ja-btn ja-btn-ghost">先了解紫微斗數</Link>
          </div>
        </div>
      </section>

      <section className="ja-section">
        <div className="ja-wrap">
          <div className="ja-eyebrow">FOUR TRANSFORMATIONS</div>
          <h2>2027 年的四化</h2>
          <div className="ja-grid-3" style={{ marginTop: 24 }}>
            {SIHUA_2027.map((s) => (
              <div key={s.hua} className="ja-card">
                <span className="ja-card-label">{s.hua}</span>
                <h3>{s.star}・{s.theme}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ja-section">
        <div className="ja-wrap-narrow">
          <div className="ja-eyebrow">HOW TO USE</div>
          <h2>怎麼用在今年？</h2>
          <ol className="ja-steps">
            <li>
              <strong>輸入出生年月日</strong>
              <span>排出自己的命盤。</span>
            </li>
            <li>
              <strong>確認四化落在哪個宮</strong>
              <span>看太陰祿・天同權・天機科・巨門忌分別進入哪個領域。</span>
            </li>
            <li>
              <strong>決定今年的優先順序</strong>
              <span>把力氣放在四化給出訊號的領域。</span>
            </li>
          </ol>
          <div className="ja-center">
            <Link href="/zh/shindan?year=2027" className="ja-btn">免費診斷（2027）</Link>
          </div>
        </div>
      </section>

      <section className="ja-section">
        <div className="ja-wrap-narrow">
          <div className="ja-eyebrow">FAQ</div>
          <h2>常見問題</h2>
          <div style={{ marginTop: 20 }}>
            {faq.map((f) => (
              <div key={f.q} style={{ marginBottom: 22 }}>
                <h3 style={{ fontSize: 16, marginBottom: 8 }}>{f.q}</h3>
                <p style={{ color: '#a49e8f', fontSize: 13.5, lineHeight: 1.9, margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ja-section ja-section-note">
        <div className="ja-wrap-narrow">
          <p className="ja-disclaimer">
            本頁是以紫微斗數進行自我理解的娛樂性內容，不保證未來結果，
            也不能取代醫療、法律、投資等專業建議。
          </p>
        </div>
      </section>
    </main>
  );
}
