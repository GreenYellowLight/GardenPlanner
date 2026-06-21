"use client";

import PlantBrowser from "@/app/ui/PlantBrowser";
import SelectedPlants from "@/app/ui/SelectedPlants";
import GeneratePlan from "@/app/ui/GeneratePlan";
import { useSelectedPlants } from "@/app/lib/useSelectedPlants";

export default function Page() {
  const { selected, addPlant, removePlant } = useSelectedPlants();

  return (
    <>
      <header className="w-full bg-green-700 px-6 py-5">
        <h1 className="text-4xl font-bold text-white">Garden Planner</h1>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">

        <p className="text-center text-lg mb-10">
          This will help you plan your next gardening endeavour! All plants can be bought from <a href="lotsofplantsvictoria" className="text-blue-600 underline hover:text-blue-800">lotsofplantsvictoria.com</a> (if it were a real website)
        </p>

        <PlantBrowser selected={selected} onAdd={addPlant} onRemove={removePlant} />
        <SelectedPlants selected={selected} onAdd={addPlant} onRemove={removePlant} />
        <GeneratePlan selected={selected} />

      </main>
    </>
  );
}
