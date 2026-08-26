'use client';

import React from 'react';
import { useWeather } from '@/context/WeatherContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAccessibility } from '@/context/AccessibilityContext';
import { formatSpeed, formatPressure } from '@/lib/units';
import {
  Sun,
  Wind,
  Droplets,
  Gauge,
  Eye,
  Activity,
  Compass,
  Sparkles,
} from 'lucide-react';

export function WeatherMetricsGrid() {
  const { observation } = useWeather();
  const { t } = useLanguage();
  const { units } = useAccessibility();

  const getAqiStatus = (aqi: number) => {
    if (aqi <= 50) return { label: 'Good', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
    if (aqi <= 100) return { label: 'Moderate', color: 'text-amber-400', bg: 'bg-amber-500/10' };
    if (aqi <= 200) return { label: 'Poor', color: 'text-orange-400', bg: 'bg-orange-500/10' };
    return { label: 'Severe', color: 'text-red-400', bg: 'bg-red-500/10' };
  };

  const getUvStatus = (uv: number) => {
    if (uv <= 2) return { label: 'Low', color: 'text-emerald-400' };
    if (uv <= 5) return { label: 'Moderate', color: 'text-amber-400' };
    if (uv <= 7) return { label: 'High', color: 'text-orange-400' };
    if (uv <= 10) return { label: 'Very High', color: 'text-rose-400' };
    return { label: 'Extreme', color: 'text-purple-400' };
  };

  const aqiInfo = getAqiStatus(observation.airQualityIndex);
  const uvInfo = getUvStatus(observation.uvIndex);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {/* UV Index */}
      <div className="p-4 rounded-3xl bg-card border shadow-md space-y-2 hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold">{t.uvIndex}</span>
          <Sun className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-2xl font-bold text-foreground">{observation.uvIndex}</div>
        <div className={`text-[11px] font-bold ${uvInfo.color}`}>
          {uvInfo.label} Exposure Risk
        </div>
      </div>

      {/* Air Quality Index */}
      <div className="p-4 rounded-3xl bg-card border shadow-md space-y-2 hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold">{t.airQuality}</span>
          <Activity className="w-4 h-4 text-teal-400" />
        </div>
        <div className="text-2xl font-bold text-foreground">{observation.airQualityIndex}</div>
        <div className={`text-[11px] font-bold ${aqiInfo.color}`}>
          {aqiInfo.label} Air Quality
        </div>
      </div>

      {/* Wind & Gusts */}
      <div className="p-4 rounded-3xl bg-card border shadow-md space-y-2 hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold">{t.wind}</span>
          <Wind className="w-4 h-4 text-blue-400" />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-foreground">
          {formatSpeed(observation.windSpeed, units.speed)}
        </div>
        <div className="text-[11px] text-muted-foreground font-medium">
          {observation.windDirectionText} • Gusts {observation.windGust} km/h
        </div>
      </div>

      {/* Humidity & Dew Point */}
      <div className="p-4 rounded-3xl bg-card border shadow-md space-y-2 hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold">{t.humidity}</span>
          <Droplets className="w-4 h-4 text-sky-400" />
        </div>
        <div className="text-2xl font-bold text-foreground">{observation.humidity}%</div>
        <div className="text-[11px] text-muted-foreground font-medium">
          Dew Point: {observation.dewPoint}°C
        </div>
      </div>

      {/* Barometric Pressure */}
      <div className="p-4 rounded-3xl bg-card border shadow-md space-y-2 hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold">{t.pressure}</span>
          <Gauge className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-foreground">
          {formatPressure(observation.pressure, units.pressure)}
        </div>
        <div className="text-[11px] text-muted-foreground font-medium">
          {observation.pressure < 1005 ? 'Low (Storm Trough)' : 'Standard Barometric'}
        </div>
      </div>

      {/* Optical Visibility */}
      <div className="p-4 rounded-3xl bg-card border shadow-md space-y-2 hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold">{t.visibility}</span>
          <Eye className="w-4 h-4 text-purple-400" />
        </div>
        <div className="text-2xl font-bold text-foreground">{observation.visibility} km</div>
        <div className="text-[11px] text-muted-foreground font-medium">
          {observation.visibility >= 8 ? 'Clear Line of Sight' : 'Reduced Haze'}
        </div>
      </div>
    </div>
  );
}
