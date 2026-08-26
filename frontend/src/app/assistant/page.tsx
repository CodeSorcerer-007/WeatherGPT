'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChatInterface } from '@/components/assistant/ChatInterface';
import { Bot, Sparkles, ShieldCheck } from 'lucide-react';

function AssistantContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || undefined;

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" />
            WeatherGPT Conversational Assistant
          </h1>
          <p className="text-xs text-muted-foreground">
            Multi-lingual voice-enabled grounded weather AI for India
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          RAG & Official IMD Provenance
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ChatInterface initialPrompt={initialQuery} />
      </div>
    </div>
  );
}

export default function AssistantPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Loading WeatherGPT Assistant...</div>}>
      <AssistantContent />
    </Suspense>
  );
}
