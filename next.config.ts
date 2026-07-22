import { BASE_PATH } from './app/lib/constants';

const nextConfig: import('next').NextConfig = {
  basePath: BASE_PATH,
  images: {
    remotePatterns: [
      new URL(process.env.NEXT_PUBLIC_S3_BASE_URL + "/**"),
    ],
  },
}

export default nextConfig;