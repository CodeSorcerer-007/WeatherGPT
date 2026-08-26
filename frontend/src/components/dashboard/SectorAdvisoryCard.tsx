'use client';

import React from 'react';
import { usePersona } from '@/context/PersonaContext';
import { useWeather } from '@/context/WeatherContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Wheat,
  ShieldAlert,
  LineChart,
  Anchor,
  Plane,
  Building2,
  User,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export function SectorAdvisoryCard() {
  const { persona, activePersonaInfo } = usePersona();
  const { observation, currentLocation } = useWeather();
  const { t } = useLanguage();

  const getPersonaContent = () => {
    switch (persona) {
      case 'farmer':
        return {
          title: 'Agro-Meteorological Advisory (GKMS Bulletin)',
          badge: 'Agriculture Mode',
          content: `High relative humidity (${observation.humidity}%) and expected heavy rain bursts require immediate postponement of irrigation and foliar spray operations. Ensure paddy bund drainage is clear.`,
          link: '/agriculture',
          linkText: 'Open Full Agriculture Intelligence',
        };
      case 'disaster_manager':
        return {
          title: 'Emergency Disaster Preparedness Alert',
          badge: 'Emergency Cell',
          content: `Low-pressure trough active in Southwest Bay of Bengal. Convective rainfall (120-180mm) with wind squalls up to 55 km/h. Urban flood hotspots in ${currentLocation.name} on high alert.`,
          link: '/alerts',
          linkText: 'Open Disaster Decision Center',
        };
      case 'researcher':
        return {
          title: 'Meteorological Model Diagnostics (WRF vs GFS)',
          badge: 'Research Mode',
          content: `WRF 3km high-resolution run indicates high convective available potential energy (CAPE > 2400 J/kg). Decadal analysis reveals a +64% surge in 100mm/day storm frequencies.`,
          link: '/climate',
          linkText: 'View 50-Year Climate Analytics',
        };
      case 'marine':
        return {
          title: 'Ocean State & Coastal Hazard Advisory',
          badge: 'Fisheries Cell',
          content: `Squally wind (45-55 km/h) and wave height (2.8m - 3.2m). Total ban on small crafts venturing into deep sea off ${currentLocation.name} coast.`,
          link: '/alerts',
          linkText: 'View Marine Hazards',
        };
      case 'aviation':
        return {
          title: 'Aviation Weather Briefing (METAR & TAF)',
          badge: 'Aviation Transit',
          content: `Surface wind: ${observation.windSpeed} km/h from ${observation.windDirectionText}. Visibility: ${observation.visibility} km. Thunderstorm cells within 25 nautical miles of runway approach.`,
          link: '/map',
          linkText: 'Inspect Live Radar Map',
        };
      case 'urban_planner':
        return {
          title: 'Urban Heat Island & Stormwater Load',
          badge: 'Urban Planning',
          content: `Precipitation rate of ~35mm/hr in peak window may exceed municipal stormwater conveyance by 28%. Nocturnal urban heat delta currently +1.8°C.`,
          link: '/climate',
          linkText: 'Analyze Urban Trends',
        };
      default:
        return {
          title: 'Citizen Daily Weather & Commute Summary',
          badge: 'Citizen View',
          content: `Today in ${currentLocation.name}: ${observation.condition} with temperature at ${observation.temperature}°C (Feels like ${observation.feelsLike}°C). Rain probability peaks in the afternoon.`,
          link: '/assistant',
          linkText: 'Ask WeatherGPT Details',
        };
    }
  };

  const info = getPersonaContent();

  return (
    <div className="p-5 rounded-3xl bg-gradient-to-r from-primary/10 via-card to-card border border-primary/20 shadow-lg space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            {info.badge}
          </span>
          <h4 className="font-bold text-sm sm:text-base text-foreground">{info.title}</h4>
        </div>

        <span className="text-xs text-muted-foreground font-medium">
          Personalized for {activePersonaInfo.title}
        </span>
      </div>

      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {info.content}
      </p>

      <div className="pt-2 flex items-center justify-between border-t border-border/50">
        <span className="text-[11px] text-muted-foreground">
          Updated with latest IMD / GFS observations
        </span>

        <Link
          href={info.link}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
        >
          <span>{info.linkText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
