# Smart India Hackathon (SIH 2026) — WeatherGPT Demonstration Guide

This guide outlines the recommended demonstration flow to maximize judge scoring for the Smart India Hackathon 2026 final evaluation.

---

## Key Judging Criteria & Where WeatherGPT Shines

| Hackathon Criterion | WeatherGPT Demonstration Feature |
|---|---|
| **Novelty & Innovation** | Conversational AI grounded in meteorological telemetry; transforms numbers into "Observation → Interpretation → Risk → Recommendation → Action". |
| **User Experience & Accessibility** | 9 Indian languages, full voice UI (STT & TTS), high-contrast accessibility mode, persona tailoring. |
| **Technical Architecture** | Modular provider adapters (IMD, GFS, WRF, Open-Meteo), zero-hallucination explainable AI engine, GIS Leaflet map with animated radar loops. |
| **Disaster & Rural Impact** | Direct "What should I do?" decision trees, crop spraying & irrigation advisory, active cyclone landfall tracking. |
| **Reliability (Demo Mode)** | Centralized synthetic meteorological dataset ensures 100% offline demonstration reliability without API limit failures. |

---

## 3-Minute Live Judging Script

### Minute 1: The Problem & Grounded Conversational AI
1. Open `http://localhost:3000`. Show the hero screen and point out that WeatherGPT is not a plain weather website or generic ChatGPT wrapper.
2. Ask in natural language: **"Will heavy rain affect Chennai tomorrow?"**
3. Highlight the structured response:
   - Observation
   - Risk Level (Severe / High)
   - Actionable Next Steps (Low-lying subways to avoid, electronic safeguards)
   - Scientific Provenance (IMD Doppler Radar, GFS 0.25°, confidence level)
   - Click **"Why this advice?"** to showcase Explainable AI.

### Minute 2: Multilingual Voice UI & Disaster Decision Support
1. Switch language to **Tamil (தமிழ்)** or **Hindi (हिन्दी)** using the top language switcher.
2. Tap the microphone icon or play audio: demonstrate that WeatherGPT renders localized agro-met & disaster terminology naturally.
3. Type / Ask: **"What should I do?"**
4. Navigate to `/alerts`: show the active **Cyclone Michaung** landfall trajectory, cone of uncertainty, and role-specific disaster safety SOPs with one-tap emergency SOS helplines (NDRF 1078, SEOC 1070).

### Minute 3: Agriculture Mode, GIS Map, & 50-Year Climate Trends
1. Switch persona to **Farmer**: Navigate to `/agriculture`. Show Paddy vs Cotton crop growth stage, water drainage recommendations, and the Chemical Spray Suitability Gauge (wind speed limit & rain wash-off calculation).
2. Navigate to `/map`: Show interactive GIS layers (Doppler Radar simulation, wind streamlines, cyclone path, urban flood inundation zones) and play the time-scrubbing forecast loop.
3. Navigate to `/climate`: Showcase 50-year (1975–2025) decadal trends, warming anomalies (+1.2°C), and the +64% surge in extreme precipitation days.
