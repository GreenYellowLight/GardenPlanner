# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev        # start dev server
pnpm build      # production build
pnpm lint       # ESLint
pnpm test       # Jest
pnpm test:watch # Jest, watch mode
```

To seed the database, hit `GET /garden-planner/seed` in the browser or with curl after the dev server is running.

## Environment

Requires `.env.local` with:
- `POSTGRES_URL` — connection string to a Postgres database
- `OPENAI_API_KEY` — used by the `/api/generate` route

## Microfrontends

This app is a child application in a [Vercel Microfrontends](https://vercel.com/docs/microfrontends) group, served under `/garden-planner` on the `homepage` project's domain (the default app). All routes and `public/` assets live under a `garden-planner/` prefix (`app/garden-planner/...`, `public/garden-planner/...`) because `withMicrofrontends` doesn't support Next.js `basePath` — Vercel forwards the full `/garden-planner/...` path straight through, so the route tree has to match it literally. `next.config.ts` is wrapped with `withMicrofrontends` for asset-prefix handling.

Since this is a separate repo from `homepage` (which owns `microfrontends.json`), local dev needs access to that file — either `vercel link && vercel microfrontends pull`, or set `VC_MICROFRONTENDS_CONFIG=<path-to-homepage>/microfrontends.json` in `.env.local`.

## Architecture

This is a Next.js 16 app (App Router) with a Postgres database and OpenAI integration.

**Data flow:**
- `app/garden-planner/api/plants/route.ts` — paginated plant browsing with search/filter (name, continent, shade). Uses `postgres` (the `sql` template-tag library), not the `pg` driver.
- `app/api/generate/route.ts` — POST endpoint that takes selected plants + optional base64 photo. If a photo is provided, it calls `gpt-4o` for a text description, then feeds that into `dall-e-3` to generate a garden image. Returns a URL.
- `app/garden-planner/page.tsx` — single-page client component ("use client"). Owns all state: plant browser, selection cart, photo upload, and generated image display.
- `app/garden-planner/seed/route.ts` — destructive seed route (`DROP TABLE … CREATE … INSERT`). Run once to initialise the `plant` table with the full enum types.
- `app/lib/actions.ts` — Server Actions including `getGardenPlannerImage`, which validates submitted plant names against the `plant` table before using them in the image-generation prompt.
- `app/testai/page.tsx` — dev scratch page for testing the AI flow against a static image.

**Database schema** (created by the seed route):
```sql
CREATE TYPE shade_requirement AS ENUM ('Full Sun', 'Part Shade', 'Full Shade');
CREATE TYPE origin_continent  AS ENUM ('Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania');

CREATE TABLE plant (
  id               SERIAL PRIMARY KEY,
  price            NUMERIC(10, 2) NOT NULL,
  name             VARCHAR(255)   NOT NULL,
  origin_continent origin_continent,
  max_height_cm    INT,
  max_width_cm     INT,
  shade_requirement shade_requirement
);
```

The `/api/plants` query uses `COUNT(*) OVER()` (window function) for pagination totals in a single query. Shade filtering is currently not applied server-side despite existing UI controls — the filter is dropped after continent/name filters.

**Styling:** Tailwind CSS v4 (PostCSS plugin, no `tailwind.config`). Font: Lusitana (Google Font, loaded via `app/ui/fonts.ts`).
