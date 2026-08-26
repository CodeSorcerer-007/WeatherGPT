from app.ai.base import LLMService
from app.models.schemas import (
    AssistantQueryRequest,
    AssistantQueryResponse,
    StructuredAIAnswer,
    DataSourceProvenance,
    LocationInfo,
    WeatherObservation,
    RiskLevel,
)

class MockLLMService(LLMService):
    """Deterministic, zero-hallucination grounded AI engine for SIH 2026 hackathon demo."""

    async def generate_grounded_response(
        self,
        request: AssistantQueryRequest,
        location: LocationInfo,
        observation: WeatherObservation,
    ) -> AssistantQueryResponse:
        q = request.query.lower()
        is_tamil = request.language == "ta"
        is_hindi = request.language == "hi"

        if "cyclone" in q or "storm" in q or "flood" in q or "புயல்" in q:
            return AssistantQueryResponse(
                message_text=(
                    f"அவசர புயல் எச்சரிக்கை: தீவிர புயல் மணிக்கு 105 கி.மீ வேகத்தில் நகர்கிறது. {location.name} கரையோர மக்கள் உடனடியாக பாதுகாப்பு முகாம்களுக்கு செல்லவும்."
                    if is_tamil
                    else f"SEVERE CYCLONE ALERT: Tracking North-Northwestwards at 14 km/h with max sustained winds of 105 km/h. High storm surge risk along {location.name} coastal zone. Evacuate low-lying riverbanks immediately."
                ),
                structured=StructuredAIAnswer(
                    observation=f"Central pressure 988 hPa, eye coordinates 12.4°N, 82.2°E. Coastal gusts to {observation.wind_gust} km/h.",
                    interpretation="Thermodynamically energized by high ocean heat content (>30°C SST). Landfall projected on 28 Aug.",
                    risk={"level": RiskLevel.SEVERE, "factors": ["105 km/h gale winds", "1.5m coastal storm surge", "Tree fall hazards"]},
                    recommendation="Activate emergency disaster SOP. Store 72-hour food/water reserves and secure documents.",
                    action_steps=[
                        "Store 20+ liters of potable drinking water per family member",
                        "Disconnect ground-floor electrical appliances if water ingress starts",
                        "Fishermen: Total prohibition from venturing into Bay of Bengal",
                    ],
                    quick_stats=[
                        {"label": "Intensity", "value": "Severe Cyclonic Storm"},
                        {"label": "Wind Speed", "value": "105 km/h"},
                        {"label": "Pressure", "value": "988 hPa"},
                    ],
                    why_explanation=[
                        "Multi-model ensemble (IMD, ECMWF, GFS) tracks convergence toward AP/TN coast.",
                        "Doppler radar reflectivity shows heavy rainbands approaching.",
                    ],
                ),
                sources=[
                    DataSourceProvenance(name="IMD National Cyclone Warning Centre", model="RSMC New Delhi", timestamp="15 mins ago", type="Official Bulletin", confidence="High"),
                    DataSourceProvenance(name="ECMWF Integrated Forecasting System", model="IFS HRES 9km", timestamp="1 hour ago", type="Numerical Model", confidence="High"),
                ],
                confidence="High",
                intent="Emergency Disaster Decision Support",
            )

        if "paddy" in q or "cotton" in q or "irrigate" in q or "spray" in q or "பாசனம்" in q:
            return AssistantQueryResponse(
                message_text=(
                    f"{location.name}-ல் அடுத்த 48 மணி நேரத்தில் கனமழை எதிர்பார்க்கப்படுவதால், பாசனத்தை உடனே தள்ளிவைக்கவும். பலத்த காற்று காரணமாக மருந்து தெளிப்பதை தவிர்க்கவும்."
                    if is_tamil
                    else f"Agricultural Advisory for {location.name}: Suspend field irrigation for the next 48 hours as substantial rain is forecast. Do not spray agrochemicals due to high wash-off risk (>80% rain chance) and wind gusts ({observation.wind_gust} km/h)."
                ),
                structured=StructuredAIAnswer(
                    observation=f"Air temp: {observation.temperature}°C, humidity: {observation.humidity}%, wind: {observation.wind_speed} km/h.",
                    interpretation="Soil moisture saturation is high. Overcast humidity favors bacterial blight and fungal spore proliferation.",
                    risk={"level": RiskLevel.HIGH, "factors": ["Standing water root hypoxia", "Chemical wash-off financial loss", "Fungal disease"]},
                    recommendation="Suspend irrigation and foliar sprays. Clear field drainage bunds.",
                    action_steps=[
                        "Open bund drains to discharge standing rainwater",
                        "Postpone chemical spraying until Thursday morning dry window",
                        "Apply Pseudomonas fluorescens (0.2%) after rain ceases",
                    ],
                    quick_stats=[
                        {"label": "Irrigation", "value": "Delay / Drain"},
                        {"label": "Spray Suitability", "value": "Unsuitable (Wind/Rain)"},
                    ],
                    why_explanation=[
                        f"Wind speed ({observation.wind_speed} km/h) exceeds safe spraying threshold (15 km/h).",
                        "Precipitation probability within 6 hours of application exceeds 70%.",
                    ],
                ),
                sources=[
                    DataSourceProvenance(name="Gramin Krishi Mausam Sewa (GKMS) - IMD", model="Agro-Met Bulletin", timestamp="06:00 IST Today", type="Official Bulletin", confidence="High"),
                ],
                confidence="High",
                intent="Agricultural Weather Advisory",
            )

        # General forecast
        return AssistantQueryResponse(
            message_text=(
                f"{location.name}-ல் நாளை பிற்பகல் 2 மணி முதல் இரவு 7 மணி வரை இடிமின்னலுடன் கனமழை பெய்ய வாய்ப்புள்ளது ({observation.condition}). சுரங்கப்பாதை பயணங்களை தவிர்க்கவும்."
                if is_tamil
                else f"Heavy convective rainfall is expected in {location.name} tomorrow between 2:00 PM and 7:30 PM with peak probability of 85%. Avoid commuting through low-lying arterial underpasses during peak convective window."
            ),
            structured=StructuredAIAnswer(
                observation=f"Temperature {observation.temperature}°C (Feels like {observation.feels_like}°C), humidity {observation.humidity}%, pressure {observation.pressure} hPa.",
                interpretation="Active boundary layer convergence over coastal plain is triggering convective thunderstorm cells.",
                risk={"level": RiskLevel.HIGH, "factors": ["Convective cloud burst", "Urban waterlogging", "Wind squalls > 38 km/h"]},
                recommendation="Plan indoor activities during afternoon storm peak. Keep emergency power banks charged.",
                action_steps=[
                    "Avoid driving through low-lying arterial underpasses during 2 PM - 7 PM",
                    "Residents in chronic flood hotspots should safeguard ground floor electronics",
                ],
                quick_stats=[
                    {"label": "Rain Probability", "value": "85%"},
                    {"label": "Expected Rain", "value": "18.4 mm"},
                    {"label": "Peak Window", "value": "2 PM - 7 PM"},
                ],
                why_explanation=[
                    "WRF 3km high-resolution model predicts CAPE > 2200 J/kg.",
                    "Doppler Weather Radar reflectivity shows squall lines forming offshore.",
                ],
            ),
            sources=[
                DataSourceProvenance(name="India Meteorological Department (IMD)", model="WRF 3km High-Res", timestamp="10 mins ago", type="Observation", confidence="High"),
                DataSourceProvenance(name="Global Forecast System (GFS)", model="GFS 0.25°", timestamp="30 mins ago", type="Numerical Model", confidence="High"),
            ],
            confidence="High",
            intent="Precipitation & Forecast Advisory",
        )
