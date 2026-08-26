'use client';

import React, { useState } from 'react';
import { INDIAN_LOCATIONS, getMockWeatherObservation, generateSevenDayForecast } from '@/lib/mockData';
import { useAccessibility } from '@/context/AccessibilityContext';
import { formatTemp, formatSpeed } from '@/lib/units';
import {
  Scale,
  Plus,
  X,
  Droplets,
  Wind,
  Sun,
  Activity,
  CloudRain,
  ShieldAlert,
} from 'lucide-react';
import { LocationInfo } from '@/types';

export default function ComparePage() {
  const { units } = useAccessibility();
  const [selectedCities, setSelectedCities] = useState<LocationInfo[]>([
    INDIAN_LOCATIONS[0], // Chennai
    INDIAN_LOCATIONS[1], // Mumbai
    INDIAN_LOCATIONS[2], // Delhi
  ]);

  const handleAddCity = (loc: LocationInfo) => {
    if (selectedCities.some((c) => c.id === loc.id) || selectedCities.length >= 4) return;
    setSelectedCities([...selectedCities, loc]);
  };

  const handleRemoveCity = (id: string) => {
    if (selectedCities.length <= 2) return;
    setSelectedCities(selectedCities.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2.5">
            <Scale className="w-8 h-8 text-primary" />
            Multi-Location Meteorological Comparison
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Side-by-side comparative telemetry, atmospheric risk profiles, and multi-model forecast divergence
          </p>
        </div>

        {/* Add City Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Add Station:</span>
          <select
            onChange={(e) => {
              const loc = INDIAN_LOCATIONS.find((l) => l.id === e.target.value);
              if (loc) handleAddCity(loc);
            }}
            value=""
            className="px-3 py-1.5 rounded-xl border bg-card text-xs font-semibold focus:outline-none"
          >
            <option value="" disabled>
              + Select City to Add
            </option>
            {INDIAN_LOCATIONS.filter((l) => !selectedCities.some((c) => c.id === l.id)).map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name} ({loc.state})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Cards Grid */}
      <div
        className={`grid grid-cols-1 md:grid-cols-${selectedCities.length} gap-4`}
        style={{
          gridTemplateColumns: `repeat(${selectedCities.length}, minmax(0, 1fr))`,
        }}
      >
        {selectedCities.map((city) => {
          const obs = getMockWeatherObservation(city.id);
          const sevenDay = generateSevenDayForecast(city.id);

          return (
            <div
              key={city.id}
              className="p-5 sm:p-6 rounded-3xl bg-card border shadow-xl flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-xl text-foreground">{city.name}</h3>
                  <p className="text-xs text-muted-foreground">{city.state} • {city.zone}</p>
                </div>
                {selectedCities.length > 2 && (
                  <button
                    onClick={() => handleRemoveCity(city.id)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Remove city"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Main Temp & Condition */}
              <div className="space-y-1 py-2 border-y border-border/50">
                <div className="text-4xl font-extrabold text-foreground">
                  {formatTemp(obs.temperature, units.temp)}
                </div>
                <div className="text-xs font-semibold text-primary">{obs.condition}</div>
                <div className="text-[11px] text-muted-foreground">
                  Feels like {formatTemp(obs.feelsLike, units.temp)}
                </div>
              </div>

              {/* Key Metrics Comparison */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-accent/40">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-sky-400" />
                    Humidity
                  </span>
                  <span className="font-bold text-foreground">{obs.humidity}%</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-accent/40">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-teal-400" />
                    Wind Speed
                  </span>
                  <span className="font-bold text-foreground">
                    {formatSpeed(obs.windSpeed, units.speed)} ({obs.windDirectionText})
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-accent/40">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    UV Index
                  </span>
                  <span className="font-bold text-foreground">{obs.uvIndex}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-accent/40">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    Air Quality (AQI)
                  </span>
                  <span className="font-bold text-foreground">{obs.airQualityIndex}</span>
                </div>
              </div>

              {/* 3-Day Mini Outlook */}
              <div className="space-y-1.5 pt-2 border-t border-border/50">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Upcoming 3 Days
                </div>
                {sevenDay.slice(0, 3).map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">{d.dayName}</span>
                    <span className="font-semibold text-foreground">
                      {formatTemp(d.tempMin, units.temp)} / {formatTemp(d.tempMax, units.temp)}
                    </span>
                    <span className="text-sky-400 font-bold">{d.rainProbability}% Rain</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
