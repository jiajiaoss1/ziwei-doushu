import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '紫微館｜用命盤整理關係的混亂',
  description:
    '給正在面對婚姻或長期關係重大決定的妳：用命盤整理關係模式，做成一份可以回看的關係決策書。台灣限定，免註冊。',
  alternates: { canonical: '/zh' },
};

const PARTS = [
  ['01', '你真正要決定的是什麼', '把「他會不會回來」換成「你要不要繼續、怎麼談、什麼時候動」。'],
  ['02', '命盤裡反覆出現的關係模式', '對應宮位與星曜，說明你在關係裡最容易卡住的地方。'],
  ['03', '三個選項，各自的代價', '繼續、談／設界線、離開／暫停：適合條件、代價與下一步。'],
  ['04', '怎麼開口：溝通腳本與界線', '不是教妳操控，而是把想說的話整理成可以開口的句子。'],
  ['05', '時機：接下來的節奏', '未來一段時間的主題與需要注意的地方，不是確定事件。'],
  ['06', '1–3 個追問', '報告後 14 天內，針對你的處境再問 1–3 個問題。'],
];

const FAQ = [
  {
    q: '這跟一般算命有什麼不同？',
    a: '我們不預測「他一定會不會回來」，而是用命盤整理你的關係模式，並把選項、代價與下一步寫清楚。決定還是由你做。',
  },
  {
    q: '沒有時辰可以嗎？',
    a: '可以先做自查，不需要時辰。購買完整報告時再補時辰；真的不知道，也可以用午時推算，報告會明確標註。',
  },
  {
    q: '會不會叫我補東西、買課程？',
    a: '不會。沒有開運商品、沒有補人緣、沒有恐嚇式加購。',
  },
  {
    q: '可以退款嗎？',
    a: '7 天內、尚未打開完整報告，可申請退款。',
  },
  {
    q: '這是 AI 嗎？',
    a: '命盤由系統計算，解讀以規則與科技輔助整理；不是真人老師，也不是自由聊天。我們會標示不確定性與邊界。',
  },
  {
    q: '可以問對方有沒有第三者嗎？',
    a: '不行。我們不做外遇鑑定，也不會替妳判斷對方有沒有說謊。我們會把重點放回：妳能確認的事實、妳能問的問題、妳的下一步。',
  },
];

