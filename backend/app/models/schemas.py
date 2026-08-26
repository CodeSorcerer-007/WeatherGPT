from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class RiskLevel(str, Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    SEVERE = "SEVERE"
    EXTREME = "EXTREME"

class PersonaType(str, Enum):
    CITIZEN = "citizen"
    FARMER = "farmer"
    DISASTER_MANAGER = "disaster_manager"
    RESEARCHER = "researcher"
    AVIATION = "aviation"
    MARINE = "marine"
    URBAN_PLANNER = "urban_planner"

class LocationInfo(BaseModel):
    id: str
    name: str
    state: str
    country: str = "India"
    lat: float
    lon: float
    elevation: Optional[float] = None
    zone: Optional[str] = None

class WeatherObservation(BaseModel):
    temperature: float
    feels_like: float
    humidity: int
    pressure: int
    wind_speed: float
    wind_direction: int
    wind_direction_text: str
    wind_gust: float
    uv_index: float
    visibility: float
    cloud_cover: int
    rainfall: float
    dew_point: float
    air_quality_index: int
    condition: str
    condition_code: str
    icon: str
    sunrise: str
    sunset: str
    updated_time: str
    is_day: bool = True

class HourlyForecast(BaseModel):
    time: str
    hour: int
    temperature: float
    feels_like: float
    rain_probability: int
    rainfall_amount: float
    condition: str
    icon: str
    wind_speed: float
    wind_direction: int
    humidity: int
    uv_index: float

class DailyForecast(BaseModel):
    date: str
    day_name: str
    temp_max: float
    temp_min: float
    rain_probability: int
    rainfall_amount: float
    condition: str
    icon: str
    wind_speed: float
    humidity: int
    uv_index: float
    sunrise: str
    sunset: str
    summary: str

class WeatherAlert(BaseModel):
    id: str
    title: str
    location_name: str
    state: str
    severity: RiskLevel
    category: str
    description: str
    expected_period: str
    start_time: str
    end_time: str
    potential_risks: List[str]
    recommended_actions: List[str]
    source: str
    confidence: str
    affected_areas: List[str]
    is_active: bool = True

class DataSourceProvenance(BaseModel):
    name: str
    model: Optional[str] = None
    timestamp: str
    type: str
    confidence: str

class StructuredAIAnswer(BaseModel):
    observation: str
    interpretation: str
    risk: Dict[str, Any]
    recommendation: str
    action_steps: List[str]
    quick_stats: Optional[List[Dict[str, Any]]] = None
    why_explanation: Optional[List[str]] = None

class AssistantQueryRequest(BaseModel):
    query: str
    location_id: Optional[str] = "chennai"
    language: Optional[str] = "en"
    persona: Optional[PersonaType] = PersonaType.CITIZEN

class AssistantQueryResponse(BaseModel):
    message_text: str
    structured: StructuredAIAnswer
    sources: List[DataSourceProvenance]
    confidence: str
    intent: str
