import Link from 'next/link';

/** 日本語版 共通ヘッダー */
export default function SiteHeader({ current }: { current?: 'home' | 'shindan' | 'price' | 'faq' }) {
  return (
    <header className="ja-header">
      <div className="ja-wrap ja-header-inner">
        <Link href="/ja" className="ja-logo" aria-label="紫微館 トップ">
          <strong>紫微館</strong>
          <span>SHIBIKAN</span>
        </Link>
        <nav className="ja-nav" aria-label="メインナビゲーション">
          <Link href="/ja/articles">読みもの</Link>
          <Link href="/ja/shindan">無料診断</Link>
          <Link href="/ja/aishou">相性</Link>
          <Link href="/ja#price" className="ja-nav-price">料金</Link>
          <Link href="/ja#faq" className="ja-nav-faq">よくある質問</Link>
        </nav>
      </div>
    </header>
  );
}
