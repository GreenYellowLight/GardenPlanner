import { withMicrofrontends } from '@vercel/microfrontends/next/config';

const nextConfig: import('next').NextConfig = {
  typescript: {
    // Keep test files out of the production type-check; tsconfig.json (used by
    // the editor and `pnpm test`) still includes them for path-alias resolution.
    tsconfigPath: './tsconfig.build.json',
  },
  images: {
    remotePatterns: [
      new URL(process.env.NEXT_PUBLIC_S3_BASE_URL + "/**"),
    ],
  },
  experimental: {
    serverActions: {

      // This app is served under /garden-planner via Vercel Microfrontends.
      // Server Actions compare the `Origin` header to the `Host` header to
      // prevent CSRF. During local dev, requests arrive through the
      // microfrontends proxy (a different origin than this app's own dev
      // server), so that origin needs to be explicitly trusted here.
      allowedOrigins: [process.env.ALLOWED_ORIGIN!],
    },
  },
}

export default withMicrofrontends(nextConfig);
