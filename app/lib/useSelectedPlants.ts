import { useState } from "react"
import type { Plant } from "@/app/lib/types"

export function useSelectedPlants() {
    const [selected, setSelected] = useState<{ plant: Plant; qty: number }[]>([])

    function addPlant(plant: Plant) {
        setSelected((prev) => {
            const existing = prev.find((s) => s.plant.id === plant.id)
            if (existing) return prev.map((s) => s.plant.id === plant.id ? { ...s, qty: s.qty + 1 } : s)
            return [...prev, { plant, qty: 1 }]
        })
    }

    function removePlant(plant: Plant) {
        setSelected((prev) => {
            const existing = prev.find((s) => s.plant.id === plant.id)
            if (!existing) return prev
            if (existing.qty === 1) return prev.filter((s) => s.plant.id !== plant.id)
            return prev.map((s) => s.plant.id === plant.id ? { ...s, qty: s.qty - 1 } : s)
        })
    }

    return { selected, addPlant, removePlant }
}
