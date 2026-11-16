'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** 中文版首页右下角提示：日本語版への導線（他ページでは出さない） */
export default function LocaleBanner() {
  const pathname = usePathname();
  if (pathname !== '/') return null;

  return (
    <Link
      href="/ja"
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 60,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 18px',
        borderRadius: 999,
        background: 'linear-gradient(135deg, #d8b65e 0%, #b8902f 100%)',
        color: '#171204',
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textDecoration: 'none',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      }}
    >
      日本語版 紫微館 →
    </Link>
  );
}
