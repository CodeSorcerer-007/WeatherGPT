'use client';

import React, { useState } from 'react';
import { useWeather } from '@/context/WeatherContext';
import { useLanguage, AVAILABLE_LANGUAGES } from '@/context/LanguageContext';
import {
  Bell,
  BellRing,
  CheckCircle2,
  ShieldAlert,
  Smartphone,
  Mail,
  Sliders,
  Send,
} from 'lucide-react';

export default function NotificationsPage() {
  const { currentLocation } = useWeather();
  const { language } = useLanguage();

  const [subscribedCategories, setSubscribedCategories] = useState({
    cyclone: true,
    rain: true,
    flood: true,
    heatwave: true,
    agriculture: true,
  });

  const [minSeverity, setMinSeverity] = useState<'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE'>('HIGH');
  const [notificationChannel, setNotificationChannel] = useState<'browser' | 'sms' | 'email'>('browser');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleToggle = (key: keyof typeof subscribedCategories) => {
    setSubscribedCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2.5">
          <BellRing className="w-8 h-8 text-primary" />
          Smart Early Warning Alert Subscriptions
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Configure real-time push dispatches, SMS advisories, and agricultural weather alerts
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-3xl bg-card border shadow-xl space-y-6">
        {/* Active Location Scope */}
        <div className="p-4 rounded-2xl bg-muted/40 border space-y-1">
          <div className="text-xs text-muted-foreground font-semibold">Active Geolocation Scope:</div>
          <div className="text-sm font-bold text-foreground">
            {currentLocation.name}, {currentLocation.state} (District Level IMD Bulletins)
          </div>
        </div>

        {/* Hazard Alert Category Toggles */}
        <div className="space-y-3">
          <div className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
            Select Weather Hazard Triggers:
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between p-3 rounded-2xl border bg-accent/30 hover:bg-accent/60 cursor-pointer text-xs font-semibold transition-colors">
              <div>
                <div className="text-foreground font-bold">Cyclone & Deep Depression Warnings</div>
                <div className="text-[11px] text-muted-foreground">Landfall tracks and coastal storm surge advisories</div>
              </div>
              <input
                type="checkbox"
                checked={subscribedCategories.cyclone}
                onChange={() => handleToggle('cyclone')}
                className="w-4 h-4 text-primary rounded accent-primary cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl border bg-accent/30 hover:bg-accent/60 cursor-pointer text-xs font-semibold transition-colors">
              <div>
                <div className="text-foreground font-bold">Heavy Rainfall & Flash Flood Inundation</div>
                <div className="text-[11px] text-muted-foreground">Rain rate &gt; 50mm/3hr and urban waterlogging index</div>
              </div>
              <input
                type="checkbox"
                checked={subscribedCategories.rain}
                onChange={() => handleToggle('rain')}
                className="w-4 h-4 text-primary rounded accent-primary cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl border bg-accent/30 hover:bg-accent/60 cursor-pointer text-xs font-semibold transition-colors">
              <div>
                <div className="text-foreground font-bold">Severe Heatwave & High UV Exposure</div>
                <div className="text-[11px] text-muted-foreground">Apparent temperature &gt; 42°C and thermal stress alerts</div>
              </div>
              <input
                type="checkbox"
                checked={subscribedCategories.heatwave}
                onChange={() => handleToggle('heatwave')}
                className="w-4 h-4 text-primary rounded accent-primary cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl border bg-accent/30 hover:bg-accent/60 cursor-pointer text-xs font-semibold transition-colors">
              <div>
                <div className="text-foreground font-bold">Gramin Krishi Mausam Crop Advisories</div>
                <div className="text-[11px] text-muted-foreground">Irrigation and pesticide spraying window notifications</div>
              </div>
              <input
                type="checkbox"
                checked={subscribedCategories.agriculture}
                onChange={() => handleToggle('agriculture')}
                className="w-4 h-4 text-primary rounded accent-primary cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Minimum Severity Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Minimum Severity Threshold:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['LOW', 'MODERATE', 'HIGH', 'SEVERE'] as const).map((sev) => (
              <button
                type="button"
                key={sev}
                onClick={() => setMinSeverity(sev)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  minSeverity === sev
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-card text-muted-foreground hover:bg-accent'
                }`}
              >
                {sev}+
              </button>
            ))}
          </div>
        </div>

        {/* Dispatch Channel */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Delivery Channel:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setNotificationChannel('browser')}
              className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                notificationChannel === 'browser'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:bg-accent'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Browser Push</span>
            </button>

            <button
              type="button"
              onClick={() => setNotificationChannel('sms')}
              className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                notificationChannel === 'sms'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:bg-accent'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Rural SMS</span>
            </button>

            <button
              type="button"
              onClick={() => setNotificationChannel('email')}
              className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                notificationChannel === 'email'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:bg-accent'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email Digest</span>
            </button>
          </div>
        </div>

        {notificationChannel === 'sms' && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Mobile Phone Number (India +91):</label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border bg-background text-xs focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <SaveIcon className="w-4 h-4" />}
          <span>{isSaved ? 'Preferences Saved Successfully!' : 'Save Notification Preferences'}</span>
        </button>
      </form>
    </div>
  );
}

function SaveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
