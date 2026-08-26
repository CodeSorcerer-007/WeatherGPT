'use client';

import React from 'react';
import {
  CloudRain,
  Thermometer,
  Wind,
  Cloud,
  AlertTriangle,
  Compass,
  Waves,
  Layers,
} from 'lucide-react';

export type MapLayerType = 'radar' | 'temp' | 'wind' | 'cloud' | 'alerts' | 'cyclone' | 'flood';

interface LayerControlsProps {
  activeLayer: MapLayerType;
  setActiveLayer: (layer: MapLayerType) => void;
  showCycloneOverlay: boolean;
  setShowCycloneOverlay: (val: boolean) => void;
  showFloodOverlay: boolean;
  setShowFloodOverlay: (val: boolean) => void;
}

export function LayerControls({
  activeLayer,
  setActiveLayer,
  showCycloneOverlay,
  setShowCycloneOverlay,
  showFloodOverlay,
  setShowFloodOverlay,
}: LayerControlsProps) {
  const primaryLayers: { id: MapLayerType; label: string; icon: any; color: string }[] = [
    { id: 'radar', label: 'Precipitation Radar', icon: CloudRain, color: 'text-sky-400' },
    { id: 'temp', label: 'Temperature Heatmap', icon: Thermometer, color: 'text-rose-400' },
    { id: 'wind', label: 'Wind Streamlines', icon: Wind, color: 'text-teal-400' },
    { id: 'cloud', label: 'Satellite Clouds', icon: Cloud, color: 'text-slate-300' },
  ];

  return (
    <div className="p-3.5 rounded-2xl bg-card/90 backdrop-blur-xl border shadow-2xl space-y-3 w-64 max-w-full">
      <div className="flex items-center gap-2 font-bold text-xs text-foreground uppercase tracking-wider">
        <Layers className="w-3.5 h-3.5 text-primary" />
        GIS Meteorological Layers
      </div>

      {/* Primary Meteorological Layer Selector */}
      <div className="space-y-1">
        {primaryLayers.map((layer) => {
          const Icon = layer.icon;
          const isSelected = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-accent/30 text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-primary-foreground' : layer.color}`} />
                <span>{layer.label}</span>
              </div>
              {isSelected && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
            </button>
          );
        })}
      </div>

      {/* Extreme Weather Overlays (Checkboxes) */}
      <div className="pt-2 border-t border-border/50 space-y-1.5">
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Severe Hazards & Tracks
        </div>

        {/* Cyclone Overlay Toggle */}
        <label className="flex items-center justify-between p-2 rounded-xl bg-accent/30 hover:bg-accent/60 cursor-pointer text-xs font-medium transition-colors">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-red-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Cyclone Michaung Track</span>
          </div>
          <input
            type="checkbox"
            checked={showCycloneOverlay}
            onChange={(e) => setShowCycloneOverlay(e.target.checked)}
            className="w-4 h-4 text-primary rounded accent-primary cursor-pointer"
          />
        </label>

        {/* Flood Risk Overlay Toggle */}
        <label className="flex items-center justify-between p-2 rounded-xl bg-accent/30 hover:bg-accent/60 cursor-pointer text-xs font-medium transition-colors">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-amber-500" />
            <span>Urban Flood Inundation</span>
          </div>
          <input
            type="checkbox"
            checked={showFloodOverlay}
            onChange={(e) => setShowFloodOverlay(e.target.checked)}
            className="w-4 h-4 text-primary rounded accent-primary cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}
