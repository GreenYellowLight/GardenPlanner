"use client";

import { useState, useEffect } from "react";
import type { Plant } from '@/app/lib/types';
import { Description, SubHeading, StepPill } from "./Elements";

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


  function qtyOf(plant: Plant) {
    return selected.find((s) => s.plant.id === plant.id)?.qty ?? 0
  }

  const filterClass = "border border-stone-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <StepPill step={1} />
        
        <SubHeading>Choose your plants</SubHeading>
      </div>
      <Description>Browse plants and add the ones you want in your garden. Filter by continent or shade requirements.</Description>

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

      <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100">
        {plants.length === 0 ? (
          <p className="text-center text-stone-400 py-10">No plants found</p>
        ) : (
          plants.map((plant) => (
            <div
              key={plant.id}
              className={`flex items-center justify-between px-4 py-3 transition-colors ${qtyOf(plant) > 0 ? "bg-green-50" : "hover:bg-stone-50"
                }`}
            >
              <div className="flex items-center gap-4">
                <img
                  src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/plant-list/${plant.name.toLowerCase().replace(/\s+/g, '-')}.webp`}
                  alt={plant.name}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-sm"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/64x64/86efac/166534?text=${encodeURIComponent(plant.name[0])}` }}
                />
                <div>
                  <p className="font-semibold text-green-900">{plant.name}</p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {plant.origin_continent} · {plant.shade_requirement}
                  </p>
                </div>
              </div>
              {qtyOf(plant) === 0 ? (
                <button
                  onClick={() => onAdd(plant)}
                  className="ml-4 px-4 py-1.5 rounded-lg text-sm font-semibold bg-green-700 text-white hover:bg-green-800 transition-colors"
                >
                  + Add
                </button>
              ) : (
                <div className="ml-4 flex items-center gap-2">
                  <button onClick={() => onRemove(plant)} className="w-8 h-8 rounded-lg border border-stone-300 text-stone-600 font-bold hover:bg-stone-100 transition-colors">−</button>
                  <span className="text-sm font-semibold w-5 text-center">{qtyOf(plant)}</span>
                  <button onClick={() => onAdd(plant)} className="w-8 h-8 rounded-lg bg-green-700 text-white font-bold hover:bg-green-800 transition-colors">+</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-1.5 rounded-lg border border-stone-300 text-stone-600 text-sm disabled:opacity-40 hover:bg-stone-100 transition-colors"
          >
            ← Prev
          </button>
          <span className="text-sm text-stone-400">Page {page} of {pages}</span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="px-4 py-1.5 rounded-lg border border-stone-300 text-stone-600 text-sm disabled:opacity-40 hover:bg-stone-100 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
