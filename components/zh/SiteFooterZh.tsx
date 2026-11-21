import Link from 'next/link';

/** 港台版 共通頁尾 */
export default function SiteFooterZh() {
  return (
    <footer className="ja-footer">
      <div className="ja-wrap ja-footer-inner">
        <div>
          <div style={{ marginBottom: 8, color: '#a49e8f', letterSpacing: '0.12em' }}>紫微館</div>
          <div>用命盤整理關係的混亂，做成可以回看的決定。</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div>
            <Link href="/zh/check">關係決策自查</Link>
          </div>
          <div style={{ marginTop: 10 }}>© 2026 紫微館</div>
          <div style={{ marginTop: 6, fontSize: 11, color: '#8a8577' }}>
            參考：倪海廈《天紀》、紫微斗數全書
          </div>
        </div>
      </div>
    </footer>
  );
}
