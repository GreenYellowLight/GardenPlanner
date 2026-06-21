"use client";

import { useState, useEffect } from "react";
import type { Plant } from "@/app/lib/types";
import { getGardenPlannerImage, getGardenFutureImage, validateCount } from "../lib/actions";

type Props = {
  selected: { plant: Plant; qty: number }[];
};

export default function GeneratePlan({ selected }: Props) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [futureImage, setFutureImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatingFuture, setGeneratingFuture] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!photo) return
    const url = URL.createObjectURL(photo)
    setPhotoUrl(url)
    return () => URL.revokeObjectURL(url)  
  }, [photo]) 



  async function handleGenerate() {
    setGenerating(true);
    setError(null);

    try {
      const allowed = await validateCount()
      if (!allowed) {
        setError('Too many gardens generated recently — please try again in an hour.')
        return
      }

      const formData = new FormData()
      formData.append('photo', photo!)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      const { url, filename } = await uploadRes.json()



      const plantNames = selected.map(s => s.plant.name)
      const { url: resultUrl, error: actionError } = await getGardenPlannerImage(plantNames, url)
      if (actionError === 'TOO_MANY_REQUESTS') {
        setError('Too many gardens generated recently — please try again in an hour.')
      } else {
        setGeneratedImage(resultUrl)
        setGenerating(false)
        setGeneratingFuture(true)
        try {
          const { url: futureUrl } = await getGardenFutureImage(resultUrl!, plantNames)
          setFutureImage(futureUrl)
        } finally {
          setGeneratingFuture(false)
        }
      }
    } catch (e: any) {
      setError('Something went wrong. Please try again.')
    } finally {
      setGenerating(false);
    }
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
            src={photoUrl}
            alt="preview"
            className="w-64 rounded-xl border-2 border-green-300 shadow-md"
          />
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={generating || !photo || selected.length === 0 || !!generatedImage}
        className="mt-8 bg-green-700 text-white text-lg font-medium px-6 py-2 rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50"
      >
        {generating ? "Generating..." : "Generate Garden Plan"}
      </button>

      {error && (
        <p className="mt-4 text-sm text-red-500">{error}</p>
      )}

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

          <div className="mt-6">
            <p className="text-lg font-medium mb-3">5 years later:</p>
            {generatingFuture ? (
              <div className="flex flex-col items-center gap-3 py-10 border-2 border-green-200 rounded-xl">
                <div className="w-12 h-12 border-4 border-green-300 border-t-green-600 rounded-full animate-spin" />
                <p className="text-sm text-gray-400">Generating your garden in 5 years...</p>
              </div>
            ) : futureImage ? (
              <img
                src={futureImage}
                alt="Garden in 5 years"
                className="w-full rounded-xl border-2 border-green-300 shadow-md cursor-zoom-in"
                onClick={() => window.open(futureImage, '_blank')}
              />
            ) : null}
          </div>

          <p className="mt-6">Like what you made? <a href="/lotsofplantsvictoria">Buy your selected plants</a>!</p>
        </div>
      )}
    </>
  );
}
