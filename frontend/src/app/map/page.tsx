'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Map as MapIcon, Layers, Sparkles } from 'lucide-react';

// Dynamic import for Leaflet map to ensure strictly client-side execution
const WeatherMap = dynamic(
  () => import('@/components/map/WeatherMap').then((mod) => mod.WeatherMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[calc(100vh-140px)] min-h-[500px] rounded-3xl border bg-slate-950 flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold">Initializing High-Resolution GIS Map Engine...</span>
      </div>
    ),
  }
);

export default function MapPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground flex items-center gap-2">
            <MapIcon className="w-6 h-6 text-primary" />
            GIS Interactive Meteorological & Hazard Map
          </h1>
          <p className="text-xs text-muted-foreground">
            Multi-layer precipitation radar, wind vectors, active cyclone trajectory, and urban flood inundation zones
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-card border">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Live Doppler Radar & Satellite Feeds</span>
        </div>
      </div>

      {/* Main Full-Size Map Component */}
      <WeatherMap />
    </div>
  );
}
