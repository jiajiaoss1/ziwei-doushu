import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '關係決策書範例',
  description: '一份虛構的《關係決策書》範例：決策問題、關係模式、三個選項、溝通腳本、時機與追問。',
  alternates: { canonical: '/zh/sample' },
};

export default async function SamplePage({
  searchParams,
}: {
  searchParams: Promise<{ mock?: string }>;
}) {
  const sp = await searchParams;
  const mock = sp.mock === '1';

  return (
    <main>
      <section className="ja-hero" style={{ padding: '44px 0 18px' }}>
        <div className="ja-wrap-narrow">
          <div className="ja-eyebrow">SAMPLE REPORT</div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)' }}>關係決策書（範例）</h1>
          <p style={{ color: '#a49e8f' }}>
            虛構案例，只用來說明報告長什麼樣子；不是你的命盤，也不是真實個案。
          </p>
          {mock && (
            <div style={{ marginTop: 16, padding: '12px 16px', border: '1px solid rgba(201,165,74,0.35)', borderRadius: 10, background: 'rgba(201,165,74,0.08)', fontSize: 13 }}>
              測試模式：尚未向你收款，也不會建立真實訂單。以下是範例報告。
            </div>
          )}
        </div>
      </section>

      <div className="ja-wrap-narrow" style={{ padding: '0 20px 72px' }}>
        <div className="ja-card" style={{ marginBottom: 18 }}>
          <span className="ja-card-label">範例個案</span>
          <h3 style={{ fontSize: 18 }}>36 歲女性・已婚・正在考慮要不要繼續</h3>
          <p>命宮：太陽、太陰｜夫妻宮：天同｜福德宮：天機、巨門｜官祿宮：天梁</p>
          <p className="ja-hint">這是虛構的生日與情境，只用來示意。</p>
        </div>

        <article className="ja-cards" style={{ gap: 14 }}>
          <section className="ja-card">
            <span className="ja-card-label">01 你真正要決定的是什麼</span>
            <h3 style={{ fontSize: 19 }}>不是「他愛不愛我」，而是「我要不要繼續用現在的方式過下去」。</h3>
            <p>
              你已經反覆確認他的態度很久，但真正讓你卡住的，是每次溝通後你都覺得自己退了一步。
              這份報告會把「繼續」「談」「離開」三個選項分開看，而不是替你做選擇。
            </p>
          </section>

          <section className="ja-card">
            <span className="ja-card-label">02 命盤裡反覆出現的關係模式</span>
            <h3 style={{ fontSize: 19 }}>想照顧對方，也需要被照顧；但一開口就變成想太多。</h3>
            <p>
              命宮太陽、太陰：你容易先照顧對方的情緒，再回頭發現自己的需要沒有被說出來。
              夫妻宮天同：你希望關係和諧，遇到衝突時容易先退讓，久了會累積委屈。
              福德宮天機、巨門：你會在心裡反覆推演每一句話，越想越難開口。
            </p>
          </section>

          <section className="ja-card">
            <span className="ja-card-label">03 三個選項，各自的代價</span>
            <h3 style={{ fontSize: 19 }}>繼續、談／設界線、離開／暫停。</h3>
            <p>
              <strong>繼續：</strong>適合「雙方都願意調整」的情況；代價是你可能再退回原本的模式。<br />
              <strong>談／設界線：</strong>適合「還想努力，但需要新規則」；代價是短期衝突會變多。<br />
              <strong>離開／暫停：</strong>適合「安全與尊嚴已被反覆消耗」；代價是現實安排與情緒復原。
            </p>
          </section>

          <section className="ja-card">
            <span className="ja-card-label">04 怎麼開口：溝通腳本與界線</span>
            <h3 style={{ fontSize: 19 }}>把「你都不在乎我」換成「我需要…」。</h3>
            <p>
              1.「最近我常覺得一個人在撐，我想讓你知道我需要什麼。」<br />
              2.「我不是要你馬上回答，但我需要你告訴我，你願不願意一起談。」<br />
              3.「如果我們再回到原本的方式，我會需要先暫停，而不是繼續忍。」
            </p>
          </section>

          <section className="ja-card">
            <span className="ja-card-label">05 時機：接下來的節奏</span>
            <h3 style={{ fontSize: 19 }}>先把話說清楚，再決定要不要動。</h3>
            <p>
              接下來幾個月，關係裡「說清楚」的主題會比「忍過去」更明顯。
              這不是說一定會分開，而是：越晚開口，越容易用疲累代替決定。
              先安排一次不被打斷的對話，比在深夜用訊息談判更有用。
            </p>
          </section>

          <section className="ja-card">
            <span className="ja-card-label">06 妳還可以問的三個問題</span>
            <h3 style={{ fontSize: 19 }}>報告後 14 天內，可以再問 1–3 個。</h3>
            <p>
              「我要怎麼判斷他是真的願意改，還是只是怕失去？」<br />
              「如果我先設界線，最壞的情況會是什麼？我承受得住嗎？」<br />
              「我現在最該先準備的現實條件是什麼？」
            </p>
          </section>
        </article>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link href="/zh/check" className="ja-btn">用我的狀況做一次自查</Link>
        </div>

        <p className="ja-disclaimer">
          本頁為虛構範例，不是真實個案，也不是你的命盤。正式報告會依你的出生資料與所選情境產生。
          本服務限 18 歲以上；不保證結果，也不做外遇鑑定、法律、醫療或心理治療建議。
        </p>
      </div>
    </main>
  );
}
