"use client";

import { useState } from "react";
import type { Plant } from "@/app/lib/types";
import { getGardenPlannerImage } from "../lib/actions";

type Props = {
  selected: { plant: Plant; qty: number }[];
};

export default function GeneratePlan({ selected }: Props) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    setGenerating(true);

    const formData = new FormData()
    formData.append('photo', photo!)
    const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
    const { url, filename } = await uploadRes.json()

    const plantNames = selected.map(s => s.plant.name)
    const resultUrl = await getGardenPlannerImage(plantNames, url, filename)


    setGeneratedImage(resultUrl);
    setGenerating(false);
  }

  return (
    <>
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
        onClick={handleGenerate}
        disabled={generating || !photo || selected.length === 0}
        className="mt-8 bg-green-700 text-white text-lg font-medium px-6 py-2 rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50"
      >
        {generating ? "Generating..." : "Generate Garden Plan"}
      </button>

      {generating && (
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-green-300 border-t-green-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-400">This may take up to 30 seconds...</p>
        </div>
      )}

      {generatedImage && (
        <div className="mt-6">
          <p className="text-lg font-medium mb-3">Your garden plan:</p>
          <img
            src={generatedImage}
            alt="Generated garden plan"
            className="w-full rounded-xl border-2 border-green-300 shadow-md cursor-zoom-in"
            onClick={() => window.open(generatedImage, '_blank')}
          />

          <p>Like what you made? <a href="/lotsofplantsvictoria">Buy your selected plants</a>!</p>

        </div>
        
      )}
    </>
  );
}
