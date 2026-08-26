'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PersonaType } from '@/types';

export interface PersonaInfo {
  id: PersonaType;
  title: string;
  description: string;
  icon: string;
  color: string;
  recommendedPrompts: string[];
}

export const PERSONAS: PersonaInfo[] = [
  {
    id: 'citizen',
    title: 'Citizen',
    description: 'Everyday weather, commute safety, rain probability, and outdoor alerts.',
    icon: 'User',
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    recommendedPrompts: [
      'Will it rain in Chennai tomorrow afternoon?',
      'Is there any cyclone approaching Tamil Nadu?',
      'What should I wear today based on the temperature?',
    ],
  },
  {
    id: 'farmer',
    title: 'Farmer / Agro-Intelligence',
    description: 'Crop-specific guidance, irrigation scheduling, pesticide spray suitability, and pest risk.',
    icon: 'Wheat',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    recommendedPrompts: [
      'Should I irrigate my paddy field today?',
      'Can I spray pesticides on cotton tomorrow morning?',
      'What is the fungal disease risk given current humidity?',
    ],
  },
  {
    id: 'disaster_manager',
    title: 'Disaster Manager',
    description: 'Extreme alerts, cyclone tracks, flood vulnerability zones, and evacuation decision support.',
    icon: 'ShieldAlert',
    color: 'text-red-400 bg-red-500/10 border-red-500/30',
    recommendedPrompts: [
      'What should citizens in low-lying zones do now?',
      'Show active cyclone track and estimated landfall time',
      'Which districts have severe rainfall red alerts today?',
    ],
  },
  {
    id: 'researcher',
    title: 'Climate Researcher',
    description: '50-year climate trends, temperature anomalies, extreme event frequencies, and GFS/WRF model outputs.',
    icon: 'LineChart',
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    recommendedPrompts: [
      'Show 50-year rainfall trend and extreme downpour shifts for Chennai',
      'What is the decadal temperature anomaly compared to 1970-2000 baseline?',
      'Compare WRF vs GFS model confidence for current low pressure system',
    ],
  },
  {
    id: 'marine',
    title: 'Fisherfolk & Marine',
    description: 'Offshore wind speed, swell wave height, high-tide timings, and coastal safety bans.',
    icon: 'Anchor',
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    recommendedPrompts: [
      'What precautions should fishermen take today?',
      'What is the wave height and wind speed in Southwest Bay of Bengal?',
      'What time is high tide and is there a coastal warning?',
    ],
  },
  {
    id: 'aviation',
    title: 'Aviation & Transit',
    description: 'Runway visibility, crosswind gusts, vertical wind shear, and thunderstorm squalls.',
    icon: 'Plane',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    recommendedPrompts: [
      'What will weather conditions and runway visibility be like during evening flights?',
      'Are there severe wind squalls or microburst risks at Chennai airport?',
    ],
  },
  {
    id: 'urban_planner',
    title: 'Urban Planner',
    description: 'Urban heat island maps, stormwater capacity stress, and extreme downpour frequencies.',
    icon: 'Building2',
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    recommendedPrompts: [
      'Will flooding be possible in urban arterial roads?',
      'How does the urban heat island effect impact nocturnal temperatures?',
    ],
  },
];

interface PersonaContextType {
  persona: PersonaType;
  setPersona: (p: PersonaType) => void;
  activePersonaInfo: PersonaInfo;
  allPersonas: PersonaInfo[];
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [persona, setPersona] = useState<PersonaType>('citizen');

  useEffect(() => {
    const saved = localStorage.getItem('weathergpt_persona') as PersonaType;
    if (saved && PERSONAS.some((p) => p.id === saved)) {
      setPersona(saved);
    }
  }, []);

  const handleSetPersona = (p: PersonaType) => {
    setPersona(p);
    if (typeof window !== 'undefined') {
      localStorage.setItem('weathergpt_persona', p);
    }
  };

  const activePersonaInfo = PERSONAS.find((p) => p.id === persona) || PERSONAS[0];

  return (
    <PersonaContext.Provider
      value={{
        persona,
        setPersona: handleSetPersona,
        activePersonaInfo,
        allPersonas: PERSONAS,
      }}
    >
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
}
