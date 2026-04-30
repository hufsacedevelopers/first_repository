/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next.js 16+: 로컬 네트워크 IP에서 dev 접속 시 허용 origin을 명시해야 함
  allowedDevOrigins: ["172.30.1.1"]
};

export default nextConfig;
