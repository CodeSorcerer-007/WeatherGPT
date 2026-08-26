from abc import ABC, abstractmethod
from app.models.schemas import LocationInfo, WeatherObservation, HourlyForecast, DailyForecast, WeatherAlert
from typing import List

class WeatherDataProvider(ABC):
    """Abstract base class for all meteorological data providers (IMD, GFS, WRF, Open-Meteo, Mock)"""

    @abstractmethod
    async def get_current_observation(self, location: LocationInfo) -> WeatherObservation:
        pass

    @abstractmethod
    async def get_hourly_forecast(self, location: LocationInfo) -> List[HourlyForecast]:
        pass

    @abstractmethod
    async def get_daily_forecast(self, location: LocationInfo) -> List[DailyForecast]:
        pass

    @abstractmethod
    async def get_active_alerts(self, location: LocationInfo) -> List[WeatherAlert]:
        pass
