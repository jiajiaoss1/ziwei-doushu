import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記',
  description: '紫微館の特定商取引法に基づく表記です。',
  alternates: { canonical: '/ja/legal/tokushoho' },
};

export default function TokushohoPage() {
  return (
    <main>
      <div className="ja-wrap-narrow" style={{ padding: '56px 20px 72px' }}>
        <div className="ja-eyebrow">LEGAL</div>
        <h1 className="ja-serif" style={{ fontSize: 26, letterSpacing: '0.1em', marginBottom: 8 }}>
          特定商取引法に基づく表記
        </h1>
        <p style={{ fontSize: 12, color: '#8a8577', marginBottom: 28 }}>
          特定商取引に関する法律第11条に基づく表記です。
        </p>

        <div className="ja-reading">
          <article className="ja-article">
            <h2>事業者情報</h2>
            {[
              ['販売事業者', '準備中（法人設立準備中）'],
              ['運営責任者', '準備中'],
              ['所在地', '準備中'],
              ['連絡先', 'support@example.com（ベータ版）'],
              ['電話番号', '準備中（お問い合わせはメールでお願いいたします）'],
            ].map(([k, v]) => (
              <p key={k} style={{ marginBottom: 8 }}>
                <strong style={{ color: '#e3c473', fontWeight: 500 }}>{k}：</strong>
                {v}
              </p>
            ))}
          </article>

          <article className="ja-article">
            <h2>販売条件</h2>
            {[
              ['販売価格', '各商品ページに記載の価格（税込）'],
              ['商品代金以外の費用', 'インターネット接続料金等はお客様のご負担となります'],
              ['支払方法', 'クレジットカード決済（Stripe）を予定'],
              ['支払時期', 'ご購入時にお支払いが確定します'],
              ['引渡時期', '決済完了後、ただちにデジタルコンテンツを表示します'],
              ['返品・キャンセル', '返品・キャンセルの条件は、デジタルコンテンツの提供方法や契約内容に応じて定めます。正式公開前に、適用法令に照らして確認してください。ただし、表示不具合等の場合は再提供または返金にて対応します'],
              ['販売数量', '制限なし'],
              ['動作環境', '最新版の Safari / Chrome / Edge 等のブラウザ'],
            ].map(([k, v]) => (
              <p key={k} style={{ marginBottom: 8 }}>
                <strong style={{ color: '#e3c473', fontWeight: 500 }}>{k}：</strong>
                {v}
              </p>
            ))}
          </article>
        </div>

        <p className="ja-disclaimer">
          ベータ版期間中は鑑定書を無料で公開しています。有料提供を開始する前に、販売条件と事業者情報を確定し、最新の内容に更新します。
        </p>

        <div style={{ marginTop: 24 }}>
          <Link href="/ja" className="ja-btn ja-btn-ghost ja-btn-sm">
            トップへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
