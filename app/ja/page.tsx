import Link from 'next/link';

const FAQ = [
  {
    q: '紫微斗数（しびとすう）とはどんな占術ですか？',
    a: '生まれた年月日と時刻から「命盤（めいばん）」と呼ばれる12の宮の図をつくり、14の主星と四化（しか）の動きから、その人の本質・恋愛・仕事・お金の傾向を読み解く中国の占術です。星座占いが生まれた月日だけで見るのに対し、紫微斗数は時刻と出生地まで使うため、一人ひとり違う結果になります。',
  },
  {
    q: '星座占いや四柱推命と何が違いますか？',
    a: '紫微斗数は「12の宮（場所）」と「星の配置」で読むのが特徴です。恋愛なら夫妻宮、仕事なら官禄宮というように、人生の領域ごとに盤面を見ます。同じ生年月日でも時刻が違えば命盤は変わるため、より細やかな読み解きができます。',
  },
  {
    q: '出生時刻がわからない場合は？',
    a: '「出生時刻がわからない」にチェックを入れると、正午（12:00）で計算します。ただし命宮が変わる可能性があるため、結果は目安としてお楽しみください。母子手帳や家族の記憶で時刻がわかる場合は、そちらを入力することをおすすめします。',
  },
  {
    q: '何度でも診断できますか？',
    a: 'はい、無料診断は何度でもご利用いただけます。ご家族やお友達の分を診断することも可能です。',
  },
  {
    q: '占い結果は将来を保証するものですか？',
    a: 'いいえ。紫微斗数は、自分自身を理解するための「ものさし」です。未来を断定したり、行動を強制したりするものではありません。しっくりくる部分を参考に、ご自身の判断でお役立てください。',
  },
  {
    q: '入力した生年月日はどう扱われますか？',
    a: '診断のためにのみ利用し、第三者へ販売・提供することはありません。詳しくはプライバシーポリシーをご確認ください。',
  },
];

