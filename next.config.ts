/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // ✅ ตั้งเผื่อไว้เลยครับ ไม่งั้นจะเจอ Error เดิมอีก
    },
  },
};

export default nextConfig;