'use client';

import { useState } from 'react';

const crops = [
  { name: 'Maize', emoji: '🌽' },
  { name: 'Cassava', emoji: '🫚' },
  { name: 'Rice', emoji: '🌾' },
  { name: 'Tomato', emoji: '🍅' },
  { name: 'Yam', emoji: '🥔' },
  { name: 'Beans', emoji: '🫘' },
  { name: 'Sorghum', emoji: '🌾' },
  { name: 'Groundnut', emoji: '🥜' }
];

export function CropSelector({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>(value);

  function toggle(crop: string) {
    const next = selected.includes(crop) ? selected.filter((item) => item !== crop) : [...selected, crop];
    setSelected(next);
    onChange(next);
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {crops.map((crop) => {
        const active = selected.includes(crop.name);
        return (
          <button
            key={crop.name}
            type="button"
            onClick={() => toggle(crop.name)}
            className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-sm font-medium transition ${active ? 'border-savanna-orange bg-orange-50 text-savanna-orange shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
          >
            <span className="text-2xl">{crop.emoji}</span>
            <span>{crop.name}</span>
          </button>
        );
      })}
    </div>
  );
}