export default function ZhHomePage() {
  return (
    <main>
      <section className="ja-hero">
        <div className="ja-wrap-narrow">
          <div className="ja-eyebrow">關係決策分析｜台灣</div>
          <h1>用命盤，把關係的混亂<br />整理成可以做的決定。</h1>
          <p className="ja-hero-lead">
            給 30–42 歲、正在婚姻或長期關係裡做決定的妳：<br />
            命盤整理模式，報告給出選項與下一步。
          </p>
          <div className="ja-hero-cta">
            <Link href="/zh/check" className="ja-btn">先做 5 分鐘關係決策自查</Link>
            <a href="#what" className="ja-btn ja-btn-ghost">先看會拿到什麼</a>
          </div>
          <p className="ja-hero-note">免註冊・約 5 分鐘・不是另一位老師</p>
        </div>
      </section>

      <section className="ja-section">
        <div className="ja-wrap">
          <h2 className="ja-section-title">這不是另一位老師。</h2>
          <p className="ja-section-lead">我們不做的事，和我們做的事一樣重要。</p>
          <div className="ja-cards ja-cards-3">
            <div className="ja-card">
              <span className="ja-card-label">不是預測</span>
              <h3>不是告訴妳「他會不會回來」</h3>
              <p>而是幫妳看清：要不要繼續、怎麼談、什麼時候動。決定還是由妳做。</p>
            </div>
            <div className="ja-card">
              <span className="ja-card-label">不是十種說法</span>
              <h3>同一張盤，同一套規則</h3>
              <p>命盤由系統計算，解讀有結構、可重複查看，不是每次換一套說法。</p>
            </div>
            <div className="ja-card">
              <span className="ja-card-label">不是恐嚇</span>
              <h3>不靠焦慮賺錢</h3>
              <p>沒有「不補會怎樣」、沒有上萬風水陣、沒有假倒數。價格與退款一開始就寫清楚。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="ja-section" id="what">
        <div className="ja-wrap">
          <h2 className="ja-section-title">妳會拿到什麼</h2>
          <p className="ja-section-lead">不是更多章節，是一份可以拿來做決定的報告。</p>
          <div className="ja-cards ja-cards-3">
            {PARTS.map(([n, title, body]) => (
              <div className="ja-card" key={n}>
                <span className="ja-card-label">{n}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ja-section">
        <div className="ja-wrap">
          <h2 className="ja-section-title">適合 / 不適合</h2>
          <div className="ja-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            <div className="ja-card">
              <span className="ja-card-label">適合</span>
              <h3>如果你正在…</h3>
              <p>正在做婚姻或長期關係的重大決定；已經想很久、問過朋友或老師，還是沒有答案；願意看自己的模式，也願意行動。</p>
            </div>
            <div className="ja-card">
              <span className="ja-card-label">不適合</span>
              <h3>如果你只想…</h3>
              <p>聽「他一定會回來」；要外遇鑑定／抓小三；要法律、醫療或心理治療；未滿 18 歲；處於家暴或危險情境。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="ja-section">
        <div className="ja-wrap">
          <h2 className="ja-section-title">為什麼是紫微館</h2>
          <div className="ja-cards">
            <div className="ja-card">
              <span className="ja-card-label">01 有依據</span>
              <h3>命盤由引擎計算</h3>
              <p>不是模型自由生成；解讀會對應宮位、星曜與四化，並標示不確定性。</p>
            </div>
            <div className="ja-card">
              <span className="ja-card-label">02 不推銷</span>
              <h3>沒有開運商品</h3>
              <p>不賣水晶、符咒、補人緣。只提供一份報告，以及報告後的 1–3 個追問。</p>
            </div>
            <div className="ja-card">
              <span className="ja-card-label">03 可回看</span>
              <h3>1 年內可以重看</h3>
              <p>決定不是一次看完就結束。報告可回看 1 年，讓妳在不同時間對照自己的狀態。</p>
            </div>
            <div className="ja-card">
              <span className="ja-card-label">04 有邊界</span>
              <h3>不保證結果</h3>
              <p>我們不承諾復合、離婚或結婚，也不做外遇鑑定。命盤是理解的工具，不是替妳做決定的人。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="ja-section">
        <div className="ja-wrap">
          <h2 className="ja-section-title">真實回饋，整理中</h2>
          <p className="ja-section-lead">我們不編造見證。Beta 用戶的真實回饋整理後會放在這裡。</p>
          <div className="ja-card" style={{ maxWidth: 720 }}>
            <span className="ja-card-label">我們想做到的體驗</span>
            <h3>「被當成大人看待，而不是被嚇著買單。」</h3>
            <p>如果妳做完報告，覺得自己更清楚要問什麼、下一步怎麼走，那會是我們最在意的事。</p>
          </div>
        </div>
      </section>

      <section className="ja-section" id="price">
        <div className="ja-wrap">
          <h2 className="ja-section-title">價格</h2>
          <p className="ja-section-lead">一份報告，一次購買，不做訂閱。</p>
          <div className="ja-price-grid" style={{ maxWidth: 520, gridTemplateColumns: '1fr' }}>
            <div className="ja-price featured">
              <span className="ja-badge">早鳥準備中</span>
              <h3>關係決策書</h3>
              <div className="amount">NT$680<small> 早鳥（原價 NT$980）</small></div>
              <p>6 部分報告、命盤圖、1 年回看、14 天內 1–3 個追問。</p>
              <Link href="/zh/check" className="ja-btn ja-btn-sm">先做免費自查</Link>
            </div>
          </div>
          <p className="ja-hint" style={{ marginTop: 14 }}>
            目前為準備階段，尚未開放付款；先做自查不會收費。
          </p>
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

      <section className="ja-section">
        <div className="ja-wrap">
          <h2 className="ja-section-title">更多免費工具</h2>
          <div className="ja-cards ja-cards-3">
            <Link href="/zh/aishou" className="ja-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="ja-card-label">相性</span>
              <h3>看兩個人的相性</h3>
              <p>兩張命盤的吸引與錯身。免費。</p>
            </Link>
            <Link href="/zh/2027" className="ja-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="ja-card-label">2027</span>
              <h3>讀 2027 年的主題</h3>
              <p>丁未年四化與一年節奏。免費。</p>
            </Link>
            <Link href="/zh/articles" className="ja-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="ja-card-label">專欄</span>
              <h3>從文章認識紫微斗數</h3>
              <p>第一次接觸也能看懂的白話整理。</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="ja-section" style={{ textAlign: 'center' }}>
        <div className="ja-wrap-narrow">
          <h2 className="ja-section-title">先整理你現在的處境</h2>
          <p className="ja-section-lead">5 分鐘，四個問題。不用先相信命理，也不用先付錢。</p>
          <Link href="/zh/check" className="ja-btn">開始關係決策自查</Link>
          <p className="ja-disclaimer" style={{ marginTop: 28, borderTop: 'none' }}>
            本服務限 18 歲以上。以紫微斗數進行自我理解與決策參考，不保證未來結果，
            也不能取代醫療、法律、投資或心理治療等專業建議。
          </p>
        </div>
      </section>
    </main>
  );
}
