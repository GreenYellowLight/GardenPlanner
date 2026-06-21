"use client";

import type { Plant } from '@/app/lib/types';

type Props = {
  selected: { plant: Plant; qty: number }[];
  onAdd: (plant: Plant) => void;
  onRemove: (plant: Plant) => void;
};

export default function SelectedPlants({ selected, onAdd, onRemove }: Props) {
  const total = selected.reduce((sum, s) => sum + Number(s.plant.price) * s.qty, 0);

  return (
    <div className="mb-8">
      <p className="text-lg font-medium mb-1">
        Plants you have selected:
        {selected.length > 0 && (
          <span className="ml-2 text-green-700">(${total.toFixed(2)} total)</span>
        )}
      </p>
      {selected.length === 0 ? (
        <p className="text-gray-400 text-sm">No plants selected yet.</p>
      ) : (
        <div className="border-2 border-green-200 rounded-xl overflow-hidden">
          {selected.map(({ plant, qty }) => (
            <div
              key={plant.id}
              className="flex items-center justify-between px-4 py-3 border-b border-green-100 last:border-0"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/plant-list/${plant.name.toLowerCase().replace(/\s+/g, '-')}.webp`}
                  alt={plant.name}
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/40x40/86efac/166534?text=${encodeURIComponent(plant.name[0])}` }}
                />
                <div>
                  <span className="font-medium text-green-900">{plant.name}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    ${Number(plant.price).toFixed(2)} x {qty} = ${(Number(plant.price) * qty).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="ml-4 flex items-center gap-2">
                <button onClick={() => onRemove(plant)} className="w-7 h-7 rounded-lg border-2 border-green-400 text-green-700 font-bold hover:bg-green-50">−</button>
                <span className="text-sm font-medium w-4 text-center">{qty}</span>
                <button onClick={() => onAdd(plant)} className="w-7 h-7 rounded-lg border-2 border-green-400 text-green-700 font-bold hover:bg-green-50">+</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
