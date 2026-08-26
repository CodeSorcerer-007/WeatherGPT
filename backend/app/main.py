from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.models.schemas import (
    AssistantQueryRequest,
    AssistantQueryResponse,
    LocationInfo,
    WeatherObservation,
    HourlyForecast,
    DailyForecast,
    WeatherAlert,
)
from app.providers.mock_provider import MockWeatherProvider
from app.ai.mock_llm_service import MockLLMService

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="WeatherGPT Grounded Conversational AI Intelligence & Early Warning Platform API (SIH 2026)",
)

# Enable CORS for Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

provider = MockWeatherProvider()
ai_service = MockLLMService()

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "WeatherGPT API",
        "demo_mode": settings.DEMO_MODE,
        "version": settings.VERSION,
    }

@app.post("/api/v1/assistant/query", response_model=AssistantQueryResponse)
async def query_assistant(request: AssistantQueryRequest):
    location = LocationInfo(
        id=request.location_id or "chennai",
        name="Chennai",
        state="Tamil Nadu",
        country="India",
        lat=13.0827,
        lon=80.2707,
    )
    observation = await provider.get_current_observation(location)
    return await ai_service.generate_grounded_response(request, location, observation)

@app.get("/api/v1/weather/current", response_model=WeatherObservation)
async def get_current_weather(location_id: str = "chennai"):
    location = LocationInfo(
        id=location_id,
        name=location_id.capitalize(),
        state="India",
        lat=13.0827,
        lon=80.2707,
    )
    return await provider.get_current_observation(location)

@app.get("/api/v1/weather/forecast", response_model=list[DailyForecast])
async def get_daily_forecast(location_id: str = "chennai"):
    location = LocationInfo(
        id=location_id,
        name=location_id.capitalize(),
        state="India",
        lat=13.0827,
        lon=80.2707,
    )
    return await provider.get_daily_forecast(location)

@app.get("/api/v1/weather/alerts", response_model=list[WeatherAlert])
async def get_alerts(location_id: str = "chennai"):
    location = LocationInfo(
        id=location_id,
        name=location_id.capitalize(),
        state="India",
        lat=13.0827,
        lon=80.2707,
    )
    return await provider.get_active_alerts(location)
