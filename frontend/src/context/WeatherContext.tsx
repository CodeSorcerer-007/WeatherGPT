'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LocationInfo,
  WeatherObservation,
  HourlyForecast,
  DailyForecast,
  WeatherAlert,
} from '@/types';
import {
  INDIAN_LOCATIONS,
  getMockWeatherObservation,
  generateHourlyForecast,
  generateSevenDayForecast,
  MOCK_ALERTS,
} from '@/lib/mockData';
import { fetchCurrentWeather } from '@/lib/weatherApi';

interface WeatherContextType {
  currentLocation: LocationInfo;
  setCurrentLocation: (loc: LocationInfo) => void;
  savedLocations: LocationInfo[];
  toggleSaveLocation: (loc: LocationInfo) => void;
  observation: WeatherObservation;
  hourlyForecast: HourlyForecast[];
  dailyForecast: DailyForecast[];
  alerts: WeatherAlert[];
  isLoading: boolean;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  refreshWeather: () => Promise<void>;
  emergencyModeActive: boolean;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<LocationInfo>(INDIAN_LOCATIONS[0]); // Chennai default
  const [savedLocations, setSavedLocations] = useState<LocationInfo[]>(
    INDIAN_LOCATIONS.filter((l) => l.isSaved)
  );
  const [observation, setObservation] = useState<WeatherObservation>(
    getMockWeatherObservation('chennai')
  );
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>(
    generateHourlyForecast('chennai')
  );
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>(
    generateSevenDayForecast('chennai')
  );
  const [alerts, setAlerts] = useState<WeatherAlert[]>(MOCK_ALERTS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [demoMode, setDemoMode] = useState<boolean>(true);

  // Load weather when location or demoMode changes
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const obs = await fetchCurrentWeather(currentLocation, demoMode);
        const hr = generateHourlyForecast(currentLocation.id);
        const dl = generateSevenDayForecast(currentLocation.id);

        setObservation(obs);
        setHourlyForecast(hr);
        setDailyForecast(dl);

        // Filter alerts relevant to location
        const relevantAlerts = MOCK_ALERTS.filter(
          (a) =>
            a.isActive &&
            (a.locationName.toLowerCase().includes(currentLocation.name.toLowerCase()) ||
              a.state.toLowerCase().includes(currentLocation.state.toLowerCase()) ||
              a.affectedAreas.some((area) =>
                area.toLowerCase().includes(currentLocation.name.toLowerCase())
              ))
        );
        setAlerts(relevantAlerts.length > 0 ? relevantAlerts : [MOCK_ALERTS[0]]);
      } catch (err) {
        console.error('Failed to load weather data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [currentLocation, demoMode]);

  const toggleSaveLocation = (loc: LocationInfo) => {
    setSavedLocations((prev) => {
      const exists = prev.some((l) => l.id === loc.id);
      if (exists) {
        return prev.filter((l) => l.id !== loc.id);
      } else {
        return [...prev, { ...loc, isSaved: true }];
      }
    });
  };

  const refreshWeather = async () => {
    setIsLoading(true);
    const obs = await fetchCurrentWeather(currentLocation, demoMode);
    setObservation(obs);
    setIsLoading(false);
  };

  // Check if severe or extreme alert is active for current location
  const emergencyModeActive = alerts.some(
    (a) => a.isActive && (a.severity === 'SEVERE' || a.severity === 'EXTREME')
  );

  return (
    <WeatherContext.Provider
      value={{
        currentLocation,
        setCurrentLocation,
        savedLocations,
        toggleSaveLocation,
        observation,
        hourlyForecast,
        dailyForecast,
        alerts,
        isLoading,
        demoMode,
        setDemoMode,
        refreshWeather,
        emergencyModeActive,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
