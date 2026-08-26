'use client';

import React from 'react';
import { AgricultureAdvisory } from '@/types';
import { Wind, Gauge, AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface SpraySuitabilityGaugeProps {
  advisory: AgricultureAdvisory;
}

export function SpraySuitabilityGauge({ advisory }: SpraySuitabilityGaugeProps) {
  const spray = advisory.spraySuitability;
  const wind = advisory.windSuitability;

  const isOptimal = spray.rating === 'Optimal';
  const isCaution = spray.rating === 'Caution';

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-card border shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-base text-foreground flex items-center gap-2">
          <Wind className="w-5 h-5 text-teal-400" />
          Pesticide & Foliar Spray Suitability
        </h4>
        <span
          className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase ${
            isOptimal
              ? 'bg-emerald-500 text-white'
              : isCaution
              ? 'bg-amber-500 text-black'
              : 'bg-rose-600 text-white'
          }`}
        >
          {spray.rating}
        </span>
      </div>

      {/* Atmospheric Wind Drift & Wash-off Status */}
      <div className="p-4 rounded-2xl bg-muted/40 border space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span>Wind Speed Threshold:</span>
          <span className={wind.isSafe ? 'text-emerald-400' : 'text-rose-400'}>
            {wind.currentSpeed} km/h (Limit: {wind.threshold} km/h)
          </span>
        </div>

        {/* Limiting Factors */}
        {spray.limitingFactors.length > 0 && (
          <div className="space-y-1 pt-1">
            <div className="text-[11px] font-bold text-rose-400">Risk Constraints:</div>
            {spray.limitingFactors.map((f, i) => (
              <div key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Best Application Window */}
      <div className="p-3 rounded-2xl bg-accent/40 border flex items-center gap-2.5 text-xs">
        <Clock className="w-4 h-4 text-primary shrink-0" />
        <div>
          <span className="font-semibold text-muted-foreground">Optimal Chemical Application Window: </span>
          <span className="font-bold text-foreground">{spray.bestTimeWindow}</span>
        </div>
      </div>
    </div>
  );
}
