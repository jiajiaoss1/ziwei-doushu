import Link from 'next/link';

/** 港台版 共通頁首 */
export default function SiteHeaderZh({ current }: { current?: 'home' | 'shindan' }) {
  return (
    <header className="ja-header">
      <div className="ja-wrap ja-header-inner">
        <Link href="/zh" className="ja-logo" aria-label="紫微館 首頁">
          <strong>紫微館</strong>
          <span>SHIBIKAN</span>
        </Link>
        <nav className="ja-nav" aria-label="主要導覽">
          <Link href="/zh/shindan">免費診斷</Link>
          <Link href="/zh#about">關於紫微斗數</Link>
        </nav>
      </div>
    </header>
  );
}
