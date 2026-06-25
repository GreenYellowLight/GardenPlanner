"use client";

import { useState, useEffect } from "react";
import type { Plant } from "@/app/lib/types";
import { getGardenPlannerImage, getGardenFutureImage, validateCount } from "../lib/actions";
import { MAX_PHOTO_MB, MAX_PHOTO_BYTES } from "../lib/constants";
import { Description, SubHeading } from "./Elements";

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
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) {
        setError(uploadData.error ?? 'Failed to upload photo.')
        return
      }
      const { url } = uploadData

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

  const canGenerate = !generating && !!photo && selected.length > 0 && !generatedImage

  const generatingHint =
    !photo && selected.length === 0 ? 'Add some plants and a photo before generating.' :
    !photo                          ? 'Add a photo before generating.' :
    selected.length === 0           ? 'Add some plants before generating.' :
    null

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <svg width="58" height="26" viewBox="0 0 58 26" className="flex-shrink-0">
          <rect width="58" height="26" rx="13" fill="#15803d" />
          <text x="29" y="13" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="14" fontWeight="bold">Step 3</text>
        </svg>
        <SubHeading>Generate your garden plan</SubHeading>
      </div>
 

      <Description>Upload a photo of the space you want to plant in, then let AI show you what it will look like.</Description>


      <label className={`block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
        photo ? 'border-green-400 bg-green-50' : 'border-stone-300 hover:border-green-400 hover:bg-green-50'
      }`}>
        {photo ? (
          <p className="text-green-700 font-medium">{photo.name} — click to change</p>
        ) : (
          <>
            <p className="text-stone-600 font-medium">Click to upload a photo of your garden</p>
            <p className="text-xs text-stone-400 mt-1">JPEG, PNG or WebP · max {MAX_PHOTO_MB}MB</p>
          </>
        )}
        <input
          className="hidden"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null
            if (file && file.size > MAX_PHOTO_BYTES) {
              setError(`Photo is too large (max ${MAX_PHOTO_MB}MB).`)
              setPhoto(null)
            } else {
              setError(null)
              setPhoto(file)
            }
          }}
        />
      </label>

      {photo && photoUrl && (
        <div className="mt-4">
          <p className="text-xs text-stone-400 mb-2 uppercase tracking-wide font-medium">Preview</p>
          <img
            src={photoUrl}
            alt="preview"
            className="w-full max-h-72 object-cover rounded-xl border border-stone-200 shadow-sm"
          />
        </div>
      )}

      {error && (
        <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {generatingHint && <p className="mt-4 text-sm text-red-500">{generatingHint}</p>}

      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        className="mt-6 w-full py-3 rounded-xl text-base font-semibold bg-green-700 text-white hover:bg-green-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
      >
        {generating ? "Generating your garden..." : "Generate Garden Plan"}
      </button>

      {generating && (
        <div className="mt-6 flex flex-col items-center gap-3 py-6">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
          <p className="text-sm text-stone-400">This may take up to 30 seconds...</p>
        </div>
      )}

      {generatedImage && (
        <div className="mt-8 flex flex-col gap-6">
          <div>
            <p className="text-xs text-stone-400 mb-2 uppercase tracking-wide font-medium">Your garden — freshly planted</p>
            <img
              src={generatedImage}
              alt="Generated garden plan"
              className="w-full rounded-xl border border-stone-200 shadow-md cursor-zoom-in"
              onClick={() => window.open(generatedImage, '_blank')}
            />
          </div>

          <div>
            <p className="text-xs text-stone-400 mb-2 uppercase tracking-wide font-medium">5 years from now</p>
            {generatingFuture ? (
              <div className="flex flex-col items-center gap-3 py-12 border border-dashed border-stone-300 rounded-xl">
                <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
                <p className="text-sm text-stone-400">Generating your garden in 5 years...</p>
              </div>
            ) : futureImage ? (
              <img
                src={futureImage}
                alt="Garden in 5 years"
                className="w-full rounded-xl border border-stone-200 shadow-md cursor-zoom-in"
                onClick={() => window.open(futureImage, '_blank')}
              />
            ) : null}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <p className="font-semibold text-green-900 mb-1">Ready to bring your garden to life?</p>
            <p className="text-sm text-green-700 mb-4">
              All {selected.length} plant{selected.length !== 1 ? 's' : ''} in your plan are available to order from Lots of Plants Victoria — online or in-store.
            </p>
            <a
              href="#"
              className="inline-block bg-green-700 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-green-800 transition-colors text-sm shadow-sm"
            >
              Order your plants
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
