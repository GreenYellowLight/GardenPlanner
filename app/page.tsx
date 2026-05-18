
"use client";
import { useState, useEffect } from "react";

type Plant = {
  id: number;
  name: string;
  price: number;
  origin_continent: string;
  max_height_cm: number;
  max_width_cm: number;
  shade_requirement: string;
};

const CONTINENTS = ["Africa", "Asia", "Europe", "North America", "South America", "Oceania"];
const SHADE_TYPES = ["Full Sun", "Part Shade", "Full Shade"];

export default function Page() {
  const [budget, setBudget] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const [plants, setPlants] = useState<Plant[]>([]);
  const [shade, setShade] = useState("");
  const [search, setSearch] = useState("");
  const [continent, setContinent] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selected, setSelected] = useState<{ plant: Plant; qty: number }[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), search, continent, shade });
    fetch(`/api/plants?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setPlants(data.plants ?? []);
        setPages(data.pages ?? 1);
      });
  }, [page, search, continent, shade]);

  function addPlant(plant: Plant) {
    setSelected((prev) => {
      const existing = prev.find((s) => s.plant.id === plant.id);
      if (existing) return prev.map((s) => s.plant.id === plant.id ? { ...s, qty: s.qty + 1 } : s);
      return [...prev, { plant, qty: 1 }];
    });
  }

  function removePlant(plant: Plant) {
    setSelected((prev) => {
      const existing = prev.find((s) => s.plant.id === plant.id);
      if (!existing) return prev;
      if (existing.qty === 1) return prev.filter((s) => s.plant.id !== plant.id);
      return prev.map((s) => s.plant.id === plant.id ? { ...s, qty: s.qty - 1 } : s);
    });
  }

  function qtyOf(plant: Plant) {
    return selected.find((s) => s.plant.id === plant.id)?.qty ?? 0;
  }

  return (
    <>
      <header className="w-full bg-green-700 px-6 py-5">
        <h1 className="text-4xl font-bold text-white">Garden Planner</h1>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <p className="text-center text-lg mb-10">
          This will help you plan your next gardening endeavour!
        </p>


        {/* Plant browser */}
        <div className="mb-10">
          <p className="text-lg font-medium mb-3">Select plants you want:</p>

          <div className="flex flex-wrap gap-2 mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search plants..."
              className="border-2 border-green-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-green-500 flex-1 min-w-32"
            />
            <select
              value={continent}
              onChange={(e) => { setContinent(e.target.value); setPage(1); }}
              className="border-2 border-green-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-green-500"
            >
              <option value="">All continents</option>
              {CONTINENTS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={shade}
              onChange={(e) => { setShade(e.target.value); setPage(1); }}
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
                  <div>
                    <span className="font-medium text-green-900">{plant.name}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      {plant.origin_continent} · {plant.shade_requirement} · ${Number(plant.price).toFixed(2)}
                    </span>
                  </div>
                  {qtyOf(plant) === 0 ? (
                    <button
                      onClick={() => addPlant(plant)}
                      className="ml-4 px-3 py-1 rounded-lg text-sm font-medium border-2 border-green-400 text-green-700 hover:bg-green-50 transition-colors"
                    >
                      + Add
                    </button>
                  ) : (
                    <div className="ml-4 flex items-center gap-2">
                      <button onClick={() => removePlant(plant)} className="w-7 h-7 rounded-lg border-2 border-green-400 text-green-700 font-bold hover:bg-green-50">−</button>
                      <span className="text-sm font-medium w-4 text-center">{qtyOf(plant)}</span>
                      <button onClick={() => addPlant(plant)} className="w-7 h-7 rounded-lg border-2 border-green-400 text-green-700 font-bold hover:bg-green-50">+</button>
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

        {/* Selected plants */}
        <div className="mb-8">
          <p className="text-lg font-medium mb-1">
            Plants you have selected:
            {selected.length > 0 && (
              <span className="ml-2 text-green-700">
                (${selected.reduce((sum, s) => sum + Number(s.plant.price) * s.qty, 0).toFixed(2)} total)
              </span>
            )}
          </p>
          <p className="text-sm text-gray-400 mb-3">Note: not all selected plants will end up being used in your garden plan.</p>
          {selected.length === 0 ? (
            <p className="text-gray-400 text-sm">No plants selected yet.</p>
          ) : (
            <div className="border-2 border-green-200 rounded-xl overflow-hidden">
              {selected.map(({ plant, qty }) => (
                <div
                  key={plant.id}
                  className="flex items-center justify-between px-4 py-3 border-b border-green-100 last:border-0"
                >
                  <div>
                    <span className="font-medium text-green-900">{plant.name}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      ${Number(plant.price).toFixed(2)} × {qty} = ${(Number(plant.price) * qty).toFixed(2)}
                    </span>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    <button onClick={() => removePlant(plant)} className="w-7 h-7 rounded-lg border-2 border-green-400 text-green-700 font-bold hover:bg-green-50">−</button>
                    <span className="text-sm font-medium w-4 text-center">{qty}</span>
                    <button onClick={() => addPlant(plant)} className="w-7 h-7 rounded-lg border-2 border-green-400 text-green-700 font-bold hover:bg-green-50">+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <label className="text-lg font-medium whitespace-nowrap">
            Upload a photo of your garden where you want to plant some plants:
          </label>
          <label className="border-2 border-green-400 rounded-lg px-3 py-2 cursor-pointer text-green-700 font-medium hover:bg-green-50 transition-colors">
            Choose a photo
            <input
              className="hidden"
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        {photo && (
          <div className="mt-4">
            <img
              src={URL.createObjectURL(photo)}
              alt="preview"
              className="w-64 rounded-xl border-2 border-green-300 shadow-md"
            />
          </div>
        )}

        <button
          onClick={async () => {
            setGenerating(true);
            setGeneratedImage(null);

            let photoBase64: string | null = null;
            let photoType: string | null = null;
            if (photo) {
              const buffer = await photo.arrayBuffer();
              photoBase64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
              photoType = photo.type;
            }

            const res = await fetch("/api/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ plants: selected, photo: photoBase64, photoType }),
            });
            if (!res.ok) {
              console.error('Generate failed:', res.status, await res.text());
              setGenerating(false);
              return;
            }
            const data = await res.json();
            if (data.image) setGeneratedImage(data.image);
            setGenerating(false);
          }}
          disabled={generating || selected.length === 0}
          className="mt-8 bg-green-700 text-white text-lg font-medium px-6 py-2 rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50"
        >
          {generating ? "Generating..." : "Generate Garden Plan"}
        </button>

        {generating && (
          <p className="mt-4 text-sm text-gray-400">This may take up to 30 seconds...</p>
        )}

        {generatedImage && (
          <div className="mt-6">
            <p className="text-lg font-medium mb-3">Your garden plan:</p>
            <img
              src={generatedImage}
              alt="Generated garden plan"
              className="w-full rounded-xl border-2 border-green-300 shadow-md"
            />
          </div>
        )}
      </main>
    </>
  );
}
