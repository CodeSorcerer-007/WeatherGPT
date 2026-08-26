# WeatherGPT: Real Meteorological Provider Integration Guide

This guide explains how to connect live meteorological feeds from the **India Meteorological Department (IMD)**, **Global Forecast System (GFS)**, **Weather Research and Forecasting (WRF)** models, and satellite telemetry into WeatherGPT without modifying frontend UI components.

---

## 1. Architecture Abstraction

WeatherGPT is designed using the **Adapter Pattern**. The frontend consumes standardized JSON schemas (`WeatherObservation`, `HourlyForecast`, `DailyForecast`, `WeatherAlert`) exposed by the API Gateway.

```text
                  Frontend (Next.js)
                          │
                   Unified API Gateway
                          │
          ┌───────────────┴───────────────┐
   Weather Provider Router        AI Reasoning Engine
          │                               │
   ┌──────┴──────┐                 ┌──────┴──────┐
 IMD    GFS    Live API          Gemini  OpenAI  Mock
Adapter Adapter Adapter         Adapter Adapter LLM
```

---

## 2. Connecting IMD Gridded / Station Data

### Step 1: Obtain Credentials
Acquire API access credentials from IMD's National Data Centre (NDC) Pune / IMD API Gateway:
- `IMD_API_KEY`: API access token
- Base URL: `https://ndc.imd.gov.in/api/v1/`

### Step 2: Implement Adapter in Backend
In `backend/app/providers/imd_provider.py`:
```python
import httpx
from app.providers.base import WeatherDataProvider
from app.models.schemas import LocationInfo, WeatherObservation

class IMDProvider(WeatherDataProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://ndc.imd.gov.in/api/v1"

    async def get_current_observation(self, location: LocationInfo) -> WeatherObservation:
        headers = {"Authorization": f"Bearer {self.api_key}"}
        params = {"lat": location.lat, "lon": location.lon}
        async with httpx.AsyncClient() as client:
            res = await client.get(f"{self.base_url}/station/observation", params=params, headers=headers)
            res.raise_for_status()
            data = res.json()
            
            # Map IMD station parameters into WeatherGPT schema
            return WeatherObservation(
                temperature=data["temp_c"],
                feels_like=data["apparent_temp_c"],
                humidity=data["rh_pct"],
                pressure=data["mslp_hpa"],
                wind_speed=data["wind_speed_kmh"],
                wind_direction=data["wind_dir_deg"],
                wind_direction_text=data["wind_dir_cardinal"],
                wind_gust=data["wind_gust_kmh"],
                uv_index=data.get("uv_index", 5.0),
                visibility=data["visibility_km"],
                cloud_cover=data["cloud_oktas"] * 12.5,
                rainfall=data["rain_24h_mm"],
                dew_point=data["dewpoint_c"],
                air_quality_index=data.get("cpcb_aqi", 50),
                condition=data["weather_description"],
                condition_code=data["weather_code"],
                icon="CloudRain" if data["rain_24h_mm"] > 0 else "Sun",
                sunrise=data["sunrise_ist"],
                sunset=data["sunset_ist"],
                updated_time="IMD Station Observation (Live)",
                is_day=True
            )
```

---

## 3. Connecting Numerical Weather Prediction (NWP) Models (GFS / WRF)

For GFS GRIB2 datasets from NOAA/NCEP or NCMRWF:
1. Use `cfgrib` / `xarray` to slice bounding boxes for the Indian subcontinent (`lat: 6°N - 38°N, lon: 68°E - 98°E`).
2. Extract convective parameters:
   - Convective Available Potential Energy (`CAPE`)
   - Storm Relative Helicity (`SRH`)
   - 3-hour Accumulated Precipitation (`APCP`)
3. Feed these directly into `backend/app/ai/explainability.py` to substantiate AI recommendations.

---

## 4. Enabling Live Gemini / OpenAI Providers

Set your environment variables in `.env`:
```bash
GEMINI_API_KEY="AIzaSy..."
OPENAI_API_KEY="sk-..."
```
In `backend/app/main.py`, replace `MockLLMService()` with `GeminiService(api_key=settings.GEMINI_API_KEY)`.
