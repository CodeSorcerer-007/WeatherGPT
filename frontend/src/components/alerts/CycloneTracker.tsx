'use client';

import React from 'react';
import { MOCK_CYCLONE_DATA } from '@/lib/mockData';
import { Compass, Wind, Gauge, Navigation, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CycloneTracker() {
  const cyc = MOCK_CYCLONE_DATA;

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-red-950/40 via-card to-card border border-red-500/30 shadow-2xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-500 flex items-center justify-center animate-spin" style={{ animationDuration: '6s' }}>
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-extrabold tracking-wider uppercase animate-pulse">
                Severe Cyclonic Storm
              </span>
              <h3 className="font-extrabold text-lg text-foreground">{cyc.name}</h3>
            </div>
            <p className="text-xs text-muted-foreground">{cyc.basin}</p>
          </div>
        </div>

        <Link
          href="/map"
          className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <span>View on Live GIS Map</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Key Track Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-card border">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-primary" />
            Current Center
          </div>
          <div className="text-sm sm:text-base font-bold text-foreground mt-1">
            {cyc.currentPosition[0]}°N, {cyc.currentPosition[1]}°E
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-card border">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-teal-400" />
            Max Wind Gusts
          </div>
          <div className="text-sm sm:text-base font-bold text-foreground mt-1">
            {cyc.maxSustainedWind}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-card border">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-indigo-400" />
            Central Pressure
          </div>
          <div className="text-sm sm:text-base font-bold text-foreground mt-1">
            {cyc.centralPressure}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-card border">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            Track Movement
          </div>
          <div className="text-sm sm:text-base font-bold text-foreground mt-1">
            {cyc.movementSpeed}
          </div>
        </div>
      </div>

      {/* Trajectory Timeline */}
      <div className="space-y-3 pt-2">
        <div className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
          Forecast Progression & Landfall Window
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {cyc.forecastTrack.map((pt, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border text-xs space-y-1 ${
                idx === 2
                  ? 'bg-red-500/10 border-red-500/40 text-foreground font-semibold shadow-md'
                  : 'bg-muted/40 text-muted-foreground'
              }`}
            >
              <div className="font-bold text-primary">{pt.time}</div>
              <div className="text-[11px]">
                Coord: {pt.lat}°N, {pt.lon}°E
              </div>
              <div className="text-[11px] font-medium text-rose-400">{pt.intensity}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
