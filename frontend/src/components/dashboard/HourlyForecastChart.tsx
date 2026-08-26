'use client';

import React, { useState } from 'react';
import { useWeather } from '@/context/WeatherContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAccessibility } from '@/context/AccessibilityContext';
import { formatTemp } from '@/lib/units';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { CloudRain, Thermometer, Wind, Droplets } from 'lucide-react';

export function HourlyForecastChart() {
  const { hourlyForecast } = useWeather();
  const { t } = useLanguage();
  const { units } = useAccessibility();

  const [activeMetric, setActiveMetric] = useState<'temp' | 'rain' | 'wind'>('temp');

  const chartData = hourlyForecast.slice(0, 16).map((item) => ({
    time: item.time,
    temperature: item.temperature,
    feelsLike: item.feelsLike,
    rainProb: item.rainProbability,
    rainfall: item.rainfallAmount,
    windSpeed: item.windSpeed,
    humidity: item.humidity,
    condition: item.condition,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl border bg-card/95 backdrop-blur-xl p-3 shadow-xl text-xs space-y-1">
          <div className="font-bold text-foreground">{label} Forecast</div>
          <div className="text-primary font-semibold">
            Temp: {formatTemp(data.temperature, units.temp)} (Feels {formatTemp(data.feelsLike, units.temp)})
          </div>
          <div className="text-sky-400 font-medium">
            Rain Chance: {data.rainProb}% ({data.rainfall} mm)
          </div>
          <div className="text-teal-400 font-medium">Wind: {data.windSpeed} km/h</div>
          <div className="text-muted-foreground text-[10px]">{data.condition}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-3xl bg-card border shadow-lg p-5 sm:p-6 space-y-4">
      {/* Header & Metric Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-primary" />
            {t.hourlyForecast} (24-Hour Horizon)
          </h3>
          <p className="text-xs text-muted-foreground">
            Atmospheric temperature progression and precipitation probability
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 border text-xs font-semibold">
          <button
            onClick={() => setActiveMetric('temp')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeMetric === 'temp'
                ? 'bg-card text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Temperature
          </button>
          <button
            onClick={() => setActiveMetric('rain')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeMetric === 'rain'
                ? 'bg-card text-sky-400 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Rain Probability
          </button>
          <button
            onClick={() => setActiveMetric('wind')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeMetric === 'wind'
                ? 'bg-card text-teal-400 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Wind Gusts
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284C7" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0284C7" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0D9488" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.15)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={{ stroke: 'rgba(100, 116, 139, 0.2)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Rain Bars */}
            <Bar dataKey="rainProb" fill="url(#rainGradient)" radius={[6, 6, 0, 0]} maxBarSize={28} />

            {/* Temperature Curve */}
            {activeMetric === 'temp' && (
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="#3B82F6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#tempGradient)"
              />
            )}

            {/* Wind Curve */}
            {activeMetric === 'wind' && (
              <Area
                type="monotone"
                dataKey="windSpeed"
                stroke="#0D9488"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#windGradient)"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Horizontal hourly scroll cards for fast mobile overview */}
      <div className="flex gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
        {hourlyForecast.slice(0, 12).map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-between p-3 rounded-2xl bg-accent/40 border min-w-[76px] shrink-0 text-center hover:bg-accent transition-colors"
          >
            <span className="text-[11px] font-medium text-muted-foreground">{item.time}</span>
            <span className="text-sm font-bold text-foreground my-1.5">
              {formatTemp(item.temperature, units.temp)}
            </span>
            <div className="flex items-center gap-1 text-[10px] font-semibold text-sky-400">
              <CloudRain className="w-3 h-3" />
              {item.rainProbability}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
