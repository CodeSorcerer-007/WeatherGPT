'use client';

import React from 'react';
import { ClimateAnalytics } from '@/types';
import { Thermometer, CloudRain, Flame, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ClimateSummaryCardProps {
  climateData: ClimateAnalytics;
}

export function ClimateSummaryCard({ climateData }: ClimateSummaryCardProps) {
  return (
    <div className="p-6 rounded-3xl bg-card border shadow-xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div>
          <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            Regional Climate Synthesis & Decadal Anomaly Summary
          </h3>
          <p className="text-xs text-muted-foreground">
            Benchmarked against 1970–2000 Climatological Baseline
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold">
          IPCC AR6 South Asia Model
        </span>
      </div>

      {/* Key Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-muted/40 border space-y-1">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5 text-rose-400" />
            50-Year Warming Delta
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-rose-500">
            +{climateData.tempIncreaseDelta}°C
          </div>
          <div className="text-[10px] text-muted-foreground">
            From {climateData.baselineTemp}°C to {climateData.recentAvgTemp}°C
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-muted/40 border space-y-1">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <CloudRain className="w-3.5 h-3.5 text-sky-400" />
            Monsoon Rainfall Shift
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-sky-500">
            +{climateData.rainfallShiftPct}%
          </div>
          <div className="text-[10px] text-muted-foreground">
            {climateData.baselineRainfall}mm to {climateData.recentAvgRainfall}mm
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-muted/40 border space-y-1">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Extreme Downpours
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-amber-500">
            +64% Frequency
          </div>
          <div className="text-[10px] text-muted-foreground">
            Single-day events &gt;100mm
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-muted/40 border space-y-1">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            Urban Heat Island (UHI)
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-indigo-400">
            +1.8°C Delta
          </div>
          <div className="text-[10px] text-muted-foreground">
            Nocturnal heat burden in city core
          </div>
        </div>
      </div>

      {/* Narrative Synthesis */}
      <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium p-4 rounded-2xl bg-accent/30 border">
        {climateData.summary}
      </p>

      {/* Key Insights List */}
      <div className="space-y-2 pt-1">
        <div className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
          Scientific Takeaways for Disaster & Urban Planning:
        </div>
        <div className="space-y-2">
          {climateData.keyInsights.map((insight, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground font-medium">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
