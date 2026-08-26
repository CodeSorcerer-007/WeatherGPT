'use client';

import React from 'react';
import { AgricultureAdvisory } from '@/types';
import { Droplets, Calendar, AlertCircle, CheckCircle2, CloudRain } from 'lucide-react';

interface IrrigationAdvisoryProps {
  advisory: AgricultureAdvisory;
}

export function IrrigationAdvisory({ advisory }: IrrigationAdvisoryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Drain':
        return 'bg-rose-500 text-white';
      case 'Delay':
        return 'bg-amber-500 text-black font-bold';
      case 'Apply':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-emerald-600 text-white';
    }
  };

  const irri = advisory.irrigationRecommendation;

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-card border shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-base text-foreground flex items-center gap-2">
          <Droplets className="w-5 h-5 text-sky-400" />
          Field Water & Irrigation Recommendation
        </h4>
        <span className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase ${getStatusColor(irri.status)}`}>
          Action: {irri.status} Irrigation
        </span>
      </div>

      <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
        {irri.reason}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="p-3 rounded-2xl bg-muted/40 border flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground">Soil Moisture Level</div>
            <div className="text-sm font-bold text-foreground">
              {advisory.soilMoistureLevel} Capacity
            </div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-muted/40 border flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground">Next Suggested Window</div>
            <div className="text-xs font-bold text-foreground">
              {irri.nextRecommendedDate}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
