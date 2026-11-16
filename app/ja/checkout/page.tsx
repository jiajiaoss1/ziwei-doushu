import type { Metadata } from 'next';
import Link from 'next/link';
import { isValidJpBirthInput, type JpBirthInput } from '@/lib/jp/birth';
import TrackView from '@/components/jp/TrackView';
import {
  REPORT_PRICES,
  getCheckoutUrl,
  isBetaFree,
  type PaidReportType,
} from '@/lib/jp/access';

export const metadata: Metadata = {
  title: 'お支払い',
  robots: { index: false, follow: false },
};

type SP = Promise<Record<string, string | string[] | undefined>>;

function one(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? '') : (v ?? '');
}

export default async function CheckoutPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const type: PaidReportType = one(sp.type) === 'love' ? 'love' : 'work';
  const input: JpBirthInput = {
    year: Number(one(sp.y)),
    month: Number(one(sp.m)),
    day: Number(one(sp.d)),
    clockHour: Number(one(sp.h)),
    clockMinute: Number(one(sp.mi)),
    unknownTime: one(sp.u) === '1',
    prefecture: one(sp.p) || '東京都',
    gender: one(sp.g) === 'm' ? 'male' : 'female',
  };

  if (!isValidJpBirthInput(input)) {
    return (
      <main>
        <div className="ja-wrap-narrow" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <h1 className="ja-serif" style={{ fontSize: 24, marginBottom: 16 }}>
            入力内容を確認してください
          </h1>
          <Link href="/ja/shindan" className="ja-btn">
            入力画面へ戻る
          </Link>
        </div>
      </main>
    );
  }

  const qs = new URLSearchParams({
    y: String(input.year),
    m: String(input.month),
    d: String(input.day),
    g: input.gender === 'male' ? 'm' : 'f',
    p: input.prefecture,
    ...(input.unknownTime
      ? { u: '1' }
      : { h: String(input.clockHour), mi: String(input.clockMinute) }),
    type,
  });

  const price = REPORT_PRICES[type];
  const beta = isBetaFree();
  const externalUrl = getCheckoutUrl();
  const title = type === 'love' ? '恋愛鑑定書' : '事業鑑定書';
  const reportHref = `/ja/report?${qs.toString()}`;

  return (
    <main>
      <TrackView event="jp_checkout_view" props={{ type, beta }} />
      <div className="ja-wrap-narrow" style={{ padding: '56px 20px 72px' }}>
        <div className="ja-eyebrow">CHECKOUT</div>
        <h1 className="ja-serif" style={{ fontSize: 26, letterSpacing: '0.1em', marginBottom: 8 }}>
          お支払い
        </h1>
        <p style={{ fontSize: 13, color: '#a49e8f', marginBottom: 26 }}>
          {title}の全文をお読みいただけます。
        </p>

        <div
          className="ja-card"
          style={{ marginBottom: 22, padding: '24px 22px', borderRadius: 14 }}
        >
          <span className="ja-card-label">{type === 'love' ? '恋愛' : '仕事'}</span>
          <h2 className="ja-serif" style={{ fontSize: 20, margin: '4px 0 10px', letterSpacing: '0.06em' }}>
            {title}
          </h2>
          <p style={{ fontSize: 13, color: '#a49e8f', margin: '0 0 16px' }}>
            3行サマリー＋命盤＋6項目の詳細鑑定。
          </p>
          <div
            style={{
              fontFamily: "'Hiragino Mincho ProN', 'Yu Mincho', serif",
              fontSize: 34,
              color: '#e3c473',
            }}
          >
            ¥{price.toLocaleString('ja-JP')}
            <span style={{ fontSize: 12, color: '#a49e8f', marginLeft: 6 }}>（税込）</span>
          </div>
        </div>

        {beta ? (
          <div
            style={{
              border: '1px solid rgba(201,165,74,0.4)',
              borderRadius: 12,
              padding: '18px 20px',
              background: 'rgba(201,165,74,0.08)',
              marginBottom: 22,
              fontSize: 13,
              color: '#e6dfd0',
              lineHeight: 1.9,
            }}
          >
            ベータ版のため、現在は全文を無料で公開しています。お支払いは発生しません。<strong style={{ color: '#e3c473' }}>無料</strong>で全文を公開しています。
            お支払いは発生しません。
          </div>
        ) : (
          <div
            style={{
              border: '1px solid rgba(201,165,74,0.25)',
              borderRadius: 12,
              padding: '18px 20px',
              marginBottom: 22,
              fontSize: 13,
              color: '#a49e8f',
              lineHeight: 1.9,
            }}
          >
            決済はクレジットカード（Stripe）または外部決済ページを予定しています。
            決済完了後、鑑定書の全文URLが発行されます。
          </div>
        )}

        {beta || externalUrl ? (
          <a
            href={beta ? reportHref : externalUrl}
            className="ja-btn"
            style={{ width: '100%', textAlign: 'center' }}
            {...(beta ? {} : { rel: 'noopener noreferrer' })}
          >
            {beta ? '無料で全文を読む' : '決済ページへ進む'}
          </a>
        ) : (
          <button type="button" className="ja-btn" disabled style={{ width: '100%', opacity: 0.5 }}>
            決済準備中
          </button>
        )}

        <p style={{ fontSize: 11.5, color: '#8a8577', marginTop: 18, lineHeight: 1.9 }}>
          返品・キャンセルの条件は、デジタルコンテンツの提供方法や契約内容に応じて定めます。正式公開前に、適用法令に照らして確認してください。
          詳細は
          <Link
            href="/ja/legal/tokushoho"
            style={{ color: '#a49e8f', textDecoration: 'underline' }}
          >
            特定商取引法に基づく表記
          </Link>
          をご確認ください。
        </p>

        <div style={{ marginTop: 26 }}>
          <Link href={reportHref} className="ja-btn ja-btn-ghost ja-btn-sm">
            鑑定書に戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
