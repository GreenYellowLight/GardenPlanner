"use client";

import { useState, useRef } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import type { Plant } from "@/app/lib/types";
import { getGardenPlannerImage, getGardenFutureImage, validateCount } from "../lib/actions";
import { MAX_PHOTO_MB, MAX_PHOTO_BYTES, BASE_PATH } from "../lib/constants";
import { Description, SectionHeader, Spinner, GeneratedImage } from "./Elements";
import Image from 'next/image'

const RATE_LIMIT_MSG = 'Too many gardens generated recently — please try again in an hour.'

function PhotoOption({ label, sub, selected, onChange, capture, className = '' }: {
  label: string; sub: string; selected: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  capture?: boolean; className?: string;
}) {
  return (
    <label className={`${className} block dotted-outline-text p-8 text-center cursor-pointer transition-colors ${selected ? 'border-green-400 bg-green-50 hover:border-green-500' : 'border-stone-300 hover:border-green-400 hover:bg-green-50'}`}>
      <p className={`font-medium ${selected ? 'text-emerald-700' : 'text-stone-500'}`}>{label}</p>
      <p className={`text-xs mt-1 ${selected ? 'text-green-700' : 'text-stone-500'}`}>{sub}</p>
      <input className="hidden" type="file" accept="image/*" onChange={onChange} {...(capture ? { capture: 'environment' } : {})} />
    </label>
  )
}

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
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);
  const bottomRef = useRef<HTMLDivElement>(null);




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
      const uploadRes = await fetch(`${BASE_PATH}/api/upload`, { method: 'POST', body: formData })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) {
        setError(uploadData.error ?? 'Failed to upload photo.')
        return
      }

      const plantNames = selected.map(s => s.plant.name)
      const { url: resultUrl, error: actionError } = await getGardenPlannerImage(plantNames, uploadData.url, captchaToken!)
      if (actionError === 'CAPTCHA_FAILED') {
        setError('CAPTCHA verification failed. Please try again.')
      } else if (actionError === 'TOO_MANY_REQUESTS') {
        setError(RATE_LIMIT_MSG)
      } else {
        setGeneratedImage(resultUrl)
        setGenerating(false)
        setGeneratingFuture(true)
        try {
          const { url: futureUrl } = await getGardenFutureImage(resultUrl!)
          setFutureImage(futureUrl)
        } finally {
          setGeneratingFuture(false)
        }
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setGenerating(false);
      captchaRef.current?.resetCaptcha()
      setCaptchaToken(null)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    if (photoUrl) URL.revokeObjectURL(photoUrl)
    if (file && file.size > MAX_PHOTO_BYTES) {
      setError(`Photo is too large (max ${MAX_PHOTO_MB}MB).`)
      setPhoto(null)
      setPhotoUrl(undefined)
    } else {
      setError(null)
      setPhoto(file)
      setPhotoUrl(file ? URL.createObjectURL(file) : undefined)
    }
  }

  const canGenerate = !generating && !!photo && selected.length > 0 && !generatedImage && (!!captchaToken || process.env.NEXT_PUBLIC_DEVELOPER_MODE === 'true')

  const hint =
    !photo && selected.length === 0 ? 'Add some plants and a photo before generating.' :
    !photo                          ? 'Add a photo before generating.' :
    selected.length === 0           ? 'Add some plants before generating.' :
    null

  return (
    <div>
      <SectionHeader step={3}>Generate your garden plan</SectionHeader>
      <Description>Add a photo of the space you want to plant in, then let AI show you what it will look like</Description>

      <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
        <PhotoOption label="Upload photo" sub="JPEG, PNG or WebP" selected={!!photo} onChange={handleFileChange} />
        <PhotoOption label="Take photo" sub="Use your camera" selected={!!photo} onChange={handleFileChange} capture className="md:hidden" />
      </div>

      {photo && photoUrl && (
        <div className="mt-4">
          <p className="text-xs text-stone-500 mb-2 uppercase tracking-wide font-medium">Preview</p>
          <div className="relative w-full max-h-72 aspect-video">
            <Image
              src={photoUrl}
              alt="preview"
              fill
              className="object-cover rounded-xl border border-stone-200 shadow-sm"
            />
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {hint && <p className="mt-4 text-sm text-red-600">{hint}</p>}

      <div className="mt-4">
        <HCaptcha
          ref={captchaRef}
          sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
          onVerify={setCaptchaToken}
          onExpire={() => setCaptchaToken(null)}
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        className="mt-6 w-full py-3 rounded-xl font-semibold bg-green-700 text-white hover:bg-green-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
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
              <Spinner label="Generating your garden in 3 years..." />
            </div>
          ) : futureImage ? (
            <GeneratedImage label="3 years from now" comment="Don't worry, the plants will do the work" src={futureImage} alt="Garden in 3 years" />
          ) : null}

   
        </div>
      )}

      <div ref={bottomRef} />

    </div>
  );
}
