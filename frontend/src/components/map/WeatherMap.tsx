'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useWeather } from '@/context/WeatherContext';
import { useAccessibility } from '@/context/AccessibilityContext';
import { formatTemp } from '@/lib/units';
import { INDIAN_LOCATIONS, MOCK_CYCLONE_DATA } from '@/lib/mockData';
import { MapLayerType, LayerControls } from './LayerControls';
import { TimeScrubber } from './TimeScrubber';
import { MapLegend } from './MapLegend';
import { MapPin, Maximize2, RotateCcw, Sparkles } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export function WeatherMap() {
  const { currentLocation, setCurrentLocation, observation } = useWeather();
  const { units } = useAccessibility();

  const [activeLayer, setActiveLayer] = useState<MapLayerType>('radar');
  const [showCycloneOverlay, setShowCycloneOverlay] = useState<boolean>(true);
  const [showFloodOverlay, setShowFloodOverlay] = useState<boolean>(true);
  const [timeOffset, setTimeOffset] = useState<number>(0);
  const [isClient, setIsClient] = useState<boolean>(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersGroupRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainerRef.current) return;

    let L: any;
    try {
      L = require('leaflet');
    } catch (e) {
      console.warn('Leaflet load failed', e);
      return;
    }

    // Fix leaflet default icon assets
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentLocation.lat, currentLocation.lon],
        zoom: 6,
        zoomControl: false,
      });

      // Dark Matter CartoDB tiles for high-end meteorological styling
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; OpenStreetMap &copy; CARTO &copy; IMD GIS',
          maxZoom: 18,
          subdomains: 'abcd',
        }
      ).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      layersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const layerGroup = layersGroupRef.current;
    layerGroup.clearLayers();

    // 1. Add Weather Station Markers across India
    INDIAN_LOCATIONS.forEach((loc) => {
      const isSelected = loc.id === currentLocation.id;

      const customIcon = L.divIcon({
        className: 'custom-weather-marker',
        html: `
          <div style="
            background: ${isSelected ? '#2563eb' : '#0f172a'};
            color: #ffffff;
            border: 2px solid ${isSelected ? '#60a5fa' : '#38bdf8'};
            padding: 4px 8px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
            cursor: pointer;
          ">
            <span>${loc.name}</span>
            <span style="color: #38bdf8;">${formatTemp(isSelected ? observation.temperature : 29, units.temp)}</span>
          </div>
        `,
        iconSize: [80, 30],
        iconAnchor: [40, 15],
      });

      const marker = L.marker([loc.lat, loc.lon], { icon: customIcon }).addTo(layerGroup);

      marker.on('click', () => {
        setCurrentLocation(loc);
        map.flyTo([loc.lat, loc.lon], 7, { duration: 1.2 });
      });
    });

    // 2. Active Meteorological Simulation Layer (Radar / Temp / Wind)
    if (activeLayer === 'radar') {
      // Simulate radar precipitation convective clusters
      const radarCenters = [
        { lat: 13.2, lon: 80.4, radius: 95000, color: '#0284c7', fill: '#0284c7', opacity: 0.55 },
        { lat: 13.0, lon: 80.1, radius: 45000, color: '#e11d48', fill: '#e11d48', opacity: 0.65 },
        { lat: 19.1, lon: 72.9, radius: 85000, color: '#0284c7', fill: '#0284c7', opacity: 0.5 },
        { lat: 22.5, lon: 88.4, radius: 65000, color: '#0284c7', fill: '#0284c7', opacity: 0.45 },
      ];

      radarCenters.forEach((rc) => {
        L.circle([rc.lat, rc.lon], {
          radius: rc.radius,
          color: rc.color,
          fillColor: rc.fill,
          fillOpacity: rc.opacity,
          weight: 1,
        }).addTo(layerGroup);
      });
    } else if (activeLayer === 'temp') {
      // Heatwave zones in Delhi/North India
      L.circle([28.6, 77.2], {
        radius: 180000,
        color: '#dc2626',
        fillColor: '#dc2626',
        fillOpacity: 0.45,
        weight: 1,
      }).addTo(layerGroup);
    } else if (activeLayer === 'wind') {
      // Wind streamline vectors over Bay of Bengal
      const windArrows = [
        [[11.0, 84.0], [12.5, 82.0]],
        [[12.5, 82.0], [13.8, 80.5]],
        [[14.0, 83.0], [15.2, 81.2]],
      ];
      windArrows.forEach((pts: any) => {
        L.polyline(pts, { color: '#0d9488', weight: 4, opacity: 0.8, dashArray: '8, 8' }).addTo(layerGroup);
      });
    }

    // 3. Cyclone Michaung Trajectory & Cone of Uncertainty
    if (showCycloneOverlay) {
      const cyc = MOCK_CYCLONE_DATA;

      // Draw cone of uncertainty polygon
      L.polygon(cyc.coneOfUncertainty as any, {
        color: '#dc2626',
        fillColor: '#dc2626',
        fillOpacity: 0.2,
        weight: 2,
        dashArray: '5, 5',
      }).addTo(layerGroup);

      // Draw past track (solid red line)
      const pastCoords = cyc.pastTrack.map((p) => [p.lat, p.lon]);
      L.polyline(pastCoords as any, { color: '#ef4444', weight: 4 }).addTo(layerGroup);

      // Draw forecast track (dashed yellow line)
      const forecastCoords = [
        [cyc.pastTrack[cyc.pastTrack.length - 1].lat, cyc.pastTrack[cyc.pastTrack.length - 1].lon],
        ...cyc.forecastTrack.map((f) => [f.lat, f.lon]),
      ];
      L.polyline(forecastCoords as any, {
        color: '#f59e0b',
        weight: 3,
        dashArray: '6, 6',
      }).addTo(layerGroup);

      // Cyclone Eye marker
      const cycloneEyeIcon = L.divIcon({
        className: 'cyclone-eye-marker',
        html: `
          <div style="
            width: 28px;
            height: 28px;
            background: #dc2626;
            border: 3px solid #ffffff;
            border-radius: 9999px;
            box-shadow: 0 0 20px #dc2626;
            animation: spin 3s linear infinite;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 10px;
            font-weight: bold;
          ">
            🌀
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      L.marker(cyc.currentPosition as any, { icon: cycloneEyeIcon })
        .addTo(layerGroup)
        .bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; color: #0f172a;">
            <b style="color: #dc2626;">${cyc.name}</b><br/>
            <b>Position:</b> ${cyc.currentPosition[0]}°N, ${cyc.currentPosition[1]}°E<br/>
            <b>Wind:</b> ${cyc.maxSustainedWind}<br/>
            <b>Pressure:</b> ${cyc.centralPressure}<br/>
            <b>Movement:</b> ${cyc.movementSpeed}
          </div>
        `);
    }

    // 4. Urban Flood Risk Zones
    if (showFloodOverlay) {
      const floodZones = [
        { lat: 12.98, lon: 80.22, name: 'Velachery & Madipakkam Lowlands', risk: 'High Inundation' },
        { lat: 13.01, lon: 80.24, name: 'Adyar River Basin Corridor', risk: 'Severe Flash Flood Risk' },
        { lat: 19.06, lon: 72.88, name: 'Mithi River / Kurla Basin', risk: 'High Inundation' },
      ];

      floodZones.forEach((fz) => {
        L.circle([fz.lat, fz.lon], {
          radius: 4000,
          color: '#e11d48',
          fillColor: '#e11d48',
          fillOpacity: 0.45,
          weight: 2,
        })
          .addTo(layerGroup)
          .bindPopup(`<b>${fz.name}</b><br/><span style="color:red;">${fz.risk}</span>`);
      });
    }

    // Recenter smoothly when location changes
    map.flyTo([currentLocation.lat, currentLocation.lon], map.getZoom() || 6, {
      duration: 1.0,
    });
  }, [
    isClient,
    currentLocation.id,
    activeLayer,
    showCycloneOverlay,
    showFloodOverlay,
    timeOffset,
    units.temp,
  ]);

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[500px] rounded-3xl overflow-hidden border shadow-2xl bg-slate-950">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Left Floating Layer Controls */}
      <div className="absolute top-4 left-4 z-20">
        <LayerControls
          activeLayer={activeLayer}
          setActiveLayer={setActiveLayer}
          showCycloneOverlay={showCycloneOverlay}
          setShowCycloneOverlay={setShowCycloneOverlay}
          showFloodOverlay={showFloodOverlay}
          setShowFloodOverlay={setShowFloodOverlay}
        />
      </div>

      {/* Top Right Legend */}
      <div className="absolute top-4 right-16 z-20 hidden md:block">
        <MapLegend activeLayer={activeLayer} />
      </div>

      {/* Bottom Center Time Horizon Scrubber */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-4 w-full max-w-xl flex justify-center">
        <TimeScrubber timeOffset={timeOffset} setTimeOffset={setTimeOffset} />
      </div>
    </div>
  );
}
