"use client";

import PlantBrowser from "@/app/ui/PlantBrowser";
import SelectedPlants from "@/app/ui/SelectedPlants";
import GeneratePlan from "@/app/ui/GeneratePlan";
import { useSelectedPlants } from "@/app/lib/useSelectedPlants";
import { HowItWorks } from "./ui/HowItWorks";
import { outerCardClass } from "@/app/lib/styles";


export default function Page() {
  const { selected, addPlant, removePlant } = useSelectedPlants();
  

  return (
    <>
      <header className="w-full bg-green-900  px-6 py-16 shadow-lg">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-4">Garden Planner</h1>
          <p className="text-green-100 text-lg max-w-xl leading-relaxed">
            See how your garden would look like with some more plants
          </p>
      
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 w-full flex flex-col gap-6">


        <HowItWorks />

        <div id="planner" className="flex flex-col gap-6 scroll-mt-6">
          <div id="step-1" className={outerCardClass}>
            <PlantBrowser selected={selected} onAdd={addPlant} onRemove={removePlant} />
          </div>
          <div id="step-2" className={outerCardClass}>
            <SelectedPlants selected={selected} onAdd={addPlant} onRemove={removePlant} />
          </div>
          <div id="step-3" className={outerCardClass}>
            <GeneratePlan selected={selected} />
          </div>
        </div>



      </main>
    </>
  );
}
