'use client';

import React from 'react';
import { useWeather } from '@/context/WeatherContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAccessibility } from '@/context/AccessibilityContext';
import { formatTemp, formatSpeed, formatPressure } from '@/lib/units';
import {
  Sun,
  CloudSun,
  CloudRain,
  CloudLightning,
  Wind,
  Droplets,
  Compass,
  Sunrise,
  Sunset,
  Eye,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export function CurrentConditionsCard() {
  const { observation, currentLocation, dailyForecast } = useWeather();
  const { t } = useLanguage();
  const { units } = useAccessibility();

  const todayForecast = dailyForecast[0] || { tempMax: 33, tempMin: 26 };

  const getWeatherIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('thunder') || c.includes('lightning')) {
      return <CloudLightning className="w-16 h-16 text-purple-400 animate-bounce" />;
    }
    if (c.includes('rain') || c.includes('shower') || c.includes('downpour')) {
      return <CloudRain className="w-16 h-16 text-sky-400 animate-pulse" />;
    }
    if (c.includes('cloud')) {
      return <CloudSun className="w-16 h-16 text-amber-300" />;
    }
    return <Sun className="w-16 h-16 text-amber-400 animate-[spin_20s_linear_infinite]" />;
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/60 via-slate-900/80 to-indigo-950/70 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl text-white">
      {/* Decorative radar background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Location & Primary Temperature */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md border border-white/10 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {currentLocation.name}, {currentLocation.state}
            </span>
            <span className="text-xs text-white/70 font-medium">
              {observation.updatedTime}
            </span>
          </div>

          <div className="flex items-baseline gap-4">
            <div className="text-5xl sm:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-white via-white to-white/80 bg-clip-text text-transparent">
              {formatTemp(observation.temperature, units.temp)}
            </div>
            <div className="space-y-1">
              <div className="text-sm sm:text-base font-semibold text-sky-200">
                {t.feelsLike} {formatTemp(observation.feelsLike, units.temp)}
              </div>
              <div className="text-xs text-white/70 font-medium flex items-center gap-2">
                <span>H: {formatTemp(todayForecast.tempMax, units.temp)}</span>
                <span>•</span>
                <span>L: {formatTemp(todayForecast.tempMin, units.temp)}</span>
              </div>
            </div>
          </div>

          <div className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span>{observation.condition}</span>
          </div>
        </div>

        {/* Center: Condition Icon & Animation */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shrink-0">
          {getWeatherIcon(observation.condition)}
          <div className="text-xs font-medium text-white/80 mt-2 text-center">
            {currentLocation.zone ? `${currentLocation.zone.toUpperCase()} REGION` : 'COASTAL MET'}
          </div>
        </div>

        {/* Right: Key Meteorological Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 shrink-0">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-white/70">{t.humidity}</div>
              <div className="text-sm sm:text-base font-bold text-white">
                {observation.humidity}%
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-white/70">{t.wind}</div>
              <div className="text-sm sm:text-base font-bold text-white">
                {formatSpeed(observation.windSpeed, units.speed)}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Sunrise className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-white/70">Sunrise</div>
              <div className="text-xs sm:text-sm font-bold text-white">
                {observation.sunrise}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300">
              <Sunset className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-white/70">Sunset</div>
              <div className="text-xs sm:text-sm font-bold text-white">
                {observation.sunset}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
