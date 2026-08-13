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
}

export default withMicrofrontends(nextConfig);

