# WeatherGPT — Conversational AI Weather Intelligence & Early Warning Platform

![WeatherGPT Banner](https://img.shields.io/badge/WeatherGPT-SIH%202026%20Finalist-blue?style=for-the-badge&logo=react)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)
![OpenAI Whisper](https://img.shields.io/badge/OpenAI%20Whisper-Neural%20Voice%20AI-10a37f?style=for-the-badge&logo=openai)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi)

WeatherGPT is a production-grade, conversational AI meteorological intelligence and disaster-awareness platform built for the **Smart India Hackathon (SIH 2026)**. 

Unlike traditional weather apps that only show numbers or generic LLM chatbots that hallucinate forecast values, WeatherGPT grounds every insight in real meteorological data (IMD, GFS, WRF, Satellite) and delivers structured intelligence following:

$$\text{Observation} \longrightarrow \text{Interpretation} \longrightarrow \text{Risk Assessment} \longrightarrow \text{Recommendation} \longrightarrow \text{Actionable Steps}$$

---

## 🌟 Key Features

### 1. 🎙️ OpenAI Whisper Neural Voice AI & 9 Indian Languages (Speech-to-Ask)
- **Zero-Language-Barrier Voice Interaction**: Speak natural meteorological and farming questions in your mother tongue and receive grounded spoken responses.
- **9 Supported Indian Languages**:
  1. **English** (`en-IN`)
  2. **Tamil (தமிழ்)** (`ta-IN`)
  3. **Hindi (हिन्दी)** (`hi-IN`)
  4. **Telugu (తెలుగు)** (`te-IN`)
  5. **Malayalam (മലയാളം)** (`ml-IN`)
  6. **Kannada (ಕನ್ನಡ)** (`kn-IN`)
  7. **Bengali (বাংলা)** (`bn-IN`)
  8. **Marathi (मराठी)** (`mr-IN`)
  9. **Gujarati (ગુજરાતી)** (`gu-IN`)
- **Dual Speech Recognition Engines**:
  - **Whisper Neural Engine (Primary)**: Uses `MediaRecorder` & Web Audio `AnalyserNode` to record audio, renders real-time animated frequency visualizers, and transcribes via `/api/assistant/transcribe` with meteorological prompt biasing (`"IMD, cyclone alert, monsoon, agriculture spraying..."`).
  - **Browser Web Speech Engine (Streaming Alternative)**: Real-time interim streaming transcription with BCP 47 locale mapping.
- **Dedicated Voice Search Modal**: Spatial glassmorphic popup accessible from the Header and Home search bar with 9-language tabs, live pulsating microphone visualizers, editable transcript area, and localized prompt chips.
- **Text-to-Speech (TTS) Read Aloud**: Every assistant insight can be read aloud in matching regional voices with live animated waveform indicators.
- **Voice Settings & Diagnostics**: Preview and test voice synthesis in all 9 languages, adjust speech rate/pitch, and switch default speech engines in `/settings`.

---

### 2. 🧠 Grounded Conversational AI & Explainability
- Natural language queries (e.g., *"Will heavy rain affect Chennai tomorrow?"*, *"Should I irrigate my paddy field today?"*, *"Is there any cyclone approaching Gujarat?"*).
- Zero hallucination with verified data provenance (IMD, GFS, ECMWF, INSAT-3D) and confidence ratings.
- Explainable AI with **"Why this advice?"** scientific rationale.

---

### 3. 🗺️ Interactive GIS Weather Map
- Leaflet / MapLibre multi-layer map with Doppler Radar simulations, wind streamlines, temperature heatmaps, and cloud cover.
- **Active Cyclone Trajectory Tracker** (past track, forecast trajectory, and 72-hour cone of uncertainty).
- **Urban Flood Inundation Hotspots** (e.g. Adyar / Mithi River basins).
- Time-scrubbing slider with animated forecast loop (-6h to +48h).

---

### 4. 🚨 Emergency Decision Support & Alert Center
- Multi-tier alert classification: `LOW`, `MODERATE`, `HIGH`, `SEVERE`, `EXTREME`.
- **"What Should I Do?" Decision Guide** with customized checklists for Citizens, Low-lying Residents, Farmers, and Fisherfolk.
- 1-click emergency SOS helpline dialers (NDRF 1078, SEOC 1070, Ambulance 108).

---

### 5. 🌾 Agriculture Intelligence (Gramin Krishi Mausam)
- Crop selection (Paddy, Cotton, Wheat, Sugarcane) and phenological growth stage modeling.
- Actionable irrigation scheduling (Apply, Delay, Maintain, Drain).
- Chemical spray suitability gauge with wind drift (<15 km/h) and rain wash-off calculation.
- Weather-driven pest and disease risk predictions (Bacterial leaf blight, pink bollworm, yellow rust).

---

### 6. 📈 50-Year Climate Trends (1975–2025)
- Interactive Recharts visualizing decadal surface warming (+1.2°C anomaly), monsoon shifts, and extreme downpour frequencies (>100mm/day).

---

### 7. 👤 Multi-Sector Persona Adaptability
- Switch personas: Citizen, Farmer, Disaster Manager, Climate Researcher, Aviation, Marine/Fisherfolk, Urban Planner.

---

### 8. ⚡ Demo Mode vs Live APIs
- Out-of-the-box realistic synthetic dataset for 25+ Indian stations ensures 100% offline demonstration reliability.
- Instant toggle to live Open-Meteo & IMD APIs.

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **npm**: v9+

### 1. Install & Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 2. (Optional) Run FastAPI Python Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API Documentation will be available at **`http://localhost:8000/docs`**.

---

## 🐳 Docker Deployment

To launch both frontend and backend using Docker Compose:
```bash
docker-compose -f docker/docker-compose.yml up --build
```

---

## 📁 Repository Structure

```text
WeatherGPT/
├── frontend/                     # Next.js 14+ TypeScript React Application
│   ├── src/
│   │   ├── app/                  # App Router Pages & API route handlers
│   │   │   ├── page.tsx          # Landing / Hero, Voice Search & Quick Prompts
│   │   │   ├── dashboard/        # Full Telemetry Dashboard
│   │   │   ├── assistant/        # Grounded AI Chat with Whisper Voice
│   │   │   ├── map/              # GIS Interactive Map
│   │   │   ├── alerts/           # Alert & Disaster Support Center
│   │   │   ├── agriculture/      # Agro-Met Advisory Mode
│   │   │   ├── climate/          # 50-Year Trends
│   │   │   ├── compare/          # Multi-City Comparison
│   │   │   ├── locations/        # Saved Stations
│   │   │   ├── notifications/    # Alert Subscriptions
│   │   │   ├── settings/         # Voice & Speech Settings, Preferences & Accessibility
│   │   │   └── api/              # Standalone Next.js API Routes
│   │   │       ├── assistant/
│   │   │       │   ├── query/        # Grounded AI Query Route
│   │   │       │   └── transcribe/   # OpenAI Whisper Neural Speech-to-Text Route
│   │   │       ├── weather/
│   │   │       ├── agriculture/
│   │   │       ├── climate/
│   │   │       └── locations/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── assistant/        # VoiceSearchModal, ChatInterface, MessageBubble, VoiceVisualizer
│   │   │   ├── layout/           # Header (Global Voice Search), Sidebar, MobileNav
│   │   │   ├── dashboard/
│   │   │   ├── map/
│   │   │   ├── alerts/
│   │   │   └── agriculture/
│   │   ├── context/              # Weather, Language, Persona, Accessibility contexts
│   │   ├── lib/                  # Whisper/WebSpeech utils, AI Engine, Translations, Mock Data
│   │   └── types/                # TypeScript Interfaces
│   └── package.json
│
├── backend/                      # FastAPI Python Modular Backend
│   ├── app/
│   │   ├── main.py               # FastAPI entrypoint
│   │   ├── core/                 # Config & Security
│   │   ├── models/               # Pydantic Schemas
│   │   ├── providers/            # IMD, GFS, Open-Meteo & Mock Adapters
│   │   └── ai/                   # Grounded LLM reasoning & Explainability
│   └── requirements.txt
│
├── docker/                       # Docker & Compose Configurations
├── docs/                         # Architecture & Presentation Guides
│   ├── PROVIDER_INTEGRATION_GUIDE.md
│   └── SIH_2026_PRESENTATION_GUIDE.md
├── .env.example
├── ABSTRACT.txt
└── README.md
```

---

## 🏆 Smart India Hackathon (SIH 2026) Demonstration

For a guided 3-minute judging script and test scenarios, please consult **[`docs/SIH_2026_PRESENTATION_GUIDE.md`](./docs/SIH_2026_PRESENTATION_GUIDE.md)**.
