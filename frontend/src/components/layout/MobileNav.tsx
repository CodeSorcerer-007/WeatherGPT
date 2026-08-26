'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useWeather } from '@/context/WeatherContext';
import { CloudSun, Bot, Map as MapIcon, AlertTriangle, Wheat, Settings } from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { emergencyModeActive } = useWeather();

  const navItems = [
    { href: '/', label: 'Overview', icon: CloudSun, exact: true },
    { href: '/assistant', label: 'AI Chat', icon: Bot, highlight: true },
    { href: '/map', label: 'Map', icon: MapIcon },
    {
      href: '/alerts',
      label: 'Alerts',
      icon: AlertTriangle,
      badge: emergencyModeActive ? '!' : undefined,
    },
    { href: '/agriculture', label: 'Agri', icon: Wheat },
    { href: '/settings', label: 'More', icon: Settings },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t shadow-lg px-2 py-1.5 flex items-center justify-around">
      {navItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href) && (item.href === '/' ? pathname === '/' : true);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              isActive
                ? 'text-primary font-bold scale-105'
                : item.highlight
                ? 'text-blue-500 font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 ${
                  isActive
                    ? 'text-primary'
                    : item.highlight
                    ? 'text-blue-500 animate-pulse'
                    : 'text-muted-foreground'
                }`}
              />
              {item.badge && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              )}
            </div>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
