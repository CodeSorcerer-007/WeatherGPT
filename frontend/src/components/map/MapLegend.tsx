'use client';

import React from 'react';

interface MapLegendProps {
  activeLayer: string;
}

export function MapLegend({ activeLayer }: MapLegendProps) {
  return (
    <div className="p-3 rounded-2xl bg-card/90 backdrop-blur-xl border shadow-xl text-xs space-y-2 max-w-[260px]">
      <div className="font-bold text-foreground text-[11px] uppercase tracking-wider">
        Map Legend ({activeLayer.toUpperCase()})
      </div>

      {activeLayer === 'radar' && (
        <div className="space-y-1.5">
          <div className="text-[10px] text-muted-foreground flex justify-between">
            <span>Light Rain (1 mm/h)</span>
            <span>Violent (&gt;50 mm/h)</span>
          </div>
          <div className="h-2.5 rounded-full bg-gradient-to-r from-blue-300 via-sky-500 via-yellow-400 via-orange-500 to-rose-600 w-full" />
        </div>
      )}

      {activeLayer === 'temp' && (
        <div className="space-y-1.5">
          <div className="text-[10px] text-muted-foreground flex justify-between">
            <span>Cold (10°C)</span>
            <span>Extreme Heat (45°C)</span>
          </div>
          <div className="h-2.5 rounded-full bg-gradient-to-r from-blue-600 via-teal-400 via-amber-300 via-orange-500 to-red-600 w-full" />
        </div>
      )}

      {activeLayer === 'wind' && (
        <div className="space-y-1.5">
          <div className="text-[10px] text-muted-foreground flex justify-between">
            <span>Breeze (10 km/h)</span>
            <span>Gale (&gt;100 km/h)</span>
          </div>
          <div className="h-2.5 rounded-full bg-gradient-to-r from-teal-200 via-teal-500 via-cyan-600 to-purple-600 w-full" />
        </div>
      )}

      {activeLayer === 'cyclone' && (
        <div className="space-y-1 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600 border border-white" />
            <span>Cyclone Eye Center</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-1 bg-red-500 rounded" />
            <span>Past / Forecast Trajectory</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-3 bg-red-500/20 border border-red-500 border-dashed rounded" />
            <span>Cone of Uncertainty (72h)</span>
          </div>
        </div>
      )}

      {activeLayer === 'flood' && (
        <div className="space-y-1 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/60 border border-rose-600" />
            <span>Critical Inundation Hotspot</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500/60 border border-amber-600" />
            <span>Moderate Waterlogging Area</span>
          </div>
        </div>
      )}
    </div>
  );
}
