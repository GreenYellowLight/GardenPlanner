"use client";

import PlantBrowser from "@/app/ui/PlantBrowser";
import SelectedPlants from "@/app/ui/SelectedPlants";
import GeneratePlan from "@/app/ui/GeneratePlan";
import { useSelectedPlants } from "@/app/lib/useSelectedPlants";
import HowItWorks from "@/app/ui/HowItWorks";
import DemoExample from "@/app/ui/DemoExample";
import Header from "@/app/ui/Header";
import { MainPanel } from "@/app/ui/Elements";


export default function Page() {
  const { selected, addPlant, removePlant } = useSelectedPlants();


  return (
    <>
      <Header />


      <main className="max-w-3xl mx-auto px-4 py-10 w-full flex flex-col gap-6">

        <MainPanel><HowItWorks/> </MainPanel>
        
        <MainPanel><DemoExample /></MainPanel>
        <div id="step-1" className="scroll-mt-6"><MainPanel><PlantBrowser selected={selected} onAdd={addPlant} onRemove={removePlant} /></MainPanel></div>
        <div id="step-2" className="scroll-mt-6"><MainPanel><SelectedPlants selected={selected} onAdd={addPlant} onRemove={removePlant} /></MainPanel></div>
        <div id="step-3" className="scroll-mt-6"><MainPanel><GeneratePlan selected={selected} /></MainPanel></div>



      </main>
    </>
  );
}
