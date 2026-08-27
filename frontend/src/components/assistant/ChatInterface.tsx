'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, LanguageCode } from '@/types';
import { useWeather } from '@/context/WeatherContext';
import { useLanguage, AVAILABLE_LANGUAGES } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { processGroundedQuery } from '@/lib/aiEngine';
import {
  startSpeechRecognition,
  startWhisperAudioRecorder,
  transcribeAudioWithWhisper,
  WhisperRecorderHandle,
  speakText,
} from '@/lib/speechUtils';
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
  VolumeX,
  Globe,
  Radio,
  ChevronDown,
  Loader2,
} from 'lucide-react';

interface ChatInterfaceProps {
  initialPrompt?: string;
}

export function ChatInterface({ initialPrompt }: ChatInterfaceProps) {
  const { currentLocation, observation } = useWeather();
  const { language, setLanguage, t } = useLanguage();
  const { persona } = usePersona();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [speechEngine, setSpeechEngine] = useState<'whisper' | 'webspeech'>('whisper');
  const [voiceLanguage, setVoiceLanguage] = useState<LanguageCode>(language);
  const [isVoiceLangOpen, setIsVoiceLangOpen] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [autoSpeakResponses, setAutoSpeakResponses] = useState(false);

  const whisperHandleRef = useRef<WhisperRecorderHandle | null>(null);
  const speechRecInstanceRef = useRef<{ stop: () => void } | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync voice language with global language when global language changes
  useEffect(() => {
    setVoiceLanguage(language);
  }, [language]);

  // Dynamic greetings in all 9 Indian languages
  const getGreetingText = (lang: LanguageCode): string => {
    switch (lang) {
      case 'ta':
        return `வணக்கம்! நான் WeatherGPT. ${currentLocation.name}-ல் தற்போதைய வெப்பநிலை ${observation.temperature}°C ஆகவும், ${observation.condition}-ஆகவும் உள்ளது. மழை, புயல், விவசாய ஆலோசனை அல்லது பேரிடர் பாதுகாப்பு பற்றி என்னிடம் கேளுங்கள்.`;
      case 'hi':
        return `नमस्ते! मैं WeatherGPT हूँ। ${currentLocation.name} में वर्तमान तापमान ${observation.temperature}°C और मौसम ${observation.condition} है। मुझसे वर्षा, आंधी, कृषि या आपदा सुरक्षा के बारे में पूछें।`;
      case 'te':
        return `నమస్కారం! నేను WeatherGPT. ${currentLocation.name}లో ప్రస్తుత ఉష్ణోగ్రత ${observation.temperature}°C మరియు వాతావరణం ${observation.condition}. వర్షం, తుఫాను, వ్యవసాయం గురించి నన్ను అడగండి.`;
      case 'ml':
        return `നമസ്കാരം! ഞാൻ WeatherGPT. ${currentLocation.name}-ൽ ഇപ്പോഴത്തെ താപനില ${observation.temperature}°C, കാലാവസ്ഥ ${observation.condition}. മഴ, ചുഴലിക്കാറ്റ്, കൃഷി എന്നിവയെക്കുറിച്ച് ചോദിക്കാം.`;
      case 'kn':
        return `ನಮಸ್ಕಾರ! ನಾನು WeatherGPT. ${currentLocation.name}ನಲ್ಲಿ ಪ್ರಸ್ತುತ ತಾಪಮಾನ ${observation.temperature}°C ಮತ್ತು ಹವಾಮಾನ ${observation.condition}. ಮಳೆ, ಚಂಡಮಾರುತ, ಕೃಷಿ ಬಗ್ಗೆ ಕೇಳಿ.`;
      case 'bn':
        return `নমস্কার! আমি WeatherGPT। ${currentLocation.name}-এ বর্তমান তাপমাত্রা ${observation.temperature}°C এবং আবহাওয়া ${observation.condition}। বৃষ্টি, ঘূর্ণিঝড় বা কৃষি সম্পর্কে জিজ্ঞাসা করুন।`;
      case 'mr':
        return `नमस्कार! मी WeatherGPT आहे. ${currentLocation.name} मध्ये सध्याचे तापमान ${observation.temperature}°C आणि हवामान ${observation.condition} आहे. पाऊस, वादळ किंवा शेतीबद्दल मला विचारा.`;
      case 'gu':
        return `નમસ્તે! હું WeatherGPT છું. ${currentLocation.name}માં હાલનું તાપમાન ${observation.temperature}°C અને હવામાન ${observation.condition} છે. વરસાદ, વાવાઝોડું કે ખેતી વિશે પૂછો.`;
      default:
        return `Hello! I am WeatherGPT, your grounded meteorological AI assistant. Current conditions in ${currentLocation.name} are ${observation.temperature}°C and ${observation.condition}. Ask me about tomorrow's rainfall, agricultural spraying, cyclone tracks, or disaster decisions.`;
    }
  };

  // Initialize greeting message
  useEffect(() => {
    const greetingText = getGreetingText(language);

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

  // Volume analyzer loop for Whisper recording
  useEffect(() => {
    if (isListening && speechEngine === 'whisper' && whisperHandleRef.current) {
      const updateVol = () => {
        if (whisperHandleRef.current) {
          const vol = whisperHandleRef.current.getVolumeLevel();
          setVolumeLevel(vol);
        }
        animFrameRef.current = requestAnimationFrame(updateVol);
      };
      animFrameRef.current = requestAnimationFrame(updateVol);
    } else {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      setVolumeLevel(0);
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isListening, speechEngine]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isListening]);

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

      if (autoSpeakResponses) {
        speakText(response.messageText, language);
      }
    }, 650);
  };

  const handleToggleVoice = async () => {
    if (isListening) {
      if (speechEngine === 'whisper' && whisperHandleRef.current) {
        setIsListening(false);
        setIsTranscribing(true);
        try {
          const audioBlob = await whisperHandleRef.current.stop();
          whisperHandleRef.current = null;
          const result = await transcribeAudioWithWhisper(audioBlob, voiceLanguage);
          if (result.text && result.text.trim()) {
            setInputQuery(result.text);
            handleSendMessage(result.text);
          }
        } catch (e: any) {
          console.warn('Transcription error in ChatInterface:', e);
        } finally {
          setIsTranscribing(false);
        }
      } else if (speechEngine === 'webspeech' && speechRecInstanceRef.current) {
        speechRecInstanceRef.current.stop();
        speechRecInstanceRef.current = null;
        setIsListening(false);
        if (speechTranscript.trim()) {
          handleSendMessage(speechTranscript);
        }
      }
      return;
    }

    // Start voice recording
    setSpeechTranscript('');
    if (speechEngine === 'whisper') {
      try {
        const handle = await startWhisperAudioRecorder();
        whisperHandleRef.current = handle;
        setIsListening(true);
      } catch (err) {
        console.warn('Whisper recorder error:', err);
        // Fallback to Web Speech
        setSpeechEngine('webspeech');
        const instance = startSpeechRecognition(
          voiceLanguage,
          (t) => {
            setSpeechTranscript(t);
            setInputQuery(t);
          },
          (e) => {
            console.warn(e);
            setIsListening(false);
          },
          () => setIsListening(false)
        );
        if (instance) {
          speechRecInstanceRef.current = instance;
          setIsListening(true);
        }
      }
    } else {
      const instance = startSpeechRecognition(
        voiceLanguage,
        (t) => {
          setSpeechTranscript(t);
          setInputQuery(t);
        },
        (e) => {
          console.warn(e);
          setIsListening(false);
        },
        () => setIsListening(false)
      );
      if (instance) {
        speechRecInstanceRef.current = instance;
        setIsListening(true);
      }
    }
  };

  const handleResetChat = () => {
    setMessages([messages[0]]);
  };

  const activeLangObj = AVAILABLE_LANGUAGES.find((l) => l.code === voiceLanguage);

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
              Grounded in IMD, GFS & WRF Numerical Models • Voice in 9 Languages
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto-speak toggle */}
          <button
            type="button"
            onClick={() => setAutoSpeakResponses(!autoSpeakResponses)}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              autoSpeakResponses
                ? 'bg-primary/20 text-primary border-primary/40'
                : 'hover:bg-accent text-muted-foreground'
            }`}
            title={autoSpeakResponses ? 'Auto-play Voice Readout: ON' : 'Auto-play Voice Readout: OFF'}
          >
            {autoSpeakResponses ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden md:inline text-[10px] font-semibold">
              {autoSpeakResponses ? 'Voice On' : 'Voice Off'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleResetChat}
            className="p-1.5 rounded-lg border hover:bg-accent text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 transition-colors"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
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
              Retrieving IMD observation & synthesizing risk advisory in {activeLangObj?.label}...
            </div>
          </div>
        )}

        {/* Transcribing Indicator */}
        {isTranscribing && (
          <div className="flex items-center gap-3 my-4 animate-in fade-in">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shrink-0">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-card border shadow-sm text-xs font-medium text-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Transcribing audio via Whisper Neural AI in {activeLangObj?.label}...
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
            language={voiceLanguage}
            engine={speechEngine}
            volumeLevel={volumeLevel}
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
          {/* Spoken Language Dropdown Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsVoiceLangOpen(!isVoiceLangOpen)}
              className="px-2.5 py-3 rounded-xl border bg-card hover:bg-accent text-xs font-bold flex items-center gap-1 transition-colors"
              title="Change Voice Input Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span className="uppercase">{voiceLanguage}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>

            {isVoiceLangOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-48 rounded-2xl border bg-card/95 backdrop-blur-xl shadow-2xl p-2 z-50 animate-in fade-in">
                <div className="text-[10px] font-bold text-muted-foreground px-2 py-1">
                  Voice Speech Language:
                </div>
                <div className="space-y-1 max-h-56 overflow-y-auto">
                  {AVAILABLE_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setVoiceLanguage(lang.code);
                        setLanguage(lang.code);
                        setIsVoiceLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors ${
                        voiceLanguage === lang.code
                          ? 'bg-primary text-primary-foreground font-bold'
                          : 'hover:bg-accent text-foreground'
                      }`}
                    >
                      <span>{lang.label}</span>
                      <span className="font-semibold text-[10px] opacity-80">
                        {lang.nativeLabel}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={isListening ? t.listening : t.askPlaceholder}
              className="w-full pl-4 pr-10 py-3 rounded-xl border bg-background text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none shadow-inner"
            />
          </div>

          {/* Microphone Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            disabled={isTranscribing}
            className={`p-3 rounded-xl border transition-all ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30'
                : 'bg-card hover:bg-accent text-foreground'
            }`}
            title={isListening ? 'Stop recording and ask' : `Speak in ${activeLangObj?.label} (${activeLangObj?.nativeLabel})`}
          >
            {isTranscribing ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            ) : isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5 text-blue-500" />
            )}
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping || isTranscribing}
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
