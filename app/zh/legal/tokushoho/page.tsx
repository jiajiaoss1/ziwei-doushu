import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '交易條款',
  description: '紫微館的交易條款（營運主體資訊準備中）。',
  alternates: { canonical: '/zh/legal/tokushoho' },
};

export default function TokushohoPage() {
  return (
    <main>
      <div className="ja-wrap-narrow" style={{ padding: '56px 20px 72px' }}>
        <div className="ja-eyebrow">LEGAL</div>
        <h1 style={{ fontSize: 26, letterSpacing: '0.1em', marginBottom: 8 }}>交易條款</h1>
        <p style={{ fontSize: 12, color: '#8a8577', marginBottom: 28 }}>
          營運主體與交易條件確定後，會更新本頁。
        </p>

        <div className="ja-reading">
          <article className="ja-article">
            <h2>營運主體資訊</h2>
            {[
              ['銷售事業者', '準備中'],
              ['營運負責人', '準備中'],
              ['所在地', '準備中'],
              ['聯絡信箱', 'support@example.com（Beta 版）'],
              ['電話', '準備中（請以電子郵件聯絡）'],
            ].map(([k, v]) => (
              <p key={k} style={{ marginBottom: 8 }}>
                <strong style={{ color: '#e3c473', fontWeight: 500 }}>{k}：</strong>
                {v}
              </p>
            ))}
          </article>

          <article className="ja-article">
            <h2>銷售條件</h2>
            {[
              ['價格', '各商品頁記載的價格（含稅）'],
              ['價格以外費用', '網路連線費等由使用者負擔'],
              ['付款方式', '預計採信用卡（經付款代行公司）'],
              ['付款時間', '購買時即確認付款'],
              ['交付時間', '付款完成後，立即顯示數位內容'],
              ['退貨・取消', '數位內容於付款完成後立即提供（解鎖鑑定書全文）。付款前可取消；付款後因內容已即時提供，原則上不退款。若因系統故障、重複扣款或顯示異常而無法正常閱讀，將以重新提供或退款處理'],
              ['銷售數量', '無限制'],
              ['執行環境', '最新版 Safari / Chrome / Edge 等瀏覽器'],
            ].map(([k, v]) => (
              <p key={k} style={{ marginBottom: 8 }}>
                <strong style={{ color: '#e3c473', fontWeight: 500 }}>{k}：</strong>
                {v}
              </p>
            ))}
          </article>

          <article className="ja-article">
            <h2>數位內容與退款</h2>
            <p>
              本服務提供的是數位內容（線上鑑定書）。付款完成後，鑑定書全文會立即解鎖，屬於「經您同意即時提供」的服務。
            </p>
            <p>
              依適用法令（包含台灣消費者保護法關於通訊交易之規定），經您同意即時提供之數位內容，可能不適用七日猶豫期。
              若您有疑慮，請在付款前確認內容與價格。
            </p>
            <p>
              付款前可取消；付款後原則上不退款。若因系統故障、重複扣款或顯示異常而無法正常閱讀，請聯絡 support@example.com，
              我們將重新提供或退款（原支付方式退回）。
            </p>
          </article>
        </div>

        <p className="ja-disclaimer">
          Beta 期間鑑定書免費公開。開始收費前，會確定銷售條件與營運主體資訊，並更新為最新內容。
        </p>

        <div style={{ marginTop: 24 }}>
          <Link href="/zh" className="ja-btn ja-btn-ghost ja-btn-sm">回到首頁</Link>
        </div>
      </div>
    </main>
  );
}
