import type { Metadata } from 'next';
import SelfCheckResult from '@/components/zh/SelfCheckResult';

export const metadata: Metadata = {
  title: '初步整理',
  robots: { index: false, follow: false },
};

export default function CheckResultPage() {
  return <SelfCheckResult />;
}
