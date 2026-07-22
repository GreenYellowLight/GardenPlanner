'use client'
import { useState } from 'react'
import type { Plant } from "@/app/lib/types";
import Image from 'next/image'
import { BASE_PATH } from "@/app/lib/constants"

export function StepCircle({ number }: { number: string }) {
    return (
        <svg width="28" height="28" viewBox="0 0 28 28" className="mb-3 flex-shrink-0">
            <circle cx="14" cy="14" r="14" fill="#15803d" />
            <text x="14" y="14" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="14" fontWeight="bold">{number}</text>
        </svg>
    )
}

export function StepPill({ step }: { step: number }) {
    return (
        <svg width="58" height="26" viewBox="0 0 58 26" className="flex-shrink-0">
            <rect width="58" height="26" rx="13" fill="#15803d" />
            <text x="29" y="13" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="14" fontWeight="bold">Step {step}</text>
        </svg>
    )
}

export function SectionHeader({ step, children }: { step: number; children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 mb-1">
            <StepPill step={step} />
            <SubHeading>{children}</SubHeading>
        </div>
    )
}

export function MainPanel({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8 scroll-mt-6">
            {children}
        </div>
    )
}

export function SubHeading({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-2xl font-semibold text-green-900">{children}</h2>
    )
}

export function Description({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-stone-500 mb-3">{children}</p>
    )
}

export function Title({children}: {children: React.ReactNode}){
    return (
        <p className="font-semibold text-green-900 mb-1">{children}</p>
    )

}


export function PlantImage({ plant }: { plant: Plant}) {
    const [src, setSrc] = useState(`${process.env.NEXT_PUBLIC_S3_BASE_URL}/plant-list/${plant.name.toLowerCase().replace(/\s+/g, '-')}.webp`)
    return (
        <Image
            src={src}
            alt={plant.name}
            width={200}
            height={200}
            className={`w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-sm`}
            onError={() => setSrc(`${BASE_PATH}/one-letter-placeholders/${plant.name[0].toUpperCase()}.svg`)}
        />
    )
}

type PlantSelectionProps = {
  plants: Plant[];
  selected: { plant: Plant; qty: number }[];
  onAdd: (plant: Plant) => void;
  onRemove: (plant: Plant) => void;
  imageSize?: 'sm' | 'lg';
};

export function PlantSelection({ plants, selected, onAdd, onRemove}: PlantSelectionProps) {
    
    function qtyOf(plant: Plant) {
        return selected.find((s) => s.plant.id === plant.id)?.qty ?? 0
    }

    return (
          <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100">
        {plants.length === 0 ? (
          <p className="text-center text-stone-400 py-10">No plants found</p>
        ) : (
          plants.map((plant) => {
            const qty = qtyOf(plant)
            return (
              <div
                key={plant.id}
                className={`flex items-center px-4 py-3 transition-colors ${qty > 0 ? "bg-green-50" : "hover:bg-stone-50"}`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <PlantImage plant={plant}/>
                  <div className="min-w-0">
                    <p className="font-semibold text-green-900 break-words">{plant.name}</p>
                    <p className="text-stone-400 mt-0.5">{plant.origin_continent} · {plant.shade_requirement}</p>
                  </div>
                </div>
                {qty === 0 ? (
                  <button
                    onClick={() => onAdd(plant)}
                    className="ml-4 px-4 py-1.5 rounded-lg text-sm font-semibold bg-green-700 text-white hover:bg-green-800 transition-colors flex-shrink-0 whitespace-nowrap"
                  >
                    + Add
                  </button>
                ) : (
                  <QtyStepper qty={qty} onAdd={() => onAdd(plant)} onRemove={() => onRemove(plant)} />
                )}
              </div>
            )
          })
        )}
      </div>
    )

}

export function QtyStepper({ qty, onAdd, onRemove }: { qty: number; onAdd: () => void; onRemove: () => void }) {
    return (
        <div className="ml-4 flex items-center gap-2">
            <button onClick={onRemove} className="w-8 h-8 rounded-lg border border-stone-300 text-stone-600 font-bold hover:bg-stone-100 transition-colors">−</button>
            <span className="text-sm font-semibold w-5 text-center">{qty}</span>
            <button onClick={onAdd} className="w-8 h-8 rounded-lg bg-green-700 text-white font-bold hover:bg-green-800 transition-colors">+</button>
        </div>
    )
}

export function Spinner({ label }: { label: string }) {
    return (
        <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
            <p className="text-sm text-stone-400">{label}</p>
        </div>
    )
}

export function Pagination({ page, pages, onPrev, onNext }: { page: number; pages: number; onPrev: () => void; onNext: () => void }) {
    const btnClass = "px-4 py-1.5 rounded-lg border border-stone-300 text-stone-600 text-sm disabled:opacity-40 hover:bg-stone-100 transition-colors"
    return (
        <div className="flex items-center justify-center gap-3 mt-4">
            <button onClick={onPrev} disabled={page === 1} className={btnClass}>← Prev</button>
            <span className="text-sm text-stone-400">Page {page} of {pages}</span>
            <button onClick={onNext} disabled={page === pages} className={btnClass}>Next →</button>
        </div>
    )
}

export function GeneratedImage({ label, comment, src, alt }: { label: string; comment: string; src: string; alt: string }) {
    return (
        <div>
             <h2 className="text-2xl pt-2 leading-tight font-semibold text-green-900">{label}</h2>
             <Description>{comment}</Description>

            <Image
                src={src}
                alt={alt}
                className="w-full rounded-xl border border-stone-200 shadow-md cursor-zoom-in"
                onClick={() => window.open(src, '_blank')}
            />
        </div>
    )
}
