/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['lunar-javascript'],
  async redirects() {
    return [
      // 日本版ドメインのルートは日本語トップへ（ローカルでは中国語デモのまま）
      {
        source: '/',
        has: [{ type: 'host', value: 'shibikan.com' }],
        destination: '/ja',
        permanent: false,
      },
      {
        source: '/',
        has: [{ type: 'host', value: 'www.shibikan.com' }],
        destination: '/ja',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
