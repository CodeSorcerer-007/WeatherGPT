from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "WeatherGPT Intelligence Platform API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment mode
    DEMO_MODE: bool = True
    
    # Live External API Keys (Optional with mock fallbacks)
    OPENAI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    IMD_API_KEY: Optional[str] = None
    WEATHER_API_KEY: Optional[str] = None
    MAP_API_KEY: Optional[str] = None
    
    # Database and Caching
    DATABASE_URL: Optional[str] = "sqlite:///./weathergpt.db"
    REDIS_URL: Optional[str] = None

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
