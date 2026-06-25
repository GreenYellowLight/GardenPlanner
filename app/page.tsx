"use client";

import PlantBrowser from "@/app/ui/PlantBrowser";
import SelectedPlants from "@/app/ui/SelectedPlants";
import GeneratePlan from "@/app/ui/GeneratePlan";
import { useSelectedPlants } from "@/app/lib/useSelectedPlants";
import { outerCardClass } from "@/app/lib/styles";
import HowItWorks from "./ui/HowItWorks";
import Header from "./ui/Header";
import { MainPanel } from "./ui/Elements";


export default function Page() {
  const { selected, addPlant, removePlant } = useSelectedPlants();


  return (
    <>
      <Header />


      <main className="max-w-3xl mx-auto px-4 py-10 w-full flex flex-col gap-6">

        <MainPanel><HowItWorks/> </MainPanel>
        <MainPanel><PlantBrowser selected={selected} onAdd={addPlant} onRemove={removePlant} /> </MainPanel>
        <MainPanel><SelectedPlants selected={selected} onAdd={addPlant} onRemove={removePlant} /> </MainPanel>
        <MainPanel> <GeneratePlan selected={selected} /></MainPanel>

{/* TODO: add the steps 123 links to the div back */}



      </main>
    </>
  );
}
