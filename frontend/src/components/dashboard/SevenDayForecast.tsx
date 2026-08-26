'use client';

import React from 'react';
import { useWeather } from '@/context/WeatherContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAccessibility } from '@/context/AccessibilityContext';
import { formatTemp } from '@/lib/units';
import {
  Calendar,
  CloudRain,
  CloudLightning,
  Sun,
  CloudSun,
  Wind,
  Droplets,
} from 'lucide-react';

export function SevenDayForecast() {
  const { dailyForecast } = useWeather();
  const { t } = useLanguage();
  const { units } = useAccessibility();

  const getConditionIcon = (iconName: string) => {
    switch (iconName) {
      case 'CloudLightning':
        return <CloudLightning className="w-5 h-5 text-purple-400" />;
      case 'CloudRain':
        return <CloudRain className="w-5 h-5 text-sky-400" />;
      case 'CloudSun':
        return <CloudSun className="w-5 h-5 text-amber-300" />;
      default:
        return <Sun className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="rounded-3xl bg-card border shadow-lg p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            {t.sevenDayForecast}
          </h3>
          <p className="text-xs text-muted-foreground">
            Multi-model ensemble forecast (IMD & GFS)
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {dailyForecast.map((day, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-accent/30 border hover:bg-accent/60 transition-all gap-2"
          >
            {/* Day & Date */}
            <div className="w-28 shrink-0">
              <div className="font-bold text-xs sm:text-sm text-foreground">{day.dayName}</div>
              <div className="text-[11px] text-muted-foreground">{day.date}</div>
            </div>

            {/* Condition Icon & Text */}
            <div className="flex items-center gap-2.5 flex-1 min-w-[140px]">
              {getConditionIcon(day.icon)}
              <div>
                <div className="text-xs font-semibold text-foreground">{day.condition}</div>
                {day.rainProbability > 0 && (
                  <div className="text-[11px] text-sky-400 font-medium flex items-center gap-1">
                    <CloudRain className="w-3 h-3" />
                    {day.rainProbability}% Rain
                    {day.rainfallAmount > 0 ? ` (~${day.rainfallAmount}mm)` : ''}
                  </div>
                )}
              </div>
            </div>

            {/* Min/Max Temperature Visual Bar */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-muted-foreground font-medium w-9 text-right">
                {formatTemp(day.tempMin, units.temp)}
              </span>

              {/* Temperature gradient range bar */}
              <div className="w-24 sm:w-32 h-2 rounded-full bg-muted overflow-hidden relative">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 via-amber-400 to-rose-500"
                  style={{
                    marginLeft: `${Math.max(0, (day.tempMin - 20) * 3)}%`,
                    width: `${Math.min(100, (day.tempMax - day.tempMin) * 7 + 25)}%`,
                  }}
                />
              </div>

              <span className="text-xs font-bold text-foreground w-9">
                {formatTemp(day.tempMax, units.temp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
