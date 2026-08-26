'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWeather } from '@/context/WeatherContext';
import { useLanguage } from '@/context/LanguageContext';
import { AlertTriangle, ChevronRight, Volume2, ShieldAlert, X } from 'lucide-react';
import { speakText, playEmergencyAlertSound } from '@/lib/speechUtils';

export function EmergencyAlertBanner() {
  const { alerts, emergencyModeActive } = useWeather();
  const { language, t } = useLanguage();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const severeAlert = alerts.find(
    (a) => a.isActive && (a.severity === 'SEVERE' || a.severity === 'EXTREME')
  );

  if (!emergencyModeActive || !severeAlert || isDismissed) {
    return null;
  }

  const handleVoicePlay = () => {
    playEmergencyAlertSound();
    setIsSpeaking(true);
    speakText(
      `${severeAlert.title}. ${severeAlert.description}. ${severeAlert.recommendedActions[0]}`,
      language,
      0.95,
      1.0,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  return (
    <div className="relative bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-lg border-b border-red-500/40">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 animate-pulse-slow">
            <AlertTriangle className="w-4 h-4 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wide uppercase px-1.5 py-0.5 rounded bg-black/30 text-[10px]">
                {severeAlert.severity} {t.warning}
              </span>
              <span className="font-semibold line-clamp-1">{severeAlert.title}</span>
            </div>
            <p className="text-white/90 text-xs line-clamp-1 hidden md:block mt-0.5">
              {severeAlert.expectedPeriod} • {severeAlert.recommendedActions[0]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleVoicePlay}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/20 hover:bg-white/30 transition-colors text-xs font-medium"
            title="Listen to emergency alert audio broadcast"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-amber-300' : ''}`} />
            <span className="hidden sm:inline">Voice Alert</span>
          </button>

          <Link
            href="/alerts"
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white text-red-700 hover:bg-white/90 transition-colors font-bold text-xs shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            {t.whatShouldIDo}
            <ChevronRight className="w-3 h-3" />
          </Link>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors ml-1"
            title="Dismiss temporary banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
