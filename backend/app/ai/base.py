from abc import ABC, abstractmethod
from app.models.schemas import AssistantQueryRequest, AssistantQueryResponse, LocationInfo, WeatherObservation

class LLMService(ABC):
    """Abstract interface for LLM AI services (Gemini, OpenAI, Mock LLM)."""

    @abstractmethod
    async def generate_grounded_response(
        self,
        request: AssistantQueryRequest,
        location: LocationInfo,
        observation: WeatherObservation,
    ) -> AssistantQueryResponse:
        pass
