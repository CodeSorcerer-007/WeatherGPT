'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWeather } from '@/context/WeatherContext';
import { useLanguage, AVAILABLE_LANGUAGES } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { useAccessibility } from '@/context/AccessibilityContext';
import { DemoModeBadge } from './DemoModeBadge';
import { VoiceSearchModal } from '@/components/assistant/VoiceSearchModal';
import {
  MapPin,
  Search,
  Globe,
  Sun,
  Moon,
  ChevronDown,
  User,
  Wheat,
  ShieldAlert,
  LineChart,
  Anchor,
  Plane,
  Building2,
  Sparkles,
  Volume2,
  Mic,
  Radio,
} from 'lucide-react';
import { INDIAN_LOCATIONS } from '@/lib/mockData';
import { LocationInfo } from '@/types';

export function Header({ onToggleMobileMenu }: { onToggleMobileMenu?: () => void }) {
  const { currentLocation, setCurrentLocation, savedLocations } = useWeather();
  const { language, setLanguage, t } = useLanguage();
  const { persona, setPersona, allPersonas, activePersonaInfo } = usePersona();
  const { theme, toggleTheme, units, toggleTempUnit } = useAccessibility();

  const [isLocationSearchOpen, setIsLocationSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);

  const filteredLocations = INDIAN_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLocation = (loc: LocationInfo) => {
    setCurrentLocation(loc);
    setIsLocationSearchOpen(false);
    setSearchQuery('');
  };

  const getPersonaIcon = (id: string) => {
    switch (id) {
      case 'farmer':
        return <Wheat className="w-3.5 h-3.5" />;
      case 'disaster_manager':
        return <ShieldAlert className="w-3.5 h-3.5" />;
      case 'researcher':
        return <LineChart className="w-3.5 h-3.5" />;
      case 'marine':
        return <Anchor className="w-3.5 h-3.5" />;
      case 'aviation':
        return <Plane className="w-3.5 h-3.5" />;
      case 'urban_planner':
        return <Building2 className="w-3.5 h-3.5" />;
      default:
        return <User className="w-3.5 h-3.5" />;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-card/80 backdrop-blur-xl transition-all">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 gap-3">
          {/* Left: Mobile Brand & Location Selector */}
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-accent/60"
              aria-label="Toggle Menu"
            >
              <Sparkles className="w-5 h-5 text-primary" />
            </button>

            {/* Location Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsLocationSearchOpen(!isLocationSearchOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-accent/30 hover:bg-accent/70 transition-all text-xs font-semibold"
              >
                <MapPin className="w-4 h-4 text-rose-500 animate-bounce" />
                <span className="max-w-[120px] sm:max-w-[180px] truncate">
                  {currentLocation.name}, {currentLocation.state}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>

              {/* Location Search Dropdown Modal */}
              {isLocationSearchOpen && (
                <div className="absolute left-0 mt-2 w-72 sm:w-80 rounded-xl border bg-card/95 backdrop-blur-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border bg-muted/40 mb-2.5">
                    <Search className="w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search city, district, state..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-xs outline-none"
                      autoFocus
                    />
                  </div>

                  <div className="text-[11px] font-semibold text-muted-foreground px-1 mb-1">
                    Popular Meteorological Stations
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-1">
                    {filteredLocations.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => handleSelectLocation(loc)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors text-left ${
                          loc.id === currentLocation.id
                            ? 'bg-primary text-primary-foreground font-semibold'
                            : 'hover:bg-accent/70 text-foreground'
                        }`}
                      >
                        <div>
                          <div className="font-medium">{loc.name}</div>
                          <div className="text-[10px] opacity-70">
                            {loc.state} • {loc.zone}
                          </div>
                        </div>
                        {loc.isSaved && <span className="text-[10px] opacity-60">Saved</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Global Voice Search Button */}
            <button
              type="button"
              onClick={() => setIsVoiceSearchOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary transition-all text-xs font-bold shadow-sm group"
              title="Voice Search in 9 Indian Languages"
            >
              <Mic className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Voice Search</span>
              <span className="hidden md:inline-block px-1.5 py-0.2 rounded-full bg-primary/20 text-[9px] font-extrabold uppercase">
                9 Lang
              </span>
            </button>

            {/* Demo Mode Badge */}
            <DemoModeBadge />

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsPersonaOpen(!isPersonaOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border bg-card hover:bg-accent/60 transition-colors text-xs font-medium"
                title="Change User Persona Mode"
              >
                {getPersonaIcon(persona)}
                <span className="hidden md:inline font-semibold">{activePersonaInfo.title}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>

              {isPersonaOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border bg-card/95 backdrop-blur-xl shadow-2xl p-2 z-50 animate-in fade-in">
                  <div className="text-[11px] font-bold text-muted-foreground px-2 py-1 mb-1">
                    Select User Persona
                  </div>
                  <div className="space-y-1">
                    {allPersonas.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setPersona(p.id);
                          setIsPersonaOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors text-left ${
                          p.id === persona
                            ? 'bg-primary text-primary-foreground font-semibold'
                            : 'hover:bg-accent text-foreground'
                        }`}
                      >
                        {getPersonaIcon(p.id)}
                        <div>
                          <div className="font-medium">{p.title}</div>
                          <div className="text-[10px] opacity-70 line-clamp-1">{p.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border bg-card hover:bg-accent/60 transition-colors text-xs font-medium"
                title="Switch Language"
              >
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span className="uppercase font-bold text-[11px]">{language}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border bg-card/95 backdrop-blur-xl shadow-2xl p-1.5 z-50 animate-in fade-in">
                  <div className="text-[10px] font-bold text-muted-foreground px-2 py-1">
                    Indian Languages
                  </div>
                  <div className="space-y-0.5 max-h-60 overflow-y-auto">
                    {AVAILABLE_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLanguageOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors text-left ${
                          lang.code === language
                            ? 'bg-primary text-primary-foreground font-bold'
                            : 'hover:bg-accent text-foreground'
                        }`}
                      >
                        <span>{lang.label}</span>
                        <span className="font-semibold text-[11px] opacity-80">
                          {lang.nativeLabel}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Unit Toggle (°C / °F) */}
            <button
              onClick={toggleTempUnit}
              className="px-2 py-1 rounded-lg border bg-card hover:bg-accent/60 transition-colors text-xs font-bold"
              title="Toggle °C / °F"
            >
              °{units.temp}
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border bg-card hover:bg-accent/60 transition-colors text-muted-foreground hover:text-foreground"
              title="Toggle Dark/Light Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* Voice Search Modal */}
      <VoiceSearchModal
        isOpen={isVoiceSearchOpen}
        onClose={() => setIsVoiceSearchOpen(false)}
        initialLanguage={language}
      />
    </>
  );
}
