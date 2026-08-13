import { loadEnvConfig } from '@next/env';
import { withMicrofrontends } from '@vercel/microfrontends/next/config';

// next/jest loads this config (to resolve its transform settings) before it loads
// .env.local itself, so env vars this file depends on — NEXT_PUBLIC_S3_BASE_URL,
// VC_MICROFRONTENDS_CONFIG (read inside withMicrofrontends) — aren't set yet on
// that first pass. Load them ourselves so both phases see the same values.
loadEnvConfig(process.cwd())

const s3BaseUrl = process.env.NEXT_PUBLIC_S3_BASE_URL

const nextConfig: import('next').NextConfig = {
  typescript: {
    // Keep test files out of the production type-check; tsconfig.json (used by
    // the editor and `pnpm test`) still includes them for path-alias resolution.
    tsconfigPath: './tsconfig.build.json',
  },
  images: {
    remotePatterns: s3BaseUrl ? [new URL(s3BaseUrl + "/**")] : [],
  },
}

export default withMicrofrontends(nextConfig);

