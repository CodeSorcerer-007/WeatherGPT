'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

interface TimeScrubberProps {
  timeOffset: number; // in hours: -6 to 48
  setTimeOffset: React.Dispatch<React.SetStateAction<number>>;
}

const TIME_STEPS = [
  { offset: -6, label: '-6h (Past)' },
  { offset: -3, label: '-3h' },
  { offset: 0, label: 'LIVE (Now)' },
  { offset: 6, label: '+6h' },
  { offset: 12, label: '+12h' },
  { offset: 24, label: '+24h' },
  { offset: 48, label: '+48h (Forecast)' },
];

export function TimeScrubber({ timeOffset, setTimeOffset }: TimeScrubberProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeOffset((prev) => {
          const currentIndex = TIME_STEPS.findIndex((s) => s.offset === prev);
          const nextIndex = (currentIndex + 1) % TIME_STEPS.length;
          return TIME_STEPS[nextIndex].offset;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, setTimeOffset]);

  const activeStep = TIME_STEPS.find((s) => s.offset === timeOffset) || TIME_STEPS[2];

  return (
    <div className="p-3.5 rounded-2xl bg-card/90 backdrop-blur-xl border shadow-2xl space-y-2.5 max-w-lg w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center shadow-md transition-transform active:scale-95"
            title={isPlaying ? 'Pause Radar Loop' : 'Play Animated Forecast Loop'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>
          <div>
            <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-primary" />
              Radar / Numerical Model Time Horizon
            </div>
            <div className="text-[11px] text-primary font-semibold">
              {activeStep.label} {timeOffset === 0 ? '(Real-Time Station Feed)' : '(WRF / GFS Forecast Model)'}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setIsPlaying(false);
            setTimeOffset(0);
          }}
          className="p-1.5 rounded-lg border hover:bg-accent text-muted-foreground text-xs flex items-center gap-1"
          title="Reset to live observation"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Live</span>
        </button>
      </div>

      {/* Step Buttons */}
      <div className="flex items-center justify-between gap-1 pt-1">
        {TIME_STEPS.map((step) => (
          <button
            key={step.offset}
            onClick={() => {
              setIsPlaying(false);
              setTimeOffset(step.offset);
            }}
            className={`flex-1 py-1 px-1 rounded-lg text-[10px] sm:text-xs font-semibold transition-all text-center ${
              step.offset === timeOffset
                ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                : 'bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            {step.label.split(' ')[0]}
          </button>
        ))}
      </div>
    </div>
  );
}
