/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['rc-input', 'antd', '@ant-design/icons', '@ant-design/cssinjs'],
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig; 