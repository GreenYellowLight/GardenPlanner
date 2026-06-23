"use client";

import PlantBrowser from "@/app/ui/PlantBrowser";
import SelectedPlants from "@/app/ui/SelectedPlants";
import GeneratePlan from "@/app/ui/GeneratePlan";
import { useSelectedPlants } from "@/app/lib/useSelectedPlants";

function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Browse our plants",
      body: "Filter by continent of origin or shade requirements to find what suits your garden.",
    },
    {
      number: "2",
      title: "Upload a photo",
      body: "Take a photo of the space you want to plant in — a garden bed, a corner of your yard, or a balcony — and upload it here.",
    },
    {
      number: "3",
      title: "See your garden come to life",
      body: "Our AI will show you exactly what your selected plants will look like in your space, freshly planted and again five years from now.",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8">
      <h2 className="text-xl font-semibold text-green-900 mb-1">How it works</h2>
      <p className="text-sm text-stone-500 mb-6">Plan your garden in three simple steps before you buy.</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {steps.map((s) => (
          <div key={s.number} className="bg-stone-50 rounded-xl p-4 border border-stone-200">
            <span className="inline-block bg-green-700 text-white text-xs font-bold px-2.5 py-1 rounded-full mb-3">{s.number}</span>
            <p className="font-semibold text-green-900 mb-1">{s.title}</p>
            <p className="text-sm text-stone-500 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  const { selected, addPlant, removePlant } = useSelectedPlants();

  return (
    <>
      <header className="w-full bg-gradient-to-br from-green-900 to-green-600 px-6 py-16 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-4">Garden Planner</h1>
          <p className="text-green-100 text-lg max-w-xl leading-relaxed">
            See how your garden would look like with some more plants
          </p>
      
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 w-full flex flex-col gap-6">


        <HowItWorks />

        <div id="planner" className="flex flex-col gap-6 scroll-mt-6">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8">
            <PlantBrowser selected={selected} onAdd={addPlant} onRemove={removePlant} />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8">
            <SelectedPlants selected={selected} onAdd={addPlant} onRemove={removePlant} />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8">
            <GeneratePlan selected={selected} />
          </div>
        </div>



      </main>
    </>
  );
}
