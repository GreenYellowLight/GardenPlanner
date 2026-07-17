"use client";

import { useState, useEffect } from "react";
import type { Plant } from '@/app/lib/types';
import { Description, SectionHeader, PlantSelection, Pagination } from "./Elements";

const CONTINENTS = ["Africa", "Asia", "Europe", "North America", "South America", "Oceania"];
const SHADE_TYPES = ["Full Sun", "Part Shade", "Full Shade"];

type Props = {
  selected: { plant: Plant; qty: number }[];
  onAdd: (plant: Plant) => void;
  onRemove: (plant: Plant) => void;
};

export default function PlantBrowser({ selected, onAdd, onRemove }: Props) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [shade, setShade] = useState("");
  const [search, setSearch] = useState("");
  const [continent, setContinent] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), search, continent, shade });
    fetch(`/api/plants?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setPlants(data.plants ?? [])
        setPages(data.pages ?? 1)
      })
      .catch(() => {
        setPlants([])
        setPages(1)
      })
  }, [page, search, continent, shade]);

  const filterClass = "border border-stone-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"

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
          className={`${filterClass} flex-1 min-w-32`}
        />
        <select
          value={continent}
          onChange={(e) => { setContinent(e.target.value); setPage(1) }}
          className={filterClass}
        >
          <option value="">All continents</option>
          {CONTINENTS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={shade}
          onChange={(e) => { setShade(e.target.value); setPage(1) }}
          className={filterClass}
        >
          <option value="">All shade types</option>
          {SHADE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <PlantSelection plants={plants} selected={selected} onAdd={onAdd} onRemove={onRemove} />

      {pages > 1 && (
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
