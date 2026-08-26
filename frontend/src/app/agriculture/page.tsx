'use client';

import React, { useState } from 'react';
import { useWeather } from '@/context/WeatherContext';
import { useLanguage } from '@/context/LanguageContext';
import { CropSelector } from '@/components/agriculture/CropSelector';
import { IrrigationAdvisory } from '@/components/agriculture/IrrigationAdvisory';
import { SpraySuitabilityGauge } from '@/components/agriculture/SpraySuitabilityGauge';
import { PestDiseaseRisk } from '@/components/agriculture/PestDiseaseRisk';
import { MOCK_AGRICULTURE_MATRIX } from '@/lib/mockData';
import { Wheat, Sprout, Sparkles, Bot, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AgriculturePage() {
  const { currentLocation } = useWeather();
  const { t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState('Paddy');
  const [selectedStage, setSelectedStage] = useState('Tillering / Vegetative Phase');

  const advisory =
    MOCK_AGRICULTURE_MATRIX[selectedCrop] || MOCK_AGRICULTURE_MATRIX['Paddy'];

  return (
    <div className="space-y-6 pb-8">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2.5">
            <Wheat className="w-8 h-8 text-emerald-500" />
            Gramin Krishi Mausam Agro-Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Crop-specific irrigation scheduling, chemical spraying suitability, and pest vulnerability matrix
          </p>
        </div>

        <Link
          href={`/assistant?q=${encodeURIComponent(`Should I irrigate my ${selectedCrop} field in ${currentLocation.name} today?`)}`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all"
        >
          <Bot className="w-4 h-4" />
          <span>Ask AI Farmer Assistant</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Crop & Growth Stage Picker */}
      <CropSelector
        selectedCrop={selectedCrop}
        onSelectCrop={setSelectedCrop}
        selectedStage={selectedStage}
        onSelectStage={setSelectedStage}
      />

      {/* Main Advisory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Irrigation Scheduling Advisory */}
        <IrrigationAdvisory advisory={advisory} />

        {/* Agrochemical Spray Suitability Gauge */}
        <SpraySuitabilityGauge advisory={advisory} />
      </div>

      {/* Pest & Pathogen Forecast & Canopy Stress */}
      <PestDiseaseRisk advisory={advisory} />
    </div>
  );
}
