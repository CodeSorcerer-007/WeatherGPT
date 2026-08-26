'use client';

import React, { useState } from 'react';
import { WeatherAlert, RiskLevel } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import {
  AlertTriangle,
  Clock,
  MapPin,
  ShieldAlert,
  CheckCircle2,
  Volume2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { speakText, playEmergencyAlertSound } from '@/lib/speechUtils';

interface AlertCardProps {
  alert: WeatherAlert;
}

export function AlertCard({ alert }: AlertCardProps) {
  const { language, t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const getSeverityStyle = (sev: RiskLevel) => {
    switch (sev) {
      case 'EXTREME':
        return {
          badge: 'bg-purple-600 text-white animate-pulse',
          border: 'border-purple-500/50',
          bg: 'bg-gradient-to-br from-purple-950/40 via-card to-card',
        };
      case 'SEVERE':
        return {
          badge: 'bg-red-600 text-white animate-pulse',
          border: 'border-red-500/50',
          bg: 'bg-gradient-to-br from-red-950/40 via-card to-card',
        };
      case 'HIGH':
        return {
          badge: 'bg-orange-600 text-white',
          border: 'border-orange-500/50',
          bg: 'bg-gradient-to-br from-orange-950/40 via-card to-card',
        };
      case 'MODERATE':
        return {
          badge: 'bg-amber-500 text-black font-bold',
          border: 'border-amber-500/40',
          bg: 'bg-card',
        };
      default:
        return {
          badge: 'bg-emerald-600 text-white',
          border: 'border-emerald-500/40',
          bg: 'bg-card',
        };
    }
  };

  const style = getSeverityStyle(alert.severity);

  const handleSpeak = () => {
    playEmergencyAlertSound();
    setIsSpeaking(true);
    speakText(
      `${alert.title}. ${alert.description}. Recommended actions: ${alert.recommendedActions.join('. ')}`,
      language,
      0.95,
      1.0,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  return (
    <div className={`p-5 sm:p-6 rounded-3xl border shadow-xl ${style.border} ${style.bg} space-y-4`}>
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase ${style.badge}`}>
            {alert.severity} ALERT
          </span>
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-primary" />
            {alert.expectedPeriod}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSpeak}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border bg-card hover:bg-accent text-xs font-semibold transition-colors"
            title="Listen to official alert audio broadcast"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-rose-500 animate-bounce' : 'text-primary'}`} />
            <span>Voice Broadcast</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl border hover:bg-accent text-muted-foreground transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Title & Description */}
      <div>
        <h3 className="font-extrabold text-base sm:text-xl text-foreground">{alert.title}</h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
          <MapPin className="w-3.5 h-3.5 text-rose-500" />
          <span>Affected Region: <b>{alert.locationName}</b> ({alert.affectedAreas.join(', ')})</span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">{alert.description}</p>

      {/* Expanded Actions & Risks */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/50">
          {/* Potential Hazards */}
          <div className="p-4 rounded-2xl bg-muted/40 border space-y-2">
            <div className="font-bold text-xs uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Identified Threat Vectors
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {alert.potentialRisks.map((risk, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Preparedness Checklist */}
          <div className="p-4 rounded-2xl bg-card border space-y-2">
            <div className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
              Mandatory Safety Protocols
            </div>
            <ul className="space-y-1.5 text-xs text-foreground font-medium">
              {alert.recommendedActions.map((act, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Footer Provenance */}
      <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] text-muted-foreground gap-2">
        <span>Issuing Agency: <b>{alert.source}</b></span>
        <span className="font-semibold px-2 py-0.5 rounded bg-accent/60 text-foreground">
          Confidence: {alert.confidence}
        </span>
      </div>
    </div>
  );
}
