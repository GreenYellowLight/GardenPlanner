"use client";

import { useState, useEffect } from "react";
import type { Plant } from '@/app/lib/types';


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

  return (
    <div className="mb-10">
      <p className="text-lg font-medium mb-3">Select plants you want:</p>

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search plants..."
          className="border-2 border-green-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-green-500 flex-1 min-w-32"
        />
        <select
          value={continent}
          onChange={(e) => { setContinent(e.target.value); setPage(1) }}
          className="border-2 border-green-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-green-500"
        >
          <option value="">All continents</option>
          {CONTINENTS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={shade}
          onChange={(e) => { setShade(e.target.value); setPage(1) }}
          className="border-2 border-green-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-green-500"
        >
          <option value="">All shade types</option>
          {SHADE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="border-2 border-green-200 rounded-xl overflow-hidden">
        {plants.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No plants found</p>
        ) : (
          plants.map((plant) => (
            <div
              key={plant.id}
              className={`flex items-center justify-between px-4 py-3 border-b border-green-100 last:border-0 ${
                qtyOf(plant) > 0 ? "bg-green-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/plant-list/${plant.name.toLowerCase().replace(/\s+/g, '-')}.webp`}
                  alt={plant.name}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/40x40/86efac/166534?text=${encodeURIComponent(plant.name[0])}` }}
                />
                <div>
                  <span className="font-medium text-green-900">{plant.name}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    {plant.origin_continent} · {plant.shade_requirement} · ${Number(plant.price).toFixed(2)}
                  </span>
                </div>
              </div>
              {qtyOf(plant) === 0 ? (
                <button
                  onClick={() => onAdd(plant)}
                  className="ml-4 px-3 py-1 rounded-lg text-sm font-medium border-2 border-green-400 text-green-700 hover:bg-green-50 transition-colors"
                >
                  + Add
                </button>
              ) : (
                <div className="ml-4 flex items-center gap-2">
                  <button onClick={() => onRemove(plant)} className="w-7 h-7 rounded-lg border-2 border-green-400 text-green-700 font-bold hover:bg-green-50">−</button>
                  <span className="text-sm font-medium w-4 text-center">{qtyOf(plant)}</span>
                  <button onClick={() => onAdd(plant)} className="w-7 h-7 rounded-lg border-2 border-green-400 text-green-700 font-bold hover:bg-green-50">+</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-lg border-2 border-green-300 text-green-700 text-sm disabled:opacity-40 hover:bg-green-50"
          >
            ← Prev
          </button>
          <span className="text-sm text-gray-500">Page {page} of {pages}</span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="px-3 py-1 rounded-lg border-2 border-green-300 text-green-700 text-sm disabled:opacity-40 hover:bg-green-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
