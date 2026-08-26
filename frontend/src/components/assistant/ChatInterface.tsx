'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';
import { useWeather } from '@/context/WeatherContext';
import { useLanguage } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { processGroundedQuery } from '@/lib/aiEngine';
import { startSpeechRecognition, isSpeechRecognitionSupported } from '@/lib/speechUtils';
import { MessageBubble } from './MessageBubble';
import { SuggestedPrompts } from './SuggestedPrompts';
import { VoiceVisualizer } from './VoiceVisualizer';
import {
  Send,
  Mic,
  MicOff,
  Sparkles,
  Bot,
  RotateCcw,
  Volume2,
  Paperclip,
  CheckCircle2,
} from 'lucide-react';

interface ChatInterfaceProps {
  initialPrompt?: string;
}

export function ChatInterface({ initialPrompt }: ChatInterfaceProps) {
  const { currentLocation, observation } = useWeather();
  const { language, t } = useLanguage();
  const { persona } = usePersona();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [recognitionInstance, setRecognitionInstance] = useState<{ stop: () => void } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize greeting message
  useEffect(() => {
    const greetingText =
      language === 'ta'
        ? `வணக்கம்! நான் WeatherGPT. ${currentLocation.name}-ல் தற்போதைய வெப்பநிலை ${observation.temperature}°C ஆகவும், ${observation.condition}-ஆகவும் உள்ளது. மழை, புயல், விவசாய ஆலோசனை அல்லது பேரிடர் பாதுகாப்பு பற்றி என்னிடம் கேளுங்கள்.`
        : language === 'hi'
        ? `नमस्ते! मैं WeatherGPT हूँ। ${currentLocation.name} में वर्तमान तापमान ${observation.temperature}°C और मौसम ${observation.condition} है। मुझसे वर्षा, आंधी, कृषि या आपदा सुरक्षा के बारे में पूछें।`
        : `Hello! I am WeatherGPT, your grounded meteorological AI assistant. Current conditions in ${currentLocation.name} are ${observation.temperature}°C and ${observation.condition}. Ask me about tomorrow's rainfall, agricultural spraying, cyclone tracks, or disaster decisions.`;

    const initialBotMessage: ChatMessage = {
      id: 'msg-init',
      sender: 'assistant',
      text: greetingText,
      timestamp: 'Just now',
      language,
      sources: [
        { name: 'India Meteorological Department (IMD)', timestamp: 'Live Feed', type: 'Observation', confidence: 'High' },
        { name: 'WeatherGPT Grounded Engine', timestamp: 'Active', type: 'Official Bulletin', confidence: 'High' },
      ],
      confidence: 'High',
    };

    setMessages([initialBotMessage]);

    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, [currentLocation.name, language]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isTyping) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate progressive grounded reasoning and streaming
    setTimeout(() => {
      const response = processGroundedQuery(query, currentLocation, language, persona);

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.messageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language,
        structured: response.structured,
        sources: response.sources,
        confidence: response.confidence,
        intent: response.intent,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 650);
  };

  const handleToggleVoice = () => {
    if (isListening) {
      recognitionInstance?.stop();
      setIsListening(false);
      if (speechTranscript.trim()) {
        handleSendMessage(speechTranscript);
      }
      return;
    }

    setSpeechTranscript('');
    const instance = startSpeechRecognition(
      language,
      (transcript) => {
        setSpeechTranscript(transcript);
        setInputQuery(transcript);
      },
      (error) => {
        console.warn(error);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (instance) {
      setRecognitionInstance(instance);
      setIsListening(true);
    }
  };

  const handleResetChat = () => {
    setMessages([messages[0]]);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-card/60 backdrop-blur-xl border rounded-2xl shadow-2xl overflow-hidden">
      {/* Chat Top Banner */}
      <div className="px-5 py-3.5 border-b bg-muted/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
              <span>WeatherGPT Conversational Intelligence</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Grounded in IMD, GFS & WRF Numerical Models • Zero Hallucination
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="p-1.5 rounded-lg border hover:bg-accent text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 transition-colors"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Typing / Reasoning Indicator */}
        {isTyping && (
          <div className="flex items-center gap-3 my-4 animate-in fade-in">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shrink-0">
              <Bot className="w-5 h-5 animate-spin" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-card border shadow-sm text-xs font-medium text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              Retrieving IMD observation & synthesizing risk advisory...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Visualizer if recording */}
      {isListening && (
        <div className="px-4 pb-2">
          <VoiceVisualizer
            isListening={isListening}
            onStop={handleToggleVoice}
            transcript={speechTranscript}
          />
        </div>
      )}

      {/* Footer Suggested Prompts & Input Box */}
      <div className="p-4 border-t bg-card/80 backdrop-blur-md space-y-3">
        <SuggestedPrompts onSelectPrompt={(p) => handleSendMessage(p)} />

        {/* Text / Voice Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={isListening ? 'Listening...' : t.askPlaceholder}
              className="w-full pl-4 pr-10 py-3 rounded-xl border bg-background text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none shadow-inner"
            />
          </div>

          {/* Microphone Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`p-3 rounded-xl border transition-all ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30'
                : 'bg-card hover:bg-accent text-foreground'
            }`}
            title={isListening ? 'Stop recording' : 'Speak your question (Voice Input)'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-blue-500" />}
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="px-4 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs sm:text-sm shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
