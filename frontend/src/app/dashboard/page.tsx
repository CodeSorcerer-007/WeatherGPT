'use client';

import React from 'react';
import { CurrentConditionsCard } from '@/components/dashboard/CurrentConditionsCard';
import { WeatherMetricsGrid } from '@/components/dashboard/WeatherMetricsGrid';
import { HourlyForecastChart } from '@/components/dashboard/HourlyForecastChart';
import { SevenDayForecast } from '@/components/dashboard/SevenDayForecast';
import { WeatherInsightsCarousel } from '@/components/dashboard/WeatherInsightsCarousel';
import { SectorAdvisoryCard } from '@/components/dashboard/SectorAdvisoryCard';
import { useWeather } from '@/context/WeatherContext';
import { useLanguage } from '@/context/LanguageContext';
import { CloudSun, Sparkles, MapPin, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const { currentLocation, refreshWeather, isLoading } = useWeather();
  const { t } = useLanguage();

  return (
    <div className="space-y-6 pb-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2.5">
            <CloudSun className="w-8 h-8 text-primary" />
            Meteorological Intelligence Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Station Observations • High-Resolution WRF / GFS Forecasts • Air & Hazard Indices
          </p>
        </div>

        <button
          onClick={() => refreshWeather()}
          disabled={isLoading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border bg-card hover:bg-accent text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-primary' : ''}`} />
          <span>Refresh Observations</span>
        </button>
      </div>

      {/* Hero Current Weather */}
      <CurrentConditionsCard />

      {/* Persona Adaptive Operational Advisory */}
      <SectorAdvisoryCard />

      {/* Key Meteorological Parameters Grid */}
      <WeatherMetricsGrid />

      {/* Hourly Forecast Chart */}
      <HourlyForecastChart />

      {/* 7-Day Extended Forecast */}
      <SevenDayForecast />

      {/* Automated Real-time Operational Insights */}
      <WeatherInsightsCarousel />
    </div>
  );
}
