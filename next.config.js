/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['lunar-javascript'],
  async redirects() {
    return [
      // ルートは繁体字版（港台）トップへ（ローカルでは中国語デモのまま）
      {
        source: '/',
        has: [{ type: 'host', value: 'shibikan.com' }],
        destination: '/zh',
        permanent: false,
      },
      {
        source: '/',
        has: [{ type: 'host', value: 'www.shibikan.com' }],
        destination: '/zh',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
