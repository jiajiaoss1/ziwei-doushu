import Link from 'next/link';

/** 日本語版 共通フッター */
export default function SiteFooter() {
  return (
    <footer className="ja-footer">
      <div className="ja-wrap ja-footer-inner">
        <div>
          <div style={{ marginBottom: 8, color: '#a49e8f', letterSpacing: '0.12em' }}>紫微館（しびかん）</div>
          <div>中国伝統の占術・紫微斗数をもとに、あなたの星の設計図を読み解きます。</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div>
            <Link href="/ja/articles">読みもの</Link>
            <Link href="/ja/aishou">相性診断</Link>
            <Link href="/ja/2027">2027年</Link>
            <Link href="/ja/legal/terms">利用規約</Link>
            <Link href="/ja/legal/privacy">プライバシーポリシー</Link>
            <Link href="/ja/legal/tokushoho">特定商取引法に基づく表記</Link>
          </div>
          <div style={{ marginTop: 10 }}>© 2026 紫微館</div>
        </div>
      </div>
    </footer>
  );
}
