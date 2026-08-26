'use client';

import React from 'react';
import { Wheat, Sprout, Sparkles } from 'lucide-react';

interface CropSelectorProps {
  selectedCrop: string;
  onSelectCrop: (crop: string) => void;
  selectedStage: string;
  onSelectStage: (stage: string) => void;
}

export const CROPS = [
  { id: 'Paddy', name: 'Paddy (Rice / நெல் / धान)', icon: '🌾' },
  { id: 'Cotton', name: 'Cotton (பருத்தி / कपास)', icon: '☁️' },
  { id: 'Wheat', name: 'Wheat (கோதுமை / गेहूं)', icon: '🌱' },
  { id: 'Sugarcane', name: 'Sugarcane (கரும்பு / गन्ना)', icon: '🎋' },
];

export const GROWTH_STAGES = [
  'Nursery / Sowing',
  'Tillering / Vegetative Phase',
  'Square / Flowering Phase',
  'Grain Filling / Heading',
  'Maturity / Pre-Harvest',
];

export function CropSelector({
  selectedCrop,
  onSelectCrop,
  selectedStage,
  onSelectStage,
}: CropSelectorProps) {
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-card border shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base text-foreground flex items-center gap-2">
          <Wheat className="w-5 h-5 text-emerald-500" />
          Select Field Crop & Phenological Growth Stage
        </h3>
        <span className="text-xs font-semibold text-emerald-500 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          Agro-Met Advisory
        </span>
      </div>

      {/* Crop Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {CROPS.map((crop) => (
          <button
            key={crop.id}
            onClick={() => onSelectCrop(crop.id)}
            className={`p-3 rounded-2xl border text-xs font-semibold transition-all text-left flex items-center gap-2.5 ${
              selectedCrop === crop.id
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md scale-[1.02]'
                : 'bg-accent/30 text-foreground hover:bg-accent/60'
            }`}
          >
            <span className="text-xl">{crop.icon}</span>
            <span className="line-clamp-1">{crop.name}</span>
          </button>
        ))}
      </div>

      {/* Growth Stage Selector */}
      <div className="space-y-1.5 pt-2">
        <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
          <Sprout className="w-3.5 h-3.5 text-emerald-500" />
          Active Crop Phenological Stage:
        </label>
        <div className="flex flex-wrap gap-1.5">
          {GROWTH_STAGES.map((stage) => (
            <button
              key={stage}
              onClick={() => onSelectStage(stage)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedStage === stage
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
