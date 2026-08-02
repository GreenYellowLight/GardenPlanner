import { BASE_PATH } from './app/lib/constants';

const nextConfig: import('next').NextConfig = {
  basePath: BASE_PATH,
  images: {
    remotePatterns: [
      new URL(process.env.NEXT_PUBLIC_S3_BASE_URL + "/**"),
    ],
  },
  experimental: {
    serverActions: {

      // This repo intended to be on /garden-planner of another domain.
      // Server Actions compare the `Origin` header to the `Host` header to
      // prevent CSRF. When this app is reached via the homepage's rewrite
      // proxy (eg localhost:3000 -> localhost:3001), those headers won't match
      // unless the proxy's origin is explicitly trusted here.
      allowedOrigins: [process.env.ALLOWED_ORIGIN!],
    },
  },
}

export default nextConfig;