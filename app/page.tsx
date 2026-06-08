"use client";

import Link from "next/link";
import { useState } from "react";
import PlantBrowser from "@/app/ui/PlantBrowser";
import SelectedPlants from "@/app/ui/SelectedPlants";
import GeneratePlan from "@/app/ui/GeneratePlan";
import type { Plant } from "@/app/lib/types";


export default function Page() {
  const [selected, setSelected] = useState<{ plant: Plant; qty: number }[]>([]);

  function addPlant(plant: Plant) {
    setSelected((prev) => {
      const existing = prev.find((s) => s.plant.id === plant.id);
      if (existing) return prev.map((s) => s.plant.id === plant.id ? { ...s, qty: s.qty + 1 } : s);
      return [...prev, { plant, qty: 1 }];
    });
  }

  function removePlant(plant: Plant) {
    setSelected((prev) => {
      const existing = prev.find((s) => s.plant.id === plant.id);
      if (!existing) return prev;
      if (existing.qty === 1) return prev.filter((s) => s.plant.id !== plant.id);
      return prev.map((s) => s.plant.id === plant.id ? { ...s, qty: s.qty - 1 } : s);
    });
  }

  return (
    <>
      <header className="w-full bg-green-700 px-6 py-5">
        <h1 className="text-4xl font-bold text-white">Garden Planner</h1>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">

        <Link href="testai">
          <p className="text-red-400 underline">Go to test page</p>
        </Link>

        <p className="text-center text-lg mb-10">
          This will help you plan your next gardening endeavour! All plants can be bought from <a href="lotsofplantsvictoria.com" className="text-blue-600 underline hover:text-blue-800">lotsofplantsvictoria.com</a> (if it were a real website) </p>

        <PlantBrowser selected={selected} onAdd={addPlant} onRemove={removePlant} />

        <SelectedPlants selected={selected} onAdd={addPlant} onRemove={removePlant} />

        <GeneratePlan selected={selected} />

      </main>
    </>
  );
}
