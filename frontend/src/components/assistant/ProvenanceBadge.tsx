'use client';

import React, { useState } from 'react';
import { DataSourceProvenance } from '@/types';
import { ShieldCheck, Info, Clock, Layers, ChevronDown, ChevronUp } from 'lucide-react';

interface ProvenanceBadgeProps {
  sources?: DataSourceProvenance[];
  confidence?: 'High' | 'Moderate' | 'Low';
  whyExplanation?: string[];
}

export function ProvenanceBadge({ sources, confidence = 'High', whyExplanation }: ProvenanceBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-border/50 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Source Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
            <Layers className="w-3 h-3 text-primary" />
            Sources:
          </span>
          {sources.map((src, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/60 text-[10px] font-medium text-foreground border"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {src.name} {src.model ? `(${src.model})` : ''}
            </span>
          ))}
        </div>

        {/* Confidence & Explain toggle */}
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              confidence === 'High'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}
          >
            {confidence} Confidence
          </span>

          {whyExplanation && whyExplanation.length > 0 && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-0.5"
            >
              Why this advice?
              {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Scientific Explainability */}
      {isOpen && whyExplanation && (
        <div className="mt-2.5 p-3 rounded-xl bg-card border text-xs space-y-1.5 animate-in fade-in">
          <div className="font-bold text-primary flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            Meteorological Rationale & Verification
          </div>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            {whyExplanation.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
