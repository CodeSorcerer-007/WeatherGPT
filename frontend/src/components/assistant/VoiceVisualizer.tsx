'use client';

import React from 'react';
import { Mic, MicOff, Volume2, Sparkles, Cpu } from 'lucide-react';
import { LanguageCode } from '@/types';
import { AVAILABLE_LANGUAGES } from '@/context/LanguageContext';

interface VoiceVisualizerProps {
  isListening: boolean;
  onStop: () => void;
  transcript?: string;
  language?: LanguageCode;
  engine?: 'whisper' | 'webspeech';
  volumeLevel?: number;
}

export function VoiceVisualizer({
  isListening,
  onStop,
  transcript,
  language = 'en',
  engine = 'whisper',
  volumeLevel = 50,
}: VoiceVisualizerProps) {
  if (!isListening) return null;

  const currentLangObj = AVAILABLE_LANGUAGES.find((l) => l.code === language);

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600/25 via-indigo-600/25 to-sky-600/25 border border-primary/40 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in zoom-in-95">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Animated wave bars driven by volume level */}
        <div className="flex items-center gap-1 h-8 shrink-0">
          {[0.5, 0.9, 1.0, 0.7, 1.0, 0.6, 0.8, 0.4].map((mult, i) => {
            const height = Math.max(8, Math.min(32, Math.round((volumeLevel || 45) * mult * 0.5)));
            return (
              <span
                key={i}
                style={{ height: `${height}px` }}
                className="w-1.5 bg-gradient-to-t from-blue-500 to-sky-300 rounded-full transition-all duration-75"
              />
            );
          })}
        </div>

        <div className="text-left flex-1 min-w-0">
          <div className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="text-primary">Listening in {currentLangObj?.label}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary/20 text-primary font-bold">
              {currentLangObj?.nativeLabel}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate max-w-md">
            {transcript ? `"${transcript}"` : 'Speak naturally in your mother tongue...'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[10px] text-muted-foreground hidden sm:flex items-center gap-1">
          <Cpu className="w-3 h-3 text-emerald-400" />
          <span>{engine === 'whisper' ? 'Whisper AI' : 'Web Speech'}</span>
        </span>

        <button
          type="button"
          onClick={onStop}
          className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 active:scale-95"
        >
          <MicOff className="w-3.5 h-3.5" />
          <span>Done / Send</span>
        </button>
      </div>
    </div>
  );
}
