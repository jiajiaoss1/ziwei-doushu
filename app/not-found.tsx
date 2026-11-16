import Link from 'next/link';

/** 全站共通の 404（日本語版・中文版の両方から到達しうる） */
export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        padding: '48px 20px',
        textAlign: 'center',
        background: 'var(--bg-page)',
        color: 'var(--tx-0)',
      }}
    >
      <div style={{ fontSize: 11, letterSpacing: '0.4em', color: 'var(--ac)' }}>404 NOT FOUND</div>
      <h1 style={{ fontSize: 26, margin: 0, letterSpacing: '0.06em' }}>ページが見つかりません</h1>
      <p style={{ color: 'var(--tx-2)', fontSize: 14, margin: 0 }}>
        お探しのページは、移動したか削除された可能性があります。
      </p>
      <p style={{ color: 'var(--tx-3)', fontSize: 12, margin: 0 }}>The page you are looking for was not found.</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 12 }}>
        <Link
          href="/ja"
          style={{
            padding: '12px 24px',
            borderRadius: 999,
            background: 'linear-gradient(135deg,#d8b65e,#b8902f)',
            color: '#171204',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          紫微館トップへ
        </Link>
        <Link
          href="/ja/shindan"
          style={{
            padding: '12px 24px',
            borderRadius: 999,
            border: '1px solid var(--ac-bdr)',
            color: 'var(--ac)',
            textDecoration: 'none',
            fontSize: 14,
          }}
        >
          無料診断へ
        </Link>
        <Link
          href="/"
          style={{
            padding: '12px 24px',
            borderRadius: 999,
            border: '1px solid var(--bdr)',
            color: 'var(--tx-3)',
            textDecoration: 'none',
            fontSize: 13,
          }}
        >
          中文首页
        </Link>
      </div>
    </main>
  );
}
