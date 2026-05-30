
"use client";
import Link from "next/link";
import { useState } from "react";
import PlantBrowser from "@/app/ui/PlantBrowser";
import SelectedPlants from "@/app/ui/SelectedPlants";

type Plant = {
  id: number;
  name: string;
  price: number;
  origin_continent: string;
  max_height_cm: number;
  max_width_cm: number;
  shade_requirement: string;
};

export default function Page() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [selected, setSelected] = useState<{ plant: Plant; qty: number }[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

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

  return (
    <>
      <header className="w-full bg-green-700 px-6 py-5">
        <h1 className="text-4xl font-bold text-white">Garden Planner</h1>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">

        <Link href="testai">
          <p className="text-red-400 underline">Go to test page</p>
        </Link>

        <p className="text-center text-lg mb-10">
          This will help you plan your next gardening endeavour!
        </p>

        <PlantBrowser selected={selected} onAdd={addPlant} onRemove={removePlant} />

        <SelectedPlants selected={selected} onAdd={addPlant} onRemove={removePlant} />

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
