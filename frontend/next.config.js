/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    'rc-util',
    'rc-input',
    'antd',
    '@ant-design/icons',
    '@ant-design/icons-svg',
    '@ant-design/cssinjs',
    '@ant-design/colors',
    '@ctrl/tinycolor',
    'rc-pagination',
    'rc-picker',
    'rc-table',
    'rc-tree',
    'rc-motion'
  ],
  experimental: {
    esmExternals: 'loose'
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*'
      }
    ]
  },
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx']
    }
    return config
  }
};

module.exports = nextConfig; 