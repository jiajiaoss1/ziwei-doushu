import type { Metadata } from 'next';
import Link from 'next/link';
import { formatZhPrice } from '@/lib/zh/pricing';

export const metadata: Metadata = {
  title: '紫微館｜用紫微斗數讀你的星盤',
  description:
    '輸入出生年月日與時辰，以中國傳統占術・紫微斗數，解讀你的本質、感情與工作傾向。免註冊的免費診斷。',
  alternates: { canonical: '/zh' },
};

const FAQ = [
  {
    q: '需要註冊會員嗎？',
    a: '不需要。輸入出生年月日・時刻・縣市就能免費診斷，不會要求註冊或登入。',
  },
  {
    q: '出生時刻不清楚怎麼辦？',
    a: '勾選「出生時刻不清楚」，系統會以正午（12:00）計算。命宮可能因此不同，結果請當作參考。',
  },
  {
    q: '出生地一定要選嗎？',
    a: '出生地只用於真太陽時校正（誤差約幾分鐘），不清楚時以台北計算。',
  },
  {
    q: '結果會保存嗎？',
    a: '輸入的出生資訊不會存入本服務的資料庫，只用於命盤計算與顯示。詳見隱私權政策。',
  },
  {
    q: '占卜結果準嗎？',
    a: '本服務是以紫微斗數進行自我理解的娛樂性內容，不保證未來，也不能取代醫療・法律・投資等專業建議。',
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
          <h2 className="ja-section-title">從命盤，讀出你自己的樣子。</h2>
          <p className="ja-section-lead">
            12 個宮位、14 顆主星，以及四化（化祿・化權・化科・化忌）的流動，會依照人生領域分別解讀。
          </p>
          <div className="ja-cards ja-cards-3">
            <div className="ja-card">
              <span className="ja-card-label">01 本質</span>
              <h3>看見你天生的資質</h3>
              <p>
                從命宮的主星，讀出性格的核心與別人容易看到的魅力。不只講優點，也溫柔地說明陰影面。
              </p>
            </div>
            <div className="ja-card">
              <span className="ja-card-label">02 感情</span>
              <h3>感情的傾向與緣分時機</h3>
              <p>
                以夫妻宮為中心，整理你容易喜歡上的人、關係變深之前的節奏，以及容易卡住的地方。
              </p>
            </div>
            <div className="ja-card">
              <span className="ja-card-label">03 工作</span>
              <h3>工作與金錢的設計圖</h3>
              <p>
                從官祿宮與財帛宮，整理你適合的工作方式，以及與金錢相處的傾向。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ja-section">
        <div className="ja-wrap">
          <h2 className="ja-section-title">診斷流程</h2>
          <p className="ja-section-lead">只要輸入三個項目，就能輕鬆診斷。</p>
          <div className="ja-steps">
            <div className="ja-step">
              <strong>輸入出生年月日與時刻</strong>
              <p>西元生日、可取得的出生時刻、出生縣市，這樣就好。</p>
            </div>
            <div className="ja-step">
              <strong>自動計算命盤</strong>
              <p>以真太陽時校正後，當場算出 12 宮與主星的配置。</p>
            </div>
            <div className="ja-step">
              <strong>顯示診斷結果</strong>
              <p>用溫柔的語言，告訴你本質、感情與今年的主題。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="ja-section">
        <div className="ja-wrap">
          <h2 className="ja-section-title">結果範例</h2>
          <p className="ja-section-lead">※ 以下為範例。實際結果會依命盤而不同。</p>
          <div className="ja-cards ja-cards-3">
            <div className="ja-card">
              <span className="ja-card-label">本質</span>
              <h3>你的資質</h3>
              <p>
                命宮有紫微。天生帶著格局與存在感，自然而然站在人群中心。責任感強，但也較不容易示弱。
              </p>
            </div>
            <div className="ja-card">
              <span className="ja-card-label">感情</span>
              <h3>感情傾向</h3>
              <p>
                夫妻宮有天府。重視安心與穩定，比起華麗，更傾向選擇相處起來能放鬆的對象。
              </p>
            </div>
            <div className="ja-card">
              <span className="ja-card-label">今年</span>
              <h3>2026 年的主題</h3>
              <p>
                今年官祿宮有順風，工作的評價與角色較容易變動。是把握準備已久的機會的時候。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ja-section">
        <div className="ja-wrap">
          <h2 className="ja-section-title">更多</h2>
          <p className="ja-section-lead">相性診斷、2027 年運勢、文章專欄。</p>
          <div className="ja-cards">
            <Link href="/zh/aishou" className="ja-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="ja-card-label">相性</span>
              <h3>看兩個人的相性</h3>
              <p>把兩張命盤疊起來，解讀互相吸引的地方與容易錯身的地方。免費。</p>
              <span style={{ display: 'inline-block', marginTop: 12, color: '#e3c473', fontSize: 13 }}>
                相性診斷 →
              </span>
            </Link>
            <Link href="/zh/2027" className="ja-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="ja-card-label">2027 年</span>
              <h3>讀 2027 年的運勢</h3>
              <p>丁未年的四化（太陰祿・天同權・天機科・巨門忌），讀出一年的主題。</p>
              <span style={{ display: 'inline-block', marginTop: 12, color: '#e3c473', fontSize: 13 }}>
                看 2027 年 →
              </span>
            </Link>
            <Link href="/zh/articles" className="ja-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="ja-card-label">專欄</span>
              <h3>從文章認識紫微斗數</h3>
              <p>基礎、感情、工作的讀法，用白話整理，第一次接觸也能看懂。</p>
              <span style={{ display: 'inline-block', marginTop: 12, color: '#e3c473', fontSize: 13 }}>
                讀文章 →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="ja-section" id="price">
        <div className="ja-wrap">
          <h2 className="ja-section-title">價格</h2>
          <p className="ja-section-lead">
            免費診斷之後，需要的人再使用更深入的鑑定書。
          </p>
          <div className="ja-price-grid ja-cards-3">
            <div className="ja-price">
              <h3>免費診斷</h3>
              <div className="amount">0<small>元</small></div>
              <p>命盤＋本質・感情・今年主題</p>
              <Link href="/zh/shindan" className="ja-btn ja-btn-sm">免費診斷</Link>
            </div>
            <div className="ja-price featured">
              <span className="ja-badge">Beta 免費公開中</span>
              <h3>感情鑑定書</h3>
              <div className="amount">{formatZhPrice('love')}<small>（含稅）</small></div>
              <p>對象形象・關係的培養・緣分時機・建議</p>
              <Link href="/zh/shindan" className="ja-btn ja-btn-sm">先免費診斷</Link>
            </div>
            <div className="ja-price">
              <span className="ja-badge">Beta 免費公開中</span>
              <h3>事業鑑定書</h3>
              <div className="amount">{formatZhPrice('work')}<small>（含稅）</small></div>
              <p>工作資質・職種・金錢・轉機・行動提示</p>
              <Link href="/zh/shindan" className="ja-btn ja-btn-sm ja-btn-ghost">先免費診斷</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="ja-section" id="faq">
        <div className="ja-wrap">
          <h2 className="ja-section-title">常見問題</h2>
          <div className="ja-faq">
            {FAQ.map((f) => (
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
          <h2 className="ja-section-title">想看看自己的星圖嗎？</h2>
          <p className="ja-section-lead">免註冊・約 30 秒。先從免費診斷開始。</p>
          <Link href="/zh/shindan" className="ja-btn">免費診斷</Link>
          <p className="ja-disclaimer" style={{ marginTop: 28, borderTop: 'none' }}>
            本服務是以紫微斗數進行自我理解的娛樂性內容，不保證未來結果，
            也不能取代醫療、法律、投資等專業建議。
          </p>
        </div>
      </section>
    </main>
  );
}
