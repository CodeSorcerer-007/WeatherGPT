'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { useWeather } from '@/context/WeatherContext';
import {
  CloudSun,
  Bot,
  Compass,
  MapPin,
  Map as MapIcon,
  AlertTriangle,
  Wheat,
  TrendingUp,
  Scale,
  Bell,
  Settings,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { activePersonaInfo } = usePersona();
  const { emergencyModeActive, currentLocation } = useWeather();

  const navItems = [
    { href: '/', label: 'Overview', icon: Compass, exact: true },
    { href: '/assistant', label: 'Ask WeatherGPT', icon: Bot, highlight: true },
    { href: '/dashboard', label: 'Meteorological Dashboard', icon: CloudSun },
    { href: '/map', label: 'GIS Weather Map', icon: MapIcon },
    {
      href: '/alerts',
      label: 'Alert Center & Safety',
      icon: AlertTriangle,
      badge: emergencyModeActive ? 'SEVERE' : undefined,
    },
    { href: '/agriculture', label: 'Agriculture Mode', icon: Wheat },
    { href: '/climate', label: 'Climate & Trends', icon: TrendingUp },
    { href: '/compare', label: 'Compare Cities', icon: Scale },
    { href: '/locations', label: 'Saved Locations', icon: MapPin },
    { href: '/notifications', label: 'Alert Subscriptions', icon: Bell },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r bg-card/60 backdrop-blur-xl shrink-0 h-screen sticky top-0 overflow-y-auto">
      {/* Brand Header */}
      <div className="p-5 border-b flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-500 to-sky-400 bg-clip-text text-transparent">
                WeatherGPT
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                AI
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground line-clamp-1">
              {currentLocation.name}, {currentLocation.state}
            </p>
          </div>
        </Link>
      </div>

      {/* Persona Pill */}
      <div className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Persona Mode
          </span>
          <span className="font-semibold text-primary capitalize">
            {activePersonaInfo.title}
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="p-3 space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) && (item.href === '/' ? pathname === '/' : true);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                  : item.highlight
                  ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-500 dark:text-blue-400 hover:bg-blue-500/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? 'text-primary-foreground'
                      : item.highlight
                      ? 'text-blue-500 animate-pulse'
                      : 'text-muted-foreground'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded-full bg-red-500 text-white animate-pulse">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t space-y-1 bg-muted/20">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            pathname === '/settings'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{t.settings}</span>
        </Link>

        {/* SIH Tag */}
        <div className="px-3 py-2 rounded-lg bg-card/60 border text-[11px] text-muted-foreground flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            SIH 2026 Edition
          </span>
          <span className="text-[10px] font-mono opacity-70">v2.4.0</span>
        </div>
      </div>
    </aside>
  );
}
