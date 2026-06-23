"use client";

import type { Plant } from '@/app/lib/types';

type Props = {
  selected: { plant: Plant; qty: number }[];
  onAdd: (plant: Plant) => void;
  onRemove: (plant: Plant) => void;
};

export default function SelectedPlants({ selected, onAdd, onRemove }: Props) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <svg width="58" height="26" viewBox="0 0 58 26" className="flex-shrink-0">
          <rect width="58" height="26" rx="13" fill="#15803d" />
          <text x="29" y="13" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="14" fontWeight="bold">Step 2</text>
        </svg>
        <h2 className="text-xl font-semibold text-green-900">Your selection</h2>
        {selected.length > 0 && (
          <span className="ml-auto text-sm font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
            {selected.reduce((sum, s) => sum + s.qty, 0)} plant{selected.reduce((sum, s) => sum + s.qty, 0) !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      <p className="text-sm text-stone-500 mb-5">
        Plants you've added to your garden plan.
      </p>

      {selected.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-stone-300 rounded-xl">
          <p className="text-stone-400">No plants selected yet — add some above.</p>
        </div>
      ) : (
        <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100">
          {selected.map(({ plant, qty }) => (
            <div
              key={plant.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-stone-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/plant-list/${plant.name.toLowerCase().replace(/\s+/g, '-')}.webp`}
                  alt={plant.name}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0 shadow-sm"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/48x48/86efac/166534?text=${encodeURIComponent(plant.name[0])}` }}
                />
                <div>
                  <p className="font-semibold text-green-900">{plant.name}</p>
                  <p className="text-sm text-stone-400">{plant.origin_continent} · {plant.shade_requirement}</p>
                </div>
              </div>
              <div className="ml-4 flex items-center gap-2">
                <button onClick={() => onRemove(plant)} className="w-8 h-8 rounded-lg border border-stone-300 text-stone-600 font-bold hover:bg-stone-100 transition-colors">−</button>
                <span className="text-sm font-semibold w-5 text-center">{qty}</span>
                <button onClick={() => onAdd(plant)} className="w-8 h-8 rounded-lg bg-green-700 text-white font-bold hover:bg-green-800 transition-colors">+</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
