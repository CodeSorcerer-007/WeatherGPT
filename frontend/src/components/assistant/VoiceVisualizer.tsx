'use client';

import React from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceVisualizerProps {
  isListening: boolean;
  onStop: () => void;
  transcript?: string;
}

export function VoiceVisualizer({ isListening, onStop, transcript }: VoiceVisualizerProps) {
  if (!isListening) return null;

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-sky-600/20 border border-blue-500/30 backdrop-blur-md shadow-xl flex flex-col items-center justify-center gap-3 animate-in fade-in zoom-in-95">
      <div className="flex items-center gap-3">
        {/* Animated wave bars */}
        <div className="flex items-center gap-1 h-8">
          <span className="w-1.5 h-4 bg-blue-500 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
          <span className="w-1.5 h-8 bg-sky-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.1s]" />
          <span className="w-1.5 h-6 bg-indigo-500 rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.2s]" />
          <span className="w-1.5 h-10 bg-blue-400 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.3s]" />
          <span className="w-1.5 h-5 bg-sky-500 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.4s]" />
          <span className="w-1.5 h-7 bg-indigo-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite_0.5s]" />
        </div>

        <div className="text-center">
          <div className="text-sm font-bold text-blue-400 animate-pulse flex items-center gap-1.5">
            <Mic className="w-4 h-4 text-rose-400 animate-bounce" />
            Listening to your voice...
          </div>
          <p className="text-xs text-muted-foreground">
            {transcript ? `"${transcript}"` : 'Speak naturally in English or any Indian language'}
          </p>
        </div>

        <button
          onClick={onStop}
          className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-md transition-colors flex items-center gap-1.5"
        >
          <MicOff className="w-3.5 h-3.5" />
          Done
        </button>
      </div>
    </div>
  );
}
