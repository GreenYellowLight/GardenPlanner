"use client";

import type { Plant } from '@/app/lib/types';
import { Description, StepPill, SubHeading, PlantSelection } from './Elements';

type Props = {
  selected: { plant: Plant; qty: number }[];
  onAdd: (plant: Plant) => void;
  onRemove: (plant: Plant) => void;
};

export default function SelectedPlants({ selected, onAdd, onRemove }: Props) {
  const totalQty = selected.reduce((sum, s) => sum + s.qty, 0)

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <StepPill step={2} />
        <SubHeading>Your selection</SubHeading>
        {totalQty > 0 && (
          <span className="ml-auto text-sm font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
            {totalQty} plant{totalQty !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <Description>Plants you've added to your garden plan</Description>

      {selected.length === 0 ? (

        <p className="text-stone-400 dotted-outline-text">No plants selected yet — add some above.</p>


      ) : (
        <PlantSelection
          plants={selected.map(s => s.plant)}
          selected={selected}
          onAdd={onAdd}
          onRemove={onRemove}
          imageSize="sm"
        />
      )}


    </div>
  );
}
