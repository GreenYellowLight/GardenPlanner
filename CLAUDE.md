# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev        # start dev server
pnpm build      # production build
pnpm lint       # ESLint
```

There are no tests. To seed the database, hit `GET /seed` in the browser or with curl after the dev server is running.

## Environment

Requires `.env.local` with:
- `POSTGRES_URL` — connection string to a Postgres database
- `OPENAI_API_KEY` — used by the `/api/generate` route

## Architecture

This is a Next.js 16 app (App Router) with a Postgres database and OpenAI integration.

**Data flow:**
- `app/api/plants/route.ts` — paginated plant browsing with search/filter (name, continent, shade). Uses `postgres` (the `sql` template-tag library), not the `pg` driver.
- `app/api/generate/route.ts` — POST endpoint that takes selected plants + optional base64 photo. If a photo is provided, it calls `gpt-4o` for a text description, then feeds that into `dall-e-3` to generate a garden image. Returns a URL.
- `app/page.tsx` — single-page client component ("use client"). Owns all state: plant browser, selection cart, photo upload, and generated image display.
- `app/seed/route.ts` — destructive seed route (`DROP TABLE … CREATE … INSERT`). Run once to initialise the `plant` table with the full enum types.
- `app/lib/actions.ts` — stub Server Action (`getGardenPlannerImage`), not yet wired to a real implementation.
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
