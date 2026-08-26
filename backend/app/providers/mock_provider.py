from app.providers.base import WeatherDataProvider
from app.models.schemas import (
    LocationInfo,
    WeatherObservation,
    HourlyForecast,
    DailyForecast,
    WeatherAlert,
    RiskLevel,
)
from typing import List

class MockWeatherProvider(WeatherDataProvider):
    """Realistic synthetic meteorological data provider for offline hackathon demonstration."""

    async def get_current_observation(self, location: LocationInfo) -> WeatherObservation:
        return WeatherObservation(
            temperature=31.4,
            feels_like=37.8,
            humidity=82,
            pressure=1008,
            wind_speed=24.5,
            wind_direction=75,
            wind_direction_text="ENE",
            wind_gust=38.0,
            uv_index=7.2,
            visibility=6.5,
            cloud_cover=78,
            rainfall=18.4,
            dew_point=26.1,
            air_quality_index=68,
            condition="Heavy Thunderstorms Likely",
            condition_code="thunderstorm-rain",
            icon="CloudRain",
            sunrise="05:58 AM",
            sunset="06:22 PM",
            updated_time="Just now (10 mins ago)",
            is_day=True,
        )

    async def get_hourly_forecast(self, location: LocationInfo) -> List[HourlyForecast]:
        hours = []
        for i in range(24):
            hours.append(
                HourlyForecast(
                    time=f"{i % 12 or 12} {'AM' if i < 12 else 'PM'}",
                    hour=i,
                    temperature=28.0 + (4.0 if 10 <= i <= 16 else 0.0),
                    feels_like=32.0,
                    rain_probability=85 if 14 <= i <= 20 else 30,
                    rainfall_amount=12.0 if 14 <= i <= 20 else 1.0,
                    condition="Heavy Rain" if 14 <= i <= 20 else "Partly Cloudy",
                    icon="CloudRain" if 14 <= i <= 20 else "CloudSun",
                    wind_speed=22.0,
                    wind_direction=80,
                    humidity=80,
                    uv_index=6.0 if 10 <= i <= 15 else 0.0,
                )
            )
        return hours

    async def get_daily_forecast(self, location: LocationInfo) -> List[DailyForecast]:
        days = ["Today", "Tomorrow", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        return [
            DailyForecast(
                date=f"Day {i+1}",
                day_name=days[i],
                temp_max=32.0,
                temp_min=26.0,
                rain_probability=90 if i <= 1 else 40,
                rainfall_amount=80.0 if i <= 1 else 10.0,
                condition="Heavy Thunderstorms" if i <= 1 else "Partly Cloudy",
                icon="CloudLightning" if i <= 1 else "CloudSun",
                wind_speed=24.0,
                humidity=82,
                uv_index=6.0,
                sunrise="05:58 AM",
                sunset="06:22 PM",
                summary="Convective squalls expected with urban waterlogging risk.",
            )
            for i in range(7)
        ]

    async def get_active_alerts(self, location: LocationInfo) -> List[WeatherAlert]:
        return [
            WeatherAlert(
                id="alt-chn-01",
                title="SEVERE THUNDERSTORM & HEAVY RAINFALL WARNING",
                location_name="Chennai & Coastal Tamil Nadu",
                state="Tamil Nadu",
                severity=RiskLevel.SEVERE,
                category="rain",
                description="Active low-pressure trough over SW Bay of Bengal. Convective rainfall (120-180mm) with gusts up to 55 km/h.",
                expected_period="2:00 PM - 11:30 PM Today",
                start_time="2026-08-27T14:00:00+05:30",
                end_time="2026-08-27T23:30:00+05:30",
                potential_risks=[
                    "Severe urban waterlogging in low-lying subways",
                    "Flash flooding in Adyar and Cooum catchments",
                ],
                recommended_actions=[
                    "Avoid non-essential outdoor travel during peak convective window",
                    "Fishermen ban on venturing into SW Bay of Bengal",
                ],
                source="India Meteorological Department (IMD)",
                confidence="High",
                affected_areas=["Chennai Urban", "Tambaram", "Tiruvallur", "Kanchipuram"],
                is_active=True,
            )
        ]
