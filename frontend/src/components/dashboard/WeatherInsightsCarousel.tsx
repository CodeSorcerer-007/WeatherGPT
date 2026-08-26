'use client';

import React from 'react';
import { useWeather } from '@/context/WeatherContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  CloudRain,
  Sun,
  Car,
  Wheat,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export function WeatherInsightsCarousel() {
  const { observation, currentLocation, alerts } = useWeather();
  const { t } = useLanguage();

  const insights = [
    {
      title: 'Rain & Squall Alert',
      subtitle: 'Heavy rain probable between 2 PM and 7 PM',
      risk: 'HIGH',
      icon: CloudRain,
      color: 'from-blue-600/20 to-sky-600/20 border-blue-500/30 text-blue-400',
      action: 'Avoid low-lying subways during afternoon peak hours.',
    },
    {
      title: 'Agricultural Advisory',
      subtitle: 'Avoid pesticide and herbicide spraying today',
      risk: 'HIGH',
      icon: Wheat,
      color: 'from-emerald-600/20 to-teal-600/20 border-emerald-500/30 text-emerald-400',
      action: 'Wind gusts (38 km/h) & rain wash-off will waste chemical inputs.',
    },
    {
      title: 'Urban Inundation Index',
      subtitle: 'Moderate-to-severe waterlogging risk in lowlands',
      risk: 'SEVERE',
      icon: ShieldAlert,
      color: 'from-red-600/20 to-rose-600/20 border-red-500/30 text-red-400',
      action: 'Monitor Adyar/Cooum canal levels and avoid subway dips.',
    },
    {
      title: 'Commute & Travel',
      subtitle: 'Visibility reduced to 6.5 km during rain showers',
      risk: 'MODERATE',
      icon: Car,
      color: 'from-amber-600/20 to-orange-600/20 border-amber-500/30 text-amber-400',
      action: 'Allow +20 mins buffer for arterial transit and airport routes.',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Actionable Weather Insights
        </h3>
        <span className="text-xs font-semibold text-muted-foreground">
          Dynamic AI Synthesis
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {insights.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-3xl bg-gradient-to-br ${card.color} border shadow-md flex flex-col justify-between space-y-3 hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-2xl bg-card border shadow-sm">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-card border shadow-xs">
                  {card.risk}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-foreground">{card.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {card.subtitle}
                </p>
              </div>

              <div className="pt-2 border-t border-border/40 text-[11px] font-medium text-foreground flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>{card.action}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
