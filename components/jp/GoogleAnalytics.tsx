'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** GA4。NEXT_PUBLIC_GA_ID が未設定なら何も読み込まない。 */
export default function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  const pathname = usePathname();

  useEffect(() => {
    if (!id || typeof window === 'undefined' || !window.gtag) return;
    window.gtag('event', 'page_view', { page_path: pathname });
  }, [id, pathname]);

  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${id}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}
