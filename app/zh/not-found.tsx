import Link from 'next/link';

/** /zh 底下觸發 notFound() 時的 404 */
export default function ZhNotFound() {
  return (
    <main>
      <div className="ja-wrap-narrow" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="ja-eyebrow">404 NOT FOUND</div>
        <h1 style={{ fontSize: 26, letterSpacing: '0.08em', margin: '0 0 12px' }}>
          找不到頁面
        </h1>
        <p style={{ color: '#a49e8f', fontSize: 14, lineHeight: 1.9, marginBottom: 26 }}>
          你要找的頁面可能已移動或刪除。
          <br />
          可以從下面的連結再找找看。
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/zh" className="ja-btn ja-btn-sm">回到紫微館首頁</Link>
          <Link href="/zh/shindan" className="ja-btn ja-btn-ghost ja-btn-sm">免費診斷</Link>
        </div>
      </div>
    </main>
  );
}
