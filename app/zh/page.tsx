import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '紫微館｜用紫微斗數讀你的星盤',
  description:
    '輸入出生年月日與時辰，以中國傳統占術・紫微斗數，解讀你的本質、感情與工作傾向。免註冊的免費診斷。',
  alternates: { canonical: '/zh' },
};

const FEATURES = [
  {
    no: '01',
    title: '本質',
    body: '從命宮的主星，讀出你的性格核心，以及別人容易看到的魅力。不只講優點，也溫柔地說明陰影面。',
  },
  {
    no: '02',
    title: '感情',
    body: '以夫妻宮為中心，整理你容易喜歡上的人、關係變深之前的節奏，以及容易卡住的地方。',
  },
  {
    no: '03',
    title: '工作',
    body: '從官祿宮與財帛宮，整理你適合的工作方式，以及與金錢相處的傾向。',
  },
];

export default function ZhHomePage() {
  return (
    <main>
      <section className="ja-hero">
        <div className="ja-wrap-narrow">
          <div className="ja-eyebrow">中國傳統占術・紫微斗數</div>
          <h1>用紫微斗數，<br />讀你的星圖。</h1>
          <p className="ja-hero-lead">
            紫微斗數是從出生瞬間的星曜配置，讀出一個人本質、感情與工作傾向的東方占術。
            流傳千年的體系，會為你排出一張專屬的命盤。
          </p>
          <div className="ja-hero-cta">
            <Link href="/zh/shindan" className="ja-btn">免費診斷</Link>
            <a href="#about" className="ja-btn ja-btn-ghost">什麼是紫微斗數</a>
          </div>
          <p className="ja-hero-note">免註冊・約 30 秒・免費</p>
        </div>
      </section>

      <section className="ja-section" id="about">
        <div className="ja-wrap">
          <div className="ja-eyebrow">FROM THE CHART</div>
          <h2>從命盤，讀出你自己的樣子。</h2>
          <p className="ja-section-lead">
            12 個宮位、14 顆主星，以及四化（化祿・化權・化科・化忌）的流動，
            會依照人生領域分別解讀。
          </p>
          <div className="ja-grid-3">
            {FEATURES.map((f) => (
              <div key={f.no} className="ja-card">
                <span className="ja-card-no">{f.no}</span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ja-section">
        <div className="ja-wrap">
          <div className="ja-eyebrow">HOW IT WORKS</div>
          <h2>只要三步。</h2>
          <ol className="ja-steps">
            <li>
              <strong>輸入出生年月日與時刻</strong>
              <span>西元生日、可取得的出生時刻、出生縣市，這樣就好。</span>
            </li>
            <li>
              <strong>自動計算命盤</strong>
              <span>以真太陽時校正後，當場算出 12 宮與主星的配置。</span>
            </li>
            <li>
              <strong>顯示診斷結果</strong>
              <span>用溫柔的語言，告訴你本質、感情與今年的主題。</span>
            </li>
          </ol>
          <div className="ja-center">
            <Link href="/zh/shindan" className="ja-btn">開始免費診斷</Link>
          </div>
        </div>
      </section>

      <section className="ja-section ja-section-note">
        <div className="ja-wrap-narrow">
          <p className="ja-disclaimer">
            本服務是以紫微斗數進行自我理解的娛樂性內容，不保證未來結果，
            也不能取代醫療、法律、投資等專業建議。
          </p>
        </div>
      </section>
    </main>
  );
}
