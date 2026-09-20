"use client";

import { useState, useEffect } from "react";
import type { Plant } from '@/app/lib/types';
import { Description, SectionHeader, PlantSelection, PlantSelectionSkeleton, Pagination } from "./Elements";
import { BASE_PATH } from "@/app/lib/constants";

const CONTINENTS = ["Africa", "Asia", "Europe", "North America", "South America", "Oceania"];
const SHADE_TYPES = ["Full Sun", "Part Shade", "Full Shade"];

type Props = {
  selected: { plant: Plant; qty: number }[];
  onAdd: (plant: Plant) => void;
  onRemove: (plant: Plant) => void;
};

export default function PlantBrowser({ selected, onAdd, onRemove }: Props) {
  const [shade, setShade] = useState("");
  const [search, setSearch] = useState("");
  const [continent, setContinent] = useState("");
  const [page, setPage] = useState(1);
  // Results are tagged with the query they came from, so `loading` is simply
  // "what we're holding doesn't match what's being asked for"
  const [result, setResult] = useState<{ query: string; plants: Plant[]; pages: number } | null>(null);

  const query = new URLSearchParams({ page: String(page), search, continent, shade }).toString();
  const loading = result?.query !== query;
  const plants = result?.plants ?? [];
  const pages = result?.pages ?? 1;

  useEffect(() => {
    let stale = false
    fetch(`${BASE_PATH}/api/plants?${query}`)
      .then((r) => r.json())
      .then((data) => {
        if (!stale) setResult({ query, plants: data.plants ?? [], pages: data.pages ?? 1 })
      })
      .catch(() => {
        if (!stale) setResult({ query, plants: [], pages: 1 })
      })
    return () => { stale = true }
  }, [query]);

  return (
    <div>
      <SectionHeader step={1}>Choose your plants</SectionHeader>
      <Description>Browse plants and add the ones you want in your garden. Filter by continent or shade requirements</Description>

      <div className="flex flex-wrap gap-2 mb-4 p-3 bg-stone-50 rounded-xl border border-stone-200">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search plants..."
          className={`filter-options placeholder:text-zinc-500 flex-1 min-w-32`}
        />
        <select
          value={continent}
          onChange={(e) => { setContinent(e.target.value); setPage(1) }}
          className="filter-options"
        >
          <option value="">All continents</option>
          {CONTINENTS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={shade}
          onChange={(e) => { setShade(e.target.value); setPage(1) }}
          className="filter-options"
        >
          <option value="">All shade types</option>
          {SHADE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <PlantSelectionSkeleton />
      ) : (
        <PlantSelection plants={plants} selected={selected} onAdd={onAdd} onRemove={onRemove} />
      )}

      {!loading && pages > 1 && (
        <Pagination
          page={page}
          pages={pages}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(pages, p + 1))}
        />
      )}
    </div>
  );
}
