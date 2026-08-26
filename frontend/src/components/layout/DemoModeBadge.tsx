'use client';

import React from 'react';
import { useWeather } from '@/context/WeatherContext';
import { useLanguage } from '@/context/LanguageContext';
import { Database, Zap, RefreshCw } from 'lucide-react';

export function DemoModeBadge() {
  const { demoMode, setDemoMode, refreshWeather, isLoading } = useWeather();
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-all bg-card/80 backdrop-blur-md shadow-sm">
      <div className="flex items-center gap-1.5">
        <span
          className={`w-2 h-2 rounded-full ${
            demoMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
          }`}
        />
        <span className="font-medium text-muted-foreground hidden sm:inline">
          {demoMode ? t.demoMode : 'Live Meteorological APIs'}
        </span>
      </div>

      <button
        onClick={() => setDemoMode(!demoMode)}
        className="ml-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1"
        title="Toggle between synthetic test data and live Open-Meteo/IMD API connection"
      >
        {demoMode ? (
          <>
            <Zap className="w-3 h-3 text-amber-500" />
            Switch Live
          </>
        ) : (
          <>
            <Database className="w-3 h-3 text-emerald-500" />
            Use Demo
          </>
        )}
      </button>

      <button
        onClick={() => refreshWeather()}
        disabled={isLoading}
        className="p-1 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        title="Refresh Data"
      >
        <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-primary' : ''}`} />
      </button>
    </div>
  );
}
