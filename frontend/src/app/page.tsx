'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWeather } from '@/context/WeatherContext';
import { useLanguage } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { CurrentConditionsCard } from '@/components/dashboard/CurrentConditionsCard';
import { WeatherInsightsCarousel } from '@/components/dashboard/WeatherInsightsCarousel';
import { SectorAdvisoryCard } from '@/components/dashboard/SectorAdvisoryCard';
import { VoiceSearchModal } from '@/components/assistant/VoiceSearchModal';
import { SAMPLE_VOICE_PROMPTS } from '@/lib/speechUtils';
import {
  Bot,
  Send,
  Mic,
  Sparkles,
  CloudSun,
  Map as MapIcon,
  AlertTriangle,
  Wheat,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Zap,
  Layers,
  Globe,
  Radio,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { currentLocation, emergencyModeActive } = useWeather();
  const { t, language } = useLanguage();
  const { activePersonaInfo } = usePersona();

  const [promptInput, setPromptInput] = useState('');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    router.push(`/assistant?q=${encodeURIComponent(promptInput.trim())}`);
  };

  const samplePrompts =
    SAMPLE_VOICE_PROMPTS[language] || [
      `Will it rain in ${currentLocation.name} tomorrow?`,
      'Is there any cyclone approaching Tamil Nadu?',
      'Should I irrigate my paddy field today?',
      'What should I do during heavy waterlogging?',
      'Show rainfall and heatwave trends for last 10 years',
    ];

  const quickFeatures = [
    {
      href: '/dashboard',
      title: 'Current Weather & Forecast',
      desc: '24-hour hourly curves & 7-day multi-model forecast.',
      icon: CloudSun,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    },
    {
      href: '/assistant',
      title: 'AI Conversational Assistant',
      desc: 'Grounded intelligence with Whisper voice in 9 Indian languages.',
      icon: Bot,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      href: '/map',
      title: 'Interactive GIS Weather Map',
      desc: 'Radar overlays, wind streamlines & cyclone trajectories.',
      icon: MapIcon,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    },
    {
      href: '/alerts',
      title: 'Emergency Decision Center',
      desc: 'Severe alert classifications & role-tailored safety SOPs.',
      icon: AlertTriangle,
      color: 'text-red-400 bg-red-500/10 border-red-500/20',
      badge: emergencyModeActive ? 'ACTIVE ALERT' : undefined,
    },
    {
      href: '/agriculture',
      title: 'Agriculture Intelligence',
      desc: 'Crop water advice, spraying window & pest forecasts.',
      icon: Wheat,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      href: '/climate',
      title: '50-Year Climate Trends',
      desc: 'Historical anomalies & extreme downpour analysis.',
      icon: TrendingUp,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-950/40 via-card to-card border p-6 sm:p-10 shadow-2xl text-center space-y-5">
        {/* Glow behind title */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Smart India Hackathon 2026 • AI Meteorological Intelligence
        </div>

        <div className="space-y-2 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
            Weather<span className="bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 bg-clip-text text-transparent">GPT</span>
          </h1>
          <p className="text-base sm:text-xl font-semibold text-foreground/90">
            {t.tagline}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
            {t.subTagline} Grounded in real IMD, GFS, and WRF models with zero AI hallucination.
          </p>
        </div>

        {/* Central Natural Language / Speech Prompt Box */}
        <div className="max-w-2xl mx-auto space-y-2">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center shadow-xl"
          >
            <div className="relative w-full flex items-center">
              <Bot className="absolute left-4 w-5 h-5 text-primary" />
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder={t.askPlaceholder}
                className="w-full pl-12 pr-32 py-4 rounded-2xl border bg-card/90 backdrop-blur-xl text-sm sm:text-base focus:ring-2 focus:ring-primary focus:outline-none shadow-2xl"
              />
              <div className="absolute right-2 flex items-center gap-1.5">
                {/* Voice Query Microphone Button */}
                <button
                  type="button"
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="p-2.5 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary transition-all shadow-sm flex items-center gap-1"
                  title="Speak in your language (Voice Query)"
                >
                  <Mic className="w-4 h-4 text-blue-500 animate-pulse" />
                  <span className="text-[11px] font-bold hidden sm:inline">Voice</span>
                </button>

                {/* Submit Text Button */}
                <button
                  type="submit"
                  className="px-3.5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Ask</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>

          {/* 9 Languages Voice Badge */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground pt-1">
            <button
              type="button"
              onClick={() => setIsVoiceModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/40 border hover:bg-accent/70 transition-colors text-primary font-medium cursor-pointer"
            >
              <Radio className="w-3 h-3 text-rose-500 animate-ping" />
              <span>Voice Support in 9 Indian Languages (Whisper Neural AI)</span>
            </button>
          </div>
        </div>

        {/* Sample Prompt Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 max-w-3xl mx-auto">
          {samplePrompts.slice(0, 4).map((prompt, i) => (
            <button
              key={i}
              onClick={() => router.push(`/assistant?q=${encodeURIComponent(prompt)}`)}
              className="text-xs px-3 py-1.5 rounded-full border bg-card hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Live Current Station Conditions */}
      <CurrentConditionsCard />

      {/* Persona Adaptive Operational Intelligence */}
      <SectorAdvisoryCard />

      {/* Quick Action Feature Grid */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          Intelligence Modules
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Link
                key={idx}
                href={feat.href}
                className="p-5 rounded-3xl bg-card border shadow-md hover:shadow-xl hover:border-primary/40 transition-all flex flex-col justify-between group"
              >
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-2xl border ${feat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {feat.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-extrabold animate-pulse">
                      {feat.badge}
                    </span>
                  )}
                </div>

                <div className="my-3">
                  <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">{feat.desc}</p>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                  <span>Explore Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Dynamic Actionable Insights */}
      <WeatherInsightsCarousel />

      {/* Voice Search Modal */}
      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        initialLanguage={language}
      />
    </div>
  );
}
