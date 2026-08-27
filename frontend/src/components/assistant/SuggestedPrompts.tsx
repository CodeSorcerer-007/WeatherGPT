'use client';

import React from 'react';
import { usePersona } from '@/context/PersonaContext';
import { useLanguage } from '@/context/LanguageContext';
import { useWeather } from '@/context/WeatherContext';
import { SAMPLE_VOICE_PROMPTS } from '@/lib/speechUtils';
import { Sparkles, Mic } from 'lucide-react';

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
  const { activePersonaInfo } = usePersona();
  const { language, t } = useLanguage();
  const { currentLocation } = useWeather();

  const prompts =
    SAMPLE_VOICE_PROMPTS[language] || [
      `Will heavy rain affect ${currentLocation.name} tomorrow?`,
      'Is there any cyclone approaching the coast?',
      'Should I irrigate my paddy field today?',
      'What should citizens in low-lying zones do now?',
      'Show rainfall and heatwave trends for the last 10 years',
    ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground px-1">
        <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
        <span>{t.suggestedVoicePrompts || 'Suggested Meteorological Inquiries:'}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {prompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(p)}
            className="text-xs px-3 py-1.5 rounded-full border bg-card/60 hover:bg-primary hover:text-primary-foreground transition-all text-left shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
