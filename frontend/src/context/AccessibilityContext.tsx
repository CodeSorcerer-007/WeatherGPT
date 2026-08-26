'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UnitPreferences {
  temp: 'C' | 'F';
  speed: 'kmh' | 'mph';
  rain: 'mm' | 'in';
  pressure: 'hPa' | 'inHg';
}

interface AccessibilityContextType {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  fontSize: 'normal' | 'large' | 'extra-large';
  setFontSize: (size: 'normal' | 'large' | 'extra-large') => void;
  units: UnitPreferences;
  setUnits: React.Dispatch<React.SetStateAction<UnitPreferences>>;
  toggleTempUnit: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('normal');
  const [units, setUnits] = useState<UnitPreferences>({
    temp: 'C',
    speed: 'kmh',
    rain: 'mm',
    pressure: 'hPa',
  });

  useEffect(() => {
    // Sync theme class to document
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (fontSize === 'large') {
      root.style.fontSize = '18px';
    } else if (fontSize === 'extra-large') {
      root.style.fontSize = '20px';
    } else {
      root.style.fontSize = '16px';
    }
  }, [theme, highContrast, fontSize]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleTempUnit = () => {
    setUnits((prev) => ({
      ...prev,
      temp: prev.temp === 'C' ? 'F' : 'C',
    }));
  };

  return (
    <AccessibilityContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        highContrast,
        setHighContrast,
        reducedMotion,
        setReducedMotion,
        fontSize,
        setFontSize,
        units,
        setUnits,
        toggleTempUnit,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
