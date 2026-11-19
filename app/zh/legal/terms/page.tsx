import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '使用條款',
  description: '紫微館的使用條款。',
  alternates: { canonical: '/zh/legal/terms' },
};

export default function TermsPage() {
  return (
    <main>
      <div className="ja-wrap-narrow" style={{ padding: '56px 20px 72px' }}>
        <div className="ja-eyebrow">LEGAL</div>
        <h1 style={{ fontSize: 26, letterSpacing: '0.1em', marginBottom: 8 }}>使用條款</h1>
        <p style={{ fontSize: 12, color: '#8a8577', marginBottom: 28 }}>最後更新：2026 年 11 月</p>

        <div className="ja-reading">
          <article className="ja-article">
            <h2>第 1 條（服務內容）</h2>
            <p>
              本服務「紫微館」是以紫微斗數計算命盤、顯示解讀的娛樂性服務，不保證未來的事件或結果。
            </p>
          </article>

          <article className="ja-article">
            <h2>第 2 條（使用條件）</h2>
            <p>
              使用者須同意本條款後使用本服務。未成年人使用時，請取得監護人同意。
            </p>
          </article>

          <article className="ja-article">
            <h2>第 3 條（禁止事項）</h2>
            <p>
              禁止以下行為：違反法令或公序良俗、侵害本服務或第三方權利、妨礙本服務營運、以自動化手段大量存取，以及其他經判斷為不適當的行為。
            </p>
          </article>

          <article className="ja-article">
            <h2>第 4 條（免責）</h2>
            <p>
              本服務的結果是為了自我理解的參考資訊，不能取代醫療、法律、投資或其他專業建議。
              對於使用者依本服務結果所做的判斷與行動，本服務不負責任。
            </p>
            <p>
              出生時刻不準確時，命盤可能與實際不同；通訊環境或裝置也可能造成顯示異常。
            </p>
          </article>

          <article className="ja-article">
            <h2>第 5 條（智慧財產）</h2>
            <p>
              本服務的文字、設計、程式等著作權，歸本服務或正當權利人所有。禁止超出私人使用範圍的複製、轉載或再散布。
            </p>
          </article>

          <article className="ja-article">
            <h2>第 6 條（服務變更・停止）</h2>
            <p>
              本服務可能不經事先通知變更內容或停止提供。因此造成使用者的損害，本服務不負責任。
            </p>
          </article>

          <article className="ja-article">
            <h2>第 7 條（準據法・管轄）</h2>
            <p>
              本條款以服務提供地的法律為準據法（營運主體確定後更新）。因本服務產生爭議時，以營運主體所在地的法院為第一審專屬管轄法院。
            </p>
          </article>
        </div>

        <div style={{ marginTop: 24 }}>
          <Link href="/zh" className="ja-btn ja-btn-ghost ja-btn-sm">回到首頁</Link>
        </div>
      </div>
    </main>
  );
}
