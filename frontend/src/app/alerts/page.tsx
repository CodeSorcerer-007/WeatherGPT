'use client';

import React, { useState } from 'react';
import { useWeather } from '@/context/WeatherContext';
import { useLanguage } from '@/context/LanguageContext';
import { AlertCard } from '@/components/alerts/AlertCard';
import { EmergencyActionGuide } from '@/components/alerts/EmergencyActionGuide';
import { CycloneTracker } from '@/components/alerts/CycloneTracker';
import {
  AlertTriangle,
  ShieldAlert,
  Compass,
  Filter,
  CheckCircle2,
  BellRing,
} from 'lucide-react';
import { AlertCategory } from '@/types';

export default function AlertsPage() {
  const { alerts, emergencyModeActive } = useWeather();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<AlertCategory | 'all'>('all');

  const categories: { id: AlertCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Severe Warnings' },
    { id: 'rain', label: 'Heavy Rain & Thunderstorms' },
    { id: 'cyclone', label: 'Cyclone Hazards' },
    { id: 'flood', label: 'Flash Floods' },
    { id: 'heatwave', label: 'Heatwaves' },
  ];

  const filteredAlerts = alerts.filter(
    (a) => selectedCategory === 'all' || a.category === selectedCategory
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Page Title */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2.5">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            Extreme Weather & Early Warning Alert Center
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Multi-hazard bulletins from IMD, NDMA, and State Emergency Operations Centers
          </p>
        </div>

        {emergencyModeActive && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600 text-white text-xs font-extrabold animate-pulse">
            <ShieldAlert className="w-4 h-4" />
            <span>DISASTER PROTOCOL ACTIVE</span>
          </div>
        )}
      </div>

      {/* Cyclone Live Eye & Landfall Tracker */}
      <CycloneTracker />

      {/* Decision Support: "What Should I Do?" Action Guide */}
      <EmergencyActionGuide />

      {/* Active Bulletins List */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            <BellRing className="w-5 h-5 text-primary" />
            Active Regional Warnings ({filteredAlerts.length})
          </h3>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-card border text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </div>
    </div>
  );
}
