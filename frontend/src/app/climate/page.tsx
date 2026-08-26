'use client';

import React from 'react';
import { useWeather } from '@/context/WeatherContext';
import { TrendCharts } from '@/components/climate/TrendCharts';
import { ClimateSummaryCard } from '@/components/climate/ClimateSummaryCard';
import { MOCK_CLIMATE_DATA } from '@/lib/mockData';
import { TrendingUp, LineChart, Sparkles, Bot, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ClimatePage() {
  const { currentLocation } = useWeather();
  const climateData = {
    ...MOCK_CLIMATE_DATA,
    locationName: `${currentLocation.name} (${currentLocation.state})`,
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2.5">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            Decadal Climate Intelligence & Long-Period Trends
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            50-year climatological analysis (1975–2025) for {currentLocation.name} • Surface warming & monsoon shift
          </p>
        </div>

        <Link
          href={`/assistant?q=${encodeURIComponent(`Show climate trends and extreme rainfall shifts for ${currentLocation.name}`)}`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition-all"
        >
          <Bot className="w-4 h-4" />
          <span>Ask AI Climate Analyst</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 50-Year Temperature, Rain, and Extreme Days Charts */}
      <TrendCharts climateData={climateData} />

      {/* Narrative Synthesis & Decadal Anomaly Insights */}
      <ClimateSummaryCard climateData={climateData} />
    </div>
  );
}
