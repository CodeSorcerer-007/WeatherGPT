'use client';

import React, { useState } from 'react';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useLanguage, AVAILABLE_LANGUAGES } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { useWeather } from '@/context/WeatherContext';
import {
  Settings,
  Globe,
  Sliders,
  Eye,
  Type,
  Volume2,
  Database,
  Download,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function SettingsPage() {
  const {
    theme,
    setTheme,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
    fontSize,
    setFontSize,
    units,
    setUnits,
  } = useAccessibility();

  const { language, setLanguage } = useLanguage();
  const { persona, setPersona, allPersonas } = usePersona();
  const { demoMode, setDemoMode } = useWeather();
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2.5">
          <Settings className="w-8 h-8 text-primary" />
          Settings & Accessibility Preferences
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Tailor measurement units, Indian language support, high-contrast modes, and persona workflows
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-card border shadow-xl space-y-6">
        {/* 1. Language Configuration */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-blue-500" />
            Active Regional Language:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {AVAILABLE_LANGUAGES.map((lang) => (
              <button
                type="button"
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-3 rounded-2xl border text-xs font-semibold text-left transition-all ${
                  language === lang.code
                    ? 'bg-primary text-primary-foreground shadow-sm scale-[1.02]'
                    : 'bg-card text-foreground hover:bg-accent'
                }`}
              >
                <div>{lang.label}</div>
                <div className="text-[11px] opacity-80">{lang.nativeLabel}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Measurement Units */}
        <div className="space-y-3 pt-2 border-t">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-emerald-500" />
            Meteorological Measurement Units:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Temperature */}
            <div className="p-3.5 rounded-2xl bg-muted/40 border space-y-1.5">
              <span className="text-xs text-muted-foreground font-semibold">Temperature:</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setUnits((u) => ({ ...u, temp: 'C' }))}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold ${
                    units.temp === 'C' ? 'bg-primary text-white' : 'bg-card border text-muted-foreground'
                  }`}
                >
                  Celsius (°C)
                </button>
                <button
                  type="button"
                  onClick={() => setUnits((u) => ({ ...u, temp: 'F' }))}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold ${
                    units.temp === 'F' ? 'bg-primary text-white' : 'bg-card border text-muted-foreground'
                  }`}
                >
                  Fahrenheit (°F)
                </button>
              </div>
            </div>

            {/* Wind Speed */}
            <div className="p-3.5 rounded-2xl bg-muted/40 border space-y-1.5">
              <span className="text-xs text-muted-foreground font-semibold">Wind Speed:</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setUnits((u) => ({ ...u, speed: 'kmh' }))}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold ${
                    units.speed === 'kmh' ? 'bg-primary text-white' : 'bg-card border text-muted-foreground'
                  }`}
                >
                  km/h
                </button>
                <button
                  type="button"
                  onClick={() => setUnits((u) => ({ ...u, speed: 'mph' }))}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold ${
                    units.speed === 'mph' ? 'bg-primary text-white' : 'bg-card border text-muted-foreground'
                  }`}
                >
                  mph
                </button>
              </div>
            </div>

            {/* Precipitation */}
            <div className="p-3.5 rounded-2xl bg-muted/40 border space-y-1.5">
              <span className="text-xs text-muted-foreground font-semibold">Precipitation:</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setUnits((u) => ({ ...u, rain: 'mm' }))}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold ${
                    units.rain === 'mm' ? 'bg-primary text-white' : 'bg-card border text-muted-foreground'
                  }`}
                >
                  Millimeters (mm)
                </button>
                <button
                  type="button"
                  onClick={() => setUnits((u) => ({ ...u, rain: 'in' }))}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold ${
                    units.rain === 'in' ? 'bg-primary text-white' : 'bg-card border text-muted-foreground'
                  }`}
                >
                  Inches (in)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Accessibility Controls */}
        <div className="space-y-3 pt-2 border-t">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-purple-400" />
            Visual & Accessibility Enhancements:
          </label>

          <div className="space-y-2">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-accent/30 border text-xs">
              <div>
                <div className="font-bold text-foreground">Theme Mode</div>
                <div className="text-[11px] text-muted-foreground">Toggle Dark or Light meteorological glass palette</div>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`px-3 py-1 rounded-lg font-bold ${
                    theme === 'dark' ? 'bg-primary text-white' : 'bg-card border text-muted-foreground'
                  }`}
                >
                  Dark
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`px-3 py-1 rounded-lg font-bold ${
                    theme === 'light' ? 'bg-primary text-white' : 'bg-card border text-muted-foreground'
                  }`}
                >
                  Light
                </button>
              </div>
            </div>

            {/* High Contrast */}
            <label className="flex items-center justify-between p-3 rounded-2xl bg-accent/30 border text-xs cursor-pointer">
              <div>
                <div className="font-bold text-foreground">High Contrast Mode</div>
                <div className="text-[11px] text-muted-foreground">High contrast borders and yellow emphasis for low-vision users</div>
              </div>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="w-4 h-4 text-primary rounded accent-primary cursor-pointer"
              />
            </label>

            {/* Text Scaling */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-accent/30 border text-xs">
              <div>
                <div className="font-bold text-foreground">Font Size Scale</div>
                <div className="text-[11px] text-muted-foreground">Enlarge text for mobile & elderly accessibility</div>
              </div>
              <div className="flex gap-1">
                {(['normal', 'large', 'extra-large'] as const).map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`px-2.5 py-1 rounded-lg font-semibold capitalize ${
                      fontSize === size ? 'bg-primary text-white' : 'bg-card border text-muted-foreground'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Data Mode & Simulation Toggle */}
        <div className="space-y-3 pt-2 border-t">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-4 h-4 text-amber-500" />
            Meteorological Data Source Mode:
          </label>
          <div className="p-4 rounded-2xl bg-accent/40 border flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-foreground">
                {demoMode ? 'Demo Mode (Synthetic SIH 2026 Test Dataset)' : 'Live Meteorological APIs (Open-Meteo & IMD)'}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {demoMode
                  ? 'Guarantees reliable demonstration without API rate limit exhaustion.'
                  : 'Queries live internet meteorological endpoints.'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDemoMode(!demoMode)}
              className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm"
            >
              {demoMode ? 'Switch to Live API' : 'Switch to Demo Data'}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4" /> : null}
          <span>{isSaved ? 'Settings Saved Successfully!' : 'Save System Settings'}</span>
        </button>
      </div>
    </div>
  );
}
