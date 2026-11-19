import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '隱私權政策',
  description: '紫微館的隱私權政策。',
  alternates: { canonical: '/zh/legal/privacy' },
};

export default function PrivacyPage() {
  return (
    <main>
      <div className="ja-wrap-narrow" style={{ padding: '56px 20px 72px' }}>
        <div className="ja-eyebrow">LEGAL</div>
        <h1 style={{ fontSize: 26, letterSpacing: '0.1em', marginBottom: 8 }}>隱私權政策</h1>
        <p style={{ fontSize: 12, color: '#8a8577', marginBottom: 28 }}>最後更新：2026 年 11 月</p>

        <div className="ja-reading">
          <article className="ja-article">
            <h2>1. 蒐集的資訊</h2>
            <p>
              本服務為了診斷，會取得以下資訊：出生年月日、出生時刻（選填）、出生地（縣市）、性別。
              另外，為了流量分析，可能取得裝置資訊、瀏覽頁面、來源等統計資訊。
            </p>
            <p>
              姓名、地址、電話、信用卡號不會儲存在本服務的伺服器。導入付款時，會在本政策追記付款業者的處理方式。
            </p>
          </article>

          <article className="ja-article">
            <h2>2. 利用目的</h2>
            <p>
              取得的資訊用於命盤計算與解讀顯示、服務改善、回覆諮詢，不會用於其他目的。
            </p>
          </article>

          <article className="ja-article">
            <h2>3. 保存與第三方提供</h2>
            <p>
              Beta 版中，輸入的出生資訊只用於命盤計算，不會存入本服務的資料庫；但可能出現在 URL 參數、伺服器存取紀錄、瀏覽器歷史、流量分析工具中。
              未來若加入歷史紀錄功能，會明示保存目的與期間，必要時取得同意。
            </p>
            <p>除依法令要求外，不會販售或提供取得的資訊給第三方。</p>
          </article>

          <article className="ja-article">
            <h2>4. 委託與跨境提供</h2>
            <p>
              付款處理可能委託外部付款業者。現階段沒有將輸入資訊提供給國外第三方的預定；未來若使用國外服務，會在本政策記載移轉國家與保護制度，必要時取得同意。
            </p>
          </article>

          <article className="ja-article">
            <h2>5. 安全管理</h2>
            <p>
              通訊以 HTTPS 加密。透過最小化存取權限、確認紀錄等方式，努力防止個人資訊外洩、滅失或毀損。
            </p>
          </article>

          <article className="ja-article">
            <h2>6. 查閱・更正・刪除</h2>
            <p>
              本人提出查閱、更正、停止利用或刪除個人資訊的請求時，會在確認身分後依法處理。
              聯絡信箱：support@example.com（Beta 版）
            </p>
          </article>

          <article className="ja-article">
            <h2>7. 修訂</h2>
            <p>本政策可能因法令或服務內容變更而修訂。重要變更會在本服務上公告。</p>
          </article>
        </div>

        <div style={{ marginTop: 24 }}>
          <Link href="/zh" className="ja-btn ja-btn-ghost ja-btn-sm">回到首頁</Link>
        </div>
      </div>
    </main>
  );
}
