import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: '紫微館のプライバシーポリシーです。',
  alternates: { canonical: '/ja/legal/privacy' },
};

export default function PrivacyPage() {
  return (
    <main>
      <div className="ja-wrap-narrow" style={{ padding: '56px 20px 72px' }}>
        <div className="ja-eyebrow">LEGAL</div>
        <h1 className="ja-serif" style={{ fontSize: 26, letterSpacing: '0.1em', marginBottom: 8 }}>
          プライバシーポリシー
        </h1>
        <p style={{ fontSize: 12, color: '#8a8577', marginBottom: 28 }}>
          最終更新：2026年11月
        </p>

        <div className="ja-reading">
          <article className="ja-article">
            <h2>1. 取得する情報</h2>
            <p>
              当サービスでは、診断のために以下の情報を取得します。生年月日、出生時刻（任意）、出生地（都道府県）、性別。
              あわせて、アクセス解析のため、端末情報・閲覧ページ・参照元などの統計情報を取得する場合があります。
            </p>
            <p>
              氏名・住所・電話番号・クレジットカード番号を、当サービスのサーバーに保存することはありません。
            </p>
          </article>

          <article className="ja-article">
            <h2>2. 利用目的</h2>
            <p>
              取得した情報は、命盤の計算および読み解きの表示、サービスの改善、お問い合わせへの対応のために利用します。
              それ以外の目的で利用することはありません。
            </p>
          </article>

          <article className="ja-article">
            <h2>3. 保存と第三者提供</h2>
            <p>
              ベータ版では、入力された生年月日等は URL のパラメータとして扱われ、当サービスのデータベースには保存しません。
              今後、履歴機能等を追加する場合は、保存の目的と期間を明示し、必要に応じて同意を取得します。
            </p>
            <p>
              法令に基づく場合を除き、取得した情報を第三者へ販売・提供することはありません。
            </p>
          </article>

          <article className="ja-article">
            <h2>4. 委託・外国にある第三者への提供</h2>
            <p>
              決済処理を外部の決済事業者に委託する場合があります。この場合、委託先の所在国・個人情報保護制度について、
              正式版の公開までに本ポリシーへ追記します。現時点では、入力情報を国外の第三者へ提供していません。
            </p>
          </article>

          <article className="ja-article">
            <h2>5. 安全管理措置</h2>
            <p>
              通信は HTTPS により暗号化します。アクセス権限の最小化、ログの確認等、個人情報の漏えい・滅失・毀損の防止に努めます。
            </p>
          </article>

          <article className="ja-article">
            <h2>6. 開示・訂正・削除の請求</h2>
            <p>
              ご本人からの個人情報の開示・訂正・利用停止・削除のご請求には、本人確認のうえ、法令に従い対応します。
              お問い合わせ先：support@example.com（ベータ版）
            </p>
          </article>

          <article className="ja-article">
            <h2>7. 改定</h2>
            <p>
              本ポリシーは、法令の変更やサービス内容の変更に応じて改定することがあります。重要な変更がある場合は、
              本サービス上でお知らせします。
            </p>
          </article>
        </div>

        <div style={{ marginTop: 24 }}>
          <Link href="/ja" className="ja-btn ja-btn-ghost ja-btn-sm">
            トップへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
