'use client';

import React from 'react';
import { AgricultureAdvisory } from '@/types';
import { Bug, ShieldCheck, ThermometerSnowflake, AlertTriangle } from 'lucide-react';

interface PestDiseaseRiskProps {
  advisory: AgricultureAdvisory;
}

export function PestDiseaseRisk({ advisory }: PestDiseaseRiskProps) {
  const pest = advisory.pestDiseaseRisk;
  const stress = advisory.heatColdStress;

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-card border shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-base text-foreground flex items-center gap-2">
          <Bug className="w-5 h-5 text-amber-500" />
          Pest, Blight & Thermal Crop Stress
        </h4>
        <span
          className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase ${
            pest.riskLevel === 'High'
              ? 'bg-rose-500 text-white'
              : pest.riskLevel === 'Moderate'
              ? 'bg-amber-500 text-black'
              : 'bg-emerald-500 text-white'
          }`}
        >
          {pest.riskLevel} Disease Risk
        </span>
      </div>

      <div className="space-y-3">
        {/* Identified Pathogens */}
        <div className="p-3.5 rounded-2xl bg-muted/40 border space-y-1.5">
          <div className="text-xs font-bold text-foreground">Weather-Linked Pathogen Vulnerabilities:</div>
          <div className="flex flex-wrap gap-1.5">
            {pest.vulnerabilities.map((v, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full bg-card border text-xs font-semibold text-rose-400"
              >
                {v}
              </span>
            ))}
          </div>
        </div>

        {/* Preventive Protocol */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
          <div className="font-bold text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Biological & Cultural Preventive Measure:
          </div>
          <p className="text-foreground/90 font-medium leading-relaxed">
            {pest.preventiveMeasure}
          </p>
        </div>

        {/* Crop Thermal Stress */}
        <div className="p-3 rounded-2xl bg-accent/40 border text-xs flex items-center gap-2.5">
          <ThermometerSnowflake className="w-4 h-4 text-primary shrink-0" />
          <div>
            <span className="font-bold text-foreground">Canopy Thermal Status: </span>
            <span className="text-muted-foreground">{stress.mitigation}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
