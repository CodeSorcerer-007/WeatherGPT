'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LanguageCode } from '@/types';
import { AVAILABLE_LANGUAGES, useLanguage } from '@/context/LanguageContext';
import {
  startWhisperAudioRecorder,
  transcribeAudioWithWhisper,
  startSpeechRecognition,
  isSpeechRecognitionSupported,
  isMediaRecorderSupported,
  speakText,
  SAMPLE_VOICE_PROMPTS,
  WhisperRecorderHandle,
} from '@/lib/speechUtils';
import {
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  X,
  Send,
  RotateCcw,
  Cpu,
  Globe,
  Radio,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuery?: (query: string, language: LanguageCode) => void;
  initialLanguage?: LanguageCode;
}

export function VoiceSearchModal({
  isOpen,
  onClose,
  onSelectQuery,
  initialLanguage,
}: VoiceSearchModalProps) {
  const router = useRouter();
  const { language: globalLanguage, setLanguage: setGlobalLanguage, t } = useLanguage();

  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(
    initialLanguage || globalLanguage
  );
  const [engine, setEngine] = useState<'whisper' | 'webspeech'>('whisper');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const whisperHandleRef = useRef<WhisperRecorderHandle | null>(null);
  const speechRecInstanceRef = useRef<{ stop: () => void } | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedLanguage(initialLanguage || globalLanguage);
      setTranscript('');
      setErrorMessage(null);
    } else {
      stopRecording();
    }
  }, [isOpen, initialLanguage, globalLanguage]);

  // Sync volume animation during Whisper recording
  useEffect(() => {
    if (isRecording && engine === 'whisper' && whisperHandleRef.current) {
      const updateVolume = () => {
        if (whisperHandleRef.current) {
          const vol = whisperHandleRef.current.getVolumeLevel();
          setVolumeLevel(vol);
        }
        animFrameRef.current = requestAnimationFrame(updateVolume);
      };
      animFrameRef.current = requestAnimationFrame(updateVolume);
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
  }, [isRecording, engine]);

  if (!isOpen) return null;

  const handleLanguageChange = (lang: LanguageCode) => {
    setSelectedLanguage(lang);
    setGlobalLanguage(lang);
    setErrorMessage(null);
  };

  const startRecording = async () => {
    setErrorMessage(null);
    setTranscript('');

    if (engine === 'whisper') {
      try {
        const handle = await startWhisperAudioRecorder();
        whisperHandleRef.current = handle;
        setIsRecording(true);
      } catch (err: any) {
        console.warn('Whisper recording failed:', err);
        setErrorMessage(
          err.message || 'Microphone access denied. Please grant microphone permission.'
        );
      }
    } else {
      // Web Speech API
      const instance = startSpeechRecognition(
        selectedLanguage,
        (text) => {
          setTranscript(text);
        },
        (err) => {
          setErrorMessage(err);
          setIsRecording(false);
        },
        () => {
          setIsRecording(false);
        }
      );

      if (instance) {
        speechRecInstanceRef.current = instance;
        setIsRecording(true);
      }
    }
  };

  const stopRecording = async () => {
    if (engine === 'whisper' && whisperHandleRef.current && isRecording) {
      setIsRecording(false);
      setIsTranscribing(true);
      try {
        const blob = await whisperHandleRef.current.stop();
        whisperHandleRef.current = null;
        const result = await transcribeAudioWithWhisper(blob, selectedLanguage);
        if (result.text) {
          setTranscript(result.text);
        }
      } catch (err: any) {
        console.warn('Transcription error:', err);
        setErrorMessage(err.message || 'Failed to transcribe audio.');
      } finally {
        setIsTranscribing(false);
      }
    } else if (engine === 'webspeech' && speechRecInstanceRef.current && isRecording) {
      speechRecInstanceRef.current.stop();
      speechRecInstanceRef.current = null;
      setIsRecording(false);
    }
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handlePromptClick = (prompt: string) => {
    setTranscript(prompt);
    setErrorMessage(null);
  };

  const handleSubmit = () => {
    const query = transcript.trim();
    if (!query) return;

    onClose();
    if (onSelectQuery) {
      onSelectQuery(query, selectedLanguage);
    } else {
      router.push(`/assistant?q=${encodeURIComponent(query)}`);
    }
  };

  const currentPrompts = SAMPLE_VOICE_PROMPTS[selectedLanguage] || SAMPLE_VOICE_PROMPTS.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-card border border-primary/20 shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glow behind modal */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-foreground flex items-center gap-1.5">
                <span>{t.voiceSearch}</span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                  9 Indian Languages
                </span>
              </h2>
              <p className="text-[11px] text-muted-foreground">{t.voiceSearchSub}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* 1. Language Switcher Pills */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span>Select Voice Language:</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {AVAILABLE_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all text-center flex flex-col items-center justify-center ${
                    selectedLanguage === lang.code
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
                      : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50'
                  }`}
                >
                  <span className="font-bold text-[11px]">{lang.label}</span>
                  <span className="text-[10px] opacity-80">{lang.nativeLabel}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Engine Toggle (Whisper vs Web Speech) */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-accent/40 border text-xs">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="font-bold text-foreground">Speech Recognition Engine</div>
                <div className="text-[10px] text-muted-foreground">
                  {engine === 'whisper'
                    ? 'Whisper Neural AI (Deep multilingual accuracy for Indian dialects)'
                    : 'Browser Web Speech (Real-time live streaming)'}
                </div>
              </div>
            </div>

            <div className="flex gap-1 bg-card p-1 rounded-xl border">
              <button
                type="button"
                onClick={() => setEngine('whisper')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  engine === 'whisper'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Whisper AI
              </button>
              <button
                type="button"
                onClick={() => setEngine('webspeech')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  engine === 'webspeech'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Web Speech
              </button>
            </div>
          </div>

          {/* 3. Central Spatial Mic Waveform */}
          <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-b from-muted/30 to-card border shadow-inner space-y-4">
            {/* Live audio level bars */}
            <div className="flex items-center gap-1.5 h-12">
              {[0.4, 0.7, 1.0, 0.6, 0.9, 0.5, 0.8, 1.0, 0.7, 0.4].map((multiplier, idx) => {
                const height = isRecording
                  ? Math.max(12, Math.min(48, Math.round((volumeLevel || 40) * multiplier * 0.6)))
                  : 8;
                return (
                  <span
                    key={idx}
                    style={{ height: `${height}px` }}
                    className={`w-1.5 rounded-full transition-all duration-75 ${
                      isRecording
                        ? 'bg-gradient-to-t from-blue-600 via-sky-400 to-indigo-400 shadow-sm shadow-blue-500/50'
                        : 'bg-muted-foreground/30'
                    }`}
                  />
                );
              })}
            </div>

            {/* Giant Pulsating Mic Button */}
            <div className="relative">
              {isRecording && (
                <>
                  <span className="absolute -inset-3 rounded-full bg-rose-500/20 animate-ping" />
                  <span className="absolute -inset-6 rounded-full bg-primary/15 animate-pulse" />
                </>
              )}
              <button
                type="button"
                onClick={handleToggleRecord}
                disabled={isTranscribing}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all ${
                  isRecording
                    ? 'bg-gradient-to-tr from-rose-600 to-red-500 text-white shadow-rose-500/40 scale-105'
                    : isTranscribing
                    ? 'bg-muted text-muted-foreground cursor-wait'
                    : 'bg-gradient-to-tr from-blue-600 via-primary to-indigo-600 text-white hover:scale-105 hover:shadow-primary/40'
                }`}
              >
                {isTranscribing ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : isRecording ? (
                  <MicOff className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </button>
            </div>

            {/* Status text */}
            <div className="text-center space-y-1">
              <div className="text-sm font-bold text-foreground flex items-center justify-center gap-1.5">
                {isTranscribing ? (
                  <span className="text-primary flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    {t.transcribing}
                  </span>
                ) : isRecording ? (
                  <span className="text-rose-500 animate-pulse flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    {t.listening}
                  </span>
                ) : (
                  <span>{t.tapToSpeak}</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {isRecording
                  ? 'Speak clearly into your microphone in your chosen language'
                  : 'Press the microphone and ask WeatherGPT about rainfall, storms, or farming'}
              </p>
            </div>

            {/* Error Message notice if any */}
            {errorMessage && (
              <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* 4. Transcribed Query Display & Edit Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase">
              <span>Your Weather Inquiry:</span>
              {transcript && (
                <button
                  type="button"
                  onClick={() => setTranscript('')}
                  className="text-primary hover:underline lowercase font-normal"
                >
                  clear
                </button>
              )}
            </div>
            <div className="relative">
              <textarea
                rows={2}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Spoken words will appear here in real-time... (You can also type or edit)"
                className="w-full p-3.5 rounded-2xl border bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none resize-none shadow-inner"
              />
            </div>
          </div>

          {/* 5. Clickable Spoken Sample Inquiries */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>{t.suggestedVoicePrompts}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePromptClick(prompt)}
                  className="text-xs px-3 py-1.5 rounded-full border bg-card hover:bg-primary/10 hover:border-primary/40 text-foreground transition-all text-left shadow-sm"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t bg-muted/40 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border bg-card hover:bg-accent text-xs font-semibold text-muted-foreground transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!transcript.trim()}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <span>Ask WeatherGPT</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
