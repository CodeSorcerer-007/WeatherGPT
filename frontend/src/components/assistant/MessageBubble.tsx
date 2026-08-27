'use client';

import React, { useState } from 'react';
import { ChatMessage, RiskLevel } from '@/types';
import { useLanguage, AVAILABLE_LANGUAGES } from '@/context/LanguageContext';
import { ProvenanceBadge } from './ProvenanceBadge';
import {
  Bot,
  User,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Share2,
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldCheck,
  TrendingUp,
  Compass,
  Radio,
} from 'lucide-react';
import { speakText } from '@/lib/speechUtils';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { language, t } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const isUser = message.sender === 'user';
  const msgLang = message.language || language;
  const langObj = AVAILABLE_LANGUAGES.find((l) => l.code === msgLang);

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = message.text;
    speakText(
      textToSpeak,
      msgLang,
      1.0,
      1.0,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const getRiskBadge = (level?: RiskLevel) => {
    if (!level) return null;
    const colors: Record<RiskLevel, string> = {
      LOW: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      MODERATE: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      HIGH: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      SEVERE: 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse',
      EXTREME: 'bg-purple-500/10 text-purple-400 border-purple-500/30 animate-pulse',
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${colors[level]}`}
      >
        <AlertTriangle className="w-3 h-3" />
        {level} RISK
      </span>
    );
  };

  if (isUser) {
    return (
      <div className="flex items-start justify-end gap-2.5 my-4">
        <div className="max-w-[85%] sm:max-w-[70%] rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-3 shadow-md">
          <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{message.text}</p>
          <div className="text-[10px] opacity-70 text-right mt-1">{message.timestamp}</div>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  const structured = message.structured;

  return (
    <div className="flex items-start gap-3 my-5 group">
      {/* Bot Avatar */}
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0 mt-1">
        <Bot className="w-5 h-5" />
      </div>

      {/* Main Bubble */}
      <div className="flex-1 max-w-[95%] sm:max-w-[90%] rounded-2xl rounded-tl-sm bg-card border shadow-lg p-4 sm:p-5 text-card-foreground">
        {/* Header with intent and actions */}
        <div className="flex items-center justify-between pb-3 border-b border-border/50 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm bg-gradient-to-r from-blue-500 to-sky-400 bg-clip-text text-transparent">
              WeatherGPT Intelligence
            </span>
            {message.intent && (
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-muted text-[10px] font-semibold text-muted-foreground">
                {message.intent}
              </span>
            )}
            {langObj && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary/10 text-primary font-bold">
                {langObj.nativeLabel}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Live audio speaking wave bars */}
            {isSpeaking && (
              <div className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-primary/10 border border-primary/20">
                <span className="w-1 h-3 bg-primary rounded-full animate-[pulse_0.4s_ease-in-out_infinite]" />
                <span className="w-1 h-4 bg-sky-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite_0.1s]" />
                <span className="w-1 h-2 bg-indigo-500 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.2s]" />
                <span className="text-[10px] font-bold text-primary ml-1">Speaking</span>
              </div>
            )}

            {/* Read Aloud Button */}
            <button
              type="button"
              onClick={handleSpeak}
              className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 ${
                isSpeaking
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                  : 'hover:bg-accent text-muted-foreground'
              }`}
              title={isSpeaking ? t.stopSpeaking : `${t.readAloud} (${langObj?.label || 'Voice'})`}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="text-[10px] font-semibold hidden md:inline">
                {isSpeaking ? 'Stop' : 'Listen'}
              </span>
            </button>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-lg border hover:bg-accent text-muted-foreground transition-colors"
              title="Copy answer"
            >
              {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Primary Natural Language Message */}
        <p className="text-sm sm:text-[15px] font-normal leading-relaxed text-foreground mt-3 whitespace-pre-wrap">
          {message.text}
        </p>

        {/* Structured Sections (Observation -> Interpretation -> Risk -> Recommendation -> Action) */}
        {structured && (
          <div className="mt-4 space-y-3">
            {/* Quick Stats Grid */}
            {structured.quickStats && structured.quickStats.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {structured.quickStats.map((stat, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-accent/40 border">
                    <div className="text-[11px] text-muted-foreground font-medium">{stat.label}</div>
                    <div className="text-sm sm:text-base font-bold text-foreground mt-0.5">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Risk & Recommendation Callout */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-muted/60 to-accent/40 border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  {t.recommendation}
                </span>
                {getRiskBadge(structured.risk?.level)}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-foreground leading-normal">
                {structured.recommendation}
              </p>
            </div>

            {/* Action Steps Checklist */}
            {structured.actionSteps && structured.actionSteps.length > 0 && (
              <div className="p-3 rounded-xl bg-card border space-y-2">
                <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  {t.actionRequired}:
                </div>
                <div className="space-y-1.5">
                  {structured.actionSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Data Provenance & Explainability */}
        <ProvenanceBadge
          sources={message.sources}
          confidence={message.confidence}
          whyExplanation={structured?.whyExplanation}
        />

        <div className="text-[10px] text-muted-foreground mt-2">{message.timestamp}</div>
      </div>
    </div>
  );
}
