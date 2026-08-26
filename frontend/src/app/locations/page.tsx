'use client';

import React, { useState } from 'react';
import { useWeather } from '@/context/WeatherContext';
import { useAccessibility } from '@/context/AccessibilityContext';
import { formatTemp } from '@/lib/units';
import { INDIAN_LOCATIONS, getMockWeatherObservation } from '@/lib/mockData';
import { LocationInfo } from '@/types';
import { MapPin, Search, Bookmark, BookmarkCheck, ArrowRight, Compass } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LocationsPage() {
  const router = useRouter();
  const { currentLocation, setCurrentLocation, savedLocations, toggleSaveLocation } = useWeather();
  const { units } = useAccessibility();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLocations = INDIAN_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.zone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCity = (loc: LocationInfo) => {
    setCurrentLocation(loc);
    router.push('/dashboard');
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2.5">
          <MapPin className="w-8 h-8 text-rose-500" />
          Location Intelligence & Meteorological Stations
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage saved Indian districts, coastal observatories, and hill stations
        </p>
      </div>

      {/* Search Filter Bar */}
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search across 25+ Indian meteorological stations (e.g., Chennai, Delhi, Kochi, Shimla)..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl border bg-card text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
        />
      </div>

      {/* Grid of Locations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLocations.map((loc) => {
          const isCurrent = loc.id === currentLocation.id;
          const isSaved = savedLocations.some((s) => s.id === loc.id);
          const obs = getMockWeatherObservation(loc.id);

          return (
            <div
              key={loc.id}
              className={`p-5 rounded-3xl border shadow-md flex flex-col justify-between space-y-3 transition-all ${
                isCurrent
                  ? 'bg-primary/10 border-primary shadow-primary/10'
                  : 'bg-card hover:border-primary/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-lg text-foreground">{loc.name}</h3>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {loc.state}, India • {loc.elevation}m ASL
                  </p>
                </div>

                <button
                  onClick={() => toggleSaveLocation(loc)}
                  className={`p-2 rounded-xl border transition-colors ${
                    isSaved
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                      : 'hover:bg-accent text-muted-foreground'
                  }`}
                  title={isSaved ? 'Remove from saved' : 'Save location'}
                >
                  {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between py-2 border-y border-border/50">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {formatTemp(obs.temperature, units.temp)}
                  </div>
                  <div className="text-xs text-primary font-medium">{obs.condition}</div>
                </div>

                <div className="text-right text-[11px] text-muted-foreground space-y-0.5">
                  <div>Humidity: <b>{obs.humidity}%</b></div>
                  <div>Wind: <b>{obs.windSpeed} km/h</b></div>
                </div>
              </div>

              <button
                onClick={() => handleSelectCity(loc)}
                className="w-full py-2 rounded-xl bg-accent hover:bg-primary hover:text-primary-foreground text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>View Full Telemetry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
