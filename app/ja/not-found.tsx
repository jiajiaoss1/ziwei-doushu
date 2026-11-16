import Link from 'next/link';

/** /ja 配下で notFound() が投げられたときの 404 */
export default function JaNotFound() {
  return (
    <main>
      <div className="ja-wrap-narrow" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="ja-eyebrow">404 NOT FOUND</div>
        <h1 className="ja-serif" style={{ fontSize: 26, letterSpacing: '0.08em', margin: '0 0 12px' }}>
          ページが見つかりません
        </h1>
        <p style={{ color: '#a49e8f', fontSize: 14, lineHeight: 1.9, marginBottom: 26 }}>
          お探しのページは、移動したか削除された可能性があります。
          <br />
          下のリンクから、もう一度たどってみてください。
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/ja" className="ja-btn ja-btn-sm">
            紫微館トップへ
          </Link>
          <Link href="/ja/shindan" className="ja-btn ja-btn-ghost ja-btn-sm">
            無料診断へ
          </Link>
          <Link href="/ja/articles" className="ja-btn ja-btn-ghost ja-btn-sm">
            読みものへ
          </Link>
        </div>
      </div>
    </main>
  );
}
