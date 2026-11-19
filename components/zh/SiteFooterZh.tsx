import Link from 'next/link';

/** 港台版 共通頁尾 */
export default function SiteFooterZh() {
  return (
    <footer className="ja-footer">
      <div className="ja-wrap ja-footer-inner">
        <div>
          <div style={{ marginBottom: 8, color: '#a49e8f', letterSpacing: '0.12em' }}>紫微館</div>
          <div>以中國傳統占術・紫微斗數，為你解讀自己的星圖。</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div>
            <Link href="/zh/shindan">免費診斷</Link>
          </div>
          <div style={{ marginTop: 10 }}>© 2026 紫微館</div>
        </div>
      </div>
    </footer>
  );
}
