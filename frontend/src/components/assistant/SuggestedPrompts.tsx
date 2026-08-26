'use client';

import React from 'react';
import { usePersona } from '@/context/PersonaContext';
import { useLanguage } from '@/context/LanguageContext';
import { useWeather } from '@/context/WeatherContext';
import { Sparkles } from 'lucide-react';

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
  const { activePersonaInfo } = usePersona();
  const { language } = useLanguage();
  const { currentLocation } = useWeather();

  const getLocalizedPrompts = (): string[] => {
    if (language === 'ta') {
      return [
        `நாளை ${currentLocation.name}-ல் கனமழை பெய்ய வாய்ப்புள்ளதா?`,
        'புயல் எச்சரிக்கை உள்ளதா? நான் என்ன செய்ய வேண்டும்?',
        'இன்று நெல் பயிருக்கு பாசனம் செய்யலாமா?',
        'மீனவர்கள் இன்று கடலுக்கு செல்லலாமா?',
        'கடந்த 10 ஆண்டுகளில் பருவமழை அளவு எவ்வாறு மாறியுள்ளது?',
      ];
    }
    if (language === 'hi') {
      return [
        `क्या कल ${currentLocation.name} में भारी बारिश होगी?`,
        'क्या कोई चक्रवात का खतरा है? मुझे क्या करना चाहिए?',
        'क्या आज फसल में कीटनाशक छिड़काव करना सुरक्षित है?',
        'तापमान बढ़ने का मुख्य कारण क्या है?',
      ];
    }

    // English defaults + Persona customized
    return [
      `Will heavy rain affect ${currentLocation.name} tomorrow?`,
      'Is there any cyclone approaching coastal Tamil Nadu?',
      'Should I irrigate my paddy field today?',
      'What should citizens in low-lying zones do now?',
      'Show rainfall and heatwave trends for the last 10 years',
    ];
  };

  const prompts = getLocalizedPrompts();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground px-1">
        <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
        Suggested Weather Intelligence Inquiries:
      </div>
      <div className="flex flex-wrap gap-2">
        {prompts.map((p, idx) => (
          <button
            key={idx}
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
