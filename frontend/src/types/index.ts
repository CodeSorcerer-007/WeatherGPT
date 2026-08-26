export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE' | 'EXTREME';

export type AlertCategory =
  | 'cyclone'
  | 'rain'
  | 'flood'
  | 'heatwave'
  | 'thunderstorm'
  | 'lightning'
  | 'wind'
  | 'coastal'
  | 'landslide'
  | 'coldwave'
  | 'drought';

export type PersonaType =
  | 'citizen'
  | 'farmer'
  | 'disaster_manager'
  | 'researcher'
  | 'aviation'
  | 'marine'
  | 'urban_planner';

export type LanguageCode = 'en' | 'ta' | 'hi' | 'te' | 'ml' | 'kn' | 'bn' | 'mr' | 'gu';

export interface LocationInfo {
  id: string;
  name: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
  isSaved?: boolean;
  elevation?: number;
  zone?: 'coastal' | 'inland' | 'hilly' | 'arid' | 'plateau';
}

export interface WeatherObservation {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  windDirectionText: string;
  windGust: number;
  uvIndex: number;
  visibility: number;
  cloudCover: number;
  rainfall: number;
  dewPoint: number;
  airQualityIndex: number;
  condition: string;
  conditionCode: string;
  icon: string;
  sunrise: string;
  sunset: string;
  updatedTime: string;
  isDay: boolean;
}

export interface HourlyForecast {
  time: string;
  hour: number;
  temperature: number;
  feelsLike: number;
  rainProbability: number;
  rainfallAmount: number;
  condition: string;
  icon: string;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  uvIndex: number;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  rainProbability: number;
  rainfallAmount: number;
  condition: string;
  icon: string;
  windSpeed: number;
  humidity: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  summary: string;
}

export interface WeatherAlert {
  id: string;
  title: string;
  locationName: string;
  state: string;
  severity: RiskLevel;
  category: AlertCategory;
  description: string;
  expectedPeriod: string;
  startTime: string;
  endTime: string;
  potentialRisks: string[];
  recommendedActions: string[];
  source: string;
  confidence: 'High' | 'Moderate' | 'Low';
  affectedAreas: string[];
  coordinates?: [number, number];
  isActive: boolean;
}

export interface AgricultureAdvisory {
  crop: string;
  growthStage: string;
  soilMoistureLevel: 'Low' | 'Optimal' | 'Excess';
  irrigationRecommendation: {
    status: 'Delay' | 'Apply' | 'Maintain' | 'Drain';
    reason: string;
    nextRecommendedDate: string;
  };
  spraySuitability: {
    isSuitable: boolean;
    rating: 'Optimal' | 'Caution' | 'Unsuitable';
    limitingFactors: string[];
    bestTimeWindow: string;
  };
  windSuitability: {
    isSafe: boolean;
    currentSpeed: number;
    threshold: number;
  };
  pestDiseaseRisk: {
    riskLevel: 'Low' | 'Moderate' | 'High';
    vulnerabilities: string[];
    preventiveMeasure: string;
  };
  heatColdStress: {
    status: 'Normal' | 'Heat Stress' | 'Cold Shock';
    mitigation: string;
  };
  summary: string;
}

export interface ClimateTrendPoint {
  year: number;
  avgTemp: number;
  tempAnomaly: number; // Difference from 1970-2000 baseline
  annualRainfall: number; // mm
  rainfallAnomalyPct: number;
  extremeRainDays: number; // Days > 100mm
  heatwaveDays: number; // Days > 40°C
}

export interface ClimateAnalytics {
  locationName: string;
  yearsSpan: number;
  startYear: number;
  endYear: number;
  baselineTemp: number;
  recentAvgTemp: number;
  tempIncreaseDelta: number;
  baselineRainfall: number;
  recentAvgRainfall: number;
  rainfallShiftPct: number;
  extremeEventFrequencyChange: string;
  dataPoints: ClimateTrendPoint[];
  summary: string;
  keyInsights: string[];
}

export interface DataSourceProvenance {
  name: string;
  model?: string;
  timestamp: string;
  type: 'Observation' | 'Numerical Model' | 'Satellite' | 'Radar' | 'Official Bulletin';
  confidence: 'High' | 'Moderate' | 'Low';
}

export interface StructuredAIAnswer {
  observation: string;
  interpretation: string;
  risk: {
    level: RiskLevel;
    factors: string[];
  };
  recommendation: string;
  actionSteps: string[];
  quickStats?: {
    label: string;
    value: string | number;
    badge?: string;
  }[];
  whyExplanation?: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language?: LanguageCode;
  structured?: StructuredAIAnswer;
  sources?: DataSourceProvenance[];
  confidence?: 'High' | 'Moderate' | 'Low';
  intent?: string;
  audioUrl?: string;
}

export interface NotificationSubscription {
  id: string;
  alertType: AlertCategory | 'all';
  locationId: string;
  minSeverity: RiskLevel;
  language: LanguageCode;
  enabled: boolean;
  channel: 'browser' | 'sms' | 'email' | 'push';
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'normal' | 'large' | 'extra-large';
  language: LanguageCode;
  persona: PersonaType;
  units: {
    temp: 'C' | 'F';
    speed: 'kmh' | 'mph';
    rain: 'mm' | 'in';
    pressure: 'hPa' | 'inHg';
  };
  demoMode: boolean;
  voiceAutoPlay: boolean;
  speechPitch: number;
  speechRate: number;
}
