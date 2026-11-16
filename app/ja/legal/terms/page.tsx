import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '利用規約',
  description: '紫微館の利用規約です。',
  alternates: { canonical: '/ja/legal/terms' },
};

export default function TermsPage() {
  return (
    <main>
      <div className="ja-wrap-narrow" style={{ padding: '56px 20px 72px' }}>
        <div className="ja-eyebrow">LEGAL</div>
        <h1 className="ja-serif" style={{ fontSize: 26, letterSpacing: '0.1em', marginBottom: 8 }}>
          利用規約
        </h1>
        <p style={{ fontSize: 12, color: '#8a8577', marginBottom: 28 }}>最終更新：2026年11月</p>

        <div className="ja-reading">
          <article className="ja-article">
            <h2>第1条（サービス内容）</h2>
            <p>
              本サービス「紫微館」は、紫微斗数（しびとすう）を用いて命盤を計算し、読み解きを表示する
              エンターテインメントサービスです。当サービスは、将来の出来事や結果を保証するものではありません。
            </p>
          </article>

          <article className="ja-article">
            <h2>第2条（利用条件）</h2>
            <p>
              利用者は、本規約に同意のうえ、本サービスを利用するものとします。未成年者が利用する場合は、
              保護者の同意を得てください。
            </p>
          </article>

          <article className="ja-article">
            <h2>第3条（禁止事項）</h2>
            <p>
              次の行為を禁止します。法令または公序良俗に違反する行為、当サービスまたは第三者の権利を侵害する行為、
              本サービスの運営を妨げる行為、自動化された手段による大量アクセス、その他当方が不適切と判断する行為。
            </p>
          </article>

          <article className="ja-article">
            <h2>第4条（免責事項）</h2>
            <p>
              本サービスの結果は、自己理解のための参考情報です。医療・法律・投資・その他の専門的助言ではありません。
              利用者が本サービスの結果に基づいて行った判断・行動について、当方は責任を負いません。
            </p>
            <p>
              出生時刻が不正確な場合、命盤が実際と異なる可能性があります。また、通信環境や端末により、
              表示が乱れる場合があります。
            </p>
          </article>

          <article className="ja-article">
            <h2>第5条（知的財産）</h2>
            <p>
              本サービスの文章・デザイン・プログラム等の著作権は、当方または正当な権利者に帰属します。
              私的利用の範囲を超える複製・転載・再配布を禁止します。
            </p>
          </article>

          <article className="ja-article">
            <h2>第6条（サービスの変更・停止）</h2>
            <p>
              当方は、事前の通知なく、本サービスの内容を変更し、または提供を停止することがあります。
              これにより利用者に生じた損害について、当方は責任を負いません。
            </p>
          </article>

          <article className="ja-article">
            <h2>第7条（準拠法・管轄）</h2>
            <p>
              本規約は日本法に準拠します。本サービスに関して紛争が生じた場合、当方の所在地を管轄する裁判所を
              第一審の専属的合意管轄裁判所とします。
            </p>
          </article>
        </div>

        <div style={{ marginTop: 24 }}>
          <Link href="/ja" className="ja-btn ja-btn-ghost ja-btn-sm">
            トップへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
