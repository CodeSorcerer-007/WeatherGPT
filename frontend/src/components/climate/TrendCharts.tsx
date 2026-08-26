'use client';

import React, { useState } from 'react';
import { ClimateAnalytics } from '@/types';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { TrendingUp, Flame, CloudRain, Thermometer } from 'lucide-react';

interface TrendChartsProps {
  climateData: ClimateAnalytics;
}

export function TrendCharts({ climateData }: TrendChartsProps) {
  const [activeTab, setActiveTab] = useState<'temp' | 'rain' | 'extremes'>('temp');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 rounded-2xl bg-card/95 backdrop-blur-xl border shadow-2xl text-xs space-y-1">
          <div className="font-bold text-foreground">Year {label} Climate Metric</div>
          <div className="text-rose-400 font-semibold">
            Avg Temp: {data.avgTemp}°C (Anomaly: {data.tempAnomaly > 0 ? `+${data.tempAnomaly}` : data.tempAnomaly}°C)
          </div>
          <div className="text-sky-400 font-semibold">
            Annual Rain: {data.annualRainfall} mm ({data.rainfallAnomalyPct > 0 ? `+${data.rainfallAnomalyPct}` : data.rainfallAnomalyPct}%)
          </div>
          <div className="text-amber-400">Extreme Rain Days (&gt;100mm): {data.extremeRainDays} days</div>
          <div className="text-purple-400">Heatwave Days (&gt;40°C): {data.heatwaveDays} days</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-card border shadow-lg space-y-4">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            50-Year Climate Trends (1975–2025)
          </h3>
          <p className="text-xs text-muted-foreground">
            Long-period climatological anomalies from IMD National Climate Centre Pune
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-2xl bg-muted/60 border text-xs font-semibold">
          <button
            onClick={() => setActiveTab('temp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'temp'
                ? 'bg-card text-rose-400 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            Temperature Anomaly
          </button>
          <button
            onClick={() => setActiveTab('rain')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'rain'
                ? 'bg-card text-sky-400 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            Rainfall Shifts
          </button>
          <button
            onClick={() => setActiveTab('extremes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'extremes'
                ? 'bg-card text-amber-400 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Extreme Event Days
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 sm:h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={climateData.dataPoints}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="tempAnomalyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="rainfallGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284C7" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#0284C7" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.15)" vertical={false} />
            <XAxis
              dataKey="year"
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

            {activeTab === 'temp' && (
              <>
                <Area
                  type="monotone"
                  dataKey="avgTemp"
                  name="Mean Surface Temp (°C)"
                  stroke="#F43F5E"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#tempAnomalyGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="tempAnomaly"
                  name="Temp Anomaly vs Baseline (°C)"
                  stroke="#FB923C"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </>
            )}

            {activeTab === 'rain' && (
              <Bar
                dataKey="annualRainfall"
                name="Annual Rainfall (mm)"
                fill="url(#rainfallGradient)"
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
              />
            )}

            {activeTab === 'extremes' && (
              <>
                <Bar
                  dataKey="extremeRainDays"
                  name="Extreme Rain Days (>100mm)"
                  fill="#0284C7"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={24}
                />
                <Line
                  type="monotone"
                  dataKey="heatwaveDays"
                  name="Heatwave Days (>40°C)"
                  stroke="#EF4444"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
