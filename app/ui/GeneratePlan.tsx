"use client";

import { useState, useEffect, useRef } from "react";
import type { Plant } from "@/app/lib/types";
import { getGardenPlannerImage, getGardenFutureImage, validateCount } from "../lib/actions";
import { MAX_PHOTO_MB, MAX_PHOTO_BYTES } from "../lib/constants";
import { Description, SectionHeader, Spinner, GeneratedImage } from "./Elements";

const RATE_LIMIT_MSG = 'Too many gardens generated recently — please try again in an hour.'

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
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!photo) return
    const url = URL.createObjectURL(photo)
    setPhotoUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [photo])



  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 0);

    try {
      const allowed = await validateCount()
      if (!allowed) {
        setError(RATE_LIMIT_MSG)
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

      const plantNames = selected.map(s => s.plant.name)
      const { url: resultUrl, error: actionError } = await getGardenPlannerImage(plantNames, uploadData.url)
      if (actionError === 'TOO_MANY_REQUESTS') {
        setError(RATE_LIMIT_MSG)
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
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setGenerating(false);
    }
  }

  const canGenerate = !generating && !!photo && selected.length > 0 && !generatedImage

  const hint =
    !photo && selected.length === 0 ? 'Add some plants and a photo before generating.' :
    !photo                          ? 'Add a photo before generating.' :
    selected.length === 0           ? 'Add some plants before generating.' :
    null

  return (
    <div>
      <SectionHeader step={3}>Generate your garden plan</SectionHeader>
      <Description>Upload a photo of the space you want to plant in, then let AI show you what it will look like</Description>

      <label className={`block dotted-outline-text  p-8 text-center cursor-pointer transition-colors ${
        photo ? 'border-green-400 bg-green-50' : 'border-stone-300 hover:border-green-400 hover:bg-green-50'
      }`}>
        {photo ? (
          <p className="text-green-700 font-medium">{photo.name} – click to change</p>
        ) : (
          <>
            <p className="text-stone-400 font-medium">Click to upload a photo of your garden</p>
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

      {hint && <p className="mt-4 text-sm text-red-500">{hint}</p>}

      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        className="mt-6 w-full py-3 rounded-xl text-base font-semibold bg-green-700 text-white hover:bg-green-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
      >
        {generating ? "Generating your garden..." : "Generate Garden Plan"}
      </button>

      {generating && (
        <div className="mt-6 py-6">
          <Spinner label="This may take up to 30 seconds..." />
        </div>
      )}

      {generatedImage && (
        <div className="mt-8 flex flex-col gap-6">
          <GeneratedImage label="Your garden – freshly planted!" comment="Wow you have excellence planting skills" src={generatedImage} alt="Generated garden plan" />

          {generatingFuture ? (
            <div className="py-12 border border-dashed border-stone-300 rounded-xl">
              <Spinner label="Generating your garden in 5 years..." />
            </div>
          ) : futureImage ? (
            <GeneratedImage label="5 years from now" comment="Don't worry, the plants will do the work" src={futureImage} alt="Garden in 5 years" />
          ) : null}

   
        </div>
      )}

      <div ref={bottomRef} />

    </div>
  );
}