export default function JaHomePage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="ja-hero">
        <div className="ja-wrap">
          <div className="ja-eyebrow">中国伝統の占術・紫微斗数</div>
          <h1>
            いまの悩みに、
            <br />
            命盤から答える。
          </h1>
          <p>
            星占いの一般論ではなく、いま気になっていることへ。
            恋愛・仕事・人間関係の悩みに、紫微斗数（しびとすう）の命盤から読み解きます。
          </p>
          <div className="ja-cta-row">
            <Link href="/ja/shindan" className="ja-btn">
              無料で診断する
            </Link>
            <a href="#about" className="ja-btn ja-btn-ghost">
              紫微斗数とは
            </a>
          </div>
          <p className="ja-hint">登録不要・約30秒・無料</p>
        </div>
      </section>

      {/* Features */}
      <section className="ja-section" id="about">
        <div className="ja-wrap">
          <h2 className="ja-section-title">命盤から、自分らしさを読み解く。</h2>
          <p className="ja-section-lead">
            12の宮と14の主星、そして四化（しか）の動きから、人生の領域ごとに読み解きます。
          </p>
          <div className="ja-cards ja-cards-3">
            <div className="ja-card">
              <span className="ja-card-label">01 本質</span>
              <h3>生まれ持った資質がわかる</h3>
              <p>
                命宮（めいきゅう）に座る主星から、あなたの性格の芯と、人から見えやすい魅力を読み解きます。
                強みだけでなく、影の面もやさしくお伝えします。
              </p>
            </div>
            <div className="ja-card">
              <span className="ja-card-label">02 恋愛</span>
              <h3>恋愛の傾向と、縁の時期</h3>
              <p>
                夫妻宮（ふさいきゅう）を中心に、惹かれやすい相手のタイプ、関係が深まるまでの進み方、
                つまずきやすいポイントを読み解きます。
              </p>
            </div>
            <div className="ja-card">
              <span className="ja-card-label">03 仕事</span>
              <h3>仕事とお金の設計図</h3>
              <p>
                官禄宮（かんろくきゅう）と財帛宮（ざいばくきゅう）から、向いている働き方と、
                お金との付き合い方の傾向をお伝えします。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className="ja-section">
        <div className="ja-wrap">
          <h2 className="ja-section-title">診断の流れ</h2>
          <p className="ja-section-lead">入力するのは3項目だけ。簡単に診断できます。</p>
          <div className="ja-steps">
            <div className="ja-step">
              <strong>生年月日と時刻を入力</strong>
              <p>西暦の生年月日、わかれば出生時刻、都道府県を選ぶだけ。</p>
            </div>
            <div className="ja-step">
              <strong>命盤を自動計算</strong>
              <p>真太陽時で補正し、12の宮と主星の配置をその場で算出します。</p>
            </div>
            <div className="ja-step">
              <strong>診断結果が表示される</strong>
              <p>本質・恋愛・今年のテーマを、やさしい言葉でお届けします。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample */}
      <section className="ja-section">
        <div className="ja-wrap">
          <h2 className="ja-section-title">結果のサンプル</h2>
          <p className="ja-section-lead">※ 以下はサンプルです。実際の結果は命盤によって変わります。</p>
          <div className="ja-cards ja-cards-3">
            <div className="ja-card">
              <span className="ja-card-label">本質</span>
              <h3>あなたの資質</h3>
              <p>
                命宮には紫微（しび）が入っています。生まれながらの品格と存在感を持ち、
                自然と人の中心に立つ星です。責任感が強い一方で、弱みを見せにくいところも。
              </p>
            </div>
            <div className="ja-card">
              <span className="ja-card-label">恋愛</span>
              <h3>恋愛の傾向</h3>
              <p>
                夫妻宮には天府（てんぷ）が入っています。安心感と安定を重視し、
                派手さより「一緒にいて落ち着ける相手」を選ぶ傾向があります。
              </p>
            </div>
            <div className="ja-card">
              <span className="ja-card-label">今年</span>
              <h3>2026年のテーマ</h3>
              <p>
                今年は官禄宮に追い風が入り、仕事の評価や役割が動きやすい年。
                準備してきたことを前に出すチャンスです。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* More */}
      <section className="ja-section">
        <div className="ja-wrap">
          <h2 className="ja-section-title">もっと知る</h2>
          <p className="ja-section-lead">相性診断と、来年の運気をチェック。</p>
          <div className="ja-cards">
            <Link href="/ja/aishou" className="ja-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="ja-card-label">相性</span>
              <h3>お相手との相性を見る</h3>
              <p>
                二人の命盤を重ねて、惹かれ合うポイントと、すれ違いやすいところを読み解きます。無料。
              </p>
              <span style={{ display: 'inline-block', marginTop: 12, color: '#e3c473', fontSize: 13 }}>
                相性診断へ →
              </span>
            </Link>
            <Link href="/ja/2027" className="ja-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="ja-card-label">2027年</span>
              <h3>2027年の運気を読む</h3>
              <p>
                丁未年の四化（太陰禄・天同権・天機科・巨門忌）から、一年のテーマを読み解きます。
              </p>
              <span style={{ display: 'inline-block', marginTop: 12, color: '#e3c473', fontSize: 13 }}>
                2027年を見る →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Price */}
      <section className="ja-section" id="price">
        <div className="ja-wrap">
          <h2 className="ja-section-title">料金</h2>
          <p className="ja-section-lead">
            悩みに合わせて、必要な方だけ詳しい鑑定書を。
          </p>
          <div className="ja-price-grid ja-cards-3">
            <div className="ja-price">
              <h3>無料診断</h3>
              <div className="amount">
                0<small>円</small>
              </div>
              <p>命盤＋本質・恋愛・今年のテーマ</p>
              <Link href="/ja/shindan" className="ja-btn ja-btn-sm">
                診断する
              </Link>
            </div>
            <div className="ja-price featured">
              <span className="ja-badge">ベータ版・無料公開中</span>
              <h3>恋愛鑑定書</h3>
              <div className="amount">
                2,980<small>円（税込）</small>
              </div>
              <p>相手像・関係の育て方・縁の時期・アドバイス</p>
              <Link href="/ja/shindan" className="ja-btn ja-btn-sm">
                まずは無料診断
              </Link>
            </div>
            <div className="ja-price">
              <span className="ja-badge">ベータ版・無料公開中</span>
              <h3>事業鑑定書</h3>
              <div className="amount">
                4,980<small>円（税込）</small>
              </div>
              <p>仕事の資質・職種・お金・転機・行動ヒント</p>
              <Link href="/ja/shindan" className="ja-btn ja-btn-sm ja-btn-ghost">
                まずは無料診断
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="ja-section" id="faq">
        <div className="ja-wrap">
          <h2 className="ja-section-title">よくある質問</h2>
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

      {/* Final CTA */}
      <section className="ja-section" style={{ textAlign: 'center' }}>
        <div className="ja-wrap-narrow">
          <h2 className="ja-section-title">あなたの星の配置を、見てみませんか。</h2>
          <p className="ja-section-lead">登録不要・約30秒。まずは無料診断から。</p>
          <Link href="/ja/shindan" className="ja-btn">
            無料で診断する
          </Link>
          <p className="ja-disclaimer" style={{ marginTop: 28, borderTop: 'none' }}>
            本サービスは、紫微斗数を用いた自己理解のためのエンターテインメントです。
            将来の結果や特定の行動を保証するものではなく、医療・法律・投資などの専門的な助言に代わるものではありません。
          </p>
        </div>
      </section>
    </main>
  );
}
